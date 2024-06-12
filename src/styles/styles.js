import styled from 'styled-components';
import { keyframes } from 'styled-components';

export const CaseBook = styled.div`
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
`
export const Overlay = styled.div`
    width: 100%;
    cursor: pointer;
    height: 100%;
    opacity: 0.1;
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    &:hover {
        background-color: #DD4A48;
    }
}
`
export const Input = styled.input`
    box-shadow: ${props => props.readOnly ? '-2px -2px 0px 0px #4F091D' : '3px 3px 0px 0px #DD4A48'};
    background-color: #F5EEDC;
    color: ${props => props.readOnly ? '#4F091D' : '#DD4A48'};
    width: ${props => props.w ? props.w : '100%'};
    height: ${props => props.texta ? props.texta : '40px'};
    outline: none;
    border: none;
    padding: 7px;
    box-sizing: border-box;
    font-size: ${props => props.size};
    cursor: ${props => props.readOnly ? 'default' : 'text'};
`
export const TextArea = styled.textarea`
    box-shadow: ${props => props.readOnly ? '-2px -2px 0px 0px #4F091D' : '3px 3px 0px 0px #DD4A48'};
    background-color: #F5EEDC;
    color: ${props => props.readOnly ? '#4F091D' : '#DD4A48'};
    width: ${props => props.w ? props.w : '100%'};
    height: ${props => props.texta ? props.texta : '40px'};
    outline: none;
    border: none;
    padding: 7px;
    box-sizing: border-box;
    font-size: ${props => props.size};
    cursor: ${props => props.readOnly ? 'default' : 'text'};
`

export const Btn = styled.button`
    background-color: ${props => (props.selected || props.warn ? '#4F091D' : props.fed ? '#ba0202' : '#DD4A48')};
    color: #F5EEDC;
    box-shadow: 3px 3px 0px 0px #F5EEDC;
    width: ${props => props.w};
    height: ${props => props.h};
    cursor: pointer;
    border: none;
    font-size: ${props => props.size};
    &:hover:not(:disabled) {
        background-color: #F5EEDC;
        color: #DD4A48;
        box-shadow: 3px 3px 0px 0px #DD4A48;
    }
    &:disabled {
        opacity: 0.7;
        cursor: default;
    }
`
export const TextField = styled.div`
    box-shadow: -2px -2px 0px 0px ${props => props.type ? '#F5EEDC' : '#4F091D'};
    background-color: ${props => props.type ? '#4F091D' : '#F5EEDC'};
    color: ${props => props.type ? '#F5EEDC' : '#4F091D'};
    width: ${props => props.w ? props.w : '100%'};
    height: ${props => props.h ? props.h : 'max-content'};
    min-height: 40px;
    font-size: 16px;
    padding: 10px;
    box-sizing: border-box;
`
export const HeaderBtn = styled.div`
    display: flex;
    gap: 20px;
    position: absolute;
    top: 30px;
    z-index: 100;
    left: 30px;
    align-items: center;
    @media (max-width: 450px) {
        flex-direction: column;
        gap: 10px;
        margin: auto;
        justify-content: center;
    }
`
export const HighContainer = styled.div`
    margin-top: 70px;
    padding-bottom: 70px;
    @media (max-width: 450px) {
        margin-top: 150px
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
    justify-content: ${props => props.fe};
    align-items: ${props => props.at};
    align-self: ${props => props.as};
    flex-wrap: wrap;
    @media (max-width: 1050px) {
        flex-direction: column;
        align-items: center;
    }
`
export const Title = styled.h4`
    color: ${props => props.light ? '#F5EEDC' : '#4F091D'};
    font-weight: 200;
`
export const Error = styled.div`
    box-shadow: 2px 2px 0px 0px #F5EEDC;
    color: #F5EEDC;
    background-color: #4F091D;
    text-align: center;
    width: 100%;
    height: max-content;
    font-size: 16px;
    padding: 10px;
    box-sizing: border-box;
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Loading = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  color: #F5EEDC;
  font-size: 1.2rem;
`;
export const Popup = styled.div`
    position: fixed;
    z-index: 100000000000;
    right: 30px;
    bottom: 30px;
    padding: 10px;
    box-sizing: border-box;
    width: 200px;
    height: max-content;
    box-shadow: 2px 2px 0px 0px #4F091D;
    color: #4F091D;
    background-color: #F5EEDC;
    font-size: 15px;
    opacity: ${props => props.none ? 0 : 1};
    transition: opacity 0.3s easy-in-out;
`
export const Warning = styled.div`
  position: fixed;
  top: auto;
  left: 25%;
  z-index: 1000000000000;
  width: 50%;
  height: max-content;
  padding: 20px;
  background-color: #4F091D;
  color: #F5EEDC;
  box-shadow: 5px 5px 0px 0px #F5EEDC;
`
export const Voile = styled.div`
    top: 0;
    left: 0;
  position: fixed;
  z-index: 100000000;
  background-color: #97BFB4;
  width: 100vw;
  height: 100vh;
  opacity: 0.9;
`
export const Relative = styled.div`
  position: relative;
`

export const StyleNote = styled.div`
  color: #4F091D;
  background-color: #F5EEDC;
  padding: 10px;
  width: 100px;
  height: max-content;
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  transform: rotate(${props => props.rotate});
`

export const Line = styled.ul`
position: relative;
margin: 0 0 0px 0;
padding: 0;
list-style: none;
display: flex;
flex-direction: column;
gap: 20px;
&:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: -10px;
  width: 2px;
  background: #4F091D;
  left: 25px;
  border-radius: 2px;
}
`
export const LineUl = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 10px;
`
export const LineLabel = styled.span`
        font-weight: 600;
          padding: 5px 10px;
          display: inline-block;
          background-color: #DD4A48;
          color: #F5EEDC;
          font-size: 14px;
          box-shadow: 3px 3px 0px 0px #F5EEDC;
          position: relative;
          z-index: 5;
          width: 100px;
`
export const LineContainer = styled.div`
display: flex;
flex-direction: column;
gap: 20px;
`
export const LineItem = styled.li`
    font-weight: 500;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: #F5EEDC;
    color: #DD4A48;
    font-size: 14px;
    box-shadow: 1px 1px 0px 0px #DD4A48;
    width: 100%;
    div {
        display: flex;
        justify-content: space-between;
    }
`
/*.time-line-ctnr {
    .time-line {
      position: relative;
      margin: 0 0 0px 0;
      padding: 0;
      list-style: none;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: -10px;
        width: 2px;
        background: #3498db;
        left: 32px;
        border-radius: 2px;
      }
      > .time-label {
        > span {
          font-weight: 600;
          padding: 5px 10px;
          display: inline-block;
          background-color: #e74c3c;
          color: #fff;
          border-radius: 2px;
          font-size: 14px;
        }
      }
      > li {
        position: relative;
        margin-bottom: 10px;
        margin-right: 0;
        > .time-line-item {
          -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          background: #fff;
          color: #444;
          margin-right: 15px;
          position: relative;
          margin-left: 50px;
          > .time-line-header,
          .time {
            font-size: 14px;
            padding: 6px 10px;
          }
          .time {
            font-size: 12px;
            color: #999;
            float: right;
          }
          .time-line-header {
            margin: 0;
            color: #555;
            border-bottom: 1px solid #f4f4f4;
            line-height: 1.1;
          }
        }
        > .fa {
          position: absolute;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          color: #666;
          background: #ecf0f1;
          left: 28px;
          top: 9px;
          border: 2px solid #3498db;
          display: inline-block;
          box-sizing: border-box;
        }
      }
    }
  }*/