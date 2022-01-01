Moralis.start({ 
    serverUrl: "https://pwvzkiyfgwnr.usemoralis.com:2053/server", 
    appId: "koDEVeLGyCArEZw0ff2RAtoE42SDoMLtBMWsdWiN" });

const CONTRACT_ADDRESS = "0x86190b7eaa6a5020f8db423c86534faac0536267";
const TOKEN_URL = ""
let currentUser; 

function fetchNFTMetadata(NFTs) {
    
    let promises = [];

    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        // Call Moralis Cloud function > Static JSON file
        promises.push(fetch("https://pwvzkiyfgwnr.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=koDEVeLGyCArEZw0ff2RAtoE42SDoMLtBMWsdWiN&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = { address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby" }; 
            return Moralis.Web3API.token.getTokenIdOwners(options)
        })
        .then( (res) => {
            nft.owners = []
            res.result.forEach(element => {
                nft.owners.push(element.owner_of);
        });
        return nft;
        // {console.log(res)}))
        // .then( () => {return nft;}))
        // .then(res => console.log(res))
    }))
}
    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        console.log(nft);
        let htmlString = `
        <div class="card">
            <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nft.metadata.name}</h5>
                <p class="card-text">${nft.metadata.description}</p>
                <p class="card-text">Tokens in Circulation: ${nft.amount}</p>
                <p class="card-text">Number of Owners: ${nft.owners.length}</p>
                <p class="card-text">Your Balance: ${ownerData[nft.token_id]}</p>
                <a href="./mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
                <a href="./transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
            </div>
        </div>
        `
        let col = document.createElement("div");
        col.className = "col col-md-4"
        col.innerHTML = htmlString;
        parent.appendChild(col)
    }
}

async function getOwnerData(){
    let accounts = currentUser.get("accounts");
    const options = { chain: 'rinkeby', address: accounts[0], token_address: CONTRACT_ADDRESS };
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce( (object, currentElement) => {
            return object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {})
        console.log(result);
        return result;
    })
}

async function initializeApp(){
    currentUser = Moralis.User.current();
    if(!currentUser) {
        // SIGN iN
        currentUser = await Moralis.Web3.authenticate();
    }
    
    const options = { address: CONTRACT_ADDRESS, chain: "rinkeby" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();
    // fetchNFTMetadata(NFTs.result);
    // console.log(NFTWithMetadata);
    renderInventory(NFTWithMetadata, ownerData)
}

initializeApp();
