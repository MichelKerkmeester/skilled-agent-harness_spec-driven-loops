# Iteration 008: Maintainability (second pass)

## Dispatcher

- Iteration 8 of 10, derived from 7 prior `type:"iteration"` records in the state log; matches the dispatch.
- Dimension: maintainability, second pass. Iteration 4 covered the residue tool's module shape and allowlist. This pass covers what the removal left behind in the advisor runtime, the launcher, the env reader table and the test guards.
- The strategy's Next Focus also asked for explicit `spec_code` and `checklist_evidence` result rows. Both are recorded below.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:87-97,560-566,594-599`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:259-283,1122-1124`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:238-241`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:103,298-346,403-416,1123`
- `.skilled/bin/system-skill-advisor-launcher.cjs:285-295`
- `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:172-186`
- `.skilled/hooks/shared/env-aliases.cjs` (one-line comment diff)
- `.skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:20-24`
- `.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:28-46`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:110-125,290-293`
- `024-ollama-lane-removal/00*/acceptance-criteria.md` (Status column of every AC row); `005-shared-embeddings-package/acceptance-criteria.md:67`
- Diff stat of 46 advisor, launcher and shared files against merge base `bf6806ad4b3` (147 insertions, 6874 deletions)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The carry-forward set is unchanged: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001, R7-P2-001.

## Traceability Checks

- `spec_code`: pass. The code removes what 005 says it removes. 005 says the launcher "no longer forwards `MEMORY_DB_PATH` or `HF_EMBED_SERVER_URL`" (`005-shared-embeddings-package/implementation-summary.md:52`). `createChildEnv` filters through `CHILD_ENV_ALLOWLIST` and adds only the pid, the DB dir and the IPC dir (`.skilled/bin/system-skill-advisor-launcher.cjs:285-299`). A regression test pins all three retired keys out of the child env (`launcher-bootstrap.vitest.ts:172-186`). The env reader table lost its provider, Ollama, HF, OpenAI, Voyage and cascade rows, and dropped `MEMORY_DB_PATH` from the database row (`env-reader-table.mjs:20-24`). The residue tool lists `MEMORY_DB_PATH` as a lane-only dotenv key (`sweep-lane-residue.mjs:290-293`).
- `checklist_evidence`: partial. Every AC row across the eight phases is `Met` except one: `005-shared-embeddings-package/acceptance-criteria.md:67`, AC-014 (the `npm ci` reinstall and the `node_modules` absence check), which is `Unmet`. That is the same gap R3-P2-002 already records, so it adds no new finding. The other phases count Met/total as 001 8/8, 002 14/14, 003 13/13, 004 11/11, 006 14/14, 007 9/9, 008 22/22, and 005 14/15.

## Integration Evidence

- Launcher to daemon child env: `.skilled/bin/system-skill-advisor-launcher.cjs:285` (`createChildEnv`), covered by `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:172`.
- Recommend handler to scorer: `advisor-recommend.ts:564` passes `runtimeLaneHealth`. Only `graph_causal` produces it (`:87-97`), and `fusion.ts:259-283` consumes it.

## Edge Cases

- Dispatch dimension versus strategy Next Focus: the dispatch names maintainability, while the strategy suggested a third correctness pass or a core-protocol synthesis. The dispatch dimension was followed, and the two core-protocol rows were recorded in the same pass, so both asks are met.
- `MEMORY_DB_PATH` lives on in tests outside the declared scope. `runtime/cli/tests/test-integration.vitest.ts:82` and `auto-detection-fixes.vitest.ts:29` still set it, though its only production readers (the shared embeddings factory and the launcher forwarder) are gone at the tip. Isolation still holds, because `vitest-setup.ts` forces a scratch `SPEC_KIT_DB_DIR` that the spawned children inherit. Neither file is in the review scope, so this is recorded as context, not as a finding.
- The DB `SCHEMA_VERSION` went from 1 to 2 (`skill-graph-db.ts:103`; it was `:151` at the merge base). `getStats()` reports it as `schemaVersion` (`:1123`), so that output field now reads 2. It is the same constant the field always reported, so the change is intended and was not raised.

## Confirmed-Clean Surfaces

- `runtimeLaneHealth` is not dead code left over from the semantic lane. It survives with one real producer (`graph_causal` on a stale graph) and a schema (`advisor-tool-schemas.ts:238-241`).
- `skill-graph-db.ts`: the discard-and-rebuild path replaces the per-table migration code. Comments state the durable why (derived state only) and carry no ephemeral ids.
- `env-aliases.cjs`: the only change is a comment edit that drops `hf-embed`.
- `vitest-setup.ts`: the comments say on purpose why the guard on the retired `MEMORY_DB_PATH` stays.

## Ruled Out

- Dead `runtimeLaneHealth` plumbing after the lane removal: ruled out (`advisor-recommend.ts:87-97`, `fusion.ts:259-283`).
- A DB schema-version regression that would keep a pre-removal database with `vec_metadata` tables: ruled out (merge base `SCHEMA_VERSION = 1`, tip `= 2`; `readOutdatedSchemaVersion` condemns `< 2`, `skill-graph-db.ts:298-311`).
- Launcher still forwarding retired env keys: ruled out (allowlist filter at `:286-288`, plus the test at `launcher-bootstrap.vitest.ts:172-186`).

## Next Focus

- Dimension: correctness (third pass) or security (third pass).
- Focus area: the cleanup tool's `.env` rewrite path for `LANE_ENV_KEYS` (`sweep-lane-residue.mjs:290`), meaning comment and quoting preservation and a key that appears twice. Also whether removing `MEMORY_DB_PATH` from an operator `.env` can hurt any tool outside the lane.
- Reason: every dimension has had at least two passes. The dotenv rewrite is the one destructive path the earlier passes named but did not trace line by line.
- Rotation status: correctness 2, security 2, traceability 2, maintainability 2.
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001, R7-P2-001.
- Required evidence: file:line references into the dotenv rewrite function, plus a temp-file probe if budget allows.

Review verdict: PASS
