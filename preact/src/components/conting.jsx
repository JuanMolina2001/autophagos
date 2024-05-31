import React from 'react'

const Conting = ({conting}) => {
    const { name, status, result } = conting;
  return (
    <details>
            <summary>
                <div class="name">
                    <div class={result ? result.isPhage : 'loader'}></div>
                    {name}
                </div>
                <span>{status}</span>
                {result ? <button onClick={()=>{
                    window.electron.openFile(result.url)
                }}>
                    {result.id}
                    </button> : 
                    null}
            </summary>
        </details>
  )
}

export default Conting