import { Message, Whatsapp } from "venom-bot";
import { addCredits, getMyCredits } from "./credits";
import { help } from "./help";
import { imgGenerate } from "./img";
import { commonUser } from "./register";
import { textCompletion } from "./text";

const commands = ["!help", "!register", "!text", "!img", "!credits"];

export default {
  "!help": {
    invoke: (client: Whatsapp, sender: Message) => help(client, sender),
    permission: 0,
    input: false,
  },

  "!register": {
    invoke: (client: Whatsapp, sender: Message) => commonUser(client, sender),
    permission: 0,
    input: false,
  },

  "!text": {
    invoke: (client: Whatsapp, sender: Message, message: string) =>
      textCompletion(client, sender, message),
    permission: 1,
    input: true,
  },

  "!img": {
    invoke: (client: Whatsapp, sender: Message, message: string) =>
      imgGenerate(client, sender, message),
    permission: 1,
    input: true,
  },

  "!credits": {
    invoke: (client: Whatsapp, sender: Message) => getMyCredits(client, sender),
    permission: 1,
    input: false,
  },

  "!addCredits": {
    invoke: (client: Whatsapp, sender: Message) => addCredits(client, sender),
    permission: 2,
    input: true,
  },
};
