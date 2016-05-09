var remote = require('remote')
var Menu = remote.require('menu')
var dialog = remote.require('dialog')
var fs = require('fs')

var template = [
  {
    label: 'Schreiberling',
    submenu: [
      {
        label: 'About Schreiberling',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Schreiberling',
        accelerator: 'Command+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
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
  },
  {
    label: 'Document',
    submenu: [
      {
        label: 'Print',
        accelerator: 'Command+P',
        click: function () { remote.getCurrentWindow().webContents.print({silent: false, printBackground: false}) }
      },
      {
        label: 'Save PDF',
        accelerator: 'Command+S',
        click: function () {
          dialog.showSaveDialog({ filters: [{ name: 'Document', extensions: ['pdf'] }] }, function (fileName) {
            if (fileName === undefined) return
            remote.getCurrentWindow().webContents.printToPDF({
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
  },
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
]

let menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
