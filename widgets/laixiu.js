// 来秀直播 - 最终稳定实用版
WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.0.8",
  requiredVersion: "0.0.1",
  description: "输入直播间链接或 anchorId 观看",
  author: "Grok",
  site: "https://www.imkktv.com",
  modules: [
    {
      id: "loadList",
      title: "我的直播间",
      functionName: "loadList",
      params: [
        {
          name: "input",
          title: "直播间链接 或 anchorId",
          type: "input",
          description: "粘贴完整链接，自动提取ID",
          placeholders: [
            { title: "示例", value: "https://www.imkktv.com/web-live/view?anchorId=2048534" }
          ]
        }
      ]
    }
  ]
};

async function loadList(params = {}) {
  let input = (params.input || "").trim();
  if (!input) input = "2048534";

  // 自动提取 anchorId
  let anchorId = input.match(/anchorId=(\d+)/i) ? input.match(/anchorId=(\d+)/i)[1] : input;

  return [{
    id: anchorId,
    type: "url",
    title: `来秀直播间 ${anchorId}`,
    description: "点击播放直播",
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
