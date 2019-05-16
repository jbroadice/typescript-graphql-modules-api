import db from "./db";
import createApp from "./app";

const app = createApp({ db });

require("dotenv").config();

const port = process.env.PORT || 4000;
const host = process.env.HOSTNAME || "0.0.0.0";

// Launch Node.js server
const server = app.listen({ port, host }, () => {
  console.log(`🚀 Server ready at http://${host}:${port}/`);
});

// Shutdown Node.js app gracefully
function handleExit(options, err) {
  console.log("handleExit", { options, err });
  if (options.cleanup) {
    const actions: (() => void)[] = [() => server.close, () => db.destroy];

    actions.forEach((close, i) => {
      console.log("close", close);
      try {
        close();
        if (i === actions.length - 1) process.exit();
      } catch (err) {
        if (i === actions.length - 1) process.exit();
      }
    });
  }
  if (err) console.error(err);
  if (options.exit) process.exit();
}

// TODO: Test with process.once

process.on("exit", handleExit.bind(null, { cleanup: true }));

["SIGINT", "SIGTERM", "SIGHUP", "uncaughtException"].forEach(
  (signal: NodeJS.Signals) => {
    process.on(signal, handleExit.bind(null, { exit: true }));
  },
);
