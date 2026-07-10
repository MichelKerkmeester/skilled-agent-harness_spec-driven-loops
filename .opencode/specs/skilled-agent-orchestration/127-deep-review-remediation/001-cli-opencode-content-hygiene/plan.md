---
title: "Implementation Plan: Phase 1: cli-opencode-content-hygiene"
description: "Execution plan for the 5 WS-A cli-opencode content-hygiene fixes: verify each finding against the live file, apply a targeted edit, re-verify, then bump the version and author a changelog entry."
trigger_phrases:
  - "cli-opencode content hygiene plan"
  - "pkill scoping fix plan"
  - "cli-opencode readme fix plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/001-cli-opencode-content-hygiene"
    last_updated_at: "2026-07-10T05:33:00Z"
    last_updated_by: "claude"
    recent_action: "F1 kill form corrected after cross-verify"
    next_safe_action: "Run validate --strict"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-001-cli-opencode-content-hygiene"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: cli-opencode-content-hygiene

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
| **Language/Stack** | Markdown + YAML frontmatter (OpenCode skill documentation) |
| **Framework** | OpenCode skill spec format (SKILL.md rules + hard_rules, README quick-start) |
| **Storage** | Filesystem - skill files under `.opencode/skills/cli-opencode/` |
| **Testing** | grep verification + `validate.sh --strict` |

### Overview
This phase fixes 5 pre-existing content bugs in the live `cli-opencode` skill, each independently verified against the live file before and after the edit, without touching the in-flight v1.3.15.2 GPT-5.6 rename sharing the same tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 5 findings pre-specified with file:line evidence in the fix manifest.
- [x] Source review report (`125-cli-external-parent/review/review-report.md` §3 WS-A) confirms F1-F4; the manifest documents F5 (Fable-5 finding A-P1-3).
- [x] Scope boundary is unambiguous: strictly `.opencode/skills/cli-opencode/**`.

### Definition of Done
- [x] All 5 fixes applied and re-verified against live files.
- [x] `SKILL.md` version bumped, changelog entry authored.
- [x] `validate.sh --strict` passes 0/0 for this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted content-hygiene fix - no code, no runtime behavior change; documentation/instruction-text edits only.

### Key Components
- **SKILL.md ALWAYS rules**: Rule 5 (pkill exclusion) and Rule 16 (single-dispatch cleanup) - reconciled so Rule 16 no longer contradicts Rule 5.
- **README.md quick start + sibling table**: Step 3 default-dispatch recipe, Step 4 parallel-session quick start, and the "Sibling Boundaries" table.
- **manual_testing_playbook**: index links and per-scenario "Feature file path" trailers pointing at the two `sk-prompt-models`-suffixed template files.

### Data Flow
N/A - these are static documentation files read by agents dispatching through this skill; there is no runtime data flow to trace.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md` ALWAYS Rule 16 | Orphan-cleanup instruction for single-dispatch discipline | Update - scope the kill to a captured PID, cross-reference Rule 5 | `grep -n 'pkill -9 -f' SKILL.md` shows no remaining blanket pattern in Rule 16 |
| `README.md` Sibling Boundaries table | Documents cli-* family boundaries | Update - delete the stale 3rd row | Table row count check: exactly 2 data rows |
| `README.md` Step 3/Step 4 quick start | Copy-paste dispatch recipes | Update - remove `--agent context`, add share-confirm note | Read back both code blocks; confirm no `--agent` flag and the share note precedes Step 4's block |
| `manual_testing_playbook/*` | Test scenario docs and their cross-links | Update - repair 6 link targets | `grep -rn "with-sk-prompt/prompt-models" .opencode/skills/cli-opencode/` returns 0 |

Required inventories:
- Same-class producers: `grep -rn "with-sk-prompt/prompt-models" .opencode/skills/cli-opencode/` (all 6 corrupted link occurrences, confirmed before editing).
- Consumers of changed symbols: N/A - these are prose/doc links, not code symbols; no other file references the corrupted path form.
- Matrix axes: one axis per finding (F1-F5), independently fixable and independently verifiable; no cross-finding interaction.
- Algorithm invariant: N/A - no parser/resolver/security code touched; F1's invariant is "never blanket-kill `opencode run` by pattern match, only by a PID this dispatcher itself captured."
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the fix manifest and cross-referenced each of the 5 findings against live file line numbers.
- [x] Confirmed all 5 findings via grep/Read against live files before editing (not template estimates).

### Phase 2: Core Implementation
- [x] F1: Reconciled `SKILL.md` Rule 16 with Rule 5.
- [x] F2: Deleted the stale codex row from `README.md`.
- [x] F3: Added the share-confirmation note to `README.md` Step 4.
- [x] F4: Removed `--agent context` from `README.md` Step 3, moved the role into the prompt body.
- [x] F5: Repaired all 6 corrupted filename links.
- [x] Bumped `SKILL.md` version 1.3.15.2 → 1.3.15.3.
- [x] Authored `changelog/v1.3.15.3.md`.

### Phase 3: Verification
- [x] Re-grepped to confirm 0 remaining `with-sk-prompt/prompt-models` matches.
- [x] `git diff --stat` scoped to `cli-opencode/` confirmed only intended files changed and the GPT-5.6 rename stayed untouched.
- [x] Authored this Level 1 spec-kit packet and ran `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All 5 fixes against live file state | `grep`/`rg` |
| Structural diff check | Confirm no unintended files or lines touched | `git diff --stat`, `git diff` |
| Spec validation | Phase-folder frontmatter + task evidence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| v1.3.15.2 GPT-5.6 rename (uncommitted, same working tree) | Internal | Green | None - fixes are additive on top; scoped `git diff` confirms no collision. |
| Fix manifest (`phase1-cli-opencode.md`) | Internal (scratchpad input) | Green | N/A - manifest fully specified every fix; no blocking ambiguity encountered. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix found to alter unintended content, or `validate.sh --strict` fails after authoring.
- **Procedure**: No commit was made this session; `git diff -- .opencode/skills/cli-opencode/<file>` isolates each phase's edits, and `git checkout -- <file>` reverts a single file to its pre-phase state if a fix needs to be undone. Because the GPT-5.6 rename shares the same uncommitted files, a full-file revert would also drop that rename - prefer a scoped manual re-edit over `git checkout` unless the rename's owner confirms it is safe to lose.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
