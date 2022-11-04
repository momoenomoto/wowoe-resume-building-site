export function getBaseURL() {
  let url;
  if (process.env.NODE_ENV === "PRODUCTION")
    url = "http://linserv1.cims.nyu.edu/29902";
  else url = "http://localhost:3000";

  return url;
}
