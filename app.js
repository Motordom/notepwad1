let fileHandle = null;
let isDirty = false; // Track unsaved changes

const openBtn = document.getElementById("openFileBtn");
const saveBtn = document.getElementById("saveFileBtn");
const saveAsBtn = document.getElementById("saveAsFileBtn");
const noteInput = document.getElementById("noteInput");
const fileNameDisplay = document.getElementById("fileNameDisplay");

// Helper to update file name display
function updateFileNameDisplay() {
  let name = fileHandle ? fileHandle.name : "No file";
  if (isDirty) name += " *"; // show unsaved changes
  fileNameDisplay.textContent = name;
}

// Mark textarea as dirty when changed
noteInput.addEventListener("input", () => {
  isDirty = true;
  updateFileNameDisplay();
});

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
    isDirty = false;
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
  } catch (err) {
    console.error("❌ Save As cancelled or failed", err);
  }
}

// Write helper
async function writeFile(handle, contents) {
  const writable = await handle.createWritable();
  await writable.write(contents);
  await writable.close();
  isDirty = false; // mark as saved
  updateFileNameDisplay();
  console.log("✅ File saved");
}

// Warn user if they try to leave with unsaved changes
window.addEventListener("beforeunload", (e) => {
  if (isDirty) {
    e.preventDefault();
    e.returnValue = ""; // Required for Chrome to show warning
  }
});

// Initialize file name display
updateFileNameDisplay();