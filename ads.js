// 广告配置文件 - 自动生成，请勿手动编辑
// 请使用 ad-manager.html 管理广告

const ADS_CONFIG = {
    "article_top": "",
    "article_mid1": "",
    "article_mid2": "",
    "article_mid3": "",
    "article_mid4": "",
    "article_mid5": "",
    "article_bottom": "",
    "home_top": "",
    "home_middle": "",
    "home_bottom": ""
};

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
