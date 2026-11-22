# Iteration 001: Correctness (residue tool + advisor schema discard)

## Dispatcher
- Iteration 1 of 10, mode review, dimension correctness, lineage new, generation 1.
- BINDING: target=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal
- BINDING: maxIterations=10
- BINDING: convergence=0.1
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal

## Files Reviewed
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` lines 1-330 (constants, vocabularies), 335-806 (allowlist loader, repo mode, index-output check), 1222-1300 (process detection), 1576-1702 (exit code, contained delete), 1860-1880 (lane-source guard), 2145-2219 (argument parsing, main)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:1-110`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:286-430`
- `001-residue-check-and-cleanup-tool/acceptance-criteria.md` (AC-001 to AC-008)
- Live run: `sweep-lane-residue.mjs repo --json` exit 0, 47 files all allowlisted, 47/47 rows matched, 0 unused rows, index `outside: 0`; `repo --root .skilled` exit 2 with the work-tree-top refusal.

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Model-server detection misses a server whose script path contains a space** -- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1244` -- `nodeScriptOf` splits the `ps` command line on whitespace and takes the first non-option word as the script, so a checkout under a folder with a space yields a truncated script path whose basename is not `hf-model-server.cjs`; `runsModelServer` then returns false and M4 lists no process. Probed directly: `runsModelServer('/usr/local/bin/node /Users/x/My Repo/.skilled/bin/hf-model-server.cjs')` returns `false`, the same path without the space returns `true`. The fixed socket-dir file check in M4 still sees `hf-embed.sock`/`hf-embed.pid` while the server runs, which limits the false-clean, so the severity stays P2.
   Finding class: input-parsing edge case
   Scope proof: machine and apply modes, check M4 (`runsModelServer`, `isOwnedModelServer` at 1258-1290); apply cannot stop a process M4 never lists.
   Affected surface hints: `nodeScriptOf`, `runsModelServer`, `isOwnedModelServer`, M4 apply branch
   Case: an operator whose checkout lives under `/Users/x/My Repo/` runs `machine` while an old model server is still running; no process item is reported and apply leaves the process alive.

2. **Exact-path allowlist rows exempt the whole file, so new lane text added to an allowlisted live file passes repo mode** -- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:761` -- in `scanRepo` an allowlisted hit is classified by path only (`rowsByPath.get(relativePath)`), with no per-term or per-line check, while the header (decision 3) argues folder rows are refused because they would hide a later remnant. The same hiding applies inside each of the 47 allowlisted files, several of them live docs and code (for example `runtime/cli/retrieval/README.md`, `system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`). The tool already refuses this trade for the index outputs (`hit.index.length > 0 ? undefined : ...`), so the gap is a known design limit rather than an oversight, but no doc names it as a limit of the gate. P2 because the row reasons are line-specific prose and a reviewer of the allowlist would see a new term only by rereading the file.
   Finding class: gate blind spot
   Scope proof: repo mode classification loop in `scanRepo` (`sweep-lane-residue.mjs:756-768`); the matched terms are recorded in `allowlisted[].matched` but never compared with what the row was written for.
   Affected surface hints: `scanRepo`, `lane-residue-allowlist.json`, `lane-residue-gate.test.cjs`, residue gate docs
   Case: someone adds `OLLAMA_BASE_URL` guidance to the allowlisted `runtime/cli/retrieval/README.md`; repo mode still exits 0 because that path has a row, even though the new term is not the `hf-embed` default the row's reason describes.

## Traceability Checks
- spec_code (partial): 001 AC-003 says unknown flag / missing value / malformed allowlist exit 2; code returns `EXIT_ERROR` (2) from `parseArgs` failures and from loader throws in `main` (`sweep-lane-residue.mjs:2183-2189`, `2208-2211`). AC-007 trailing `/` and `*` refusal matches `loadAllowlist` (lines 446-480). Repo exit matches AC-001/AC-002 semantics (`report.counts.live > 0 ? 1 : 0`). Only the residue tool and the advisor DB were traced this iteration, so the protocol stays partial.
- checklist_evidence (partial): AC-001..AC-008 of 001 are Met; the current-tip run (exit 0, 47/47 rows) agrees with the goal's completion record. Other children's acceptance tables were not walked this iteration.
- 004 spec failure-path claims (version-0 file discarded, transient probe failure keeps the file, empty file kept, above-2 kept) match `readOutdatedSchemaVersion` and `discardOutdatedDatabase` (`skill-graph-db.ts:304-344`) and the post-open fallback (`skill-graph-db.ts:404-415`).

## Integration Evidence
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` read through the tool's own JSON report (47 rows, all matched).
- `.skilled/bin/lib/launcher-ipc-bridge.cjs` grepped only for spawn shape; it does not start the model server (that supervisor was deleted), so the `node <script>` command-line assumption could not be checked against a live spawner.

## Edge Cases
- Ambiguity: the strategy's "refused flags exit 64" refers to the advisor CLI's `includeSemanticHealth` refusal (004 REQ-002), not to the residue tool, whose refusals exit 2 per 001 AC-003. No contradiction.
- Missing dependency: the deleted model-server supervisor is not in the tree, so how it spawned the server (absolute `process.execPath` plus script) is inferred from the code comment at `sweep-lane-residue.mjs:1236-1238`.
- Lane registry override: `resolveLaneWeightsOverride` skips unknown keys (`lane-registry.ts:63-64`), so a stale `semantic_shadow` weight in `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` is ignored, as the 004 spec states.

## Confirmed-Clean Surfaces
- `loadAllowlist` fails closed on unreadable JSON, missing fields, folder rows, glob rows and duplicates.
- `resolveRepoRoot` refuses a subdirectory root (observed exit 2).
- `grepTrackedFiles` treats git exit 1 as no-match and every other non-zero as an error.
- `checkIndexOutputs` throws on a retyped index/variants shape and treats an unowned lane string as live (fail-closed).
- `resolveContainedTarget` refuses symlinks, dot segments, slashes in segments and parents that resolve outside the root.
- `machineExitCode`: found beats not-checked; not-checked with nothing found exits 2, never 0.
- `discardOutdatedDatabase` deletes only on a version actually read below 2 or on skill tables with no version table; transient probe errors keep the file.

## Ruled Out
- Regex metacharacter drift between git ERE and JavaScript for the vocabularies: every term is a literal; `escapeRegExp` is used on the JS side.
- Infinite recursion in `initDb`'s post-open discard: `removeOutdatedDatabase` throws if `rmSync` fails, so the retry cannot loop on a file it could not delete.
- Unused allowlist rows silently passing: the current tip has 0 unused rows (reported in `unusedAllowlistRows`).

## Next Focus
- Dimension: security
- Focus area: apply mode deletion paths (`cleanOwnedLeftovers`, `deleteOllamaModel`, `stopProcess`, socket-dir file deletes, DB copy pattern), the dotenv value-free read, and the doctor wiring that calls apply (`lane-residue-gate.test.cjs`, `doctor-update-apply.yaml`).
- Reason: correctness of repo mode and the advisor schema discard is covered; apply is the only mode that deletes or signals.
- Rotation status: correctness done (first pass); security, traceability, maintainability remain.
- Carry-forward: P2 findings 1 and 2 above; the space-in-path process-parsing gap also bears on which pid apply would signal.
- Required evidence: file:line on every delete or kill site and on the confirmation gate for the shared Ollama model.

Review verdict: PASS
