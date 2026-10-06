const CACHE='trade-avata-chart-v8.0.4-static';
const LOCAL=['./','./index.html','./assets/styles.css','./src/app.js','./src/chart-pane.js','./src/data.js','./src/drawings.js','./src/state.js','./src/utils.js','./src/indicator-security.js','./src/alert-client.js','./src/replay-client.js','./src/indicators.js','./src/analytics.js','./src/workspace-sync.js','./src/share.js','./src/market-intelligence.js','./src/ai-client.js','./public/brand/trade-avata-logo.svg','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const cacheable=url.origin===self.location.origin||url.hostname==='unpkg.com';
  if(!cacheable)return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return res;}).catch(()=>url.origin===self.location.origin?caches.match('./index.html'):Promise.reject())));
});
