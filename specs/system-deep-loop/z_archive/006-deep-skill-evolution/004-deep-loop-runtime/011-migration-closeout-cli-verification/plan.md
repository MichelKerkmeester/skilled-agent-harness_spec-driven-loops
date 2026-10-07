---
title: "Implementation Plan: deep-loop MCP→CLI migration closeout + CLI verification (011)"
description: "Reconstructed Level 2 implementation plan for the migration closeout and CLI verification packet, derived from spec.md and git history. The original plan was never written."
trigger_phrases:
  - "deep-loop migration closeout plan"
  - "CLI verification closeout plan"
  - "MCP remnant deletion plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: deep-loop MCP→CLI migration closeout + CLI verification (011)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Runtime config files (`.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`), README and packet markdown |
| **Framework** | The deep-loop runtime skills invoking the new `.cjs` CLI; `cli-devin` SWE-1.6 for dynamic scenario execution |
| **Storage** | Runtime configs and READMEs; the graph data rebuilt through the `.cjs` CLI |
| **Testing** | The migrated vitest sweep (recorded result: 32 files / 228 tests) plus the ~18 CLI-exercising playbook scenarios run via `cli-devin` SWE-1.6 |

### Overview
Close out the deep-loop runtime isolation arc: reconcile stale tool-count references to the verified ground truth of 35/9/8/7/1 = 60 across configs and READMEs, reconcile the arc's child and parent statuses, record the confirmed vitest sweep in the verification packet, delete the deprecated-MCP remnants, and prove dynamically that the deep-loop skills invoke the new `.cjs` CLI rather than the removed MCP tools.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Verified tool-count ground truth recorded (mk-spec-memory 35, mk_skill_advisor 9, mk_code_index 8, code_mode 7, sequential_thinking 1 = 60 across 5 servers)
- [ ] CLI-exercising scenario list identified (deep-loop-runtime/07, deep-ai-council/08+09, deep-research graph-stop)
- [ ] Parent arc spec and statuses available for reconciliation

### Definition of Done
- [ ] Tool-count references reconciled across the runtime configs and READMEs
- [ ] Arc child and parent statuses reconciled
- [ ] Confirmed vitest result recorded in the verification packet
- [ ] Deprecated-MCP remnants removed (orphan README dirs and the relocated DB copy)
- [ ] Dynamic CLI verification of the CLI-exercising scenarios passes
- [ ] Strict validation green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Closeout sweep in three parts: reconcile configuration and status references, delete the deprecated-MCP remnants, then verify the new CLI dynamically.

### Key Components
- **Tool-count reconciliation**: align runtime configs and READMEs on the verified 35/9/8/7/1 = 60.
- **Status reconciliation**: bring the runtime arc's child and parent statuses to a consistent state.
- **Remnant deletion**: remove the orphan README dirs and the relocated DB copy in the memory server.
- **CLI verification**: run the CLI-exercising playbook scenarios through `cli-devin` SWE-1.6.

### Data Flow
Packet scope → config and README edits plus remnant deletion → recorded test sweep → dynamic CLI evidence → strict validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Closeout and configuration
- [ ] Reconcile tool-count references to the verified ground truth
- [ ] Reconcile the arc child and parent statuses

### Phase 2: Remnant deletion and test record
- [ ] Delete the deprecated-MCP remnants
- [ ] Record the confirmed vitest sweep in the verification packet

### Phase 3: CLI verification
- [ ] Run the CLI-exercising scenarios dynamically
- [ ] Confirm the `.cjs` CLI is the invoked interface with no MCP graph-tool references remaining
- [ ] Strict-validate the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The migrated vitest sweep was recorded as 32 files / 228 tests. Dynamic verification covers the ~18 CLI-exercising playbook scenarios (deep-loop-runtime/07, deep-ai-council/08+09, deep-research graph-stop) executed via `cli-devin` SWE-1.6; exact command output is not recorded in this plan.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent arc spec and statuses | Internal | Not recorded | Status reconciliation has no target state |
| The new `.cjs` CLI in the deep-loop-runtime skill | Internal | Not recorded | CLI verification has no interface to exercise |
| `cli-devin` SWE-1.6 availability | External | Not recorded | Scenarios cannot be run dynamically |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the packet was worked.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Closeout and configuration | None | Remnant deletion and test record |
| Remnant deletion and test record | Closeout and configuration | CLI verification |
| CLI verification | Remnant deletion and test record | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Closeout and configuration | Not recorded | Not recorded |
| Remnant deletion and test record | Not recorded | Not recorded |
| CLI verification | Not recorded | Not recorded |
| **Total** | | **Not recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Removed remnants confirmed unreferenced before deletion

### Rollback Procedure
1. Not recorded.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not recorded.
<!-- /ANCHOR:enhanced-rollback -->
