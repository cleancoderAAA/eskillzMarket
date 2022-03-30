import React, { useContext, useState ,useEffect} from 'react';
import { Button } from "react-bootstrap";
import Presale from "../../Modal/Presale";
import { ethers } from 'ethers';
import style from "../../pages/token/style.module.scss";
import tokenPriceABI from '../../GetTokenPrice.json';
const sportTokenAddress = "0x297A580ccF736D5535401B9C8159F6F3e663949F";
//const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
const esgTokenAddress = "0x630C101AD79971AAC25Aed0A3bE9bcf9bD49fA08";
const tokenPriceAddress = "0xd0A88B37c9Ab5824887003AeF42Ca92Fb25Cca0C";
const Web3 = require("web3");
import WalletConnectProvider from "@walletconnect/web3-provider";
var minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    }
  ];
const TokenBuy = ({ data ,id,address}) => {
    const [presaleModalShow, setPresaleModalShow] = useState(false);
    const [sportPricePerETH, setSportPricePerETH] = useState("");
    const [balance, setBalance] = useState("");
    const [customTokenBalance, setCustomTokenBalance] = useState("");
    const hideModel = () => {
        setPresaleModalShow(false);
    }
    async function getChangeVal (val) {        
        try {
            if (window.ethereum) {                
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                var web3 = new Web3(window.ethereum);
                const chainIDBuffer = await web3.eth.net.getId();
                if(addressArray.length > 0){
                    if(chainIDBuffer == 3){                        
                        var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                        var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);   
                        if(val == 1){
                            sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                    
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            });
                        }
                        else{
                            esgContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                     
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            }); 
                        }                     
                           
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
                  var web3 = new Web3(prov); 
                const chainIDBuffer = await web3.eth.net.getId();
                if(addressMobile.length > 0){
                    if(chainIDBuffer == 3){                        
                        var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                        var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);   
                        if(val == 1){
                            sportContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                    
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            });
                        }
                        else{
                            esgContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                     
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            }); 
                        }                     
                           
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
        init();
    }, []);
    async function init() {
        getChangeVal(id);
        try {
            if (window.ethereum) {
               
                const addressArray = await window.ethereum.request({
                method: "eth_accounts",
                });
                var web3Window = new Web3(window.ethereum);
                const chainIDBuffer = await web3Window.eth.net.getId();
                
                if(addressArray.length > 0 && address!=""){
                    
                    if(chainIDBuffer == 3){
                        web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                            let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                            setBalance(balETH);
                          });
                        const provider = new ethers.providers.Web3Provider(ethereum);
                        
                        const signer = provider.getSigner();
                       
                        var tokenPriceContract = new web3Window.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        
                        if(id == 1){
                            
                            tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                            
                                setSportPricePerETH(String(res/(10**9)));
                                
                            });
                            
                        }
                        else{
                            tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                            
                                setSportPricePerETH(String(res/(10**9)));
                                
                            });; 
                            
                        }
                    
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
                      const chainIDBuffer = await web3Window.eth.net.getId(); 
                    
                    if(addressMobile.length > 0 && address!=""){
                        
                        if(chainIDBuffer == 3){
                            web3Window.eth.getBalance(addressMobile[0], (err, balanceOf) => {
                                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                                setBalance(balETH);
                              });
                            
                            var tokenPriceContract = new web3Window.eth.Contract(tokenPriceABI, tokenPriceAddress);
                            if(id == 1){
                                
                                tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                                
                                    setSportPricePerETH(String(res/(10**9)));
                                    
                                });                               
                                
                            }
                            else{
                                tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                                
                                    setSportPricePerETH(String(res/(10**9)));
                                    
                                });; 
                                
                            }
                        
                        }          
                    }
            }
        } catch (err) {
            return {
            address: ""        
            };
        }
      }
    return (
        <>
            <div className={`${style.token_buy} d-flex text-start`}>
                <div className={`${style.sub_container} ${style.bg_dark_green}`}>
                    <p className={style.color_light_green}>{data.title}</p>
                    <h3 className={`${style.color_white} mt-4`}>{Number(customTokenBalance)}</h3>
                    <div className={`h6 ${style.color_blue} mt-3`}>$ {(Number(customTokenBalance)*Number(data.totalPrice.substring(0,9))).toString().substring(0,6)}</div>
                    <Button
                        variant="outline-primary"
                        className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
                        onClick={() => {setPresaleModalShow(true);/*init();*/}}
                    >
                        {data.btnTitle}
                    </Button>
                </div>
                <div className="m-4 text-start">
                    <p className={style.color_light_green}>{data.priceTitle}</p>
                    <div className={`h2 ${style.color_blue}`}>${data.totalPrice.substring(0,9)}</div>
                </div>

            </div>
            <Presale hideModel = {hideModel} getChangeVal={getChangeVal} balance = {balance} walletAddress = {address} sportPricePerETH = {sportPricePerETH} show={presaleModalShow} onHide={() => setPresaleModalShow(false)} id = {id}/>
        </>
    )
}

export default TokenBuy;