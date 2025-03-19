// 获取问卷ID
const urlParams = new URLSearchParams(window.location.search);
const surveyId = urlParams.get('id');

// 获取问卷数据
async function loadSurvey() {
    try {
        const response = await fetch(`/api/survey/${surveyId}`);
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
        // 临时全部渲染为单选题（正式使用时需要根据question_type判断）
        const inputHtml = question.options
            ? renderSingleChoice(question.id, question.options)
            : renderTextAnswer(question.id);
        questionDiv.innerHTML = `
                <div class="question-text">Q${index + 1}: ${question.question_text}</div>
                ${inputHtml}
            `;
        container.appendChild(questionDiv);
    });
}

function renderSingleChoice(questionId, options) {
    if (!Array.isArray(options)) throw new Error("options不是数组");
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

function renderTextAnswer(questionId) {
    return `<textarea class="text-input" rows="3"
                      name="q_${questionId}"
                      required></textarea>`;
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