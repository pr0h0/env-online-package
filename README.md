# remote-env

####Fetch env variables from the online repository

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

1. First register on [remotenv](https://remotenv.online)
2. Then create a new collection, that will represent your app
3. Then create a new environment and fill it with all variables
4. After that create new API key and use it to fetch all other keys

####Example usage

    const RemoteEnv = require('remotenv');
    const env = new RemoteEnv(REMOTE_ENV_API_KEY);

Fetch remote variables to local object, if there is error, message will contain error message

    const { error, message } = env.fetchEnvs();

You can use applyLive and store them to process.env and pass calback? to be executed after that

    env.applyLive(() => app.listen(process.env.PORT, ...));

Or you can store them to file and use them later with dotenv.config().
Default filename is .env.name (where name is name of the environment on website)

    const { error } = env.saveToFile(filename);

#####Also there are two methods available if you want to do it manually

Returns json object with all variables

    env.getJson();

Returns raw string with all variables  key=value\n...

    env.getRaw();

####Example usage with dotenv

      const RemoteEnv = require('remotenv');
      const dotenv = require('dotenv');
      const env = new RemoteEnv(REMOTE_ENV_API_KEY);

      const { error, message } = env.saveToFile('.env.environment');
      // handle error

      dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
>
now you can use process.env to access environmental variables as usual

> All contributions are welcome


