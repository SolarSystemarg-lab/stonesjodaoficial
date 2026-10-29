
window.STONES_PROMOS=[];
async function cargarPromociones(){
  let promos=[];
  try{
    const lp = localStorage.getItem('stones_promociones') || localStorage.getItem('stones_promos');
    if(lp) promos = promos.concat(JSON.parse(lp));
  }catch(e){}
  if(window._sjDB){
    try{
      const mod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
      const snap = await mod.getDocs(mod.collection(window._sjDB, 'promociones'));
      snap.forEach(d=>{ promos.push({id:d.id, ...d.data()}); });
    }catch(e){}
  }
  const ahora=new Date();
  window.STONES_PROMOS = promos.filter(p=>{
    if(p.estado==='inactiva') return false;
    if(p.fechaCaducacion){ const cad=new Date(p.fechaCaducacion); if(cad<ahora) return false; }
    return true;
  });
}
window.validarCodigoPromo=function(codigo){
  const cod=(codigo||'').trim().toUpperCase();
  if(!cod) return {valido:false, mensaje:'Ingresa codigo'};
  const promo=window.STONES_PROMOS.find(p=>(p.codigo||'').toUpperCase()===cod);
  if(!promo) return {valido:false, mensaje:'Codigo '+cod+' no existe'};
  if(promo.fechaCaducacion){ const cad=new Date(promo.fechaCaducacion); if(cad<new Date()) return {valido:false, mensaje:'Codigo vencido'}; }
  return {valido:true, promo:promo, mensaje:'✅ '+cod+' aplicado', descuento:promo.descuento||0, origen:promo.nombre, tipo:promo.tipo, codigo:promo.codigo};
};
window.aplicarPromoACarrito=function(codigo){
  const res=window.validarCodigoPromo(codigo);
  const input=document.getElementById('promo-code-input');
  const msgEl=document.getElementById('promo-code-msg');
  if(res.valido){
    if(input){ input.classList.add('promo-valid'); }
    if(msgEl){ msgEl.style.color='#00D26A'; msgEl.innerHTML='✅ <strong>'+res.codigo+'</strong> - '+res.descuento+'% OFF<br><small>Origen: '+res.origen+'</small>'; }
    localStorage.setItem('stones_promo_aplicada', JSON.stringify(res.promo ? {...res, promo:undefined} : res));
    window._promoAplicada=res;
    const toast=document.createElement('div');
    toast.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#00D26A;color:#000;padding:12px 20px;border-radius:9999px;font-size:13px;font-weight:800;z-index:99999;';
    toast.innerHTML='🎉 Codigo '+res.codigo+' aplicado - '+res.descuento+'% OFF';
    document.body.appendChild(toast); setTimeout(()=>toast.remove(),4000);
  }else{
    if(msgEl){ msgEl.style.color='#E10600'; msgEl.textContent='❌ '+res.mensaje; }
    localStorage.removeItem('stones_promo_aplicada'); window._promoAplicada=null;
  }
  return res;
};
setTimeout(cargarPromociones,1500);
