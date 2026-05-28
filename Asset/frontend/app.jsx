// const { useState, useEffect, useMemo, useRef } = React;

// // ── Seed data ──────────────────────────────────────────────
// const SEED_USERS = [
//   { id: "u-01", name: "Aarav Mehta",  email: "aarav@nordhaven.co",  dept: "Design",      avatar: "AM", role: "user",  password: "user1" },
//   { id: "u-02", name: "Wei Lin",      email: "wei@nordhaven.co",    dept: "Engineering", avatar: "WL", role: "user",  password: "user2" },
//   { id: "u-03", name: "Maya C.",      email: "maya@nordhaven.co",   dept: "Ops",         avatar: "MC", role: "user",  password: "user3" },
// ];
// const ADMIN_USER = { id: "a-00", name: "Karthik R.", email: "admin@nordhaven.co", dept: "IT Support", avatar: "KR", role: "admin", password: "admin123" };

// const AGENTS = [
//   { id: "a-01", name: "Karthik R.",  avatar: "KR", team: "IT Support" },
//   { id: "a-02", name: "Sneha P.",    avatar: "SP", team: "IT Support" },
//   { id: "a-03", name: "Daniel O.",   avatar: "DO", team: "Assets" },
// ];

// const CATALOG = {
//   it:    [
//     { id: "vpn",   label: "VPN / Network",    sla: "4h",  desc: "Can't connect, slow, drops" },
//     { id: "sw",    label: "Software access",   sla: "1d",  desc: "Figma, Jira, Github seats" },
//     { id: "hw",    label: "Hardware issue",    sla: "4h",  desc: "Laptop, charger, peripherals" },
//     { id: "pw",    label: "Password / SSO",    sla: "1h",  desc: "Locked out, MFA reset" },
//     { id: "mail",  label: "Email / Calendar",  sla: "4h",  desc: "Outlook, distribution lists" },
//     { id: "other", label: "Something else",    sla: "1d",  desc: "Not sure where it fits" },
//   ],
//   asset: [
//     { id: "laptop",  label: "Laptop",            sla: "3d",  desc: "MacBook Pro / ThinkPad" },
//     { id: "monitor", label: "Monitor",            sla: "3d",  desc: "27\" / 32\" external display" },
//     { id: "kbm",     label: "Keyboard & mouse",   sla: "2d",  desc: "Standard or ergonomic" },
//     { id: "head",    label: "Headset",            sla: "2d",  desc: "Wired or wireless" },
//     { id: "dock",    label: "Dock / adapter",     sla: "2d",  desc: "USB-C hubs, dongles" },
//     { id: "phone",   label: "Phone / SIM",        sla: "5d",  desc: "Work mobile, eSIM" },
//   ],
// };

// // Auto-raise templates — fired by live engine
// const AUTO_TEMPLATES = [
//   { kind:"it",    cat:"hw",      title:"Laptop won't charge — battery 0%",          priority:"Urgent", userId:"u-02", body:"Laptop dead, external power not working." },
//   { kind:"it",    cat:"mail",    title:"Distribution list eng-leads needs update",   priority:"Normal", userId:"u-01", body:"Need to add 3 new members to eng-leads DL." },
//   { kind:"asset", cat:"laptop",  title:"MacBook Pro 16\" for new hire",              priority:"Normal", userId:"u-03", body:"New hire starting 06/15 needs a laptop." },
//   { kind:"it",    cat:"vpn",     title:"Slow VPN — Mumbai office",                   priority:"High",   userId:"u-02", body:"VPN dropping for entire Mumbai team." },
//   { kind:"asset", cat:"kbm",     title:"Ergonomic keyboard — wrist pain",            priority:"High",   userId:"u-01", body:"Experiencing wrist pain, need ergonomic keyboard." },
//   { kind:"it",    cat:"sw",      title:"Adobe CC license for video team",            priority:"Normal", userId:"u-03", body:"Video team needs Adobe CC seats." },
//   { kind:"it",    cat:"hw",      title:"MacBook screen flickering",                  priority:"High",   userId:"u-02", body:"Screen flickers since this morning." },
//   { kind:"asset", cat:"dock",    title:"USB-C hub for standing desk",                priority:"Normal", userId:"u-01", body:"Need USB-C hub for new standing desk setup." },
// ];

// // ── Helpers ────────────────────────────────────────────────
// const catLabel = (kind, cat) => (CATALOG[kind]?.find(c => c.id === cat) || {}).label || cat;
// let ticketCounter = 2041;
// const newId = (kind) => (kind === "it" ? "INC-" : "REQ-") + (ticketCounter++);
// const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// const statusColor = (s) => ({
//   "New":              { bg:"#fef3c7", fg:"#92400e", dot:"#f59e0b" },
//   "Triaging":         { bg:"#fef3c7", fg:"#92400e", dot:"#f59e0b" },
//   "In progress":      { bg:"#dbeafe", fg:"#1e40af", dot:"#3b82f6" },
//   "Waiting on you":   { bg:"#fee2e2", fg:"#991b1b", dot:"#ef4444" },
//   "Pending approval": { bg:"#ede9fe", fg:"#5b21b6", dot:"#7c3aed" },
//   "Approved":         { bg:"#d1fae5", fg:"#065f46", dot:"#10b981" },
//   "Delivered":        { bg:"#d1fae5", fg:"#065f46", dot:"#10b981" },
//   "Resolved":         { bg:"#f3f4f6", fg:"#4b5563", dot:"#9ca3af" },
// }[s] || { bg:"#f3f4f6", fg:"#4b5563", dot:"#9ca3af" });

// const prioColor = (p) => ({ "Urgent":"#dc2626","High":"#d97706","Normal":"#6b7280","Low":"#9ca3af" }[p]);

// // ── Icons ──────────────────────────────────────────────────
// const I = {
//   search:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
//   plus:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
//   arrow:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
//   back:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>,
//   check:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 12 5 5L20 7"/></svg>,
//   send:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 12 16-7-7 16-2-7-7-2Z"/></svg>,
//   inbox:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"/></svg>,
//   bolt:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>,
//   dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="8" height="10" rx="1"/><rect x="13" y="3" width="8" height="6" rx="1"/><rect x="13" y="11" width="8" height="10" rx="1"/><rect x="3" y="15" width="8" height="6" rx="1"/></svg>,
//   bell:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0"/></svg>,
//   x:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18"/></svg>,
//   box:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>,
//   users:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87"/></svg>,
//   logout:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
//   pulse:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l3-7 4 14 3-7h6"/></svg>,
//   eye:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
//   eyeoff:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>,
//   paperclip: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 11-9 9a5 5 0 1 1-7-7l9-9a3.5 3.5 0 1 1 5 5l-9 9a2 2 0 1 1-3-3l8-8"/></svg>,
// };

// // ── App ────────────────────────────────────────────────────
// function App() {
//   const [session, setSession]   = useState(null); // null = logged out
//   const [users, setUsers]       = useState([...SEED_USERS]);
//   const [tickets, setTickets]   = useState([]);
//   const [view, setView]         = useState("home");
//   const [activeId, setActiveId] = useState(null);
//   const [toast, setToast]       = useState(null);
//   const [liveCount, setLiveCount] = useState(0);
//   const autoIdx = useRef(0);
//   const timerRef = useRef(null);

//   const isAdmin = session?.role === "admin";

//   // ── Live auto-raise engine ─────────────────────────────
//   useEffect(() => {
//     if (!session) return;
//     const fire = () => {
//       const tpl = AUTO_TEMPLATES[autoIdx.current % AUTO_TEMPLATES.length];
//       autoIdx.current++;
//       const requester = [...users, ADMIN_USER].find(u => u.id === tpl.userId) || users[0];
//       const ticket = {
//         id: newId(tpl.kind), kind: tpl.kind, cat: tpl.cat,
//         title: tpl.title, priority: tpl.priority,
//         status: tpl.kind === "asset" ? "Pending approval" : "New",
//         agent: null, created: now(), updated: now(),
//         requester, body: tpl.body, thread: [], autoRaised: true,
//       };
//       setTickets(prev => [ticket, ...prev]);
//       setLiveCount(c => c + 1);
//       showToast(`🤖 Auto-raised: ${ticket.id} — ${ticket.title.slice(0,38)}`);
//       timerRef.current = setTimeout(fire, 18000 + Math.random() * 12000);
//     };
//     timerRef.current = setTimeout(fire, 8000);
//     return () => clearTimeout(timerRef.current);
//   }, [session]);

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 3200);
//   };

//   const login = (email, password) => {
//     const all = [ADMIN_USER, ...users];
//     const u = all.find(u => u.email === email && u.password === password);
//     if (!u) return "Invalid email or password.";
//     setSession(u); setView("home"); setTickets([]); setLiveCount(0); autoIdx.current = 0;
//     return null;
//   };

//   const logout = () => {
//     setSession(null); setView("home");
//     clearTimeout(timerRef.current);
//   };

//   const addUser = (u) => {
//     setUsers(prev => [...prev, { ...u, id: "u-" + Date.now(), role: "user" }]);
//     showToast(`User ${u.name} created`);
//   };

//   const deleteUser = (id) => {
//     setUsers(prev => prev.filter(u => u.id !== id));
//     showToast("User removed");
//   };

//   const submitTicket = (payload) => {
//     const id = newId(payload.kind);
//     const ticket = {
//       id, ...payload,
//       status: payload.kind === "asset" ? "Pending approval" : "New",
//       agent: null, created: now(), updated: now(),
//       requester: session, thread: [], autoRaised: false,
//     };
//     setTickets(prev => [ticket, ...prev]);
//     setActiveId(id); setView("ticket");
//     showToast(`${id} submitted`);
//   };

//   const replyTicket = (id, text) => {
//     setTickets(ts => ts.map(t => t.id !== id ? t : {
//       ...t, updated: now(),
//       status: t.status === "Waiting on you" ? "In progress" : t.status,
//       thread: [...t.thread, { from: "me", who: session.name, at: now(), text }],
//     }));
//   };

//   const assignTicket = (ticketId, agentId) => {
//     setTickets(ts => ts.map(t => t.id !== ticketId ? t : {
//       ...t, agent: agentId,
//       status: t.status === "New" ? "Triaging" : t.status, updated: now(),
//     }));
//     showToast(`Assigned to ${AGENTS.find(a => a.id === agentId)?.name}`);
//   };

//   const updateStatus = (ticketId, status) => {
//     setTickets(ts => ts.map(t => t.id !== ticketId ? t : { ...t, status, updated: now() }));
//     showToast(`Status → ${status}`);
//   };

//   // Role-filtered tickets
//   const myTickets = isAdmin ? tickets : tickets.filter(t => t.requester?.id === session?.id);
//   const active = tickets.find(t => t.id === activeId);

//   if (!session) return <LoginPage onLogin={login} />;

//   return (
//     <div className="app">
//       <TopBar view={view} setView={setView} session={session} isAdmin={isAdmin}
//         onLogout={logout} liveCount={liveCount} />
//       <main className="main">
//         {view === "home" && !isAdmin && (
//           <UserHome tickets={myTickets} session={session}
//             onOpen={id => { setActiveId(id); setView("ticket"); }}
//             onNew={() => setView("new")} />
//         )}
//         {view === "home" && isAdmin && (
//           <AdminQueue tickets={tickets} users={users}
//             onOpen={id => { setActiveId(id); setView("ticket"); }}
//             onAssign={assignTicket} liveCount={liveCount} />
//         )}
//         {view === "users" && isAdmin && (
//           <UserManager users={users} onAdd={addUser} onDelete={deleteUser} />
//         )}
//         {view === "new" && (
//           <NewTicket onCancel={() => setView("home")} onSubmit={submitTicket} />
//         )}
//         {view === "ticket" && active && (
//           <TicketDetail ticket={active} session={session} isAdmin={isAdmin}
//             onBack={() => setView("home")}
//             onReply={t => replyTicket(active.id, t)}
//             onAssign={agentId => assignTicket(active.id, agentId)}
//             onStatus={s => updateStatus(active.id, s)} />
//         )}
//       </main>
//       {toast && <div className="toast"><span className="toast-dot" />{toast}</div>}
//     </div>
//   );
// }

// // ── Login Page ─────────────────────────────────────────────
// function LoginPage({ onLogin }) {
//   const [email, setEmail]     = useState("");
//   const [pass, setPass]       = useState("");
//   const [showP, setShowP]     = useState(false);
//   const [err, setErr]         = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = () => {
//     setLoading(true); setErr("");
//     setTimeout(() => {
//       const e = onLogin(email.trim(), pass);
//       if (e) { setErr(e); setLoading(false); }
//     }, 400);
//   };

//   const quick = (e, p) => { setEmail(e); setPass(p); };

//   return (
//     <div className="login-bg">
//       <div className="login-box">
//         <div className="login-brand">
//           <div className="brand-mark"><span /></div>
//           <div>
//             <div className="brand-name">Helpdesk</div>
//             <div className="brand-org">Nordhaven</div>
//           </div>
//         </div>
//         <h1 className="login-h">Sign in to your account</h1>
//         <p className="login-sub">IT support & asset management portal</p>

//         <div className="form-group">
//           <label className="label">Email</label>
//           <input className="input" type="email" placeholder="you@nordhaven.co"
//             value={email} onChange={e => setEmail(e.target.value)}
//             onKeyDown={e => e.key === "Enter" && submit()} />
//         </div>
//         <div className="form-group">
//           <label className="label">Password</label>
//           <div className="pw-wrap">
//             <input className="input" type={showP ? "text" : "password"} placeholder="••••••••"
//               value={pass} onChange={e => setPass(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && submit()} />
//             <button className="pw-eye" onClick={() => setShowP(s => !s)}>
//               {showP ? I.eyeoff : I.eye}
//             </button>
//           </div>
//         </div>
//         {err && <div className="login-err">{err}</div>}
//         <button className="btn-primary login-btn" onClick={submit} disabled={loading || !email || !pass}>
//           {loading ? "Signing in…" : "Sign in"}
//         </button>

//         <div className="quick-logins">
//           <div className="ql-label">Quick demo logins</div>
//           <div className="ql-grid">
//             <button className="ql-btn ql-admin" onClick={() => quick("admin@nordhaven.co", "admin123")}>
//               <strong>Admin</strong><span>admin@nordhaven.co</span>
//             </button>
//             <button className="ql-btn" onClick={() => quick("aarav@nordhaven.co", "user1")}>
//               <strong>Aarav</strong><span>aarav@nordhaven.co</span>
//             </button>
//             <button className="ql-btn" onClick={() => quick("wei@nordhaven.co", "user2")}>
//               <strong>Wei</strong><span>wei@nordhaven.co</span>
//             </button>
//             <button className="ql-btn" onClick={() => quick("maya@nordhaven.co", "user3")}>
//               <strong>Maya</strong><span>maya@nordhaven.co</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── TopBar ─────────────────────────────────────────────────
// function TopBar({ view, setView, session, isAdmin, onLogout, liveCount }) {
//   const tabs = isAdmin
//     ? [{ id:"home", label:"Queue", icon:I.dashboard }, { id:"users", label:"Users", icon:I.users }]
//     : [{ id:"home", label:"My tickets", icon:I.inbox }, { id:"new", label:"New ticket", icon:I.plus }];

//   return (
//     <header className="topbar">
//       <div className="brand">
//         <div className="brand-mark"><span /></div>
//         <div className="brand-text">
//           <div className="brand-name">Helpdesk</div>
//           <div className="brand-org">Nordhaven</div>
//         </div>
//       </div>
//       <nav className="tabs">
//         {tabs.map(t => (
//           <button key={t.id} className={"tab " + (view === t.id || (view === "ticket" && t.id === "home") ? "tab-active" : "")}
//             onClick={() => setView(t.id)}>
//             <span className="tab-icon">{t.icon}</span>{t.label}
//           </button>
//         ))}
//       </nav>
//       <div className="topbar-right">
//         {liveCount > 0 && (
//           <div className="live-badge"><span className="live-dot" />{liveCount} auto-raised</div>
//         )}
//         {isAdmin && <span className="admin-chip">Admin</span>}
//         <div className="me">
//           <div className={"avatar avatar-me " + (isAdmin ? "avatar-admin" : "")}>{session.avatar}</div>
//           <div className="me-meta">
//             <div className="me-name">{session.name}</div>
//             <div className="me-dept">{session.dept}</div>
//           </div>
//         </div>
//         <button className="icon-btn" onClick={onLogout} title="Sign out">{I.logout}</button>
//       </div>
//     </header>
//   );
// }

// // ── User Home ──────────────────────────────────────────────
// function UserHome({ tickets, session, onOpen, onNew }) {
//   const [filter, setFilter] = useState("all");
//   const [q, setQ] = useState("");

//   const counts = useMemo(() => ({
//     all:     tickets.length,
//     open:    tickets.filter(t => !["Resolved","Delivered"].includes(t.status)).length,
//     waiting: tickets.filter(t => t.status === "Waiting on you").length,
//     closed:  tickets.filter(t => ["Resolved","Delivered"].includes(t.status)).length,
//   }), [tickets]);

//   const filtered = tickets.filter(t => {
//     if (filter === "open"    && ["Resolved","Delivered"].includes(t.status)) return false;
//     if (filter === "waiting" && t.status !== "Waiting on you") return false;
//     if (filter === "closed"  && !["Resolved","Delivered"].includes(t.status)) return false;
//     if (q && !`${t.id} ${t.title}`.toLowerCase().includes(q.toLowerCase())) return false;
//     return true;
//   });

//   return (
//     <div className="page">
//       <section className="hero">
//         <div className="hero-text">
//           <div className="eyebrow">Welcome back, {session.name.split(" ")[0]}</div>
//           <h1 className="h1">What can we help with?</h1>
//           <p className="sub">Raise a ticket for IT support or request an asset.</p>
//         </div>
//         <button className="btn-primary lg" onClick={onNew}><span className="btn-icon">{I.plus}</span>Raise a ticket</button>
//       </section>

//       <div className="quickrow">
//         <QCard kind="it"    title="IT support"      desc="Network, software, hardware, access" icon={I.bolt}  onClick={onNew} />
//         <QCard kind="asset" title="Request an asset" desc="Laptops, monitors, peripherals"      icon={I.box}   onClick={onNew} />
//       </div>

//       <section className="list-section">
//         <div className="list-head">
//           <h2 className="h2">Your tickets <span className="muted small">{filtered.length}/{tickets.length}</span></h2>
//           <div className="list-controls">
//             <div className="search"><span className="search-icon">{I.search}</span>
//               <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" />
//             </div>
//             <div className="segmented">
//               {[["all","All"],["open","Open"],["waiting","Action needed"],["closed","Closed"]].map(([id,lbl]) => (
//                 <button key={id} className={"seg "+(filter===id?"seg-on":"")} onClick={() => setFilter(id)}>
//                   {lbl}<span className="seg-count">{counts[id]}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//         <TicketTable tickets={filtered} onOpen={onOpen} showRequester={false} />
//       </section>
//     </div>
//   );
// }

// function QCard({ kind, title, desc, icon, onClick }) {
//   return (
//     <button className={"quick quick-"+kind} onClick={onClick}>
//       <div className="quick-icon">{icon}</div>
//       <div className="quick-body"><div className="quick-title">{title}</div><div className="quick-desc">{desc}</div></div>
//       <div className="quick-foot"><span className="quick-arrow">{I.arrow}</span></div>
//     </button>
//   );
// }

// // ── Ticket Table (shared) ──────────────────────────────────
// function TicketTable({ tickets, onOpen, showRequester }) {
//   if (!tickets.length) return (
//     <div className="empty"><div className="empty-mark">{I.inbox}</div><div className="empty-text">No tickets found.</div></div>
//   );
//   return (
//     <div className={"tickets " + (showRequester ? "tickets-admin" : "")}>
//       <div className="t-head">
//         <div className="t-c-id">ID</div>
//         <div className="t-c-title">Subject</div>
//         {showRequester && <div className="t-c-cat">Requester</div>}
//         <div className="t-c-prio">Priority</div>
//         <div className="t-c-status">Status</div>
//         <div className="t-c-agent">Agent</div>
//         <div className="t-c-time">Updated</div>
//       </div>
//       {tickets.map(t => {
//         const sc = statusColor(t.status);
//         const agent = AGENTS.find(a => a.id === t.agent);
//         return (
//           <div className="t-row" key={t.id} onClick={() => onOpen(t.id)}>
//             <div className="t-c-id mono">
//               {t.id}
//               {t.autoRaised && <span className="auto-badge">auto</span>}
//             </div>
//             <div className="t-c-title">
//               <div className="t-title-line">{t.title}</div>
//               <div className="t-title-sub muted small">{catLabel(t.kind, t.cat)}</div>
//             </div>
//             {showRequester && (
//               <div className="t-c-cat">
//                 <div className="agent-cell">
//                   <div className="avatar avatar-xs">{t.requester?.avatar}</div>
//                   <div><div className="small">{t.requester?.name}</div><div className="muted xs">{t.requester?.dept}</div></div>
//                 </div>
//               </div>
//             )}
//             <div className="t-c-prio">
//               <span className="prio" style={{color:prioColor(t.priority)}}>
//                 <span className="prio-dot" style={{background:prioColor(t.priority)}} />{t.priority}
//               </span>
//             </div>
//             <div className="t-c-status">
//               <span className="status-pill" style={{background:sc.bg,color:sc.fg}}>
//                 <span className="status-dot" style={{background:sc.dot}} />{t.status}
//               </span>
//             </div>
//             <div className="t-c-agent">
//               {agent
//                 ? <div className="agent-cell"><div className="avatar avatar-xs">{agent.avatar}</div><span className="small">{agent.name.split(" ")[0]}</span></div>
//                 : <span className="muted small">— Unassigned</span>}
//             </div>
//             <div className="t-c-time muted small">{t.updated}</div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ── Admin Queue ────────────────────────────────────────────
// function AdminQueue({ tickets, users, onOpen, onAssign, liveCount }) {
//   const [team, setTeam] = useState("all");
//   const [q, setQ] = useState("");

//   const filtered = tickets.filter(t => {
//     if (team === "it"    && t.kind !== "it")    return false;
//     if (team === "asset" && t.kind !== "asset") return false;
//     if (q && !`${t.id} ${t.title} ${t.requester?.name||""}`.toLowerCase().includes(q.toLowerCase())) return false;
//     return true;
//   });

//   const stats = {
//     open:    tickets.filter(t => !["Resolved","Delivered"].includes(t.status)).length,
//     urgent:  tickets.filter(t => t.priority === "Urgent").length,
//     waiting: tickets.filter(t => t.status === "Waiting on you").length,
//     auto:    tickets.filter(t => t.autoRaised).length,
//   };

//   return (
//     <div className="page">
//       <header className="admin-head">
//         <div>
//           <div className="eyebrow">Admin view {liveCount > 0 && <span className="live-inline"><span className="live-dot-sm" />{liveCount} auto-raised</span>}</div>
//           <h1 className="h1">All Tickets</h1>
//         </div>
//         <div className="admin-head-right">
//           <div className="search search-sm"><span className="search-icon">{I.search}</span>
//             <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" />
//           </div>
//           <div className="segmented">
//             {[["all","All teams"],["it","IT support"],["asset","Assets"]].map(([id,lbl]) => (
//               <button key={id} className={"seg "+(team===id?"seg-on":"")} onClick={()=>setTeam(id)}>{lbl}</button>
//             ))}
//           </div>
//         </div>
//       </header>

//       <div className="stats">
//         <Stat label="Open"        value={stats.open}    hint={`${AGENTS.length} agents`} />
//         <Stat label="Urgent"      value={stats.urgent}  hint="needs triage"      tone="rose" />
//         <Stat label="Awaiting"    value={stats.waiting} hint="from requester"    tone="amber" />
//         <Stat label="Auto-raised" value={stats.auto}    hint="by live engine"    tone="green" />
//       </div>

//       <div className="tickets tickets-admin">
//         <div className="t-head">
//           <div className="t-c-id">ID</div>
//           <div className="t-c-title">Subject</div>
//           <div className="t-c-cat">Requester</div>
//           <div className="t-c-prio">Priority</div>
//           <div className="t-c-status">Status</div>
//           <div className="t-c-agent">Agent</div>
//           <div className="t-c-time">Age</div>
//         </div>
//         {filtered.map(t => {
//           const sc = statusColor(t.status);
//           const agent = AGENTS.find(a => a.id === t.agent);
//           return (
//             <div className="t-row" key={t.id} onClick={() => onOpen(t.id)}>
//               <div className="t-c-id mono">{t.id}{t.autoRaised && <span className="auto-badge">auto</span>}</div>
//               <div className="t-c-title">
//                 <div className="t-title-line">{t.title}</div>
//                 <div className="t-title-sub muted small">{catLabel(t.kind, t.cat)} · {t.kind === "it" ? "IT" : "Assets"}</div>
//               </div>
//               <div className="t-c-cat">
//                 <div className="agent-cell">
//                   <div className="avatar avatar-xs">{t.requester?.avatar}</div>
//                   <div><div className="small">{t.requester?.name}</div><div className="muted xs">{t.requester?.dept}</div></div>
//                 </div>
//               </div>
//               <div className="t-c-prio">
//                 <span className="prio" style={{color:prioColor(t.priority)}}>
//                   <span className="prio-dot" style={{background:prioColor(t.priority)}} />{t.priority}
//                 </span>
//               </div>
//               <div className="t-c-status">
//                 <span className="status-pill" style={{background:sc.bg,color:sc.fg}}>
//                   <span className="status-dot" style={{background:sc.dot}} />{t.status}
//                 </span>
//               </div>
//               <div className="t-c-agent" onClick={e=>e.stopPropagation()}>
//                 {agent
//                   ? <div className="agent-cell"><div className="avatar avatar-xs">{agent.avatar}</div><span className="small">{agent.name.split(" ")[0]}</span></div>
//                   : <select className="assign-select" defaultValue="" onChange={e=>{ if(e.target.value) onAssign(t.id, e.target.value); }}>
//                       <option value="" disabled>+ Assign</option>
//                       {AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
//                     </select>
//                 }
//               </div>
//               <div className="t-c-time muted small">{t.created}</div>
//             </div>
//           );
//         })}
//         {!filtered.length && <div className="empty"><div className="empty-mark">{I.inbox}</div><div className="empty-text">No tickets.</div></div>}
//       </div>
//     </div>
//   );
// }

// function Stat({ label, value, hint, tone }) {
//   return (
//     <div className={"stat "+(tone?"stat-"+tone:"")}>
//       <div className="stat-label">{label}</div>
//       <div className="stat-value">{value}</div>
//       <div className="stat-hint">{hint}</div>
//     </div>
//   );
// }

// // ── User Manager (Admin only) ──────────────────────────────
// function UserManager({ users, onAdd, onDelete }) {
//   const [name, setName]   = useState("");
//   const [email, setEmail] = useState("");
//   const [dept, setDept]   = useState("");
//   const [pass, setPass]   = useState("");
//   const [err, setErr]     = useState("");

//   const submit = () => {
//     if (!name||!email||!dept||!pass) { setErr("All fields required"); return; }
//     if (users.find(u=>u.email===email)) { setErr("Email already exists"); return; }
//     const initials = name.trim().split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
//     onAdd({ name:name.trim(), email:email.trim(), dept:dept.trim(), password:pass, avatar:initials });
//     setName(""); setEmail(""); setDept(""); setPass(""); setErr("");
//   };

//   return (
//     <div className="page">
//       <header style={{marginBottom:24}}>
//         <div className="eyebrow">Admin · User management</div>
//         <h1 className="h1">Users</h1>
//         <p className="sub">Create and manage user accounts. Admin can create, view and delete users.</p>
//       </header>

//       <div className="um-layout">
//         <div className="um-list">
//           <div className="um-list-head"><strong>Active users</strong><span className="muted small">{users.length} accounts</span></div>
//           {users.map(u => (
//             <div className="um-row" key={u.id}>
//               <div className="avatar">{u.avatar}</div>
//               <div className="um-info">
//                 <div className="um-name">{u.name}</div>
//                 <div className="muted small">{u.email} · {u.dept}</div>
//               </div>
//               <div className="um-pass-pill">pw: {u.password}</div>
//               <button className="um-del" onClick={() => onDelete(u.id)} title="Remove user">{I.x}</button>
//             </div>
//           ))}
//         </div>

//         <div className="card">
//           <div className="card-section">
//             <div className="label">Create new user</div>
//           </div>
//           {[
//             ["Full name",   name,  setName,  "text",     "Jane Smith"],
//             ["Work email",  email, setEmail, "email",    "jane@nordhaven.co"],
//             ["Department",  dept,  setDept,  "text",     "Engineering"],
//             ["Password",    pass,  setPass,  "password", "Set initial password"],
//           ].map(([lbl, val, set, type, ph]) => (
//             <div className="card-section" key={lbl}>
//               <div className="label">{lbl}</div>
//               <input className="input" type={type} placeholder={ph} value={val} onChange={e=>set(e.target.value)} />
//             </div>
//           ))}
//           {err && <div style={{margin:"0 22px",color:"#dc2626",fontSize:12}}>{err}</div>}
//           <div className="card-foot">
//             <button className="btn-primary" onClick={submit}>{I.plus} Create user</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── New Ticket ─────────────────────────────────────────────
// function NewTicket({ onCancel, onSubmit }) {
//   const [step, setStep]         = useState(1);
//   const [kind, setKind]         = useState("it");
//   const [cat, setCat]           = useState(null);
//   const [title, setTitle]       = useState("");
//   const [body, setBody]         = useState("");
//   const [priority, setPriority] = useState("Normal");
//   const [impact, setImpact]     = useState("Just me");

//   useEffect(() => { setCat(null); }, [kind]);

//   return (
//     <div className="page page-narrow">
//       <div className="crumbs">
//         <button className="link" onClick={onCancel}>{I.back} Back</button>
//         <span className="muted small">Step {step} of 3</span>
//       </div>
//       <h1 className="h1" style={{marginBottom:6}}>Raise a new ticket</h1>
//       <Stepper step={step} />

//       {step === 1 && (
//         <div className="card">
//           <div className="card-section">
//             <div className="label">Type</div>
//             <div className="kind-grid">
//               {[["it","IT support","Something broken or blocked",I.bolt],["asset","Request an asset","New or replacement hardware",I.box]].map(([id,title,desc,icon]) => (
//                 <button key={id} className={"kind "+(kind===id?"kind-on":"")} onClick={()=>setKind(id)}>
//                   <div className="kind-icon">{icon}</div>
//                   <div className="kind-text"><div className="kind-title">{title}</div><div className="kind-desc">{desc}</div></div>
//                   <div className="kind-check">{kind===id && I.check}</div>
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="card-section">
//             <div className="label">Category</div>
//             <div className="cat-grid">
//               {CATALOG[kind].map(c => (
//                 <button key={c.id} className={"cat "+(cat===c.id?"cat-on":"")} onClick={()=>setCat(c.id)}>
//                   <div className="cat-top"><span className="cat-label">{c.label}</span>{cat===c.id && <span className="cat-check">{I.check}</span>}</div>
//                   <div className="cat-desc">{c.desc}</div>
//                   <div className="cat-sla">SLA · {c.sla}</div>
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="card-foot">
//             <button className="btn-ghost" onClick={onCancel}>Cancel</button>
//             <button className="btn-primary" disabled={!cat} onClick={() => setStep(2)}>Continue {I.arrow}</button>
//           </div>
//         </div>
//       )}

//       {step === 2 && (
//         <div className="card">
//           <div className="card-section">
//             <div className="label">Subject <span className="req">required</span></div>
//             <input className="input" value={title} onChange={e=>setTitle(e.target.value)}
//               placeholder={kind==="it" ? "Briefly describe the issue" : "What asset do you need?"} />
//             <div className="hint">{title.length < 6 ? "At least 6 characters" : "✓ Looks good"}</div>
//           </div>
//           <div className="card-section">
//             <div className="label">Details <span className="req">required</span></div>
//             <textarea className="input textarea" value={body} onChange={e=>setBody(e.target.value)}
//               placeholder="What happened? When? What have you tried?" />
//             <div className="hint">{body.length}/600</div>
//           </div>
//           <div className="row-2">
//             <div className="card-section">
//               <div className="label">Priority</div>
//               <div className="seg-tall">
//                 {["Low","Normal","High","Urgent"].map(p => (
//                   <button key={p} className={"seg-p "+(priority===p?"seg-on":"")} onClick={()=>setPriority(p)}>
//                     <span className="prio-dot" style={{background:prioColor(p)}} />{p}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="card-section">
//               <div className="label">Impact</div>
//               <div className="seg-tall">
//                 {["Just me","My team","Whole office"].map(p => (
//                   <button key={p} className={"seg-p "+(impact===p?"seg-on":"")} onClick={()=>setImpact(p)}>{p}</button>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="card-foot">
//             <button className="btn-ghost" onClick={()=>setStep(1)}>{I.back} Back</button>
//             <button className="btn-primary" disabled={title.length<6||body.length<10} onClick={()=>setStep(3)}>Review {I.arrow}</button>
//           </div>
//         </div>
//       )}

//       {step === 3 && (
//         <div className="card">
//           <div className="card-section">
//             <div className="review-head">
//               <div className="label">Review &amp; submit</div>
//               <div className="route-pill">Routes to · <strong>{kind==="it"?"IT Support":"Assets"}</strong></div>
//             </div>
//           </div>
//           <div className="review-grid">
//             {[["Type",kind==="it"?"IT support":"Asset request"],["Category",catLabel(kind,cat)],["Priority",priority],["Impact",impact]].map(([k,v])=>(
//               <div key={k} className="review-item"><div className="review-k">{k}</div><div className="review-v">{v}</div></div>
//             ))}
//             <div className="review-item review-full"><div className="review-k">Subject</div><div className="review-v">{title}</div></div>
//             <div className="review-item review-full"><div className="review-k">Details</div><div className="review-v review-pre">{body}</div></div>
//           </div>
//           <div className="card-foot">
//             <button className="btn-ghost" onClick={()=>setStep(2)}>{I.back} Edit</button>
//             <button className="btn-primary" onClick={()=>onSubmit({kind,cat,title,body,priority,impact})}>{I.send} Submit ticket</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function Stepper({ step }) {
//   return (
//     <div className="stepper">
//       {["Category","Details","Review"].map((s,i) => (
//         <React.Fragment key={s}>
//           <div className={"step "+(step>i+1?"step-done":step===i+1?"step-on":"")}>
//             <div className="step-bub">{step>i+1?I.check:i+1}</div>
//             <div className="step-label">{s}</div>
//           </div>
//           {i<2 && <div className={"step-line "+(step>i+1?"step-line-done":"")} />}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

// // ── Ticket Detail ──────────────────────────────────────────
// function TicketDetail({ ticket, session, isAdmin, onBack, onReply, onAssign, onStatus }) {
//   const sc = statusColor(ticket.status);
//   const agent = AGENTS.find(a => a.id === ticket.agent);
//   const [reply, setReply] = useState("");

//   const STATUSES = ["New","Triaging","In progress","Waiting on you","Pending approval","Approved","Resolved","Delivered"];

//   const send = () => { if (!reply.trim()) return; onReply(reply.trim()); setReply(""); };

//   return (
//     <div className="page">
//       <button className="link" onClick={onBack}>{I.back} {isAdmin?"Back to queue":"Back to my tickets"}</button>
//       <div className="detail">
//         <div className="detail-main">
//           <div className="detail-head">
//             <div className="detail-id mono">{ticket.id}{ticket.autoRaised && <span className="auto-badge" style={{marginLeft:8}}>auto-raised</span>}</div>
//             <h1 className="detail-title">{ticket.title}</h1>
//             <div className="detail-meta">
//               <span className="status-pill" style={{background:sc.bg,color:sc.fg}}>
//                 <span className="status-dot" style={{background:sc.dot}} />{ticket.status}
//               </span>
//               <span className="prio" style={{color:prioColor(ticket.priority)}}>
//                 <span className="prio-dot" style={{background:prioColor(ticket.priority)}} />{ticket.priority}
//               </span>
//               <span className="muted small">Updated {ticket.updated}</span>
//             </div>
//           </div>

//           <div className="thread">
//             <Msg role="me" who={ticket.requester?.name||"User"} avatar={ticket.requester?.avatar||"??"} at={ticket.created} body={ticket.body||"(no description)"} first />
//             {ticket.thread.map((m,i) => (
//               <Msg key={i} role={m.from} who={m.who}
//                 avatar={m.from==="me" ? ticket.requester?.avatar||"??" : (AGENTS.find(a=>a.name===m.who)||{avatar:m.who.slice(0,2).toUpperCase()}).avatar}
//                 at={m.at} body={m.text} />
//             ))}
//           </div>

//           {!["Resolved","Delivered"].includes(ticket.status) && (
//             <div className="reply">
//               <div className="reply-head">
//                 <div className={"avatar avatar-sm "+(isAdmin?"avatar-admin":"avatar-me")}>{session.avatar}</div>
//                 <div className="reply-who">Reply as <strong>{session.name}</strong>{isAdmin && <span className="agent-badge">Agent</span>}</div>
//               </div>
//               <textarea className="input textarea" value={reply} onChange={e=>setReply(e.target.value)}
//                 placeholder={isAdmin?"Add an agent update…":"Add an update or answer the agent…"} />
//               <div className="reply-foot">
//                 <button className="btn-ghost sm">{I.paperclip} Attach</button>
//                 <button className="btn-primary sm" disabled={!reply.trim()} onClick={send}>{I.send} Send</button>
//               </div>
//             </div>
//           )}
//         </div>

//         <aside className="detail-side">
//           <div className="side-card">
//             <div className="side-title">Details</div>
//             <SideRow k="Type"      v={ticket.kind==="it"?"IT support":"Asset request"} />
//             <SideRow k="Category"  v={catLabel(ticket.kind, ticket.cat)} />
//             <SideRow k="Requester" v={<div className="side-person"><div className="avatar avatar-xs">{ticket.requester?.avatar}</div>{ticket.requester?.name}</div>} />
//             <SideRow k="Assigned"  v={agent?<div className="side-person"><div className="avatar avatar-xs">{agent.avatar}</div>{agent.name}</div>:<span className="muted small">Unassigned</span>} />
//             {isAdmin && !agent && (
//               <div style={{paddingTop:8}}>
//                 <select className="assign-select-lg" defaultValue="" onChange={e=>{ if(e.target.value) onAssign(e.target.value); }}>
//                   <option value="" disabled>Assign to agent…</option>
//                   {AGENTS.map(a=><option key={a.id} value={a.id}>{a.name} — {a.team}</option>)}
//                 </select>
//               </div>
//             )}
//           </div>

//           {isAdmin && (
//             <div className="side-card">
//               <div className="side-title">Change status</div>
//               <div className="status-grid">
//                 {STATUSES.map(s => {
//                   const c = statusColor(s);
//                   return (
//                     <button key={s} className={"status-opt "+(ticket.status===s?"status-opt-on":"")}
//                       style={ticket.status===s?{background:c.bg,color:c.fg,borderColor:c.dot}:{}}
//                       onClick={()=>onStatus(s)}>{s}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           <div className="side-card">
//             <div className="side-title">Activity</div>
//             <ul className="activity">
//               <li><span className="dot" /><span>Created · <span className="muted">{ticket.created}</span></span></li>
//               {agent && <li><span className="dot" /><span>Assigned to {agent.name}</span></li>}
//               <li><span className="dot dot-on" /><span>Status · {ticket.status}</span></li>
//             </ul>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

// function SideRow({ k, v }) {
//   return <div className="side-row"><div className="side-k">{k}</div><div className="side-v">{v}</div></div>;
// }

// function Msg({ role, who, avatar, at, body, first }) {
//   return (
//     <div className={"msg msg-"+role}>
//       <div className={"avatar avatar-sm "+(role==="me"?"avatar-me":"")}>{avatar}</div>
//       <div className="msg-body">
//         <div className="msg-head">
//           <strong className="msg-who">{who}</strong>
//           {first && <span className="msg-tag">Original</span>}
//           <span className="muted small">{at}</span>
//         </div>
//         <div className="msg-text">{body}</div>
//       </div>
//     </div>
//   );
// }

// ReactDOM.createRoot(document.getElementById("root")).render(<App />);
const { useState, useEffect, useMemo } = React;

// ── Seed data ──────────────────────────────────────────────
const SEED_USERS = []; // No default users — admin creates them
const ADMIN_USER = { id: "a-00", name: "Karthik B", email: "admin@asp.co", dept: "IT Support", avatar: "KR", role: "admin", password: "admin123" };

const AGENTS = [
  { id: "a-01", name: "Karthik R.",  avatar: "KR", team: "IT Support" },
  { id: "a-02", name: "Sneha P.",    avatar: "SP", team: "IT Support" },
  { id: "a-03", name: "Daniel O.",   avatar: "DO", team: "Assets" },
];

const CATALOG = {
  it:    [
    { id: "vpn",   label: "VPN / Network",    sla: "4h",  desc: "Can't connect, slow, drops" },
    { id: "sw",    label: "Software access",   sla: "1d",  desc: "Figma, Jira, Github seats" },
    { id: "hw",    label: "Hardware issue",    sla: "4h",  desc: "Laptop, charger, peripherals" },
    { id: "pw",    label: "Password / SSO",    sla: "1h",  desc: "Locked out, MFA reset" },
    { id: "mail",  label: "Email / Calendar",  sla: "4h",  desc: "Outlook, distribution lists" },
    { id: "other", label: "Something else",    sla: "1d",  desc: "Not sure where it fits" },
  ],
  asset: [
    { id: "laptop",  label: "Laptop",            sla: "3d",  desc: "MacBook Pro / ThinkPad" },
    { id: "monitor", label: "Monitor",            sla: "3d",  desc: "27\" / 32\" external display" },
    { id: "kbm",     label: "Keyboard & mouse",   sla: "2d",  desc: "Standard or ergonomic" },
    { id: "head",    label: "Headset",            sla: "2d",  desc: "Wired or wireless" },
    { id: "dock",    label: "Dock / adapter",     sla: "2d",  desc: "USB-C hubs, dongles" },
    { id: "phone",   label: "Phone / SIM",        sla: "5d",  desc: "Work mobile, eSIM" },
  ],
};

// ── Helpers ────────────────────────────────────────────────
const catLabel = (kind, cat) => (CATALOG[kind]?.find(c => c.id === cat) || {}).label || cat;
let ticketCounter = 2041;
const newId = (kind) => (kind === "it" ? "INC-" : "REQ-") + (ticketCounter++);
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const statusColor = (s) => ({
  "New":              { bg:"#fef3c7", fg:"#92400e", dot:"#f59e0b" },
  "Triaging":         { bg:"#fef3c7", fg:"#92400e", dot:"#f59e0b" },
  "In progress":      { bg:"#dbeafe", fg:"#1e40af", dot:"#3b82f6" },
  "Waiting on you":   { bg:"#fee2e2", fg:"#991b1b", dot:"#ef4444" },
  "Pending approval": { bg:"#ede9fe", fg:"#5b21b6", dot:"#7c3aed" },
  "Approved":         { bg:"#d1fae5", fg:"#065f46", dot:"#10b981" },
  "Delivered":        { bg:"#d1fae5", fg:"#065f46", dot:"#10b981" },
  "Resolved":         { bg:"#f3f4f6", fg:"#4b5563", dot:"#9ca3af" },
}[s] || { bg:"#f3f4f6", fg:"#4b5563", dot:"#9ca3af" });

const prioColor = (p) => ({ "Urgent":"#dc2626","High":"#d97706","Normal":"#6b7280","Low":"#9ca3af" }[p]);

// ── Icons ──────────────────────────────────────────────────
const I = {
  search:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  plus:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  arrow:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  back:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>,
  check:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 12 5 5L20 7"/></svg>,
  send:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 12 16-7-7 16-2-7-7-2Z"/></svg>,
  inbox:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"/></svg>,
  bolt:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>,
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="8" height="10" rx="1"/><rect x="13" y="3" width="8" height="6" rx="1"/><rect x="13" y="11" width="8" height="10" rx="1"/><rect x="3" y="15" width="8" height="6" rx="1"/></svg>,
  bell:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0"/></svg>,
  x:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18"/></svg>,
  box:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>,
  users:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87"/></svg>,
  logout:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  pulse:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l3-7 4 14 3-7h6"/></svg>,
  eye:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeoff:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>,
  paperclip: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 11-9 9a5 5 0 1 1-7-7l9-9a3.5 3.5 0 1 1 5 5l-9 9a2 2 0 1 1-3-3l8-8"/></svg>,
};

// ── App ────────────────────────────────────────────────────
function App() {
  const [session, setSession]   = useState(null); // null = logged out
  const [users, setUsers]       = useState([...SEED_USERS]);
  const [tickets, setTickets]   = useState([]);
  const [view, setView]         = useState("home");
  const [activeId, setActiveId] = useState(null);
  const [toast, setToast]       = useState(null);
  const isAdmin = session?.role === "admin";

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const login = (email, password) => {
    const all = [ADMIN_USER, ...users];
    const u = all.find(u => u.email === email && u.password === password);
    if (!u) return "Invalid email or password.";
    setSession(u); setView("home"); setTickets([]);
    return null;
  };

  const logout = () => { setSession(null); setView("home"); };

  const addUser = (u) => {
    setUsers(prev => [...prev, { ...u, id: "u-" + Date.now(), role: "user" }]);
    showToast(`User ${u.name} created`);
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast("User removed");
  };

  const submitTicket = (payload) => {
    const id = newId(payload.kind);
    const ticket = {
      id, ...payload,
      status: payload.kind === "asset" ? "Pending approval" : "New",
      agent: null, created: now(), updated: now(),
      requester: session, thread: [],
    };
    setTickets(prev => [ticket, ...prev]);
    setActiveId(id); setView("ticket");
    showToast(`${id} submitted`);
  };

  const replyTicket = (id, text) => {
    setTickets(ts => ts.map(t => t.id !== id ? t : {
      ...t, updated: now(),
      status: t.status === "Waiting on you" ? "In progress" : t.status,
      thread: [...t.thread, { from: "me", who: session.name, at: now(), text }],
    }));
  };

  const assignTicket = (ticketId, agentId) => {
    setTickets(ts => ts.map(t => t.id !== ticketId ? t : {
      ...t, agent: agentId,
      status: t.status === "New" ? "Triaging" : t.status, updated: now(),
    }));
    showToast(`Assigned to ${AGENTS.find(a => a.id === agentId)?.name}`);
  };

  const updateStatus = (ticketId, status) => {
    setTickets(ts => ts.map(t => t.id !== ticketId ? t : { ...t, status, updated: now() }));
    showToast(`Status → ${status}`);
  };

  // Role-filtered tickets
  const myTickets = isAdmin ? tickets : tickets.filter(t => t.requester?.id === session?.id);
  const active = tickets.find(t => t.id === activeId);

  if (!session) return <LoginPage onLogin={login} />;

  return (
    <div className="app">
      <TopBar view={view} setView={setView} session={session} isAdmin={isAdmin}
        onLogout={logout} />
      <main className="main">
        {view === "home" && !isAdmin && (
          <UserHome tickets={myTickets} session={session}
            onOpen={id => { setActiveId(id); setView("ticket"); }}
            onNew={() => setView("new")} />
        )}
        {view === "home" && isAdmin && (
          <AdminQueue tickets={tickets} users={users}
            onOpen={id => { setActiveId(id); setView("ticket"); }}
            onAssign={assignTicket} />
        )}
        {view === "users" && isAdmin && (
          <UserManager users={users} onAdd={addUser} onDelete={deleteUser} />
        )}
        {view === "new" && (
          <NewTicket onCancel={() => setView("home")} onSubmit={submitTicket} />
        )}
        {view === "ticket" && active && (
          <TicketDetail ticket={active} session={session} isAdmin={isAdmin}
            onBack={() => setView("home")}
            onReply={t => replyTicket(active.id, t)}
            onAssign={agentId => assignTicket(active.id, agentId)}
            onStatus={s => updateStatus(active.id, s)} />
        )}
      </main>
      {toast && <div className="toast"><span className="toast-dot" />{toast}</div>}
    </div>
  );
}

// ── Login Page ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [showP, setShowP]     = useState(false);
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true); setErr("");
    setTimeout(() => {
      const e = onLogin(email.trim(), pass);
      if (e) { setErr(e); setLoading(false); }
    }, 400);
  };

  return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-brand">
          <div className="brand-mark"><span /></div>
          <div>
            <div className="brand-name">Helpdesk</div>
            <div className="brand-org">ASP</div>
          </div>
        </div>
        <h1 className="login-h">Sign in to your account</h1>
        <p className="login-sub">IT support & asset management portal</p>

        <div className="form-group">
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@nordhaven.co"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <div className="pw-wrap">
            <input className="input" type={showP ? "text" : "password"} placeholder="••••••••"
              value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()} />
            <button className="pw-eye" onClick={() => setShowP(s => !s)}>
              {showP ? I.eyeoff : I.eye}
            </button>
          </div>
        </div>
        {err && <div className="login-err">{err}</div>}
        <button className="btn-primary login-btn" onClick={submit} disabled={loading || !email || !pass}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="login-hint">Admin credentials: <code>admin@asp.co</code> / <code>admin123</code></div>
      </div>
    </div>
  );
}

// ── TopBar ─────────────────────────────────────────────────
function TopBar({ view, setView, session, isAdmin, onLogout }) {
  const tabs = isAdmin
    ? [{ id:"home", label:"Queue", icon:I.dashboard }, { id:"users", label:"Users", icon:I.users }]
    : [{ id:"home", label:"My tickets", icon:I.inbox }, { id:"new", label:"New ticket", icon:I.plus }];

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><span /></div>
        <div className="brand-text">
          <div className="brand-name">Helpdesk</div>
          <div className="brand-org">Nordhaven</div>
        </div>
      </div>
      <nav className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={"tab " + (view === t.id || (view === "ticket" && t.id === "home") ? "tab-active" : "")}
            onClick={() => setView(t.id)}>
            <span className="tab-icon">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
      <div className="topbar-right">
        {isAdmin && <span className="admin-chip">Admin</span>}
        <div className="me">
          <div className={"avatar avatar-me " + (isAdmin ? "avatar-admin" : "")}>{session.avatar}</div>
          <div className="me-meta">
            <div className="me-name">{session.name}</div>
            <div className="me-dept">{session.dept}</div>
          </div>
        </div>
        <button className="icon-btn" onClick={onLogout} title="Sign out">{I.logout}</button>
      </div>
    </header>
  );
}

// ── User Home ──────────────────────────────────────────────
function UserHome({ tickets, session, onOpen, onNew }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => ({
    all:     tickets.length,
    open:    tickets.filter(t => !["Resolved","Delivered"].includes(t.status)).length,
    waiting: tickets.filter(t => t.status === "Waiting on you").length,
    closed:  tickets.filter(t => ["Resolved","Delivered"].includes(t.status)).length,
  }), [tickets]);

  const filtered = tickets.filter(t => {
    if (filter === "open"    && ["Resolved","Delivered"].includes(t.status)) return false;
    if (filter === "waiting" && t.status !== "Waiting on you") return false;
    if (filter === "closed"  && !["Resolved","Delivered"].includes(t.status)) return false;
    if (q && !`${t.id} ${t.title}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <div className="eyebrow">Welcome back, {session.name.split(" ")[0]}</div>
          <h1 className="h1">What can we help with?</h1>
          <p className="sub">Raise a ticket for IT support or request an asset.</p>
        </div>
        <button className="btn-primary lg" onClick={onNew}><span className="btn-icon">{I.plus}</span>Raise a ticket</button>
      </section>

      <div className="quickrow">
        <QCard kind="it"    title="IT support"      desc="Network, software, hardware, access" icon={I.bolt}  onClick={onNew} />
        <QCard kind="asset" title="Request an asset" desc="Laptops, monitors, peripherals"      icon={I.box}   onClick={onNew} />
      </div>

      <section className="list-section">
        <div className="list-head">
          <h2 className="h2">Your tickets <span className="muted small">{filtered.length}/{tickets.length}</span></h2>
          <div className="list-controls">
            <div className="search"><span className="search-icon">{I.search}</span>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" />
            </div>
            <div className="segmented">
              {[["all","All"],["open","Open"],["waiting","Action needed"],["closed","Closed"]].map(([id,lbl]) => (
                <button key={id} className={"seg "+(filter===id?"seg-on":"")} onClick={() => setFilter(id)}>
                  {lbl}<span className="seg-count">{counts[id]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <TicketTable tickets={filtered} onOpen={onOpen} showRequester={false} />
      </section>
    </div>
  );
}

function QCard({ kind, title, desc, icon, onClick }) {
  return (
    <button className={"quick quick-"+kind} onClick={onClick}>
      <div className="quick-icon">{icon}</div>
      <div className="quick-body"><div className="quick-title">{title}</div><div className="quick-desc">{desc}</div></div>
      <div className="quick-foot"><span className="quick-arrow">{I.arrow}</span></div>
    </button>
  );
}

// ── Ticket Table (shared) ──────────────────────────────────
function TicketTable({ tickets, onOpen, showRequester }) {
  if (!tickets.length) return (
    <div className="empty"><div className="empty-mark">{I.inbox}</div><div className="empty-text">No tickets found.</div></div>
  );
  return (
    <div className={"tickets " + (showRequester ? "tickets-admin" : "")}>
      <div className="t-head">
        <div className="t-c-id">ID</div>
        <div className="t-c-title">Subject</div>
        {showRequester && <div className="t-c-cat">Requester</div>}
        <div className="t-c-prio">Priority</div>
        <div className="t-c-status">Status</div>
        <div className="t-c-agent">Agent</div>
        <div className="t-c-time">Updated</div>
      </div>
      {tickets.map(t => {
        const sc = statusColor(t.status);
        const agent = AGENTS.find(a => a.id === t.agent);
        return (
          <div className="t-row" key={t.id} onClick={() => onOpen(t.id)}>
            <div className="t-c-id mono">{t.id}</div>
            <div className="t-c-title">
              <div className="t-title-line">{t.title}</div>
              <div className="t-title-sub muted small">{catLabel(t.kind, t.cat)}</div>
            </div>
            {showRequester && (
              <div className="t-c-cat">
                <div className="agent-cell">
                  <div className="avatar avatar-xs">{t.requester?.avatar}</div>
                  <div><div className="small">{t.requester?.name}</div><div className="muted xs">{t.requester?.dept}</div></div>
                </div>
              </div>
            )}
            <div className="t-c-prio">
              <span className="prio" style={{color:prioColor(t.priority)}}>
                <span className="prio-dot" style={{background:prioColor(t.priority)}} />{t.priority}
              </span>
            </div>
            <div className="t-c-status">
              <span className="status-pill" style={{background:sc.bg,color:sc.fg}}>
                <span className="status-dot" style={{background:sc.dot}} />{t.status}
              </span>
            </div>
            <div className="t-c-agent">
              {agent
                ? <div className="agent-cell"><div className="avatar avatar-xs">{agent.avatar}</div><span className="small">{agent.name.split(" ")[0]}</span></div>
                : <span className="muted small">— Unassigned</span>}
            </div>
            <div className="t-c-time muted small">{t.updated}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Admin Queue ────────────────────────────────────────────
function AdminQueue({ tickets, users, onOpen, onAssign }) {
  const [team, setTeam] = useState("all");
  const [q, setQ] = useState("");

  const filtered = tickets.filter(t => {
    if (team === "it"    && t.kind !== "it")    return false;
    if (team === "asset" && t.kind !== "asset") return false;
    if (q && !`${t.id} ${t.title} ${t.requester?.name||""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const stats = {
    open:    tickets.filter(t => !["Resolved","Delivered"].includes(t.status)).length,
    urgent:  tickets.filter(t => t.priority === "Urgent").length,
    waiting: tickets.filter(t => t.status === "Waiting on you").length,
    resolved: tickets.filter(t => ["Resolved","Delivered"].includes(t.status)).length,
  };

  return (
    <div className="page">
      <header className="admin-head">
        <div>
          <div className="eyebrow">Admin view</div>
          <h1 className="h1">All Tickets</h1>
        </div>
        <div className="admin-head-right">
          <div className="search search-sm"><span className="search-icon">{I.search}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" />
          </div>
          <div className="segmented">
            {[["all","All teams"],["it","IT support"],["asset","Assets"]].map(([id,lbl]) => (
              <button key={id} className={"seg "+(team===id?"seg-on":"")} onClick={()=>setTeam(id)}>{lbl}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="stats">
        <Stat label="Open"        value={stats.open}    hint={`${AGENTS.length} agents`} />
        <Stat label="Urgent"      value={stats.urgent}  hint="needs triage"      tone="rose" />
        <Stat label="Awaiting"    value={stats.waiting} hint="from requester"    tone="amber" />
        <Stat label="Resolved"    value={stats.resolved} hint="total closed"     tone="green" />
      </div>

      <div className="tickets tickets-admin">
        <div className="t-head">
          <div className="t-c-id">ID</div>
          <div className="t-c-title">Subject</div>
          <div className="t-c-cat">Requester</div>
          <div className="t-c-prio">Priority</div>
          <div className="t-c-status">Status</div>
          <div className="t-c-agent">Agent</div>
          <div className="t-c-time">Age</div>
        </div>
        {filtered.map(t => {
          const sc = statusColor(t.status);
          const agent = AGENTS.find(a => a.id === t.agent);
          return (
            <div className="t-row" key={t.id} onClick={() => onOpen(t.id)}>
              <div className="t-c-id mono">{t.id}</div>
              <div className="t-c-title">
                <div className="t-title-line">{t.title}</div>
                <div className="t-title-sub muted small">{catLabel(t.kind, t.cat)} · {t.kind === "it" ? "IT" : "Assets"}</div>
              </div>
              <div className="t-c-cat">
                <div className="agent-cell">
                  <div className="avatar avatar-xs">{t.requester?.avatar}</div>
                  <div><div className="small">{t.requester?.name}</div><div className="muted xs">{t.requester?.dept}</div></div>
                </div>
              </div>
              <div className="t-c-prio">
                <span className="prio" style={{color:prioColor(t.priority)}}>
                  <span className="prio-dot" style={{background:prioColor(t.priority)}} />{t.priority}
                </span>
              </div>
              <div className="t-c-status">
                <span className="status-pill" style={{background:sc.bg,color:sc.fg}}>
                  <span className="status-dot" style={{background:sc.dot}} />{t.status}
                </span>
              </div>
              <div className="t-c-agent" onClick={e=>e.stopPropagation()}>
                {agent
                  ? <div className="agent-cell"><div className="avatar avatar-xs">{agent.avatar}</div><span className="small">{agent.name.split(" ")[0]}</span></div>
                  : <select className="assign-select" defaultValue="" onChange={e=>{ if(e.target.value) onAssign(t.id, e.target.value); }}>
                      <option value="" disabled>+ Assign</option>
                      {AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                }
              </div>
              <div className="t-c-time muted small">{t.created}</div>
            </div>
          );
        })}
        {!filtered.length && <div className="empty"><div className="empty-mark">{I.inbox}</div><div className="empty-text">No tickets.</div></div>}
      </div>
    </div>
  );
}

function Stat({ label, value, hint, tone }) {
  return (
    <div className={"stat "+(tone?"stat-"+tone:"")}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-hint">{hint}</div>
    </div>
  );
}

// ── User Manager (Admin only) ──────────────────────────────
function UserManager({ users, onAdd, onDelete }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept]   = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");

  const submit = () => {
    if (!name||!email||!dept||!pass) { setErr("All fields required"); return; }
    if (users.find(u=>u.email===email)) { setErr("Email already exists"); return; }
    const initials = name.trim().split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    onAdd({ name:name.trim(), email:email.trim(), dept:dept.trim(), password:pass, avatar:initials });
    setName(""); setEmail(""); setDept(""); setPass(""); setErr("");
  };

  return (
    <div className="page">
      <header style={{marginBottom:24}}>
        <div className="eyebrow">Admin · User management</div>
        <h1 className="h1">Users</h1>
        <p className="sub">Create and manage user accounts. Admin can create, view and delete users.</p>
      </header>

      <div className="um-layout">
        <div className="um-list">
          <div className="um-list-head"><strong>Active users</strong><span className="muted small">{users.length} accounts</span></div>
          {users.map(u => (
            <div className="um-row" key={u.id}>
              <div className="avatar">{u.avatar}</div>
              <div className="um-info">
                <div className="um-name">{u.name}</div>
                <div className="muted small">{u.email} · {u.dept}</div>
              </div>
              <div className="um-pass-pill">pw: {u.password}</div>
              <button className="um-del" onClick={() => onDelete(u.id)} title="Remove user">{I.x}</button>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-section">
            <div className="label">Create new user</div>
          </div>
          {[
            ["Full name",   name,  setName,  "text",     "Jane Smith"],
            ["Work email",  email, setEmail, "email",    "jane@nordhaven.co"],
            ["Department",  dept,  setDept,  "text",     "Engineering"],
            ["Password",    pass,  setPass,  "password", "Set initial password"],
          ].map(([lbl, val, set, type, ph]) => (
            <div className="card-section" key={lbl}>
              <div className="label">{lbl}</div>
              <input className="input" type={type} placeholder={ph} value={val} onChange={e=>set(e.target.value)} />
            </div>
          ))}
          {err && <div style={{margin:"0 22px",color:"#dc2626",fontSize:12}}>{err}</div>}
          <div className="card-foot">
            <button className="btn-primary" onClick={submit}>{I.plus} Create user</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── New Ticket ─────────────────────────────────────────────
function NewTicket({ onCancel, onSubmit }) {
  const [step, setStep]         = useState(1);
  const [kind, setKind]         = useState("it");
  const [cat, setCat]           = useState(null);
  const [title, setTitle]       = useState("");
  const [body, setBody]         = useState("");
  const [priority, setPriority] = useState("Normal");
  const [impact, setImpact]     = useState("Just me");

  useEffect(() => { setCat(null); }, [kind]);

  return (
    <div className="page page-narrow">
      <div className="crumbs">
        <button className="link" onClick={onCancel}>{I.back} Back</button>
        <span className="muted small">Step {step} of 3</span>
      </div>
      <h1 className="h1" style={{marginBottom:6}}>Raise a new ticket</h1>
      <Stepper step={step} />

      {step === 1 && (
        <div className="card">
          <div className="card-section">
            <div className="label">Type</div>
            <div className="kind-grid">
              {[["it","IT support","Something broken or blocked",I.bolt],["asset","Request an asset","New or replacement hardware",I.box]].map(([id,title,desc,icon]) => (
                <button key={id} className={"kind "+(kind===id?"kind-on":"")} onClick={()=>setKind(id)}>
                  <div className="kind-icon">{icon}</div>
                  <div className="kind-text"><div className="kind-title">{title}</div><div className="kind-desc">{desc}</div></div>
                  <div className="kind-check">{kind===id && I.check}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="card-section">
            <div className="label">Category</div>
            <div className="cat-grid">
              {CATALOG[kind].map(c => (
                <button key={c.id} className={"cat "+(cat===c.id?"cat-on":"")} onClick={()=>setCat(c.id)}>
                  <div className="cat-top"><span className="cat-label">{c.label}</span>{cat===c.id && <span className="cat-check">{I.check}</span>}</div>
                  <div className="cat-desc">{c.desc}</div>
                  <div className="cat-sla">SLA · {c.sla}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="card-foot">
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn-primary" disabled={!cat} onClick={() => setStep(2)}>Continue {I.arrow}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <div className="card-section">
            <div className="label">Subject <span className="req">required</span></div>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)}
              placeholder={kind==="it" ? "Briefly describe the issue" : "What asset do you need?"} />
            <div className="hint">{title.length < 6 ? "At least 6 characters" : "✓ Looks good"}</div>
          </div>
          <div className="card-section">
            <div className="label">Details <span className="req">required</span></div>
            <textarea className="input textarea" value={body} onChange={e=>setBody(e.target.value)}
              placeholder="What happened? When? What have you tried?" />
            <div className="hint">{body.length}/600</div>
          </div>
          <div className="row-2">
            <div className="card-section">
              <div className="label">Priority</div>
              <div className="seg-tall">
                {["Low","Normal","High","Urgent"].map(p => (
                  <button key={p} className={"seg-p "+(priority===p?"seg-on":"")} onClick={()=>setPriority(p)}>
                    <span className="prio-dot" style={{background:prioColor(p)}} />{p}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-section">
              <div className="label">Impact</div>
              <div className="seg-tall">
                {["Just me","My team","Whole office"].map(p => (
                  <button key={p} className={"seg-p "+(impact===p?"seg-on":"")} onClick={()=>setImpact(p)}>{p}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="card-foot">
            <button className="btn-ghost" onClick={()=>setStep(1)}>{I.back} Back</button>
            <button className="btn-primary" disabled={title.length<6||body.length<10} onClick={()=>setStep(3)}>Review {I.arrow}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <div className="card-section">
            <div className="review-head">
              <div className="label">Review &amp; submit</div>
              <div className="route-pill">Routes to · <strong>{kind==="it"?"IT Support":"Assets"}</strong></div>
            </div>
          </div>
          <div className="review-grid">
            {[["Type",kind==="it"?"IT support":"Asset request"],["Category",catLabel(kind,cat)],["Priority",priority],["Impact",impact]].map(([k,v])=>(
              <div key={k} className="review-item"><div className="review-k">{k}</div><div className="review-v">{v}</div></div>
            ))}
            <div className="review-item review-full"><div className="review-k">Subject</div><div className="review-v">{title}</div></div>
            <div className="review-item review-full"><div className="review-k">Details</div><div className="review-v review-pre">{body}</div></div>
          </div>
          <div className="card-foot">
            <button className="btn-ghost" onClick={()=>setStep(2)}>{I.back} Edit</button>
            <button className="btn-primary" onClick={()=>onSubmit({kind,cat,title,body,priority,impact})}>{I.send} Submit ticket</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="stepper">
      {["Category","Details","Review"].map((s,i) => (
        <React.Fragment key={s}>
          <div className={"step "+(step>i+1?"step-done":step===i+1?"step-on":"")}>
            <div className="step-bub">{step>i+1?I.check:i+1}</div>
            <div className="step-label">{s}</div>
          </div>
          {i<2 && <div className={"step-line "+(step>i+1?"step-line-done":"")} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Ticket Detail ──────────────────────────────────────────
function TicketDetail({ ticket, session, isAdmin, onBack, onReply, onAssign, onStatus }) {
  const sc = statusColor(ticket.status);
  const agent = AGENTS.find(a => a.id === ticket.agent);
  const [reply, setReply] = useState("");

  const STATUSES = ["New","Triaging","In progress","Waiting on you","Pending approval","Approved","Resolved","Delivered"];

  const send = () => { if (!reply.trim()) return; onReply(reply.trim()); setReply(""); };

  return (
    <div className="page">
      <button className="link" onClick={onBack}>{I.back} {isAdmin?"Back to queue":"Back to my tickets"}</button>
      <div className="detail">
        <div className="detail-main">
          <div className="detail-head">
            <div className="detail-id mono">{ticket.id}</div>
            <h1 className="detail-title">{ticket.title}</h1>
            <div className="detail-meta">
              <span className="status-pill" style={{background:sc.bg,color:sc.fg}}>
                <span className="status-dot" style={{background:sc.dot}} />{ticket.status}
              </span>
              <span className="prio" style={{color:prioColor(ticket.priority)}}>
                <span className="prio-dot" style={{background:prioColor(ticket.priority)}} />{ticket.priority}
              </span>
              <span className="muted small">Updated {ticket.updated}</span>
            </div>
          </div>

          <div className="thread">
            <Msg role="me" who={ticket.requester?.name||"User"} avatar={ticket.requester?.avatar||"??"} at={ticket.created} body={ticket.body||"(no description)"} first />
            {ticket.thread.map((m,i) => (
              <Msg key={i} role={m.from} who={m.who}
                avatar={m.from==="me" ? ticket.requester?.avatar||"??" : (AGENTS.find(a=>a.name===m.who)||{avatar:m.who.slice(0,2).toUpperCase()}).avatar}
                at={m.at} body={m.text} />
            ))}
          </div>

          {!["Resolved","Delivered"].includes(ticket.status) && (
            <div className="reply">
              <div className="reply-head">
                <div className={"avatar avatar-sm "+(isAdmin?"avatar-admin":"avatar-me")}>{session.avatar}</div>
                <div className="reply-who">Reply as <strong>{session.name}</strong>{isAdmin && <span className="agent-badge">Agent</span>}</div>
              </div>
              <textarea className="input textarea" value={reply} onChange={e=>setReply(e.target.value)}
                placeholder={isAdmin?"Add an agent update…":"Add an update or answer the agent…"} />
              <div className="reply-foot">
                <button className="btn-ghost sm">{I.paperclip} Attach</button>
                <button className="btn-primary sm" disabled={!reply.trim()} onClick={send}>{I.send} Send</button>
              </div>
            </div>
          )}
        </div>

        <aside className="detail-side">
          <div className="side-card">
            <div className="side-title">Details</div>
            <SideRow k="Type"      v={ticket.kind==="it"?"IT support":"Asset request"} />
            <SideRow k="Category"  v={catLabel(ticket.kind, ticket.cat)} />
            <SideRow k="Requester" v={<div className="side-person"><div className="avatar avatar-xs">{ticket.requester?.avatar}</div>{ticket.requester?.name}</div>} />
            <SideRow k="Assigned"  v={agent?<div className="side-person"><div className="avatar avatar-xs">{agent.avatar}</div>{agent.name}</div>:<span className="muted small">Unassigned</span>} />
            {isAdmin && !agent && (
              <div style={{paddingTop:8}}>
                <select className="assign-select-lg" defaultValue="" onChange={e=>{ if(e.target.value) onAssign(e.target.value); }}>
                  <option value="" disabled>Assign to agent…</option>
                  {AGENTS.map(a=><option key={a.id} value={a.id}>{a.name} — {a.team}</option>)}
                </select>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="side-card">
              <div className="side-title">Change status</div>
              <div className="status-grid">
                {STATUSES.map(s => {
                  const c = statusColor(s);
                  return (
                    <button key={s} className={"status-opt "+(ticket.status===s?"status-opt-on":"")}
                      style={ticket.status===s?{background:c.bg,color:c.fg,borderColor:c.dot}:{}}
                      onClick={()=>onStatus(s)}>{s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="side-card">
            <div className="side-title">Activity</div>
            <ul className="activity">
              <li><span className="dot" /><span>Created · <span className="muted">{ticket.created}</span></span></li>
              {agent && <li><span className="dot" /><span>Assigned to {agent.name}</span></li>}
              <li><span className="dot dot-on" /><span>Status · {ticket.status}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SideRow({ k, v }) {
  return <div className="side-row"><div className="side-k">{k}</div><div className="side-v">{v}</div></div>;
}

function Msg({ role, who, avatar, at, body, first }) {
  return (
    <div className={"msg msg-"+role}>
      <div className={"avatar avatar-sm "+(role==="me"?"avatar-me":"")}>{avatar}</div>
      <div className="msg-body">
        <div className="msg-head">
          <strong className="msg-who">{who}</strong>
          {first && <span className="msg-tag">Original</span>}
          <span className="muted small">{at}</span>
        </div>
        <div className="msg-text">{body}</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);