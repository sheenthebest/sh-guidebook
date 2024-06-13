document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const searchBar = document.querySelector('.search-bar');
    const searchToggle = document.getElementById('search-toggle');
    const fontSelector = document.getElementById('font-selector');

    loadCategories(sidebar);
    setInitialVisibility(searchBar);
    setInitialState(searchToggle, searchBar);

    document.getElementById('search-input').addEventListener('input', filterCategories);
    loadDefaultCategory();
    populateFontSelector(fontSelector);
    setInitialFont(fontSelector);

    setTextContent();

    // close UI on start
    document.querySelector('body').style.display = 'none';

    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', () => {
        $.post(`https://${GetParentResourceName()}/CLOSE_UI`);

        const container = document.querySelector('.container');
        container.classList.add('closing');
        setTimeout(() => {
            document.querySelector('body').style.display = 'none';
            container.classList.remove('closing');
        }, 500); 
    });

    window.addEventListener("message", (event) => {
        const data = event.data;
        const action = data.action;
        switch (action) {
            case "SHOW_UI":
                const body = document.querySelector('body');
                body.style.display = 'flex';

                const container = document.querySelector('.container');
                container.style.display = 'flex';
                container.classList.add('opening');
                setTimeout(() => {
                    container.classList.remove('opening');
                }, 500);

                break
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            $.post(`https://${GetParentResourceName()}/CLOSE_UI`);

            const container = document.querySelector('.container');
            container.classList.add('closing');
            setTimeout(() => {
                document.querySelector('body').style.display = 'none';
                container.classList.remove('closing');
            }, 500); 
        }
    });
});

function loadCategories(sidebar) {
    Object.entries(guidebookConfig.categories).forEach(([key, category]) => {
        const iconClass = category.icon;
        if (category.subcategories) {
            sidebar.appendChild(createCategoryElement(key, category, iconClass));
        } else {
            sidebar.appendChild(createButtonElement(key, category.title, iconClass, () => {
                loadContent(key);
                setActiveCategory(key);
            }));
        }
    });
}

function setInitialVisibility(searchBar) {
    const searchBarState = localStorage.getItem('searchBar');
    searchBar.style.display = searchBarState === 'hidden' ? 'none' : 'block';
}

function setInitialState(searchToggle, searchBar) {
    const searchBarState = localStorage.getItem('searchBar');
    searchToggle.checked = searchBarState !== 'hidden';
}

function loadDefaultCategory() {
    const defaultCategory = guidebookConfig.defaultCategory;
    if (defaultCategory) {
        const [mainCategory, subCategory] = defaultCategory.split('.');
        if (subCategory && guidebookConfig.categories[mainCategory].subcategories[subCategory]) {
            loadContent(mainCategory, subCategory);
            setActiveCategory(subCategory);
            toggleSubcategories(mainCategory);
        } else {
            loadContent(mainCategory);
            setActiveCategory(mainCategory);
        }
    }
}

function populateFontSelector(fontSelector) {
    guidebookConfig.texts.availableFonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.textContent = font;
        fontSelector.appendChild(option);
    });
}

function setInitialFont(fontSelector) {
    const savedFont = localStorage.getItem('selectedFont') || guidebookConfig.defaultFont;
    changeFont(savedFont);
    fontSelector.value = savedFont;
}

function setTextContent() {
    document.getElementById('sidebar-header').textContent = guidebookConfig.texts.sidebarHeader;
    document.getElementById('search-input').placeholder = guidebookConfig.texts.searchPlaceholder;
    document.getElementById('settings-header').textContent = guidebookConfig.texts.uiSettings;
    document.getElementById('settings-description').textContent = guidebookConfig.texts.uiSettingsDescription;
    document.getElementById('text-size-label').textContent = guidebookConfig.texts.changeTextSize;
    document.getElementById('search-bar-label').textContent = guidebookConfig.texts.searchBar;
    document.getElementById('select-font-label').textContent = guidebookConfig.texts.selectFont;
}

function createCategoryElement(key, category, iconClass) {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.setAttribute('data-category', key);

    const categoryTitle = createButtonElement(
        key, 
        category.title, 
        iconClass, 
        () => {
            toggleSubcategories(key);
            setActiveCategory(key);
        }, 
        '<span class="icon"><i class="fas fa-chevron-right"></i></span>'
    );
    categoryDiv.appendChild(categoryTitle);

    const subcategoryContainer = document.createElement('div');
    subcategoryContainer.classList.add('subcategory-container');
    if (category.initiallyExpanded) {
        subcategoryContainer.classList.add('open');
        categoryTitle.querySelector('.icon i').classList.replace('fa-chevron-right', 'fa-chevron-down');
    }

    Object.entries(category.subcategories).forEach(([subkey, subcategory]) => {
        const subIconClass = subcategory.icon;
        const subcategoryButton = createButtonElement(
            subkey, 
            subcategory.title, 
            subIconClass, 
            () => {
                loadContent(key, subkey);
                setActiveCategory(subkey);
            }
        );
        subcategoryContainer.appendChild(subcategoryButton);
    });

    categoryDiv.appendChild(subcategoryContainer);
    return categoryDiv;
}

function createButtonElement(key, title, iconClass, onClick, additionalHTML = '') {
    const button = document.createElement('button');
    button.innerHTML = `${iconClass !== false ? `<i class="${iconClass} category-icon"></i>` : ''}<span>${title}</span>${additionalHTML}`;
    button.classList.add('category-title');
    if (iconClass === false) {
        button.classList.add('no-icon');
    }
    button.setAttribute('data-category', key);
    button.onclick = onClick;
    return button;
}

function filterCategories() {
    const filter = this.value.toLowerCase();
    
    if (filter === '') {
        resetCategories();
    } else {
        expandAllCategories();
        filterButtons(filter);
        hideEmptyCategories();
        collapseEmptyCategories();
    }
}

function resetCategories() {
    document.querySelectorAll('.subcategory-container').forEach(container => {
        container.classList.remove('open');
        container.style.maxHeight = null;
        const icon = container.previousElementSibling.querySelector('.icon i');
        if (icon) {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
            icon.style.transform = 'rotate(0deg)';
        }
    });
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.style.display = '';
        const parentCategory = button.closest('.category');
        if (parentCategory) {
            parentCategory.style.display = '';
        }
    });
}

function expandAllCategories() {
    document.querySelectorAll('.subcategory-container').forEach(container => {
        container.classList.add('open');
        container.style.maxHeight = container.scrollHeight + "px";
        const icon = container.previousElementSibling.querySelector('.icon i');
        if (icon) {
            icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
            icon.style.transform = 'rotate(360deg)';
        }
    });
}

function filterButtons(filter) {
    document.querySelectorAll('.sidebar button').forEach(button => {
        const parentCategory = button.closest('.category');
        if (button.textContent.toLowerCase().includes(filter)) {
            button.style.display = '';
            if (parentCategory) {
                parentCategory.style.display = '';
            }
        } else {
            button.style.display = 'none';
        }
    });
}

function hideEmptyCategories() {
    document.querySelectorAll('.category').forEach(category => {
        const hasVisibleSubcategories = Array.from(category.querySelectorAll('.subcategory-container button')).some(button => button.style.display !== 'none');
        const categoryButton = category.querySelector('.category-title');
        if (!hasVisibleSubcategories && categoryButton.style.display === 'none') {
            category.style.display = 'none';
        }
    });
}

function collapseEmptyCategories() {
    document.querySelectorAll('.subcategory-container').forEach(container => {
        const hasVisibleSubcategories = Array.from(container.querySelectorAll('button')).some(button => button.style.display !== 'none');
        if (!hasVisibleSubcategories) {
            container.classList.remove('open');
            container.style.maxHeight = null;
            const icon = container.previousElementSibling.querySelector('.icon i');
            if (icon) {
                icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
                icon.style.transform = 'rotate(0deg)';
            }
        }
    });
}

function loadContent(category, subcategory = null) {
    const contentData = subcategory ? 
        guidebookConfig.categories[category].subcategories[subcategory] : 
        guidebookConfig.categories[category];

    if (contentData) {
        const content = `<h1>${contentData.title}</h1>${contentData.content}`;
        const contentArea = document.getElementById('content-area');
        const defaultTitle = document.getElementById('default-title');
        
        contentArea.classList.remove('visible');

        setTimeout(() => {
            contentArea.innerHTML = content;
            document.querySelectorAll('.content img').forEach(img => {
                img.style.cursor = 'zoom-in';
                img.onclick = () => openFullScreenImg(img.src);
            });
            if (defaultTitle) defaultTitle.style.display = 'none';

            requestAnimationFrame(() => {
                contentArea.classList.add('visible');
            });
        }, 200);
    }
}

function toggleSubcategories(category) {
    const subcategoryContainer = document.querySelector(`.category[data-category="${category}"] .subcategory-container`);
    const icon = document.querySelector(`.category[data-category="${category}"] .category-title .icon i`);
    if (subcategoryContainer) {
        document.querySelectorAll('.subcategory-container.open').forEach(container => {
            if (container !== subcategoryContainer) {
                container.classList.remove('open');
                container.style.maxHeight = null;
                container.previousElementSibling.querySelector('.icon i').classList.replace('fa-chevron-down', 'fa-chevron-right');
            }
        });
        const isOpen = subcategoryContainer.classList.toggle('open');
        subcategoryContainer.style.maxHeight = isOpen ? subcategoryContainer.scrollHeight + "px" : null;
        icon.classList.replace(isOpen ? 'fa-chevron-right' : 'fa-chevron-down', isOpen ? 'fa-chevron-down' : 'fa-chevron-right');
        icon.style.transform = isOpen ? 'rotate(360deg)' : 'rotate(0deg)';
    }
}

function setActiveCategory(category) {
    document.querySelectorAll('.category-title').forEach(button => {
        button.classList.remove('active');
    });
    const activeButton = document.querySelector(`.category-title[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function openFullScreenImg(src) {
    const fullScreenImg = document.getElementById('fullScreenImg');
    fullScreenImg.querySelector('img').src = src;
    fullScreenImg.style.display = 'flex';
}

function closeFullScreenImg() {
    const fullScreenImg = document.getElementById('fullScreenImg');
    fullScreenImg.style.display = 'none';
}

function openSettings() {
    document.getElementById('settings-modal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

function changeFont(font) {
    document.body.style.fontFamily = font;
    localStorage.setItem('selectedFont', font);
}

function changeTextSize(action) {
    const contentArea = document.getElementById('content-area');
    const allTextElements = contentArea.querySelectorAll('h1, h2, h3, p, ul, ol, li, strong, em');
    allTextElements.forEach(element => {
        const currentSize = parseInt(window.getComputedStyle(element).fontSize);
        element.style.fontSize = `${currentSize + (action === 'increase' ? 2 : -2)}px`;
    });
}

function toggleSearchBar() {
    const searchBar = document.querySelector('.search-bar');
    const isVisible = searchBar.style.display !== 'none';
    searchBar.style.display = isVisible ? 'none' : 'block';
    localStorage.setItem('searchBar', isVisible ? 'hidden' : 'visible');
}

function openExternalLinkModal(url) {
    const modal = document.getElementById('externalLinkModal');
    const iframe = document.getElementById('externalLinkIframe');
    iframe.src = url;
    modal.style.display = 'block';
}

function closeExternalLinkModal() {
    const modal = document.getElementById('externalLinkModal');
    modal.style.display = 'none';
    const iframe = document.getElementById('externalLinkIframe');
    iframe.src = '';
}

function openExternalLink(url) {
    openExternalLinkModal(url);
}
