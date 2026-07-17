// 来秀直播 - 网页刮取版
WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.0.5",
  requiredVersion: "0.0.1",
  description: "网页刮取在线主播列表",
  author: "Grok",
  site: "https://www.imkktv.com",
  modules: [
    {
      id: "loadList",
      title: "在线主播",
      functionName: "loadList",
      cacheDuration: 120,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ]
};

async function loadList(params = {}) {
  try {
    // 抓取首页
    const html = await Widget.http.get("https://www.imkktv.com/");
    const $ = Widget.html.load(html.data || html);

    const items = [];

    // 尝试匹配直播间卡片（根据常见class或结构调整）
    $("a, div").each((i, el) => {
      const $el = $(el);
      const href = $el.attr("href") || "";
      const text = $el.text().trim();
      
      // 匹配 anchorId
      const match = href.match(/anchorId=(\d+)/);
      if (match && match[1]) {
        const anchorId = match[1];
        items.push({
          id: anchorId,
          type: "url",
          title: text || `主播 ${anchorId}`,
          description: "点击进入直播",
          link: `laixiu:${anchorId}`,
          videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${anchorId}&openLiveType=1`
        });
      }
    });

    if (items.length > 0) {
      return items.slice(0, 20); // 限制数量
    }
  } catch (e) {
    console.error("刮取失败:", e.message);
  }

  // 备用数据
  return [{
    id: "2048534",
    type: "url",
    title: "来秀示例直播间",
    description: "网页刮取失败，使用示例",
    link: "laixiu:2048534",
    videoUrl: "https://www.imkktv.com/web-live/view?anchorId=2048534&openLiveType=1"
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
