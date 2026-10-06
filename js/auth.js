const USERS_KEY="recipehub_users"; const CURRENT_KEY="recipehub_current";

function getUsers(){return JSON.parse(localStorage.getItem(USERS_KEY)||"[]");}
function saveUsers(users){localStorage.setItem(USERS_KEY,JSON.stringify(users));}
function seedData(){
 let users=getUsers();
 const demoAdmins = [
  {id:"admin1",name:"Keerthana",email:"desalakeerthana1503@gmail.com",password:"admin123",role:"admin"},
  {id:"admin2",name:"Anu Yadav",email:"anuyadav2713@gmail.com",password:"admin123",role:"admin"},
  {id:"admin3",name:"Yakshitha",email:"yakshitha1234@gmail.com",password:"admin123",role:"admin"}
];
demoAdmins.forEach(admin => {
  if(!users.some(u => u.email === admin.email))
    users.push({...admin,joined:new Date().toLocaleDateString()});
});
 if(!users.some(u=>u.email==="user@recipehub.com")) users.push({id:"demo-user",name:"Demo User",email:"user@recipehub.com",password:"user123",role:"user",joined:new Date().toLocaleDateString()});
 saveUsers(users);
}
seedData();

function showMessage(text,type="error"){
 const el=document.getElementById("message"); if(!el)return;
 el.textContent=text; el.className="message show "+type;
}
function signupUser(e){
 e.preventDefault();
 const name=document.getElementById("name").value.trim(),email=document.getElementById("email").value.trim().toLowerCase(),password=document.getElementById("password").value,confirm=document.getElementById("confirmPassword").value;
 if(password!==confirm){showMessage("Passwords do not match.");return;}
 const users=getUsers();
 if(users.some(u=>u.email===email)){showMessage("An account with this email already exists.");return;}
 users.push({id:"u"+Date.now(),name,email,password,role:"user",joined:new Date().toLocaleDateString()});
 saveUsers(users); showMessage("Account created successfully. Redirecting to login...","success");
 setTimeout(()=>location.href="login.html",800);
}
function loginUser(e){
 e.preventDefault();
 const email=document.getElementById("email").value.trim().toLowerCase(),password=document.getElementById("password").value;
 const user=getUsers().find(u=>u.email===email&&u.password===password);
 if(!user){showMessage("Invalid email or password.");return;}
 localStorage.setItem(CURRENT_KEY,JSON.stringify(user));
 location.href=user.role==="admin"?"admin-dashboard.html":"user-dashboard.html";
}
function getCurrentUser(){return JSON.parse(localStorage.getItem(CURRENT_KEY)||"null");}
function logout(){localStorage.removeItem(CURRENT_KEY);location.href="login.html";}
function protectPage(role){
 const user=getCurrentUser();
 if(!user){location.href="login.html";return;}
 if(role&&user.role!==role){location.href=user.role==="admin"?"admin-dashboard.html":"user-dashboard.html";}
}
