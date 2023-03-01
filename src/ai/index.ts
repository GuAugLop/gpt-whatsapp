import { Configuration, OpenAIApi } from "openai";
import config from "../config";

const configuration = new Configuration({
  apiKey: config.api_key,
});
export default new OpenAIApi(configuration);