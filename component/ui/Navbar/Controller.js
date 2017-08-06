const NavbarWidget = require('./NavbarWidget.js');

function NavbarController(view, scope) {
    this.super(view, scope);
    var controller = this;

    scope.onAttached.then(function() {
        controller.navbarWidget = new NavbarWidget(view, scope);
        controller.navbarWidget.render();
    });

    this.render = function() {
        this.navbarWidget.render();
    };
}

module.exports = NavbarController;