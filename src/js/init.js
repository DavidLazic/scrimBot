(function (window) {
    'use strict';

    function Parser (params) {
        this.url = params && params.url || '';
    };

    Parser.prototype.setUrl = function (url) {
        return function () {
            this.url = url;
        }
    };

    window.Parser = Parser;
})(window);


$(function () {
    var parser = new Parser();
});


