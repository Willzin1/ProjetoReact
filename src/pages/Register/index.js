import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyle';
import { Form } from './styled';
import Loading from '../../components/loading';
import * as actions from '../../store/modules/auth/action';

export default function Register() {
  const dispatch = useDispatch();
  const id = useSelector((state) =>
    state.auth.user.user ? state.auth.user.user.id : state.auth.user.user
  );
  const nomeStored = useSelector((state) =>
    state.auth.user.user ? state.auth.user.user.nome : state.auth.user.user
  );
  const emailStored = useSelector((state) =>
    state.auth.user.user ? state.auth.user.user.email : state.auth.user.user
  );
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (!id) return;

    setNome(nomeStored);
    setEmail(emailStored);
  }, [emailStored, id, nomeStored]);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Nome deve conter entre 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Insira um e-mail válido');
    }

    if (!id && (password.length < 3 || nome.length > 50)) {
      formErrors = true;
      toast.error('Senha deve conter entre 8 e 50 caracteres');
    }

    if (formErrors) return;

    dispatch(actions.registerRequest({ nome, email, password, id }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Editar usuário' : 'Registre-se'}</h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
          />
        </label>
        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
          />
        </label>
        <label htmlFor="password">
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
        </label>
        <button type="submit">
          {id ? 'Salvar alterações' : 'Criar conta'}
        </button>
      </Form>
    </Container>
  );
}
