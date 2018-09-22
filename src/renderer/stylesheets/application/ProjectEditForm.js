import styled, { css } from 'styled-components';
import { colors } from '../common/colors';
import { buttonProperties } from '../common/buttonProperties';

export const EditPage = styled.div`
    clear: both;
    content: '';
    display: block;
    margin-right: auto;
    margin-left: auto;
    width: 1200px;
    font-weight: 700;
`;

export const PageTitle = styled.h1`
    margin: 0 0 22px 0;
    font-size: 38px;
`;

export const EditCaption = styled.div`
    display: flex;
    margin-bottom: 50px;
`;

export const EditTarget = styled.p`
    color: black;
    font-size: 20px;
    margin-bottom: 10px;
`;

export const InputTitle = styled.input`
    margin: 0;
    padding: 5px 10px;
    height: 40px;
    width: calc(100% - 22px);
    border-radius: 4px;
    border: 1px solid black;
    font-size: 38px;
`;

export const InputPrivate = styled.input`
    margin: 0 0 50px 0;
    padding: 0;
`;

export const DescriptionFieldWrapper = styled.div`
    margin-bottom: 50px;
`;

export const DescriptionField = styled.textarea`
    resize: none;
    margin: 0;
    padding: 5px 10px;
    width: calc(100% - 22px);
    font-size: 22px;
    border-radius: 4px;
    border: 1px solid black;
`;

export const SaveButton = styled.button`
    width: 300px;
    height: 40px;
    font-size: 20px;
    border-style: none;
    ${buttonProperties({
        width: 300,
        height: 50,
        color: '#FFF',
        backgroundColor: colors.button.green
    })};
`;
