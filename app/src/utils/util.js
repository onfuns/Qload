const IsomorphicFetch = require('isomorphic-fetch');
const electron = global.require('electron')
export const { remote, ipcRenderer } = electron
export const { BrowserWindow, dialog } = remote
export const USER_HOME = process.platform === 'win32' ? process.env.USERPROFILE || '' : process.env.HOME || process.env.HOMEPATH || ''
export const APP_NAME = 'Qload';
const currentWin = null

export const closeWIndow = () => {
  ipcRenderer.send('window-all-closed', currentWin)
}
export const hideWIndow = () => {
  BrowserWindow.getFocusedWindow()
  ipcRenderer.send('hide-window')
}
export const maxWindow = () => {
  ipcRenderer.send('max-window', currentWin)
}
export const unmaxWindow = () => {
  ipcRenderer.send('unmax-window', currentWin)
}
export const createNewWindow = (options = {}) => {
  const win = new BrowserWindow(Object.assign({
    webPreferences: { webSecurity: false },
    height: 600,
    width: 1100,
    frame: false,
    resizable: false
  }, options))
  const { path = '', destroy = true } = options
  win.loadURL(`file://${__dirname}/index.html#${path}`)
  if (destroy) {
    const wins = BrowserWindow.getAllWindows()
    wins.length > 1 && wins[1].destroy()
  }
  return win
}

export const saveCache = (key, value) => {
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



export const request = ({ url, data = {}, method = 'GET', headers = {} }) => {
  let options = {}
  let params = Object.keys(data).length > 0 ? Object.keys(data).map(
    (k) => { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&') : '';
  if (method == 'GET' && params) {
    url = `${url}?${params}`
  } else if (method == 'POST') {
    options.body = params || {}
  }

  options.headers = {
    ...headers
  }
  return IsomorphicFetch(url, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log('fetch failed', err)
    })
}
export const aa = () => {
  console.log(__dirname)
}
