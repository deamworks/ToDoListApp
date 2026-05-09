import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc, query, where, orderBy }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// Config
const firebaseConfig = {
  apiKey:            "AIzaSyCtwi-GyB2NU7y_ouvpnzdSJDzbTmzAhe4",
  authDomain:        "todolistapp-e75da.firebaseapp.com",
  projectId:         "todolistapp-e75da",
  storageBucket:     "todolistapp-e75da.firebasestorage.app",
  messagingSenderId: "210304176272",
  appId:             "1:210304176272:web:367acb7188bcda870c0815",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth        = getAuth(firebaseApp);
const db          = getFirestore(firebaseApp);

// EmailJS 
const EMAILJS_SERVICE_ID  = "service_j2nsi9q";
const EMAILJS_TEMPLATE_ID = "template_9lau9oj";
const EMAILJS_PUBLIC_KEY  = "LXu2-8id6SJ_ESIe-";


// Constants & Translations

const CATEGORIES = ["Work", "Personal", "Study", "Health", "Other"];

const TRANSLATIONS = {
  en: {
    appName: "TaskFlow",
    welcomeBack: "Welcome back!", createAccount: "Create your account",
    emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••",
    signIn: "Sign In", signUp: "Sign Up",
    noAccount: "Don't have an account?", haveAccount: "Already have an account?",
    displayNameLabel: "Display Name", displayNamePlaceholder: "Your name",
    tasksTab: '<i class="fa-solid fa-clipboard-list"></i> Tasks',
    dashboardTab: '<i class="fa-solid fa-chart-bar"></i> Dashboard',
    pending: "Pending", inProgress: "In Progress", completed: "Completed",
    searchPlaceholder: "Search tasks...", allStatus: "All Status",
    allCategories: "All Categories", addTask: "+ Add Task",
    overdue: "Overdue", assignedTo: '<i class="fa-solid fa-user"></i>', noTasksFound: "No tasks found",
    newTask: "New Task", editTask: "Edit Task",
    titleLabel: "Title *", titlePlaceholder: "Task title",
    descLabel: "Description", descPlaceholder: "Optional description",
    categoryLabel: "Category", statusLabel: "Status",
    dueDateLabel: "Due Date", dueTimeLabel: "Due Time",
    assignLabel: "Assign To", assignHint: "(comma separated)",
    assignPlaceholder: "e.g. Alice, Bob or a@email.com",
    cancel: "Cancel", saveChanges: "Save Changes",
    deleteConfirm: "Delete this task?",
    titleRequired: "Please enter a task title!",
    nameRequired: "Please enter your display name!",
    sendEmail: 'Notify', emailSending: "Sending...",
    emailSuccess: "Email sent successfully!",
    emailFail: "Failed to send email. Please try again.",
    emailNoAssigned: "No assigned email addresses found.",
    notifyAssign: "Task Assigned", notifyStatus: "Status Updated",
    totalTasks: "Total Tasks", completionRate: "Completion %",
    tasksByCategory: "Tasks by Category", overdueTasks: '<i class="fa-solid fa-triangle-exclamation"></i> Overdue Tasks',
    statusOptions: { pending: "Pending", in_progress: "In Progress", completed: "Completed" },
  },
  th: {
    appName: "TaskFlow",
    welcomeBack: "ยินดีต้อนรับกลับ!", createAccount: "สร้างบัญชีใหม่",
    emailPlaceholder: "อีเมลของคุณ", passwordPlaceholder: "รหัสผ่าน",
    signIn: "เข้าสู่ระบบ", signUp: "สมัครสมาชิก",
    noAccount: "ยังไม่มีบัญชี?", haveAccount: "มีบัญชีอยู่แล้ว?",
    displayNameLabel: "ชื่อที่แสดง", displayNamePlaceholder: "ชื่อของคุณ",
    tasksTab: '<i class="fa-solid fa-clipboard-list"></i> งาน', dashboardTab: '<i class="fa-solid fa-chart-bar"></i> ภาพรวม',
    pending: "รอดำเนินการ", inProgress: "กำลังทำ", completed: "เสร็จแล้ว",
    searchPlaceholder: "ค้นหางาน...", allStatus: "ทุกสถานะ",
    allCategories: "ทุกหมวดหมู่", addTask: "+ เพิ่มงาน",
    overdue: "เลยกำหนด", assignedTo: '<i class="fa-solid fa-user"></i>', noTasksFound: "ไม่พบงาน",
    newTask: "งานใหม่", editTask: "แก้ไขงาน",
    titleLabel: "ชื่องาน *", titlePlaceholder: "ชื่องาน",
    descLabel: "รายละเอียด", descPlaceholder: "รายละเอียดเพิ่มเติม (ไม่บังคับ)",
    categoryLabel: "หมวดหมู่", statusLabel: "สถานะ",
    dueDateLabel: "วันที่ครบกำหนด", dueTimeLabel: "เวลาครบกำหนด",
    assignLabel: "มอบหมายให้", assignHint: "(คั่นด้วยจุลภาค)",
    assignPlaceholder: "เช่น สมชาย, สมหญิง หรืออีเมล",
    cancel: "ยกเลิก", saveChanges: "บันทึกการเปลี่ยนแปลง",
    deleteConfirm: "ต้องการลบงานนี้ใช่ไหม?",
    titleRequired: "กรุณาใส่ชื่องาน!",
    nameRequired: "กรุณาใส่ชื่อของคุณ!",
    sendEmail: 'แจ้งเตือน', emailSending: "กำลังส่ง...",
    emailSuccess: "ส่งอีเมลสำเร็จ!",
    emailFail: "ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่",
    emailNoAssigned: "ไม่พบอีเมลของผู้รับ",
    notifyAssign: "มีการมอบหมายงานให้คุณ", notifyStatus: "สถานะงานอัปเดตแล้ว",
    totalTasks: "งานทั้งหมด", completionRate: "อัตราความสำเร็จ",
    tasksByCategory: "งานแยกตามหมวดหมู่", overdueTasks: '<i class="fa-solid fa-triangle-exclamation"></i> งานที่เลยกำหนด',
    statusOptions: { pending: "รอดำเนินการ", in_progress: "กำลังทำ", completed: "เสร็จแล้ว" },
  },
};


// State 

let tasks       = [];
let editId      = null;
let authMode    = "login";
let lang        = localStorage.getItem("taskflow-lang")  || "en";
let theme       = localStorage.getItem("taskflow-theme") || "dark";
let userProfile = null;

function t(key) {
  return TRANSLATIONS[lang][key] ?? key;
}


//Firebase Functions 

async function loadTasks(uid) {
  const q    = query(collection(db, "tasks"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderAll();
}

async function createTask(data)     { await addDoc(collection(db, "tasks"), data); }
async function updateTask(id, data) { await updateDoc(doc(db, "tasks", id), data); }
async function removeTask(id)       { await deleteDoc(doc(db, "tasks", id)); }

async function saveUserProfile(uid, displayName, email) {
  await setDoc(doc(db, "users", uid), { displayName, email });
}

async function fetchUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ส่งอีเมลผ่าน EmailJS REST API — templateParams ต้องตรงกับ template ใน EmailJS dashboard
async function sendEmailViaEmailJS(task, subject, toEmail) {
  const senderName = userProfile?.displayName || auth.currentUser?.email || "TaskFlow";
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: toEmail, to_name: toEmail, from_name: senderName, subject,
        task_title:  task.title,
        task_status: task.status.replace("_", " "),
        task_cat:    task.category,
        task_desc:   task.description || "-",
        task_due:    task.dueDate ? `${task.dueDate}${task.dueTime ? " " + task.dueTime : ""}` : "-",
        assigned:    task.assigned?.join(", ") || "-",
        app_url:     window.location.href,
      },
    }),
  });
  if (!res.ok) throw new Error("EmailJS error: " + res.status);
}


//UI Functions 

function switchTheme(newTheme) {
  theme = newTheme;
  localStorage.setItem("taskflow-theme", theme);
  document.documentElement.classList.toggle("light", theme === "light");
  const btn = document.getElementById("btn-theme");
  if (btn) btn.innerHTML = theme === "light" ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun" style="color: rgb(152, 150, 176);"></i>';
}

function switchLanguage(newLang) {
  lang = newLang;
  localStorage.setItem("taskflow-lang", lang);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  applyTranslations();
}

function applyTranslations() {
  const isLogin = authMode === "login";

  document.getElementById("auth-subtitle").textContent   = isLogin ? t("welcomeBack") : t("createAccount");
  document.getElementById("auth-email").placeholder      = t("emailPlaceholder");
  document.getElementById("auth-password").placeholder   = t("passwordPlaceholder");
  document.getElementById("auth-submit-btn").textContent = isLogin ? t("signIn") : t("signUp");
  document.querySelector(".auth-switch").innerHTML = isLogin
    ? `${t("noAccount")} <span id="auth-mode-toggle">${t("signUp")}</span>`
    : `${t("haveAccount")} <span id="auth-mode-toggle">${t("signIn")}</span>`;
  document.getElementById("auth-mode-toggle").addEventListener("click", switchAuthMode);

  document.getElementById("auth-name-field").classList.toggle("hidden", isLogin);
  document.getElementById("auth-name-label").textContent = t("displayNameLabel");
  document.getElementById("auth-name").placeholder       = t("displayNamePlaceholder");

  document.querySelector('[data-tab="tasks"]').innerHTML     = t("tasksTab");
  document.querySelector('[data-tab="dashboard"]').innerHTML = t("dashboardTab");

  document.getElementById("search-input").placeholder   = t("searchPlaceholder");
  document.getElementById("btn-open-modal").textContent = t("addTask");

  const statusSel = document.getElementById("filter-status");
  statusSel.options[0].text = t("allStatus");
  statusSel.options[1].text = t("statusOptions").pending;
  statusSel.options[2].text = t("statusOptions").in_progress;
  statusSel.options[3].text = t("statusOptions").completed;

  document.getElementById("filter-category").options[0].text = t("allCategories");
  document.getElementById("field-title").placeholder         = t("titlePlaceholder");
  document.getElementById("field-description").placeholder   = t("descPlaceholder");
  document.getElementById("field-assigned").placeholder      = t("assignPlaceholder");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  if (tasks.length >= 0) renderAll();
}

function switchAuthMode() {
  authMode = authMode === "login" ? "signup" : "login";
  applyTranslations();
  document.getElementById("auth-error").textContent = "";
}

async function submitAuth() {
  const email    = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  const errorEl  = document.getElementById("auth-error");
  errorEl.textContent = "";
  try {
    if (authMode === "login") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const displayName = document.getElementById("auth-name").value.trim();
      if (!displayName) { errorEl.textContent = t("nameRequired"); return; }
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserProfile(user.uid, displayName, email);
    }
  } catch (err) {
    errorEl.textContent = err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim();
  }
}

function showAuthScreen() {
  document.getElementById("auth-screen").classList.remove("hidden");
  document.getElementById("app-screen").classList.add("hidden");
  tasks = [];
}

async function showAppScreen(user) {
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");
  userProfile = await fetchUserProfile(user.uid);
  const name = userProfile?.displayName || user.email;
  document.getElementById("user-display").textContent = name;
  document.getElementById("user-avatar").textContent  = name.charAt(0).toUpperCase();
  loadTasks(user.uid);
}

// Toast แจ้งเตือนเล็กๆ ด้านล่างหน้าจอ
function showToast(message, type = "info") {
  document.getElementById("toast")?.remove();
  const colors = { info: "#7c6af7", success: "#34d399", error: "#f87171" };
  const el = document.createElement("div");
  el.id = "toast";
  el.textContent = message;
  Object.assign(el.style, {
    position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
    background: colors[type], color: "#fff", padding: "10px 20px",
    borderRadius: "20px", fontSize: "14px", fontWeight: "600",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)", zIndex: "999", transition: "opacity 0.3s",
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 3000);
}

function renderAll() {
  renderStats();
  renderTaskList();
}

function renderStats() {
  const counts = { pending: 0, in_progress: 0, completed: 0 };
  tasks.forEach((task) => counts[task.status]++);
  const labels = { pending: t("pending"), in_progress: t("inProgress"), completed: t("completed") };
  document.getElementById("stats-row").innerHTML = Object.entries(counts)
    .map(([status, count]) => `
      <div class="stat-chip ${status}">
        <span class="status-dot"></span>${labels[status]}: <strong>${count}</strong>
      </div>`).join("");
}

function getFilteredTasks() {
  const search   = document.getElementById("search-input").value.toLowerCase();
  const status   = document.getElementById("filter-status").value;
  const category = document.getElementById("filter-category").value;
  return tasks.filter((task) =>
    (status   === "all" || task.status   === status) &&
    (category === "all" || task.category === category) &&
    task.title.toLowerCase().includes(search)
  );
}

function renderTaskList() {
  const listEl   = document.getElementById("task-list");
  const filtered = getFilteredTasks();

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-note-sticky"></i></div><p>${t("noTasksFound")}</p></div>`;
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  listEl.innerHTML = filtered.map((task) => {
    const isOverdue    = task.dueDate && task.dueDate < today && task.status !== "completed";
    const isDone       = task.status === "completed";
    const statusLabels = t("statusOptions");
    return `
    <div class="task-card">
      <div class="task-body">
        <div class="badge-row">
          <span class="badge ${task.status}">${statusLabels[task.status]}</span>
          <span class="badge category"><i class="fa-solid fa-tag"></i> ${task.category}</span>
        </div>
        <div class="task-title ${isDone ? "done" : ""}">${task.title}</div>
        ${task.description ? `<div class="task-description">${task.description}</div>` : ""}
        ${task.dueDate ? `<div class="task-due-date ${isOverdue ? "overdue" : ""}">
          <i class="fa-solid fa-calendar"></i> ${task.dueDate}${task.dueTime ? ` · <i class="fa-solid fa-clock"></i> ` + task.dueTime : ""}${isOverdue ? " · " + t("overdue") : ""}
        </div>` : ""}
        ${task.assigned?.length > 0 ? `<div class="task-assigned">
          ${t("assignedTo")} ${task.assigned.map((n) => `<span class="assigned-chip">${n.trim()}</span>`).join("")}
        </div>` : ""}
      </div>
      <div class="task-actions">
        <select class="status-select" onchange="handleStatusChange('${task.id}', this.value)">
          <option value="pending"     ${task.status === "pending"     ? "selected" : ""}>${statusLabels.pending}</option>
          <option value="in_progress" ${task.status === "in_progress" ? "selected" : ""}>${statusLabels.in_progress}</option>
          <option value="completed"   ${task.status === "completed"   ? "selected" : ""}>${statusLabels.completed}</option>
        </select>
        <button class="action-btn edit"   onclick="handleEditTask('${task.id}')"   title="Edit"><i class="fa-solid fa-pen"></i></button>
        ${task.assigned?.length > 0
          ? `<button class="action-btn notify" onclick="handleNotifyEmail('${task.id}')" title="${t('sendEmail')}"><i class="fa-solid fa-envelope"></i></button>`
          : ""}
        <button class="action-btn delete" onclick="handleDeleteTask('${task.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join("");
}

function openModal(task = null) {
  editId = task ? task.id : null;
  document.getElementById("modal-title").textContent    = task ? t("editTask") : t("newTask");
  document.getElementById("modal-save-btn").textContent = task ? t("saveChanges") : t("addTask");
  document.getElementById("field-title").value          = task?.title       || "";
  document.getElementById("field-description").value    = task?.description || "";
  document.getElementById("field-category").value       = task?.category    || "Work";
  document.getElementById("field-status").value         = task?.status      || "pending";
  document.getElementById("field-due-date").value       = task?.dueDate     || "";
  document.getElementById("field-due-time").value       = task?.dueTime     || "";
  document.getElementById("field-assigned").value       = task?.assigned ? task.assigned.join(", ") : "";
  document.getElementById("modal-overlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  editId = null;
}

function renderDashboard() {
  const total      = tasks.length;
  const completed  = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter((task) => task.status === "in_progress").length;
  const rate       = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById("dash-stat-grid").innerHTML = [
    { label: t("totalTasks"),     value: total,       color: "#7c6af7" },
    { label: t("completed"),      value: completed,   color: "#34d399" },
    { label: t("inProgress"),     value: inProgress,  color: "#60a5fa" },
    { label: t("completionRate"), value: `${rate}%`,  color: "#fbbf24" },
  ].map((s) => `
    <div class="dash-stat-box" style="border-top-color:${s.color}">
      <div class="dash-stat-value" style="color:${s.color}">${s.value}</div>
      <div class="dash-stat-label">${s.label}</div>
    </div>`).join("");

  document.getElementById("dash-category-bars").innerHTML = CATEGORIES.map((cat) => {
    const count   = tasks.filter((task) => task.category === cat).length;
    const percent = total > 0 ? (count / total) * 100 : 0;
    return `
    <div class="bar-row">
      <span class="bar-label">${cat}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${percent}%"></div></div>
      <span class="bar-count">${count}</span>
    </div>`;
  }).join("");

  const today   = new Date().toISOString().split("T")[0];
  const overdue = tasks.filter((task) => task.dueDate && task.dueDate < today && task.status !== "completed");
  document.getElementById("dash-overdue-section").innerHTML = overdue.length
    ? `<div class="overdue-box">
        <h3>${t("overdueTasks")} (${overdue.length})</h3>
        ${overdue.map((task) => `
          <div class="overdue-item">
            <strong>${task.title}</strong> — <span class="overdue-date">${task.dueDate}</span>
          </div>`).join("")}
       </div>`
    : "";
}


//Event Listeners 

document.getElementById("auth-submit-btn").addEventListener("click", submitAuth);
document.getElementById("auth-mode-toggle").addEventListener("click", switchAuthMode);
document.getElementById("btn-logout").addEventListener("click", () => signOut(auth));
document.getElementById("auth-email").addEventListener("keydown",    (e) => { if (e.key === "Enter") submitAuth(); });
document.getElementById("auth-password").addEventListener("keydown", (e) => { if (e.key === "Enter") submitAuth(); });

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.getElementById("tab-tasks").classList.toggle("hidden",     tab !== "tasks");
    document.getElementById("tab-dashboard").classList.toggle("hidden", tab !== "dashboard");
    if (tab === "dashboard") renderDashboard();
  });
});

document.getElementById("search-input").addEventListener("input",     renderTaskList);
document.getElementById("filter-status").addEventListener("change",   renderTaskList);
document.getElementById("filter-category").addEventListener("change", renderTaskList);

document.getElementById("btn-open-modal").addEventListener("click",   () => openModal());
document.getElementById("modal-close-btn").addEventListener("click",  closeModal);
document.getElementById("modal-cancel-btn").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target.id === "modal-overlay") closeModal();
});

document.getElementById("modal-save-btn").addEventListener("click", async () => {
  const title = document.getElementById("field-title").value.trim();
  if (!title) { alert(t("titleRequired")); return; }
  const uid      = auth.currentUser.uid;
  const taskData = {
    uid, title,
    description: document.getElementById("field-description").value.trim(),
    category:    document.getElementById("field-category").value,
    status:      document.getElementById("field-status").value,
    dueDate:     document.getElementById("field-due-date").value,
    dueTime:     document.getElementById("field-due-time").value,
    assigned:    document.getElementById("field-assigned").value
                   .split(",").map((s) => s.trim()).filter((s) => s.length > 0),
    createdAt:   editId ? tasks.find((task) => task.id === editId)?.createdAt ?? Date.now() : Date.now(),
  };
  editId ? await updateTask(editId, taskData) : await createTask(taskData);
  closeModal();
  loadTasks(uid);
});

// handlers ที่เรียกจาก onclick ใน HTML string ต้องผูกไว้ที่ window
window.handleStatusChange = async (id, status) => {
  await updateTask(id, { status });
  tasks = tasks.map((task) => (task.id === id ? { ...task, status } : task));
  renderAll();
  const updated   = tasks.find((task) => task.id === id);
  const emailList = (updated?.assigned || []).filter((a) => a.includes("@"));
  if (emailList.length > 0) {
    showToast(t("emailSending"), "info");
    try {
      await Promise.all(emailList.map((email) => sendEmailViaEmailJS(updated, t("notifyStatus"), email)));
      showToast(t("emailSuccess"), "success");
    } catch { showToast(t("emailFail"), "error"); }
  }
};

window.handleNotifyEmail = async (id) => {
  const task      = tasks.find((task) => task.id === id);
  const emailList = (task?.assigned || []).filter((a) => a.includes("@"));
  if (!emailList.length) { showToast(t("emailNoAssigned"), "error"); return; }
  showToast(t("emailSending"), "info");
  try {
    await Promise.all(emailList.map((email) => sendEmailViaEmailJS(task, t("notifyAssign"), email)));
    showToast(t("emailSuccess"), "success");
  } catch { showToast(t("emailFail"), "error"); }
};

window.handleEditTask   = (id) => openModal(tasks.find((task) => task.id === id));
window.handleDeleteTask = async (id) => {
  if (!confirm(t("deleteConfirm"))) return;
  await removeTask(id);
  loadTasks(auth.currentUser.uid);
};

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchLanguage(btn.dataset.lang));
});

document.getElementById("btn-theme").addEventListener("click", () => {
  switchTheme(theme === "dark" ? "light" : "dark");
});


// Init
switchTheme(theme);
switchLanguage(lang);

onAuthStateChanged(auth, (user) => {
  if (user) showAppScreen(user);
  else      showAuthScreen();
});