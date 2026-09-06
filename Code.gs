const SHOP_EMAIL="gayucreations638@gmail.com";
const SHEET_NAME="Orders";
const HEADERS=["Timestamp","Order ID","Customer Name","Phone","Customer Email","Address","City","PIN","Items","Total","UPI ID","UTR","Status"];

function setup(){
 const ss=SpreadsheetApp.getActiveSpreadsheet(); let sh=ss.getSheetByName(SHEET_NAME);
 if(!sh)sh=ss.insertSheet(SHEET_NAME);
 if(sh.getLastRow()===0)sh.appendRow(HEADERS);
}

function doPost(e){
 try{
  const data=JSON.parse(e.postData.contents), c=data.customer||{};
  const items=(data.items||[]).map(i=>`${i.name} × ${i.qty} = ₹${i.price*i.qty}`).join("\n");
  const ss=SpreadsheetApp.getActiveSpreadsheet(); let sh=ss.getSheetByName(SHEET_NAME);
  if(!sh){setup();sh=ss.getSheetByName(SHEET_NAME)}
  sh.appendRow([new Date(),data.orderId||"",c.name||"",c.phone||"",c.email||"",c.address||"",c.city||"",c.pincode||"",items,data.total||0,data.upiId||"",c.utr||"Order Placed"]);
  MailApp.sendEmail(SHOP_EMAIL,`New order ${data.orderId||""} — Aura with Gayathri`,
    `New website order\n\nOrder ID: ${data.orderId||""}\nCustomer: ${c.name||""}\nPhone: ${c.phone||""}\nEmail: ${c.email||""}\nAddress: ${c.address||""}, ${c.city||""} - ${c.pincode||""}\n\nItems:\n${items}\n\nTotal: ₹${data.total||0}\nUPI ID: ${data.upiId||""}\nUTR: ${c.utr||"Not provided"}\nStatus: Order Placed`);
  return json({ok:true,orderId:data.orderId});
 }catch(err){return json({ok:false,error:String(err)})}
}

function doGet(e){
 try{
  if(e.parameter.action==="track") return trackOrder(e.parameter.orderId);
  return ContentService.createTextOutput("Aura with Gayathri order service is running.");
 }catch(err){return json({ok:false,error:String(err)})}
}

function trackOrder(orderId){
 const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
 if(!sh)return json({ok:false,error:"Orders sheet not found"});
 const values=sh.getDataRange().getValues(); if(values.length<2)return json({ok:false});
 const h=values[0], idCol=h.indexOf("Order ID"), statusCol=h.indexOf("Status"), nameCol=h.indexOf("Customer Name"), totalCol=h.indexOf("Total");
 for(let i=1;i<values.length;i++){
  if(String(values[i][idCol]).trim()===String(orderId).trim()){
   return json({ok:true,order:{orderId:values[i][idCol],status:values[i][statusCol]||"Order Placed",customerName:values[i][nameCol]||"",total:values[i][totalCol]||0}});
  }
 }
 return json({ok:false});
}

function json(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
