import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Editor } from '@monaco-editor/react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="h-screen w-full bg-gray-300 flex gap-4 p-2">
      <aside className='h-full w-1/4 bg-amber-500 rounded-2xl'>
      </aside>
      <section className='w-3/4 h-full bg-blue-400 rounded-2xl overflow-hidden'>
        <Editor
          height={"100%"}
          defaultLanguage='javascript'
          defaultValue='// some content'
          theme='vs-dark'
        />
      </section>

    </main>
  )
}

export default App
