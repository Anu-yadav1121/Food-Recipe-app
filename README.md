# Food Recipe App - SDC Project

## Technologies
- HTML
- CSS
- JavaScript
- Local Storage

## Modules
### User Module
Signup, login, recipe search/filter, recipe details, favorites, collections, recipe submission, ratings, sharing and logout.

### Admin Module
Admin login, dashboard, recipe management, user management, and submission approval/rejection.

## Demo Accounts
Admin: admin@recipehub.com / admin123
User: user@recipehub.com / user123

## How to Run
Open `index.html` in a modern browser. No backend or server is required.

## SDC Requirements Covered
- Minimum two modules: Admin and User
- HTML/CSS/JavaScript only
- CSS Grid and Flexbox
- Signup and Login using Local Storage
- JavaScript role-based redirection
- Working major functionalities
- GitHub-ready folder structure


## Admin Accounts
- desalakeerthana1503@gmail.com / admin123
- anuyadav2713@gmail.com / admin123
- yakshitha1234@gmail.com / admin123


### Admin Navigation Fix
Admin pages now use the same `recipehub_current` Local Storage session key as the login system, so Manage Recipes, Manage Users and Submissions no longer redirect a logged-in admin back to login.


Admin-created recipes appear in User mode automatically after saving them as published recipes.


### User Share & Rate
Users can now Share and Rate directly from each recipe card, as well as from the recipe details page.


### User recipe approval
Admin > Recipe Submissions now has working Approve/Reject buttons. Approving a submission publishes it immediately to User > Recipes and synchronizes the recipe storage.


## Dashboard fix in v6
- Admin Dashboard statistics now load auth, recipe and rating data in the correct script order.
- User Dashboard now loads the recipe data module before calculating Available Recipes.
- Admin statistic cards are clickable: Users, Recipes, Pending Submissions and Ratings.
- Added an Admin Ratings page.
- Recipe storage now falls back to the built-in recipes if an empty recipe list was previously saved.

## Run in VS Code
Use Live Server and open the project through `http://127.0.0.1:5500/` or `http://localhost:5500/`. Do not double-click the HTML files, because `file://` storage can behave differently across pages.


## v7 update
- User Dashboard stat cards are now clickable: Available Recipes → Recipes, Favorites → Favorites, Collections → Collections, My Submissions → Submit Recipe.
"# Food-Recipe-app" 
