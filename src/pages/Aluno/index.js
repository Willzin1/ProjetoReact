import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { isEmail, isInt, isFloat } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Container } from '../../styles/GlobalStyle';
import { Title, Form, ProfilePicture } from './styled';
import Loading from '../../components/loading';
import Axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/action';

export default function Aluno({ match }) {
  const id = get(match, 'params.id', '');
  const dispatch = useDispatch();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [foto, setFoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);

        const { data } = await Axios.get(`/alunos/${id}`);
        const fotoAluno = get(data, 'Fotos[0].urlImage', '');

        setFoto(fotoAluno);

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);
        if (status === 400) {
          errors.map((error) => toast.error(error));
        }
        history.push('/');
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Nome precisa conter entre 3 a 255 caracteres');
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors = true;
      toast.error('Sobrenome precisa conter entre 3 a 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Informe um e-mail válido');
    }

    if (!isInt(String(idade))) {
      formErrors = true;
      toast.error('Idade inválida');
    }

    if (!isFloat(String(peso))) {
      formErrors = true;
      toast.error('Peso inválido');
    }

    if (!isFloat(String(altura))) {
      formErrors = true;
      toast.error('Altura inválida');
    }

    if (formErrors) return;

    try {
      if (id) {
        setIsLoading(true);
        await Axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });

        history.push('/');
        toast.success('Informações alteradas com sucesso');
        setIsLoading(false);
      } else {
        setIsLoading(true);
        await Axios.post('/alunos', {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });

        history.push('/');
        toast.success('Aluno(a) criado(a) com sucesso');
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'response.data.errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Editar aluno' : 'Criar aluno'}</Title>

      {id && (
        <ProfilePicture>
          {foto ? (
            <img src={foto} alt={Aluno.nome} />
          ) : (
            <FaUserCircle size={180} />
          )}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
        </label>
        <label htmlFor="sobrenome">
          Sobrenome:
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            placeholder="Sobrenome"
          />
        </label>
        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </label>
        <label htmlFor="idade">
          Idade:
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            placeholder="Sua idade"
          />
        </label>
        <label htmlFor="peso">
          Peso:
          <input
            type="text"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Seu peso"
          />
        </label>
        <label htmlFor="altura">
          Altura:
          <input
            type="text"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="Sua altura"
          />
        </label>

        <button type="submit">
          {id ? 'Salvar alterações' : 'Criar aluno'}
        </button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
