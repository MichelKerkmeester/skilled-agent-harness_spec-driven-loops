# Deep Review Iteration 5 — Frontier and Adversarial Re-check

**Iteration**: 5 of 5
**Dimension**: traceability (frontier pass across correctness, security and maintainability)
**Target**: `specs/system-speckit/053-ci-workflow-efficiency`
**Focus**: the surfaces no earlier iteration opened — the parent's open-questions block, the operator-decision ledger, phase 008's blocked task — plus an adversarial attempt to break or downgrade every P1 filed in iterations 1, 2 and 4.

---

## 1. FILES REVIEWED

- `specs/system-speckit/053-ci-workflow-efficiency/spec.md:160-175` — the parent's OPEN QUESTIONS section.
- `specs/system-speckit/053-ci-workflow-efficiency/graph-metadata.json:1-30,195-210` — the derived pointers, including `last_active_child_id`.
- `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md:57` — the answer to the first parent question.
- `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/decision-record.md:45-110,855-865` — ADR-001's D9/R28 answer and the report's stated file count.
- `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/r28-probe.md` — the probe's recorded exit codes.
- `.skilled/commands/doctor/_routes.yaml:355-362` — the toggle route's mutation class.
- `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/tasks.md:83` — `T002 [B]`.
- `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/scratch/phase-result.md` — the sections the AC-014 delta depends on.

---

## 2. ADVERSARIAL RE-CHECK OF THE P1 SET

Each active P1 was re-read against its source with the question "can this be shown to be smaller than filed?".

| Finding | Attempt to downgrade | Outcome |
|---|---|---|
| **R1-P1-001** 007 completion inversion | Looked for a rollback commit, a second workflow tree, or a `.deep-review-pause`-style marker that the phase was abandoned. `git log` shows no revert of the permissions, timeout, switch or Dependabot edits; there is one `.github/workflows` directory; `graph-metadata.json:201` records `last_active_child_id` as `007-workflow-hygiene-on-off-control`, which corroborates that 007 was the phase being worked. A PyYAML parse of all 32 workflows returns `no-timeout []` and `no-switch` listing only Dependabot's two jobs. | **Confirmed P1.** Not raised to P0: the error understates completed work rather than shipping something broken, and no runtime behaviour depends on the packet's prose. |
| **R1-P1-002** parent map stale | Checked whether the map is derived from `graph-metadata.json` (its `derived` block carries trigger phrases, key topics and `last_active_child_id`, not per-child statuses), so nothing regenerates the table. Checked whether the parent might be frozen by design (no freeze note, and the same document carries a live `_memory.continuity` block dated 2026-10-23). | **Confirmed P1.** |
| **R1-P1-003** 004 AC-014 on a false premise | Read `004-.../scratch/phase-result.md` to see whether the 14-row delta table the row wants actually exists. It does not: the file's sections are `## Gate after R12`, `## R14 cold run`, `## R14 warm run`, `## R15 merge`, `## Final gates`, with no delta table. | **Downgraded to P2.** The row is right to be `Unmet` — the delta is genuinely missing — and the narrative at `acceptance-criteria.md:105` says exactly that. The defect is narrower than filed: the row's stated reason ("neither … exists") is false, not its status. Re-emitted at P2 in this iteration's delta. |
| **R2-P1-001** 32-vs-33 handoff criterion | Checked whether "33" could be the pre-merge count the handoff legitimately expects (the 006→009 handoff happens after 004's merge, so the count at handoff time is 32); checked whether a 33rd workflow could sit outside the `*.yml` glob both the gate and the report use (no). | **Confirmed P1.** |
| **R4-P1-001** 007 unmarked task headings | Checked whether the notation table exempts commit tasks (it does not) and whether phase 002 marks its equivalent commit task (`002-.../tasks.md` marks `T014 [x] Commit the change as one commit`). | **Confirmed P1.** |

---

## 3. FINDINGS BY SEVERITY

### P0 Findings

None.

### P1 Findings

None new. Four remain active from iterations 1, 2 and 4 (R1-P1-001, R1-P1-002, R2-P1-001, R4-P1-001).

### P2 Findings

#### R5-P2-001 — The parent's OPEN QUESTIONS block lists two questions its own children have already answered

`spec.md:184-187` holds two open questions:

1. "Are the spec-kit CLI tests safe under `fileParallelism: true`, or does phase 005 need sharding?"
2. "Can the owner's token write repository variables, so that `/doctor:ci` toggle writes rather than prints?"

Both are answered in the packet. Question 1: `005-.../acceptance-criteria.md:57` records the R19 probe's outcome as `outcome: shard` after the parallel probe failed two of three runs, and `:58` records the shard as built — the config keeps `fileParallelism: false` on both projects (`vitest.config.ts:50,67`) and `spec-kit-check.yml:141-152` runs two processes. Question 2: `009-.../decision-record.md:74` states the probe's answer ("`gh variable set` exiting 0 selects `write`"), `009-.../scratch/r28-probe.md` records `set exit=0 … delete exit=0`, and the route carries `mutating: mutates` (`_routes.yaml:361`).

The parent document is the packet's entry point and its only "what is still unknown" surface. A reader who trusts it concludes the packet cannot yet decide two things it has already decided, and neither child's answer is reachable from the parent.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/spec.md:186]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/decision-record.md:74]

#### R5-P2-002 — Phase 009's decision record still describes the report as parsing 33 YAML files

`009-.../decision-record.md:861` reads "The report parses 33 YAML files, resolves six variables and walks a run list." The tree holds 32 workflow files, the report's own acceptance row requires its count to equal the `glob('.github/workflows/*.yml')` result (`009-.../acceptance-criteria.md:61`, whose observed value is `32 32`), and the packet's standard records 32 as well (`sk-code-ci/references/ci-workflow-standards.md:37`). This is the same pre-merge count as R2-P1-001, now inside the decision record that a later reader would cite as the reason the report is shaped as it is.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/decision-record.md:861]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/acceptance-criteria.md:61]

#### R5-P2-003 — R1-P1-003 downgraded: the phase-004 delta table is genuinely missing

Adjudication record for the re-check in section 2. R1-P1-003 was filed at P1 for an `Unmet` row resting on "neither `scratch/phase-baseline.md` nor `scratch/phase-result.md` exists". Both files exist, which remains true and remains a defect in the row's evidence text. But the substantive gap the row is gating on — a 14-row phase delta — is absent: `004-.../scratch/phase-result.md` holds five sections and no delta table, and `004-.../acceptance-criteria.md:105` describes the same gap accurately.

So the phase is correctly `Unmet` and correctly `Closeable: No`; what is wrong is one clause of evidence, not the gate. P2.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/acceptance-criteria.md:73]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/scratch/phase-result.md:78]

---

## 4. TRACEABILITY CHECKS

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Both parent open questions are answered in the children and unanswered in the parent; the 32-vs-33 count recurs in 009's decision record. |
| `checklist_evidence` | core | partial | 005's AC-001/AC-002 and 009's AC-001/AC-002 carry the evidence that answers the parent's questions; the parent carries no pointer to either. |
| `skill_agent` | overlay | notApplicable | No skill or agent document is in this iteration's scope. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in scope. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog entry is claimed. |
| `playbook_capability` | overlay | notApplicable | No playbook is claimed. |

Operator-decision ledger check: D1-D7 and D10 are recorded with answers and each is honoured in the tree (D1's token at `trigger-index-rebuild.yml:151`, D2's PR-only cancel at 30 workflows, D5's merge at `opencode-plugin-tests.yml`, D6's 10-minute floor across 44 jobs, D7's `fetch-depth: 2` at `deep-loop-runtime.yml:47`). D8 is pending by design — `008-.../tasks.md:83` carries `T002 [B]` and the phase is `Planned` with 0 of 9 rows `Met`. D9 is answered by 009's probe. No decision is silently unanswered.

---

## 5. RULED OUT

- **A P0 is hiding in the remaining frontier.** Ruled out: the four remaining P1s were each re-read against source and none became a correctness or security failure; the two frontier findings are parent-level prose staleness.
- **Phase 008 is stale rather than blocked.** Ruled out: `T002 [B]` names its blocker (the post-007 inventory) and the phase's 0 of 9 `Met` rows match `Planned`.
- **The operator decisions are unrecorded or contradicted by the tree.** Ruled out: nine of ten carry an answer and a matching implementation; D8 is explicitly deferred to phase 008 with measured numbers.
- **The D9 probe was assumed rather than run.** Ruled out: `009-.../scratch/r28-probe.md` records `set exit=0`, `get exit=0`, `delete exit=0`, `get-after-delete exit=1`, and the route's mutation class matches the `write` outcome.

---

## 6. VERDICT

No new P1 and no P0 in this iteration: three P2s — the parent's open-questions block, one more 33-instead-of-32 in 009's decision record, and the recorded downgrade of R1-P1-003 after its gate turned out to be genuine. The packet-level verdict is carried by the four P1s still active from iterations 1, 2 and 4 and remains CONDITIONAL at synthesis.

Review verdict: PASS
