# Iteration 4: L8/L7 verification — model-server-constants parity test, isolation doctrine enforcement

## Focus

Verify the L8 parity test (the one assertion that replaced two "must stay byte-identical" comments) reads both declaration sites and that the declarations still match; then re-check the L7 recorded decision (advisor half-isolation) for new evidence against its justification.

## Findings

| # | path:line | Claimed | Observed | Severity | Recommendation |
|---|-----------|---------|----------|----------|----------------|
| R4-01 | `shared/embeddings/model-server-constants.test.ts` | "asserts the socket directory and the owner-lease file name equal across packages" | The test reads both named sites (hf-local.ts `DEFAULT_MODEL_SERVER_SOCKET_DIR` + `ADVISOR_OWNER_LEASE_FILE_NAME`; supervision.cjs `DEFAULT_MODEL_SERVER_SOCKET_DIR`; launcher.cjs `OWNER_LEASE_FILE_NAME`) — **but the socket FILE name is a third constant declared in three places (hf-local.ts:35 `SOCKET_FILE_NAME='hf-embed.sock'`, `bin/hf-model-server.cjs:26`, `bin/lib/model-server-supervision.cjs:37` `HF_MODEL_SERVER_SOCKET_FILE_NAME`) and none is asserted**. Values are equal today (verified: all three = 'hf-embed.sock') — the L8 fix is one assertion short of its own goal ("a drift here would make the client wait on a socket nobody binds, silently" applies to the file name too). | P2 | merge: add the file-name equality to the parity test |
| R4-02 | `hf-local.ts:42,49` vs `model-server-supervision.cjs:42` vs `system-skill-advisor-launcher.cjs:88` | Constants equal | All four values equal: dir '/tmp/system-hf-embed' (both sides), lease '.skill-advisor-owner.json' (both sides) — the L8 fix landed as scoped. | P2 (verified-positive) | (none) |
| R4-03 | `.github/workflows/` (whole dir) + `mcp-server/lib/shared/unicode-normalization.ts:8` | Round-one claim: the duplicated unicode module is "CI-watched" | No workflow in `.github/workflows/` references the duplication or enforces it (only routing-registry-drift.yml touches the advisor, and it compiles the skill graph). The doctrine's only enforcement is the header comment "Do NOT add new imports from system-spec-kit here". This corrects round one's F5.5 justification detail; the L7 decision (advisor's maintainers own the boundary) stands — no new evidence overturns it. | P2 | document: the isolation doctrine is comment-enforced, not CI-enforced |
| R4-04 | `mcp-server/package.json` `scripts.build` | Advisor build | `"build": "npm --prefix ../../system-spec-kit/shared run build && …tsc"` — the advisor's build **rebuilds the shared package** as a side effect. The advisor is the one consumer tree that both installs and builds its dependency; in a stale-dist worktree its build would regenerate the shared dist. Wiring note (round-one L6 territory; observed, not executed). | P2 | document: the shared build is driven by the advisor build |
| R4-05 | `embedders/` layer | — | Adapter chain observed: `mcp-server/lib/embedders/adapter.ts` re-exports `@spec-kit/shared/embeddings/adapter.js`; `adapters/ollama.ts` re-exports the shared ollama adapter; `schema.ts` holds 4 specifier imports. The advisor still has three local mirror files beside the shared copies (adapter, adapters/ollama, types) — mirror-strata continue inside the isolation boundary. | P2 (informational) | document |

## Ruled out this iteration

- Re-list of the L7 row (no new evidence against the decision; R4-03 corrects a justification detail instead).
- dist-derived and spec-folder hits for the "isolation" search.

## Sources Consulted

- `shared/embeddings/model-server-constants.test.ts` (full), `hf-local.ts:35,40-49,271`, `bin/lib/model-server-supervision.cjs:37-43,500-501`, `bin/system-skill-advisor-launcher.cjs:88,359,408`, `bin/hf-model-server.cjs:26,126-137`
- `.github/workflows/` listing + grep for isolation/unicode/skill-advisor
- `mcp-server/lib/shared/` listing (head), `unicode-normalization.ts:4-8`
- `mcp-server/package.json` scripts; advisor production `@spec-kit/shared` import census (16 statements in 11 files)

## Assessment

- newInfoRatio: 0.8 — R4-01 (file-name constant unasserted), R4-03 (CI-watched corrected to comment-enforced), R4-04 (advisor rebuilds shared) are new; R4-02/R4-05 verify.
- Confidence: high (direct reads; the unexecuted caveat applies only to parity-test runtime behavior).

## Reflection

- Worked: treating the parity test's own rationale sentence as the acceptance frame — "a drift here would make the client wait on a socket nobody binds" — immediately exposed the unasserted file-name constant, which the L8 row never promised to cover but which the test's own goal covers.
- Failed: none.
- Ruled out: the isolation "CI" search noise (test names containing 'isolation').

## Recommended Next Focus

Iteration 5 (job 2, angle A): the embeddings subsystem's live termination post-009 — trace the advisor daemon chain (embedders/schema.ts → factory → which providers), the model-server launcher's chain (bin/hf-model-server.cjs → hf-local client), and classify every remaining embeddings module as live / internal-only / orphan, with the adapters layer's real role re-derived (not from README).
