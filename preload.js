const {contextBridge,  ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron', {
    start: (data) => {
        ipcRenderer.send('start', data)
    },
    getContings: (callback) => {
        ipcRenderer.on('response-get-contigs', (event, data)=>{
            callback(data)
        })
    },
    statusContigs: (callback) => {
        ipcRenderer.on('response-status-contigs', (event, data)=>{
            callback(data)
        })
    },
    getResults: (callback) => {
        ipcRenderer.on('response-get-results', (event, data)=>{
            callback(data)
        })
    },
    shell: require('electron').shell
})