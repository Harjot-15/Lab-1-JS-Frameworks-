const { ipcRenderer } = require('electron');
const path = require('path');

const openFileButton = document.getElementById('openFileButton');
const loadDefaultButton = document.getElementById('loadDefaultButton');
const fileContent = document.getElementById('fileContent');

const defaultFilePath = path.join(__dirname, 'Who Am I .txt');

openFileButton.addEventListener('click', async () => {
  const filePath = await ipcRenderer.invoke('select-file');
  if (filePath) {
    const content = await ipcRenderer.invoke('read-file', filePath);
    fileContent.textContent = content;
  }
});

loadDefaultButton.addEventListener('click', async () => {
  const content = await ipcRenderer.invoke('read-file', defaultFilePath);
  fileContent.textContent = content;
});
