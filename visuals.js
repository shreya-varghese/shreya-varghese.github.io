/* Original procedural diagrams. Perspective-projected geometry and simulated signals;
   no live inference, real MRI data, camera access, or external dependencies. */
window.ProjectScenes=(()=>{
 const scenes=new Map(),motion=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0;
 const ink='#4F0911',lime='#916066',dim='#AA8185';
 const descriptions={power:'Animated illustrative feeder demand history followed by a 24-hour forecast for three feeders.',carbon:'Atmospheric particles surround an animated radial illustration of Scope 1 and Scope 2 emissions, with historical reporting-year states. Illustrative synthetic values.',rag:'Document chunks travel into an embedding space and assemble a grounded response.',brain:'An anatomical 3D brain showing cortical folds, cerebellum, and brainstem, with an animated scan and illustrative region overlay.',aura:'Requests move through approval and fan out to task and access workflows.',face:'A softly lit scanned 3D head, with surface-anchored facial landmarks, pose movement, and a scan overlay.',lead:'Example enquiries pass through a neural classifier and route to Hot, Warm, or Cold.',relation:'A rotating entity graph with propagating pulses and firing nodes.'};
 function line(c,a,b,color=dim,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}
 function dot(c,x,y,r,color=lime,glow=0){c.fillStyle=color;c.shadowColor=color;c.shadowBlur=glow;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.shadowBlur=0}
 function text(c,s,x,y,size=10,color=ink,align='left'){c.font=`500 ${Math.max(18,size*1.2)}px "Manrope", sans-serif`;c.fillStyle=color===lime?'#734650':color;c.textAlign=align;c.fillText(s,x,y)}
 function box(c,x,y,w,h,label,active=false){c.fillStyle=active?'#E4CEC1':'#FAF1EC';c.strokeStyle=active?'#916066':'#C8A9A4';c.lineWidth=1;c.fillRect(x,y,w,h);c.strokeRect(x,y,w,h);if(label)text(c,label,x+w/2,y+h/2+4,10,ink,'center')}
 function packet(c,a,b,q,offset=0){let f=(q+offset)%1;line(c,a,b,'#C7A59D',1);for(let j=0;j<5;j++){let k=Math.max(0,f-j*.025);dot(c,a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,j?2:4,j?'#916066':lime,j?0:9)}}
 function project(x,y,z,t,cx,cy,size,tilt=.22){let a=t*.25,xx=x*Math.cos(a)+z*Math.sin(a),zz=z*Math.cos(a)-x*Math.sin(a),yy=y*Math.cos(tilt)-zz*Math.sin(tilt);zz=y*Math.sin(tilt)+zz*Math.cos(tilt);let p=3.8/(3.8+zz);return[cx+xx*size*p,cy+yy*size*p,zz,p]}
 function grid(c,H,t){c.fillStyle='#F0E0D9';c.fillRect(0,0,650,H);const gradient=c.createRadialGradient(325,H*.4,10,325,H*.4,320);gradient.addColorStop(0,'#FAF1EC');gradient.addColorStop(1,'#F0E0D9');c.fillStyle=gradient;c.fillRect(0,0,650,H);}
 function rag(c,H,t,s){let cy=H*.53;const q=(t%8)/8;let state=q<.32?'CHUNKING DOCUMENTS':q<.7?'RETRIEVING CONTEXT':'ASSEMBLING ANSWER';s.status=state;
 const docs=[cy-90,cy-22,cy+46];docs.forEach((y,i)=>{box(c,32,y,100,50,'',q<.32);text(c,'DOC 0'+(i+1),43,y+16,9);for(let j=0;j<3;j++){line(c,[43,y+26+j*6],[112-j*12,y+26+j*6],'#AA8185',1)}packet(c,[132,y+25],[230,cy],(t*.34+i*.29)%1);for(let j=0;j<3;j++){const x=160+((t*32+j*21+i*12)%55);c.fillStyle=j===i%3?lime:'#C7A59D';c.fillRect(x,y+20+j*6,10,4)}});
 const ps=[];for(let i=0;i<65;i++){let a=i*2.39996,z=1-2*i/64,r=Math.sqrt(1-z*z);ps.push(project(r*Math.cos(a),z,r*Math.sin(a),t,300,cy,54))}ps.sort((a,b)=>b[2]-a[2]);ps.forEach((p,i)=>dot(c,p[0],p[1],i%9===0?3:1.5,i%9===0?lime:'#AA8185'));text(c,'EMBEDDINGS',300,cy+92,9,ink,'center');packet(c,[358,cy],[408,cy],t*.28);dot(c,412,cy,27,'#E4CEC1');dot(c,412,cy,17,lime,15);text(c,'CONTEXT',412,cy+62,9,ink,'center');packet(c,[440,cy],[496,cy],t*.4+.4);box(c,497,cy-48,126,96,'',q>.7);text(c,'ANSWER',508,cy-28,10);for(let j=0;j<5;j++){const progress=Math.max(0,Math.min(1,(q-.66)*6-j*.12));line(c,[508,cy-9+j*12],[508+(94-j*9)*progress,cy-9+j*12],j===0?lime:'#916066',2)}}
 function brain(c,H,t,s){const cy=H*.51;const scan=(Math.sin(t*.8)+1)/2,sy=cy-H*.32+scan*H*.64;
 if(s.renderer?.ready){s.renderer.render(t,s.tilt,s.width,s.height);s.status=scan<.5?'SCANNING CORTEX':'REGION OVERLAY';}
 else{s.status=s.renderer?.failed?'3D VIEW UNAVAILABLE':'LOADING ANATOMY';text(c,s.status,325,cy,15,ink,'center');}
 line(c,[126,sy],[505,sy],'#91606677',1);text(c,'SCAN',520,sy+4,14,lime);text(c,'3D BRAIN',24,cy-29,14);text(c,'ANATOMY',24,cy-9,14,dim);text(c,'REGION',517,cy-28,14,lime);text(c,'OVERLAY',517,cy-8,14,ink);}
 function aura(c,H,t,s){let cy=H*.5;const nodes=[[86,cy-60,'LEAVE'],[86,cy+60,'TRANSFER'],[310,cy,'APPROVAL'],[550,cy-60,'TASKS'],[550,cy+60,'ACCESS']];const q=t%6;[[0,2],[1,2],[2,3],[2,4]].forEach(([a,b],i)=>{let start=nodes[a],end=nodes[b];packet(c,[start[0]+(a<2?52:46),start[1]],[end[0]-52,end[1]],(t*.3+i*.19)%1)});nodes.forEach(([x,y,label],i)=>{let active=i<2?q<2:i===2?q>=2&&q<4:q>=4;box(c,x-49,y-25,98,50,label,active);if(active){c.strokeStyle=lime;c.lineWidth=1;c.strokeRect(x-53,y-29,106,58)}});let ring=(t*.35)%1;c.strokeStyle=`rgba(212,243,67,${1-ring})`;c.beginPath();c.arc(310,cy,35+ring*35,0,7);c.stroke();text(c,'REQUEST',86,cy-112,9,dim,'center');text(c,'ROUTE',310,cy-77,9,dim,'center');text(c,'COMPLETE',550,cy-112,9,dim,'center');s.status=q<2?'REQUEST RECEIVED':q<4?'APPROVAL IN PROGRESS':'TASKS + ACCESS SYNCHRONISED';}
 function face(c,H,t,s){const cy=H*.5;const scan=(Math.sin(t*.8)+1)/2;
 c.save();c.fillStyle='#91606615';c.beginPath();c.ellipse(325,H*.84,94,12,0,0,7);c.fill();c.restore();
 if(s.renderer?.ready){s.renderer.render(t,s.tilt,s.width,s.height);s.status=scan<.5?'TRACKING LANDMARKS':'FACE REGION LOCKED';}else{s.status=s.renderer?.failed?'3D VIEW UNAVAILABLE':'LOADING HEAD MODEL';text(c,s.status,325,cy,15,ink,'center')}
 const x=211,y=H*.13,w=228,h=H*.68;c.strokeStyle='#91606644';c.lineWidth=1;c.strokeRect(x,y,w,h);for(const[xx,yy,dx,dy]of[[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]]){line(c,[xx,yy],[xx+dx*18,yy],'#916066',2);line(c,[xx,yy],[xx,yy+dy*18],'#916066',2)}text(c,'FACE',30,cy-30,14);text(c,'LANDMARKS',30,cy-10,14,dim);text(c,'IMAGE +',500,cy-30,14);text(c,'VIDEO',500,cy-10,14,dim);}
 function lead(c,H,t,s){let cy=H*.52;const classes=['HOT','WARM','COLD'],chosen=Math.floor(t/5)%3,cols=[75,215,355,550],layers=[3,5,4,3];let pts=layers.map((n,l)=>Array.from({length:n},(_,i)=>[cols[l],cy+(i-(n-1)/2)*37]));pts.slice(0,-1).forEach((layer,l)=>layer.forEach((a,i)=>pts[l+1].forEach((b,j)=>{line(c,a,b,'#D6BDB5',.6);if((i+j+l)%3===chosen)packet(c,a,b,(t*.38+l*.26+i*.13)%1)})));pts.forEach((layer,l)=>layer.forEach((p,i)=>{let fire=(t*.7+i*.19+l*.23)%1>.75;dot(c,...p,l===3?9:5,l===3&&i===chosen||fire?lime:'#AA8185',fire?9:0)}));classes.forEach((label,i)=>text(c,label,575,pts[3][i][1]+3,10,i===chosen?lime:dim));text(c,'ENQUIRY',75,cy-115,9,ink,'center');text(c,'FEATURES',215,cy-135,9,dim,'center');text(c,'CLASSIFY',355,cy-115,9,dim,'center');text(c,'PRIORITY',550,cy-115,9,ink,'center');s.status='SAMPLE ENQUIRY → '+classes[chosen];}
 const entityPoints=Array.from({length:36},(_,i)=>{const y=1-2*i/35,r=Math.sqrt(1-y*y),a=i*2.39996;return[r*Math.cos(a),y,r*Math.sin(a)]});const edges=[];entityPoints.forEach((p,i)=>{const near=entityPoints.map((q,j)=>({j,d:p.reduce((sum,v,k)=>sum+(v-q[k])**2,0)})).filter(x=>x.j>i).sort((a,b)=>a.d-b.d).slice(0,3);near.forEach(q=>edges.push([i,q.j]))});
 function relation(c,H,t,s){const ps=entityPoints.map(p=>project(...p,t+s.tilt,325,H*.52,Math.min(117,H*.31),.3));edges.forEach(([a,b],i)=>{line(c,ps[a],ps[b],'rgba(145,96,102,.27)',.7);if(i%5===Math.floor(t)%5)packet(c,ps[a],ps[b],(t*.4+i*.17)%1)});ps.map((p,i)=>({p,i})).sort((a,b)=>b.p[2]-a.p[2]).forEach(({p,i})=>{const firing=(t*.6+i*.073)%1>.83;dot(c,p[0],p[1],(firing?4:2)*p[3],firing?lime:'#916066',firing?12:0);if(i%9===0)text(c,'E'+String(i).padStart(2,'0'),p[0]+10,p[1],8,'#734650')});text(c,'ENTITY GRAPH',25,H*.5-8,10);text(c,'MESSAGE',500,H*.5-8,10);text(c,'PASSING',500,H*.5+8,10,lime);s.status='RELATIONS PROPAGATING';}
 function power(c,H,t,s){
  const x0=45,x1=610,y0=H*.18,y1=H*.77,cut=355,phase=t*.62;
  s.status='FEEDER FORECAST / 24 HOURS / ILLUSTRATIVE';
  c.strokeStyle='#d9bdb8';c.lineWidth=1;
  for(let j=0;j<5;j++){let y=y0+(y1-y0)*j/4;line(c,[x0,y],[x1,y],'#d9bdb8',1)}
  for(let j=0;j<7;j++){let x=x0+(x1-x0)*j/6;line(c,[x,y0],[x,y1],'#ead6cf',.8)}
  c.fillStyle='#91606622';c.fillRect(cut,y0,x1-cut,y1-y0);
  c.setLineDash([5,5]);line(c,[cut,y0-10],[cut,y1+5],'#916066',1.3);c.setLineDash([]);
  text(c,'HISTORICAL LOAD',x0,y0-14,9,ink);text(c,'24H FORECAST',cut+15,y0-14,9,ink);
  const names=['F1 / 132 kV','F2 / 132 kV','F3 / 132 kV'],colors=['#4F0911','#916066','#C18E82'];
  const progress=Math.min(1,(t%8)/5.5);
  for(let k=0;k<3;k++){
    const base=y0+(y1-y0)*(.22+k*.25);c.beginPath();c.strokeStyle=colors[k];c.lineWidth=k===0?2.5:2;
    let last=null;
    for(let i=0;i<=150;i++){
      let u=i/150,x=x0+u*(x1-x0);if(x>cut+(x1-cut)*progress)break;
      let y=base+Math.sin(u*22+k*1.3)*11+Math.cos(u*47+k*.8)*3+Math.sin(u*7+k)*7;
      if(!last)c.moveTo(x,y);else c.lineTo(x,y);last=[x,y];
    }c.stroke();if(last)dot(c,last[0],last[1],4,colors[k]);
    const ly=y1+22;text(c,names[k],x0+k*189,ly,10,colors[k]);
  }
  text(c,'MODEL → XGBOOST + ENSEMBLE',x0,y1+49,9,dim);
 }
 function carbon(c,H,t,s){
  // An illustrative emissions observatory, not a visualization of measured plant data.
  // Concentric tracks distinguish reporting scopes; atmosphere conveys greenhouse gases.
  const cx=325,cy=H*.49,r1=Math.min(128,H*.32),r2=r1*.72;
  const phase=(t%14)/14, year=phase<.5?2023:2024;
  const ease=x=>x*x*(3-2*x), sweep=ease(Math.min(1,(phase% .5)*2*1.5));
  s.status=year+' / SCOPE 1 + 2 / SYNTHETIC DEMO';
  const label=(str,x,y,size=11,color=ink,align='left')=>{c.font=`500 ${size}px "IBM Plex Mono", monospace`;c.fillStyle=color;c.textAlign=align;c.fillText(str,x,y)};
  // Slow volumetric haze built from radial gradients rather than UI connector boxes.
  for(let j=0;j<4;j++){
   const x=cx+Math.sin(t*.13+j*2)*65,y=cy+Math.cos(t*.11+j*3)*42;
   const glow=c.createRadialGradient(x,y,5,x,y,r1*1.2);glow.addColorStop(0,j%2?'rgba(145,96,102,.065)':'rgba(79,9,17,.055)');glow.addColorStop(1,'rgba(145,96,102,0)');
   c.fillStyle=glow;c.beginPath();c.arc(x,y,r1*1.2,0,Math.PI*2);c.fill();
  }
  // Deterministic drifting particles; smooth looping with no random flashing.
  for(let i=0;i<160;i++){
   const a=i*2.399963+Math.sin(t*.055+i*.13)*.19;
   const rad=(.24+Math.sqrt((i+.5)/160)*1.17)*r1;
   const x=cx+Math.cos(a)*rad+Math.sin(t*.18+i)*3;
   const y=cy+Math.sin(a)*rad*.84-((t*.8+i*9)%30)+15;
   const opacity=.08+.26*(1-i/160);
   c.fillStyle=i%3===0?`rgba(79,9,17,${opacity})`:`rgba(145,96,102,${opacity})`;
   c.beginPath();c.arc(x,y,i%13===0?2.3:1.15,0,Math.PI*2);c.fill();
  }
  const arc=(r,w,color,a0,a1)=>{c.beginPath();c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.arc(cx,cy,r,a0,a1);c.stroke();c.lineCap='butt'};
  arc(r1,19,'rgba(145,96,102,.14)',-Math.PI/2,Math.PI*1.5);
  arc(r2,14,'rgba(145,96,102,.18)',-Math.PI/2,Math.PI*1.5);
  const scope1=year===2023?.72:.63,scope2=year===2023?.49:.56;
  arc(r1,19,'#4F0911',-Math.PI/2,-Math.PI/2+Math.PI*2*scope1*sweep);
  arc(r2,14,'#AA777E',-Math.PI/2,-Math.PI/2+Math.PI*2*scope2*sweep);
  c.setLineDash([2,8]);arc(r1+32,1.3,'rgba(79,9,17,.25)',-Math.PI/2,Math.PI*1.5);c.setLineDash([]);
  // Sweeping instrument arm and tracked marker.
  const angle=-Math.PI/2+t*.24;
  const mx=cx+Math.cos(angle)*r1,my=cy+Math.sin(angle)*r1;
  c.beginPath();c.moveTo(cx+Math.cos(angle)*32,cy+Math.sin(angle)*32);c.lineTo(mx,my);
  c.strokeStyle='rgba(79,9,17,.12)';c.lineWidth=1.2;c.stroke();dot(c,mx,my,3.8,'#4F0911',4);
  c.fillStyle='#FAF1EC';c.beginPath();c.arc(cx,cy,r2*.62,0,Math.PI*2);c.fill();
  label('CO₂e',cx,cy-9,22,'#4F0911','center');
  label('SCOPE 01 / 02',cx,cy+13,11,'#916066','center');
  label(String(year),cx,cy+32,15,'#4F0911','center');
  // Editorial annotations sit outside the rotating graphic.
  label('DIRECT',31,H*.30,13,'#4F0911');label('SCOPE 01',31,H*.30+22,11,'#916066');
  label('INDIRECT',619,H*.67,13,'#4F0911','right');label('SCOPE 02',619,H*.67+22,11,'#916066','right');
  label('HISTORICAL',31,H*.84,10,'#916066');label('FACTORS',31,H*.84+17,10,'#916066');
  label('PROTOTYPE DATA',619,H*.88,10,'#916066','right');
 }
 const painters={power,carbon,rag,brain,aura,face,lead,relation};
 function measure(s){const r=s.canvas.getBoundingClientRect();s.width=r.width;s.height=r.height;const dpr=Math.min(devicePixelRatio||1,1.6);s.canvas.width=Math.round(r.width*dpr);s.canvas.height=Math.round(r.height*dpr);s.scale=s.canvas.width/650;s.H=s.canvas.height/s.scale;s.ctx=s.canvas.getContext('2d');}
 function paint(s){if(!s.width)return;s.ctx.setTransform(s.scale,0,0,s.scale,0,0);grid(s.ctx,s.H,s.t);painters[s.kind](s.ctx,s.H,s.t,s);s.canvas.dataset.frame=String(s.frames++);s.canvas.dataset.time=s.t.toFixed(3);const status=s.canvas.closest('.scene-frame')?.querySelector('.scene-status');if(status&&status.textContent!==s.status)status.textContent=s.status;}
 function active(){return!document.hidden&&[...scenes.values()].some(s=>s.visible&&!s.paused)}
 function tick(now){raf=0;let delta=last?Math.min((now-last)/1000,.06):.033;if(now-last<32){raf=requestAnimationFrame(tick);return}last=now;scenes.forEach(s=>{if(!s.canvas.isConnected){observer.unobserve(s.canvas);s.renderer?.destroy();scenes.delete(s.canvas);return}if(s.visible&&!s.paused){s.t+=delta;paint(s)}});if(active())raf=requestAnimationFrame(tick)}
 function wake(){if(active()&&!raf){last=0;raf=requestAnimationFrame(tick)}}
 const observer=new IntersectionObserver(es=>{es.forEach(e=>{let s=scenes.get(e.target);if(s){s.visible=e.isIntersecting;if(s.visible)paint(s)}});wake()},{rootMargin:'50px',threshold:.01});
 function mount(canvas){let s=scenes.get(canvas);if(s){measure(s);paint(s);return}for(const [old,scene] of scenes){if(!old.isConnected){observer.unobserve(old);scene.renderer?.destroy();scenes.delete(old)}}s={canvas,kind:canvas.dataset.visual,t:.8,tilt:0,visible:false,paused:motion.matches,frames:0,status:''};scenes.set(canvas,s);if(s.kind==='brain'||s.kind==='face')s.renderer=window.AnatomicalBrain.create(canvas.parentElement,()=>{if(canvas.isConnected)paint(s)},s.kind);canvas.setAttribute('role','img');canvas.setAttribute('aria-label',descriptions[s.kind]);canvas.removeAttribute('aria-hidden');measure(s);paint(s);observer.observe(canvas);const frame=canvas.closest('.scene-frame');if(s.kind==='brain'||s.kind==='face'){const credit=document.createElement('a');credit.className='brain-credit';credit.href='assets/'+(s.kind==='face'?'face-attribution.txt':'brain-attribution.txt');credit.target='_blank';credit.rel='noopener';credit.textContent=s.kind==='face'?'Head model: Lee Perry-Smith / Infinite Realities · CC BY 3.0 ↗':'3D anatomy: Z-Anatomy / BodyParts3D · CC BY-SA 4.0 ↗';frame.appendChild(credit)}const pause=frame.querySelector('.scene-pause'),replay=frame.querySelector('.scene-replay');const sync=()=>{pause.textContent=s.paused?'Play ▷':'Pause Ⅱ';pause.setAttribute('aria-pressed',String(s.paused))};sync();pause.addEventListener('click',()=>{s.paused=!s.paused;sync();wake()});replay.addEventListener('click',()=>{s.t=.8;paint(s);wake()});canvas.addEventListener('pointermove',e=>{if(motion.matches)return;const r=canvas.getBoundingClientRect();s.tilt=((e.clientX-r.left)/r.width-.5)*2; if(s.paused)paint(s)});canvas.addEventListener('pointerleave',()=>{s.tilt=0;if(s.paused)paint(s)});}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()});motion.addEventListener('change',()=>{scenes.forEach(s=>{s.paused=motion.matches;const b=s.canvas.closest('.scene-frame').querySelector('.scene-pause');b.textContent=s.paused?'Play ▷':'Pause Ⅱ';b.setAttribute('aria-pressed',String(s.paused));paint(s)});wake()});
 return{mount};
})();
