// Add form validation
document.addEventListener('DOMContentLoaded', function() {
    const noteForm = document.getElementById('noteForm');
    
    if (noteForm) {
        noteForm.addEventListener('submit', function(e) {
            const title = this.querySelector('input[name="title"]').value.trim();
            const description = this.querySelector('textarea[name="description"]').value.trim();
            const date = this.querySelector('input[name="date"]').value;

            if (!title || !description || !date) {
                e.preventDefault();
                alert('Please fill in all fields');
            }
        });
    }
});

// Confirm delete action
function confirmDelete(filename) {
    return confirm(`Are you sure you want to delete "${filename}"?`);
}
