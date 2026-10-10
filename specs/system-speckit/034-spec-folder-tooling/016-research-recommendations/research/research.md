---
title: "Research Synthesis: overengineering in the research-recommendations build [system-speckit/034-spec-folder-tooling/016-research-recommendations/research]"
description: "The build is close to its requirements. Three simplifications survive the evidence, all small: drop the healer CLI's --mode selector, then the --json output only after the AC-019 evidence procedure moves off it, and maybe merge two doctor failure fields. Writers, parsers, walkers, the layout-map states and the anchor diagnostics are requirement-backed."
trigger_phrases:
  - "research recommendations overengineering"
  - "heal lane modes cli selector"
  - "simplification research recommendations build"
  - "lane modes json output branch"
importance_tier: "normal"
contextType: "research"
---
# Research Synthesis: Overengineering in the Research-Recommendations Build

<!-- Workflow-owned canonical synthesis. Compiled from research/iterations/iteration-001.md to iteration-005.md and the run's delta files. -->

---

## 1. Executive Decision

The code in scope carries little that its phase specs do not ask for. Five iterations found three simplification candidates, all on the optional edges of command-line and workflow surfaces, and together they come to roughly 25 to 35 production lines out of about 6,000 in the four main files. Everything else they examined turned out to be requirement-backed: the healer's anchor-repair and five lane modes, the archive-only un-nesting path, the distinct file writers, parsers and walkers, the layout-map states, the doctor compatibility approvals and recovery, and the anchor close-before-open diagnostic.

The ranked candidates:

1. Remove the `--mode` subset selector from `heal-spec-docs.cjs --lane-modes`, keeping the programmatic `runLaneModes(options.modes)` seam the tests use. About 18 lines plus the usage line, two README spots and one test assertion. Medium risk.
2. Remove the lane CLI's `--json` output branch. About 5 to 7 lines plus usage text and the JSON assertions. Medium-high risk: phase 015's AC-019 evidence was produced with `--json`, so the evidence procedure must change first.
3. Merge the doctor compatibility action's `step_failure` and `on_step_failure` into one property. A few YAML and test lines. Low yield, medium risk until the action-field contract is confirmed.

The eight P2 simplifications applied after the Opus review went far enough for the duplication they targeted. No further writer, loader, parser or walker merge is earned. They did not reach the optional CLI branches above, which is where the remaining slack is.

---

## 2. Research Objective and Boundaries

The operator asked where `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `validation/orchestrator.ts`, `frontmatter-migration.ts`, the doctor update compatibility assets and their tests carry abstraction, modes, flags, options, fallbacks, duplicated machinery, configuration or tests beyond what phases 003, 009, 011, 012, 013 and 015 require. Each point is judged against `.skilled/repo-rules/prevent-overengineering.md` and the Restraint Signals in `AGENTS.md` section 3.

Out of scope: bug hunting, any code or spec edit, and re-deriving the eight P2 fixes already applied (section numbering, one atomic writer, one healer loader, a `planLayoutMove` JSDoc, an unreachable fallback, the nesting-severity constant, two private exports).

---

## 3. Method and Evidence Provenance

- Five iterations, each a fresh `@deep-research` leaf dispatched through cli-pi (`pi -p --offline --model openai/gpt-6-luna --thinking xhigh`), with the persona inlined and the child-dispatch preamble on top.
- Each iteration was read-only on code and wrote its narrative, delta and gateway-recorded state record. `verify-iteration.cjs` passed all five; iteration 3 needed its one allowed redispatch after the first attempt hit the 900-second timeout.
- At synthesis the orchestrator re-read every load-bearing citation against the current code and ran a repository search for callers of the lane CLI options. That search found the AC-019 `--json` use that changes candidate 2's risk (section 6).
- Iteration 1 cited phase docs as `specs/system-speckit/034-spec-folder-tooling/0NN-*`, dropping the `016-research-recommendations/` segment. Citations below use the corrected paths.

---

## 4. Healer Modes, Flags and Branches (Q1)

The lane runner and its CLI are the only surface with options no phase asks for.

- `runLaneModes` filters `LANE_MODES` by an optional `options.modes` list [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1336]. The production caller, `upgrade-legacy`, runs all modes with no list [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:881]. The tests use `options.modes` to isolate each mode, so that seam has a real caller and stays.
- `runLaneModesCli` parses a repeatable `--mode <name>`, rejects a missing or unknown name and forwards the list [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1363-1379] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1388-1391]. Phase 015 requires the five modes to be "exposed through" the healer and integrated in order, and never says a subset must be selectable from the command line [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77]. The only test of the CLI selector is the unknown-name error [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:587].
- `--json` swaps the printed lines for one JSON object per packet [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1362] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1392-1395].
- Requirement-backed and kept: anchor repair with dry run and apply, marker-only questions-anchor un-nesting as the only archive edit, the five lane modes with their refusal and idempotence gates, and the grouped-detail report [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/spec.md:72-80] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-113] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/spec.md:47-50].

---

## 5. Duplicated Machinery and the Eight Applied Fixes (Q2)

No further consolidation is earned. Each remaining look-alike has its own contract.

- The anchor and lane repairs already share `writeFileAtomic`, and `healerFor` is one small loader. The other writers differ: `writeManifestFile` handles exclusive create versus replace of a private mode-0600 manifest, and `recordFindings` writes a per-packet baseline with an unchanged-findings check [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:597-626] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:329] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1153]. Merging them would need a shared API with mode and exclusivity switches, the configuration surface the restraint rule warns against.
- The healer's `frontmatterOf` extracts a raw block for narrow checks; `frontmatter-migration.ts` owns structured section parsing [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:339-345] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:512-547]. The healer walker and `upgrade-legacy`'s discovery overlap in purpose but not in selection policy (nested-root dedupe, archive classification, artifact filtering) [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:595-627].
- `sortRefusals` gives the persisted baseline a canonical order [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141]. No test asserts that order directly; only repeated-run equality covers it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283]. Keep it, and add a direct order test before anyone touches it.

Verdict on the eight fixes: sufficient for the duplication they targeted, short of the optional CLI branches in section 4.

---

## 6. Validator and Doctor Compatibility (Q3)

- **Layout map.** `planLayoutMove` and its helpers distinguish `none`, `v3`, `partial` and `v4`, preserve symlink identity and list case-folded collisions [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1196-1350]. Phase 009 requires partial and complete move detection, a path-map preview and collision checks before execution [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120]. Requirement-shaped; kept.
- **Compat action.** Preflight, preview, two approvals, dirty-root refusal, per-step logs, recovery and rollback reporting all map to phase 009 requirements [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:79-127]. The one redundancy: `step_failure` and `on_step_failure` both say append `step-failed` and stop with `STATUS=FAILED`; the first adds the exit code, the second adds no-retry and the rollback block [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:125-126]. The test asserts each field separately [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:825-832]. No code in the repository reads either name; they are instructions to the model running the workflow.
- **Anchor validator.** Iteration 3 called the `opensAhead` and `openedSoFar` tracking an unrequired extra diagnostic. Iteration 5 corrected that: phase 013's Anchor Order section requires reporting a close that comes before its own open, and a focused test pins it [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-174] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:732-753] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198]. Kept.

---

## 7. Tests (Q4)

The tests in scope pin required behavior. None was found that mirrors an implementation branch without guarding a requirement.

- Per-mode transformation, refusal and second-run no-op tests guard phase 015 requirements. The exact five-mode order assertion and the sequence fixture are not duplicates: the fixture produces only three actions, while the list pins all five [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1284-1324].
- The CLI test covers dry-run and no-write, `--json` shape and the unknown `--mode` error [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-592]. Its `--json` and `--mode` assertions are the only test cost of candidates 1 and 2.
- One gap rather than surplus: there is no direct canonical-order test for `sortRefusals`.

---

## 8. Caller Search at Synthesis

The iterations searched for non-test callers in code only. The orchestrator widened the search to docs and spec evidence:

- `--mode` is documented in the usage comment and twice in the spec CLI README [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:23] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:271]. No script or workflow invokes it.
- `--json` has a recorded caller: phase 015's AC-019 was verified with `heal-spec-docs.cjs --lane-modes --roots <copy>/specs --apply --json`, run twice over a 42,353-file corpus copy [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/acceptance-criteria.md:72]. Removing `--json` breaks re-running that evidence as written. That raises candidate 2's risk; the iterations ranked it as if no caller existed.

---

## 9. Restraint-Signal Reading

- "for flexibility", "might need": the `--mode` CLI selector and `--json` format are options with no production caller. That is the signal prevent-overengineering.md names: every option should have a current caller [SOURCE: .skilled/repo-rules/prevent-overengineering.md:114-129].
- "DRY this up across two instances": applies against merging the writers, parsers and walkers. They are similar, not the same.
- "test what changed, not what exists": the tests examined each guard a requirement. No surplus test was identified.

---

## 10. Ranked Simplifications

| Rank | Change | Where | Reduction | Risk | Pinned by | Forbidden by a requirement? |
|---|---|---|---|---|---|---|
| 1 | Remove the `--mode` CLI selector; keep `runLaneModes(options.modes)` | `heal-spec-docs.cjs:1363-1379`, `:1390`, usage `:23`, `README.md:113,271` | About 18 code lines, 3 doc spots, 1 test assertion | Medium: an external script could use it | Per-mode tests and the five-mode order test stay green; drop `heal-lane-modes.vitest.ts:587` | No. Phase 015 requires the modes be exposed and integrated, not CLI-selectable |
| 2 | Remove the `--json` output branch | `heal-spec-docs.cjs:1362`, `:1392-1395`, usage `:23` | About 5 to 7 code lines plus JSON assertions | Medium-high: AC-019 evidence was produced with `--json` | Dry-run and no-write test stays; drop the JSON assertions at `heal-lane-modes.vitest.ts:578-585` | No requirement names JSON, but 015's AC-019 verification procedure depends on it |
| 3 | Merge `step_failure` and `on_step_failure` into one property carrying the union of both | `doctor-update-compat-action.yaml:125-126` | 1 YAML line and a few test lines | Medium: action-field contract unconfirmed | `doctor-update-compat.test.cjs:825-832`, rewritten against one field | No. Phase 009 requires step logging and rollback guidance, not two fields |

The reductions are source-level estimates, not measured diffs.

---

## 11. Recommendations

1. Do candidate 1 if the operator confirms no outside script passes `--mode`. It is the clearest case of an option with no caller.
2. Defer candidate 2 until AC-019's evidence procedure is rewritten to read the human-readable output, or keep `--json` as the documented evidence path. Removing it now trades five lines for an evidence row that can no longer be re-run as written.
3. Treat candidate 3 as optional cleanup. Its saving is a line.
4. Add a direct canonical-order test for `sortRefusals`. This adds coverage instead of removing anything, and it is the precondition for ever simplifying that sort.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Remove the anchor-repair mode or its dry run | Phase 011 requires the mode, its dry run and upgrade integration | `011-anchor-repair-mode/spec.md:48-80` | 1 |
| Remove any lane mode, its refusal or idempotence gates, or the ordered all-mode run | Phase 015 requires each | `015-lane-rules-as-heal-modes/spec.md:73-77,103-113` | 1, 4, 5 |
| Fold archived packets into the active repair path | Phase 011 limits archive edits to questions-anchor un-nesting | `011-anchor-repair-mode/spec.md:78-80,114-116` | 1 |
| Remove grouped-detail reporting | Phase 012 requires grouped failures with counts | `012-fold-one-off-repairs/spec.md:47-50` | 1 |
| Remove `runLaneModes(options.modes)` | The focused tests use it to isolate modes | `heal-lane-modes.vitest.ts:459-489` | 4, 5 |
| Merge the manifest, baseline and healer writers | Different create, permission, durability and idempotence contracts | `upgrade-legacy.mjs:329,1153`, `heal-spec-docs.cjs:597-626` | 2, 4, 5 |
| One generic frontmatter parser or packet walker | Different responsibilities; a shared one would need policy options | `frontmatter-migration.ts:512-547`, `upgrade-legacy.mjs:595-627` | 2, 4 |
| Remove `sortRefusals` | Stable persisted baselines rely on it; no direct order test yet | `upgrade-legacy.mjs:1141` | 2, 4, 5 |
| Remove layout-map states or collision branches | Phase 009 requires partial and complete moves, preview and collision checks | `009-doctor-update-compatibility/spec.md:110-120` | 3, 5 |
| Remove compat approvals, logs, recovery or rollback | Phase 009 specifies each | `doctor-update-compat-action.yaml:79-127` | 3, 5 |
| Remove the close-before-open anchor diagnostic | Phase 013 requires it and a test pins it | `013-anchor-contract-alignment/spec.md:172-174`, `anchor-contract.vitest.ts:185-198` | 3 (proposed), 5 (eliminated) |

---

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none. Convergence mode was `default` and the stop policy was max-iterations.
- Pivot failures and audited overrides: none.
- Remaining frontier: outside consumers of the healer CLI, and whether any workflow runner treats `step_failure` and `on_step_failure` differently.

The run covered the frontier it set out to cover. Breadth is not convergence: candidate 2's AC-019 dependency came from the synthesis-time search, not from the loop.

---

## 12. Open Questions and Residual Gaps

- Does any script outside this repository call `heal-spec-docs.cjs --lane-modes --mode` or `--json`? Only the operator can answer that for external tooling.
- Do the two doctor failure fields mean different things to whatever runs the action YAML? No code in the repository reads either name.
- `--roots` and `--folder` on the lane CLI were not examined against the phase specs. AC-019's procedure uses `--roots`, so it has a caller.
- `frontmatter-migration.ts` beyond the parser and its exports, and phase 003's test additions, got only light coverage. No candidate surfaced there, but absence of a finding there is weaker than in the files read closely.

---

## 13. Implementation Handoff

A follow-up packet would edit `heal-spec-docs.cjs` (selector removal), `heal-lane-modes.vitest.ts` (drop the unknown-selector assertion), the spec CLI `README.md` (lines 113 and 271 plus the Heal Lane Modes subsection) and, only if candidate 2 goes ahead, phase 015's AC-019 evidence wording. `upgrade-legacy.mjs` needs no change for either candidate, since it never passes a mode list.

---

## 14. Verification Matrix

| Claim | How it was checked |
|---|---|
| `--mode` selector and `--json` branch exist as described | Orchestrator read `heal-spec-docs.cjs:1328-1403` at synthesis |
| Production upgrade caller passes no mode list | `upgrade-legacy.mjs:881` read at synthesis |
| `--json` has a recorded caller | Repository search found `015-lane-rules-as-heal-modes/acceptance-criteria.md:72` |
| Close-before-open is required and pinned | `013/spec.md:172-174` and `anchor-contract.vitest.ts:185-198` read at synthesis |
| The two doctor failure fields overlap | `doctor-update-compat-action.yaml:125-126` and `doctor-update-compat.test.cjs:825-832` read at synthesis |
| Reduction counts | Source-level line counts, not measured diffs |

---

## 15. References

- Iterations: `research/iterations/iteration-001.md` to `iteration-005.md`; deltas `research/deltas/iter-001.jsonl` to `iter-005.jsonl`
- Resource map emitted by this run: `research/resource-map.md`
- Rules: `.skilled/repo-rules/prevent-overengineering.md`, `AGENTS.md` section 3
- Phase specs: `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/{003,009,011,012,013,015}-*/spec.md`
- Prior simplification record: `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/implementation-summary.md:172-177`

---

## 16. Convergence Report

- Stop reason: maxIterationsReached (stop policy max-iterations, operator asked for exactly 5)
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0 tracked; 4 carried-forward residuals in section 12
- newInfoRatio by iteration: 1.0, 0.83, 0.83, 0.625, 0.7
- Convergence threshold: 0.05 (telemetry only under the max-iterations policy)
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

---

## 17. Execution Audit

- Executor: cli-pi, `openai/gpt-6-luna`, `--thinking xhigh`, `--offline`, timeout 900 s, single lineage.
- Iteration 3's first dispatch hit the 900-second timeout after 78 reads and wrote nothing. Per the workflow's redispatch-once rule it was re-run once with a reduced-scope note and passed.
- Write containment flagged 30 phase spec docs during iteration 3's first dispatch. The child's own pi session shows only read, bash and codemode calls, so those edits belong to a concurrent session in the same worktree. The runtime left them on disk and kept quarantine copies under `research/containment/`.
- `PI_BLACKHOLE_PASSIVE` is not on the dispatch env allowlist, so the child's pi-blackhole compaction could not be switched off; no iteration reported a compaction.
- The workflow's `step_stage_artifact_dir` (`git add`) was skipped by operator instruction: no git writes in this worktree.
