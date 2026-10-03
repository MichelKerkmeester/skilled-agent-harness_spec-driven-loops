# Reproduction: research run open bypasses the gateway

1. The init step's config row (sessionId nested under `lineage`) sent through `append-mode-event.cjs --mode research` in a temp dir:
   `{"ok":false,"phase":"runtime","reason":"Legacy deep-research record refused: stable-identity-missing","code":"RUNTIME_ERROR"}` exit 1.
2. The same row with a top-level `sessionId` added: exit 0, receipt `event_type: deep-research.ledger.run-initialized`, sequence 1, `projectionRefreshed: true`; the state log's first row is the projection's config row.
3. Direct-written config row (what the step does today), then one gateway iteration append:
   `{"ok":false,"phase":"projection","reason":"Projection replace would drop keys from the existing config row","code":"PROJECTION_FAILED",...}` exit 2.

Verdict: holds, and in a stronger form than reported: the row as written cannot pass the gateway at all, and a direct-written row makes the first later gateway append fail with exit 2.
