import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  //if there is a current user and it is admin, then go to the children pages, or go back to sign in
  return currentUser && currentUser.isAdmin ? (<Outlet />) : (<Navigate to='/sign-in' />);
}