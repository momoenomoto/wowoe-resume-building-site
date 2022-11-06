export function getBaseURL() {
  if (process.env.NODE_ENV === "PRODUCTION")
    return "http://linserv1.cims.nyu.edu/29902";
  else return "http://localhost:3000";
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  if (user !== "undefined") return JSON.parse(user);
  else return null;
}
