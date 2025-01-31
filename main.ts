"use strict";

import { Plugin, PluginSettingTab, App, Notice, Setting } from "obsidian";

interface PluginSettings {
    editorWidth: string;
    editorWidthDefault: string;
    showInStatusBar: boolean;
    controlStyle: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
    editorWidth: "20",
    editorWidthDefault: "20",
    showInStatusBar: true,
    controlStyle: "input"
};

class EditorWidthInput extends Plugin {
    settings: PluginSettings;
    pattern: RegExp;
    currentWidth: number | null;
    statusBarInput: HTMLInputElement | null;
    statusBarItemEl: HTMLElement | null;
    sliderValue: HTMLSpanElement | null;

    constructor(app: App, manifest: any) {
        super(app, manifest);
        this.pattern = /^(?:[0-9]{1,2}|100)$/;
        this.currentWidth = null;
        this.statusBarInput = null;
        this.statusBarItemEl = null;
        this.sliderValue = null;
    }

    async onload() {
        await this.loadSettings();
        
        this.addBaseStyles();
        
        this.registerEvent(
            this.app.workspace.on("file-open", () => this.updateEditorClass())
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

    createTextInput(container: HTMLElement) {
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
            this.handleInputChange((event.target as HTMLInputElement).value, input);
        });

        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.handleInputChange((event.target as HTMLInputElement).value, input);
                input.blur();
            }
        });

        container.appendChild(input);
    }

    createSlider(container: HTMLElement) {
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
            const target = event.target as HTMLInputElement;
            valueDisplay.textContent = target.value;
            this.handleInputChange(target.value, slider);
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

    toggleStatusBarDisplay(show: boolean) {
        if (show && !this.statusBarItemEl) {
            this.createInput();
        } else if (!show && this.statusBarItemEl) {
            this.removeInput();
        }
    }

    handleInputChange(value: string, input: HTMLInputElement) {
        if (this.validateString(value)) {
            this.settings.editorWidth = value;
            this.settings.editorWidthDefault = value;
            this.saveSettings();
            this.updateEditorClass();
        } else {
            input.value = this.settings.editorWidth;
            new Notice("Editor width must be a number from 0 to 100!");
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

    validateString(inputString: string): boolean {
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
                const valueDisplay = this.statusBarInput.previousSibling as HTMLSpanElement;
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

class EditorWidthSettingTab extends PluginSettingTab {
    plugin: EditorWidthInput;

    constructor(app: App, plugin: EditorWidthInput) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName("Default editor width")
            .setDesc("Set the default editor width value (0-100). This will be used for all notes unless overridden by adding 'editor-width: [value]' to a note's YAML frontmatter.")
            .addText(text => text
                .setPlaceholder("20")
                .setValue(this.plugin.settings.editorWidthDefault)
                .onChange(async (value) => {
                    if (this.plugin.validateString(value)) {
                        this.plugin.settings.editorWidthDefault = value;
                        const file = this.plugin.app.workspace.getActiveFile();
                        if (file) {
                            const metadata = this.plugin.app.metadataCache.getFileCache(file);
                            if (!metadata?.frontmatter?.["editor-width"]) {
                                this.plugin.settings.editorWidth = value;
                                this.plugin.updateEditorClass();
                            }
                        }
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName("Show width control in status bar")
            .setDesc("Toggle visibility of the width control input in the status bar.")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showInStatusBar)
                .onChange(async (value) => {
                    this.plugin.settings.showInStatusBar = value;
                    this.plugin.toggleStatusBarDisplay(value);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Control style")
            .setDesc("Choose between a text input or slider control in the status bar.")
            .addDropdown(dropdown => dropdown
                .addOption("input", "Input box")
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
    }
}

export default EditorWidthInput;