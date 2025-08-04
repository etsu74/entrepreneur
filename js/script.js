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
    initImageModal(); // 画像モーダル機能を追加
    initScrollIndicator(); // ← この行を追加　画面スクロール矢印
});

// リサイズイベント
window.addEventListener('resize', function() {
    handleResize();
});

/**
背景スライダーのアニメーション（クロスフェード効果）
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

    // 初期化：最初のスライドを薄い状態で準備
    function initFirstSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'next', 'prev');
            if (index === 0) {
                // 最初のスライドを薄い状態で表示
                slide.style.opacity = '0.1'; // 完全透明ではなく、薄い状態
                slide.classList.add('active');
            } else {
                slide.style.opacity = '0'; // 他は完全に非表示
            }
        });
        
        console.log('Starting initial fade-in for first slide from dim to full opacity');
        
        // 500ms後に最初のスライドをフェードイン開始
        setTimeout(() => {
            const firstSlide = slides[0];
            firstSlide.style.transition = 'opacity 2s ease-in-out';
            firstSlide.style.opacity = '1'; // 薄い → 濃い
            
            // フェードイン完了後の処理
            setTimeout(() => {
                firstSlide.style.transition = ''; // トランジションをリセット
                console.log('Initial slide fade-in completed');
            }, 2000);
            
        }, 500);
    }

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
            slide.style.opacity = ''; // インラインスタイルをリセット
            slide.style.transition = ''; // トランジションをリセット
        });
        
        // 現在のスライドにprevクラスを追加（フェードアウト）
        prevSlide.classList.add('prev');
        prevSlide.style.opacity = '1'; // 開始状態を明示
        
        // 次のスライドにnextクラスを追加（フェードイン）
        nextSlide.classList.add('next');
        nextSlide.style.opacity = '0'; // 開始状態を明示
        
        // アニメーション完了後の処理
        setTimeout(() => {
            // クラスを整理
            slides.forEach(slide => {
                slide.classList.remove('active', 'next', 'prev');
                slide.style.opacity = ''; // インラインスタイルをリセット
                slide.style.transition = ''; // トランジションをリセット
            });
            
            // 新しいアクティブスライドを設定
            nextSlide.classList.add('active');
            nextSlide.style.opacity = '1'; // 確実に表示
            currentSlide = nextSlideIndex;
            isTransitioning = false;
            
            console.log(`Cross-fade completed. Active slide: ${currentSlide}`);
            
            // デバッグ用：現在の背景画像を確認
            const computedStyle = window.getComputedStyle(nextSlide);
            console.log(`Current background: ${computedStyle.backgroundImage}`);
            
        }, 2000); // アニメーション時間と合わせる（2秒）
    }

    // 初期化実行
    setTimeout(() => {
        console.log('Starting cross-fade background slider with smooth initial fade-in...');
        
        // 最初のスライドを薄い状態から濃い状態へフェードイン
        initFirstSlide();
        
        // 4秒後（初回フェードイン2秒 + 表示2秒）に最初のトランジション開始
        setTimeout(() => {
            crossFadeToNext();
            
            // 以降は6秒間隔で背景をクロスフェード
            const slideInterval = setInterval(crossFadeToNext, 6000);
            
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
            
        }, 4000); // 初回フェードイン(2秒) + 表示時間(2秒)
        
        // 手動でテスト実行（デバッグ用）
        window.testCrossFade = crossFadeToNext;
        
    }, 200); // ページ読み込み後少し待つ
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
 * 画像表示モーダル機能
 */
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('imageCaption');
    const closeBtn = document.querySelector('.image-modal-close');
    
    if (!modal || !modalImage || !modalCaption || !closeBtn) {
        console.error('Modal elements not found');
        return;
    }

    // data-image属性を持つイベントボタンにクリックイベントを追加
    const imageButtons = document.querySelectorAll('.event-button[data-image]');
    
    imageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const imagePath = this.getAttribute('data-image');
            const buttonText = this.textContent.trim();
            
            if (imagePath) {
                showImageModal(imagePath, buttonText);
            }
        });
    });

    // モーダルを表示する関数
    function showImageModal(imagePath, caption) {
        const fullImagePath = `images/${imagePath}`;
        
        console.log(`Opening image: ${fullImagePath}`);
        
        // 画像を設定
        modalImage.src = fullImagePath;
        modalImage.alt = caption;
        modalCaption.textContent = caption;
        
        // モーダルを表示
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // 画像読み込みエラーの処理
        modalImage.onerror = function() {
            console.error(`Failed to load image: ${fullImagePath}`);
            modalCaption.textContent = `画像の読み込みに失敗しました: ${caption}`;
            modalImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuOCpOODoeODvOOCuOOBjuimi+OBpOOBi+OCiuOBvuOBm+OCkyDjgJDjgJE8L3RleHQ+PC9zdmc+';
        };
        
        // 成功時のログ
        modalImage.onload = function() {
            console.log(`Image loaded successfully: ${fullImagePath}`);
        };
    }

    // モーダルを閉じる関数
    function closeImageModal() {
        modal.classList.add('fade-out');
        
        setTimeout(() => {
            modal.classList.remove('show', 'fade-out');
            modal.style.display = 'none';
            modalImage.src = '';
            modalCaption.textContent = '';
        }, 300);
    }

    // 閉じるボタンのクリックイベント
    closeBtn.addEventListener('click', closeImageModal);

    // モーダル背景のクリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeImageModal();
        }
    });

    console.log('Image modal initialized');
}

/**
 * スクロールインジケーター機能
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) {
        console.error('Scroll indicator not found');
        return;
    }

    // スクロールインジケーターのクリックイベント
    scrollIndicator.addEventListener('click', function() {
        const eventsSection = document.querySelector('.events-section');
        
        if (eventsSection) {
            // イベントセクションまでスムーススクロール
            eventsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            console.log('Scrolled to events section');
        }
    });

    // スクロール位置に応じてインジケーターの表示/非表示を制御
    function handleScrollIndicatorVisibility() {
        const heroSection = document.querySelector('.hero-section');
        const scrollPosition = window.pageYOffset;
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        
        // ヒーローセクションを通り過ぎたらインジケーターを非表示
        if (scrollPosition > heroHeight * 0.8) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }

    // スクロールイベントリスナー（スロットル付き）
    const throttledScrollHandler = throttle(handleScrollIndicatorVisibility, 100);
    window.addEventListener('scroll', throttledScrollHandler);

    // ホバーエフェクトの強化（デスクトップのみ）
    if (!('ontouchstart' in window)) {
        scrollIndicator.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-50%) scale(1.1) translateY(-5px)';
        });

        scrollIndicator.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(-50%) scale(1) translateY(0)';
        });
    }

    console.log('Scroll indicator initialized');
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