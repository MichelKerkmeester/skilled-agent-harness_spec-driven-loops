---
title: "Feature Specification: Playbook family remediation"
description: "Phase parent for the playbook remediation program: bring every manual-testing-playbook in the skill fleet to zero operator-scenario contract violations, and put each cleaned package under fail-closed enforcement."
trigger_phrases:
  - "playbook family remediation"
  - "playbook contract violations to zero"
  - "manual testing playbook fleet cleanup"
  - "fail-closed playbook graduation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Grouped the sk-code, transport, deep-loop and graduation phases of the cleanup"
    next_safe_action: "None; all four child phases complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:5cefa0006c260b59d9c43193e92426e34650f79d00a6ce9958621edad7ce8cda"
      session_id: "2026-08-29-sk-code-031"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration narratives and reorganization history
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Playbook family remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Packet Type** | Phase parent (lean trio) |
| **Children** | 4 (001, 002, 003, 004) |
| **Active Child** | 004-fail-closed-graduation |
| **Successor** | `038-authoring-hardening` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Manual testing playbooks are the only executable statement of what each skill package promises an operator. Across the skill fleet they had drifted far enough that the grader reported roughly 2,600 operator-scenario contract violations, and the build stayed green through all of it. A backlog that large is not a run of individual authoring mistakes; it is what accumulates when nothing blocks. Two mechanisms let it grow unseen. The corpus manifest carried a `warnPackages` grandfather list of ten packages, and every violation inside a listed package was downgraded to a non-blocking warning. And a single fleet run resolves a nested package to its parent identifier, so a sub-package inherited its parent's warn entry and stopped blocking without anyone choosing that.

### Purpose

Bring every manual-testing-playbook in the skill fleet to zero operator-scenario contract violations, and put each cleaned package under fail-closed enforcement so the state it reached is the state it has to keep. The remediation is split by package family, because the families failed for different reasons and each reason needed its own reading rather than a shared find-and-replace: the sk-code family had imported a grading vocabulary the validator forbids, the transport families had structural gaps at scale, and the deep-loop and spec-kit family carried two distinct single-cause defects behind large counts. The fourth phase is the part that makes the first three durable: empty the grandfather list, name every cleaned root in a fail-closed allowlist, and assert in CI that each named root is still actually scanned.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, decisions, verification evidence, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Every `manual-testing-playbook/` root in `.opencode/skills/` held to the operator-scenario contract, across four package families.
- `playbook-corpus-manifest.json`, specifically its `warnPackages` grandfather list.
- `playbook-failclosed-allowlist.txt` and the CI workflow that enforces it per root.
- Re-measurement of each root with `validate-playbook-package.cjs --package <root> --strict` after remediation.

### Out of Scope

- The validator itself, the authoring templates, and the enforcement gate's own defects. Those are the subject of `038-authoring-hardening`, which this packet depends on for two of its fixes.
- The routing-gold contract and the `routingGoldRoots` exclusions. Roots and files classified routing-gold stay excluded from the operator-scenario contract throughout; no root was moved into or out of that list to change a count.
- Coverage expansion of the two sk-code surface playbooks, which were already at zero violations. That work is `034-surface-playbook-expansion`.
- Any change to what a playbook scenario must contain. The contract is unchanged; only the documents graded against it are.

### Files to Change

Summary of aggregate scope for audit trail only. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-code/**/manual-testing-playbook/**` | Modify | 001-sk-code-family | Five dirty roots in the sk-code family taken to zero |
| `.opencode/skills/cli-external-orchestration/*/manual-testing-playbook/**` | Modify | 002-cli-and-mcp-transports | Six CLI transport roots taken to zero |
| `.opencode/skills/mcp-tooling/*/manual-testing-playbook/**` | Modify | 002-cli-and-mcp-transports | Eight MCP tooling roots taken to zero |
| `.opencode/skills/system-deep-loop/**/manual-testing-playbook/**` | Modify | 003-deep-loop-and-spec-kit | The deep-loop parent and its four mode packets |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/**` | Modify | 003-deep-loop-and-spec-kit | The largest single root in the fleet |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json` | Modify | 004-fail-closed-graduation | Grandfather list emptied as each package reached zero |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modify | 004-fail-closed-graduation | The 41 roots held as a blocking gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, decisions, verification, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-sk-code-family/ | Seven sk-code roots, five of them dirty at 586 violations. The largest single class was a forbidden grading vocabulary imported by a prior literal alignment to sk-doc, not an authoring slip. | Complete |
| 2 | 002-cli-and-mcp-transports/ | Fourteen transport roots at 2,158 violations: six CLI orchestration packages and eight MCP tooling packages. One defect found here was not a document defect at all and was fixed in the validator instead. | Complete |
| 3 | 003-deep-loop-and-spec-kit/ | Eight roots including the fleet's largest. Two of the biggest counts turned out to be single-cause: one stale section vocabulary and one shared boilerplate line. | Complete |
| 4 | 004-fail-closed-graduation/ | The grandfather list emptied to nothing, all 41 roots named in a fail-closed allowlist, and a CI assertion that each named root is still discovered by the scan. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sk-code-family | 002-cli-and-mcp-transports | Every sk-code root reports zero violations under its own `--package` run, and the hub's routing-gold exclusion is unchanged | Per-root `--package <root> --strict` at `violations=0`; hub census still reports one routing-gold-excluded file |
| 002-cli-and-mcp-transports | 003-deep-loop-and-spec-kit | All fourteen transport roots report zero violations, and no document was contorted to satisfy a grader defect | Per-root `--package <root> --strict` at `violations=0`; the sample-code workaround reverted |
| 003-deep-loop-and-spec-kit | 004-fail-closed-graduation | All eight roots report zero violations, including the fleet's largest at 422 scenarios | Per-root `--package <root> --strict` at `violations=0` |
| 004-fail-closed-graduation | (none; packet complete) | The grandfather list is empty, every root is allowlisted, and a root leaving scan range fails the build rather than silently passing | Fleet run at `warn_packages=` empty, 41 packages, `violations=0`, exit 0; injected violation turns the gate red and restoring turns it green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The starting figures do not reconcile with each other, and no phase can re-derive them now that every root is at zero. The fleet-level record reads roughly 2,600 violations across 23 dirty roots of 41 total, with 18 roots measurably clean at the start. The per-root starting counts recorded inside the four children sum to 4,765 across 27 named dirty roots, and phase 003's own headline figure of 1,352 does not equal the sum of its own per-root list, which is 2,021. The source record does not say which census each figure was taken from, so the relationship between them is UNKNOWN and is deliberately left unreconciled rather than smoothed over by arithmetic. Every ending figure in this packet is a re-measurement and does reconcile.
- Which package's sample JavaScript carried the space-inserted workaround described in phase 002 is UNKNOWN; the source record names the shape of the edit but not its location. What is confirmed is the present state: the spaced form no longer appears anywhere under `.opencode/skills/`.
<!-- /ANCHOR:questions -->

---

## 5. HOW THIS RECORD WAS MEASURED

Three things about how this packet was produced belong in the record, because a remediation packet that keeps only its successes teaches nothing to whoever reads it next.

**The counts are re-measurements, not self-reports.** Every ending figure in the four children was measured by the coordinator with `validate-playbook-package.cjs --package <root> --strict`, reading the full census line rather than the exit code. None of them is a number an agent reported about its own work. That matters most in phase 003, where half the roots were finished by a second agent that did not start them.

**A workaround contorted real source before the cause was understood.** Two remediation agents made a false positive stop firing by inserting a space into sample JavaScript, in the shape `hooks['x'] (...)`. The grader was reading bracket-then-parenthesis inside a fenced code sample as a markdown link; the sample was correct and was made wrong to make a report green. It was reverted once the grader was fixed at its root in `038-authoring-hardening`. The record is kept because this is the real cost of a false positive: not the wasted reading, but the pressure it puts on whoever has to make the number fall.

**Four agents died mid-run and the work survived.** An organisation-side API block returned `oauth_org_not_allowed`, with subscription access disabled for `claude-sonnet-5`, and terminated four remediation agents where they stood. Work already written to disk survived, so nothing had to be redone; the agents were relaunched on the inherited model and completed their roots. The progress banked at the point of failure was `system-spec-kit` from 918 down to 514, `deep-improvement` from 123 down to 9, and `deep-research` from 19 down to 0.

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec, plan, tasks, and implementation summary
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Successor packet**: `../038-authoring-hardening/` — this packet is the cleanup; that one is the reason it cannot recur. It repairs the authoring templates that generated the omissions, the validator false positives that punished correct documents, and the per-root enforcement gate. Two fixes in this packet's phases 002 and 004 depend on it.
- **Sibling packet**: `../034-surface-playbook-expansion/` — the coverage expansion of the two sk-code surface playbooks that were already at zero violations when this packet started.
