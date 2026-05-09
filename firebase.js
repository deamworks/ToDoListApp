import { initializeApp }                                                              from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
                                                                                      from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc, query, where, orderBy }
                                                                                      from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Config
const app  = initializeApp({ apiKey: "AIzaSyCtwi-GyB2NU7y_ouvpnzdSJDzbTmzAhe4", 
    authDomain: "todolistapp-e75da.firebaseapp.com", 
    projectId: "todolistapp-e75da", 
    storageBucket: "todolistapp-e75da.firebasestorage.app", 
    messagingSenderId: "210304176272", 
    appId: "1:210304176272:web:367acb7188bcda870c0815" });
const auth = getAuth(app);
const db   = getFirestore(app);

const EMAILJS    = { service: "service_j2nsi9q", template: "template_9lau9oj", key: "LXu2-8id6SJ_ESIe-" };
const CATEGORIES = ["Work", "Personal", "Study", "Health", "Other"];
const WEEKDAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS     = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Translations 
const TR = {
  en: {
    welcomeBack: "Welcome back!", createAccount: "Create your account",
    emailPlaceholder: "Enter your email", passwordPlaceholder: "••••••••",
    signIn: "Sign In", signUp: "Sign Up",
    noAccount: "Don't have an account?", haveAccount: "Already have an account?",
    displayNameLabel: "Display Name", displayNamePlaceholder: "Enter your name", passwordLabel: "Password",
    tasksTab: '<i class="fa-solid fa-clipboard-list"></i> Tasks',
    calendarTab: '<i class="fa-solid fa-calendar-days"></i> Calendar',
    dashboardTab: '<i class="fa-solid fa-chart-bar"></i> Dashboard',
    pending: "Pending", inProgress: "In Progress", completed: "Completed",
    searchPlaceholder: "Search tasks...", allStatus: "All Status", allCategories: "All Categories", addTask: "+ Add Task",
    overdue: "Overdue", noTasksFound: "No tasks found", newTask: "New Task", editTask: "Edit Task",
    titleLabel: "Title *", titlePlaceholder: "Task title", descLabel: "Description", descPlaceholder: "Optional description",
    categoryLabel: "Category", statusLabel: "Status", dueDateLabel: "Due Date", dueTimeLabel: "Due Time",
    assignLabel: "Assign To", assignHint: "(comma separated)", assignPlaceholder: "e.g. Alice, Bob or a@email.com",
    cancel: "Cancel", saveChanges: "Save Changes",
    deleteConfirm: "Delete this task?", titleRequired: "Please enter a task title!", nameRequired: "Please enter your display name!",
    passwordWeak: "Password must include uppercase, lowercase, number, and a special character (min 8 chars).",
    sendEmail: "Notify", emailSending: "Sending...", emailSuccess: "Email sent!", emailFail: "Failed to send email.", emailNoAssigned: "No assigned email found.",
    notifyAssign: "Task Assigned", notifyStatus: "Status Updated",
    totalTasks: "Total Tasks", completionRate: "Completion %", tasksByCategory: "Tasks by Category",
    overdueTasks: '<i class="fa-solid fa-triangle-exclamation"></i> Overdue Tasks',
    statusOptions: { pending: "Pending", in_progress: "In Progress", completed: "Completed" },
    categories:   { Work: "Work", Personal: "Personal", Study: "Study", Health: "Health", Other: "Other" },
    pwRules:  { len: "8+ chars", upper: "Uppercase", lower: "Lowercase", num: "Number", special: "Special char" },
    pwLevels: ["", "Very Weak", "Weak", "Fair", "Good", "Strong"],
  },
  th: {
    welcomeBack: "ยินดีต้อนรับกลับ!", createAccount: "สร้างบัญชีใหม่",
    emailPlaceholder: "อีเมลของคุณ", passwordPlaceholder: "รหัสผ่าน",
    signIn: "เข้าสู่ระบบ", signUp: "สมัครสมาชิก",
    noAccount: "ยังไม่มีบัญชี?", haveAccount: "มีบัญชีอยู่แล้ว?",
    displayNameLabel: "ชื่อที่แสดง", displayNamePlaceholder: "ชื่อของคุณ", passwordLabel: "รหัสผ่าน",
    tasksTab: '<i class="fa-solid fa-clipboard-list"></i> งาน',
    calendarTab: '<i class="fa-solid fa-calendar-days"></i> ปฏิทิน',
    dashboardTab: '<i class="fa-solid fa-chart-bar"></i> ภาพรวม',
    pending: "รอดำเนินการ", inProgress: "กำลังทำ", completed: "เสร็จแล้ว",
    searchPlaceholder: "ค้นหางาน...", allStatus: "ทุกสถานะ", allCategories: "ทุกหมวดหมู่", addTask: "+ เพิ่มงาน",
    overdue: "เลยกำหนด", noTasksFound: "ไม่พบงาน", newTask: "งานใหม่", editTask: "แก้ไขงาน",
    titleLabel: "ชื่องาน *", titlePlaceholder: "ชื่องาน", descLabel: "รายละเอียด", descPlaceholder: "รายละเอียดเพิ่มเติม (ไม่บังคับ)",
    categoryLabel: "หมวดหมู่", statusLabel: "สถานะ", dueDateLabel: "วันที่ครบกำหนด", dueTimeLabel: "เวลาครบกำหนด",
    assignLabel: "มอบหมายให้", assignHint: "(คั่นด้วยจุลภาค)", assignPlaceholder: "เช่น สมชาย, สมหญิง หรืออีเมล",
    cancel: "ยกเลิก", saveChanges: "บันทึกการเปลี่ยนแปลง",
    deleteConfirm: "ต้องการลบงานนี้ใช่ไหม?", titleRequired: "กรุณาใส่ชื่องาน!", nameRequired: "กรุณาใส่ชื่อของคุณ!",
    passwordWeak: "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ (อย่างน้อย 8 ตัว)",
    sendEmail: "แจ้งเตือน", emailSending: "กำลังส่ง...", emailSuccess: "ส่งอีเมลสำเร็จ!", emailFail: "ส่งอีเมลไม่สำเร็จ", emailNoAssigned: "ไม่พบอีเมลของผู้รับ",
    notifyAssign: "มีการมอบหมายงานให้คุณ", notifyStatus: "สถานะงานอัปเดตแล้ว",
    totalTasks: "งานทั้งหมด", completionRate: "อัตราความสำเร็จ", tasksByCategory: "งานแยกตามหมวดหมู่",
    overdueTasks: '<i class="fa-solid fa-triangle-exclamation"></i> งานที่เลยกำหนด',
    statusOptions: { pending: "รอดำเนินการ", in_progress: "กำลังทำ", completed: "เสร็จแล้ว" },
    categories:   { Work: "งาน", Personal: "ส่วนตัว", Study: "การเรียน", Health: "สุขภาพ", Other: "อื่นๆ" },
    pwRules:  { len: "8+ ตัวอักษร", upper: "ตัวพิมพ์ใหญ่", lower: "ตัวพิมพ์เล็ก", num: "ตัวเลข", special: "อักขระพิเศษ" },
    pwLevels: ["", "อ่อนมาก", "อ่อน", "พอใช้", "ดี", "แข็งแกร่ง"],
  },
};

// State 
let tasks       = [];
let editId      = null;
let authMode    = "login";
let lang        = localStorage.getItem("taskflow-lang")  || "en";
let theme       = localStorage.getItem("taskflow-theme") || "dark";
let userProfile = null;
let calView     = "month";
let calDate     = new Date();

const t  = (key) => TR[lang][key] ?? key;
const $  = (id)  => document.getElementById(id);
const qs = (sel) => document.querySelector(sel);

// Firestore 
const loadTasks = async (uid) => {
  const snap = await getDocs(query(collection(db, "tasks"), where("uid","==",uid), orderBy("createdAt","desc")));
  tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderAll();
};
const createTask       = (data)     => addDoc(collection(db,"tasks"), data);
const updateTask       = (id, data) => updateDoc(doc(db,"tasks",id), data);
const removeTask       = (id)       => deleteDoc(doc(db,"tasks",id));
const saveUserProfile  = (uid, displayName, email) => setDoc(doc(db,"users",uid), { displayName, email });
const fetchUserProfile = async (uid) => { const s = await getDoc(doc(db,"users",uid)); return s.exists() ? s.data() : null; };

//  Password 
const checkPassword = (pw) => {
  const rules = { len: pw.length>=8, upper: /[A-Z]/.test(pw), lower: /[a-z]/.test(pw), num: /[0-9]/.test(pw), special: /[^A-Za-z0-9]/.test(pw) };
  return { rules, score: Object.values(rules).filter(Boolean).length };
};

const updateStrengthUI = (pw) => {
  const { rules, score } = checkPassword(pw);
  const colors = ["transparent","#f87171","#fb923c","#fbbf24","#34d399","#10b981"];
  Object.entries(rules).forEach(([k,ok]) => $(`rule-${k}`)?.classList.toggle("ok", ok));
  $("pw-strength-fill").style.cssText = `width:${pw ? score*20 : 0}%;background:${pw ? colors[score] : "transparent"}`;
  const lbl = $("pw-strength-label");
  lbl.textContent = pw ? t("pwLevels")[score] : "";
  lbl.style.color = colors[score];
};

// Eye toggle
const pwInput = $("auth-password");
$("btn-toggle-password").onclick = () => {
  const show = pwInput.type === "password";
  pwInput.type = show ? "text" : "password";
  $("eye-icon").className = `fa-solid fa-eye${show ? "-slash" : ""}`;
};
pwInput.addEventListener("input", () => { if (authMode === "signup") updateStrengthUI(pwInput.value); });

// EmailJS 
const sendEmail = async (task, subject, toEmail) => {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS.service, template_id: EMAILJS.template, user_id: EMAILJS.key,
      template_params: {
        to_email: toEmail, to_name: toEmail,
        from_name: userProfile?.displayName || auth.currentUser?.email || "TaskFlow",
        subject, task_title: task.title, task_status: task.status.replace("_"," "),
        task_cat: task.category, task_desc: task.description || "-",
        task_due: task.dueDate ? `${task.dueDate}${task.dueTime ? " "+task.dueTime : ""}` : "-",
        assigned: task.assigned?.join(", ") || "-", app_url: window.location.href,
      },
    }),
  });
  if (!res.ok) throw new Error("EmailJS " + res.status);
};

const notifyAssigned = async (task, msgKey) => {
  const emails = (task?.assigned||[]).filter((a) => a.includes("@"));
  if (!emails.length) { showToast(t("emailNoAssigned"), "error"); return; }
  showToast(t("emailSending"), "info");
  try {
    await Promise.all(emails.map((e) => sendEmail(task, t(msgKey), e)));
    showToast(t("emailSuccess"), "success");
  } catch { showToast(t("emailFail"), "error"); }
};

//  Theme & Language 
const switchTheme = (newTheme) => {
  theme = newTheme;
  localStorage.setItem("taskflow-theme", theme);
  document.documentElement.classList.toggle("light", theme === "light");
  const icon = theme === "light" ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun" style="color:rgb(152,150,176)"></i>';
  [$("btn-theme"), $("auth-btn-theme")].forEach((b) => b && (b.innerHTML = icon));
};

const switchLanguage = (newLang) => {
  lang = newLang;
  localStorage.setItem("taskflow-lang", lang);
  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
  applyTranslations();
};

const applyTranslations = () => {
  const isLogin = authMode === "login";

  // Auth
  $("auth-subtitle").textContent       = isLogin ? t("welcomeBack") : t("createAccount");
  $("auth-submit-btn").textContent     = isLogin ? t("signIn") : t("signUp");
  $("auth-password-label").textContent = t("passwordLabel");
  $("auth-name-label").textContent     = t("displayNameLabel");
  $("auth-name").placeholder           = t("displayNamePlaceholder");
  $("auth-email").placeholder          = t("emailPlaceholder");
  $("auth-password").placeholder       = t("passwordPlaceholder");
  $("auth-name-field").classList.toggle("hidden", isLogin);
  $("pw-strength-box").classList.toggle("hidden", isLogin);
  qs(".auth-switch").innerHTML = `${t(isLogin?"noAccount":"haveAccount")} <span id="auth-mode-toggle">${t(isLogin?"signUp":"signIn")}</span>`;
  $("auth-mode-toggle").addEventListener("click", switchAuthMode);

  // pw-rules
  Object.entries(t("pwRules")).forEach(([k,label]) => {
    const el = $(`rule-${k}`);
    if (el) el.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${label}`;
  });
  if (isLogin) {
    $("pw-strength-fill").style.cssText = "width:0%;background:transparent";
    $("pw-strength-label").textContent  = "";
    document.querySelectorAll(".pw-rule").forEach((r) => r.classList.remove("ok"));
  }

  // Tabs
  [["tasks","tasksTab"],["calendar","calendarTab"],["dashboard","dashboardTab"]].forEach(([tab,key]) => {
    const btn = qs(`[data-tab="${tab}"]`);
    if (btn) btn.innerHTML = t(key);
  });

  // App UI
  $("search-input").placeholder         = t("searchPlaceholder");
  $("btn-open-modal").textContent       = t("addTask");
  $("filter-category").options[0].text = t("allCategories");
  $("field-title").placeholder         = t("titlePlaceholder");
  $("field-description").placeholder   = t("descPlaceholder");
  $("field-assigned").placeholder      = t("assignPlaceholder");
  const so = t("statusOptions");
  const sf = $("filter-status");
  [t("allStatus"), so.pending, so.in_progress, so.completed].forEach((txt,i) => sf.options[i].text = txt);

  // data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });

  if (tasks.length >= 0) renderAll();
};

// Auth 
const switchAuthMode = () => {
  authMode = authMode === "login" ? "signup" : "login";
  $("auth-error").textContent = "";
  applyTranslations();
};

const submitAuth = async () => {
  const email = $("auth-email").value.trim();
  const pw    = $("auth-password").value;
  const errEl = $("auth-error");
  errEl.textContent = "";
  try {
    if (authMode === "login") {
      await signInWithEmailAndPassword(auth, email, pw);
    } else {
      const name = $("auth-name").value.trim();
      if (!name)                        { errEl.textContent = t("nameRequired");  return; }
      if (checkPassword(pw).score < 4)  { errEl.textContent = t("passwordWeak");  return; }
      const { user } = await createUserWithEmailAndPassword(auth, email, pw);
      await saveUserProfile(user.uid, name, email);
    }
  } catch (err) {
    errEl.textContent = err.message.replace("Firebase: ","").replace(/\(.*\)/,"").trim();
  }
};

const showAuthScreen = () => {
  $("auth-screen").classList.remove("hidden");
  $("app-screen").classList.add("hidden");
  tasks = [];
};

const showAppScreen = async (user) => {
  $("auth-screen").classList.add("hidden");
  $("app-screen").classList.remove("hidden");
  userProfile = await fetchUserProfile(user.uid);
  const name = userProfile?.displayName || user.email;
  $("user-display").textContent = name;
  $("user-avatar").textContent  = name.charAt(0).toUpperCase();
  loadTasks(user.uid);
};

//  Toast 
const showToast = (msg, type = "info") => {
  $("toast")?.remove();
  const el = Object.assign(document.createElement("div"), { id: "toast", textContent: msg });
  Object.assign(el.style, {
    position:"fixed", bottom:"24px", left:"50%", transform:"translateX(-50%)",
    background: { info:"#7c6af7", success:"#34d399", error:"#f87171" }[type],
    color:"#fff", padding:"10px 20px", borderRadius:"20px", fontSize:"14px",
    fontWeight:"600", boxShadow:"0 4px 20px rgba(0,0,0,0.3)", zIndex:"999", transition:"opacity 0.3s",
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 3000);
};

//  Render
const today = () => new Date().toISOString().split("T")[0];

const renderAll = () => { renderStats(); renderTaskList(); renderDashboard(); };

const renderStats = () => {
  const counts = { pending:0, in_progress:0, completed:0 };
  tasks.forEach(({ status }) => counts[status]++);
  const so = t("statusOptions");
  $("stats-row").innerHTML = Object.entries(counts).map(([s,n]) =>
    `<div class="stat-chip ${s}"><span class="status-dot"></span>${so[s]}: <strong>${n}</strong></div>`
  ).join("");
};

const getFilteredTasks = () => {
  const search = $("search-input").value.toLowerCase();
  const status = $("filter-status").value;
  const cat    = $("filter-category").value;
  return tasks.filter((task) =>
    (status==="all"||task.status===status) && (cat==="all"||task.category===cat) &&
    task.title.toLowerCase().includes(search)
  );
};

const renderTaskList = () => {
  const listEl   = $("task-list");
  const filtered = getFilteredTasks();
  if (!filtered.length) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-note-sticky"></i></div><p>${t("noTasksFound")}</p></div>`;
    return;
  }
  const td = today();
  const so = t("statusOptions");
  listEl.innerHTML = filtered.map((task) => {
    const isOverdue = task.dueDate && task.dueDate < td && task.status !== "completed";
    const isDone    = task.status === "completed";
    return `
    <div class="task-card">
      <button class="tick-btn ${isDone?"ticked":""}" onclick="handleToggleComplete('${task.id}',${isDone})"><i class="fa-solid fa-check"></i></button>
      <div class="task-body">
        <div class="badge-row">
          <span class="badge ${task.status}">${so[task.status]}</span>
          <span class="badge category"><i class="fa-solid fa-tag"></i> ${t("categories")[task.category] || task.category}</span>
        </div>
        <div class="task-title ${isDone?"done":""}">${task.title}</div>
        ${task.description ? `<div class="task-description">${task.description}</div>` : ""}
        ${task.dueDate ? `<div class="task-due-date ${isOverdue?"overdue":""}">
          <i class="fa-solid fa-calendar"></i> ${task.dueDate}${task.dueTime?` · <i class="fa-solid fa-clock"></i> ${task.dueTime}`:""}${isOverdue?" · "+t("overdue"):""}
        </div>` : ""}
        ${task.assigned?.length ? `<div class="task-assigned"><i class="fa-solid fa-user"></i> ${task.assigned.map((n)=>`<span class="assigned-chip">${n.trim()}</span>`).join("")}</div>` : ""}
      </div>
      <div class="task-actions">
        <select class="status-select" onchange="handleStatusChange('${task.id}',this.value)">
          ${["pending","in_progress","completed"].map((s)=>`<option value="${s}"${task.status===s?" selected":""}>${so[s]}</option>`).join("")}
        </select>
        <div class="action-btn-row">
          <button class="action-btn edit"   onclick="handleEditTask('${task.id}')"><i class="fa-solid fa-pen"></i></button>
          ${task.assigned?.length?`<button class="action-btn notify" onclick="handleNotifyEmail('${task.id}')"><i class="fa-solid fa-envelope"></i></button>`:""}
          <button class="action-btn delete" onclick="handleDeleteTask('${task.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>`;
  }).join("");
};

const renderDashboard = () => {
  const total  = tasks.length;
  const done   = tasks.filter((t) => t.status==="completed").length;
  const inProg = tasks.filter((t) => t.status==="in_progress").length;
  const rate   = total ? Math.round((done/total)*100) : 0;
  const cats   = t("categories");

  $("dash-stat-grid").innerHTML = [
    { label:t("totalTasks"),     value:total,     color:"#7c6af7" },
    { label:t("completed"),      value:done,      color:"#34d399" },
    { label:t("inProgress"),     value:inProg,    color:"#60a5fa" },
    { label:t("completionRate"), value:`${rate}%`,color:"#fbbf24" },
  ].map((s)=>`<div class="dash-stat-box" style="border-top-color:${s.color}"><div class="dash-stat-value" style="color:${s.color}">${s.value}</div><div class="dash-stat-label">${s.label}</div></div>`).join("");

  $("dash-category-bars").innerHTML = CATEGORIES.map((cat)=>{
    const count   = tasks.filter((t)=>t.category===cat).length;
    const percent = total ? (count/total)*100 : 0;
    return `<div class="bar-row"><span class="bar-label">${cats[cat]||cat}</span><div class="bar-track"><div class="bar-fill" style="width:${percent}%"></div></div><span class="bar-count">${count}</span></div>`;
  }).join("");

  const overdue = tasks.filter((t)=>t.dueDate && t.dueDate<today() && t.status!=="completed");
  $("dash-overdue-section").innerHTML = overdue.length
    ? `<div class="overdue-box"><h3>${t("overdueTasks")} (${overdue.length})</h3>${overdue.map((t)=>`<div class="overdue-item"><strong>${t.title}</strong> — <span class="overdue-date">${t.dueDate}</span></div>`).join("")}</div>`
    : "";
};

// Modal 
const openModal = (task = null) => {
  editId = task?.id || null;
  $("modal-title").textContent    = task ? t("editTask") : t("newTask");
  $("modal-save-btn").textContent = task ? t("saveChanges") : t("addTask");
  $("field-title").value       = task?.title       || "";
  $("field-description").value = task?.description || "";
  $("field-category").value    = task?.category    || "Work";
  $("field-status").value      = task?.status      || "pending";
  $("field-due-date").value    = task?.dueDate     || "";
  $("field-due-time").value    = task?.dueTime     || "";
  $("field-assigned").value    = task?.assigned?.join(", ") || "";
  $("modal-overlay").classList.remove("hidden");
};
const closeModal = () => { $("modal-overlay").classList.add("hidden"); editId = null; };

// Calendar 
const renderCalendar  = () => calView === "month" ? renderMonthView() : renderWeekView();

const renderMonthView = () => {
  const year  = calDate.getFullYear();
  const month = calDate.getMonth();
  const td    = today();
  $("cal-title").textContent = `${MONTHS[month]} ${year}`;

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const prevDays    = new Date(year, month, 0).getDate();

  const cells = [
    ...Array.from({length:firstDay}, (_,i) => ({ date:null, day:prevDays-firstDay+1+i, other:true })),
    ...Array.from({length:daysInMonth}, (_,i) => {
      const d = i+1;
      return { date:`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`, day:d, other:false };
    }),
  ];
  let next = 1;
  while (cells.length%7!==0) cells.push({ date:null, day:next++, other:true });

  $("cal-grid").innerHTML = `<div class="cal-month-grid">
    <div class="cal-weekday-row">${WEEKDAYS.map((d)=>`<div class="cal-weekday">${d}</div>`).join("")}</div>
    <div class="cal-days-grid">${cells.map(({date,day,other})=>{
      const dayTasks = date ? tasks.filter((t)=>t.dueDate===date) : [];
      const shown = dayTasks.slice(0,3);
      return `<div class="cal-day ${other?"other-month":""}" onclick="${date?`calShowPopup('${date}')`:""}">
        <div class="cal-day-num ${date===td?"today":""}">${day}</div>
        ${shown.map((t)=>`<div class="cal-task-dot ${t.status}">${t.title}</div>`).join("")}
        ${dayTasks.length>3?`<div class="cal-more">+${dayTasks.length-3} more</div>`:""}
      </div>`;
    }).join("")}</div>
  </div>`;
};

const renderWeekView = () => {
  const td = today();
  const startOfWeek = new Date(calDate);
  startOfWeek.setDate(calDate.getDate()-calDate.getDay());
  const days = Array.from({length:7}, (_,i) => { const d=new Date(startOfWeek); d.setDate(startOfWeek.getDate()+i); return d; });

  $("cal-title").textContent = `${MONTHS[days[0].getMonth()]} ${days[0].getDate()} – ${MONTHS[days[6].getMonth()]} ${days[6].getDate()}, ${days[6].getFullYear()}`;
  $("cal-grid").innerHTML = `<div class="cal-week-grid">${days.map((d)=>{
    const dateStr  = d.toISOString().split("T")[0];
    const dayTasks = tasks.filter((t)=>t.dueDate===dateStr);
    return `<div class="cal-week-col" onclick="calShowPopup('${dateStr}')">
      <div class="cal-week-col-header">
        <div class="cal-week-col-day">${WEEKDAYS[d.getDay()]}</div>
        <div class="cal-week-col-num ${dateStr===td?"today":""}">${d.getDate()}</div>
      </div>
      <div class="cal-week-col-tasks">${dayTasks.map((t)=>`<div class="cal-task-dot ${t.status}">${t.title}</div>`).join("")}</div>
    </div>`;
  }).join("")}</div>`;
};

window.calShowPopup = (dateStr) => {
  const so = t("statusOptions");
  $("cal-popup-date").textContent = dateStr;
  $("cal-popup-tasks").innerHTML  = tasks.filter((t)=>t.dueDate===dateStr).map((task)=>
    `<div class="cal-popup-task ${task.status}">
      <span style="flex:1;font-weight:600">${task.title}</span>
      <span style="font-size:11px;color:var(--text2)">${so[task.status]}</span>
      ${task.dueTime?`<span style="font-size:11px;color:var(--text3)">⏰ ${task.dueTime}</span>`:""}
    </div>`
  ).join("") || `<div class="cal-popup-empty">No tasks this day</div>`;
  $("cal-popup").classList.remove("hidden");
};

// Window handlers 
window.handleToggleComplete = async (id, isDone) => {
  const newStatus = isDone ? "pending" : "completed";
  await updateTask(id, { status:newStatus });
  tasks = tasks.map((t) => t.id===id ? {...t, status:newStatus} : t);
  renderAll();
};
window.handleStatusChange = async (id, status) => {
  await updateTask(id, { status });
  tasks = tasks.map((t) => t.id===id ? {...t, status} : t);
  renderAll();
  notifyAssigned(tasks.find((t)=>t.id===id), "notifyStatus");
};
window.handleNotifyEmail = (id) => notifyAssigned(tasks.find((t)=>t.id===id), "notifyAssign");
window.handleEditTask    = (id) => openModal(tasks.find((t)=>t.id===id));
window.handleDeleteTask  = async (id) => {
  if (!confirm(t("deleteConfirm"))) return;
  await removeTask(id);
  loadTasks(auth.currentUser.uid);
};

// Event Listeners 
$("auth-submit-btn").addEventListener("click", submitAuth);
$("auth-mode-toggle").addEventListener("click", switchAuthMode);
$("btn-logout").addEventListener("click", () => signOut(auth));
[$("auth-email"), $("auth-password")].forEach((el) => el.addEventListener("keydown", (e) => e.key==="Enter" && submitAuth()));

document.querySelectorAll(".tab-btn").forEach((btn) => btn.addEventListener("click", () => {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const tab = btn.dataset.tab;
  ["tasks","dashboard","calendar"].forEach((name) => $(`tab-${name}`).classList.toggle("hidden", tab!==name));
  if (tab==="calendar")  renderCalendar();
  if (tab==="dashboard") renderDashboard();
}));

[$("search-input"),$("filter-status"),$("filter-category")].forEach((el) =>
  el.addEventListener(el.tagName==="INPUT"?"input":"change", renderTaskList)
);

$("cal-prev").addEventListener("click", () => { calView==="month" ? calDate.setMonth(calDate.getMonth()-1) : calDate.setDate(calDate.getDate()-7); renderCalendar(); });
$("cal-next").addEventListener("click", () => { calView==="month" ? calDate.setMonth(calDate.getMonth()+1) : calDate.setDate(calDate.getDate()+7); renderCalendar(); });

["month","week"].forEach((v) => $(`btn-${v}-view`).addEventListener("click", () => {
  calView = v;
  $("btn-month-view").classList.toggle("active", v==="month");
  $("btn-week-view").classList.toggle("active",  v==="week");
  renderCalendar();
}));

$("cal-popup-close").addEventListener("click", () => $("cal-popup").classList.add("hidden"));
document.addEventListener("click", (e) => {
  const popup = $("cal-popup");
  if (!popup.classList.contains("hidden") && !popup.contains(e.target) &&
      !e.target.closest(".cal-day") && !e.target.closest(".cal-week-col"))
    popup.classList.add("hidden");
});

$("btn-open-modal").addEventListener("click",  () => openModal());
[$("modal-close-btn"),$("modal-cancel-btn")].forEach((b) => b.addEventListener("click", closeModal));
$("modal-overlay").addEventListener("click", (e) => e.target.id==="modal-overlay" && closeModal());

$("modal-save-btn").addEventListener("click", async () => {
  const title = $("field-title").value.trim();
  if (!title) { alert(t("titleRequired")); return; }
  const uid = auth.currentUser.uid;
  const taskData = {
    uid, title,
    description: $("field-description").value.trim(),
    category:    $("field-category").value,
    status:      $("field-status").value,
    dueDate:     $("field-due-date").value,
    dueTime:     $("field-due-time").value,
    assigned:    $("field-assigned").value.split(",").map((s)=>s.trim()).filter(Boolean),
    createdAt:   editId ? tasks.find((t)=>t.id===editId)?.createdAt ?? Date.now() : Date.now(),
  };
  editId ? await updateTask(editId, taskData) : await createTask(taskData);
  closeModal();
  loadTasks(uid);
});

document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => switchLanguage(b.dataset.lang)));
[$("btn-theme"),$("auth-btn-theme")].forEach((b) => b?.addEventListener("click", () => switchTheme(theme==="dark"?"light":"dark")));

// Init 
switchTheme(theme);
switchLanguage(lang);
onAuthStateChanged(auth, (user) => user ? showAppScreen(user) : showAuthScreen());