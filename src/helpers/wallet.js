import {saveLocal} from './localstorage'
const Web3 = require('web3');
const Wallet = require('ethereumjs-wallet');
const web3 = new Web3();
//TODO: switch to mainnet
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/'));
export const provider = web3;

/**
 * @desc create ethereum wallet and save to local storage
 */
export const createWallet = async () => {
  const newWallet = Wallet.generate();
  const { address } = web3.eth.accounts.privateKeyToAccount(newWallet.getPrivateKeyString().substring(2));
  await saveLocal("account", { privateKey: newWallet.getPrivateKeyString().substring(2), publicAddress: address });
};
