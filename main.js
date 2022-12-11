/**
 * 定数
 */
// https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-available
// idは上記URLから取得可能なリストを取得できる
// 23424856はjapanのparent id
const twitterTrendEndpoint =
  'https://api.twitter.com/1.1/trends/place.json?id=23424856';

const twitterSearchEndpoint = 'https://api.twitter.com/1.1/search/tweets.json';

const props = PropertiesService.getScriptProperties().getProperties();
// -- Twitter --
const ACCESS_TOKEN = props.ACCESS_TOKEN;
// -- Discord --
const DISCORD_WEBHOOK_URL = props.DISCORD_WEBHOOK_URL;

/**
 * Discordへのトレンド情報を通知処理
 */
function sendTrendToDiscord(trendName, trendUrl) {
  const embeds = [
    {
      title: `トレンドワード： ${trendName}`,
      description: `${trendName}についてのツイートだよ。もっと見たい場合は上のリンクをクリックしてね`,
      url: trendUrl,
      color: 5620992,
      timestamp: new Date(),
      author: {
        name: 'Twitterトレンド紹介',
        url: trendUrl,
        icon_url: 'https://avatars.githubusercontent.com/u/50278?v=4',
      },
    },
  ];

  const payload = {
    username: 'TwitterTrendsBot',
    avatar_url: 'https://avatars.githubusercontent.com/u/50278?v=4', // twitterのpng
    content: '', // MEMO: 上限2000文字
    embeds: embeds,
  };

  /**
   * embedとかも使える
   * https://qiita.com/Eai/items/1165d08dce9f183eac74#embed
   */

  const options = {
    method: 'post',
    muteHttpExceptions: true,
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, options);
}

/**
 * Discordへのツイート情報を通知処理
 */
function sendTweetToDiscord(tweet) {
  const payload = {
    username: 'TwitterTrendBot',
    avatar_url: 'https://avatars.githubusercontent.com/u/50278?v=4', // twitterのpng
    content: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`, // MEMO: 上限2000文字
  };

  const options = {
    method: 'post',
    muteHttpExceptions: true,
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, options);
}

/**
 * Twitter trends fetch
 */
function fetchTwitterTrends() {
  const url = twitterTrendEndpoint;
  const options = {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      authorization: 'Bearer ' + ACCESS_TOKEN,
    },
  };
  const response = JSON.parse(UrlFetchApp.fetch(url, options));
  const trends = response[0]['trends'] ?? [];
  return trends;
}

/**
 * Twitter tweets fetch
 */
function fetchSearchTweet(query) {
  /**
   * twitterのsearch APIを使ってツイートを取得する
   * 現在設定してるパラメーター
   * q: 指定するキーワード
   * count: 取得するツイート数
   * result_type: 取得するツイートのタイプ（popular, mixed, recent）
   * locale: 言語
   * tweet_mode: 140字で省略される場合に全文表示するか（extendedで全文表示）
   * include_entities: entitiesを含めるかどうか
   * その他のクエリや詳細情報は以下リンク参照
   * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
   */
  const url = `${twitterSearchEndpoint}?q=${query}&count=1&result_type=mixed&locale=ja&tweet_mode=extended&include_entities=false`;
  const options = {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      authorization: 'Bearer ' + ACCESS_TOKEN,
    },
  };

  const response = JSON.parse(UrlFetchApp.fetch(url, options));
  const statuses = response['statuses'] ?? []; // responseのキーがstatusesなのでstatusesで取得
  return statuses;
}

/**
 * メイン
 */
function main() {
  const trends = fetchTwitterTrends();
  /**
   *   response example
   * https://developer.twitter.com/en/docs/twitter-api/v1/trends/trends-for-location/api-reference/get-trends-place
   *{
   * "trends": [
   *  {
   *   "name": "#GiftAGamer",
   *  "url": "http://twitter.com/search?q=%23GiftAGamer",
   * "promoted_content": null,
   *       "query": "%23GiftAGamer",
   *      "tweet_volume": null
   *   },
   *  ...
   *  ]
   *}
   */
  let index = 0;
  for (const trend of trends) {
    // 4件以上のトピックは表示しない
    if (index > 3) break;
    index++;
    const trendName = trend.name ?? '';
    // MEMO: responseのurlはhttpなのでhttpsになるように変更
    const trendUrl = trend.url.replace('http', 'https') ?? '';
    sendTrendToDiscord(trendName, trendUrl);
    // 遅延処理
    Utilities.sleep(500);

    const query = trend.query ?? '';
    tweets = fetchSearchTweet(query);
    for (const tweet of tweets) {
      sendTweetToDiscord(tweet);
    }
    // 遅延処理
    Utilities.sleep(3500);
  }
}
