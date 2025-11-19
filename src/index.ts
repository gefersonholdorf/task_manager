import { env } from "./env";
import { app } from "./server";

const port = env.PORT;

app.listen({ port, host: "0.0.0.0" }).then(() => {
	console.log(`Application running on port ${port}!`);
});
