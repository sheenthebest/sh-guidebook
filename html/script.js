const { createApp } = Vue;

createApp({
    data() {
        return {
            isVisible: false,
            config: null,
            currentContent: '',
            currentTitle: '',
            searchQuery: '',
            activeCategory: '',
            expandedCategories: [],
            showSettings: false,
            showImageModal: false,
            showLinkModal: false,
            currentImageSrc: '',
            currentLinkUrl: '',
            showBackToTop: false,
            settings: {
                fontSize: 16,
                showSearchBar: true,
                selectedFont: 'Roboto'
            }
        };
    },
    computed: {
        filteredCategories() {
            if (!this.config || !this.searchQuery) {
                return this.config?.categories || {};
            }
            
            const query = this.searchQuery.toLowerCase();
            const filtered = {};
            
            Object.entries(this.config.categories).forEach(([key, category]) => {
                if (category.subcategories) {
                    const matchingSubs = {};
                    Object.entries(category.subcategories).forEach(([subKey, sub]) => {
                        if (sub.title.toLowerCase().includes(query)) {
                            matchingSubs[subKey] = sub;
                        }
                    });
                    
                    if (Object.keys(matchingSubs).length > 0) {
                        filtered[key] = { ...category, subcategories: matchingSubs };
                        if (!this.expandedCategories.includes(key)) {
                            this.expandedCategories.push(key);
                        }
                    }
                } else if (category.title.toLowerCase().includes(query)) {
                    filtered[key] = category;
                }
            });
            
            return filtered;
        },
        contentStyles() {
            return {
                '--base-font-size': this.settings.fontSize + 'px',
                '--h1-size': (this.settings.fontSize * 2.625) + 'px',
                '--h2-size': (this.settings.fontSize * 2) + 'px',
                '--h3-size': (this.settings.fontSize * 1.5) + 'px'
            };
        }
    },
    mounted() {
        window.addEventListener('message', this.handleMessage);
        document.addEventListener('keydown', this.handleEscape);
        this.loadSettings();
        
        // Load config from window
        if (typeof guidebookConfig !== 'undefined') {
            this.config = guidebookConfig;
            this.loadDefaultCategory();
        }
    },
    beforeUnmount() {
        window.removeEventListener('message', this.handleMessage);
        document.removeEventListener('keydown', this.handleEscape);
        
        const contentEl = document.querySelector('.content');
        if (contentEl) {
            contentEl.removeEventListener('scroll', this.handleScroll);
        }
    },
    methods: {
        handleMessage(event) {
            if (event.data.action === 'SHOW_UI') {
                this.isVisible = true;
            }
        },
        handleEscape(event) {
            if (event.key === 'Escape' && this.isVisible) {
                this.closeUI();
            }
        },
        closeUI() {
            this.isVisible = false;
            this.fetchNui('CLOSE_UI');
        },
        loadDefaultCategory() {
            if (!this.config.defaultCategory) return;
            
            const [mainCat, subCat] = this.config.defaultCategory.split('.');
            
            if (subCat && this.config.categories[mainCat]?.subcategories?.[subCat]) {
                this.loadContent(mainCat, subCat);
                this.toggleCategory(mainCat);
            } else if (this.config.categories[mainCat]) {
                this.loadContent(mainCat);
            }
        },
        loadContent(categoryKey, subcategoryKey = null) {
            const category = this.config.categories[categoryKey];
            
            if (!category) return;
            
            if (subcategoryKey && category.subcategories) {
                const subcategory = category.subcategories[subcategoryKey];
                this.currentTitle = subcategory.title;
                this.currentContent = subcategory.content;
                this.activeCategory = subcategoryKey;
            } else {
                this.currentTitle = category.title;
                this.currentContent = category.content || '';
                this.activeCategory = categoryKey;
            }
        },
        setupScrollListener() {
            const contentEl = document.querySelector('.content');
            if (contentEl && !this._scrollListenerAttached) {
                contentEl.addEventListener('scroll', this.handleScroll);
                this._scrollListenerAttached = true;
            }
        },
        toggleCategory(categoryKey) {
            const index = this.expandedCategories.indexOf(categoryKey);
            if (index > -1) {
                this.expandedCategories.splice(index, 1);
            } else {
                this.expandedCategories.push(categoryKey);
            }
        },
        isCategoryExpanded(categoryKey) {
            return this.expandedCategories.includes(categoryKey);
        },
        setupImageZoom() {
            const images = document.querySelectorAll('.content-area img');
            
            images.forEach((img) => {
                img.loading = 'lazy';
                img.decoding = 'async';
                
                if (!img.complete) {
                    img.classList.add('image-loading');
                    
                    img.addEventListener('load', () => {
                        img.classList.remove('image-loading');
                        img.classList.add('image-loaded');
                    }, { once: true });
                    
                    img.addEventListener('error', () => {
                        img.classList.remove('image-loading');
                        img.classList.add('image-error');
                    }, { once: true });
                } else {
                    img.classList.add('image-loaded');
                }
                
                img.onclick = null;
                
                // Zoom functionality
                img.style.cursor = 'zoom-in';
                const imgSrc = img.src;
                img.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openImageModal(imgSrc);
                };
            });
        },
        openImageModal(src) {
            this.currentImageSrc = src;
            this.showImageModal = true;
        },
        closeImageModal() {
            this.showImageModal = false;
            this.currentImageSrc = '';
        },
        openLinkModal(url) {
            this.currentLinkUrl = url;
            this.showLinkModal = true;
        },
        closeLinkModal() {
            this.showLinkModal = false;
            this.currentLinkUrl = '';
        },
        openExternalBrowser(url) {
            if (typeof invokeNative !== 'undefined') {
                invokeNative('openUrl', url);
            } else {
                window.invokeNative('openUrl', url);
            }
        },
        handleScroll(event) {
            const scrollTop = event.target.scrollTop;
            this.showBackToTop = scrollTop > 100;
        },
        scrollToTop() {
            const contentEl = document.querySelector('.content');
            if (contentEl) {
                contentEl.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        },
        openSettings() {
            this.showSettings = true;
        },
        closeSettings() {
            this.showSettings = false;
        },
        changeFontSize(action) {
            if (action === 'increase') {
                this.settings.fontSize += 2;
            } else {
                this.settings.fontSize = Math.max(12, this.settings.fontSize - 2);
            }
            this.saveSettings();
        },
        toggleSearchBar() {
            this.settings.showSearchBar = !this.settings.showSearchBar;
            this.saveSettings();
        },
        changeFont(font) {
            this.settings.selectedFont = font;
            this.saveSettings();
        },
        saveSettings() {
            localStorage.setItem('guidebook_settings', JSON.stringify(this.settings));
        },
        loadSettings() {
            const saved = localStorage.getItem('guidebook_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        },
        fetchNui(eventName, data = {}) {
            return fetch(`https://${GetParentResourceName()}/${eventName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
    },
    watch: {
        searchQuery(newVal) {
            if (!newVal) {
                this.expandedCategories = [];
            }
        },
        currentContent() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.setupImageZoom();
                }, 50);
            });
        },
        isVisible(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.setupImageZoom();
                    }, 200);
                });
            }
        }
    }
}).mount('#app');

window.openExternalLink = function(url) {
    const app = document.getElementById('app').__vue_app__;
    const instance = app._instance.proxy;
    instance.openLinkModal(url);
};

window.openExternalBrowser = function(url) {
    const app = document.getElementById('app').__vue_app__;
    const instance = app._instance.proxy;
    instance.openExternalBrowser(url);
};