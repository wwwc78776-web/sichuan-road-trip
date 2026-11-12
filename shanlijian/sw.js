'use strict';
const CACHE='shanlijian-book-offline-v2';
const ROOT=new URL('./',self.location.href);
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{if(event.data?.type==='VERIFY_OFFLINE')event.waitUntil((async()=>{let ready=false;try{const cache=await caches.open(CACHE);ready=(await Promise.all(FILES.map(p=>cache.match(p)))).every(Boolean);}catch(e){}event.ports[0]?.postMessage({ready});})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(event.request.mode==='navigate'){const page=await cache.match(new URL('index.html',ROOT).href);if(page)return page;}const hit=await cache.match(event.request,{ignoreSearch:true});return hit||fetch(event.request);})());});
