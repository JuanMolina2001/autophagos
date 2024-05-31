import { useRef, useState } from 'preact/hooks';
import React from 'react'
import GenemarkOptions from './genemarkOptions';
const Form = ({ setStatus, setContings }) => {
  const [page, setPage] = useState("0")
  const messageRef = useRef(null);
  return (
    <form className='w-screen h-screen flex flex-col justify-center px-10 gap-3 text-white'
      onSubmit={e => {
        e.preventDefault();
        const message = messageRef.current;
        const form = e.target;
        const data = {
          url: form.url.value,
          headless: form.headless.checked,
          page: form.page.value,
          genemarkOptions: (()=>{
            if(form.page.value !== "genemark")return null
            return {
              mode: form.mode.value,
              format: form.format.value,
              fnn: form.fnn.checked,
              faa: form.faa.checked,
              email: form.email.value,
              subject: form.subject.value,
              zip:form.zip.checked,
              gcode : form.gcode.value
            }
          })()
        }
        if (data.url === "") {
          message.textContent = "Ingresa una url";
          message.style.color = "red";
          message.style.position = "absolute";
          message.style.bottom = "30px";

          form.appendChild(message);
          return;
        }
        if (data.page === "0") {
          message.textContent = "Selecciona una página";
          message.style.color = "red";
          message.style.position = "absolute";
          message.style.bottom = "30px";

          form.appendChild(message);
          return;
        }
        setStatus(1);
        window.electron.start(data, (contings) => {
          setContings(contings);
          setStatus(2);
        });


      }}>
      <a href="https://www.ncbi.nlm.nih.gov/Traces/wgs/RHGY01?display=contigs">
        test
      </a>
      <div class="relative url">
        <input type="text" name="url" class="p-[0.6em_1em] outline-none shadow-[0_2px_4px_#0000001a] border-none bg-transparent w-full cursor-text" placeholder="Url" />
        <div class="highlight absolute bottom-0 left-0 w-0 h-[2px] bg-[#116399] transition-[all_0.3s_ease]"></div>
      </div>
      <div
        className='relative page'>
        <select onChange={(e) => {
          setPage(e.target.value)
        }} name="page" className='p-[0.6em_1em] outline-none shadow-[0_2px_4px_#0000001a] border-none bg-[#272727] w-full cursor-pointer' id="page" value={page}>
          <option value="0">Seleccionar una opción</option>
          <option value="phatest">Phastest.ca</option>
          <option value="genemark">GeneMarkS-2</option>
        </select>
        <div class="highlight absolute bottom-0 left-0 w-0 h-[2px] bg-[#116399] transition-[all_0.3s_ease] "></div>
      </div>
      {page === "genemark" ?
        <GenemarkOptions />
        :
        null
      }
      <p className='self-center'>Ver el navegador</p>
      <div className='flex justify-center'>
        <label className='headless-label'>
          <input
            type="checkbox"
            checked
            name="headless"
            id="headless"
            className='headless-input'
          />
        </label>
      </div>


      <input type="submit" value="Iniciar" className='cursor-pointer w-fit self-center bg-[#0000006c]  p-2 rounded-md shadow hover:bg- transition-all' />
      <p ref={messageRef}></p>
    </form>
  )
}

export default Form