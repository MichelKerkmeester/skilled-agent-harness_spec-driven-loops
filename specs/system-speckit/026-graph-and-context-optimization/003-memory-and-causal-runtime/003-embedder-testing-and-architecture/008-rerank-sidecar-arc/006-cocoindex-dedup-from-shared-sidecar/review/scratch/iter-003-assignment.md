## ASSIGNED FOCUS — SECURITY PASS

Audit the security posture of the shipped changes. Open the actual files and quote file:line evidence.

1. **HTTP localhost trust boundary** — `reranker.py:221-351` HttpSidecarRerankerAdapter. The adapter makes outbound HTTP requests to `127.0.0.1:8765/rerank`. Verify:
   - Is the URL hardcoded or env-controllable? Can an attacker on the machine spoof the sidecar?
   - What's the sidecar bound interface? (Check `system-rerank-sidecar/scripts/rerank_sidecar.py` and `scripts/start.sh`.) Does it bind to 127.0.0.1 only, or 0.0.0.0?
   - Authentication: is there any token, mTLS, signature on the /rerank request?
   - On a multi-user Mac/Linux box, can a non-privileged user pose as the sidecar by binding 8765 first?

2. **Payload validation** — the sidecar accepts `query`, `candidates`, `top_k`, etc. Trace `system-rerank-sidecar/scripts/rerank_sidecar.py` for:
   - Pydantic/schema validation strictness — extra fields rejected? Type coercion safe?
   - Size limits on `candidates` array and individual chunk text — is there an upper bound that prevents OOM via large payload?
   - `top_k` bounds — can a caller pass `top_k=10**9`?

3. **Error / log info leakage** — `reranker.py:259-319` HTTP error paths record diagnostics. Check `RetrievalDiagnostics.reranker_fallback_reason`:
   - Does it include sidecar URL or other deployment-identifying info?
   - Does it include user query text, candidate paths, or any content that could leak into logs?

4. **Env-var precedence + defaults safety** — `config.py:746-769`:
   - `COCOINDEX_RERANK_VIA_SIDECAR` default `True` flip — does it affect non-cocoindex contexts (e.g. tests, CLI sub-commands)?
   - Is there any other env var that overrides the dispatch without operator awareness?
   - Does the sidecar URL come from env? If yes, can an attacker who controls the env redirect rerank traffic to a malicious server?

5. **Sidecar process lifecycle / privilege** — `cli.py:139-158` `_ensure_rerank_sidecar_for_mcp` spawns the sidecar. Verify:
   - Does it inherit the parent's full env including OPENAI_API_KEY / VOYAGE_API_KEY?
   - Is there a pidfile race condition that lets another user steal sidecar identity?
   - What's the file mode of the lease/cache files? World-readable? Per memory `feedback_solo_mac_user_posture.md`, mode 644 is INFO on solo Mac — but flag it as INFO if found, not HIGH.

6. **httpx lazy-import** — does the lazy `import httpx` inside the adapter hide a transitive dep that could be replaced via PYTHONPATH manipulation? (This is a low-severity supply chain question.)

7. **Test fixture safety** — `test_http_sidecar_adapter.py:48-83`:
   - Mock transport: does it disable real network correctly? Could a test accidentally hit the real sidecar / external host?
   - Fallback recorder: does it leak state across tests?

8. **Benchmark fixture safety** — `benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py`:
   - Does it run against a real sidecar with real model? Where does it pull the fixture from? Any path-traversal risk in the `--fixture` arg?

9. **Feature catalog + playbook claims** — do the security sections (`feature_catalog.md:170-186`) and any playbook scenarios match reality? Are there security caveats missing from the docs?

For findings:
- LOW-severity security info (e.g. file mode 644 on solo Mac per memory rule) → INFO/P2
- Real cross-user attack vectors → P1
- Auth bypass / data exfiltration / RCE → P0

Apply the 7-field claim adjudication packet to any new P1/P0.
