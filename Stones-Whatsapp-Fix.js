
window.STONES_WHATSAPP_NUMBER = "5491126497125";
window.STONES_WHATSAPP_BASE = "https://wa.me/5491126497125?text=";

(function(){
  const origOpen = window.open;
  window.open = function(url, ...args){
    if(typeof url === 'string' && url.includes('wa.me')){
      url = url.replace(/5491122927506/g, '5491126497125').replace(/Hola%20Matias/g, 'Hola%20StonesJoda');
      if(url.toLowerCase().includes('nuevo%20lead') || url.toLowerCase().includes('nuevo lead')){
        try{
          const suStr = localStorage.getItem('stones_user');
          const su = suStr ? JSON.parse(suStr) : {nombre:'Stone Fan', email:'', telefono:''};
          const esSocio = su.esSocio || su.membresia==='activa' || localStorage.getItem('stones_carnet')==='true';
          let estado = esSocio ? "✅ SOCIO DEL CLUB - Passline ACTIVO" : "🛒 COMPRADOR DE MERCH - No es socio del club";
          const msg = "Hola StonesJoda 🔥\n\n" + (esSocio ? "🔥 PEDIDO - SOCIO CLUB" : "🛒 PEDIDO - COMPRADOR MERCH") + "\n\nNombre: " + (su.nombre||su.name||'') + "\nEmail: " + (su.email||'') + "\nTel: " + (su.telefono||'') + "\n\nEstado: " + estado + "\n\nFecha: " + new Date().toLocaleDateString('es-AR');
          url = window.STONES_WHATSAPP_BASE + encodeURIComponent(msg);
        }catch(e){}
      }
    }
    return origOpen.call(window, url, ...args);
  };
})();

window.enviarPedidoAStonesJoda = function(){
  try{
    const suStr = localStorage.getItem('stones_user');
    const su = suStr ? JSON.parse(suStr) : null;
    if(!su || !su.telefono){ alert("Para comprar necesitas ENTRAR con Google arriba."); return; }
    let carrito = [];
    try{
      const cStr = localStorage.getItem('stones_cart') || localStorage.getItem('sjr_cart') || localStorage.getItem('stones_carrito');
      if(cStr) carrito = JSON.parse(cStr);
    }catch(e){}
    if(carrito.length===0) carrito = window._stonesCart || [];
    let txt = ""; let total=0; let tienePass=false;
    carrito.forEach(it=>{
      const n = it.name||it.nombre||'Producto'; const q = it.quantity||it.cantidad||1; const p = it.price||it.precio||0;
      total+=p*q; txt += "- "+n+" x"+q+" ($"+(p*q).toLocaleString('es-AR')+")\n";
      const cat = (it.category||it.categoria||'').toLowerCase(); const nn = (it.name||it.nombre||'').toLowerCase();
      if(cat.includes('passline')||nn.includes('passline')) tienePass=true;
    });
    const id = 'SJ-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*9000+1000);
    const esSocio = su.esSocio===true || su.membresia==='activa' || localStorage.getItem('stones_carnet')==='true';
    let estado = esSocio ? "✅ SOCIO DEL CLUB - Passline ACTIVO" : tienePass ? "🆕 COMPRANDO PASSLINE - Nuevo socio pendiente" : "🛒 COMPRADOR DE MERCH - No es socio del club";
    let titulo = esSocio ? "🔥 NUEVO PEDIDO - SOCIO DEL CLUB PASSLINE" : tienePass ? "🆕 NUEVO SOCIO - COMPRANDO PASSLINE" : "🛒 NUEVO PEDIDO - COMPRADOR MERCH";
    const promo = window._promoAplicada || JSON.parse(localStorage.getItem('stones_promo_aplicada')||'null');
    let totalFinal = total; let extraPromo="";
    if(promo && promo.valido){
      const desc = total*(promo.descuento/100); totalFinal=total-desc;
      extraPromo="\n\n🎟️ PROMO: "+promo.codigo+" -"+promo.descuento+"% OFF\nOrigen: "+promo.origen;
      txt += "Subtotal: $"+total.toLocaleString('es-AR')+"\nDescuento "+promo.codigo+": -$"+desc.toLocaleString('es-AR')+"\n";
    }
    const mensaje = "Hola StonesJoda 🔥\n\n"+titulo+"\nID: "+id+"\n\n"+txt+"Total Final: $"+totalFinal.toLocaleString('es-AR')+"\n\n👤 Cliente: "+(su.nombre||su.name)+" - "+su.email+" - +54 "+su.telefono+"\n📋 Estado: "+estado+extraPromo+"\n\nOrigen: Tienda Oficial\nFecha: "+new Date().toLocaleDateString('es-AR')+" "+new Date().toLocaleTimeString('es-AR');
    const url = window.STONES_WHATSAPP_BASE + encodeURIComponent(mensaje);
    window.open(url,'_blank','noopener,noreferrer');
    try{ localStorage.removeItem('stones_cart'); localStorage.removeItem('sjr_cart'); }catch(e){}
  }catch(e){ console.error(e); }
};
