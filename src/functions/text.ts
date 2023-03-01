import * as venom from "venom-bot";
import User from "../db/models/User";
import { spendCredits } from "./credits";
import openai from "../ai";

const textCompletion = async (
  client: venom.Whatsapp,
  sender: venom.Message,
  message: string
) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.7,
      top_p: 1,
      max_tokens: 4000,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
      stream: false,
      user: sender.sender.id,
    });
    const found = await User.findOne({ where: { user: sender.sender.id } });
    await client.sendMessageOptions(
      sender.from,
      completion.data.choices[0].text.trim(),
      {
        quotedMessageId: sender.id,
      }
    );
    await client.sendMessageOptions(
      sender.from,
      `Você gastou ${completion.data.usage.total_tokens} créditos.`,
      {
        quotedMessageId: sender.id,
      }
    );
    await spendCredits(found, completion.data.usage.total_tokens);
  } catch (err) {
    console.log({ textCompletionErr: err?.response?.data });
    client.sendMessageOptions(sender.from, "Erro ao processar.", {
      quotedMessageId: sender.id,
    });
  }
};

export { textCompletion };
