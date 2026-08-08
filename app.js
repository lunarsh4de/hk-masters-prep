const STORAGE_KEY = "hk-masters-prep-v1";
const STORAGE_BACKUP_KEY = "hk-masters-prep-v1-backup";
const STORAGE_BACKUP_META_KEY = "hk-masters-prep-v1-backup-meta";
const CURRENT_STATE_VERSION = 2;
const MAX_CATEGORIES = 60;
const MAX_ITEMS_PER_CATEGORY = 300;
const MAX_TOTAL_ITEMS = 2000;
const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
const MAX_UNDO_ACTIONS = 10;
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
  suggestion("optional-doc-nol", "documents", "无异议通知书 NOL（如获发）", "计划实习或工作时，逐条核对信中许可条件"),
  suggestion("optional-elec-ethernet", "electronics", "短网线", "部分宿舍书桌有有线网络接口"),
  suggestion("optional-elec-stand", "electronics", "便携电脑支架", "长期阅读和写作时改善桌面姿势"),
  suggestion("optional-elec-citation", "electronics", "配置文献管理软件", "提前整理 Zotero、EndNote 或学校数据库账号"),
  suggestion("optional-cloth-swim", "clothes", "泳衣与泳帽", "计划使用学校泳池时再带"),
  suggestion("optional-cloth-shoes", "clothes", "正式鞋", "面试、演讲或正式活动备用"),
  suggestion("optional-live-dehumidifier", "living", "除湿袋", "衣柜潮湿时使用，抵港后也容易购买"),
  suggestion("optional-live-storage", "living", "衣架、洗衣袋与收纳用品", "确认住处已有物品后少量购买或携带"),
  suggestion("optional-live-sewing", "living", "迷你针线包", "处理纽扣和简单衣物修补"),
  suggestion("optional-live-cutlery", "living", "便携餐具", "外带和校园用餐时按习惯选带"),
  suggestion("optional-health-thermometer", "health", "电子体温计", "生病时方便记录体温"),
  suggestion("optional-health-mosquito", "health", "驱蚊用品", "开学季户外活动或低楼层住处备用"),
  suggestion("optional-health-summary", "health", "用药清单与病历摘要（按需）", "记录药物通用名、剂量、过敏史和既往病史，便于在港复诊"),
  suggestion("optional-arrival-map", "arrival", "下载校园地图与学校 App", "提前收藏注册处、图书馆和教室位置"),
  suggestion("optional-arrival-groups", "arrival", "加入课程与学院通知群", "核实群组来源，避免泄露个人资料"),
  suggestion("optional-arrival-library", "arrival", "激活图书馆与数据库权限", "测试校外访问和文献下载"),
  suggestion("optional-arrival-payment", "arrival", "准备抵港首日支付方式", "带少量港币及可在港使用的银行卡或电子支付，不依赖当天开户"),
  suggestion("optional-arrival-cash", "arrival", "大额现金入境申报（如适用）", "现金及不记名票据总值超过 HK$120,000 时须向海关申报"),
  suggestion("optional-living-rental", "living", "核验租约与付款凭证（校外租房）", "核对业主或持牌代理资料、租期、押金、费用与盖印安排"),
];
const optionalSuggestionIds = new Set(optionalSuggestions.map((entry) => entry.id));
const contentRevisionsV2 = [
  revision("doc-1", "港澳通行证", "确认有效期覆盖整个行程", "往来港澳通行证（内地学生）", "核对有效期、姓名和证件号码，并确认与签注及 e-Visa 信息一致"),
  revision("doc-2", "有效逗留签注（D签）", "入境前再次核对", "赴港逗留签注（D）", "内地学生按出入境要求办理；首次入境时与 e-Visa 一并使用"),
  revision("doc-3", "学生电子签证 e-Visa", "打印 2 份，手机与网盘各留一份", "学生电子签证 e-Visa", "手机离线保存；可另备一张 A4 纸质件"),
  revision("doc-4", "学校录取与注册材料", "录取信、注册通知、缴费凭证", "完成学校行前门户与注册材料", "核对录取、缴费、签证上传、学生证照片、迎新及选课截止时间"),
  revision("doc-5", "住宿证明与香港地址", "宿舍确认信或租赁合同", "香港住址、入住联系人与抵达路线", "保存中英文地址、入住时段、钥匙交接和紧急联系方式"),
  revision("doc-6", "身份证及证件扫描件", "重要文件不要只保存在一个设备", "内地身份证及重要证件备份", "手机离线、加密云端或纸质件至少保留两种方式"),
  revision("doc-7", "学位证、毕业证、成绩单原件", "按学校注册要求携带", "学校要求的学历证明及核验材料", "只携带注册通知明确要求的原件、认证件或电子文件"),
  revision("doc-8", "证件照", "白底、小一寸及护照规格各几张", "证件照（按需）", "先核对学校或办理事项指定的尺寸与电子文件要求"),
  revision("doc-9", "入境凭证 Landing Slip", "抵港后妥善保存", "核对并保存入境凭证（Landing Slip）", "确认入境身份为 Student、核对逗留期限，并立即拍照备份", { moveTo: "arrival" }),
  revision("elec-2", "手机、耳机与数据线", "重要账号开启双重验证", "手机、耳机与数据线", "保留内地号码收验证码，准备双重验证恢复方式", { importantFrom: false, importantTo: true }),
  revision("elec-3", "充电宝", "放随身行李并核对航空公司限制", "充电宝", "不得托运；香港机场出发最多 2 个且不得在机上充电，另查承运人规则"),
  revision("elec-4", "英标转换插头", "带 1–2 个即可", "英标转换插头（BS 1363）", "先带 1–2 个，并确认设备支持 220V"),
  revision("cloth-1", "短袖或速干上衣 7–10 件", "八九月炎热潮湿", "炎热天气日常衣物", "按 5–7 天洗衣周期准备，结合行李额度调整"),
  revision("cloth-2", "薄长裤 3–4 条", "通勤和上课使用", "轻薄长裤或裙装", "按课程、通勤与个人习惯准备"),
  revision("cloth-3", "内衣袜子 7–10 套", "根据洗衣频率调整", "内衣与袜子", "按洗衣频率准备，无需照搬固定数量"),
  revision("cloth-4", "薄外套或开衫 1–2 件", "应对室内冷气", "薄外套或开衫", "应对室内冷气"),
  revision("cloth-5", "稍正式的服装 1 套", "演讲、招聘或正式活动", "稍正式的服装", "演讲、招聘或正式活动备用"),
  revision("cloth-6", "运动服 1–2 套", "按个人习惯调整", "运动服", "按运动习惯和课程需要准备"),
  revision("cloth-7", "日常运动鞋与防滑鞋", "雨天优先考虑防水防滑", "舒适通勤鞋", "香港步行和坡路较多，雨天注意鞋底防滑"),
  revision("cloth-8", "折叠伞与轻便雨衣", "放在容易取用的位置", "折叠伞或轻便雨衣", "开学季天气多变，放在容易取用的位置", { importantFrom: true, importantTo: false }),
  revision("live-1", "确认房间设施与床的尺寸", "避免重复购买和床品尺寸不合", "确认床型、房间配套和首晚床品", "先问宿舍或房东是否提供及具体尺寸，再决定携带或抵港购买"),
  revision("live-6", "少量衣架、洗衣袋和收纳袋", "不要占满行李箱", "", "", { remove: true }),
  revision("live-8", "床单与被套", "先确认床型，再决定是否携带", "", "", { remove: true }),
  revision("health-1", "长期处方药", "保留原包装并携带合理自用量", "个人长期用药（如有）", "保留原包装，按合理自用量携带；处方药随身备处方或用药清单"),
  revision("health-2", "处方或中英文医生证明", "标明药物通用名称与剂量", "核对药物有效成分与香港管制类别", "如含香港危险药物，须至少提前 10 个工作日申请卫生署书面批准，并按要求携带医生证明"),
  revision("health-3", "少量常用药", "退烧止痛、肠胃药和创可贴", "个人常用非处方药与急救用品", "只带熟悉药物，保留包装并核对成分、禁忌与有效期"),
  revision("health-5", "体检、疫苗或保险文件", "以学校具体要求为准", "学校要求的健康或疫苗文件（如有）", "只有学校、宿舍或课程明确要求时准备"),
  revision("health-6", "核对受管制药物成分", "精神类、抗生素等药物不要随意拆装", "核对香港禁止及受管制物品", "不要携带 CBD、大麻制品、电子烟、加热烟及相关烟弹"),
  revision("arrival-1", "办理香港本地手机卡或 eSIM", "优先保证抵港后网络可用", "办理香港本地手机卡或 eSIM", "预付卡须实名登记；准备有效身份证明，并先确保抵港后可联网"),
  revision("arrival-2", "购买或绑定八达通", "超过 25 岁通常使用普通八达通", "准备八达通", "学生优惠须同时符合当学年的年龄、课程和就读模式资格"),
  revision("arrival-3", "预约香港身份证", "获准逗留超过 180 天者通常需在 30 天内登记", "预约并登记香港身份证", "年满 11 岁且获准逗留超过 180 天者，须在抵港后 30 天内登记"),
  revision("arrival-4", "完成学校注册与学生证领取", "同步激活校园账号", "完成学校注册与学生证领取", "同步激活校园账号、多重验证和课程平台"),
  revision("arrival-5", "开立香港银行账户", "提前查看银行所需地址与身份证明", "按需开立香港银行账户", "各银行尽调要求不同，按目标银行核对身份证明、住址信息与开户目的"),
  revision("arrival-6", "登记本地医疗或学校保险", "保存保单和理赔联系方式", "确认学校医疗及意外保险安排", "核对生效日、门诊和住院范围及理赔流程，保障不足时再自行补充"),
  revision("arrival-7", "购买香港规格插线板", "选择符合当地安全标准的产品", "购买香港规格插线板", "选择符合当地安全标准的产品，避免万能孔及转换头串接"),
];

const defaultState = {
  version: CURRENT_STATE_VERSION,
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
        item("doc-1", "往来港澳通行证（内地学生）", "核对有效期、姓名和证件号码，并确认与签注及 e-Visa 信息一致", true),
        item("doc-2", "赴港逗留签注（D）", "内地学生按出入境要求办理；首次入境时与 e-Visa 一并使用", true),
        item("doc-3", "学生电子签证 e-Visa", "手机离线保存；可另备一张 A4 纸质件", true),
        item("doc-4", "完成学校行前门户与注册材料", "核对录取、缴费、签证上传、学生证照片、迎新及选课截止时间", true),
        item("doc-5", "香港住址、入住联系人与抵达路线", "保存中英文地址、入住时段、钥匙交接和紧急联系方式", true),
        item("doc-6", "内地身份证及重要证件备份", "手机离线、加密云端或纸质件至少保留两种方式", true),
        item("doc-7", "学校要求的学历证明及核验材料", "只携带注册通知明确要求的原件、认证件或电子文件", false),
        item("doc-8", "证件照（按需）", "先核对学校或办理事项指定的尺寸与电子文件要求", false),
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
        item("elec-2", "手机、耳机与数据线", "保留内地号码收验证码，准备双重验证恢复方式", true),
        item("elec-3", "充电宝", "不得托运；香港机场出发最多 2 个且不得在机上充电，另查承运人规则", false),
        item("elec-4", "英标转换插头（BS 1363）", "先带 1–2 个，并确认设备支持 220V", true),
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
        item("cloth-1", "炎热天气日常衣物", "按 5–7 天洗衣周期准备，结合行李额度调整", false),
        item("cloth-2", "轻薄长裤或裙装", "按课程、通勤与个人习惯准备", false),
        item("cloth-3", "内衣与袜子", "按洗衣频率准备，无需照搬固定数量", false),
        item("cloth-4", "薄外套或开衫", "应对室内冷气", false),
        item("cloth-5", "稍正式的服装", "演讲、招聘或正式活动备用", false),
        item("cloth-6", "运动服", "按运动习惯和课程需要准备", false),
        item("cloth-7", "舒适通勤鞋", "香港步行和坡路较多，雨天注意鞋底防滑", false),
        item("cloth-8", "折叠伞或轻便雨衣", "开学季天气多变，放在容易取用的位置", false),
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
        item("live-1", "确认床型、房间配套和首晚床品", "先问宿舍或房东是否提供及具体尺寸，再决定携带或抵港购买", true),
        item("live-2", "洗漱用品 3–5 天用量", "其余抵港后购买", false),
        item("live-3", "毛巾、拖鞋与水杯", "保证抵港当天可用", false),
        item("live-4", "眼罩与耳塞", "宿舍或合租环境备用", false),
        item("live-5", "小锁与行李牌", "用于行李和储物柜", false),
        item("live-7", "折叠购物袋", "日常采购使用", false),
        item("live-9", "准备抵港首日支付方式", "带少量港币及可在港使用的银行卡或电子支付，不依赖当天开户", true),
      ],
    },
    {
      id: "health",
      name: "药品与健康",
      icon: "heart-pulse",
      color: "#9d4674",
      collapsed: false,
      items: [
        item("health-1", "个人长期用药（如有）", "保留原包装，按合理自用量携带；处方药随身备处方或用药清单", true),
        item("health-2", "核对药物有效成分与香港管制类别", "如含香港危险药物，须至少提前 10 个工作日申请卫生署书面批准，并按要求携带医生证明", true),
        item("health-3", "个人常用非处方药与急救用品", "只带熟悉药物，保留包装并核对成分、禁忌与有效期", false),
        item("health-4", "眼镜与备用眼镜", "隐形眼镜用户带护理用品", false),
        item("health-5", "学校要求的健康或疫苗文件（如有）", "只有学校、宿舍或课程明确要求时准备", false),
        item("health-6", "核对香港禁止及受管制物品", "不要携带 CBD、大麻制品、电子烟、加热烟及相关烟弹", true),
      ],
    },
    {
      id: "arrival",
      name: "抵港后办理",
      icon: "map-pinned",
      color: "#b57822",
      collapsed: false,
      items: [
        item("arrival-1", "办理香港本地手机卡或 eSIM", "预付卡须实名登记；准备有效身份证明，并先确保抵港后可联网", false),
        item("arrival-2", "准备八达通", "学生优惠须同时符合当学年的年龄、课程和就读模式资格", false),
        item("arrival-3", "预约并登记香港身份证", "年满 11 岁且获准逗留超过 180 天者，须在抵港后 30 天内登记", true),
        item("arrival-4", "完成学校注册与学生证领取", "同步激活校园账号、多重验证和课程平台", true),
        item("arrival-5", "按需开立香港银行账户", "各银行尽调要求不同，按目标银行核对身份证明、住址信息与开户目的", false),
        item("arrival-6", "确认学校医疗及意外保险安排", "核对生效日、门诊和住院范围及理赔流程，保障不足时再自行补充", false),
        item("arrival-7", "购买香港规格插线板", "选择符合当地安全标准的产品，避免万能孔及转换头串接", false),
        item("arrival-8", "补齐床品、清洁和厨房用品", "确认房间和室友已有物品后购买", false),
        item("doc-9", "核对并保存入境凭证（Landing Slip）", "确认入境身份为 Student、核对逗留期限，并立即拍照备份", true),
        item("arrival-9", "完成入住验房与交接", "记录已有损坏、家具及水电表状态，保存钥匙和付款交接凭证", false),
      ],
    },
  ],
};

let loadNotice = "";
let primaryStateWasInvalid = false;
let state = loadState();
let toastTimer;
let toastActionCallback = null;
let undoStack = [];
let contextTarget = null;
let contextReturnFocus = null;
let longPressTimer = null;
let longPressStart = null;
let longPressActivatedTarget = null;
let suppressedClickTarget = null;
let suppressClickUntil = 0;
let suppressClickTimer = null;

function armLongPressClickSuppression() {
  if (!longPressActivatedTarget) return;
  suppressedClickTarget = longPressActivatedTarget;
  suppressClickUntil = performance.now() + 500;
  clearTimeout(suppressClickTimer);
  suppressClickTimer = setTimeout(() => {
    suppressedClickTarget = null;
    suppressClickUntil = 0;
  }, 520);
  longPressActivatedTarget = null;
}

const elements = {
  categoryGrid: document.querySelector("#categoryGrid"),
  progressRing: document.querySelector("#progressRing"),
  progressPercent: document.querySelector("#progressPercent"),
  doneCount: document.querySelector("#doneCount"),
  todoCount: document.querySelector("#todoCount"),
  criticalCount: document.querySelector("#criticalCount"),
  departureDate: document.querySelector("#departureDate"),
  countdownText: document.querySelector("#countdownText"),
  sidebar: document.querySelector(".sidebar"),
  mobileOverviewToggle: document.querySelector("#mobileOverviewToggle"),
  personalNotes: document.querySelector("#personalNotes"),
  autosaveStatus: document.querySelector("#autosaveStatus"),
  autosaveText: document.querySelector("#autosaveText"),
  resultSummary: document.querySelector("#resultSummary"),
  focusPanel: document.querySelector("#focusPanel"),
  focusPhase: document.querySelector("#focusPhase"),
  focusTitle: document.querySelector("#focusTitle"),
  focusDescription: document.querySelector("#focusDescription"),
  focusItems: document.querySelector("#focusItems"),
  focusActionButton: document.querySelector("#focusActionButton"),
  searchInput: document.querySelector("#searchInput"),
  filterControl: document.querySelector("#filterControl"),
  densityButton: document.querySelector("#densityButton"),
  layoutButton: document.querySelector("#layoutButton"),
  editBanner: document.querySelector("#editBanner"),
  manageDialog: document.querySelector("#manageDialog"),
  contextMenu: document.querySelector("#contextMenu"),
  moreButton: document.querySelector("#moreButton"),
  moreMenu: document.querySelector("#moreMenu"),
  undoButton: document.querySelector("#undoButton"),
  restoreBackupButton: document.querySelector("#restoreBackupButton"),
  emptyState: document.querySelector("#emptyState"),
  emptyStateTitle: document.querySelector("#emptyStateTitle"),
  emptyStateText: document.querySelector("#emptyStateText"),
  clearFiltersButton: document.querySelector("#clearFiltersButton"),
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
  toastMessage: document.querySelector("#toastMessage"),
  toastAction: document.querySelector("#toastAction"),
};

function item(id, text, note = "", important = false, sourceSuggestionId = "") {
  return { id, text, note, important, done: false, sourceSuggestionId };
}

function suggestion(id, categoryId, text, note = "") {
  return { id, categoryId, text, note };
}

function revision(id, fromText, fromNote, text, note, options = {}) {
  return { id, fromText, fromNote, text, note, ...options };
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaultState));
}

function migrateState(candidate) {
  if (!candidate || !Array.isArray(candidate.categories)) return candidate;
  const version = Number.isInteger(candidate.version) ? candidate.version : 1;
  if (version >= CURRENT_STATE_VERSION) return candidate;

  const migrated = JSON.parse(JSON.stringify(candidate));
  const categoryById = new Map(migrated.categories.map((category) => [category.id, category]));

  contentRevisionsV2.forEach((change) => {
    let sourceCategory = null;
    let entry = null;
    for (const category of migrated.categories) {
      const found = Array.isArray(category.items)
        ? category.items.find((candidateEntry) => candidateEntry?.id === change.id)
        : null;
      if (found) {
        sourceCategory = category;
        entry = found;
        break;
      }
    }
    if (!entry || entry.text !== change.fromText || entry.note !== change.fromNote) return;

    if (change.remove) {
      sourceCategory.items = sourceCategory.items.filter((candidateEntry) => candidateEntry !== entry);
      return;
    }

    entry.text = change.text;
    entry.note = change.note;
    if (entry.important === change.importantFrom) entry.important = change.importantTo;

    if (change.moveTo && sourceCategory?.id !== change.moveTo) {
      const destination = categoryById.get(change.moveTo);
      if (destination && !destination.items?.some((candidateEntry) => candidateEntry?.id === change.id)) {
        sourceCategory.items = sourceCategory.items.filter((candidateEntry) => candidateEntry !== entry);
        if (!Array.isArray(destination.items)) destination.items = [];
        destination.items.push(entry);
      }
    }
  });

  const arrival = categoryById.get("arrival");
  migrated.categories.forEach((category) => {
    if (!Array.isArray(category.items)) return;
    category.items.forEach((entry) => {
      const isOldInspectionSuggestion =
        entry?.sourceSuggestionId === "optional-arrival-inspection" ||
        (entry?.text === "拍摄入住验房照片" && entry?.note === "记录已有损坏、家具及水电表状态");
      if (!isOldInspectionSuggestion) return;
      entry.text = "完成入住验房与交接";
      entry.note = "记录已有损坏、家具及水电表状态，保存钥匙和付款交接凭证";
    });
  });
  const hasInspectionItem = migrated.categories.some((category) =>
    Array.isArray(category.items) &&
    category.items.some(
      (entry) =>
        entry?.id === "arrival-9" ||
        entry?.sourceSuggestionId === "optional-arrival-inspection" ||
        entry?.text === "拍摄入住验房照片",
    ),
  );
  const totalItemCount = () =>
    migrated.categories.reduce(
      (sum, category) => sum + (Array.isArray(category.items) ? category.items.length : 0),
      0,
    );
  if (
    arrival &&
    !hasInspectionItem &&
    (arrival.items?.length ?? 0) < MAX_ITEMS_PER_CATEGORY &&
    totalItemCount() < MAX_TOTAL_ITEMS
  ) {
    if (!Array.isArray(arrival.items)) arrival.items = [];
    arrival.items.push(
      item(
        "arrival-9",
        "完成入住验房与交接",
        "记录已有损坏、家具及水电表状态，保存钥匙和付款交接凭证",
        false,
      ),
    );
  }

  const living = categoryById.get("living");
  const hasFirstDayPayment = migrated.categories.some((category) =>
    Array.isArray(category.items) &&
    category.items.some(
      (entry) =>
        entry?.id === "live-9" ||
        entry?.sourceSuggestionId === "optional-arrival-payment" ||
        entry?.text === "准备抵港首日支付方式",
    ),
  );
  if (
    living &&
    !hasFirstDayPayment &&
    (living.items?.length ?? 0) < MAX_ITEMS_PER_CATEGORY &&
    totalItemCount() < MAX_TOTAL_ITEMS
  ) {
    if (!Array.isArray(living.items)) living.items = [];
    living.items.push(
      item(
        "live-9",
        "准备抵港首日支付方式",
        "带少量港币及可在港使用的银行卡或电子支付，不依赖当天开户",
        true,
      ),
    );
  }

  migrated.version = CURRENT_STATE_VERSION;
  return migrated;
}

function makeId(prefix) {
  if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneDefaults();

    try {
      const parsed = JSON.parse(saved);
      const normalized = normalizeState(parsed);
      if ((Number.isInteger(parsed.version) ? parsed.version : 1) < CURRENT_STATE_VERSION) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          loadNotice = "已更新清单中的规则性表述，个人修改和进度已保留";
        } catch (migrationSaveError) {
          console.warn("Could not persist migrated checklist", migrationSaveError);
        }
      }
      return normalized;
    } catch (error) {
      primaryStateWasInvalid = true;
      const backup = localStorage.getItem(STORAGE_BACKUP_KEY);
      if (backup) {
        try {
          loadNotice = "本地数据异常，已恢复上一份可用版本";
          return normalizeState(JSON.parse(backup));
        } catch (backupError) {
          console.warn("Could not load backup checklist", backupError);
        }
      }
      throw error;
    }
  } catch (error) {
    console.warn("Could not load saved checklist", error);
    loadNotice = "本地数据无法读取，已载入默认清单";
    return cloneDefaults();
  }
}

function normalizeState(candidate, { strictLimits = false } = {}) {
  candidate = migrateState(candidate);
  if (!candidate || !Array.isArray(candidate.categories)) throw new Error("Invalid backup");

  const totalItems = candidate.categories.reduce(
    (sum, category) => sum + (Array.isArray(category?.items) ? category.items.length : 0),
    0,
  );
  if (
    strictLimits &&
    (candidate.categories.length > MAX_CATEGORIES ||
      candidate.categories.some((category) => Array.isArray(category?.items) && category.items.length > MAX_ITEMS_PER_CATEGORY) ||
      totalItems > MAX_TOTAL_ITEMS)
  ) {
    throw new Error("Backup exceeds checklist limits");
  }

  const defaults = cloneDefaults();
  const settings = candidate.settings ?? {};
  const categoryIds = new Set();
  const itemIds = new Set();
  const categories = candidate.categories.map((category, categoryIndex) => ({
    id: uniqueSafeId(category.id, `category-${categoryIndex}`, categoryIds),
    name: safeText(category.name, "未命名分类", 30),
    icon: iconAllowlist.has(category.icon) ? category.icon : "folder-check",
    color: /^#[0-9a-f]{6}$/i.test(category.color) ? category.color : "#c63d36",
    collapsed: Boolean(category.collapsed),
    items: Array.isArray(category.items)
      ? category.items.map((entry, itemIndex) => ({
          id: uniqueSafeId(entry.id, `item-${categoryIndex}-${itemIndex}`, itemIds),
          text: safeText(entry.text, "未命名事项", 100),
          note: safeText(entry.note, "", 240),
          important: Boolean(entry.important),
          done: Boolean(entry.done),
          sourceSuggestionId: optionalSuggestionIds.has(entry.sourceSuggestionId)
            ? entry.sourceSuggestionId
            : "",
        }))
      : [],
  }));

  return {
    version: CURRENT_STATE_VERSION,
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

function uniqueSafeId(value, fallback, usedIds) {
  const base = safeId(value, fallback);
  let candidate = base;
  let suffix = 2;
  while (usedIds.has(candidate)) {
    const suffixText = `-${suffix}`;
    candidate = `${base.slice(0, 100 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

function cloneState(source = state) {
  return JSON.parse(JSON.stringify(source));
}

function recoveryMetadata(snapshot, label, snapshotLength) {
  return {
    savedAt: new Date().toISOString(),
    label,
    categoryCount: snapshot.categories.length,
    itemCount: snapshot.categories.reduce((sum, category) => sum + category.items.length, 0),
    snapshotLength,
  };
}

function writeRecoverySnapshot(snapshot, label = "自动保存的上一版本") {
  try {
    const normalized = normalizeState(cloneState(snapshot), { strictLimits: true });
    const serialized = JSON.stringify(normalized);
    localStorage.setItem(STORAGE_BACKUP_KEY, serialized);
    try {
      localStorage.setItem(
        STORAGE_BACKUP_META_KEY,
        JSON.stringify(recoveryMetadata(normalized, label, serialized.length)),
      );
    } catch (metaError) {
      console.warn("Could not update recovery metadata", metaError);
      try {
        localStorage.removeItem(STORAGE_BACKUP_META_KEY);
      } catch (cleanupError) {
        console.warn("Could not clear stale recovery metadata", cleanupError);
      }
    }
    return true;
  } catch (error) {
    console.warn("Could not update local recovery snapshot", error);
    return false;
  }
}

function captureRecoveryStorage() {
  try {
    return {
      snapshot: localStorage.getItem(STORAGE_BACKUP_KEY),
      metadata: localStorage.getItem(STORAGE_BACKUP_META_KEY),
    };
  } catch (error) {
    console.warn("Could not capture local recovery snapshot", error);
    return { snapshot: null, metadata: null };
  }
}

function restoreRecoveryStorage(previous) {
  try {
    for (const [key, value] of [
      [STORAGE_BACKUP_KEY, previous.snapshot],
      [STORAGE_BACKUP_META_KEY, previous.metadata],
    ]) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.warn("Could not roll back local recovery snapshot", error);
    return false;
  }
}

function readRecoverySnapshot() {
  try {
    const saved = localStorage.getItem(STORAGE_BACKUP_KEY);
    if (!saved) return null;
    const snapshot = normalizeState(JSON.parse(saved), { strictLimits: true });
    const metadata = {
      label: "上一份本地版本",
      savedAt: "",
      categoryCount: snapshot.categories.length,
      itemCount: snapshot.categories.reduce((sum, category) => sum + category.items.length, 0),
    };
    try {
      const storedMetadata = JSON.parse(localStorage.getItem(STORAGE_BACKUP_META_KEY) || "{}");
      if (storedMetadata.snapshotLength === saved.length) {
        if (typeof storedMetadata.label === "string") {
          metadata.label = safeText(storedMetadata.label, metadata.label, 100);
        }
        if (typeof storedMetadata.savedAt === "string" && !Number.isNaN(Date.parse(storedMetadata.savedAt))) {
          metadata.savedAt = storedMetadata.savedAt;
        }
      }
    } catch (error) {
      console.warn("Could not read recovery metadata", error);
    }
    return { snapshot, metadata };
  } catch (error) {
    console.warn("Could not read local recovery snapshot", error);
    return null;
  }
}

function invalidateUndoStack() {
  if (!undoStack.length) return;
  undoStack = [];
  if (toastActionCallback === undoLatestAction) {
    toastActionCallback = null;
    elements.toastAction.hidden = true;
  }
  updateRecoveryActions();
}

function saveState(message, { skipRecoveryUpdate = false, preserveUndo = false } = {}) {
  const serialized = JSON.stringify(state);
  try {
    const previous = localStorage.getItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, serialized);
    if (!skipRecoveryUpdate && !primaryStateWasInvalid && previous && previous !== serialized) {
      try {
        const previousState = normalizeState(JSON.parse(previous), { strictLimits: true });
        writeRecoverySnapshot(previousState);
      } catch (previousError) {
        console.warn("Skipped invalid local recovery source", previousError);
      }
    }
    primaryStateWasInvalid = false;
    if (!preserveUndo) invalidateUndoStack();
    elements.autosaveStatus.classList.remove("is-error");
    elements.autosaveText.textContent = "仅保存在此浏览器";
    updateRecoveryActions();
    if (message) showToast(message);
    return true;
  } catch (error) {
    console.warn("Could not save checklist", error);
    if (!preserveUndo) invalidateUndoStack();
    elements.autosaveStatus.classList.add("is-error");
    elements.autosaveText.textContent = "未能保存，请立即导出备份";
    showToast("修改暂时只保留在当前页面");
    return false;
  }
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
  elements.densityButton.setAttribute("aria-pressed", String(state.settings.density === "compact"));
  elements.layoutButton.setAttribute("aria-pressed", String(state.settings.layout === "single"));
  elements.editBanner.hidden = !state.settings.editMode;
  elements.departureDate.value = state.settings.departureDate;
  elements.personalNotes.value = state.settings.notes;
  elements.searchInput.value = state.settings.search;

  for (const button of elements.filterControl.querySelectorAll("button")) {
    button.classList.toggle("is-active", button.dataset.filter === state.settings.filter);
    button.setAttribute("aria-pressed", String(button.dataset.filter === state.settings.filter));
  }

  renderStats();
  renderCountdown();
  renderFocusPanel();
  renderCategories();
  renderSuggestions();
  updateRecoveryActions();
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

function daysUntilDeparture() {
  if (!state.settings.departureDate) return null;
  const departure = new Date(`${state.settings.departureDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((departure - today) / 86400000);
}

function renderFocusPanel() {
  const days = daysUntilDeparture();
  const phases =
    days === null
      ? {
          phase: "当前焦点",
          title: "先处理关键待办",
          description: "设置出发日期后，会按阶段调整建议顺序。",
          categories: ["documents", "living", "health", "electronics", "clothes", "arrival"],
        }
      : days > 30
        ? {
            phase: "出发 30 天以上",
            title: "先确认长期手续与住处",
            description: "优先处理证件、住宿和需要提前准备的健康材料。",
            categories: ["documents", "living", "health", "electronics", "clothes", "arrival"],
          }
        : days > 14
          ? {
              phase: "出发前 15–30 天",
              title: "补齐材料，开始安排生活",
              description: "复核注册材料、住宿细节和抵港后的基础安排。",
              categories: ["documents", "living", "electronics", "health", "clothes", "arrival"],
            }
          : days > 3
            ? {
                phase: "出发前 4–14 天",
                title: "进入打包与复核阶段",
                description: "把关键文件、设备和药物放到容易确认的位置。",
                categories: ["documents", "electronics", "health", "clothes", "living", "arrival"],
              }
            : days >= 0
              ? {
                  phase: days === 0 ? "今天出发" : `出发前 ${days} 天`,
                  title: "只看不能遗漏的事项",
                  description: "集中完成仍未勾选的关键事项，避免临行前分散注意力。",
                  categories: ["documents", "electronics", "health", "clothes", "living", "arrival"],
                }
              : {
                  phase: "抵港后",
                  title: "继续完成落地办理",
                  description: "优先处理学校注册、香港身份证、通信和银行等事项。",
                  categories: ["arrival", "documents", "health", "living", "electronics", "clothes"],
                };

  const categoryOrder = new Map(phases.categories.map((categoryId, index) => [categoryId, index]));
  const allUndone = state.categories
    .flatMap((category) =>
      category.items
        .filter((entry) => !entry.done)
        .map((entry, itemIndex) => ({ category, entry, itemIndex })),
    );
  const undone = allUndone
    .filter(({ category }) => (days !== null && days < 0 ? category.id === "arrival" : category.id !== "arrival"))
    .sort((left, right) => {
      const importantDifference = Number(right.entry.important) - Number(left.entry.important);
      if (importantDifference) return importantDifference;
      const categoryDifference =
        (categoryOrder.get(left.category.id) ?? 99) - (categoryOrder.get(right.category.id) ?? 99);
      return categoryDifference || left.itemIndex - right.itemIndex;
    });

  elements.focusPhase.textContent = phases.phase;
  elements.focusTitle.textContent = undone.length
    ? phases.title
    : allUndone.length
      ? "当前阶段已完成"
      : "当前清单已经完成";
  elements.focusDescription.textContent = undone.length
    ? phases.description
    : allUndone.length
      ? "其余阶段仍有事项，可在下方清单中继续处理。"
      : "可以导出一份备份，或继续添加个人需要的事项。";
  elements.focusItems.innerHTML = "";

  undone.slice(0, 3).forEach(({ category, entry }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "focus-item";
    button.dataset.focusItemId = entry.id;
    button.title = `${category.name}：${entry.text}`;
    button.textContent = entry.text;
    elements.focusItems.appendChild(button);
  });

  elements.focusActionButton.textContent =
    days === null
      ? "设置出发日期"
      : undone.length
        ? "查看当前阶段"
        : allUndone.length
          ? "查看剩余事项"
          : "导出备份";
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
  if (!visibleCategoryCount) {
    const hasCategories = state.categories.length > 0;
    elements.emptyStateTitle.textContent = hasCategories ? "没有找到对应事项" : "清单还是空的";
    elements.emptyStateText.textContent = hasCategories
      ? "换个关键词，或清除当前筛选条件。"
      : "先创建一个大类，再加入你的第一项准备。";
    elements.clearFiltersButton.textContent = hasCategories ? "清除筛选" : "添加大类";
  }
}

function matchesFilters(entry, query) {
  const searchable = `${entry.text} ${entry.note}`.toLocaleLowerCase("zh-CN");
  return (!query || searchable.includes(query)) && matchesStatusFilter(entry);
}

function matchesStatusFilter(entry) {
  if (state.settings.filter === "todo") return !entry.done;
  if (state.settings.filter === "done") return entry.done;
  if (state.settings.filter === "important") return entry.important && !entry.done;
  return true;
}

function renderSuggestions() {
  const used = new Set(state.settings.usedSuggestions);
  const existingSources = new Set(
    state.categories.flatMap((category) =>
      category.items.map((entry) => entry.sourceSuggestionId).filter(Boolean),
    ),
  );
  const available = optionalSuggestions.filter(
    (entry) => !used.has(entry.id) && !existingSources.has(entry.id),
  );
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
      <button class="category-icon-button" data-action="toggle-category" aria-label="切换大类" aria-expanded="${!category.collapsed}" title="${category.collapsed ? "展开" : "折叠"}分类"><i data-lucide="${category.collapsed ? "chevron-down" : "chevron-up"}" aria-hidden="true"></i></button>
    </div>`;
  header.querySelector(".category-title").textContent = category.name;
  header
    .querySelector('[data-action="open-category-menu"]')
    .setAttribute("aria-label", `管理大类“${category.name}”`);
  header
    .querySelector('[data-action="toggle-category"]')
    .setAttribute("aria-label", `${category.collapsed ? "展开" : "折叠"}大类“${category.name}”`);
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
  const checkboxHitArea = document.createElement("label");
  checkboxHitArea.className = "item-checkbox-hit";
  checkboxHitArea.appendChild(checkbox);
  row.appendChild(checkboxHitArea);

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
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  render();
}

function totalItemCount() {
  return state.categories.reduce((sum, category) => sum + category.items.length, 0);
}

function openManageDialog() {
  closeContextMenu();
  elements.manageDialog.showModal();
}

function deleteCategory(category) {
  const description = category.items.length ? `，其中包含 ${category.items.length} 个事项` : "";
  if (!window.confirm(`删除大类“${category.name}”${description}？`)) return false;
  const previousState = cloneState();
  if (!writeRecoverySnapshot(previousState, `删除大类“${category.name}”前的清单`)) {
    showToast("未能创建恢复点，删除已取消，请先导出备份");
    return false;
  }
  const categoryIndex = state.categories.findIndex((entry) => entry.id === category.id);
  if (categoryIndex < 0) return false;
  state.categories.splice(categoryIndex, 1);
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  render();
  queueUndo(previousState, `删除大类“${category.name}”`, "大类已删除");
  return true;
}

function deleteItem(category, entry) {
  if (!entry) return false;
  const previousState = cloneState();
  if (!writeRecoverySnapshot(previousState, `删除“${entry.text}”前的清单`)) {
    showToast("未能创建恢复点，删除已取消，请先导出备份");
    return false;
  }
  const itemIndex = category.items.findIndex((candidate) => candidate.id === entry.id);
  const [deleted] = category.items.splice(itemIndex, 1);
  const suggestionId = suggestionIdForItem(deleted);
  if (suggestionId) {
    state.settings.usedSuggestions = state.settings.usedSuggestions.filter((id) => id !== suggestionId);
  }
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  render();
  queueUndo(previousState, `删除“${entry.text}”`, `已删除“${entry.text}”`);
  return true;
}

function suggestionIdForItem(entry) {
  if (optionalSuggestionIds.has(entry?.sourceSuggestionId)) return entry.sourceSuggestionId;
  return optionalSuggestions.find(
    (suggestionEntry) =>
      suggestionEntry.text === entry?.text && suggestionEntry.note === entry?.note,
  )?.id;
}

function closeContextMenu(restoreFocus = false) {
  elements.contextMenu.hidden = true;
  elements.contextMenu.innerHTML = "";
  contextTarget = null;
  if (restoreFocus && contextReturnFocus?.isConnected) {
    contextReturnFocus.focus({ preventScroll: true });
  }
  contextReturnFocus = null;
}

function contextActionsFor(target) {
  if (target.type === "item") {
    const category = findCategory(target.categoryId);
    const itemIndex = category?.items.findIndex((entry) => entry.id === target.itemId) ?? -1;
    return [
      { action: "edit-item", icon: "pencil", label: "编辑或移动" },
      { action: "move-item-up", icon: "arrow-up", label: "上移事项", disabled: itemIndex <= 0 },
      {
        action: "move-item-down",
        icon: "arrow-down",
        label: "下移事项",
        disabled: !category || itemIndex < 0 || itemIndex >= category.items.length - 1,
      },
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
  contextReturnFocus = options.anchor ?? document.activeElement;

  contextActionsFor(target).forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.tabIndex = -1;
    button.dataset.contextAction = entry.action;
    button.disabled = Boolean(entry.disabled);
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
  const firstEnabledButton = elements.contextMenu.querySelector("button:not(:disabled)");
  if (firstEnabledButton) {
    firstEnabledButton.tabIndex = 0;
    firstEnabledButton.focus({ preventScroll: true });
  }
}

function sameContextTarget(left, right) {
  return Boolean(
    left &&
      right &&
      left.type === right.type &&
      left.categoryId === right.categoryId &&
      left.itemId === right.itemId,
  );
}

function focusItemMenu(itemId) {
  requestAnimationFrame(() => {
    elements.categoryGrid
      .querySelector(`.checklist-item[data-item-id="${CSS.escape(itemId)}"] .item-menu-button`)
      ?.focus({ preventScroll: true });
  });
}

function focusCategoryMenu(categoryId) {
  requestAnimationFrame(() => {
    elements.categoryGrid
      .querySelector(`.category-panel[data-category-id="${CSS.escape(categoryId)}"] .category-menu-button`)
      ?.focus({ preventScroll: true });
  });
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

function showToast(message, options = {}) {
  clearTimeout(toastTimer);
  toastActionCallback = options.onAction ?? null;
  elements.toastMessage.textContent = message;
  elements.toastAction.hidden = !toastActionCallback;
  elements.toastAction.textContent = options.actionLabel ?? "";
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
    toastActionCallback = null;
    elements.toastAction.hidden = true;
  }, options.duration ?? 2200);
}

function updateRecoveryActions() {
  const recovery = readRecoverySnapshot();
  const savedTime = recovery ? formatRecoveryTime(recovery.metadata.savedAt) : "";
  elements.restoreBackupButton.disabled = !recovery;
  elements.restoreBackupButton.title = recovery
    ? `${recovery.metadata.label}${savedTime ? `（${savedTime}）` : ""}：${recovery.metadata.categoryCount} 个大类、${recovery.metadata.itemCount} 个事项`
    : "暂无可恢复的本地版本";
  elements.undoButton.hidden = undoStack.length === 0;
  elements.undoButton.querySelector("span").textContent =
    undoStack.length > 1 ? `撤销最近操作（${undoStack.length}）` : "撤销最近操作";
}

function formatRecoveryTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function showUndoToast(message) {
  const count = undoStack.length;
  showToast(message, {
    actionLabel: count > 1 ? `撤销（${count}）` : "撤销",
    duration: 8000,
    onAction: undoLatestAction,
  });
}

function queueUndo(snapshot, label, message) {
  undoStack.push({ snapshot: cloneState(snapshot), label });
  if (undoStack.length > MAX_UNDO_ACTIONS) undoStack.shift();
  updateRecoveryActions();
  showUndoToast(message);
}

function undoLatestAction() {
  const action = undoStack.pop();
  if (!action) return;
  const currentState = cloneState();
  state = cloneState(action.snapshot);
  if (!saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true })) {
    state = currentState;
    undoStack.push(action);
    render();
    return;
  }
  render();
  updateRecoveryActions();
  if (undoStack.length) {
    showUndoToast(`已撤销“${action.label}”，还可继续撤销`);
  } else {
    showToast(`已撤销“${action.label}”`);
  }
}

function restoreRecoverySnapshot() {
  const recovery = readRecoverySnapshot();
  if (!recovery) {
    showToast("暂无可恢复的本地版本");
    return;
  }
  const summary = `${recovery.metadata.categoryCount} 个大类、${recovery.metadata.itemCount} 个事项`;
  const savedTime = formatRecoveryTime(recovery.metadata.savedAt);
  const source = `${recovery.metadata.label}${savedTime ? `，保存于 ${savedTime}` : ""}`;
  if (!window.confirm(`恢复“${source}”（${summary}）？当前清单会保留为新的恢复点。`)) return;

  const currentState = cloneState();
  const previousRecovery = captureRecoveryStorage();
  if (!writeRecoverySnapshot(currentState, "恢复前的清单")) {
    showToast("未能创建恢复点，操作已取消，请先导出备份");
    return;
  }
  state = cloneState(recovery.snapshot);
  if (!saveState(undefined, { skipRecoveryUpdate: true })) {
    state = currentState;
    restoreRecoveryStorage(previousRecovery);
    render();
    return;
  }
  render();
  queueUndo(currentState, "恢复本地版本", "已恢复上一份本地版本");
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
    if (file.size > MAX_IMPORT_BYTES) throw new Error("Backup file is too large");
    const parsed = JSON.parse(await file.text());
    const nextState = normalizeState(parsed, { strictLimits: true });
    const categoryCount = nextState.categories.length;
    const itemCount = nextState.categories.reduce((sum, category) => sum + category.items.length, 0);
    if (!window.confirm(`导入将替换当前清单。该备份包含 ${categoryCount} 个大类、${itemCount} 个事项，继续吗？`)) {
      return;
    }
    const previousState = cloneState();
    const previousRecovery = captureRecoveryStorage();
    if (!writeRecoverySnapshot(previousState, "导入前的清单")) {
      showToast("未能创建恢复点，导入已取消，请先导出备份");
      return;
    }
    state = nextState;
    if (!saveState(undefined, { skipRecoveryUpdate: true })) {
      state = previousState;
      restoreRecoveryStorage(previousRecovery);
      render();
      return;
    }
    render();
    queueUndo(previousState, "导入备份", "备份已恢复");
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
      showToast("清单已通过系统分享");
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

  if (category.items.length >= MAX_ITEMS_PER_CATEGORY || totalItemCount() >= MAX_TOTAL_ITEMS) {
    showToast("清单事项已达到上限");
    return;
  }

  category.items.push(item(makeId("item"), entry.text, entry.note, false, entry.id));
  state.settings.usedSuggestions.push(entry.id);
  saveState(`已加入“${entry.text}”`);
  render();
});

elements.categoryGrid.addEventListener("click", (event) => {
  const clickedTarget = contextTargetFromElement(event.target);
  if (
    suppressedClickTarget &&
    performance.now() <= suppressClickUntil &&
    sameContextTarget(clickedTarget, suppressedClickTarget)
  ) {
    suppressedClickTarget = null;
    suppressClickUntil = 0;
    clearTimeout(suppressClickTimer);
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const panel = button.closest(".category-panel");
  const category = findCategory(panel?.dataset.categoryId);
  if (!category) return;
  const action = button.dataset.action;
  const row = button.closest(".checklist-item");
  const itemId = row?.dataset.itemId;
  const itemIndex = category.items.findIndex((entry) => entry.id === itemId);

  if (action === "toggle-category") {
    category.collapsed = !category.collapsed;
    saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
    render();
    return;
  }
  if (action === "add-item") return openItemDialog(category.id);
  if (action === "open-category-menu") {
    event.stopPropagation();
    return openContextMenu({ type: "category", categoryId: category.id }, { anchor: button });
  }
  if (action === "open-item-menu") {
    event.stopPropagation();
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
  if (event.pointerType === "mouse" || event.target.closest("button, input, label, a")) return;
  const target = contextTargetFromElement(event.target);
  if (!target) return;
  longPressStart = { x: event.clientX, y: event.clientY, target };
  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(() => {
    if (!longPressStart) return;
    longPressActivatedTarget = longPressStart.target;
    openContextMenu(longPressActivatedTarget, { x: longPressStart.x, y: longPressStart.y });
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
    if (eventName === "pointerup") armLongPressClickSuppression();
    if (eventName === "pointercancel") longPressActivatedTarget = null;
  });
}

elements.categoryGrid.addEventListener("touchend", armLongPressClickSuppression, { passive: true });

elements.contextMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-context-action]");
  if (!button || !contextTarget) return;
  const target = { ...contextTarget };
  const category = findCategory(target.categoryId);
  const entry = target.itemId ? findItem(target.itemId)?.entry : null;
  const action = button.dataset.contextAction;
  const itemIndex = entry ? category?.items.findIndex((candidate) => candidate.id === entry.id) ?? -1 : -1;
  const nextItemId = entry
    ? category?.items[itemIndex + 1]?.id ?? category?.items[itemIndex - 1]?.id ?? null
    : null;
  const categoryIndex = state.categories.findIndex((candidate) => candidate.id === category?.id);
  const nextCategoryId =
    state.categories[categoryIndex + 1]?.id ?? state.categories[categoryIndex - 1]?.id ?? null;
  closeContextMenu();
  if (!category) return;

  if (action === "add-item") openItemDialog(category.id);
  if (action === "edit-category") openCategoryDialog(category);
  if (action === "delete-category") {
    const deleted = deleteCategory(category);
    if (deleted && nextCategoryId) focusCategoryMenu(nextCategoryId);
    if (!deleted) focusCategoryMenu(category.id);
  }
  if (action === "edit-item" && entry) openItemDialog(category.id, entry);
  if (action === "delete-item" && entry) {
    const deleted = deleteItem(category, entry);
    if (deleted && nextItemId) focusItemMenu(nextItemId);
    else if (deleted) focusCategoryMenu(category.id);
    else focusItemMenu(entry.id);
  }
  if (["move-item-up", "move-item-down"].includes(action) && entry) {
    const index = category.items.findIndex((candidate) => candidate.id === entry.id);
    moveArrayItem(
      category.items,
      index,
      index + (action === "move-item-up" ? -1 : 1),
    );
    saveState("事项顺序已调整");
    render();
    focusItemMenu(entry.id);
  }
});

elements.contextMenu.addEventListener("keydown", (event) => {
  const buttons = [...elements.contextMenu.querySelectorAll("button:not(:disabled)")];
  if (!buttons.length) return;
  const currentIndex = buttons.indexOf(document.activeElement);
  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) event.preventDefault();
  let nextButton = null;
  if (event.key === "ArrowDown") nextButton = buttons[(currentIndex + 1 + buttons.length) % buttons.length];
  if (event.key === "ArrowUp") nextButton = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
  if (event.key === "Home") nextButton = buttons[0];
  if (event.key === "End") nextButton = buttons.at(-1);
  if (nextButton) {
    buttons.forEach((entry) => {
      entry.tabIndex = entry === nextButton ? 0 : -1;
    });
    nextButton.focus();
  }
  if (event.key === "Tab") {
    event.preventDefault();
    closeContextMenu(true);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeContextMenu(true);
  }
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
  if (source.category.id !== targetCategory.id && targetCategory.items.length >= MAX_ITEMS_PER_CATEGORY) {
    showToast(`目标大类已达到 ${MAX_ITEMS_PER_CATEGORY} 项上限`);
    return;
  }

  const targetRow = event.target.closest(".checklist-item");
  if (targetRow?.dataset.itemId === itemId) return;
  const sourceIndex = source.category.items.findIndex((entry) => entry.id === itemId);
  const [moved] = source.category.items.splice(sourceIndex, 1);
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
    if (found.category.id !== targetCategory.id && targetCategory.items.length >= MAX_ITEMS_PER_CATEGORY) {
      showToast(`目标大类已达到 ${MAX_ITEMS_PER_CATEGORY} 项上限`);
      return;
    }
    found.entry.text = text;
    found.entry.note = elements.itemNote.value.trim();
    found.entry.important = elements.itemImportant.checked;
    if (found.category.id !== targetCategory.id) {
      found.category.items = found.category.items.filter((entry) => entry.id !== editingId);
      targetCategory.items.push(found.entry);
    }
    showToast("事项已更新");
  } else {
    if (targetCategory.items.length >= MAX_ITEMS_PER_CATEGORY || totalItemCount() >= MAX_TOTAL_ITEMS) {
      showToast("清单事项已达到上限");
      return;
    }
    targetCategory.items.push({
      id: makeId("item"),
      text,
      note: elements.itemNote.value.trim(),
      important: elements.itemImportant.checked,
      done: false,
      sourceSuggestionId: "",
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
    if (state.categories.length >= MAX_CATEGORIES) {
      showToast("大类数量已达到上限");
      return;
    }
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
  renderFocusPanel();
  refreshIcons();
});

elements.personalNotes.addEventListener("input", () => {
  invalidateUndoStack();
  state.settings.notes = elements.personalNotes.value;
  elements.autosaveStatus.classList.remove("is-error");
  elements.autosaveText.textContent = "正在保存…";
  clearTimeout(elements.personalNotes.saveTimer);
  elements.personalNotes.saveTimer = setTimeout(() => {
    elements.personalNotes.saveTimer = null;
    saveState();
  }, 350);
});

function flushPendingNotes() {
  if (!elements.personalNotes.saveTimer) return;
  clearTimeout(elements.personalNotes.saveTimer);
  elements.personalNotes.saveTimer = null;
  state.settings.notes = elements.personalNotes.value;
  saveState();
}

elements.personalNotes.addEventListener("blur", flushPendingNotes);
window.addEventListener("pagehide", flushPendingNotes);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushPendingNotes();
});

elements.searchInput.addEventListener("input", () => {
  state.settings.search = elements.searchInput.value;
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  renderCategories();
  refreshIcons();
});

elements.filterControl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  state.settings.filter = button.dataset.filter;
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  render();
});

document.querySelector("#manageChecklistButton").addEventListener("click", openManageDialog);
document.querySelector("#heroContinueButton").addEventListener("click", () => {
  elements.focusPanel.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelector("#exitEditMode").addEventListener("click", () => toggleEditMode(false));
elements.clearFiltersButton.addEventListener("click", () => {
  if (!state.categories.length) {
    openCategoryDialog();
    return;
  }
  state.settings.filter = "all";
  state.settings.search = "";
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  render();
});

elements.mobileOverviewToggle.addEventListener("click", () => {
  const expanded = !elements.sidebar.classList.contains("is-expanded");
  elements.sidebar.classList.toggle("is-expanded", expanded);
  elements.mobileOverviewToggle.setAttribute("aria-expanded", String(expanded));
});

elements.focusItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-focus-item-id]");
  if (!button) return;
  const found = findItem(button.dataset.focusItemId);
  if (!found) return;
  state.settings.filter = "all";
  state.settings.search = "";
  found.category.collapsed = false;
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  render();
  requestAnimationFrame(() => {
    const row = elements.categoryGrid.querySelector(`[data-item-id="${CSS.escape(found.entry.id)}"]`);
    if (!row) return;
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    row.classList.add("is-highlighted");
    setTimeout(() => row.classList.remove("is-highlighted"), 1800);
  });
});

elements.focusActionButton.addEventListener("click", () => {
  if (!state.settings.departureDate) {
    elements.sidebar.classList.add("is-expanded");
    elements.mobileOverviewToggle.setAttribute("aria-expanded", "true");
    elements.departureDate.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => elements.departureDate.focus({ preventScroll: true }));
    return;
  }
  const allUndone = state.categories.flatMap((category) => category.items).filter((entry) => !entry.done);
  if (!allUndone.length) {
    exportBackup();
    return;
  }
  const firstFocusItem = elements.focusItems.querySelector("button[data-focus-item-id]");
  if (firstFocusItem) {
    firstFocusItem.click();
    return;
  }
  state.settings.filter = "todo";
  state.settings.search = "";
  saveState(undefined, { skipRecoveryUpdate: true, preserveUndo: true });
  render();
  elements.categoryGrid.scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.densityButton.addEventListener("click", () => {
  state.settings.density = state.settings.density === "compact" ? "comfortable" : "compact";
  saveState(state.settings.density === "compact" ? "已切换为紧凑视图" : "已切换为舒适视图", {
    skipRecoveryUpdate: true,
    preserveUndo: true,
  });
  render();
});

elements.layoutButton.addEventListener("click", () => {
  state.settings.layout = state.settings.layout === "single" ? "double" : "single";
  saveState(state.settings.layout === "single" ? "已切换为单列" : "已切换为双列", {
    skipRecoveryUpdate: true,
    preserveUndo: true,
  });
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
document.querySelector("#sidebarExportButton").addEventListener("click", exportBackup);
document.querySelector("#importButton").addEventListener("click", () => {
  closeMoreMenu();
  elements.importFileInput.click();
});
elements.restoreBackupButton.addEventListener("click", () => {
  closeMoreMenu();
  restoreRecoverySnapshot();
});
elements.undoButton.addEventListener("click", () => {
  closeMoreMenu();
  undoLatestAction();
});
document.querySelector("#printButton").addEventListener("click", () => {
  closeMoreMenu();
  window.print();
});
document.querySelector("#resetButton").addEventListener("click", () => {
  closeMoreMenu();
  if (!window.confirm("恢复默认清单？当前修改和勾选进度会被清除。")) return;
  const previousState = cloneState();
  const previousRecovery = captureRecoveryStorage();
  if (!writeRecoverySnapshot(previousState, "恢复默认前的清单")) {
    showToast("未能创建恢复点，操作已取消，请先导出备份");
    return;
  }
  state = cloneDefaults();
  if (!saveState(undefined, { skipRecoveryUpdate: true })) {
    state = previousState;
    restoreRecoveryStorage(previousRecovery);
    render();
    return;
  }
  render();
  queueUndo(previousState, "恢复默认清单", "已恢复默认清单");
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
  if (event.key === "Escape") closeContextMenu(true);
});

render();
if (loadNotice) showToast(loadNotice, { duration: 5200 });

elements.toastAction.addEventListener("click", () => {
  const callback = toastActionCallback;
  clearTimeout(toastTimer);
  elements.toast.classList.remove("is-visible");
  elements.toastAction.hidden = true;
  toastActionCallback = null;
  callback?.();
});
