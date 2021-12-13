import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
    height: 95vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height:35%;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const MainContainer = styled.div`
    background-color: var(--accent);
    margin: auto;
    width: 19%;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
`;

export const MintButtonContainer = styled.div`
    margin: auto;
    width: 27%;
    height: 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
`;

export const MintAmtContainer = styled.div`
    margin: auto;
    width: 50%;
    height: 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
`;

export const BgContainer = styled.div`
    height: 105vh;
    min-width: 100%;
    background-image: ${({ image }) => (image ? `url(${image})` : "none")};
    background-color: var(--accent);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    text-align: center;
    justify-content: center;
    align-items: center;
`;

export const AltContainer = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  width: 100%;
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 30px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 24px;
  line-height: 1.6;
`;

export const MintAmtTextDescription = styled.p`
  color: var(--primary-text);
  font-size: 36px;
  line-height: 1.6;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;
