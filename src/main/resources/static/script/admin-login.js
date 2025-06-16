document.getElementById('adminLoginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }

        const user = await response.json();
        if (user.role !== 'ADMIN') {
            document.getElementById('errorMessage').textContent = 'Access denied. Admins only.';
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }

        localStorage.setItem('admin', JSON.stringify(user));
        window.location.href = 'admin.html';
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
        document.getElementById('errorMessage').style.display = 'block';
    }
});
