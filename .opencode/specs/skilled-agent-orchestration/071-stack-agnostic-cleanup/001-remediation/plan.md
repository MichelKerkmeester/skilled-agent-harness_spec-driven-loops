---
title: "Implementation Plan: Phase 071 verifier remediation"
description: "Surgical remediation plan for the nine independent verifier findings in Phase 071."
trigger_phrases:
  - "phase 071 remediation plan"
  - "verifier remediation"
  - "stack agnostic cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/071-stack-agnostic-cleanup/001-remediation"
    last_updated_at: "2026-05-05T19:53:46Z"
    last_updated_by: "cli-codex"
    recent_action: "Created remediation plan"
    next_safe_action: "Patch V-001 through V-007 in order"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      session_id: "phase-071-001-remediation"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 071 Verifier Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python, TypeScript, JavaScript, Markdown, JSON |
| **Framework** | OpenCode skills and system-spec-kit advisor |
| **Storage** | Spec metadata JSON and tracked scan artifacts |
| **Testing** | Grep gates, Python advisor script, compiler validation, spec validation |

### Overview

Apply the verifier fixes as narrow edits: neutralize real-client and local-path examples, remove stack-specific advisor scoring cues outside sk-code, keep dist mirrors aligned, and document the two P2 scope decisions. Verification is command-driven and records both pass and residual fail evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Independent verification report read.
- [x] User pre-approved `specs/skilled-agent-orchestration/071-stack-agnostic-cleanup`.
- [x] Child remediation folder scaffolded from system-spec-kit Level 2 template.

### Definition of Done

- [ ] V-001 through V-007 fixed in the targeted files.
- [ ] V-008 and V-009 documented in ADR-002 and ADR-003.
- [ ] 8-prompt routing regression suite run with results recorded.
- [ ] Compiler validation and strict spec validation run with exit codes recorded.
- [ ] sk-code diff check proves no sk-code modifications.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical remediation over existing OpenCode skill files.

### Key Components

- **mcp-coco-index settings**: owns canonical resource defaults for indexing.
- **system-spec-kit skill advisor**: owns generic skill routing heuristics and compiled JS mirrors.
- **mcp-code-mode docs and playbook**: owns MyService examples and workflow log expectations.
- **cli-opencode docs**: owns external runtime dispatch examples.
- **mcp-chrome-devtools examples**: owns browser-debug example docs.
- **071-001 remediation docs**: owns scope, ADRs, evidence, and verification summary.

### Data Flow

Verifier findings map to exact file edits. Source edits are mirrored where compiled runtime files are checked in, then the advisor script and compiler checks validate routing and graph health.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| CocoIndex canonical resource defaults | Boost hidden `.opencode/skills/*/assets/**` resources | Replace named library folder with generic placeholder | `rg -n "motion_dev|motion\\.dev" settings.py` |
| Advisor explicit and lexical lanes | Score prompt tokens and phrase hints | Remove stack-specific route cues outside sk-code | 8-prompt suite and source grep |
| Advisor Python legacy script | CLI advisor scoring implementation | Mirror generic route terminology | 8-prompt suite |
| Advisor dist JS lanes | Checked-in runtime mirror | Mirror source changes | `rg` source/dist parity spot check |
| Scan artifacts | Historical validation output | Neutralize real-client path names in place | `rg -ni "nobel|a[ ._-]*nobel"` |
| cli-opencode docs | Cross-runtime command examples | Replace local paths with placeholders | Gate 3 grep |
| mcp-code-mode docs | Tool naming examples | Align MyService site listing call | `rg -n "myservice\\.myservice_"` |
| mcp-chrome-devtools examples | Example guidance | Remove dead sk-code links | `rg -n "sk-code/references"` |

Required inventories:
- Same-class producers: exact `rg` searches for each verifier term in the touched skill files.
- Consumers of changed advisor routing: the 8-prompt suite.
- Matrix axes: P0/P1/P2 finding severity, source vs docs, authored vs compiled/generated, in-scope vs out-of-scope.
- Algorithm invariant: advisor generic routing must still route `implement a frontend component` to `sk-code` without using stack-specific tokens.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read verifier report.
- [x] Scaffold `001-remediation`.
- [x] Inspect target file status and scan artifact history.

### Phase 2: Core Implementation

- [ ] Fix V-005 cli-opencode local paths.
- [ ] Fix V-004 mcp-code-mode real-client log.
- [ ] Fix V-006 MyService tool name.
- [ ] Fix V-003 scan artifacts.
- [ ] Fix V-001 CocoIndex canonical assets default.
- [ ] Fix V-002 advisor source and dist mirrors.
- [ ] Fix V-007 dead links.
- [ ] Document V-008 and V-009 ADRs.

### Phase 3: Verification

- [ ] Run broadened grep gate.
- [ ] Run surface-tag gate.
- [ ] Run `/Users/` path gate.
- [ ] Run 8-prompt routing suite.
- [ ] Run skill graph compiler validation.
- [ ] Run child and parent strict spec validation.
- [ ] Run sk-code untouched check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | Residual stack/client/local path terms | User-provided grep gates |
| Regression | Advisor routing | 8-prompt `skill_advisor.py` loop |
| Compiler | Skill graph validity | `skill_graph_compiler.py --validate-only` |
| Spec validation | Child and parent spec folders | `validate.sh --strict` |
| Scope safety | sk-code untouched | `git diff --name-only .opencode/skills/sk-code/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing verifier report | Internal | Green | Provides authoritative findings |
| system-spec-kit templates | Internal | Green | Child packet scaffolding complete |
| Advisor Python CLI | Internal | Green | Needed for routing suite |
| Existing dirty worktree | Local state | Yellow | Requires narrow path diffs and no unrelated cleanup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor regression fails with no simple generic replacement, compiler validation fails due the remediation, or a targeted edit changes sk-code.
- **Procedure**: Revert only this packet's touched files from the local diff, preserving unrelated pre-existing changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 minutes |
| Core Implementation | Medium | 1-2 hours |
| Verification | Medium | 30-60 minutes |
| **Total** | | **2-3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Dirty worktree reviewed for target-file overlap.
- [x] Allowed write paths identified.
- [ ] Pre/post grep counts captured.

### Rollback Procedure

1. Use `git diff -- <target>` to isolate this remediation's paths.
2. Apply reverse patches only to the remediation edits if a gate fails due this change.
3. Re-run the failed verification command.
4. Preserve unrelated worktree changes.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
