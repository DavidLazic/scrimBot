import 'babel-polyfill';
import { App } from 'core';
import Modules from 'modules';
import '../scss/style.scss';

window.dispatch = (eventName, prop) => document.dispatchEvent(new CustomEvent(eventName, { detail: prop }));

(() => document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        Modules.forEach(module => App.bind(module));
    }
}))();
