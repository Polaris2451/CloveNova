// 问题类型模板
const questionTypes = {
    single_select: { text: '单选题', icon: 'far fa-dot-circle' },
    multi_select: { text: '多选题', icon: 'far fa-check-square' },
    text: { text: '文本题', icon: 'far fa-comment-dots' }
};

// 添加新问题
function addQuestion(type = 'single_select') {
    const container = document.getElementById('questionsContainer');
    const questionId = Date.now();

    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.questionId = questionId;
    card.innerHTML = `
        <div class="question-header">
            <div class="input-group">
                <label>问题内容 <span class="required">*</span></label>
                <input type="text" class="question-input" placeholder="请输入问题内容..." required>
            </div>
            
            <div class="input-group">
                <label>问题类型</label>
                <select class="type-select" onchange="handleTypeChange(this)">
                    ${Object.entries(questionTypes).map(([value, data]) => `
                        <option value="${value}" ${type === value ? 'selected' : ''}>
                            <i class="${data.icon}"></i> ${data.text}
                        </option>
                    `).join('')}
                </select>
            </div>
        </div>

        <div class="options-container" style="${type === 'text' ? 'display:none' : ''}">
            <label>选项设置</label>
            <div class="options-list"></div>
            <button type="button" class="btn btn-secondary" onclick="addOption(this)">
                <i class="fas fa-plus"></i> 添加选项
            </button>
        </div>

        <div class="question-footer">
            <button type="button" class="btn btn-danger" onclick="removeQuestion(this)">
                <i class="fas fa-trash"></i> 删除问题
            </button>
        </div>
    `;

    container.appendChild(card);

    // 如果是选择题，默认添加2个选项
    if (type !== 'text') {
        addOption(card.querySelector('.options-list'));
        addOption(card.querySelector('.options-list'));
    }

    // 滚动到新添加的问题
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    return card;
}

// 添加选项
function addOption(button) {
    const optionsList = button ? button.closest('.options-container').querySelector('.options-list') : button;
    const optionId = Date.now();

    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    optionItem.innerHTML = `
        <input type="text" placeholder="输入选项内容" class="option-input" required>
        <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    optionsList.appendChild(optionItem);

    // 自动聚焦到新添加的选项
    optionItem.querySelector('input').focus();
}

// 删除问题
function removeQuestion(button) {
    const card = button.closest('.question-card');
    const questions = document.querySelectorAll('.question-card');

    // 如果只剩一个问题，显示通知而不是删除
    if (questions.length <= 1) {
        showNotification('问卷至少需要一个问题', 'warning');
        return;
    }

    card.classList.add('removing');
    setTimeout(() => {
        card.remove();
        showNotification('问题已删除', 'success');
    }, 300);
}

// 处理类型变化
function handleTypeChange(select) {
    const card = select.closest('.question-card');
    const optionsContainer = card.querySelector('.options-container');
    const optionsList = card.querySelector('.options-list');

    if (select.value === 'text') {
        optionsContainer.style.display = 'none';
        // 清空选项
        optionsList.innerHTML = '';
    } else {
        optionsContainer.style.display = 'block';
        // 如果选项为空，添加2个默认选项
        if (optionsList.children.length === 0) {
            addOption(optionsList);
            addOption(optionsList);
        }
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `floating-notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 表单验证
function validateForm() {
    const title = document.getElementById('title').value.trim();
    if (!title) {
        showNotification('请输入问卷标题', 'error');
        document.getElementById('title').focus();
        return false;
    }

    const questions = document.querySelectorAll('.question-card');
    if (questions.length === 0) {
        showNotification('请至少添加一个问题', 'error');
        return false;
    }

    let isValid = true;
    questions.forEach((card, index) => {
        const questionInput = card.querySelector('.question-input');
        const typeSelect = card.querySelector('.type-select');
        const options = card.querySelectorAll('.option-input');

        // 验证问题内容
        if (!questionInput.value.trim()) {
            showNotification(`问题 #${index + 1} 内容不能为空`, 'error');
            questionInput.focus();
            isValid = false;
            return;
        }

        // 验证选择题选项
        if (typeSelect.value !== 'text') {
            const validOptions = Array.from(options).filter(opt => opt.value.trim());
            if (validOptions.length < 2) {
                showNotification(`问题 #${index + 1} 至少需要两个有效选项`, 'error');
                isValid = false;
                return;
            }
        }
    });

    return isValid;
}

// 提交问卷
async function submitSurvey() {
    // 验证token
    const token = localStorage.getItem('authToken');
    if (!token) {
        showNotification('请先登录', 'error');
        setTimeout(() => window.location.href = '/login', 1500);
        return;
    }

    // 表单验证
    if (!validateForm()) return;

    // 收集数据
    const surveyData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        is_public: document.getElementById('is_public').checked,
        questions: []
    };

    // 收集问题数据
    const cards = document.querySelectorAll('.question-card');
    cards.forEach(card => {
        const typeSelect = card.querySelector('.type-select');
        const type = typeSelect.value;
        const contentInput = card.querySelector('.question-input');

        const question = {
            content: contentInput.value.trim(),
            type: type,
            options: []
        };

        // 处理选择题选项
        if (type !== 'text') {
            const optionInputs = card.querySelectorAll('.option-input');
            question.options = Array.from(optionInputs)
                .map(opt => {
                    const text = opt.value.trim();
                    return text ? { text } : null;
                })
                .filter(Boolean);
        }

        surveyData.questions.push(question);
    });

    try {
        showNotification('正在提交问卷...', 'info');

        const response = await fetch('https://api.clovenova.cn/api/create-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(surveyData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '提交失败');
        }

        showNotification('问卷创建成功!', 'success');
        setTimeout(() => window.location.href = '/', 1500);
    } catch (error) {
        console.error('提交错误:', error);
        showNotification(`提交失败: ${error.message}`, 'error');
    }
}

// 初始化字符计数器
function initCharCounter() {
    const textarea = document.getElementById('description');
    const counter = document.getElementById('charCount');

    textarea.addEventListener('input', () => {
        counter.textContent = textarea.value.length;
    });
}

// 初始化页面
function init() {
    // 检查登录状态
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // 初始加载一个空问题
    addQuestion();

    // 初始化字符计数器
    initCharCounter();

    // 添加公共/私有切换事件
    document.getElementById('is_public').addEventListener('change', function() {
        const status = this.checked ? '公开' : '私有';
        showNotification(`问卷已设置为${status}`, 'info');
    });

    // 预览按钮事件
    document.querySelector('.btn-preview')?.addEventListener('click', previewSurvey);
}

// 预览问卷
function previewSurvey() {
    if (!validateForm()) return;

    // 这里可以添加预览逻辑
    showNotification('预览功能将在下一步实现', 'info');
}

// 初始化页面
document.addEventListener('DOMContentLoaded', init);
