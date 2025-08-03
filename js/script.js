/**
 * ZEN大学起業サークル - JavaScript
 * ===============================================
 */

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    initBackgroundSlider();
    initSmoothScroll();
    initEventScroll();
    initDocumentCards();
    initScrollAnimations();
    initMobileOptimizations();
});

// リサイズイベント
window.addEventListener('resize', function() {
    handleResize();
});

/**
 * 背景スライダーのアニメーション（クロスフェード効果）
 */
function initBackgroundSlider() {
    const slides = document.querySelectorAll('.background-slide');
    let currentSlide = 0;
    let isTransitioning = false; // トランジション中の重複実行を防ぐ

    if (slides.length === 0) return;

    // デバッグ用：スライド要素の確認
    console.log('Found slides:', slides.length);
    slides.forEach((slide, index) => {
        console.log(`Slide ${index}:`, slide.className);
    });

    function crossFadeToNext() {
        if (isTransitioning) return; // トランジション中は実行しない
        
        isTransitioning = true;
        const prevSlideIndex = currentSlide;
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        
        const prevSlide = slides[prevSlideIndex];
        const nextSlide = slides[nextSlideIndex];
        
        console.log(`Cross-fade: ${prevSlideIndex} → ${nextSlideIndex}`);
        
        // クラスをリセット
        slides.forEach(slide => {
            slide.classList.remove('active', 'next', 'prev');
        });
        
        // 現在のスライドにprevクラスを追加（フェードアウト）
        prevSlide.classList.add('prev');
        
        // 次のスライドにnextクラスを追加（フェードイン）
        nextSlide.classList.add('next');
        
        // アニメーション完了後の処理
        setTimeout(() => {
            // クラスを整理
            slides.forEach(slide => {
                slide.classList.remove('active', 'next', 'prev');
            });
            
            // 新しいアクティブスライドを設定
            nextSlide.classList.add('active');
            currentSlide = nextSlideIndex;
            isTransitioning = false;
            
            console.log(`Cross-fade completed. Active slide: ${currentSlide}`);
            
            // デバッグ用：現在の背景画像を確認
            const computedStyle = window.getComputedStyle(nextSlide);
            console.log(`Current background: ${computedStyle.backgroundImage}`);
            
        }, 2000); // アニメーション時間と合わせる（2秒）
    }

    // 初回実行前に少し待つ
    setTimeout(() => {
        console.log('Starting cross-fade background slider...');
        
        // 6秒間隔で背景をクロスフェード（アニメーション時間2秒 + 表示時間4秒）
        const slideInterval = setInterval(crossFadeToNext, 6000);
        
        // 手動でテスト実行（デバッグ用）
        window.testCrossFade = crossFadeToNext;
        
        // ページの可視性に応じてアニメーションを制御
        let intervalId = slideInterval;
        
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(intervalId);
                console.log('Cross-fade slider paused');
            } else {
                // ページが再表示された時にインターバルを再開
                intervalId = setInterval(crossFadeToNext, 6000);
                console.log('Cross-fade slider resumed');
            }
        });
        
    }, 1000);
}

/**
 * スムーススクロール機能
 */
function initSmoothScroll() {
    // ページ内リンクのスムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80; // ヘッダーの高さ分オフセット
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * イベントボタンの横スクロール機能
 */
function initEventScroll() {
    const container = document.querySelector('.events-container');
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // マウスイベント
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    // タッチイベント（モバイル対応）
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    function handleMouseDown(e) {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    }

    function handleMouseLeave() {
        isDown = false;
        container.style.cursor = 'grab';
    }

    function handleMouseUp() {
        isDown = false;
        container.style.cursor = 'grab';
    }

    function handleMouseMove(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // スクロール速度調整
        container.scrollLeft = scrollLeft - walk;
    }

    function handleTouchStart(e) {
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    }

    function handleTouchEnd() {
        isDown = false;
    }

    function handleTouchMove(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    }

    // ホイールスクロール対応
    container.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            // 横スクロールの場合
            e.preventDefault();
            container.scrollLeft += e.deltaX;
        } else {
            // 縦スクロールの場合は横スクロールに変換
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        }
    });
}

/**
 * ドキュメントカードのインタラクション
 */
function initDocumentCards() {
    const cards = document.querySelectorAll('.document-card');
    
    cards.forEach(card => {
        // クリックイベント
        card.addEventListener('click', function() {
            const documentType = this.getAttribute('data-document');
            const documentTitle = this.querySelector('h4').textContent;
            
            // ここでPDFを開く、モーダルを表示するなどの処理を実装
            console.log(`Document clicked: ${documentTitle} (${documentType})`);
            
            // 実際の実装例（PDFファイルを開く）
            // window.open(`documents/${documentType}.pdf`, '_blank');
            
            // またはモーダル表示
            showDocumentModal(documentTitle, documentType);
        });

        // ホバーエフェクトの強化
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * ドキュメントモーダル表示（簡易版）
 */
function showDocumentModal(title, type) {
    // 簡易的なアラート表示（実際にはBootstrapモーダルなどを使用）
    const message = `「${title}」を表示します。\n\n実際の実装では、PDFビューアーやモーダルウィンドウでドキュメントを表示します。`;
    
    if (confirm(message + '\n\nOKを押すと新しいタブでPDFを開きます（デモ）。')) {
        // デモ用：実際のPDFの代わりにサンプルPDFを表示
        window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    }
}

/**
 * スクロールアニメーション
 */
function initScrollAnimations() {
    // Intersection Observer を使用した要素の表示アニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.document-card, .event-button, .section-title');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * モバイル最適化
 */
function initMobileOptimizations() {
    // モバイルデバイスの検出
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // モバイル専用の最適化
        optimizeForMobile();
    }

    // タッチデバイスでのホバー効果の調整
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // タッチデバイス用のCSSを追加
        const style = document.createElement('style');
        style.textContent = `
            .touch-device .document-card:hover {
                transform: none;
            }
            .touch-device .event-button:hover {
                transform: none;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * モバイル専用最適化
 */
function optimizeForMobile() {
    // ビューポートの高さ調整（モバイルブラウザのアドレスバー対応）
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);

    // ヒーローセクションの高さ調整
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.height = 'calc(var(--vh, 1vh) * 100)';
    }

    // モバイルでのタッチフィードバック改善
    const touchElements = document.querySelectorAll('.event-button, .document-card, .footer-section a');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.opacity = '1';
            }, 150);
        });
    });
}

/**
 * ウィンドウリサイズ処理
 */
function handleResize() {
    // レスポンシブ対応の追加処理
    const windowWidth = window.innerWidth;
    
    // モバイル表示の切り替え
    if (windowWidth <= 768) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }

    // イベントコンテナのスクロール位置リセット
    const eventsContainer = document.querySelector('.events-container');
    if (eventsContainer) {
        eventsContainer.scrollLeft = 0;
    }
}

/**
 * パフォーマンス最適化
 */
function initPerformanceOptimizations() {
    // 画像の遅延読み込み（Lazy Loading）
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // IntersectionObserver非対応ブラウザ用のフォールバック
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * アクセシビリティ対応
 */
function initAccessibilityFeatures() {
    // キーボードナビゲーション対応
    document.addEventListener('keydown', function(e) {
        // Escキーでモーダルを閉じる（将来の実装用）
        if (e.key === 'Escape') {
            closeModals();
        }
        
        // Tabキーでのフォーカス管理
        if (e.key === 'Tab') {
            handleTabNavigation(e);
        }
    });

    // フォーカス表示の改善
    const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

/**
 * モーダル閉じる処理（将来の実装用）
 */
function closeModals() {
    // モーダルが実装された際の閉じる処理
    console.log('Close modals (placeholder)');
}

/**
 * Tabナビゲーション処理
 */
function handleTabNavigation(e) {
    // カスタムTabナビゲーション（必要に応じて実装）
    const focusableElements = document.querySelectorAll(
        'a:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

/**
 * エラーハンドリング
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // 本番環境では適切なエラーレポーティングサービスに送信
});

/**
 * 初期化完了後の処理
 */
function onInitComplete() {
    console.log('ZEN大学起業サークル - サイト初期化完了');
    
    // パフォーマンス測定（開発用）
    if (performance && performance.now) {
        const loadTime = performance.now();
        console.log(`サイト読み込み時間: ${loadTime.toFixed(2)}ms`);
    }
}

// 全ての初期化が完了した後に実行
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(onInitComplete, 100);
});

/**
 * ユーティリティ関数
 */

// デバウンス関数（パフォーマンス最適化用）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数（パフォーマンス最適化用）
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 最適化されたリサイズハンドラー
const optimizedResize = debounce(handleResize, 250);
window.addEventListener('resize', optimizedResize);