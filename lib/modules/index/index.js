module.exports = (function() {
    'use strict';

    /**
     * @description
     * Init fn.
     *
     * @param  {Object}
     * @return void
     * @public
     */
    function init (router) {

        router.route('/')
            .get(function (req, res) {
                res.render('index');
            });
    }

    /**
     * @description
     * Index route module API
     *
     * @public
     */
    return {
        init: init
    };
})();