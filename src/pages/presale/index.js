import React, { createContext, useEffect , useState} from "react";
import Header from '../../components/Header';
import TotalEarned from '../../components/TotalEarned';
import Calculator from '../../components/Calculator';
import PresaleBuy from '../../components/PresaleBuy';
import style from "../token/style.module.scss";
import { useRouter } from 'next/router';
import tokenPriceABI from '../../GetTokenPrice.json';
import WalletConnectProvider from "@walletconnect/web3-provider";
const Web3 = require("web3");
const sportTokenAddress = "0x297A580ccF736D5535401B9C8159F6F3e663949F";
//const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
const esgTokenAddress = "0x630C101AD79971AAC25Aed0A3bE9bcf9bD49fA08";
const tokenPriceAddress = "0xd0A88B37c9Ab5824887003AeF42Ca92Fb25Cca0C";
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

const initialData = [{
    title: "Your ESG",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY ESG",
    priceTitle: "ESG PRICE",
    price: "0.00",
    ethPrice : "0.00"
}, {
    title: "Your SPORT",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY SPORT",
    priceTitle: "SPORT PRICE",
    price: "0.00",
    ethPrice : "0.00"
}]
const Presale = () => {
    const [sportBalance, setSportBalance] = useState("");
    const [esgBalance, setEsgBalance] = useState("");
    const [esgPrice, setEsgPrice] = useState("");
    const [sportPrice, setSportPrice] = useState("");
    const [ethSportPrice, setEthSportPrice] = useState("");
    const [ethEsgPrice, setEthEsgPrice] = useState("");
    const [address, setAdress] = useState(null);
    useEffect(() => {        
        init();        
      }, []);

      async function init() {
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
                        var tokenPriceContract = new web3.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        tokenPriceContract.methods.getPrice(sportTokenAddress).call(function (err, res) {
                            initialData[1].totalPrice = String(res[0] * res[2] / (res[1]*10**6));
                            
                            //console.log(initialData[1].ethPrice);
                            setSportPrice(String(res[0] * res[2] / (res[1]*10**6)));
                        });
                        tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                            
                            initialData[1].ethPrice = String(res/(10**9));
                            setEthSportPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
                        });
                        tokenPriceContract.methods.getPrice(esgTokenAddress).call(function (err, res) {
                            initialData[0].totalPrice = String(res[0] * res[2] / (res[1]*10**6));
                            //initialData[0].ethPrice = String(10**18/res[0]);
                            //console.log(initialData[1].ethPrice);
                            setEsgPrice(String(res[0] * res[2] / (res[1]*10**6)));
                        });
                        tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                            
                            initialData[0].ethPrice = String(res/(10**9));
                            setEthEsgPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
                        });
                        sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                        if(res.length>7){
                            initialData[1].balance = String(parseInt(String(res).substring(0,res.length-7))/100);
                            setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100));
                        }
                        else{
                            setSportBalance("0.00");
                        }              
                        });
                        esgContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                        if(res.length>7){
                            initialData[0].balance = String(parseInt(String(res).substring(0,res.length-7))/100);
                            setEsgBalance(String(parseInt(String(res).substring(0,res.length-7))/100));
                        }
                        else{
                            setEsgBalance("0.00");
                        }              
                        });    
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
                        var tokenPriceContract = new web3.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        tokenPriceContract.methods.getPrice(sportTokenAddress).call(function (err, res) {
                            initialData[1].totalPrice = String(res[0] * res[2] / (res[1]*10**6));
                            
                            //console.log(initialData[1].ethPrice);
                            setSportPrice(String(res[0] * res[2] / (res[1]*10**6)));
                        });
                        tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                            
                            initialData[1].ethPrice = String(res/(10**9));
                            setEthSportPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
                        });
                        tokenPriceContract.methods.getPrice(esgTokenAddress).call(function (err, res) {
                            initialData[0].totalPrice = String(res[0] * res[2] / (res[1]*10**6));
                            //initialData[0].ethPrice = String(10**18/res[0]);
                            //console.log(initialData[1].ethPrice);
                            setEsgPrice(String(res[0] * res[2] / (res[1]*10**6)));
                        });
                        tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                            
                            initialData[0].ethPrice = String(res/(10**9));
                            setEthEsgPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
                        });
                        sportContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                        if(res.length>7){
                            initialData[1].balance = String(parseInt(String(res).substring(0,res.length-7))/100);
                            setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100));
                        }
                        else{
                            setSportBalance("0.00");
                        }              
                        });
                        esgContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                        if(res.length>7){
                            initialData[0].balance = String(parseInt(String(res).substring(0,res.length-7))/100);
                            setEsgBalance(String(parseInt(String(res).substring(0,res.length-7))/100));
                        }
                        else{
                            setEsgBalance("0.00");
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
    const getAddress = (val) => {
        setAdress(val)
    }    
    return (
        <div className={style.token}>
            <Header getAddress={getAddress}/>
            <div className={`w-100 ${style.content}`}>
                
                <div className={`row row-cols-md-2 row-cols-sm-1 ${style.second_container}`}>
                    {
                        (Number(esgBalance) >= 0 || Number(sportBalance) >= 0 )&& initialData.map((e, i) =>
                            
                            <div className={`col ${style.token_buy_container}`} key={i}><PresaleBuy address = {address} data={e} id = {i} /></div>
                            
                        )
                    }
                </div>
                {/* <div className={style.calc_container}>
                    <Calculator />
                </div> */}
            </div>
        </div>
    )
}

export default Presale;