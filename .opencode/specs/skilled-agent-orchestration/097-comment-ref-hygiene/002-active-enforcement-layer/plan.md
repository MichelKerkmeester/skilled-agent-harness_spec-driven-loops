---
title: "Implementation Plan: Active enforcement layer for comment hygiene"
description: "Layered enforcement: write-time hooks (Claude Code, OpenCode), git pre-commit gate, shared checker script, sk-code quality gate step, CLAUDE.md entry, constitutional memory."
trigger_phrases:
  - "comment hygiene enforcement plan"
  - "119 enforcement layer plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/097-comment-ref-hygiene/002-active-enforcement-layer"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Investigation T01-T07 complete"
    next_safe_action: "Implement checker script (T10-T13)"
    blockers: []
    key_files: []
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Q1: PostToolUse stdin schema confirmed — tool_name, tool_input.file_path, tool_result"
      - "Q2: Write=Write, Edit=Edit (PascalCase); matcher string Write|Edit"
      - "Q3: OpenCode has no file-write hook; gap documented; pre-commit is the fallback"
      - "Q4-Q6: Codex/Gemini/Devin hook coverage deferred to T25-T27 decision records"
      - "Q7: install-hooks.sh manual symlink strategy; no Husky"
---
# Implementation Plan: Active Enforcement Layer for Comment Hygiene

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (checker + hooks), JSON (settings.local.json, opencode.json), Markdown (CLAUDE.md, sk-code SKILL.md) |
| **Framework** | Claude Code hook system, OpenCode plugin/event system, Git hooks, sk-code skill |
| **Storage** | None — script files, config entries, docs only |
| **Testing** | Manual smoke-tests; checker calibration corpus; git hook integration test |

### Overview

Build a shared checker script first. Wire it into write-time hooks (Claude Code PostToolUse, OpenCode write event) for real-time AI feedback, then into a git pre-commit hook for the final runtime-agnostic gate. Layer passive reinforcement (CLAUDE.md §1, constitutional memory) on top. All tiers call the same checker script so the pattern logic lives in one place.

**Strategy**: investigate APIs → build shared script → passive reinforcement → write-time hooks → commit-time gate → sk-code router step → verify.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear (spec.md §2): text rule ignored across ~100 commits, 27-file cleanup required
- [x] Success criteria measurable (SC-001/002/003)
- [x] Dependencies identified: hook API docs, existing hook scripts, git

### Definition of Done
- [ ] REQ-001/002: checker correctly identifies violations; zero false positives on allowed classes
- [ ] REQ-003: pre-commit hook blocks a dirty commit
- [ ] REQ-004: Claude Code PostToolUse hook warning appears in tool result
- [ ] REQ-005/006/007/008: all P1 requirements met or user-approved deferred
- [ ] validate.sh --strict Exit 0; checklist complete with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared checker script as single source of truth for pattern logic → called by all enforcement tiers. Fail-safe hooks (exit 0 on error, log warning) to avoid blocking legitimate tooling.

### Key Components
- **`check-comment-hygiene.sh`**: language-aware comment detector + ephemeral ref pattern matcher. Single source of truth for all tiers.
- **Claude Code PostToolUse hook** (`claude-posttooluse.sh`): reads stdin JSON, extracts file_path, calls checker, prints warning to stdout (injected into tool result).
- **OpenCode write hook**: wire in `opencode.json` OR document gap + plugin approach.
- **Git pre-commit hook** (`.opencode/hooks/pre-commit`): iterates staged files, calls checker, blocks commit on violation.
- **Passive reinforcement**: CLAUDE.md §1 entry + constitutional memory entry (always-surface).
- **sk-code SKILL.md Phase 1.5**: explicit "run checker" step in the quality gate.

### Data Flow
```
AI writes code → PostToolUse hook → checker → warning in tool result (AI corrects)
AI commits → pre-commit hook → checker → blocks commit (enforced)
AI reads CLAUDE.md / searches memory → comment hygiene rule in view (passive)
AI follows sk-code Phase 1.5 → checker step explicit → active scan before commit
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Action | Notes |
|---------|--------|-------|
| `sk-code/scripts/` | Create | New folder; checker + hook scripts |
| `.claude/settings.local.json` | Modify | PostToolUse hook entry for Write\|Edit |
| `opencode.json` | Modify or gap | Write event hook if available |
| `.opencode/hooks/pre-commit` | Create | Committed git hook |
| `sk-code SKILL.md Phase 1.5` | Modify | Add checker step |
| `CLAUDE.md §1` | Modify | Comment hygiene rule entry |
| `system-spec-kit/constitutional/` | Create | Always-surface memory entry |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read existing hook scripts to confirm PostToolUse stdin schema (Q1) — schema confirmed; `tool_input.file_path` extracted via jq
- [x] Read `opencode.json` hooks to determine write event availability (Q3) — no file-write hook exists; gap documented; pre-commit is the fallback for OpenCode sessions
- [x] Read `hook_system.md` Codex/Gemini/Devin sections (Q4–Q6) — deferred to T25/T26/T27 decision records during implementation phase; not a blocker for checker script
- [x] Check package.json for Husky; decide pre-commit install strategy (Q7) — install-hooks.sh manual symlink approach selected; no Husky dependency

### Phase 2: Implementation
- [ ] Create `sk-code/scripts/` + write `check-comment-hygiene.sh`
- [ ] Calibrate checker against violation corpus and allowed corpus
- [ ] Add CLAUDE.md §1 comment hygiene entry
- [ ] Create constitutional memory entry
- [ ] Add sk-code Phase 1.5 checker step
- [ ] Write `claude-posttooluse.sh` + wire PostToolUse hook in `.claude/settings.local.json`
- [ ] Wire OpenCode hook OR write gap decision record ADR
- [ ] Write `.opencode/hooks/pre-commit` + `install-hooks.sh`
- [ ] Wire Codex/Gemini/Devin hooks where supported; document gaps

### Phase 3: Verification
- [ ] Smoke-test checker: known violation → exit 1; allowed comment → exit 0
- [ ] Smoke-test Claude Code hook: write violation → hook warning appears
- [ ] Smoke-test pre-commit: stage violation → commit blocked; clean file → commit passes
- [ ] validate.sh --strict Exit 0; checklist complete with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Unit (checker) | Each violation pattern; each allowed class | Direct invocation with crafted input files |
| Integration (hook) | Claude Code PostToolUse fires on Write | Write a TS file with violation in Claude Code session |
| Integration (pre-commit) | Pre-commit blocks dirty staged file | Stage file with violation; attempt `git commit` |
| Regression | Existing clean codebase produces no false positives | Run checker on 5 existing TS files known to be clean |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude Code hook stdin schema (Q1) | Research | Resolved | PostToolUse hook unblocked |
| OpenCode write event availability (Q3) | Research | Resolved (gap) | OpenCode hook tier not possible; pre-commit is fallback |
| `git` pre-commit hook infrastructure | Internal | Green | Pre-commit gate blocked |
| Constitutional memory MCP tool | Internal | Green | Constitutional entry blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hook causes false positives, breaking legitimate commits or AI sessions.
- **Procedure for hooks**: Remove the hook entry from `settings.local.json` or `opencode.json`; revert the `pre-commit` symlink; no code changes required. The checker script remains and can be re-calibrated.
- **Procedure for CLAUDE.md**: Revert the added block via `git revert`.
- **Checker script**: Never has production impact — it only reads files and exits. Safe to keep even if hooks are disabled.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Investigate) → Task 2 (Checker) → Tasks 3–4 (Passive + sk-code)
                                          → Tasks 5–6 (Write-time hooks)
                                          → Task 7 (Pre-commit gate)
                                          → Task 8 (Codex/Gemini/Devin)
                                          → Task 9 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigation (T1) | None | All implementation tasks |
| Checker script (T2) | T1 | T5, T6, T7, T8 |
| Passive reinforcement (T3) | None | Verify |
| sk-code gate (T4) | T2 | Verify |
| Write-time hooks (T5, T6) | T1, T2 | Verify |
| Pre-commit gate (T7) | T2 | Verify |
| Verify (T9) | T2–T8 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Task | Complexity | Estimated Effort |
|------|------------|-----------------|
| T1 Investigation | Low | ~1–2h reading |
| T2 Checker script | Medium | ~2–3h write + calibrate |
| T3 Passive reinforcement | Low | ~30min |
| T4 sk-code gate step | Low | ~20min |
| T5 Claude Code hook | Medium | ~1–2h |
| T6 OpenCode hook | Low–Med | ~1h implement or document gap |
| T7 Pre-commit hook | Medium | ~1–2h |
| T8 Codex/Gemini/Devin | Low | ~1h investigate + wire |
| T9 Verification | Low | ~1h |
| **Total** | **Medium** | **~9–14h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checker calibrated to zero false positives on 20-file allowed corpus
- [ ] Hook fail-safe confirmed: missing script exits 0 (no block)

### Rollback Procedure
1. Hook causes problems: remove the hook entry from settings; checker script is inert.
2. CLAUDE.md entry causes confusion: `git revert` the entry commit.
3. Pre-commit blocks legitimate commit: add `// hygiene-ok` escape or remove `pre-commit` symlink temporarily.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are configuration/scripts/docs.
<!-- /ANCHOR:enhanced-rollback -->
