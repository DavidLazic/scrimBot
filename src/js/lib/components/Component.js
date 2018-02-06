/**
 * @description
 * Abstract class for augmenting modules
 */
export default class Component {

    constructor (props) {
        Object.assign(this, props);
    }

    /**
     * @param {Object} state
     * @return {Object<Promise>}
     */
    setState (state) {
        return Promise.resolve((Object.assign(this.state, state), this.render()));
    }

    /**
     * @param {String} selector
     * @param {Object} options
     * @return {Object<Promise>}
     */
    getElement (selector, options = {}) {
        return this.$el[`querySelector${ options.multi && 'All' || '' }`](selector);
    }

    /**
     * @param {String} name
     * @param {Function} fn
     * @return {Object<Promise>}
     */
    bind (name, fn) {
        return this.$el.addEventListener(name, fn);
    }

    /**
     * @param {String} name
     * @param {Function} fn
     * @return {Object<Promise>}
     */
    on (name, fn) {
        return document.addEventListener(name, fn);
    }
}
