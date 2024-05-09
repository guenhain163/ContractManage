import "@stdlib/deploy";
import "@stdlib/ownable";

// **Data Types:**

// **Structs:**
/**
  Participant is a person or an organization which is part of the group expense.
 */
struct Participant {
  walletAddress: Address;
	name: String;
	// balance: Int as coins;
	isValid: Bool;
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
  Payment is money transfer from one participant to another.
	Payment can be use to settle a debt or a credit.
 */
struct Payment {
  title: String;
  amount: Int as coins;
  valueDate: Int as uint32;
  payer: Address;
  payee: Address;
}

struct ParticipantList {
  list: map<Int, Participant>;
  length: Int as uint64 = 0;
}

// **Messages:**
message ParticipantCreate {
  walletAddress: Address;
	name: String;
	// balance: Int as coins;
}

message StatusChange {
  participantId: Int as uint64;
  isValid: Bool;
}

message Withdraw {
  amount: Int as coins;
	name: String;
}

contract ContractManager with Deployable {
  seqno: Int as uint64;
  participants: ParticipantList;
	const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years

  init(seqno: Int) {
    self.seqno = seqno;
    self.participants = ParticipantList{list: emptyMap()};
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

	receive(msg: ParticipantCreate) {
		let length: Int =  self.participants.length + 1;

    let participant: Participant = Participant {
  		walletAddress: msg.walletAddress,
			name: msg.name,
			// balance: msg.balance,
			isValid: true
    };

    self.participants.list.set(length, participant);
    self.participants.length = length;
  }

  // receive(msg: StatusChange) {
  //   let participant: Participant = self.participants.list.get(msg.participantId)!!;
  //   participant.isValid = msg.isValid;
  //   self.participants.list.set(msg.participantId, null);
  // 	self.participants.list.set(msg.participantId, participant);
  // }

  get fun listParticipant(): ParticipantList {
    return self.participants;
  }

	// get fun oneParticipantById(participantId: Int): Participant {
  //   let participant: Participant = self.participants.list.get(participantId)!!;
  //   return participant;
  // }

	get fun balance(): Int {
    return myBalance();
  }

	// get fun balance(): Int {
  //   return myBalance();
  // }
	
	get fun participant(waddress: Address): Participant?  {
  	// Iterate through the map of participants
		let participantId: Int = 1;
		while (participantId <= self.participants.length) {
			participantId = participantId + 1;
			let participant: Participant = self.participants.list.get(participantId)!!; // Added semicolon

			// Check if the participant's walletAddress matches the provided one
			if (participant.walletAddress == waddress) {
				return participant; // Participant found
			}
		}

  	// If no matching participant is found, return false
  	return null;
	}
}
