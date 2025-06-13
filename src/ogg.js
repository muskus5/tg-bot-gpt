import axios from "axios";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConverter {
  constructor() {}
  toMo3() {}

  async create(url, filename) {
    try {
      const oggPath = resolve(__dirname, "../voices", `${filename}.ogg`);
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });
      const stream = createWriteStream(oggPath);
      response.data.pipe(stream);
      stream.on('finish', () => {})
    } catch (e) {
      console.log("Error while creating ogg", e.message);
    }
  }
}

export const ogg = new OggConverter();
