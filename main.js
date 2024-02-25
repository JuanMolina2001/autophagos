const { BrowserWindow, app, Menu, ipcMain } = require('electron')
const path = require('path')
const { getContigs } = require('./scraper.js')
function createWindow() {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icono.png')
    })
    win.loadFile('index.html')
    Menu.setApplicationMenu(null)
     getContigs(win);
   
}

app.whenReady().then(() => {
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
