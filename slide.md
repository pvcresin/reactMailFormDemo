<!-- $theme: gaia -->

React はじめの一歩
===

---
# はじめに
#### 目標
- Reactの概念を何となく理解する
- 軽めのReactを書けるようになる
- （Nodeのサーバを建てられるようになる）
#### やらないこと
- CSS（`CSS-modules`）
- アーキテクチャ（`Flux`，`Redux`）
<!-- page_number: true -->

---
# 事前準備
#### 使うもの
- Google Chrome, Visual Studio Code，Yarn，Node.js （v8.x）

#### ちなみに
- 今回，最終的にできるファイルは[ここ](https://github.com/pvcresin/reactMailFormDemo)
- [前回](https://speakerdeck.com/pvcresin/shi-dang-nijiao-eruzui-jin-falsehurontoendokai-fa-di-bu)のスライドを読み，ツールを使いこなせる前提で進めていきます

---
# Menu
- 復習
- Reactとは
- 準備（Chrome拡張，VSC拡張）
- Reactを動かしてみる
- メールフォームを作る
	- Promiseとfetch
- ライブラリを使ってみる

---
# [Yarn](https://yarnpkg.com/lang/en/)の復習
- `yarn init` = package.jsonを作る
- `yarn` = package.jsonの依存モジュールを全入れ
- `yarn add xxx` = 依存ライブラリ`xxx`を入れる
- `yarn add -D xxx` = 開発用ライブラリ`xxx`を入れる
- `yarn xxx`= npm scriptのタスク`xxx`を実行

---
# JavaScript（ES6）の復習
- 変数宣言：再代入不可の`const`, 再代入可の`let`
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
  const f = (x) => x  * 2	// 1行なら中カッコ{}はずせる
  const f = x => x * 2	// 引数1つならカッコ()不要
  ```

---
- クラス構文
（内部的には関数に変換されるらしい）
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
- `import` / `export`
  - **person.js**
  	```js
  	export default class Person { }
	```
  - **index.js**
	```js
	`import Person from './person'
	```
	importすることでindex.jsでもPersonクラスが使える

---
# React.jsとは
- UIのコンポーネント（構成部品）を作るためのライブラリ
- FacebookのOSS

#### 特徴
- 仮想DOM（Virtual DOM）が速い
- JS内にHTMLを書くようなJSX記法（なくても可）
- Reactの記法でiOSやAndroidのネイティブアプリが書ける[React Native](https://facebook.github.io/react-native/)もある

---
# 仮想DOMとは
- 生のDOM（HTMLインスタンス）に1対1対応するJSのオブジェクトのこと
- その差分によって必要最低限のDOM操作で状態遷移を実現
- データが変更されると自動で差分レンダリング

---
# 何が違うか
#### 従来
- データに変更があったら，生のDOM要素から対応する部分を手で探しだし，中身を書き換える
	➜ 変更箇所を探すのが大変
#### 仮想DOM
- 自動で差分が更新されて楽
- ただのJSのオブジェクトの比較なので軽い

---
# JSX記法
JSの言語拡張，JS内にHTMLタグ書けるイメージ
```js
class App extends Component {
  render() {
    return (
      <div>Hello React</div>
    )
  }
}

render(
  <App />, document.querySelector('main')
)
```
拡張子は`.jsx`（`.js`でもよさそう）

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
`yarn add react react-dom`
- `react` : React本体
- `react-dom` : オブジェクトをDOMと結びつける

---
# 開発モジュール
`yarn add -D babel-core babel-loader babel-plugin-transform-decorators-legacy babel-preset-es2015 babel-preset-react webpack`
- `webpack` : JS合体君・バンドラ
- `babel-core` : JSを変換する（**バベる**）君
- `babel-loader` : webpack上でバベれるようにする君
  - `babel-preset-es2015` : ES6 ➜ ES5
  - `babel-preset-react` : JSX ➜ 普通のJS
  - `babel-plugin-transform-decorators-legacy` :
  `@`（デコレータ）を使えるようにする君

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
プロジェクトルートに置いておく
今後一切触らない

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
- JSでimportする時に拡張子`js`，`jsx`を省略する
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
- jsxのファイルに書かれたreactやらes6やらデコレータを普通のJSに変換する

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
# Reactを動かしてみる
npm scriptはこんなん
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
# コンポーネントを作る
- `dist/component/App.jsx`を作る
    ```jsx
    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'

    export default class App extends Component {
      constructor(props) {
        super(props)
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
# イベントをハンドリングする
関数を定義し，onClickでイベントハンドラを登録
```jsx
// App.jsx
submit() {
  alert(`submit!!`)
}
render() {
  return (
    <div>
      <button
      	onClick={this.submit.bind(this)}>submit</button>
    </div>
  )
}
```

---
# `autobind-decorator`を使う
- イベントの度に`.bind(this)`を書かなくてもOKに
- `yarn add autobind-decorator`

```jsx
import autobind from 'autobind-decorator' // importして
```
```jsx
@autobind // ってつけると
submit() {
  /* 処理 */
}
```
```jsx
// .bind(this)がなくなってスッキリ
<button onClick={this.submit}>submit</button>
```

---
# Props
親コンポーネントから渡されたプロパティ（不変）

- 例：Todoのリストを表示するアプリ
`App` ➜ (list) ➜ `TodoList` ➜ (text) ➜ `Todo`
- Propsの渡し方
  ```jsx
  <Todo text='test' />
  ```
- Stateを持たないコンポーネントは関数でも書ける
  ```jsx
  const Todo = (props) => (<div>{props.text}</div>)
  ```

---
# State

そのコンポーネントが持っている状態（可変）

- 例：フォームなどで入力されたテキストの保持
  1. `<input type='text' />`
  1. inputの値はStateのデータを表示する
  `value={this.state.name}`
  1. 入力時，自コンポーネント内のStateに保存
  `onChange={this.editName}`

`Props`も`State`も`React Developer Tools`で見れる

---
# Stateを使ってみる

```jsx
constructor(props) {
  super(props)
  this.state = {	// stateを宣言＆初期値を設定
    name: ''
  }
}
@autobind
editName(e) {	// イベントe -> テキストをstateのnameに保存
  this.setState({ name: e.currentTarget.value })
}
```
```jsx
<input type='text'
  onChange={this.editName} value={this.state.name} />
```
コンポーネント内のデータと見た目が結びついた

---
# メールフォームを作る

- これまでを踏まえて，Stateに`name`と`text`を持ち，見た目と結びついたコンポーネントを書いてみる
```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      text: ''
    }
  }
```

---
```jsx
  @autobind
  editName(e) {
    this.setState({ name: e.currentTarget.value })
  }
  @autobind
  editText(e) {
    this.setState({ text: e.currentTarget.value })
  }
  @autobind
  submit() {
    alert(
      `氏名: ${this.state.name} \n内容: ${this.state.text}`
    )
  }
```
続く

---
```jsx
  render() {
    return (
      <div>
        <p>
          <label>name</label>
          <input type='text' onChange={this.editName}
            value={this.state.name} />
        </p>
        <p>
          <label>text</label>
          <textarea onChange={this.editText}
            value={this.state.text}></textarea>
        </p>
        <button onClick={this.submit}>submit</button>
      </div>
    )
  }
}
```

---
# cssも適当に作ったのでコピる

https://github.com/pvcresin/reactMailFormDemo/blob/master/dist/style.css

`dist`の直下の`style.css`にコピる
- Rawボタンを押すと，コードがコピりやすくなる

---
# 基盤完成

- これでinputから値を取得してalertに出すまで完成
- あとはNodeでサーバを立てて，送信して結果取得したら終わり

---
# サーバ起動準備

- `yarn add express body-parser`
	- `express`:
Nodeのサーバ立てるのに便利なフレームワーク
	- `body-parser`: JSON扱えるようにする君

- `npm script`に起動コマンド追加
	- `"start": "node server.js",`
    - Nodeの使い方
    	- `node server.js`で`server.js`を実行
---
# `server.js`をルートに作成

```js
const express = require('express')
const bodyParser = require('body-parser')

express()
  .use(express.static('dist'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
```
続く

---
```js
  .post('/sendContactMessage', (req, res) => {
    console.log(req.body)
    res.json({
      server_receive_time: new Date().toString(),
      name: req.body.name,
      text: req.body.text,
    })
  })
  .listen(3000, () => {
    console.log('http://localhost:3000')
  })
```
- `dist`フォルダをServe（index.htmlとか）
- `http://localhost:3000`でサーバを起動
- `/sendContactMessage`にデータを`POST`すると値を返す
	- `server_receive_time`，`name`，`text`が入ったJSON

---
# サーバを起動

1. `yarn watch`とは別のターミナルで`yarn start`
	- VSCは統合ターミナルの右に➕ボタンがある
		- `yarn watch`: jsxをjsに変換し続ける
		- `yarn start`: `dist`フォルダをserveし続ける
1. http://localhost:3000 にアクセス

あとはクライアントからデータを送信するだけ

---
# Promiseとは
- 非同期処理に起こりがちなコードのCallback地獄から救い出す君
- モダンブラウザだと大体対応している（はず）
- Nodeだけど練習に[良い記事](https://qiita.com/koki_cheese/items/c559da338a3d307c9d88)

---
# 何が良いか
- 非同期処理を行う関数A, B, Cがあるとする
	- BにはAの結果が必要，CにはBの結果が必要
```js
A(function(a) {		// Aの結果が帰ってきた時のCallback
  B(a, function(b){	// Bの..Callback
    C(b, function(c){	// Cの...Callback
      done(c)		// 最終的な結果
    })
  })
})
```
どんどんネストが深くなっていく...

---
# Promise使うと
```js
A()
  .then(B)
  .then(C)
  .then(done)
```
- メソッドチェーンできる（脱Callback地獄）
- `Promise.all`
	- 複数の処理が全て終わったら呼ばれる
- `Promise.race`
	- 複数の処理のうち1つが終わったら呼ばれる

---
# fetchとは
GETとかPOSTする時にPromise型で処理できる
- 使い方
  ```js
  fetch(url, {
    method: 'POST',
    body: /* 送信データ */
  }).then(response => {
    return response.json()  // 結果をJSON形式に変換
  }).then(json => {
    /* 結果のJSONを使った処理 */
  })
  ```

詳しくは[この記事](https://qiita.com/tomoyukilabs/items/9b464c53450acc0b9574)が良さそう

---
# 通信準備
```jsx
this.state = {
  name: '',
  text: '',
  result: {}
}
```
- stateに`result`を定義
- 初期値は空のオブジェクト`{}`を設定


---
# fetchを使ってみる
```jsx
@autobind
submit() {
  const url = './sendContactMessage'
  fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      name: this.state.name,
      text: this.state.text
    })
  })
    .then(response => response.json())
    .then(json => {
      this.setState({ result: json })
    })
}
```

---
# 通信完成
1. submitボタンを押す
1. `POST`
1. サーバからレスポンス
1. JSONに変換
1. stateの`result`に保存

`Dev-Tool`のReactタブで確認！

できた～～～～！！

---
# ライブラリを使ってみる
- Reactの良いところはコンポーネントが世界中の開発者によってたくさん公開されているところ
- うまく使って工数を削減していきたい
- 下手に古いライブラリとか使うと動かないかも！
	- 最終更新がいつか
	- :star:が多いか　　　　　をチェック

`npm`のライブラリは[npmjs.com](https://www.npmjs.com/)で検索できる

---
# [react-json-view](https://www.npmjs.com/package/react-json-view)を使ってみる
`yarn add react-json-view`
```jsx
import ReactJson from 'react-json-view'
```
```jsx
<ReactJson src={this.state.result} />
```
を`button`タグの後に入れてみる
- Propsとして`src`で渡したJSONの構造が表示される

---
# おわり！
お疲れ様でした
- 短い間に詰め込んだのでかなり雑な部分があったと思いますが，「何となく」理解することは今後の学習において重要だと思います
- 各概念や細かいAPIなどの使い方については今回出てきたキーワードを元に検索してみて下さい


