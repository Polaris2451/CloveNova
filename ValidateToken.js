// 获取认证信息
export const authToken = localStorage.getItem('authToken');
export const userId = localStorage.getItem('userId');

//Token验证
export class TokenPulse {
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

export function validateToken() {
    if (!authToken) {
        window.location.href = '/login';
        return;
    }

    const pulse = new TokenPulse({
        onTokenExpired: () => {
            alert('会话已过期，请重新登录');
            window.location.href = '/login';
        }
    });
    // 登录成功后启动
    pulse.start();

    // 登出时停止
    // pulse.stop();
}