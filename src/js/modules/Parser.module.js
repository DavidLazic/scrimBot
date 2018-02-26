import { Component } from 'lib/components';
import { CONSTANTS } from 'lib/utils';

export default class Parser extends Component {

    static MODULE_CLASS = 'module_parser'

    constructor (props) {
        super(props);

        this.state = {
            active: false,
            url: null,
            total: 0
        };

        this.children = {
            submit: this.getElement('[data-submit]'),
            progress: this.getElement('[data-progress]'),
            progressBar: this.getElement('[data-progress-bar]')
        };

        this.actions = {
            'action.DOWNLOAD': () => this.onDownload()
        };

        this.changes = {
            'change.INPUT': target => this.onInputChange(target)
        };

        this.bindEvents();
    }

    bindEvents () {
        this.bind('change', e => this.onAction('changes', e.target.dataset.change, e.target));
        this.bind('click', e => this.onAction('actions', e.target.dataset.action));

        Object.keys(CONSTANTS.events).forEach(key =>
            this.on(CONSTANTS.events[key], e => this.onResponse(e.detail)));
    }

    onAction (type, change, ...props) {
        return this[type][change] && this[type][change](...props);
    }

    onInputChange (target) {
        return this.setState({ [target.dataset.type]: target.value })
            .then(() => target.value
                ? target.classList.add('filled')
                : target.classList.remove('filled'));
    }

    onDownload () {
        return this.state.url && this.setState({ active: true })
            .then(() => this.services.socket.emit(CONSTANTS.events.CHAPTER_DOWNLOAD, this.state));
    }

    onResponse (prop) {
        return Promise.resolve(console.log(`${prop.ok && '[Success]' || '[Error]'}`, prop))
            .then(() => this.setState({ active: false }));
    }

    render () {
        const { active } = this.state;

        this.children.progress.classList[active ? 'add' : 'remove']('active');
        this.children.submit[active ? 'setAttribute' : 'removeAttribute' ]('disabled', active);

        return !active
            && (this.children.progressBar.style.width = '0%');
    }
}
