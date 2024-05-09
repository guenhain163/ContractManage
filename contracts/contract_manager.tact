import "@stdlib/deploy";
import "@stdlib/ownable";

// **Data Types:**

// **Structs:**
/**
  Phonebook is a person or an organization which is part of the group expense.
 */
struct Phonebook {
  walletAddress: Address;
	name: String;
}

/**
  Expense is cost incurred which will be pay back.
  Expense has an impact on the balance for payer and payee only if payee give its agreement.
 */
struct Expense {
  title: String;
  amount: Int as coins;
  valueDate: Int as uint32; 
  creationDate: Int as uint32;
  payer: Address;
  payees: map<Int, Address>;
  agreements: map<Address, Bool>;
}

/**
  Payment is money transfer from one phonebook to another.
	Payment can be use to settle a debt or a credit.
 */
struct Payment {
  title: String;
  amount: Int as coins;
  valueDate: Int as uint32;
  payer: Address;
  payee: Address; 
  recipient: Address; // New field to store the recipient address
}

struct PhonebookList {
  list: map<Int, Phonebook>;
  length: Int as uint64 = 0;
}

// **Messages:**
message PhonebookCreate {
  walletAddress: Address;
	name: String;
	// balance: Int as coins;
}

message StatusChange {
  phonebookId: Int as uint64;
  isValid: Bool;
}

message Withdraw {
  amount: Int as coins;
	name: String;
}

message VerifyPhonebook {
  walletAddress: Address;  // Address to be verified
}

contract ContractManager with Deployable {
  seqno: Int as uint64;
  phonebooks: PhonebookList;
	myWalletAddress: Address;
  const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years

  init(myWalletAddress: Address, seqno: Int) {
    self.myWalletAddress = myWalletAddress;
    self.seqno = seqno;
    self.phonebooks = PhonebookList{list: emptyMap()};
  }

	receive(msg: Withdraw) {
    let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);
    require(amount > 0, "Insufficient balance");
    send(SendParameters{
      to: sender(),
      bounce: true,
      value: amount,
      mode: SendRemainingValue + SendIgnoreErrors
    });
  }

	receive(msg: PhonebookCreate) {
		let length: Int =  self.phonebooks.length + 1;

    let phonebook: Phonebook = Phonebook {
  		walletAddress: msg.walletAddress,
			name: msg.name
    };

    self.phonebooks.list.set(length, phonebook);
    self.phonebooks.length = length;
  }

  // receive(msg: StatusChange) {
  //   let phonebook: Phonebook = self.phonebooks.list.get(msg.phonebookId)!!;
  //   phonebook.isValid = msg.isValid;
  //   self.phonebooks.list.set(msg.phonebookId, null);
  // 	self.phonebooks.list.set(msg.phonebookId, phonebook);
  // }

  get fun listPhonebook(): PhonebookList {
    return self.phonebooks;
  }

	// get fun onePhonebookById(phonebookId: Int): Phonebook {
  //   let phonebook: Phonebook = self.phonebooks.list.get(phonebookId)!!;
  //   return phonebook;
  // }

	get fun balance(): Int {
    return myBalance();
  }

	// get fun balance(): Int {
  //   return myBalance();
  // }
	
	get fun phonebook(waddress: Address): Phonebook?  {
  	// Iterate through the map of phonebooks
		let phonebookId: Int = 1;
		while (phonebookId <= self.phonebooks.length) {
			phonebookId = phonebookId + 1;
			let phonebook: Phonebook = self.phonebooks.list.get(phonebookId)!!; // Added semicolon

			// Check if the phonebook's walletAddress matches the provided one
			if (phonebook.walletAddress == waddress) {
				return phonebook; // Phonebook found
			}
		}

  	// If no matching phonebook is found, return false
  	return null;
	}
}
