document.addEventListener('DOMContentLoaded', function() {
    // 导航栏交互
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.navbar-nav');
    const navActions = document.querySelector('.nav-actions');

    // 滚动效果
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 移动菜单切换
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // 返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 关闭移动菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navActions.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // 响应式调整
    function handleResize() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navActions.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    }
    window.addEventListener('resize', handleResize);

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 简单表单验证
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]');
            if (validateEmail(email.value)) {
                this.submit();
            } else {
                email.classList.add('error');
                setTimeout(() => email.classList.remove('error'), 2000);
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
