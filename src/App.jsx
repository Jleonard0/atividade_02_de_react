import { useState } from 'react'
import Head from './components/Head'
import Task from './components/Task'

function App() {
  const [authKey, setAuthKey] = useState()  
  return (
    <>
      <Head />
      <main className='vh-100 container text-center'>
        <Task></Task>
      </main>
    </>
  )
}

export default App
