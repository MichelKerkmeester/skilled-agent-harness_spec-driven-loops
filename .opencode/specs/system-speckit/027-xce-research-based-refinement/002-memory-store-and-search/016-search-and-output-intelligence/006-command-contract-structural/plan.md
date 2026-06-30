---
title: "Implementation Plan: Phase 6: command-contract-structural"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "017-search-and-output-intelligence-implementation/006-command-contract-structural"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped /memory:search arg header + salience inversion; plan superseded"
    next_safe_action: "FOLLOW-UP: live A/B --command execute-rate run on Kimi/MiMo (cannot run here)"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-command-contract-structural"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to stop weak models dropping the query? -> compute ARGS_PRESENT/QUERY in shell, invert salience, gate the ask-path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: command-contract-structural

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
| **Language/Stack** | OpenCode/Claude slash-command markdown + an inline `bash` shell header |
| **Framework** | None (command contract + presentation asset) |
| **Storage** | None |
| **Testing** | Live cross-model A/B `--command` execute-rate (no vitest; not runnable here) |

### Overview
Move the arg-presence branch out of model judgment into a §0 shell header that emits deterministic `ARGS_PRESENT`/`QUERY` lines, then invert the contract's salience so the execute-path is read first and the ask-path is physically last and gated. See `implementation-summary.md` for the delivered detail.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-contract markdown with an inline shell-resolution header (no application architecture).

### Key Components
- **§0 ARGUMENT RESOLUTION header (`search.md`)**: `bash -c` block joining `$ARGUMENTS` into `QUERY` and emitting `ARGS_PRESENT`.
- **Salience-inverted sections (`search.md`)**: RETRIEVAL/ANALYSIS first; STARTUP last, gated on `ARGS_PRESENT=false`.
- **Presentation gate (`search_presentation.txt`)**: §1 Startup Question Policy gated the same way so the asset cannot re-anchor the model.

### Data Flow
The renderer runs §0 before the model reads policy; the model binds on `ARGS_PRESENT`/`QUERY`, executes retrieval when true, and only reaches the gated STARTUP ask-path when false.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/memory/search.md` | The `/memory:search` command contract | update (§0 header, salience inversion, no-ask guard) | `grep -n ARGS_PRESENT search.md` |
| `.opencode/commands/memory/assets/search_presentation.txt` | Presentation policy the model reads alongside the command | update (gate §1 on `ARGS_PRESENT=false`) | `grep -n ARGS_PRESENT search_presentation.txt` |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed the renderer expands `$ARGUMENTS` one word per argument inside `` !`…` `` injections

### Phase 2: Core Implementation
- [x] §0 shell header joins argv into `QUERY`, escapes quotes, emits `ARGS_PRESENT`
- [x] Reordered sections: RETRIEVAL/ANALYSIS lead; STARTUP last, gated on `ARGS_PRESENT=false`
- [x] No-ask guard + arg-echo self-correction rule bound to `ARGS_PRESENT`/`QUERY`

### Phase 3: Verification
- [x] Presentation asset §1 gated the same way
- [x] Edge cases handled (multi-word query, embedded double-quotes)
- [x] `implementation-summary.md` written
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioral A/B | `--command` execute-rate on Kimi K2.7 / MiMo v2.5 Pro | Live cross-model run (follow-up; not runnable here) |
| Manual | `/memory:search "<query>"` executes vs falls back to startup | Manual probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Slash-command renderer `$ARGUMENTS` substitution | External (runtime) | Green | §0 header cannot resolve argv |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The §0 header misfires (e.g. a query rendered as empty) or models regress on execute-rate.
- **Procedure**: Revert `search.md` and `search_presentation.txt` to the prior contract; both are markdown, fully reversible with no code dependency.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

