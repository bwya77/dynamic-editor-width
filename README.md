# Dynamic Editor Width

Dynamically adjust your editor's text width via a status bar input or per-note YAML settings for a personalized writing space. This extension was inspired by the [Editor Width Slider](https://github.com/MugishoMp/obsidian-editor-width-slider/tree/master) extension, but I have added additional features and changed how it renders the page so there is no more delay. 

## Demo

![Demo video](/images/demo.gif) 

## Features

- Adjust editor width through a status bar control (choose between slider or input box)
- Set default width for all notes
- Override width per note using YAML frontmatter
- Real-time width updates
- Values from 0-100 (corresponds to adding 0-1000px to the base width)

## Installation

1. Open Obsidian Settings
2. Navigate to Community Plugins and disable Safe Mode
3. Click Browse and search for "Dynamic Editor Width"
4. Install the plugin
5. Enable the plugin in your Community Plugins list

## Usage

### Global Width Control

The plugin adds a control to your status bar (can be toggled in settings):
- Use the slider or input box to adjust width
- Values range from 0-100
- Changes apply immediately

![Status Bar Input](/images/inputbox.png)
![Status Bar Slider](/images/sliderimg.png)

### Per-Note Width Settings

To set a specific width for individual notes, add this to your note's YAML frontmatter:

```yaml
---
editor-width: 30
---
```

![Frontmatter Example](/images/frontmatter.png)

### Settings

In the plugin settings, you can:

- Set the default editor width
- Toggle the status bar control visibility
- Choose between slider or input box control style

![Settings Panel](/images/settings.png)

## Examples

### Default Note
Here is what a note would look like without any changes to the width

![Regular Example](/images/regular.png)

### Custom Width Note
And this is what a note would look like, changing the value to 30

![width set to 30](/images/30.png)

## Support

If you encounter any issues or have suggestions:

- Create an issue on [GitHub](https://github.com/bwya77/dynamic-editor-width/issues)
- Support the development:
  - [Buy Me a Coffee](https://buymeacoffee.com/bwya77)
  - [GitHub Sponsor](https://github.com/sponsors/bwya77)

## Development

Want to contribute or modify the plugin? Here's how to get started with the source code:

1. Create a directory for your GitHub projects:
   ```bash
   cd path/to/somewhere
   mkdir Github
   cd Github
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/bwya77/dynamic-editor-width.git
   ```

3. Navigate to the plugin directory:
   ```bash
   cd autofit-tabs
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start development build mode:
   ```bash
   npm run dev
   ```
   This command will keep running in the terminal and automatically rebuild the plugin whenever you make changes to the source code.

6. You'll see a `main.js` file appear in the plugin directory - this is the compiled version of your plugin.

### Testing Your Changes

To test your modifications:

1. Create a symbolic link or copy your plugin folder to your vault's `.obsidian/plugins/` directory
2. Enable the plugin in Obsidian's community plugins settings
3. Use the developer console (Ctrl+Shift+I) to check for errors and debug

### Making Contributions

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request with a clear description of your changes

## License

[MIT](https://github.com/bwya77/dynamic-editor-width/blob/main/LICENSE)
