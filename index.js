const ethers = require('ethers');

// Mainnet Addresses
const DAI_EXCHANGE = '0x09cabec1ead1c0ba254b09efb3ee13841712be14'
const FACTORY = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'
//const FACTORY = '0xA7f00de671ebEB1b04C19a00842ff1d980847f0B'

// export const FACTORY2 = FACTORY;

//const DAI_EXCHANGE = '0x6b175474e89094c44da98b954eedeac495271d0f'
//const FACTORY = '0xb5b06a16621616875A6C2637948bF98eA57c58fa'

/**
 * ContractCreator: UNI v2
 * 0xb5b06a16621616875A6C2637948bF98eA57c58fa
 * 
 */


/**
 * 0x09cabec1ead1c0ba254b09efb3ee13841712be14
 * Contract 
 * TokenTracker:
 Uniswap V1 (UNI-V1)
 * 
 * 0x6b175474e89094c44da98b954eedeac495271d0f
 * Contract 
 * UNI v2
 * TokenTracker:
 Dai Stablecoin (DAI) (@$1.0100)
 */

// ABIs
let EXCHANGE_ABI = require('./exchangeABI.json')
let FACTORY_ABI = require('./factoryABI.json')

// options:
// - provider -> an ethers.js provider, defaults to using INFURA
// - factoryAddress -> address for the factory, used to lookup token exchanges
// - daiExchangeAddress -> address for DAI exchange
function Uniprice(options={}) {
  if (!(this instanceof Uniprice)){
    const obj = Object.create(Uniprice.prototype);
    return Uniprice.apply(obj, arguments);
  }
  this.provider = options.provider || new ethers.providers.InfuraProvider()
  this.factoryAddress = options.factoryAddress || FACTORY
  this.factory = new ethers.Contract(this.factoryAddress, FACTORY_ABI, this.provider)
  this.exchanges = {}
  this.daiExchangeAddress = options.daiExchangeAddress || DAI_EXCHANGE
  this.daiSwap = new ethers.Contract(this.daiExchangeAddress, EXCHANGE_ABI, this.provider);
  return this
}

Uniprice.prototype.getDaiPrice = function() {
  return this.daiSwap.getEthToTokenInputPrice('1')
}

Uniprice.prototype.setExchange = function(name, exchangeAddress) {
  if (!name || typeof name != 'string') {
    throw new Error('Uniprice.setExchange: name must be string')
  }

  this.exchanges[name] = TokenExchange(this, exchangeAddress)
  return this.exchanges[name]
}

Uniprice.prototype.dropExchange = function(name) {
  if (!this.exchanges[name]) {
    throw new Error('Uniprice.dropExchange: exchange name not found')
  }
  delete this.exchanges[name]
}

Uniprice.prototype.getPrice = async function(name) {
  if (!this.exchanges[name]) {
    throw new Error('Uniprice.getPrice: exchange name not found')
  }
  return await this.exchanges[name].getPrice()
}

function TokenExchange(uniprice, exchangeAddress) {
  if (!(this instanceof TokenExchange)){
    const obj = Object.create(TokenExchange.prototype);
    return TokenExchange.apply(obj, arguments);
  }
  this.uniprice = uniprice
  this.exchange = new ethers.Contract(exchangeAddress, EXCHANGE_ABI, this.uniprice.provider);
  return this
}

TokenExchange.prototype.getPrice = async function() {
  const [tokenPrice, daiPrice] = await Promise.all([this.exchange.getEthToTokenInputPrice('1'), this.uniprice.getDaiPrice()])
  return daiPrice.toNumber() / tokenPrice.toNumber()
}

module.exports = Uniprice
