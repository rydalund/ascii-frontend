document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'http://localhost:8080';

    document.getElementById('createForm').addEventListener('submit', function(event) {
        event.preventDefault();


        const today = new Date().toISOString().split('T')[0];  // Sets the date to today

        const formData = {
            artist: document.getElementById('artist').value,
            date: today,
            title: document.getElementById('title').value,
            art: document.getElementById('art').value
        };

        fetch(`${apiUrl}/create-ascii`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json()) 
        .then(data => {
            alert('ASCII-konst skapad: ' + data.title);
            document.getElementById('createForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('searchTitleForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('searchTitle').value;
        fetch(`${apiUrl}/search-by-title?title=${title}`)
            .then(response => response.json())
            .then(data => {
                const searchResultDiv = document.getElementById('searchResult');
                if (data && data.art) {
                    const preElement = document.createElement('pre');
                    preElement.textContent = data.art;
                    searchResultDiv.innerHTML = ''; 
                    searchResultDiv.appendChild(preElement);
                } else {
                    searchResultDiv.innerText = 'Ingen konst hittades';
                }
            })
            .catch(error => {
                const searchResultDiv = document.getElementById('searchResult');
                searchResultDiv.innerText = 'Ingen konst hittades';
                console.error('Error:', error);
            });
    });

    document.getElementById('deleteForm').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const title = document.getElementById('deleteTitle').value;
    
        fetch(`${apiUrl}/${title}`, {
            method: 'DELETE'
        })
        .then(response => response.text()) 
        .then(text => {
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                data = { message: text };
            }
    
            alert('Svar från servern: ' + data.message);
    
            document.getElementById('deleteForm').reset();
        })
        .catch(error => {
            alert('Fel vid borttagning av ASCII-konst: ' + error.message);
            console.error('Error:', error);
        });
    });

    function viewAllAscii() {
        fetch(`${apiUrl}/view-asciis`)
            .then(response => response.json())
            .then(data => {
                const asciiList = document.getElementById('asciiList');
                asciiList.innerHTML = ''; 
                data.forEach(ascii => {
                    const div = document.createElement('div');
                    div.classList.add('ascii-art'); 
                    div.innerHTML = `<h3>${ascii.title} (Artist: ${ascii.artist})</h3><br><pre>${ascii.art}</pre><br>`;
                    asciiList.appendChild(div); 
                });
            })
            .catch(error => {
                console.error('Error:', error); 
            });
    }

    document.getElementById('viewAllButton').addEventListener('click', function() {
        viewAllAscii();
    });
});