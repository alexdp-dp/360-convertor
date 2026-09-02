const categories = {
  lungime:{name:'Lungime',units:{'Milimetri|mm':.001,'Centimetri|cm':.01,'Metri|m':1,'Kilometri|km':1000,'Inch|in':.0254,'Picioare|ft':.3048,'Yarzi|yd':.9144,'Mile|mi':1609.344}},
  suprafata:{name:'Suprafață',units:{'Centimetri pătrați|cm²':.0001,'Metri pătrați|m²':1,'Hectare|ha':10000,'Kilometri pătrați|km²':1e6,'Acri|ac':4046.8564224}},
  masa:{name:'Masă',units:{'Miligrame|mg':.000001,'Grame|g':.001,'Kilograme|kg':1,'Tone|t':1000,'Uncii|oz':.028349523125,'Livre|lb':.45359237}},
  volum:{name:'Volum',units:{'Mililitri|ml':.001,'Centilitri|cl':.01,'Litri|l':1,'Metri cubi|m³':1000,'Galoane SUA|gal':3.785411784}},
  viteza:{name:'Viteză',units:{'Metri/secundă|m/s':1,'Kilometri/oră|km/h':.2777777778,'Mile/oră|mph':.44704,'Noduri|kn':.5144444444}},
  temperatura:{name:'Temperatură',temperature:true,units:{'Celsius|°C':'c','Fahrenheit|°F':'f','Kelvin|K':'k'}},
  timp:{name:'Timp',units:{'Milisecunde|ms':.001,'Secunde|s':1,'Minute|min':60,'Ore|h':3600,'Zile|zile':86400,'Săptămâni|săpt.':604800}},
  date:{name:'Stocare digitală',units:{'Bytes|B':1,'Kilobytes|KB':1e3,'Megabytes|MB':1e6,'Gigabytes|GB':1e9,'Terabytes|TB':1e12}}
};
const select=document.querySelector('#category'),list=document.querySelector('#unitList');
Object.entries(categories).forEach(([k,v])=>select.add(new Option(v.name,k)));
function tempToC(v,u){return u==='c'?v:u==='f'?(v-32)*5/9:v-273.15} function cToTemp(v,u){return u==='c'?v:u==='f'?v*9/5+32:v+273.15}
function render(){const cat=categories[select.value];list.innerHTML='';Object.entries(cat.units).forEach(([label,factor])=>{const [name,symbol]=label.split('|');const row=document.createElement('label');row.className='unit-row';row.innerHTML=`<strong>${symbol}<small class="d-block text-secondary">${name}</small></strong><input class="form-control" inputmode="decimal" data-factor="${factor}" aria-label="${name}">`;list.append(row)});list.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>convert(input,cat)));list.querySelector('input').value=1;convert(list.querySelector('input'),cat)}
function convert(source,cat){const raw=source.value.replace(',','.').replace(/\s/g,'');if(raw===''||!Number.isFinite(Number(raw))){list.querySelectorAll('input').forEach(i=>{if(i!==source)i.value=''});return}const value=Number(raw);const base=cat.temperature?tempToC(value,source.dataset.factor):value*Number(source.dataset.factor);list.querySelectorAll('input').forEach(i=>{if(i!==source){const result=cat.temperature?cToTemp(base,i.dataset.factor):base/Number(i.dataset.factor);i.value=Number(result.toPrecision(12)).toString()}})}
select.addEventListener('change',render);render();
