import type { Choice } from "./interaction-manager.js";
import { openInterractionManager } from "./interaction-manager.js";
import { Friend } from "../models/friend.model.js";
import { FriendsController } from "../controller/friends.controller.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import chalk from "chalk";

const options: Choice[] = [
  { label: "Add Friend", value: "1" },
  { label: "Search Friend", value: "2" },
  { label: "Update Friend", value: "3" },
  { label: "Remove Friend", value: "4" },
  { label: "Exit", value: "5" },
];

const { ask, choose, close } = openInterractionManager();
const friendsController = new FriendsController();

const printFriendsTable = (friends: Friend[]) => {
  if (!friends.length) {
    console.log("\nNo friends found.\n");
    return;
  }

  const pad = (str: string, length: number) =>
    str.length >= length ? str : str + " ".repeat(length - str.length);

  const nameWidth = Math.max(10, ...friends.map((f) => f.name.length));
  const emailWidth = Math.max(
    20,
    ...friends.map((f) => (f.email || "-").length),
  );
  const phoneWidth = Math.max(
    12,
    ...friends.map((f) => (f.phone || "-").length),
  );
  const balanceWidth = 10;

  const line =
    "+" +
    "-".repeat(4) +
    "+" +
    "-".repeat(nameWidth + 2) +
    "+" +
    "-".repeat(emailWidth + 2) +
    "+" +
    "-".repeat(phoneWidth + 2) +
    "+" +
    "-".repeat(balanceWidth + 2) +
    "+";

  console.log("\nFRIENDS LIST\n");
  console.log(line);

  console.log(
    `| ${pad("#", 2)} | ${pad("Name", nameWidth)} | ${pad("Email", emailWidth)} | ${pad("Phone", phoneWidth)} | ${pad("Balance", balanceWidth)} |`,
  );

  console.log(line);

  friends.forEach((f, i) => {
    let balanceText = "";

    if (f.balance > 0) {
      balanceText = chalk.green("+" + f.balance);
    } else if (f.balance < 0) {
      balanceText = chalk.red(String(f.balance));
    } else {
      balanceText = chalk.yellow("0");
    }

    const rawBalance = f.balance > 0 ? "+" + f.balance : String(f.balance);
    const paddedBalance =
      balanceText + " ".repeat(balanceWidth - rawBalance.length);

    console.log(
      `| ${pad(String(i + 1), 2)} | ${pad(f.name, nameWidth)} | ${pad(f.email || "-", emailWidth)} | ${pad(f.phone || "-", phoneWidth)} | ${paddedBalance} |`,
    );
  });

  console.log(line + "\n");
};

const addFriend = async () => {
  const showFriendForm = () => {
    const friendFormData = {
      name: "",
      email: "",
      phone: "",
    };

    return {
      async getValues(): Promise<void> {
        try {
          if (friendFormData.name === "") {
            friendFormData.name = (await ask("Enter friend name:")) || "";
          }
          if (friendFormData.email === "") {
            friendFormData.email =
              (await ask("Enter friend email (optional):", {
                validator: (v) => {
                  if (!v) return true;
                  return v.includes("@") && v.includes(".");
                },
              })) || "";
          }
          if (friendFormData.phone === "") {
            friendFormData.phone =
              (await ask("Enter friend phone (optional, 10 digits):", {
                validator: (v) => {
                  if (!v) return true;
                  return v.length === 10 && !isNaN(Number(v));
                },
              })) || "";
          }
          const balanceInput = await ask(
            "Enter opening balance (optional, default 0):",
            {
              validator: (v) => {
                if (!v) return true;
                return !isNaN(Number(v));
              },
            },
          );
          const balance = balanceInput ? Number(balanceInput) : 0;
          const res = friendsController.addFriend({
            id: Date.now().toString(),
            name: friendFormData.name,
            email: friendFormData.email,
            phone: friendFormData.phone,
            balance: balance,
          });
          console.log(res.message);
        } catch (error: unknown) {
          if (error instanceof ConflictError) {
            console.log(error.message);
            for (let key of error.conflictProperty) {
              friendFormData[key as keyof typeof friendFormData] = "";
            }
            return await showFriendForm().getValues();
          } else {
            console.log("Something went wrong:", error);
          }
        }
      },
    };
  };
  const form = showFriendForm();
  await form.getValues();
};
const searchFriend = async () => {
  const query = await ask("Enter name to search:");
  const result = friendsController.searchFriend(query || "");
  if (!result.success || !result.data) {
    console.log(result.message);
    return;
  }
  printFriendsTable(result.data.friends);
};

const updateFriend = async () => {
  const query = await ask("Enter name to update:");
  if (!query) return;
  const result = friendsController.searchFriend(query);
  if (!result.success || !result.data || result.data.friends.length === 0) {
    console.log("No matching friends found.");
    return;
  }
  const friend = result.data.friends[0];
  if (!friend) return;
  console.log(`Updating: ${friend.name}`);
  const fieldChoice = await choose(
    "What do you want to update?",
    [
      { label: "Name", value: "1" },
      { label: "Email", value: "2" },
      { label: "Phone", value: "3" },
      { label: "Balance", value: "4" },
    ],
    false,
  );
  let updatedData: Partial<Friend> = {};
  switch (fieldChoice!.value) {
    case "1": {
      const name = await ask("Enter new name:");
      if (name) updatedData.name = name;
      break;
    }
    case "2": {
      const email = await ask("Enter new email (optional):", {
        validator: (v) => {
          if (!v) return true;
          return v.includes("@") && v.includes(".");
        },
      });
      if (email) updatedData.email = email;
      break;
    }
    case "3": {
      const phone = await ask("Enter new phone (optional):", {
        validator: (v) => {
          if (!v) return true;
          return v.length === 10 && !isNaN(Number(v));
        },
      });
      if (phone) updatedData.phone = phone;
      break;
    }
    case "4": {
      const balanceInput = await ask("Enter new balance:", {
        validator: (v) => !isNaN(Number(v)),
      });
      updatedData.balance = Number(balanceInput);
      break;
    }
  }
  const res = await friendsController.updateFriend(friend.id, updatedData);
  console.log(res.message);
};
const deleteFriend = async () => {
  const query = await ask("Enter name to remove:");
  if (!query) return;

  const result = friendsController.searchFriend(query);
  if (!result.success || !result.data || result.data.friends.length === 0) {
    console.log("No matching friends found.");
    return;
  }

  const friend = result.data.friends[0];
  if (!friend) return;
  console.log("Friend found:");
  printFriendsTable([friend]);

  const confirm = await ask(
    "Are you sure you want to delete this friend? (yes/no):",
    {
      validator: (v) => {
        const val = v.toLowerCase();
        return val === "yes" || val === "no";
      },
    },
  );

  if (confirm?.toLowerCase() === "yes") {
    const res = await friendsController.deleteFriend(friend.id);
    console.log(res.message);
  } else {
    console.log("Deletion cancelled.");
  }
};
export const manageFriends = async () => {
  while (true) {
    const choice = await choose("What do you want to do?", options, false);
    switch (choice!.value) {
      case "1":
        console.log("Adding friend...");
        await addFriend();
        break;
      case "2":
        console.log("Searching friend...");
        await searchFriend();
        break;
      case "3":
        console.log("Updating friend...");
        await updateFriend();
        break;
      case "4":
        console.log("Removing friend...");
        await deleteFriend();
        break;
      case "5":
        console.log("Exiting...");
        close();
        return;
    }
  }
};
