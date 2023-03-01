import * as venom from "venom-bot";
import openai from "../ai";
import User from "../db/models/User";
import { spendCredits } from "./credits";
import { translate } from "free-translate";
import axios from "axios";

const imgGenerate = async (
  client: venom.Whatsapp,
  sender: venom.Message,
  message: string
) => {
  try {
    /*     const image = await openai.createImage({
      prompt: message,
      response_format: "url",
      size: "512x512",
      n: 1,
      user: sender.sender.id,
    }); */
    message = await translate(message, { to: "en" });
    const image = await axios.get(
      "https://tti.photoleapapp.com/api/v1/generate?prompt=" + message
    );
    const found = await User.findOne({ where: { user: sender.sender.id } });
    await client.sendImage(
      sender.from,
      image.data.result_url,
      undefined,
      "Você gastou 100 créditos com essa imagem."
    );
    await spendCredits(found, 100);
  } catch (err) {
    console.log({ imgGenerateErr: err });
    client.sendMessageOptions(sender.from, "Erro ao processar.", {
      quotedMessageId: sender.id,
    });
  }
};

const imgVariation = (client: venom.Whatsapp, sender: venom.Message) => {
  const buffer = Buffer.from(sender.body);
  //openai.createImageVariation()
};

export { imgGenerate };
