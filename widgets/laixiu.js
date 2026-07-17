// widgets/laixiu-live.js   ← 完整替换

WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.2.0",
  requiredVersion: "0.0.1",
  description: "来秀直播监控（需填写 accessToken）",
  author: "Grok",
  site: "https://www.imkktv.com/",
  icon: "https://www.imkktv.com/favicon.ico",
  detailCacheDuration: 120,
  globalParams: [
    { name: "accessToken", title: "accessToken（必填，从浏览器复制）", type: "input" },
    { name: "userId", title: "userId（可选）", type: "input" }
  ],
  modules: [
    {
      id: "loadList",
      title: "热门直播",
      functionName: "loadList",
      cacheDuration: 90,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "category", title: "分类", type: "enumeration", enumOptions: [
          { title: "全部", value: "" },
          { title: "热门", value: "hot" },
          { title: "颜值", value: "yan" }
        ]}
      ]
    },
    {
      id: "loadDetail",
      title: "直播详情",
      functionName: "loadDetail",
      type: "stream"
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

const BASE = "https://wapapi.imkktv.com";

async function loadList(params = {}) {
  try {
    const token = params.accessToken;
    if (!token) throw new Error("缺少 accessToken，请在模块设置中填写");

    const res = await Widget.http.get(`${BASE}/live/list`, {
      params: { page: params.page || 1, limit: 20 },
      headers: {
        "accessToken": token,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
        "Referer": "https://www.imkktv.com/"
      }
    });

    const items = res.data?.list || res.data?.data || [];
    if (items.length === 0) console.warn("返回空列表");

    return items.map(item => ({
      id: String(item.roomId || item.id),
      type: "url",
      mediaType: "live",
      title: item.title || "直播中",
      posterPath: item.cover,
      description: `${item.anchorName || ''} · ${item.online || 0}人`,
      link: `laixiu:${item.roomId}`,
      videoUrl: item.playUrl || item.hlsUrl,
      rating: item.hot || null
    }));
  } catch (e) {
    console.error("[Laixiu loadList] 失败:", e.message);
    throw e;   // 让App显示错误
  }
}

// loadDetail 和 search 类似处理（省略，结构同上，记得加 token）
async function loadDetail(link) { /* ... 同之前，加 token */ return {}; }
async function search(params) { /* ... */ return []; }
