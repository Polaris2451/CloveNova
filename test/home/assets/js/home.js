// 全局变量
let currentSurveysData = [];
const authToken = localStorage.getItem('authToken');

// 主初始化函数
function initHomePage() {
    // 加载默认问卷数据
    loadPublicSurveys();

    // 绑定事件监听器
    document.querySelector('.search-input').addEventListener('input', applyFilters);
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('change', handleFilterChange);
    });

    // 绑定登出按钮
    document.getElementById('logoutBtn')?.addEventListener('click', userExit);
}

// 通用数据加载方法
async function loadSurveys(endpoint) {
    try {
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'block';

        const response = await fetch(`https://api.clovenova.cn/api/surveys/${endpoint}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        currentSurveysData = data;
        renderSurveys(data);
    } catch (error) {
        console.error('加载问卷失败:', error);
        showError(error.message);
    } finally {
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'none';
    }
}

// 加载公共问卷
async function loadPublicSurveys() {
    await loadSurveys('public');
}

// 加载个人问卷
async function loadMySurveys() {
    await loadSurveys('my');
}

// 用户登出
function userExit() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    }
}

// 渲染问卷列表
function renderSurveys(surveys) {
    const container = document.getElementById('surveyList') || document.querySelector('.survey-list');
    container.innerHTML = '';

    if (!surveys || surveys.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-inbox"></i>
                <p>暂无问卷数据</p>
            </div>
        `;
        return;
    }

    surveys.forEach(survey => {
        const card = document.createElement('div');
        card.className = 'survey-card';
        card.innerHTML = `
            <h3>${escapeHTML(survey.title || '未命名问卷')}</h3>
            <p>${escapeHTML(survey.description || '暂无描述')}</p>
            <div class="survey-meta">
                <span><i class="far fa-calendar-alt"></i> ${formatDate(survey.created_at || survey.create_time)}</span>
                <span><i class="fas fa-users"></i> ${survey.response_count || 0} 人参与</span>
            </div>
            <button class="btn-view" data-id="${survey.id}">查看详情</button>
        `;
        container.appendChild(card);
    });

    // 绑定查看详情事件
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.location.href = `/survey/?id=${e.target.dataset.id}`;
        });
    });
}

// 筛选条件切换
function handleFilterChange(e) {
    document.querySelector('.search-input').value = '';

    switch (e.target.value) {
        case 'all':
            loadPublicSurveys();
            break;
        case 'my':
            loadMySurveys();
            break;
        case 'popular':
            currentSurveysData.sort((a, b) => (b.response_count || 0) - (a.response_count || 0));
            renderSurveys(currentSurveysData);
            break;
        case 'latest':
            currentSurveysData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            renderSurveys(currentSurveysData);
            break;
        default:
            loadPublicSurveys();
    }
}

// 搜索过滤
function applyFilters(e) {
    const keyword = e.target.value.toLowerCase().trim();
    if (!currentSurveysData) return;

    const filtered = currentSurveysData.filter(survey => {
        const titleMatch = (survey.title || '').toLowerCase().includes(keyword);
        const descMatch = (survey.description || '').toLowerCase().includes(keyword);
        return titleMatch || descMatch;
    });

    renderSurveys(filtered);
}

// 辅助函数
function formatDate(dateString) {
    if (!dateString) return '未知日期';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}

function showError(message) {
    const container = document.getElementById('surveyList') || document.querySelector('.survey-list');
    container.innerHTML = `
        <div class="no-data error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">
                <i class="fas fa-sync-alt"></i> 重新加载
            </button>
        </div>
    `;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initHomePage);
