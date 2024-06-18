// Import required modules from Electron
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// Import Node.js path and file system modules
const path = require('path');
const fs = require('fs');

let mainWindow;

// Function to create the main application window
function createWindow() {
  // Create a new browser window with specified dimensions and web preferences
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Allow Node.js integration in the renderer process
      contextIsolation: false, // Disable context isolation for easier IPC communication
    },
  });

  // Load the HTML file into the window
  mainWindow.loadFile('index.html');

  // Handle 'select-file' event from the renderer process
  ipcMain.handle('select-file', async () => {
    // Show an open dialog to select a text file
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'], // Allow opening a single file
      filters: [{ name: 'Text Files', extensions: ['txt'] }], // Filter for text files
    });
    // Return the selected file path
    return result.filePaths[0];
  });

  // Handle 'read-file' event from the renderer process
  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      // Read the content of the specified file
      const content = await fs.promises.readFile(filePath, 'utf-8');
      // Return the file content
      return content;
    } catch (error) {
      // Log any errors that occur and return the error message
      console.error(`Error occurred in handler for 'read-file': ${error}`);
      return `Error: ${error.message}`;
    }
  });
}

// When Electron app is ready, create the main window
app.on('ready', createWindow);

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recreate a window when the app is activated (e.g., clicking the dock icon) and no other windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
