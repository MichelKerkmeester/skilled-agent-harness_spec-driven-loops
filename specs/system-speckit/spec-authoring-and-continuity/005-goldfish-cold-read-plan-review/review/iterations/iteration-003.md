# Review Iteration 003 — traceability

**Dispatcher:** `/deep:review` (auto, max-iterations stop policy), iteration 3 of 5.
**Dimension:** traceability (D3). Maintainability (D4) remains.
**Operator review focus:** the uncommitted child-phase 002–006 implementation judged against each child's `spec.md` and `acceptance-criteria.md`. This iteration covers the spec/checklist/documentation half of that focus; the code-shape half is D4.
**Budget profile:** verify (11 analysis actions, 9 tool calls before writes).

---

## 1. FILES REVIEWED

- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md:126-143,150-155,174,183`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/implementation-summary.md:13,21`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/003-refuse-single-lineage-fanout-run/acceptance-criteria.md:55-66`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/spec.md:23,114`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/acceptance-criteria.md:44-61`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/implementation-summary.md:13,21,107`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/tasks.md:62,124,126`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/acceptance-criteria.md:44-65`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/implementation-summary.md:85,116`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md:64-68`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md:14,16,22,24,105,116`
- `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/build-evidence.md:140-157`
- `.skilled/skills/system-spec-kit/SKILL.md:94`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3390-3420`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:44-57`
- `.skilled/commands/deep/review.md:98`, `.skilled/commands/deep/research.md:126`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:88,137`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:71,109`
- `.skilled/agents/*.md` (directory listing plus a policy-term search across all twelve definitions)

---

## 2. FINDINGS - NEW

### P0 Findings

None.

### P1 Findings

None. (One candidate — the 006 checklist contradiction — was adjudicated down to P2 because the packet discloses its own blocked state; see finding 4 and the Edge Cases entry.)

### P2 Findings

1. **Phase 4's implementation summary still declares its own closure blocked after the criterion closed** -- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/implementation-summary.md:107 -- The summary body reads "T006's recorded no-update output reports 12 passing tests, but the process exit status was not captured ... AC-002 remains Unmet until that status is known. No source file was changed during this closeout." Three other places in the same packet now say the opposite: `acceptance-criteria.md:61` marks AC-002 `Met` citing `../scratch/build-evidence.md:152`, `spec.md:23` records `Status: Complete`, and the summary's own frontmatter records `completion_pct: 100` with `recent_action: "Recorded final implementation and closeout evidence"` (`implementation-summary.md:13,21`). `build-evidence.md:152` does contain the captured rerun (`exit=0 | Tests 12 passed (12) | obsolete-or-written lines: 0`), so the body text is stale rather than wrong about the world. A cold reader following the summary's own closeout note will re-open a packet that is closed.
Finding class: documentation/closure-state reconciliation
Scope proof: all four citations are inside the declared target; the contradictory sentences and the captured exit are quoted from the reviewed files.
Affected surface hints: `reference`: the packet's implementation-summary template usage; `resource`: `/speckit:resume` and any completion-gate read of 004.
Case: an operator resumes Phase 4, reads implementation-summary.md front to back, and treats `AC-002 remains Unmet` as live status, re-running T006 or blocking parent closure.

2. **The parent phase map still marks every implementation phase Pending while four of six children report closed** -- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md:133-137 -- Rows 2–6 read `Pending`, and the prose at `spec.md:142` states "Phases 2 through 6 remain Pending until their scoped work and checks pass", with `spec.md:183` repeating that the map keeps "the five implementation phases Pending". Current child state: 002 `completion_pct: 100`, 003 `completion_pct: 100`, 004 `Status: Complete` (`spec.md:23`) and 100, 006 `completion_pct: 96` with all five acceptance rows `Met`, 005 `completion_pct: 75` / Draft / AC-001 `Unmet`. `spec.md:143` still tells a resume to start at Phase 2, which is closed. Five of six lines are stale; only 005's `Pending` matches its child.
Finding class: traceability/status drift
Scope proof: parent rows and child status fields are both quoted from the target; no inference beyond the numeric field values.
Affected surface hints: `resource`: `/speckit:resume` entry path named at parent `spec.md:143`; `reference`: parent phase map as the aggregate progress view.
Case: an operator resumes the track from the parent map, is sent to a closed phase, and cannot tell from that map that only Phase 5 is actually open.

3. **The new one-lineage refusal and its opt-in are absent from every capability surface that documents the runner** -- .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:52-56 -- The catalog's "Default policy" paragraph still describes only the routing rule (0–1 executor → `config.executor`; 2+ → `config.fanout`). A search for `allow-single-lineage`, `expands to one lineage` and `one lineage` across the four operator-facing surfaces (`.skilled/commands/deep/review.md`, `.skilled/commands/deep/research.md`, both `*-presentation.txt`) and the catalog returns hits only on the routing sentence, never on the refusal or the opt-in. The behavior exists at `fanout-run.cjs:3400-3407` and is tested at `fanout-run.vitest.ts:2536-2543`, so the capability is real but undocumented where an operator would look to recover from exit 3.
Finding class: traceability/feature-catalog parity
Scope proof: the negative is a whole-set search over the four named surfaces plus the catalog, not a single-file read; the guard lines are quoted from the runner.
Affected surface hints: `reference`: `deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md` §2; `resource`: the CLI fan-out path a direct caller constructs by hand.
Case: an operator hand-builds a one-entry executor config, hits `fan-out refused: this research executor matrix expands to one lineage`, and finds no documented route back to the single-executor workflow or to `--allow-single-lineage`.

4. **Phase 6 marks all five criteria Met while its summary records an unresolved P1 checklist conflict** -- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md:116 -- The summary states "The packet remains Draft because CHK-012 is an unresolved P1 checklist item. REQ-001 requires changing the plan_clarity row inside quality_gates, while CHK-012 says that entry remains unchanged" (`implementation-summary.md:16,105,116`), with `next_safe_action: "Resolve CHK-012 wording before closing the packet"` (line 14) and the same conflict raised as an open question (line 24). `acceptance-criteria.md:64-68` marks AC-001 through AC-005 `Met`. The diff evidence in `build-evidence.md:145` shows the change is scoped to the `plan_clarity` row, so the implementation matches REQ-001; what stays open is CHK-012's literal wording, which no document has amended. The acceptance table (the closure gate) and the summary (the honesty record) disagree about whether the packet can close.
Finding class: traceability/checklist-evidence contradiction
Scope proof: both sides quoted from within the target; the corroborating diff note is quoted from the target's scratch evidence.
Affected surface hints: `resource`: the 006→parent handoff criterion at parent `spec.md:155`; `documentation`: CHK-012 wording in 006 `tasks.md`.
Case: a closure check reads only `acceptance-criteria.md`, sees five `Met` rows, and closes Phase 6 while the unresolved CHK-012 conflict travels into the parent packet.

**Finding 4 adjudication (compact skeptic/referee):** *Skeptic:* the packet does not hide the conflict — the summary, the next safe action and an open question all name it, so no reader who opens the summary is misled. *Referee:* correct, which is why this is not P1: the failure needs a reader who consults only the acceptance table. The conflict itself is real and unresolved, and the parent handoff at `spec.md:155` is the named reach. Severity stays P2; it becomes P1 if the 006 packet is presented as closeable or the parent closure runs before the wording is reconciled.

---

## 3. TRACEABILITY CHECKS

| Protocol | Level | Result | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | `SKILL.md:94` carries the exact REQ-002 sentence from 004 `spec.md:114`; 003 AC-001/AC-002 both `Met` with resolving test-line citations (`acceptance-criteria.md:61-62` → `fanout-run.vitest.ts:2536,2537,2540,2543,2572,2573`); runner guard present at `fanout-run.cjs:3400-3407`. |
| `checklist_evidence` | core | partial | 004 AC-002 moved `Unmet`→`Met` against `build-evidence.md:152` but its summary body was not reconciled (finding 1); 005 AC-001 remains honestly `Unmet`; 006 all rows `Met` against an open CHK-012 (finding 4). |
| `skill_agent` | overlay | pass | `.skilled/skills/system-spec-kit/SKILL.md:94` binds a plan-or-implement request to `references/workflows/spec-authoring-card.md`, which is the Phase-5 outcome; the card file exists at the path the sentence names. |
| `agent_cross_runtime` | overlay | pass (bounded) | A policy-term search across all twelve `.skilled/agents/*.md` definitions returns zero references to `fanout`, `single-executor`, `config.fanout` or `config.executor`, so no agent definition restates the policy this change alters. Limitation: runtime mirrors under `.claude/agents/` and `.pi/agents/` were not enumerated this iteration. |
| `feature_catalog_code` | overlay | partial | `fanout-dispatch.md:52-56` matches the routed policy but omits the refusal/opt-in added at `fanout-run.cjs:3400-3407` (finding 3). |
| `playbook_capability` | overlay | pass (bounded) | The installed `system-spec-kit` skill has no `playbooks/` directory (`references/` = cli, config, debugging, memory, retrieval, structure, templates, validation, workflows); the closest live capability playbook, `references/workflows/quick-reference.md`, carries the `spec-authoring-card` pointer, and no playbook restates the executor policy. |

---

## 4. INTEGRATION EVIDENCE

Exact surfaces reviewed for this change set:

- `.skilled/commands/deep/review.md:98` and `.skilled/commands/deep/research.md:126` — the one-lineage → `config.executor` sentence is present on both command pages.
- `.skilled/commands/deep/assets/deep-review-presentation.txt:88,137` and `.skilled/commands/deep/assets/deep-research-presentation.txt:71,109` — the same routing sentence on both presentation assets, each with the write-`config.executor` step.
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:52-56` — routing sentence present; refusal absent (finding 3).
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397-3407` — guard, message and the `loopType` pair it applies to.
- `.skilled/skills/system-spec-kit/SKILL.md:94` — authoring-card entry sentence (004 REQ-002).
- `.skilled/agents/*.md` — no fan-out policy statement to update.

---

## 5. EDGE CASES

- **Dispatch/strategy agreement.** Unlike iteration 2, the dispatched dimension (`traceability`) matched the strategy's Next Focus exactly, so no post-hoc reconciliation was needed.
- **Registry dedup basis.** The findings registry was not re-read this iteration (budget). Dedup rests on the strategy's Files-Under-Review table, which attributes the seven prior P2 to correctness and security (runner ×3, command pages ×2, presentations ×2), and on cross-reference rows that still list the three overlays as `pending`. Findings 1–4 are new traceability claims and none restates a swept direction.
- **006 CHK-012 contradiction (disclosed, not resolved).** The packet tells the truth about its own block, so it is reported as finding 4 rather than escalated as a hidden defect. The underlying conflict is a requirements contradiction: REQ-001 requires editing inside `quality_gates` while CHK-012's literal text forbids changing that entry. It needs an operator decision — amend CHK-012, or supersede it with a decision record — before Phase 6 can hand off to parent closure. Choices: amend the checklist wording, record a decision, or leave the packet Draft.
- **004's failure-path task ordering.** `tasks.md:62` (T006) is ticked and `tasks.md:124` (CHK-021) cites the captured exit, so the task layer and the acceptance layer agree; only the summary body lags. The finding is scoped to the summary, not to the evidence chain.
- **Playbook protocol surface.** No `playbooks/` directory exists in this installation, so the protocol was checked against `references/workflows/quick-reference.md` and reported as bounded rather than as a pass over a non-existent surface.

---

## 6. CONFIRMED-CLEAN SURFACES

- `.skilled/skills/system-spec-kit/SKILL.md:94` — carries the REQ-002 sentence verbatim, satisfying 004's `spec_code` check.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397-3399` — the new guard comment states the durable why ("One lineage is not a fan-out ... a CLI lineage would then run every iteration in one process") with no spec path, requirement id, checklist id or task id, so the comment-hygiene rule holds on the reviewed change.
- `005-point-chat-sessions-at-authoring-card` — `acceptance-criteria.md:62` (`Unmet`), `implementation-summary.md:85,116` (blockers, `completion_pct: 75`) and the `Draft` status agree with each other; the one genuinely open child is the one child whose docs are internally consistent.
- `003-refuse-single-lineage-fanout-run` — both criteria `Met`, each citing a resolving test line plus a final full-suite result; no drift between criteria, summary and tasks.
- `.skilled/agents/*.md` — no agent definition states the executor-matrix policy, so `agent_cross_runtime` has no surface to drift on for this change.

---

## 7. RULED OUT

- **Agent-definition drift from the one-lineage policy.** All twelve `.skilled/agents/*.md` definitions were searched for `fanout`, `single-executor`, `one lineage`, `config.fanout` and `config.executor`; zero hits, so no agent doc needs the 002/003 wording.
- **Playbook capability drift.** No `playbooks/` directory exists under the installed skill, and the only `references/` file naming the authoring card is `quick-reference.md`, which does not describe executor routing.
- **005 hobbyist status drift.** Its `Draft` status, `Unmet` AC-001 and 75% completion all agree; the reported gap is real and self-consistent rather than stale.
- **004 task-layer drift.** T006 is ticked and CHK-021 carries the captured exit, so the task evidence chain is intact; the drift is confined to the summary body (finding 1).
- **Command-page routing drift.** Both `review.md` and `research.md` state the one-lineage → `config.executor` rule at the same granularity as the two presentation assets; no page contradicts another.

---

## 8. NEXT FOCUS

- Dimension: maintainability (D4).
- Focus area: the shape and cost of the reviewed change — the four-surface duplication of the routing sentence as a drift vector (it already produced finding 3), the guard's placement and message construction in `fanout-run.cjs:3397-3417`, the duplicated branch for the `stopPolicy` check that follows it, and whether the packet's stale-summary class (findings 1, 2, 4) has a structural cause in the closeout template rather than in one author's omission.
- Reason: traceability closed with four P2; the remaining repeated-cost question is maintainability, and the duplication finding is the strongest lead it inherits.
- Rotation status: D1, D2 and D3 complete; D4 remaining.
- Blocked/productive carry-forward: eleven active P2 advisories carried; the two deferred security leads from iteration 2 still need an `expandLineages` label read and a single-executor `configDir` read before any verdict above PASS is claimed.
- Required evidence: `expandLineages` and the single-executor `configDir` validation path, the four copy sites of the routing sentence, the guard's surrounding control flow, and the implementation-summary template's closeout section.
- Recovery note: none; this iteration completed normally.

---

## 9. SCOPE VIOLATIONS

None. Only the iteration narrative, the strategy file and the delta stream were written; no reviewed file was modified.

---

Review verdict: PASS
