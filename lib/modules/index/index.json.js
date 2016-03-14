module.exports = (function () {
    'use strict';

    return {
        "fields": [
            {
                "id": "loaderUrl",
                "name": "url",
                "type": "text",
                "modifier": "--url",
                "data": "url",
                "label": "Enter URL",
                "bind": "js-io"
            },
            {
                "id": "loaderTotal",
                "name": "total",
                "type": "number",
                "modifier": "--total",
                "data": "total",
                "label": "Total",
                "bind": "js-total"
            }
        ],
        "submit": {
            "label": "Download",
            "bind": "js-dl"
        }
    };
});