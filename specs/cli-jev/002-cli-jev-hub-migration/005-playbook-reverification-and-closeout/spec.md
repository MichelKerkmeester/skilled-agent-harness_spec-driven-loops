---
title: "Feature Specification: Phase 5: playbook-reverification-and-closeout"
description: "The migration promised to re-run the mode's playbook from its new home and never did: after the move, the transport's 22 recorded scenarios and the hub's three routing scenarios had only been re-cited, the frontmatter-version manifest had drifted past its recorded values, and the run records still pointed at skips and at a promised first execution. This phase re-runs both corpora live, records them in dated reports, reconciles the living docs with what was observed, and closes the program."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "playbook re-verification"
  - "cli-jev closeout"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/005-playbook-reverification-and-closeout"
    last_updated_at: "2026-09-20T16:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Phase specification authored at closeout from the landed re-run"
    next_safe_action: "Operator decision: commit the working tree, or leave it uncommitted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-005-playbook-reverification-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: playbook-reverification-and-closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Closed** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-compiled-fleet-onboarding |
| **Successor** | None |
| **Handoff Criteria** | Both corpora have a dated report with observed verdicts; the living docs name the runs they point at; the frontmatter-version manifest verifies; both packets validate with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the cli-jev hub migration specification.

**Scope Boundary**: The corpus runs and their reports, the living-doc reconciliation that follows from what was observed, the derived-surface regeneration the docs feed, and the program closeout. Not in scope: any change to the transport's contract, the eight hard rules, the JEV scenario ids or the recorded verdicts of earlier runs; any commit or push.

**Dependencies**:
- Phase 004, for a hub that resolves through compiled policy rather than a legacy sentinel — every hub-routing verdict depends on that route existing.
- `jev` on `PATH` (`/Users/michelkerkmeester/.local/bin/jev`, `jev 0.6.2`) plus the stored `official` credential, for the credential-gated half.
- The recorded baseline matrices under the creation packet's `scratch/`, which make the no-key half a comparison rather than a fresh judgement.

**Deliverables**:
- `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/` — the 22-scenario run, its raw captures and the scripts that produced them.
- `cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/` — the hub's first recorded routing run.
- Reconciled run records in both playbook roots, the run index, and the scenario/reference commands that the dispatch preflight was refusing.
- A converged frontmatter-version manifest and a regenerated trigger index.
- Program closeout: phase-005 docs, parent metadata, derived regeneration, recursive validation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The migration moved the transport, decoupled the old hub, and onboarded the new one to compiled serving, but it never executed the thing those changes exist to protect: the mode's own playbook. The transport's 22 scenarios carried verdicts from before the move, the hub's three routing scenarios carried `not run` with a promise to run them at onboarding, and the frontmatter-version manifest had drifted to 38 mismatches as phase 004's edits landed. Re-citing recorded evidence is not re-verification, and a fleet that serves compiled policy while its own corpus is unexecuted is verified by assertion only.

### Purpose
Execute both corpora from the new home, record what they returned, and let the observations — not the intention — decide what the living docs say. Then close the program with every derived surface regenerated over final bytes and both packets validating.

### Current State
Both corpora are recorded with observed verdicts, the docs name the runs they point at, the manifest verifies at 40 ok / 1 skip, and the program's phase map reads complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Executing all 22 transport scenarios from `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/` and the three hub scenarios from `.skilled/skills/cli-jev/manual-testing-playbook/hub-routing/`.
- A second live pass over the dispatch gates, which the move had left failing open until phase 003 repointed them.
- The run records, run index and scenario commands the observations contradicted.
- Regenerating the derived surfaces the documentation edits feed: leaf manifest, trigger index, frontmatter-version manifest, folder descriptions.
- Closing the program packet: phase docs, parent continuity, derived metadata, recursive validation.

### Out of Scope
- Any change to the transport contract, the eight hard rules, the JEV scenario ids, or the verdicts already recorded for earlier runs.
- The dispatch guard's own predicate semantics; the stdin rule's strictness is recorded as a finding, not silently widened.
- Other hubs' stale fleet-count prose, the archived authored resolver and the pre-existing red test files, all recorded as pre-existing.
- Committing or pushing.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/**` | Create | 005 | The 22-scenario run: report plus raw captures and scripts |
| `cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/**` | Create | 005 | The hub's first recorded run |
| `cli-usage/manual-testing-playbook/manual-testing-playbook.md` | Modify | 005 | Stdin-close rule, run record, report pointer |
| `cli-usage/manual-testing-playbook/exit-codes/key-never-echoed-on-error-path.md` | Modify | 005 | The command the dispatch preflight was refusing |
| `cli-jev/manual-testing-playbook/manual-testing-playbook.md` | Modify | 005 | Run record replaces `not run` |
| `cli-jev/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` | Modify | 005 | Success criteria states the observed route, not an execution claim |
| `cli-usage/benchmark/reports/README.md` | Modify | 005 | Run index row |
| `.skilled/skills/cli-jev/**` frontmatter versions | Modify | 005 | Converged through the frontmatter-version engine |
| `frontmatter-version-manifest.json`, `frontmatter-version-manifest.csv` | Modify | 005 | Regenerated repo-wide over final bytes |
| `.skilled/skills/system-spec-kit/runtime/**` trigger index | Modify | 005 | Regenerated so the hub's docs surface under the new path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | Every one of the 22 transport scenarios is executed from the mode's new home, with no row inferred from an earlier report | `probe-matrix.txt` and `probe-surface.txt` show each observable; the report's verdict table carries an evidence cell per id |
| REQ-002 | The no-key rows are reproduced against an *isolated* credential store, because a stored key otherwise resolves ahead of the key check | The unauth half runs with `XDG_CONFIG_HOME` at an empty directory; the durable report names the recipe |
| REQ-003 | The two credential-gated rows are executed live, and no captured stream carries key material | `auth status`/`auth test`/`noul`/`choice`/`score` observed; the value-blind store-token intersection over every capture is `0` |
| REQ-004 | The hub's routing corpus is executed against the compiled front door, not the registration | The four prompts resolve route/defer as authored, and the kill-switch control returns the legacy sentinel |
| REQ-005 | The dispatch gates are re-probed from the new home, one attempt per declared rule | Deny/advisory/approve observed per rule; the eighth rule is documented as a runtime PATH check |
| REQ-006 | Living docs state what was observed, including the commands the preflight refuses | No scenario or run record claims an execution that did not happen; the stdin-close convention is stated once in the root |
| REQ-007 | Derived surfaces are regenerated over final bytes and verify | Leaf manifest unchanged by doc edits; trigger index regenerated; frontmatter versions converged (40 ok, 1 no-frontmatter) and the repo-wide manifest re-derived |
| REQ-008 | Both packets validate and the parent's continuity reflects five closed phases | `validate.sh --strict --recursive` prints `RESULT: PASSED` per folder; the phase map and continuity fields agree |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Evidence |
|----|-----------|----------|
| SC-001 | 22 PASS / 0 FAIL / 0 SKIP from the new home | `benchmark/reports/2026-09-20-post-migration-reverification/skill-benchmark-report.md` §2 |
| SC-002 | Every prior PASS row still passes, field by field | `compare.py` / `compare-surface.py`: 21 probes and 11 sections, 0 differences after scratch-path normalization |
| SC-003 | The hub resolves its own corpus | `hub-routing.txt`: CJ-001/CJ-002 route to `cli-usage`, CJ-003 and the holdout defer, kill-switch returns the sentinel |
| SC-004 | The gates decide rather than fail open | `preflight-probe*.txt`: five deny decisions, two advisories, eight approvals |
| SC-005 | A key never reaches a stream | `leak-check.py`: 0 store tokens in any capture; sentinel count `0` in the matrix |
| SC-006 | Documentation and observation agree | Both run records name their reports; the one overclaim is reworded; the refused command carries the stdin close |
| SC-007 | The program closes with derived surfaces re-generated | `repair-derived` report, manifest verify, recursive `validate.sh` |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & MITIGATIONS

| Risk | Mitigation |
|------|-----------|
| A stored credential silently turns no-key rows into keyed ones, producing false FAILs | Isolate `XDG_CONFIG_HOME` for the whole unauth half and prove the isolation with the control probe before the run |
| A repo-wide suite invocation picks up quarantine or worktree copies and reports their failures as live ones | Scope the audit run with `--exclude '**/quarantine/**' --exclude '.worktrees/**'` and name the file that ran; the first naive invocation is kept in the record |
| Editing playbook or reference text moves a derived artifact | Check the leaf manifest hash before and after; it is byte-identical, and the routing policy hash does not move because no `SKILL.md` changed |
| A mistyped manifest flag rewrites a repo-wide derived file with a subset | Caught by comparing row counts against HEAD, repaired by regenerating repo-wide through the same tool, and recorded here as a deviation |
| Re-running the corpus is mistaken for re-validating the tool | The report states explicitly that byte-identical no-key behavior is the finding, and the gate probes are the rows that the move actually changed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The two questions this phase raised are answered in the report's findings: the no-key recipe needs store isolation, and the stdin rule is stricter than its declaration — the second is recorded for the guard's owner rather than changed here.
<!-- /ANCHOR:questions -->

---

## Related Documents

- [Parent Spec](../spec.md)
- [Phase 4: compiled-fleet-onboarding](../004-compiled-fleet-onboarding/spec.md)
- [Implementation Summary](./implementation-summary.md)
- [Plan](./plan.md)
- [Tasks](./tasks.md)
