document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('admin');
    window.location.href = '../html/review.html';
});

// Kiểm tra đăng nhập admin bằng localStorage (cách cũ, không gọi API)
window.addEventListener('DOMContentLoaded', function () {
    const storedAdmin = localStorage.getItem('admin');
    if (!storedAdmin) {
        // Redirect to admin login page if not logged in
        window.location.href = 'admin-login.html';
        return;
    }
    const admin = JSON.parse(storedAdmin);
    if (admin.role !== 'ADMIN') {
        alert('Access denied. Admins only.');
        localStorage.removeItem('admin');
        window.location.href = 'admin-login.html';
    }
});

// Load posts for admin to manage
// Add debugging logs to verify API calls and data rendering
async function loadPosts() {
    try {
        console.log('Fetching posts...');
        const response = await fetch('/api/posts', { credentials: 'include' });
        if (!response.ok) {
            console.error('Failed to fetch posts:', response.status, response.statusText);
            return;
        }
        const posts = await response.json();
        console.log('Posts fetched successfully:', posts);
        renderPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Complete the renderPosts function
function renderPosts(posts) {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Manage Posts</h2>';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'card mb-3';
        let actionButtons = `<button class="btn btn-danger btn-sm" onclick="deletePost(${post.id})">Delete</button>`;
        if (post.status === 'PENDING') {
            actionButtons = `
                <button class="btn btn-success btn-sm me-2" onclick="approvePost(${post.id})">Approve</button>
                <button class="btn btn-warning btn-sm me-2" onclick="rejectPost(${post.id})">Reject</button>
                ` + actionButtons;
        }
        postElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${post.caption}</h5>
                <p class="card-text">Status: ${post.status}</p>
                <p class="card-text">By: ${post.username}</p>
                ${actionButtons}
            </div>
        `;
        content.appendChild(postElement);
    });
}

// Duyệt bài
async function approvePost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/approve`, { method: 'PUT', credentials: 'include' });
        if (!response.ok) {
            console.error('Failed to approve post');
            return;
        }
        alert('Post approved successfully');
        loadPosts();
    } catch (error) {
        console.error('Error approving post:', error);
    }
}

// Từ chối bài
async function rejectPost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/reject`, { method: 'PUT', credentials: 'include' });
        if (!response.ok) {
            console.error('Failed to reject post');
            return;
        }
        alert('Post rejected successfully');
        loadPosts();
    } catch (error) {
        console.error('Error rejecting post:', error);
    }
}

// Add function to delete a post
async function deletePost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE', credentials: 'include' });
        if (!response.ok) {
            console.error('Failed to delete post');
            return;
        }
        alert('Post deleted successfully');
        loadPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Add function to load users
async function loadUsers() {
    try {
        console.log('Fetching users...');
        const response = await fetch('/api/users', { credentials: 'include' });
        if (!response.ok) {
            console.error('Failed to fetch users:', response.status, response.statusText);
            return;
        }
        const users = await response.json();
        console.log('Users fetched successfully:', users);
        renderUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsers(users) {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Manage Users</h2>';
    users.forEach(user => {
        if (user.role === 'ADMIN') return; // Ẩn tài khoản admin
        const userElement = document.createElement('div');
        userElement.className = 'card mb-3';
        userElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title user-detail-link" style="cursor:pointer;color:#007bff;text-decoration:underline;" data-userid="${user.id}">${user.username}</h5>
                <p class="card-text">Email: ${user.email}</p>
                <p class="card-text">Role: ${user.role}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        content.appendChild(userElement);
    });
    // Thêm sự kiện click cho tên user để xem chi tiết
    document.querySelectorAll('.user-detail-link').forEach(el => {
        el.addEventListener('click', async function() {
            const userId = this.getAttribute('data-userid');
            await showUserDetail(userId);
        });
    });
}

// Xem chi tiết user
async function showUserDetail(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, { credentials: 'include' });
        if (!response.ok) {
            alert('Không tìm thấy user!');
            return;
        }
        const user = await response.json();
        // Lấy số lượng bài viết của user
        const postRes = await fetch(`/api/posts/user/${userId}`, { credentials: 'include' });
        let postCount = 0;
        if (postRes.ok) {
            const posts = await postRes.json();
            postCount = posts.length;
        }
        alert(`Thông tin user:\nTên: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}\nSố bài viết: ${postCount}`);
    } catch (error) {
        alert('Lỗi khi lấy thông tin user!');
    }
}

// Add function to delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, { method: 'DELETE', credentials: 'include' });
        if (!response.ok) {
            console.error('Failed to delete user');
            return;
        }
        alert('User deleted successfully');
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Event listeners for navigation
const managePostsBtn = document.getElementById('managePosts');
const manageUsersBtn = document.getElementById('manageUsers');

managePostsBtn.addEventListener('click', function() {
    console.log('Manage Posts clicked');
    loadPosts();
});
manageUsersBtn.addEventListener('click', function() {
    console.log('Manage Users clicked');
    loadUsers();
});

// Load users by default (show user management first)
loadUsers();
