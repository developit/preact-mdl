# preact-mdl

[![NPM](http://img.shields.io/npm/v/preact-mdl.svg)](https://www.npmjs.com/package/preact-mdl)
[![travis-ci](https://travis-ci.org/developit/preact-mdl.svg?branch=master)](https://travis-ci.org/developit/preact-mdl)

A collection of [Preact] Components that encapsulate Google's [Material Design Lite].

> **Quick Start**: Grab the [JSFiddle App Skeleton](https://jsfiddle.net/developit/weq28uq3/).
>
> **Using TypeScript?** [preact-mdl-example](https://github.com/tbekolay/preact-mdl-example) is an instant full project setup.

## Installation

      $ npm install --save material-design-lite preact-mdl

## What does it look like?

See for yourself - `preact-mdl` powers [ESBench](http://esbench.com) and [Nectarine](http://nectarine.rocks).

_Here's some live-action demos:_

<img src="https://i.gyazo.com/d6db6fedde6734bcc8450a4c16611704.gif" width="319" />
<img src="https://i.gyazo.com/892ba9ed1e0c43bd024078d650c01ce4.gif" width="199" />

<img src="https://i.gyazo.com/352cc02ba18a811ee36a8a4837688023.gif" width="254" />
<img src="https://i.imgur.com/I6RDmBm.gif" width="122" />
 <img src="https://i.gyazo.com/70724d88b290ff47c793cf6f9ddc13f1.gif" width="107" />

## Usage

* Add MDL stylesheets to your html
```html 
<!DOCTYPE html>
<html style="height: 100%; width: 100%;">
<head>
    <meta charset="utf-8">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.2.1/material.indigo-pink.min.css">
    <title>Preact-mdl Example</title>
</head>
<body style="height: 100%; width: 100%;">
  <script src="/bundle.js"></script>
</body>
</html>
```

* Import mdl module and components from preact-mdl

```JavaScript
import { h, Component } from 'preact';
import mdl from 'material-design-lite/material';
import { Button } from 'preact-mdl';

export default class MyButton extends Component {
  render() {
    return(
      <div>
        <Button>I am button!</Button>
      </div>
    )
  }
}

```

## Documentation

Documentation is on it's way!


For now, browse these Open Source projects using `preact-mdl`:

- **[Documentation Viewer](https://github.com/developit/documentation-viewer/)**
- **[Nectarine.rocks](https://github.com/developit/nectarine.rocks/)**
- _[add yours!](https://github.com/developit/preact-mdl/issues)_


---


### License

[MIT]


[Material Design Lite]: http://www.getmdl.io
[Preact]: https://github.com/developit/preact
[MIT]: http://choosealicense.com/licenses/mit/
