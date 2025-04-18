import React from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyle';
import Loading from '../../components/loading';
import { Title, Form } from './styled';
import Axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/action';

export default function Fotos({ match }) {
  const id = get(match, 'params.id', '');

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);
  const [foto, setFoto] = React.useState('');

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await Axios.get(`/alunos/${id}`);
        setFoto(get(data, 'Fotos[0].urlImage', ''));
        setIsLoading(false);
      } catch (err) {
        toast.error('Erro ao obter imagem');
        setIsLoading(false);
        history.push('/');
      }
    };

    getData();
  }, []);

  const handleChange = async (event) => {
    const fotoFile = event.target.files[0];
    const fotoUrl = URL.createObjectURL(fotoFile);

    setFoto(fotoUrl);

    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('foto', fotoFile);

    try {
      setIsLoading(true);

      await Axios.post('/fotos/', formData, {
        headers: {
          'Content-Type': 'Multipart/form-data',
        },
      });

      toast.success('Foto enviada com sucesso');

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const { status } = get(err, 'response', '');

      toast.error('Erro ao enviar foto');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>Foto</Title>
      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" /> : 'Selecionar'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
