let fileHandle = null; // Remember currently open file

const openBtn = document.getElementById("openFileBtn");
const saveBtn = document.getElementById("saveFileBtn");
const saveAsBtn = document.getElementById("saveAsFileBtn");
const noteInput = document.getElementById("noteInput");

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
    const contents = await file.text();
    noteInput.value = contents;
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
  console.log("✅ File saved");
}