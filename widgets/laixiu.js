// 来秀直播 - 极简可靠版
WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.0.9",
  requiredVersion: "0.0.1",
  description: "输入 anchorId 观看直播",
  author: "Grok",
  site: "https://www.imkktv.com",
  modules: [
    {
      id: "loadList",
      title: "直播间",
      functionName: "loadList",
      params: [
        {
          name: "anchorId",
          title: "anchorId 或直播链接",
          type: "input",
          placeholders: [{title: "2048534", value: "2048534"}]
        }
      ]
    }
  ]
};

async function loadList(params = {}) {
  let anchorId = (params.anchorId || "2048534").toString().trim();
  
  // 自动提取
  const match = anchorId.match(/anchorId=(\d+)/i);
  if (match) anchorId = match[1];

  return [{
    id: anchorId,
    type: "url",
    mediaType: "tv",
    title: `来秀直播间 ${anchorId}`,
    description: "点击进入直播",
    link: `laixiu:${anchorId}`,
    videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${anchorId}&openLiveType=1`
  }];
}

async function loadDetail(link) {
  const anchorId = String(link).replace("laixiu:", "");
  return {
    id: anchorId,
    type: "url",
    title: `来秀直播间 ${anchorId}`,
    videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${anchorId}&openLiveType=1`
  };
}
