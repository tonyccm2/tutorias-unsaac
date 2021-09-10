const {app, BrowserWindow, Menu} = require('electron');

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1200,
        heigth: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    win.loadFile('src/views/login/login.html')
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
});

const templateMenu = [
    {
        label: 'DevTools',
        submenu: [
            {
                label: 'Dev tools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
]
