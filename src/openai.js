import OpenAI from "openai"; // Используем SDK от OpenAI
import config from "config";
import { createReadStream } from "fs";

class OpenAIWrapper {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
    SYSTEM: "system",
  };

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1", // указание OpenRouter как базового URL
      defaultHeaders: {
        "HTTP-Referer": "http://localhost", // или тот домен, который указал в профиле
      },
    });
  }

  async chat(messages) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo-0613",
        messages,
        max_tokens: 500,
      });
      return response.choices?.[0]?.message;
    } catch (e) {
      console.log("Error while gpt chat", e.message);
      return null;
    }
  }

  async transcription(filepath) {
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: createReadStream(filepath),
        model: "whisper-1",
      });
      return response.text;
    } catch (e) {
      console.log("Error while transcription", e.message);
    }
  }
}

export const openai = new OpenAIWrapper(config.get("OPENAI_KEY"));
