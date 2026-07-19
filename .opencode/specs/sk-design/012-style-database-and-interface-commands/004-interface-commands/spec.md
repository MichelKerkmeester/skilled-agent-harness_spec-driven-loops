---
title: "Feature Specification: /interface:* creation commands"
description: "Rebuild the five design commands into /interface:* creation templates sharing a 9-stage creation contract, per the 002 research; keep /design:* as compatibility aliases."
trigger_phrases:
  - "interface commands implementation"
  - "creation-template commands"
  - "design command rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/004-interface-commands"
    last_updated_at: "2026-07-19T10:03:20Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Built and verified the canonical interface creation commands and compatibility aliases"
    next_safe_action: "Reviewer checks command wording and restarts OpenCode to load the new command surface"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
      - ".opencode/skills/sk-design/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: /interface:* creation commands

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | `003-style-database` |
| **Successor** | None |
| **Phase** | 4 of 4 |
| **Implements** | `../002-research-design-commands/research/research.md` (authoritative design) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five `/design:*` commands are thin routers with no creation scaffolding. Phase 002 converged on a redesign: five `/interface:*` creation templates sharing a 9-stage contract, keeping `sk-design` modes as design authority. It now needs building, using the operator-confirmed names.

### Purpose

Add the `/interface:*` command surface as **creation templates** — each instantiating one shared creation contract (Route → Context Manifest → Progressive Brief → Grounding → Mode Plan → Creative/Diagnostic Work → Critique/Revision → Proof → Deliver/Handoff) — while keeping internal workflow modes unchanged and `/design:*` as tested compatibility aliases.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Confirmed command surface** (operator decision 2026-07-19): `/interface:design`→`interface`, `/interface:foundations`→`foundations`, `/interface:motion`→`motion`, `/interface:audit`→`audit`, `/interface:design-reference`→`md-generator`. Public names do NOT rename internal workflow mode IDs.
- **A shared creation-contract reference** centralizing the 9-stage lifecycle, typed context envelope, intake/grounding policy, proof labels, and `sk-code` handoff.
- **Five command prompts** as creation templates per the 002 §7 templates, each routing to its stable mode.
- **Additive `/design:*` compatibility aliases** (keep the shipped commands working; do NOT in-place delete/rename them until route tests pass).
- Command-surface registration updates (`command-metadata.json`, `hub-router.json`) + contract/route tests.

### Out of Scope

- Rebuilding the owned mode workflows / changing `sk-design` design judgment (002 explicitly preserves them).
- The style database (phase 003) and `sk-code` internals.
- Removing the legacy `/design:*` commands (a later, evidence-gated deprecation).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/interface/{design,foundations,motion,audit,design-reference}.md` | Create | Five `/interface:*` creation-template command prompts |
| `.opencode/commands/interface/assets/**` | Create | Owned presentation/workflow assets as needed (mirroring the design/ command asset pattern) |
| `.opencode/skills/sk-design/shared/creation-contract.md` | Create | Shared 9-stage contract + envelope + intake/grounding/proof/handoff |
| `.opencode/commands/design/*.md` | Modify | Convert to additive compatibility aliases pointing at the `/interface:*` canonical commands |
| `.opencode/skills/sk-design/{command-metadata.json,hub-router.json}` | Modify | Register the `/interface:*` surface + alias mapping |
| command contract/route tests | Create | Static contract + adversarial route/output/mutation/trust/evidence tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five `/interface:*` creation commands | Each exists with the confirmed name, routes to its stable internal mode, and exposes the shared creation contract's visible blocks. |
| REQ-002 | Shared creation contract | One reference owns the 9-stage lifecycle + envelope + intake/grounding/proof/handoff; commands reference it, not copy taste. |
| REQ-003 | Modes + authority unchanged | Internal workflow mode IDs untouched; commands own choreography, modes own judgment; commands never invoke commands. |
| REQ-004 | Additive `/design:*` aliases | Existing `/design:*` still route correctly (compatibility), verified by route tests before any deprecation. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Registration coherent | `command-metadata.json` + `hub-router.json` register `/interface:*` + aliases; command-surface checks pass. |
| REQ-006 | Boundaries enforced by tests | Contract tests reject copied taste/reference tables, nested command dispatch, evidence-free `verified=true`, and silent downstream amendment. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Five `/interface:*` commands + shared contract exist; `/design:*` aliases route; registration + command-surface checks pass; contract/route tests green; `validate.sh --strict` = 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** 002 research design; the current `commands/design/*` + owned assets; `sk-design` mode-registry + hub-router + command-surface checkers.
- **Risk:** command/mode doctrine drift or nested recursion — mitigated by the reference-not-copy rule + contract tests + the "commands never invoke commands" invariant.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- Command prompts stay within practical size; the shared contract is referenced, not inlined per command.

### Security

- Exemplars are evidence-only (prompt-injection safe); commands never mutate code directly (accepted `sk-code` handoff boundary); no new network surface.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Shared-fragment mechanism: does the command runtime support literal includes, or should the contract be a referenced sibling doc? (Resolve at build; 002 §13 flags this as non-blocking.)
<!-- /ANCHOR:questions -->
