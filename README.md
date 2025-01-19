# Dynamic Editor Width

Dynamically adjust your editor's text width via a status bar input or per-note YAML settings for a personalized writing space.

## Demo

![Demo video](/images/demo.mp4) 

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

## License

[MIT](https://github.com/bwya77/dynamic-editor-width/blob/main/LICENSE)
