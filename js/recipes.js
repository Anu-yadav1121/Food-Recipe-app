const RECIPES_KEY="recipehub_recipes",FAV_KEY="recipehub_favorites",COLL_KEY="recipehub_collections",RATING_KEY="recipehub_ratings";
const seedRecipes=[
{id:1,name:"Paneer Butter Masala",cuisine:"Indian",diet:"Vegetarian",emoji:"🍛",ingredients:["Paneer","Tomato","Onion","Butter","Cream","Spices"],steps:["Chop onions and tomatoes.","Cook the onion-tomato base with spices.","Add cream and butter.","Add paneer and simmer for 5 minutes.","Serve hot with naan or rice."],status:"approved",createdBy:"Admin",rating:4.5},
{id:2,name:"Margherita Pasta",cuisine:"Italian",diet:"Vegetarian",emoji:"🍝",ingredients:["Pasta","Tomato","Garlic","Basil","Olive Oil"],steps:["Boil pasta until tender.","Prepare tomato and garlic sauce.","Mix pasta with the sauce.","Add basil and olive oil.","Serve warm."],status:"approved",createdBy:"Admin",rating:4.2},
{id:3,name:"Veggie Fried Rice",cuisine:"Chinese",diet:"Vegan",emoji:"🍚",ingredients:["Rice","Carrot","Beans","Capsicum","Soy Sauce"],steps:["Cook and cool rice.","Stir-fry vegetables.","Add rice and soy sauce.","Toss on high heat.","Serve immediately."],status:"approved",createdBy:"Admin",rating:4.0},
{id:4,name:"Guacamole Bowl",cuisine:"Mexican",diet:"Vegan",emoji:"🥑",ingredients:["Avocado","Tomato","Onion","Lime","Coriander"],steps:["Mash avocado.","Add chopped tomato and onion.","Mix lime juice and coriander.","Season to taste.","Serve fresh."],status:"approved",createdBy:"Admin",rating:4.6},
{id:5,name:"Grilled Chicken",cuisine:"Indian",diet:"Non-Vegetarian",emoji:"🍗",ingredients:["Chicken","Yogurt","Lemon","Ginger","Garlic","Spices"],steps:["Marinate chicken with yogurt and spices.","Rest the chicken for 30 minutes.","Grill until cooked through.","Turn occasionally for even cooking.","Serve hot."],status:"approved",createdBy:"Admin",rating:4.4},
{id:6,name:"Gluten-Free Dosa",cuisine:"Indian",diet:"Gluten-Free",emoji:"🥞",ingredients:["Rice","Urad Dal","Salt","Water"],steps:["Soak rice and dal.","Blend into a smooth batter.","Ferment the batter.","Spread on a hot pan.","Cook until crisp and serve."],status:"approved",createdBy:"Admin",rating:4.3}
];
function getRecipes(){
 const stored=JSON.parse(localStorage.getItem(RECIPES_KEY)||"null");
 const builtIn=Array.isArray(stored)&&stored.length?stored:seedRecipes;
 const adminSaved=JSON.parse(localStorage.getItem("recipes")||"[]");
 const merged=new Map(builtIn.map(r=>[String(r.id),r]));

 adminSaved.forEach(r=>{
   const normalized={
     ...r,
     id:r.id,
     ingredients:Array.isArray(r.ingredients)?r.ingredients:[],
     steps:Array.isArray(r.steps)?r.steps:(Array.isArray(r.instructions)?r.instructions:[]),
     status:r.status || (r.published===false ? "pending" : "approved"),
     rating:Number(r.rating)||0,
     ratingsCount:Number(r.ratingsCount)||0,
     emoji:r.emoji || "🍽️"
   };
   if(normalized.status==="approved") merged.set(String(normalized.id),normalized);
 });

 return Array.from(merged.values());
}

function saveRecipes(r){localStorage.setItem(RECIPES_KEY,JSON.stringify(r));}
function getFavorites(){return JSON.parse(localStorage.getItem(FAV_KEY)||"{}");}
function saveFavorites(f){localStorage.setItem(FAV_KEY,JSON.stringify(f));}
function getRatings(){return JSON.parse(localStorage.getItem(RATING_KEY)||"{}");}
function toggleFavorite(id){
 const u=getCurrentUser(),f=getFavorites();f[u.id]=f[u.id]||[];const i=f[u.id].findIndex(x=>String(x)===String(id));
 if(i>=0)f[u.id].splice(i,1);else f[u.id].push(id);saveFavorites(f);renderRecipes();renderFavorites();
}
function isFavorite(id){const u=getCurrentUser(),f=getFavorites();return !!u&&((f[u.id]||[]).some(x=>String(x)===String(id)));}
function stars(r){return "★".repeat(Math.round(r||0))+"☆".repeat(5-Math.round(r||0));}
function recipeCard(r){
 return `<article class="card recipe-card"><div class="recipe-image">${r.emoji||"🍽️"}</div><div class="recipe-body"><div class="tags"><span class="tag">${r.cuisine}</span><span class="tag">${r.diet}</span></div><h3>${r.name}</h3><div class="rating">${stars(r.rating)} <span>${(r.rating||0).toFixed(1)}</span></div><p>${r.ingredients.slice(0,4).join(", ")}${r.ingredients.length>4?"...":""}</p><div class="card-actions"><a class="btn small" href="recipe-details.html?id=${r.id}">View</a><button class="btn outline small" onclick="toggleFavorite('${r.id}')">${isFavorite(r.id)?"♥ Saved":"♡ Save"}</button><button class="btn outline small" onclick="shareRecipe('${r.id}')">Share</button><button class="btn outline small" onclick="rateRecipe('${r.id}')">Rate</button></div></div></article>`;
}
function renderRecipes(){
 const grid=document.getElementById("recipeGrid");if(!grid)return;
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase(),c=document.getElementById("cuisineFilter")?.value||"",d=document.getElementById("dietFilter")?.value||"";
 const list=getRecipes().filter(r=>r.status==="approved").filter(r=>(!q||(r.name+" "+r.ingredients.join(" ")+" "+r.cuisine+" "+r.diet).toLowerCase().includes(q))&&(!c||r.cuisine===c)&&(!d||r.diet===d));
 grid.innerHTML=list.length?list.map(recipeCard).join(""):`<div class="empty">No recipes found. Try another search.</div>`;
}
function renderFavorites(){
 const grid=document.getElementById("favoriteGrid");if(!grid)return;const u=getCurrentUser(),f=getFavorites()[u.id]||[],list=getRecipes().filter(r=>f.some(x=>String(x)===String(r.id))&&r.status==="approved");
 grid.innerHTML=list.length?list.map(recipeCard).join(""):`<div class="empty">No favorites yet. Explore recipes and save your favorites.</div>`;
}
function renderRecipeDetails(){
 const el=document.getElementById("recipeDetails"),id=new URLSearchParams(location.search).get("id"),r=getRecipes().find(x=>String(x.id)===String(id));
 if(!r){el.innerHTML="<div class='empty'>Recipe not found.</div>";return;}
 el.innerHTML=`<div class="detail-layout"><div class="detail-visual">${r.emoji||"🍽️"}</div><div class="detail-content"><span class="eyebrow">${r.cuisine} • ${r.diet}</span><h1>${r.name}</h1><p class="rating">${stars(r.rating)} ${(r.rating||0).toFixed(1)}</p><section><h2>Ingredients</h2><ul>${r.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul></section><section><h2>Preparation</h2><ol>${r.steps.map(s=>`<li>${s}</li>`).join("")}</ol></section><div class="share-row"><button class="btn" onclick="toggleFavorite(${r.id})">${isFavorite(r.id)?"♥ Saved":"♡ Save Recipe"}</button><button class="btn outline" onclick="shareRecipe(${r.id})">Share</button><button class="btn outline" onclick="rateRecipe(${r.id})">Rate</button></div></div></div>`;
}
async function shareRecipe(id){
 const url=new URL("recipe-details.html",location.href);
 url.searchParams.set("id",id);
 try{
   if(navigator.share){
     await navigator.share({title:"RecipeHub Recipe",text:"Check out this recipe on RecipeHub!",url:url.href});
   }else if(navigator.clipboard){
     await navigator.clipboard.writeText(url.href);
     alert("Recipe link copied to clipboard!");
   }else{
     window.prompt("Copy this recipe link:",url.href);
   }
 }catch(e){}
}
function rateRecipe(id){
 const value=Number(prompt("Rate this recipe from 1 to 5 stars:"));
 if(!Number.isFinite(value)||value<1||value>5){
   if(value!==0) alert("Please enter a number from 1 to 5.");
   return;
 }
 const ratings=getRatings();
 const u=getCurrentUser();
 ratings[id]=ratings[id]||{};
 ratings[id][u.id]=value;
 localStorage.setItem(RATING_KEY,JSON.stringify(ratings));
 const rs=Object.values(ratings[id]);
 const r=getRecipes().find(x=>String(x.id)===String(id));
 if(r){
   r.rating=rs.reduce((a,b)=>a+Number(b),0)/rs.length;
   saveRecipes(getRecipes());
 }
 if(document.getElementById("recipeDetails")) renderRecipeDetails();
 renderRecipes();
 alert("Thank you for rating this recipe!");
}
