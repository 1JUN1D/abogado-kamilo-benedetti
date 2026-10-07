/* ===== Camilo Benedetti Jurado · Abogado Laboral ===== */

/* ═══ CONFIGURACIÓN DE CONVERSIONES ═══
   Reemplaza ADS_ID y SEND_TO con los datos de la acción de conversión
   "Clic a WhatsApp" de Google Ads (ej: 'AW-123456789' y 'AW-123456789/AbCdEfGh').
   Mientras tengan las X, no se carga el tag y WhatsApp abre normalmente. */
var ADS_ID  = 'AW-18500011109';
var SEND_TO = 'AW-18500011109/xWy9CLvDzJQdEOWIv_VE'; /* Benedetti_WhatsApp */
var WA_NUMBER = '573003615985';

(function loadGtag(){
  if (ADS_ID.indexOf('X') !== -1) return;
  if (typeof window.gtag === 'function') return; /* ya cargado desde el <head> */
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ADS_ID);
})();

/* Función central: dispara la conversión y luego abre WhatsApp */
function contactoWhatsApp(mensaje){
  var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(mensaje || 'Hola, quiero que revisen mi caso laboral.');
  var abierto = false;
  function abrir(){
    if (abierto) return;
    abierto = true;
    window.location.href = url;
  }
  if (typeof window.gtag === 'function' && SEND_TO.indexOf('X') === -1){
    gtag('event', 'conversion', { send_to: SEND_TO, transaction_id: '', event_callback: abrir });
    setTimeout(abrir, 800);
  } else {
    abrir();
  }
}

document.addEventListener('DOMContentLoaded', function(){
  /* Botones con data-wa */
  document.querySelectorAll('[data-wa]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      contactoWhatsApp(el.getAttribute('data-wa') || document.body.getAttribute('data-wadefault'));
    });
  });

  /* Menú móvil */
  var burger = document.querySelector('.hamburger');
  var panel = document.querySelector('.mobile-panel');
  var overlay = document.querySelector('.mobile-overlay');
  function toggle(open){
    burger.classList.toggle('is-open', open);
    panel.classList.toggle('show', open);
    overlay.classList.toggle('show', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger){
    burger.addEventListener('click', function(){ toggle(!panel.classList.contains('show')); });
    overlay.addEventListener('click', function(){ toggle(false); });
    panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ toggle(false); }); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') toggle(false); });
  }

  /* Dropdown accesible en táctil */
  document.querySelectorAll('.dropdown-toggle').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var dd = btn.parentElement;
      var open = !dd.classList.contains('open');
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(){
    document.querySelectorAll('.dropdown.open').forEach(function(d){ d.classList.remove('open'); });
  });

  /* Formulario → mensaje de WhatsApp con los datos del caso */
  var form = document.getElementById('form-caso');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var d = new FormData(form);
      var lineas = [form.getAttribute('data-intro')];
      form.querySelectorAll('[data-label]').forEach(function(f){
        var v = (d.get(f.name) || '').toString().trim();
        if (v) lineas.push('• ' + f.getAttribute('data-label') + ': ' + v);
      });
      contactoWhatsApp(lineas.join('\n'));
    });
  }

  /* Año del footer */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
