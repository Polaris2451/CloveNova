async function handleRegister(e) {
    e.preventDefault();
    const registerData = {
        username: document.getElementById('username1').value,
        password: document.getElementById('password1').value
    };

    // 这里添加实际注册逻辑
    console.log('注册请求:', { username, password });

    try {
        const response = await fetch('https://api.clovenova.cn/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });
        // 处理非 200 响应
        if (!response.ok) {
            const errorData = await response.json();
            // 调整错误信息解析路径（适配FastAPI的detail结构）
            const errorMessage = errorData.detail?.message
                || errorData.message
                || `注册失败 (${response.status})`;
            throw new Error(errorMessage);
        }
        const data = await response.json();
        window.location.href = '/login?registered=true';
    } catch (error) {
        // 增强错误处理
        console.error('注册错误:', error);
        alert(`注册失败: ${error.message}`);
    }
}
