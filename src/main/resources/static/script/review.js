// ===================== LẤY VÀ HIỂN THỊ BÀI VIẾT =====================
// Hàm lấy các bài viết đã được admin duyệt và hiển thị lên giao diện
async function fetchPosts() {
    try {
        const response = await fetch('/api/posts/status/APPROVED', {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Không lấy được danh sách bài viết');
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        alert('Không thể tải bài viết. Vui lòng kiểm tra kết nối hoặc thử lại sau.');
    }
}

// Hàm hiển thị danh sách bài viết lên trang, dùng style blog-card
function renderPosts(posts) {
    const postsFeed = document.getElementById('postsFeed');
    postsFeed.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'col-md-4';
        postElement.innerHTML = `
            <div class="blog-card mb-4 shadow-sm position-relative">
                <span class="badge">Đã duyệt</span>
                <img src="${post.imageUrl}" class="blog-img" alt="Post Image" onclick="showLightbox('${post.imageUrl}')">
                <div class="blog-body">
                    <h5 class="card-title mb-2">${post.caption}</h5>
                    <div class="d-flex align-items-center mb-2">
                        <img src="../images/logochef.png" class="story-avatar me-2" alt="Avatar">
                        <span class="fw-bold text-dark">${post.username}</span>
                        <span class="user-badge ms-2">Đã duyệt</span>
                    </div>
                </div>
            </div>
        `;
        postsFeed.appendChild(postElement);
    });
}

// ===================== POST FORM SUBMISSION =====================
// Handle post form submission (upload new post)
document.getElementById('postForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const caption = document.getElementById('caption').value;
    const image = document.getElementById('image').files[0];
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('User not logged in. Please log in to post.');
        return;
    }
    if (!caption.trim()) {
        alert('Caption cannot be empty.');
        return;
    }
    if (!image) {
        alert('Please select an image.');
        return;
    }
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    formData.append('userId', userId);
    try {
        const response = await fetch('/api/posts/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            alert('Lỗi đăng bài: ' + errorText);
            throw new Error('Failed to create post: ' + errorText);
        }
        alert('Post created successfully!');
        fetchPosts();
    } catch (error) {
        console.error('Error creating post:', error);
    }
});

// ===================== REGISTER FORM SUBMISSION =====================
// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.text();
            alert(`Registration failed: ${error}`);
            return;
        }
        alert('Registration successful! You can now log in.');
        document.getElementById('registerForm').reset();
        const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        registerModal.hide();
    } catch (error) {
        console.error('Error during registration:', error);
    }
});

// ===================== NAVBAR & AUTH =====================
// Update navbar with user info after login
function updateNavbar(user) {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const registerBtn = document.getElementById('registerBtn');
    userAvatar.src = user.avatarUrl || '../images/logochef.png';
    userAvatar.style.display = 'inline-block';
    userName.textContent = user.username;
    userName.style.display = 'inline-block';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    registerBtn.style.display = 'none';
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.text();
            alert(`Login failed: ${error}`);
            return;
        }
        const user = await response.json();
        alert(`Welcome, ${user.username}!`);
        updateNavbar(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});

// Handle logout functionality
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    location.reload();
});

// On page load, update navbar if user is logged in
window.addEventListener('DOMContentLoaded', function () {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        updateNavbar(user);
    }
});

// ===================== LIGHTBOX IMAGE PREVIEW =====================
// Show image in lightbox overlay
function showLightbox(imgUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.src = imgUrl;
    lightbox.classList.add('active');
    lightbox.onclick = function() {
        lightbox.classList.remove('active');
    };
}

// ===================== INIT =====================
// Initial fetch of posts when the page loads
fetchPosts();
