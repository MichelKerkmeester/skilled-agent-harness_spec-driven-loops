---
title: "Implementation Plan: Phase 004 Runtime Mirrors"
description: "Patch runtime mirror references in .claude, .codex, and .gemini, then verify with residual grep and strict spec validation."
trigger_phrases:
  - "070 phase 004 plan"
  - "runtime mirror rename plan"
  - "claude codex gemini rename plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/004-runtime-mirrors"
    last_updated_at: "2026-05-05T16:20:37Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned Phase 004 runtime mirror text replacements"
    next_safe_action: "Apply exact string replacements"
    blockers: []
    key_files:
      - "plan.md"
      - ".claude/agents"
      - ".codex/agents"
      - ".gemini/agents"
      - ".gemini/commands/speckit/deep-research.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 004 Runtime Mirrors

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TOML, shell |
| **Framework** | Runtime mirror agent and command definitions |
| **Storage** | Git-tracked runtime mirror files |
| **Testing** | Exact residual grep, TOML parse check, strict spec validation |

### Overview
Phase 004 updates stale `sk-deep-*` references in runtime mirror surfaces only. The work is intentionally mechanical: read the Phase 001 rows, patch exact strings, check no backup files remain, and validate both the phase child and parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent `spec.md` read for rename context.
- [x] Parent `resource-map.md` read for runtime mirror ownership.
- [x] Phase 001 `inventory.tsv` filtered for Phase 004 runtime rows.
- [x] Runtime mirror files with old names identified by `rg`.
- [x] Phase folder scope is pre-approved.

### Definition of Done
- [ ] Runtime mirror old-name grep returns zero rows across `.claude`, `.codex`, and `.gemini` (blocked by `.codex` write denial; residual count 4).
- [x] TOML files touched or targeted in `.codex` and `.gemini` parse (evidence: `/opt/homebrew/bin/python3.11` `tomllib` printed `toml ok`).
- [x] Replacement backup files are absent (evidence: `find .claude .codex .gemini ...` returned no rows).
- [x] Child and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scoped exact-string replacement across runtime mirror text files.

### Key Components
- **Claude mirror**: `.claude/agents/*.md`.
- **Codex mirror**: `.codex/agents/*.toml`.
- **Gemini mirror**: `.gemini/agents/*.md` and the Phase 004-owned command mirror.
- **Validator**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`.

### Data Flow
Phase 001 inventory selects owned files. Exact replacement rewrites stale identifiers. Residual grep proves old-name absence. TOML parsing catches broken quoting in runtime definitions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Planning Artifact Setup
- [x] Read parent and inventory context.
- [x] Read runtime README files and old-name match context.
- [x] Author Level 2 phase artifacts.

### Phase 2: Runtime Mirror Replacement
- [ ] Replace the old deep review skill ID with `deep-review` in `.claude`, `.codex`, and `.gemini`.
- [ ] Replace the old deep research skill ID with `deep-research` in `.claude`, `.codex`, and `.gemini`.
- [ ] Remove any backup files if a replacement tool creates them.

### Phase 3: Verification
- [ ] Run residual grep across `.claude`, `.codex`, and `.gemini`.
- [ ] Parse touched TOML runtime files.
- [ ] Run child strict validation.
- [ ] Run parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Old-name absence | Runtime mirror trees | `grep -rln` |
| TOML syntax | `.codex/agents/*.toml`, `.gemini/commands/**/*.toml` touched by this phase | Python `tomllib` |
| Backup cleanup | Runtime mirror trees | `find` |
| Artifact validation | Phase child and parent specs | `validate.sh --strict` |

Verification commands:

```bash
grep -rln "deep-review\|deep-research" .claude .codex .gemini 2>/dev/null
python3 - <<'PY'
import tomllib
for path in [
    ".codex/agents/deep-research.toml",
    ".codex/agents/deep-review.toml",
    ".codex/agents/orchestrate.toml",
    ".gemini/commands/speckit/deep-research.toml",
]:
    with open(path, "rb") as f:
        tomllib.load(f)
print("toml ok")
PY
find .claude .codex .gemini -name "*.bak" -o -name "*.backup"
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename --strict
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent `spec.md` | Internal doc | Green | Rename purpose unclear |
| Parent `resource-map.md` | Internal doc | Green | Phase ownership unclear |
| Phase 001 `inventory.tsv` | Internal doc | Green | Exact runtime files unclear |
| Python `tomllib` | Local tooling | Green if Python 3.11+ | TOML parse check may need fallback |
| Spec validator | Local tooling | Green | Completion claim blocked if unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Residual grep finds stale runtime references, TOML parse fails, or strict validation fails.
- **Procedure**: Patch only Phase 004-owned runtime mirror files and phase artifacts, remove backup files, rerun grep and validation, and keep `.opencode` plus root/config surfaces untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Planning -> exact replacements -> residual grep -> TOML syntax check -> strict validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Planning | Parent docs and Phase 001 inventory | Runtime replacement |
| Runtime replacement | Planning | Residual grep |
| Verification | Runtime replacement | Phase 004 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Estimate | Actual |
|------|----------|--------|
| Planning artifacts | Small | Pending completion |
| Runtime mirror replacement | Small | Partially complete; `.codex` writes blocked |
| Syntax and grep verification | Small | TOML parse passed; residual grep count 4 |
| Strict validation | Small | Child and parent strict validation passed |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Because this phase is text-only, rollback is a bounded inverse replacement in the same files. If a TOML prompt string is malformed, restore the touched file from Git diff context, reapply exact replacements more narrowly, and rerun `tomllib` before claiming completion.
<!-- /ANCHOR:enhanced-rollback -->
