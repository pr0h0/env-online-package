const fs = require("fs");
const https = require("https");

const URL = "https://remotenv.online/api/fetch";

/**
 * @typedef {Object} RemoteEnvData
 * @property {string} name - Environment name
 * @property {Array<{name: string, value: string}>} values - Environment values
 */

/**
 * @typedef {Object} RemoteEnvError
 * @property {boolean} error - Error status
 * @property {string} message - Error message
 */

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

  /**
   * @returns {Promise<RemoteEnvError>}
   */
  async fetchEnvironment() {
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

  /**
   * @returns {RemoteEnvData}
   */
  getJson() {
    return { values: [...this.#data.values], name: this.#data.name };
  }

  /**
   * @returns {string} - key=value\n string
   */
  getRaw() {
    const { values } = this.getJson();

    return values.map(({ name, value }) => `${name}=${value}`).join("\n");
  }

  /**
   * @param {Function} cb - Callback after environment applied
   * @returns {void}
   */
  applyLive(cb) {
    const { values: json } = this.getJson();
    json.forEach(({ name, value }) => {
      process.env[name] = value;
    });
    if (cb && typeof cb === "function") cb();
  }

  /**
   * @param {string} path - Path to save file
   * @returns {Promise<RemoteEnvError>}
   */
  async saveToFile(path) {
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
