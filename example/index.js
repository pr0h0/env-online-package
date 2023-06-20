const RemoteEnv = require("../src");

(async () => {
  try {
    const env = new RemoteEnv("API_KEY");

    {
      // fetch environment from server and save to local object
      const { error, message } = await env.fetchEnvironment();
      if (error) {
        // handle error and display message
      }
    }

    // apply environment to live app at startup
    env.applyLive(() => {
      // callback after environment applied
      app.listen(process.env.PORT); // start server or something else
    });

    {
      // or save environment to file
      const { error, message } = await env.saveToFile(".env.example");
      if (error) {
        // handle error and display message
      }
    }

    {
      // handle saving to file or apply to live app by yourself

      // get environment as object
      const { name, values } = env.getJson();
      // or key=value\n string
      const envString = env.getRaw();
    }
  } catch (error) {
    console.error(error);
  }
})();
