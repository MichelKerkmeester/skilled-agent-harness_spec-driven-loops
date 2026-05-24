---
title: "Resource Map: @improve-agent → @deep-agent-improvement Rename"
description: "Active-scope file inventory: 4 agent file renames, 4 YAML asset filename renames, ~30 active reference files (~54 active refs). Excludes ~78 z_archive files (~189 historical refs) and barter/coder external repo."
trigger_phrases:
  - "087 resource map"
  - "agent rename inventory"
  - "deep-agent-improvement file ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename"
    last_updated_at: "2026-05-06T15:42:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "resource-map authored"
    next_safe_action: "validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000091"
      session_id: "087-resource-map-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

# Resource Map: `@improve-agent` → `@deep-agent-improvement` Rename

---

<!-- ANCHOR:summary -->
## Summary

- **Total active references**: ~54 across ~30 files (`@improve-agent` literal + frontmatter `name:` fields)
- **File renames**: 8 total (4 agent files + 4 YAML asset files)
- **By category**: Agents=4 / Commands=10 / Skills=15 / Documents=2 / Meta=2 / READMEs=2
- **Out of scope**: ~78 z_archive files (~189 historical refs), barter/coder external repo
- **Scope**: Active-code surface for the `@improve-agent` → `@deep-agent-improvement` rename.
- **Generated**: 2026-05-06T15:42:00Z

> Action vocabulary: `Created` · `Renamed` · `Updated` · `Analyzed`
> Status vocabulary: `OK` · `MISSING` · `PLANNED`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agents/README.txt` | Updated | OK | Line 18 — agent registry entry. T-016 |
| `.opencode/commands/README.txt` | Updated | OK | YAML filename refs + body. T-014 |
| `.claude/commands/README.txt` | Updated | OK | Mirror. T-014 |
| `.gemini/commands/deep/start-agent-improvement-loop.toml` | Updated | OK | Body content. T-014 |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/install_guides/SET-UP - AGENTS.md` | Analyzed | OK | Verify if mentions `@improve-agent`; update if found |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Updated | OK | 2+ refs to `@improve-agent` (lines ~269-270 YAML filename refs, line ~274 dispatch, line ~410 critic-pass note). T-013/T-014 |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Renamed + Updated | OK | `git mv` to `deep_start-agent-improvement-loop_auto.yaml`; 2 internal refs updated. T-009/T-014 |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Renamed + Updated | OK | `git mv` to `deep_start-agent-improvement-loop_confirm.yaml`; content update. T-010/T-014 |
| `.claude/commands/deep/start-agent-improvement-loop.md` | Updated | OK | Mirror. T-013/T-014 |
| `.claude/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Renamed + Updated | OK | T-011 |
| `.claude/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Renamed + Updated | OK | T-012 |
| `.gemini/commands/deep/start-agent-improvement-loop.toml` | Updated | OK | **Filename stays** (Gemini slash-command file convention); content update only. T-014 |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agents/improve-agent.md` | Renamed + Updated | OK | `git mv` to `deep-agent-improvement.md`; frontmatter `name:` rotated (T-001/T-005). Body self-refs updated. |
| `.claude/agents/improve-agent.md` | Renamed + Updated | OK | `git mv` to `deep-agent-improvement.md` (T-002/T-006) |
| `.gemini/agents/improve-agent.md` | Renamed + Updated | OK | `git mv` to `deep-agent-improvement.md` (T-003/T-007) |
| `.codex/agents/improve-agent.toml` | Renamed + Updated | OK | `git mv` to `deep-agent-improvement.toml`; `name = "..."` field rotated (T-004/T-008) |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Updated | OK | `@improve-agent` mentions. T-014 |
| `.opencode/skills/deep-agent-improvement/README.md` | Updated | OK | 1 ref. T-014 |
| `.opencode/skills/deep-agent-improvement/graph-metadata.json` | Updated | OK | 2 refs. T-014 |
| `.opencode/skills/deep-agent-improvement/changelog/v1.4.0.0.md` | Updated | OK | 2 refs. T-014 |
| `.opencode/skills/deep-agent-improvement/changelog/v1.5.0.0.md` | Created | PLANNED | New entry documenting agent rename. T-017 |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | 4 refs. T-014 |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md` | Updated | OK | 4 refs. T-014 |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/015-active-critic-overfit.md` | Updated | OK | 3 refs. T-014 |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/013-skill-load-not-protocol.md` | Updated | OK | 1 ref. T-014 |
| `.opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md` | Updated | OK | 1 ref. T-014 |
| `.opencode/skills/deep-agent-improvement/feature_catalog/02--integration-scanning/03-command-dispatch.md` | Updated | OK | 1 ref. T-014 |
| `.opencode/skills/sk-doc/assets/agent_template.md` | Updated | OK | 1 ref. T-014 |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/spec.md` | Created | OK | This packet's spec |
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/plan.md` | Created | OK | |
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/tasks.md` | Created | OK | |
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/checklist.md` | Created | OK | |
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/resource-map.md` | Created | OK | This file |
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md` | Created | PLANNED | T-023 — post-implementation |
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/description.json` | Created | PLANNED | Auto via generate-context.js |
| `.opencode/specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/graph-metadata.json` | Created | PLANNED | Auto via generate-context.js |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-sk-deep-agent-improvement/**` | Analyzed (out of scope) | OK | Skill rename predecessor; ~189 historical refs; not updated |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `README.md` | Updated | OK | Line 1097: dispatch @improve-agent. T-015 |
| `AGENTS.md` | Updated | OK | Line 324: agent registry entry. T-015 |
| `CLAUDE.md` | Updated (transitive) | OK | Symlink to AGENTS.md; updates transitively |
<!-- /ANCHOR:meta -->

---

## Out-of-Scope (historical record)

| Category | Approx Count | Reason |
|----------|--------------|--------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/042-*, 059-*, 060-*, 062-*, 070-*, 079-*` | ~78 files / ~189 refs | Historical research artifacts |
| `barter/coder/` external repo (mirrored agent + YAML files) | 7+ files | External; Barter handles its own propagation |

---

## Critical-File Risk Ranking

1. `.opencode/commands/deep/start-agent-improvement-loop.md` + `.claude/commands/deep/start-agent-improvement-loop.md` — YAML filename refs must update atomically with `git mv` of YAML asset files (T-013 + T-009..T-012)
2. 4 agent definition files — `git mv` + frontmatter `name:` rotation (T-001..T-008)
3. 4 YAML asset files — filename rename + content sed (T-009..T-012, T-014)
4. `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md` — most-referenced docs (4 refs each)

---

## Reference Coverage Verification

```bash
# Active-scope residual (must return 0):
rg -F '@improve-agent' .opencode .claude .gemini .codex AGENTS.md README.md \
  | grep -v '/specs/' \
  | grep -v '/z_archive/' \
  | grep -v '/barter/' \
  | wc -l

# Frontmatter (must return 0):
rg -F 'name: improve-agent' .opencode .claude .gemini 2>/dev/null | grep -v '/specs/' | grep -v '/z_archive/' | wc -l
rg -F 'name = "improve-agent"' .codex 2>/dev/null | grep -v '/specs/' | grep -v '/z_archive/' | wc -l
```

Expected: all `0`.

---

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Predecessor**: `z_archive/079-sk-deep-agent-improvement/`
- **Direct precedent**: `085-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename/`
