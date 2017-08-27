# uiNavbar
> Navbar websemble component

## Getting started

Include UI Navbar in your project dependencies
(see [websemble generator]
  (https://github.com/cybersettler/generator-websemble/wiki)).
In your project's bower.json:

```json
{
  "dependencies": {
    "uiForm": "cybersettler/uiNavbar"
  }
}
```

## API

### data-model

Contains data to be displayed in the navbar elements.

### data-display

The data structure of the model is an object containing
an items attribute, the value of which is an array of strings
or objects. If the item is a string, it will be interpreted
as the title of a text field. Objects have the following
attributes:

* __name__(string): Property name of the model to be used as title.
* __title__(string): The title to display.
* __type__(enum: text | link | button | divider): Element type, default is text.
* __position__(enum: left | right | auto): Element position
* __href__(string): Navigation target
