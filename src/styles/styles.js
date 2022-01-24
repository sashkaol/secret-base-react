import styled from 'styled-components';

export const CaseBook = styled.li`
list-style: none;
width: 150px;
height: 200px;
background-color: darkolivegreen;
color: #fff;
display: flex;
flex-direction: column;
justify-content: space-around;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
padding: 10px;
box-sizing: border-box;
align-items: center;
position: relative;
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
