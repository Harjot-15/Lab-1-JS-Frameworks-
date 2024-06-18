// Import ipcRenderer from Electron for IPC communication
const { ipcRenderer } = require('electron');
// Import Node.js path module
const path = require('path');

// Get references to the DOM elements
const openFileButton = document.getElementById('openFileButton');
const loadDefaultButton = document.getElementById('loadDefaultButton');
const fileContent = document.getElementById('fileContent');

// Define the default file path
const defaultFilePath = path.join(__dirname, 'Who Am I .txt');

// Add event listener for 'click' event on openFileButton
openFileButton.addEventListener('click', async () => {
  // Invoke 'select-file' event to open file dialog and get the selected file path
  const filePath = await ipcRenderer.invoke('select-file');
  if (filePath) {
    // If a file is selected, invoke 'read-file' event to read the file content
    const content = await ipcRenderer.invoke('read-file', filePath);
    // Display the file content in the fileContent element
    fileContent.textContent = content;
  }
});

// Add event listener for 'click' event on loadDefaultButton
loadDefaultButton.addEventListener('click', async () => {
  // Invoke 'read-file' event to read the default file content
  const content = await ipcRenderer.invoke('read-file', defaultFilePath);
  // Display the file content in the fileContent element
  fileContent.textContent = content;
});
