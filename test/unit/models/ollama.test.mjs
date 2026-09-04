import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { getEmbeddingModelCatalogEntry } from "../../../dist/engine/models/catalog.js";
import { OllamaEmbeddingModel } from "../../../dist/engine/models/backends/ollama.js";

function entry(overrides = {}) {
  return {
    backend: "ollama",
    reference: "ollama/test-embed",
    provider: "ollama",
    model: "test-embed",
    tag: "test-embed:v1",
    dimension: 3,
    metric: "cosine",
    queryPrefix: "search_query: ",
    documentPrefix: "search_document: ",
    maxInputTokens: 2048,
    maxBatchSize: 16,
    ...overrides,
  };
}

function vector(dimension, value = 0.25) {
  return Array(dimension).fill(value);
}

async function startServer(handler) {
  const requests = [];
  const sockets = new Set();
  const server = createServer((request, response) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      const record = {
        method: request.method,
        path: request.url,
        body: raw.length > 0 ? JSON.parse(raw) : undefined,
      };
      requests.push(record);
      handler(record, response);
    });
  });
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    endpoint: `http://127.0.0.1:${port}`,
    requests,
    async close() {
      // A cancelled request leaves its socket open, and close() would wait
      // for it.
      for (const socket of sockets) {
        socket.destroy();
      }
      await new Promise((resolve) => server.close(resolve));
    },
  };
}

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

async function unusedEndpoint() {
  const server = await startServer(() => {});
  const { endpoint } = server;
  await server.close();
  return endpoint;
}

test("Ollama model batches one request and applies the purpose prefix", async () => {
  const server = await startServer((request, response) => {
    sendJson(response, 200, {
      model: "test-embed:v1",
      embeddings: request.body.input.map((_, index) => vector(3, index + 1)),
    });
  });

  try {
    const model = new OllamaEmbeddingModel(entry(), {
      endpoint: `${server.endpoint}/`,
    });
    const stages = [];
    const documents = await model.embed(
      [
        { kind: "text", text: "first" },
        { kind: "text", text: "second" },
      ],
      { onProgress: (progress) => stages.push(progress.stage) },
    );

    assert.deepEqual(documents.vectors, [vector(3, 1), vector(3, 2)]);
    assert.deepEqual(documents.truncated, []);
    assert.deepEqual(stages, ["preparing", "ready"]);
    assert.equal(server.requests.length, 1);
    assert.equal(server.requests[0].method, "POST");
    assert.equal(server.requests[0].path, "/api/embed");
    assert.deepEqual(server.requests[0].body, {
      model: "test-embed:v1",
      input: ["search_document: first", "search_document: second"],
    });

    await model.embed([{ kind: "text", text: "third" }], {
      purpose: "query",
      onProgress: (progress) => stages.push(progress.stage),
    });
    assert.deepEqual(server.requests[1].body.input, ["search_query: third"]);
    assert.deepEqual(stages, ["preparing", "ready"]);

    await model.dispose();
  } finally {
    await server.close();
  }
});

test("Ollama model omits a prefix the catalog entry does not define", async () => {
  const server = await startServer((request, response) => {
    sendJson(response, 200, {
      embeddings: request.body.input.map(() => vector(3)),
    });
  });

  try {
    const model = new OllamaEmbeddingModel(
      entry({ queryPrefix: undefined, documentPrefix: undefined }),
      { endpoint: server.endpoint },
    );
    await model.embed([{ kind: "text", text: "plain" }]);
    await model.embed([{ kind: "text", text: "plain" }], { purpose: "query" });

    assert.deepEqual(server.requests[0].body.input, ["plain"]);
    assert.deepEqual(server.requests[1].body.input, ["plain"]);
  } finally {
    await server.close();
  }
});

test("Ollama model fails closed when the served dimension differs", async () => {
  const server = await startServer((request, response) => {
    sendJson(response, 200, {
      embeddings: request.body.input.map(() => vector(8)),
    });
  });

  try {
    const model = new OllamaEmbeddingModel(entry(), {
      endpoint: server.endpoint,
    });
    await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
      code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_DIMENSION_MISMATCH",
      message: /unexpected vector dimension/,
    });
  } finally {
    await server.close();
  }
});

test("Ollama model rejects malformed and mismatched responses", async () => {
  let reply = () => {};
  const server = await startServer((request, response) => reply(response));

  try {
    const model = new OllamaEmbeddingModel(entry(), {
      endpoint: server.endpoint,
    });

    reply = (response) => sendJson(response, 200, { model: "test-embed:v1" });
    await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
      code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_MISSING_EMBEDDINGS",
    });

    reply = (response) => {
      response.writeHead(200, { "content-type": "application/json" });
      response.end("not json");
    };
    await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
      code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_INVALID_JSON",
    });

    reply = (response) => sendJson(response, 200, { embeddings: [] });
    await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
      code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_VECTOR_COUNT_MISMATCH",
    });

    reply = (response) => sendJson(response, 200, { embeddings: ["nope"] });
    await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
      code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_INVALID_VECTOR",
    });

    reply = (response) =>
      sendJson(response, 500, { error: "server is out of memory" });
    await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
      code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_API_ERROR",
      context: /status=500 serverMessage=server is out of memory/,
    });
  } finally {
    await server.close();
  }
});

test("Ollama model reports an unpulled model instead of retrying", async () => {
  const server = await startServer((request, response) => {
    sendJson(response, 404, {
      error: 'model "test-embed:v1" not found, try pulling it first',
    });
  });

  try {
    const model = new OllamaEmbeddingModel(entry(), {
      endpoint: server.endpoint,
    });
    await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
      code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_MODEL_NOT_FOUND",
      context: /ollama pull test-embed:v1/,
    });
    assert.deepEqual(
      server.requests.map((request) => request.path),
      ["/api/embed"],
    );
  } finally {
    await server.close();
  }
});

test("Ollama model falls back to the single-input path when the batch route is absent", async () => {
  const server = await startServer((request, response) => {
    if (request.path === "/api/embed") {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("404 page not found");
      return;
    }
    sendJson(response, 200, {
      embedding: vector(3, request.body.prompt.length),
    });
  });

  try {
    const model = new OllamaEmbeddingModel(entry(), {
      endpoint: server.endpoint,
    });
    const result = await model.embed([
      { kind: "text", text: "ab" },
      { kind: "text", text: "cde" },
    ]);

    assert.deepEqual(result.vectors, [
      vector(3, "search_document: ab".length),
      vector(3, "search_document: cde".length),
    ]);
    assert.deepEqual(
      server.requests.map((request) => request.path),
      ["/api/embed", "/api/embeddings", "/api/embeddings"],
    );

    // The fallback sticks, so a later batch skips the absent route.
    await model.embed([{ kind: "text", text: "fg" }]);
    assert.deepEqual(
      server.requests.map((request) => request.path),
      ["/api/embed", "/api/embeddings", "/api/embeddings", "/api/embeddings"],
    );
  } finally {
    await server.close();
  }
});

test("Ollama model surfaces the caller's abort reason", async () => {
  const server = await startServer(() => {});

  try {
    const model = new OllamaEmbeddingModel(entry(), {
      endpoint: server.endpoint,
    });
    const controller = new AbortController();
    const cancelled = assert.rejects(
      model.embed([{ kind: "text", text: "first" }], {
        signal: controller.signal,
      }),
      /stop embedding/,
    );
    controller.abort(new Error("stop embedding"));
    await cancelled;
  } finally {
    await server.close();
  }
});

test("Ollama model reports an unreachable server with an actionable hint", async () => {
  const endpoint = await unusedEndpoint();
  const model = new OllamaEmbeddingModel(entry(), { endpoint });

  await assert.rejects(model.embed([{ kind: "text", text: "first" }]), {
    code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_CONNECTION_FAILED",
    message: /unreachable/,
    context: /ollama serve/,
  });
});

test("Ollama endpoint resolution follows options, then environment, then the default", async () => {
  const previous = {
    ZVEC_GREP_OLLAMA_URL: process.env.ZVEC_GREP_OLLAMA_URL,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  };
  const restore = () => {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  };

  try {
    delete process.env.ZVEC_GREP_OLLAMA_URL;
    delete process.env.OLLAMA_BASE_URL;
    assert.equal(
      new OllamaEmbeddingModel(entry(), {}).info.endpoint,
      "http://127.0.0.1:11434",
    );

    process.env.OLLAMA_BASE_URL = "http://base.test:1234";
    assert.equal(
      new OllamaEmbeddingModel(entry(), {}).info.endpoint,
      "http://base.test:1234",
    );

    process.env.ZVEC_GREP_OLLAMA_URL = "http://zvec.test:4321/";
    assert.equal(
      new OllamaEmbeddingModel(entry(), {}).info.endpoint,
      "http://zvec.test:4321",
    );

    assert.equal(
      new OllamaEmbeddingModel(entry(), { endpoint: " http://opt.test:9 " })
        .info.endpoint,
      "http://opt.test:9",
    );

    assert.throws(
      () => new OllamaEmbeddingModel(entry(), { endpoint: "ftp://host/path" }),
      { code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_INVALID_ENDPOINT" },
    );
    assert.throws(
      () => new OllamaEmbeddingModel(entry(), { endpoint: "not a url" }),
      { code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_INVALID_ENDPOINT" },
    );
  } finally {
    restore();
  }
});

test("Ollama catalog entries expose their server tag and pinned context", () => {
  const nomic = getEmbeddingModelCatalogEntry("ollama/nomic-embed-text-v1.5");
  assert.equal(nomic.tag, "nomic-embed-text:v1.5");
  assert.equal(nomic.model, "nomic-embed-text-v1.5");
  assert.equal(nomic.dimension, 768);
  assert.equal(nomic.queryPrefix, "search_query: ");
  assert.equal(nomic.documentPrefix, "search_document: ");

  for (const reference of [
    "ollama/nomic-embed-text-v1.5",
    "ollama/mxbai-embed-large",
    "ollama/bge-m3",
  ]) {
    const catalogEntry = getEmbeddingModelCatalogEntry(reference);
    // An index manifest stores provider and model, then rebuilds the reference
    // from them, so the slug has to survive that round trip.
    assert.equal(
      `${catalogEntry.provider}/${catalogEntry.model}`,
      catalogEntry.reference,
    );
  }
});
