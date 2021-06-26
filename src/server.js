require("@babel/register");
const app = require("./app");

const setUpExpress = () => {
  const port = process.env.APP_PORT || 3000;

  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });

  // In case of an error
  app.on("error", (appErr, appCtx) => {
    console.error("app error", appErr.stack);
    console.error("on url", appCtx.req.url);
    console.error("with headers", appCtx.req.headers);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection shutting down");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("SIGTERM", () => {
    console.log("Sigterm received. Shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  });
};

setUpExpress();
