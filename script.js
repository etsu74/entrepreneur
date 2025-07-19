document.addEventListener('DOMContentLoaded', function () {

    // --- 1. ランダム背景画像の切り替え ---
    const backgroundElement = document.body;
    const backgrounds = [
        'images/bg1.jpg',
        'images/bg2.jpg',
        'images/bg3.jpg'
    ];
    let currentBgIndex = Math.floor(Math.random() * backgrounds.length);

    function changeBackground() {
        // 次の背景画像インデックスを計算
        currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
        
        // プリロード用のimg要素を作成
        const preloadImg = new Image();
        preloadImg.src = backgrounds[currentBgIndex];

        // 画像が読み込まれたら背景を切り替える
        preloadImg.onload = () => {
            backgroundElement.style.backgroundImage = `url('${backgrounds[currentBgIndex]}')`;
        };
    }

    // 初期背景を設定
    backgroundElement.style.backgroundImage = `url('${backgrounds[currentBgIndex]}')`;
    // 5秒ごとに背景を切り替え
    setInterval(changeBackground, 5000);


    // --- 2. タイプライター風アニメーション (TypeIt.js) ---
    new TypeIt("#typewriter-title", {
        strings: "ZEN大学起業サークルについて",
        speed: 120,
        waitUntilVisible: true,
        startDelay: 500,
        cursorChar: "▋",
        cursorSpeed: 1000,
    }).go();


    // --- 3. スクロールアニメーション (AOS.js) ---
    AOS.init({
        duration: 800, // アニメーションの期間
        easing: 'ease-in-out', // イージング
        once: false, // スクロールアップでもアニメーションを再生
        mirror: true, // 上下スクロールで行きと帰りのアニメーションを有効に
    });

});