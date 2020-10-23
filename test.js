const Uniprice = require('./index')

// SPANK token address
let spankExchangeAddress = '0x4e395304655f0796bc3bc63709db72173b9ddf98';
//let spankExchangeAddress = '';

async function main() {

  const uniprice = Uniprice()
  //const spankSwap = uniprice.setExchange('SPANK', '0x4e395304655f0796bc3bc63709db72173b9ddf98')
  const spankSwap = uniprice.setExchange('a1',
    '0x4e395304655f0796bc3bc63709db72173b9ddf98')


  console.log('ContractCreator:', await uniprice.factoryAddress );

  console.log(await spankSwap.getPrice())
  console.log(await uniprice.getPrice('a1'))
  // console.log(uniprice.exchanges)

  uniprice.dropExchange('a1')
  // console.log(uniprice.exchanges)
}

main()
