const $=id=>document.getElementById(id);
let selectedFile=null;

$("answerImage").addEventListener("change",e=>{
  selectedFile=e.target.files[0]||null;
  if(!selectedFile)return;
  $("preview").src=URL.createObjectURL(selectedFile);
  $("previewWrap").hidden=false;
  $("uploadBox").style.display="none";
});

$("removeImage").onclick=()=>{
  selectedFile=null;$("answerImage").value="";$("previewWrap").hidden=true;$("uploadBox").style.display="flex";
};

$("readAnswer").onclick=async()=>{
  if(!selectedFile)return alert("Please choose an answer image first.");
  if(!window.Tesseract)return alert("Please check your internet connection and try again.");
  const btn=$("readAnswer");btn.disabled=true;btn.textContent="Reading answer...";
  try{
    const result=await Tesseract.recognize(selectedFile,"eng");
    $("studentText").value=result.data.text.trim();
    if(!result.data.text.trim()) alert("No readable text was found. Please use a clearer image or enter the answer manually.");
  }catch(err){alert("The answer could not be read. Please try a clearer image.");}
  btn.disabled=false;btn.textContent="Read Answer";
};

$("analyze").onclick=()=>{
  const student=$("studentText").value.trim();
  const keywords=$("keywords").value.split(",").map(x=>x.trim()).filter(Boolean);
  const total=Math.max(1,Number($("marks").value)||1);
  if(!student)return alert("Please upload and read the answer, or enter the answer text.");
  if(!keywords.length)return alert("Please enter at least one key concept.");
  const normalized=normalize(student);
  const details=keywords.map(k=>{
    const words=normalize(k).split(/\s+/).filter(Boolean);
    const matched=words.length?words.filter(w=>normalized.includes(w)).length/words.length>=.5:false;
    return {text:k,matched};
  });
  const found=details.filter(x=>x.matched).length;
  const score=Math.round((found/details.length)*total*10)/10;
  const percent=(score/total)*100;
  let status="Needs improvement",summary="Some important concepts are still missing.";
  if(percent>=80){status="Excellent";summary="The answer covers most of the important concepts."}
  else if(percent>=60){status="Good";summary="The answer covers the main idea, with a few concepts to improve."}
  showResult(score,total,percent,status,summary,details);
};

function normalize(s){return s.toLowerCase().replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();}
function showResult(score,total,percent,status,summary,details){
  $("result").hidden=false;
  $("scoreValue").textContent=score;
  $("scoreTotal").textContent=`/ ${total}`;
  $("status").textContent=status;
  $("summary").textContent=summary;
  $("conceptList").innerHTML=details.map(x=>`<span class="concept ${x.matched?"found":"missing"}">${x.matched?"✓":"×"} ${escapeHtml(x.text)}</span>`).join("");
  const missing=details.filter(x=>!x.matched).map(x=>x.text);
  $("feedback").textContent=missing.length
    ? `The answer covers ${details.filter(x=>x.matched).length} of ${details.length} key concepts. To improve the answer, include: ${missing.join(", ")}.`
    : "The answer covers all the key concepts provided. Keep the explanation clear and complete.";
  $("result").scrollIntoView({behavior:"smooth",block:"start"});
}
$("newReview").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
