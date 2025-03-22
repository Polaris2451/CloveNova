document.addEventListener('DOMContentLoaded', () => {
    // 动态生成技能列表
    const history = ['问卷1', '问卷2', '设计用户命名', '跟问卷一起打包', '这是个数组', '存在js里', '接口待完善', '点击待完善'];
    const historyList = document.querySelector('.history-list');

    history.forEach(history => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.textContent = history;
        historyList.appendChild(li);
    });

    // 头像悬停效果
    const avatar = document.querySelector('.avatar-container');
    avatar.addEventListener('mouseenter', () => {
        avatar.style.transform = 'scale(1.05) rotate(5deg)';
    });
    avatar.addEventListener('mouseleave', () => {
        avatar.style.transform = 'scale(1) rotate(0deg)';
    });

    // 滚动动画
    const animateOnScroll = () => {
        const historySection = document.querySelector('.history-section');
        const sectionTop = historySection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight * 0.85) {
            historySection.style.opacity = '1';
            historySection.style.transform = 'translateY(0)';
        }
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始化检查
});
