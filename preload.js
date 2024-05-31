const {contextBridge,  ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron', {
    start: (data, callback) => {
        console.log(data)
        ipcRenderer.send('start', data) 
        ipcRenderer.on('response-get-contigs', (event, data)=>{
            callback(data)
        })
    },  
    statusContigs: (callback) => {
        ipcRenderer.on('response-status-contigs', (event, data)=>{
            callback(data)
        })
    },
    openLink: (link) => {
        ipcRenderer.send('open-link', link)
    }
})