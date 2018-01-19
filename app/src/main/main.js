const electron = require('electron');
const { app,ipcMain,Menu,BrowserWindow }  = electron;
const url = require('url');

const menuTemplate = [
	{
		role: 'editMenu',
	},
	{
    role: 'help',
    submenu: [
      {
        label: '关于',
        click () { electron.shell.openExternal('https://github.com/onfuns/Qload') }
      }
    ]
  }
];
if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
	})
}

let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 250, 
		height: 345,
		frame: false,
		resizable: false
	});
	const winURL = process.env.NODE_ENV === 'development'
	? 'http://localhost:8080'
	: `file://${__dirname}/index.html`;
	mainWindow.loadURL(winURL)
	
	if(process.env.NODE_ENV !== 'development'){
		let menu = Menu.buildFromTemplate(menuTemplate)
		Menu.setApplicationMenu(menu);
	}
  // if(process.env.NODE_ENV === 'development') {
	// 		const {
	// 		default: installExtension, 
	// 		REACT_DEVELOPER_TOOLS, 
	// 		REDUX_DEVTOOLS
	// 	} = require('electron-devtools-installer')
	// 	// Open the DevTools.
	// 	mainWindow.webContents.openDevTools();
		
	// 	installExtension(REACT_DEVELOPER_TOOLS)
	// 		.then((name) => console.log(`Added Extension:  ${name}`))
	// 		.catch((err) => console.log('An error occurred: ', err));

	// 	installExtension(REDUX_DEVTOOLS)
	// 		.then((name) => console.log(`Added Extension:  ${name}`))
	// 		.catch((err) => console.log('An error occurred: ', err));

  // }
}

let currentWin = BrowserWindow.getFocusedWindow
ipcMain.on('hide-window', (event,arg) => {
	currentWin().minimize();
});

ipcMain.on('max-window', (event,arg) => {
	currentWin().maximize();
});

ipcMain.on('unmax-window', (event,arg) => {
	currentWin().unmaximize();
});
ipcMain.on('window-all-closed', (event,arg) =>{
	app.quit();
})

app.on('ready', createWindow);
app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
		createWindow();
  }
})
