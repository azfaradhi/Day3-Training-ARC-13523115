const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const dataPath = path.join(__dirname, 'data', 'users.json');
console.log('Mencoba membaca file data dari:', dataPath);

let usersData = { users: [] };
try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    usersData = JSON.parse(rawData);
    console.log('Data berhasil dibaca. Struktur data:', Object.keys(usersData));
} catch (error) {
    console.error('Error membaca atau parsing file data:', error.message);
}

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// FET semua user
app.get('/api/users', (req, res) => {
    console.log('GET /api/users dipanggil');
    res.json(usersData.users.length ? usersData : { message: 'Data pengguna kosong' });
});

// GET bedasarkan ID
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = usersData.users.find(user => user.id === userId);
    user ? res.json(user) : res.status(404).json({ message: 'User not found' });
});

// GET bedasarkan kata
app.get('/api/users/search', (req, res) => {
    console.log('GET /api/users/search dipanggil');
    const keyword = req.query.q ? req.query.q.toLowerCase() : '';
    if (!keyword) return res.status(400).json({ message: 'Search keyword is required' });

    if (!usersData || !Array.isArray(usersData.users)) {
        return res.status(500).json({ message: 'User data is unavailable' });
    }

    const results = usersData.users.filter(user => 
        user.firstName?.toLowerCase().includes(keyword) || 
        user.lastName?.toLowerCase().includes(keyword) || 
        user.email?.toLowerCase().includes(keyword)
    );

    res.json({ results, count: results.length });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
