// ai-generate.js
const AI_API_ENDPOINT = 'https://api.clovenova.cn/api/ai-generate';

// 修改后的生成函数
async function generateSurvey() {
    const prompt = promptInput.value.trim();

    // 请求体保持JSON格式
    const response = await fetch(AI_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: prompt }) // 保持对象结构
    });

    // 增强响应处理
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP错误! 状态码: ${response.status}`);
    }

    return response.json(); // 直接获取结构化数据
}


function renderSurvey(data) {
    const container = document.getElementById('surveyContainer');
    const questionsContainer = document.getElementById('aiQuestionsContainer');

    // 填充基础信息
    document.getElementById('aiTitle').value = data.title || '';
    document.getElementById('aiDescription').value = data.description || '';
    document.getElementById('aiIsPublic').checked = data.is_public || false;

    // 清空现有问题
    questionsContainer.innerHTML = '';

    // 渲染问题列表
    data.questions.forEach((question, index) => {
        const questionHTML = `
      <div class="question-card" data-index="${index}">
        <div class="input-group">
          <label>问题 ${index + 1}</label>
          <input type="text" 
                 class="question-input" 
                 value="${escapeHtml(question.content)}" 
                 required>
        </div>
        
        <div class="input-group">
          <label>问题类型</label>
          <select class="type-select" onchange="handleTypeChange(this)">
            ${generateTypeOptions(question.Type)}
          </select>
        </div>

        ${renderOptions(question)}
        
        <button class="btn btn-danger-secondary" 
                onclick="this.closest('.question-card').remove()">
          删除问题
        </button>
      </div>
    `;
        questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
    });

    container.style.display = 'block';
    window.scrollTo({ top: container.offsetTop, behavior: 'smooth' });
}

// 辅助函数
function generateTypeOptions(selectedType) {
    return Object.entries({
        single_select: '单选题',
        multi_select: '多选题',
        text: '文本题'
    }).map(([value, text]) => `
    <option value="${value}" ${value === selectedType ? 'selected' : ''}>
      ${text}
    </option>
  `).join('');
}

function renderOptions(question) {
    if (question.Type === 'text') return '';

    return `
    <div class="options-container" style="margin-top:1rem;">
      <div class="options-list">
        ${question.options.map(option => `
          <div class="option-item">
            <input type="text" 
                   value="${escapeHtml(option.text)}" 
                   class="option-input" 
                   required>
            <button class="btn btn-danger-primary" 
                    onclick="this.parentElement.remove()">
              删除
            </button>
          </div>
        `).join('')}
      </div>
      <button type="button" 
              class="btn btn-secondary" 
              onclick="addOption(this)">
        + 添加选项
      </button>
    </div>
  `;
}

function showAlert(message, type) {
    const alertEl = document.createElement('div');
    alertEl.className = `generated-alert ${type}-alert`;
    alertEl.textContent = message;

    const container = document.querySelector('.ai-generator');
    container.insertBefore(alertEl, document.getElementById('loading'));

    setTimeout(() => alertEl.remove(), 3000);
}

function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
}

// 复用原始功能
window.addOption = function(button) {
    const optionsList = button.closest('.options-container').querySelector('.options-list');

    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    optionItem.innerHTML = `
    <input type="text" placeholder="选项内容" class="option-input" required>
    <button class="btn btn-danger-primary" 
            onclick="this.parentElement.remove()">
      删除
    </button>
  `;

    optionsList.appendChild(optionItem);
    optionItem.querySelector('input').focus();
};

window.handleTypeChange = function(select) {
    const card = select.closest('.question-card');
    const optionsContainer = card.querySelector('.options-container');
    optionsContainer.style.display = select.value === 'text' ? 'none' : 'block';
};
