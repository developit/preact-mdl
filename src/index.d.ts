export const options: {};

export class MaterialComponent<PropsType, StateType> extends preact.Component<PropsType, StateType> {
    component: string;
    js: boolean;
    mdlClasses: string[];
    nodeName: string;
    propClassMapping: {[prop: string]: string};
    ripple: boolean;
    upgradedBase: HTMLElement;

    createMdlClasses(props: PropsType & preact.ComponentProps<this>): string[];
    mdlRender(props: PropsType & preact.ComponentProps<this>): preact.VNode;
    preserveMdlDom(base: HTMLElement, r: HTMLElement): void;
    render(props: PropsType & preact.ComponentProps<this>, state: StateType): preact.VNode;
}

export interface HTMLProps extends JSX.HTMLAttributes { }

/** Icon */
export class Icon extends MaterialComponent<HTMLProps, {}> { }

/** Button */
export interface ButtonProps extends HTMLProps {
    accent?: boolean;
    colored?: boolean;
    fab?: boolean;
    "mini-fab"?: boolean;
    primary?: boolean;
    raised?: boolean;
}
export class Button extends MaterialComponent<ButtonProps, {}> { }

/** Cards */
export interface CardProps extends HTMLProps {
    shadow?: number;
}
export class Card extends MaterialComponent<CardProps, {}> { }
export class CardActions extends MaterialComponent<HTMLProps, {}> { }
export class CardMedia extends MaterialComponent<HTMLProps, {}> { }
export class CardMenu extends MaterialComponent<HTMLProps, {}> { }
export class CardText extends MaterialComponent<HTMLProps, {}> { }
export class CardTitle extends MaterialComponent<HTMLProps, {}> { }
export class CardTitleText extends MaterialComponent<HTMLProps, {}> { }
export namespace Card {
    var Actions: typeof CardActions;
    var Media: typeof CardMedia;
    var Menu: typeof CardMenu;
    var Text: typeof CardText;
    var Title: typeof CardTitle;
    var TitleText: typeof CardTitleText;
}

/** Dialogs */
export class Dialog extends MaterialComponent<HTMLProps, {}> {}
export class DialogActions extends MaterialComponent<HTMLProps, {}> { }
export class DialogContent extends MaterialComponent<HTMLProps, {}> { }
export class DialogTitle extends MaterialComponent<HTMLProps, {}> { }
export namespace Dialog {
    var Actions: typeof DialogActions;
    var Content: typeof DialogContent;
    var Title: typeof DialogTitle;
}

/** Layouts */
export interface LayoutProps extends HTMLProps {
    "fixed-header"?: boolean;
    "fixed-drawer"?: boolean;
    "fixed-tabs"?: boolean;
    "overlay-drawer-button"?: boolean;
}
export class Layout extends MaterialComponent<LayoutProps, {}> { }
export class LayoutContent extends MaterialComponent<HTMLProps, {}> { }
export class LayoutDrawer extends MaterialComponent<HTMLProps, {}> { }
export interface LayoutHeaderProps extends HTMLProps {
    scroll?: boolean;
    waterfall?: boolean;
}
export class LayoutHeader extends MaterialComponent<LayoutHeaderProps, {}> { }
export class LayoutHeaderRow extends MaterialComponent<HTMLProps, {}> { }
export class LayoutSpacer extends MaterialComponent<HTMLProps, {}> { }
export interface LayoutTabProps extends HTMLProps {
    active?: boolean;
}
export class LayoutTab extends MaterialComponent<LayoutTabProps, {}> { }
export class LayoutTabBar extends MaterialComponent<HTMLProps, {}> { }
export interface LayoutTabPanelProps extends HTMLProps {
    active?: boolean;
}
export class LayoutTabPanel extends MaterialComponent<LayoutTabPanelProps, {}> { }
export class LayoutTitle extends MaterialComponent<HTMLProps, {}> { }
export namespace Layout {
    var Content: typeof LayoutContent;
    var Drawer: typeof LayoutDrawer;
    var Header: typeof Layout;
    var HeaderRow: typeof LayoutHeaderRow;
    var Spacer: typeof LayoutSpacer;
    var Tab: typeof LayoutTab;
    var TabBar: typeof LayoutTabBar;
    var TabPanel: typeof LayoutTabPanel;
    var Title: typeof LayoutTitle;
}

/** Navigation */
export interface NavigationProps extends HTMLProps {
    "large-screen-only"?: boolean;
}
export class Navigation extends MaterialComponent<NavigationProps, {}> { }
export class NavigationLink extends MaterialComponent<HTMLProps, {}> {
    handleClick(e: any): boolean|void;
}
export namespace Navigation {
    var Link: typeof NavigationLink;
}

/** Tabs */
export class Tabs extends MaterialComponent<HTMLProps, {}> { }
export class Tab extends MaterialComponent<HTMLProps, {}> { }
export class TabBar extends MaterialComponent<HTMLProps, {}> { }
export class TabPanel extends MaterialComponent<HTMLProps, {}> { }
export namespace Tabs {
    var Bar: typeof TabBar;
    var Panel: typeof TabPanel;
}

/** MegaFooter */
export class MegaFooter extends MaterialComponent<HTMLProps, {}> { }
export class MegaFooterBottomSection extends MaterialComponent<HTMLProps, {}> { }
export class MegaFooterDropDownSection extends MaterialComponent<HTMLProps, {}> { }
export class MegaFooterHeading extends MaterialComponent<HTMLProps, {}> { }
export class MegaFooterLinkList extends MaterialComponent<HTMLProps, {}> { }
export class MegaFooterMiddleSection extends MaterialComponent<HTMLProps, {}> { }
export namespace MegaFooter {
    var BottomSection: typeof MegaFooterBottomSection;
    var DropDownSection: typeof MegaFooterDropDownSection;
    var Heading: typeof MegaFooterHeading;
    var LinkList: typeof MegaFooterLinkList;
    var MiddleSection: typeof MegaFooterMiddleSection;
}

/** MiniFooter */
export class MiniFooter extends MaterialComponent<HTMLProps, {}> { }
export class MiniFooterLeftSection extends MaterialComponent<HTMLProps, {}> { }
export class MiniFooterLinkList extends MaterialComponent<HTMLProps, {}> { }
export namespace MiniFooter {
    var LeftSection: typeof MiniFooterLeftSection;
    var LinkList: typeof MiniFooterLinkList;
}

/** Grid */
export interface GridProps extends HTMLProps {
    "no-spacing"?: boolean;
}
export class Grid extends MaterialComponent<GridProps, {}> { }
export class Cell extends MaterialComponent<HTMLProps, {}> { }
export namespace Grid {
    var Cell: any; // XXX should be typeof Cell but TypeScript complains
}

/** Progress */
export interface ProgressProps extends HTMLProps {
    indeterminate?: boolean;
}
export class Progress extends MaterialComponent<ProgressProps, {}> { }

/** Spinner */
export interface SpinnerProps extends HTMLProps {
    "single-color"?: boolean;
}
export class Spinner extends MaterialComponent<SpinnerProps, {}> { }

/** Menu */
export interface MenuProps extends HTMLProps {
    "bottom-left"?: boolean;
    "bottom-right"?: boolean;
    "top-left"?: boolean;
    "top-right"?: boolean;
}
export class Menu extends MaterialComponent<MenuProps, {}> { }
export class MenuItem extends MaterialComponent<HTMLProps, {}> { }
export namespace Menu {
    var Item: typeof MenuItem;
}

/** Slider */
export interface SliderProps extends HTMLProps {
    min?: number;
    max?: number;
}
export class Slider extends MaterialComponent<SliderProps, {}> { }

/** Snackbar */
export class Snackbar extends MaterialComponent<HTMLProps, {}> { }

/** CheckBox */
export class CheckBox extends MaterialComponent<HTMLProps, {}> {
    getValue(): boolean;
}

/** Radio */
export interface RadioProps extends HTMLProps {
    name: string;
    value: string;
}
export class Radio extends MaterialComponent<RadioProps, {}> {
    getValue(): boolean;
}

/** IconToggle */
export class IconToggle extends MaterialComponent<HTMLProps, {}> {
    getValue(): boolean;
}

/** Switch */
export class Switch extends MaterialComponent<HTMLProps, {}> {
    getValue(): boolean;
}

/** Table */
export interface TableProps extends HTMLProps {
    selectable?: boolean;
}
export class Table extends MaterialComponent<TableProps, {}> { }
export interface TableCellProps extends HTMLProps {
    "non-numeric"?: boolean;
}
export class TableCell extends MaterialComponent<TableCellProps, {}> { }
export namespace Table {
    var Cell: typeof TableCell;
}

/** List */
export class List extends MaterialComponent<HTMLProps, {}> { }
export interface ListItemProps extends HTMLProps {
    "two-line"?: boolean;
    "three-line"?: boolean;
}
export class ListItem extends MaterialComponent<ListItemProps, {}> { }
export namespace List {
    var Item: typeof ListItem;
}

/** TextField */
export interface TextFieldProps extends HTMLProps {
    "floating-label"?: boolean;
    errorMessage?: string;
    expandable?: boolean;
    multiline?: boolean;
    onSearch?: ((event) => boolean|void);
}
export class TextField extends MaterialComponent<TextFieldProps, {}> { }

/** Tooltip */
export interface TooltipProps extends HTMLProps {
    for: string;
    large?: boolean;
}
export class Tooltip extends MaterialComponent<TooltipProps, {}> { }

export default {
    options,
    Button,
    Card,
    Cell,
    CheckBox,
    Dialog,
    Grid,
    Icon,
    IconToggle,
    Layout,
    List,
    ListItem,
    Progress,
    MegaFooter,
    Menu,
    MiniFooter,
    Navigation,
    Radio,
    Slider,
    Snackbar,
    Spinner,
    Switch,
    Table,
    Tabs,
    TextField,
    Tooltip,
};
