---
title: "Implementation Plan: Testing-Doc and Feature-Catalog Alignment Sweep"
description: "Plan for the dual-lineage repo-wide sweep of manual-testing-playbooks and feature-catalogs against the changed injection-bloat behavior, and the implementation of the verified must-fix set (one stale playbook test count, two adapter-catalog omission notes)."
trigger_phrases:
  - "testing doc alignment plan"
  - "feature catalog sweep plan"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/009-testing-doc-alignment"
    last_updated_at: "2026-08-07T06:30:00Z"
    last_updated_by: "claude"
    recent_action: "Ran the dual-lineage sweep and implemented the verified must-fix findings"
    next_safe_action: "Optionally add spec-gate env rows to the feature-flag-reference catalog/playbook layer"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md"
    session_dedup:
      fingerprint: "sha256:d4bc1cb55ea54f1b692941e188b312b76bc6f31c0fea946d31ea6b48f87c6e58"
      session_id: "2026-08-07-hooks-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Testing-Doc and Feature-Catalog Alignment Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown manual-testing-playbooks and feature-catalogs |
| **Framework** | Two parallel deep-loop research lineages (`gpt-5.6-luna` via cli-codex; `opencode-go/deepseek-v4-flash` via cli-opencode) |
| **Storage** | Research artifacts under `research/`; no database |
| **Testing** | The corrected playbook command is re-run to confirm its documented output matches reality |

### Overview
Sweep the repo-wide manual-testing-playbooks and feature-catalogs for snippets and entries stale against the changed injection-bloat behavior, using two independent 10-iteration lineages for diverse-model coverage. Both models converged: the surfaces are substantially aligned; no document asserts the old confirmation contract. Verify each finding against the real file, then implement the confirmed must-fix set — one stale playbook test count and two adapter-catalog omission notes — and defer the broad feature-flag-reference env-row addition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Changed surface committed and stable (`2af2feb113`)
- [x] Two executors bound: `gpt-5.6-luna` (max, fast) and `opencode-go/deepseek-v4-flash` (gateway, not direct API)
- [x] Sweep scope bounded to playbooks + catalogs, prioritized on docs referencing the changed surfaces

### Definition of Done
- [x] Every must-fix finding verified against the real file before any edit
- [x] The corrected playbook command re-run and its documented output matches actual output
- [x] Deferred optional items recorded with rationale
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual-model audit-then-fix with per-finding verification: two independent lineages sweep the same surface; findings are reconciled and each is confirmed against the real file before implementation, so a fabricated or mis-invoked finding cannot drive a change.

### Key Components
- **Dual-lineage sweep (new)**: `gpt-5.6-luna` and `opencode-go/deepseek-v4-flash`, ten forced iterations each, synthesized per-lineage into `research/lineages/<label>/research.md`.
- **Reconciliation + verification**: the two models' findings compared; each must-fix re-checked against the real file, including re-running the cited command.
- **Fix implementation**: the stale playbook count corrected (and step-2 made hermetic), two adapter-catalog omission notes added.

### Data Flow
1. Both lineages enumerate playbooks + catalogs and grep for references to the changed surfaces.
2. Each produces severity-ranked findings; the two syntheses are reconciled.
3. Each must-fix is verified against the real file (the playbook command is re-run).
4. Confirmed must-fix items are implemented; the broad feature-flag-reference addition is deferred.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Seed the packet spec and launch the two-executor deep-loop fan-out over the committed surface
- [x] Collect both lineages' synthesized findings

### Phase 2: Core Implementation
- [x] Reconcile the two models' findings and verify each must-fix against the real file
- [x] Correct the stale `# tests 67` count to `87/87/0/0` and add env-neutralization to the playbook step
- [x] Add the post-emission delivery-observation note to the cursor and claude adapter catalogs

### Phase 3: Verification
- [x] Re-run the corrected playbook command and confirm its documented output matches
- [x] Confirm the catalog notes cite real symbols (`observeGate3QuestionDelivery`, `observeEmittedAdvisorPolicy`)
- [x] Scope + collateral sweep: no unrelated files changed, no repo-wide description.json churn
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documented-output parity | The corrected playbook command produces its stated output | `node --experimental-test-module-mocks --test` |
| Symbol accuracy | Catalog notes reference real exported symbols | `grep` in the source |
| Scope hygiene | Only the intended docs changed; no collateral | `git status` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Committed changed surface (`2af2feb113`) | Internal | Committed | The sweep needs a stable target to reference |
| `opencode-go` and `cli-codex` provider auth | External | Confirmed | Neither lineage can dispatch without an authenticated provider |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A corrected count or catalog note is found inaccurate.
- **Procedure**: `git revert` this packet's implementation commit; the edits are documentation-only (a playbook expected-output line and two catalog rows), so a revert restores the prior text with no behavior loss.
<!-- /ANCHOR:rollback -->
