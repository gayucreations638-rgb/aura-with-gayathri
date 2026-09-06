const PRODUCTS=[
{id:"bracelet",name:"Custom Beaded Bracelet",price:249,emoji:"📿",desc:"Personalised colours and letter beads."},
{id:"necklace",name:"Beaded Necklace",price:399,emoji:"📿",desc:"Handmade everyday necklace."},
{id:"earrings",name:"Cute Beaded Earrings",price:199,emoji:"✨",desc:"Lightweight handmade earrings."},
{id:"anklet",name:"Beaded Anklet",price:229,emoji:"🪷",desc:"Custom colours available."},
{id:"hairclip",name:"Beaded Hair Clip",price:149,emoji:"🎀",desc:"A colourful handmade accessory."},
{id:"combo",name:"Bracelet + Earrings Combo",price:399,emoji:"💜",desc:"A matching handmade set."}
];
const UPI_ID="smksmitha-5@okhdfcbank";
const SHOP_EMAIL="gayucreations638@gmail.com";
const ORDER_ENDPOINT="PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
let cart=JSON.parse(localStorage.getItem("auraCart")||"[]");
let account=JSON.parse(localStorage.getItem("auraAccount")||"null");
const money=n=>Number(n).toLocaleString("en-IN");
const productById=id=>PRODUCTS.find(p=>p.id===id);
const total=()=>cart.reduce((s,i)=>s+productById(i.id).price*i.qty,0);
function saveCart(){localStorage.setItem("auraCart",JSON.stringify(cart))}
function add(id){const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});saveCart();render();openDrawer()}
function change(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i.id!==id);saveCart();render()}
function renderProducts(){document.getElementById("products").innerHTML=PRODUCTS.map(p=>`<article class="product"><div class="product-art">${p.emoji}</div><div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${money(p.price)}</div><button class="add" onclick="add('${p.id}')">Add to cart</button></div></article>`).join("")}
function render(){document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);document.getElementById("cartTotal").textContent=money(total());document.getElementById("cartItems").innerHTML=cart.length?cart.map(i=>{const p=productById(i.id);return `<div class="cart-item"><div><strong>${p.name}</strong><br>₹${money(p.price*i.qty)}</div><div class="qty"><button onclick="change('${p.id}',-1)">−</button> ${i.qty} <button onclick="change('${p.id}',1)">+</button></div></div>`}).join(""):"<p>Your cart is empty.</p>";document.getElementById("checkoutSummary").innerHTML=cart.map(i=>{const p=productById(i.id);return `<div class="summary-line"><span>${p.name} × ${i.qty}</span><strong>₹${money(p.price*i.qty)}</strong></div>`}).join("");document.getElementById("checkoutTotal").textContent=money(total());document.getElementById("upiPay").href=`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=Aura%20with%20Gayathri&am=${total()}&cu=INR`;updateAccountButton()}
function openDrawer(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("backdrop").classList.add("show")}function closeDrawer(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("backdrop").classList.remove("show")}
document.getElementById("openCart").onclick=openDrawer;document.getElementById("closeCart").onclick=closeDrawer;document.getElementById("backdrop").onclick=closeDrawer;
document.getElementById("checkoutBtn").onclick=()=>{if(!cart.length){alert("Your cart is empty.");return}closeDrawer();document.getElementById("checkout").classList.remove("hidden");document.getElementById("checkout").scrollIntoView({behavior:"smooth"})};
document.getElementById("copyUpi").onclick=async()=>{try{await navigator.clipboard.writeText(UPI_ID)}catch(e){}document.getElementById("copyUpi").textContent="Copied ✓";setTimeout(()=>document.getElementById("copyUpi").textContent="Copy UPI ID",1500)};

function getAccounts(){return JSON.parse(localStorage.getItem("auraAccounts")||"[]")}
function saveAccounts(a){localStorage.setItem("auraAccounts",JSON.stringify(a))}
function hashText(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i)|0;return String(h)}
function updateAccountButton(){document.getElementById("accountBtn").textContent=account?`Hi, ${account.name.split(" ")[0]}`:"Login"}
function openAccount(){document.getElementById("accountModal").classList.remove("hidden");renderAccount()}
function closeAccount(){document.getElementById("accountModal").classList.add("hidden")}
function renderAccount(){
const c=document.getElementById("accountContent");
if(account){c.innerHTML=`<h2>Welcome, ${account.name}</h2><p>${account.email}</p><div class="account-list"><button class="primary" id="myOrdersBtn">My orders</button><button class="danger" id="logoutBtn">Log out</button></div><div id="myOrders"></div>`;document.getElementById("logoutBtn").onclick=()=>{account=null;localStorage.removeItem("auraAccount");render();closeAccount()};document.getElementById("myOrdersBtn").onclick=showMyOrders}
else{c.innerHTML=`<h2>Customer account</h2><div class="auth-tabs"><button id="loginTab">Login</button><button id="signupTab">Create account</button></div><form id="authForm" class="auth-form"></form>`;const f=document.getElementById("authForm");const setForm=login=>{f.innerHTML=login?`<input required name="email" type="email" placeholder="Email"><input required name="password" type="password" placeholder="Password"><button class="primary" type="submit">Login</button>`:`<input required name="name" placeholder="Full name"><input required name="email" type="email" placeholder="Email"><input required name="password" type="password" minlength="6" placeholder="Password (6+ characters)"><button class="primary" type="submit">Create account</button>`;f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));const list=getAccounts();if(login){const x=list.find(a=>a.email.toLowerCase()===d.email.toLowerCase()&&a.password===hashText(d.password));if(!x){alert("Incorrect email or password.");return}account={name:x.name,email:x.email};localStorage.setItem("auraAccount",JSON.stringify(account));closeAccount();render()}else{if(list.some(a=>a.email.toLowerCase()===d.email.toLowerCase())){alert("An account with that email already exists.");return}list.push({name:d.name,email:d.email,password:hashText(d.password)});saveAccounts(list);account={name:d.name,email:d.email};localStorage.setItem("auraAccount",JSON.stringify(account));closeAccount();render();alert("Account created successfully!")}}};setForm(true);document.getElementById("loginTab").onclick=()=>setForm(true);document.getElementById("signupTab").onclick=()=>setForm(false)}
}
function showMyOrders(){const box=document.getElementById("myOrders");box.innerHTML="<h3>My recent orders</h3><p>Use the Track Order section with an Order ID to see live status. Orders are stored by the shop backend.</p>"}
document.getElementById("accountBtn").onclick=openAccount;document.getElementById("closeAccount").onclick=closeAccount;

document.getElementById("orderForm").addEventListener("submit",async e=>{
e.preventDefault();if(!cart.length)return;const status=document.getElementById("formStatus"),btn=document.getElementById("submitOrder");
if(ORDER_ENDPOINT.includes("PASTE_YOUR")){status.textContent="Email/order connection is not configured. Deploy apps-script/Code.gs and paste its /exec URL into script.js.";return}
const data=Object.fromEntries(new FormData(e.target));if(account){data.email=account.email;data.accountEmail=account.email}
const orderId="AURA-"+Date.now().toString().slice(-8);
const order={orderId,createdAt:new Date().toISOString(),customer:data,items:cart.map(i=>{const p=productById(i.id);return{name:p.name,qty:i.qty,price:p.price}}),total:total(),upiId:UPI_ID};
btn.disabled=true;status.textContent="Sending your order…";
try{await fetch(ORDER_ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(order)});cart=[];saveCart();render();e.target.reset();status.innerHTML=`Order <strong>${orderId}</strong> submitted! <a href="#track">Track it here</a>. Please keep your payment confirmation.`}catch(err){status.textContent="Could not send the order. Please try again."}finally{btn.disabled=false}
});

document.getElementById("trackForm").addEventListener("submit",async e=>{
e.preventDefault();const id=document.getElementById("trackId").value.trim();const out=document.getElementById("trackResult");out.innerHTML="<p>Checking order…</p>";
if(ORDER_ENDPOINT.includes("PASTE_YOUR")){out.innerHTML="<p>Order tracking needs the Google Apps Script /exec URL in script.js.</p>";return}
try{const r=await fetch(ORDER_ENDPOINT+"?action=track&orderId="+encodeURIComponent(id));const data=await r.json();if(!data.ok){out.innerHTML="<p>Order not found.</p>";return}renderTracking(data.order,out)}catch(err){out.innerHTML="<p>Could not check the order right now. Please try again.</p>"}
});
function renderTracking(o,out){const states=["Order Placed","Payment Received","Processing","Packed","Shipped","Delivered"];let current=Math.max(0,states.indexOf(o.status));if(current<0)current=0;out.innerHTML=`<div class="track-details"><strong>${o.orderId}</strong><p>Status: <b>${o.status}</b></p><div class="timeline">${states.map((s,i)=>`<div class="step ${i<=current?"done":""}">${s}</div>`).join("")}</div><p>Customer: ${o.customerName||""}<br>Total: ₹${money(o.total||0)}</p></div>`}

renderProducts();render();