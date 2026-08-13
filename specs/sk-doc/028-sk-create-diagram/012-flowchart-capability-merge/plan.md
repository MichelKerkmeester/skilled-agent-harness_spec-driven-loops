---
title: "Plan: sk-create-diagram flowchart capability merge"
description: "Single-dispatch build to GPT-5.6-luna-fast (max), orchestrator-verified against the decision record."
trigger_phrases:
  - "diagram flowchart merge plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/012-flowchart-capability-merge"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch build"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-diagram flowchart capability merge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, Bash, Python |
| **Framework** | OpenCode sk-doc skills and create-command assets |
| **Storage** | Skill Advisor generated index and repository files |
| **Testing** | JSON/YAML parsing, shell syntax, byte comparisons, packet validators |

### Overview

The implementation ports the ASCII/markdown flowchart capability into `sk-create-diagram` behind an explicit output-format dial. It preserves the existing HTML/SVG path, redirects the old skill and command, refreshes advisor metadata, and validates the port independently.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Decision record resolved the format-dial, port, redirect, and validator ownership choices.
- [x] Scope identifies every implementation surface and the source-content preservation rule.
- [x] Verification commands are named before implementation.

### Definition of Done

- [x] Ported resources and routing surfaces are independently inspected.
- [x] JSON/YAML and shell checks pass for the changed implementation.
- [ ] Strict package and packet validators pass without blockers.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Format-first routing

The diagram workflow resolves `html-svg` or `ascii-markdown` before selecting an HTML/SVG type or ASCII pattern. `type-flowchart.md` remains the HTML/SVG flowchart reference; the ported ASCII resources live under their own domain folders.

### Key Components

- **`sk-create-diagram/SKILL.md`**: Owns format detection, ASCII guidance, and delivery rules.
- **Diagram command assets**: Detect or pre-select the output format and forward flowchart requests.
- **Hub metadata**: Maps merged aliases and leaf paths into the live advisor projection.
- **Ported validator**: Preserves the original ASCII flowchart validation contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Map both skills, registries, manifests, and command surfaces.
- [x] Record the format-dial and redirect decisions.

### Phase 2: Core Implementation

- [x] Port four ASCII references, six pattern assets, and the validator.
- [x] Update the diagram skill, script README, hub metadata, and command assets.
- [x] Redirect `sk-create-flowchart` and `/create:flowchart`.

### Phase 3: Verification

- [x] Run byte-integrity, parse, syntax, smoke, and advisor refresh checks.
- [ ] Resolve or explicitly defer the parent-recursive validation findings outside this child packet.
- [ ] Update packet completion state only after the authoritative gates pass.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integrity | Ported references, assets, and validator | `cmp`, `diff` |
| Syntax | JSON, YAML, and shell assets | Python JSON/PyYAML, `bash -n` |
| Behavior | ASCII validator on a ported pattern | `validate-flowchart.sh` |
| Routing | Advisor rebuild/validation and command inspection | Skill Advisor, direct reads |
| Packet | Spec contract and completion checks | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `sk-create-flowchart` source files | Internal | Green | Port comparison and rollback reference unavailable |
| `sk-doc` hub registry and manifest schemas | Internal | Green | Live routing projection cannot be updated safely |
| Skill Advisor rebuild/validation surface | Internal | Yellow | On-disk aliases may not match live routing |
| Current strict spec validator contract | Internal | Yellow | Packet completion remains blocked until docs conform |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Routing regression, broken port links, or failed validation after the merge.
- **Procedure**: Revert only the merge-scoped implementation files, restore the previous diagram command and metadata projections, and leave the preserved source skill resources available as the comparison baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Decision record -> resource port -> skill/command wiring -> hub projections
                                                   -> advisor refresh
Implementation files -> focused checks -> packet validation -> completion state
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Resource port | Source skill files | Target references/assets/script | Skill routing |
| Skill and command wiring | Format-dial decision | Runtime instructions | Routing checks |
| Hub projections | Alias and path inventory | Advisor input | Live refresh |
| Packet docs | Verification evidence | Completion claim | Strict packet gate |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Port resources and adapt only relative links.
2. Wire format-first routing and the flowchart redirect.
3. Refresh and validate the advisor projections.
4. Repair packet contract violations and rerun strict validation.

**Parallel Opportunities**:

- JSON/YAML parsing and port-integrity comparisons can run independently.
- Package validation and packet validation can be inspected independently after implementation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Capability ported | 11 target paths exist with expected content | Phase 2 |
| M2 | Routing merged | Skill, command, hub, and manifest surfaces agree | Phase 2 |
| M3 | Verification closed | Focused checks and strict packet validation pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the active packet documents and local `AGENTS.md` before editing.
- Confirm the requested file paths exist or are explicitly in the packet scope.
- Run focused checks that reproduce the current failure before changing validation-sensitive documents.
- Preserve unrelated worktree changes and stop on merge conflicts or failing authoritative checks.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete packet validation and implementation verification in dependency order. |
| TASK-SCOPE | Modify only the merge implementation files and this packet's authored documents. |
| TASK-EVIDENCE | Record concrete commands, paths, outputs, or comparisons for completed checks. |
| TASK-HALT | Do not claim completion while a strict gate or required checklist item remains unresolved. |

### Status Reporting Format

After each verification pass, record the command, exit result, changed scope, and the next safe action in the packet continuity documents.

### Blocked Task Protocol

When a gate fails, stop the completion claim, capture the exact failure, determine whether it is in scope, and either repair it with a focused rerun or report the blocker without altering unrelated files.
