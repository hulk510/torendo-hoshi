# 概要
TwitterAPIを使用してトレンド情報をDiscordに送信するGASプロジェクト
# 環境構築
- Node.js
- @google/clasp

  claspを使えるようにグローバルインストールする
  ```
  $ npm i -g @google/clasp
  ```
  インストール後claspでログインしてgoogleと連携
  ```
  // 実行後googleログインページに行くのでログインして連携する
  $ clasp login
  ```

# Getting Started
1. clone repository
```
$ git clone https://github.com/howdy39/gas-clasp-starter.git <project_name>
$ cd <project_name>
```

2. create clasp project

```
$ clasp create
? Create which script? standalone // standaloneを選択
```

そうするとプロジェクト内に.clasp.jsonが作成されます。
これが作成されるとclasp pushなどが動きます。

3. run project
```
$ clasp push
$ clasp open
```
GASのページが表示されます
![authenticate](https://gyazo.com/9b8f84317cb030052594314b2f7a5936/raw)

初回実行時権限が求められるため承認すると実行できるようになります。
実行する場合は関数をmainにして実行します
ここら辺はGASのチュートリアルとかでも検索できるため分からない場合は調べてみてください。
