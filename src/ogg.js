import axios from "axios";
import { createWriteStream } from "fs";

class OggConverter {
  constructor() {}
  toMo3() {}

  async create(url, filename) {
    try {
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });
      const stream = createWriteStream();
    } catch (e) {
      console.log("Error while creating ogg", e.message);
    }
  }
}

export const ogg = new OggConverter();
