document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const userIdInput = document.getElementById('userId');
    const getUserByIdBtn = document.getElementById('getUserById');
    const tryButtons = document.querySelectorAll('.try-btn');

    function formatJson(json) {
        return JSON.stringify(json, null, 2);
    }

    function displayResult(data) {
        resultArea.textContent = formatJson(data);
        resultArea.classList.remove('error');
    }

    function showError(message) {
        resultArea.textContent = `Error: ${message}`;
        resultArea.classList.add('error');
    }

    // Function to fetch data from API
    async function fetchData(url) {
        try {
            console.log('Fetching data from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Data received:', data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            showError(error.message);
            return null;
        }
    }

    // Search users
    searchButton.addEventListener('click', async () => {
        const keyword = searchInput.value.trim();
        
        if (!keyword) {
            showError('Masukkan kata kunci untuk pencarian');
            return;
        }
        
        const data = await fetchData(`/api/users/search?q=${encodeURIComponent(keyword)}`);
        if (data) {
            displayResult(data);
        }
    });

    // Get user by ID
    getUserByIdBtn.addEventListener('click', async () => {
        const userId = userIdInput.value.trim();
        
        if (!userId) {
            showError('Masukkan ID pengguna');
            return;
        }
        
        const data = await fetchData(`/api/users/${userId}`);
        if (data) {
            displayResult(data);
        }
    });

    tryButtons.forEach(button => {
        if (button.id !== 'getUserById') {
            button.addEventListener('click', async () => {
                const endpoint = button.getAttribute('data-endpoint');
                console.log('Trying endpoint:', endpoint);
                const data = await fetchData(endpoint);
                if (data) {
                    displayResult(data);
                }
            });
        }
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    
    userIdInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            getUserByIdBtn.click();
        }
    });

    resultArea.textContent = "Hasil akan ditampilkan di sini...";
});