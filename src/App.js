import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import SelectCharacter from "./Components/SelectCharacter";
import { ethers } from "ethers";
import myEpicGame from "./utils/MyEpicGame.json";
import { CONTRACT_ADDRESS } from "./constants.js";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            console.log("CONTRACT_ADDRESS",CONTRACT_ADDRESS)
            if (!ethereum) {
                console.log("Make sure you have Metamask!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return <LoadingIndicator />;
        }

        if (!currentAccount) {
            return (
                <div className="connect-wallet-container">
                    <img
                        src="https://ipfs.io/ipfs/Qmf1kgdRj9J7NvwTDki7CQ3vEcPcRxgBEKLpp5S1vzZXkB"
                        alt="Cool Frog"
                    />
                    <button
                        className="cta-button connect-wallet-button"
                        onClick={connectWalletAction}
                    >
                        Connect Wallet To Get Started
                    </button>
                </div>
            );
        } else if (currentAccount && !characterNFT) {
            return (
                <SelectCharacter
                    setCharacterNFT={setCharacterNFT}
                ></SelectCharacter>
            );
        } else if (currentAccount && characterNFT) {
            return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>;
        }
    };

    const connectWalletAction = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get Metamask!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        checkIfWalletIsConnected();
    }, []);

    useEffect(() => {
        const fetchNFTMetadata = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(); 
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );

            const characterNFT = await gameContract.checkIfUserHasNFT();
            if (characterNFT.name) {
                setCharacterNFT(characterNFT);
            }

            setIsLoading(false);
        };

        if (currentAccount) {
            fetchNFTMetadata();
        }
    }, [currentAccount]);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">???? Froggerz Arena ????</p>
                    <p className="sub-text">!vibe to protect the world!</p>
                    {renderContent()}
                </div>
                <div className="footer-container">
                    <img
                        alt="Twitter Logo"
                        className="twitter-logo"
                        src={twitterLogo}
                    />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built with @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
