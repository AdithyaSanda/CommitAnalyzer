import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, Position, useEdgesState, useNodesState, useReactFlow, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import SideBar from "./components/SideBar";
import {jwtDecode} from 'jwt-decode'
import HistoryBar from './components/HistoryBar'
import HistoryContext from "./HistroryContext";


function FlowContent({owner, repo, url, updateUrl, page, setPage, setLoading, fromRefresh}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [oldData, setOldData] = useState([])
  const {setViewport, fitView} = useReactFlow()
  const [sideNode, setSideNode] = useState(null)
  const [prevId, setPrevId] = useState()
  const [prevOwner, setPrevOwner] = useState()
  const [prevRepo, setPrevRepo] = useState()
  const [sideBarOpen, setSideBarOpen] = useState(false)

  const {setHistory} = useContext(HistoryContext)

  const lastSavedRef = useRef(null)
  const isHydratedRef = useRef(true)

  const handleChildData = useCallback((id) => {
    setPrevId(id)
  }, [])

  

  useEffect(() => {
    const getRepo = async () => {

      if(!prevId) return

      if(prevId === 'clear') {
        setNodes([])
        setEdges([])
        updateUrl(null)
        setPrevId(null)
        setPrevOwner(null)
        setPrevRepo(null)
        return
      }

      const response = await axios.get(`http://localhost:5000/history/item/${prevId}`)
      const url = new URL(response.data.repoUrl)  
      const pathParts = url.pathname.split('/')
      updateUrl(url)
      setPrevOwner(pathParts[1])
      setPrevRepo(pathParts[2])
      setNodes(response.data.nodes)
      setEdges(response.data.edges)
      setPrevId(null)

      setTimeout(() => {
        setViewport({x: 600, y: 200, zoom: 1.2, duration: 800})
      }, 200)

    }

    getRepo()
  }, [prevId])

  useEffect(() => {
    if(!owner || !repo) return

    setPage(1)
    setOldData([])

  }, [owner, repo, prevOwner, prevRepo])

  useEffect(() => {
    const activeOwner = prevOwner ?? owner
    const activeRepo = prevRepo ?? repo
    if(!activeOwner || !activeRepo) return

    const fetchData = async () => { 
      
      setLoading(true)

      const res = await axios.post(`http://localhost:5000/api/getGraph`, {owner: activeOwner, repo: activeRepo, page})
      const data = res.data.commits
      if(data.length === 0) return
      
      setOldData(prev => {
        const merged = [...prev, ...data]

        const newData = [...data].reverse().map((item) => ({
          id: item.sha,
          label: item.sha.slice(-5),
          parentIds: item.parents?.map((it) => it.sha) 
        })) 

        const newNodes = nodeLayout(newData, activeOwner, activeRepo)
      
        const newEdges = newData.flatMap((commit) => 
          commit.parentIds.map((pid) => ({
            id: `e-${pid}-${commit.id}`,
            source: pid,
            target: commit.id,
          }))
        )

        setNodes(newNodes)
        setEdges(newEdges)


        return merged
      })

      setTimeout(() => {
        setViewport({x: 600, y: 200, zoom: 1.2, duration: 800})
      }, 200)

      localStorage.setItem('repo-info', JSON.stringify({owner, repo}))
      
        
    }

    fetchData()
    setLoading(false)
    
  }, [owner, repo, page])


  useEffect(() => {
    const updateDb = async () => {
      if(isHydratedRef.current) return
      if(!url || !owner || !repo) return

      const repoKey = `${owner}/${repo}`

      if(lastSavedRef.current === repoKey) return
      if(nodes.length === 0) return

      lastSavedRef.current = repoKey

      const token = localStorage.getItem('token')
      const user = jwtDecode(token)
      const userId = user.id
      
      const response = await axios.post('http://localhost:5000/history/addRepo', {userId:userId, repoUrl:url, nodes:nodes, edges:edges})
      const Url = new URL(url)
      const pathParts = Url.pathname.split('/')
      const newItem = {id: response.data.repo._id, url: pathParts[1] + '/' + pathParts[2]}
      setHistory(prev => [newItem, ...prev])

      

    }

    if(!fromRefresh) {
      updateDb()
    }
    
  }, [owner, repo, nodes])

  useEffect(() => {
    if(nodes?.length === 0 || edges?.length === 0) return

    localStorage.setItem('graph-state', JSON.stringify({nodes, edges, owner, repo, url}))
  }, [nodes, edges])  

  useEffect(() => {
    const saved = localStorage.getItem('graph-state')
    if(saved) {
      const {nodes, edges, owner, repo, url} = JSON.parse(saved)
      setNodes(nodes)
      setEdges(edges)
      setPrevOwner(owner)
      setPrevRepo(repo)
      updateUrl(url)
    }

    isHydratedRef.current = false
    
  }, [])
  
  const branchMapping = (commits) => {

    if(!commits) return

    const branchMap = {}
    const roots = commits.filter(c => !c.parentIds || c.parentIds.length === 0)
    roots.forEach(root => branchMap[root.id] = 0)

    commits.forEach(commit => {
      if(commit.parentIds && commit.parentIds.length > 0) {
        const parentLevels = commit.parentIds
          .map(pid => branchMap[pid])
          .filter(l => l !== undefined)

        if(parentLevels.length > 0) {
          branchMap[commit.id] = Math.min(...parentLevels) + 1
        }
        else {
          branchMap[commit.id] = 0
        }
      }
    })

    return branchMap

  }

  const nodeLayout = (commits, owner, repo) => {

    if(!commits) return

    const branchMap = branchMapping(commits)

    return commits.map((commit, i) => ({
      id: commit.id,
      data: {label: commit.label, owner, repo},
      position: {x: branchMap[commit.id] * 250, y: i * 120},
      style: {background: "#282828", color: "whitesmoke", border: "2px solid whitesmoke", borderRadius: "50%", width: "70px", height: "70px", paddingTop: "25px", cursor: "pointer"}
    }))
  }

  const onInit = (reactFlowInstance) => {
    reactFlowInstance.setViewport(
      {x:600, y:200, zoom: 1.2},
      {duration: 800}
    )
  }
  

  return (
    <>
      <ReactFlow 
      className="myFlow"
          nodes={nodes} 
          edges={edges} 
          fitView 
          nodesDraggable={true}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          style={{background: "#181818"}}
          onNodeClick={(e, node) => {
            e.stopPropagation()
            setSideNode(node)
            setSideBarOpen(true)
          }}
          onPaneClick={() =>{ 
            setSideNode(null)
            setSideBarOpen(false)
          }}
          onInit={onInit}
        >

        <Background />
        <MiniMap style={{background: "#232323"}} maskColor="rgba(86, 86, 86, 0.5)"/>
      </ReactFlow>
      <SideBar open={sideBarOpen} commit={sideNode}/>
      <HistoryBar onSend={handleChildData}/>
    </>
  )
}




export default function Tree({owner, repo, url, updateUrl, page, setPage, setLoading, fromRefresh}) {

  
  
  
  return (
    <div style={{ width: "100vw", height: "100vh"}}>
      <ReactFlowProvider>
        <FlowContent owner={owner} repo={repo} url={url} updateUrl={updateUrl} page={page} setPage={setPage} setLoading={setLoading} fromRefresh={fromRefresh}/>
      </ReactFlowProvider>
      
    </div>
  );
}
