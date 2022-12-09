/**
 * 定数
 */
// https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-available
// idは上記URLから取得可能なリストを取得できる
// 23424856はjapanのparent id
const twitterEndpoint =
  'https://api.twitter.com/1.1/trends/place.json?id=23424856';

const props = PropertiesService.getScriptProperties().getProperties();
// -- Twitter --
const ACCESS_TOKEN = props.ACCESS_TOKEN;
// -- Discord --
const DISCORD_WEBHOOK_URL = props.DISCORD_WEBHOOK_URL;

/**
 * Discordへの通知処理
 */
function sendTrendToDiscord(trendData) {
  const name = trendData['name'] ?? '';
  const url = trendData.url ?? '';
  const query = trendData.query ?? '';
  const tweet_volume_str = trendData.tweet_volume.toLocaleString() ?? 0; // ちゃんとパースできるのか？Number(numString)

  const content = '新しい投稿だよ！\r' + 'test';
  const payload = {
    username: 'TwitterTrendsBot',
    avatar_url: 'https://avatars.githubusercontent.com/u/50278?v=4', // twitterのpng
    content: content, // MEMO: 上限2000文字
  };

  /**
   * embedとかも使える
   * https://qiita.com/Eai/items/1165d08dce9f183eac74#embed
   */

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(discordWebhookUrl, options);
}

/**
 * Twitter trends fetch
 */
function fetchTwitterTrends() {
  const url = twitterEndpoint;
  Logger.log(url);
  const options = {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      authorization: 'Bearer ' + ACCESS_TOKEN,
    },
  };
  const response = JSON.parse(UrlFetchApp.fetch(url, options));
  Logger.log(response);
  const data = response['trends'] ?? [];
  Logger.log(data);
  return data;
}

/**
 * メイン
 */
function main() {
  const trends = fetchTwitterTrends();

  // response example
  // {
  //   "trends": [
  //     {
  //       "name": "#GiftAGamer",
  //       "url": "http://twitter.com/search?q=%23GiftAGamer",
  //       "promoted_content": null,
  //       "query": "%23GiftAGamer",
  //       "tweet_volume": null
  //     },
  //     ...
  //   ]
  // }
  for (const trend of trends) {
    sendTrendToDiscord(trend);
  }
}
