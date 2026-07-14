/* ============================================
   TiffinKota — Shared behaviours
   ============================================ */

const WA_NUMBER = "919828176543"; // TiffinKota business WhatsApp (Kota, Rajasthan)

function waLink(message){
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* Toast */
function showToast(msg){
  let t = document.querySelector('.toast');
  if(!t){
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=> t.classList.remove('show'), 2600);
}

/* Mobile nav toggle */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.cssText += open ? '' : `
        position:absolute; top:100%; left:0; right:0; flex-direction:column;
        background:#FBF6EE; padding:20px 24px; border-bottom:1px solid #E7DCC9; gap:18px;
      `;
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.15});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* WhatsApp buttons */
  document.querySelectorAll('[data-wa]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = btn.getAttribute('data-wa') || "Hi TiffinKota, I'd like to know more!";
      window.open(waLink(msg), '_blank');
    });
  });

  initSteamCanvas();
});

/* ---------- Signature element: steaming tiffin-stack canvas ---------- */
function initSteamCanvas(){
  const canvas = document.getElementById('steamCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width * devicePixelRatio;
    h = canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', () => { ctx.setTransform(1,0,0,1,0,0); resize(); });

  // Steam origin points relative to canvas width (roughly above the three dabbas in the hero art)
  function origins(){
    const cw = canvas.width / devicePixelRatio;
    const ch = canvas.height / devicePixelRatio;
    return [cw*0.30, cw*0.52, cw*0.74].map(x => ({x, y: ch*0.86}));
  }

  function spawn(){
    if(reduceMotion) return;
    const pts = origins();
    pts.forEach(p => {
      if(Math.random() > 0.55) return;
      particles.push({
        x: p.x + (Math.random()-0.5)*10,
        y: p.y,
        r: 3 + Math.random()*4,
        vy: -(0.35 + Math.random()*0.5),
        vx: (Math.random()-0.5)*0.4,
        life: 0,
        maxLife: 110 + Math.random()*60,
        alpha: 0.0
      });
    });
  }

  function tick(){
    const cw = canvas.width/devicePixelRatio, ch = canvas.height/devicePixelRatio;
    ctx.clearRect(0,0,cw,ch);
    spawn();
    particles.forEach(p => {
      p.life++;
      p.x += p.vx + Math.sin(p.life*0.05)*0.3;
      p.y += p.vy;
      p.vx += (Math.random()-0.5)*0.02;
      const t = p.life / p.maxLife;
      p.alpha = t < 0.2 ? t/0.2*0.35 : 0.35*(1-((t-0.2)/0.8));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1+t*1.8), 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,247,235,${Math.max(p.alpha,0)})`;
      ctx.filter = 'blur(2px)';
      ctx.fill();
    });
    ctx.filter = 'none';
    particles = particles.filter(p => p.life < p.maxLife);
    requestAnimationFrame(tick);
  }
  if(!reduceMotion) requestAnimationFrame(tick);
}

/* ---------- Simple weekly revenue bar chart (partner dashboard) ---------- */
function drawRevenueChart(canvasId, data, labels, peakIndex){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = 200 * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '200px';
  ctx.scale(dpr, dpr);

  const w = rect.width, h = 200;
  const padBottom = 26;
  const barW = w / data.length * 0.5;
  const gap = w / data.length;
  const max = Math.max(...data);

  data.forEach((val, i) => {
    const barH = (val/max) * (h - padBottom - 30);
    const x = gap*i + (gap-barW)/2;
    const y = h - padBottom - barH;
    ctx.beginPath();
    const r = 6;
    ctx.moveTo(x, y+barH);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.lineTo(x+barW-r,y);
    ctx.quadraticCurveTo(x+barW,y,x+barW,y+r);
    ctx.lineTo(x+barW, y+barH);
    ctx.closePath();
    if(i === peakIndex){
      const grad = ctx.createLinearGradient(0,y,0,y+barH);
      grad.addColorStop(0,'#F4762A'); grad.addColorStop(1,'#D6611C');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#EFE4D2';
    }
    ctx.fill();

    if(i === peakIndex){
      ctx.fillStyle = '#4A1A0D';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`₹${(val/1000).toFixed(1)}k`, x+barW/2, y-10);
    }

    ctx.fillStyle = '#6E5B4C';
    ctx.font = '500 11px "Work Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x+barW/2, h-8);
  });
}
