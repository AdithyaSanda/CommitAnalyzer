import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, Position, useEdgesState, useNodesState, useReactFlow, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

function FlowContent({owner, repo}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const {setViewport, fitView} = useReactFlow()

  useEffect(() => {
    if(!owner || !repo) return

    const fetchData = async () => {
      // const res = await fetch(`https://api.github.com/repos/vercel/next.js/commits`)
      // const dat = await res.json()
      // console.log(dat)

      

      const res = await axios.post(`http://localhost:5000/api/getGraph`, {owner, repo})
      const data = res.data.commits
      // const data = await res.json()

      const newData = [...data].reverse().map((item) => ({
        id: item.sha,
        label: item.sha.slice(-5),
        parentIds: item.parents?.map((it) => it.sha) 
      }))



      const newNodes = nodeLayout(newData)
      
      const newEdges = newData.flatMap((commit) => 
        commit.parentIds.map((pid) => ({
          id: `e-${pid}-${commit.id}`,
          source: pid,
          target: commit.id,
        }))
      )

      
      
      setNodes(newNodes)
      setEdges(newEdges)


      setTimeout(() => {
        setViewport({x: 600, y: 200, zoom: 1.3, duration: 800})
      }, 200)
    }

    fetchData()
  }, [owner, repo])

  const branchMapping = (commits) => {
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

  const nodeLayout = (commits) => {
    const branchMap = branchMapping(commits)

    return commits.map((commit, i) => ({
      id: commit.id,
      data: {label: commit.label},
      position: {x: branchMap[commit.id] * 250, y: i * 120},
      style: {background: "#282828", color: "whitesmoke", border: "2px solid whitesmoke", borderRadius: "50%", width: "70px", height: "70px", paddingTop: "25px"}
    }))
  }

  

  

  return (
    <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          fitView 
          nodesDraggable={true}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          style={{background: "#181818"}}
        >

        <Background />
        <Controls />
        <MiniMap style={{background: "#232323"}} maskColor="rgba(86, 86, 86, 0.5)"/>
      </ReactFlow>
  )
}

export default function Tree({owner, repo}) {
  
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <FlowContent owner={owner} repo={repo} />
      </ReactFlowProvider>
    </div>
  );
}
