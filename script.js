class StickyNavigation {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        this.tabs = document.querySelectorAll('.Navigation_tabs');
        this.tabContainer = document.querySelector('.Navigation_tabs_container');
        this.slider = document.querySelector('.Navigation_tabs_slider');

        this.bindEvents();
    }

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (event) => this.onTabClick(event, tab));
        });
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());
    }

    onTabClick(event, element) {
        event.preventDefault();
        let targetId = element.getAttribute('href');
        let targetElement = document.querySelector(targetId);
        let scrollTop = targetElement.offsetTop - this.tabContainerHeight + 1;
        window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }

    onScroll() {
        this.findCurrentTabSelector();
    }

    onResize() {
        if (this.currentTab) {
            this.setSliderCss();
        }
    }

    findCurrentTabSelector() {
        let newCurrentId;
        let newCurrentTab;
        
        this.tabs.forEach(tab => {
            let id = tab.getAttribute('href');
            let targetElement = document.querySelector(id);
            let offsetTop = targetElement.offsetTop - this.tabContainerHeight;
            let offsetBottom = offsetTop + targetElement.offsetHeight;

            if (window.scrollY > offsetTop && window.scrollY < offsetBottom) {
                newCurrentId = id;
                newCurrentTab = tab;
            }
        });

        if (this.currentId !== newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.setSliderCss();
        }
    }

    setSliderCss() {
        if (this.currentTab) {
            this.slider.style.width = `${this.currentTab.offsetWidth}px`;
            this.slider.style.left = `${this.currentTab.offsetLeft}px`;
        }
    }
}

new StickyNavigation();

// Alert message
alert("This webpage should not be used for medical purposes!");

// Scroll Animations
const scrollElements = document.querySelectorAll('.fade-in');

const elementInView = (el, offset = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset
    );
};

const displayScrollElement = (element) => {
    element.classList.add('visible');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 150)) {
            displayScrollElement(el);
        }
    });
};

window.addEventListener('scroll', () => {
    handleScrollAnimation();
});
