
let currentPrompt = ''; 
let promptActive = true; 
let typeTimeoutId;


let prompts = [];
const languagePrompts = {
    'zh': [
        "如何设计一个能够灵活适应多种教学形式的教学空间？",
        "如何设计公共厕所？",
        "一个位于山上的酒店建筑，如何能够最大限度利用景色？",
        "如何能够在高铁车站的候车厅里提现结构建筑学",
        "一个博物馆想要对本地的文化历史进行致敬都有哪些方法？",
        "针对传承传统戏曲文化这件事情能做什么设计？",
        "如何把结构建筑学的概念落实到大型高铁站设计中？"
    ],
    'en': [
        "How to design a space that can flexibly adapt to various teaching methods?",
        "How to design public restrooms?",
        "For a hotel located on a mountain, how can the design maximize the scenery?",
        "How can the concept of structural architecture be represented in the waiting hall of a high-speed train station?",
        "What are the ways a museum can pay tribute to the local cultural history?",
        "What designs can be made to inherit the traditional opera culture?",
        "How can the concept of structural architecture be implemented into the design of a large high-speed railway station?"
    ]
};

// Messages to cycle through
let messages = [];
const languagemessages = {
    'en': [
        "Convening a mobilization meeting for architectural design researchers...",
        "Searching for case studies in every direction...",
        "Preparing the third cup of coffee for researchers...",
        "Arguing about architectural styles with historians...",
        "Reimbursing researchers for their flight tickets...",
        "Bringing back some inspiration from the future...",
        "Brainstorming with researchers around the world...",
        "Waking up lazy researchers...",
        "Collecting and organizing researchers' reports...",
        "Creating presentation documents...",
        "Analyzing ancient blueprints for inspiration...",
        "Cross-referencing global architectural trends...",
        "Negotiating with the spirits of past architects...",
        "Adjusting the scales on intricate models...",
        "Calibrating design software to perfection...",
        "Sketching out revolutionary building concepts...",
        "Deciphering cryptic construction notes...",
        "Consulting with AI for futuristic designs...",
        "Racing against time to meet the deadline...",
        "Crossing fingers and hoping for a masterpiece...",
        "Juggling between modern and traditional aesthetics...",
        "Tuning into the right creative frequency...",
        "Delving into the psychology of space...",
        "Archiving breakthrough ideas for future reference...",
        "Brewing the fourth cup of coffee for late-night brainstorming...",
        "Waiting for the eureka moment in design...",
        "Doodling potential skyscraper silhouettes...",
        "Wrangling with zoning laws and regulations...",
        "Meditating for architectural enlightenment...",
        "Celebrating small victories in design innovation..."
    ],
    'zh': [
        "正在召开建筑设计研究员动员大会...",
        "正在兵分一万路找案例查资料...",
        "正在为研究员们准备第三杯咖啡...",
        "正在和历史学家争论建筑风格...",
        "正在给研究员报销机票...",
        "正在从未来偷带回一些灵感...",
        "正在与世界各地的研究员进行思维风暴...",
        "正在叫醒偷懒的研究员...",
        "正在收集整理研究员的报告...",
        "正在制作汇报文件...",
        "正在分析古代建筑图纸寻找灵感...",
        "正在交叉参考全球建筑趋势...",
        "正在与过去建筑师的精神协商...",
        "正在调整复杂模型的比例...",
        "正在校准设计软件以达到完美...",
        "正在草拟革命性建筑概念...",
        "正在破译难解的建筑笔记...",
        "正在咨询AI未来设计...",
        "正在与时间赛跑以满足最后期限...",
        "正在交叉手指希望能创作出杰作...",
        "正在在现代与传统美学之间游走...",
        "正在调整到正确的创造性频率...",
        "正在深入研究空间心理学...",
        "正在归档突破性的想法以供将来参考...",
        "正在煮第四杯咖啡进行深夜头脑风暴...",
        "正在等待设计中的灵光一现...",
        "正在涂鸦潜在的摩天大楼轮廓...",
        "正在与分区法律和规章争执...",
        "正在冥想以求建筑启示...",
        "正在庆祝设计创新的小胜利..."
    ]
};




document.addEventListener('DOMContentLoaded', function() {
    const userLanguage = navigator.language || navigator.userLanguage; 
    const language = userLanguage.startsWith('zh') ? 'zh' : 'en'; // 如果是中文则使用'zh', 否则默认为英文'en'
    console.log('Detected user language:', language);
    // 根据检测到的语言设置prompts变量
    prompts = languagePrompts[language];
    // 根据用户的系统语言设置页面文本
    setLanguage(language);

    const textarea = document.getElementById('query');
    // 调整textarea高度以适应内容
    function autoResize() {
        this.style.height = '10px';  // 重置高度
        this.style.height = this.scrollHeight + 'px';  // 根据内容设置新高度
    }
    // 给textarea添加input事件监听器
    textarea.addEventListener('input', autoResize, false);

    let queryInput = document.querySelector('#query');
    const queryId = getQueryParam('id');

    if (queryId) {
        // 如果存在ID参数，发起请求以获取和显示保存的查询和结果
        fetchSavedQueryAndResults(queryId);
    } else {

        shuffleArray(prompts); // 洗牌数组
        typePrompts(queryInput, prompts);
}});

document.getElementById('queryForm').addEventListener('submit', function(e) { 
    e.preventDefault(); // 防止表单默认提交

    var queryInput = document.getElementById('query');
    if (promptActive && !queryInput.value) {
        queryInput.value = currentPrompt;
    }

    // 显示加载提示信息
    var loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block';
    loadingMessage.textContent = ''; // 重置文本内容
    typeMessage('loadingMessage', messages); // 重新开始打字效果

    // Call this function when you want to start the effect
    typeMessage("loadingMessage", messages);

    // 禁用提交按钮
    var submitButton = document.querySelector('input[type="submit"]');
    submitButton.disabled = true;

    // Retrieve the api_key and query from the form
    var apiKey = document.getElementById('api_key').value;
    var query = document.getElementById('query').value;

    const userLanguage = navigator.language || navigator.userLanguage; 
    const language = userLanguage.startsWith('zh') ? 'zh' : 'en'; // 如果是中文则使用'zh', 否则默认为英文'en'
    console.log('Research language:', language);
    fetch('https://1wj7134184.iok.la/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: apiKey,
            query: query,
            language: language,  
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
        // 显示结果
        displayResults(data);

        window.history.pushState({}, '', `?id=${uniqueId}`);

        loadingMessage.style.display = 'none';
        submitButton.disabled = false;
        resetLoadingMessage(); // 请求完成后重置加载提示信息
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
        displayError(error.message); // 调用显示错误的函数
    });
});


// 用于在页面上显示错误的函数
function displayError(errorMessage) {
    // 创建一个新的div元素来显示错误
    const errorElement = document.createElement('div');
    errorElement.textContent = errorMessage;
    
    // 自定义的额外内容
    const additionalContent = ' Please try again later or contact support.';
    
    // 创建另一个div来显示额外内容
    const additionalElement = document.createElement('div');
    additionalElement.textContent = additionalContent;
    
    // 设置样式
    errorElement.style.color = 'red';
    additionalElement.style.color = 'red';
    
    // 将错误消息和额外内容添加到页面上
    const container = document.createElement('div');
    container.appendChild(errorElement);
    container.appendChild(additionalElement);
  
    document.body.appendChild(container);
  }





// 更新语言
function setLanguage(language) {
    const texts = {
        'en': {
            'header-title': 'ArchInlight',
            'header-subtitle': 'Walk with grounded architectural inspiration, global design wisdom at your service.',
            'intro-text-1': 'ArchInlight is a cross-language case experience library that starts from your questions, committed to providing global architectural design wisdom and inspiration.',
            'intro-text-2': 'Please tell us the problem you want to solve directly, such as: “How to design a teaching space that can flexibly adapt to various teaching methods?”',
            'intro-text-3': 'Try not to enter just a short keyword, as accurately described problems are more likely to yield quality results.(In addition, the performance of search based on visual elements is very limited now, and we are working on a specialised visual search board.)',
            'intro-text-4': "AI's reasoning takes time, please bear with me, about 30~60 seconds.",
            'intro-text-5': 'v0.1-Early Access',
            'submit-query': 'Submit Query',
            'label-query': 'Please enter your query',
            'loading-message': 'Loading, please wait... It’s slow due to prototype stage, please be patient.'

        },
        'zh': {
            'header-title': 'ArchInlight',
            'header-subtitle': '与落地建筑灵感同行，全球设计智慧为你出谋划策。',
            'intro-text-1': 'ArchInlight是一个从问题出发的跨语言案例经验库，致力于提供全球建筑设计的智慧与灵感。',
            'intro-text-2': '请直接告诉我你想解决的问题，比如：“如何设计一个能够灵活适应多种教学形式的教学空间？”',
            'intro-text-3': '尽量不要只输入一个简短的关键词哦，准确描述的问题容易得到优质结果。（另外现在基于视觉元素的搜索性能很有限，我们正在研发专门的视觉搜索板块）',
            'intro-text-4': 'AI的推理需要时间，请海涵，大概30~60秒。',
            'intro-text-5': 'v0.1 - 龙年新春 Early Access 版 by 知筑社技术部',
            'submit-query': '提交查询',
            'label-query': '请输入问题',
            'loading-message': '请稍候...'

        }
    };

    // 更新文本
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[language][key]) {
            el.textContent = texts[language][key];
        }
    });

    // 更新输入元素的 placeholder 和 value 属性
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (texts[language][key]) {
            el.placeholder = texts[language][key];
        }
    });

    // 更新按钮的 value 属性
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        if (texts[language][key]) {
            el.value = texts[language][key];
        }
    });
}



function displayResults(data) {
    updatePageTitle(data.query) 
    var resultsContainer = document.getElementById('results');
    // var userQueryContainer = document.getElementById('userQuery');
    var summaryContainer = document.getElementById('summary');
    uniqueId = data.unique_id
    // Clear previous results
    resultsContainer.innerHTML = '';
    // userQueryContainer.innerHTML = '';
    summaryContainer.innerHTML = '';

    // 更新URL
    window.history.pushState({}, '', `?id=${data.unique_id}`);


    // 显示结论性描述
    var concludingCompendium = document.createElement('p');
    if (data.results && data.results.concluding_compendium !== undefined) {
        concludingCompendium.innerHTML = data.results.concluding_compendium.replace(/\n/g, '<br>');
        summaryContainer.appendChild(concludingCompendium);
        summaryContainer.style.display = 'block'; // 现在将#summary容器设置为可见
    } else {
        // 如果concluding_compendium未定义，则记录错误并设置默认文本
        console.error('concluding_compendium is undefined');
        concludingCompendium.innerHTML = 'No summary available.';
        summaryContainer.appendChild(concludingCompendium);
    }


    // Check if the projects array exists and is not empty
    if (data.results.projects && data.results.projects.length > 0) {  // line 114
        data.results.projects.forEach(function(project, index) {
            console.log(`Creating element for project ${index}:`, project);

            var projectElement = document.createElement('div');
            projectElement.className = 'project';

            // 创建一个包含图像的新 div
            var bgImageContainer = document.createElement('div');
            bgImageContainer.style.position = 'relative';
            bgImageContainer.style.height = '200px';
            bgImageContainer.style.overflow = 'hidden';

            // JavaScript中创建背景图片div的部分
            var bgImage = document.createElement('div');
            bgImage.style.backgroundImage = 'url(' + project.image_url + ')';
            bgImage.style.backgroundSize = 'cover';
            bgImage.style.backgroundPosition = 'center';
            bgImage.style.height = '200px'; 
            bgImage.style.width = '100%'; 
            bgImage.style.position = 'absolute';
            bgImage.style.top = '0';
            bgImage.style.left = '0';
            bgImage.style.opacity = '0.5'; // 半透明


            // 将背景图像 div 添加到容器中
            bgImageContainer.appendChild(bgImage);

            // 将 bgImageContainer 添加到项目元素
            projectElement.appendChild(bgImageContainer);

            

            var projectInfo = document.createElement('div');
            projectInfo.className = 'project-info';

            var titleElement = document.createElement('div');
            titleElement.className = 'project-title';
            titleElement.textContent = project.name;

            var descriptionElement = document.createElement('div');
            descriptionElement.className = 'project-description';
            descriptionElement.textContent = project.description;

            // 添加鼠标事件监听器到projectInfo
            projectInfo.addEventListener('mouseenter', function() {
                this.querySelector('.project-title').classList.add('hovered');
                this.querySelector('.project-description').classList.add('hovered');
            });

            projectInfo.addEventListener('mouseleave', function() {
                this.querySelector('.project-title').classList.remove('hovered');
                this.querySelector('.project-description').classList.remove('hovered');
            });

            // Wrap image and text in a link
            var linkElement = document.createElement('a');
            linkElement.href = project.hyperlink;
            linkElement.target = "_blank";
            linkElement.appendChild(bgImage);
            linkElement.appendChild(projectInfo);
            projectInfo.appendChild(titleElement);
            projectInfo.appendChild(descriptionElement);

            projectElement.appendChild(linkElement);
            resultsContainer.appendChild(projectElement);

            console.log(`Project element for ${index} added to the DOM.`);
        });
    } else {
        console.log('No projects to display');
    }
}










function typePrompts(input, prompts) {
    let promptIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;
    let typingDelay = 5000; // 打字后等待删除前的延迟时间
    let typeTimeout; // 用于存储setTimeout的变量

    // 检查输入框是否聚焦或含文本
    function checkInputFocusOrText() {
        if (input === document.activeElement || input.value !== "") {
            window.promptActive = false; // 更新全局变量
            clearTimeout(typeTimeout); // 清除挂起的setTimeout
            input.placeholder = ''; // 清除占位符文本
        } else {
            if (!window.promptActive) { // 检查全局变量
                window.promptActive = true; // 更新全局变量
                type(); // 重新启动打字动画
            }
        }
    }

    input.addEventListener('focus', checkInputFocusOrText);
    input.addEventListener('blur', checkInputFocusOrText);
    input.addEventListener('input', checkInputFocusOrText);

    function type() {
        if (!promptActive) {
            return; // 如果不应显示打字动画，则退出函数
        }

        if (promptIndex >= prompts.length) promptIndex = 0;
        let prompt = prompts[promptIndex];

        if (!isDeleting) {
            currentPrompt = prompt; // 保存完整的提示文本
            input.placeholder = prompt.substring(0, charIndex++);
            if (charIndex === prompt.length + 1) {
                isDeleting = true;
                typeTimeout = setTimeout(type, typingDelay);
            } else {
                typeTimeout = setTimeout(type, typingSpeed);
            }
        } else {
            input.placeholder = prompt.substring(0, charIndex--);
            if (charIndex === 0) {
                isDeleting = false;
                promptIndex++;
                typeTimeout = setTimeout(type, 500); // 等待一段时间再打下一条提示
            } else {
                typeTimeout = setTimeout(type, typingSpeed);
            }
        }

    }
    window.promptActive = true;
    type(); // 开始打字效果
    checkInputFocusOrText(); // 初始检查
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
    }
}



function typeMessage(elementId, messages) {
    const userLanguage = navigator.language || navigator.userLanguage; 
    const language = userLanguage.startsWith('zh') ? 'zh' : 'en'; // 如果是中文则使用'zh', 否则默认为英文'en'
    console.log('Detected user language:', language);
    messages = languagemessages[language];
    // 清除现有的定时器
    if (typeTimeoutId) {
        clearTimeout(typeTimeoutId);
    }

    let elem = document.getElementById(elementId);
    shuffleArray(messages); // 打乱消息顺序
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        // 如果已经遍历完所有消息，再次打乱并从头开始
        if (messageIndex >= messages.length) {
            messageIndex = 0;
            shuffleArray(messages);
        }

        let message = messages[messageIndex];

        if (!isDeleting) {
            elem.textContent = message.substring(0, charIndex++);
            if (charIndex === message.length + 1) {
                // 暂停一会儿，然后开始删除
                isDeleting = true;
                typeTimeoutId = setTimeout(type, 5000); // Longer pause before deleting
            } else {
                // 继续打字
                typeTimeoutId = setTimeout(type, 60);
            }
        } else {
            // 正在删除
            elem.textContent = message.substring(0, charIndex--);
            if (charIndex === 0) {
                // 一个消息被完全删除后，转到下一个消息
                isDeleting = false;
                messageIndex++;
                typeTimeoutId = setTimeout(type, 500); // Longer pause before typing next message
            } else {
                // 继续删除
                typeTimeoutId = setTimeout(type, 60);
            }
        }
    }

    type(); // 开始动画
}


// 用于清除loading信息和停止打字动画
function resetLoadingMessage() {
    if (typeTimeoutId) {
        clearTimeout(typeTimeoutId);
        typeTimeoutId = null;
    }
    let loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
        loadingMessage.textContent = '';
    }
}


// 应对带有查询参数的访问
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}


// 获取和显示保存的查询和结果
function fetchSavedQueryAndResults(queryId) {

    fetch(`https://1wj7134184.iok.la/query/${queryId}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        

        // 显示保存的查询问题到输入框
        const queryInput = document.getElementById('query');
        typePrompts(queryInput, prompts);
        queryInput.value = data.query;  // 假设后端返回的对象中包含 'query' 字段
        
        // 显示保存的查询结果
        // displayResults(data.results.projects);
        displayResults(data);
    })
    .catch(error => {
        console.error('Error fetching saved query and results:', error);
    });

}




// 根据问题更新网页标题
function updatePageTitle(query) {
    document.title = query + " - ArchInlight 解决问题的跨语言经验库";
}