# Real-Time Collaborative Code Editor

A real-time collaborative code editor built with **React**, **Vite**, **Express**, **Socket.IO**, **Yjs**, and **Docker**. The application enables multiple users to edit code simultaneously with live synchronization powered by CRDTs (Conflict-free Replicated Data Types).

---

## 🚀 Features

* 🔄 Real-time collaborative code editing
* 👥 Multiple users can edit the same document simultaneously
* ⚡ Low-latency synchronization using Yjs
* 🌐 WebSocket communication via Socket.IO
* 📝 Monaco Editor integration
* 🐳 Docker support for easy deployment
* 📦 Modern frontend built with React + Vite
* ⚙️ Express.js backend

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* Monaco Editor
* Yjs
* y-monaco
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Socket.IO
* Yjs
* y-socket.io

### DevOps

* Docker
* Docker Compose

---

## 📂 Project Structure

```text
.
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Rawat890/real-time-code-editor.git

cd real-time-code-editor
```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

Backend runs on:

```
http://localhost:3000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🐳 Docker Setup

Build and start all services:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

---

## 📡 Real-Time Collaboration

The editor uses:

* **Yjs** for CRDT-based shared document synchronization.
* **Socket.IO** for WebSocket communication.
* **y-socket.io** as the collaboration provider.
* **Monaco Editor** for the code editing experience.

Whenever one user edits the document, all connected clients receive updates instantly without conflicts.

---

## 📦 Scripts

### Frontend

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build production assets  |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

### Backend

| Command     | Description          |
| ----------- | -------------------- |
| `npm start` | Start backend server |

---

## 📷 Screenshots

Add screenshots or GIFs here.

```
docs/
    editor.png
    collaboration.gif
```

---

## Future Improvements

* User authentication
* Multiple collaborative rooms
* Syntax highlighting for more languages
* Code execution support
* Persistent document storage
* Room sharing using invite links
* Cursor presence indicators
* Chat between collaborators

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Your Name**

GitHub: https://github.com/Rawat890
