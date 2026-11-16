# Iteration 005 — Cross-reference (phase-008 evidence closure, carried-finding recheck, catalog exit trace)

## Dimension

Cross-reference, the loop-contract fallback after all four dimensions closed in iterations 1-4. Operator focus carried in addition: the four named residuals and the known phase-1 harness line. How the operator focus was addressed:

- Residual 1 (old-path sweep): not re-entered. The direction is recorded BLOCKED after the iteration 1 sweep and the iteration 4 re-sweep (`deep-review-strategy.md` §9). It was addressed this iteration by proving the reviewed tree has no drift: `git status --porcelain` over the target paths is empty, so the iteration 4 conclusion (only `history-projection.vitest.ts:230` and `session-handover-cli.test.cjs:3598`, both deliberate fixtures) still describes the current files. The known `hop-recall.sh:18` line stays outside the target and owned by phase 008 T002.
- Residual 2 (CI engine step): re-confirmed from current files. The step at `.github/workflows/spec-kit-check.yml:296-302` runs `npm --prefix .skilled/hooks/session-handover/history run build`; `history/package.json:11` resolves `../../../skills/system-spec-kit/node_modules/.bin/tsc`, i.e. `.skilled/skills/system-spec-kit/node_modules/.bin/tsc`, while the job installs `.opencode/skills/system-spec-kit` (`:276`) and `.skilled` (`:279`). `I1-P1-001` stays the active reason.
- Residual 3 (silent schema skip): carried, latent. `project.test.mjs:141-142` still converts a missing schema into a green skip; the schema file exists today. `I1-P2-003` stays active; the file shows no drift.
- Residual 4 (66-character bound): not re-entered. The direction is recorded BLOCKED after the iteration 1, 2 and 4 checks; no drift means the equal 66/quoted-form arithmetic still holds. `I1-P2-004` (pin completeness) stays active.
- Known harness line: recorded as known, not a new finding.

## Dispatcher

- Mode: review, native LEAF execution, no delegation.
- Iteration: 5 of 10 (JSONL-derived: 4 prior `type:"iteration"` records; matches the dispatch number).
- Run / sessionId: `2026-11-15T17:33:23.837Z`, generation 1, lineageMode `restart`.
- Target: files changed in `169da2e8cba..1c7bc3d9d63` (63 declared files; cross-reference-relevant subset read). HEAD has advanced to `5bd9d54ef96c3ce23fde37ca46d2bbc93e78bff7` (2026-11-15 18:23:02 +0100), but no target path has working-tree changes.
- Node budget: 24 tool calls; this pass used the analysis allowance on the five deferred evidence surfaces and reserved the rest for the artifacts.

## Files Reviewed

| File | Lines / focus |
|------|---------------|
| `.github/workflows/spec-kit-check.yml` | 255-329: install set, runtime build, engine build and suites step |
| `.skilled/hooks/session-handover/history/package.json` | 1-15: build, typecheck and test script paths |
| `specs/.../008-wider-hop-recall-measurement/plan.md` | 1-95 in full: summary, gates, architecture, phases, testing, rollback |
| `specs/.../008-wider-hop-recall-measurement/description.json` | 1-19 in full: folder, level, parent chain, sequence |
| `specs/.../008-wider-hop-recall-measurement/graph-metadata.json` | 1-183 in full: status, key files, source docs and hashes |
| `specs/.../008-wider-hop-recall-measurement/spec.md` | 1-156 in full: metadata, phase context, scope, requirements, §7 questions |
| `specs/.../008-wider-hop-recall-measurement/tasks.md` | 1-87 in full: T001-T011 and completion criteria |
| `.skilled/hooks/session-handover/history/lib/cli.ts` | 565-599: locator gates, reply write, exit-code assignment, catch |
| `.skilled/hooks/session-handover/history/README.md` | 125-174: CLI contract, success/refusal exit codes, refusal table |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` | 1-106 in full: overview, locator rules, redemption, source files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | 140-194: Expected, Failure Triage, Source Files |
| `git` | `HEAD`, `git status --porcelain` over the target paths, `shasum -a 256` for the three phase-008 docs |

Reference-only (prior-iteration evidence, not re-read): `project.test.mjs:141-142`, `lookup-offer.ts:33,58,70`, `hook-state.ts:278,283`, `hop-recall-conversation.md:18,112`, `spec-kit-check.yml:3-44`.

## Findings — New

### P0 Findings

None.

### P1 Findings

None new. `I1-P1-001` (the engine CI build cannot resolve `tsc` on a clean runner) remains active and is carried, re-confirmed against the current workflow and package script.

### P2 Findings

None new. The three playbook P2s remain active and were re-confirmed against current lines; no new drift was found in the phase-008 docs or the catalog.

## Carried Findings Recheck

| Finding | Severity | Status | Current evidence |
|---------|----------|--------|------------------|
| `I1-P1-001` | P1 | active, re-confirmed | `spec-kit-check.yml:296-302` + `history/package.json:11`; the install set at `:276,279` still does not provision `.skilled/skills/system-spec-kit/node_modules/.bin/tsc`. |
| `I1-P2-002` | P2 | active, no drift | Engine-only commits still do not reach the step; the trigger list at `:3-44` has no `.skilled/hooks/**` entry (iteration 4 read; target tree clean). |
| `I1-P2-003` | P2 | active, latent | `project.test.mjs:141-142` still turns a missing schema into a skip; `history-entry.schema.json` exists, so the branch does not fire today. |
| `I1-P2-004` | P2 | active, no drift | `lookup-offer.ts:33,58` and `hook-state.ts:278,283` are both 66 with the same quoted-length predicate; the pin remains behavioral and one-sided. |
| `I2-P2-001` | P2 | active, no drift | `lookup-offer.ts:70` still interpolates the runtime label into the printed command unquoted. |
| `I3-P2-001` | P2 | active, re-confirmed | Playbook `:185-186` still name `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` and `history-locator.vitest.ts`; the moved suites live under `history/tests/`. |
| `I3-P2-002` | P2 | active, re-confirmed | Playbook `:147` and `:166` still say "Claude Code or Codex" only; catalog `:25` and README `:141` include Vibe. |
| `I3-P2-003` | P2 | active, carried | `hop-recall-conversation.md:18,112` not re-read this iteration; target tree clean, so the iteration 3 measurement stands. Recorded as carried, not as a pass. |

## Evidence Gaps Closed

The two phase-008 evidence gaps deferred in iterations 3-4 are now closed clean:

- **Plan-to-spec/tasks consistency.** `plan.md:3,28,38,44,68,76,92` names the new engine build path (`.skilled/hooks/session-handover/history/dist/cli.js`, `npm --prefix .skilled/hooks/session-handover/history run build`) and matches `tasks.md:26,37-38,58,60` (T002/T003/T009/T011) and `spec.md:44,84` (REQ-001). `plan.md:37` points at `spec.md` §7 for the run counts and models; `spec.md:150-154` holds exactly those open questions (10 synthetic + 5 real per runtime/arm, 90 counted runs; default model at medium effort). The gate is honest for a Draft phase, not a contradiction.
- **Description and graph metadata.** `description.json:18` is `level: "1"`, matching `spec.md:14,22`, `plan.md:12` and `tasks.md:12`; `specId: "008"` matches the phase number; `parentChain` matches the folder. `graph-metadata.json:35` is `status: "draft"`, matching `spec.md:24`; `key_files` includes the new `dist/cli.js`; and all three `source_doc_hashes` (`graph-metadata.json:177-179`) equal the current `shasum -a 256` values for `spec.md`, `plan.md` and `tasks.md`.

## Catalog Success-Path Exit Trace

The iteration 3 residual "success exit 0 not traced" is closed:

- `feature-catalog/context-preservation/compaction-history-lookup.md:51` states "a success prints one capped reply and exits 0".
- `README.md:144` states "Success writes one JSON line and exits 0. Every refusal ... exits 2."
- `cli.ts:577-580` writes the reply and `return 0`; `cli.ts:592-593` assigns that code to `process.exitCode`. Refusals return 2 through `cli.ts:567-571,575,585`, and the catch at `:595-597` writes a refusal and sets 2. No success path reaches exit 2 and no refusal path reaches 0.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | pass | Phase-008 scope, requirements and files-to-change match the shipped engine path; the parent phase table remains a historical action list (`spec.md:97-102`, iteration 3). |
| `checklist_evidence` (core) | pass | Phase 008 is Draft with T001-T011 unchecked (`tasks.md:36-61`); T002's pattern matches the owned harness line, so the check is non-vacuous. |
| `skill_agent` (overlay) | notApplicable | No `SKILL.md`, command document, or agent definition inside the declared target. |
| `agent_cross_runtime` (overlay) | notApplicable | No runtime mirror path inside the declared target. |
| `feature_catalog_code` (overlay) | pass | Cap 600 (`lookup-offer.ts:21`), command (`:20`), prefix rule (`:69`), refusal exit 2 (`cli.ts:597`) and now success exit 0 (`cli.ts:580,593` against catalog `:51` and README `:144`) all match; both cited reader tests exist. |
| `playbook_capability` (overlay) | fail | `I3-P2-001` (retired test anchors, `:185-186`), `I3-P2-002` (Vibe omitted at `:147,166`), `I3-P2-003` (hop-recall pair describes a no-offer hop) remain active. |
| Phase-008 plan/description/graph freshness | pass | `plan.md`/`spec.md`/`tasks.md` hashes equal `graph-metadata.json:177-179`; level, status and parent chain agree. |
| Residual 2: CI engine step as written | fail, carried | `spec-kit-check.yml:296-302` + `history/package.json:11`; `I1-P1-001` active. |
| Residual 3: missing schema becomes a skip | latent, carried | `project.test.mjs:141-142`; `I1-P2-003` active and the schema exists. |
| Residual 1 / Residual 4 | addressed, not re-entered | Both directions are recorded BLOCKED (`deep-review-strategy.md` §9); `git status` shows no target drift, so the prior sweeps still describe the current tree. |

## Integration Evidence

- `.github/workflows/spec-kit-check.yml:296-302` with `.skilled/hooks/session-handover/history/package.json:11` — the engine step builds through `../../../skills/system-spec-kit/node_modules/.bin/tsc`, while the job installs `.opencode/skills/system-spec-kit` (`:276`) and `.skilled` (`:279`); this is the carried `I1-P1-001` mapping.
- `.skilled/hooks/session-handover/history/lib/cli.ts:577-580,592-593` with `.skilled/hooks/session-handover/history/README.md:144` and `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:51` — success writes one JSON line and exits 0; refusal exits 2.
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:25` with `.skilled/hooks/session-handover/history/README.md:141` and the playbook `:147,166` — Vibe is a supported sender in the contract but is dropped from two playbook capability lines, confirming `I3-P2-002`.
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186` with `.skilled/hooks/session-handover/history/tests/` — the two Source Files rows still name the retired runtime test paths, confirming `I3-P2-001`.
- `specs/.../008-wider-hop-recall-measurement/graph-metadata.json:177-179` with the current `sha256` of `spec.md`, `plan.md` and `tasks.md` — the three hashes match exactly, so the graph metadata is fresh.

## Edge Cases

- **Residual 1 was not re-swept.** The direction is BLOCKED after two sweeps (iterations 1 and 4), and the loop contract forbids retrying it. The no-drift check (`git status --porcelain` empty over the target paths) is the strongest read-only substitute; this is not a claim that a new sweep ran.
- **Residual 4 was not re-read.** The 66-bound equality is BLOCKED after three checks. No drift means the prior direct reads still hold; the one-sided-pin concern in `I1-P2-004` is a separate, still-active advisory.
- **`history.ts` remains unread, second deferral.** The 24-call ceiling went to the five deferred evidence surfaces. Its contract is exercised by `history-entry-contract.vitest.ts` and documented at `README.md:37`; the source itself is recorded as deferred evidence, not as a pass.
- **`I3-P2-003` was not re-read.** The hop-recall pair is a carried advisory; the target tree is clean, so the iteration 3 evidence still applies. Recorded as carried, not as a fresh verification.
- **HEAD advanced beyond the review range.** HEAD is `5bd9d54ef96c` while the declared target ends at `1c7bc3d9d63`. The working tree has no changes in the declared target paths, so the review target remains the declared range; later commits are outside scope.
- **The eager search index stays unmeasured.** `navigator.ts:490-503` analyzes every item with no size gate; measuring it needs an execution outside this read-only packet. The iteration 2/4 deferral stands.

## Confirmed-Clean Surfaces

- Phase-008 `plan.md`, `spec.md`, `tasks.md`, `description.json` and `graph-metadata.json` agree on the new engine build path, Level 1, Draft status, parent chain and phase number.
- The three phase-008 source-doc hashes match `graph-metadata.json` exactly; the graph metadata is not stale.
- The catalog's success-path exit 0 claim matches `cli.ts` and the engine README; the refusal exit 2 claim was already verified in iteration 3.
- The playbook's implementation anchors and the two moved test suites resolve; only the two test rows at `:185-186` are stale (carried `I3-P2-001`).
- No new P0, P1 or P2 findings in the cross-reference pass.

## Ruled Out

- **Phase-008 plan, description or graph metadata contradict spec/tasks** — the new path, level, status and parent chain agree, and all three source hashes match the current docs.
- **The catalog's success-path exit code disagrees with the CLI** — `cli.ts:577-580,592-593` writes the reply and returns 0; the catalog `:51` and README `:144` state the same.
- **The playbook's two stale test anchors were fixed** — `:185-186` still name the retired runtime paths; the moved counterparts exist under `history/tests/`, so `I3-P2-001` stands.
- **Vibe was added to the playbook's capability lines** — `:147` and `:166` still say "Claude Code or Codex" only, so `I3-P2-002` stands.
- **A live old-path reference survives outside `specs/`** — carried BLOCKED conclusion from iterations 1 and 4; no target drift this iteration.

## Next Focus

- Dimension: cross-reference (all four dimensions and one consolidation pass covered; fallback per the loop contract).
- Focus area: read `history.ts` and recheck the derivation/validation path against `history-entry-contract.vitest.ts`; confirm the CI `tsc` provisioning root cause against `.skilled/package.json` workspaces; recheck the three playbook P2s once more before synthesis.
- Reason: iteration 5 closed the phase-008 evidence gaps and the catalog exit trace; the remaining value is the twice-deferred `history.ts` source, the CI provisioning proof, and consolidation of the carried advisories.
- Rotation status: D1 correctness, D2 security, D3 traceability, D4 maintainability and cross-reference reviewed.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004`, `I2-P2-001`, `I3-P2-001` to `I3-P2-003` stay active. No new P0/P1/P2 from iteration 5.
- Required evidence: `history.ts`; `.skilled/package.json` workspace/install set; `hop-recall-conversation.md:18,112`.
- Recovery note: the eager search-index memory question (`navigator.ts:490-503`) stays deferred because a read-only pass cannot measure it; `history.ts` is now deferred twice and must be read before synthesis.

## Verdict

No new findings. The cross-reference pass closed both deferred phase-008 evidence gaps (the plan, description and graph metadata agree with spec/tasks, and the source hashes match), traced the catalog's success exit 0 to `cli.ts:577-580,592-593`, and re-confirmed the three playbook P2s and the CI P1 against current files. `I1-P1-001` remains active, so the iteration verdict is CONDITIONAL. `hasAdvisories` is true (seven active P2s).

Review verdict: CONDITIONAL
