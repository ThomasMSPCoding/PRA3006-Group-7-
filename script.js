class StickyNavigation {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        let self = this;
        $('.Navigation_tabs').click(function(event) { 
            self.onTabClick(event, $(this)); 
        });
        $(window).scroll(() => { this.onScroll(); });
        $(window).resize(() => { this.onResize(); });
    }
    
    onTabClick(event, element) {
        event.preventDefault();
        let targetId = element.attr('href');
        let scrollTop = $(targetId).offset().top - this.tabContainerHeight + 1;
        $('html, body').animate({ scrollTop: scrollTop }, 600);
    }
    
    onScroll() {
        this.checkTabContainerPosition();
        this.findCurrentTabSelector();
    }
    
    onResize() {
        if(this.currentId) {
            this.setSliderCss();
        }
    }
    
    checkTabContainerPosition() {
        let offset = $('.Navigation_tabs_container').offset().top + $('.Navigation_tabs_container').height() - this.tabContainerHeight;
        if($(window).scrollTop() > offset) {
            $('.Navigation_tabs_container').addClass('Navigation_tabs_container--top');
        } 
        else {
            $('.Navigation_tabs_container').removeClass('Navigation_tabs_container--top');
        }
    }
    
    findCurrentTabSelector(element) {
        let newCurrentId;
        let newCurrentTab;
        let self = this;
        $('.Navigation_tabs').each(function() {
            let id = $(this).attr('href');
            let offsetTop = $(id).offset().top - self.tabContainerHeight;
            let offsetBottom = $(id).offset().top + $(id).height() - self.tabContainerHeight;
            if($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
                newCurrentId = id;
                newCurrentTab = $(this);
            }
        });
        if(this.currentId != newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.setSliderCss();
        }
    }
    
    setSliderCss() {
        let width = 0;
        let left = 0;
        if(this.currentTab) {
            width = this.currentTab.css('width');
            left = this.currentTab.offset().left;
        }
        $('.Navigation_tabs_slider').css('width', width);
        $('.Navigation_tabs_slider').css('left', left);
    }
}

new StickyNavigation();

// Alert message
alert("This webpage should not be used for medical purposes!");