import styled from 'styled-components';

export const CaseBook = styled.li`
    list-style: none;
    width: 150px;
    height: 200px;
    background-color: #F5EEDC;
    color: #DD4A48;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
    align-items: center;
    position: relative;
    text-align: center;
    box-shadow: 5px 5px 0px 0px rgba(221, 74, 72, 1);
`;
export const CaseList = styled.ul`
    display: flex;
    gap: 20px;`

export const Overlay = styled.div`
    width: 100%;
    cursor: pointer;
    height: 100%;
    opacity: 0.3;
    position: absolute;
    z-index: 100;
    top: 0;
    &:hover {
        background-color: #eee;
    }
}
`
export const Input = styled.input`
    box-shadow: 3px 3px 0px 0px #DD4A48;
    background-color: #F5EEDC;
    color: #DD4A48;
    width: 100%;
    height: 40px;
    outline: none;
    border: none;
    padding: 7px;
    box-sizing: border-box;
`
export const Btn = styled.button`
    background-color: ${props => (props.selected ? '#4F091D' : '#DD4A48')};
    color: #F5EEDC;
    box-shadow: 3px 3px 0px 0px #F5EEDC;
    width: ${props => props.w};
    height: ${props => props.h};
    cursor: pointer;
    border: none;
    font-size: ${props => props.size};
    &:hover {
        background-color: #F5EEDC;
        color: #DD4A48;
        box-shadow: 3px 3px 0px 0px #DD4A48;
    }
`
export const Container = styled.div`
    display: flex;
    flex-direction: ${props => props.behav};
    gap: ${props => props.gap};
    width: ${props => props.w};
    overflow-y: ${props => props.overf ? props.overf : 'visible'};
    height: ${props => props.h ? props.h : 'max-content'};
    padding: ${props => !props.padd ? 0 : '5px'};
`
export const Title = styled.h4`
    color: #4F091D;
    font-weight: 200;
`
