var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "@fortawesome/fontawesome-svg-core", "./converter", "./utils"], function (require, exports, aurelia_framework_1, fontawesome_svg_core_1, converter_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    var FontAwesomeIconCustomElement = /** @class */ (function () {
        function FontAwesomeIconCustomElement($element, container, viewCompiler, resources) {
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
            this.logger = aurelia_framework_1.LogManager.getLogger('aurelia-fontawesome');
        }
        FontAwesomeIconCustomElement.inject = function () { return [Element, aurelia_framework_1.Container, aurelia_framework_1.ViewCompiler, aurelia_framework_1.ViewResources]; };
        FontAwesomeIconCustomElement.prototype.bind = function (bindingContext, overrideContext) {
            var _a;
            this.bindingContext = bindingContext;
            this.overrideContext = aurelia_framework_1.createOverrideContext(bindingContext, overrideContext);
            this.classes = (_a = {
                    'fa-border': this.border,
                    'fa-flip-horizontal': this.flip === 'horizontal' || this.flip === 'both',
                    'fa-flip-vertical': this.flip === 'vertical' || this.flip === 'both',
                    'fa-fw': this.fixedWidth,
                    'fa-inverse': this.inverse,
                    'fa-li': this.listItem,
                    'fa-pulse': this.pulse,
                    'fa-spin': this.spin
                },
                _a["fa-" + this.size] = !!this.size,
                _a["fa-pull-" + this.pull] = !!this.pull,
                _a["fa-rotate-" + this.rotation] = !!this.rotation,
                _a["fa-stack-" + this.stack] = !!this.stack,
                _a);
        };
        FontAwesomeIconCustomElement.prototype.attached = function () {
            this.compiledIcon = this.compileIcon();
        };
        FontAwesomeIconCustomElement.prototype.detached = function () {
            if (this.compiledIcon) {
                this.compiledIcon.dispose();
            }
        };
        FontAwesomeIconCustomElement.prototype.propertyChanged = function (name, newValue, oldValue) {
            if (!this.compiledIcon) {
                // Icon is not yet compiled as attached() is not called
                return;
            }
            var nameof = function (name) { return name; };
            var $icon = this.compiledIcon.$icon;
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
                    this.replaceClass($icon, newValue && "fa-" + newValue, oldValue && "fa-" + oldValue);
                    break;
                case nameof('pull'):
                    this.replaceClass($icon, newValue && "fa-pull-" + newValue, oldValue && "fa-pull-" + oldValue);
                    break;
                case nameof('rotation'):
                    this.replaceClass($icon, newValue && "fa-pull-" + newValue, oldValue && "fa-pull-" + oldValue);
                    break;
                case nameof('stack'):
                    this.replaceClass($icon, newValue && "fa-stack-" + newValue, oldValue && "fa-stack-" + oldValue);
                    break;
                default:
                    this.compiledIcon.dispose();
                    this.compiledIcon = this.compileIcon();
                    break;
            }
        };
        FontAwesomeIconCustomElement.prototype.replaceClass = function (element, newClass, oldClass) {
            if (oldClass && newClass !== oldClass && element.classList.contains(oldClass)) {
                element.classList.remove(oldClass);
            }
            if (newClass) {
                element.classList.add(newClass);
            }
        };
        FontAwesomeIconCustomElement.prototype.compileIcon = function () {
            var _this = this;
            var iconLookup = normalizeIconArgs(this.icon);
            if (iconLookup === null) {
                this.logger.error('Bound icon prop is either unsupported or null', this.icon);
                return;
            }
            var classes = utils_1.objectWithKey('classes', Object.keys(this.classes).filter(function (key) { return _this.classes[key]; }).concat(this.className.split(' ')));
            var transform = utils_1.objectWithKey('transform', typeof this.transform === 'string'
                ? fontawesome_svg_core_1.parse.transform(this.transform)
                : this.transform);
            var mask = utils_1.objectWithKey('mask', normalizeIconArgs(this.mask));
            var renderedIcon = fontawesome_svg_core_1.icon(iconLookup, __assign({}, classes, transform, mask, { attributes: this.getOtherAttributes(), styles: this.style, symbol: this.symbol, title: this.title }));
            if (!renderedIcon) {
                this.logger.error('Could not find icon', iconLookup);
                return;
            }
            var abstract = renderedIcon.abstract[0];
            var $icon = converter_1.default(aurelia_framework_1.DOM.createElement.bind(aurelia_framework_1.DOM), abstract);
            var template = "<template>" + $icon.outerHTML + "</template>";
            var factory = this.viewCompiler.compile(template, this.resources);
            var view = factory.create(this.container, this.bindingContext);
            var slot = new aurelia_framework_1.ViewSlot(this.$element, true);
            slot.add(view);
            view.bind(this.bindingContext, this.overrideContext);
            return {
                $icon: $icon,
                dispose: function () {
                    slot.remove(view);
                    view.unbind();
                }
            };
        };
        /**
         * Get all non aurelia and non bound attributes and pass it to the
         * font awesome svg element
         */
        FontAwesomeIconCustomElement.prototype.getOtherAttributes = function () {
            var attrs = this.$element.attributes;
            var otherAttrs = {};
            var ignore = ['class', 'style'];
            for (var i = attrs.length - 1; i >= 0; i--) {
                if (attrs[i].name.indexOf('au-') === -1 &&
                    ignore.indexOf(attrs[i].name) === -1 &&
                    attrs[i].name.indexOf('.') === -1 &&
                    !(attrs[i].name in this)) {
                    otherAttrs[attrs[i].name] = attrs[i].value;
                }
            }
            return otherAttrs;
        };
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "border", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "className", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "fixedWidth", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "flip", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "icon", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "inverse", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "listItem", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "mask", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "pull", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "pulse", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "rotation", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "size", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "spin", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "style", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "symbol", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "title", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "transform", void 0);
        __decorate([
            aurelia_framework_1.bindable
        ], FontAwesomeIconCustomElement.prototype, "stack", void 0);
        FontAwesomeIconCustomElement = __decorate([
            aurelia_framework_1.customElement('font-awesome-icon'),
            aurelia_framework_1.noView()
        ], FontAwesomeIconCustomElement);
        return FontAwesomeIconCustomElement;
    }());
    exports.FontAwesomeIconCustomElement = FontAwesomeIconCustomElement;
});
//# sourceMappingURL=font-awesome-icon.js.map