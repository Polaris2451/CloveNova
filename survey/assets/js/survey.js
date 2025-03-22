// 获取问卷ID
const urlParams = new URLSearchParams(window.location.search);
const surveyId = urlParams.get('id');

// 获取问卷数据
async function loadSurvey() {
    try {
        const response = await fetch(`https://api.clovenova.cn/api/survey/${surveyId}`);
        if (!response.ok) throw new Error('问卷加载失败');

        const data = await response.json();
        renderSurvey(data);
    } catch (error) {
        alert(error.message);
    }
}

// 渲染问卷
function renderSurvey(survey) {
    document.getElementById('surveyTitle').textContent = survey.title;
    document.getElementById('surveyDescription').textContent = survey.description;

    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    survey.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-card';
        // 根据题型类型渲染不同内容
        let inputHtml = '';
        switch(question.Type) {
            case 'single_select':
                inputHtml = renderSingleChoice(question.id, question.options);
                break;

            case 'multiple_select':
                inputHtml = renderMultipleChoice(question.id, question.options);
                break;

            case 'text':
                inputHtml = renderTextAnswer(question.id);
                break;

            case 'rating':
                //inputHtml = renderRating(question.id);
                break;

            default:
                console.warn(`未知题型类型: ${question.Type}`);
                inputHtml = renderFallbackInput(question.id);
        }
        questionDiv.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Q${index + 1}</span>
                    <div class="question-text">${question.content}</div>
                </div>
                ${inputHtml}
            `;
        container.appendChild(questionDiv);
    });
}
// 渲染单选题
function renderSingleChoice(questionId, options) {
    return `<ul class="option-list">
        ${options.map(opt => `
            <li class="option-item">
                <label>
                    <input type="radio"
                           name="q_${questionId}[]"
                           value="${opt.trim()}">
                    ${opt.trim()}
                </label>
            </li>
        `).join('')}
    </ul>`;
}

// 渲染多选题
function renderMultipleChoice(questionId, options) {
    return `<ul class="option-list">
        ${options.map(opt => `
            <li class="option-item">
                <label>
                    <input type="checkbox"
                           name="q_${questionId}[]"
                           value="${opt.trim()}">
                    ${opt.trim()}
                </label>
            </li>
        `).join('')}
    </ul>`;
}

// 渲染文本题
function renderTextAnswer(questionId) {
    return `<textarea class="text-input" rows="3"
                      name="q_${questionId}"
                      required></textarea>`;
}

// 渲染评分题
// 待补充

// 渲染未知类型
// 新增的备选渲染方案
function renderFallbackInput(questionId) {
    return `<div class="error-notice">
                <p>暂不支持的题型</p>
            </div>`;
}


// 表单提交处理
document.getElementById('surveyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // 实现提交逻辑
});



// 修改初始化函数
function init() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    // 初始化加载
    loadSurvey();
}


// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', init);
