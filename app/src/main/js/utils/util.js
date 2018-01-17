const electron = global.require('electron')
const path = require('path')
export const { remote,ipcRenderer }  = electron
export const { BrowserWindow,dialog } = remote
export const USER_HOME = process.platform === 'win32' ? process.env.USERPROFILE || '' : process.env.HOME || process.env.HOMEPATH || ''
export const APP_NAME = 'Qload';
const currentWin = null

export const closeWIndow = ()=>{
  ipcRenderer.send('window-all-closed',currentWin)
}
export const hideWIndow = ()=>{
  let win = BrowserWindow.getFocusedWindow()
  ipcRenderer.send('hide-window')
}
export const maxWindow = ()=>{
  ipcRenderer.send('max-window',currentWin)
}
export const unmaxWindow = ()=>{
  ipcRenderer.send('unmax-window',currentWin)
}

export const createNewWindow = (options={}) =>{
  const win = new BrowserWindow(Object.assign({
    height: 768,
    width: 1024,
    frame: false,
    resizable: false
  },options));
  const winURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : `file://${__dirname}/index.html`;
  win.loadURL(`${winURL}#${options.path}`);
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
  return win
}

export const saveCache = (key, value) =>{
  localStorage.setItem(key, JSON.stringify(value));
}

export const getCache = (key) => {
  return JSON.parse(localStorage.getItem(key));
}

export const clearCacheByKey = (key) => {
  localStorage.removeItem(key);
}

export const formatFileSize = (fsize, prec = 1) => {
  let rank = 0;
  let unit = 'B';

  while (fsize > 1024) {
    fsize /= 1024;
    rank += 1;
  }

  fsize = fsize.toFixed(prec);
  switch (rank) {
    case 1:
      unit = 'KB';
      break;
    case 2:
      unit = 'MB';
      break;
    case 3:
      unit = 'GB';
      break;
    case 4:
      unit = 'TB';
      break;
    default:
      break;
  }
  return `${fsize} ${unit}`;
}