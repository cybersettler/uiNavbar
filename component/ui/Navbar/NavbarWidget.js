const d3 = require('d3');
const viewPattern = /^view\/(\w+)/;

function NavbarWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    let toggleButton = view.shadowRoot.querySelector('button.navbar-toggle');
    let collapse = view.shadowRoot.querySelector('.navbar-collapse');
    toggleButton.addEventListener('click', function() {
        toggleButton.classList.toggle('collapsed');
        collapse.classList.toggle('in');
    });
    this.navbar = view.shadowRoot.querySelector('nav>.container-fluid');
}

NavbarWidget.prototype.render = function() {
    /**
    return this.fetchData()
        .then(function(widget) {
            renderHeader(widget);
            renderBody(widget);
            initializeLinks(widget);
        });
     **/
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

function renderHeader(widget) {

    var contentTemplate = widget.view.querySelector('.navbar-header');

    if (!contentTemplate) {
        return;
    }

    let header = widget.navbar.querySelector('.navbar-header');
    let contentNode = widget.navbar.querySelector('.navbar-header span');
    let content = widget.scope.templateEngine.render(contentTemplate.innerHTML, {
        model: widget.model
    });

    if (contentNode) {
        contentNode.innerHTML = content;
    } else {
        // we need a span to be able to collect the content as
        // a node and then append it as a child to the
        // header node. The span is not needed for styling purposes
        // but we cannot append content a text.
        contentNode = document.createElement('span');
        contentNode.innerHTML = content;
        header.appendChild(contentNode);
    }

}

function renderBody(widget) {

    var ul = renderNavs(widget);
    renderNavItems(ul);
}

function renderNavs(widget) {
    var body = widget.navbar.querySelector('.navbar-collapse');
    var data = getBodyData(widget);

    // Update…
    var ul = d3.select(body)
        .selectAll("ul")
        .data(data);

    // Enter…
    var appended = ul.enter()
        .append("ul")
        .attr('class', function(d) {
            return d.class;
        });

    // Exit…
    ul.exit().remove();

    return appended;
}

function renderNavItems(ul) {
    var li = ul.selectAll('li')
        .data(function(d) {
            return d.items;
        });

    li.enter()
        .append('li')
        .attr('class', function(d) {
            return d.class;
        })
        .html(function(d) {
            return d.content;
        });

    li.exit().remove();
}

function getBodyData(widget) {
    var uls = widget.view.querySelectorAll('ul.navbar-nav');
    var data = {
        model: widget.model
    };

    return Array.from(uls)
        .map(addNav);
    function addNav(ul) {
        var lis = ul.querySelectorAll('li');
        return {
            class: ul.getAttribute('class'),
            items: Array
                .from(lis)
                .map(addItem)
        }
    }
    function addItem(item) {

        return {
            class: item.getAttribute('class'),
            content: widget.scope.templateEngine.render(item.innerHTML, data)
        };
    }
}

function initializeLinks(widget) {
    var links = widget.navbar.querySelectorAll('a');
    Array.from(links)
        .filter(hasNavigationRef)
        .forEach(attachEventListener);

    function hasNavigationRef(item) {
        var href = item.getAttribute('href');
        return viewPattern.test(href);
    }

    function attachEventListener(item) {
        item.addEventListener('click', onClickLink);
    }

    function onClickLink(e) {
        e.preventDefault();
        var a = e.currentTarget;
        var href = a.getAttribute('href');
        widget.scope.navigateTo(href);
        activateLink(href, widget);
    }
}

function activateLink(selectedHref, widget) {
    var links = widget.navbar.querySelectorAll('a');
    Array.from(links).forEach(setState);
    function setState(item) {
        var href = item.getAttribute('href');
        var li = item.parentNode;
        if (!(li.tagName &&
            li.tagName.toLowerCase() === 'li')) {
            return;
        }
        if (selectedHref === href) {
            li.classList.add('active');
        } else if (li.classList.contains('active')) {
            li.classList.remove('active');
        }
    }
}

module.exports = NavbarWidget;