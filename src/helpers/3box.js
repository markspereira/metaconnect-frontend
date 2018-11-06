import {signMsg} from "./wallet";
import {getLocal} from "./localstorage";
// import {cleanHandle} from "./utilities";
const Web3 = require('web3');
const Box = require('3box');
let web3 = new Web3();
Web3.providers.HttpProvider.prototype.sendAsync = signMsg;
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/'));
const HDWalletProvider = require("truffle-hdwallet-provider");


export const init3box = async () => {
  const currentAccount = getLocal("account").address;
  const prvdr = await new HDWalletProvider(getLocal('account').privateKey, "https://ropsten.infura.io/");
  console.log('PROVIDER: ', prvdr);
  const box = await new Box.openBox(currentAccount, web3.currentProvider);
  if (box) window.box = box;
  getAccount();
  getProfile();

};

// const print = msg => console.log("??>> : ", msg);

export const createAccount = async name => {
  const box = window.box;
  return await box.public.set('name', name);
};

export const getProfile = async () => {
  const profile = await Box.getProfile("0xA1b02d8c67b0FDCF4E379855868DeB470E169cfB");
  // const profile = await box.getProfile(getLocal('account').publicAddress.substring(0,12));
  console.log('PROFILE: ', profile)
}

export const getAccount =  async address => {
  console.log("getting account");
  // const nickname = await box.public.set('name', 'mark');
  try {
    const box = window.box;
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

export const set3boxItem = (key, data) => {
  const box = window.box;
  return box.public.set(key, data);
};

export const setObject = async object => {
  const {box} = window;
  try {
    console.log("OBJECT: ", object);
    console.log("BOX for: ", box);
    Object.keys(object).forEach(async key => {
      try {
        box.public.set(key.toString(), object[key]);
        console.log(key, object[key]);
      } catch(e) {
        console.log(e)
      }
    })
  } catch(e) {

  }
};