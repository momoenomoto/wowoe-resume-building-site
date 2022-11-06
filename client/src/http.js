export function getBaseURL() {
  let url;
  if (process.env.NODE_ENV === "PRODUCTION")
    url = "http://linserv1.cims.nyu.edu/29902";
  else url = "http://localhost:3000";

  return url;
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  if (user !== "undefined") return JSON.parse(user);
  else return null;
}
