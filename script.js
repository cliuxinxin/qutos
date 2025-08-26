// 全局变量
let quotesData = [];
let currentQuote = null;
let pool = [];

// DOM 元素
const card = document.getElementById('card');
const $text = document.getElementById('text');
const $author = document.getElementById('author');
const $source = document.getElementById('source');

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
async function initializeApp() {
    await loadQuotes();
    next(); // 显示第一条名言
}

// 加载名言数据
async function loadQuotes() {
    try {
        // 修复GitHub Pages路径问题 - 使用绝对路径
        const basePath = window.location.pathname.includes('/qutos/') ? '/qutos/' : '/';
        const response = await fetch(`${basePath}qutos.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 转换数据格式以兼容 protype.html 的格式
        quotesData = data.quotes.map(item => ({
            text: item.quote,
            author: item.author,
            lang: detectLanguage(item.quote),
            source: '' // 你的原始数据没有source字段
        }));
        
        // 初始化随机引擎
        pool = [...quotesData];
        
        console.log(`成功加载 ${quotesData.length} 条名言`);
        
    } catch (error) {
        console.error('加载名言数据失败:', error);
        console.log('当前URL:', window.location.href);
        console.log('尝试加载的路径:', `${window.location.pathname.includes('/qutos/') ? '/qutos/' : '/'}qutos.json`);
        toast('数据加载失败，请检查网络连接');
        quotesData = [];
        pool = [];
    }
}

// 语言检测函数
function detectLanguage(text) {
    // 简单的中文检测
    return /[\u4e00-\u9fff]/.test(text) ? 'zh' : 'en';
}

// 随机引擎：无重复轮询
function pick() {
    if (pool.length === 0) pool = [...quotesData];
    const i = crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
    const item = pool.splice(i, 1)[0];
    return item;
}

// 渲染名言
function render(q) {
    if (card.classList.contains('show')) card.classList.remove('show');
    $text.textContent = q.text;
    $text.setAttribute('data-lang', q.lang || '');
    $author.textContent = q.author ? `— ${q.author}` : '';
    $source.textContent = q.source ? q.source : '';
    currentQuote = q;
    requestAnimationFrame(() => { card.classList.add('show'); });
}

// 动作函数
function next() { 
    render(pick()); 
}

function copy() {
    const payload = [$text.textContent, $author.textContent].filter(Boolean).join('\n');
    navigator.clipboard?.writeText(payload).then(() => toast('已复制')).catch(() => toast('无法复制'));
}

function speak() {
    if (!('speechSynthesis' in window)) return toast('设备不支持朗读');
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance([$text.textContent, $author.textContent].join(' '));
    // 简单的语言猜测
    utter.lang = ($text.getAttribute('data-lang') === 'zh') ? 'zh-CN' : 'en-US';
    window.speechSynthesis.speak(utter);
}

// 轻提示
let toastTimer;
function toast(msg) {
    clearTimeout(toastTimer);
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        Object.assign(el.style, {
            position: 'fixed', left: '50%', bottom: '28px', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '10px 14px', borderRadius: '999px',
            fontSize: '14px', zIndex: 9999, opacity: 0, transition: 'opacity .25s ease'
        });
        document.body.appendChild(el);
    }
    el.textContent = msg; 
    el.style.opacity = 1;
    toastTimer = setTimeout(() => { el.style.opacity = 0; }, 1200);
}

// 事件监听
document.getElementById('newBtn').addEventListener('click', next);
document.getElementById('copyBtn').addEventListener('click', copy);
document.getElementById('speakBtn').addEventListener('click', speak);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { 
        e.preventDefault(); 
        next(); 
    }
    if (e.key === 'c' || e.key === 'C') { 
        copy(); 
    }
    if (e.key === 's' || e.key === 'S') { 
        speak(); 
    }
});

// 导出函数供其他脚本使用（如果需要）
window.QuoteApp = {
    next,
    copy,
    speak,
    getCurrentQuote: () => currentQuote,
    getTotalQuotes: () => quotesData.length
};