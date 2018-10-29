import {signMsg} from "./wallet";
import {cleanHandle} from "./utilities";

// const ethers = require('ethers');
const Web3 = require('web3');
// const ProviderBridge = require('ethers-web3-bridge');
const Box = require('3box');

let web3 = new Web3();
let currentAccount;
let metamask = false;

let web3Provider;
// web3Provider = "metamask"
// web3Provider = "ethers"
web3Provider = "browser";

if (web3Provider === "browser") {

  Web3.providers.HttpProvider.prototype.sendAsync = signMsg;
  web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/'));
  currentAccount = JSON.parse(localStorage.account).publicAddress;

} else if (web3Provider === "ethers") {

  // let provider = ethers.providers.getDefaultProvider();
  // let signer = new ethers.Wallet("0x"+JSON.parse(localStorage.account).privateKey);
  // web3 = new Web3(new ProviderBridge(provider, signer));
  // console.log('ETHERS:', ethers);
  // console.log("ETHERS-web3: ", web3);
  // console.log("ETHERS-signer: ", signer);

} else if (web3Provider === "metamask") {

  web3 = window.web3;
  metamask = true;
  window.web3.eth.getAccounts(function(err, accounts) {
    if (accounts.length !== 0) {
      currentAccount = accounts[0];
    } else {
      alert("Unlock or setup your metamask")
    }
  });

}

let box;
(async () => {
  box = await new Box.openBox(currentAccount, web3.currentProvider);
})();

const syncComplete = sync => console.log("SYNC : ", sync);

export const createAccount = async address => {
  let name = await box.public.set('name', 'mark');
  let metaConn = await box.private.set('metaConn', '0x123456789876543234567876543223323');
  console.log("NAME: ", name);
  console.log("MetaConn: ", metaConn);
  console.log('BOX: ', box);
  // Box.openBox(currentAccount, web3.currentProvider).then(bx => {
  //   bx.onSyncDone(syncComplete)
  //   box = bx;
  //   console.log(box);
  // });
  return box;
}

export const getAccount =  async address => {
  console.log("getting account")
  // const nickname = await box.public.set('name', 'mark');
  try {
    console.log('the box: ', box);
    const twitter = await box.public.get('twitter');
    const telegram = await box.public.get('telegram');
    const github = await box.public.get('github');
    const linkedin = await box.public.get('linkedin');
    const phone = await box.public.get('phone');
    const email = await box.public.get('email');
    console.log("twitter: ", twitter);
    console.log("telgram: ", telegram);
    console.log("github: ", github);
    console.log("linkedin: ", linkedin);
    console.log("phone: ", phone);
    console.log("email: ", email);
  } catch (e) {
    console.log("ERROR: ", e)
  }
};

export const setObject = async object => {
  try {
    console.log("OBJECT: ", object);
    Object.keys(object).forEach(async key => {
      try {
        box.public.set(key, object[key]);
        console.log(key, object[key]);
      } catch(e) {
        console.log(e)
      }
    })
  } catch(e) {

  }
};