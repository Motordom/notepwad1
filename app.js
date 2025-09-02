const noteInput = document.getElementById('noteInput');
const openFileBtn = document.getElementById('openFileBtn');
const saveFileBtn = document.getElementById('saveFileBtn');

let fileHandle = null;

// ✅ Open a text file and load into textarea
async function openFile() {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: 'Text Files',
        accept: { 'text/plain': ['.txt'] }
      }]
    });
    fileHandle = handle;

    const file = await handle.getFile();
    const text = await file.text();
    noteInput.value = text;

    console.log("✅ File opened:", handle.name);
  } catch (err) {
    console.error("❌ Open failed:", err);
  }
}

// ✅ Save textarea content back to the file
async function saveFile() {
  try {
    if (!fileHandle) {
      // If no file is open, ask user where to save
      fileHandle = await window.showSaveFilePicker({
        types: [{
          description: 'Text Files',
          accept: { 'text/plain': ['.txt'] }
        }]
      });
    }

    const writable = await fileHandle.createWritable();
    await writable.write(noteInput.value);
    await writable.close();

    console.log("✅ File saved:", fileHandle.name);
    alert("✅ Notes saved!");
  } catch (err) {
    console.error("❌ Save failed:", err);
  }
}

openFileBtn.addEventListener('click', openFile);
saveFileBtn.addEventListener('click', saveFile);