// 来秀直播 - 播放优化版
WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  description: "来秀直播间（WebView优化）",
  author: "Grok",
  site: "https://www.imkktv.com",
  modules: [
    {
      id: "loadList",
      title: "直播间",
      functionName: "loadList",
      requiresWebView: true,
      params: [
        {
          name: "anchorId",
          title: "anchorId 或链接",
          type: "input",
          placeholders: [{title: "1735678", value: "1735678"}]
        }
      ]
    }
  ]
};

async function loadList(params = {}) {
  let input = (params.anchorId || "1735678").toString().trim();
  const match = input.match(/anchorId=(\d+)/i);
  const anchorId = match ? match[1] : input;

  return [{
    id: anchorId,
    type: "url",
    mediaType: "tv",
    title: `来秀直播间 ${anchorId}`,
    description: "点击进入直播（WebView）",
    link: `laixiu:${anchorId}`,
    videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${anchorId}&openLiveType=1`,
    playerType: "system",
    requiresWebView: true
  }];
}

async function loadDetail(link) {
  const anchorId = String(link).replace("laixiu:", "");
  return {
    id: anchorId,
    type: "url",
    title: `来秀直播间 ${anchorId}`,
    videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${anchorId}&openLiveType=1`,
    requiresWebView: true
  };
}
