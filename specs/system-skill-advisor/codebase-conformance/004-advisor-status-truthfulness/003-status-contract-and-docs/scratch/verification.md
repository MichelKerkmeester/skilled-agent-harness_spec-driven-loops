# Verification

## Trusted refusal (see trusted-refusal.log)

Both mutating commands refuse untrusted calls with exit 64 and the message the pages now quote.

## Embeddings health, live

Server up, through the CLI and daemon on the rebuilt dist: `node .skilled/bin/skill-advisor.cjs advisor_status --json "{\"workspaceRoot\":\"$PWD\",\"includeEmbeddingsHealth\":true}" --format json` (exit 0):

```
{"provider":{"state":"resolved","requestedProvider":"hf-local","effectiveProvider":"hf-local","fallbackReason":null,"dimensionChanged":false,"reason":"Local fallback provider"},"modelServer":{"state":"reachable","target":"/tmp/system-skill-advisor/hf-embed.sock","serverState":"ready","model":"nomic-ai/nomic-embed-text-v1.5","dim":768,"device":"cpu","loadTimeMs":498,"loadStartedAt":"2026-10-03T07:12:20.763Z","loadProgressAt":"2026-10-03T07:12:21.122Z","lastSuccessfulEmbedAt":null,"inFlight":0,"queueDepth":0,"error":null}}
```

Server down (target socket absent), through the built handler with `HF_EMBED_SERVER_URL=/tmp/p2-absent-hf.sock` (exit 0):

```
live {"state":"unavailable","target":"/tmp/p2-absent-hf.sock","errorClass":"unreachable","error":"connect ENOENT /tmp/p2-absent-hf.sock"}
```

A first call made while the model server was respawning answered `{"state":"unavailable","errorClass":"bad_response","error":"Health endpoint returned HTTP 503"}`, and an early build rejected the live payload because the server reports timestamps as epoch milliseconds; the probe now converts them to ISO strings, pinned by a test that replays the observed payload.

Plain call: `handleAdvisorStatus({ workspaceRoot })` carries no `embeddingsHealth` key (printed `plain has embeddingsHealth: false`).
