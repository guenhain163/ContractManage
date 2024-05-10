import "@stdlib/deploy";
import "./jetton";

// **Data Types:**

// **Structs:**
/**
  Phonebook is a person or an organization which is part of the group expense.
 */
// struct Phonebook {
//   walletAddress: Address;
// 	name: String;
// }

// struct PhonebookList {
//   list: map<Int, Phonebook>;
//   length: Int as uint64 = 0;
// }

// // **Messages:**
// message PhonebookCreate {
//   walletAddress: Address;
// 	name: String;
// }

// message StatusChange {
//   phonebookId: Int as uint64;
//   isValid: Bool;
// }

message TransferContact {
  amount: Int as coins;
	receiver: String;
}

message TransferWallet {
  amount: Int as coins;
	receiver: Address;
}

contract ContractManager with Jetton, Deployable {
  seqno: Int as uint64;
  // phonebooks: PhonebookList;
	owner: Address;
  // content: Cell;

  init(owner: Address, seqno: Int) {
    self.owner = owner;
    // self.content = content;
    self.seqno = seqno;
    // self.phonebooks = PhonebookList{list: emptyMap()};
  }

  receive() {
    dump("empty message received");
  }

  receive(msg: TransferWallet) {
    let ctx: Context = context();
    require(ctx.sender == self.owner, "Not owner");

    // Check if message has required fields (assuming Transfer message has receiver and amount)
    require(msg.receiver != null && msg.amount > 0, "Missing receiver or amount");

    // Assuming mint function takes recipient address, amount, and optional source 
    self.transferCoin(msg.receiver, msg.amount, self.owner);
  }

	// receive(msg: TransferContact) {
  //   let ctx: Context = context();
  //   require(ctx.sender == self.owner, "Not owner");

  //   // Check if message has required fields (assuming Transfer message has receiver and amount)
  //   require(msg.receiver != null && msg.amount > 0, "Missing receiver or amount");

  //   let phonebook: Phonebook? = self.byName(msg.receiver);
  //   require(phonebook == null, "Receiver not found");

  //   // Assuming mint function takes recipient address, amount, and optional source 
  //   self.transferCoin((phonebook!!).walletAddress, msg.amount, self.owner);
  // }

	// receive(msg: PhonebookCreate) {
	// 	let length: Int =  self.phonebooks.length + 1;

  //   let phonebook: Phonebook = Phonebook {
  // 		walletAddress: msg.walletAddress,
	// 		name: msg.name
  //   };

  //   self.phonebooks.list.set(length, phonebook);
  //   self.phonebooks.length = length;
  // }

  // receive(msg: StatusChange) {
  //   let phonebook: Phonebook = self.phonebooks.list.get(msg.phonebookId)!!;
  //   phonebook.isValid = msg.isValid;
  //   self.phonebooks.list.set(msg.phonebookId, null);
  // 	self.phonebooks.list.set(msg.phonebookId, phonebook);
  // }

  // get fun listPhonebook(): PhonebookList {
  //   return self.phonebooks;
  // }

	// get fun onePhonebookById(phonebookId: Int): Phonebook {
  //   let phonebook: Phonebook = self.phonebooks.list.get(phonebookId)!!;
  //   return phonebook;
  // }

	get fun balance(): String {
    return myBalance().toCoinsString();
  }

  // fun byName(name: String): Phonebook?  {
  // 	// Iterate through the map of phonebooks
	// 	let phonebookId: Int = 1;
	// 	while (phonebookId <= self.phonebooks.length) {
	// 		phonebookId = phonebookId + 1;
	// 		let phonebook: Phonebook = self.phonebooks.list.get(phonebookId)!!; // Added semicolon

	// 		// Check if the phonebook's walletAddress matches the provided one
	// 		if (phonebook.name == name) {
	// 			return phonebook; // Phonebook found
	// 		}
	// 	}

  // 	// If no matching phonebook is found, return false
  // 	return null;
	// }

	// get fun phonebook(waddress: Address): Phonebook?  {
  // 	// Iterate through the map of phonebooks
	// 	let phonebookId: Int = 1;
	// 	while (phonebookId <= self.phonebooks.length) {
	// 		phonebookId = phonebookId + 1;
	// 		let phonebook: Phonebook = self.phonebooks.list.get(phonebookId)!!; // Added semicolon

	// 		// Check if the phonebook's walletAddress matches the provided one
	// 		if (phonebook.walletAddress == waddress) {
	// 			return phonebook; // Phonebook found
	// 		}
	// 	}

  // 	// If no matching phonebook is found, return false
  // 	return null;
	// }
}
