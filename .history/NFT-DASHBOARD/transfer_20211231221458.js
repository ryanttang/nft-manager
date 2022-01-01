Moralis.start({ 
    serverUrl: "https://pwvzkiyfgwnr.usemoralis.com:2053/server", 
    appId: "koDEVeLGyCArEZw0ff2RAtoE42SDoMLtBMWsdWiN" });

const CONTRACT_ADDRESS = "0xdd50d32fc6e5896f5b590f193dc4f984996254ae";
let web3;


async function init(){
    let currentUser = Moralis.User.current();
    if(!currentUser) {
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.Web3.enable();


    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
    // console.log(nftId);
}

async function transfer(){
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value)

    // sending 15 tokens with token id = 1
    const options = {
        type: "erc1155",  
        receiver: address,
        contractAddress: CONTRACT_ADDRESS,
        tokenId: tokenId,
        amount: amount}
    let result = await Moralis.transfer(options);
    console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

init();