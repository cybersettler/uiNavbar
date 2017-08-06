const Handlebars = require('Handlebars');

function NavbarWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.template = Handlebars.compile(view.innerHTML);
    this.navbar = view.shadowRoot.querySelector('nav>.container-fluid');
}

NavbarWidget.prototype.render = function() {
    this.navbar.innerHTML = this.template();
};

module.exports = NavbarWidget;