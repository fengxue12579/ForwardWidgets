// 来秀直播 - 自动提取 anchorId
WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.0.7",
  requiredVersion: "0.0.1",
  description: "粘贴直播间链接或输入 anchorId",
  author: "Grok",
  site: "https://www.imkktv.com",
  modules: [
    {
      id: "loadList",
      title: "直播间",
      functionName: "loadList",
      params: [
        {
          name: "input",
          title: "直播间链接 或 anchorId",
          type: "input",
          description: "粘贴完整链接或直接输入ID",
          placeholders: [
            { title: "示例链接", value: "https://www.imkktv.com/web-live/view?anchorId=2048534" },
            { title: "示例ID", value: "2048534" }
          ]
        }
      ]
    }
  ]
};

async function loadList(params = {}) {
  let input = (params.input || "").trim();
  if (!input) {
    input = "2048534"; // 默认示例
  }

  // 自动提取 anchorId
  let anchorId = input;
  
  // 如果是完整链接，提取 anchorId
  const match = input.match(/anchorId=(\d+)/i);
  if (match) {
    anchorId = match[1];
  }

  return [{
    id: anchorId,
    type: "url",
    title: `来秀直播间 ${anchorId}`,
    description: "点击进入直播间观看",
    link: `laixiu:${anchorId}`,
    videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${anchorId}&openLiveType=1`,
    playerType: "system"
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
