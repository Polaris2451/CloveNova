import {authToken,userId,TokenPulse} from "../../ValidateToken";

// 初始化函数
function init() {
    if (!authToken) {
        window.location.href = '/login';
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