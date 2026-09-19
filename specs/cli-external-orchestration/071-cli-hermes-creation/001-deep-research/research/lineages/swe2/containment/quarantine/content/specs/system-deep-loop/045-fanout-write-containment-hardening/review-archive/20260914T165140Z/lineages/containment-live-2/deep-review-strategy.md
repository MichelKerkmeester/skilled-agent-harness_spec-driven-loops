# Deep Review Strategy

## 1. REVIEW CHARTER

- **Target**: `specs/system-deep-loop/045-fanout-write-containment-hardening` (`spec-folder`, Level 3)
- **Dimensions**: correctness, security, traceability, maintainability
- **Stop conditions**: `maxIterations` = 1 reached, or composite convergence at `convergenceThreshold` 0.10 with `minStabilizationPasses` satisfied
- **Success criteria**: every dimension carries at least one full pass, both core protocols resolve, and the verdict is derived from verified `file:line` evidence only

---

## 2. TOPIC

Review of packet `045-fanout-write-containment-hardening`: the guard that attributes a
lineage's out-of-lineage tracked writes on a shared checkout. The packet claims to move the
remedy from destroy to quarantine, retarget restore at pre-dispatch bytes, separate lane
outcome from containment outcome, and add per-lineage worktrees. This review asks whether
the packet's documents, its shipped runtime behaviour, and its own closure gate agree with
each other.

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
- Judging unbuilt work as a defect. `AC-002`, `AC-009`, `AC-010` and `AC-011` are recorded
  `Unmet` by the packet itself; an unbuilt deliverable in a partially-landed packet is
  tracked state, not a finding.
- Reviewing the deep-loop runtime as a whole. Only the surfaces the packet's criteria cite,
  plus the documentation surfaces its Files to Change table names.
- Prompt-injection posture of review targets, which the loop protocol already governs at
  `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280`.

---

## 5. STOP CONDITIONS

- `maxIterations` reached (`1`). Hard ceiling for this lineage; reached.
- Composite convergence below `convergenceThreshold`. **Not met** — ratio 0.70 against 0.10.
- Stuck recovery. Not triggered; `stuckCount` 0.

Convergence was additionally unreachable on the security-sensitive override:
`minStabilizationPasses = 2` applies because this target touches path handling, env
precedence, schema boundaries and shared policy, and one pass cannot satisfy it. The stop
is on the iteration ceiling, not on convergence, and the report says so.

---

## 6. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Shipped guard behaves as specified: preserve is the default (`write-containment.ts:782`) and the out-of-scope file keeps the lane's bytes (`fanout.vitest.ts:379`). No correctness failure found. |
| D2 Security | PASS | 1 | No remedy path deletes or destroys unattributable work; no containment path calls `git clean`; the quarantine/baseline destinations stay inside the lineage directory. No security defect found. |
| D3 Traceability | CONDITIONAL | 1 | Four P1s: `implementation-summary.md` carries a passing verification table above a body that says nothing was built (F001), the closure block contradicts its own table (F002), `plan.md` predates the research it should have absorbed (F003), and the review protocol was not migrated (F004). |
| D4 Maintainability | CONDITIONAL | 1 | One P1 (F005, superseded containment wording in three YAML surfaces) and one P2 (F006, stranded probe markers in `tasks.md`). |

<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 5 active
- **P2 (Minor):** 2 active
- **Delta this iteration:** +0 P0, +5 P1, +2 P2

Findings are tracked in `deep-review-findings-registry.json`. Every P1 carries a typed
claim-adjudication packet embedded in `iterations/iteration-001.md`.

The zero-P0 result is a finding of the review, not an artefact of short effort: the
destructive defect the packet exists to fix is fixed in the shipped guard, and the P1→P0
ladder ("demonstrated data loss, security breach, or hard-gate failure") is not cleared by
a documentation contradiction whose correcting authority is present in `spec.md`.
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- **Spot-checking every acceptance-criteria citation against source instead of trusting the
  suite counts.** Ten citations were resolved by exact line, and every one landed on the
  assertion the criteria claim. This converted "is the criteria table optimistic?" from an
  open question into a settled fact, which is what made F001 and F002 decidable rather than
  speculative. (iteration 1)
- **Killing the "predates the packet" hypothesis before raising F001.** Checking whether the
  runtime code was borrowed evidence — AC-004 cites the containment block that `tasks.md:38`
  attributes to T002 — settled the finding instead of leaving a plausible alternative. (iteration 1)
- **Using modification times as an independent signal for F003.** Content grep (`liveness`,
  `negative control`, `sweep` absent from `plan.md`) and mtime ordering (`plan.md` 2026-09-08
  vs `research/synthesis.md` 2026-09-11) are separately observable and agree. (iteration 1)
- **Reading the shipped code before the claims about it.** `write-containment.ts:782`,
  `:807` and `:711` established what actually runs, which is what makes the stale YAML prose
  in F005 a contradiction rather than a matter of taste. (iteration 1)

---

## 9. WHAT FAILED

- **Auditing `playbook_capability` inside the same iteration as four dimensions.** The tool
  budget for one pass cannot carry a dimension sweep and a playbook-corpus enumeration.
  Recorded `not_executed` rather than reported as passing. (iteration 1)
- **Reproducing the suite counts.** Running the Vitest suites would write outside this
  lineage's declared directory, which the lineage's write-containment contract forbids.
  The counts are taken as reported, with individual citations verified instead. (iteration 1)

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
- Remaining frontier: `playbook_capability` protocol (not_executed); `resource-map.md` absent so no coverage-gate audit is due
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS

- **A P0 against REQ-001's missing quarantine.** `AC-002` records it `Unmet` and `spec.md:112`
  scopes quarantine to a preserved path, which preserve mode already satisfies. An unbuilt
  deliverable is tracked state; reporting it adds nothing. (iteration 1)
- **A P0 against the absent worktree phase.** `AC-009` records it `Unmet` and `spec.md:273`
  gates it behind two preconditions the packet states itself. (iteration 1)
- **Treating `containment-reverted/` as a REQ-001 path violation.** The directory name
  differs from the planned `containment/quarantine/`, but the capability asked for —
  a recoverable copy inside the lineage directory — is served by `write-containment.ts:711`
  plus the baseline capture. Naming drift is P2-grade at most. (iteration 1)
- **A P1 against the missing `checklist.md` at Level 3.** The packet's closure gate is
  `acceptance-criteria.md`, which exists and is maintained. Noted in the protocol table
  rather than raised as a finding. (iteration 1)
- **A P0 for F003's plan gap.** `spec.md:273` already carries the correction and `spec.md`
  outranks `plan.md`, so the packet does not currently authorise the hazard. "The plan is
  stale" is a different claim from "the packet will cause loss". (iteration 1)

---

## 12. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
`maxIterations` reached at 1. No next iteration will run in this lineage.

If a follow-up run is dispatched, it should carry `--max-iterations=3` or higher, because
this target's security-sensitive classification requires `minStabilizationPasses = 2` and a
one-iteration ceiling can never produce a legal convergence stop. The highest-value reopening
is F001/F002/F007 — reconciling the three documents that disagree about what has shipped —
followed by F003 before Phase 4 of `plan.md` is allowed to start.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

Packet `045` targets the fan-out write-containment guard after the 2026-09-08 incident:
lane `luna` completed five iterations, then a containment sweep rewound 1,858 tracked paths
belonging to a concurrent interactive session and the lane was recorded `failed`.

### Bounded Context Snapshot

- **Target pointers**: packet docs `spec.md`, `acceptance-criteria.md`, `plan.md`,
  `tasks.md`, `implementation-summary.md`, `research/synthesis.md`; implementation
  `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` and
  `executor-config.ts`; tests `write-containment.vitest.ts`, `fanout-pool.vitest.ts`,
  `tests/stress/cli-adapter/fanout.vitest.ts`; callers `deep-{research,review}-{auto,confirm}.yaml`;
  docs hub `SKILL.md`, runtime `README.md`, both mode-packet loop protocols,
  `feature-catalog/fanout/fanout-run.md`.
- **Behaviour claims to verify**: preserve-by-default (REQ-001, partial), baseline-targeted
  restore (REQ-002, verified), outcome separation (REQ-003, verified), churn detection
  (REQ-004, unbuilt), per-lineage worktrees (REQ-005, unbuilt), caller migration (REQ-006,
  partial).
- **Reuse and conventions**: the packet's own closure gate is `acceptance-criteria.md`, whose
  header declares it "the document that decides whether this packet may close". `spec.md`
  outranks `plan.md` when they disagree. `/speckit:resume` resolves
  `handover.md -> _memory.continuity -> spec docs`, which is why stale continuity blocks
  (F007) are load-bearing rather than cosmetic.
- **Review risks and gaps**: `resource-map.md` is absent, so `resource_map_present` is `false`
  and no Resource Map Coverage Gate section is due. The packet is mid-flight — four criteria
  are `Unmet` by its own record — so the review must distinguish "not built yet" (tracked) from
  "built but misdescribed" (finding). Suite counts are third-party reported, not reproduced.
  `_memory.continuity.session_dedup.fingerprint` is an all-zero placeholder in both documents,
  so freshness cannot be machine-checked.
- **Target changed under review**: `implementation-summary.md` was rewritten by a second writer
  in the main checkout at 22:39:04, after this lineage's first read and before its first write
  at 22:42:11. Its Verification table grew from one "Not run" row to five rows reporting 2,539
  passing runtime tests, 54 containment tests, 223 fan-out and pool tests and a passing
  end-to-end stress run; its Known Limitations grew from three entries to five. Every finding
  whose evidence touched that file was re-derived against the post-write bytes. F001 survived
  and strengthened — the contradiction moved inside the file. Two new limitations the packet
  now records against itself (`:111` containment does not run when an earlier gate rejects the
  lane; `:112` the `cli-pi` leaf can emit duplicate state records, blocking the max-iterations
  stop policy on this executor) are disclosed by the packet rather than found by this review,
  and are carried as residual risk in the report rather than as findings.

---

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | REQ-001 preserve half, REQ-002, REQ-003 resolve to shipped test-pinned behaviour. REQ-001's quarantine half, REQ-004 and REQ-005 have no implementation; the patch destination is `containment-reverted/` at `write-containment.ts:711`. |
| `checklist_evidence` | core | partial | 1 | Acceptance-table citations verified exactly; contradicted by `implementation-summary.md:96` reporting every check "Not run". No `checklist.md` exists; the in-scope requirement set does not make one load-bearing here. |
| `skill_agent` | overlay | notApplicable | — | Target type is `spec-folder`; no runtime agent definitions in scope. |
| `agent_cross_runtime` | overlay | notApplicable | — | Target type is `spec-folder`. |
| `feature_catalog_code` | overlay | partial | 1 | `feature-catalog/fanout/fanout-run.md:56` still describes containment windows generally; the preserve-by-default paragraph `spec.md:98` asks for is absent. |
| `playbook_capability` | overlay | not_executed | — | Deferred: not enumerable inside a one-iteration budget. Listed in Deferred Items rather than reported as passing. |

<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `specs/system-deep-loop/045-.../spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `specs/system-deep-loop/045-.../acceptance-criteria.md` | D3, D4 | 1 | 0 P0, 1 P1, 1 P2 | complete |
| `specs/system-deep-loop/045-.../implementation-summary.md` | D3, D4 | 1 | 0 P0, 1 P1, 1 P2 | complete |
| `specs/system-deep-loop/045-.../plan.md` | D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `specs/system-deep-loop/045-.../tasks.md` | D3, D4 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `specs/system-deep-loop/045-.../research/synthesis.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | D1, D2, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | D1, D2, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | D1, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts` | D1, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | D1, D2, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-review-confirm.yaml` | D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | D1, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | D1, D4 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/SKILL.md` | D3, D4 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md` | D3, D4 | 1 | 0 P0, 0 P1, 0 P2 | complete |
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
- Coverage stabilization passes required: 2 (security-sensitive override: this target touches path handling, env precedence, schema boundaries, persistence and shared policy)
- Session lineage: sessionId=fanout-containment-live-2-1789159071284-irnvcb, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Resource map: absent at init — coverage gate skipped
- Artifact root: bound directly by the fan-out lineage override (`config.fanout_lineage_artifact_dir`); `resolveArtifactRoot` was not invoked
- Started: 2026-09-11T22:40:00Z
<!-- MACHINE-OWNED: END -->
