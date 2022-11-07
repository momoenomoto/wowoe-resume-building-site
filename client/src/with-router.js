import { useLocation, useNavigate, useParams } from "react-router-dom";

// code is based on https://www.bezkoder.com/react-crud-web-api/
// to use navigate and params in react class components

export const withRouter = (Component) => {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
};
