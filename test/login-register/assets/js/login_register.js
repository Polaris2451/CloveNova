let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch_circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

let getButtons = (e) => e.preventDefault()
let changeForm = (e) => {
    // 修改类名
    switchCtn.classList.add("is-gx");
    setTimeout(function () {
        switchCtn.classList.remove("is-gx");
    }, 1500)
    switchCtn.classList.toggle("is-txr");
    switchCircle[0].classList.toggle("is-txr");
    switchCircle[1].classList.toggle("is-txr");

    switchC1.classList.toggle("is-hidden");
    switchC2.classList.toggle("is-hidden");
    aContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z");
}
// 点击切换
let shell = (e) => {
    for (var i = 0; i < allButtons.length; i++)
        allButtons[i].addEventListener("click", getButtons);
    for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm)
}
window.addEventListener("load", shell);

//
async function handleRegister(e) {
    e.preventDefault();
    const registerData = {
        username: document.getElementById('username1').value,
        password: document.getElementById('password1').value
    };
    // 这里添加实际注册逻辑
    //console.log('注册请求:', { username, password });

    try {
        const response = await fetch('https://api.clovenova.cn/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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

//
async function handleLogin(e) {
    e.preventDefault();
    const loginData = {
        username: document.getElementById('username2').value,
        password: document.getElementById('password2').value
    };
    // 这里添加实际登录逻辑
    //console.log('登录请求:', { username, password });
    try {
        const response = await fetch('https://api.clovenova.cn/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        });
        // 处理非 200 响应
        if (!response.ok) {
            const errorData = await response.json(); // 确保解析错误信息
            throw new Error(errorData.message || `登录失败 (${response.status})`);
        }
        const {token, user_id} = await response.json();
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', user_id);
        window.location.href = '/';
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
    if (urlParams.has('registered')) {
        alert('注册成功，请登录');
    }

}

init();
