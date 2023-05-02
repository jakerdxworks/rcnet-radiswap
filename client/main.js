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
let packageAddress = "package_tdx_c_1qqfz89uh504w4ua0nvgx8ewel5jrp05glmdsggmyng5sldy63w"
let tokenAAddress 
let tokenBAddress 
let swapFee
let xrdAddress = "resource_tdx_c_1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40v2wv"
let poolunitsAddress


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

}


window.onload = async function fetchData() {
  var fungibles = [];

  let accountState = await stateApi.stateEntityDetails({
    stateEntityDetailsRequest: {
      addresses: [accountAddress]
    }
  })
  
  accountState.items[0].fungible_resources?.items.forEach(item => fungibles.push(item))

  const fungibles_string = [];

  let i = 0;

  while (i < fungibles.length) {
    let fungible_string = fungibles[i].resource_address;
    fungibles_string.push(fungible_string);
    i++;
  }

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

// Retrieves TokenPair
async function loadTokenPair() {

  let tokenPair = [];

  tokenPair.push(tokenAAddress);
  tokenPair.push(tokenBAddress);
  
  var select = document.createElement("select");

  var swapDropDown = document.getElementById("swapDropDown");
  var exactSwapDropDown = document.getElementById("exactSwapDropDown");
  
  for (const val of tokenPair)
  {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0) + val.slice(1);
      select.appendChild(option);
      swapDropDown.appendChild(option.cloneNode(true));
      exactSwapDropDown.appendChild(option.cloneNode(true));
  }

  document.getElementById("tokenAAddress").innerText = tokenAAddress;
  document.getElementById("tokenBAddress").innerText = tokenBAddress;
  
}

async function loadPoolInformation() {
  document.getElementById("tokenPair").innerText = tokenAAddress + "/" + tokenBAddress;

  let tokenARequest = await stateApi.entityFungibleResourceVaultPage({
    stateEntityFungibleResourceVaultsPageRequest: {
      address: componentAddress,
      resource_address: tokenAAddress,
    }
  })

  let tokenBRequest = await stateApi.entityFungibleResourceVaultPage({
    stateEntityFungibleResourceVaultsPageRequest: {
      address: componentAddress,
      resource_address: tokenBAddress,
    }
  })

  document.getElementById("liquidity").innerText = tokenARequest.items[0].amount + "/" + tokenBRequest.items[0].amount;
}

// ************ Instantiate component and fetch component and resource addresses *************
document.getElementById('instantiateComponent').onclick = async function () {
  // let packageAddress = document.getElementById("packageAddress").value;
  tokenAAddress = document.getElementById("selectTokenA").value;
  let tokenAAmount = document.getElementById("amountA").value;
  tokenBAddress = document.getElementById("selectTokenB").value;
  let tokenBAmount = document.getElementById("amountB").value;
  swapFee = document.getElementById("swapFee").value;

  let manifest = new ManifestBuilder()
    .callMethod(
      accountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(tokenAAddress),
        new ManifestAstValue.Decimal(tokenAAmount),
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
            new ManifestAstValue.Decimal(swapFee)
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

  console.log("Intantiate WalletSDK Result: ", result.value)

  // ************ Fetch the transaction status from the Gateway API ************
  let status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Instantiate TransactionApi transaction/status:', status)

  // ************ Fetch component address from gateway api and set componentAddress variable **************
  let commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  })
  console.log('Instantiate Committed Details Receipt', commitReceipt)

  // ****** Set componentAddress variable with gateway api commitReciept payload ******
  componentAddress = commitReceipt.details.referenced_global_entities[0]
  document.getElementById('componentAddress').innerText = componentAddress;
  // ****** Set resourceAddress variable with gateway api commitReciept payload ******
  poolunitsAddress = commitReceipt.details.referenced_global_entities[1]
  document.getElementById('poolunitsAddress').innerText = poolunitsAddress;

  loadTokenPair();
  loadPoolInformation();
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

  loadPoolInformation();
}

document.getElementById('getAmount').onclick = async function () {
  let requestedToken = document.getElementById("exactSwapDropDown").value;
  let requestedAmount = document.getElementById("requestedAmount").value;

  console.log(componentAddress)

    // Sorting logic
    let inputTokenAddress, outputTokenAddress;
    if (requestedToken === tokenAAddress ) {
      inputTokenAddress = tokenBAddress; 
      outputTokenAddress = tokenAAddress;
    } else {
      inputTokenAddress = tokenAAddress;
      outputTokenAddress = tokenBAddress; 
    };

    console.log(inputTokenAddress)

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


  let x = inputTokenRequest.items[0].amount;
  let y = outputTokenRequest.items[0].amount;
  let dy = requestedAmount;
  let r = (1 - swapFee) / 1;
  let dx = (dy * x) / (r * (y - dy));

  document.getElementById('requiredResource').innerText = inputTokenAddress
  document.getElementById('requiredAmount').innerText = dx 
}

document.getElementById('exactSwapToken').onclick = async function () {
  let requiredResource = document.getElementById('requiredResource').innerText;
  let requiredAmount = document.getElementById("requiredAmount").innerHTML;  

  let manifest = new ManifestBuilder()
    .callMethod(
      accountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(requiredResource),
        new ManifestAstValue.Decimal(requiredAmount),
      ]
    )
    .takeFromWorktop(
      requiredResource,
      (builder, requiredBucket) => 
      builder.callMethod(
        componentAddress,
        "swap",
        [requiredBucket]      
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

  console.log("Exact Swap sendTransaction Result: ", result)

  // Fetch the transaction status from the Gateway SDK
  let status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Exact Swap TransactionAPI transaction/status: ', status)

  // fetch commit reciept from gateway api 
  let commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  })
  console.log('Exact Swap Committed Details Receipt', commitReceipt)

  // Show the receipt on the DOM
  document.getElementById('exactReceipt').innerText = JSON.stringify(commitReceipt.details.receipt, null, 2);

  loadPoolInformation();
}


document.getElementById('addLiquidity').onclick = async function () {
  let tokenAAmount = document.getElementById("tokenAAmount").value;
  console.log(tokenAAmount)
  let tokenBAmount = document.getElementById("tokenBAmount").value;
  console.log(tokenBAmount)

  let manifest = new ManifestBuilder()
    .callMethod(
      accountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(tokenAAddress),
        new ManifestAstValue.Decimal(tokenAAmount)
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
        builder.callMethod(
          componentAddress,
          "add_liquidity",
          [
            tokenABucket,
            tokenBBucket
          ]
        )
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
  
    console.log("Exact Swap sendTransaction Result: ", result)
}