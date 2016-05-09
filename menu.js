var remote = require('remote')
var Menu = remote.require('menu')
var browserWindow = remote.getCurrentWindow()
var dialog = remote.require('dialog')
var fs = require('fs')

var template = [
  {
    label: 'Document',
    submenu: [
      {
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: function () { browserWindow.webContents.print({silent: false, printBackground: false}) }
      },
      {
        label: 'Save PDF',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
          dialog.showSaveDialog({ filters: [{ name: 'Document', extensions: ['pdf'] }] }, function (fileName) {
            if (fileName === undefined) return
            browserWindow.webContents.printToPDF({
              marginsType: 1,
              pageSize: 'A4',
              printBackground: true,
              printSelectionOnly: false,
              landscape: false
            }, function (error, data) {
              if (error) throw error
              fs.writeFile(fileName, data, function (error) {
                if (error) throw error
              })
            })
          })
        }
      }
    ]
  }
]

// add osx menu
if (process.platform === 'darwin') {
  const name = require('electron').remote.app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      }
    ]
  })
  template.push(
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        }
      ]
    }
    // {
    //   label: 'View',
    //   submenu: [
    //     {
    //       label: 'Reload',
    //       accelerator: 'Command+R',
    //       click: function () { remote.getCurrentWindow().reload() }
    //     },
    //     {
    //       label: 'Toggle DevTools',
    //       accelerator: 'Alt+Command+I',
    //       click: function () { remote.getCurrentWindow().toggleDevTools() }
    //     }
    //   ]
    // }
  )
}

let menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
