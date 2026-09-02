const modes={
percent:{name:'Procent',fields:[['Procent','p',20],['Din valoarea','v',500]],calc:x=>[x.v*x.p/100,`${x.p}% din ${x.v}`]},
change:{name:'Creștere / scădere',fields:[['Valoare inițială','a',100],['Procent (+ sau −)','p',15]],calc:x=>[x.a*(1+x.p/100),`${x.a} modificat cu ${x.p}%`]},
difference:{name:'Diferență %',fields:[['Valoarea inițială','a',80],['Valoarea nouă','b',100]],calc:x=>[(x.b-x.a)/Math.abs(x.a)*100,'Modificarea procentuală']},
vatadd:{name:'Adaugă TVA',fields:[['Valoare fără TVA','a',1000],['TVA %','p',19]],calc:x=>[x.a*(1+x.p/100),'Valoare cu TVA']},
vatremove:{name:'Elimină TVA',fields:[['Valoare cu TVA','a',1190],['TVA %','p',19]],calc:x=>[x.a/(1+x.p/100),'Valoare fără TVA']},
rule3:{name:'Regula de trei',fields:[['A','a',10],['corespunde lui B','b',25],['C','c',18]],calc:x=>[x.b*x.c/x.a,'A : B = C : rezultat']},
discount:{name:'Discount',fields:[['Preț inițial','a',500],['Reducere %','p',20]],calc:x=>[x.a*(1-x.p/100),'Preț după reducere']},
margin:{name:'Adaos și marjă',fields:[['Cost','a',100],['Preț vânzare','b',150]],calc:x=>[(x.b-x.a)/x.a*100,`Adaos; marjă ${formatNumber((x.b-x.a)/x.b*100,2)}%`]},
split:{name:'Împarte suma',fields:[['Sumă','a',1000],['Număr persoane','b',4]],calc:x=>[x.a/x.b,'Sumă pentru fiecare']},
interest:{name:'Dobândă simplă',fields:[['Capital','a',10000],['Dobândă anuală %','p',5],['Ani','y',3]],calc:x=>[x.a*(1+x.p*x.y/100),'Capital + dobândă']},
tip:{name:'Bacșiș',fields:[['Nota','a',250],['Bacșiș %','p',10],['Persoane','b',2]],calc:x=>[x.a*(1+x.p/100)/x.b,'De plată pentru fiecare']},
ppc:{name:'Metrici PPC',fields:[['Cost total','cost',5000],['Clickuri','clicks',2500],['Afișări','views',100000],['Leaduri','leads',100]],calc:x=>[x.cost/x.leads,`CPL · CPC ${formatNumber(x.cost/x.clicks,2)} · CPM ${formatNumber(x.cost/x.views*1000,2)} · CTR ${formatNumber(x.clicks/x.views*100,2)}%`]},
ppcbudget:{name:'Buget PPC',fields:[['Leaduri dorite','leads',100],['CPL estimat','cpl',50]],calc:x=>[x.leads*x.cpl,'Buget necesar estimat']}
};
const tabs=document.querySelector('#calcTabs'),fields=document.querySelector('#calcFields');let active='percent';
function render(){tabs.innerHTML=Object.entries(modes).map(([k,m])=>`<button class="utility-chip ${k===active?'active':''}" data-mode="${k}">${m.name}</button>`).join('');fields.innerHTML=modes[active].fields.map(([label,id,val])=>`<div class="col-md"><label class="form-label">${label}</label><input class="form-control calc-input" id="c_${id}" type="number" value="${val}"></div>`).join('');tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{active=b.dataset.mode;render()});fields.querySelectorAll('input').forEach(i=>i.oninput=calc);calc()}
function calc(){const x={};modes[active].fields.forEach(([,id])=>x[id]=Number(document.querySelector('#c_'+id).value));const[r,f]=modes[active].calc(x);document.querySelector('#calcResult').textContent=formatNumber(r,6)+(active==='difference'||active==='margin'?'%':'');document.querySelector('#calcFormula').textContent=f}
render();
