## unzip file
## add your variables in .env
## don't change the port

## install packages
run `npm install`

## migrate the DB
 run up migration `npm run migration:run` || required to run application
 revert migration `npm run migration:revert`
 generate migration `npm run migration:generate`

## strat UI application using npm start

## run backend
run `npm start` to start application 

## default user
you can use 
email:  `john.doe@gmail.com`
password:  `rj@gmail.com`

this use is default added as a manager

## you can also register, but you will get normal employee privilage
## a normal employee can't delete todo, assign todo & add new manager

check application health: `http://localhost:3001/status`
check application api documentation: `http://localhost:3001/api/v1/public/api-doc.json`
import `public/api-doc.json` in postman 

