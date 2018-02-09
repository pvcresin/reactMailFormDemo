<!-- $theme: gaia -->

フロントエンドじゃない人用
React講座
===

---
# はじめに
#### 目標
- Reactの概念を何となく理解する
- Reactの環境を一から作れるようになる
- 軽めのReactを書けるようになる
- （Nodeのサーバを建てられるようになる）
#### やらないこと
- コンポーネント時代のCSS（`CSS-modules`）
<!-- page_number: true -->

---
# 今回使うもの
- Visual Studio Code
- Node.js （v8.x）
- Yarn
- Google Chrome

---
# ちなみに
- 今回，最終的にできるファイルはここ⬇
https://github.com/pvcresin/reactMailFormDemo
- 前回のスライドを読み，ツールを使いこなせる前提で進めていきます

---
# Menu
- 復習
- Reactとは
- 準備（Chrome拡張，VSC拡張）
- Reactをビルドしてみる
- Mail Formを作る
- 公開されているReact Componentを使用する

---
# [Yarn](https://yarnpkg.com/lang/en/)の復習
- `yarn init` = package.jsonを作る
- `yarn` = package.jsonの依存モジュールを全入れ
- `yarn add xxx` = 依存ライブラリ`xxx`を入れる
- `yarn add -D xxx` = 開発用ライブラリ`xxx`を入れる
- `yarn xxx`= npm scriptのタスク`xxx`を実行

---
# JavaScript（ES6）の復習
- 変数宣言：`const`（再代入不可）, `let`（再代入可）
- アロー関数（≒無名関数・ラムダ式）
  ```js
  // 従来の関数
  var f = function(x) {
    return x * 2
  }
  
  // アロー関数
  const f = (x) => {
    return x * 2
  }
  const f = (x) => x  * 2	// 1行なら中カッコはずせる
  const f = x => x * 2	// 引数1つならカッコ不要
  ```

---
# JavaScript（ES6）の復習
- クラス構文（内部的には関数に変換される）
  ```js
  class Person {
    constructor(name) {
      this.name = name
    }
    hello() {
      console.log(`My name is ${this.name}.`)
    }
  }
  
  const p = new Person('es6')
  p.hello()	//=> "My name is es6."
  ```

---
# JavaScript（ES6）の復習
- `import` / `export` 
  - **person.js** 
  	- `export default class Person { }`
  - **index.js** 
  	- `import Person from './person'`

---
# React.jsとは
- UIのコンポーネント（構成部品）を作るためのライブラリ
- FacebookのOSS

## 特徴
- Virtual DOM（仮想DOM）が速い
- JS内にHTMLを書くようなJSX記法（なくても可）
- Reactの記法でiOSやAndroidのネイティブアプリが書ける[React Native](https://facebook.github.io/react-native/)もある

---
# Virtual DOMとは
- 生のDOM（HTMLインスタンス）に1対1対応するJSのオブジェクトのこと
- その差分によって必要最低限のDOM操作で状態遷移を実現
- データが変更されると自動で差分レンダリング

---
# 何が違うか
#### 従来
- データに変更があったら，生のDOM要素から対応する部分を手で探しだし，中身を書き換える
	➜ 変更箇所を探すのが大変
#### Virtual DOM
- 自動で差分が更新されて楽
- ただのJSのオブジェクトの比較なので軽い

---
# JSX記法
```js
class App extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    )
  }
}

ReactDOM.render(
  <App />, 
  document.querySelector('main')
)
```
拡張子は`.js`でも`.jsx`でもよさそう

---
# 準備
- VSC設定
  ```json
  "editor.formatOnSave": true,
  "files.trimTrailingWhitespace": true, 
  ```
- Chrome拡張
  - [React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ja)
      - `拡張`からファイルへのアクセスを許可しとく 
 
- プロジェクトフォルダを作り，`yarn init -y`する

---
# 依存モジュール
`yarn add react react-dom autobind-decorator`
- `react` : React本体
- `react-dom` : オブジェクトをDOMと結びつける
- `autobind-decorator` : 
`@autobind`でメソッドをオブジェクトにバインド
これがないとコードが長くなる

---
# 開発モジュール
`yarn add -D babel-core babel-loader babel-plugin-transform-decorators-legacy babel-preset-es2015 babel-preset-react webpack`
- `webpack` : JS合体君・バンドラ
- `babel-core` : JS変換君
- `babel-loader` : webpack上でバベる君
- `babel-preset-es2015` : ES6 ➜ ES5
- `babel-preset-react` : JSX ➜ 普通のJS
- `babel-plugin-transform-decorators-legacy` : 
`@`（デコレータ）をコード内で使えるようにする君

---
# ファイルを用意
- `src/`
	- `index.jsx`
- `dist/`
	- `index.html`
	- `style.css`
- `webpack.config.js` : webpackの設定
- `jsconfig.json` : 
VSCが`@`に対してエラー表示しないように設定

---
# jsconfig.json
```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "module": "es6",
    "target": "ES6"
  },
  "exclude": [
    "node_modules"
  ]
}
```
写すだけでOK
プロジェクトルートに置いておく

---
# index.html
```html
<!DOCTYPE html>
<html lang='ja'>
  <head>
    <title>Mail Form</title>
    <meta charset='UTF-8'>
    <link rel='stylesheet' href='style.css'>
  </head>
  <body>
    <main></main>
    <script src='index.js'></script>
  </body>
</html>
```
style.cssは空で大丈夫

---
# webpack.config.js
- `src/index.jsx`を`dist`に吐き出す
- JSでimportする時に拡張子`js/jsx`を省略 : `resolve`
```js
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    index: path.join(__dirname, './src/index.jsx')
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js'
  },
```

---
# webpack.config.js
```js
  module: {
    rules: [{
      test: /\.js|jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['react', 'es2015'],
        plugins: ['transform-decorators-legacy']
      }
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
```

---
# index.jsx
```js
import React, { Component } from 'react'
import ReactDOM, { render } from 'react-dom'

render(<h1>React</h1>, document.querySelector('main'))
```
`index.html`内の`main`タグに
`h1`タグをマウント（レンダリング）する

---
# npm script
```json
"scripts": {
  "build": "webpack",
  "watch": "npm run build -- -w"
}
```
- `yarn build` : webpackでJSを1度だけビルド
- `yarn watch`: 変更を検知してビルドし直し続ける

`yarn watch`して`dist/index.html`を開いてみよう
h1タグがレンダリングされているはず

---
# 自作のコンポーネント
- `dist/component/App.jsx`を作る
```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import autobind from 'autobind-decorator'

export default class App extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div>App</div>
    )
  }
}
```

---
# index.jsx

```js
import React, { Component } from 'react'
import ReactDOM, { render } from 'react-dom'
import App from './components/App'

render(<App />, document.querySelector('main'))
```
`yarn watch`して，ブラウザをリロードしたら
`main`タグの中に`App`タグがマウントされる

---
# Eventをハンドリングする


















