import { Model } from "sequelize";
import { Message, Whatsapp } from "venom-bot";
import User from "../db/models/User";

const getMyCredits = async (client: Whatsapp, sender: Message) => {
  try {
    const user = await User.findOne({ where: { user: sender.sender.id } });
    await client.sendMessageOptions(
      sender.from,
      `Você possui ${user["tokens"]} créditos disponívels`,
      {
        quotedMessageId: sender.id,
      }
    );
  } catch (err) {
    console.log({ getMyCreditsErr: err });
    client.sendMessageOptions(sender.from, "Erro ao processar.", {
      quotedMessageId: sender.id,
    });
  }
};

const spendCredits = async (model: Model<any, any>, tokens: number) => {
  try {
    model["tokens"] -= tokens;
    return await model.save();
  } catch (err) {
    console.log({ addTokens: err });
  }
};

const addCredits = async (client: Whatsapp, sender: Message) => {
  try {
    let [key, credits, user] = sender.body.split(" ");

    if (!key || !user || !credits) {
      return;
    }
    if (user[0] !== "@") {
      return;
    }
  
    if (Number.isNaN(parseInt(credits))) {
      return;
    }
    user = user.replace("@", "");
    const found = await User.findOne({ where: { user: user + "@c.us" } });
    if (!found) {
      client.sendMessageOptions(sender.from, "Usuário não encontrado", {
        quotedMessageId: sender.id,
      });
      return;
    }
    found["tokens"] += parseInt(credits);
    await found.save();
    client.sendMessageOptions(sender.from, "Os créditos foram adicionados", {
      quotedMessageId: sender.id,
    });
  } catch (err) {
    if (typeof err === "string") {
      client.sendMessageOptions(sender.from, err, {
        quotedMessageId: sender.id,
      });
    } else {
      client.sendMessageOptions(sender.from, "Erro ao processar.", {
        quotedMessageId: sender.id,
      });
    }
  }
};

export { getMyCredits, spendCredits, addCredits };
