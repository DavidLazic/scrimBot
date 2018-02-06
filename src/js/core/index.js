import { Socket } from 'lib/services';

const SERVICES = {
    socket: new Socket()
};

const App = {
    bind (Module, context = null) {
        const selector = `.${Module.MODULE_CLASS}`;
        const $elements = document.querySelectorAll(selector, context);

        $elements.forEach($el => new Module({
            $el,
            services: SERVICES
        }));
    }
};

export { App };
