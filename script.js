// 全局变量
let quotesData = [];
let currentQuote = null;
let isDataLoaded = false;

// DOM 元素
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const shareBtn = document.getElementById('shareBtn');
const totalQuotesSpan = document.getElementById('totalQuotes');
const toast = document.getElementById('toast');

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeApp();
});

// 初始化应用
async function initializeApp() {
    showLoadingState();
    
    // 检查本地存储是否有缓存数据
    const cachedData = localStorage.getItem('quotesCache');
    const cacheTimestamp = localStorage.getItem('quotesCacheTimestamp');
    
    // 如果缓存存在且未过期（24小时内），使用缓存
    if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 24 * 60 * 60 * 1000) {
        try {
            const data = JSON.parse(cachedData);
            quotesData = data.quotes;
            isDataLoaded = true;
            updateTotalCount();
            displayRandomQuote();
            hideLoadingState();
            console.log('使用缓存数据，名言数量:', quotesData.length);
            return;
        } catch (error) {
            console.warn('缓存数据解析失败，重新加载:', error);
        }
    }
    
    // 加载远程数据
    await loadQuotes();
}

// 加载名言数据（分块加载优化）
async function loadQuotes() {
    try {
        showProgressBar();
        
        const response = await fetch('qutos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let chunks = [];
        let receivedLength = 0;
        const contentLength = +response.headers.get('Content-Length');
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            chunks.push(value);
            receivedLength += value.length;
            
            // 更新进度条
            if (contentLength) {
                const progress = (receivedLength / contentLength) * 100;
                updateProgressBar(progress);
            }
        }
        
        // 合并所有chunks并解析JSON
        const chunksAll = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
            chunksAll.set(chunk, position);
            position += chunk.length;
        }
        
        const result = decoder.decode(chunksAll);
        const data = JSON.parse(result);
        
        quotesData = data.quotes;
        isDataLoaded = true;
        
        // 缓存到本地存储
        localStorage.setItem('quotesCache', JSON.stringify(data));
        localStorage.setItem('quotesCacheTimestamp', Date.now().toString());
        
        updateTotalCount();
        displayRandomQuote();
        hideLoadingState();
        hideProgressBar();
        
        console.log(`成功加载 ${quotesData.length} 条名言`);
        
    } catch (error) {
        console.error('加载名言数据失败:', error);
        showErrorState('抱歉，无法加载名言数据。请检查网络连接或稍后重试。');
        hideProgressBar();
    }
}

// 显示随机名言
function displayRandomQuote() {
    if (!isDataLoaded || quotesData.length === 0) {
        return;
    }
    
    // 添加加载动画
    const quoteCard = document.querySelector('.quote-card');
    quoteCard.classList.add('loading');
    
    // 获取随机索引
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    currentQuote = quotesData[randomIndex];
    
    // 更新显示内容
    quoteText.textContent = currentQuote.quote;
    quoteAuthor.textContent = `—— ${currentQuote.author}`;
    
    // 移除加载动画
    setTimeout(() => {
        quoteCard.classList.remove('loading');
    }, 600);
    
    console.log(`显示名言 #${currentQuote.id}: ${currentQuote.author}`);
}

// 更新总数显示
function updateTotalCount() {
    totalQuotesSpan.textContent = quotesData.length.toLocaleString();
}

// 显示加载状态
function showLoadingState() {
    quoteText.innerHTML = '<span class="loading-spinner"></span> 正在加载名言数据...';
    quoteAuthor.textContent = '--';
    newQuoteBtn.disabled = true;
    shareBtn.disabled = true;
}

// 隐藏加载状态
function hideLoadingState() {
    newQuoteBtn.disabled = false;
    shareBtn.disabled = false;
}

// 显示错误状态
function showErrorState(message) {
    quoteText.textContent = message;
    quoteAuthor.textContent = '系统提示';
    totalQuotesSpan.textContent = '0';
}

// 显示进度条
function showProgressBar() {
    let progressBar = document.getElementById('progressBar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'progressBar';
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.querySelector('.quote-container').prepend(progressBar);
    }
    progressBar.style.display = 'block';
}

// 更新进度条
function updateProgressBar(progress) {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = Math.min(progress, 100) + '%';
    }
}

// 隐藏进度条
function hideProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.display = 'none';
    }
}

// 复制到剪贴板
async function copyToClipboard() {
    if (!currentQuote) {
        return;
    }
    
    const textToCopy = `"${currentQuote.quote}" —— ${currentQuote.author}`;
    
    try {
        // 现代浏览器使用 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
            showToast('名言已复制到剪贴板！');
        } else {
            // 降级方案：使用传统方法
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showToast('名言已复制到剪贴板！');
            } else {
                showToast('复制失败，请手动复制', 'error');
            }
        }
    } catch (error) {
        console.error('复制失败:', error);
        showToast('复制失败，请手动复制', 'error');
    }
}

// 显示提示消息
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 设置事件监听器
function setupEventListeners() {
    // 换一句按钮
    newQuoteBtn.addEventListener('click', function() {
        if (isDataLoaded) {
            displayRandomQuote();
        } else {
            showToast('数据正在加载中，请稍候...', 'error');
        }
    });
    
    // 复制分享按钮
    shareBtn.addEventListener('click', function() {
        if (isDataLoaded && currentQuote) {
            copyToClipboard();
        } else {
            showToast('请等待数据加载完成', 'error');
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(event) {
        // 按空格键或回车键换一句
        if ((event.code === 'Space' || event.code === 'Enter') && isDataLoaded) {
            event.preventDefault();
            displayRandomQuote();
        }
        // 按 C 键复制
        if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey) && isDataLoaded && currentQuote) {
            event.preventDefault();
            copyToClipboard();
        }
    });
    
    // 点击名言卡片也可以换一句
    document.querySelector('.quote-card').addEventListener('click', function() {
        if (isDataLoaded) {
            displayRandomQuote();
        }
    });
}

// 页面刷新时自动换一句（可选功能）
window.addEventListener('beforeunload', function() {
    // 在页面即将刷新时，可以在这里添加一些清理工作
    console.log('页面即将刷新');
});

// 导出函数供其他脚本使用（如果需要）
window.QuoteApp = {
    displayRandomQuote,
    copyToClipboard,
    getCurrentQuote: () => currentQuote,
    getTotalQuotes: () => quotesData.length
};