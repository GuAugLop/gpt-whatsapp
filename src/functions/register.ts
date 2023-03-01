import * as venom from "venom-bot";
import User from "../db/models/User";

const commonUser = async (client: venom.Whatsapp, sender: venom.Message) => {
  try {
    const found = await User.findOne({ where: { user: sender.sender.id } });
    if (found === null) {
      await User.create({
        user: sender.sender.id,
        tokens: 5000,
        permission: 1,
      });
      await client.sendMessageOptions(
        sender.from,
        "Usuário registrado com sucesso! 5000 créditos adicionados",
        {
          quotedMessageId: sender.id,
        }
      );
    } else {
      await client.sendMessageOptions(
        sender.from,
        "Parece que você já está cadastrado.",
        {
          quotedMessageId: sender.id,
        }
      );
    }
  } catch (err) {
    console.log({ commonUserErr: err });
    client.sendMessageOptions(sender.from, "Erro ao processar.", {
      quotedMessageId: sender.id,
    });
  }
};

export { commonUser };
