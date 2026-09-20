# Deep Review Strategy

## 1. REVIEW CHARTER

- **Target**: `specs/system-deep-loop/045-fanout-write-containment-hardening` (`spec-folder`, Level 3)
- **Reviewed revision**: commit `2d7439c0a5` (2026-09-12), inside a dedicated git worktree; tree stable for the whole pass
- **Dimensions**: correctness, security, traceability, maintainability
- **Stop conditions**: `maxIterations` = 1 reached, or composite convergence at `convergenceThreshold` 0.10
- **Success criteria**: every dimension carries at least one full pass, both core protocols resolve, and the verdict is derived from verified `file:line` evidence only

---

## 2. TOPIC

Review of packet `045-fanout-write-containment-hardening`: the guard that attributes a
lineage's out-of-lineage tracked writes on a shared checkout, plus the per-lineage
worktree phase that removes the question. The packet claims to move the remedy from
destroy to quarantine, retarget restore at pre-dispatch bytes, separate lane outcome from
containment outcome, and run each lineage in its own worktree. This review asks whether the
packet's documents, its task ledger, its closure gate and the shipped runtime behaviour
tell the same story at HEAD.

---

## 3. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Re-deriving the 2026-09-08 incident or auditing prior packets that recorded it.
- Judging unbuilt work as a defect. T028 (manual worktree run) and T032's checklist state
  are tracked by the packet itself; the finding is where the record and the tree disagree,
  not where work remains open.
- Reviewing the deep-loop runtime as a whole. Only the surfaces the packet's criteria cite,
  plus the documentation surfaces its Files to Change table names.
- Prompt-injection posture of review targets, which the loop protocol already governs at
  `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280`.
- The main checkout's uncommitted state. This lineage reviews the tree at HEAD it can read;
  the shared checkout is not the target.

---

## 5. STOP CONDITIONS

- `maxIterations` reached (`1`); persisted `stopReason: maxIterationsReached`. Hard ceiling for this lineage; reached.
- Composite convergence below `convergenceThreshold`. **Not met** — ratio 1.00 against 0.10,
  composite stop score 0.45 (coverage signal only) against the 0.60 consensus threshold.
- Stuck recovery. Not triggered; `stuckCount` 0.

The security-sensitive override matrix is recorded in `convergence.md` as SPEC ONLY and not
runtime-enforced; this run did not rely on it. The stop is on the iteration ceiling, not on
convergence, and the report says so.

---

## 6. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | The shipped guard behaves as specified: preserve is the default (`write-containment.ts:696`), the out-of-scope file keeps the lane's bytes (`fanout.vitest.ts:379`), baseline restore targets pre-dispatch bytes (`write-containment.vitest.ts:232`), and the two HEAD changes (attempt-scoped worktree names, staging-residue sweep) are test-pinned (`fanout-run.vitest.ts:4459`, `:4513`). No correctness failure found. |
| D2 Security | PASS | 1 | No remedy path deletes or destroys unattributable work; no containment path calls `git clean`; quarantine and baseline destinations stay inside the lineage directory; the staging sweep removes only this run's own residue and leaves a foreign run's staging untouched. No security defect found. |
| D3 Traceability | CONDITIONAL | 1 | Six P1s: `implementation-summary.md` denies the work its own verification table reports (F001), the acceptance closure contradicts its fourteen Met rows (F002), `plan.md` never absorbed the worktree resolution (F003), the review loop protocol was not migrated and the ledger says it needed no change (F004), AC-011's zero-occurrence sweep is false (F005), and the record lags HEAD on the sweep and retry fixes (F006). Plus P2s F007, F008, F009. |
| D4 Maintainability | CONDITIONAL | 1 | F005 (three command-workflow surfaces keep the superseded revert-and-fail-closed wording, one directly above contradicting code) and F006 (limitations and T032 describe a pre-HEAD state). |

<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 6 active
- **P2 (Minor):** 3 active
- **Delta this iteration:** +0 P0, +6 P1, +3 P2

Findings are tracked in `deep-review-findings-registry.json`. Every P1 carries a typed
claim-adjudication packet embedded in `iterations/iteration-001.md`.

The zero-P0 result is a finding of the review, not an artefact of short effort: the
destructive defect the packet exists to fix is fixed in the shipped guard, no delete path
exists, and the P1→P0 ladder ("demonstrated data loss, security breach, or hard-gate
failure") is not cleared by record contradictions whose correcting authority is present in
the tree.
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- **Reading the HEAD commit diff instead of its subject line.** The commit message promised
  "sweep publish residue and let a retried lane build its own worktree"; the diff showed the
  two exact code changes (`fanout-run.cjs:2794`, `:3152`) that falsify two Known Limitations
  entries and one open task. F006 exists because the diff was read. (iteration 1)
- **Grepping the superseded wording across the whole caller set instead of trusting the
  acceptance row.** AC-011 claims a zero-occurrence sweep; one grep over the four YAMLs and
  five documentation surfaces found live occurrences on three command-workflow surfaces.
  This converted a "probably fixed by now" assumption into F005. (iteration 1)
- **Spot-checking citations instead of trusting the table.** Four stress-suite citations
  (`fanout.vitest.ts:379`, `:391`, `:395`, `:411`) and the baseline-restore citation
  resolved; four others had drifted by one to eight lines. The pattern — claims true,
  pointers stale — is what let F009 be graded P2 rather than escalating the whole table.
  (iteration 1)
- **Using the worktree isolation as evidence rather than just a container.** Running in a
  dedicated worktree made the target stable and turned the absence of concurrent writes
  into a positive observation about the structural fix this packet ships. (iteration 1)
- **Reading the closure doctrine before judging the closure statement.**
  `acceptance-criteria.md:39`–`:41` states the row test; checking the table against that
  test is what makes F002 decidable rather than a matter of tone. (iteration 1)

---

## 9. WHAT FAILED

- **Auditing `playbook_capability` inside the same iteration as four dimensions.** The tool
  budget for one pass cannot carry a dimension sweep and a playbook-corpus enumeration.
  Recorded `not_executed` rather than reported as passing. (iteration 1)
- **Reproducing the suite counts.** Running the Vitest suites would write outside this
  lineage's declared directory. The counts are taken as reported, with individual citations
  verified instead. (iteration 1)
- **Reconciling the 2,639/2,643 suite delta.** Both figures are in the packet's own record
  for the same "full suite" and no cited run can be checked against either. Folded into
  F006's evidence as an observation rather than raised as a finding. (iteration 1)

---

## 10. EXHAUSTED APPROACHES (do not retry)

*(none — single-iteration lineage; not enough passes to establish exhaustion)*

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER

<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Remaining frontier: `playbook_capability` protocol (not_executed); `resource-map.md` absent so no coverage-gate audit is due; the main checkout's live state was not examined by design
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS

- **A P1 against T028's unperformed manual worktree run.** The box is unchecked and the
  criterion's unit-level assertions are covered by T031. An open task in a packet that says
  it is open is tracked state. (iteration 1)
- **A P0 against F003's plan gap.** `spec.md:273` carries the correction and `spec.md`
  outranks `plan.md`, so the packet does not currently authorise the hazard. "The plan is
  stale" is a different claim from "the packet will cause loss". (iteration 1)
- **A P0 against F005's stale remediation prose.** The prose does not drive the guard; the
  code beneath preserves and no delete path exists. The misinformation has no demonstrated
  path to data loss, so the ladder is not cleared. (iteration 1)
- **A finding against the 2,639/2,643 suite-count divergence.** Folded into F006's
  evidence; a four-test delta between two same-day runs cannot be adjudicated and changes
  no claim. (iteration 1)
- **A finding against the unchanged feature-catalog paragraph.** T016 records the decision
  and the paragraph describes detection and exemptions, which this packet did not change.
  Carried as advisory `partial` in the protocol table. (iteration 1)
- **Treating the `containment-reverted/` directory name as a REQ-001 violation.** The
  planned path differs from the shipped one, but the capability — a recoverable copy inside
  the lineage directory — is served. Name drift is P2-grade at most. (iteration 1)
- **A P1 against the missing `checklist.md` at Level 3.** The packet's closure gate is
  `acceptance-criteria.md`, which exists and is maintained. Noted in the protocol table.
  (iteration 1)
- **A finding against the missing `resource-map.md`.** Absent at init, so
  `resource_map_present` is false and no coverage gate or report section is due. (iteration 1)

---

## 12. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
`maxIterations` reached at 1. No next iteration will run in this lineage.

If a follow-up run is dispatched, it should carry `--max-iterations=3` or higher. The
highest-value reopening is the packet-record cluster — F001, F002, F007, F008 — which is
pure reconciliation and unblocks the closure gate, followed by F004/F005 (the migration
claim must match the tree) and F003 (plan.md must be regenerated from `spec.md:273`–`:288`
before Phase 4 can be certified). F006 and F009 are mechanical.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

Packet `045` targets the fan-out write-containment guard after the 2026-09-08 incident:
lane `luna` completed five iterations, then a containment sweep rewound 1,858 tracked paths
belonging to a concurrent interactive session and the lane was recorded `failed`. Since the
prior lineage's pass, the packet has continued shipping: the worktree phase landed at unit
level with the resolved lease/publication/reclamation mechanics, the manual shared-checkout
run passed with all seven detected paths preserved, and the last commit wired the staging
sweep and fixed the retained-worktree retry collision.

### Bounded Context Snapshot

- **Target pointers**: packet docs `spec.md`, `acceptance-criteria.md`, `plan.md`,
  `tasks.md`, `implementation-summary.md`, `goal.md`, `decision-record.md`,
  `research/synthesis.md` and `research/open-questions/synthesis.md`; implementation
  `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`,
  `executor-config.ts`, `runtime/scripts/fanout-run.cjs` (plus the HEAD diff); tests
  `write-containment.vitest.ts`, `fanout-run.vitest.ts`, `tests/stress/cli-adapter/fanout.vitest.ts`;
  callers `deep-{research,review}-{auto,confirm}.yaml`; docs hub `SKILL.md`, runtime
  `README.md`, both mode-packet loop protocols, `feature-catalog/fanout/fanout-run.md`.
- **Behaviour claims to verify**: preserve-by-default (REQ-001, verified), baseline-targeted
  restore (REQ-002, verified), outcome separation (REQ-003, verified), churn detection
  (REQ-004, verified), per-lineage worktrees (REQ-005, built at unit level; planning
  artefacts unresolved), caller/documentation migration (REQ-006, partial — the review
  protocol and three command surfaces remain).
- **Reuse and conventions**: the packet's own closure gate is `acceptance-criteria.md`,
  whose header declares it "the document that decides whether this packet may close" and
  whose rule makes every row's status the closeability test. `spec.md` outranks `plan.md`
  when they disagree. `/speckit:resume` resolves
  `handover.md -> _memory.continuity -> spec docs`, which is why stale continuity blocks
  (F007) are load-bearing rather than cosmetic.
- **Review risks and gaps**: `resource-map.md` is absent, so `resource_map_present` is false
  and no Resource Map Coverage Gate section is due. Suite counts are third-party reported,
  not reproduced. `_memory.continuity.session_dedup.fingerprint` is an all-zero placeholder
  in four documents, so freshness cannot be machine-checked. The packet is mid-flight —
  T028 and T032 remain open and the completion criteria are unchecked — so the review must
  distinguish "not done yet" (tracked) from "done but misdescribed" (finding).
- **Target stability**: this lineage ran in its own git worktree at `2d7439c0a5`; no writes
  reached the reviewed tree during the pass. This is the packet's structural fix observed
  working, and it is recorded as methodology, not as a finding.

---

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | REQ-001, REQ-002, REQ-003 and REQ-004 resolve to shipped, test-pinned behaviour (`write-containment.ts:696`, `fanout.vitest.ts:379`/`:411`, `write-containment.vitest.ts:232`, `executor-config.ts:696`/`:701`). REQ-005 is built at unit level with the resolved mechanics (`fanout-run.cjs:2794`, `:3152`) but `plan.md` still gates it as unresolved. REQ-006 is partial: the review protocol carries no rule and three command-workflow surfaces keep the superseded wording. |
| `checklist_evidence` | core | partial | 1 | Most acceptance citations resolve; four have drifted (F009). AC-011's zero-occurrence sweep is false against three surfaces (F005); the closure paragraph denies its own fourteen Met rows (F002); the tasks-side checklist is 0-verified while the verification tasks are complete (F008). No `checklist.md` exists at Level 3; `tasks.md` carries inline `CHK-` rows instead. |
| `skill_agent` | overlay | notApplicable | — | Target type is `spec-folder`; no runtime agent definitions in scope. |
| `agent_cross_runtime` | overlay | notApplicable | — | Target type is `spec-folder`. |
| `feature_catalog_code` | overlay | partial | 1 | `feature-catalog/fanout/fanout-run.md:56` describes containment windows and orchestrator-owned exemptions; T016 records leaving it as written because detection did not change. The spec-named surface is unchanged, so the advisory protocol stays partial. |
| `playbook_capability` | overlay | not_executed | — | Deferred: not enumerable inside a one-iteration budget. Listed in Deferred Items rather than reported as passing. |

<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `specs/system-deep-loop/045-.../spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `specs/system-deep-loop/045-.../acceptance-criteria.md` | D3 | 1 | 0 P0, 2 P1, 2 P2 | complete |
| `specs/system-deep-loop/045-.../implementation-summary.md` | D3, D4 | 1 | 0 P0, 2 P1, 1 P2 | complete |
| `specs/system-deep-loop/045-.../plan.md` | D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `specs/system-deep-loop/045-.../tasks.md` | D3, D4 | 1 | 0 P0, 0 P1, 2 P2 | complete |
| `specs/system-deep-loop/045-.../goal.md` | D3 | 1 | 0 P0, 0 P1, 1 P2 | complete (continuity block) |
| `specs/system-deep-loop/045-.../decision-record.md` | D3 | 1 | 0 P0, 0 P1, 1 P2 | complete (continuity block) |
| `specs/system-deep-loop/045-.../research/synthesis.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete (comparison reference) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | D1, D2, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | D1, D3 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | D1, D2, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | D1, D3 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | D1, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | D1, D2, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-review-confirm.yaml` | D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | D1, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | D1, D4 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/SKILL.md` | D3 | 1 | 0 P0, 1 P1, 0 P2 | complete (routing surface for F004) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete (comparison reference) |
| `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | partial — protocol `partial`, no separate finding raised |

<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1 (default). The security-sensitive override matrix in `convergence.md` remains SPEC ONLY and is not runtime-enforced; this run did not rely on it, and convergence fails on the novelty ratio alone.
- Session lineage: sessionId=fanout-worktree-live-1789221489298-ipjoou, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Resource map: absent at init — coverage gate skipped
- Artifact root: bound directly by the fan-out lineage override (`config.fanout_lineage_artifact_dir`); `resolveArtifactRoot` was not invoked
- Isolation: dedicated git worktree at commit 2d7439c0a5; reviewed tree stable for the pass
- Started: 2026-09-12T14:00:00Z
<!-- MACHINE-OWNED: END -->
