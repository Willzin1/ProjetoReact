import React from 'react';

import { Title, Paragrafo } from './styled';
import { Container } from '../../styles/GlobalStyle';

export default function Page404() {
  return (
    <Container>
      <Title>Página não encontrada</Title>
      <Paragrafo>essa página não pode ser encontrada</Paragrafo>
    </Container>
  );
}
