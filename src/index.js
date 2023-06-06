const fs = require("fs");
const https = require("https");

const URL = "https://remotenv.online/api/fetch";

class RemoteEnv {
  constructor(API_KEY) {
    if (!API_KEY) {
      throw new Error("API_KEY is required");
    }

    this.#API_KEY = API_KEY;
    this.#data = null;
  }

  #data = null;
  #API_KEY = null;

  async fetchEnvs() {
    const url = `${URL}?API_KEY=${this.#API_KEY}`;
    try {
      const res = await this.#get(url);
      if (res.error) throw new Error(res.msg);
      this.#data = res?.data;
      return {
        error: false,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }

  async #get(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => resolve(JSON.parse(data)));
        })
        .on("error", (err) => reject(err));
    });
  }

  getJson() {
    return { values: [...this.#data.values], name: this.#data.name };
  }

  getRaw() {
    const { values: json } = this.getJson();

    return json.map(({ name, value }) => `${name}=${value}`).join("\n");
  }

  applyLive(cb) {
    const { values: json } = this.getJson();
    json.forEach(({ name, value }) => {
      process.env[name] = value;
    });
    if (cb) cb();
  }

  saveToFile(path) {
    try {
      const _path =
        path || `${process.cwd()}/.env.${this.#data.name?.toLowerCase()}`;
      if (fs.existsSync(_path)) {
        fs.unlinkSync(_path);
      }
      fs.writeFileSync(_path, this.getRaw(), { encoding: "utf-8" });
      return {
        error: false,
      };
    } catch (error) {
      console.error("error", error);
      return {
        error: true,
        message: error.message,
      };
    }
  }
}

module.exports = RemoteEnv;
