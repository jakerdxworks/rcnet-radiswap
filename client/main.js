// import './style.css'
import scryptoLogo from './scryptoLogo.png'
import { 
  RadixDappToolkit, 
  // ManifestBuilder,
  Decimal,
  Bucket,
  Expression,
  Address,
  ongoingAccounts
 } from "@radixdlt/radix-dapp-toolkit";
import { 
  RadixEngineToolkit,
  NetworkId,
  NotarizedTransaction,
  PublicKey,
  PrivateKey,
  Signature,
  SignatureWithPublicKey, 
  ManifestBuilder, 
  ManifestAstValue, 
  ManifestSborValue, 
  TransactionBuilder, 
  TransactionHeader,
  TransactionManifest,
  ValidationConfig,
  generateRandomNonce,
  InstructionList, 
} from '@radixdlt/radix-engine-toolkit'


// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="/vite.svg" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${scryptoLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Scrypto!</h1>
//     <div class="card">
//       <radix-connect-button />
//     </div>
//     <p class="read-the-docs">
//       Click on the Scrypto logo to learn more
//     </p>
//   </div>
// `

const dAppId = 'account_tdx_c_1pyu3svm9a63wlv6qyjuns98qjsnus0pzan68mjq2hatqejq9fr'

const rdt = RadixDappToolkit(
  { dAppDefinitionAddress: dAppId, dAppName: 'GumballMachine' },
  (requestData) => {
    requestData({
      accounts: { quantifier: 'atLeast', quantity: 1 },
    }).map(({ data: { accounts } }) => {
      // add accounts to dApp application state
      console.log("account data: ", accounts)
      document.getElementById('accountName').innerText = accounts[0].label
      document.getElementById('accountAddress').innerText = accounts[0].address
      accountAddress = accounts[0].address
    })
  },
  {
    networkId: 12, // 12 is for RCnet 01 for Mainnet
    onDisconnect: () => {
      // clear your application state
    },
    onInit: ({ accounts }) => {
      // set your initial application state
      console.log("onInit accounts: ", accounts)
      if (accounts.length > 0) {
        document.getElementById('accountName').innerText = accounts[0].label
        document.getElementById('accountAddress').innerText = accounts[0].address
        accountAddress = accounts[0].address
      }
    },
  }
)
console.log("dApp Toolkit: ", rdt)

import { TransactionApi, StateApi, StatusApi, StreamApi } from "@radixdlt/babylon-gateway-api-sdk";


const transactionApi = new TransactionApi();
const stateApi = new StateApi();
const statusApi = new StatusApi();
const streamApi = new StreamApi();

let accountAddress // User account address
let componentAddress = "component_tdx_c_1qdqsjrkdklx0a880vjf3q4n3cvf2x2nhgdjguk8cg42s34477x" 
let resourceAddress // GUM resource address
let packageAddress = "package_tdx_c_1qqfz89uh504w4ua0nvgx8ewel5jrp05glmdsggmyng5sldy63w"
let tokenAAddress = "resource_tdx_c_1q8hgm0gdvrmffxytefwkm4ruarmjczp3syhuukc3n5tq32jlpq"
let tokenBAddress = "resource_tdx_c_1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40v2wv"
let tokenAAmount = "10"
let tokenBAmount = "10"
let swapFee = "0.02"
let xrdAddress = "resource_tdx_c_1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40v2wv"
let poolunitsAddress = "resource_tdx_c_1q83fknuu5g60rmu95xchgwzn7yaexexq5kclkqeesk3s3v2a6d"


// document.getElementById('testTransaction').onclick = async function () {
//   let test_manifest = new ManifestBuilder()
//   .callMethod(
//     accountAddress,
//     "withdraw",
//     [
//       new ManifestAstValue.Address(
//         xrdAddress
//       ),
//       new ManifestAstValue.Decimal(10),
//     ]
//   )
//   .takeFromWorktop(
//     xrdAddress,
//     (builder, bucket) =>
//       builder.callMethod(
//         accountAddress,
//         "deposit",
//         [bucket]
//       )
//   )
//   .build();

//   console.log((
//     await test_manifest.convert(
//       InstructionList.Kind.String,
//       NetworkId.RCnetV1
//     )
//   ).instructions.value)

//   let converted_manifest = await test_manifest.convert(
//     InstructionList.Kind.String,
//     NetworkId.RCnetV1
//   )

//   let string_converted_manifest = converted_manifest.instructions.value;

//   // let converted_manifest = await test_manifest.convert(
//   //   InstructionList.Kind.String,
//   //   NetworkId.RCnetV1
//   // );

//   console.log("Converted Manifest: ", string_converted_manifest)




  // let formatted = test_convert.split('\n')
  //   .map(line => '  ' + line.trim())
  //   .join('\n');

  // console.log("formatted: ", formatted)

  // Send manifest to extension for signing
//   const result = await rdt
//     .sendTransaction({
//       transactionManifest: string_converted_manifest,
//       version: 1,
//     })

// if (result.isErr()) throw result.error

// }

document.getElementById('createToken').onclick = async function () {
  
  let manifest = new ManifestBuilder()
  .createFungibleResourceWithInitialSupply(
    new ManifestAstValue.U8(18),
    new ManifestAstValue.Map(
      ManifestAstValue.Kind.String,
      ManifestAstValue.Kind.String,
      []
    ),
    new ManifestAstValue.Map(
      ManifestAstValue.Kind.Enum,
      ManifestAstValue.Kind.Tuple,
      []
    ),
    new ManifestAstValue.Decimal(1000)
  )
  .callMethod(accountAddress, "deposit_batch", [
    ManifestAstValue.Expression.entireWorktop()
  ])
  .build();

let converted_manifest = await manifest.convert(
  InstructionList.Kind.String,
  NetworkId.RCnetV1
);

console.log("Conversion: ", converted_manifest)

let string_converted_manifest = converted_manifest.instructions.value;

console.log("Create Token Manifest: ", string_converted_manifest)

// Send manifest to extension for signing
const result = await rdt
  .sendTransaction({
    transactionManifest: string_converted_manifest,
    version: 1,
  })

if (result.isErr()) throw result.error

console.log("Intantiate WalletSDK Result: ", result.value)

// // ************ Fetch the transaction status from the Gateway API ************
// let status = await transactionApi.transactionStatus({
//   transactionStatusRequest: {
//     intent_hash_hex: result.value.transactionIntentHash
//   }
// });
// console.log('Instantiate TransactionApi transaction/status:', status)

// // ************ Fetch component address from gateway api and set componentAddress variable **************
// let commitReceipt = await transactionApi.transactionCommittedDetails({
//   transactionCommittedDetailsRequest: {
//     intent_hash_hex: result.value.transactionIntentHash
//   }
// })
// console.log('Instantiate Committed Details Receipt', commitReceipt)
// new_token = commitReceipt.details.referenced_global_entities[0];
//   document.getElementById('newTokenAddress').innerText = new_token;

}

// document.getElementById('submit').onclick = async function () {
//   // let fungibles: FungibleResourcesCollectionItem[] = []
//   let accountState = await stateApi.stateEntityDetails({
//     stateEntityDetailsRequest: {
//       addresses: [accountAddress]
//     }
//   })

//   // accountState.items[0].fungible_resources?.items.forEach(item => fungibles.push(item))
//   // console.log(accountState.items[0].fungible_resources?.items[0].resource_address)
//   console.log(accountState.items[0].fungible_resources?.items.forEach(item => fungibles.push(item)))
// }


window.onload = async function fetchData() {
  var fungibles = [];

  let accountState = await stateApi.stateEntityDetails({
    stateEntityDetailsRequest: {
      addresses: [accountAddress]
    }
  })
  
  accountState.items[0].fungible_resources?.items.forEach(item => fungibles.push(item))

  // console.log(fungibles)

  const fungibles_string = [];

  let i = 0;

  while (i < fungibles.length) {
    let fungible_string = fungibles[i].resource_address;
    fungibles_string.push(fungible_string);
    i++;
  }

  console.log("Array of Fungibles in a String: ", fungibles_string)

  var select = document.createElement("select");

  var selectTokenA = document.getElementById("selectTokenA");
  var selectTokenB = document.getElementById("selectTokenB");

  for (const val of fungibles_string)
  {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      select.appendChild(option);
      selectTokenA.appendChild(option.cloneNode(true));
      selectTokenB.appendChild(option.cloneNode(true));
  }

}

let tokenAMetadata = await stateApi.entityMetadataPage({
  stateEntityMetadataPageRequest: {
    address: tokenAAddress
  }
})



console.log("Token A Metadata: ", tokenAMetadata)

let metadata = tokenAMetadata.items[2].value.as_string;

console.log("Metadata: ", metadata)

// Retrieves TokenPair
async function loadTokenPair() {

  let tokenAMetadata = await stateApi.entityMetadataPage({
    stateEntityMetadataPageRequest: {
      address: [tokenAAddress]
    }
  })

  console.log("Token A Metadata: ", tokenAMetadata)

  let token_pair = []

  token_pair.push(tokenAAddress);
  token_pair.push(tokenBAddress);
  
  var select = document.createElement("select");

  var swapDropDown = document.getElementById("swapDropDown");
  var exactSwapDropDown = document.getElementById("exactSwapDropDown");
  
  for (const val of token_pair)
  {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0) + val.slice(1);
      select.appendChild(option);
      swapDropDown.appendChild(option.cloneNode(true));
      exactSwapDropDown.appendChild(option.cloneNode(true));
  }
  
}

let token_pair = []

token_pair.push(tokenAAddress);
token_pair.push(tokenBAddress);

var select = document.createElement("select");

var swapDropDown = document.getElementById("swapDropDown");
var exactSwapDropDown = document.getElementById("exactSwapDropDown");

for (const val of token_pair)
{
    var option = document.createElement("option");
    option.value = val;
    option.text = val.charAt(0) + val.slice(1);
    select.appendChild(option);
    swapDropDown.appendChild(option.cloneNode(true));
    exactSwapDropDown.appendChild(option.cloneNode(true));
}


// ************ Instantiate component and fetch component and resource addresses *************
document.getElementById('instantiateComponent').onclick = async function () {
  // let packageAddress = document.getElementById("packageAddress").value;
  // let tokenAAddress = document.getElementById("selectTokenA").value;
  // let tokenAAmount = document.getElementById("amountA").value;
  // let tokenBAddress = document.getElementById("selectTokenB").value;
  // let tokenBAmount = document.getElementById("amountB").value;
  // let swapFee = document.getElementById("swapFee").value;

  let manifest = new ManifestBuilder()
    .callMethod(
      accountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(tokenAAddress),
        new ManifestAstValue.Decimal(tokenBAmount),
      ]
    )    
    .callMethod(
      accountAddress,
      "withdraw", 
      [
      new ManifestAstValue.Address(tokenBAddress),
      new ManifestAstValue.Decimal(tokenBAmount)
      ]
    )
    .takeFromWorktop(
      tokenAAddress,
      (builder, tokenABucket) =>
      builder.takeFromWorktop(
        tokenBAddress,
        (builder, tokenBBucket) =>
        builder.callFunction(
          packageAddress,
          "Radiswap",
          "instantiate_radiswap",
          [
            tokenABucket,
            tokenBBucket,
            new ManifestAstValue.Decimal("0.02")
          ]
        )
      )
    )
    .callMethod(
      accountAddress,
      "deposit_batch",[
      ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

  console.log("Manifest ", manifest)

  let test_manifest = manifest.instructions.value;

  console.log("Instantiate Manifest: ", test_manifest)

  let converted_manifest = await manifest.convert(
    InstructionList.Kind.String,
    NetworkId.RCnetV1
  );
  
  console.log("Conversion: ", converted_manifest)
  
  let string_converted_manifest = converted_manifest.instructions.value;
          
  console.log("Instantiate Manifest: ", string_converted_manifest)
  // Send manifest to extension for signing
  const result = await rdt
    .sendTransaction({
      transactionManifest: string_converted_manifest,
      version: 1,
    })

  if (result.isErr()) throw result.error

  // console.log("Intantiate WalletSDK Result: ", result.value)

  // // ************ Fetch the transaction status from the Gateway API ************
  // let status = await transactionApi.transactionStatus({
  //   transactionStatusRequest: {
  //     intent_hash_hex: result.value.transactionIntentHash
  //   }
  // });
  // console.log('Instantiate TransactionApi transaction/status:', status)

  // // ************ Fetch component address from gateway api and set componentAddress variable **************
  // let commitReceipt = await transactionApi.transactionCommittedDetails({
  //   transactionCommittedDetailsRequest: {
  //     intent_hash_hex: result.value.transactionIntentHash
  //   }
  // })
  // console.log('Instantiate Committed Details Receipt', commitReceipt)

  // // ****** Set componentAddress variable with gateway api commitReciept payload ******
  // // componentAddress = commitReceipt.details.referenced_global_entities[0]
  // document.getElementById('componentAddress').innerText = componentAddress;
  // // ****** Set resourceAddress variable with gateway api commitReciept payload ******
  // poolunitsAddress = commitReceipt.details.referenced_global_entities[1]
  // document.getElementById('poolunitsAddress').innerText = poolunitsAddress;

  loadTokenPair();
}



document.getElementById('swapToken').onclick = async function () {
  let inputToken = document.getElementById("swapDropDown").value;
  let inputAmount = document.getElementById("inputAmount").value;

  let manifest = new ManifestBuilder()
    .callMethod(
      accountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(inputToken),
        new ManifestAstValue.Decimal(inputAmount),
      ]
    )
    .takeFromWorktop(
      inputToken,
      (builder, inputBucket) => 
      builder.callMethod(
        componentAddress,
        "swap",
        [
          inputBucket
        ]
      )
    )
    .callMethod(
      accountAddress,
      "deposit_batch",
      [
        ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

  console.log(manifest)

  let converted_manifest = await manifest.convert(
    InstructionList.Kind.String,
    NetworkId.RCnetV1
  );

  let string_converted_manifest = converted_manifest.instructions.value;

  console.log("Create Token Manifest: ", string_converted_manifest)

  // Send manifest to extension for signing
  const result = await rdt
    .sendTransaction({
      transactionManifest: string_converted_manifest,
      version: 1,
    })

  if (result.isErr()) throw result.error

  console.log("Intantiate WalletSDK Result: ", result.value)
  
}

document.getElementById('getAmount').onclick = async function () {
  let requestedToken = document.getElementById("exactSwapDropDown").value;
  let requestedAmount = document.getElementById("requestedAmount").value;

  console.log(requestedAmount)

    // Sorting logic
    let inputTokenAddress, outputTokenAddress;
    if (requestedToken === tokenAAddress ) {
      inputTokenAddress = tokenBAddress; 
      outputTokenAddress = tokenAAddress;
    } else {
      inputTokenAddress = tokenAAddress;
      outputTokenAddress = tokenBAddress; 
    };

  // Making request to gateway
  let inputTokenRequest = await stateApi.entityFungibleResourceVaultPage(
    {
      stateEntityFungibleResourceVaultsPageRequest: {
        address: componentAddress,
        resource_address: inputTokenAddress,
      }
    });
  
  console.log("Token A Request: ", inputTokenRequest);

  let outputTokenRequest = await stateApi.entityFungibleResourceVaultPage(
    {
      stateEntityFungibleResourceVaultsPageRequest: {
        address: componentAddress,
        resource_address: outputTokenAddress,
      }
    });

  console.log("Token B Request: ", outputTokenRequest);

  // Retrieiving pool liquidity
  // let token_a_amount = tokenArequest.items[0].amount;
  // let token_b_amount = outputTokenRequest.items[0].amount;

  let x = inputTokenRequest.items[0].amount;
  let y = outputTokenRequest.items[0].amount;
  // let x = self.vaults[&self.other_resource_address(output_resource_address)].amount();
  // let y = self.vaults[&output_resource_address].amount();
  let dy = requestedAmount;
  
  let r = (1 - swapFee) / 1;

  let dx = (dy * x) / (r * (y - dy));

  document.getElementById('requiredResource').innerText = inputTokenAddress
  document.getElementById('requiredAmount').innerText = dx 
}

document.getElementById('exactSwapToken').onclick = async function () {
  let requiredResource = document.getElementById('requiredResource');
  let requiredAmount = document.getElementById("requiredAmount").innerHTML;
  let requestedResource = document.getElementById("exactSwapDropDown").value;
  let requestedAmount = document.getElementById("requestedAmount").value;

  console.log(requestedResource)
  console.log(requestedAmount)
  

  // let requestedAmountNum = parseInt(requestedAmount);

  // Sorting logic
  let inputTokenAddress, outputTokenAddress;
  if (requiredResource === tokenAAddress ) {
    inputTokenAddress = tokenBAddress; 
    outputTokenAddress = tokenAAddress;
  } else {
    inputTokenAddress = tokenAAddress;
    outputTokenAddress = tokenBAddress; 
  };

  let manifest = new ManifestBuilder()
  .callMethod(
    accountAddress,
    "withdraw",
    [
      new ManifestAstValue.Address(inputTokenAddress),
      new ManifestAstValue.Decimal(requiredAmount),
    ]
  )
  .takeFromWorktop(
    inputTokenAddress,
    (builder, inputBucket) => 
    builder.callMethod(
      componentAddress,
      "swap",
      [inputBucket]      
    )
  )
  // bug
  .assertWorktopContainsByAmount(
    new ManifestAstValue.Address(requestedResource),
    new ManifestAstValue.Decimal(requestedAmount)
  )
  .callMethod(
    accountAddress,
    "deposit_batch", 
    [
    ManifestAstValue.Expression.entireWorktop()
    ]
  )
  .build();

  console.log(manifest)

  let converted_manifest = await manifest.convert(
    InstructionList.Kind.String,
    NetworkId.RCnetV1
  )

  let string_converted_manifest = converted_manifest.instructions.value;
  
  console.log("Create Token Manifest: ", string_converted_manifest)

  // Send manifest to extension for signing
  const result = await rdt
    .sendTransaction({
      transactionManifest: string_converted_manifest,
      version: 1,
    })

  if (result.isErr()) throw result.error

  console.log("Intantiate WalletSDK Result: ", result.value)
  
}




document.getElementById('getLiquidity').onclick = async function () {
//   let manifest = new ManifestBuilder()
//     .callMethod(
//       componentAddress,
//       "get_liquidity"
//     )
//     .build()
//     .toString();

//     const result = await rdt.sendTransaction({
//       transactionManifest: manifest,
//       version: 1,
//     })

// if (result.isErr()) throw result.error

let tokenArequest = await stateApi.entityFungibleResourceVaultPage(
  {
    stateEntityFungibleResourceVaultsPageRequest: {
      address: componentAddress,
      resource_address: tokenAAddress,
    }
  });

  console.log("Token A Request: ", tokenArequest)

  let outputTokenRequest = await stateApi.entityFungibleResourceVaultPage(
    {
      stateEntityFungibleResourceVaultsPageRequest: {
        address: componentAddress,
        resource_address: tokenBAddress,
      }
    });

  
  console.log("Token B Request: ", outputTokenRequest)

  let token_a_amount = tokenArequest.items[0].amount;
  console.log("Token A Request: ", token_a_amount)
  let token_b_amount = tokenBrequest.items[0].amount;

  document.getElementById('tokenALiquidity').innerText = token_a_amount;
  document.getElementById('tokenBLiquidity').innerText = token_b_amount;


}





// document.getElementById('getLiquidity').onclick = async function () {

// }

// document.getElementById('getLiquidity').onclick = async function () {

// }

// document.getElementById('getLiquidity').onclick = async function () {

// }

// document.getElementById('getLiquidity').onclick = async function () {

// }
