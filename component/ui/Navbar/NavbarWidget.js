const Handlebars = require('Handlebars');

function NavbarWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.template = Handlebars.compile(view.innerHTML);
    this.navbar = view.shadowRoot.querySelector('nav>.container-fluid');
}

NavbarWidget.prototype.render = function() {
    return this.fetchData()
        .then(function(widget) {
            widget.navbar.innerHTML = widget.template({
                model: widget.model
            });
        });
};

NavbarWidget.prototype.fetchData = function() {
    var promises = [];
    var widget = this;

    promises.push(widget.scope.onAppReady);

    if (this.view.hasAttribute('data-model')) {
        promises.push(
            this.scope.getModel().then(function(result) {
                widget.model = result;
            })
        );
    }

    return Promise.all(promises).then(function() {
        return widget;
    });
};

module.exports = NavbarWidget;