"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
    for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var main_exports = {};
__export(main_exports, {
    default: () => EditorWidthInput
});
module.exports = __toCommonJS(main_exports);

var import_obsidian = require("obsidian");

const DEFAULT_SETTINGS = {
    editorWidth: "20",
    editorWidthDefault: "20",
    showInStatusBar: true,
    controlStyle: "input"
};

class EditorWidthInput extends import_obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.pattern = /^(?:[0-9]{1,2}|100)$/;
        this.currentWidth = null;
        this.statusBarInput = null;
        this.statusBarItemEl = null;
        this.sliderValue = null;
    }

    async onload() {
        await this.loadSettings();
        
        if (this.settings.editorWidth === this.settings.editorWidthDefault) {
            this.settings.editorWidth = this.settings.editorWidthDefault;
            await this.saveSettings();
        }
        
        this.addBaseStyles();
        
        this.registerEvent(
            this.app.workspace.on("file-open", () => {
                this.updateEditorClass();
            })
        );
        
        if (this.settings.showInStatusBar) {
            this.createInput();
        }
        
        this.addSettingTab(new EditorWidthSettingTab(this.app, this));
    }

    onunload() {
        this.cleanUpResources();
    }

    createInput() {
        const inputContainer = document.createElement("div");
        inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 8px;
        `;

        if (this.settings.controlStyle === "input") {
            this.createTextInput(inputContainer);
        } else {
            this.createSlider(inputContainer);
        }

        this.statusBarItemEl = this.addStatusBarItem();
        this.statusBarItemEl.appendChild(inputContainer);
    }

    createTextInput(container) {
        const input = document.createElement("input");
        this.statusBarInput = input;
        input.type = "text";
        input.value = this.settings.editorWidth;
        input.style.cssText = `
            width: 40px;
            height: 18px;
            text-align: center;
            border-radius: 4px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-secondary);
            color: rgb(96,147,227);
            padding: 1px 4px;
        `;

        input.addEventListener("keypress", (event) => {
            if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
            }
        });

        input.addEventListener("blur", (event) => {
            this.handleInputChange(event.target.value, input);
        });

        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.handleInputChange(event.target.value, input);
                input.blur();
            }
        });

        container.appendChild(input);
    }

    createSlider(container) {
        const valueDisplay = document.createElement("span");
        valueDisplay.style.cssText = `
            margin-right: 8px;
            color: rgb(96,147,227);
            min-width: 20px;
            text-align: right;
            font-size: 12px;
        `;
        valueDisplay.textContent = this.settings.editorWidth;
        container.appendChild(valueDisplay);

        const slider = document.createElement("input");
        this.statusBarInput = slider;
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = this.settings.editorWidth;
        slider.style.cssText = `
            width: 100px;
            margin: auto 0;
        `;

        slider.addEventListener("input", (event) => {
            valueDisplay.textContent = event.target.value;
            this.handleInputChange(event.target.value, slider);
        });

        container.appendChild(slider);
    }

    removeInput() {
        if (this.statusBarItemEl) {
            this.statusBarItemEl.remove();
            this.statusBarItemEl = null;
            this.statusBarInput = null;
        }
    }

    toggleStatusBarDisplay(show) {
        if (show && !this.statusBarItemEl) {
            this.createInput();
        } else if (!show && this.statusBarItemEl) {
            this.removeInput();
        }
    }

    handleInputChange(value, input) {
        if (this.validateString(value)) {
            this.settings.editorWidth = value;
            this.settings.editorWidthDefault = value;
            this.saveSettings();
            this.updateEditorClass();
        } else {
            input.value = this.settings.editorWidth;
            this.app.notices.create("Editor width must be a number from 0 to 100!");
        }
    }

    addBaseStyles() {
        const css = document.createElement("style");
        css.id = "editor-width-styles";
        
        let styles = '';
        for (let i = 0; i <= 100; i += 5) {
            styles += `
                .editor-width-${i} {
                    --file-line-width: calc(700px + ${i * 10}px) !important;
                }
            `;
        }
        
        css.textContent = styles;
        document.head.appendChild(css);
    }

    validateString(inputString) {
        return this.pattern.test(inputString);
    }

    updateEditorClass() {
        const file = this.app.workspace.getActiveFile();
        if (!file) return;

        const metadata = this.app.metadataCache.getFileCache(file);
        
        let width = metadata?.frontmatter?.["editor-width"];
        
        if (!width || !this.validateString(width)) {
            width = this.settings.editorWidthDefault;
        }

        this.settings.editorWidth = width;
        this.saveSettings();

        if (this.statusBarInput) {
            this.statusBarInput.value = width;
            if (this.settings.controlStyle === "slider") {
                const valueDisplay = this.statusBarInput.previousSibling;
                if (valueDisplay) {
                    valueDisplay.textContent = width;
                }
            }
        }

        const roundedWidth = Math.round(parseInt(width) / 5) * 5;
        
        if (this.currentWidth !== roundedWidth) {
            if (this.currentWidth !== null) {
                document.body.classList.remove(`editor-width-${this.currentWidth}`);
            }
            
            document.body.classList.add(`editor-width-${roundedWidth}`);
            this.currentWidth = roundedWidth;
        }
    }

    cleanUpResources() {
        const styleElement = document.getElementById("editor-width-styles");
        if (styleElement) {
            styleElement.remove();
        }
        if (this.currentWidth !== null) {
            document.body.classList.remove(`editor-width-${this.currentWidth}`);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class EditorWidthSettingTab extends import_obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        new import_obsidian.Setting(containerEl)
            .setName("Default Editor Width")
            .setDesc("Set the default editor width value. This will be used for all notes unless overridden by frontmatter.")
            .addText(text => text
                .setPlaceholder("20")
                .setValue(this.plugin.settings.editorWidthDefault)
                .onChange(async (value) => {
                    if (this.plugin.validateString(value)) {
                        this.plugin.settings.editorWidthDefault = value;
                        const file = this.plugin.app.workspace.getActiveFile();
                        const metadata = this.plugin.app.metadataCache.getFileCache(file);
                        if (!metadata?.frontmatter?.["editor-width"]) {
                            this.plugin.settings.editorWidth = value;
                            this.plugin.updateEditorClass();
                        }
                        await this.plugin.saveSettings();
                    }
                }));

        new import_obsidian.Setting(containerEl)
            .setName("Show Width Control in Status Bar")
            .setDesc("Toggle visibility of the width control input in the status bar.")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showInStatusBar)
                .onChange(async (value) => {
                    this.plugin.settings.showInStatusBar = value;
                    this.plugin.toggleStatusBarDisplay(value);
                    await this.plugin.saveSettings();
                }));

        new import_obsidian.Setting(containerEl)
            .setName("Control Style")
            .setDesc("Choose between a text input or slider control in the status bar.")
            .addDropdown(dropdown => dropdown
                .addOption("input", "Input Box")
                .addOption("slider", "Slider")
                .setValue(this.plugin.settings.controlStyle)
                .onChange(async (value) => {
                    this.plugin.settings.controlStyle = value;
                    if (this.plugin.settings.showInStatusBar) {
                        this.plugin.removeInput();
                        this.plugin.createInput();
                    }
                    await this.plugin.saveSettings();
                }));

        new import_obsidian.Setting(containerEl)
            .setName("Note:")
            .setDesc(`To override the default width for a specific note, add "editor-width: [value]" to that note's YAML frontmatter.`);
    }
}