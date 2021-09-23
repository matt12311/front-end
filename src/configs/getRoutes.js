import { intersection } from 'lodash';
export function isArrayWithLength(arr) {
 return (Array.isArray(arr) && arr.length)
}

export function getRoutePremissions(routes) {

 var flattenRotues= flatten(routes)
 const roles = JSON.parse(localStorage.getItem('roles'));
 var menu= flattenRotues.filter((route) => {
  if(!route.permission) return true;
  else if(!isArrayWithLength(route.permission)) return true;
  else {

    return intersection(route.permission, roles).length};
 });
 return menu
}



export function getAllowedRoutes(routes) {
  const roles = JSON.parse(localStorage.getItem('roles'));
  const allowedRoutes= routes.filter((route) => {
   if(!route.permission) return true;
   else if(!isArrayWithLength(route.permission)) return true;
  
   else {
     return intersection(route.permission, roles).length};
  });

  return allowedRoutes
 }
 


 function flatten (arr) {
  let newArry=[]

  if(isArrayWithLength(arr)){
    arr.forEach(key => {
      if(isArrayWithLength(key.submenu)){
        
        newArry.push(...  flatten(key.submenu))
      }
      else{
        newArry.push(key)
      }

  })
  }
  return newArry
}

