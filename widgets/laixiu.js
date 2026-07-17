// widgets/laixiu-live.js
// 来秀直播监控模块 - 支持热榜、搜索、详情、直播流

WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  description: "来秀直播热榜监控、在线主播列表、搜索与直播流播放。基于便携版监控逻辑。",
  author: "Grok + User",
  site: "https://www.imkktv.com/",
  icon: "https://www.imkktv.com/favicon.ico",
  detailCacheDuration: 180,
  modules: [
    {
      id: "loadList",
      title: "热门直播",
      functionName: "loadList",
      cacheDuration: 120,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "category", title: "分类", type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "" },
            { title: "热门", value: "hot" },
            { title: "颜值", value: "yan" },
            { title: "才艺", value: "cai" },
            { title: "附近", value: "near" }
          ]
        }
      ]
    },
    {
      id: "loadDetail",
      title: "直播详情",
      functionName: "loadDetail",
      type: "stream",
      params: []
    }
  ],
  search: {
    title: "搜索主播/直播",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ==================== 配置区 ====================
const BASE_API = "https://wapapi.imkktv.com";   // 实际抓包确认的基地址（可能需调整）
const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
  "Referer": "https://www.imkktv.com/"
};

// ==================== 核心函数 ====================
async function loadList(params = {}) {
  try {
    const page = Number(params.page || 1);
    const category = params.category || "";

    const res = await Widget.http.get(`${BASE_API}/live/list`, {
      params: { page, category, limit: 30 },
      headers: DEFAULT_HEADERS
    });

    const list = res.data?.list || res.data?.data || [];
    
    return list.map(item => ({
      id: String(item.roomId || item.id),
      type: "url",
      mediaType: "live",
      title: item.title || item.roomName || "直播中",
      posterPath: item.cover || item.avatar,
      backdropPath: item.cover,
      description: `${item.anchorName || '主播'} · ${item.onlineCount || 0}观看`,
      link: `laixiu:${item.roomId || item.id}`,
      videoUrl: item.playUrl || item.hlsUrl || item.flvUrl, // 直播流
      rating: item.hotScore || item.fire || null,
      durationText: "直播中"
    }));
  } catch (error) {
    console.error("[Laixiu loadList]", error.message);
    throw error;
  }
}

async function loadDetail(link) {
  try {
    const roomId = String(link).replace("laixiu:", "");
    if (!roomId) return null;

    const res = await Widget.http.get(`${BASE_API}/live/detail/${roomId}`, {
      headers: DEFAULT_HEADERS
    });

    const d = res.data || {};
    return {
      id: link,
      type: "url",
      title: d.title || "直播间",
      posterPath: d.cover,
      backdropPaths: d.stills || [d.cover],
      description: d.desc || `${d.anchorName} 的直播间`,
      videoUrl: d.playUrl || d.hlsUrl,
      relatedItems: (d.recommend || []).map(r => ({
        id: String(r.roomId),
        type: "url",
        title: r.title,
        posterPath: r.cover,
        link: `laixiu:${r.roomId}`
      }))
    };
  } catch (error) {
    console.error("[Laixiu loadDetail]", error.message);
    return null;
  }
}

async function search(params = {}) {
  try {
    const keyword = params.keyword?.trim();
    if (!keyword) return [];

    const page = Number(params.page || 1);
    const res = await Widget.http.get(`${BASE_API}/live/search`, {
      params: { keyword, page },
      headers: DEFAULT_HEADERS
    });

    const results = res.data?.list || [];
    return results.map(item => ({
      id: String(item.roomId || item.id),
      type: "url",
      title: item.title,
      posterPath: item.cover,
      description: item.anchorName,
      link: `laixiu:${item.roomId || item.id}`
    }));
  } catch (error) {
    console.error("[Laixiu search]", error.message);
    return [];
  }
}
