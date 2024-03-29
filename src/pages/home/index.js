
import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Cues from '../../components/Cues';
import Cards from '../../components/Card';
import styles from './style';
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";
// import { SpaOutlined } from '@material-ui/icons';
// import Link from 'next/link';
import { useRouter } from 'next/router';
const NFTcontractABI = require('../../NFT.json');
const CardNFTcontractABI = require('../../NFT_CARD.json');
const NFTcontractAddress = "0xa279Cd797ea9048A58a29535140f96e20B053b60";
const CardNFTcontractAddress = "0x396546019940B5e8779fA83C04B42B50A8d7fa2c";
const sportTokenAddress = "0x297A580ccF736D5535401B9C8159F6F3e663949F";
const Web3 = require("web3");

let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
);

var minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

const useStyles = makeStyles(styles);

function HomePage() {
  const classes = useStyles();
  
  const [selected, setSelected] = React.useState(0);
  const [sortValue, setSortValue] = React.useState(0);
  const [byAndSellSelected, setByAndSellSelected] = React.useState(0);
  const [presaleSelected, setPresaleSelected] = React.useState(0);
  const router = useRouter();
  const images = [    
    "hall.png",
    "cues.png",
    "lifes.png",
    "connectWallet.png",
  ];

  const titles = [
    "CARDS",
    "CUES",
    "TOKENS",
    "Connect Wallet",
  ];
  const [balance, setBalance] = useState("");
  const [sportBalance, setSportBalance] = useState("");
  const [address, setAdress] = useState("");
  const [chainID, setChainID] = useState("");
  const [netName, setNetName] = useState("");

  const [loaded, setLoaded] = useState(0)

  var TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);
  var CardTokenContract = new web3.eth.Contract(CardNFTcontractABI,CardNFTcontractAddress);
  var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
  if(loaded == 0){
    setLoaded(1);
    TokenContract.events.Transfer((err, events)=>{
      eventListened();      
    });
    CardTokenContract.events.Transfer((err, events)=>{
      eventListened();      
    });
  }
  async function eventListened() {
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          var web3Window = new Web3(window.ethereum);
          const chainIDBuffer = await web3Window.eth.net.getId();
          if(addressArray.length > 0){
            if(chainIDBuffer == 3){
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
              });
              sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                if(res.length>7){
                  setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
                }
                else{
                  setSportBalance("0.00 SPORT");
                }              
              });
                
            }          
          } 
          
        
      } 
      
    } catch (err) {
      return {
        address: ""        
      };
    }
  }

  useEffect(() => {
    try{
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          router.reload();
        })
        window.ethereum.on('accountsChanged', () => {
          router.reload();
        })
      }
      getCurrentWalletConnected(); 
    }
    catch{
      return;
    }
    
    
  }, [])

  async function getCurrentWalletConnected() {
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });        
          var web3Window = new Web3(window.ethereum);
          const chainIDBuffer = await web3Window.eth.net.getId();        
          if(addressArray.length > 0){
            setAdress(addressArray[0]);
            if(chainIDBuffer == 3){
              setNetName("");
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
              });            
              sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                if(res.length>7){
                  setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
                }
                else{
                  setSportBalance("0.00 SPORT");
                }         
              });
            }
            else{  
              setNetName("Wrong NET(DisConnect)");  
            }
          }         
        
      } 
    } catch (err) {
      return {
        address: ""        
      };
    }
  };

  async function connect_Wallet() {
    const chainId = 3;
    try{
      if (window.ethereum) {
        var web3Window = new Web3(window.ethereum);     
        if (window.ethereum.networkVersion != chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              //params: [{ chainId: web3.utils.toHex(chainId) }],
              params: [{ chainId: "0x"+chainId.toString(16) }],
            });
            if(address== ""){
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{
                    eth_accounts: {}
                }]
              });
              const addressArray = await window.ethereum.request({method: "eth_accounts",});
              if(addressArray.length > 0){
                setAdress(addressArray[0]);
                setNetName("");
                web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                  let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                  setBalance(String(balETH).substring(0, 6) + " ETH");
                }); 
                sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                  if(res.length>7){
                    setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
                  }
                  else{
                    setSportBalance("0.00 SPORT");
                  }         
                });               
              }
            }
            else{
              setAdress("");
              setNetName("");
              setBalance("");
              setSportBalance("");  
            }
          } catch (err) {
              // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Ropsten TestNet',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                    rpcUrls: ['https://ropsten.infura.io/v3/'],
                  },
                ],
              });
            }
          }
        }
        else{
          if(address== ""){
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [{
                  eth_accounts: {}
              }]
            });
            const addressArray = await window.ethereum.request({method: "eth_accounts",});
            if(addressArray.length > 0){
              setAdress(addressArray[0]);
              setNetName("");
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
              }); 
              sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                if(res.length>7){
                  setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
                }
                else{
                  setSportBalance("0.00 SPORT");
                }         
              });               
            }
          }
          else{
            setAdress("");
            setNetName("");
            setBalance("");
            setSportBalance("");  
          }
        }     
        
      }  
      else{
        
          const prov = new WalletConnectProvider({
            infuraId: "acc8266b5baf41c5ad44a05fe4a49925",
            qrcodeModalOptions: {
              mobileLinks: ["metamask"],
            },
          });
          const addressMobile = await prov.enable();
         var web3Window = new Web3(prov);  
         sportContract = new web3Window.eth.Contract(minABI, sportTokenAddress);
          var chainID_mobile = await web3Window.eth.net.getId();
        if (chainID_mobile != chainId) {
          try {           
            if(address== ""){
              await prov.request({
                method: 'wallet_switchEthereumChain',
                //params: [{ chainId: web3.utils.toHex(chainId) }],
                params: [{ chainId: "0x"+chainId.toString(16) }],
              });
              if(addressMobile.length > 0){
                setAdress(addressMobile[0]);
                setNetName("");
                web3Window.eth.getBalance(addressMobile[0], (err, balanceOf) => {
                  let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                  setBalance(String(balETH).substring(0, 6) + " ETH");
                }); 
                sportContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                  if(res.length>7){
                    setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
                  }
                  else{
                    setSportBalance("0.00 SPORT");
                  }         
                });               
              }
            }
            else{

              setAdress("");
              setNetName("");
              setBalance("");
              setSportBalance("");  
              //await provider.disconnect();
            }
          } catch (err) {
              // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
              await prov.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Ropsten TestNet',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                    rpcUrls: ['https://ropsten.infura.io/v3/'],
                  },
                ],
              });
            }
          }
        }
        else{
          if(address== ""){
            
            if(addressMobile.length > 0){
              setAdress(addressMobile[0]);
              setNetName("");
              web3Window.eth.getBalance(addressMobile[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
              }); 
              sportContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                if(res.length>7){
                  setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
                }
                else{
                  setSportBalance("0.00 SPORT");
                }         
              });               
            }
          }
          else{

            setAdress("");
            setNetName("");
            setBalance("");
            setSportBalance("");  
            //await provider.disconnect();
          }
        }
      }
    }
    catch{
      return;
    }
      
  };

  return (
    <>
      <div className={classes.buttons} style={{justifyContent:"center", marginTop:"24px"}}>
          <Button style={{position: 'relative', width : '150px'}} className={`${classes.btn} ${presaleSelected === 1 ? classes.selected_btn : ''}`} onClick={() => {setPresaleSelected(1);router.push('/presale');}}>              
            {"Presale"}
          </Button>
          <div className="seperator" style={{width:"32px",flexShrink:"0%"}}></div>
          <Button className={`${classes.btn} ${byAndSellSelected === 0 ? classes.selected_btn : ''}`} onClick={() => {setByAndSellSelected(0);}}>              
            {"BUY"}
          </Button>
          <div className="seperator" style={{width:"32px",flexShrink:"0%"}}></div>
          <Button className={`${classes.btn} ${byAndSellSelected === 1 ? classes.selected_btn : ''}`} onClick={() => {setByAndSellSelected(1);}}>              
            {"SELL"}
          </Button>
          <div className="last-div" style = {{flexDirection : 'column', display : 'flex'}}>
            <span style={{color : 'white'}}>
              &nbsp;
              &nbsp;
              ADDRESS :
              &nbsp;
            {address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}
            </span>
            <span style={{color : '#06f506'}}>
              &nbsp;
              &nbsp;
              ETHER BALANCE :
              &nbsp;
              {address.length> 0 ? balance : ""}            
            </span>
            <span style={{color : '#00edff'}}>
              &nbsp;
              &nbsp;
              SPORT BALANCE :
              &nbsp;
              {address.length> 0 ? sportBalance : ""}            
            </span>
          </div>
          {/* <Link href="/mint">
            <Button className={classes.circle_btn} style={{position: 'relative', marginLeft : '20px'}}>
                {'>'}
            </Button>
          </Link> */}
          <Button className={classes.circle_btn} style={{position: 'relative', marginLeft : '20px'}} /*onClick={() => router.push('/mint')}*/>
              {'>'}
          </Button>          
      </div>
      <div className={classes.hero}>        
          <Button className={classes.circle_btn} onClick={() => {setSortValue(1 - sortValue);}}>
            { sortValue < 1 ? '↑' : '↓'}
          </Button>          
          <div className={classes.buttons}>
            {images.map((img, index) => (
              <Button key={index} className={`${classes.btn} ${selected === index ? classes.selected_btn : ''}`} onClick={() => {
                  if(index === 3){
                    connect_Wallet();
                  }
                  else if(index == 2){
                    router.push('/token')
                  }
                  else{
                    setSelected(index);
                  }
                }
              }>
                <img src={"/images/" + img} alt="" />
                { index === 3 ? (netName == "" ? (balance.length == 0 ? titles[index] : "DisConnect") : netName ) : titles[index]}
              </Button>
            ))}
            </div>
            { selected === 0 && byAndSellSelected === 1 && sortValue ==1 && address == ""&& <Cards check = {1} sortVal = {1} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 1 && sortValue ==0 && address == ""&& <Cards check = {1} sortVal = {0} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==1 && address == ""&& <Cards check = {0} sortVal = {1} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==0 && address == ""&& <Cards check = {0} sortVal = {0} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 1 && sortValue ==1 && address != ""&& <Cards check = {1} sortVal = {1} connected = {1}/>}
            { selected === 0 && byAndSellSelected === 1 && sortValue ==0 && address != ""&& <Cards check = {1} sortVal = {0} connected = {1}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==1 && address != ""&& <Cards check = {0} sortVal = {1} connected = {1}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==0 && address != ""&& <Cards check = {0} sortVal = {0} connected = {1}/>}
            { selected === 1 && byAndSellSelected === 1 && sortValue ==1 && address == ""&& <Cues check = {1} sortVal = {1} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==0 && address == ""&& <Cues check = {1} sortVal = {0} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==1 && address == ""&& <Cues check = {0} sortVal = {1} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==0 && address == ""&& <Cues check = {0} sortVal = {0} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==1 && address != ""&& <Cues check = {1} sortVal = {1} connected = {1}/> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==0 && address != ""&& <Cues check = {1} sortVal = {0} connected = {1}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==1 && address != ""&& <Cues check = {0} sortVal = {1} connected = {1}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==0 && address != ""&& <Cues check = {0} sortVal = {0} connected = {1}/> }            
            {/* { selected === 2 && <LifesAndTokens /> } */}
          </div> 
        
    </>
  );
}

export default HomePage;