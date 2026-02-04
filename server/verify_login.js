async function testLogin() {
    const API_URL = 'http://localhost:3000/api/auth/login';

    try {
        console.log('Attempting login to:', API_URL);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login Successful!');
            console.log('Status:', response.status);
            console.log('Token received:', !!data.token);
            console.log('User:', data.user.email);
        } else {
            console.error('Login Failed');
            console.error('Status:', response.status);
            const text = await response.text();
            console.error('Response:', text);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();
