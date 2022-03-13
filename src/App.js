import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import SelectCharacter from "./Components/SelectCharacter";
import { ethers } from "ethers";
import myEpicGame from "./utils/MyEpicGame.json";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants.js";
import Arena from "./Components/Arena"
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

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
    };

    const renderContent = () => {
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
            return <Arena characterNFT={characterNFT} />;
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

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();

        const checkNetwork = async () => {
            try {
                console.log("Network", window.ethereum.networkVersion);
                if (window.ethereum.networkVersion !== "4") {
                    alert("Please connect to rinkeby!");
                }
            } catch (error) {
                console.log(error);
            }
        };

        // checkNetwork();
    }, []);

    useEffect(() => {
        const fetchNFTMetadata = async () => {
            console.log(
                "Checking for Character NFT on address:",
                currentAccount
            );

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );

            const txn = await gameContract.checkIfUserHasNFT();
            if (txn.name) {
                console.log("User has character NFT");
                setCharacterNFT(transformCharacterData(txn));
            } else {
                console.log("No character NFT found");
            }
        };

        if (currentAccount) {
            console.log("Current Account:", currentAccount);
            fetchNFTMetadata();
        }
    }, [currentAccount]);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">🐸 Froggerz Arena 🐸</p>
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
