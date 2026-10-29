
window.STONES_IG = "stonesjodarock";
function getIgUrl(){ return "https://www." + "instagram.com/" + window.STONES_IG; }

function detectarPromoDesdeURL(){
  try{
    const params = new URLSearchParams(window.location.search);
    let codigoPromo = params.get('promo') || params.get('codigo') || params.get('cupon') || params.get('code');
    if(!codigoPromo && window.location.hash){
      const hash = window.location.hash.replace('#','').toUpperCase();
      if(hash.length >= 4 && hash.length <= 20) codigoPromo = hash;
    }
    const utmSource = params.get('utm_source') || '';
    const vieneDeIg = utmSource.toLowerCase().includes('ig') || utmSource.toLowerCase().includes('gram') || document.referrer.includes('instagram');
    if(codigoPromo){
      localStorage.setItem('stones_promo_url', codigoPromo.toUpperCase());
      if(vieneDeIg) localStorage.setItem('stones_origen', 'ig');
      let intentos = 0;
      const intervalo = setInterval(()=>{
        intentos++;
        if(window.STONES_PROMOS && window.STONES_PROMOS.length > 0){
          clearInterval(intervalo);
          setTimeout(()=>{
            const input = document.getElementById('promo-code-input');
            if(input){
              input.value = codigoPromo.toUpperCase();
              const res = window.aplicarPromoACarrito(codigoPromo.toUpperCase());
              if(res && res.valido){
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg, #E4405F 0%, #833AB4 100%);color:white;padding:14px 22px;border-radius:9999px;font-size:13px;font-weight:800;z-index:99999;';
                toast.innerHTML = 'Promo de IG aplicada! ' + codigoPromo.toUpperCase() + ' -' + res.descuento + '%';
                document.body.appendChild(toast);
                setTimeout(()=>toast.remove(), 6000);
              }
            }
          }, 500);
        }
        if(intentos > 20) clearInterval(intervalo);
      }, 1000);
    }
  }catch(e){}
}

document.addEventListener('DOMContentLoaded', detectarPromoDesdeURL);

window.generarLinkInstagramBio = function(codigoPromo){
  const codigo = (codigoPromo||'STONES20').toUpperCase();
  const baseUrl = 'https://solarsystemarg-lab.github.io/stonesjodaoficial/';
  return {
    completo: baseUrl + '?promo=' + codigo + '&utm_source=instagram&utm_medium=bio',
    corto: baseUrl + '?promo=' + codigo,
    paraBio: baseUrl + '?promo=' + codigo
  };
};
