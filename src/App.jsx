import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

/* ══ CONFIG ══ */
const USERS=[
  {id:"03ee67d9-fca8-4672-a139-4880e4eb406b",name:"Axel HAZOUME",short:"Axel",color:"#E74C3C"},
  {id:"af436357-51d5-4ae4-9052-f77950ec5c98",name:"Guillaume Hermosilla Lara",short:"Guillaume",color:"#3498DB"},
  {id:"294d872b-594c-8191-920a-000216bb2c0c",name:"Lucile Brun",short:"Lucile",color:"#9B59B6"},
  {id:"7e764ade-b9b3-4cfe-a5ca-aadc7816660d",name:"Paul Froment",short:"Paul",color:"#2ECC71"},
];
const CFG=[
  {name:"Contacts 2026",dsId:"343dfc12-15cc-80b0-ac5d-e7c6de8026e9",dsUrl:"collection://343dfc12-15cc-801f-b97f-000b41041867",viewUrl:"view://343dfc12-15cc-8087-b53b-000c7f890fad",titleProp:"Prénom",schema:{"Prénom":{type:"title"},"N. Famille":{type:"text"},"Fonction":{type:"select",options:[{name:"Président"},{name:"Directeur"},{name:"Associé"},{name:"Consultant"},{name:"Manager"},{name:"Autre"}]},"Email Address":{type:"email"},"Phone Number":{type:"phone_number"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Réunions 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-802b-bbe0-000b16ae3566"}}},
  {name:"Société 2026",dsId:"343dfc12-15cc-80d8-bca4-f624826c626c",dsUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b",viewUrl:"view://343dfc12-15cc-80ba-83a4-000c8db9d508",titleProp:"Nom",schema:{"Nom":{type:"title"},"Statut":{type:"select",options:[{name:"Partenaire"},{name:"Client"},{name:"Prospect"},{name:"Fournisseur"},{name:"Autre"}]},"Lieu":{type:"place"},"Contacts 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-801f-b97f-000b41041867"},"Réunions 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-802b-bbe0-000b16ae3566"},"Livrables 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80a4-8b0c-000b0dc0766d"},"Documents 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80e7-a558-000b92a6fff3"},"Dossiers 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3"},"Factures 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8005-9533-000bb82f3280"},"Jalons annuels Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-80e3-8d11-000bcd38b4f9"},"Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-8070-8f8e-000bba2683fe"},"Risques & Alertes 2026":{type:"relation",dataSourceUrl:"collection://c49aaa84-043e-4e84-9a46-1a3cef2ba656"}}},
  {name:"Réunions 2026",dsId:"343dfc12-15cc-8036-a376-f749fecab404",dsUrl:"collection://343dfc12-15cc-802b-bbe0-000b16ae3566",viewUrl:"view://343dfc12-15cc-80cd-ac55-000cc98aa787",titleProp:"Nom",schema:{"Nom":{type:"title"},"Type":{type:"select",options:[{name:"Client"},{name:"Interne"},{name:"Kick-off"},{name:"Suivi"},{name:"Restitution"},{name:"Autre"}]},"Statut":{type:"select",options:[{name:"A valider"},{name:"planifié"},{name:"annulé"},{name:"réalisé"}]},"Priorité":{type:"select",options:[{name:"Haute"},{name:"Moyenne"},{name:"Basse"}]},"Date":{type:"date"},"Participants":{type:"person"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Contacts 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-801f-b97f-000b41041867"},"Livrables 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80a4-8b0c-000b0dc0766d"},"Documents 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80e7-a558-000b92a6fff3"},"Dossiers 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3"},"Jalons annuels Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-80e3-8d11-000bcd38b4f9"},"Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-8070-8f8e-000bba2683fe"}}},
  {name:"Livrables 2026",dsId:"343dfc12-15cc-8005-9cad-f8bd538b9b99",dsUrl:"collection://343dfc12-15cc-80a4-8b0c-000b0dc0766d",viewUrl:"view://343dfc12-15cc-80a3-a931-000ca1ba17ba",titleProp:"Nom",schema:{"Nom":{type:"title"},"Type":{type:"select",options:[{name:"calcul"},{name:"rapport"},{name:"présentation"},{name:"analyse"},{name:"déclaration"},{name:"autre"}]},"Etat":{type:"select",options:[{name:"En cours"},{name:"En validation"},{name:"Terminé"},{name:"En attente"},{name:"Annulé"}]},"Priorité":{type:"select",options:[{name:"Haute"},{name:"Moyenne"},{name:"Basse"}]},"Deadline":{type:"date"},"Assigned To":{type:"person"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Documents 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80e7-a558-000b92a6fff3"},"Dossiers 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3"},"Jalons annuels Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-80e3-8d11-000bcd38b4f9"}}},
  {name:"Documents 2026",dsId:"343dfc12-15cc-80d1-961b-ff7b013237c2",dsUrl:"collection://343dfc12-15cc-80e7-a558-000b92a6fff3",viewUrl:"view://343dfc12-15cc-80e6-9499-000cf4bc63dc",titleProp:"Nom",schema:{"Nom":{type:"title"},"Type":{type:"select",options:[{name:"Sheet"},{name:"Doc"},{name:"Slide"},{name:"PDF"},{name:"Image"},{name:"Autre"}]},"userDefined:URL":{type:"url"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Livrables 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80a4-8b0c-000b0dc0766d"},"Dossiers 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3"}}},
  {name:"Dossiers 2026",dsId:"343dfc12-15cc-80b0-ba49-ca34c7d85596",dsUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3",viewUrl:"view://343dfc12-15cc-808a-ac35-000c7be09a4a",titleProp:"Nom",schema:{"Nom":{type:"title"},"Type":{type:"select",options:[{name:"CII"},{name:"CIR"},{name:"JEI"},{name:"Audit"},{name:"AGR"},{name:"Subvention"},{name:"Autre"}]},"Personne":{type:"person"},"Année":{type:"select",options:[{name:"2018"},{name:"2019"},{name:"2020"},{name:"2021"},{name:"2022"},{name:"2023"},{name:"2024"},{name:"2025"},{name:"2026"}]},"Dépenses engagées":{type:"rollup"},"Dépenses valorisables":{type:"rollup"},"Montant CICO":{type:"rollup"},"Montant CIR/CII":{type:"rollup"},"Subvention perçue":{type:"rollup"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Livrables 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80a4-8b0c-000b0dc0766d"},"Documents 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80e7-a558-000b92a6fff3"},"Factures 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8005-9533-000bb82f3280"},"Réunions 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-802b-bbe0-000b16ae3566"},"Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-80e3-8d11-000bcd38b4f9"},"Risques & Alertes 2026":{type:"relation",dataSourceUrl:"collection://c49aaa84-043e-4e84-9a46-1a3cef2ba656"}}},
  {name:"Factures 2026",dsId:"343dfc12-15cc-8046-9ae7-f83e2fa815e5",dsUrl:"collection://343dfc12-15cc-8005-9533-000bb82f3280",viewUrl:"view://343dfc12-15cc-801e-916e-000c84cc51d2",titleProp:"Nom",schema:{"Nom":{type:"title"},"Type":{type:"select",options:[{name:"Forfait"},{name:"Acompte"},{name:"Solde"}]},"État":{type:"select",options:[{name:"A facturer"},{name:"Envoyée"},{name:"Payée"},{name:"En retard"},{name:"Annulée"}]},"Exercice":{type:"select",options:[{name:"2024"},{name:"2025"},{name:"2026"}]},"Montant":{type:"number"},"Date de facturation":{type:"date"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Dossiers 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3"}}},
  {name:"Projets 2026",dsId:"346dfc12-15cc-8021-897a-fa6b2cf1ae37",dsUrl:"collection://346dfc12-15cc-8070-8f8e-000bba2683fe",viewUrl:"view://346dfc12-15cc-8097-b1b8-000c917088ea",titleProp:"Nom",schema:{"Nom":{type:"title"},"Objectif":{type:"text"},"Verrous":{type:"text"},"Axe de R&DI":{type:"select",options:[{name:"Alimentation animale - BDD propiétaire"},{name:"Inno Fonctionnelle - Agrégateur de données dans le BTP"}]},"Démarrage":{type:"select",options:[{name:"2018"},{name:"2019"},{name:"2020"},{name:"2021"},{name:"2022"},{name:"2023"},{name:"2024"},{name:"2025"},{name:"2026"}]},"Cloture":{type:"select",options:[{name:"2019"},{name:"2020"},{name:"2021"},{name:"2022"},{name:"2023"},{name:"2024"},{name:"2025"},{name:"2026"},{name:"2027"}]},"TRL":{type:"select",options:[{name:"1"},{name:"2"},{name:"3"},{name:"4"},{name:"5"},{name:"6"},{name:"7"},{name:"8"},{name:"9"}]},"TRL Cible":{type:"select",options:[{name:"5"},{name:"6"},{name:"7"},{name:"8"},{name:"9"}]},"Gouvernance":{type:"select",options:[{name:"Interne"},{name:"Codev"},{name:"Presta"}]},"Stratégie PI":{type:"select",options:[{name:"N.A"},{name:"Secret de affaires"}]},"Axe R&D&I":{type:"formula"},"Score D":{type:"formula"},"Score I":{type:"formula"},"Score R":{type:"formula"},"type CI":{type:"rollup"},"Tot CICO obtenu":{type:"rollup"},"Tot CIR/CII obtenu":{type:"rollup"},"Tot Dépenses Engagées":{type:"rollup"},"Tot Sub obtenu":{type:"rollup"},"Tot dépenses valorisées":{type:"rollup"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Jalons annuels Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-80e3-8d11-000bcd38b4f9"},"Documents 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80e7-a558-000b92a6fff3"},"Risques & Alertes 2026":{type:"relation",dataSourceUrl:"collection://c49aaa84-043e-4e84-9a46-1a3cef2ba656"}}},
  {name:"Jalons annuels 2026",dsId:"346dfc12-15cc-80b5-bbf8-ea550b1127f2",dsUrl:"collection://346dfc12-15cc-80e3-8d11-000bcd38b4f9",viewUrl:"view://346dfc12-15cc-8088-af50-000c32f313e9",titleProp:"Nom",schema:{"Nom":{type:"title"},"Année":{type:"select",options:[{name:"2018"},{name:"2019"},{name:"2020"},{name:"2021"},{name:"2022"},{name:"2023"},{name:"2024"},{name:"2025"},{name:"2026"}]},"type CI":{type:"select",options:[{name:"CII"},{name:"CIR"},{name:"JEI"},{name:"CICO"},{name:"CIR/CICO"}]},"Avancement":{type:"number"},"certifié":{type:"checkbox"},"Dépenses engagées":{type:"number"},"Dépenses Valorisable":{type:"number"},"Montant CIR/CII":{type:"number"},"Montant CICO":{type:"number"},"Subvention perçue":{type:"number"},"Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-8070-8f8e-000bba2683fe"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Dossiers 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3"},"Livrables 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80a4-8b0c-000b0dc0766d"},"Réunions 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-802b-bbe0-000b16ae3566"}}},
  {name:"Risques & Alertes 2026",dsId:"2528f4da-0bbb-4bfd-92f8-7f0b39a0c758",dsUrl:"collection://c49aaa84-043e-4e84-9a46-1a3cef2ba656",viewUrl:"view://726d5809-1663-4626-96a2-117aeed332df",titleProp:"Nom",schema:{"Nom":{type:"title"},"Type d'alerte":{type:"select",options:[{name:"Refus agrément CIR"},{name:"Refus agrément CII"},{name:"Refus agrément CICo"},{name:"Avis défavorable expert"},{name:"Contrôle fiscal"},{name:"Litige DGFiP"},{name:"JEI expirée"},{name:"Dépôt tardif"},{name:"Rescrit défavorable"},{name:"Autre"}]},"Sévérité":{type:"select",options:[{name:"Critique"},{name:"Attention"},{name:"Info"}]},"Statut":{type:"select",options:[{name:"À traiter"},{name:"En cours"},{name:"Résolu"},{name:"Classé sans suite"}]},"Actions à mener":{type:"text"},"Date événement":{type:"date"},"Date limite action":{type:"date"},"Montant exposé (€)":{type:"number"},"Société 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-806c-aec4-000b4089c60b"},"Dossiers 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-8066-9ea0-000b00130dd3"},"Documents 2026":{type:"relation",dataSourceUrl:"collection://343dfc12-15cc-80e7-a558-000b92a6fff3"},"Projets 2026":{type:"relation",dataSourceUrl:"collection://346dfc12-15cc-8070-8f8e-000bba2683fe"}}},
];

/* ══ API (direct Notion) ══ */
async function queryDb(dbId){
  const r=await fetch("/api/notion?action=query",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({database_id:dbId})});
  if(!r.ok)throw new Error("HTTP "+r.status);const d=await r.json();return d.results||[];
}
async function createPage(dbId,props,schema){
  const r=await fetch("/api/notion?action=create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({database_id:dbId,properties:props,schema})});
  if(!r.ok){const e=await r.json();throw new Error(e?.message||"Create failed")}return(await r.json()).page;
}
async function updatePage(pageId,props,schema){
  const r=await fetch("/api/notion?action=update",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({page_id:pageId,properties:props,schema})});
  if(!r.ok){const e=await r.json();throw new Error(e?.message||"Update failed")}
}
async function archivePage(pageId){
  const r=await fetch("/api/notion?action=archive",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({page_id:pageId})});
  if(!r.ok)throw new Error("Archive failed");
}

/* ══ HELPERS ══ */
const EDITABLE=new Set(["title","text","rich_text","email","phone_number","url","number","select","multi_select","checkbox","date","place","status","person"]);
const READONLY=new Set(["formula","rollup","created_time","last_edited_time","unique_id","created_by","last_edited_by"]);
const EC={"En cours":"#3498DB","En validation":"#F39C12","Terminé":"#27AE60","En attente":"#95A5A6","Annulé":"#E74C3C","A facturer":"#F39C12","Envoyée":"#3498DB","Payée":"#27AE60","En retard":"#E74C3C","Annulée":"#95A5A6","À traiter":"#DC2626","Résolu":"#16A34A","Classé sans suite":"#95A5A6","Critique":"#DC2626","Attention":"#D97706","Info":"#2563EB"};
const PC={"Haute":"#E74C3C","Moyenne":"#F39C12","Basse":"#27AE60"};
const TI={email:"✉️",phone_number:"📞",url:"🔗",place:"📍",date:"📅",person:"👤",relation:"🔗"};
const TODAY=new Date().toISOString().slice(0,10);
function daysUntil(d){if(!d)return 999;return Math.ceil((new Date(d)-new Date(TODAY))/86400000)}
function userName(raw){try{return JSON.parse(raw||"[]").map(r=>{const id=r.replace("user://","");return USERS.find(u=>u.id===id)?.short||"?"}).join(", ")}catch{return"—"}}
function userIds(raw){try{return JSON.parse(raw||"[]").map(r=>r.replace("user://",""))}catch{return[]}}
function dv(row,n,def,all){
  if(def.type==="place")return row["place:"+n+":address"]||row["place:"+n+":name"]||"";
  if(def.type==="date")return row["date:"+n+":start"]||"";
  if(def.type==="person")return userName(row[n]);
  if(def.type==="relation"){try{const urls=JSON.parse(row[n]||"[]");const t=all.find(d=>d.dsUrl===def.dataSourceUrl);if(!t)return urls.length?urls.length+" lien(s)":"";return urls.map(u=>{const e=t.data?.find(r=>r.url===u);return e?e[t.titleProp]||"?":"?"}).join(", ")}catch{return""}}
  return row[n]||"";
}
function resolveRel(j,db){if(!db||!j)return[];try{return JSON.parse(j).map(u=>db.data?.find(r=>r.url===u)).filter(Boolean)}catch{return[]}}
function buildProps(f,schema){const p={};const numFields=schema?new Set(Object.entries(schema).filter(([,d])=>d.type==="number").map(([n])=>n)):new Set();Object.entries(f).forEach(([k,v])=>{if(k.startsWith("place:")&&v?.trim()){const n=k.replace("place:","");p["place:"+n+":name"]=v.trim();p["place:"+n+":address"]=v.trim();p["place:"+n+":latitude"]=48.8566;p["place:"+n+":longitude"]=2.3522}else if(k.startsWith("date:")&&v?.trim()){const n=k.replace("date:","");p["date:"+n+":start"]=v.trim();p["date:"+n+":is_datetime"]=0}else if(k.startsWith("person:")&&v){const n=k.replace("person:","");p[n]=JSON.stringify(["user://"+v])}else if(v!==undefined&&v!==null&&String(v).trim()){if(numFields.has(k)){const num=parseFloat(v);if(!isNaN(num))p[k]=num}else p[k]=String(v).trim()}});return p}
function inputType(t){return{title:"text",text:"text",rich_text:"text",email:"email",phone_number:"tel",url:"url",number:"number",date:"date"}[t]||"text"}

/* ══ THEME ══ */
const font="'Outfit','Segoe UI',sans-serif";
const T={bg:"#F7F6F3",sfc:"#fff",bdr:"#E8E6E1",pri:"#2563EB",priH:"#1D4ED8",priBg:"#EFF6FF",dng:"#DC2626",dngBg:"#FEF2F2",suc:"#16A34A",sucBg:"#F0FDF4",wrn:"#D97706",txt:"#111",tx2:"#666",tx3:"#999",r:10,rs:7,f:font};
const COLORS=["#2563EB","#D97706","#16A34A","#DC2626","#7C3AED","#DB2777"];

/* ══ MICRO UI ══ */
function Spin({s}){return <svg width={s||16} height={s||16} viewBox="0 0 24 24" style={{animation:"spin .7s linear infinite"}}><circle cx="12" cy="12" r="10" stroke={T.pri} strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/></svg>}
function Badge({children,color}){return <span style={{display:"inline-flex",padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,color:color||T.pri,background:(color||T.pri)+"16",fontFamily:font}}>{children}</span>}
function Tag({children,color}){return <span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,color:color||"#666",background:(color||"#666")+"16",whiteSpace:"nowrap"}}>{children}</span>}
function Btn({children,onClick,variant,size,disabled,loading,icon,style:sx}){
  const[h,setH]=useState(false);const v=variant||"pri";const st={pri:{bg:T.pri,hb:T.priH,c:"#fff"},sec:{bg:"#F0EFEC",hb:T.bdr,c:T.txt},gh:{bg:"transparent",hb:"#F0EFEC",c:T.tx2},dng:{bg:T.dngBg,hb:T.dng,c:T.dng}}[v]||{bg:T.pri,hb:T.priH,c:"#fff"};
  return <button onClick={onClick} disabled={disabled||loading} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:size==="sm"?"5px 10px":"8px 14px",border:"none",borderRadius:T.rs,background:h&&!disabled?st.hb:st.bg,color:h&&v!=="pri"?"#fff":st.c,fontSize:size==="sm"?12:13,fontWeight:600,fontFamily:font,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.45:1,transition:"all .15s",...sx}}>{loading?<Spin s={13}/>:icon}{children}</button>;
}
function Fld({label,value,onChange,type,required,options,placeholder,small}){
  const st={width:"100%",boxSizing:"border-box",padding:small?"7px 10px":"9px 12px",background:T.bg,border:"1.5px solid "+T.bdr,borderRadius:T.rs,color:T.txt,fontSize:small?13:14,fontFamily:font,outline:"none"};
  return <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:T.tx2,fontFamily:font}}>{label}{required&&<span style={{color:T.dng}}> *</span>}</label>{type==="select"?<select value={value||""} onChange={e=>onChange(e.target.value)} style={{...st,cursor:"pointer"}}><option value="">— Choisir —</option>{(options||[]).map(o=><option key={o} value={o}>{o}</option>)}</select>:<input type={type||"text"} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={st}/>}</div>;
}
function Overlay({children,onClose}){return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}><div onClick={e=>e.stopPropagation()} style={{animation:"si .2s ease-out"}}>{children}</div></div>}
function LinkBtn({url,label}){if(!url)return null;return <a href={url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:T.pri,fontWeight:600,textDecoration:"none",padding:"3px 8px",borderRadius:5,background:T.priBg,display:"inline-flex",alignItems:"center",gap:3,whiteSpace:"nowrap"}}>🔗 {label||"Ouvrir"}</a>}
function NotionBtn({url}){if(!url)return null;const nurl=url.startsWith("notion://")?("https://notion.so/"+url.replace("notion://","")):url;return <a href={nurl} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#fff",fontWeight:700,textDecoration:"none",padding:"3px 7px",borderRadius:5,background:"#111",display:"inline-flex",alignItems:"center",whiteSpace:"nowrap"}} title="Notion">N</a>}
function Links({row,compact}){return <div style={{display:"inline-flex",gap:4,alignItems:"center"}}>{row?.["userDefined:URL"]&&<LinkBtn url={row["userDefined:URL"]} label={compact?"Doc":"Ouvrir"}/>}{row?.url&&<NotionBtn url={row.url}/>}</div>}
function Avatar({uid,size}){const s=size||28;const u=USERS.find(x=>x.id===uid);const c=u?.color||"#999";return <div style={{width:s,height:s,borderRadius:s/2,background:c+"20",color:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:s*.4,fontWeight:700,flexShrink:0}} title={u?.name}>{u?.short?.[0]||"?"}</div>}

/* ══ KPI CARD ══ */
function KPI({label,value,sub,color,icon}){return <div style={{background:"#fff",borderRadius:12,padding:"16px 18px",border:"1px solid "+T.bdr,flex:1,minWidth:130}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{label}</div><div style={{fontSize:26,fontWeight:800,color:color||T.txt,lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:11,color:"#999",marginTop:3}}>{sub}</div>}</div>{icon&&<div style={{fontSize:20,opacity:.3}}>{icon}</div>}</div></div>}

/* ══════════════════════════════════════
   DASHBOARD VIEW
   ══════════════════════════════════════ */
function DashboardView({dbs,crmUser}){
  const[userView,setUserView]=useState(null);
  const[calMonth,setCalMonth]=useState(new Date().getMonth());
  const[calYear,setCalYear]=useState(new Date().getFullYear());
  const[expandedSoc,setExpandedSoc]=useState(null);

  const livrables=dbs.find(d=>d.name.includes("Livrable"))?.data||[];
  const factures=dbs.find(d=>d.name.includes("Facture"))?.data||[];
  const societes=dbs.find(d=>d.name.includes("Société"))?.data||[];
  const dossiers=dbs.find(d=>d.name.includes("Dossier")&&!d.name.includes("Document"))?.data||[];
  const reunions=dbs.find(d=>d.name.includes("Réunion"))?.data||[];
  const reunionsAVenir=reunions.filter(r=>daysUntil(r["date:Date:start"])>=0).sort((a,b)=>daysUntil(a["date:Date:start"])-daysUntil(b["date:Date:start"]));
  const risques=dbs.find(d=>d.name.includes("Risque"))?.data||[];
  const risquesActifs=risques.filter(r=>r.Statut==="À traiter"||r.Statut==="En cours");
  const risquesCritiques=risquesActifs.filter(r=>r["Sévérité"]==="Critique");
  const clients=societes.filter(s=>s.Statut==="Client");

  const caByEx={};
  factures.forEach(f=>{const ex=f.Exercice||"N/A";if(!caByEx[ex])caByEx[ex]={total:0,paye:0,afact:0,envoye:0};caByEx[ex].total+=(f.Montant||0);if(f["État"]==="Payée")caByEx[ex].paye+=(f.Montant||0);if(f["État"]==="A facturer")caByEx[ex].afact+=(f.Montant||0);if(f["État"]==="Envoyée")caByEx[ex].envoye+=(f.Montant||0)});
  const caTotal=factures.reduce((s,f)=>s+(f.Montant||0),0);
  const caPaye=factures.filter(f=>f["État"]==="Payée").reduce((s,f)=>s+(f.Montant||0),0);

  const userLiv=(uid)=>livrables.filter(l=>userIds(l["Assigned To"]).includes(uid));
  const userUrg=(uid)=>userLiv(uid).filter(l=>{const d=daysUntil(l["date:Deadline:start"]);return d<=3&&l.Etat!=="Terminé"&&l.Etat!=="Annulé"});
  const fmt=(n)=>Number(n).toLocaleString("fr-FR")+" €";

  const livRetard=livrables.filter(l=>daysUntil(l["date:Deadline:start"])<0&&l.Etat!=="Terminé"&&l.Etat!=="Annulé").sort((a,b)=>daysUntil(a["date:Deadline:start"])-daysUntil(b["date:Deadline:start"]));
  const livUrgent=livrables.filter(l=>{const d=daysUntil(l["date:Deadline:start"]);return d>=0&&d<=3&&l.Etat!=="Terminé"&&l.Etat!=="Annulé"});
  const facAF=factures.filter(f=>f["État"]==="A facturer");

  const inWeek=(d)=>{const days=daysUntil(d);return days>=0&&days<=7};
  const livSemaine=livrables.filter(l=>inWeek(l["date:Deadline:start"])&&l.Etat!=="Terminé"&&l.Etat!=="Annulé");
  const reunSemaine=reunionsAVenir.filter(r=>inWeek(r["date:Date:start"]));
  const risqSemaine=risquesActifs.filter(r=>inWeek(r["date:Date limite action:start"]));

  const socUrl=(row)=>{try{return JSON.parse(row["Société 2026"]||"[]")[0]||""}catch{return""}};
  const socById={};societes.forEach(s=>{socById[s.url]=s});

  const socData=societes.map(soc=>{
    const m=(row)=>socUrl(row)===soc.url;
    const sLiv=livrables.filter(m);const sFac=factures.filter(m);const sDos=dossiers.filter(m);const sReu=reunions.filter(m);const sRis=risques.filter(m);
    const sLivActifs=sLiv.filter(l=>l.Etat!=="Terminé"&&l.Etat!=="Annulé");
    const sRetard=sLiv.filter(l=>daysUntil(l["date:Deadline:start"])<0&&l.Etat!=="Terminé"&&l.Etat!=="Annulé");
    const sCA=sFac.reduce((s,f)=>s+(f.Montant||0),0);
    const sAFact=sFac.filter(f=>f["État"]==="A facturer");
    const sRisActifs=sRis.filter(r=>r.Statut==="À traiter"||r.Statut==="En cours");
    const sReuAVenir=sReu.filter(r=>daysUntil(r["date:Date:start"])>=0).sort((a,b)=>daysUntil(a["date:Date:start"])-daysUntil(b["date:Date:start"]));
    const urgencyScore=(sRetard.length*10)+(sRisActifs.filter(r=>r["Sévérité"]==="Critique").length*8)+(sAFact.length*3)+sLivActifs.length;
    return{soc,sLiv,sLivActifs,sRetard,sFac,sDos,sReu,sRis,sRisActifs,sCA,sAFact,sReuAVenir,urgencyScore};
  }).sort((a,b)=>b.urgencyScore-a.urgencyScore);

  // ── USER VIEW ──
  if(userView){
    const u=USERS.find(x=>x.id===userView);const uL=userLiv(userView);const uU=userUrg(userView);
    return <div>
      <button onClick={()=>setUserView(null)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",border:"none",background:"none",color:T.pri,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font,marginBottom:16}}>← Retour</button>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><Avatar uid={userView} size={40}/><div><h2 style={{margin:0,fontSize:20,fontWeight:800}}>{u?.name}</h2><p style={{margin:0,fontSize:12,color:"#999"}}>{uL.length} livrables · {uU.length} urgents</p></div></div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}><KPI label="Assignés" value={uL.length} color={u?.color} icon="📋"/><KPI label="En cours" value={uL.filter(l=>l.Etat==="En cours"||l.Etat==="En validation").length} icon="⏳"/><KPI label="Urgents" value={uU.length} color={uU.length?"#DC2626":undefined} icon="🚨"/><KPI label="Terminés" value={uL.filter(l=>l.Etat==="Terminé").length} color="#16A34A" icon="✅"/></div>
      {uL.sort((a,b)=>daysUntil(a["date:Deadline:start"])-daysUntil(b["date:Deadline:start"])).map(l=>{const days=daysUntil(l["date:Deadline:start"]);const bad=days<0&&l.Etat!=="Terminé"&&l.Etat!=="Annulé";const urg=days>=0&&days<=3&&l.Etat!=="Terminé"&&l.Etat!=="Annulé";return <div key={l.url} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:bad?"#FEF2F2":urg?"#FFFBEB":"#fff",borderRadius:8,border:"1px solid "+(bad?"#DC262630":urg?"#D9770630":T.bdr),marginBottom:5}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{l.Nom}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{l.Etat&&<Tag color={EC[l.Etat]}>{l.Etat}</Tag>}{l["Priorité"]&&<Tag color={PC[l["Priorité"]]}>{l["Priorité"]}</Tag>}</div></div><div style={{fontSize:12,fontWeight:600,color:bad?"#DC2626":urg?"#D97706":"#999"}}>{l["date:Deadline:start"]||"—"}</div><span style={{fontSize:11,color:"#888"}}>{socById[socUrl(l)]?.Nom||""}</span></div>})}
      {uL.length===0&&<div style={{color:"#999",fontStyle:"italic",fontSize:13}}>Aucun livrable assigné</div>}
    </div>;
  }

  return <div>
    {crmUser&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"10px 16px",background:(USERS.find(u=>u.id===crmUser)?.color||"#999")+"10",borderRadius:10,border:"1.5px solid "+(USERS.find(u=>u.id===crmUser)?.color||"#999")+"30"}}>
      <Avatar uid={crmUser} size={28}/>
      <div><div style={{fontSize:14,fontWeight:700,color:USERS.find(u=>u.id===crmUser)?.color}}>Vue personnelle — {USERS.find(u=>u.id===crmUser)?.name}</div>
      <div style={{fontSize:11,color:"#888"}}>Toutes les données liées à {USERS.find(u=>u.id===crmUser)?.short} (livrables, réunions, dossiers, sociétés, factures, risques...)</div></div>
    </div>}
    {/* KPIs */}
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      <KPI label="Clients" value={clients.length} icon="🏢" color="#2563EB"/><KPI label="Dossiers" value={dossiers.length} icon="📁"/><KPI label="Réunions" value={reunionsAVenir.length} icon="📅" color="#7C3AED"/><KPI label="Livrables actifs" value={livrables.filter(l=>l.Etat!=="Terminé"&&l.Etat!=="Annulé").length} icon="📋" color="#D97706"/><KPI label="En retard" value={livRetard.length} color={livRetard.length?"#DC2626":"#16A34A"} icon="⚠️"/><KPI label="Risques" value={risquesActifs.length} color={risquesCritiques.length?"#DC2626":risquesActifs.length?"#D97706":"#16A34A"} sub={risquesCritiques.length?risquesCritiques.length+" critique(s)":undefined} icon="🚨"/><KPI label="CA total" value={fmt(caTotal)} sub={caPaye?fmt(caPaye)+" encaissé":undefined} icon="💶" color="#16A34A"/>
    </div>

    {/* ══ URGENCES ══ */}
    {(livRetard.length>0||livUrgent.length>0||risquesCritiques.length>0||facAF.length>0)&&<div style={{background:"#FEF2F2",border:"1.5px solid #DC262618",borderRadius:14,padding:18,marginBottom:20}}>
      <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:800,color:"#DC2626"}}>🚨 Urgences & retards</h3>
      {risquesCritiques.map(r=><div key={r.url} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",borderRadius:8,border:"1px solid #DC262618",marginBottom:5}}>
        <span style={{fontSize:16}}>🔴</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{r["Type d'alerte"]||"Risque"} — {r.Nom}</div><div style={{fontSize:11,color:"#888"}}>{socById[socUrl(r)]?.Nom||""}</div></div>{r["Montant exposé (€)"]&&<span style={{fontSize:13,fontWeight:700,color:"#DC2626"}}>{fmt(r["Montant exposé (€)"])}</span>}<Tag color={EC[r.Statut]}>{r.Statut}</Tag>
      </div>)}
      {livRetard.map(l=><div key={l.url} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",borderRadius:8,border:"1px solid #DC262618",marginBottom:5}}>
        <span style={{fontSize:16}}>⏰</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{l.Nom}</div><div style={{fontSize:11,color:"#888"}}>{socById[socUrl(l)]?.Nom||""} · {userName(l["Assigned To"])}</div></div><span style={{fontSize:12,fontWeight:700,color:"#DC2626"}}>{Math.abs(daysUntil(l["date:Deadline:start"]))}j retard</span>
      </div>)}
      {livUrgent.map(l=><div key={l.url} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#FFFBEB",borderRadius:8,border:"1px solid #D9770618",marginBottom:5}}>
        <span style={{fontSize:16}}>⚡</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{l.Nom}</div><div style={{fontSize:11,color:"#888"}}>{socById[socUrl(l)]?.Nom||""} · {userName(l["Assigned To"])}</div></div><span style={{fontSize:12,fontWeight:600,color:"#D97706"}}>{daysUntil(l["date:Deadline:start"])===0?"Aujourd'hui":daysUntil(l["date:Deadline:start"])+"j"}</span>
      </div>)}
      {facAF.map(f=><div key={f.url} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",borderRadius:8,border:"1px solid #D9770618",marginBottom:5}}>
        <span style={{fontSize:16}}>💶</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{f.Nom}</div><div style={{fontSize:11,color:"#888"}}>{socById[socUrl(f)]?.Nom||""}</div></div><span style={{fontSize:14,fontWeight:700}}>{f.Montant?fmt(f.Montant):"—"}</span>
      </div>)}
    </div>}

    {/* ══ ACTIONS CETTE SEMAINE ══ */}
    {(livSemaine.length>0||reunSemaine.length>0||risqSemaine.length>0)&&<div style={{background:"#EFF6FF",border:"1.5px solid #2563EB18",borderRadius:14,padding:18,marginBottom:20}}>
      <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:800,color:"#2563EB"}}>📅 Cette semaine ({livSemaine.length+reunSemaine.length+risqSemaine.length} actions)</h3>
      <div style={{display:"grid",gridTemplateColumns:livSemaine.length&&reunSemaine.length&&risqSemaine.length?"1fr 1fr 1fr":livSemaine.length&&(reunSemaine.length||risqSemaine.length)?"1fr 1fr":"1fr",gap:12}}>
        {livSemaine.length>0&&<div><div style={{fontSize:11,fontWeight:600,color:"#D97706",textTransform:"uppercase",marginBottom:6}}>📋 Livrables ({livSemaine.length})</div>
          {livSemaine.sort((a,b)=>daysUntil(a["date:Deadline:start"])-daysUntil(b["date:Deadline:start"])).map(l=><div key={l.url} style={{background:"#fff",borderRadius:6,padding:"6px 10px",marginBottom:4,fontSize:12}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600}}>{l.Nom}</span><span style={{color:"#D97706",fontWeight:600,fontSize:11}}>{daysUntil(l["date:Deadline:start"])}j</span></div><div style={{color:"#888",fontSize:11}}>{socById[socUrl(l)]?.Nom||""} · {userName(l["Assigned To"])}</div>
          </div>)}
        </div>}
        {reunSemaine.length>0&&<div><div style={{fontSize:11,fontWeight:600,color:"#7C3AED",textTransform:"uppercase",marginBottom:6}}>📅 Réunions ({reunSemaine.length})</div>
          {reunSemaine.map(r=><div key={r.url} style={{background:"#fff",borderRadius:6,padding:"6px 10px",marginBottom:4,fontSize:12}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600}}>{r.Nom}</span><Tag color={r.Type==="Client"?"#2563EB":"#7C3AED"}>{r.Type}</Tag></div><div style={{color:"#888",fontSize:11}}>{r["date:Date:start"]} · {socById[socUrl(r)]?.Nom||""}</div>
          </div>)}
        </div>}
        {risqSemaine.length>0&&<div><div style={{fontSize:11,fontWeight:600,color:"#DC2626",textTransform:"uppercase",marginBottom:6}}>⚠️ Actions risques ({risqSemaine.length})</div>
          {risqSemaine.map(r=><div key={r.url} style={{background:"#fff",borderRadius:6,padding:"6px 10px",marginBottom:4,fontSize:12}}>
            <div style={{fontWeight:600}}>{r.Nom}</div><div style={{color:"#888",fontSize:11}}>{r["date:Date limite action:start"]} · {r["Actions à mener"]?.slice(0,50)||""}</div>
          </div>)}
        </div>}
      </div>
    </div>}


    {/* ══ CALENDRIER + GRAPHIQUES + COLLABORATEURS ══ */}
    {(() => {
      const firstDay=new Date(calYear,calMonth,1).getDay();const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
      const offset=(firstDay+6)%7;const MNAMES=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];const DNAMES=["L","M","M","J","V","S","D"];
      const events={};
      reunions.forEach(r=>{const d=r["date:Date:start"];if(d){if(!events[d])events[d]=[];events[d].push({type:"reunion",name:r.Nom,color:"#7C3AED"})}});
      livrables.forEach(l=>{const d=l["date:Deadline:start"];if(d&&l.Etat!=="Terminé"&&l.Etat!=="Annulé"){if(!events[d])events[d]=[];events[d].push({type:"deadline",name:l.Nom,color:PC[l["Priorité"]]||"#D97706"})}});
      factures.forEach(f=>{const d=f["date:Date de facturation:start"];if(d){if(!events[d])events[d]=[];events[d].push({type:"facture",name:f.Nom,color:"#16A34A"})}});
      risques.forEach(r=>{const d=r["date:Date limite action:start"];if(d&&r.Statut!=="Résolu"&&r.Statut!=="Classé sans suite"){if(!events[d])events[d]=[];events[d].push({type:"risque",name:r.Nom,color:"#DC2626"})}});
      const prevMonth=()=>{if(calMonth===0){setCalMonth(11);setCalYear(calYear-1)}else setCalMonth(calMonth-1)};
      const nextMonth=()=>{if(calMonth===11){setCalMonth(0);setCalYear(calYear+1)}else setCalMonth(calMonth+1)};
      const caChartData=Object.keys(caByEx).sort().map(ex=>({name:ex,"Payé":caByEx[ex].paye,"Envoyé":caByEx[ex].envoye,"A facturer":caByEx[ex].afact}));
      const livByEtat={};livrables.forEach(l=>{const e=l.Etat||"N/A";livByEtat[e]=(livByEtat[e]||0)+1});
      const pieData=Object.entries(livByEtat).map(([name,value])=>({name,value}));
      const PIE_COLORS=["#3498DB","#F39C12","#27AE60","#95A5A6","#E74C3C"];

      return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <div style={{background:"#fff",borderRadius:12,border:"1px solid "+T.bdr,padding:16,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <button onClick={prevMonth} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#999",padding:"2px 8px"}}>‹</button>
              <span style={{fontSize:14,fontWeight:700}}>{MNAMES[calMonth]} {calYear}</span>
              <button onClick={nextMonth} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#999",padding:"2px 8px"}}>›</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center"}}>
              {DNAMES.map(d=><div key={d} style={{fontSize:10,fontWeight:600,color:"#999",padding:3}}>{d}</div>)}
              {Array.from({length:offset}).map((_,i)=><div key={"e"+i}/>)}
              {Array.from({length:daysInMonth}).map((_,i)=>{const day=i+1;const dateStr=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;const isToday=dateStr===TODAY;const de=events[dateStr]||[];
                return <div key={day} title={de.map(e=>e.name).join("\n")} style={{padding:"4px 2px",borderRadius:6,fontSize:12,fontWeight:isToday?700:400,background:isToday?T.pri:"transparent",color:isToday?"#fff":T.txt,border:de.length?"1.5px solid "+de[0].color:"1.5px solid transparent",cursor:de.length?"pointer":"default"}}>
                  {day}{de.length>0&&<div style={{display:"flex",gap:2,justifyContent:"center",marginTop:1}}>
                    {de.some(e=>e.type==="deadline")&&<div style={{width:4,height:4,borderRadius:2,background:"#D97706"}}/>}
                    {de.some(e=>e.type==="reunion")&&<div style={{width:4,height:4,borderRadius:2,background:"#7C3AED"}}/>}
                    {de.some(e=>e.type==="facture")&&<div style={{width:4,height:4,borderRadius:2,background:"#16A34A"}}/>}
                    {de.some(e=>e.type==="risque")&&<div style={{width:4,height:4,borderRadius:2,background:"#DC2626"}}/>}
                  </div>}
                </div>})}
            </div>
            <div style={{display:"flex",gap:10,marginTop:8,justifyContent:"center",fontSize:10,color:"#999"}}>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:3,background:"#D97706"}}/> Deadline</span>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:3,background:"#7C3AED"}}/> Réunion</span>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:3,background:"#16A34A"}}/> Facture</span>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:3,background:"#DC2626"}}/> Risque</span>
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:12,border:"1px solid "+T.bdr,padding:16}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>💰 CA par exercice</div>
            {caChartData.length===0?<div style={{color:"#999",fontSize:12,fontStyle:"italic",textAlign:"center",padding:30}}>Aucune donnée</div>:
            <ResponsiveContainer width="100%" height={180}><BarChart data={caChartData} margin={{top:5,right:10,left:0,bottom:5}}>
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#999"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:"#999"}} axisLine={false} tickLine={false} tickFormatter={v=>(v/1000)+"k"}/>
              <Tooltip formatter={v=>v.toLocaleString("fr-FR")+" €"} contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E8E6E1"}}/>
              <Bar dataKey="Payé" stackId="a" fill="#16A34A"/><Bar dataKey="Envoyé" stackId="a" fill="#3498DB"/><Bar dataKey="A facturer" stackId="a" fill="#F39C12" radius={[4,4,0,0]}/>
            </BarChart></ResponsiveContainer>}
            <div style={{display:"flex",gap:12,justifyContent:"center",fontSize:10,color:"#999",marginTop:6}}>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:"#16A34A"}}/> Payé</span>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:"#3498DB"}}/> Envoyé</span>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:"#F39C12"}}/> A facturer</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{background:"#fff",borderRadius:12,border:"1px solid "+T.bdr,padding:16,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>📋 Livrables par état</div>
            {pieData.length===0?<div style={{color:"#999",fontSize:12,fontStyle:"italic",textAlign:"center",padding:30}}>Aucun</div>:
            <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3} strokeWidth={0}>{pieData.map((_,i)=><Cell key={i} fill={EC[pieData[i].name]||PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie>
              <Tooltip formatter={(v,name)=>[v+" livrable"+(v>1?"s":""),name]} contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E8E6E1"}}/></PieChart></ResponsiveContainer>}
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",fontSize:10,color:"#999"}}>{pieData.map((d,i)=><span key={d.name} style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:EC[d.name]||PIE_COLORS[i%PIE_COLORS.length]}}/> {d.name} ({d.value})</span>)}</div>
          </div>
          <div style={{background:"#fff",borderRadius:12,border:"1px solid "+T.bdr,padding:16}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>👥 Charge par collaborateur</div>
            {USERS.map(u=>{const uL=userLiv(u.id);const uU=userUrg(u.id);
              return <div key={u.id} onClick={()=>setUserView(u.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:T.bg,borderRadius:8,marginBottom:5,cursor:"pointer",border:"1px solid transparent",transition:"border .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=u.color+"40"} onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                <Avatar uid={u.id} size={28}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.short}</div><div style={{fontSize:11,color:"#999"}}>{uL.length} livrable{uL.length>1?"s":""}</div></div>
                {uU.length>0&&<Tag color="#DC2626">{uU.length} urgent{uU.length>1?"s":""}</Tag>}
                <div style={{fontSize:18,fontWeight:800,color:u.color}}>{uL.filter(l=>l.Etat!=="Terminé"&&l.Etat!=="Annulé").length}</div>
              </div>})}
          </div>
        </div>
      </div>;
    })()}

    {/* ══ PAR SOCIÉTÉ ══ */}
    <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:800}}>🏢 Par société</h3>
    <div style={{display:"grid",gap:10,marginBottom:24}}>
      {socData.map(({soc,sLivActifs,sRetard,sFac,sDos,sRisActifs,sCA,sAFact,sReuAVenir})=>{
        const isExp=expandedSoc===soc.url;const hasIssues=sRetard.length>0||sRisActifs.some(r=>r["Sévérité"]==="Critique");
        return <div key={soc.url} style={{background:"#fff",borderRadius:12,border:"1.5px solid "+(hasIssues?"#DC262620":T.bdr),overflow:"hidden"}}>
          <div onClick={()=>setExpandedSoc(isExp?null:soc.url)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",cursor:"pointer",background:hasIssues?"#FEF2F240":"transparent"}}>
            <div style={{width:42,height:42,borderRadius:10,background:"#2563EB14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#2563EB",flexShrink:0}}>{(soc.Nom||"?")[0]}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                <span style={{fontSize:15,fontWeight:700}}>{soc.Nom}</span>
                {soc.Statut&&<Badge color={soc.Statut==="Client"?"#2563EB":soc.Statut==="Prospect"?"#D97706":"#16A34A"}>{soc.Statut}</Badge>}
                {sRetard.length>0&&<Badge color="#DC2626">{sRetard.length} retard{sRetard.length>1?"s":""}</Badge>}
                {sRisActifs.filter(r=>r["Sévérité"]==="Critique").length>0&&<Badge color="#DC2626">🔴 critique</Badge>}
              </div>
              <div style={{display:"flex",gap:14,fontSize:11,color:"#999"}}>
                <span>📋 {sLivActifs.length}</span><span>📁 {sDos.length}</span>
                {sCA>0&&<span>💶 {fmt(sCA)}</span>}
                {sAFact.length>0&&<span style={{color:"#D97706"}}>⏳ {sAFact.length} à fact.</span>}
                {sReuAVenir.length>0&&<span>📅 {sReuAVenir.length}</span>}
              </div>
            </div>
            <span style={{fontSize:16,color:"#ccc",transition:"transform .2s",transform:isExp?"rotate(90deg)":"rotate(0)"}}>▸</span>
          </div>
          {isExp&&<div style={{padding:"0 18px 16px",borderTop:"1px solid "+T.bdr}}>
            {sRetard.length>0&&<div style={{marginTop:12}}><div style={{fontSize:11,fontWeight:700,color:"#DC2626",textTransform:"uppercase",marginBottom:6}}>⏰ En retard ({sRetard.length})</div>
              {sRetard.map(l=><div key={l.url} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#FEF2F2",borderRadius:6,marginBottom:4,fontSize:12}}>
                <div style={{flex:1,fontWeight:600}}>{l.Nom}</div><Avatar uid={userIds(l["Assigned To"])[0]} size={20}/><span style={{color:"#DC2626",fontWeight:600}}>{Math.abs(daysUntil(l["date:Deadline:start"]))}j</span>
              </div>)}
            </div>}
            {sRisActifs.length>0&&<div style={{marginTop:12}}><div style={{fontSize:11,fontWeight:700,color:"#D97706",textTransform:"uppercase",marginBottom:6}}>⚠️ Risques ({sRisActifs.length})</div>
              {sRisActifs.map(r=>{const sc=r["Sévérité"]==="Critique"?"#DC2626":r["Sévérité"]==="Attention"?"#D97706":"#2563EB";return <div key={r.url} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.bg,borderRadius:6,marginBottom:4,fontSize:12}}>
                <span>{r["Sévérité"]==="Critique"?"🔴":"🟠"}</span><div style={{flex:1,fontWeight:600}}>{r.Nom}</div><Tag color={sc}>{r["Type d'alerte"]}</Tag>{r["Montant exposé (€)"]&&<span style={{fontWeight:700,color:sc}}>{fmt(r["Montant exposé (€)"])}</span>}
              </div>})}
            </div>}
            {sLivActifs.length>0&&<div style={{marginTop:12}}><div style={{fontSize:11,fontWeight:700,color:"#2563EB",textTransform:"uppercase",marginBottom:6}}>📋 Livrables ({sLivActifs.length})</div>
              {sLivActifs.sort((a,b)=>daysUntil(a["date:Deadline:start"])-daysUntil(b["date:Deadline:start"])).map(l=>{const d=daysUntil(l["date:Deadline:start"]);return <div key={l.url} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.bg,borderRadius:6,marginBottom:4,fontSize:12}}>
                <div style={{flex:1,fontWeight:600}}>{l.Nom}</div><Tag color={EC[l.Etat]}>{l.Etat}</Tag>{l["Priorité"]&&<Tag color={PC[l["Priorité"]]}>{l["Priorité"]}</Tag>}<Avatar uid={userIds(l["Assigned To"])[0]} size={18}/><span style={{fontSize:11,color:d<0?"#DC2626":d<=3?"#D97706":"#999",fontWeight:600,minWidth:30,textAlign:"right"}}>{l["date:Deadline:start"]?.slice(5)||"—"}</span>
              </div>})}
            </div>}
            {sFac.length>0&&<div style={{marginTop:12}}><div style={{fontSize:11,fontWeight:700,color:"#16A34A",textTransform:"uppercase",marginBottom:6}}>💶 Factures ({sFac.length} · {fmt(sCA)})</div>
              {sFac.map(f=><div key={f.url} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.bg,borderRadius:6,marginBottom:4,fontSize:12}}>
                <div style={{flex:1,fontWeight:600}}>{f.Nom}</div><Tag color={EC[f["État"]]}>{f["État"]}</Tag><span style={{fontWeight:700}}>{f.Montant?fmt(f.Montant):"—"}</span>
              </div>)}
            </div>}
            {sReuAVenir.length>0&&<div style={{marginTop:12}}><div style={{fontSize:11,fontWeight:700,color:"#7C3AED",textTransform:"uppercase",marginBottom:6}}>📅 Réunions ({sReuAVenir.length})</div>
              {sReuAVenir.slice(0,3).map(r=><div key={r.url} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.bg,borderRadius:6,marginBottom:4,fontSize:12}}>
                <div style={{flex:1,fontWeight:600}}>{r.Nom}</div><Tag color={r.Type==="Client"?"#2563EB":"#7C3AED"}>{r.Type}</Tag><span style={{color:"#999"}}>{r["date:Date:start"]}</span>
              </div>)}
            </div>}
          </div>}
        </div>})}
    </div>

  </div>;
}

/* ══════════════════════════════════════
   MANAGER VIEW (simplified — CRUD cards)
   ══════════════════════════════════════ */
function ManagerView({dbs,tab,setTab,onModal,onDetail,onDelete}){
  const[search,setSearch]=useState("");
  const needsGroupBySoc=dbs[tab]&&(dbs[tab].name.includes("Dossier")||dbs[tab].name.includes("Projet")||dbs[tab].name.includes("Jalon"));
  const[sortBy,setSortBy]=useState(needsGroupBySoc?"societe":"nom");
  const[sortDir,setSortDir]=useState("asc");
  const[filters,setFilters]=useState({});
  const[quickFilters,setQuickFilters]=useState({});
  const[collapsed,setCollapsed]=useState({});
  const[page,setPage]=useState(0);
  const[viewMode,setViewMode]=useState("cards");
  const[activePreset,setActivePreset]=useState(null);
  const PER_PAGE=viewMode==="list"?50:25;
  const db=dbs[tab];

  // Build sortable/filterable fields for current db (memoized)
  const selectFields=useMemo(()=>db?Object.entries(db.schema).filter(([,d])=>d.type==="select"||d.type==="status"):[],[db]);
  const dateFields=useMemo(()=>db?Object.entries(db.schema).filter(([,d])=>d.type==="date"):[],[db]);
  const personFields=useMemo(()=>db?Object.entries(db.schema).filter(([,d])=>d.type==="person"):[],[db]);
  const hasRels=useMemo(()=>db?Object.values(db.schema).some(d=>d.type==="relation"):false,[db]);

  // Sort options per db type
  const sortOptions=[{k:"nom",l:"Nom (A→Z)"},{k:"nom_desc",l:"Nom (Z→A)"}];
  if(dateFields.length>0)dateFields.forEach(([n])=>{sortOptions.push({k:"date_"+n+"_asc",l:n+" (plus proche)"});sortOptions.push({k:"date_"+n+"_desc",l:n+" (plus loin)"})});
  if(db?.name.includes("Facture"))sortOptions.push({k:"montant_desc",l:"Montant ↓"},{k:"montant_asc",l:"Montant ↑"});
  if(db?.name.includes("Jalon"))sortOptions.push({k:"avancement_desc",l:"Avancement ↓"},{k:"avancement_asc",l:"Avancement ↑"});
  sortOptions.push({k:"societe",l:"Par société"});

  // Apply search filter
  let results=(db?.data||[]).filter(r=>{if(!search)return true;const q=search.toLowerCase();return Object.values(r).some(v=>v&&String(v).toLowerCase().includes(q))});

  // Apply select filters
  Object.entries(filters).forEach(([field,val])=>{if(val)results=results.filter(r=>r[field]===val)});

  // Apply quick filters (multi-select: show items matching ANY selected value per field)
  Object.entries(quickFilters).forEach(([field,vals])=>{if(vals&&vals.length>0)results=results.filter(r=>vals.includes(r[field]))});

  // Apply preset filters
  if(activePreset==="actifs"){
    results=results.filter(r=>{
      const etat=r.Etat||r["État"]||r.Statut||"";
      return etat&&etat!=="Terminé"&&etat!=="Annulé"&&etat!=="Payé"&&etat!=="Classé sans suite"&&etat!=="Résolu"&&etat!=="annulé"&&etat!=="réalisé";
    });
  }
  if(activePreset==="retard"){
    results=results.filter(r=>{
      const etat=r.Etat||r["État"]||r.Statut||"";
      if(etat==="Terminé"||etat==="Annulé"||etat==="Payé"||etat==="Classé sans suite"||etat==="Résolu"||etat==="annulé"||etat==="réalisé")return false;
      const d=r["date:Deadline:start"]||r["date:Date:start"]||r["date:Date limite action:start"]||r["date:Date de facturation:start"]||"";
      return d&&daysUntil(d)<0;
    });
  }
  if(activePreset==="semaine"){
    results=results.filter(r=>{
      const d=r["date:Deadline:start"]||r["date:Date:start"]||r["date:Date limite action:start"]||r["date:Date de facturation:start"]||"";
      if(!d)return false;const days=daysUntil(d);return days>=0&&days<=7;
    });
  }
  if(activePreset==="clients"&&db?.name.includes("Société"))results=results.filter(r=>r.Statut==="Client");
  if(activePreset==="prospects"&&db?.name.includes("Société"))results=results.filter(r=>r.Statut==="Prospect");
  if(activePreset==="partenaires"&&db?.name.includes("Société"))results=results.filter(r=>r.Statut==="Partenaire");

  // Sort
  // Precompute société name lookup map (URL → name) — avoids JSON.parse+find per row per render
  const socMap=useMemo(()=>{const sDb=dbs.find(d=>d.name.includes("Société"));if(!sDb)return{};const m={};(sDb.data||[]).forEach(s=>{m[s.url]=s.Nom||""});return m},[dbs]);
  const socName=(row)=>{try{const urls=JSON.parse(row["Société 2026"]||"[]");return socMap[urls[0]]||""}catch{return""}};
  results=[...results].sort((a,b)=>{
    if(sortBy==="nom")return(a[db.titleProp]||"").localeCompare(b[db.titleProp]||"");
    if(sortBy==="nom_desc")return(b[db.titleProp]||"").localeCompare(a[db.titleProp]||"");
    if(sortBy==="societe")return socName(a).localeCompare(socName(b));
    if(sortBy==="montant_desc")return(b.Montant||0)-(a.Montant||0);
    if(sortBy==="montant_asc")return(a.Montant||0)-(b.Montant||0);
    if(sortBy==="avancement_desc")return(b.Avancement||0)-(a.Avancement||0);
    if(sortBy==="avancement_asc")return(a.Avancement||0)-(b.Avancement||0);
    if(sortBy.startsWith("date_")){const parts=sortBy.split("_");const dir=parts.pop();const field=parts.slice(1).join("_");const da=a["date:"+field+":start"]||"9999";const db2=b["date:"+field+":start"]||"9999";return dir==="asc"?da.localeCompare(db2):db2.localeCompare(da)}
    return 0;
  });

  const countRel=(row,field)=>{try{return JSON.parse(row[field]||"[]").length}catch{return 0}};
  const acts=(row,title)=><div style={{display:"flex",gap:2,flexShrink:0}}>
    {hasRels&&<Btn variant="gh" size="sm" onClick={()=>onDetail({entry:row,db})}>👁</Btn>}
    <Btn variant="gh" size="sm" onClick={()=>onModal({mode:"edit",type:tab,data:{...row}})}>✏️</Btn>
    <Btn variant="gh" size="sm" onClick={()=>onDelete({url:row.url,name:title})}>🗑</Btn>
  </div>;
  const crd=(children,row)=><div key={row.url} style={{background:"#fff",border:"1px solid "+T.bdr,borderRadius:T.r,padding:"12px 16px"}}>{children}</div>;
  const fmt=n=>Number(n).toLocaleString("fr-FR")+" €";

  // Pre-compute unique values per select field (for chips + dropdowns)
  const chipVals=useMemo(()=>{const m={};selectFields.forEach(([n])=>{m[n]=[...new Set((db?.data||[]).map(r=>r[n]).filter(Boolean))].sort()});return m},[db,selectFields]);

  const sst={padding:"5px 8px",background:T.bg,border:"1px solid "+T.bdr,borderRadius:T.rs,fontSize:11,fontFamily:font,outline:"none",cursor:"pointer",color:T.txt};

  const renderCard=(row)=>{
    const dn=db.name;const title=row[db.titleProp]||"Sans titre";const _soc=socName(row);

    // ── CONTACTS ──
    if(dn.includes("Contact")){
      const full=(row["Prénom"]||"")+" "+(row["N. Famille"]||"");const soc=_soc;
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:20,background:"#7C3AED18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#7C3AED",flexShrink:0}}>{(row["Prénom"]||"?")[0]}{(row["N. Famille"]||"")[0]||""}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:700}}>{full.trim()||title}</span>{row.Fonction&&<Badge color="#7C3AED">{row.Fonction}</Badge>}</div>
          <div style={{display:"flex",gap:14,fontSize:12,color:"#888",flexWrap:"wrap"}}>
            {row["Email Address"]&&<span>✉️ {row["Email Address"]}</span>}
            {row["Phone Number"]&&<span>📞 {row["Phone Number"]}</span>}
            {soc&&<span style={{color:"#2563EB"}}>🏢 {soc}</span>}
          </div>
        </div>{acts(row,full.trim()||title)}
      </div>,row);
    }
    // ── SOCIÉTÉ ──
    if(dn.includes("Société")){
      const lieu=row["place:Lieu:address"]||row["place:Lieu:name"]||"";
      const nC=countRel(row,"Contacts 2026"),nL=countRel(row,"Livrables 2026"),nD=countRel(row,"Dossiers 2026"),nF=countRel(row,"Factures 2026"),nR=countRel(row,"Réunions 2026"),nP=countRel(row,"Projets 2026"),nJ=countRel(row,"Jalons annuels Projets 2026");
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:10,background:"#2563EB14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#2563EB",flexShrink:0}}>{title[0]}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:15,fontWeight:700}}>{title}</span>{row.Statut&&<Badge color={row.Statut==="Client"?"#2563EB":row.Statut==="Prospect"?"#D97706":"#16A34A"}>{row.Statut}</Badge>}</div>
          <div style={{display:"flex",gap:10,fontSize:11,color:"#999",flexWrap:"wrap",alignItems:"center"}}>
            {lieu&&<span>📍 {lieu}</span>}
            {nC>0&&<span>👤 {nC}</span>}{nR>0&&<span>📅 {nR}</span>}{nL>0&&<span>📋 {nL}</span>}{nD>0&&<span>📁 {nD}</span>}{nF>0&&<span>💶 {nF}</span>}{nP>0&&<span>🚀 {nP}</span>}{nJ>0&&<span>🎯 {nJ}</span>}
          </div>
        </div><Links row={row} compact/>{acts(row,title)}
      </div>,row);
    }
    // ── RÉUNIONS ──
    if(dn.includes("Réunion")){
      const d=row["date:Date:start"];const soc=_soc;const days=daysUntil(d);const past=days<0;
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,textAlign:"center",flexShrink:0,padding:"4px 0"}}>
          <div style={{fontSize:18,fontWeight:800,color:days===0?"#2563EB":past?"#999":"#111",lineHeight:1}}>{d?.slice(8,10)||"?"}</div>
          <div style={{fontSize:10,color:"#999",textTransform:"uppercase"}}>{d?new Date(d).toLocaleString("fr-FR",{month:"short"}):"—"}</div>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:600}}>{title}</span>{row.Type&&<Badge color={row.Type==="Client"?"#2563EB":row.Type==="Interne"?"#16A34A":"#7C3AED"}>{row.Type}</Badge>}{row.Statut&&<Badge color={row.Statut==="réalisé"?"#16A34A":row.Statut==="annulé"?"#DC2626":row.Statut==="planifié"?"#7C3AED":"#999"}>{row.Statut}</Badge>}{row["Priorité"]&&<Badge color={PC[row["Priorité"]]}>{row["Priorité"]}</Badge>}</div>
          <div style={{display:"flex",gap:12,fontSize:12,color:"#888"}}>
            {userName(row.Participants)!=="—"&&<span>👤 {userName(row.Participants)}</span>}
            {soc&&<span>🏢 {soc}</span>}
          </div>
        </div>
        <div style={{fontSize:11,fontWeight:600,color:days===0?"#2563EB":past?"#999":days<=3?"#D97706":"#888"}}>{days===0?"Auj.":past?Math.abs(days)+"j passé":days+"j"}</div>
        {acts(row,title)}
      </div>,row);
    }
    // ── LIVRABLES ──
    if(dn.includes("Livrable")){
      const d=row["date:Deadline:start"];const days=daysUntil(d);const bad=days<0&&row.Etat!=="Terminé"&&row.Etat!=="Annulé";const urg=days>=0&&days<=3&&row.Etat!=="Terminé"&&row.Etat!=="Annulé";const done=row.Etat==="Terminé";
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:36,flexShrink:0}}>
          <Avatar uid={userIds(row["Assigned To"])[0]} size={32}/>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
            <span style={{fontSize:14,fontWeight:600,textDecoration:done?"line-through":"none",opacity:done?.6:1}}>{title}</span>
            {row.Etat&&<Badge color={EC[row.Etat]}>{row.Etat}</Badge>}
            {row["Priorité"]&&<Badge color={PC[row["Priorité"]]}>{row["Priorité"]}</Badge>}
            {row.Type&&<Tag>{row.Type}</Tag>}
          </div>
          <div style={{display:"flex",gap:12,fontSize:12,color:"#888",alignItems:"center"}}>
            {d&&<span style={{fontWeight:600,color:bad?"#DC2626":urg?"#D97706":"#888"}}>📅 {d} {bad?"("+Math.abs(days)+"j retard)":urg?"("+days+"j)":""}</span>}
            {_soc&&<span>🏢 {_soc}</span>}
          </div>
        </div><Links row={row} compact/>{acts(row,title)}
      </div>,row);
    }
    // ── DOCUMENTS ──
    if(dn.includes("Document")){
      const typeIcons={"Sheet":"📊","Doc":"📝","Slide":"📽️","PDF":"📕","Image":"🖼️"};const tIcon=typeIcons[row.Type]||"📄";
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:24,flexShrink:0,width:36,textAlign:"center"}}>{tIcon}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:600}}>{title}</span>{row.Type&&<Badge>{row.Type}</Badge>}</div>
          <div style={{display:"flex",gap:12,fontSize:12,color:"#888"}}>{_soc&&<span>🏢 {_soc}</span>}</div>
        </div>
        <Links row={row}/>{acts(row,title)}
      </div>,row);
    }
    // ── DOSSIERS ──
    if(dn.includes("Dossier")&&!dn.includes("Document")){
      const nL=countRel(row,"Livrables 2026"),nF=countRel(row,"Factures 2026"),nJ=countRel(row,"Projets 2026"),nR=countRel(row,"Réunions 2026");
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:8,background:"#16A34A14",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:13,fontWeight:800,color:"#16A34A"}}>{row.Type||"?"}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:600}}>{title}</span>{row["Année"]&&<Badge color="#D97706">{row["Année"]}</Badge>}</div>
          <div style={{display:"flex",gap:10,fontSize:11,color:"#999"}}>
            {_soc&&<span>🏢 {_soc}</span>}
            {nL>0&&<span>📋 {nL} livrable{nL>1?"s":""}</span>}
            {nF>0&&<span>💶 {nF} facture{nF>1?"s":""}</span>}
            {nJ>0&&<span>🎯 {nJ} jalon{nJ>1?"s":""}</span>}
            {nR>0&&<span>📅 {nR} réunion{nR>1?"s":""}</span>}
          </div>
        </div><Links row={row} compact/>{acts(row,title)}
      </div>,row);
    }
    // ── FACTURES ──
    if(dn.includes("Facture")){
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:48,textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:18,fontWeight:800,color:row["État"]==="Payée"?"#16A34A":row["État"]==="En retard"?"#DC2626":"#111"}}>{row.Montant?fmt(row.Montant):"—"}</div>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}><span style={{fontSize:14,fontWeight:600}}>{title}</span>{row["État"]&&<Badge color={EC[row["État"]]}>{row["État"]}</Badge>}{row.Type&&<Tag>{row.Type}</Tag>}{row.Exercice&&<Tag>{row.Exercice}</Tag>}</div>
          <div style={{display:"flex",gap:12,fontSize:12,color:"#888"}}>
            {row["date:Date de facturation:start"]&&<span>📅 {row["date:Date de facturation:start"]}</span>}
            {_soc&&<span>🏢 {_soc}</span>}
          </div>
        </div><Links row={row} compact/>{acts(row,title)}
      </div>,row);
    }
    // ── PROJETS ──
    if(dn.includes("Projet")&&!dn.includes("Jalon")){
      const trl=parseInt(row.TRL)||0;const trlC=parseInt(row["TRL Cible"])||9;const pct=trl&&trlC?Math.round(trl/trlC*100):0;
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:10,background:"#0EA5E914",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <div style={{fontSize:9,color:"#999",lineHeight:1}}>TRL</div>
          <div style={{fontSize:16,fontWeight:800,color:"#0EA5E9",lineHeight:1}}>{row.TRL||"?"}</div>
          <div style={{fontSize:8,color:"#999"}}>→{row["TRL Cible"]||"?"}</div>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}><span style={{fontSize:14,fontWeight:700}}>{title}</span>{row.Gouvernance&&<Badge color="#0EA5E9">{row.Gouvernance}</Badge>}{row["Stratégie PI"]&&row["Stratégie PI"]!=="N.A"&&<Badge color="#7C3AED">{row["Stratégie PI"]}</Badge>}{row["Axe de R&DI"]&&<Tag color="#D97706">{row["Axe de R&DI"].length>30?row["Axe de R&DI"].slice(0,30)+"…":row["Axe de R&DI"]}</Tag>}</div>
          <div style={{display:"flex",gap:10,fontSize:11,color:"#999",alignItems:"center"}}>
            {row["Démarrage"]&&<span>{row["Démarrage"]} → {row["Cloture"]||"?"}</span>}
            {_soc&&<span>🏢 {_soc}</span>}
            {row.Objectif&&<span style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>🎯 {row.Objectif}</span>}
            {row.Verrous&&<span style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#DC2626"}}>🔒 {row.Verrous}</span>}
          </div>
          <div style={{height:4,background:"#F0F0EC",borderRadius:2,marginTop:4,maxWidth:120}}><div style={{height:"100%",background:"linear-gradient(90deg,#0EA5E9,#06B6D4)",borderRadius:2,width:pct+"%"}}/></div>
        </div><Links row={row} compact/>{acts(row,title)}
      </div>,row);
    }
    // ── JALONS ──
    if(dn.includes("Jalon")){
      const av=row.Avancement?Math.round(row.Avancement*100):0;const projDb=dbs.find(d=>d.name.includes("Projet")&&!d.name.includes("Jalon"));let projName="";
      try{const urls=JSON.parse(row["Projets 2026"]||"[]");const p=projDb?.data?.find(r=>r.url===urls[0]);projName=p?.Nom||""}catch{}
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:22,background:av>=100?"#16A34A18":av>=50?"#D9770618":"#DC262618",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:14,fontWeight:800,color:av>=100?"#16A34A":av>=50?"#D97706":"#DC2626"}}>{av}%</span>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}><span style={{fontSize:14,fontWeight:600}}>{title}</span>{row["type CI"]&&<Badge color="#7C3AED">{row["type CI"]}</Badge>}{row["Année"]&&<Badge color="#D97706">{row["Année"]}</Badge>}</div>
          <div style={{display:"flex",gap:10,fontSize:11,color:"#999",flexWrap:"wrap"}}>
            {projName&&<span>🚀 {projName}</span>}
            {_soc&&<span>🏢 {_soc}</span>}
            {row["Dépenses engagées"]&&<span>💰 Eng. {fmt(row["Dépenses engagées"])}</span>}
            {row["Montant CI"]&&<span>🏦 CI {fmt(row["Montant CI"])}</span>}
          </div>
          <div style={{height:4,background:"#F0F0EC",borderRadius:2,marginTop:4,maxWidth:150}}><div style={{height:"100%",background:av>=100?"#16A34A":av>=50?"#D97706":"#DC2626",borderRadius:2,width:av+"%"}}/></div>
        </div><Links row={row} compact/>{acts(row,title)}
      </div>,row);
    }
    // ── RISQUES & ALERTES ──
    if(dn.includes("Risque")){
      const sev=row["Sévérité"];const sevC=sev==="Critique"?"#DC2626":sev==="Attention"?"#D97706":"#2563EB";
      const dlim=row["date:Date limite action:start"];const daysLeft=daysUntil(dlim);const overdue=dlim&&daysLeft<0&&row.Statut!=="Résolu"&&row.Statut!=="Classé sans suite";
      return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:42,height:42,borderRadius:10,background:sevC+"14",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:sev==="Critique"?18:16}}>{sev==="Critique"?"🔴":sev==="Attention"?"🟠":"🔵"}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
            <span style={{fontSize:14,fontWeight:600}}>{title}</span>
            {sev&&<Badge color={sevC}>{sev}</Badge>}
            {row.Statut&&<Badge color={EC[row.Statut]}>{row.Statut}</Badge>}
            {row["Type d'alerte"]&&<Tag color={sevC}>{row["Type d'alerte"]}</Tag>}
          </div>
          <div style={{display:"flex",gap:12,fontSize:11,color:"#888",flexWrap:"wrap",alignItems:"center"}}>
            {_soc&&<span>🏢 {_soc}</span>}
            {row["Montant exposé (€)"]&&<span style={{fontWeight:700,color:sevC}}>💰 {fmt(row["Montant exposé (€)"])}</span>}
            {row["date:Date événement:start"]&&<span>📅 {row["date:Date événement:start"]}</span>}
            {dlim&&<span style={{fontWeight:600,color:overdue?"#DC2626":daysLeft<=7?"#D97706":"#888"}}>⏰ Action: {dlim} {overdue?"("+Math.abs(daysLeft)+"j retard)":daysLeft<=7?"("+daysLeft+"j)":""}</span>}
            {row["Actions à mener"]&&<span style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📝 {row["Actions à mener"]}</span>}
          </div>
        </div><Links row={row} compact/>{acts(row,title)}
      </div>,row);
    }
    // ── FALLBACK GÉNÉRIQUE ──
    const color=COLORS[tab%COLORS.length];const ntf=Object.entries(db.schema).filter(([,d])=>d.type!=="title"&&!READONLY.has(d.type));
    return crd(<div style={{display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:36,height:36,borderRadius:8,flexShrink:0,background:color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color}}>{title[0]?.toUpperCase()}</div>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}><span style={{fontSize:14,fontWeight:600}}>{title}</span>{ntf.filter(([,d])=>d.type==="select").map(([n])=>row[n]?<Badge key={n} color={EC[row[n]]||PC[row[n]]||color}>{row[n]}</Badge>:null)}</div>
        <div style={{display:"flex",gap:12,fontSize:12,color:"#888",flexWrap:"wrap"}}>{ntf.filter(([,d])=>d.type!=="select").map(([n,d])=>{const v=dv(row,n,d,dbs);if(!v)return null;return <span key={n}>{TI[d.type]||""} {v}</span>})}<Links row={row} compact/></div>
      </div>{acts(row,title)}
    </div>,row);
  };

  // Group by société if sorted by société
  const grouped=sortBy==="societe";
  const groups=grouped?(() => {
    const g={};results.forEach(r=>{const s=socName(r)||"— Sans société —";if(!g[s])g[s]=[];g[s].push(r)});
    return Object.entries(g).sort((a,b)=>a[0].localeCompare(b[0]));
  })():null;

  return <div>
    {/* Tabs */}
    <div style={{display:"flex",gap:0,overflowX:"auto",marginBottom:12}}>
      {dbs.map((d,i)=><button key={i} onClick={()=>{setTab(i);setSearch("");setFilters({});setQuickFilters({});setActivePreset(null);setSortBy(dbs[i]&&(dbs[i].name.includes("Dossier")||dbs[i].name.includes("Projet")||dbs[i].name.includes("Jalon"))?"societe":"nom");setPage(0);setCollapsed({})}} style={{padding:"7px 14px",border:"none",cursor:"pointer",background:"transparent",fontFamily:font,fontSize:12,fontWeight:tab===i?700:400,color:tab===i?COLORS[i%COLORS.length]:"#999",borderBottom:"2px solid "+(tab===i?COLORS[i%COLORS.length]:"transparent"),whiteSpace:"nowrap"}}>{d.name.replace(" 2026","").replace("Jalons annuels","Jalons")}<span style={{marginLeft:4,fontSize:10,fontWeight:600,padding:"1px 5px",borderRadius:6,background:tab===i?COLORS[i%COLORS.length]+"18":"#F0F0EC",color:tab===i?COLORS[i%COLORS.length]:"#999"}}>{d.data?.length||0}</span></button>)}
    </div>
    {/* Segment tabs for Société */}
    {db?.name.includes("Société")&&<div style={{display:"flex",gap:0,marginBottom:10,background:"#F8F8F6",borderRadius:8,padding:2}}>
      {[{k:null,l:"Tous",c:"#555"},{k:"clients",l:"Clients",c:"#2563EB"},{k:"prospects",l:"Prospects",c:"#D97706"},{k:"partenaires",l:"Partenaires",c:"#16A34A"}].map(p=><button key={p.k||"all"} onClick={()=>{setActivePreset(activePreset===p.k?null:p.k);setPage(0)}} style={{padding:"6px 16px",border:"none",borderRadius:6,cursor:"pointer",fontFamily:font,fontSize:12,fontWeight:activePreset===p.k?700:400,background:activePreset===p.k?"#fff":"transparent",color:activePreset===p.k?p.c:"#999",boxShadow:activePreset===p.k?"0 1px 3px #00000012":"none",transition:"all .15s"}}>{p.l} <span style={{fontSize:10,opacity:.7}}>({p.k===null?(db.data||[]).length:p.k==="clients"?(db.data||[]).filter(r=>r.Statut==="Client").length:p.k==="prospects"?(db.data||[]).filter(r=>r.Statut==="Prospect").length:(db.data||[]).filter(r=>r.Statut==="Partenaire").length})</span></button>)}
    </div>}
    {/* Smart preset filters */}
    {!db?.name.includes("Société")&&!db?.name.includes("Contact")&&<div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
      {[{k:"actifs",l:"🟢 Actifs",desc:"En cours uniquement"},{k:"retard",l:"🔴 En retard",desc:"Deadline dépassée"},{k:"semaine",l:"📅 Cette semaine",desc:"7 prochains jours"}].map(p=><button key={p.k} onClick={()=>{setActivePreset(activePreset===p.k?null:p.k);setPage(0)}} title={p.desc} style={{padding:"5px 12px",borderRadius:8,border:"1.5px solid "+(activePreset===p.k?T.pri:T.bdr),background:activePreset===p.k?T.pri+"10":"#fff",color:activePreset===p.k?T.pri:"#777",fontSize:12,fontWeight:activePreset===p.k?700:500,cursor:"pointer",fontFamily:font,transition:"all .15s"}}>{p.l}</button>)}
    </div>}
    {/* Toolbar: search + sort + filters + view toggle */}
    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0)}} placeholder="🔍 Rechercher..." style={{...sst,flex:"0 1 220px",padding:"8px 12px",fontSize:13}}/>
      <select value={sortBy} onChange={e=>{setSortBy(e.target.value);setPage(0)}} style={sst}>
        {sortOptions.map(o=><option key={o.k} value={o.k}>{o.l}</option>)}
      </select>
      {selectFields.map(([n,d])=>{
        const vals=chipVals[n]||[];
        if(vals.length===0)return null;
        return <select key={n} value={filters[n]||""} onChange={e=>{setFilters(p=>({...p,[n]:e.target.value}));setPage(0)}} style={{...sst,color:filters[n]?T.pri:"#999"}}>
          <option value="">{n}</option>
          {vals.map(v=><option key={v} value={v}>{v}</option>)}
        </select>;
      })}
      {(Object.values(filters).some(Boolean)||Object.values(quickFilters).some(v=>v?.length>0)||activePreset)&&<button onClick={()=>{setFilters({});setQuickFilters({});setActivePreset(null);setPage(0)}} style={{...sst,color:T.dng,border:"1px solid "+T.dng+"40"}}>✕ Filtres</button>}
      <div style={{flex:1}}/>
      <div style={{display:"flex",gap:2,background:"#F0F0EC",borderRadius:6,padding:1}}>
        <button onClick={()=>setViewMode("cards")} style={{padding:"3px 8px",border:"none",borderRadius:5,cursor:"pointer",background:viewMode==="cards"?"#fff":"transparent",fontSize:11,fontFamily:font,color:viewMode==="cards"?T.txt:"#999",boxShadow:viewMode==="cards"?"0 1px 2px #00000008":"none"}}>☐ Cartes</button>
        <button onClick={()=>setViewMode("list")} style={{padding:"3px 8px",border:"none",borderRadius:5,cursor:"pointer",background:viewMode==="list"?"#fff":"transparent",fontSize:11,fontFamily:font,color:viewMode==="list"?T.txt:"#999",boxShadow:viewMode==="list"?"0 1px 2px #00000008":"none"}}>☰ Liste</button>
      </div>
      <span style={{fontSize:11,color:"#999"}}>{results.length} résultat{results.length>1?"s":""}{activePreset?" (filtré)":""}</span>
      {db&&<Btn size="sm" onClick={()=>onModal({mode:"create",type:tab,data:{}})}>+ Nouveau</Btn>}
    </div>
    {/* Quick filter chips for select/status fields */}
    {selectFields.length>0&&<div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"flex-start"}}>
      {selectFields.map(([fieldName,fieldDef])=>{
        const vals=chipVals[fieldName]||[];
        if(vals.length===0||vals.length>10)return null;
        const active=quickFilters[fieldName]||[];
        return <div key={fieldName} style={{display:"flex",gap:3,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"#999",fontWeight:600,marginRight:2}}>{fieldName}:</span>
          {vals.map(v=>{const on=active.includes(v);return <button key={v} onClick={()=>{setQuickFilters(p=>{const cur=p[fieldName]||[];const next=on?cur.filter(x=>x!==v):[...cur,v];return{...p,[fieldName]:next.length?next:undefined}});setPage(0)}} style={{padding:"2px 8px",borderRadius:10,border:"1px solid "+(on?T.pri+"60":T.bdr),background:on?T.pri+"14":"#fff",color:on?T.pri:"#888",fontSize:11,fontWeight:on?600:400,cursor:"pointer",fontFamily:font,transition:"all .15s"}}>{v}{on?" ✓":""}</button>})}
        </div>;
      })}
    </div>}
    {/* Pagination info */}
    {(() => {
      const totalPages=Math.ceil(results.length/PER_PAGE);
      const paged=grouped?results:results.slice(page*PER_PAGE,(page+1)*PER_PAGE);
      const PaginationBar=()=>totalPages>1&&!grouped?<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"12px 0"}}>
        <button onClick={()=>setPage(0)} disabled={page===0} style={{...sst,opacity:page===0?.4:1}}>«</button>
        <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{...sst,opacity:page===0?.4:1}}>‹</button>
        {Array.from({length:Math.min(totalPages,7)}).map((_,i)=>{
          let p;const half=3;
          if(totalPages<=7)p=i;
          else if(page<half)p=i;
          else if(page>=totalPages-half)p=totalPages-7+i;
          else p=page-half+i;
          return <button key={p} onClick={()=>setPage(p)} style={{...sst,minWidth:28,textAlign:"center",background:page===p?T.pri:"",color:page===p?"#fff":"#999",fontWeight:page===p?700:400}}>{p+1}</button>
        })}
        <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} style={{...sst,opacity:page>=totalPages-1?.4:1}}>›</button>
        <button onClick={()=>setPage(totalPages-1)} disabled={page>=totalPages-1} style={{...sst,opacity:page>=totalPages-1?.4:1}}>»</button>
        <span style={{fontSize:11,color:"#999",marginLeft:8}}>Page {page+1}/{totalPages}</span>
      </div>:null;

      // Compact list row renderer
      const listRow=(row)=>{
        const title=row[db.titleProp]||"Sans titre";const _s=socName(row);
        const dateKey=Object.keys(row).find(k=>k.startsWith("date:")&&k.endsWith(":start")&&row[k]);
        const dateVal=dateKey?row[dateKey]:"";const days=dateVal?daysUntil(dateVal):null;
        const etat=row.Etat||row["État"]||row.Statut||"";
        const prio=row["Priorité"]||"";
        const assignee=row["Assigned To"]||row.Participants||"";
        const uid=userIds(assignee)[0];
        return <div key={row.url} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#fff",border:"1px solid "+T.bdr,borderRadius:6,fontSize:12,cursor:"pointer"}} onClick={()=>hasRels?onDetail({entry:row,db}):null}>
          {uid&&<Avatar uid={uid} size={20}/>}
          <span style={{fontWeight:600,flex:"0 0 auto",maxWidth:280,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</span>
          {etat&&<Badge color={EC[etat]||"#999"}>{etat}</Badge>}
          {prio&&<Badge color={PC[prio]||"#999"}>{prio}</Badge>}
          {_s&&<span style={{color:"#2563EB",fontSize:11,flex:"0 0 auto"}}>🏢 {_s}</span>}
          <div style={{flex:1}}/>
          {dateVal&&<span style={{fontSize:11,fontWeight:600,color:days!==null&&days<0?"#DC2626":days!==null&&days<=3?"#D97706":"#999",flexShrink:0}}>{dateVal.slice(5)}{days!==null&&days<0?" ("+Math.abs(days)+"j)":""}</span>}
          <div style={{display:"flex",gap:2,flexShrink:0}}>
            <Btn variant="gh" size="sm" onClick={(e)=>{e.stopPropagation();onModal({mode:"edit",type:tab,data:{...row}})}}>✏️</Btn>
            <Btn variant="gh" size="sm" onClick={(e)=>{e.stopPropagation();onDelete({url:row.url,name:title})}}>🗑</Btn>
          </div>
        </div>;
      };

      return <>
        <PaginationBar/>
        {results.length===0?<div style={{textAlign:"center",padding:40,color:"#999"}}>{search||Object.values(filters).some(Boolean)||activePreset?"Aucun résultat pour ces critères":"Aucune entrée"}</div>:
        grouped?<div style={{display:"grid",gap:12}}>
          {groups.map(([socLabel,items])=>{const isOpen=!collapsed[socLabel];return <div key={socLabel}>
            <div onClick={()=>setCollapsed(p=>({...p,[socLabel]:!p[socLabel]}))} style={{display:"flex",alignItems:"center",gap:8,marginBottom:isOpen?8:0,cursor:"pointer",userSelect:"none",padding:"6px 8px",background:"#F8F8F6",borderRadius:8}}>
              <span style={{fontSize:12,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"rotate(0deg)",display:"inline-block"}}>▶</span>
              <div style={{width:28,height:28,borderRadius:7,background:"#2563EB14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#2563EB"}}>{socLabel[0]}</div>
              <span style={{fontSize:13,fontWeight:700,flex:1}}>{socLabel}</span>
              <span style={{fontSize:11,color:"#999",fontWeight:600}}>{items.length} élément{items.length>1?"s":""}</span>
            </div>
            {isOpen&&<div style={{display:"grid",gap:viewMode==="list"?3:5,paddingLeft:36}}>{items.map(viewMode==="list"?listRow:renderCard)}</div>}
          </div>})}
        </div>:
        <div style={{display:"grid",gap:viewMode==="list"?3:6}}>{paged.map(viewMode==="list"?listRow:renderCard)}</div>}
        <PaginationBar/>
      </>;
    })()}
  </div>;
}

/* ══════════════════════════════════════
   DYNFORM (create/edit — with auto-name)
   ══════════════════════════════════════ */
function DynForm({db,allDbs,modal,onClose,busy,onSave}){
  const isCreate=modal.mode==="create";const titlePropName=Object.entries(db.schema).find(([,d])=>d.type==="title")?.[0]||"Nom";
  const editFields=Object.entries(db.schema).filter(([,d])=>EDITABLE.has(d.type)).sort((a,b)=>a[1].type==="title"?-1:b[1].type==="title"?1:0);
  const relFields=Object.entries(db.schema).filter(([,d])=>d.type==="relation");
  const selectFields=Object.entries(db.schema).filter(([,d])=>d.type==="select");
  const[form,setForm]=useState(()=>{const init={};editFields.forEach(([n,d])=>{if(d.type==="place")init["place:"+n]=modal.data?.["place:"+n+":address"]||"";else if(d.type==="date")init["date:"+n]=modal.data?.["date:"+n+":start"]||"";else if(d.type==="person"){try{init["person:"+n]=(JSON.parse(modal.data?.[n]||"[]")[0]||"").replace("user://","")}catch{init["person:"+n]=""}}else init[n]=modal.data?.[n]||""});return init});
  const[rels,setRels]=useState(()=>{const init={};relFields.forEach(([n])=>{const pre=modal.preRel?.[n];if(pre){init[n]=[pre];return}try{init[n]=JSON.parse(modal.data?.[n]||"[]")}catch{init[n]=[]}});return init});
  const[newRels,setNewRels]=useState({});const[autoName,setAutoName]=useState(isCreate);
  const set=(k,v)=>{if(k===titlePropName)setAutoName(false);setForm(p=>({...p,[k]:v}))};
  const NAME_EXCLUDE=new Set(["Statut","Etat","État","Priorité","Fonction","Assigned To","Exercice","Participants","TRL","TRL Cible","Gouvernance","Stratégie PI","Démarrage","Cloture","Avancement","Sévérité","Actions à mener","Axe de R&DI"]);
  const isFacture=db.name.toLowerCase().includes("facture");
  const isJalon=db.name.toLowerCase().includes("jalon");
  useEffect(()=>{
    if(!autoName||!isCreate)return;const parts=[];
    const socRel=relFields.find(([n])=>n.toLowerCase().includes("société"));let socName="";
    if(socRel){const socDb=allDbs.find(d=>d.dsUrl===socRel[1].dataSourceUrl);const u=rels[socRel[0]]||[];if(socDb&&u[0]){const s=socDb.data?.find(r=>r.url===u[0]);if(s)socName=s[socDb.titleProp]||""}}
    const dosRel=relFields.find(([n])=>n.toLowerCase().includes("dossier"));let dos=null;
    if(dosRel){const dosDb=allDbs.find(d=>d.dsUrl===dosRel[1].dataSourceUrl);const u=rels[dosRel[0]]||[];if(dosDb&&u[0])dos=dosDb.data?.find(r=>r.url===u[0])}
    // Resolve linked Projet
    const projRel=relFields.find(([n])=>n.toLowerCase().includes("projet"));let projName="";
    if(projRel){const projDb=allDbs.find(d=>d.dsUrl===projRel[1].dataSourceUrl);const u=rels[projRel[0]]||[];if(projDb&&u[0]){const p=projDb.data?.find(r=>r.url===u[0]);if(p)projName=p[projDb.titleProp]||""}}
    // Abbreviate project name: keep first letters of each word, max 8 chars
    const abbrProj=(name)=>{if(!name)return"";const words=name.trim().split(/[\s\-_]+/);if(words.length===1)return name.slice(0,8);return words.map(w=>w[0]?.toUpperCase()||"").join("")};

    if(isJalon){
      // JALONS: 3 lettres société + nom abrégé projet + année
      if(socName)parts.push(socName.slice(0,3).toUpperCase());
      if(projName)parts.push(abbrProj(projName));
      if(form["Année"])parts.push(form["Année"]);
    }else if(isFacture){if(socName)parts.push(socName.slice(0,3).toUpperCase());if(form.Type)parts.push(form.Type);if(dos?.Type)parts.push(dos.Type);if(dos?.["Année"])parts.push(dos["Année"])}
    else{if(socName)parts.push(socName);selectFields.forEach(([n])=>{if(!NAME_EXCLUDE.has(n)&&form[n])parts.push(form[n])});if(dos){if(dos.Type&&!form.Type)parts.push(dos.Type);if(dos["Année"]&&!parts.includes(dos["Année"]))parts.push(dos["Année"])}
      if(!parts.some(p=>/^\d{4}$/.test(p))&&!selectFields.some(([n])=>n==="Année")){editFields.forEach(([n,d])=>{if(d.type==="date"&&form["date:"+n]){const y=form["date:"+n].slice(0,4);if(y&&!parts.includes(y))parts.push(y)}})}}
    const g=parts.filter(Boolean).join(" - ");if(g)setForm(p=>({...p,[titlePropName]:g}));
  },[autoName,isCreate,rels,form.Type,form["Année"],form["Exercice"]]);
  const save=()=>{if(!form[titlePropName]?.trim()){alert("Nom requis");return}onSave({form,rels,newRels})};
  const CONTEXT=["société","dossier","projet"];const ctxRels=relFields.filter(([n])=>CONTEXT.some(k=>n.toLowerCase().includes(k)));const otherRels=relFields.filter(([n])=>!CONTEXT.some(k=>n.toLowerCase().includes(k)));

  // Get selected context URLs for filtering
  const getSelUrl=(keyword)=>{const rf=relFields.find(([n])=>n.toLowerCase().includes(keyword));if(!rf)return null;const urls=rels[rf[0]]||[];return urls[0]||null};
  const selSocUrl=getSelUrl("société");const selDosUrl=getSelUrl("dossier");const selProjUrl=getSelUrl("projet");

  // Filter target items based on already-selected context
  const filterItems=(targetDb,relName)=>{
    const items=targetDb.data||[];
    const rnLow=relName.toLowerCase();
    // Never filter the société dropdown itself
    if(rnLow.includes("société"))return items;
    return items.filter(item=>{
      // If a société is selected, only show items linked to that société
      if(selSocUrl&&item["Société 2026"]){try{const urls=JSON.parse(item["Société 2026"]);if(!urls.includes(selSocUrl))return false}catch{}}
      // If a dossier is selected, filter non-dossier relations
      if(selDosUrl&&!rnLow.includes("dossier")&&item["Dossiers 2026"]){try{const urls=JSON.parse(item["Dossiers 2026"]);if(!urls.includes(selDosUrl))return false}catch{}}
      // If a projet is selected, filter non-projet relations
      if(selProjUrl&&!rnLow.includes("projet")&&item["Projets 2026"]){try{const urls=JSON.parse(item["Projets 2026"]);if(!urls.includes(selProjUrl))return false}catch{}}
      return true;
    });
  };

  const renderRel=([rn,rd])=>{const target=allDbs.find(d=>d.dsUrl===rd.dataSourceUrl);if(!target)return null;const sel=rels[rn]||[];const nw=newRels[rn]||[];
    const available=filterItems(target,rn);
    const unselected=available.filter(e=>!sel.includes(e.url));
    const selectedItems=sel.map(u=>target.data?.find(r=>r.url===u)).filter(Boolean);
    const addRel=(url)=>{if(url)setRels(p=>({...p,[rn]:[...(p[rn]||[]),url]}))};
    const removeRel=(url)=>setRels(p=>({...p,[rn]:(p[rn]||[]).filter(u=>u!==url)}));
    const isCtx=CONTEXT.some(k=>rn.toLowerCase().includes(k));
    const icon=rn.includes("Société")?"🏢":rn.includes("Dossier")?"📁":rn.includes("Projet")?"🚀":rn.includes("Réunion")?"📅":rn.includes("Contact")?"👤":rn.includes("Livrable")?"📋":rn.includes("Document")?"📄":rn.includes("Facture")?"💶":rn.includes("Jalon")?"🎯":"🔗";

    return <div key={rn} style={{borderTop:"1px solid "+T.bdr,paddingTop:12}}>
      <div style={{fontSize:10,fontWeight:600,color:isCtx?"#111":"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{icon} {rn}{isCtx&&<span style={{color:T.pri,marginLeft:4,fontWeight:400,textTransform:"none"}}>(contextuel)</span>}</div>
      {/* Selected items as removable tags */}
      {selectedItems.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
        {selectedItems.map(item=><span key={item.url} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,background:T.priBg,color:T.pri,fontSize:11,fontWeight:600}}>
          {item[target.titleProp]||"?"}
          <button onClick={()=>removeRel(item.url)} style={{background:"none",border:"none",color:T.pri,cursor:"pointer",padding:0,fontSize:12,lineHeight:1}}>✕</button>
        </span>)}
      </div>}
      {/* Dropdown to add */}
      <select value="" onChange={e=>addRel(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",background:T.bg,border:"1.5px solid "+T.bdr,borderRadius:T.rs,color:T.txt,fontSize:12,fontFamily:font,outline:"none",cursor:"pointer"}}>
        <option value="">{unselected.length===0?(available.length===0?"— Aucun disponible —":"— Tous sélectionnés —"):"— Sélectionner "+rn.replace(" 2026","")+" —"}</option>
        {unselected.map(e=><option key={e.url} value={e.url}>{e[target.titleProp]||"?"}</option>)}
      </select>
      {/* Inline create */}
      {nw.map((v,i)=><div key={i} style={{background:T.bg,borderRadius:6,padding:8,marginTop:5,display:"flex",gap:6,alignItems:"flex-end",border:"1px dashed "+T.bdr}}><div style={{flex:1}}><Fld label={target.titleProp} value={v} onChange={val=>setNewRels(p=>{const a=[...(p[rn]||[])];a[i]=val;return{...p,[rn]:a}})} required small/></div><button onClick={()=>setNewRels(p=>({...p,[rn]:(p[rn]||[]).filter((_,j)=>j!==i)}))} style={{padding:4,background:"none",border:"none",color:T.dng,cursor:"pointer"}}>✕</button></div>)}
      <button onClick={()=>setNewRels(p=>({...p,[rn]:[...(p[rn]||[]),""]}))} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,border:"none",background:"transparent",color:T.pri,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:font,marginTop:4}}>+ Créer</button>
    </div>};
  const renderField=([name,def])=>{
    if(def.type==="title")return null;
    if(def.type==="place")return <Fld key={name} label={"📍 "+name} value={form["place:"+name]} onChange={v=>set("place:"+name,v)} placeholder="Adresse"/>;
    if(def.type==="date")return <Fld key={name} label={"📅 "+name} value={form["date:"+name]} onChange={v=>setForm(p=>({...p,["date:"+name]:v}))} type="date"/>;
    if(def.type==="person")return <div key={name} style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#999"}}>👤 {name}</label><select value={form["person:"+name]||""} onChange={e=>set("person:"+name,e.target.value)} style={{width:"100%",padding:"8px 10px",background:T.bg,border:"1.5px solid "+T.bdr,borderRadius:T.rs,fontSize:13,fontFamily:font,outline:"none"}}><option value="">—</option>{USERS.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>;
    if(def.type==="select"||def.type==="status")return <Fld key={name} label={name} value={form[name]} onChange={v=>setForm(p=>({...p,[name]:v}))} type="select" options={(def.options||[]).map(o=>o.name)}/>;
    return <Fld key={name} label={name} value={form[name]} onChange={v=>set(name,v)} type={inputType(def.type)} placeholder={def.type==="email"?"email@ex.fr":def.type==="number"?"0":""}/>;
  };
  return <div style={{background:"#fff",borderRadius:14,width:480,boxShadow:"0 12px 36px rgba(0,0,0,.12)",overflow:"hidden",maxHeight:"90vh",overflowY:"auto"}}>
    <div style={{padding:"14px 18px",borderBottom:"1px solid "+T.bdr,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:2}}>
      <h3 style={{margin:0,fontSize:15,fontWeight:700}}>{isCreate?"Nouveau — ":"Modifier — "}{db.name}</h3><Btn variant="gh" size="sm" onClick={onClose}>✕</Btn>
    </div>
    <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
      {isCreate&&<>{ctxRels.map(renderRel)}{editFields.filter(([,d])=>d.type!=="title").map(renderField)}{otherRels.map(renderRel)}
        <div style={{borderTop:"1px solid "+T.bdr,paddingTop:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><label style={{fontSize:11,fontWeight:600,color:"#999"}}>{titlePropName} {autoName&&<span style={{color:"#16A34A"}}>(auto)</span>} *</label>{!autoName&&<button onClick={()=>setAutoName(true)} style={{fontSize:10,color:T.pri,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>🔄</button>}</div>
          <input value={form[titlePropName]||""} onChange={e=>set(titlePropName,e.target.value)} placeholder="Sélectionnez société et dossier..." style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",background:autoName?"#F0FDF4":T.bg,border:"1.5px solid "+(autoName?"#16A34A":T.bdr),borderRadius:T.rs,fontSize:14,fontFamily:font,outline:"none"}}/>
        </div>
      </>}
      {!isCreate&&editFields.map(renderField)}
    </div>
    <div style={{padding:"12px 18px",borderTop:"1px solid "+T.bdr,display:"flex",gap:8,justifyContent:"flex-end",position:"sticky",bottom:0,background:"#fff"}}>
      <Btn variant="sec" onClick={onClose} disabled={busy}>Annuler</Btn><Btn onClick={save} loading={busy}>{isCreate?"Créer":"Enregistrer"}</Btn>
    </div>
  </div>;
}

/* ══════════════════════════════════════
   DETAIL VIEW (fiche)
   ══════════════════════════════════════ */
function DetailView({entry,db,allDbs,onClose,onOpenModal,onDeleteEntry}){
  const title=entry[db.titleProp]||"Sans titre";const relFields=Object.entries(db.schema).filter(([,d])=>d.type==="relation");
  const infoFields=Object.entries(db.schema).filter(([,d])=>d.type!=="title"&&d.type!=="relation"&&!READONLY.has(d.type));const color=COLORS[allDbs.indexOf(db)%COLORS.length];const docsDb=allDbs.find(d=>d.name.includes("Documents"));
  return <div style={{background:"#fff",borderRadius:14,width:640,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 36px rgba(0,0,0,.12)"}}>
    <div style={{padding:"18px 22px",borderBottom:"1px solid "+T.bdr,display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"sticky",top:0,background:"#fff",zIndex:2,borderRadius:"14px 14px 0 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:42,height:42,borderRadius:10,background:color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color}}>{title[0]?.toUpperCase()}</div>
        <div><h2 style={{margin:0,fontSize:19,fontWeight:800}}>{title}</h2><div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
          {infoFields.map(([n,d])=>{const v=dv(entry,n,d,allDbs);if(!v)return null;if(d.type==="select")return <Badge key={n} color={EC[v]||PC[v]||color}>{v}</Badge>;if(d.type==="url")return <LinkBtn key={n} url={v}/>;if(d.type==="number")return <span key={n} style={{fontSize:13,fontWeight:700}}>{Number(v).toLocaleString("fr-FR")} €</span>;return <span key={n} style={{fontSize:12,color:"#888"}}>{TI[d.type]||""} {v}</span>})}
          <Links row={entry}/></div></div>
      </div>
      <div style={{display:"flex",gap:4}}><Btn variant="gh" size="sm" onClick={()=>{onClose();onOpenModal({mode:"edit",type:allDbs.indexOf(db),data:{...entry}})}}>✏️</Btn><Btn variant="gh" size="sm" onClick={onClose}>✕</Btn></div>
    </div>
    <div style={{padding:"18px 22px"}}>
      {relFields.map(([rn,rd])=>{const tDb=allDbs.find(d=>d.dsUrl===rd.dataSourceUrl);if(!tDb)return null;const items=resolveRel(entry[rn],tDb);const tInfo=Object.entries(tDb.schema).filter(([,d])=>d.type!=="title"&&d.type!=="relation"&&!READONLY.has(d.type));const icon=tDb.name.includes("Contact")?"👤":tDb.name.includes("Réunion")?"📅":tDb.name.includes("Livrable")?"📋":tDb.name.includes("Document")?"📄":tDb.name.includes("Facture")?"💶":tDb.name.includes("Jalon")?"🎯":tDb.name.includes("Projet")?"🚀":tDb.name.includes("Risque")?"⚠️":tDb.name.includes("Dossier")?"📁":"🔗";const rev=Object.entries(tDb.schema).find(([,d])=>d.type==="relation"&&d.dataSourceUrl===db.dsUrl)?.[0];
        return <div key={rn} style={{marginBottom:20}}><div style={{fontSize:12,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>{icon} {rn} ({items.length})</div>
          {items.length===0&&<div style={{fontSize:12,color:"#ccc",fontStyle:"italic",marginBottom:6}}>—</div>}
          {items.map((item,idx)=>{const iT=item[tDb.titleProp]||"?";return <div key={idx} style={{background:T.bg,borderRadius:8,padding:"9px 12px",marginBottom:5,border:"1px solid "+T.bdr}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:tInfo.length?3:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:600}}>{iT}</span>
                {tInfo.filter(([,d])=>d.type==="select").map(([fn])=>{const fv=item[fn];if(!fv)return null;return <Tag key={fn} color={EC[fv]||PC[fv]||"#7C3AED"}>{fv}</Tag>})}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><Links row={item} compact/>
                {item.Montant&&<span style={{fontSize:13,fontWeight:700,marginRight:4}}>{Number(item.Montant).toLocaleString("fr-FR")} €</span>}
                <button onClick={()=>{onClose();onOpenModal({mode:"edit",type:allDbs.indexOf(tDb),data:{...item}})}} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:11}}>✏️</button>
                <button onClick={()=>onDeleteEntry(item.url,iT)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:11}}>🗑</button>
              </div>
            </div>
            <div style={{display:"flex",gap:12,fontSize:11.5,color:"#888",flexWrap:"wrap",alignItems:"center"}}>
              {tInfo.filter(([,d])=>d.type!=="select"&&d.type!=="number").map(([fn,fd])=>{const fv=dv(item,fn,fd,allDbs);if(!fv)return null;if(fd.type==="url")return <LinkBtn key={fn} url={fv}/>;return <span key={fn}>{TI[fd.type]||""} {fv}</span>})}
              {tDb.name.includes("Livrable")&&docsDb&&resolveRel(item["Documents 2026"],docsDb).map((doc,di)=><Links key={"dl"+di} row={doc} compact/>)}
            </div>
          </div>})}
          <button onClick={()=>{const preRel=rev?{[rev]:entry.url}:{};onClose();onOpenModal({mode:"create",type:allDbs.indexOf(tDb),data:{},preRel})}} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:6,border:"1.5px dashed "+T.pri+"40",background:"transparent",color:T.pri,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font,marginTop:4}}>+ Ajouter</button>
        </div>})}
    </div>
  </div>;
}

/* ══════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════ */
export default function App(){
  const[dbs,setDbs]=useState(CFG.map(c=>({...c,data:[]})));
  const[mode,setMode]=useState("dashboard");
  const[crmUser,setCrmUser]=useState(null); // null=Général, or user id
  const[tab,setTab]=useState(0);const[loading,setLoading]=useState(true);const[busy,setBusy]=useState(false);
  const[modal,setModal]=useState(null);const[toast,setToast]=useState(null);const[confirm,setConfirm]=useState(null);const[detail,setDetail]=useState(null);

  const notify=(m,e)=>{setToast({m,e});setTimeout(()=>setToast(null),3500)};
  const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
  const loadData=useCallback(async()=>{
    setLoading(true);
    const results=await Promise.all(CFG.map(async(db)=>{
      for(let a=0;a<3;a++){try{const data=await queryDb(db.dsId);return{...db,data}}catch(e){if(a<2){await wait(500*(a+1));continue}return{...db,data:[]}}}
    }));
    setDbs(results);setLoading(false);
  },[]);
  useEffect(()=>{loadData()},[loadData]);

  // Filter data by selected CRM user — cascading through société relations
  const personFieldNames=["Assigned To","Participants","Personne"];
  const filteredDbs=useMemo(()=>{
    if(!crmUser)return dbs;
    // Step 1: Filter databases WITH person fields by user
    const step1=dbs.map(db=>{
      const hasPersonField=personFieldNames.some(pf=>db.schema[pf]?.type==="person");
      if(!hasPersonField)return db;
      const filtered=(db.data||[]).filter(row=>{
        return personFieldNames.some(pf=>{
          const raw=row[pf];if(!raw)return false;
          try{return JSON.parse(raw).some(u=>u.replace("user://","")===crmUser)}catch{return false}
        });
      });
      return{...db,data:filtered};
    });
    // Step 2: Collect all société URLs from user's filtered items
    const userSocUrls=new Set();
    step1.forEach(db=>{
      if(!personFieldNames.some(pf=>db.schema[pf]?.type==="person"))return;
      (db.data||[]).forEach(row=>{
        try{const urls=JSON.parse(row["Société 2026"]||"[]");urls.forEach(u=>userSocUrls.add(u))}catch{}
      });
    });
    // Step 3: Filter ALL other databases by société relation (cascade)
    return step1.map(db=>{
      const hasPersonField=personFieldNames.some(pf=>db.schema[pf]?.type==="person");
      if(hasPersonField)return db; // already filtered in step 1
      if(db.name.includes("Société")){
        if(userSocUrls.size===0)return{...db,data:[]};
        return{...db,data:(db.data||[]).filter(r=>userSocUrls.has(r.url))};
      }
      if(db.name.includes("Contact")){
        if(userSocUrls.size===0)return{...db,data:[]};
        return{...db,data:(db.data||[]).filter(r=>{
          try{const urls=JSON.parse(r["Société 2026"]||"[]");return urls.length===0||urls.some(u=>userSocUrls.has(u))}catch{return false}
        })};
      }
      if(!db.schema["Société 2026"])return db;
      if(userSocUrls.size===0)return{...db,data:[]};
      return{...db,data:(db.data||[]).filter(row=>{
        try{const urls=JSON.parse(row["Société 2026"]||"[]");return urls.length===0||urls.some(u=>userSocUrls.has(u))}catch{return false}
      })};
    });
  },[dbs,crmUser]);

  const pid=(url)=>(url||"").replace("notion://","");
  const handleSave=async(data)=>{const db=dbs[modal.type];if(!db)return;setBusy(true);
    try{if(modal.mode==="create"){const relUrls={};for(const[rn,entries]of Object.entries(data.newRels||{})){const rd=db.schema[rn];if(!rd)continue;const target=dbs.find(d=>d.dsUrl===rd.dataSourceUrl);if(!target)continue;relUrls[rn]=[...(data.rels[rn]||[])];for(const t of entries){if(t?.trim()){const p=await createPage(target.dsId,{[target.titleProp]:t.trim()},target.schema);relUrls[rn].push(p.url)}}}
      const props=buildProps(data.form,db.schema);Object.entries(data.rels||{}).forEach(([rn])=>{const urls=relUrls[rn]||data.rels[rn]||[];if(urls.length>0)props[rn]=JSON.stringify(urls)});await createPage(db.dsId,props,db.schema);notify("Créé !")}
    else{await updatePage(pid(modal.data.url),buildProps(data.form,db.schema),db.schema);notify("Enregistré !")}setModal(null);await loadData()
    }catch(e){notify("Erreur: "+e.message,true)}setBusy(false)};

  const handleDelete=async(url,name)=>{setBusy(true);try{await archivePage(pid(url||confirm.url));notify("Supprimé !");setConfirm(null);await loadData()}catch(e){notify("Erreur",true)}setBusy(false)};

  if(loading)return <div style={{fontFamily:font,display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg}}><div style={{textAlign:"center"}}><Spin s={24}/><p style={{color:"#999",fontSize:13,marginTop:12}}>Chargement des données Notion...</p></div></div>;

  return <div style={{fontFamily:font,background:T.bg,minHeight:"100vh",color:T.txt}}>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
    <header style={{background:"#fff",borderBottom:"1px solid "+T.bdr,padding:"0 28px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#111,#444)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>📊</div>
          <h1 style={{margin:0,fontSize:19,fontWeight:800,letterSpacing:-.5}}>Point du Jour CRM</h1>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{display:"flex",background:"#F0EFEC",borderRadius:8,padding:3}}>
            <button onClick={()=>setMode("dashboard")} style={{padding:"5px 14px",borderRadius:6,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,background:mode==="dashboard"?"#fff":"transparent",color:mode==="dashboard"?T.txt:"#999",boxShadow:mode==="dashboard"?"0 1px 3px rgba(0,0,0,.08)":"none"}}>📊 Dashboard</button>
            <button onClick={()=>setMode("manager")} style={{padding:"5px 14px",borderRadius:6,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,background:mode==="manager"?"#fff":"transparent",color:mode==="manager"?T.txt:"#999",boxShadow:mode==="manager"?"0 1px 3px rgba(0,0,0,.08)":"none"}}>⚙️ Gérer</button>
          </div>
          <Btn variant="sec" size="sm" onClick={loadData} loading={loading}>🔄</Btn>
        </div>
      </div>
      {/* ── CRM User Selector ── */}
      <div style={{display:"flex",gap:0,paddingBottom:10,overflowX:"auto"}}>
        <button onClick={()=>setCrmUser(null)} style={{padding:"6px 16px",border:"none",borderBottom:"2.5px solid "+(crmUser===null?"#111":"transparent"),cursor:"pointer",fontFamily:font,fontSize:12,fontWeight:crmUser===null?700:500,background:"transparent",color:crmUser===null?"#111":"#999",transition:"all .15s"}}>🏢 CRM Général</button>
        {USERS.map(u=><button key={u.id} onClick={()=>setCrmUser(crmUser===u.id?null:u.id)} style={{padding:"6px 16px",border:"none",borderBottom:"2.5px solid "+(crmUser===u.id?u.color:"transparent"),cursor:"pointer",fontFamily:font,fontSize:12,fontWeight:crmUser===u.id?700:500,background:"transparent",color:crmUser===u.id?u.color:"#999",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}><Avatar uid={u.id} size={20}/> CRM {u.short}</button>)}
      </div>
    </header>
    <main style={{padding:"20px 28px",maxWidth:1100,margin:"0 auto"}}>
      {mode==="dashboard"?<DashboardView dbs={filteredDbs} crmUser={crmUser}/>:<ManagerView dbs={filteredDbs} tab={tab} setTab={setTab} onModal={setModal} onDetail={setDetail} onDelete={setConfirm}/>}
    </main>
    {modal&&dbs[modal.type]&&<Overlay onClose={()=>!busy&&setModal(null)}><DynForm db={dbs[modal.type]} allDbs={dbs} modal={modal} onClose={()=>setModal(null)} busy={busy} onSave={handleSave}/></Overlay>}
    {detail&&<Overlay onClose={()=>setDetail(null)}><DetailView entry={detail.entry} db={detail.db} allDbs={dbs} onClose={()=>setDetail(null)} onOpenModal={setModal} onDeleteEntry={(url,name)=>{setDetail(null);setConfirm({url,name})}}/></Overlay>}
    {confirm&&<Overlay onClose={()=>setConfirm(null)}><div style={{background:"#fff",borderRadius:14,padding:22,width:360,boxShadow:"0 12px 36px rgba(0,0,0,.1)"}}><h3 style={{margin:"0 0 8px",fontSize:15,fontWeight:700,color:T.dng}}>Supprimer ?</h3><p style={{margin:"0 0 18px",color:"#888",fontSize:13}}>Retirer <strong>{confirm.name}</strong> ?</p><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="sec" onClick={()=>setConfirm(null)}>Annuler</Btn><Btn variant="dng" loading={busy} onClick={()=>handleDelete()}>Supprimer</Btn></div></div></Overlay>}
    {toast&&<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:toast.e?T.dng:T.suc,color:"#fff",padding:"10px 20px",borderRadius:9,fontSize:13,fontWeight:600,fontFamily:font,zIndex:1000,boxShadow:"0 4px 12px rgba(0,0,0,.1)",animation:"su .25s ease-out"}}>{toast.m}</div>}
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes su{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes si{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}*{box-sizing:border-box;margin:0}`}</style>
  </div>;
}
