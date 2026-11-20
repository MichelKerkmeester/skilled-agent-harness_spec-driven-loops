# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-002, dimension `security`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus names the `OLLAMA_*` passthrough and the launcher liveness work as shipped behavior to check. This iteration reviewed the trust boundaries those commits opened: the launcher's child environment allowlist, the database directory pin, the prompt-embedding adapter's URL and timeout handling, and the lane's error logging. The allowlist carries no secret keys and the adapter aborts its own requests, so the two hazards I looked for first are absent. One exposure remains: the lane logs the adapter's raw error message, and that message embeds the configured base URL verbatim.

## Files Reviewed

- `.skilled/bin/system-skill-advisor-launcher.cjs:120-200,317-330,1554-1578`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:157-260`
- `.skilled/skills/system-skill-advisor/runtime/lib/embedders/adapters/ollama.ts:1-7`
- `.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:60-80,99-150,196-210,270-310` (context evidence; D4 keeps this file out of the change set)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:536-560,592-620`
- `.github/workflows/skill-advisor-stress.yml:45-52`
- `.env.example:406-410`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 from iteration 1 remains active and keeps this run at CONDITIONAL.

### P2 Findings

1. **The lane logs the adapter's raw error message, which embeds the configured base URL verbatim** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245` -- the catch block writes `console.warn(\`[semantic-shadow] Prompt embedding failed; cosine lane disabled for this call (${message})\`)`, where `message` is `error.message`. `OllamaBackendUnreachableError` builds its message as `Ollama backend unreachable at ${baseUrl}${suffix}` and `OllamaRequestTimeoutError` inherits that shape (`shared/embeddings/adapters/ollama.ts:63-77`). `resolveOllamaBaseUrl` only strips trailing slashes (`shared/embeddings/adapters/ollama.ts:118-120`), so a base URL carrying userinfo, such as a reverse proxy in front of Ollama, reaches the log intact. The structured surfaces are safe: `runtimeLaneHealth.semantic_shadow.reason` carries the fixed `prompt_embedding_unreachable` token, not the message.
   Finding class: `security`
   Scope proof: the logging call is in the declared target `.skilled/skills/system-skill-advisor`; the reach is the production branch at `semantic-shadow.ts:399` plus an operator-set `OLLAMA_BASE_URL`, which the launcher forwards (`system-skill-advisor-launcher.cjs:184`).
   Affected surface hints: daemon stdout and any launcher-captured log file, `OLLAMA_BASE_URL` operator configuration, support bundles.
   Case: an operator fronts Ollama with a reverse proxy and sets `OLLAMA_BASE_URL=http://user:secret@proxy.internal:11434`. The proxy is briefly down, the prompt embed fails, and the lane writes `Ollama backend unreachable at http://user:secret@proxy.internal:11434` to the daemon log, where a support bundle or a captured CI log carries the credential off the machine.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245`, `.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:66` | The lane's log line carries the base URL the adapter embeds in its error message. Recorded as R3-P2-001. |
| `checklist_evidence` | notApplicable | `review/deep-review-config.json` `resource_map_present: false` | Files target, no checklist to reconcile. |

## Integration Evidence

- Launcher child environment: `CHILD_ENV_ALLOWLIST` at `system-skill-advisor-launcher.cjs:120-200` is a closed list; `createChildEnv` filters on it at `system-skill-advisor-launcher.cjs:322-325`.
- `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` and `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` are allowlisted at `system-skill-advisor-launcher.cjs:184-189`.
- Adapter request bounding: `fetchWithTimeout` creates an `AbortController` and passes its signal to `fetch` (`shared/embeddings/adapters/ollama.ts:142-145`), so an abandoned embed is aborted by the adapter's own deadline.
- CI isolation: `.github/workflows/skill-advisor-stress.yml:49-50` sets `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH: 'off'` so test daemons never embed against a live local Ollama.

## Edge Cases

- **Ambiguity: whether the daemon log leaves the machine.** The exposure depends on where the launcher writes the daemon's stdout. That path was not read in this iteration, so the finding stays P2 with an explicit escalation trigger rather than being raised on assumption.
- **Scope boundary: the adapter is outside the change set.** D4 keeps `system-spec-kit/shared/embeddings` unchanged, so the adapter is cited as context evidence for what the in-scope log line carries, and no finding is filed against it.
- **Missing dependency: no test asserts the log redacts the URL.** No test in the declared target covers the log line's content. Recorded, not converted into a pass.

## Confirmed-Clean Surfaces

- The child environment allowlist carries no key, token, secret, password or credential entry; a scan of `system-skill-advisor-launcher.cjs:120-200` for those terms returns only comments about routing flags.
- The database directory pin cannot be used to widen the child environment: it writes one key, and only when the operator has not set it (`system-skill-advisor-launcher.cjs:326-328`).
- The prompt-embedding deadline does not leak unbounded in-flight requests: the adapter aborts its own fetch on its own timeout (`shared/embeddings/adapters/ollama.ts:142-145`), so an abandoned embed is bounded by `OLLAMA_QUERY_TIMEOUT_MS` or the operator override.
- The module-level `activePromptEmbedding` and `runtimeHealth` cannot interleave across concurrent recommend calls: the set, the synchronous `run()`, and the `finally` clear all execute in one microtask after the embed settles, with no await between them (`semantic-shadow.ts:236-252`).
- The CI workflow change adds no secret and only disables the background refresh (`.github/workflows/skill-advisor-stress.yml:49-50`).
- The `.env.example` addition documents `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` with its default and its off switch (`.env.example:409`).

## Ruled Out

- **The child environment allowlist leaks secrets to the daemon.** Ruled out: it is a closed allowlist with no credential-shaped key.
- **The 750 ms deadline leaves unbounded pending requests.** Ruled out: the adapter aborts its own fetch, so each abandoned request is bounded.
- **Concurrent recommend calls race on the module-level prompt embedding.** Ruled out: the set, the synchronous scoring call and the clear run in one microtask with no await between them.
- **The stress workflow exposes a secret.** Ruled out: the added line is a static `off` value.

## Next Focus

- Dimension: `traceability`
- Focus area: frontier node F-1-002, traceability dimension — the `spec_code` and `checklist_evidence` core protocols against the owning packet's decisions D1 and D2, and the `skill_agent` overlay for the advisor's own agent and command surfaces.
- Reason: F-1-002 `security` is complete; `traceability` is its next uncovered dimension and carries the two core protocols the run must record.
- Rotation status: F-1-002 `correctness` and `security` complete; F-1-005 `correctness` complete.
- Blocked/productive carry-forward: productive — reading the adapter's error constructors turned a vague logging concern into a precise, bounded finding.
- Required evidence: the owning packet's `decision-record.md` D1 and D2 text, `acceptance-criteria.md`, and the advisor's `SKILL.md` and command assets.
- Recovery note: none.

Review verdict: CONDITIONAL
