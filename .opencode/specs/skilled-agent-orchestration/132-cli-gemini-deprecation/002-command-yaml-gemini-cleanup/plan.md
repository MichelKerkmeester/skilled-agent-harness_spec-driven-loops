---
title: "Implementation Plan: Command-layer Gemini cleanup"
description: "Plan for removing orphaned cli-gemini executor branches and stray Gemini surface references across nine command-layer files (5 YAML assets + 4 command docs), with YAML-validity verification."
trigger_phrases:
  - "command yaml gemini cleanup plan"
  - "cli-gemini branch removal plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-cli-gemini-deprecation/002-command-yaml-gemini-cleanup"
    last_updated_at: "2026-06-08T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed command-layer cleanup plan (9 files)"
    next_safe_action: "None; phase complete, orchestrator validates centrally"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
      - ".opencode/commands/deep/start-research-loop.md"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/start-model-benchmark-loop.md"
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
    session_dedup:
      fingerprint: "sha256:a1fcf1714e13062c4f5b61e2759bb52453bb26d1fc2bb7c1cad97e726ac88c76"
      session_id: "command-yaml-gemini-cleanup-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Edit command YAMLs and command docs; leave lib helper as dead code."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Command-layer Gemini cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML command-asset files and Markdown command docs |
| **Framework** | OpenCode deep-loop and doctor command layer |
| **Storage** | No application storage changes |
| **Testing** | Targeted `grep` sweep plus per-file YAML parse |

### Overview

Remove the orphaned `if_cli_gemini:` executor branch and stray `Gemini` self-invocation-guard surface tokens from the four deep research/review loop YAMLs, remove `gemini` from the `doctor_mcp_install.yaml` runtime `valid_values`, and clean the four deep command docs (drop `cli-gemini` from executor lists, re-letter Q-Exec options, fix the stale ASCII box, remove gemini example commands). Verify with a case-insensitive command-layer `gemini` sweep returning zero, plus a YAML parse of every edited YAML file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (predecessor `001` deleted the skill/runtime; residual command-YAML references remain).
- [ ] Success criteria measurable via grep sweep and YAML parse.
- [ ] Dependencies identified: predecessor phase completed.

### Definition of Done
- [x] `if_cli_gemini:` branch removed from all four deep YAMLs.
- [x] `Gemini` stripped from cli-opencode/cli-devin self-invocation guard surface lists in all four deep YAMLs.
- [x] `gemini` removed from `doctor_mcp_install.yaml` runtime `valid_values`.
- [x] `cli-gemini` removed from the four deep command docs (executor lists, Q-Exec options re-lettered, ASCII box fixed, gemini example commands removed).
- [x] REQ-001 command-layer grep sweep returns zero; all five edited YAMLs parse as valid YAML.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Command-asset reference cleanup: surgical removal of a deleted-executor branch and stray surface tokens, followed by targeted-grep and YAML-parse verification.

### Key Components
- **Deep-loop executor branches**: `if_cli_gemini:` blocks in the four deep research/review YAMLs, removed.
- **Self-invocation guard surface lists**: cli-opencode and cli-devin guard strings that name `Gemini`, with that token stripped.
- **Doctor runtime filter**: `valid_values` enum in `doctor_mcp_install.yaml`, with `gemini` removed.

### Data Flow

After cleanup, deep-loop command workflows resolve only supported executors and never dispatch a deleted `cli-gemini` skill; the doctor MCP install route no longer accepts a `gemini` runtime filter value.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep_start-research-loop_auto.yaml` | Deep research executor router | Remove `if_cli_gemini:` branch; strip `Gemini` from guard surface lists | Per-file YAML parse + grep sweep. |
| `deep_start-research-loop_confirm.yaml` | Deep research executor router (confirm mode) | Same | Per-file YAML parse + grep sweep. |
| `deep_start-review-loop_auto.yaml` | Deep review executor router | Same | Per-file YAML parse + grep sweep. |
| `deep_start-review-loop_confirm.yaml` | Deep review executor router (confirm mode) | Same | Per-file YAML parse + grep sweep. |
| `doctor_mcp_install.yaml` | MCP install runtime filter | Remove `gemini` from `valid_values` | Per-file YAML parse + grep sweep. |
| `deep/start-research-loop.md` | Deep research command doc | Drop `cli-gemini` from executor lists; re-letter Q-Exec options; fix ASCII box; remove gemini example commands | Command-layer grep sweep. |
| `deep/start-review-loop.md` | Deep review command doc | Same | Command-layer grep sweep. |
| `deep/start-model-benchmark-loop.md` | Deep model-benchmark command doc | Same | Command-layer grep sweep. |
| `deep/start-agent-improvement-loop.md` | Deep agent-improvement command doc | Same | Command-layer grep sweep. |
| `deep-loop-runtime/lib/.../executor-config.ts` (`resolveGeminiSandboxMode`) | Sandbox-mode helper | Not a consumer after branch removal; left as dead-but-harmless | Confirm no command YAML imports it (grep). |

Required inventories:
- Command-layer producer sweep: `grep -rniE "gemini" .opencode/commands` (must be zero after edits).
- Executor enum/whitelist consumer check: `grep -rniE "cli-gemini|cli_gemini" .opencode/commands --include="*.yaml" --include="*.yml"` (verified: none did).
- Matrix axes: nine files x {executor-branch removal, surface-token strip, doctor enum removal, doc executor-list removal, Q-Exec re-lettering, ASCII-box fix, example-command removal}; YAML files carry the YAML axes, command docs carry the doc axes, doctor file only carries the enum-removal axis.
- Algorithm invariant: each edited YAML file must remain a parseable YAML document with intact block structure after removal; each edited command doc must keep contiguous Q-Exec option lettering.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the nine in-scope command-layer files and the predecessor-completed deletion.
- [x] Inventory residual Gemini tokens across the command layer.

### Phase 2: Core Implementation
- [x] Remove the `if_cli_gemini:` executor branch from the four deep YAMLs.
- [x] Strip `Gemini` from cli-opencode/cli-devin self-invocation guard surface lists in the four deep YAMLs.
- [x] Remove `gemini` from the `doctor_mcp_install.yaml` runtime `valid_values`.
- [x] Drop `cli-gemini` from the executor lists, re-letter Q-Exec options, fix the ASCII box, and remove gemini example commands in the four deep command docs.

### Phase 3: Verification
- [x] Run the case-insensitive command-layer `gemini` sweep (zero, exit 1).
- [x] Parse each of the five edited YAML files as YAML.
- [x] Confirm no command-YAML executor enum/whitelist names `cli-gemini`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Residual Gemini tokens across the whole command layer | `grep -rniE` |
| Syntax | YAML validity of the five edited YAML files | per-file YAML parser |
| Regression | Executor enum/whitelist still excludes `cli-gemini` | targeted `grep` |
| Doc | Command docs list only supported executors; Q-Exec lettering contiguous | command-layer `grep` + read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase `001-runtime-surface-and-skill-deletion` | Internal | Green | Predecessor deleted the `cli-gemini` skill and `.gemini/` surface; this phase removes residual command-YAML references. |
| Local YAML parser | Tooling | Green | Required for the validity check; static review is the fallback. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An edited YAML fails to parse, or a removed branch breaks a sibling executor block.
- **Procedure**: Restore the affected file(s) from git and re-apply the removal with corrected indentation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Branch/token removal -> YAML parse + grep sweep -> Closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Predecessor completed | Edits |
| Removal | Inventory | Verification |
| Verification | Removal | Closeout |
| Closeout | Verification | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10-15 minutes |
| Core Implementation | Low | 20-40 minutes |
| Verification | Low | 10-20 minutes |
| **Total** | | **40-75 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Keep all edits in the working tree for diff review before any commit.
- [ ] Capture the pre-edit residual-token inventory for each file.
- [ ] Run the grep sweep and YAML parse before claiming completion.

### Rollback Procedure
1. `git checkout -- <file>` for any file whose YAML parse fails.
2. Re-apply the removal with corrected block structure.
3. Re-run the grep sweep and YAML parse.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git-level file restoration only.
<!-- /ANCHOR:enhanced-rollback -->
