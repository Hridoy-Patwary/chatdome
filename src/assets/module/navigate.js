import { useNavigate } from '../../../node_modules/react-router-dom'; 

const withRouter = WrappedComponent => props => {
  const navigate = useNavigate();
  // other hooks

  return (
    <WrappedComponent
      {...props}
      {...{ navigate }}
    />
  );
};

export default withRouter;