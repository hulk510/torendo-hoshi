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
 * Discordへの通知処理
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

function sendTweetToDiscord(tweet) {
  Logger.log(tweet);
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

function fetchSearchTweet(query) {
  const url = `${twitterSearchEndpoint}?q=${query}&count=1&result_type=mixed&locale=ja&tweet_mode=extended&include_entities=false`;
  const options = {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      authorization: 'Bearer ' + ACCESS_TOKEN,
    },
  };

  const response = JSON.parse(UrlFetchApp.fetch(url, options));
  const statuses = response['statuses'] ?? [];
  return statuses;
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
  let index = 0;
  for (const trend of trends) {
    if (index > 5) break;
    index++;
    const trendName = trend.name ?? '';
    const trendUrl = trend.url.replace('http', 'https') ?? ''; // MEMO: responseのurlはhttpなのでhttpsになるように変更
    sendTrendToDiscord(trendName, trendUrl);
    Utilities.sleep(500);

    const query = trend.query ?? '';
    tweets = fetchSearchTweet(query);
    for (const tweet of tweets) {
      sendTweetToDiscord(tweet);
    }
    Utilities.sleep(3500);
  }
}
