---
title: "Implementation Plan: rename commands/spec_kit/ -> commands/speckit/"
description: "Two-phase execution plan: cli-devin SWE-1.6 dispatch for mass rename + reference sweep, followed by SWE-1.6 audit pass for residual cleanup."
trigger_phrases:
  - "speckit rename plan"
  - "cli-devin dispatch plan"
  - "speckit reference sweep"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-speckit-rename"
    last_updated_at: "2026-05-23T15:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Planned two-pass rename + audit"
    next_safe_action: "Execute Pass 1"
    blockers: []
    key_files: []
---
# Implementation Plan: rename commands/spec_kit/ -> commands/speckit/

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two-phase execution:
1. **Pass 1 — cli-devin SWE-1.6 (`--permission-mode dangerous`):** Mass dir rename + 8 yaml asset rename + ~1,170-file body-reference sweep. Single dispatch. RCAF prompt + medium-density pre-planning + sequential_thinking + standard bundle-gate language per cli-devin §4 Rule 12.
2. **Pass 2 — cli-devin SWE-1.6 (`--permission-mode auto`, read-only audit):** Audit sweep with edge-case patterns (singular-path typo, case variants, camelCase, hidden files). Produces structured P0/P1/P2 report.

Operator's `git add -A` was not strict-scope on Pass 1 commit — Pass 2 cleanup commit used explicit `git restore --staged .` + selective `git add` for strict scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold | Verification |
|------|-----------|--------------|
| Stale `/spec_kit:` outside allowlist | 0 matches | `rg -il '/spec_kit:' --glob='!**/system-spec-kit/**' --glob='!**/specs/system-spec-kit/**' --glob='!**/iterations/**'` |
| Stale `commands/spec_kit/` outside allowlist | 0 matches | `rg -il 'commands/spec_kit/' --glob='!**/system-spec-kit/**' --glob='!**/specs/system-spec-kit/**'` |
| Stale `spec_kit_*.yaml` outside allowlist | 0 matches | `rg -il 'spec_kit_[a-z_]+\.yaml' --glob='!**/system-spec-kit/**' --glob='!**/specs/system-spec-kit/**'` |
| Framework skill preserved | `system-spec-kit` SKILL.md exists; name unchanged | `rg -l '^name: system-spec-kit' .opencode/skills/system-spec-kit/SKILL.md` |
| Codex/Claude symlinks intact | `../.opencode/commands` and `../.opencode/skills` | `readlink .codex/prompts; readlink .claude/commands` |
| Asset count | 16 (8 source + 8 via symlink) | `find .claude/commands/speckit/assets .opencode/commands/speckit/assets -name 'speckit_*.yaml' \| wc -l` |
| Live test passes | exit 0, 89/89 PASS | `node test-phase-command-workflows.js` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Dispatch Topology
- **Pass 1 (write):** cli-devin SWE-1.6 background dispatch, log to `/tmp/devin-speckit-rename.log`, `--permission-mode dangerous` operator-approved
- **Pass 2 (read-only audit):** cli-devin SWE-1.6 background dispatch, `--permission-mode auto` (no writes intended)
- Both passes: RCAF framework, sequential_thinking ≥5 thoughts, standard (not tight) bundle-gate per `[cli-devin bundle verification gate]` and SKILL.md §4

### Exclusion Boundary
- Preserved: `**/system-spec-kit/**`, `**/specs/system-spec-kit/**` (framework skill + spec folder)
- Sweep allowed: everything else (changelogs, z_archive, install_guides, all runtime agent/command/skill files)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Filesystem renames
- `git mv .opencode/commands/spec_kit .opencode/commands/speckit`
- `git mv .gemini/commands/spec_kit .gemini/commands/speckit`
- 8 yaml renames inside `assets/`
- `.claude/commands` + `.codex/prompts` symlinks auto-inherit

### Phase 2 — Reference sweep
- Replacement table applied in order: longest path patterns first, then yaml basenames, then slash command verbs
- Exclusion-aware sed loop, file-by-file

### Phase 3 — Verification (Pass 1)
- 7 gates per Quality Gates table

### Phase 4 — Audit (Pass 2)
- Read-only SWE-1.6 sweep with edge-case patterns
- Findings closed: 3 P0 in `.opencode/commands/README.txt` + 1 P1 in `anobel.com/039` spec
- Plus 3 additional README hits surfaced beyond audit (lines 176/229/240)

### Phase 5 — Commit (strict scope)
- `git restore --staged .` then explicit `git add` of only intended files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `node .opencode/skills/system-spec-kit/scripts/tests/test-phase-command-workflows.js` must exit 0
- Manual smoke: `/speckit:plan`, `/speckit:complete` invocation resolves via skill harness
- ripgrep gates above must all return 0 outside the allowlist
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `devin` binary (`2026.5.6-12`) — authenticated via Codeium bridge
- `rg` (ripgrep) — primary sweep tool
- `git mv` — preserves history vs `mv`
- cli-devin SKILL.md + assets/prompt_quality_card.md + assets/prompt_templates.md — required reading before composing dispatch prompt
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the rename causes incidents, revert via:
- `git revert 576624ada8 ce6d9c0cee` (the two commits)
- The renames are pure dir+file moves; revert is mechanically clean
- No DB migrations, no external system integrations affected
<!-- /ANCHOR:rollback -->
