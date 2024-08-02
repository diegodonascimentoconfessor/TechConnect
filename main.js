const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const {spawn}= require('child_process');
const { start } = require('node:repl');

function startServer(){
const serverProcess = spawn('node',['index.js']);
//Listener para o fluxo de saída padrão do servidor
serverProcess.stdout.on( 'data',(data) =>{
    console.log(`sevidor Node.js:  ${data}`);
});
 // Listener para o fluxo de erro sevidor
 serverProcess.stderr.on( 'data',(data) =>{
    console.error(`error no servidor Node.js ${data}`);


});

serverProcess.stderr.on( 'close',(code) =>{
    console.log(` servidor Node.js  encerrado o cdigo ${code}`);
});

 return  serverProcess ;
}   

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
    //inicializando servidor node
    const serverProcess = startServer();
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  app.on('before-quit', ()=>{
    serverProcess.kill()

  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})