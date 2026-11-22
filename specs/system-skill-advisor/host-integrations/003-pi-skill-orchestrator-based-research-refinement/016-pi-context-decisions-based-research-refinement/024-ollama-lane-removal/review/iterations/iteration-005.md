# Iteration 005: Correctness (second pass) and the two unrun overlays

## Dispatcher

- Iteration 5 of 10, mode review, dimension correctness (second pass), run `2026-11-21T12:42:00Z`.
- Focus came from the strategy's Next Focus: run the `skill_agent` and `agent_cross_runtime` overlays and finish the socket-fixture trace. Added a second correctness pass on the scorer and skill-graph code the removal rewrote.
- The iteration number was derived from the state log (4 iteration records, so this is 5). It matches the dispatch.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-110`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (diff against merge base `bf6806ad4b3`; `requireCommandPhraseAnchor` at the CORE LOGIC section)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:348-425` (schema version 1 to 2, `discardOutdatedDatabase`, `initDb`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` (diff against merge base)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1293-1345` (`checkModelServer`), `:1677-1697` (`deleteContained`), `resolveContainedTarget`, `:1905-1942` (M4 apply)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:84`, `:175-185`, `:249-270`
- `.skilled/skills/system-skill-advisor/runtime/tests/shared-import-specifier-extension.vitest.ts:51-66`
- `.skilled/agents/`, `.claude/agents/`, `.opencode/agents/` (lane vocabulary search and branch diff)
- `.skilled/skills/system-skill-advisor/SKILL.md`, `ROUTER.md` (lane vocabulary search)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. All seven carried P2 findings stay open: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001.

## Traceability Checks

- `skill_agent`: pass. No agent file in `.skilled/agents`, `.claude/agents` or `.opencode/agents` names the lane vocabulary (ollama, semantic_shadow, hf-embed, exact semantic rerank). The search returned no lines. `system-skill-advisor/SKILL.md` and `ROUTER.md` hit only on `DEFAULT_RESOURCE_SEMANTICS` (`ROUTER.md:152`, `:159`), which is routing vocabulary and not lane residue.
- `agent_cross_runtime`: pass, and nothing applies. `git diff --stat bf6806ad4b3 HEAD` over the agent folders of all four runtimes is empty, so the branch changed no agent and no mirror. The existing `.skilled/agents/deep-review.md` and `.claude/agents/deep-review.md` difference was there before the branch and is outside scope.
- `spec_code`: pass for the second-pass surfaces. The live lane weights add up to 0.95 both before and after the change, because `semantic_shadow` carried live weight 0 (`lane-registry.ts:9-12` against the merge base), so removing the lane leaves live scoring unchanged. A leftover `semantic_shadow` key in `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` is skipped by the `key in defaults` guard (`lane-registry.ts:64`) and does not throw.

## Integration Evidence

- Exact surfaces checked: `lane-registry.ts`, `fusion.ts`, `skill-graph-db.ts`, `advisor-status.ts`, `sweep-lane-residue.mjs` (M4), the agent folders of the `.skilled`, `.claude` and `.opencode` runtimes (`.codex/agents` has no `deep-review.md`).
- Dangling-import search: no `.ts`, `.mjs`, `.cjs`, `.js` or `.json` file outside the residue tool and its allowlist imports `utils/retry`, `shared/embeddings`, `embeddings/factory|profile|auto-select`, `lanes/semantic-shadow` or `lib/embedders`. The remaining hits are a historical comment in `check-source-dist-alignment.ts:8` and string samples in a regex unit test (`shared-import-specifier-extension.vitest.ts:57`, `:64`). Neither one loads a module.

## Edge Cases

- Socket-fixture trace, carried from iteration 4: no test binds a real Unix socket. The tests write regular files under the socket names (`vitest.ts:84`, through `writeFile`), and the only real server is an HTTP listener on 127.0.0.1 (`vitest.ts:249-270`). A live probe closed the gap. A real bound socket `hf-embed.sock` in a temp folder was reported by `checkModelServer` as a `server-file` together with the `socket-dir` item (status `found`). `resolveContainedTarget` returned `ok`, `isDirectory:false`, and `rmSync` unlinked it. Detection and delete use `lstat` and do not depend on the file type, so the regular-file fixtures stand in correctly for real sockets. The temp folder was removed afterwards.
- Skill-graph downgrade: a version 2 database opened by `main` (SCHEMA_VERSION 1) is kept, because `main` keeps any version at or above its own. That is the reverse branch and is outside this target. It is recorded here and not raised.
- Version above SCHEMA_VERSION: `initDb` keeps it with no warning (`skill-graph-db.ts:404-415`). That is the same behavior as before the branch, so it is not a regression.

## Confirmed-Clean Surfaces

- `fusion.ts`: everything the command-meaning cosine pass needed went out with it (`COMMAND_MEANING_*`, `commandMeaningEligible`, `rankMeaningPassedCommandFirst`, exact semantic rerank). `requireCommandPhraseAnchor(ranked)` now keys only on `explicit_author`. `isNoEditRequest` and `readOnlyExplainer` still have live callers (`readOnlyRouteAllowed`, the confidence floor), so neither was left unused. Outside the residue tool's own vocabulary list (`sweep-lane-residue.mjs:119`, `:299`), no reference to the removed symbols remains.
- `skill-graph-db.ts`: a version 1 file is condemned only by a version it read or by skill tables with no version table. A probe error keeps the file. The fallback in `initDb` closes the handle before it deletes and opens again.
- `advisor-status.ts`: the one added line sets `checkArtifactIntegrity` to true by default and lets the caller override it.

## Ruled Out

- Real-socket versus regular-file mismatch in M4 detection and apply: ruled out by a live probe (lstat plus rmSync are type-agnostic).
- Shadow-weight sum drop (1.00 to 0.95) as a correctness defect: no runtime code reads the shadow weights other than the registry and its env-override test. Nothing depends on them adding up to 1.
- Dangling imports of the deleted shared embeddings, retry and embedder modules: none.
- Agent or mirror lane residue: none, and no agent file changed.

## Next Focus

- Dimension: security (second pass), or traceability on the `feature_catalog_code` and `playbook_capability` overlays, which no iteration has recorded yet.
- Focus area: check the feature-catalog entry `lane-residue-gate-and-cleanup.md` and the scorer-fusion catalog pages against the current code paths, then check the playbook steps against the tool's flags.
- Reason: all six protocols except those two overlays now have a recorded result. Correctness has had two passes.
- Rotation status: correctness done twice; security, traceability and maintainability done once.
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001.
- Required evidence: a file:line reference for each overlay result.

Review verdict: PASS
