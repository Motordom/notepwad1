let fileHandle = null;

const openBtn = document.getElementById("openFileBtn");
const saveBtn = document.getElementById("saveFileBtn");
const saveAsBtn = document.getElementById("saveAsFileBtn");
const noteInput = document.getElementById("noteInput");
const fileNameDisplay = document.getElementById("fileNameDisplay");

// Helper to update file name display
function updateFileNameDisplay() {
  fileNameDisplay.textContent = fileHandle ? fileHandle.name : "No file";
}

// Open file
openBtn.addEventListener("click", async () => {
  try {
    [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: "Text Files",
        accept: { "text/plain": [".txt"] },
      }],
    });
    const file = await fileHandle.getFile();
    noteInput.value = await file.text();
    updateFileNameDisplay();
  } catch (err) {
    console.error("❌ Open cancelled or failed", err);
  }
});

// Save (overwrite if file already opened, else Save As)
saveBtn.addEventListener("click", async () => {
  if (fileHandle) {
    await writeFile(fileHandle, noteInput.value);
  } else {
    await saveAs();
  }
});

// Save As (always prompt)
saveAsBtn.addEventListener("click", async () => {
  await saveAs();
});

// Save As helper
async function saveAs() {
  try {
    fileHandle = await window.showSaveFilePicker({
      types: [{
        description: "Text Files",
        accept: { "text/plain": [".txt"] },
      }],
    });
    await writeFile(fileHandle, noteInput.value);
    updateFileNameDisplay();
  } catch (err) {
    console.error("❌ Save As cancelled or failed", err);
  }
}

// Write helper
async function writeFile(handle, contents) {
  const writable = await handle.createWritable();
  await writable.write(contents);
  await writable.close();
  console.log("✅ File saved");
  updateFileNameDisplay();
}

// Initialize file name display
updateFileNameDisplay();