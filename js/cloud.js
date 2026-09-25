// =====================================================================
//  IRONBLAZE · Cuentas (Firebase Auth) y sincronización en la nube (Firestore)
//  Si FIREBASE_CONFIG es null, este módulo queda desactivado y la app funciona en local.
// =====================================================================
window.Cloud = (function () {
  const cfg = window.FIREBASE_CONFIG;
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  // profileLoaded: ya se ha consultado el perfil en la nube (hasta entonces no se sabe si tiene nombre de usuario)
  const st = { configured: !!(cfg && cfg.apiKey), loaded: false, user: null, profile: null, profileLoaded: false, sync: 'off', lastSync: 0, error: '' };
  const listeners = new Set();
  let fb, auth, db, timer = null, syncing = false, again = false;
  // La app puede registrar aquí qué hacer si el dispositivo tenía datos de otra cuenta
  let conflictHandler = null;

  const emit = () => listeners.forEach(f => { try { f(st); } catch (e) { console.warn(e); } });
  const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h >>> 0); };
  const provider = u => (u && u.providerData[0] && u.providerData[0].providerId) || 'password';
  const needsVerify = () => !!(st.user && provider(st.user) === 'password' && !st.user.emailVerified);
  const canSync = () => !!(st.user && !needsVerify() && st.profile);

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }

  const ERR = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Inicia sesión.',
    'auth/invalid-email': 'El correo no es válido.',
    'auth/weak-password': 'La contraseña es demasiado débil (mínimo 6 caracteres).',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
    'auth/popup-closed-by-user': 'Has cerrado la ventana antes de terminar.',
    'auth/cancelled-popup-request': 'Has cerrado la ventana antes de terminar.',
    'auth/account-exists-with-different-credential': 'Ese correo ya está registrado con otro método. Entra con el método que usaste la primera vez.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
    'auth/operation-not-allowed': 'Este método de inicio de sesión aún no está activado.',
    'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase.',
    'auth/requires-recent-login': 'Por seguridad, cierra sesión y vuelve a entrar antes de hacer esto.',
    'auth/missing-password': 'Escribe la contraseña.',
    'permission-denied': 'Permiso denegado en la nube. ¿Has verificado tu correo?'
  };
  const errMsg = e => {
    const code = (e && e.code) || '';
    if (ERR[code]) return ERR[code];
    if (/api-key|configuration-not-found|project-not-found/.test(code + (e && e.message))) return 'El servicio de cuentas no está bien configurado.';
    return ((e && e.message) || 'Algo ha fallado. Inténtalo de nuevo.').replace(/^Firebase:\s*/, '');
  };

  async function init() {
    if (!st.configured) return;
    try {
      await loadScript(SDK + 'firebase-app-compat.js');
      await Promise.all([loadScript(SDK + 'firebase-auth-compat.js'), loadScript(SDK + 'firebase-firestore-compat.js')]);
    } catch (e) { st.error = 'Sin conexión: no se pudo cargar el servicio de cuentas.'; emit(); return; }
    fb = window.firebase;
    fb.initializeApp(cfg);
    auth = fb.auth(); db = fb.firestore();
    auth.languageCode = 'es';
    st.loaded = true;
    try { await auth.getRedirectResult(); } catch (e) { st.error = errMsg(e); }
    // Espera a conocer si hay sesión guardada antes de decidir qué pantalla mostrar
    let firstState; const ready = new Promise(r => firstState = r);
    auth.onAuthStateChanged(async u => {
      setTimeout(firstState, 0);
      st.user = u; st.profile = null; st.profileLoaded = false;
      // Pista local para saber al abrir la app si hay sesión (sin esperar a Firebase)
      try { if (u) localStorage.setItem('ib.session', u.uid); else localStorage.removeItem('ib.session'); } catch (e) { }
      if (u) emit();
      if (u) {
        st.lastSync = +localStorage.getItem('ib.lastSync.' + u.uid) || 0;
        await loadProfile();
        if (canSync()) await firstSync();
      } else st.sync = 'off';
      emit();
    });
    await Promise.race([ready, new Promise(r => setTimeout(r, 4000))]);
    window.addEventListener('online', () => schedule(500));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(1000); });
  }

  async function loadProfile() {
    try {
      const d = await db.collection('users').doc(st.user.uid).get();
      st.profile = d.exists && d.data().username ? d.data() : null;
      st.profileLoaded = true;
    } catch (e) { st.profile = null; st.profileLoaded = false; } // sin conexión: no se pregunta nada
  }

  // ---------- Nombre de usuario ----------
  const validUsername = u => /^[a-zA-Z0-9_.]{3,20}$/.test(u);
  async function usernameFree(u) {
    const d = await db.collection('usernames').doc(u.toLowerCase()).get();
    return !d.exists || (st.user && d.data().uid === st.user.uid);
  }
  async function claimUsername(uname) {
    uname = uname.trim();
    if (!validUsername(uname)) throw new Error('El usuario debe tener entre 3 y 20 caracteres: letras, números, "_" o ".".');
    const u = auth.currentUser, key = uname.toLowerCase();
    await db.runTransaction(async tx => {
      const ref = db.collection('usernames').doc(key), d = await tx.get(ref);
      if (d.exists && d.data().uid !== u.uid) throw new Error('Ese nombre de usuario ya está cogido.');
      tx.set(ref, { uid: u.uid });
      tx.set(db.collection('users').doc(u.uid), { username: uname, email: u.email || '', provider: provider(u), createdAt: Date.now() }, { merge: true });
    });
    try { await u.updateProfile({ displayName: uname }); } catch (e) { }
    st.profile = { username: uname, email: u.email || '' }; st.profileLoaded = true;
    emit();
    if (canSync()) firstSync();
  }

  // ---------- Registro e inicio de sesión ----------
  async function signUp({ username, email, password }) {
    username = (username || '').trim();
    if (!validUsername(username)) throw new Error('El usuario debe tener entre 3 y 20 caracteres: letras, números, "_" o ".".');
    if (!(await usernameFree(username))) throw new Error('Ese nombre de usuario ya está cogido.');
    let cred;
    try { cred = await auth.createUserWithEmailAndPassword(email.trim(), password); }
    catch (e) { throw new Error(errMsg(e)); }
    try { await claimUsername(username); } catch (e) { /* se pedirá de nuevo al entrar */ }
    await cred.user.sendEmailVerification({ url: location.origin + location.pathname });
  }
  async function signIn(email, password) {
    try { await auth.signInWithEmailAndPassword(email.trim(), password); }
    catch (e) { throw new Error(errMsg(e)); }
  }
  async function social(kind) {
    const p = kind === 'google' ? new fb.auth.GoogleAuthProvider() : new fb.auth.FacebookAuthProvider();
    if (kind === 'facebook') p.addScope('email');
    if (kind === 'google') p.setCustomParameters({ prompt: 'select_account' });
    // Ventana emergente siempre: el método por redirección pierde la sesión cuando la web (github.io)
    // y Firebase están en dominios distintos (almacenamiento de terceros bloqueado en la app instalada).
    try { await auth.signInWithPopup(p); }
    catch (e) {
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') return auth.signInWithRedirect(p);
      throw new Error(errMsg(e));
    }
  }
  async function resetPassword(email) {
    try { await auth.sendPasswordResetEmail(email.trim(), { url: location.origin + location.pathname }); }
    catch (e) { throw new Error(errMsg(e)); }
  }
  async function resendVerification() {
    try { await auth.currentUser.sendEmailVerification({ url: location.origin + location.pathname }); }
    catch (e) { throw new Error(errMsg(e)); }
  }
  async function reloadUser() {
    await auth.currentUser.reload();
    st.user = auth.currentUser;
    if (!needsVerify()) { await auth.currentUser.getIdToken(true); await loadProfile(); if (canSync()) await firstSync(); }
    emit();
    return !needsVerify();
  }
  async function signOut() { clearTimeout(timer); await auth.signOut(); }

  async function deleteAccount() {
    const u = auth.currentUser; if (!u) return;
    const base = db.collection('users').doc(u.uid);
    const ws = await base.collection('workouts').get();
    let batch = db.batch(), n = 0;
    for (const d of ws.docs) { batch.delete(d.ref); if (++n % 400 === 0) { await batch.commit(); batch = db.batch(); } }
    batch.delete(base.collection('meta').doc('state'));
    if (st.profile && st.profile.username) batch.delete(db.collection('usernames').doc(st.profile.username.toLowerCase()));
    batch.delete(base);
    await batch.commit();
    try { await u.delete(); } catch (e) { throw new Error(errMsg(e)); }
    localStorage.removeItem('ib.sync.' + u.uid); localStorage.removeItem('ib.lastSync.' + u.uid);
  }

  // =====================================================================
  //  Sincronización: cada entreno es un documento; rutinas/medidas/ajustes van en "meta".
  //  Se sube solo lo que cambia (comparando huellas) y se baja lo modificado desde la última vez.
  // =====================================================================
  const SYNC_SETTINGS = ['name', 'unit', 'restDefault', 'weekGoal', 'bodyweight', 'avatar'];
  function metaOf(S) {
    const settings = {}; SYNC_SETTINGS.forEach(k => settings[k] = S.settings[k]);
    return { routines: S.routines, custom: S.custom, measures: S.measures, settings, createdAt: S.createdAt };
  }
  const unionById = (local, remote) => {
    const m = new Map(remote.map(x => [x.id || x.i, x]));
    local.forEach(x => m.set(x.id || x.i, x));
    return [...m.values()];
  };

  // Primera sincronización tras entrar: comprueba si el dispositivo tenía datos de otra cuenta
  async function firstSync() {
    const owner = localStorage.getItem('ib.owner');
    const S = Store.state;
    const hasLocal = S.workouts.length || S.routines.length;
    if (owner && owner !== st.user.uid && hasLocal && conflictHandler) {
      const choice = await conflictHandler(); // 'merge' | 'replace'
      if (choice === 'replace') { Store.replaceWithEmpty(); }
    }
    localStorage.setItem('ib.owner', st.user.uid);
    await sync();
  }

  async function sync() {
    if (!canSync()) return;
    if (syncing) { again = true; return; }
    syncing = true; st.sync = 'syncing'; st.error = ''; emit();
    const uid = st.user.uid, S = Store.state, key = 'ib.sync.' + uid;
    const meta = JSON.parse(localStorage.getItem(key) || '{"hashes":{},"lastPull":0,"metaHash":"","metaU":0}');
    const base = db.collection('users').doc(uid), col = base.collection('workouts'), metaRef = base.collection('meta').doc('state');
    const TS = fb.firestore.Timestamp, now = fb.firestore.FieldValue.serverTimestamp();
    try {
      let changed = false;
      // 1) BAJAR entrenos cambiados en otros dispositivos
      const snap = await col.where('u', '>', TS.fromMillis(meta.lastPull)).get();
      let maxU = meta.lastPull;
      snap.forEach(doc => {
        const d = doc.data(), u = d.u ? d.u.toMillis() : 0;
        maxU = Math.max(maxU, u);
        const i = S.workouts.findIndex(x => x.id === doc.id);
        const dirty = i >= 0 && meta.hashes[doc.id] && hash(JSON.stringify(S.workouts[i])) !== meta.hashes[doc.id];
        if (d.del) {
          if (i >= 0 && !dirty) { S.workouts.splice(i, 1); changed = true; }
          delete meta.hashes[doc.id]; return;
        }
        if (dirty) return; // cambio local pendiente: gana el local y se sube abajo
        let w;
        try { w = Store.sanitizeWorkout(JSON.parse(d.j)); } catch (e) { return; } // documento dañado: se ignora
        w.id = doc.id;
        const hh = hash(JSON.stringify(w));
        if (i >= 0) { if (hash(JSON.stringify(S.workouts[i])) !== hh) { S.workouts[i] = w; changed = true; } }
        else { S.workouts.push(w); changed = true; }
        meta.hashes[doc.id] = hh;
      });
      // 2) BAJAR rutinas, medidas y ajustes
      const ms = await metaRef.get();
      const localMetaHash = hash(JSON.stringify(metaOf(S)));
      const localMetaDirty = localMetaHash !== meta.metaHash;
      if (ms.exists) {
        const d = ms.data(), u = d.u ? d.u.toMillis() : 0;
        if (u > meta.metaU) {
          let r;
          try { r = JSON.parse(d.j); } catch (e) { r = {}; }
          // Limpia lo que llega de la nube igual que una copia importada
          const clean = Store.sanitizeState({ workouts: [], routines: r.routines, custom: r.custom, measures: r.measures, settings: Object.assign({}, S.settings, r.settings || {}), createdAt: r.createdAt });
          r = { routines: clean.routines, custom: clean.custom, measures: clean.measures, settings: {}, createdAt: clean.createdAt };
          SYNC_SETTINGS.forEach(k => { r.settings[k] = clean.settings[k]; });
          if (localMetaDirty) {
            S.routines = unionById(S.routines, r.routines || []);
            S.custom = unionById(S.custom, r.custom || []);
            S.measures = unionById(S.measures, r.measures || []);
          } else {
            S.routines = r.routines || []; S.custom = r.custom || []; S.measures = r.measures || [];
            Object.assign(S.settings, r.settings || {});
          }
          if (r.createdAt && r.createdAt < S.createdAt) S.createdAt = r.createdAt;
          meta.metaU = u; changed = true;
        }
      }
      if (changed) { S.workouts.sort((a, b) => b.start - a.start); Store.indexExercises(); Store.save(true, true); }

      // 3) SUBIR entrenos nuevos, cambiados o borrados
      const ops = [], ids = new Set();
      S.workouts.forEach(w => {
        ids.add(w.id);
        const hh = hash(JSON.stringify(w));
        if (meta.hashes[w.id] !== hh) { ops.push([col.doc(w.id), { u: now, j: JSON.stringify(w) }]); meta.hashes[w.id] = hh; }
      });
      Object.keys(meta.hashes).forEach(id => { if (!ids.has(id)) { ops.push([col.doc(id), { u: now, del: true }]); delete meta.hashes[id]; } });
      for (let i = 0; i < ops.length; i += 400) {
        const b = db.batch(); ops.slice(i, i + 400).forEach(([ref, data]) => b.set(ref, data)); await b.commit();
      }
      // 4) SUBIR meta si cambió
      const mj = JSON.stringify(metaOf(S)), mh = hash(mj);
      if (mh !== meta.metaHash) { await metaRef.set({ u: now, j: mj }); meta.metaHash = mh; }

      meta.lastPull = maxU;
      localStorage.setItem(key, JSON.stringify(meta));
      st.lastSync = Date.now(); localStorage.setItem('ib.lastSync.' + uid, st.lastSync);
      st.sync = 'ok';
      if (changed) st.pulled = Date.now();
    } catch (e) {
      console.warn('Sync', e);
      st.sync = 'error'; st.error = errMsg(e);
    }
    syncing = false; emit();
    if (again) { again = false; schedule(1500); }
  }
  function schedule(ms = 8000) {
    if (!canSync()) return;
    clearTimeout(timer); timer = setTimeout(sync, ms);
  }

  return {
    get st() { return st; }, init, onChange: f => { listeners.add(f); return () => listeners.delete(f); },
    needsVerify, canSync, signUp, signIn, social, resetPassword, resendVerification, reloadUser, signOut, deleteAccount,
    claimUsername, usernameFree, validUsername, sync, schedule, provider: () => provider(st.user),
    setConflictHandler: f => { conflictHandler = f; }
  };
})();
