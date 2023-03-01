import * as venom from "venom-bot";
import "./db/config";
import User from "./db/models/User";
import functions from "./functions/invoke";

type Commands =
  | "!help"
  | "!register"
  | "!text"
  | "!img"
  | "!credits"
  | "!addCredits";

const commands = [
  "!help",
  "!register",
  "!text",
  "!img",
  "!credits",
  "!addCredits",
];

venom
  .create({
    session: "ia-wpp",
    multidevice: true,
  })
  .then((client) => start(client))
  .catch((err) => console.log(err));

const start = (client: venom.Whatsapp) => {
  try {
    client.onMessage(async (sender: venom.Message) => {
      try {
        console.log(sender.body);
        if (typeof sender.body !== "string") {
          return;
        }
        // Separando mensagem do token
        const splitMessage: string[] = sender.body.split(" ");
        const key: Commands = splitMessage[0] as Commands;

        splitMessage.splice(0, 1);
        const message = splitMessage.join(" ");
        if (commands.includes(key)) {
          const foundUser = await User.findOne({
            where: { user: sender.sender.id },
          });

          if (functions[key].input && !message) {
            return;
          }
          if (!functions[key].permission) {
            functions[key].invoke(client, sender, message);
            return;
          }
          if (functions[key].permission !== 0 && !foundUser) {
            client.sendMessageOptions(
              sender.from,
              "Você não está cadastrado, use o comando *!help* para começar",
              {
                quotedMessageId: sender.id,
              }
            );
            return;
          }
          if (foundUser["permission"] < functions[key].permission) {
            client.sendMessageOptions(
              sender.from,
              "Parece que você não tem permissão para usar esse comando.",
              {
                quotedMessageId: sender.id,
              }
            );
            return;
          }
          if (foundUser["permissions"] > 2) {
            functions[key].invoke(client, sender, message);
            return;
          }
          if (foundUser["tokens"] <= 0) {
            client.sendMessageOptions(
              sender.from,
              "Parece que seus créditos para teste acabaram. 😞",
              {
                quotedMessageId: sender.id,
              }
            );
            return;
          }

          functions[key].invoke(client, sender, message);
        }
      } catch (err) {
        console.log({ startErr: err });
        if (typeof err === "string") {
          client.sendMessageOptions(sender.from, err, {
            quotedMessageId: sender.id,
          });
        } else {
          client.sendMessageOptions(sender.from, "Erro ao processar", {
            quotedMessageId: sender.id,
          });
        }
      }
    });
  } catch (err) {
    console.log({ err });
  }
};
