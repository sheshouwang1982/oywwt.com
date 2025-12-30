// 广告管理系统 JavaScript

// 广告数据存储
let adsData = {
    article_top: '',
    article_mid1: '',
    article_mid2: '',
    article_mid3: '',
    article_mid4: '',
    article_mid5: '',
    article_bottom: '',
    home_top: '',
    home_middle: '',
    home_bottom: ''
};

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', function() {
    loadAllAds();
});

// 切换标签页
function switchTab(tab) {
    // 移除所有激活状态
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // 激活选中的标签
    event.target.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
}

// 加载所有广告
function loadAllAds() {
    // 从 localStorage 加载广告数据
    const savedData = localStorage.getItem('adsData');
    if (savedData) {
        adsData = JSON.parse(savedData);
    }

    // 加载到界面
    for (let key in adsData) {
        const textarea = document.getElementById('ad-' + key);
        if (textarea) {
            textarea.value = adsData[key];
            updateStatus(key);
        }
    }
}

// 保存单个广告
function saveAd(adId) {
    const textarea = document.getElementById('ad-' + adId);
    adsData[adId] = textarea.value.trim();

    // 保存到 localStorage
    localStorage.setItem('adsData', JSON.stringify(adsData));

    // 更新到 ads.js 文件
    updateAdsFile();

    updateStatus(adId);
    showSuccessMessage('广告位 "' + adId + '" 已保存');
}

// 清空广告
function clearAd(adId) {
    if (confirm('确定要清空这个广告位吗？')) {
        const textarea = document.getElementById('ad-' + adId);
        textarea.value = '';
        adsData[adId] = '';

        localStorage.setItem('adsData', JSON.stringify(adsData));
        updateAdsFile();
        updateStatus(adId);

        // 隐藏预览
        const preview = document.getElementById('preview-' + adId);
        if (preview) {
            preview.style.display = 'none';
        }

        showSuccessMessage('广告位 "' + adId + '" 已清空');
    }
}

// 预览广告
function previewAd(adId) {
    const textarea = document.getElementById('ad-' + adId);
    const preview = document.getElementById('preview-' + adId);

    if (textarea.value.trim()) {
        preview.innerHTML = textarea.value;
        preview.style.display = 'block';
    } else {
        alert('广告代码为空，无法预览');
    }
}

// 更新状态显示
function updateStatus(adId) {
    const statusEl = document.getElementById('status-' + adId);
    if (statusEl) {
        if (adsData[adId] && adsData[adId].trim()) {
            statusEl.textContent = '已激活';
            statusEl.className = 'ad-status status-active';
        } else {
            statusEl.textContent = '未激活';
            statusEl.className = 'ad-status status-inactive';
        }
    }
}

// 保存所有广告
function saveAll() {
    // 收集所有广告数据
    for (let key in adsData) {
        const textarea = document.getElementById('ad-' + key);
        if (textarea) {
            adsData[key] = textarea.value.trim();
        }
    }

    // 保存到 localStorage
    localStorage.setItem('adsData', JSON.stringify(adsData));

    // 更新到 ads.js 文件
    updateAdsFile();

    // 更新所有状态
    for (let key in adsData) {
        updateStatus(key);
    }

    showSuccessMessage('所有广告已保存成功！');
}

// 更新 ads.js 文件内容（生成供网站使用的文件）
function updateAdsFile() {
    // 生成 ads.js 文件内容
    const adsFileContent = `// 广告配置文件 - 自动生成，请勿手动编辑
// 请使用 ad-manager.html 管理广告

const ADS_CONFIG = ${JSON.stringify(adsData, null, 4)};

// 加载广告到页面
function loadAd(adId) {
    const adContainer = document.getElementById('ad-container-' + adId);
    if (adContainer && ADS_CONFIG[adId]) {
        adContainer.innerHTML = ADS_CONFIG[adId];
        adContainer.style.display = 'block';
    }
}

// 加载所有广告
function loadAllPageAds() {
    for (let adId in ADS_CONFIG) {
        loadAd(adId);
    }
}

// 页面加载完成后自动加载广告
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllPageAds);
} else {
    loadAllPageAds();
}
`;

    // 显示下载提示
    console.log('ads.js 内容已更新');

    // 提供下载功能
    downloadAdsFile(adsFileContent);
}

// 下载 ads.js 文件
function downloadAdsFile(content) {
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ads.js';

    // 自动下载
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('ads.js 文件已生成，请将其放置在网站根目录');
}

// 显示成功消息
function showSuccessMessage(message) {
    const msgEl = document.getElementById('successMsg');
    msgEl.textContent = '✅ ' + message;
    msgEl.style.display = 'block';

    setTimeout(function() {
        msgEl.style.display = 'none';
    }, 3000);
}

// 导出配置
function exportConfig() {
    const dataStr = JSON.stringify(adsData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ads-config-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导入配置
function importConfig(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            adsData = imported;
            localStorage.setItem('adsData', JSON.stringify(adsData));
            loadAllAds();
            showSuccessMessage('配置导入成功！');
        } catch (error) {
            alert('配置文件格式错误');
        }
    };
    reader.readAsText(file);
}
