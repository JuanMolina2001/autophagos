import { useEffect, useState } from 'preact/hooks'
import { Form, Conting } from './components'

export function App() {
  const [status, setStatus] = useState(0)
  const [contings, setContings] = useState([])
  useEffect(() => {
    window.electron.statusContigs((response) => {
      const { status, id, result } = response;
      contings[id].status = status;
      contings[id].result = result;
      setContings(contings);
      
  })

  }, [])
  if (status === 0) {
    document.title = "Inicio"
    return (
      <Form setStatus={setStatus} setContings={setContings} />
    )
  }
  if (status === 1) {
    document.title = "Cargando..."
    return (
      <div>
        <div class="loader"></div>
      </div>
    )
  }
  if (status === 2) {
    document.title = "Resultados"
    return (
      <div className='overflow-y-auto'>
      <button className='' 
      onClick={()=>{
        setStatus(0)
      }}>
        Volver
      </button>
        {contings.map((conting, i) => {
          return (
            <Conting key={i} data={conting} />
          )
        })}
      </div>
    )
  }
}
