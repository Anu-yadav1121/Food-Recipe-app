const COLLECTIONS_KEY="recipehub_collections",SUBMISSIONS_KEY="recipehub_submissions";
function getCollections(){return JSON.parse(localStorage.getItem(COLLECTIONS_KEY)||"{}");}
function saveCollections(x){localStorage.setItem(COLLECTIONS_KEY,JSON.stringify(x));}
function getSubmissions(){return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)||"[]");}
function loadUserDashboard(){
 const u=getCurrentUser(),r=getRecipes(),f=getFavorites()[u.id]||[],c=getCollections()[u.id]||[],s=getSubmissions().filter(x=>x.userId===u.id);
 document.getElementById("userName").textContent=u.name;document.getElementById("recipeCount").textContent=r.filter(x=>x.status==="approved").length;document.getElementById("favCount").textContent=f.length;document.getElementById("collectionCount").textContent=c.length;document.getElementById("submissionCount").textContent=s.length;
}
function createCollection(){
 const name=document.getElementById("collectionName").value.trim();if(!name){alert("Enter a collection name.");return;}
 const u=getCurrentUser(),all=getCollections();all[u.id]=all[u.id]||[];all[u.id].push({id:"c"+Date.now(),name,recipes:[]});saveCollections(all);document.getElementById("collectionName").value="";renderCollections();
}
function renderCollections(){
 const el=document.getElementById("collectionList");if(!el)return;const u=getCurrentUser(),cs=getCollections()[u.id]||[];
 el.innerHTML=cs.length?cs.map(c=>`<div class="card collection-card"><div class="icon">📁</div><h3>${c.name}</h3><p>${c.recipes.length} saved recipe(s)</p></div>`).join(""):`<div class="empty">No collections yet. Create your first collection above.</div>`;
}
function submitRecipe(e){
 e.preventDefault();const u=getCurrentUser(),arr=getSubmissions();
 arr.push({id:"s"+Date.now(),userId:u.id,userName:u.name,name:document.getElementById("rName").value.trim(),cuisine:document.getElementById("rCuisine").value,diet:document.getElementById("rDiet").value,ingredients:document.getElementById("rIngredients").value.split(",").map(x=>x.trim()).filter(Boolean),steps:document.getElementById("rSteps").value.split("\n").map(x=>x.trim()).filter(Boolean),status:"pending",submitted:new Date().toLocaleDateString()});
 localStorage.setItem(SUBMISSIONS_KEY,JSON.stringify(arr));document.getElementById("submitForm").reset();showMessage("Recipe submitted successfully. It is now pending admin review.","success");
}
