import bodyParser from "body-parser";
import express from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

// Initialize an in-memory store for registered nodes
let nodeRegistry: Node[] = [];

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  _registry.get("/status", (req, res) => {
    res.send('live');
  });

  // Route to register a node
  _registry.post("/registerNode", (req: express.Request, res: express.Response) => {
    const { nodeId, pubKey }: RegisterNodeBody = req.body;

    // Check if the node is already registered
    const isAlreadyRegistered = nodeRegistry.some(node => node.nodeId === nodeId);
    if (!isAlreadyRegistered) {
      nodeRegistry.push({ nodeId, pubKey });
      console.log(`Node ${nodeId} registered with public key: ${pubKey}`);
      res.status(200).send(`Node ${nodeId} registered successfully.`);
    } else {
      console.log(`Node ${nodeId} is already registered.`);
      res.status(409).send(`Node ${nodeId} is already registered.`);
    }
  });
  
  _registry.get("/getNodeRegistry", (req, res) => {
    res.json({ nodes: nodeRegistry });
  });

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`Registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
