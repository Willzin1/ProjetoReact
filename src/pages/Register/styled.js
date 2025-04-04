import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
  }

  input {
    height: 40px;
    padding: 0 10px;
    font-size: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;

    &:focus {
      border: 1px solid ${colors.primaryColor};
    }
  }
`;
