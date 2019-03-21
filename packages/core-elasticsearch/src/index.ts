import { Container } from "@arkecosystem/core-interfaces";
import { client } from "./client";
import { defaults } from "./defaults";
import { watchIndices } from "./indices";
import { startServer } from "./server";

export const plugin: Container.PluginDescriptor = {
    pkg: require("../package.json"),
    defaults,
    alias: "elasticsearch",
    async register(_, options) {
        if (typeof options.client !== "object" || typeof options.chunkSize !== "number") {
            throw new Error("Elasticsearch plugin config invalid");
        }

        await client.setUp(options.client);

        await watchIndices(options.chunkSize);

        return startServer(options.server);
    },
    async deregister(container: Container.IContainer) {
        return container.resolvePlugin("elasticsearch").stop();
    },
};
