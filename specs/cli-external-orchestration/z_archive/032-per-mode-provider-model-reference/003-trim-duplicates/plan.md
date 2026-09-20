---
title: "Implementation Plan: Phase 3 — trim duplicated provider/model enumerations"
description: "Trim the now-redundant model enumerations from each mode's cli-reference.md and SKILL.md to a compact residue plus a catalog pointer, keeping every mode dispatch-self-sufficient and advisor-routing JSON tokens untouched."
trigger_phrases:
  - "trim cli reference model tables plan"
  - "compact residue plus pointer plan"
  - "de-duplicate provider model docs plan"
  - "self-sufficiency dispatch gate approach"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-per-mode-provider-model-reference/003-trim-duplicates"
    last_updated_at: "2026-07-29T09:18:42Z"
    last_updated_by: "implementer"
    recent_action: "Trimmed duplicated enumerations across six modes, preserved routing JSON"
    next_safe_action: "Hub reconcile + adjacent fixes + validate (phase 004)"
    blockers: []
    key_files:
      - "cli-opencode/references/cli-reference.md"
      - "cli-cursor/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-033-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 — trim duplicated provider/model enumerations

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + JSON routing tokens (read-only guard) |
| **Framework** | Per-mode `cli-reference.md` / `SKILL.md`; catalog pointer convention |
| **Storage** | 12 files (2 per mode); 3 advisor-routing JSON files explicitly excluded |
| **Testing** | Self-sufficiency grep, `git diff` on routing JSON, advisor routing smoke |

### Overview
With a dedicated catalog now in place, the exhaustive model enumerations duplicated in each mode's `cli-reference.md` and `SKILL.md` are redundant and will drift. This phase — the highest-risk in the packet — trims them to a compact residue (default model + effort mechanism + a prominent catalog pointer), keeps every mode dispatchable without opening the pointer, retains mode-specific safety/mechanics inline, and never touches functional advisor-routing JSON tokens.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
De-duplication with a self-sufficiency floor — remove only cross-mode framing and exhaustive slug restatements now owned by the catalog; keep a runnable residue and a pointer in each mode.

### Key Components
- **Compact residue**: default model id + effort/thinking mechanism + one-shot invocation + parse table + catalog pointer, retained in each `SKILL.md`.
- **Mode-specific mechanics**: opencode auth pre-flight, codex `-c model_reasoning_effort=`, cursor's full inline 10-id allowlist (a hard-fail safety contract) — all preserved.
- **Read-only guard**: `description.json` / `graph-metadata.json` / `hub-router.json` model tokens excluded from all edits.

### Data Flow
Reader/dispatcher reads a trimmed `SKILL.md` → still finds a concrete default + runnable invocation inline → follows the pointer to `providers-and-models.md` only for the full roster.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Highest-risk phase — trimming shared docs adjacent to functional routing tokens, so the affected-surface inventory is load-bearing.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `cli-*/references/cli-reference.md` (×6) | Model section (duplicate enumeration) | trim to residue + pointer | self-sufficiency grep; pointer present |
| `cli-*/SKILL.md` (×6) | Roster (duplicate enumeration) | trim to default + invocation + parse table + pointer | each retains a concrete default id + runnable invocation |
| cursor 10-id allowlist | Inline safety contract (hard-fail) | keep inline | 10 ids still present in `cli-reference.md` |
| `description.json` / `graph-metadata.json` / `hub-router.json` | Functional advisor-routing tokens | not a consumer — untouched | `git diff` shows zero changes |
| `integration-patterns.md` / `prompt-templates.md` pins | Runnable example model pins | keep pins; remove only standalone tables | examples still name a model |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 2 wiring complete (pointers resolvable, leaves registered)
- [x] Define the per-mode trim rules and the self-sufficiency gate (default id + runnable invocation must survive)

### Phase 2: Core Implementation
- [x] Trim each mode's `cli-reference.md` model section to residue + pointer (six parallel agents, one mode each, no conflicts)
- [x] Trim each mode's `SKILL.md` roster to default + effort + invocation + parse table + pointer
- [x] Grep-sweep `integration-patterns.md` / `prompt-templates.md` / `agent-delegation.md` for standalone enumeration tables (remove only those; keep runnable pins)

### Phase 3: Verification
- [x] Self-sufficiency gate per mode — each `SKILL.md` keeps a concrete default id + runnable invocation (6/6)
- [x] `git diff` confirms zero changes to the three routing JSON classes
- [x] Advisor routing smoke — provider-named prompts route to the correct mode (6/6 at 0.95)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Self-sufficiency | Default id + invocation survive per `SKILL.md` | grep gate |
| Guard | Routing JSON tokens unchanged | `git diff` |
| Routing smoke | Provider-named prompt → correct mode | advisor recommend |
| Link | All relative links in 12 trimmed files resolve | on-disk check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 wiring (pointers, leaves) | Internal | Green | Pointers would dangle after trim |
| Advisor recommend (routing smoke) | Internal | Green | Cannot confirm routing survives |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any mode fails the self-sufficiency gate, or `git diff` shows an accidental edit to a routing JSON token.
- **Procedure**: `git checkout` the affected mode's two files (and any touched JSON) to restore the pre-trim state; re-run the self-sufficiency grep and routing smoke before retrying. Trims are per-mode and independent, so a single mode can be reverted without affecting the others.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
