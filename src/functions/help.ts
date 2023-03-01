import { Message, Whatsapp } from "venom-bot";

const help = async (client: Whatsapp, sender: Message) => {
  try {
    await client.sendMessageOptions(
      sender.from,
      `
    *!register* - Para se cadastrar e utilizar a IA.
    
    *!credits* - Para visualizar quantos créditos já foram usados.
    
    *!text [Texto aqui]* - Para receber respostas em textos da IA sobre qualquer assunto. (Ex.: !text um artigo autoral sobre a seguna guerra mundial) 
    
    *!img [Texto aqui]* - A IA retornará uma imagem 512x512, quanto mais detalhado melhor o resultado. (Alguns inputs podem não ser processados por filtros de segurança implementado na IA.)
        `,
      {
        quotedMessageId: sender.id,
      }
    );
  } catch (err) {
    client.sendMessageOptions(sender.from, "Erro ao processar.", {
      quotedMessageId: sender.id,
    });
  }
};

export { help };
