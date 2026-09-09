$(function () {
    $('.lazy').Lazy({
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        visibleOnly: true,
        placeholder: ''
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Collapse the mobile menu after navigating to an in-page section.
    $('.navbar-nav .nav-link').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });
});
