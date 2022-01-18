import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import * as merkle from "./merkleHandler.js";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 0px;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 25px;
  color: var(--primary-text);
  width: 150px;
  height: 70px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :disabled {
    background-color: var(--disabledButton);
  }
`;

export const StyledSquareButton = styled.button`
  padding: 10px;
  border-radius: 0px;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 35px;
  color: var(--primary-text);
  width: 60px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--link-text);
  text-decoration: none;
  font-size: 30px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Select the amount of Recon Rams to mint:`);
  const [mintAmount, setMintAmount] = useState(1);
  const [proof, setProof] = useState(null);
  const [presaleOnlyActive, setPresale] = useState(null);

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "0xa112ed3d75c86496cf0b1b5d0a65bb349514177c",
    SCAN_LINK: "https://rinkeby.etherscan.io/address/0xa112ed3d75c86496cf0b1b5d0a65bb349514177c",
    NETWORK: {
      NAME: "Ethereum",
      SYMBOL: "ETH",
      ID: 4,
    },
    NFT_NAME: "Recon Rams NFT",
    SYMBOL: "RR",
    MAX_SUPPLY: 70,
    PUBLIC_MAX_SUPPLY: 60,
    WEI_COST: 77000000000000000,
    DISPLAY_COST: 0.077,
    GAS_LIMIT: 2000000,
    MARKETPLACE: "OpenSea",
    MARKETPLACE_LINK: "https://testnets.opensea.io/collection/reconramdegens",
    SHOW_BACKGROUND: true
  });

  const mint = () => {
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    
    if(presaleOnlyActive == true) {
      whitelistMint();
    }
    else {
      publicMint();
    }
  };

  const publicMint = async () => {
    let cost = CONFIG.WEI_COST;
    let totalCostWei = String(cost * mintAmount);
    let estimatedGas, gasLimit;

    try {
      estimatedGas = await blockchain.smartContract.methods.publicMint(mintAmount)
      .estimateGas(
        {
            from: blockchain.account,
            gas: CONFIG.GAS_LIMIT,
            value: totalCostWei
        }
      );
    } catch(err) {
      console.log(err);
      alert(err.message);
      setClaimingNft(false);
      return;
    }

    //Set gas limit to 1.2x the estimate
    gasLimit = Math.round(estimatedGas * 1.2);

    blockchain.smartContract.methods
      .publicMint(mintAmount)
      .send({
        gasLimit: String(gasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Successfully minted ${CONFIG.NFT_NAME}!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  }

  const whitelistMint = async () => {
    let cost = CONFIG.WEI_COST;
    let totalCostWei = String(cost * mintAmount);
    let estimatedGas, gasLimit;

    try {
      estimatedGas = await blockchain.smartContract.methods.whitelistMint(mintAmount, proof)
      .estimateGas(
        {
            from: blockchain.account,
            gas: CONFIG.GAS_LIMIT,
            value: totalCostWei
        }
      );
    } catch(err) {
      console.log(err);
      alert(err.message);
      setClaimingNft(false);
      return;
    }

    //Set gas limit to 1.2x the estimate
    gasLimit = Math.round(estimatedGas * 1.2);

    blockchain.smartContract.methods
      .whitelistMint(mintAmount, proof)
      .send({
        gasLimit: String(gasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Successfully minted ${CONFIG.NFT_NAME}!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  }

  const getProof = async () => {
    var merkleProof = await merkle.getMerkleProof(blockchain.account);
    setProof(merkleProof);
  }; 

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 7 && presaleOnlyActive == false) {
      newMintAmount = 7;
    }
    else if (newMintAmount > 2 && presaleOnlyActive == true) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  const getPreSaleState = async () => {
    const Web3EthContract = require("web3-eth-contract");
    Web3EthContract.setProvider(window.ethereum);

    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const rrContract = new Web3EthContract(abi, CONFIG.CONTRACT_ADDRESS);
    const saleState = await rrContract.methods.presaleOnlyActive().call();

    setPresale(saleState);
  };

  useEffect(() => {
    getPreSaleState();
  }, []);

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getProof();
  }, [blockchain.account]);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.BgContainer
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <s.SpacerSmall />
          <s.SpacerLarge />
          <s.MainContainer>
            <s.SpacerSmall />
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply == CONFIG.PUBLIC_MAX_SUPPLY ? CONFIG.MAX_SUPPLY : data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
            </s.TextDescription>
            {Number(data.totalSupply) >= CONFIG.PUBLIC_MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)", fontSize: 50, fontWeight: "bold" }}
                >
                  SOLD OUT!
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {CONFIG.NFT_NAME} available now on: 
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
              {presaleOnlyActive && blockchain.account && !merkle.isWhiteListed(blockchain.account) ? (
                  <>
                    <s.SpacerSmall />
                    <s.TextTitle
                    style={{
                      textAlign: "center",
                      fontSize: 40,
                      fontWeight: "bold",
                      color: "var(--accent-text)",
                    }}
                  >
                    You are not whitelisted!
                  </s.TextTitle>
                  </>
                ) : null}
                
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  COST PER: {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}
                </s.TextTitle>
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.AltContainer ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} Mainnet network
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                        getProof();
                        getPreSaleState();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.AltContainer>
                ) : (
                  <>
                    <s.SpacerMedium />
                    <s.MintAmtContainer ai={"center"} jc={"center"} fd={"row"}>
                      <StyledSquareButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledSquareButton>
                      <s.SpacerMedium />
                      <s.MintAmtTextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.MintAmtTextDescription>
                      <s.SpacerMedium />
                      <StyledSquareButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledSquareButton>
                    </s.MintAmtContainer>
                    <s.MintButtonContainer ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft || (presaleOnlyActive && !merkle.isWhiteListed(blockchain.account))}
                        onClick={(e) => {
                          e.preventDefault();
                          mint();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.MintButtonContainer>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.MainContainer>
        <s.SpacerMedium />
      </s.BgContainer>
    </s.Screen>
  );
}

export default App;
