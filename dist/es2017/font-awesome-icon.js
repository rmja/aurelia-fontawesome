var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Container, DOM, LogManager, ViewCompiler, ViewResources, ViewSlot, bindable, createOverrideContext, customElement, noView } from 'aurelia-framework';
import { icon, parse } from '@fortawesome/fontawesome-svg-core';
import convert from './converter';
import { objectWithKey } from './utils';
function normalizeIconArgs(icon) {
    if (icon == null) {
        return null;
    }
    if (typeof icon === 'object' && icon.prefix && icon.iconName) {
        return icon;
    }
    if (Array.isArray(icon) && icon.length === 2) {
        return { prefix: icon[0], iconName: icon[1] };
    }
    if (typeof icon === 'string') {
        return { prefix: 'fas', iconName: icon };
    }
    return null;
}
let FontAwesomeIconCustomElement = class FontAwesomeIconCustomElement {
    constructor($element, container, viewCompiler, resources) {
        this.$element = $element;
        this.container = container;
        this.viewCompiler = viewCompiler;
        this.resources = resources;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/bordered-pulled-icons}
         */
        this.border = false;
        /**
         * Your own class name that will be added to the SVGElement
         */
        this.className = '';
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/fixed-width-icons}
         */
        this.fixedWidth = false;
        this.inverse = false;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list}
         */
        this.listItem = false;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/animating-icons}
         */
        this.pulse = false;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/animating-icons}
         */
        this.spin = false;
        this.style = {};
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/advanced/svg-symbols}
         */
        this.symbol = false;
        this.title = '';
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/power-transforms}
         */
        this.transform = '';
        this.classes = {};
        this.logger = LogManager.getLogger('aurelia-fontawesome');
    }
    static inject() { return [Element, Container, ViewCompiler, ViewResources]; }
    bind(bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = createOverrideContext(bindingContext, overrideContext);
        this.classes = {
            'fa-border': this.border,
            'fa-flip-horizontal': this.flip === 'horizontal' || this.flip === 'both',
            'fa-flip-vertical': this.flip === 'vertical' || this.flip === 'both',
            'fa-fw': this.fixedWidth,
            'fa-inverse': this.inverse,
            'fa-li': this.listItem,
            'fa-pulse': this.pulse,
            'fa-spin': this.spin,
            [`fa-${this.size}`]: !!this.size,
            [`fa-pull-${this.pull}`]: !!this.pull,
            [`fa-rotate-${this.rotation}`]: !!this.rotation,
            [`fa-stack-${this.stack}`]: !!this.stack
        };
    }
    attached() {
        this.compiledIcon = this.compileIcon();
    }
    detached() {
        if (this.compiledIcon) {
            this.compiledIcon.dispose();
        }
    }
    propertyChanged(name, newValue, oldValue) {
        if (!this.compiledIcon) {
            // Icon is not yet compiled as attached() is not called
            return;
        }
        const nameof = (name) => name;
        const $icon = this.compiledIcon.$icon;
        switch (name) {
            case nameof('border'):
                this.replaceClass($icon, newValue && 'fa-border', oldValue && 'fa-border');
                break;
            case nameof('flip'):
                this.replaceClass($icon, (newValue === 'horizontal' || newValue === 'both') && 'fa-flip-horizontal', oldValue && 'fa-flip-horizontal');
                this.replaceClass($icon, (newValue === 'vertical' || newValue === 'both') && 'fa-flip-vertical', oldValue && 'fa-flip-vertical');
                break;
            case nameof('fixedWidth'):
                this.replaceClass($icon, newValue && 'fa-fw', oldValue && 'fa-fw');
                break;
            case nameof('inverse'):
                this.replaceClass($icon, newValue && 'fa-inverse', oldValue && 'fa-inverse');
                break;
            case nameof('listItem'):
                this.replaceClass($icon, newValue && 'fa-li', oldValue && 'fa-li');
                break;
            case nameof('pulse'):
                this.replaceClass($icon, newValue && 'fa-pulse', oldValue && 'fa-pulse');
                break;
            case nameof('spin'):
                this.replaceClass($icon, newValue && 'fa-spin', oldValue && 'fa-spin');
                break;
            case nameof('size'):
                this.replaceClass($icon, newValue && `fa-${newValue}`, oldValue && `fa-${oldValue}`);
                break;
            case nameof('pull'):
                this.replaceClass($icon, newValue && `fa-pull-${newValue}`, oldValue && `fa-pull-${oldValue}`);
                break;
            case nameof('rotation'):
                this.replaceClass($icon, newValue && `fa-pull-${newValue}`, oldValue && `fa-pull-${oldValue}`);
                break;
            case nameof('stack'):
                this.replaceClass($icon, newValue && `fa-stack-${newValue}`, oldValue && `fa-stack-${oldValue}`);
                break;
            default:
                this.compiledIcon.dispose();
                this.compiledIcon = this.compileIcon();
                break;
        }
    }
    replaceClass(element, newClass, oldClass) {
        if (oldClass && newClass !== oldClass && element.classList.contains(oldClass)) {
            element.classList.remove(oldClass);
        }
        if (newClass) {
            element.classList.add(newClass);
        }
    }
    compileIcon() {
        const iconLookup = normalizeIconArgs(this.icon);
        if (iconLookup === null) {
            this.logger.error('Bound icon prop is either unsupported or null', this.icon);
            return;
        }
        const classes = objectWithKey('classes', [
            ...Object.keys(this.classes).filter(key => this.classes[key]),
            ...this.className.split(' ')
        ]);
        const transform = objectWithKey('transform', typeof this.transform === 'string'
            ? parse.transform(this.transform)
            : this.transform);
        const mask = objectWithKey('mask', normalizeIconArgs(this.mask));
        const renderedIcon = icon(iconLookup, Object.assign({}, classes, transform, mask, { attributes: this.getOtherAttributes(), styles: this.style, symbol: this.symbol, title: this.title }));
        if (!renderedIcon) {
            this.logger.error('Could not find icon', iconLookup);
            return;
        }
        const abstract = renderedIcon.abstract[0];
        const $icon = convert(DOM.createElement.bind(DOM), abstract);
        const template = `<template>${$icon.outerHTML}</template>`;
        const factory = this.viewCompiler.compile(template, this.resources);
        const view = factory.create(this.container, this.bindingContext);
        const slot = new ViewSlot(this.$element, true);
        slot.add(view);
        view.bind(this.bindingContext, this.overrideContext);
        return {
            $icon,
            dispose: () => {
                // It may be that the view is already removed from the slot,
                // e.g. if the element has an if.bind
                slot.removeAll();
                view.unbind();
            }
        };
    }
    /**
     * Get all non aurelia and non bound attributes and pass it to the
     * font awesome svg element
     */
    getOtherAttributes() {
        const attrs = this.$element.attributes;
        const otherAttrs = {};
        const ignore = ['class', 'style'];
        for (let i = attrs.length - 1; i >= 0; i--) {
            if (attrs[i].name.indexOf('au-') === -1 &&
                ignore.indexOf(attrs[i].name) === -1 &&
                attrs[i].name.indexOf('.') === -1 &&
                !(attrs[i].name in this)) {
                otherAttrs[attrs[i].name] = attrs[i].value;
            }
        }
        return otherAttrs;
    }
};
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "border", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "className", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "fixedWidth", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "flip", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "icon", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "inverse", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "listItem", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "mask", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "pull", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "pulse", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "rotation", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "size", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "spin", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "style", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "symbol", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "title", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "transform", void 0);
__decorate([
    bindable
], FontAwesomeIconCustomElement.prototype, "stack", void 0);
FontAwesomeIconCustomElement = __decorate([
    customElement('font-awesome-icon'),
    noView()
], FontAwesomeIconCustomElement);
export { FontAwesomeIconCustomElement };
//# sourceMappingURL=font-awesome-icon.js.map