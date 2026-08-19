---
title: "Feature Specification: CLI Mode + Hub Persona-Injection Enforcement"
description: "Apply the P2 persona-injection contract to all six external-CLI mode SKILL.md files and the hub SKILL.md: one enforcement rule per mode stating that mode's native-surface-vs-inline verdict from the contract §3, plus a hub ALWAYS rule and a REFERENCES link — architecture-preserving (ADD a rule; no routing/registry change)."
trigger_phrases:
  - "cli mode persona injection enforcement"
  - "add persona rule to cli skill"
  - "hub always persona injection rule"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/003-cli-mode-enforcement"
    last_updated_at: "2026-08-19T11:12:00Z"
    last_updated_by: "claude"
    recent_action: "Applied persona rule to 6 modes + hub; cline-verified APPROVE 98/100"
    next_safe_action: "Author P4 sk-prompt alignment (004-sk-prompt-alignment)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - "../002-persona-injection-contract/scratch/persona-injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-003-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: CLI Mode + Hub Persona-Injection Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
P2 produced the shared `persona-injection-contract.md`, but the six external-CLI mode SKILL.md files and the hub SKILL.md still document dispatch WITHOUT an enforcement rule requiring the resolved agent persona in the payload. Until each dispatching mode carries the rule, an orchestrator reading a mode SKILL sees no obligation to attach the persona, and the gap the packet exists to close stays open in the exact files orchestrators read before dispatching.

### Purpose
Apply the contract to every dispatch surface: add ONE persona-injection rule to each of the six mode SKILLs (mirroring each file's existing ALWAYS-rule style), stating THAT mode's native-surface-vs-inline verdict from contract `§3` and referencing the canonical card; and add one hub `✅ ALWAYS` rule plus one `REFERENCES` link. Architecture-preserving: it ADDS a rule and changes nothing about routing, `mode-registry.json`, or the hub's thinness.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six mode `SKILL.md` files under `.opencode/skills/cli-external-orchestration/` (`cli-devin`, `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-pi`): one persona-injection rule each.
- The hub `.opencode/skills/cli-external-orchestration/SKILL.md`: one `✅ ALWAYS` bullet + one `REFERENCES` bullet pointing to the canonical contract.

### Out of Scope
- `sk-prompt` and the canonical `cli-prompt-quality-card.md` "Persona Injection" section (that is P4).
- Editing agent `.md` personas, `mode-registry.json`, `hub-router.json`, or any routing/registry behavior.
- The `fanout-run.cjs` runtime internals (documented in the contract; no code change here).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Add ALWAYS Rule 17 (native `run_subagent` surface; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Add ALWAYS Rule 18 (partial via primary; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modify | Add ALWAYS Rule 14 (native `--agent`; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modify | Add ALWAYS Rule 17 (no native; inline mandatory) |
| `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Modify | Add ALWAYS Rule 17 (native file-convention surface; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Add ALWAYS bullet 11 (no native; inline mandatory) |
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Modify | Add hub ALWAYS bullet + REFERENCES bullet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 6 modes carry the rule | Each mode `SKILL.md` has one persona-injection rule in its `✅ ALWAYS` list |
| REQ-002 | Hub carries the rule + link | Hub `SKILL.md` has one `✅ ALWAYS` persona bullet + one `REFERENCES` bullet |
| REQ-003 | Verdicts match the contract | Each rule's native-surface-vs-inline verdict matches `persona-injection-contract.md` `§3` |
| REQ-004 | Pure insertion | The diff is insertion-only: no existing rule renumbered, no adjacent content changed |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Runtime-aware + mapping | Each rule resolves the persona per AGENTS.md §7 (never hardcode a runtime) and maps subtasks to the right agent |
| REQ-006 | Cross-references correct | Each rule cites the canonical card at the correct path depth; DESIGN_DISPATCH_MANIFEST rule numbers cited correctly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg "persona"` finds the enforcement rule in all six mode `SKILL.md` files and the hub.
- **SC-002**: `git diff` for the packet is pure insertion (`13 insertions(+)`, 0 deletions across the 7 files).
- **SC-003**: An independent review confirms every mode's verdict matches contract `§3` with no P0/P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Weak build executor garbles a shipped SKILL.md | Broken skill file | Orchestrator pre-writes exact blocks; build applies verbatim; diff + independent verify + `validate.sh` catch any drift |
| Risk | Forward reference to a not-yet-created card section | Dangling link until P4 | Same-packet P4 creates the canonical "Persona Injection" section before merge |
| Dependency | P2 contract | Supplies every verdict + block text | `002-persona-injection-contract` complete + validated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every inserted verdict traces to contract `§3` (no new unverified claim invented at the mode level).

### Maintainability
- **NFR-M01**: Each mode rule REFERENCES the single canonical contract rather than copying it, avoiding the drift class the sync-guard already polices.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **`cli-pi` uses no numbered rules**: its ALWAYS list is bullets, so the persona rule is added as bullet 11, not a numbered rule — a per-file structural nuance.
- **Hub thinness**: the hub gets a pointer bullet + a REFERENCES link only; the native-vs-inline mechanic lives in each mode, not the hub.
- **`cli-claude-code` DESIGN_DISPATCH_MANIFEST is Rule 11** (not 14 as in the other modes): the inline-precedent cross-reference is file-specific.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium. Low conceptual novelty (apply an already-designed contract) but high precision cost: seven surgical, insertion-only edits to shipped skill files, each mirroring a different file's rule style and stating a file-specific verdict and cross-reference.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The canonical card "Persona Injection" section referenced by every rule is created in P4 (`004-sk-prompt-alignment`); the forward reference is intentional and resolves before merge.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Previous phase**: See `../002-persona-injection-contract/spec.md`
- **Next phase**: See `../004-sk-prompt-alignment/spec.md`
- **Contract (input)**: See `../002-persona-injection-contract/scratch/persona-injection-contract.md`
