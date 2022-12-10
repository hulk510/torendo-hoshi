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
GASのページが表示されるため実行する

<img src="https://gyazo.com/8a15fa6a1aa58901addf96583b44f1fc" width="400" height="400" />

権限が求められる場合は承認する

