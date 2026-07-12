// ============================================================
// FIREBASE CONFIG — fill this in with YOUR Firebase project.
// Firebase Console → Project Settings → General → Your apps → SDK setup
// Make sure "Realtime Database" (not just Firestore) is enabled.
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBhnNm-ctVZ4oYovODd_VQ2vGlRyGBzNWk",
  authDomain: "bgmi15k-7f799.firebaseapp.com",
  databaseURL: "https://bgmi15k-7f799-default-rtdb.firebaseio.com",
  projectId: "bgmi15k-7f799",
  storageBucket: "bgmi15k-7f799.firebasestorage.app",
  messagingSenderId: "699291578308",
  appId: "1:699291578308:web:2e592a0daef7d0d070be91",
  measurementId: "G-DD3X2FXB78"
};
// Initialize once, reused by every page that includes this file.
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ---- Data path helper --------------------------------------
// Mirrors the structure used across setup / admin / overlay pages:
// tournaments/{tid}/rounds/{rid}/matches/{mid}/sets/{setId}/teams/{teamKey}
function setPath(tid, rid, mid, setId) {
  return `tournaments/${tid}/rounds/${rid}/matches/${mid}/sets/${setId}`;
}

function teamsRef(tid, rid, mid, setId) {
  return db.ref(`${setPath(tid, rid, mid, setId)}/teams`);
}

function metaRef(tid, rid, mid, setId) {
  return db.ref(`${setPath(tid, rid, mid, setId)}/meta`);
}

// Read tid/rid/mid/setId from the URL query string, same convention
// as the reference site (…/live_ranking.html?tid=..&rid=..&mid=..&setId=..)
function getUrlIds() {
  const p = new URLSearchParams(window.location.search);
  return {
    tid: p.get('tid'),
    rid: p.get('rid'),
    mid: p.get('mid'),
    setId: p.get('setId')
  };
}
