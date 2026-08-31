import http from 'http';

const PORT = 3000;

const users = [
    {
        id: 1,
        name: 'Harshith'
    },
    {
        id: 2,
        name: 'Rahul'
    }
];

const products = [
    {
        id: 1,
        name: 'Laptop',
        price: 60000
    },
    {
        id: 2,
        name: 'Keyboard',
        price: 2000
    }
];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/api/users') {
        res.statusCode = 200;

        res.end(JSON.stringify({
            success: true,
            data: users
        }));

        return;
    }

    if (req.method === 'GET' && req.url === '/api/products') {
        res.statusCode = 200;

        res.end(JSON.stringify({
            success: true,
            data: products
        }));

        return;
    }

    if (req.method === 'GET' && req.url === '/api/status') {
        res.statusCode = 200;

        res.end(JSON.stringify({
            success: true,
            status: 'Server is running',
            timestamp: new Date().toISOString()
        }));

        return;
    }

    res.statusCode = 404;

    res.end(JSON.stringify({
        success: false,
        message: 'Route not found'
    }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});