# remotenv

#### Fetch env variables from the online repository

Switch your **\.env** file from

    NODE_ENV=development
    PORT=3000
    API_KEY1=...
    API_KEY2=...
    ...
    API_KEY99=...

To

    REMOTE_ENV_API_KEY=...

and let this package do rest for you

1. First register on [remotenv](https://www.remotenv.online)
2. Then create a new collection, that will represent your app
3. Then create a new environment and fill it with all variables
4. After that create a new API key and use it to fetch all other keys

#### Example usage

    const RemoteEnv = require('remotenv');
    const env = new RemoteEnv(REMOTE_ENV_API_KEY);

Fetch remote variables to a local object, if there is an error, a message will contain an error message

    const { error, message } = await env.fetchEnvs();

You can use applyLive and store them to process.env and pass [callback] to be executed after that

    env.applyLive(() => app.listen(process.env.PORT, ...));

Or you can store them to file and use them later with dotenv.config().
The default filename is .env.name (where name is the name of the environment on the website)

    const { error, message } = await env.saveToFile(filename);

Also, there are two methods available if you want to do it manually

Returns JSON object with all variables

    const { name, values } = env.getJson();

Returns a raw string with all variables key=value\n...

    const values = env.getRaw();

#### Example usage with dotenv

      const RemoteEnv = require('remotenv');
      const env = new RemoteEnv(REMOTE_ENV_API_KEY);

      // handle if any error
      const { error, message } = await env.fetchEnvs();

      await env.saveToFile('.env.example');

      // later in your app
      const dotenv = require('dotenv');
      dotenv.config({ path: '.env.example' });

> Now you can use process.env to access environmental variables as usual

> All contributions are welcome
> Currently there is only npm package, if you make package for diferent language, let me know to list you here

> Contact at: [contact@remotenv.online](mailto:contact@remotenv.online)
