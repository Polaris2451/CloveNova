import {authToken,userId,TokenPulse} from "../ValidateToken.js";
// 问题类型模板
const questionTypes = {
    single_select: '单选题',
    multi_select: '多选题',
    text: '文本题'
};

// 添加新问题
function addQuestion(type = 'single_select') {
    const container = document.getElementById('questionsContainer');
    const questionId = Date.now();

    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
    <div class="input-group">
        <label>问题内容</label>
        <input type="text" class="question-input" required>
    </div>

    <div class="input-group">
        <label>问题类型</label>
        <select class="type-select" onchange="handleTypeChange(this)">
            ${Object.entries(questionTypes).map(([value, text]) => `
                <option value="${value}">${text}</option>
            `).join('')}
        </select>
    </div>

    <div class="options-container" style="${type === 'text' ? 'display:none' : ''}">
        <div class="options-list"></div>
        <button type="button" class="btn btn-secondary" 
                onclick="addOption(this)">+ 添加选项</button>
    </div>

    <button type="button" class="btn btn-danger-secondary" 
            onclick="this.parentElement.remove()" style="margin-top:1rem;">删除问题</button>
`;

    container.appendChild(card);
    if (type !== 'text') addOption(card.querySelector('.options-list'));
}

// 添加选项
function addOption(button) {
    const optionsList = button.closest('.options-container').querySelector('.options-list');
    const optionId = Date.now();

    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    optionItem.innerHTML = `
                <input type="text" placeholder="选项内容" class="option-input" required>
                <button type="button" class="btn btn-danger-primary" 
                        onclick="this.parentElement.remove()">删除</button>
            `;
    optionsList.appendChild(optionItem);
}

// 处理类型变化
function handleTypeChange(select) {
    const optionsContainer = select.closest('.question-card').querySelector('.options-container');
    optionsContainer.style.display = select.value === 'text' ? 'none' : 'block';
}

// 提交问卷
async function submitSurvey() {
    const token = localStorage.getItem('authToken')
    if (!token) {
        alert('请先登录');
        window.location.href = '/login';
        return;
    }
    const surveyData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        is_public: document.getElementById('is_public').checked,
        questions: []
    };
    // 验证标题
    if (!surveyData.title) {
        alert('请输入问卷标题');
        return;
    }
    // 收集问题数据
    const cards = document.querySelectorAll('.question-card');
    let hasError = false;
    for (const card of cards) {
        const typeSelect = card.querySelector('.type-select');
        const type = typeSelect.value;
        const contentInput = card.querySelector('.question-input');
        const content = contentInput.value.trim();
        // 验证问题内容
        if (!content) {
            alert('请填写问题内容');
            contentInput.focus();
            hasError = true;
            break;
        }
        const question = {
            content: content,
            type: type
        };
        // 处理选择题选项
        if (type !== 'text') {
            const optionInputs = card.querySelectorAll('.option-input');
            question.options = Array.from(optionInputs)
                .map(opt => opt.value.trim())
                .filter(v => v);
            // 验证选项数量
            if (question.options.length < 2) {
                alert('选择题至少需要两个选项');
                hasError = true;
                break;
            }
            question.options = JSON.stringify(question.options);
        }
        surveyData.questions.push(question);
    }
    if (hasError) return;
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://api.clovenova.cn/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(surveyData)
        });
        if (response.ok) {
            alert('创建成功！');
            window.location.href = '/';
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        alert(`提交失败: ${error.message}`);
    }
}

// 初始化页面
function init() {

    const token = localStorage.getItem('authToken')
    // 检查登录状态
    if (!token) {
        window.location.href = '/login';
        return;
    }
    // 初始加载一个空问题
    addQuestion();
}

// 初始化页面
init();
