const STORAGE_KEY = "hk-masters-prep-v1";
const iconAllowlist = new Set([
  "folder-check",
  "badge-check",
  "laptop",
  "shirt",
  "house",
  "heart-pulse",
  "map-pinned",
  "book-open",
  "plane",
  "wallet-cards",
]);

const optionalSuggestions = [
  suggestion("optional-doc-contact", "documents", "纸质紧急联系人清单", "写明学校、住处、家人及保险联系方式"),
  suggestion("optional-doc-folder", "documents", "防水证件袋", "随身集中存放入境和注册文件"),
  suggestion("optional-elec-ethernet", "electronics", "短网线", "部分宿舍书桌有有线网络接口"),
  suggestion("optional-elec-stand", "electronics", "便携电脑支架", "长期阅读和写作时改善桌面姿势"),
  suggestion("optional-elec-citation", "electronics", "配置文献管理软件", "提前整理 Zotero、EndNote 或学校数据库账号"),
  suggestion("optional-cloth-swim", "clothes", "泳衣与泳帽", "计划使用学校泳池时再带"),
  suggestion("optional-cloth-shoes", "clothes", "正式鞋", "面试、演讲或正式活动备用"),
  suggestion("optional-live-dehumidifier", "living", "除湿袋", "衣柜潮湿时使用，抵港后也容易购买"),
  suggestion("optional-live-sewing", "living", "迷你针线包", "处理纽扣和简单衣物修补"),
  suggestion("optional-live-cutlery", "living", "便携餐具", "外带和校园用餐时按习惯选带"),
  suggestion("optional-health-thermometer", "health", "电子体温计", "生病时方便记录体温"),
  suggestion("optional-health-mosquito", "health", "驱蚊用品", "开学季户外活动或低楼层住处备用"),
  suggestion("optional-arrival-map", "arrival", "下载校园地图与学校 App", "提前收藏注册处、图书馆和教室位置"),
  suggestion("optional-arrival-inspection", "arrival", "拍摄入住验房照片", "记录已有损坏、家具及水电表状态"),
  suggestion("optional-arrival-groups", "arrival", "加入课程与学院通知群", "核实群组来源，避免泄露个人资料"),
  suggestion("optional-arrival-library", "arrival", "激活图书馆与数据库权限", "测试校外访问和文献下载"),
];
const optionalSuggestionIds = new Set(optionalSuggestions.map((entry) => entry.id));

const defaultState = {
  version: 1,
  settings: {
    departureDate: "",
    notes: "",
    density: "comfortable",
    layout: "double",
    filter: "all",
    search: "",
    editMode: false,
    usedSuggestions: [],
  },
  categories: [
    {
      id: "documents",
      name: "证件与入境",
      icon: "badge-check",
      color: "#c63d36",
      collapsed: false,
      items: [
        item("doc-1", "港澳通行证", "确认有效期覆盖整个行程", true),
        item("doc-2", "有效逗留签注（D签）", "入境前再次核对", true),
        item("doc-3", "学生电子签证 e-Visa", "打印 2 份，手机与网盘各留一份", true),
        item("doc-4", "学校录取与注册材料", "录取信、注册通知、缴费凭证", true),
        item("doc-5", "住宿证明与香港地址", "宿舍确认信或租赁合同", true),
        item("doc-6", "身份证及证件扫描件", "重要文件不要只保存在一个设备", true),
        item("doc-7", "学位证、毕业证、成绩单原件", "按学校注册要求携带", false),
        item("doc-8", "证件照", "白底、小一寸及护照规格各几张", false),
        item("doc-9", "入境凭证 Landing Slip", "抵港后妥善保存", true),
      ],
    },
    {
      id: "electronics",
      name: "电子与学习",
      icon: "laptop",
      color: "#24756f",
      collapsed: false,
      items: [
        item("elec-1", "笔记本电脑与充电器", "提前安装课程所需软件", true),
        item("elec-2", "手机、耳机与数据线", "重要账号开启双重验证", false),
        item("elec-3", "充电宝", "放随身行李并核对航空公司限制", false),
        item("elec-4", "英标转换插头", "带 1–2 个即可", true),
        item("elec-5", "USB-C 扩展坞与移动硬盘", "按设备接口选带", false),
        item("elec-6", "鼠标与电脑包", "优先选择轻便款", false),
        item("elec-7", "纸笔与文件夹", "少量即可，抵港后容易补充", false),
        item("elec-8", "科学计算器", "仅在课程需要时携带", false),
      ],
    },
    {
      id: "clothes",
      name: "衣物与出行",
      icon: "shirt",
      color: "#356ca5",
      collapsed: false,
      items: [
        item("cloth-1", "短袖或速干上衣 7–10 件", "八九月炎热潮湿", false),
        item("cloth-2", "薄长裤 3–4 条", "通勤和上课使用", false),
        item("cloth-3", "内衣袜子 7–10 套", "根据洗衣频率调整", false),
        item("cloth-4", "薄外套或开衫 1–2 件", "应对室内冷气", false),
        item("cloth-5", "稍正式的服装 1 套", "演讲、招聘或正式活动", false),
        item("cloth-6", "运动服 1–2 套", "按个人习惯调整", false),
        item("cloth-7", "日常运动鞋与防滑鞋", "雨天优先考虑防水防滑", false),
        item("cloth-8", "折叠伞与轻便雨衣", "放在容易取用的位置", true),
        item("cloth-9", "帽子与防晒用品", "开学季户外通勤使用", false),
      ],
    },
    {
      id: "living",
      name: "住宿与生活",
      icon: "house",
      color: "#8b5d42",
      collapsed: false,
      items: [
        item("live-1", "确认房间设施与床的尺寸", "避免重复购买和床品尺寸不合", true),
        item("live-2", "洗漱用品 3–5 天用量", "其余抵港后购买", false),
        item("live-3", "毛巾、拖鞋与水杯", "保证抵港当天可用", false),
        item("live-4", "眼罩与耳塞", "宿舍或合租环境备用", false),
        item("live-5", "小锁与行李牌", "用于行李和储物柜", false),
        item("live-6", "少量衣架、洗衣袋和收纳袋", "不要占满行李箱", false),
        item("live-7", "折叠购物袋", "日常采购使用", false),
        item("live-8", "床单与被套", "先确认床型，再决定是否携带", false),
      ],
    },
    {
      id: "health",
      name: "药品与健康",
      icon: "heart-pulse",
      color: "#9d4674",
      collapsed: false,
      items: [
        item("health-1", "长期处方药", "保留原包装并携带合理自用量", true),
        item("health-2", "处方或中英文医生证明", "标明药物通用名称与剂量", true),
        item("health-3", "少量常用药", "退烧止痛、肠胃药和创可贴", false),
        item("health-4", "眼镜与备用眼镜", "隐形眼镜用户带护理用品", false),
        item("health-5", "体检、疫苗或保险文件", "以学校具体要求为准", false),
        item("health-6", "核对受管制药物成分", "精神类、抗生素等药物不要随意拆装", true),
      ],
    },
    {
      id: "arrival",
      name: "抵港后办理",
      icon: "map-pinned",
      color: "#b57822",
      collapsed: false,
      items: [
        item("arrival-1", "办理香港本地手机卡或 eSIM", "优先保证抵港后网络可用", false),
        item("arrival-2", "购买或绑定八达通", "超过 25 岁通常使用普通八达通", false),
        item("arrival-3", "预约香港身份证", "获准逗留超过 180 天者通常需在 30 天内登记", true),
        item("arrival-4", "完成学校注册与学生证领取", "同步激活校园账号", true),
        item("arrival-5", "开立香港银行账户", "提前查看银行所需地址与身份证明", false),
        item("arrival-6", "登记本地医疗或学校保险", "保存保单和理赔联系方式", false),
        item("arrival-7", "购买香港规格插线板", "选择符合当地安全标准的产品", false),
        item("arrival-8", "补齐床品、清洁和厨房用品", "确认房间和室友已有物品后购买", false),
      ],
    },
  ],
};

let state = loadState();
let toastTimer;
let contextTarget = null;
let longPressTimer = null;
let longPressStart = null;

const elements = {
  categoryGrid: document.querySelector("#categoryGrid"),
  progressRing: document.querySelector("#progressRing"),
  progressPercent: document.querySelector("#progressPercent"),
  doneCount: document.querySelector("#doneCount"),
  todoCount: document.querySelector("#todoCount"),
  criticalCount: document.querySelector("#criticalCount"),
  departureDate: document.querySelector("#departureDate"),
  countdownText: document.querySelector("#countdownText"),
  personalNotes: document.querySelector("#personalNotes"),
  autosaveStatus: document.querySelector("#autosaveStatus"),
  resultSummary: document.querySelector("#resultSummary"),
  searchInput: document.querySelector("#searchInput"),
  filterControl: document.querySelector("#filterControl"),
  densityButton: document.querySelector("#densityButton"),
  layoutButton: document.querySelector("#layoutButton"),
  editBanner: document.querySelector("#editBanner"),
  manageDialog: document.querySelector("#manageDialog"),
  contextMenu: document.querySelector("#contextMenu"),
  moreButton: document.querySelector("#moreButton"),
  moreMenu: document.querySelector("#moreMenu"),
  emptyState: document.querySelector("#emptyState"),
  itemDialog: document.querySelector("#itemDialog"),
  itemForm: document.querySelector("#itemForm"),
  itemDialogTitle: document.querySelector("#itemDialogTitle"),
  editingItemId: document.querySelector("#editingItemId"),
  itemCategory: document.querySelector("#itemCategory"),
  itemText: document.querySelector("#itemText"),
  itemNote: document.querySelector("#itemNote"),
  itemImportant: document.querySelector("#itemImportant"),
  categoryDialog: document.querySelector("#categoryDialog"),
  categoryForm: document.querySelector("#categoryForm"),
  categoryDialogTitle: document.querySelector("#categoryDialogTitle"),
  editingCategoryId: document.querySelector("#editingCategoryId"),
  categoryName: document.querySelector("#categoryName"),
  categoryIcon: document.querySelector("#categoryIcon"),
  categoryColor: document.querySelector("#categoryColor"),
  importFileInput: document.querySelector("#importFileInput"),
  suggestionsSection: document.querySelector("#suggestionsSection"),
  suggestionList: document.querySelector("#suggestionList"),
  resetSuggestionsButton: document.querySelector("#resetSuggestionsButton"),
  toast: document.querySelector("#toast"),
};

function item(id, text, note = "", important = false) {
  return { id, text, note, important, done: false };
}

function suggestion(id, categoryId, text, note = "") {
  return { id, categoryId, text, note };
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaultState));
}

function makeId(prefix) {
  if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeState(JSON.parse(saved)) : cloneDefaults();
  } catch (error) {
    console.warn("Could not load saved checklist", error);
    return cloneDefaults();
  }
}

function normalizeState(candidate) {
  if (!candidate || !Array.isArray(candidate.categories)) throw new Error("Invalid backup");

  const defaults = cloneDefaults();
  const settings = candidate.settings ?? {};
  const categories = candidate.categories.slice(0, 60).map((category, categoryIndex) => ({
    id: safeId(category.id, `category-${categoryIndex}`),
    name: safeText(category.name, "未命名分类", 30),
    icon: iconAllowlist.has(category.icon) ? category.icon : "folder-check",
    color: /^#[0-9a-f]{6}$/i.test(category.color) ? category.color : "#c63d36",
    collapsed: Boolean(category.collapsed),
    items: Array.isArray(category.items)
      ? category.items.slice(0, 300).map((entry, itemIndex) => ({
          id: safeId(entry.id, `item-${categoryIndex}-${itemIndex}`),
          text: safeText(entry.text, "未命名事项", 100),
          note: safeText(entry.note, "", 240),
          important: Boolean(entry.important),
          done: Boolean(entry.done),
        }))
      : [],
  }));

  return {
    version: 1,
    settings: {
      departureDate: /^\d{4}-\d{2}-\d{2}$/.test(settings.departureDate)
        ? settings.departureDate
        : defaults.settings.departureDate,
      notes: safeText(settings.notes, "", 2000),
      density: settings.density === "compact" ? "compact" : "comfortable",
      layout: settings.layout === "single" ? "single" : "double",
      filter: ["all", "todo", "done", "important"].includes(settings.filter)
        ? settings.filter
        : "all",
      search: safeText(settings.search, "", 100),
      editMode: false,
      usedSuggestions: Array.isArray(settings.usedSuggestions)
        ? [...new Set(settings.usedSuggestions.filter((id) => optionalSuggestionIds.has(id)))].slice(0, 100)
        : [],
    },
    categories,
  };
}

function safeText(value, fallback, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : fallback;
}

function safeId(value, fallback) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value) ? value : fallback;
}

function saveState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  elements.autosaveStatus.innerHTML = '<i data-lucide="cloud-check" aria-hidden="true"></i> 已保存在本机';
  refreshIcons();
  if (message) showToast(message);
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
}

function render() {
  document.body.classList.toggle("density-compact", state.settings.density === "compact");
  document.body.classList.toggle("edit-mode", state.settings.editMode);
  elements.categoryGrid.classList.toggle("layout-single", state.settings.layout === "single");
  elements.densityButton.classList.toggle("is-active", state.settings.density === "compact");
  elements.layoutButton.classList.toggle("is-active", state.settings.layout === "single");
  elements.editBanner.hidden = !state.settings.editMode;
  elements.departureDate.value = state.settings.departureDate;
  elements.personalNotes.value = state.settings.notes;
  elements.searchInput.value = state.settings.search;

  for (const button of elements.filterControl.querySelectorAll("button")) {
    button.classList.toggle("is-active", button.dataset.filter === state.settings.filter);
  }

  renderStats();
  renderCountdown();
  renderCategories();
  renderSuggestions();
  refreshIcons();
}

function renderStats() {
  const allItems = state.categories.flatMap((category) => category.items);
  const done = allItems.filter((entry) => entry.done).length;
  const todo = allItems.length - done;
  const critical = allItems.filter((entry) => entry.important && !entry.done).length;
  const percent = allItems.length ? Math.round((done / allItems.length) * 100) : 0;

  elements.doneCount.textContent = done;
  elements.todoCount.textContent = todo;
  elements.criticalCount.textContent = critical;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressRing.style.background = `conic-gradient(var(--teal) ${percent * 3.6}deg, var(--surface-soft) 0deg)`;
  elements.progressRing.setAttribute("aria-label", `已完成 ${percent}%`);
}

function renderCountdown() {
  const value = state.settings.departureDate;
  if (!value) {
    elements.countdownText.textContent = "设置日期后显示倒计时";
    return;
  }

  const departure = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((departure - today) / 86400000);

  if (days > 0) elements.countdownText.textContent = `距离出发还有 ${days} 天`;
  else if (days === 0) elements.countdownText.textContent = "今天出发，祝一路顺利";
  else elements.countdownText.textContent = `出发日已过去 ${Math.abs(days)} 天`;
}

function renderCategories() {
  elements.categoryGrid.innerHTML = "";
  const query = state.settings.search.toLocaleLowerCase("zh-CN");
  let visibleItemCount = 0;
  let visibleCategoryCount = 0;

  state.categories.forEach((category, categoryIndex) => {
    const visibleItems = category.items.filter((entry) => matchesFilters(entry, query));
    const categoryNameMatches = query && category.name.toLocaleLowerCase("zh-CN").includes(query);
    const shownItems = categoryNameMatches
      ? category.items.filter((entry) => matchesStatusFilter(entry))
      : visibleItems;

    if (!shownItems.length && (query || state.settings.filter !== "all")) return;

    visibleCategoryCount += 1;
    visibleItemCount += shownItems.length;
    elements.categoryGrid.appendChild(buildCategoryPanel(category, categoryIndex, shownItems));
  });

  const totalItems = state.categories.reduce((sum, category) => sum + category.items.length, 0);
  elements.resultSummary.textContent =
    state.settings.filter === "all" && !query
      ? `共 ${state.categories.length} 个分类 · ${totalItems} 项`
      : `找到 ${visibleItemCount} 项 · ${visibleCategoryCount} 个分类`;
  elements.emptyState.hidden = visibleCategoryCount > 0;
}

function matchesFilters(entry, query) {
  const searchable = `${entry.text} ${entry.note}`.toLocaleLowerCase("zh-CN");
  return (!query || searchable.includes(query)) && matchesStatusFilter(entry);
}

function matchesStatusFilter(entry) {
  if (state.settings.filter === "todo") return !entry.done;
  if (state.settings.filter === "done") return entry.done;
  if (state.settings.filter === "important") return entry.important;
  return true;
}

function renderSuggestions() {
  const used = new Set(state.settings.usedSuggestions);
  const available = optionalSuggestions.filter((entry) => !used.has(entry.id));
  elements.suggestionList.innerHTML = "";

  available.forEach((entry) => {
    const category = findCategory(entry.categoryId);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "suggestion-item";
    row.dataset.suggestionId = entry.id;
    row.setAttribute("aria-label", `添加建议：${entry.text}`);
    row.innerHTML = `
      <i data-lucide="plus" aria-hidden="true"></i>
      <span><strong></strong><small></small></span>
      <span class="suggestion-category"></span>`;
    row.querySelector("strong").textContent = entry.text;
    row.querySelector("small").textContent = entry.note;
    row.querySelector(".suggestion-category").textContent = category?.name ?? "自选";
    elements.suggestionList.appendChild(row);
  });

  if (!available.length) {
    const message = document.createElement("p");
    message.className = "suggestion-empty";
    message.textContent = "可选建议已全部处理。";
    elements.suggestionList.appendChild(message);
  }

  elements.resetSuggestionsButton.hidden = state.settings.usedSuggestions.length === 0;
}

function buildCategoryPanel(category, categoryIndex, shownItems) {
  const panel = document.createElement("article");
  panel.className = "category-panel";
  panel.dataset.categoryId = category.id;
  panel.style.setProperty("--category-color", category.color);

  const completed = category.items.filter((entry) => entry.done).length;
  const header = document.createElement("header");
  header.className = "category-header";
  header.innerHTML = `
    <div class="category-symbol"><i data-lucide="${category.icon}" aria-hidden="true"></i></div>
    <div class="category-title-wrap">
      <h3 class="category-title"></h3>
      <p class="category-meta">${completed} / ${category.items.length} 已完成</p>
    </div>
    <div class="category-controls">
      <button class="category-icon-button edit-only" data-action="move-category-up" aria-label="上移分类" title="上移分类" ${categoryIndex === 0 ? "disabled" : ""}><i data-lucide="arrow-up" aria-hidden="true"></i></button>
      <button class="category-icon-button edit-only" data-action="move-category-down" aria-label="下移分类" title="下移分类" ${categoryIndex === state.categories.length - 1 ? "disabled" : ""}><i data-lucide="arrow-down" aria-hidden="true"></i></button>
      <button class="category-icon-button edit-only" data-action="edit-category" aria-label="编辑分类" title="编辑分类"><i data-lucide="pencil" aria-hidden="true"></i></button>
      <button class="category-icon-button edit-only" data-action="delete-category" aria-label="删除分类" title="删除分类"><i data-lucide="trash-2" aria-hidden="true"></i></button>
      <button class="category-icon-button category-menu-button" data-action="open-category-menu" aria-label="管理大类" title="管理大类"><i data-lucide="ellipsis-vertical" aria-hidden="true"></i></button>
      <button class="category-icon-button" data-action="toggle-category" aria-label="${category.collapsed ? "展开" : "折叠"}分类" title="${category.collapsed ? "展开" : "折叠"}分类"><i data-lucide="${category.collapsed ? "chevron-down" : "chevron-up"}" aria-hidden="true"></i></button>
    </div>`;
  header.querySelector(".category-title").textContent = category.name;
  panel.appendChild(header);

  if (!category.collapsed) {
    if (shownItems.length) {
      const list = document.createElement("ul");
      list.className = "category-list";
      shownItems.forEach((entry) => list.appendChild(buildChecklistItem(category, entry)));
      panel.appendChild(list);
    } else {
      const empty = document.createElement("div");
      empty.className = "empty-category";
      empty.textContent = "该分类还没有事项";
      panel.appendChild(empty);
    }

    const addRow = document.createElement("div");
    addRow.className = "category-add-row";
    addRow.innerHTML = `<button type="button" data-action="add-item"><i data-lucide="plus" aria-hidden="true"></i>添加到此分类</button>`;
    panel.appendChild(addRow);
  }

  return panel;
}

function buildChecklistItem(category, entry) {
  const row = document.createElement("li");
  row.className = `checklist-item${entry.done ? " is-done" : ""}`;
  row.dataset.itemId = entry.id;
  row.draggable = state.settings.editMode;

  const checkbox = document.createElement("input");
  checkbox.className = "item-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = entry.done;
  checkbox.setAttribute("aria-label", `标记“${entry.text}”为${entry.done ? "未完成" : "已完成"}`);
  row.appendChild(checkbox);

  const content = document.createElement("div");
  content.className = "item-content";
  const text = document.createElement("div");
  text.className = "item-text";
  text.textContent = entry.text;
  if (entry.important) {
    const important = document.createElement("span");
    important.className = "important-mark";
    important.title = "关键事项";
    important.innerHTML = '<i data-lucide="star" aria-hidden="true"></i>';
    text.appendChild(important);
  }
  content.appendChild(text);
  if (entry.note) {
    const note = document.createElement("div");
    note.className = "item-note";
    note.textContent = entry.note;
    content.appendChild(note);
  }
  row.appendChild(content);

  const menuButton = document.createElement("button");
  menuButton.className = "item-menu-button";
  menuButton.type = "button";
  menuButton.dataset.action = "open-item-menu";
  menuButton.setAttribute("aria-label", `管理“${entry.text}”`);
  menuButton.title = "管理事项";
  menuButton.innerHTML = '<i data-lucide="ellipsis-vertical" aria-hidden="true"></i>';
  row.appendChild(menuButton);

  const itemIndex = category.items.findIndex((candidate) => candidate.id === entry.id);
  const actions = document.createElement("div");
  actions.className = "item-actions";
  actions.innerHTML = `
    <button class="item-action move-up" data-action="move-item-up" aria-label="上移事项" title="上移事项" ${itemIndex === 0 ? "disabled" : ""}><i data-lucide="arrow-up" aria-hidden="true"></i></button>
    <button class="item-action move-down" data-action="move-item-down" aria-label="下移事项" title="下移事项" ${itemIndex === category.items.length - 1 ? "disabled" : ""}><i data-lucide="arrow-down" aria-hidden="true"></i></button>
    <button class="item-action" data-action="edit-item" aria-label="编辑事项" title="编辑事项"><i data-lucide="pencil" aria-hidden="true"></i></button>
    <button class="item-action" data-action="delete-item" aria-label="删除事项" title="删除事项"><i data-lucide="trash-2" aria-hidden="true"></i></button>`;
  row.appendChild(actions);
  return row;
}

function findCategory(categoryId) {
  return state.categories.find((category) => category.id === categoryId);
}

function findItem(itemId) {
  for (const category of state.categories) {
    const entry = category.items.find((candidate) => candidate.id === itemId);
    if (entry) return { category, entry };
  }
  return null;
}

function populateCategorySelect(selectedId) {
  elements.itemCategory.innerHTML = "";
  state.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    option.selected = category.id === selectedId;
    elements.itemCategory.appendChild(option);
  });
}

function openItemDialog(categoryId, entry = null) {
  if (!state.categories.length) {
    showToast("请先添加一个分类");
    openCategoryDialog();
    return;
  }

  const initialCategory = categoryId || state.categories[0].id;
  populateCategorySelect(initialCategory);
  elements.editingItemId.value = entry?.id ?? "";
  elements.itemDialogTitle.textContent = entry ? "编辑事项" : "添加事项";
  elements.itemText.value = entry?.text ?? "";
  elements.itemNote.value = entry?.note ?? "";
  elements.itemImportant.checked = entry?.important ?? false;
  elements.itemDialog.showModal();
  requestAnimationFrame(() => elements.itemText.focus());
}

function openCategoryDialog(category = null) {
  elements.editingCategoryId.value = category?.id ?? "";
  elements.categoryDialogTitle.textContent = category ? "编辑分类" : "添加分类";
  elements.categoryName.value = category?.name ?? "";
  elements.categoryIcon.value = category?.icon ?? "folder-check";
  elements.categoryColor.value = category?.color ?? "#c63d36";
  elements.categoryDialog.showModal();
  requestAnimationFrame(() => elements.categoryName.focus());
}

function moveArrayItem(array, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= array.length) return;
  const [moved] = array.splice(fromIndex, 1);
  array.splice(toIndex, 0, moved);
}

function toggleEditMode(force) {
  state.settings.editMode = typeof force === "boolean" ? force : !state.settings.editMode;
  saveState();
  render();
}

function openManageDialog() {
  closeContextMenu();
  elements.manageDialog.showModal();
}

function deleteCategory(category) {
  const description = category.items.length ? `，其中包含 ${category.items.length} 个事项` : "";
  if (!window.confirm(`删除大类“${category.name}”${description}？`)) return false;
  state.categories = state.categories.filter((entry) => entry.id !== category.id);
  saveState("大类已删除");
  render();
  return true;
}

function deleteItem(category, entry) {
  if (!entry || !window.confirm(`删除事项“${entry.text}”？`)) return false;
  category.items = category.items.filter((candidate) => candidate.id !== entry.id);
  saveState("事项已删除");
  render();
  return true;
}

function closeContextMenu() {
  elements.contextMenu.hidden = true;
  elements.contextMenu.innerHTML = "";
  contextTarget = null;
}

function contextActionsFor(target) {
  if (target.type === "item") {
    return [
      { action: "edit-item", icon: "pencil", label: "编辑事项" },
      { action: "delete-item", icon: "trash-2", label: "删除事项", danger: true },
    ];
  }
  return [
    { action: "add-item", icon: "plus", label: "在此大类新增事项" },
    { action: "edit-category", icon: "pencil", label: "编辑大类" },
    { action: "delete-category", icon: "trash-2", label: "删除大类", danger: true },
  ];
}

function openContextMenu(target, options = {}) {
  closeMoreMenu();
  closeContextMenu();
  contextTarget = target;

  contextActionsFor(target).forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.dataset.contextAction = entry.action;
    if (entry.danger) button.classList.add("context-menu__danger");
    button.innerHTML = `<i data-lucide="${entry.icon}" aria-hidden="true"></i><span>${entry.label}</span>`;
    elements.contextMenu.appendChild(button);
  });

  elements.contextMenu.hidden = false;
  refreshIcons();

  const anchorRect = options.anchor?.getBoundingClientRect();
  const preferredX = options.x ?? anchorRect?.right ?? window.innerWidth / 2;
  const preferredY = options.y ?? anchorRect?.bottom ?? window.innerHeight / 2;
  const menuRect = elements.contextMenu.getBoundingClientRect();
  const left = Math.min(Math.max(10, preferredX), window.innerWidth - menuRect.width - 10);
  const top = Math.min(Math.max(10, preferredY), window.innerHeight - menuRect.height - 10);
  elements.contextMenu.style.left = `${left}px`;
  elements.contextMenu.style.top = `${top}px`;
  elements.contextMenu.querySelector("button")?.focus({ preventScroll: true });
}

function contextTargetFromElement(element) {
  const panel = element.closest(".category-panel");
  if (!panel) return null;
  const row = element.closest(".checklist-item");
  return {
    type: row ? "item" : "category",
    categoryId: panel.dataset.categoryId,
    itemId: row?.dataset.itemId ?? null,
  };
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

function closeMoreMenu() {
  elements.moreMenu.hidden = true;
  elements.moreButton.setAttribute("aria-expanded", "false");
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = URL.createObjectURL(blob);
  link.download = `港硕行前备忘录-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  showToast("备份文件已导出");
}

async function importBackup(file) {
  try {
    const parsed = JSON.parse(await file.text());
    state = normalizeState(parsed);
    saveState();
    render();
    showToast("备份已恢复");
  } catch (error) {
    console.warn("Could not import backup", error);
    showToast("无法读取该备份文件");
  } finally {
    elements.importFileInput.value = "";
  }
}

async function copySummary() {
  const items = state.categories.flatMap((category) => category.items);
  const done = items.filter((entry) => entry.done).length;
  const outstanding = items.filter((entry) => entry.important && !entry.done).map((entry) => `- ${entry.text}`);
  const summary = [
    `港硕行前准备：已完成 ${done}/${items.length} 项（${items.length ? Math.round((done / items.length) * 100) : 0}%）`,
    outstanding.length ? `关键待办：\n${outstanding.join("\n")}` : "关键事项已全部完成。",
  ].join("\n\n");

  try {
    await navigator.clipboard.writeText(summary);
    showToast("进度摘要已复制");
  } catch {
    showToast("浏览器未允许复制，请稍后重试");
  }
}

function buildNotesText() {
  const items = state.categories.flatMap((category) => category.items);
  const done = items.filter((entry) => entry.done).length;
  const percent = items.length ? Math.round((done / items.length) * 100) : 0;
  const lines = [
    "港硕行前备忘录",
    `进度：${done}/${items.length}（${percent}%）`,
  ];

  if (state.settings.departureDate) lines.push(`出发日期：${state.settings.departureDate}`);

  state.categories.forEach((category) => {
    lines.push("", `【${category.name}】`);
    if (!category.items.length) {
      lines.push("- 暂无事项");
      return;
    }
    category.items.forEach((entry) => {
      lines.push(`- [${entry.done ? "x" : " "}] ${entry.text}${entry.important ? "（关键）" : ""}`);
      if (entry.note) lines.push(`  ${entry.note}`);
    });
  });

  if (state.settings.notes) lines.push("", "【私人备注】", state.settings.notes);
  lines.push("", `导出时间：${new Date().toLocaleString("zh-CN", { hour12: false })}`);
  return lines.join("\n");
}

function downloadNotesText(text) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  link.download = `港硕行前备忘录-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

async function shareToAppleNotes() {
  const text = buildNotesText();
  const shareData = { title: "港硕行前备忘录", text };

  if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("完整清单已复制，可粘贴到苹果备忘录");
  } catch {
    downloadNotesText(text);
    showToast("已导出文本文件，可在苹果备忘录中打开");
  }
}

elements.categoryGrid.addEventListener("change", (event) => {
  if (!event.target.matches(".item-checkbox")) return;
  const itemId = event.target.closest(".checklist-item")?.dataset.itemId;
  const found = findItem(itemId);
  if (!found) return;
  found.entry.done = event.target.checked;
  saveState(found.entry.done ? "已完成一项准备" : "已恢复为待办");
  render();
});

elements.suggestionList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-suggestion-id]");
  if (!button) return;
  const entry = optionalSuggestions.find((candidate) => candidate.id === button.dataset.suggestionId);
  if (!entry) return;
  const category = findCategory(entry.categoryId) ?? state.categories[0];
  if (!category) {
    showToast("请先添加一个分类");
    return;
  }

  category.items.push(item(makeId("item"), entry.text, entry.note));
  state.settings.usedSuggestions.push(entry.id);
  saveState(`已加入“${entry.text}”`);
  render();
});

elements.categoryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const panel = button.closest(".category-panel");
  const category = findCategory(panel?.dataset.categoryId);
  if (!category) return;
  const action = button.dataset.action;
  const row = button.closest(".checklist-item");
  const itemId = row?.dataset.itemId;
  const itemIndex = category.items.findIndex((entry) => entry.id === itemId);

  if (action === "toggle-category") category.collapsed = !category.collapsed;
  if (action === "add-item") return openItemDialog(category.id);
  if (action === "open-category-menu") {
    return openContextMenu({ type: "category", categoryId: category.id }, { anchor: button });
  }
  if (action === "open-item-menu") {
    return openContextMenu({ type: "item", categoryId: category.id, itemId }, { anchor: button });
  }
  if (action === "edit-category") return openCategoryDialog(category);
  if (action === "delete-category") return deleteCategory(category);
  if (action === "move-category-up" || action === "move-category-down") {
    const index = state.categories.findIndex((entry) => entry.id === category.id);
    moveArrayItem(state.categories, index, index + (action.endsWith("up") ? -1 : 1));
  }
  if (action === "edit-item") {
    const entry = category.items[itemIndex];
    return openItemDialog(category.id, entry);
  }
  if (action === "delete-item") {
    const entry = category.items[itemIndex];
    return deleteItem(category, entry);
  }
  if (action === "move-item-up" || action === "move-item-down") {
    moveArrayItem(category.items, itemIndex, itemIndex + (action.endsWith("up") ? -1 : 1));
  }

  saveState();
  render();
});

elements.categoryGrid.addEventListener("contextmenu", (event) => {
  const target = contextTargetFromElement(event.target);
  if (!target) return;
  event.preventDefault();
  openContextMenu(target, { x: event.clientX, y: event.clientY });
});

elements.categoryGrid.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" || event.target.closest("button, input, a")) return;
  const target = contextTargetFromElement(event.target);
  if (!target) return;
  longPressStart = { x: event.clientX, y: event.clientY, target };
  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(() => {
    if (!longPressStart) return;
    openContextMenu(longPressStart.target, { x: longPressStart.x, y: longPressStart.y });
    longPressStart = null;
  }, 550);
});

elements.categoryGrid.addEventListener("pointermove", (event) => {
  if (!longPressStart) return;
  if (Math.hypot(event.clientX - longPressStart.x, event.clientY - longPressStart.y) > 10) {
    clearTimeout(longPressTimer);
    longPressStart = null;
  }
});

for (const eventName of ["pointerup", "pointercancel", "pointerleave"]) {
  elements.categoryGrid.addEventListener(eventName, () => {
    clearTimeout(longPressTimer);
    longPressStart = null;
  });
}

elements.contextMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-context-action]");
  if (!button || !contextTarget) return;
  const target = { ...contextTarget };
  const category = findCategory(target.categoryId);
  const entry = target.itemId ? findItem(target.itemId)?.entry : null;
  closeContextMenu();
  if (!category) return;

  if (button.dataset.contextAction === "add-item") openItemDialog(category.id);
  if (button.dataset.contextAction === "edit-category") openCategoryDialog(category);
  if (button.dataset.contextAction === "delete-category") deleteCategory(category);
  if (button.dataset.contextAction === "edit-item" && entry) openItemDialog(category.id, entry);
  if (button.dataset.contextAction === "delete-item" && entry) deleteItem(category, entry);
});

elements.categoryGrid.addEventListener("dragstart", (event) => {
  const row = event.target.closest(".checklist-item");
  if (!row || !state.settings.editMode) return;
  row.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", row.dataset.itemId);
});

elements.categoryGrid.addEventListener("dragend", (event) => {
  event.target.closest(".checklist-item")?.classList.remove("is-dragging");
});

elements.categoryGrid.addEventListener("dragover", (event) => {
  if (!state.settings.editMode || !event.target.closest(".category-panel")) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
});

elements.categoryGrid.addEventListener("drop", (event) => {
  if (!state.settings.editMode) return;
  event.preventDefault();
  const itemId = event.dataTransfer.getData("text/plain");
  const targetPanel = event.target.closest(".category-panel");
  if (!itemId || !targetPanel) return;
  const source = findItem(itemId);
  const targetCategory = findCategory(targetPanel.dataset.categoryId);
  if (!source || !targetCategory) return;

  const sourceIndex = source.category.items.findIndex((entry) => entry.id === itemId);
  const [moved] = source.category.items.splice(sourceIndex, 1);
  const targetRow = event.target.closest(".checklist-item");
  const targetIndex = targetRow
    ? Math.max(0, targetCategory.items.findIndex((entry) => entry.id === targetRow.dataset.itemId))
    : targetCategory.items.length;
  targetCategory.items.splice(targetIndex, 0, moved);
  saveState("事项位置已调整");
  render();
});

elements.itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const targetCategory = findCategory(elements.itemCategory.value);
  const text = elements.itemText.value.trim();
  if (!targetCategory || !text) return;

  const editingId = elements.editingItemId.value;
  if (editingId) {
    const found = findItem(editingId);
    if (!found) return;
    found.entry.text = text;
    found.entry.note = elements.itemNote.value.trim();
    found.entry.important = elements.itemImportant.checked;
    if (found.category.id !== targetCategory.id) {
      found.category.items = found.category.items.filter((entry) => entry.id !== editingId);
      targetCategory.items.push(found.entry);
    }
    showToast("事项已更新");
  } else {
    targetCategory.items.push({
      id: makeId("item"),
      text,
      note: elements.itemNote.value.trim(),
      important: elements.itemImportant.checked,
      done: false,
    });
    showToast("事项已添加");
  }

  elements.itemDialog.close();
  saveState();
  render();
});

elements.categoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = elements.categoryName.value.trim();
  if (!name) return;
  const editingId = elements.editingCategoryId.value;

  if (editingId) {
    const category = findCategory(editingId);
    if (!category) return;
    category.name = name;
    category.icon = elements.categoryIcon.value;
    category.color = elements.categoryColor.value;
    showToast("分类已更新");
  } else {
    state.categories.push({
      id: makeId("category"),
      name,
      icon: elements.categoryIcon.value,
      color: elements.categoryColor.value,
      collapsed: false,
      items: [],
    });
    showToast("分类已添加");
  }

  elements.categoryDialog.close();
  saveState();
  render();
});

elements.departureDate.addEventListener("change", () => {
  state.settings.departureDate = elements.departureDate.value;
  saveState("出发日期已保存");
  renderCountdown();
});

elements.personalNotes.addEventListener("input", () => {
  state.settings.notes = elements.personalNotes.value;
  elements.autosaveStatus.textContent = "正在保存…";
  clearTimeout(elements.personalNotes.saveTimer);
  elements.personalNotes.saveTimer = setTimeout(() => saveState(), 350);
});

elements.searchInput.addEventListener("input", () => {
  state.settings.search = elements.searchInput.value;
  saveState();
  renderCategories();
  refreshIcons();
});

elements.filterControl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  state.settings.filter = button.dataset.filter;
  saveState();
  render();
});

document.querySelector("#manageChecklistButton").addEventListener("click", openManageDialog);
document.querySelector("#heroManageChecklist").addEventListener("click", openManageDialog);
document.querySelector("#exitEditMode").addEventListener("click", () => toggleEditMode(false));
document.querySelector("#clearFiltersButton").addEventListener("click", () => {
  state.settings.filter = "all";
  state.settings.search = "";
  saveState();
  render();
});

elements.densityButton.addEventListener("click", () => {
  state.settings.density = state.settings.density === "compact" ? "comfortable" : "compact";
  saveState(state.settings.density === "compact" ? "已切换为紧凑视图" : "已切换为舒适视图");
  render();
});

elements.layoutButton.addEventListener("click", () => {
  state.settings.layout = state.settings.layout === "single" ? "double" : "single";
  saveState(state.settings.layout === "single" ? "已切换为单列" : "已切换为双列");
  render();
});

elements.manageDialog.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-manage-action]");
  if (!button) return;
  elements.manageDialog.close();
  if (button.dataset.manageAction === "add-item") openItemDialog();
  if (button.dataset.manageAction === "add-category") openCategoryDialog();
  if (button.dataset.manageAction === "organize") {
    toggleEditMode(true);
    showToast("整理模式已开启");
  }
});

elements.moreButton.addEventListener("click", (event) => {
  event.stopPropagation();
  const willOpen = elements.moreMenu.hidden;
  elements.moreMenu.hidden = !willOpen;
  elements.moreButton.setAttribute("aria-expanded", String(willOpen));
});

document.addEventListener("click", (event) => {
  if (!elements.moreMenu.contains(event.target) && event.target !== elements.moreButton) closeMoreMenu();
  if (!elements.contextMenu.hidden && !elements.contextMenu.contains(event.target)) closeContextMenu();
});

document.querySelector("#copySummaryButton").addEventListener("click", () => {
  closeMoreMenu();
  copySummary();
});
document.querySelector("#shareNotesButton").addEventListener("click", () => {
  closeMoreMenu();
  shareToAppleNotes();
});
document.querySelector("#exportButton").addEventListener("click", () => {
  closeMoreMenu();
  exportBackup();
});
document.querySelector("#importButton").addEventListener("click", () => {
  closeMoreMenu();
  elements.importFileInput.click();
});
document.querySelector("#printButton").addEventListener("click", () => {
  closeMoreMenu();
  window.print();
});
document.querySelector("#resetButton").addEventListener("click", () => {
  closeMoreMenu();
  if (!window.confirm("恢复默认清单？当前修改和勾选进度会被清除。")) return;
  state = cloneDefaults();
  saveState();
  render();
  showToast("已恢复默认清单");
});

elements.importFileInput.addEventListener("change", () => {
  const [file] = elements.importFileInput.files;
  if (file) importBackup(file);
});

elements.resetSuggestionsButton.addEventListener("click", () => {
  state.settings.usedSuggestions = [];
  saveState("可选建议已重新显示");
  renderSuggestions();
  refreshIcons();
});

for (const button of document.querySelectorAll("[data-close-dialog]")) {
  button.addEventListener("click", () => document.querySelector(`#${button.dataset.closeDialog}`).close());
}

for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });
}

document.addEventListener("keydown", (event) => {
  const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    elements.searchInput.focus();
  }
  if (event.key.toLowerCase() === "n" && !isTyping && !document.querySelector("dialog[open]")) {
    event.preventDefault();
    openItemDialog();
  }
  if (event.key === "Escape") closeContextMenu();
});

render();
