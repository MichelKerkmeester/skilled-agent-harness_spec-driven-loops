---
title: "Feature Specification: Persona-Injection Gap Analysis & Dispatch-Point Inventory"
description: "Produce a complete, evidence-backed inventory of every agent persona and every external-CLI dispatch/prompt-composition point across the six cli-external-orchestration modes, the hub, and the sk-prompt family, and classify per mode whether the CLI natively loads the persona on the dispatch path or the persona must be inlined."
trigger_phrases:
  - "cli dispatch point inventory persona"
  - "native agent load vs inline classification"
  - "persona injection gap analysis cli modes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/001-analysis-inventory"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Phase 001 Level 2 docs"
    next_safe_action: "Dispatch cli-devin (Gemini 3.7 Flash @ high) to produce the inventory into scratch/"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-devin/SKILL.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-001-analysis"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: Persona-Injection Gap Analysis & Dispatch-Point Inventory

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Before any enforcement rule can be written, the packet needs a precise, evidence-backed map of WHERE personas are (or are not) attached today. A guess-based fix risks adding a rule to the wrong place, missing a dispatch path, or contradicting a CLI's real native mechanism. The six modes each own their dispatch contract and differ materially: some CLIs load `.claude/agents/*.md` via `--agent`, one uses `.codex/agents/*.toml` only in its interactive TUI (not the `-p`/`exec` path), one exposes `.opencode/agents` as non-`--agent`-invokable subagents, and one (cli-pi) has no agent/persona language at all.

### Purpose
Produce one analysis artifact that: (a) inventories the agent-persona roster and which persona maps to which dispatch intent; (b) enumerates every dispatch / prompt-composition point in the six modes, the hub, and the sk-prompt family; (c) classifies per mode whether the persona is loaded natively on the actual dispatch path or must be inlined; and (d) confirms the gap with `file:line` evidence. This artifact is the direct input to the P2 contract design.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of `.opencode/agents/` (roster + persona→intent mapping).
- Read-only analysis of all six `cli-external-orchestration/*/SKILL.md` + their `references/` dispatch/prompt docs.
- Read-only analysis of the hub `SKILL.md` and `mode-registry.json`.
- Read-only analysis of `sk-prompt/sk-prompt-models` and `sk-prompt/sk-prompt-improve` for CLI prompt-craft touchpoints.
- The deep-loop `fanout-run.cjs` dispatch surface, only to record whether/where persona could travel in its payload.

### Out of Scope
- Any file edits to the modes, hub, or sk-prompt (that is P3/P4).
- Designing the contract (that is P2).
- Editing agent `.md` personas.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-analysis-inventory/scratch/dispatch-point-inventory.md` | Create | The analysis artifact (roster, dispatch points, per-mode native-vs-inline classification, gap evidence) |
| `001-analysis-inventory/implementation-summary.md` | Modify | Record findings summary + verification once analysis returns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Agent-persona roster inventoried with intent mapping | Every `.opencode/agents/*.md` listed with its role + the dispatch intent(s) it serves (code→code, review→review, etc.) |
| REQ-002 | Every CLI dispatch/prompt-composition point enumerated | Each of the 6 modes has its dispatch path(s) listed with `file:line`; hub + sk-prompt touchpoints listed |
| REQ-003 | Per-mode native-vs-inline classification | For each mode: does the CLI natively load the resolved persona on the actual non-interactive dispatch path? YES/NO + evidence |
| REQ-004 | Gap confirmed | Explicit statement, with evidence, of which dispatch paths currently attach NO persona |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Existing precedents catalogued | cli-devin Rule 12/13/14 (code/design standards + DESIGN_DISPATCH_MANIFEST), cli-claude-code `--agent`, cli-cursor auto-import, cli-codex `.toml` TUI-only, cli-opencode subagent note — all cited as the reuse basis for P2 |
| REQ-006 | sk-prompt ownership mapped | Identify exactly which sk-prompt doc(s) own CLI prompt construction and thus need the persona step |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can, from the inventory alone, name every dispatch path that needs the enforcement rule and why.
- **SC-002**: Every native-vs-inline verdict is backed by a `file:line` citation, not inference.
- **SC-003**: The artifact directly seeds the P2 contract (no re-investigation needed).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin (Gemini) analysis is shallow or hallucinates paths | Wrong inventory poisons P2-P5 | Orchestrator verifies every `file:line` claim before accepting (orchestrate.md §5) |
| Risk | A dispatch path is missed | Enforcement gap survives | Cross-check against `mode-registry.json` (all 6 modes) + fanout-run.cjs |
| Dependency | `devin` CLI available + authed | Cannot dispatch | Verified: devin 3000.4.25, logged in. Fallback GLM 5.2 high if Gemini unavailable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every claim in the artifact is reproducible from a cited `file:line`.

### Maintainability
- **NFR-M01**: The inventory is structured as a per-mode table so P3 can be executed mode-by-mode without re-reading source.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **A mode with multiple dispatch surfaces** (e.g. cli-opencode print vs parallel-detached; cli-devin `-p` vs `run_subagent` vs `.devin/agents` symlink): classify EACH surface separately.
- **Native mechanism that claims to work but is version-broken** (cli-devin `.claude/agents` import on 3000.4.25): record the claim AND the installed-version reality.
- **A mode that already partially injects** (cli-devin DESIGN_DISPATCH_MANIFEST): note it as a partial precedent, not full coverage.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium. Read-heavy across ~8-10 packets and their references. No code execution. The complexity is in completeness (missing a path is the failure mode) and in per-surface classification accuracy, not in any single hard problem.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does `fanout-run.cjs` expose a payload slot where a persona block can travel, or must persona always be inlined into the prompt string? (Answer feeds P2.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
