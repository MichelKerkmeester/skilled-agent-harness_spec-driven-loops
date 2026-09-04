import assert from "node:assert/strict";
import test from "node:test";
import { createEmbeddingModel } from "../../dist/engine/models/factory.js";

const REFERENCE = "ollama/nomic-embed-text-v1.5";
const skip =
  process.env.ZVEC_GREP_LIVE_OLLAMA === "1"
    ? false
    : "set ZVEC_GREP_LIVE_OLLAMA=1 and run an Ollama server to enable";

test(
  "a running Ollama server embeds text with the catalog dimension",
  { skip },
  async () => {
    const model = createEmbeddingModel(REFERENCE);
    try {
      const stages = [];
      const documents = await model.embed(
        [
          { kind: "text", text: "the authentication service validates tokens" },
          { kind: "text", text: "the scheduler retries failed jobs" },
        ],
        { onProgress: (progress) => stages.push(progress.stage) },
      );

      assert.equal(documents.vectors.length, 2);
      for (const embedded of documents.vectors) {
        assert.equal(embedded.length, 768);
        assert.ok(embedded.every((value) => Number.isFinite(value)));
        assert.ok(embedded.some((value) => value !== 0));
      }
      assert.deepEqual(stages, ["preparing", "ready"]);

      const queries = await model.embed(
        [{ kind: "text", text: "the authentication service validates tokens" }],
        { purpose: "query" },
      );
      assert.equal(queries.vectors[0].length, 768);

      // The purpose prefix has to reach the server, so the same text embedded as
      // a query cannot land on the document vector.
      assert.notDeepEqual(queries.vectors[0], documents.vectors[0]);
    } finally {
      await model.dispose();
    }
  },
);
