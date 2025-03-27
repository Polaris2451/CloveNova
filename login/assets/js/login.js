async function handleLogin(e) {
    e.preventDefault();
    const loginData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };
    // 这里添加实际登录逻辑
    //console.log('登录请求:', { username, password });
    try {
        const response = await fetch('https://api.clovenova.cn/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        // 处理非 200 响应
        if (!response.ok) {
            const errorData = await response.json(); // 确保解析错误信息
            throw new Error(errorData.message || `登录失败 (${response.status})`);
        }
        const { token, user_id } = await response.json();
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', user_id);
        window.location.href = '/home';
    } catch (error) {
        // 增强错误处理
        console.error('登录错误:', error);
        alert(`登录错误: ${error.message}`);
    }
};


// 初始化页面
function init() {
    //const token = localStorage.getItem('authToken')
    // 检查URL参数显示注册成功提示
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('registered')) {
        alert('注册成功，请登录');
    }

}
init();
