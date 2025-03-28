document.addEventListener('DOMContentLoaded', function() {
    // 新话题模态框控制
    const newTopicBtn = document.getElementById('new-topic-btn');
    const newTopicModal = document.getElementById('new-topic-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    if (newTopicBtn && newTopicModal) {
        newTopicBtn.addEventListener('click', function() {
            newTopicModal.classList.add('active');
        });

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                newTopicModal.classList.remove('active');
            });
        });

        // 点击模态框外部关闭
        newTopicModal.addEventListener('click', function(e) {
            if (e.target === newTopicModal) {
                newTopicModal.classList.remove('active');
            }
        });
    }

    // 表单提交
    const newTopicForm = document.getElementById('new-topic-form');
    if (newTopicForm) {
        newTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加AJAX提交逻辑
            alert('话题已创建！');
            newTopicModal.classList.remove('active');
            newTopicForm.reset();
        });
    }

    // 返回顶部按钮
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 投票功能
    const voteBtns = document.querySelectorAll('.vote-btn');
    voteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const voteCount = this.closest('.topic-votes').querySelector('.vote-count');
            let count = parseInt(voteCount.textContent);

            if (this.classList.contains('upvote')) {
                count += 1;
            } else if (this.classList.contains('downvote')) {
                count -= 1;
            }

            voteCount.textContent = count;

            // 这里可以添加AJAX请求来保存投票状态
        });
    });
});
