// 全局变量
let quotesData = [];
let currentQuote = null;

// DOM 元素
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const shareBtn = document.getElementById('shareBtn');
const totalQuotesSpan = document.getElementById('totalQuotes');
const toast = document.getElementById('toast');

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    setupEventListeners();
});

// 加载名言数据
async function loadQuotes() {
    try {
        const response = await fetch('qutos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        quotesData = data.quotes;
        
        // 更新总数显示
        totalQuotesSpan.textContent = quotesData.length.toLocaleString();
        
        // 显示第一条随机名言
        displayRandomQuote();
        
        console.log(`成功加载 ${quotesData.length} 条名言`);
    } catch (error) {
        console.error('加载名言数据失败:', error);
        quoteText.textContent = '抱歉，无法加载名言数据。请检查网络连接或稍后重试。';
        quoteAuthor.textContent = '系统提示';
        totalQuotesSpan.textContent = '0';
    }
}

// 显示随机名言
function displayRandomQuote() {
    if (quotesData.length === 0) {
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
    }, 500);
    
    console.log(`显示名言 #${currentQuote.id}: ${currentQuote.author}`);
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
    newQuoteBtn.addEventListener('click', displayRandomQuote);
    
    // 复制分享按钮
    shareBtn.addEventListener('click', copyToClipboard);
    
    // 键盘快捷键
    document.addEventListener('keydown', function(event) {
        // 按空格键或回车键换一句
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            displayRandomQuote();
        }
        // 按 C 键复制
        if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            copyToClipboard();
        }
    });
    
    // 点击名言卡片也可以换一句
    document.querySelector('.quote-card').addEventListener('click', displayRandomQuote);
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