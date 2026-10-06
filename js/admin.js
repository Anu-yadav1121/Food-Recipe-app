const SUBMISSIONS_ADMIN_KEY="recipehub_submissions";
function getSubs(){return JSON.parse(localStorage.getItem(SUBMISSIONS_ADMIN_KEY)||"[]");}
function loadAdminDashboard(){
 const users=getUsers(),recipes=getRecipes(),subs=getSubs(),ratings=getRatings();
 document.getElementById("adminUsers").textContent=users.filter(u=>u.role==="user").length;
 document.getElementById("adminRecipes").textContent=recipes.filter(r=>r.status==="approved").length;
 document.getElementById("adminPending").textContent=subs.filter(s=>s.status==="pending").length;
 document.getElementById("adminRatings").textContent=Object.values(ratings).reduce((n,x)=>n+Object.keys(x).length,0);
}
function renderAdminRecipes(){
 const el=document.getElementById("adminRecipeList");if(!el)return;
 el.innerHTML=getRecipes().map(r=>`<div class="admin-item"><div><h3>${r.emoji||"🍽️"} ${r.name}</h3><p>${r.cuisine} • ${r.diet} • ${r.status}</p></div><div class="actions"><button class="btn small" onclick="editRecipe(${r.id})">Edit</button><button class="btn outline small" onclick="deleteRecipe(${r.id})">Delete</button></div></div>`).join("");
}
function saveAdminRecipe(e){
 e.preventDefault();let rs=getRecipes(),id=document.getElementById("editId").value;
 const data={name:document.getElementById("aName").value.trim(),cuisine:document.getElementById("aCuisine").value,diet:document.getElementById("aDiet").value,ingredients:document.getElementById("aIngredients").value.split(",").map(x=>x.trim()).filter(Boolean),steps:document.getElementById("aSteps").value.split("\n").map(x=>x.trim()).filter(Boolean),status:"approved",emoji:"🍽️",rating:4};
 if(id){const i=rs.findIndex(r=>r.id===Number(id));rs[i]={...rs[i],...data};}else{data.id=Date.now();data.createdBy="Admin";rs.push(data);}
 saveRecipes(rs);resetRecipeForm();renderAdminRecipes();alert("Recipe saved successfully.");
}
function editRecipe(id){
 const r=getRecipes().find(x=>x.id===id);if(!r)return;
 document.getElementById("editId").value=r.id;document.getElementById("aName").value=r.name;document.getElementById("aCuisine").value=r.cuisine;document.getElementById("aDiet").value=r.diet;document.getElementById("aIngredients").value=r.ingredients.join(", ");document.getElementById("aSteps").value=r.steps.join("\n");document.getElementById("recipeFormTitle").textContent="Edit Recipe";scrollTo(0,0);
}
function resetRecipeForm(){document.getElementById("adminRecipeForm").reset();document.getElementById("editId").value="";document.getElementById("recipeFormTitle").textContent="Add New Recipe";}
function deleteRecipe(id){if(!confirm("Delete this recipe?"))return;saveRecipes(getRecipes().filter(r=>r.id!==id));renderAdminRecipes();}
function renderUsers(){
 const body=document.getElementById("userTable"),users=getUsers();body.innerHTML=users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td><span class="tag">${u.role}</span></td><td>${u.joined}</td></tr>`).join("");
}
function renderSubmissions(){
 const el=document.getElementById("submissionList");
 if(!el)return;
 const subs=getSubs();
 el.innerHTML=subs.length
 ?subs.map(s=>`<div class="admin-item">
   <div>
    <h3>${s.name}</h3>
    <p>By ${s.userName} • ${s.cuisine} • ${s.diet}</p>
    <p>${(s.ingredients||[]).join(", ")}</p>
    <p><strong>Steps:</strong> ${(s.steps||[]).length}</p>
    <span class="status ${s.status}">${s.status}</span>
   </div>
   <div class="actions">
    ${s.status==="pending"
      ?`<button class="btn small" onclick="approveSubmission('${s.id}')">✓ Approve</button>
        <button class="btn outline small" onclick="rejectSubmission('${s.id}')">✕ Reject</button>`
      :`<span class="tag">${s.status}</span>`}
   </div>
 </div>`).join("")
 :`<div class="empty">No recipe submissions yet.</div>`;
}

function updateSubmission(id,status){
 const subs=getSubs();
 const index=subs.findIndex(s=>String(s.id)===String(id));
 if(index<0){
   alert("Submission not found.");
   return;
 }

 const submission=subs[index];
 submission.status=status;
 localStorage.setItem(SUBMISSIONS_ADMIN_KEY,JSON.stringify(subs));

 if(status==="approved"){
   const recipes=getRecipes();
   const approvedRecipe={
     id:"user-"+submission.id,
     name:submission.name,
     cuisine:submission.cuisine,
     diet:submission.diet,
     emoji:"🍽️",
     ingredients:Array.isArray(submission.ingredients)?submission.ingredients:[],
     steps:Array.isArray(submission.steps)?submission.steps:[],
     status:"approved",
     published:true,
     createdBy:submission.userName,
     rating:0,
     ratingsCount:0
   };

   // Avoid creating the same recipe twice if Approve is clicked again.
   const existingIndex=recipes.findIndex(r=>String(r.id)===String(approvedRecipe.id));
   if(existingIndex>=0) recipes[existingIndex]=approvedRecipe;
   else recipes.push(approvedRecipe);

   saveRecipes(recipes);

   // Keep the Admin recipe store synchronized too.
   const adminRecipes=JSON.parse(localStorage.getItem("recipes")||"[]");
   const adminIndex=adminRecipes.findIndex(r=>String(r.id)===String(approvedRecipe.id));
   if(adminIndex>=0) adminRecipes[adminIndex]=approvedRecipe;
   else adminRecipes.push(approvedRecipe);
   localStorage.setItem("recipes",JSON.stringify(adminRecipes));

   alert("Recipe approved! It is now published in User → Recipes.");
 }else{
   alert("Recipe rejected.");
 }

 renderSubmissions();
}

function approveSubmission(id){updateSubmission(id,"approved");}
function rejectSubmission(id){updateSubmission(id,"rejected");}
