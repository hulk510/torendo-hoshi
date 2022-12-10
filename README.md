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
$ clasp create --title "your-project-name"
? Create which script? standalone // standaloneを選択
```

そうするとプロジェクト内に.clasp.jsonが作成されます。
これが作成されるとclasp pushなどが動きます。

3. open project
```
$ clasp push
$ clasp open
```
GASのページが表示されます
初回起動時は承認が求められるため承認してください。

4. setting script property

- `ACCESS_TOKEN`(Twitter API)
- `DISCORD_WEBHOOK_URL`(Discord Webhook)

上記のプロパティが必要なので適宜取得して
GASのスクリプトプロパティにセットしてください

5. run project

GAS上から実行してください。
指定したDiscord Webhook URLにpostできれば完了です。
