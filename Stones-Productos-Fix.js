
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const cfg={apiKey:"AIzaSyDEFgti6u0Y1mZGIbGESigiQXAqPYSc_aE",authDomain:"stones-joda-rock.firebaseapp.com",projectId:"stones-joda-rock",storageBucket:"stones-joda-rock.firebasestorage.app",messagingSenderId:"649980351819",appId:"1:649980351819:web:8c6a13a4768c5d1ee084ce"};
let db; try{const app=initializeApp(cfg); db=getFirestore(app); window._sjDB=db;}catch(e){try{const app2=initializeApp(cfg,'second'); db=getFirestore(app2); window._sjDB=db;}catch(e2){}}
function escuchar(){ if(!window._sjDB) return; try{ onSnapshot(collection(window._sjDB,'productos'), (snap)=>{ const prods=[]; snap.forEach(d=>{ prods.push({id:d.id, ...d.data()}); }); if(prods.length>0){ localStorage.setItem('stones_products_v2', JSON.stringify(prods)); window.dispatchEvent(new CustomEvent('stones-products-updated',{detail:prods})); } }); }catch(e){} }
setTimeout(escuchar,1500);
