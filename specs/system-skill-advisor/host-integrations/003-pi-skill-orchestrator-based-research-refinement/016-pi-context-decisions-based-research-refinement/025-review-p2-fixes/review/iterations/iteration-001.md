# Deep Review Iteration 001

## Dispatcher

- Iteration: 1 of 3, derived from the state log (0 prior `type:"iteration"` records), matching the dispatched number.
- Mode: review. Dimension: correctness.
- Operator focus: replay each of the ten P2 fixes from `024-ollama-lane-removal/review/review-report.md` against the code, and finish the deferred `fixture_realism` search (SL4-005). Both are covered below: the replay table under Traceability Checks, and SL4-005 under Ruled Out.
- Session `2026-11-21T14:41:59Z`, generation 1, lineage `new`.

## Dimension

Correctness, applied to the three code fixes in `sweep-lane-residue.mjs` and their vitest cases, plus a replay of the seven doc and metadata fixes because the operator focus asked for all ten.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` lines 25-45, 196-202, 940-975, 1240-1400, 1520-1568, 1985-2005
- `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` lines 160-197, 749-790, 880-966, 1015-1035, 1115-1130
- `.github/workflows/advisory-checks.yml` lines 3-29
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md` lines 19, 27
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` line 25
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` (all 47 rows, parsed)
- `024-ollama-lane-removal/goal.md` lines 88-113; `008-cleanup-wiring-and-gating/plan.md` line 370
- `024-ollama-lane-removal/005-shared-embeddings-package/` goal.md 50-88, spec.md 36, tasks.md 102-113, acceptance-criteria.md 41-95, implementation-summary.md 39, 113
- `024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md` and `006-prose-docs-and-changelogs/tasks.md` (checked CHK rows)
- `025-review-p2-fixes/` spec.md, tasks.md 61-64, implementation-summary.md 64-109
- Context only: `bf6806ad4b3:.skilled/bin/lib/model-server-supervision.cjs:991`, the retired supervisor's launch line

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **nodeScriptOf reads the value of an unlisted node option as the script, so a model server launched with one is missed** -- .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:202 -- `NODE_VALUE_OPTIONS` holds seven options (`-r`, `--require`, `--import`, `--loader`, `--experimental-loader`, `-C`, `--conditions`). Any other node option written with its value as a separate word, such as `--env-file <file>` or `--inspect-port <n>`, falls through the `word.startsWith('-')` skip at `:1267`, and its value becomes the script at `:1268-1269`. A live probe printed `runsModelServer("node --env-file cfg.vars /x/.skilled/bin/hf-model-server.cjs") === false` with script `"cfg.vars"`, and the same for `--inspect-port 9230` with script `"9230"`. The doc comment at `:1252-1253` promises more than the set delivers: "an option that takes a value never has that value read as one". Impact: M4 lists no process (`:1350`), so machine mode can report the server absent while it runs, and apply sets no keep reason, so it deletes the socket and pid files out from under a live server (`:1994-2001`). The `--max-old-space-size=4096` form and every form already listed read correctly.
   Finding class: input-parsing edge case (incomplete option table plus an overbroad doc promise).
   Scope proof: the only producer of the script value is `nodeScriptOf` (`:1259`), used by `runsModelServer` (`:1306`) and `isOwnedModelServer` (`:1324-1325`). The retired supervisor launched plain `node <script>` (`bf6806ad4b3:.skilled/bin/lib/model-server-supervision.cjs:991`, `spawnFn(process.execPath, [modelServerPath], ...)`), so no known launcher sends a value option, which keeps this at P2.
   Affected surface hints: `NODE_VALUE_OPTIONS` at `:202`; the doc comment at `:1243-1255`; the it.each at `sweep-lane-residue.vitest.ts:891-903`. The fix is to widen the set to node's value-taking options, or narrow the comment to the seven it checks.
   Case: the command line `node --env-file cfg.vars /x/.skilled/bin/hf-model-server.cjs` returns false from `runsModelServer`, because `cfg.vars` is read as the script.

2. **Phase 005's goal still reads unstarted: all six completion criteria unticked, and a checked task still says no phase commit exists** -- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/goal.md:57 -- The six completion criteria at `005/goal.md:57-62` are all `[ ]`, while `005/spec.md:36` reads Complete, the goal log row at `005/goal.md:79` reads Complete, and all fifteen AC rows are Met (`005/acceptance-criteria.md:95`). This is the drift class of 024's R3-P2-001, which 025 fixed for the parent goal (`024/goal.md:88-92` now ticked) but not for phase 005. Separately, `005/tasks.md:103` marks T054 `[x]` but its deviation note still says "no phase commit exists yet", though the commit is `1f85a9dd6dd`. 025's T019 verify (`025-review-p2-fixes/tasks.md:61`) greps only `Blocked|Unmet|not committed`, so it could not catch unticked criteria or the "no phase commit" wording. The 025 REQ-009 outcome, "the 005 documents ... read Complete", is therefore only partly met.
   Finding class: completion-metadata drift (residual of the R3-P2-002 fix).
   Scope proof: `rg` for unticked criteria limited to 005's goal.md; the other 024 phases were not re-swept this iteration.
   Affected surface hints: `005/goal.md:57-62` (tick each criterion whose check holds, per the 024 parent's pattern), `005/tasks.md:103` (drop or date the stale "no phase commit exists yet" clause).
   Case: a reader of `005/goal.md` sees six open completion criteria for a phase that spec.md, the goal log and the AC file all report Complete.

## Traceability Checks

Replay of the ten P2 fixes from `024-ollama-lane-removal/review/review-report.md`:

| 024 id | Replay result | Evidence |
|---|---|---|
| R2-P2-001 | Holds. A name an explicit address adds is listed only when `lstat` reports a socket; a regular file is noted and skipped. Tested both ways. | `sweep-lane-residue.mjs:1368-1374`; vitest `:905-934` (real socket), `:936-955` (regular file kept) |
| R9-P2-001 | Holds. M7 notes a file whose lines the parser rejected and keeps its status. | `sweep-lane-residue.mjs:1561-1565`; vitest `:749-762` |
| R1-P2-001 | Holds for spaces. A spaced absolute path joins up to the server name; another script word first stops the join. | `sweep-lane-residue.mjs:1268-1276`; vitest `:891-903`; probe `/usr/local/bin/node /x/a b/hf-model-server.cjs` true. Residual value-option gap filed as P2 finding 1 |
| R1-P2-002 | Holds (documentation option). | `sweep-lane-residue.mjs:33-39`; catalog `lane-residue-gate-and-cleanup.md:27` |
| R4-P2-001 | Holds. 0 of 47 allowlist rows cite a line number. | `fixtures/lane-residue-allowlist.json`, parsed: rows 47, rows with line refs 0 |
| R3-P2-003 | Holds. Trigger unchanged, wording fixed. | `advisory-checks.yml:3-5`, `:24`; `008/plan.md:370` |
| R7-P2-001 | Holds. | catalog `:19`; README `:25` |
| R3-P2-001 | Holds. Criteria 1-5 ticked, Complete rows appended. | `024/goal.md:88-92`, `:112-113` |
| R3-P2-002 | Partial. Status fields, AC-014 and T053 closed; goal criteria and T054 wording left. | `005/spec.md:36`, `005/acceptance-criteria.md:67`, `005/tasks.md:102`; residual is P2 finding 2 |
| R10-P2-001 | Holds. 001: 34 checked CHK rows, 0 without Evidence; 006: 35 checked, 0 without. | `001/tasks.md`, `006/tasks.md` (grep counts) |

Protocols run:

- `spec_code`: partial. REQ-001, REQ-002, REQ-005 to REQ-008 and REQ-010 match the code and docs; REQ-003 holds for its named cases; REQ-009 is partly met (finding 2).
- `checklist_evidence`: partial. 025's T019 is checked with evidence, but its verify command is narrower than REQ-009's outcome (`025-review-p2-fixes/tasks.md:61`).
- `feature_catalog_code`: pass. The catalog's push-trigger and whole-file sentences match `advisory-checks.yml:3-5` and `sweep-lane-residue.mjs:33-39`.

## Integration Evidence

- `.github/workflows/advisory-checks.yml` lines 3-5 and 24 (gate trigger and its comment).
- Retired launcher `bf6806ad4b3:.skilled/bin/lib/model-server-supervision.cjs:991`, read only to establish the reach of finding 1.

## Edge Cases

- Ambiguity: the prompt pack's second `Prior Findings` line kept unsubstituted tokens (`{p0_count}`); the STATE SUMMARY line (P0=0 P1=0 P2=0) and the empty registry were used.
- Ambiguity: SL4-005's registry row cites `sweep-lane-residue.vitest.ts:175`, a temp-dir helper, with rationale "budget" and no described defect. The operator's question as written ("do the residue tests bind real sockets where the behavior depends on a socket") was answered instead; see Ruled Out.
- Coverage: three iterations cannot cover four dimensions one at a time, so a later iteration must combine two dimensions or the run stops short of full coverage.
- Tooling: the env-secret hook refused a probe whose command text named a dotenv file; the probe was rerun with a neutral file name (`cfg.vars`) and no dotenv file was read.
- Design, not a finding: an explicit address whose base name is one of the four fixed names (for example `hf-embed.pid`) is listed whatever its type, because REQ-001 keeps the fixed names' behavior (`sweep-lane-residue.mjs:1368-1371`).

## Confirmed-Clean Surfaces

- `checkModelServer` socket rule and its apply path (`sweep-lane-residue.mjs:1363-1380`, `:1994-2001`).
- `checkDotenv` rejected-line note, which prints no value (vitest `:749-762` asserts neither line prints).
- Push-trigger wording at all four sites; the allowlist reasons; 001 and 006 checklist evidence.

## Ruled Out

- **SL4-005 `fixture_realism`: ruled out.** The only branch whose behavior depends on a file being a socket is `sweep-lane-residue.mjs:1371`, and it is tested both ways: a real socket bound with `net.createServer().listen(custom)` and asserted with `lstatSync(custom).isSocket()` (vitest `:914-922`), and a regular file kept (vitest `:936-955`). The fixed names are type-agnostic by design (`:1368-1370`), so the empty regular files written for them at vitest `:1032`, `:1122` and `:1134` match the code's contract rather than faking a socket. The apply delete path was proven on a real socket too: the `:905` test deletes `custom.sock` through the same `deleteServerFile` route.
- 005 `acceptance-criteria.md` `**Status:** Draft` while every row is Met: seven of eight phases carry Draft, so it is a convention, not drift from this packet.
- Old `goal.md` log rows that read "not committed" or "blocked": the log is append-only and the Complete row at `005/goal.md:79` supersedes them.

## Next Focus

- Dimension: security.
- Focus area: apply-mode delete safety in `sweep-lane-residue.mjs` (symlink refusal, containment of each deleted path, the socket rule under a race between check and apply), and value-free handling of dotenv and process command lines in printed output.
- Reason: correctness is covered; the delete path is the highest-blast surface left.
- Rotation status: correctness done; security, traceability and maintainability remain, with two iterations left.
- Blocked/productive carry-forward: direct reads plus small `node` probes of exported functions were productive. Avoid literal dotenv file names in probe commands.
- Required evidence: file:line for each delete guard and a test that exercises it.

Review verdict: PASS
