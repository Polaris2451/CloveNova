// user-center.js

// 全局变量存储用户数据
let userData = null;
const authToken = localStorage.getItem('authToken');

// 初始化函数
async function initUserCenter() {
    if (!authToken) {
        redirectToLogin();
        return;
    }

    try {
        // 获取用户数据
        await fetchUserData();

        // 更新页面数据
        updateUserProfile();
        updateUserStats();

        // 绑定事件
        bindEvents();

    } catch (error) {
        console.error('初始化失败:', error);
        showError('加载用户数据失败，请刷新重试');
    }
}

// 获取用户数据
async function fetchUserData() {
    const [profileResponse, statsResponse] = await Promise.all([
        fetch('https://api.clovenova.cn/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }),
        fetch('https://api.clovenova.cn/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
    ]);

    if (!profileResponse.ok || !statsResponse.ok) {
        throw new Error('获取用户数据失败');
    }

    userData = {
        profile: await profileResponse.json(),
        stats: await statsResponse.json()
    };
}

// 更新用户资料显示
function updateUserProfile() {
    if (!userData?.profile) return;

    const { username, user_id, email, register_time } = userData.profile;

    // 更新侧边栏
    document.getElementById('username').textContent = username;
    document.getElementById('user-id').textContent = `UID: ${user_id}`;

    // 更新资料卡片
    document.getElementById('profile-username').textContent = username;
    document.getElementById('user-email').textContent = email || '未设置';
    document.getElementById('register-date').textContent =
        new Date(register_time).toLocaleDateString('zh-CN');
}

// 更新统计数据
function updateUserStats() {
    if (!userData?.stats) return;

    const { created_count, participated_count, responses_count } = userData.stats;

    document.getElementById('created-count').textContent = created_count || 0;
    document.getElementById('participated-count').textContent = participated_count || 0;
    document.getElementById('responses-count').textContent = responses_count || 0;
}

// 绑定事件
function bindEvents() {
    // 编辑按钮
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            window.location.href = '/user/settings';
        });
    }

    // 退出登录
    const exitLinks = document.querySelectorAll('[onclick="userExit()"]');
    exitLinks.forEach(link => {
        link.addEventListener('click', userExit);
    });
}

// 用户退出
function userExit() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    redirectToLogin();
}

// 跳转到登录页
function redirectToLogin() {
    window.location.href = '/login';
}

// 显示错误信息
function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
        <div class="error-content">
            <span>${message}</span>
            <button class="error-close">&times;</button>
        </div>
    `;

    document.body.appendChild(errorEl);

    // 点击关闭错误信息
    errorEl.querySelector('.error-close').addEventListener('click', () => {
        errorEl.remove();
    });

    // 3秒后自动消失
    setTimeout(() => {
        if (errorEl.parentNode) {
            errorEl.remove();
        }
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initUserCenter);

// 导出函数供其他模块使用
export function getUserData() {
    return userData;
}
