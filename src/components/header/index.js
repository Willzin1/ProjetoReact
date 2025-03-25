import React from 'react';
import * as icons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import history from '../../services/history';
import { Nav } from './styled';
import * as actions from '../../store/modules/auth/action';

export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(actions.loginFailure());
    toast.warn('Você saiu da conta...');
    history.push('/');
  };

  return (
    <Nav>
      <Link to="/">
        <icons.FaHome size={24} />
      </Link>

      <Link to="/register">
        <icons.FaUserAlt size={24} />
      </Link>

      {isLoggedIn ? (
        <Link onClick={handleLogout} to="/logout">
          <icons.FaPowerOff size={24} />
        </Link>
      ) : (
        <Link to="/login">
          <icons.FaSignInAlt size={24} />
        </Link>
      )}

      <icons.FaCircle size={24} color={isLoggedIn ? '#66ff33' : '#ff3333'} />
    </Nav>
  );
}
