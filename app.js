let fileHandle = null;
let fileName = "untitled.txt";
let isSaved = true;

const editor = document.getElementById("editor");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const fileInput = document.getElementById("fileInput");

const supportsFSAccess = "showOpenFilePicker" in window;

// ================================
// UI helpers
// ================================
function updateFileNameDisplay() {
  fileNameDisplay.textContent = isSaved ? fileName : `${fileName} *`;
}

function setupButtons() {
  if (supportsFSAccess) {
    document.querySelectorAll(".fs").forEach(b => b.style.display = "inline-block");
    document.querySelectorAll(".fallback").forEach(b => b.style.display = "none");
  } else {
    document.querySelectorAll(".fs").forEach(b => b.style.display = "none");
    document.querySelectorAll(".fallback").forEach(b => b.style.display = "inline-block");
  }
}

// ================================
// FS Access API
// ================================
async function openFile() {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{ description: "Text Files", accept: { "text/plain": [".txt"] } }]
    });
    fileHandle = handle;
    const file = await handle.getFile();
    editor.value = await file.text();
    fileName = file.name;
    isSaved = true;
    updateFileNameDisplay();
  } catch (err) {
    console.error("Open failed:", err);
  }
}

async function saveFile() {
  if (!fileHandle) return saveFileAs();
  const writable = await fileHandle.createWritable();
  await writable.write(editor.value);
  await writable.close();
  isSaved = true;
  updateFileNameDisplay();
}

async function saveFileAs() {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [{ description: "Text Files", accept: { "text/plain": [".txt"] } }]
    });
    fileHandle = handle;
    fileName = handle.name;
    const writable = await handle.createWritable();
    await writable.write(editor.value);
    await writable.close();
    isSaved = true;
    updateFileNameDisplay();
  } catch (err) {
    console.error("Save As failed:", err);
  }
}

// ================================
// Fallback
// ================================
function openFileFallback() {
  fileInput.value = "";
  fileInput.click();
}

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    editor.value = reader.result;
    fileName = file.name;
    isSaved = true;
    updateFileNameDisplay();
  };
  reader.readAsText(file);
});

function downloadFile() {
  const blob = new Blob([editor.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  isSaved = true;
  updateFileNameDisplay();
}

// ================================
// Unsaved handling
// ================================
editor.addEventListener("input", () => {
  isSaved = false;
  updateFileNameDisplay();
});

window.addEventListener("beforeunload", e => {
  if (!isSaved) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// ================================
// Bindings
// ================================
document.getElementById("openBtn").addEventListener("click", openFile);
document.getElementById("saveBtn").addEventListener("click", saveFile);
document.getElementById("saveAsBtn").addEventListener("click", saveFileAs);

document.getElementById("openFallbackBtn").addEventListener("click", openFileFallback);
document.getElementById("downloadBtn").addEventListener("click", downloadFile);

// Init
setupButtons();
updateFileNameDisplay();