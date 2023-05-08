import './style.css'
import scryptoLogo from './scryptoLogo.png'
import { 
  RadixDappToolkit, 
 } from "@radixdlt/radix-dapp-toolkit";
import { 
  NetworkId,
  ManifestBuilder, 
  ManifestAstValue, 
  InstructionList, 
  // Transactions
  NotarizedTransaction,
  PrivateKey,
  TransactionBuilder,
  TransactionHeader,
  TransactionManifest,
  ValidationConfig,
  generateRandomNonce,
  Convert,
  TransactionIntent,
  SignedTransactionIntent,
  RadixEngineToolkit,
  PublicKey,
} from '@radixdlt/radix-engine-toolkit'


document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${scryptoLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Scrypto!</h1>
    <div class="card">
      <radix-connect-button />
    </div>
    <p class="read-the-docs">
      Click on the Scrypto logo to learn more
    </p>
  </div>
`

const dAppId = 'account_tdx_c_1p8l69nnvnens5awhkmxfkkxjvfpv9zvd65a0ra9sfh5sds7tfe'

const rdt = RadixDappToolkit(
  { dAppDefinitionAddress: dAppId, dAppName: "Radiswap" },
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
        document.getElementById('accountAddress').innerText = truncateMiddle(accounts[0].address)
        accountAddress = accounts[0].address
      }
    },
  }
)
console.log("dApp Toolkit: ", rdt)

import { TransactionApi, StateApi, StatusApi, StreamApi, } from "@radixdlt/babylon-gateway-api-sdk";

const transactionApi = new TransactionApi();
const stateApi = new StateApi();
const statusApi = new StatusApi();
const streamApi = new StreamApi();

let accountAddress // User account address
let componentAddress
let packageAddress = "package_tdx_c_1qplcp4n5exhsd5e2w8s5yqj0r0hl9mym4nhecey2jf6sp9nggp"
let tokenAAddress 
let tokenBAddress 
let swapFee
let xrdAddress = "resource_tdx_c_1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40v2wv"
let poolUnitsAddress
let txLink = "https://rcnet-dashboard.radixdlt.com/transaction/"
let fungibles_metadata = []
let token_pair = []
let componentAddressList = []

let notaryPrivateKey = new PrivateKey.EcdsaSecp256k1(
  "40c1b9deccc56c0da69821dd652782887b5d31fe6bf6ead519a23f9e9472b49b"
);

let signer1PublicKey = new PublicKey.EcdsaSecp256k1(
  "020166fe820d94d7e207d2076e85f740b7593189e9ea1f166fa0db6831f73247bc"
  )

let signer1PrivateKey = new PrivateKey.EcdsaSecp256k1(
  "df1fdb3f36d7a079c4b7bd288ae2122e2abdbb5836bb9ac3c9c9eef53807b2eb"
);


let virtualAccountAddress =
await RadixEngineToolkit.deriveVirtualAccountAddress(
  signer1PublicKey,
  NetworkId.RCnetV1
);


console.log(virtualAccountAddress);

let transactionHeader = new TransactionHeader(
  1 /* The transaction version. Currently always 1 */,
  NetworkId.RCnetV1 /* The network that this transaction is destined to */,
  6626 /* The start epoch (inclusive) of when this transaction becomes valid */,
  7000 /* The end epoch (exclusive) of when this transaction is no longer valid */,
  generateRandomNonce() /* A random nonce */,
  notaryPrivateKey.publicKey() /* The public key of the notary */,
  true /* Whether the notary signature is also considered as an intent signature */,
  100_000_000 /* A limit on the amount of cost units that the transaction can consume */,
  0 /* The percentage of fees that goes to validators */
);



document.getElementById("getRcnetTokens").onclick = async function () {

  let notaryPrivateKey = new PrivateKey.EcdsaSecp256k1(
    "40c1b9deccc56c0da69821dd652782887b5d31fe6bf6ead519a23f9e9472b49b"
  );
  
  let signer1PublicKey = new PublicKey.EcdsaSecp256k1(
    "020166fe820d94d7e207d2076e85f740b7593189e9ea1f166fa0db6831f73247bc"
    )
  
  let signer1PrivateKey = new PrivateKey.EcdsaSecp256k1(
    "df1fdb3f36d7a079c4b7bd288ae2122e2abdbb5836bb9ac3c9c9eef53807b2eb"
  );
  

  let virtualAccountAddress =
  await RadixEngineToolkit.deriveVirtualAccountAddress(
    signer1PublicKey,
    NetworkId.RCnetV1
  );

  // let transactionHeader = new TransactionHeader(
  //   1 /* The transaction version. Currently always 1 */,
  //   NetworkId.RCnetV1 /* The network that this transaction is destined to */,
  //   await retrieveCurrentEpoch() /* The start epoch (inclusive) of when this transaction becomes valid */,
  //   await retrieveCurrentEpoch() + 50 /* The end epoch (exclusive) of when this transaction is no longer valid */,
  //   generateRandomNonce() /* A random nonce */,
  //   notaryPrivateKey.publicKey() /* The public key of the notary */,
  //   true /* Whether the notary signature is also considered as an intent signature */,
  //   100_000_000 /* A limit on the amount of cost units that the transaction can consume */,
  //   0 /* The percentage of fees that goes to validators */
  // );

  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .callMethod(
      "component_tdx_c_1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tsacmzk0",
      "free",
      []
    )
    .callMethod(
      virtualAccountAddress,
      "deposit_batch",
      [
        ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

  let transaction = await TransactionBuilder.new().then(
    (builder) =>
      builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signer1PrivateKey)
        .notarize(notaryPrivateKey)
  );

  let notarizedTransactionUint8Array = await transaction.compile();
  let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
  console.log(notarizedTransactionHex)

  await transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: notarizedTransactionHex,
    }
  })

  let retrieveTransactionId = await transaction.transactionId();
  let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
  console.log(transactionIdHash)

}

document.getElementById("deployPackage").onclick = async function () {

  const fileWasm = document.getElementById("fileWasm");
  const filew = fileWasm.files[0];
  const code = await loadFile(filew);

  console.log(code)

  const fileSchema = document.getElementById("fileSchema");
  const files = fileSchema.files[0];
  const schema = await loadFile(files);

  console.log(schema)

  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .publishPackage(
      code,
      schema,
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.Tuple,
        []
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.String,
        []
      ),
      new ManifestAstValue.Tuple([
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.Tuple,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.String,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.Tuple,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Map(
          ManifestAstValue.Kind.String,
          ManifestAstValue.Kind.Enum,
          []
        ),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0)),
      ])
    )
    .build();

  // We may now build the complete transaction through the transaction builder.
  let transaction = await TransactionBuilder.new().then(
    (builder) =>
      builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signer1PrivateKey)
        .notarize(notaryPrivateKey)
  );

  // Check that the transaction that we've just built is statically valid.
  (
    await transaction.staticallyValidate(
      ValidationConfig.default(NetworkId.RCnetV1)
    )
  ).throwIfInvalid();

  let notarizedTransactionUint8Array = await transaction.compile();
  let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
  console.log(notarizedTransactionHex)

  await transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: notarizedTransactionHex,
    }
  })

  let retrieveTransactionId = await transaction.transactionId();
  let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
  console.log(transactionIdHash)

    // // ************ Fetch component address from gateway api and set componentAddress variable **************
    // let commitReceipt = await transactionApi.transactionCommittedDetails({
    //   transactionCommittedDetailsRequest: {
    //     intent_hash_hex: transactionIdHash
    //   }
    // })
    // console.log('Instantiate Committed Details Receipt', commitReceipt)
    const createTokenTxLink = document.querySelector(".deployPackageTx");
    let tx = txLink + transactionIdHash;
    createTokenTxLink.href= tx;
    createTokenTxLink.style.display = "inline";

  }


document.getElementById('createToken').onclick = async function () {
  let tokenName = document.getElementById("tokenName").value;
  let tokenSymbol = document.getElementById("tokenSymbol").value;

  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .createFungibleResourceWithInitialSupply(
      new ManifestAstValue.U8(18),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.String,
        [
          [new ManifestAstValue.String("name"), new ManifestAstValue.String(tokenName)],
          [new ManifestAstValue.String("symbol"), new ManifestAstValue.String(tokenSymbol)],
        ], 
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.Enum,
        ManifestAstValue.Kind.Tuple,
        []
      ),
      new ManifestAstValue.Decimal(10000)
    )
    .callMethod(virtualAccountAddress, "deposit_batch", [
      ManifestAstValue.Expression.entireWorktop()
    ])
    .build();

  let transaction = await TransactionBuilder.new().then(
    (builder) =>
      builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signer1PrivateKey)
        .notarize(notaryPrivateKey)
  );

  let notarizedTransactionUint8Array = await transaction.compile();
  let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
  console.log(notarizedTransactionHex)

  await transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: notarizedTransactionHex,
    }
  })

let retrieveTransactionId = await transaction.transactionId();
let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
console.log(transactionIdHash)

// ************ Fetch component address from gateway api and set componentAddress variable **************
let commitReceipt = await waitForCommitment(transactionIdHash);
console.log(commitReceipt)

// Retrieve entity address
// document.getElementById('newTokenAddress').innerText = commitReceipt.details.referenced_global_entities[0];

const createTokenTxLink = document.querySelector(".createTokenTx");
createTokenTxLink.href= `${txLink}${transactionIdHash}`;
createTokenTxLink.style.display = "inline";

}

// ************ Instantiate component and fetch component and resource addresses *************
// This function is used to instantiate a Radiswap component which creates a two token liquidity pool
document.getElementById('instantiateComponent').onclick = async function () {
  // We first retrieve our global variables (tokenAAddress and tokenBAddress) to set its value so that we
  // can conveniently use the variable in other parts of our code. The value that will be saved to this 
  // variable will be the selected token resources that the user wishes to create this liquidity pool.
  // Additionally, since we expect the user to have an indeterminate amount that they would like to 
  // deposit into this pool for every instance, we will only create local variables for the amount inputs
  // (tokenAAmount and tokenBAmount) to be used only once for this function. Likewise with our packageAddress
  // variable.
  // let packageAddress = document.getElementById("packageAddress").value;
  tokenAAddress = document.getElementById("selectTokenA").value;
  let tokenAAmount = document.getElementById("amountA").value;
  tokenBAddress = document.getElementById("selectTokenB").value;
  let tokenBAmount = document.getElementById("amountB").value;
  swapFee = document.getElementById("swapFee").value;

  // We create a Transaction Manifest using the ManifestBuilder class conveniently provided  by the RadixEngineToolkit.
  // This Transaction Manifest has the following instructions:
  // 1. Withdraw the first selected token and amount out of the user's account based on the user's input.
  // 2. Withdraw the second selected token and amount out of the user's account based on the user's input.
  // 3. Take the first token resource and amount and place it in a `Bucket`.
  // 4. Take the second token resource and amount and place it in a `Bucket.
  // 5. Pass the buckets as argument inputs to instantiate the Radiswap component along witht he determined
  // swap fee based on the user's input.
  // 6. Deposit any (Pool Units resourece) resource returned from the instantiation function to the user's account.
  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .callMethod(
      virtualAccountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(tokenAAddress),
        new ManifestAstValue.Decimal(tokenAAmount),
      ]
    )    
    .callMethod(
      virtualAccountAddress,
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
            new ManifestAstValue.Decimal(swapFee),
          ]
        )
      )
    )
    .callMethod(
      virtualAccountAddress,
      "deposit_batch",[
      ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

  let transaction = await TransactionBuilder.new().then(
    (builder) =>
      builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signer1PrivateKey)
        .notarize(notaryPrivateKey)
  );
  
  let notarizedTransactionUint8Array = await transaction.compile();
  let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
  console.log(notarizedTransactionHex)
  
  await transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: notarizedTransactionHex,
    }
  })
  
  let retrieveTransactionId = await transaction.transactionId();
  let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
  console.log(transactionIdHash)
  
  // ************ Fetch component address from gateway api and set componentAddress variable **************
  let commitReceipt = await waitForCommitment(transactionIdHash);
  console.log(commitReceipt)

  // ****** Set componentAddress variable with gateway api commitReciept payload ******
  componentAddress = commitReceipt.details.referenced_global_entities[0];
  componentAddressList.push(componentAddress);
  document.getElementById('componentAddress').innerText = truncateMiddle(componentAddress);
  
  // ****** Set resourceAddress variable with gateway api commitReciept payload ******
  poolUnitsAddress = truncateMiddle(commitReceipt.details.referenced_global_entities[2]);
  document.getElementById('poolUnitsAddress').innerText = poolUnitsAddress;

  const instantiateComponentTxLink = document.querySelector(".instantiateComponentTx");
  instantiateComponentTxLink.href= `${txLink}${transactionIdHash}`;
  instantiateComponentTxLink.style.display = "inline";
  
  loadTokenPair();
  loadPoolInformation();
}

document.getElementById('swapToken').onclick = async function () {
  let inputToken = document.getElementById("swapDropDown").value;
  let inputAmount = document.getElementById("inputAmount").value;

  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .callMethod(
      virtualAccountAddress,
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
      virtualAccountAddress,
      "deposit_batch",
      [
        ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

  let transaction = await TransactionBuilder.new().then(
    (builder) =>
      builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signer1PrivateKey)
        .notarize(notaryPrivateKey)
  );
  
  let notarizedTransactionUint8Array = await transaction.compile();
  let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
  console.log(notarizedTransactionHex)
  
  await transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: notarizedTransactionHex,
    }
  })
  
  let retrieveTransactionId = await transaction.transactionId();
  let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
  console.log(transactionIdHash)
  
  // ************ Fetch component address from gateway api and set componentAddress variable **************
  let commitReceipt = await waitForCommitment(transactionIdHash);
  
  console.log('Swap Committed Details Receipt', commitReceipt)

  const swapTxLink = document.querySelector(".swapTx");
  swapTxLink.href= `${txLink}${transactionIdHash}`;
  swapTxLink.style.display = "inline";

  loadPoolInformation();
}

document.getElementById('getAmount').onclick = async function () {
  let requestedToken = document.getElementById("exactSwapDropDown").value;
  let requestedAmount = document.getElementById("requestedAmount").value;

  // Sorting logic
  let [inputTokenAddress, outputTokenAddress] = requestedToken === tokenAAddress
    ? [tokenBAddress, tokenAAddress]
    : [tokenAAddress, tokenBAddress];

  // Making request to gateway
  const [inputTokenRequest, outputTokenRequest] = await Promise.all([
    stateApi.entityFungibleResourceVaultPage({
      stateEntityFungibleResourceVaultsPageRequest: {
        address: componentAddress,
        resource_address: inputTokenAddress,
      }
    }),
    stateApi.entityFungibleResourceVaultPage({
      stateEntityFungibleResourceVaultsPageRequest: {
        address: componentAddress,
        resource_address: outputTokenAddress,
      }
    })
  ]);

  console.log("Token A Request: ", inputTokenRequest);
  console.log("Token B Request: ", outputTokenRequest);

  const { amount: x } = inputTokenRequest.items[0];
  const { amount: y } = outputTokenRequest.items[0];
  const dy = requestedAmount;
  const r = (1 - swapFee) / 1;
  const dx = (dy * x) / (r * (y - dy));

  document.getElementById('requiredResource').innerText = await retrieveTokenSymbol(inputTokenAddress) + " - " + truncateMiddle(inputTokenAddress);
  document.getElementById('requiredAmount').innerText = dx;
}

document.getElementById('exactSwapToken').onclick = async function () {
  let requiredResource = document.getElementById('requiredResource').innerText;
  let requiredAmount = document.getElementById("requiredAmount").innerHTML;  

  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .callMethod(
      virtualAccountAddress,
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
      virtualAccountAddress,
      "deposit_batch", 
      [
      ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

  let transaction = await TransactionBuilder.new().then(
    (builder) =>
      builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signer1PrivateKey)
        .notarize(notaryPrivateKey)
  );
  
  let notarizedTransactionUint8Array = await transaction.compile();
  let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
  console.log(notarizedTransactionHex)
  
  await transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: notarizedTransactionHex,
    }
  })
  
  let retrieveTransactionId = await transaction.transactionId();
  let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
  console.log(transactionIdHash)
  
  // ************ Fetch component address from gateway api and set componentAddress variable **************
  let commitReceipt = await waitForCommitment(transactionIdHash);

  console.log('Exact Swap Committed Details Receipt', commitReceipt)

  const exactSwapTxLink = document.querySelector(".exactSwapTx");
  exactSwapTxLink.href= `${txLink}${transactionIdHash}`;
  exactSwapTxLink.style.display = "inline";

  loadPoolInformation();
}

document.getElementById('addLiquidity').onclick = async function () {
  let tokenAAmount = document.getElementById("tokenAAmount").value;
  let tokenBAmount = document.getElementById("tokenBAmount").value;

  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .callMethod(
      virtualAccountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(tokenAAddress),
        new ManifestAstValue.Decimal(tokenAAmount)
      ]
    )
    .callMethod(
      virtualAccountAddress,
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
      virtualAccountAddress,
      "deposit_batch",
      [
        ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

    let transaction = await TransactionBuilder.new().then(
      (builder) =>
        builder
          .header(transactionHeader)
          .manifest(manifest)
          .sign(signer1PrivateKey)
          .notarize(notaryPrivateKey)
    );
    
    let notarizedTransactionUint8Array = await transaction.compile();
    let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
    console.log(notarizedTransactionHex)
    
    await transactionApi.transactionSubmit({
      transactionSubmitRequest: {
        notarized_transaction_hex: notarizedTransactionHex,
      }
    })
    
    let retrieveTransactionId = await transaction.transactionId();
    let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
    console.log(transactionIdHash)
    
    // ************ Fetch component address from gateway api and set componentAddress variable **************
    let commitReceipt = await waitForCommitment(transactionIdHash);

    console.log('Add Liquidity Committed Details Receipt', commitReceipt)
  
    const addLiquidityTxLink = document.querySelector(".addLiquidityTx");
    addLiquidityTxLink.href= `${txLink}${transactionIdHash}`;
    addLiquidityTxLink.style.display = "inline";

    loadPoolInformation();
}


document.getElementById('removeLiquidity').onclick = async function () {
  let poolUnitsAmount = document.getElementById("poolUnitsAmount").value;

  let manifest = new ManifestBuilder()
    .callMethod(
      virtualAccountAddress,
      "lock_fee",
      [
        new ManifestAstValue.Decimal(10)
      ]
    )
    .callMethod(
      virtualAccountAddress,
      "withdraw",
      [
        new ManifestAstValue.Address(poolUnitsAddress),
        new ManifestAstValue.Decimal(poolUnitsAmount)
      ]
    )
    .takeFromWorktop(
      poolUnitsAddress,
      (builder, poolUnitBucket) =>
      builder.callMethod(
        componentAddress,
        "remove_liquidity",
        [
          poolUnitBucket
        ]
      )
    )
    .callMethod(
      virtualAccountAddress,
      "deposit_batch",
      [
        ManifestAstValue.Expression.entireWorktop()
      ]
    )
    .build();

    let transaction = await TransactionBuilder.new().then(
      (builder) =>
        builder
          .header(transactionHeader)
          .manifest(manifest)
          .sign(signer1PrivateKey)
          .notarize(notaryPrivateKey)
    );
    
    let notarizedTransactionUint8Array = await transaction.compile();
    let notarizedTransactionHex = Convert.Uint8Array.toHexString(notarizedTransactionUint8Array);
    console.log(notarizedTransactionHex)
    
    await transactionApi.transactionSubmit({
      transactionSubmitRequest: {
        notarized_transaction_hex: notarizedTransactionHex,
      }
    })
    
    let retrieveTransactionId = await transaction.transactionId();
    let transactionIdHash = Convert.Uint8Array.toHexString(retrieveTransactionId);
    
    // ************ Fetch component address from gateway api and set componentAddress variable **************
    let commitReceipt = await waitForCommitment(transactionIdHash);

    console.log('Remove Liquidity Committed Details Receipt', commitReceipt)
  
    const removeLiquidityTxLink = document.querySelector(".removeLiquidityTx");
    removeLiquidityTxLink.href= `${txLink}${transactionIdHash}`;
    removeLiquidityTxLink.style.display = "inline";

    loadPoolInformation();
}


// ****** EXTRA ******
window.onload = async function fetchData() {
  // Getway Request //
  const { items: [account] } = await stateApi.stateEntityDetails({
    stateEntityDetailsRequest: {
      addresses: [virtualAccountAddress]
    }
  });

  const fungibles = account.fungible_resources?.items ?? [];
  fungibles_metadata = await Promise.all(fungibles.map(async (fungible) => {
    const { resource_address: resourceAddress } = fungible;
    const metadata = await stateApi.entityMetadataPage({
      stateEntityMetadataPageRequest: { address: resourceAddress }
    }).catch(() => null);

    return {
      metadata: metadata?.items[1]?.value.as_string ?? "N/A",
      resource_address: resourceAddress
    };
  }));


  const select = document.createElement("select");
  const [selectTokenA, selectTokenB] = document.querySelectorAll("#selectTokenA, #selectTokenB");

  for (const { metadata, resource_address: resourceAddress } of fungibles_metadata) {
    const option = new Option(`${metadata} - ${truncateMiddle(resourceAddress)}`, resourceAddress);
    select.add(option);
    selectTokenA.add(option.cloneNode(true));
    selectTokenB.add(option.cloneNode(true));
  }
};

async function loadPoolInformation() {
  const [tokenARequest, tokenBRequest] = await Promise.all([
    stateApi.entityFungibleResourceVaultPage({
      stateEntityFungibleResourceVaultsPageRequest: {
        address: componentAddress,
        resource_address: tokenAAddress,
      },
    }),
    stateApi.entityFungibleResourceVaultPage({
      stateEntityFungibleResourceVaultsPageRequest: {
        address: componentAddress,
        resource_address: tokenBAddress,
      },
    }),
  ]);

  const [tokenA, tokenB] = [tokenARequest.items[0], tokenBRequest.items[0]];
  const tokenPair = `${fungibles_metadata[0].metadata} - ${truncateMiddle(fungibles_metadata[0].resource_address)}/${fungibles_metadata[1].metadata} - ${truncateMiddle(fungibles_metadata[1].resource_address)}`;
  const liquidity = `${tokenA.amount}/${tokenB.amount}`;

  document.getElementById("tokenPair").innerText = tokenPair;
  document.getElementById("liquidity").innerText = liquidity;
}

// Retrieves TokenPair
async function loadTokenPair() {
  const select = document.createElement("select");
  const swapDropDown = document.getElementById("swapDropDown");
  const exactSwapDropDown = document.getElementById("exactSwapDropDown");

  for (const val of fungibles_metadata.filter(val => val.resource_address === tokenAAddress || val.resource_address === tokenBAddress)) {
    const option = new Option(`${val.metadata} - ${truncateMiddle(val.resource_address)}`, val.resource_address);
    select.add(option);
    swapDropDown.add(option.cloneNode(true));
    exactSwapDropDown.add(option.cloneNode(true));
    document.getElementById(`token${val.resource_address === tokenAAddress ? 'A' : 'B'}Address`).innerText = `${val.metadata} - ${truncateMiddle(val.resource_address)}`;
  }
}

async function waitForCommitment(transactionIdHash) {
  let commitReceipt;
  while (!commitReceipt) {
    try {
      commitReceipt = await transactionApi.transactionCommittedDetails({
        transactionCommittedDetailsRequest: {
          intent_hash_hex: transactionIdHash
        }
      });
    } catch (error) {
      // If the error is not a "transaction not found" error, rethrow it
      if (!error.message.includes("Transaction not found")) {
        throw error;
      }
    }
    // Wait for a short amount of time before checking the status again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return commitReceipt;
}


function loadFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      resolve(uint8Array);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}


function truncateMiddle(str) {
  if (str.length <= 10) {
    return str;
  }

  const ellipsis = "...";
  const charsToShow = 18 - ellipsis.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  const truncatedStr = str.substr(0, frontChars) + ellipsis + str.substr(str.length - backChars);
  return truncatedStr;
}

async function retrieveTokenSymbol(resourceAddress) {
  const metadata = await stateApi.entityMetadataPage({
    stateEntityMetadataPageRequest: { address: resourceAddress }
  });
  return metadata?.items[1]?.value.as_string ?? "N/A";
}

async function retrieveCurrentEpoch() {
  const retrieveStatus = await statusApi.gatewayStatus({
  })

  let currentEpoch = currentEpoch.ledger_state.epoch;
  return currentEpoch;
}

