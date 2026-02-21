# 🚀 CommmitAnalyzer – Turn Git History into Visual Insights

CommitAnalyzer is a full-stack MERN application that transforms a GitHub repository’s commit history into an interactive visual graph. It allows users to explore commits visually, view detailed commit information, and generate AI-powered summaries of changes — all in a clean, responsive dashboard.

---

## 🌟 Features

### 🔗 Repository Visualization
- Enter a GitHub repository URL
- Commits are rendered as an interactive graph using React Flow
- Each commit appears as a node in the graph

### 🖱️ Interactive Commit Details
- Click on a commit node to view:
  - Commit message
  - Author details
  - Date & time
  - Changed files
  - Full commit metadata
- AI-generated summary explaining the changes in simple language

### 🤖 AI-Powered Commit Summaries
- Automatically generates:
  - High-level explanation of code changes
  - Simplified summary of modifications
  - Helpful insights for understanding commits faster

### 📜 Repository History Tracking
- Sidebar history bar shows:
  - Previously analyzed repositories
  - Quick access to past visualizations

### 🔐 Authentication & Authorization
- Secure Login & Signup
- JWT-based authentication
- Protected dashboard routes
- User-specific repository history

### 🔄 Commit Pagination Controls
- Reload Button → Fetch latest commits
- Load More Button → Load older commits
- Efficient incremental loading

### 📱 Fully Responsive Design
- Works on Desktop, Tablet, and Mobile devices

---

## 🏗️ Tech Stack

### Frontend
- React
- React Flow (Graph Visualization)
- Axios
- JWT Authentication Handling

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- GitHub API Integration
- AI API Integration

### Database
- MongoDB
  - User data
  - Repository history
  - Cached analysis

---



## 🖥️ Pages Overview

### 🏠 Landing Page
- Project introduction
- Feature highlights
- Call-to-action buttons

### 🔐 Login / Signup
- JWT-based authentication
- Secure password handling

### 📊 Dashboard
- GitHub repository URL input
- Commit graph visualization
- Sidebar displaying:
  - Commit details
  - AI summary
- Repository history bar
- Reload and Load More functionality

---

## 🔄 How It Works

1. User logs in.
2. User enters a GitHub repository URL.
3. Backend fetches commits via GitHub API.
4. Commits are structured and sent to the frontend.
5. React Flow renders commits as graph nodes.
6. Clicking a node:
   - Displays commit details
   - Generates AI summary
7. Repository gets saved to user history.

---

## 🔐 Authentication Flow

- User registers or logs in
- Backend generates JWT
- Token stored securely on frontend
- Protected routes validate JWT
- Dashboard access restricted to authenticated users

---

## 📸 Screenshots


<img width="1915" height="866" alt="Screenshot 2026-02-20 230458" src="https://github.com/user-attachments/assets/9c9ae906-f741-4fb2-be77-43b87ead8db5" />

<img width="1919" height="866" alt="Screenshot 2026-02-20 230518" src="https://github.com/user-attachments/assets/8d27498c-07b0-414f-8aa8-6abe16def595" />

<img width="1906" height="869" alt="Screenshot 2026-02-20 230619" src="https://github.com/user-attachments/assets/7a9a4d77-7fd0-4b6b-bc51-35c19f7e0948" />

<img width="1907" height="866" alt="Screenshot 2026-02-20 232627" src="https://github.com/user-attachments/assets/d6dfb842-e99b-410d-a678-714dff03f3f6" />




---

## 🔮 Future Improvements

- Branch visualization support
- Commit filtering (author/date/file)
- Performance optimizations for large repositories
- Dark/Light theme toggle
- Export commit graph as image

---

## 🧠 Why This Project?

Understanding Git history through raw commit logs can be overwhelming.
This project converts complex commit history into:

- Visual graphs
- Human-readable summaries
- Structured insights
Ideal for:
- Developers
- Code reviewers
- Team leads
- Open-source contributors

## 👨‍💻 Author
- Adithya Sanda
