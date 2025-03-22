// 私有方法：获取最新token（每次实时读取）
const getCurrentToken = () => localStorage.getItem('authToken') || '';

// 私有类：仅模块内使用
class TokenPulse {
    constructor({
                    checkInterval = 60000,
                    endpoint = 'https://api.clovenova.cn/api/validate-token',
                    onTokenExpired = () => window.location.href = '/login'
                } = {}) {
        this.timer = null;
        this.checkInterval = checkInterval;
        this.endpoint = endpoint;
        this.onTokenExpired = onTokenExpired;
        this.checkToken(); // 立即执行首次验证
    }

    start() {
        if (this.timer) return;
        this.timer = setInterval(() => this.checkToken(), this.checkInterval);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    async checkToken() {
        try {
            const response = await fetch(this.endpoint, {
                headers: { 'Authorization': `Bearer ${getCurrentToken()}` }
            });

            if (response.status === 401) {
                this.onTokenExpired();
                this.stop();
            }
        } catch (error) {
            console.error('Token check failed:', error);
        }
    }
}

export function validateToken() {
    // 实时检查token是否存在
    if (!getCurrentToken()) {
        window.location.href = '/login';
        return null; // 返回null表示未通过验证
    }

    // 创建并启动心跳实例
    const pulse = new TokenPulse({
        onTokenExpired: () => {
            alert('会话已过期，请重新登录');
            localStorage.clear();
            window.location.href = '/login';
        }
    });
    pulse.start();

    return pulse; // 返回实例以便后续控制
}
