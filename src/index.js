import { h, Component } from 'preact';

export const options = {};

function mdl() {
	return options.mdl || options.componentHandler || window.componentHandler;
}

const RIPPLE_CLASS = 'js-ripple-effect';

const MDL_PREFIX = s => MDL_NO_PREFIX[s] ? s : `mdl-${s}`;

const MDL_NO_PREFIX = { 'is-active': true };

let uidCounter = 1;

function uid() {
	return ++uidCounter;
}

function extend(base, props) {
	for (let i in props) if (props.hasOwnProperty(i)) base[i] = props[i];
	return base;
}

function setClass(attributes, value, append) {
	let cl = getClass(attributes);
	if (attributes.className) delete attributes.className;
	if (append) value = cl ? (cl + ' ' + value) : value;
	attributes.class = value;
}

function getClass(attributes) {
	return attributes.class || attributes.className;
}

let propMaps = {
	disabled({ attributes }) {
		if (attributes.hasOwnProperty('disabled') && !attributes.disabled) {
			attributes.disabled = null;
		}
	},
	badge({ attributes }) {
		attributes['data-badge'] = attributes.badge;
		delete attributes.badge;
		setClass(attributes, 'mdl-badge', true);
	},
	active({ attributes }) {
		if (attributes.active) {
			setClass(attributes, 'is-active', true);
		}
	},
	shadow({ attributes }) {
		let d = parseFloat(attributes.shadow)|0,
			c = getClass(attributes).replace(/\smdl-[^ ]+--shadow\b/g,'');
		setClass(attributes, c + (c ? ' ' : '') + `mdl-shadow--${d}dp`);
	}
};

export class MaterialComponent extends Component {
	component = 'none';
	js = false;
	ripple = false;
	mdlClasses = null;
	upgradedBase = null;

	mdlRender(props) {
		return <div {...props}>{ props.children }</div>;
	}

	render(props, state) {
		let r = this.mdlRender(props, state);
		if (this.nodeName) r.nodeName = this.nodeName;
		if (!r.attributes) r.attributes = {};
		r.attributes.class = this.createMdlClasses(props).concat(r.attributes.class || [], r.attributes.className || []).join(' ');
		for (let i in propMaps) if (propMaps.hasOwnProperty(i)) {
			if (props.hasOwnProperty(i)) {
				propMaps[i](r);
			}
		}
		if (this.base && this.upgradedBase) {
			this.preserveMdlDom(this.base, r);
		}
		return r;
	}

	// Copy some transient properties back out of the DOM into VDOM prior to diffing so they don't get overwritten
	preserveMdlDom(base, r) {
		if (!base || !base.hasAttribute || !r) return;

		let c = base.childNodes,
			persist = [
				'mdl-js-ripple-effect--ignore-events',
				'mdl-js-ripple-effect',
				'is-upgraded',
				'is-dirty'
			],
			v = base.getAttribute('data-upgraded'),
			a = r.attributes,
			cl = getClass(a) || '',
			foundRipple = false;

		if (!a) a = {};

		if (v) {
			a['data-upgraded'] = v;
			upgradeQueue.add(base);
		}

		if (base.hasAttribute('ink-enabled')) {
			if (!r.attributes) r.attributes = {};
			r.attributes['ink-enabled'] = 'true';
		}

		for (let i=0; i<persist.length; i++) {
			if (base.classList.contains(persist[i])) {
				if (typeof a.class==='string') {
					if (cl.indexOf(persist[i])===-1) {
						cl += ' ' + persist[i];
					}
				}
				else {
					(cl || (cl = {}))[persist[i]] = true;
				}
			}
		}

		setClass(a, cl);
	}

	createMdlClasses(props) {
		let name = this.component,
			c = [],
			mapping = this.propClassMapping || {},
			js = props.js!==false && (this.js || this.ripple);
		if (name) c.push(name);
		if (this.mdlClasses) c.push(...this.mdlClasses);
		if (this.ripple && props.ripple!==false) {
			c.push(RIPPLE_CLASS);
		}
		if (js) c.push(`js-${name}`);
		for (let i in props) {
			if (props.hasOwnProperty(i) && props[i]===true) {
				c.push(MDL_NO_PREFIX[i] ? i : (mapping[i] || `${name}--${i}`));
			}
		}
		return c.map(MDL_PREFIX);
	}

	componentDidMount() {
		if (this.base!==this.upgradedBase) {
			if (this.upgradedBase) {
				mdl().downgradeElements(this.upgradedBase);
			}
			this.upgradedBase = null;
			if (this.base && this.base.parentElement) {
				this.upgradedBase = this.base;
				mdl().upgradeElement(this.base);
			}
		}
	}

	componentWillUnmount() {
		if (this.upgradedBase) {
			mdl().downgradeElements(this.upgradedBase);
			this.upgradedBase = null;
		}
	}
}


let upgradeQueue = {
	items: [],
	add(base) {
		if (upgradeQueue.items.push(base)===1) {
			requestAnimationFrame(upgradeQueue.process);
			// setTimeout(upgradeQueue.process, 1);
		}
	},
	process() {
		// console.log(`upgrading ${upgradeQueue.items.length} items`);
		let p = upgradeQueue.items;
		for (let i=p.length; i--; ) {
			let el = p[i],
				v = el.getAttribute('data-upgraded'),
				u = v && v.split(',');
			if (!u) continue;
			for (let j=u.length; j--; ) {
				let c = u[j],
					a = c && el[c];
				if (a) {
					if (a.updateClasses_) {
						a.updateClasses_();
					}
					if (a.onFocus_ && a.input_ && a.input_.matches && a.input_.matches(':focus')) {
						a.onFocus_();
					}
				}
			}
		}
		p.length = 0;
	}
};



/** Material Icon */
export class Icon extends MaterialComponent {
	mdlRender(props) {
		let c = getClass(props) || '',
			icon = String(props.icon || props.children).replace(/[ -]/g, '_');
		delete props.icon;
		delete props.className;
		if (typeof c==='string') {
			c = 'material-icons ' + c;
		}
		else {
			c['material-icons'] = true;
		}
		return <i {...props} class={c}>{ icon }</i>;
	}
}




/** @prop primary = false
 *	@prop accent = false
 *	@prop colored = false
 *	@prop raised = false
 *	@prop icon = false
 *	@prop fab = false
 *	@prop mini-fab = false
 *	@prop disabled = false
 */
export class Button extends MaterialComponent {
	component = 'button';
	nodeName = 'button';
	js = true;
	ripple = true;
}






/** Cards */

export class Card extends MaterialComponent {
	component = 'card';
}

export class CardTitle extends MaterialComponent {
	component = 'card__title';
	propClassMapping = {
		expand: 'card--expand'
	};
}

export class CardTitleText extends MaterialComponent {
	component = 'card__title-text';
	nodeName = 'h2';
}

export class CardMedia extends MaterialComponent {
	component = 'card__media';
}

export class CardText extends MaterialComponent {
	component = 'card__supporting-text';
}

export class CardActions extends MaterialComponent {
	component = 'card__actions';
	// mdlClasses = ['card--border'];
}

export class CardMenu extends MaterialComponent {
	component = 'card__menu';
}

extend(Card, {
	Title: CardTitle,
	TitleText: CardTitleText,
	Media: CardMedia,
	Text: CardText,
	Actions: CardActions,
	Menu: CardMenu
});



/** Dialogs */

export class Dialog extends MaterialComponent {
	component = 'dialog';
	nodeName = 'dialog';
	show = () => {
		this.base.show();
	}
	showModal = () => {
		this.base.showModal();
	}
	close = () => {
		this.base.close && this.base.close();
	}
}

export class DialogTitle extends MaterialComponent {
	component = 'dialog__title';
}

export class DialogContent extends MaterialComponent {
	component = 'dialog__content';
}

export class DialogActions extends MaterialComponent {
	component = 'dialog__actions';
}

extend(Dialog, {
	Title: DialogTitle,
	Content: DialogContent,
	Actions: DialogActions
});




/** Layouts */

/** @prop fixed-header = false
*	@prop fixed-drawer = false
*	@prop overlay-drawer-button = false
*	@prop fixed-tabs = false
 */
export class Layout extends MaterialComponent {
	component = 'layout';
	js = true;
}

/** @prop waterfall = false
 *	@prop scroll = false
 */
export class LayoutHeader extends MaterialComponent {
	component = 'layout__header';
	nodeName = 'header';
}

export class LayoutHeaderRow extends MaterialComponent {
	component = 'layout__header-row';
}

export class LayoutTitle extends MaterialComponent {
	component = 'layout-title';
	nodeName = 'span';
}

export class LayoutSpacer extends MaterialComponent {
	component = 'layout-spacer';
}

export class LayoutDrawer extends MaterialComponent {
	component = 'layout__drawer';
}

export class LayoutContent extends MaterialComponent {
	component = 'layout__content';
	nodeName = 'main';
}

export class LayoutTabBar extends MaterialComponent {
	component = 'layout__tab-bar';
	js = true;
	ripple = false;
}

/** @prop active */
export class LayoutTab extends MaterialComponent {
	component = 'layout__tab';
	nodeName = 'a';
}

/** @prop active */
export class LayoutTabPanel extends MaterialComponent {
	component = 'layout__tab-panel';

	mdlRender(props) {
		return <section {...props}><div class="page-content">{ props.children }</div></section>;
	}
}

extend(Layout, {
	Header: LayoutHeader,
	HeaderRow: LayoutHeaderRow,
	Title: LayoutTitle,
	Spacer: LayoutSpacer,
	Drawer: LayoutDrawer,
	Content: LayoutContent,
	TabBar: LayoutTabBar,
	Tab: LayoutTab,
	TabPanel: LayoutTabPanel
});



/** @prop large-screen-only = false */
export class Navigation extends MaterialComponent {
	component = 'navigation';
	nodeName = 'nav';
	propClassMapping = {
		'large-screen-only': 'layout--large-screen-only'
	}

	mdlRender(props, state) {
		let r = super.mdlRender(props, state);
		r.children.forEach( item => {
			let c = getClass(item.attributes) || '';
			if (!c.match(/\bmdl-navigation__link\b/g)) {
				setClass(item.attributes, ' mdl-navigation__link', true);
			}
		});
		return r;
	}
}

export class NavigationLink extends MaterialComponent {
	component = 'navigation__link';
	nodeName = 'a';

	constructor(...args) {
		super(...args);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		let { route, href, onClick, onclick } = this.props;
		onClick = onClick || onclick;
		if (typeof onClick==='function' && onClick({ type: 'click', target: this })===false) {
		}
		else if (typeof route==='function') {
			route(href);
		}
		e.preventDefault();
		return false;
	}

	mdlRender({ children, ...props }, state) {
		return <a {...props} onclick={ this.handleClick }>{ children }</a>;
	}
}

Navigation.Link = NavigationLink;




export class Tabs extends MaterialComponent {
	component = 'tabs';
	js = true;
	ripple = false;
}

export class TabBar extends MaterialComponent {
	component = 'tabs__tab-bar';
}

export class Tab extends MaterialComponent {
	component = 'tabs__tab';
	nodeName = 'a';
}

export class TabPanel extends MaterialComponent {
	component = 'tabs__panel';
	nodeName = 'section';
}

extend(Tabs, {
	TabBar,
	Bar: TabBar,
	Tab,
	TabPanel,
	Panel: TabPanel
});



export class MegaFooter extends MaterialComponent {
	component = 'mega-footer';
	nodeName = 'footer';
}

export class MegaFooterMiddleSection extends MaterialComponent {
	component = 'mega-footer__middle-section';
}

export class MegaFooterDropDownSection extends MaterialComponent {
	component = 'mega-footer__drop-down-section';
}

export class MegaFooterHeading extends MaterialComponent {
	component = 'mega-footer__heading';
	nodeName = 'h1';
}

export class MegaFooterLinkList extends MaterialComponent {
	component = 'mega-footer__link-list';
	nodeName = 'ul';
}

export class MegaFooterBottomSection extends MaterialComponent {
	component = 'mega-footer__bottom-section';
}

extend(MegaFooter, {
	MiddleSection: MegaFooterMiddleSection,
	DropDownSection: MegaFooterDropDownSection,
	Heading: MegaFooterHeading,
	LinkList: MegaFooterLinkList,
	BottomSection: MegaFooterBottomSection
});




export class MiniFooter extends MaterialComponent {
	component = 'mini-footer';
	nodeName = 'footer';
}

export class MiniFooterLeftSection extends MaterialComponent {
	component = 'mini-footer__left-section';
}

export class MiniFooterLinkList extends MaterialComponent {
	component = 'mini-footer__link-list';
	nodeName = 'ul';
}

extend(MiniFooter, {
	LeftSection: MiniFooterLeftSection,
	LinkList: MiniFooterLinkList
});




/** Responsive Grid
 *	@prop no-spacing = false
 */
export class Grid extends MaterialComponent {
	component = 'grid';
}

export class Cell extends MaterialComponent {
	component = 'cell';
}

Grid.Cell = Cell;





/** @prop indeterminate = false */
export class Progress extends MaterialComponent {
	component = 'progress';
	js = true;

	mdlRender(props) {
		return (
			<div {...props}>
				<div class="progressbar bar bar1" />
				<div class="bufferbar bar bar2" />
				<div class="auxbar bar bar3" />
			</div>
		);
	}

	componentDidUpdate() {
		let api = this.base.MaterialProgress,
			p = this.props;
		if (p.progress) api.setProgress(p.progress);
		if (p.buffer) api.setBuffer(p.buffer);
	}
}





/** @prop active = false
 *	@prop single-color = false
 */
export class Spinner extends MaterialComponent {
	component = 'spinner';
	js = true;
	// shouldComponentUpdate = () => false;
}





/** @prop bottom-left = true
 *	@prop bottom-right = false
 *	@prop top-left = false
 *	@prop top-right = false
 */
export class Menu extends MaterialComponent {
	component = 'menu';
	nodeName = 'ul';
	js = true;
	ripple = true;
}

/** @prop disabled = false */
export class MenuItem extends MaterialComponent {
	component = 'menu__item';
	nodeName = 'li';
}

Menu.Item = MenuItem;





/** @prop min = 0
 *	@prop max = 100
 *	@prop value = 0
 *	@prop tabindex = 0
 *	@prop disabled = false
 */
export class Slider extends MaterialComponent {
	component = 'slider';
	js = true;

	mdlRender(props) {
		return <input type="range" tabindex="0" {...props} />;
	}
}




/** Snackbar
 */

export class Snackbar extends MaterialComponent {
	component = 'snackbar';
	js = true;

	mdlRender(props) {
		return (
			<div {...props}>
				<div class="mdl-snackbar__text">{props.children}</div>
				<button class="mdl-snackbar__action" type="button"></button>
			</div>
		);
	}
}




/** @prop checked = false
 *	@prop disabled = false
 */
export class CheckBox extends MaterialComponent {
	component = 'checkbox';
	js = true;
	ripple = true;

	getValue() {
		return this.base.children[0].checked;
	}

	mdlRender(props) {
		let evt = {};
		for (let i in props) if (i.match(/^on[a-z]+$/gi)) {
			evt[i] = props[i];
			delete props[i];
		}
		return (
			<label {...props}>
				<input type="checkbox" class="mdl-checkbox__input" checked={ props.checked } disabled={ props.disabled } {...evt} />
				<span class="mdl-checkbox__label">{ props.children }</span>
				<span class="mdl-checkbox__focus-helper" />
				<span class="mdl-checkbox__box-outline">
					<span class="mdl-checkbox__tick-outline" />
				</span>
			</label>
		);
	}
}




/** @prop name (required)
*	@prop value (required)
*	@prop checked = false
  *	@prop disabled = false
 */
export class Radio extends MaterialComponent {
	component = 'radio';
	js = true;
	ripple = true;

	getValue() {
		return this.base.children[0].checked;
	}

	mdlRender(props) {
		return (
			<label {...props}>
				<input type="radio" class="mdl-radio__button" name={ props.name } value={ props.value } checked={ props.checked } disabled={ props.disabled } />
				<span class="mdl-radio__label">{ props.children }</span>
			</label>
		);
	}
}




/** @prop checked = false
 *	@prop disabled = false
 */
export class IconToggle extends MaterialComponent {
	component = 'icon-toggle';
	js = true;
	ripple = true;

	getValue() {
		return this.base.children[0].checked;
	}

	mdlRender(props) {
		return (
			<label {...props}>
				<input type="checkbox" class="mdl-icon-toggle__input" checked={ props.checked } disabled={ props.disabled } />
				<span class="mdl-icon-toggle__label material-icons">{ props.children }</span>
			</label>
		);
	}
}




/** @prop checked = false
 *	@prop disabled = false
 */
export class Switch extends MaterialComponent {
	component = 'switch';
	nodeName = 'label';
	js = true;
	ripple = true;

	shouldComponentUpdate({ checked }) {
		if (Boolean(checked)===Boolean(this.props.checked)) return false;
		return true;
	}

	getValue() {
		return this.base.children[0].checked;
	}

	mdlRender({ ...props }) {
		let evt = {};
		for (let i in props) if (i.match(/^on[a-z]+$/gi)) {
			evt[i] = props[i];
			delete props[i];
		}
		return (
			<label {...props}>
				<input type="checkbox" class="mdl-switch__input" checked={ props.checked } disabled={ props.disabled } {...evt} />
				<span class="mdl-switch__label">{ props.children }</span>
				<div class="mdl-switch__track"></div>
				<div class="mdl-switch__thumb">
					<span class="mdl-switch__focus-helper"></span>
				</div>
			</label>
		);
	}
}




/** @prop selectable = false */
export class Table extends MaterialComponent {
	component = 'data-table';
	nodeName = 'table';
	js = true;
}

/** @prop non-numeric = false */
export class TableCell extends MaterialComponent {
	component = 'data-table__cell';
	nodeName = 'td';
}

Table.Cell = TableCell;


export class List extends MaterialComponent {
	component = 'list';
	nodeName = 'ul';
}

/** @prop two-line = false
*	@prop three-line = false
 */
export class ListItem extends MaterialComponent {
	component = 'list__item';
	nodeName = 'li';
}

List.Item = ListItem;


/** @prop floating-label = false
*	@prop multiline = false
*	@prop expandable = false
*	@prop errorMessage = null
*	@prop icon (used with expandable)
 */
export class TextField extends MaterialComponent {
	component = 'textfield';
	js = true;

	constructor(...args) {
		super(...args);
		this.id = uid();
	}

	componentDidUpdate() {
		let input = this.base && this.base.querySelector && this.base.querySelector('input,textarea');
		if (input && input.value && input.value!==this.props.value) {
			input.value = this.props.value;
		}
	}

	mdlRender(props={}) {
		let id = props.id || this.id,
			errorMessage = props.errorMessage,
			p = extend({}, props);

		delete p.class;
		delete p.errorMessage;

		let field = (
			<div>
				<input type="text" class="mdl-textfield__input" id={id} value="" {...p} />
				<label class="mdl-textfield__label" for={id}>{ props.label || props.children }</label>
				{errorMessage ? <span class="mdl-textfield__error">{errorMessage}</span> : null}
			</div>
		);
		if (props.multiline) {
			field.children[0].nodeName = 'textarea';
			// field.children[0].children = [props.value];
		}
		if (props.expandable===true) {
			(field.attributes = field.attributes || {}).class = 'mdl-textfield__expandable-holder';
			field = (
				<div>
					<label class="mdl-button mdl-js-button mdl-button--icon" for={id}>
						<i class="material-icons">{ props.icon }</i>
					</label>
					{ field }
				</div>
			);
		}
		let cl = getClass(props);
		if (cl) {
			(field.attributes = field.attributes || {}).class = cl;
		}

		if (errorMessage) {
			setClass((field.attributes = field.attributes || {}), 'is-invalid', true);
		}
		return field;
	}
}






/** @prop for [id]
 *	@prop large = false
 */
export class Tooltip extends MaterialComponent {
	component = 'tooltip';
}




export default {
	options,
	Icon,
	Button,
	Card,
	Dialog,
	Layout,
	Navigation,
	Tabs,
	MegaFooter,
	MiniFooter,
	Grid,
	Cell,
	Progress,
	Spinner,
	Menu,
	Slider,
	Snackbar,
	CheckBox,
	Radio,
	IconToggle,
	Switch,
	Table,
	TextField,
	Tooltip,
	List,
	ListItem
};
