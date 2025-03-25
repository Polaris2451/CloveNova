document.getElementById('myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken')
    if (!token) {
        alert('请先登录');
        window.location.href = '/login';
        return;
    }
    const inputField = document.getElementById('inputField');
    const loading = document.getElementById('loading');
    const statusMessage = document.getElementById('statusMessage');
    // 显示加载状态
    loading.style.display = 'flex';
    statusMessage.textContent = '提交中...';
    try {
        // 模拟API调用（替换为你的真实API地址）
        const AIresponse = await fetch('https://api.clovenova.cn/api/ai-generate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: inputField.value.toString()
        });
        if (!AIresponse.ok) throw new Error('生成失败');

        try {
            // 模拟API调用（替换为你的真实API地址）
            const generate_response = await fetch('https://api.clovenova.cn/api/create-survey', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: AIresponse
            });
            if (!generate_response.ok) throw new Error('创建失败');

            // 处理成功响应
            statusMessage.textContent = '提交成功！';
            setTimeout(() => {
                loading.style.display = 'none';
                inputField.value = ''; // 清空输入框
            }, 1000);
        }catch (error) {
            // 处理错误
            statusMessage.textContent = '提交失败，请重试';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 1000);
        }

    } catch (error) {
        // 处理错误
        statusMessage.textContent = '提交失败，请重试';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 1000);
    }
});