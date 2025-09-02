const noteInput = document.getElementById('noteInput');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const notesList = document.getElementById('notesList');

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notesList.innerHTML = '';
  notes.forEach((note, index) => {
    const li = document.createElement('li');
    li.textContent = note;
    li.title = "Click to delete this note";
    li.addEventListener('click', () => deleteNote(index));
    notesList.appendChild(li);
  });
}

function saveNote() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  if (noteInput.value.trim() !== '') {
    notes.push(noteInput.value);
    localStorage.setItem('notes', JSON.stringify(notes));
    noteInput.value = '';
    loadNotes();
  }
}

function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes();
}

function clearAllNotes() {
  if (confirm("Are you sure you want to clear all notes?")) {
    localStorage.removeItem('notes');
    loadNotes();
  }
}

saveBtn.addEventListener('click', saveNote);
clearBtn.addEventListener('click', clearAllNotes);
window.addEventListener('load', loadNotes);