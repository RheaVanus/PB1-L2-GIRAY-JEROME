// Grab every element once up front so we don't query the Data Object Model repeatedly
const boxName = document.getElementById("boxName");       // name-entry section
const names = document.getElementById("names");           // name input field
const signBtn = document.getElementById("signBtn");       // "continue" button
const boxPost = document.getElementById("boxPost");       // posting section (hidden until signed in)
const uName = document.getElementById("uName");           // displays the current user's name
const captioning = document.getElementById("captioning"); // post text input
const postBtn = document.getElementById("postBtn");       // "post" button
const thread = document.getElementById("thread");         // container where posts appear

// State of the user which is in this line, there is no user
let currentUser = "";

// This is the key used for AES encryption. 
const secret_key = "angHulingElBimboSaIlalimNgPuno";

// Step 1: save the user's name 
function nameSave(){
    const name = names.value.trim(); // again, trim() so a name of only spaces counts as empty 

    // Stops here if nothing was entered then return to the typing of name again
    if (name == ""){
        alert("Please input a name before continuing");
        return;
    }

    currentUser = name; //the value of current user depends on the value of name which it will get from const names
    uName.textContent = currentUser; // show the name in the posting section

    // Swap screens once the login is successful hide the name box, reveal the posting box
    boxName.hidden = true;
    boxPost.hidden = false;
    captioning.focus(); // put the cursor in the post field so they can type right away
}

// ---------- Step 2: create a post ----------
function addPosts(){
    const caption = captioning.value.trim();

    // Don't allow empty posts
    if(caption === ""){
        alert("You havent't typed anything, try again");
        return;
    }

    const date = new Date().toLocaleString(); // timestamp in the user's local format

    // Group the post details into one JSON string so they can be encrypted together
    const plainsData = JSON.stringify({
        name: currentUser,
        post: caption,
        date: date
    });

    // This is the encryption of the JSON with AES then convert the result to a readable string using toString()
    const encrypted = CryptoJS.AES.encrypt(plainsData, secret_key).toString();

    // This part build the post card using the document.createElement
    const post = document.createElement("article");
    post.className = "cards post";

    // This is the header row where the author name + date is placed
    const meta = document.createElement("div");
    meta.className = "meta";
    const who = document.createElement("strong");
    who.textContent = currentUser;
    const when = document.createElement("span");
    when.textContent = date;
    meta.append(who, when);

    // This section shows the original post, the one which is not encrypted
    const origimalLabel = document.createElement("p");
    origimalLabel.className = "label";
    origimalLabel.textContent = "Original Post";
    const origText = document.createElement("p");
    origText.className = "original";
    origText.textContent = caption;

    // This section shows the encrypted version of the post
    const encLabel = document.createElement("p");
    encLabel.className = "label";
    encLabel.textContent = "ENCRYPTED";
    const cryptText = document.createElement("p");
    cryptText.className = "encrypted";
    cryptText.textContent = encrypted;

    // It compiles all the pieces of createdElement into the card in display order
    post.append(meta, origimalLabel, origText, encLabel, cryptText);

    // prepend() puts the newest post at the top of the thread
    thread.prepend(post);
}

//Event listeners 
signBtn.addEventListener("click", nameSave);

// It lets the user press Enter in the name field instead of clicking the button
names.addEventListener("keydown", function(e){
    if(e.key === "Enter") nameSave();
});

postBtn.addEventListener("click", addPosts);