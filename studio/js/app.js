(()=>{'use strict';
const $=id=>document.getElementById(id);
const fieldIDs=['projectName','corDestaque','postType','tipo','operacao','bairro','cidade','area','quartos','vagas','preco','codigo','destaques','assunto','publico','pontos','cta','objetivo','tom','visual','fonte','corTexto','corFundo','formato','nome','creci','contato'];
const defaultForm=Object.fromEntries(fieldIDs.map(id=>[id,$(id).value]));
const topics={comprador:{assunto:'Como se preparar para visitar um imóvel',publico:'Quem está buscando um imóvel',pontos:'Liste suas prioridades, Confira informações e documentos, Anote as perguntas para a visita',cta:'Entre em contato para tirar dúvidas'},vendedor:{assunto:'Como preparar um imóvel para divulgação',publico:'Proprietários que desejam vender',pontos:'Organize informações e documentos, Reúna fotos claras e autorizadas, Atualize as condições do imóvel',cta:'Converse com um profissional para avaliar os próximos passos'},servico:{assunto:'Acompanhamento na busca de um imóvel',publico:'Pessoas em busca de imóveis',pontos:'Entendimento das necessidades, Organização das opções, Orientação durante as visitas',cta:'Entre em contato para saber como funciona o atendimento'},bairro:{assunto:'Conheça a região antes de decidir',publico:'Quem pesquisa imóveis na região',pontos:'Localização e deslocamentos, Comércio e serviços verificados, Características locais comprovadas',cta:'Peça mais informações sobre a região'},institucional:{assunto:'Conheça meu trabalho no mercado imobiliário',publico:'Clientes que buscam atendimento imobiliário',pontos:'Atendimento personalizado, Organização das informações, Acompanhamento durante as etapas',cta:'Entre em contato para conhecer meus serviços'}};
let active='legenda',slide=0, gallery=[],photoForSlide=[null,null,null],slideEdits=Array.from({length:3},()=>({})),textEdits={},busy=false;
function val(id){return $(id).value.trim()}
function join(x,sep=', '){return x.filter(Boolean).join(sep)}
function brl(s){let n=Number(s);return n>0&&Number.isFinite(n)?n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}):''}
function d(){let o={};fieldIDs.forEach(k=>o[k]=val(k));o.pontosArr=o.pontos.split(',').map(t=>t.trim()).filter(Boolean).slice(0,6);o.dest=o.destaques.split(',').map(t=>t.trim()).filter(Boolean).slice(0,6);o.loc=join([o.bairro,o.cidade]);o.precoTxt=brl(o.preco);o.specs=join([o.area?o.area+' m²':'',o.quartos?o.quartos+' '+(Number(o.quartos)===1?'quarto':'quartos'):'',o.vagas?o.vagas+' '+(Number(o.vagas)===1?'vaga':'vagas'):''],' · ');o.cred=join([o.nome,o.creci],' · ');o.title=join([o.tipo,o.loc?'em '+o.loc:''],' ');o.operation=o.operacao==='Locação'?'para alugar':'à venda';o.action=o.objetivo==='visita'?'Entre em contato para combinar uma visita':o.objetivo==='detalhes'?'Peça informações atualizadas sobre este imóvel':'Entre em contato para saber mais';return o}
function themeTitle(x){return x.postType==='comprador'?'DICAS PARA COMPRAR':x.postType==='vendedor'?'DICAS PARA VENDER':x.postType==='servico'?'COMO POSSO AJUDAR':x.postType==='bairro'?'CONHEÇA A REGIÃO':x.postType==='institucional'?'APRESENTAÇÃO':'IMÓVEL EM FOCO'}
function cards(x){if(x.postType!=='imovel'){
const pts=x.pontosArr.concat(['Confira os detalhes','Avalie as informações','Procure orientação']);return [
{t:x.assunto||'Assunto a definir',b:x.publico||'Conteúdo informativo'},
{t:pts[0],b:'Ponto 1 de 3 · revise antes de publicar'},
{t:pts[1],b:'Ponto 2 de 3 · informação a conferir'},
{t:pts[2],b:'Ponto 3 de 3 · verifique a fonte'},
{t:x.cta||'Quer saber mais?',b:x.cred||'Preencha nome e CRECI'}];}
return [
{t:x.tipo+(x.bairro?' em '+x.bairro:x.cidade?' em '+x.cidade:''),b:join([x.operacao.toUpperCase(),x.precoTxt],' · ')},
{t:x.specs||'Conheça os detalhes',b:'Características confirmadas do imóvel'},
{t:x.dest.slice(0,2).join(' · ')||'Destaques do imóvel',b:'Confira as características antes de publicar'},
{t:x.loc||'Localização a informar',b:x.dest[2]||'Consulte a localização e a disponibilidade'},
{t:'Quer conhecer?',b:join([x.action,x.codigo?'Ref. '+x.codigo:''],' · ')}];}
function card(x,i){const c=cards(x);const base=i===2?(x.postType==='imovel'?{t:x.dest.slice(0,2).join(' · ')||'Quer conhecer?',b:x.action}: {t:x.pontosArr.slice(1,3).join(' · ')||c[2].t,b:x.cta||'Saiba mais'}):c[i];return {...base,...slideEdits[i]}}
function sign(x){return join([x.cred,x.contato?'Contato: '+x.contato:''],'\n')}
function intro(x){return x.tom==='elegante'?'Informações para conhecer com atenção':x.tom==='consultivo'?'Vamos conversar sobre o que é importante para você?':'Confira as informações'}
function caption(x){if(x.postType!=='imovel')return [x.assunto||'Conteúdo para você','',intro(x),...x.pontosArr.map((p,i)=>`${i+1}. ${p}`),'',x.cta,sign(x),'','Confira e adapte as informações antes de publicar.'].filter(Boolean).join('\n');return [x.tipo+' '+x.operation+(x.loc?' em '+x.loc:''),x.specs,x.dest.length?'Destaques: '+x.dest.join(' · '):'',x.precoTxt?'Valor anunciado: '+x.precoTxt:'',x.action,x.codigo?'Ref. '+x.codigo:'',sign(x)].filter(Boolean).join('\n\n')}
function carousel(x){return Array.from({length:3},(_,i)=>{let c=card(x,i);return `SLIDE ${i+1}\n${c.t}\n${c.b}`}).join('\n\n')+'\n\nRevise dados, imagem, autoria e identificação profissional.'}
const makers={legenda:caption,carrossel:carousel};const titles={legenda:'Legenda para Instagram',carrossel:'Textos de 3 slides'};
function textOf(k){return Object.prototype.hasOwnProperty.call(textEdits,k)?textEdits[k]:makers[k](d())}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function notify(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('toast').classList.remove('show'),2600)}
function fontFamily(x){return x.fonte==='editorial'?'Georgia, serif':x.fonte==='rounded'?'Trebuchet MS, sans-serif':x.fonte==='condensed'?'Arial Narrow, Arial, sans-serif':x.fonte==='mono'?'Verdana, sans-serif':x.fonte==='classic'?'Palatino Linotype, Palatino, Georgia, serif':'Arial, sans-serif'}
function gradient(x){const bases={noturno:['#3d636a','#12292f'],areia:['#ac886a','#3b2e25'],azul:['#335b88','#10243e']};return bases[x.visual]||bases.noturno}
function imageFor(i){let n=photoForSlide[i];return Number.isInteger(n)&&gallery[n]?gallery[n]:null}

const visualDefaults=[
 {layout:'editorial',titleSize:86,titleAlign:'left',titleX:7,titleY:58,photoZoom:100,photoX:50,photoY:50,overlayStrength:65},
 {layout:'split',titleSize:82,titleAlign:'left',titleX:7,titleY:63,photoZoom:100,photoX:50,photoY:50,overlayStrength:48},
 {layout:'editorial',titleSize:76,titleAlign:'left',titleX:8,titleY:56,photoZoom:100,photoX:50,photoY:50,overlayStrength:65}
];
const layoutNames={editorial:'Editorial fotográfico',split:'Divisão elegante'};
let visualEdits=Array.from({length:3},(_,i)=>({...visualDefaults[i]}));
let pointerActive=false;
const visualKeys=['layout'];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function styleAt(i){const x=d(),defaults=visualDefaults[i];const s={...defaults,...(visualEdits[i]||{})};return {...s,titleSize:clamp(Number(s.titleSize)||defaults.titleSize,34,116),titleX:clamp(Number(s.titleX)||defaults.titleX,8,92),titleY:clamp(Number(s.titleY)||defaults.titleY,12,77),photoZoom:clamp(Number(s.photoZoom)||100,100,170),photoX:clamp(Number(s.photoX)??50,0,100),photoY:clamp(Number(s.photoY)??50,0,100),overlayStrength:clamp(Number(s.overlayStrength)??60,0,95),titleColor:validHex(s.titleColor)?s.titleColor:x.corTexto,subtitleColor:validHex(s.subtitleColor)?s.subtitleColor:x.corTexto,layout:layoutNames[s.layout]?s.layout:'editorial',titleAlign:['left','right','center'].includes(s.titleAlign)?s.titleAlign:'left'} }
function validHex(s){return typeof s==='string'&&/^#[0-9a-fA-F]{6}$/.test(s)}
function rgba(hex,alpha){let s=(validHex(hex)?hex:'#142a31').slice(1);return `rgba(${parseInt(s.slice(0,2),16)},${parseInt(s.slice(2,4),16)},${parseInt(s.slice(4,6),16)},${clamp(alpha,0,1)})`}
function photoCover(ctx,photo,rect,sty,progress=0,move='zoom'){
 if(!photo)return;
 const im=photo.img,{x,y,w,h}=rect;
 let factor=Math.max(w/im.naturalWidth,h/im.naturalHeight)*(sty.photoZoom/100)*(move==='zoom'?1+progress*.06:1);
 let dw=im.naturalWidth*factor,dh=im.naturalHeight*factor;
 let xx=sty.photoX/100,yy=sty.photoY/100;
 if(move==='pan'){xx=clamp(xx + (progress-.5)*.14,0,1)}
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(im,x-(dw-w)*xx,y-(dh-h)*yy,dw,dh);ctx.restore();
}
function fitText(ctx,text,maxWidth,maxLines,size,minSize,font,weight='800'){
 const words=String(text||'').trim().split(/\s+/).filter(Boolean);let lines=[];
 for(let fs=size;fs>=minSize;fs-=2){
  ctx.font=`${weight} ${fs}px ${font}`;let row='';lines=[];
  for(const word of words){const test=row?row+' '+word:word;
   if(ctx.measureText(test).width<=maxWidth){row=test;continue}
   if(row){lines.push(row);row=''}
   if(ctx.measureText(word).width<=maxWidth){row=word;continue}
   let part='';for(const c of [...word]){if(part&&ctx.measureText(part+c).width>maxWidth){lines.push(part);part=''}part+=c}row=part;
  }
  if(row)lines.push(row);
  if(lines.length<=maxLines||fs-2<minSize){if(lines.length>maxLines){lines=lines.slice(0,maxLines);let last=lines[lines.length-1];while(last.length>1&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);lines[lines.length-1]=last+'…'}return {size:fs,lines}}
 }
 return {size:minSize,lines:[]}
}
function rounded(ctx,x,y,w,h,r=16){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function paintScene(ctx,i,W,H,progress=0,fade=1,motion='zoom',offsetX=0){
 const x=d(),c=card(x,i),sty=styleAt(i),base=gradient(x),bg=validHex(x.corFundo)?x.corFundo:base[1],accent=validHex(x.corDestaque)?x.corDestaque:'#ddaa73',font=fontFamily(x),photo=imageFor(i);
 const k=W/1080,M=70*k,foot=79*k,layout=sty.layout;
 ctx.save();ctx.globalAlpha=fade;if(offsetX)ctx.translate(offsetX,0);
 ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 const full={x:0,y:0,w:W,h:H};
 if(layout==='editorial'){
  if(photo)photoCover(ctx,photo,full,sty,progress,motion);else{let grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,base[0]);grad.addColorStop(1,base[1]);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H)}
  let shade=ctx.createLinearGradient(0,0,0,H);let strength=sty.overlayStrength/100;shade.addColorStop(0,rgba(bg,Math.max(.16,strength*.65)));shade.addColorStop(.42,rgba(bg,strength*.28));shade.addColorStop(1,rgba(bg,Math.min(.98,strength+.27)));ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);

 }
 else if(layout==='split'){
  if(photo)photoCover(ctx,photo,{x:0,y:0,w:W,h:H*.56},sty,progress,motion);else{ctx.fillStyle=base[0];ctx.fillRect(0,0,W,H*.56)}
  ctx.fillStyle=accent;ctx.fillRect(0,H*.56,W,7*k);ctx.fillStyle=bg;ctx.fillRect(0,H*.56+7*k,W,H*.44)
 }
 // Tags and micro details
 let ink=sty.titleColor,sub=sty.subtitleColor;
 if(layout==='minimal'||layout==='frame'||layout==='split'||layout==='magazine'){
  if(!visualEdits[i]?.titleColor)ink=contrastColor(bg);
  if(!visualEdits[i]?.subtitleColor)sub=contrastColor(bg);
 }
 const micro=layout==='magazine'?Math.min(24*k,24*k):26*k;
 ctx.font=`700 ${micro}px ${font}`;ctx.fillStyle=layout==='editorial'||layout==='banner'?sty.titleColor:accent;
 ctx.textAlign='left';const topLabel=themeTitle(x);ctx.fillText(topLabel,M,Math.max(44*k,H*.05));
 ctx.textAlign='right';ctx.fillText(`${String(i+1).padStart(2,'0')} / 03`,W-M,Math.max(44*k,H*.05));ctx.textAlign='left';
 // On-photo layouts get a local text shadow for contrast; other layouts use solid panels.
 const panelRight=layout==='magazine'?W*.43:W;
 const targetX=layout==='magazine'?(M+(sty.titleX-8)/84*(panelRight-2*M)):sty.titleX/100*W,targetY=sty.titleY/100*H;
 const cap=layout==='magazine'?Math.max(120*k,panelRight-M-targetX):W-2*M;
 let boxW=Math.min(cap,(sty.titleAlign==='center'?2*Math.min(targetX,panelRight-targetX):sty.titleAlign==='right'?targetX-M:panelRight-M-targetX));
 boxW=Math.max(120*k,boxW);
 if(layout==='magazine')boxW=Math.min(boxW,cap);
 let alignX=sty.titleAlign==='center'?targetX:sty.titleAlign==='right'?targetX:targetX;
 // Keep lower region for legal signature; text is automatically shrunk, then shortened if necessary.
 const maxBottom=H-125*k;
 const available=clamp(maxBottom-targetY,80*k,H);
 const maxLines=Math.max(1,Math.min(6,Math.floor(available/(40*k))));
 let desired=sty.titleSize*k,fit=fitText(ctx,c.t,boxW,Math.min(maxLines,5),desired,Math.min(desired,29*k),font,'800');
 const height=fit.lines.length*fit.size*1.13, maxSubStart=maxBottom-67*k;
 if(height+targetY>maxSubStart){let scale=clamp((maxSubStart-targetY)/Math.max(1,height),.60,1);fit=fitText(ctx,c.t,boxW,4,Math.max(30*k,fit.size*scale),25*k,font,'800')}
 ctx.fillStyle=ink;ctx.textAlign=sty.titleAlign;ctx.textBaseline='alphabetic';ctx.font=`800 ${fit.size}px ${font}`;
 if(layout==='editorial'){ctx.shadowColor='rgba(0,0,0,.26)';ctx.shadowBlur=15*k}
 let yy=targetY+fit.size;
 for(let ln of fit.lines){ctx.fillText(ln,alignX,yy);yy+=fit.size*1.13}
 ctx.shadowBlur=0;
 let subSize=clamp(29*k,20*k,31*k),subY=Math.min(maxSubStart,yy+17*k);
 const maxSubLines=Math.max(1,Math.floor((maxBottom-subY)/(subSize*1.24)));
 const subfit=fitText(ctx,c.b,boxW,Math.min(3,maxSubLines),subSize,21*k,font,'500');
 ctx.fillStyle=sub;ctx.font=`500 ${subfit.size}px ${font}`;let sy=subY+subfit.size;
 for(const line of subfit.lines){if(sy>=maxBottom)break;ctx.fillText(line,alignX,sy);sy+=subfit.size*1.23}
 ctx.textAlign='left';
 // A arte permanece limpa, mesmo enquanto os dados profissionais são preenchidos.
 // O checklist do editor informa quando nome ou CRECI ainda estão ausentes.
 // A faixa de identificação é renderizada somente quando há dados profissionais.
 if(x.cred){
  ctx.fillStyle=rgba(bg,.92);ctx.fillRect(0,H-foot,W,foot);ctx.fillStyle=accent;ctx.fillRect(M,H-foot,75*k,5*k);
  ctx.fillStyle='#fff';ctx.font=`600 ${Math.max(18,23*k)}px Arial, sans-serif`;
  ctx.fillText(x.cred.slice(0,90),M,H-28*k,W-2*M);
 }
 ctx.restore();
}
function contrastColor(hex){if(!validHex(hex))return '#ffffff';let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return (r*.299+g*.587+b*.114)>158?'#172d33':'#ffffff'}
function dimensions(){const x=d();return x.formato==='9:16'?[1080,1920]:x.formato==='1:1'?[1080,1080]:[1080,1350]}
function updatePreview(){const cv=$('previewCanvas'),[ow,oh]=dimensions();let w=540,h=Math.round(oh*w/ow);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}$('preview').style.setProperty('--ratio',ow+' / '+oh);paintScene(cv.getContext('2d',{alpha:false}),slide,w,h)}
function syncVisualControls(){let s=styleAt(slide);for(let k of visualKeys){if($(k))$(k).value=s[k]}document.querySelectorAll('[data-layout]').forEach(b=>{let active=b.dataset.layout===s.layout;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}
function reloadPhotoSelect(){const box=$('photoForSlide'),selected=photoForSlide[slide];box.replaceChildren(new Option('Sem foto (fundo colorido)',''));gallery.forEach((im,i)=>box.add(new Option(`${i+1}. ${im.name.slice(0,27)}`,String(i))));box.value=selected===null?'':String(selected);$('slidePhotoHint').textContent=gallery.length>=12?'Galeria cheia (12 fotos). Remova uma foto em Informações e fotografias para adicionar outra.':`Há ${gallery.length} foto(s) na galeria. Adicione uma agora ou escolha uma no menu acima. JPG, PNG ou WebP, até 12 MB.`}
function renderGallery(){const g=$('gallery');g.replaceChildren();$('imgcount').textContent=`${gallery.length} de 12 fotos carregadas`;gallery.forEach((im,i)=>{let wrap=document.createElement('div');wrap.className='asset'+(photoForSlide[slide]===i?' on':'');let img=document.createElement('img');img.src=im.url;img.alt='Aplicar '+im.name+' ao slide '+(slide+1);img.tabIndex=0;function choose(){photoForSlide[slide]=i;render()}img.addEventListener('click',choose);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}});let n=document.createElement('small');n.textContent=im.name;let bar=document.createElement('div');bar.className='assetbar';let nb=document.createElement('small');nb.textContent='Foto '+(i+1);let rem=document.createElement('button');rem.type='button';rem.textContent='Remover';rem.addEventListener('click',()=>removePhoto(i));bar.append(nb,rem);wrap.append(img,n,bar);g.append(wrap)});reloadPhotoSelect()}
function render(){const x=d();$('propertyFields').hidden=x.postType!=='imovel';$('topicFields').hidden=x.postType==='imovel';$('outtitle').textContent=titles[active];if($('output').value!==textOf(active))$('output').value=textOf(active);const c=card(x,slide);$('slideTitle').value=c.t;$('slideSub').value=c.b;syncVisualControls();updatePreview();const missing=[];if(!x.nome)missing.push('nome profissional');if(!x.creci)missing.push('CRECI');if(x.postType==='imovel'&&!x.loc)missing.push('localização');if(x.postType!=='imovel'&&!x.assunto)missing.push('assunto');$('check').innerHTML='<strong>Checklist antes de publicar:</strong> '+(missing.length?'Complete: '+missing.map(escapeHtml).join(', ')+'. ':'')+'Confirme disponibilidade, preço, dados, autorização de divulgação, direitos de imagem e regras profissionais aplicáveis. O exemplo inicial é fictício.';document.querySelectorAll('[data-slide]').forEach(b=>{b.classList.toggle('current',Number(b.dataset.slide)===slide);b.setAttribute('aria-pressed',String(Number(b.dataset.slide)===slide))});renderGallery();if(typeof updateGuide==='function')updateGuide()}
function renderSlideOnly(){updatePreview();if(active==='carrossel')$('output').value=textOf(active);if(typeof updateGuide==='function')updateGuide()}
function updateImagePhoto(id,files){return Promise.all(Array.from(files).map(async f=>{
 if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>12e6)throw new Error('Imagem inválida ou maior que 12 MB');const fileUrl=URL.createObjectURL(f);
 try{let original=await loadImage(fileUrl);let cv=document.createElement('canvas'),scale=Math.min(1,1800/Math.max(original.naturalWidth,original.naturalHeight));cv.width=Math.max(1,Math.round(original.naturalWidth*scale));cv.height=Math.max(1,Math.round(original.naturalHeight*scale));cv.getContext('2d').drawImage(original,0,0,cv.width,cv.height);let blob=await new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(new Error('Falha ao converter')),'image/jpeg',.82));return await newPhoto(f.name,blob)}finally{URL.revokeObjectURL(fileUrl)}
 }))}
function loadImage(url){return new Promise((res,rej)=>{let im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(new Error('Imagem corrompida'));im.src=url})}
async function newPhoto(name,blob){const url=URL.createObjectURL(blob);try{let img=await loadImage(url);return {name:String(name||'Foto').slice(0,150),url,img,blob}}catch(e){URL.revokeObjectURL(url);throw e}}
function removePhoto(i){if(!gallery[i])return;URL.revokeObjectURL(gallery[i].url);gallery.splice(i,1);photoForSlide=photoForSlide.map(n=>n===i?null:n!==null&&n>i?n-1:n);render();notify('Foto removida. Confira os slides.')}
function clearPhotos(noRender=false){gallery.forEach(im=>URL.revokeObjectURL(im.url));gallery=[];photoForSlide=[null,null,null];$('fotos').value='';if(!noRender)render()}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
function paint(i=slide){const [w,h]=dimensions(),cv=document.createElement('canvas');cv.width=w;cv.height=h;paintScene(cv.getContext('2d',{alpha:false}),i,w,h);return cv}
function slideBlob(i){return new Promise((res,rej)=>paint(i).toBlob(b=>b?res(b):rej(new Error('Falha ao gerar imagem')),'image/png'))}
function slug(s){return (s||'studio-imovel').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,65)||'studio-imovel'}
async function copy(){try{await navigator.clipboard.writeText(textOf(active));notify('Texto copiado.')}catch{try{let ta=document.createElement('textarea');ta.value=textOf(active);document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();notify('Texto copiado.')}catch{notify('Use o botão Baixar TXT.')}}}
// Controls
$('form').addEventListener('input',e=>{if(e.target.id!=='fotos')render()});$('form').addEventListener('change',e=>{if(e.target.id!=='fotos')render()});
$('postType').addEventListener('change',()=>{const preset=topics[val('postType')];if(preset)Object.entries(preset).forEach(([k,v])=>$(k).value=v);slideEdits=Array.from({length:3},()=>({}));textEdits={};render()});
$('visual').addEventListener('change',()=>{let palettes={noturno:['#142a31','#ddaa73'],areia:['#3c2f27','#dabb99'],azul:['#10243e','#a7c7e7']};let p=palettes[val('visual')];$('corFundo').value=p[0];$('corDestaque').value=p[1];render()});
$('output').addEventListener('input',()=>textEdits[active]=$('output').value);
$('regenText').addEventListener('click',()=>{delete textEdits[active];render();notify('Modelo de texto restaurado.')});
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.tab;document.querySelectorAll('.tab').forEach(q=>{q.classList.toggle('active',q===b);q.setAttribute('aria-selected',String(q===b))});render()}));
document.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>{slide=Number(b.dataset.slide);render()}));
$('slideTitle').addEventListener('input',e=>{slideEdits[slide].t=e.target.value;hasEdited=true;renderSlideOnly()});$('slideSub').addEventListener('input',e=>{slideEdits[slide].b=e.target.value;hasEdited=true;renderSlideOnly()});
$('resetSlide').addEventListener('click',()=>{slideEdits[slide]={};render();notify('Textos restaurados.')});
$('photoForSlide').addEventListener('change',()=>{photoForSlide[slide]=val('photoForSlide')===''?null:Number(val('photoForSlide'));render()});
$('layoutPreset').addEventListener('change',()=>{visualEdits[slide].layout=val('layoutPreset');render()});
document.querySelectorAll('[data-layout]').forEach(b=>b.addEventListener('click',()=>{visualEdits[slide].layout=b.dataset.layout;render()}));
for(let k of visualKeys.filter(k=>k!=='layout'))$(k).addEventListener('input',()=>{visualEdits[slide][k]=['titleSize','titleX','titleY','photoZoom','photoX','photoY','overlayStrength'].includes(k)?Number($(k).value):$(k).value;syncVisualControls();updatePreview()});
$('resetVisual').addEventListener('click',()=>{visualEdits[slide]={...visualDefaults[slide]};render();notify('Visual do slide restaurado.')});
async function handlePhotoFiles(input,assignToCurrentSlide){const incoming=Array.from(input.files||[]);if(!incoming.length)return;const available=12-gallery.length;if(available<=0){notify('Limite de 12 fotos atingido. Remova uma foto na galeria para adicionar outra.');input.value='';return;}if(incoming.length>available)notify('O limite é de 12 imagens.');const currentSlide=slide;try{const added=await updateImagePhoto(input.id,incoming.slice(0,available));if(!added.length)return;const firstNewIndex=gallery.length;gallery.push(...added);if(assignToCurrentSlide){photoForSlide[currentSlide]=firstNewIndex;}else{for(let i=0;i<3;i++)if(photoForSlide[i]===null&&gallery.length)photoForSlide[i]=i%gallery.length;}render();notify(assignToCurrentSlide?'Foto adicionada e aplicada ao slide '+(currentSlide+1)+'.':`${added.length} foto(s) carregada(s).`);}catch(err){console.error(err);notify('Imagem inválida. Use JPG, PNG ou WebP até 12 MB.')}finally{input.value='';}}
$('fotos').addEventListener('change',e=>handlePhotoFiles(e.target,false));
$('addSlidePhoto').addEventListener('click',()=>{if(gallery.length>=12){notify('Limite de 12 fotos atingido. Remova uma foto na galeria para adicionar outra.');return;}$('slidePhotoFile').click()});
$('slidePhotoFile').addEventListener('change',e=>handlePhotoFiles(e.target,true));
$('clearPhotos').addEventListener('click',()=>{clearPhotos();notify('Fotos removidas.')});
$('copy').addEventListener('click',copy);$('download').addEventListener('click',()=>downloadBlob(new Blob([textOf(active)],{type:'text/plain;charset=utf-8'}),`studio-${active}.txt`));
$('png').addEventListener('click',async()=>{try{downloadBlob(await slideBlob(slide),slug(val('projectName'))+`-slide-${slide+1}.png`);hasExported=true;updateGuide();notify('PNG exportado.')}catch(e){console.error(e);notify('Falha ao gerar PNG.')}});
$('sample').addEventListener('click',()=>{for(let k of fieldIDs)$(k).value=defaultForm[k];hasEdited=false;hasVisitedTexts=false;hasExported=false;textEdits={};slideEdits=Array.from({length:3},()=>({}));visualEdits=Array.from({length:3},(_,i)=>({...visualDefaults[i]}));slide=0;active='legenda';document.querySelectorAll('.tab').forEach(q=>{q.classList.toggle('active',q.dataset.tab===active);q.setAttribute('aria-selected',String(q.dataset.tab===active))});clearPhotos(true);render();notify('Exemplo fictício restaurado.')});

// Visual guide — Free
let hasVisitedTexts=false,hasExported=false,hasEdited=false;
function goToTarget(id){if(id==='planningPanel'||id==='textLibrary')$(id).open=true;let el=$(id);if(el)el.scrollIntoView({behavior:'smooth',block:'center'});}
function updateGuide(){const data=gallery.length>0||fieldIDs.some(k=>$(k).value!==defaultForm[k]);const edited=hasEdited||slideEdits.some(e=>Object.keys(e).length)||visualEdits.some((e,i)=>JSON.stringify(e)!==JSON.stringify(visualDefaults[i]));const done=[data,edited,hasVisitedTexts,hasExported];const next=done.indexOf(false);const items=[['Preencha os dados e adicione fotos','Escolha o tipo de conteúdo e adicione fotos se desejar.','planningPanel'],['Personalize os três slides','Altere títulos, descrições, imagens e layouts.','editor'],['Revise seus textos','Confira a legenda e os textos antes de publicar.','textLibrary'],['Baixe seus PNGs','Selecione cada slide e baixe o PNG individualmente.','png']];const n=next<0?3:next;document.querySelectorAll('.guide-card').forEach(el=>{const i=Number(el.dataset.step)-1;el.classList.toggle('done',done[i]);el.classList.toggle('current',i===n)});$('nextStepTitle').textContent=next<0?'Você concluiu o fluxo!':items[n][0];$('nextStepText').textContent=items[n][1];$('nextStepBtn').dataset.go=items[n][2]}
document.querySelectorAll('.guide-card').forEach(btn=>btn.addEventListener('click',()=>goToTarget(btn.dataset.go)));$('nextStepBtn').addEventListener('click',()=>goToTarget($('nextStepBtn').dataset.go));$('textLibrary').addEventListener('toggle',()=>{if($('textLibrary').open&&tourIndex<0){hasVisitedTexts=true;updateGuide()}});$('output').addEventListener('input',()=>{hasVisitedTexts=true;updateGuide()});$('addSlidePhoto').addEventListener('click',()=>{hasEdited=true;updateGuide()});
// Initial tour
const TOUR_KEY='aurasync-free-tour-v1';
const tourSteps=[
 {selector:'#guide',title:'Bem-vindo ao Studio Free',text:'Crie um carrossel de três slides, com dois layouts e exportação PNG gratuita.'},
 {selector:'#postType',title:'Escolha o conteúdo',text:'Selecione divulgação de imóvel ou outro tipo de publicação e preencha os dados.',before:()=>{$('planningPanel').open=true}},
 {selector:'#fotos',title:'Adicione suas fotos',text:'Carregue até 12 fotos autorizadas. Você pode reaproveitá-las nos três slides.',before:()=>{$('planningPanel').open=true}},
 {selector:'#slideButtons',title:'Selecione um slide',text:'Escolha 1, 2 ou 3. Edite título, descrição e fotografia.'},
 {selector:'#addSlidePhoto',title:'Personalize a imagem',text:'Envie uma foto diretamente neste slide ou selecione uma da galeria.'},
 {selector:'#layoutChoices',title:'Escolha o visual',text:'Experimente Editorial ou Dividido. A prévia acompanha as mudanças.'},
 {selector:'#textLibrary summary',title:'Revise a legenda',text:'Abra esta seção para conferir, editar e copiar seus textos.'},
 {selector:'#png',title:'Exporte suas artes',text:'Baixe os três slides individualmente em PNG. Não há marca-d’água. Salve os arquivos antes de sair.'}
];
let tourIndex=-1;
function safeStorageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function safeStorageSet(key,value){try{localStorage.setItem(key,value)}catch{}}
function clearTourTarget(){document.querySelectorAll('.tour-target').forEach(el=>el.classList.remove('tour-target','tour-pulse'))}
function getTourElement(step){return document.querySelector(step.selector)}
function positionTourPopover(target){const pop=$('tourPopover');const rect=target.getBoundingClientRect();const pad=12;const vw=window.innerWidth;const vh=window.innerHeight;let top=rect.bottom+14;let left=Math.min(Math.max(pad,rect.left),vw-pop.offsetWidth-pad);if(top+pop.offsetHeight>vh-pad)top=Math.max(pad,rect.top-pop.offsetHeight-14);if(top<pad)top=pad;pop.style.top=`${top}px`;pop.style.left=`${left}px`}
function showTourStep(i){tourIndex=i;const step=tourSteps[i];if(step.before)step.before();const target=getTourElement(step);if(!target)return;clearTourTarget();target.classList.add('tour-target');target.scrollIntoView({behavior:'instant',block:'center'});$('tourBackdrop').hidden=false;$('tourPopover').hidden=false;$('tourStepLabel').textContent=`Etapa ${i+1} de ${tourSteps.length}`;$('tourTitle').textContent=step.title;$('tourText').textContent=step.text;$('tourPrev').disabled=i===0;$('tourNext').textContent=i===tourSteps.length-1?'Concluir':'Próximo';positionTourPopover(target);$('tourNext').focus({preventScroll:true})}
function closeTour(markSeen=true){tourIndex=-1;clearTourTarget();$('tourBackdrop').hidden=true;$('tourPopover').hidden=true;document.body.classList.remove('tour-open');if(markSeen)safeStorageSet(TOUR_KEY,'done');$('startTour').focus({preventScroll:true})}
function startTour(force=true){if(force)safeStorageSet(TOUR_KEY,'done');showTourStep(0)}
function nextTour(){if(tourIndex<tourSteps.length-1)showTourStep(tourIndex+1);else closeTour(true)}
function prevTour(){if(tourIndex>0)showTourStep(tourIndex-1)}
$('startTour').addEventListener('click',()=>startTour(true));$('tourNext').addEventListener('click',nextTour);$('tourPrev').addEventListener('click',prevTour);$('tourSkip').addEventListener('click',()=>closeTour(true));$('tourBackdrop').addEventListener('click',()=>closeTour(true));window.addEventListener('resize',()=>{if(tourIndex>=0){const el=getTourElement(tourSteps[tourIndex]);if(el)positionTourPopover(el)}});window.addEventListener('scroll',()=>{if(tourIndex>=0){const el=getTourElement(tourSteps[tourIndex]);if(el)positionTourPopover(el)}},{passive:true});document.addEventListener('keydown',e=>{if(tourIndex<0)return;if(e.key==='Escape')closeTour(true);if(e.key==='ArrowRight'){e.preventDefault();nextTour()}if(e.key==='ArrowLeft'){e.preventDefault();prevTour()}if(e.key==='Tab'){const buttons=[...$('tourPopover').querySelectorAll('button:not(:disabled)')];const i=buttons.indexOf(document.activeElement);e.preventDefault();buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus()}});
render();updateGuide();setTimeout(()=>{if(!safeStorageGet(TOUR_KEY))startTour(false)},700);})();
