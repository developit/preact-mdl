import { h, Component } from 'preact';
import '../node_modules/material-design-lite/dist/material.min.css';
import 'material-design-lite/material.js';

// import mdl from 'exports?componentHandler!material-design-lite/material.js';

const mdl = window.componentHandler;

const RIPPLE_CLASS = 'js-ripple-effect';
const MDL_PREFIX = s => MDL_NO_PREFIX[s] ? s : `mdl-${s}`;

const MDL_NO_PREFIX = { 'is-active': true };

let uidCounter = 1;
let uid = () => ++uidCounter;

let extend = (base, props) => {
	for (let i in props) if (props.hasOwnProperty(i)) base[i] = props[i];
	return base;
};

let propMaps = {
	disabled({ attributes }) {
		if (attributes.hasOwnProperty('disabled') && !attributes.disabled) {
			attributes.disabled = null;
		}
	},
	badge({ attributes }) {
		attributes['data-badge'] = attributes.badge;
		delete attributes.badge;
		attributes.class += (attributes.class ? ' ' : '') + 'mdl-badge';
	},
	active({ attributes }) {
		if (attributes.active) {
			attributes.class += (attributes.class ? ' ' : '') + 'is-active';
		}
	},
	shadow({ attributes }) {
		let d = parseFloat(attributes.shadow)|0,
			c = attributes.class.replace(/\smdl-[^ ]+--shadow\b/g,'');
		attributes.class = c + (c ? ' ' : '') + `mdl-shadow--${d}dp`;
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
		r.attributes.class = this.createMdlClasses(props).concat(r.attributes.class || []).join(' ');
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
					if (a.class.indexOf(persist[i])===-1) {
						a.class += ' ' + persist[i];
					}
				}
				else {
					(a.class = a.class || {})[persist[i]] = true;
				}
			}
		}

		for (let i=c.length; i--; ) {
			if (c[i].className && c[i].className.match(/\bmdl-[a-z0-9_-]+__ripple-container\b/g)) {
				let s = c[i].firstElementChild;
				(r.children = r.children || []).splice(i, 0, (
					<span class={ c[i].getAttribute('class') } data-upgraded={ c[i].getAttribute('data-upgraded') }>
						<span class={ s.getAttribute('class') } style={ s.getAttribute('style') } />
					</span>
				));
				foundRipple = true;
			}
			else if (r && r.children && r.children[i] && typeof r.children[i].nodeName==='string') {
				this.preserveMdlDom(c[i], r.children[i]);
			}
		}
	}

	createMdlClasses(props) {
		let name = this.component,
			c = [],
			js = props.js!==false && (this.js || this.ripple);
		if (name) c.push(name);
		if (this.mdlClasses) c.push(...this.mdlClasses);
		if (this.ripple && props.ripple!==false) {
			c.push(RIPPLE_CLASS);
		}
		if (js) c.push(`js-${name}`);
		for (let i in props) {
			if (props.hasOwnProperty(i) && props[i]===true) {
				c.push(MDL_NO_PREFIX[i] ? i : `${name}--${i}`);
			}
		}
		return c.map(MDL_PREFIX);
	}

	componentDidMount() {
		if (this.base!==this.upgradedBase) {
			if (this.upgradedBase) {
				mdl.downgradeElements(this.upgradedBase);
			}
			this.upgradedBase = null;
			if (this.base && this.base.parentElement) {
				this.upgradedBase = this.base;
				mdl.upgradeElement(this.base);
			}
		}
	}

	componentWillUnmount() {
		if (this.upgradedBase) {
			mdl.downgradeElements(this.upgradedBase);
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
		let c = props.class || '',
			icon = String(props.icon || props.children).replace(/[ -]/g, '_');
		delete props.icon;
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

	mdlRender(props, state) {
		let r = super.mdlRender(props, state);
		r.children.forEach( item => {
			let c = item.attributes.class || '';
			if (!c.match(/\bmdl-navigation__link\b/g)) {
				item.attributes.class = c + ' mdl-navigation__link';
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




/** @prop floating-label = false
*	@prop multiline = false
*	@prop expandable = false
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
			p = extend({}, props);

		delete p.class;

		let field = (
			<div>
				<input type="text" class="mdl-textfield__input" id={id} value="" {...p} />
				<label class="mdl-textfield__label" for={id}>{ props.label || props.children }</label>
			</div>
		);
		if (props.multiline) {
			field.children[0].nodeName = 'textarea';
			// field.children[0].children = [props.value];
		}
		if (props.expandable===true) {
			field.class = 'mdl-textfield__expandable-holder';
			field = (
				<div>
					<label class="mdl-button mdl-js-button mdl-button--icon" for={id}>
						<i class="material-icons">{ props.icon }</i>
					</label>
					{ field }
				</div>
			);
		}
		if (props.class) {
			(field.attributes = field.attributes || {}).class = props.class;
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
	Icon,
	Button,
	Card,
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
	CheckBox,
	Radio,
	IconToggle,
	Switch,
	Table,
	TextField,
	Tooltip
};
