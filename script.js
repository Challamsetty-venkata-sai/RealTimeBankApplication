'use strict';

const inputLoginPin = document.querySelector('.login__input--pin');
const inputLoginUsername = document.querySelector('.login__input--user');
const btnLogin = document.querySelector('.login__btn');
const labelWelcome = document.querySelector('.welcome');
const containerApp = document.querySelector('.app');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const containertransactions = document.querySelector('.transactions');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const btnSort = document.querySelector('.btn--sort');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const btnTransfer = document.querySelector('.form__btn--transfer');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const btnLoan = document.querySelector('.form__btn--loan');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const btnClose = document.querySelector('.form__btn--close');
let currentAccount;


// PreDefined Users and Their Details
const account1 = {
  username:'ps',
  AccountHolderName: 'Purna Sai',
  transactions: [300, 450, -200, 2000, -650, -230, 80, 1400],
  interestRate: 1.4,
  pin: 1111,
};

const account2 = {
  username:'ms',
  AccountHolderName: 'Mohan Sai',
  transactions: [9000, 3800, -250, -890, -3110, -1100, 9500, -90],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  username:'js',
  AccountHolderName: 'Jeevan Sai',
  transactions: [200, -200, 340, -700, -10, 50, 700, -560],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  username:'ar',
  AccountHolderName: 'Abhi Ram',
  transactions: [430, 1000, -700, 500, 190,100000,-5000],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  username:'vs',
  AccountHolderName: 'Venkata Sai',
  transactions: [4437, -1000, 7700, 950, 790,880,10000,9999,],
  interestRate: 1.2,
  pin: 5555,
};



const accounts = [account1, account2, account3, account4,account5]

// Displaying Date
function displayDate(){
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  labelDate.textContent= `${day}/${month}/${year}`;
}


// Displaying Balance
function displayBalance(transactions){
  const balance=transactions.reduce((acc,transaction)=>acc+transaction,0);
  
  labelBalance.textContent=`${balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}₹`;

}


// Displaying Transactions
function displayTransactions(transactions,sort=false){
    containertransactions.innerHTML = '';
    const movs = sort ? transactions.slice().sort((a, b) => a - b) : transactions;
    movs.forEach(function (transaction, i) {
    const type = transaction > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">${i+1} ${ type}</div>
        <div class="transactions__value">${(Math.abs(transaction)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}₹</div>
      </div>
    `;

    containertransactions.insertAdjacentHTML('afterbegin', html);
  });
}


// Displaying Summary
function displaySummary(currentAccount){
  const incoming=currentAccount.transactions.filter(transaction=> transaction > 0 ).reduce((acc,eachtransaction)=>acc+eachtransaction,0);
  labelSumIn.textContent=`${incoming}₹`;
   
  const outgoing=currentAccount.transactions.filter(transaction=>transaction < 0).reduce((acc,eachtransaction)=>acc+eachtransaction,0)
  labelSumOut.textContent=`${outgoing}₹`;

  const interest = currentAccount.transactions.filter(transaction => transaction > 0).map(deposit => (deposit * currentAccount.interestRate) / 100).filter((int, i, arr) => {return int >= 1; }).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
}


// Sort Button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currentAccount.transactions, !sorted);
  sorted = !sorted;
});


function simple(content){
  labelWelcome.textContent=`${content}`;
    inputTransferTo.value=inputTransferAmount.value='';
    setTimeout(function(){
      labelWelcome.textContent=`Welcome back, ${currentAccount.AccountHolderName}`;
    },5000)  
}

 

//Timer function
 function timer(){
  setTimeout(function(){
    containerApp.style.opacity=0;
    labelWelcome.textContent='Session Timed Out....!'
    setTimeout(function(){
       labelWelcome.textContent='Log in to get started'
    },5000)
  },60000*3)
 }


// update interface
function updateInterface(currentAccount){
 // Displaying Balance
 displayBalance(currentAccount.transactions);

 // Displaying Transactions
 displayTransactions(currentAccount.transactions)  
 
 //Displaying Summary
 displaySummary(currentAccount);

 //DisplayingDate
 displayDate()

 //Timer of 10mins
 timer()
}


// loging in button
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
     currentAccount = accounts.find(
    acc => acc.username === (inputLoginUsername.value).toLowerCase()
  );
  if(currentAccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back, ${currentAccount.AccountHolderName}`;
    labelWelcome.style.color='black'
    containerApp.style.opacity=100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateInterface(currentAccount);
  }
  else{
    labelWelcome.textContent="User Not Found..! :( ";
    labelWelcome.style.color='red';
    setTimeout(function(){
      labelWelcome.textContent="Log in to get started"
    labelWelcome.style.color='Whitesmoke'
    },5000);
    inputLoginUsername.value = inputLoginPin.value = '';
  }
})


//  Transfer Amount functionality
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const usrname=accounts.find( acc=>acc.username===inputTransferTo.value)
  const evaluate=usrname.username===currentAccount.username;
  if(usrname && !evaluate){
    usrname.transactions.push(Number(inputTransferAmount.value))
    currentAccount.transactions.push(Number(inputTransferAmount.value)*-1);
    updateInterface(currentAccount);
    inputTransferTo.value=inputTransferAmount.value='';
  }
  else{
    if(evaluate){
        simple('You cannot Transfer to your Own Account')
    }
    else{
      simple("User Not Found....! :(")
    }
  }  
})


// Loan Amount
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
 if(Number(inputLoanAmount.value)>0){
  currentAccount.transactions.push(Number(inputLoanAmount.value));
  updateInterface(currentAccount);
  inputLoanAmount.value='';
 }
})

//Close Account
btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
    let i=accounts.findIndex(acc=>acc.username===currentAccount.username)
    accounts.splice(i,1);
    containerApp.style.opacity=0;
    labelWelcome.textContent='Log in to get started'
  }else{
    labelWelcome.textContent="The Credentials Entered were Incorrect";
    labelWelcome.style.color='red'
    setTimeout(function(){
      labelWelcome.textContent=`Welcome back, ${currentAccount.AccountHolderName}`;
    },5000)
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

