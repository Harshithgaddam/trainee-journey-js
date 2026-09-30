import http from 'http';

const PORT = 3000;

let users = [
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

// Helper function to send JSON response
function sendJson(res, statusCode, data = null) {
    res.statusCode = statusCode;

    res.setHeader(
        'Content-Type',
        'application/json; charset=utf-8'
    );

    res.setHeader(
        'Cache-Control',
        'no-store'
    );

    if (statusCode === 204) {
        res.end();
        return;
    }

    res.end(JSON.stringify(data));
}


// Read JSON body from POST / PUT
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    });
}


const server = http.createServer(async (req, res) => {

    const url = new URL(
        req.url,
        `http://${req.headers.host}`
    );

    const pathname = url.pathname;


    // ==========================================
    // GET /api/users
    // Get all users
    // ==========================================

    if (req.method === 'GET' && pathname === '/api/users') {
        return sendJson(res, 200, {
            success: true,
            data: users
        });
    }


    // ==========================================
    // GET /api/users/:id
    // Get one user
    // ==========================================

    if (req.method === 'GET' &&pathname.startsWith('/api/users/')) {

        const id = Number(
            pathname.split('/')[3]
        );

        if (Number.isNaN(id)) {
            return sendJson(res, 400, {
                success: false,
                message: 'Invalid user ID'
            });
        }

        const user = users.find(user => user.id === id);

        if (!user) {
            return sendJson(res, 404, {
                success: false,
                message: 'User not found'
            });
        }

        return sendJson(res, 200, {
            success: true,
            data: user
        });
    }


    // ==========================================
    // POST /api/users
    // Create a new user
    // ==========================================

    if (
        req.method === 'POST' &&
        pathname === '/api/users'
    ) {

        try {
            const body = await getRequestBody(req);

            if (
                !body.name ||
                typeof body.name !== 'string'
            ) {
                return sendJson(res, 400, {
                    success: false,
                    message: 'Name is required'
                });
            }

            const newUser = {
                id: users.length > 0
                    ? users[users.length - 1].id + 1
                    : 1,

                name: body.name
            };

            users.push(newUser);

            return sendJson(res, 201, {
                success: true,
                message: 'User created successfully',
                data: newUser
            });

        } catch (error) {

            return sendJson(res, 400, {
                success: false,
                message: 'Invalid JSON'
            });
        }
    }


    // ==========================================
    // PUT /api/users/:id
    // Update a user
    // ==========================================

    if (
        req.method === 'PUT' &&
        pathname.startsWith('/api/users/')
    ) {

        const id = Number(
            pathname.split('/')[3]
        );

        if (Number.isNaN(id)) {
            return sendJson(res, 400, {
                success: false,
                message: 'Invalid user ID'
            });
        }

        const user = users.find(user => user.id === id);

        if (!user) {
            return sendJson(res, 404, {
                success: false,
                message: 'User not found'
            });
        }

        try {
            const body = await getRequestBody(req);

            if (
                !body.name ||
                typeof body.name !== 'string'
            ) {
                return sendJson(res, 400, {
                    success: false,
                    message: 'Name is required'
                });
            }

            user.name = body.name;

            return sendJson(res, 200, {
                success: true,
                message: 'User updated successfully',
                data: user
            });

        } catch (error) {

            return sendJson(res, 400, {
                success: false,
                message: 'Invalid JSON'
            });
        }
    }


    // ==========================================
    // DELETE /api/users/:id
    // Delete a user
    // ==========================================

    if (
        req.method === 'DELETE' &&
        pathname.startsWith('/api/users/')
    ) {

        const id = Number(
            pathname.split('/')[3]
        );

        if (Number.isNaN(id)) {
            return sendJson(res, 400, {
                success: false,
                message: 'Invalid user ID'
            });
        }

        const userIndex = users.findIndex(
            user => user.id === id
        );

        if (userIndex === -1) {
            return sendJson(res, 404, {
                success: false,
                message: 'User not found'
            });
        }

        users.splice(userIndex, 1);

        return sendJson(res, 204);
    }


    // ==========================================
    // GET /api/products
    // Existing route
    // ==========================================

    if (
        req.method === 'GET' &&
        pathname === '/api/products'
    ) {

        return sendJson(res, 200, {
            success: true,
            data: products
        });
    }


    // ==========================================
    // GET /api/status
    // Existing route
    // ==========================================

    if (
        req.method === 'GET' &&
        pathname === '/api/status'
    ) {

        return sendJson(res, 200, {
            success: true,
            status: 'Server is running',
            timestamp: new Date().toISOString()
        });
    }


    // ==========================================
    // Route not found
    // ==========================================

    return sendJson(res, 404, {
        success: false,
        message: 'Route not found'
    });
});

server.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});