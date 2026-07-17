// widgets/laixiu-live.js （替换原有文件）

WidgetMetadata = {
  id: "forward.laixiu.live",
  title: "来秀直播",
  version: "1.1.1",
  requiredVersion: "0.0.1",
  description: "来秀直播 - 需配置 accessToken",
  author: "Grok",
  site: "https://www.imkktv.com/",
  icon: "https://www.imkktv.com/favicon.ico",
  detailCacheDuration: 180,
  globalParams: [  // ← 新增全局凭证参数
    { name: "accessToken", title: "accessToken（必填）", type: "input" },
    { name: "userId", title: "userId（建议）", type: "input" }
  ],
  modules: [ /* 同之前 */ ],
  search: { /* 同之前 */ }
};

// 使用 globalParams 中的 token
async function loadList(params = {}) {
  try {
    const page = Number(params.page || 1);
    const token = params.accessToken;   // 来自全局参数

    if (!token) throw new Error("请在模块设置中填写 accessToken");

    const res = await Widget.http.get("https://wapapi.imkktv.com/live/list", {
      params: { page, limit: 20 },
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
        "Referer": "https://www.imkktv.com/",
        "accessToken": token,          // 常见传递方式
        "Authorization": token ? `Bearer ${token}` : undefined
      }
    });

    // ... 后续处理同之前
    const list = res.data?.list || res.data?.data || [];
    return list.map(/* ... 同之前 VideoItem 映射 */);
  } catch (error) {
    console.error("[Laixiu loadList]", error.message);
    throw error;
  }
}

// loadDetail 和 search 类似加上 token
