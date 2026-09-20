---
title: "Investigation Plan: Cline provider support for cli pi"
description: "Read-only investigation approach to determine whether pi can reach the Cline provider; no pi runtime change until a verdict lands."
trigger_phrases:
  - "cline pi investigation plan"
  - "pi provider resolution cline plan"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/002-cline-support-pi-investigation"
    last_updated_at: "2026-08-18T12:45:30Z"
    last_updated_by: "claude"
    recent_action: "Investigation executed; verdict config-only-feasible"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Investigation Plan: Cline provider support for cli pi

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
| **Language/Stack** | pi CLI config (JSON) + pi provider system |
| **Framework** | cli pi (`.pi/` config surface) |
| **Storage** | `.pi/models.json`, `.pi/settings.json` |
| **Testing** | Live `pi` provider/model listing + `/login` observation (read-only) |

### Overview
Determine feasibility, cheapest-first. Inspect how pi resolves providers and what backs `/login`, compare against opencode's models.dev registry (where `cline-pass` already lives), and decide whether Cline in pi is a config-only add, an extension, or not feasible.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 confirmed the Cline provider facts (id, base URL, model, tiers)
- [x] pi provider-resolution source identified

### Definition of Done
- [x] A feasibility verdict recorded with evidence
- [x] No `.pi` runtime file changed during the investigation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-first investigation — map the provider-resolution path before proposing any wiring.

### Key Components
- **`.pi/models.json` `providers`**: existing per-provider `compat`/`modelOverrides` (openrouter, opencode-go) — the candidate config surface for a new provider block.
- **`.pi/settings.json` `enabledModels`/`defaultProvider`**: the allowlist that gates which models appear in the picker.
- **pi `/login` provider list**: the unknown — is it a fixed built-in set or the shared models.dev registry?

### Data Flow
Operator `/login` → pi provider registry → authenticated provider → `enabledModels` filter → model picker. The investigation walks this chain to find where (if anywhere) `cline-pass` can be injected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable during the investigation — no runtime surface is modified. A follow-on implementation phase (only if the verdict is feasible) will inventory the pi config/provider surfaces before any edit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `.pi/models.json`, `.pi/settings.json`, and the cli-pi provider reference doc
- [x] Observe the live `/login` provider list and current `pi` provider/model listing

### Phase 2: Core Investigation
- [x] Determine whether pi shares opencode's models.dev provider registry or a pi-specific list
- [x] Test (read-only / sandboxed) whether a `cline-pass` provider block in `.pi/models.json` + `enabledModels` would resolve
- [x] Resolve the auth path (reuse opencode's Cline credential vs a pi login)

### Phase 3: Verdict
- [x] Record: config-only feasible / extension-required / not feasible, with evidence
- [x] If feasible, name the exact mechanism for a follow-on implementation phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Observation | pi provider/model resolution | live `pi` listing, `/login` |
| Config probe | Does a cline-pass block resolve? | sandboxed `.pi` config copy (no live-config mutation) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pi provider-registry source | Internal | Yellow (unknown) | Determines whole feasibility path |
| Cline auth reusability in pi | External | Yellow | Determines the auth mechanism |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A during investigation — no runtime change is made.
- **Procedure**: Any exploratory config probe runs on a sandboxed copy; the live `.pi` config is never mutated in this phase.
<!-- /ANCHOR:rollback -->
