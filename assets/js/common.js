$(function () {
    // Collapse the mobile menu after navigating to an in-page section.
    $('.navbar-nav .nav-link').on('click', function () {
        var menu = $('.navbar-collapse');
        if (menu.hasClass('collapsing') && $('.navbar-toggler').attr('aria-expanded') === 'true') {
            menu.one('shown.bs.collapse', function () {
                $(this).collapse('hide');
            });
        } else {
            menu.collapse('hide');
        }
    });

    // Keep the homepage navigation in sync with the section being read.
    var homePath = new URL(document.querySelector('.navbar-brand').href).pathname;
    if (window.location.pathname.replace(/index\.html$/, '') === homePath) {
        var links = Array.prototype.slice.call(document.querySelectorAll('.navbar-nav .nav-link'));
        var sections = links.map(function (link) {
            var url = new URL(link.href);
            var section = url.hash ? document.getElementById(url.hash.slice(1)) : null;
            return { link: link, section: section, region: section ? section.closest('section') || section : null };
        }).filter(function (item) { return item.section; });
        var queued = false;

        function updateNavigation() {
            var threshold = document.querySelector('.navbar').offsetHeight + 48;
            var activeLink = links[0];
            var nearestTop = -Infinity;
            var atEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
            sections.forEach(function (item) {
                var top = item.section.getBoundingClientRect().top;
                var bottom = item.region.getBoundingClientRect().bottom;
                if (((top <= threshold && bottom >= threshold) || atEnd) && top > nearestTop) {
                    nearestTop = top;
                    activeLink = item.link;
                }
            });
            links.forEach(function (link) {
                var active = link === activeLink;
                link.parentElement.classList.toggle('active', active);
                if (active) {
                    link.setAttribute('aria-current', link.hash ? 'location' : 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
            queued = false;
        }

        function queueNavigationUpdate() {
            if (!queued) {
                queued = true;
                window.requestAnimationFrame(updateNavigation);
            }
        }

        window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
        window.addEventListener('resize', queueNavigationUpdate);
        window.addEventListener('hashchange', queueNavigationUpdate);
        window.addEventListener('load', queueNavigationUpdate);
        updateNavigation();
    }
});
