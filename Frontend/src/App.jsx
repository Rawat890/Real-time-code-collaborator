import "./App.css"
import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState, useEffect, useCallback } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"
import { initialsOf, safeStringify, stringToColor } from "./utils/helperFunctions"

function Avatar({ username, size = 32, ring = false }) {
  const color = stringToColor(username || "?")
  return (
    <div
      className={"avatar" + (ring ? " avatar--ring" : "")}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
      }}
      title={username}
    >
      {initialsOf(username || "?")}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M9 7V4h6v3m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function App() {
  const editorRef = useRef(null)
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })
  const [users, setUsers] = useState([])
  const [copied, setCopied] = useState(false)

  const [output, setOutput] = useState([])
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

  const handleMount = (editor) => {
    editorRef.current = editor

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
    )
  }

  const handleJoin = (e) => {
    e.preventDefault()
    const name = e.target.username.value.trim()
    if (!name) return
    setUsername(name)
    window.history.pushState({}, "", "?username=" + encodeURIComponent(name))
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard not available, ignore
    }
  }

  // Runs the current editor contents as JavaScript, capturing console
  // output and the returned value / thrown error into the terminal panel.
  const runCode = useCallback(() => {
    if (!editorRef.current) return
    const code = editorRef.current.getValue()

    const logs = []
    const push = (type) => (...args) => {
      logs.push({ type, text: args.map(safeStringify).join(" ") })
    }

    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error

    console.log = push("log")
    console.warn = push("warn")
    console.error = push("error")

    setIsRunning(true)
    setConsoleOpen(true)

    const started = performance.now()
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(code)()
      if (result !== undefined) {
        logs.push({ type: "return", text: safeStringify(result) })
      }
    } catch (err) {
      logs.push({ type: "error", text: err && err.message ? err.message : String(err) })
    } finally {
      console.log = originalLog
      console.warn = originalWarn
      console.error = originalError
      const elapsed = (performance.now() - started).toFixed(1)
      logs.push({ type: "meta", text: `finished in ${elapsed}ms` })
      setOutput(logs)
      setIsRunning(false)
    }
  }, [])

  useEffect(() => {
    if (username) {
      const provider = new SocketIOProvider("/", "monaco", ydoc, {
        autoConnect: true,
      })

      provider.awareness.setLocalStateField("user", { username })

      const syncUsers = () => {
        const states = Array.from(provider.awareness.getStates().values())
        setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))
      }

      syncUsers()
      provider.awareness.on("change", syncUsers)

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
        provider.disconnect()
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [username, ydoc])

  // -- join screen ----------------------------------------------------------

  if (!username) {
    return (
      <main className="join-screen">
        <div className="join-grid" />
        <div className="join-card">
          <div className="join-badge">{"</>"}</div>
          <h1 className="join-title">CodeSync</h1>
          <p className="join-subtitle">Write, run, and pair-program in real time.</p>

          <form onSubmit={handleJoin} className="join-form">
            <input
              type="text"
              placeholder="Enter your name"
              className="join-input"
              name="username"
              autoFocus
              autoComplete="off"
            />
            <button className="join-button" type="submit">
              Join session
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-mark">{"</>"}</span>
          <span className="brand-name">CodeSync</span>
        </div>

        <div className="topbar-right">
          <div className="presence-stack">
            {users.slice(0, 5).map((user, index) => (
              <Avatar key={index} username={user.username} size={30} ring />
            ))}
            {users.length > 5 && (
              <div className="avatar avatar--more">+{users.length - 5}</div>
            )}
          </div>

          <button className="icon-button" onClick={handleCopyLink} title="Copy invite link">
            <LinkIcon />
            {copied ? "Copied" : "Invite"}
          </button>
        </div>
      </header>

      <div className="workspace-body">
        <aside className="sidebar">
          <h2 className="sidebar-title">Collaborators <span className="pill">{users.length}</span></h2>
          <ul className="user-list">
            {users.map((user, index) => (
              <li key={index} className="user-row">
                <Avatar username={user.username} size={34} />
                <div className="user-meta">
                  <span className="user-name">
                    {user.username}
                    {user.username === username && <span className="you-tag">you</span>}
                  </span>
                  <span className="user-status"><span className="dot" /> online</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="editor-panel">
          <div className="editor-toolbar">
            <span className="lang-badge">JavaScript</span>
            <div className="toolbar-spacer" />
            <button
              className="btn btn--ghost"
              onClick={() => setOutput([])}
              disabled={output.length === 0}
              title="Clear console"
            >
              <TrashIcon />
              Clear
            </button>
            <button
              className="btn btn--run"
              onClick={runCode}
              disabled={isRunning}
            >
              {isRunning ? <SpinnerIcon /> : <PlayIcon />}
              {isRunning ? "Running" : "Run"}
            </button>
          </div>

          <div className="editor-surface">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue="// Write some JavaScript and hit Run ▶
console.log('Hello, CodeSync!')"
              theme="vs-dark"
              onMount={handleMount}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                padding: { top: 16 },
              }}
            />
          </div>

          <div className={"console-drawer" + (consoleOpen ? " console-drawer--open" : "")}>
            <div className="console-header" onClick={() => setConsoleOpen(!consoleOpen)}>
              <span>Console</span>
              <span className="console-toggle">{consoleOpen ? "hide ▾" : "show ▴"}</span>
            </div>
            <div className="console-body">
              {output.length === 0 ? (
                <div className="console-empty">Run your code to see output here.</div>
              ) : (
                output.map((line, i) => (
                  <div key={i} className={"console-line console-line--" + line.type}>
                    <span className="console-prefix">
                      {line.type === "error" ? "✕" : line.type === "return" ? "→" : line.type === "meta" ? "·" : "›"}
                    </span>
                    <span className="console-text">{line.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App