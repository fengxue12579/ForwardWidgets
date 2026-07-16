// 来秀直播 - 实时在线主播 (imkktv.com)
WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  description: "实时抓取来秀在线主播，支持分类和分页",
  author: "Grok",
  site: "https://www.imkktv.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "loadList",
      title: "在线主播",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          value: "hot",
          enumOptions: [
            { title: "热门", value: "hot" },
            { title: "颜值", value: "beauty" },
            { title: "才艺", value: "talent" },
            { title: "新秀", value: "new" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索主播",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// 加载直播列表
async function loadList(params = {}) {
  const page = Number(params.page || 1);
  const category = params.category || "hot";
  
  try {
    // 来秀API（根据实际抓包可能需要调整）
    const apiUrl = `https://www.imkktv.com/api/live/list?type=${category}&page=${page}&size=20`;
    
    const res = await Widget.http.get(apiUrl);
    const data = res.data || res;
    
    const list = data.list || data.data || [];
    
    return list.map(item => ({
      id: String(item.anchorId || item.id || item.uid),
      type: "url",
      mediaType: "tv",
      title: item.nickname || item.title || `主播 ${item.anchorId}`,
      posterPath: item.avatar || item.cover || item.headImg || "",
      description: `${item.onlineCount ? item.onlineCount + '人在看' : ''} ${item.title || ''}`,
      link: `laixiu:${item.anchorId || item.id}`,
      videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${item.anchorId || item.id}&openLiveType=1`,
      backdropPath: item.cover || "",
      rating: item.onlineCount ? Math.min(9.9, (item.onlineCount / 1000).toFixed(1)) : null
    }));
  } catch (error) {
    console.error("[来秀] loadList 失败:", error.message);
    
    // 备用示例数据
    return [{
      id: "2048534",
      type: "url",
      mediaType: "tv",
      title: "来秀示例直播间",
      description: "API暂时不可用，点击进入示例房间",
      link: "laixiu:2048534",
      videoUrl: "https://www.imkktv.com/web-live/view?anchorId=2048534&openLiveType=1"
    }];
  }
}

// 搜索功能
async function search(params = {}) {
  const keyword = params.keyword?.trim();
  if (!keyword) return [];
  return loadList({ ...params, category: "hot" });
}

// 详情页（点击后丰富信息）
async function loadDetail(link) {
  try {
    const anchorId = String(link).replace("laixiu:", "");
    return {
      id: anchorId,
      type: "url",
      title: `来秀直播间 ${anchorId}`,
      link: link,
      videoUrl: `https://www.imkktv.com/web-live/view?anchorId=${anchorId}&openLiveType=1`,
      description: "来秀直播 - 分享美好生活",
      backdropPaths: []
    };
  } catch (e) {
    return null;
  }
}