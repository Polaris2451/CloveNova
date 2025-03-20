//Token验证
class TokenPulse {
    constructor({
        checkInterval = 60000, // 默认60秒检测一次
        endpoint = 'https://api.clovenova.cn/api/validate-token', // 验证端点
        onTokenExpired = () => {
            window.location.href = '/login'; // 默认过期跳转登录页
        }
    } = {}) {
        this.timer = null;
        this.checkInterval = checkInterval;
        this.endpoint = endpoint;
        this.onTokenExpired = onTokenExpired;
        this.checkToken();
    }

    // 启动心跳检测
    start() {
        if (this.timer) return;
        this.timer = setInterval(() => this.checkToken(), this.checkInterval);
    }

    // 停止检测
    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    async checkToken() {
        try {
            const response = await fetch(this.endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}` // 从存储中获取token
                }
            });

            if (response.status === 401) {
                this.onTokenExpired();
                this.stop();
            }
        } catch (error) {
            console.error('Token check failed:', error);
        }
    }

    // 从存储获取token（根据你的实际存储方式修改）
    getToken() {
        return localStorage.getItem('authToken') || '';
    }
}

// 新增全局变量保存当前问卷数据
let currentSurveysData = [];
// 获取认证信息
const authToken = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');
// 加载公共问卷
async function loadPublicSurveys() {
    try {
        const response = await fetch('https://api.clovenova.cn/api/public/surveys', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) throw new Error('加载失败');
        const surveys = await response.json();
        currentSurveysData = surveys; // 保存数据
        renderSurveys(surveys);
    } catch (error) {
        alert(error.message);
    }
}
// 加载个人问卷（修改同上）
async function loadMySurveys() {
    try {
        const response = await fetch('https://api.clovenova.cn/api/user/surveys', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) throw new Error('加载失败');
        const surveys = await response.json();
        currentSurveysData = surveys; // 保存数据
        renderSurveys(surveys);
    } catch (error) {
        alert(error.message);
    }
}

// 用户登出
function userExit(){
    const token = localStorage.getItem('authToken');
    if (token) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
    }
    window.location.href = '/login'
}

// 渲染函数
function renderSurveys(surveys) {
    const container = document.getElementById('surveyList');
    container.innerHTML = '';
    if (surveys.length === 0) {
        container.innerHTML = '<p class="no-data">暂无问卷，点击上方按钮创建第一个问卷</p>';
        return;
    }
    surveys.forEach(survey => {
        const card = document.createElement('div');
        card.className = 'survey-card';
        card.innerHTML = `
            <h3 class="survey-title">${survey.title || '未命名问卷'}</h3>
            <p>${survey.description || '暂无描述'}</p>
            <div class="survey-meta">
                <span>${new Date(survey.create_time).toLocaleDateString('zh-CN')}</span>
                <span>${survey.response_count} 人参与</span>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.href = `/survey?id=${survey.id}`;
        });
        container.appendChild(card);
    });
}

// 新增过滤应用函数
function applyFilters(e) {
    const keyword = e.target.value.toLowerCase().trim();
    let filteredSurveys = currentSurveysData;

    if (keyword) {
        filteredSurveys = currentSurveysData.filter(survey => {
            const title = (survey.title || '').toLowerCase();
            const description = (survey.description || '').toLowerCase();
            return title.includes(keyword) || description.includes(keyword);
        });
    }

    renderSurveys(filteredSurveys);
}
// 修改筛选切换处理函数
function handleFilterChange(e) {
    // 清空搜索框
    document.querySelector('.search-input').value = '';

    switch (e.target.value) {
        case 'all':
            loadPublicSurveys();
            break;
        case 'my':
            loadMySurveys();
            break;
        case 'popular':
            // 保持原有实现
            loadPublicSurveys();
            break;
    }
}

function start_service() {
    // 绑定事件监听器
    document.getElementById('filterSelect').addEventListener('change', handleFilterChange);
    document.querySelector('.search-input').addEventListener('input', applyFilters); // 改为实时输入监听
    loadPublicSurveys();
}
// 初始化函数
function init() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    const pulse = new TokenPulse({
        onTokenExpired: () => {
            alert('会话已过期，请重新登录');
            window.location.href = '/login';
            return false;
        }
    });

    // 登录成功后启动
    pulse.start();

    // 登出时停止
    // pulse.stop();
    return true;
}

// 初始化
if(init()){
    // 等待DOM加载完成后执行
    document.addEventListener('DOMContentLoaded', start_service);
}

