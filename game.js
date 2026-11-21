
const IM = s => { const i = new Image(); i.src = s; return i }, $ = id => document.getElementById(id);
const SP=["assets/img003.png","assets/img004.png","assets/img005.png","assets/img006.png"].map(IM),RK=IM("assets/img007.png"),BOSS=IM("assets/img008.png"),BGI=IM("assets/img009.jpg");
const CN=["David","Kiana","Hiccup","Yuji"],HS=[150,170,150,125],COL=["#2e9b3d","#0a7aff","#d6336c","#7048e8","#e8590c"],FPS=[8,8,14,8];
const FL=(()=>{try{return JSON.parse(localStorage.getItem("sd_flip"))||[1,1,1,0]}catch(e){return[1,1,1,0]}})();
const sc=$("sc"),X=sc.getContext("2d"),W=1280,H=640,HOME=[[330,400],[430,350],[530,405],[630,355]],BX=1010,BY=410;
const wait=ms=>new Promise(r=>setTimeout(r,ms)),now=()=>performance.now()/1000,ez=p=>p<.35?p/.35:p<.7?1:Math.max(0,1-(p-.7)/.3);

const AT=[18,16,22,20],SK=[40,46,48,44],LINES=[["Ci penso io, restate dietro di me!","Concentrati… e fuoco!","Non lasceremo che vinca."],["Con calma, colpiamo insieme.","Posso farcela, fidatevi di me.","Bersaglio in vista!"],["La mia spada è pronta!","Insieme siamo più forti!","Facciamo luce su questo buio."],["Rika, andiamo.","Proteggerò tutti.","Questo è il momento giusto."]];
const blobUrl=s=>{if(!s.startsWith("data:"))return s;const b=atob(s.split(",")[1]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return URL.createObjectURL(new Blob([a],{type:"video/mp4"}))};
const ULTS={david:"assets/ult/david.mp4",kiana:"assets/ult/kiana.mp4",hiccup:"assets/ult/hiccup.mp4",yuji:"assets/ult/yuji.mp4"};
const VID=["david","kiana","hiccup","yuji"].map(n=>{const v=document.createElement("video");v.src=blobUrl(ULTS[n]);v.preload="auto";v.playsInline=true;v.onerror=()=>{if(B&&B.cut&&B.cut.v===v)B.cut.t0-=99};return v});
let B;
function el(t,txt,fn){const e=document.createElement(t);if(txt)e.textContent=txt;if(fn)e.onclick=fn;return e}
function box(h){$("box").replaceChildren(...h);$("ov").style.display="flex"}
$("go").onclick=()=>{B={hp:[100,100,100,100],en:[0,0,0,0],sp:3,boss:800,bmax:800,bf:1,act:-1,q:[],busy:1,anim:null,cut:null,fl:[],round:1,bturn:0};$("menu").style.display="none";$("game").style.display="block";nextTurn()};
function setSay(t,i){$("sn").textContent=CN[i]||"";$("sx").textContent=t;if(CN[i]){$("spi").src=SP[i].src;$("spi").style.transform=FL[i]?"scaleX(-1)":""}}
$("fl").onclick=()=>{const i=B.act<0?0:B.act;FL[i]^=1;try{localStorage.setItem("sd_flip",JSON.stringify(FL))}catch(e){}setSay($("sx").textContent,i);team()};
sc.onclick=()=>{if(B&&B.cut)B.cut.t0-=99};
function team(){const t=$("team");t.replaceChildren();for(let i=0;i<4;i++){const c=el("div");c.className="tc"+(i==B.act?" on":"")+(B.hp[i]<=0?" ko":"");const im=el("img");im.src=SP[i].src;im.style.transform=FL[i]?"scaleX(-1)":"";const b=el("div");b.className="hb";const f=el("i");f.style.width=B.hp[i]+"%";b.append(f);const e=el("div");e.className="hb";const g=el("i");g.style.cssText="width:"+B.en[i]+"%;background:#ffd54a";e.append(g);c.append(im,el("div",CN[i]),b,e);t.append(c)}}
function turns(){const t=$("turns");t.replaceChildren(el("div","Turni"));[B.act,...B.q].forEach((i,j)=>{const c=el("div");c.className="tn"+(j?"":" on");const im=el("img");im.src=SP[i].src;c.append(im,el("span",j==0?"Ora":j==1?"Dopo":""));t.append(c)});const c=el("div");c.className="tn";const im=el("img");im.src=BOSS.src;c.append(im,el("span","Boss"));t.append(c)}
function ansUI(l){const a=$("ans");a.replaceChildren();l.forEach(o=>{const b=el("button");b.className="ab";b.disabled=!!o.off;b.style.opacity=o.off?.45:1;b.append(el("b",o.h),el("span",o.t));b.onclick=o.f;a.append(b)})}
function acts(){const k=B.act,full=B.en[k]>=100;ansUI([{h:"Attacco",t:"+1 PS · "+AT[k]+" danni",f:()=>act(0)},{h:"Abilità",t:"−1 PS · "+SK[k]+" danni",off:B.sp<1,f:()=>act(1)},{h:full?"⚡ Ultimate":"Ultimate "+B.en[k]+"/100",t:full?"Pronta!":"Carica energia",off:!full,f:()=>act(2)}])}
function nextTurn(){if(!B.q.length)B.q=[0,1,2,3].filter(i=>B.hp[i]>0);B.act=B.q.shift();team();turns();const L=LINES[B.act];setSay(L[Math.random()*3|0],B.act);$("qb").textContent="Turno di "+CN[B.act]+" · Punti abilità "+B.sp+"/5 · Round "+B.round;acts();B.busy=0}
async function anim(o,fn,at){B.anim={...o,t0:now()};if(fn)setTimeout(fn,o.d*1000*(at||.55));await wait(o.d*1000);B.anim=null}
function cutin(k){return new Promise(r=>{const v=VID[k];v.currentTime=0;B.cut={k,t0:now(),r,v};const p=v.play();if(p)p.catch(()=>{B.cut.t0-=99})})}
async function hit(k,d,big){await anim({type:"atk",k,d:big?1.9:1.3,big},()=>{B.boss=Math.max(0,B.boss-d);B.fl.push({t:"−"+d,x:BX,y:BY-190,t0:now(),c:"#ffd54a"})})}
async function act(m){if(B.busy)return;B.busy=1;const k=B.act;ansUI([]);
 if(m==2){B.en[k]=0;await cutin(k);await hit(k,120,true)}else if(m==1){B.sp--;B.en[k]=Math.min(100,B.en[k]+35);await hit(k,SK[k],false)}else{B.sp=Math.min(5,B.sp+1);B.en[k]=Math.min(100,B.en[k]+25);await hit(k,AT[k],false)}
 team();if(B.boss<=0){endBox(1);return}
 if(!B.q.length){await bossTurn();if(B.hp.every(h=>h<=0)){endBox(0);return}B.round++}
 nextTurn()}
async function bossTurn(){setSay("Il boss si muove…",B.act);const al=[0,1,2,3].filter(i=>B.hp[i]>0);B.bturn++;const aoe=B.bturn%3==0,t=al[Math.random()*al.length|0],d=aoe?25:35;
 await anim({type:"boss",tgt:t,d:1.2},()=>{(aoe?al:[t]).forEach(i=>{B.hp[i]=Math.max(0,B.hp[i]-d);B.en[i]=Math.min(100,B.en[i]+10);B.fl.push({t:"−"+d,x:HOME[i][0],y:HOME[i][1]-150,t0:now(),c:"#ff6b6b"})})},.5);team()}
function endBox(w){B.busy=1;box(w?[el("h3","🏆 Vittoria!"),el("p","Il boss è stato sconfitto. Bravissimi!"),Object.assign(el("button","Rigioca",()=>location.reload()),{className:"p"})]:[el("h3","💫 Squadra a terra"),el("p","Non è andata, ma puoi riprovare quando vuoi."),Object.assign(el("button","Riprova",()=>location.reload()),{className:"p"})])}
function drawChar(i,t,A,ap){const im=SP[i],h=HS[i],w=h*im.naturalWidth/(im.naturalHeight||1),[hx,hy]=HOME[i],dead=B.hp[i]<=0,s=Math.sin(t*3+i*1.7);let ox=0;
 if(i==B.act&&!dead)ox=16;if(A&&A.type=="atk"&&A.k==i)ox+=i>1?(BX-180-hx)*ez(ap):-12*ez(ap);if(A&&A.type=="boss"&&A.tgt==i&&ap>.4&&ap<.7)ox-=Math.random()*12;
 X.save();if(dead)X.globalAlpha=.3;
 if(i==B.act&&!dead){X.strokeStyle="rgba(255,213,74,"+(.6+.3*s)+")";X.lineWidth=4;X.beginPath();X.ellipse(hx+ox,hy+4,50,13,0,0,7);X.stroke()}
 if(i==3&&!dead){const rh=95,rw=rh*RK.naturalWidth/(RK.naturalHeight||1);X.globalAlpha=.5;X.drawImage(RK,hx+ox-rw*.85,hy-h-rh*.3+Math.sin(t*2)*7,rw,rh);X.globalAlpha=1}
 X.translate(hx+ox,hy);X.scale(FL[i]?-1:1,1);X.imageSmoothingEnabled=i==1;X.drawImage(im,-w/2,-h-s*3,w,h*(1+s*.02));X.restore();
 if(i==2&&!dead)for(let q=0;q<5;q++){const p=(t*1.6+q/5)%1,fx=hx+ox+(FL[2]?-1:1)*(20+q*5),fy=hy-h*.5-p*40,g=X.createRadialGradient(fx,fy,0,fx,fy,16);g.addColorStop(0,"rgba(255,230,120,"+(1-p)+")");g.addColorStop(1,"rgba(255,80,0,0)");X.fillStyle=g;X.beginPath();X.arc(fx,fy,16,0,7);X.fill()}
 X.fillStyle="rgba(0,0,0,.6)";X.fillRect(hx-35,hy+14,70,7);X.fillStyle="#4cd964";X.fillRect(hx-35,hy+14,70*B.hp[i]/100,7)}
function drawFx(t,A,ap){if(!A)return;const C=["#b36bff","#ffd54a","#ff7a1a","#bfe6ff"];
 if(A.type=="atk"&&ap>.35&&ap<.8){const p=(ap-.35)/.45,k=A.k,[hx,hy]=HOME[k],sx=hx+(FL[k]?-1:1)*0+40,sy=hy-HS[k]*.6,dx=BX-sx,dy=BY-120-sy,c=C[k],g=A.big?1.8:1;X.save();X.shadowColor=c;X.shadowBlur=20;
  if(k<2){for(let n=0;n<=k;n++){const o=(n-k/2)*16,px=sx+dx*p,py=sy+dy*p+o;X.fillStyle=c;X.beginPath();X.arc(px,py,7*g,0,7);X.fill();X.strokeStyle=c;X.lineWidth=4*g;X.globalAlpha=.5;X.beginPath();X.moveTo(px-dx*.15,py-dy*.15);X.lineTo(px,py);X.stroke();X.globalAlpha=1}
   if(p<.2){X.fillStyle="#fff";X.beginPath();X.arc(sx,sy,16*(1-p*5),0,7);X.fill()}if(p>.85){X.strokeStyle=c;X.lineWidth=4;X.beginPath();X.arc(BX,BY-120,10+(p-.85)*300*g,0,7);X.stroke()}}
  else if(k==2){X.translate(BX-30,BY-110);X.strokeStyle="rgba(255,"+(120+110*(1-p)|0)+",30,"+(1-p*.7)+")";X.lineWidth=(18*(1-p)+5)*g;X.beginPath();X.arc(0,0,70*g,-1.4+p*2.4,-.3+p*2.4);X.stroke();for(let q=0;q<10;q++){const u=(q*.37+p)%1;X.fillStyle="rgba(255,"+(150+q*9)+",40,"+(1-p)+")";X.beginPath();X.arc(Math.cos(q*2.1)*u*80*g,Math.sin(q*2.1)*u*80*g-u*20,6*(1-u),0,7);X.fill()}}
  else{const e=Math.min(1,p*1.6),rx=sx+dx*e,ry=sy+dy*e,rh=150*g,rw=rh*RK.naturalWidth/(RK.naturalHeight||1);X.globalAlpha=.9*(1-p*.4);X.drawImage(RK,rx-rw*.3,ry-rh/2,rw,rh);X.globalAlpha=p>.5?1-p:0;X.strokeStyle="#cfeaff";X.lineWidth=6;X.beginPath();X.moveTo(BX-45,BY-165);X.lineTo(BX+45,BY-75);X.moveTo(BX+45,BY-165);X.lineTo(BX-45,BY-75);X.stroke()}
  X.restore();if(A.big){X.fillStyle="rgba(255,255,255,"+Math.max(0,.5-Math.abs(ap-.55)*3)+")";X.fillRect(0,0,W,H)}}
 if(A.type=="boss"&&ap>.4&&ap<.75){const[hx,hy]=HOME[A.tgt];X.save();X.strokeStyle="rgba(255,60,60,"+(1-(ap-.4)*2.8)+")";X.lineWidth=10;X.beginPath();X.moveTo(hx-40,hy-HS[A.tgt]);X.lineTo(hx+40,hy-10);X.moveTo(hx+40,hy-HS[A.tgt]);X.lineTo(hx-40,hy-10);X.stroke();X.restore()}}
function drawCut(t){const c=B.cut,v=c.v;if(v.ended||t-c.t0>12||(v.readyState<2&&t-c.t0>3)){v.pause();B.cut=null;c.r();return}
 X.fillStyle="rgba(0,0,10,.85)";X.fillRect(0,0,W,H);if(v.readyState>=2&&v.videoWidth){const r=Math.min(W*.86/v.videoWidth,H*.8/v.videoHeight),w=v.videoWidth*r,h=v.videoHeight*r;X.save();X.shadowColor=["#b36bff","#ffd54a","#ff7a1a","#bfe6ff"][c.k];X.shadowBlur=40;X.drawImage(v,(W-w)/2,(H-h)/2-10,w,h);X.restore()}
 X.fillStyle="#fff";X.font="italic bold 46px sans-serif";X.textAlign="left";X.fillText("⚡ "+CN[c.k]+" · ULTIMATE",50,H-34);X.font="18px sans-serif";X.fillText("tocca per saltare",W-200,H-20)}
function draw(){if(!B)return;const t=now();X.clearRect(0,0,W,H);
 if(BGI.naturalWidth){const r=Math.max(W/BGI.naturalWidth,H/BGI.naturalHeight),w=BGI.naturalWidth*r,h=BGI.naturalHeight*r;X.drawImage(BGI,(W-w)/2,(H-h)/2,w,h)}X.fillStyle="rgba(5,0,25,.25)";X.fillRect(0,0,W,H);
 const A=B.anim,ap=A?Math.min(1,(t-A.t0)/A.d):0;let sx=0,sy=0;if(A&&A.type=="atk"&&ap>.45&&ap<.75){const m=A.big?12:5;sx=(Math.random()-.5)*m;sy=(Math.random()-.5)*m}X.save();X.translate(sx,sy);
 B.bf+=(B.boss/B.bmax-B.bf)*.06;const bh=250,bw=bh*BOSS.naturalWidth/(BOSS.naturalHeight||1);let bo=0;if(A&&A.type=="boss")bo=-(BX-HOME[A.tgt][0]-110)*ez(ap);
 X.save();X.shadowColor="#b04cff";X.shadowBlur=30+10*Math.sin(t*3);X.globalAlpha=A&&A.type=="atk"&&ap>.45&&ap<.7?.55:1;X.drawImage(BOSS,BX+bo-bw/2,BY-bh+Math.sin(t*1.6)*8,bw,bh);X.restore();
 X.fillStyle="rgba(0,0,0,.65)";X.fillRect(BX-100,BY-bh-36,200,12);X.fillStyle="#b04cff";X.fillRect(BX-100,BY-bh-36,200*Math.max(0,B.bf),12);
 [0,1,2,3].sort((a,b)=>HOME[a][1]-HOME[b][1]).forEach(i=>drawChar(i,t,A,ap));drawFx(t,A,ap);X.restore();
 B.fl=B.fl.filter(f=>t-f.t0<1.3);for(const f of B.fl){const p=(t-f.t0)/1.3;X.globalAlpha=1-p*p;X.fillStyle=f.c;X.strokeStyle="#000";X.lineWidth=5;X.font="bold 52px sans-serif";X.textAlign="center";X.strokeText(f.t,f.x,f.y-p*60);X.fillText(f.t,f.x,f.y-p*60);X.globalAlpha=1}
 if(B.cut)drawCut(t)}
function tick(){try{draw()}catch(e){}requestAnimationFrame(tick)}
tick();
