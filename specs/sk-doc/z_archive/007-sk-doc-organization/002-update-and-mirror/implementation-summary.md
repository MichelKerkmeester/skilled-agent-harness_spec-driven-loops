---
title: "Implementation Summary: Phase 2: update-and-mirror"
description: "4 fixed-string substitutions applied to 24 canonical .opencode/ files via sed, then mirrored to 4 runtimes (.claude/.codex via symlink, .gemini regenerated TOML, agents cp + sed). Zero residual hits in active scope."
trigger_phrases:
  - "068/002 summary"
  - "update-and-mirror summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization/002-update-and-mirror"
    last_updated_at: "2026-05-05T08:45:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 2 complete: substring sweep + 4-runtime mirror; tomllib parse-check OK on all 5 .toml files"
    next_safe_action: "Begin Phase 3 (003-verify-and-ship): opus verification + closeout"
    blockers: []
    key_files:
      - .opencode/skills/sk-doc/SKILL.md
      - .opencode/agents/create.md
      - .codex/agents/create.toml
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase2-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-update-and-mirror |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Predecessor** | 001-relocate (commit ccd73ef55) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now load sk-doc templates from the new shorter `assets/` paths and the four runtime mirrors stay in lockstep automatically. 24 files in canonical `.opencode/` got 4 fixed-string substitutions applied via sed (zero regex), `.claude/commands/create/` and `.codex/prompts/create/` followed for free because they're symlinks to `.opencode/commands/create/`, `.gemini/commands/create/*.toml` and `.codex/agents/create.toml` got the same sed treatment with TOML parse-check confirming clean output, and `.claude/agents/create.md` + `.gemini/agents/create.md` are now byte-identical copies of the updated `.opencode/agents/create.md`.

The discovery that `.claude/commands/` and `.codex/prompts/` are symlinks to `.opencode/commands/` simplified Phase 2 considerably — the originally planned rsync round-trip was a no-op for those mirrors. The TOML regeneration plan for `.gemini` was also unnecessary because the substring substitutions don't introduce any new quote/backslash characters that would break TOML escape rules; sed substitution on `.toml` files preserved structure (verified via `python3.12 -c "import tomllib; tomllib.loads(...)"` on all 5 .toml files).

### sk-doc internal references (11 files)
Updated path-string references in SKILL.md, 6 references/global/, 3 references/specific/, and 1 cross-ref in assets/documentation/frontmatter_templates.md. Markdown links and JSON array values now point to `assets/feature_catalog/`, `assets/testing_playbook/`, `assets/agent_template.md`, `assets/command_template.md`.

### /create:* command surface (11 canonical files = 33 effective via symlink)
Updated 4 .md command files (agent, changelog, feature-catalog, testing-playbook), 1 README.txt, and 6 YAML execution-path files (`primary:`, `root_catalog:`, `feature_file:` keys). `.claude/commands/create/` and `.codex/prompts/create/` follow automatically via symlink.

### .gemini command mirrors (4 .toml files, real directory)
Updated 4 .gemini/commands/create/*.toml prompt strings via sed. tomllib parse-check confirms all 4 still parse cleanly.

### @create agent across 4 runtimes (4 files, real directories)
Updated .opencode/agents/create.md via sed; copied byte-identical to .claude/agents/create.md and .gemini/agents/create.md; sed-substituted .codex/agents/create.toml (preserves workspace-write sandbox + Path Convention). tomllib parse-check confirms .codex .toml clean.

### Install guide (1 file)
Updated .opencode/install_guides/SET-UP - Opencode Agents.md (4 hits) to reflect new asset paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/SKILL.md` | Modified | sed × 4 patterns; ~7 path-ref updates |
| `.opencode/skills/sk-doc/references/global/{6 .md files}` | Modified | sed × 4 patterns each; ~17 path-ref updates total |
| `.opencode/skills/sk-doc/references/specific/{3 .md files}` | Modified | sed × 4 patterns each; ~13 path-ref updates total |
| `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md` | Modified | 1 cross-ref updated |
| `.opencode/commands/create/{4 .md files}` | Modified | path-table DOC_REF substitutions |
| `.opencode/commands/create/README.txt` | Modified | markdown link updates |
| `.opencode/commands/create/assets/{6 .yaml files}` | Modified | YAML execution-path keys (`primary:`, `root_catalog:`, `feature_file:`) updated |
| `.opencode/agents/create.md` | Modified | 6 path-refs updated (lines 186-189, 282-285) |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modified | 4 hits updated |
| `.gemini/commands/create/{agent,changelog,feature-catalog,testing-playbook}.toml` | Modified | 4 .toml prompt strings sed-substituted; tomllib parse OK |
| `.claude/agents/create.md` | Modified | cp from updated .opencode/agents/create.md (byte-identical) |
| `.gemini/agents/create.md` | Modified | cp from updated .opencode/agents/create.md (byte-identical) |
| `.codex/agents/create.toml` | Modified | sed × 4 patterns; sandbox + Path Convention preserved; tomllib parse OK |
| `.claude/commands/create/*` (33+ files) | Symlink-only | follows automatically via .claude/commands → .opencode/command symlink |
| `.codex/prompts/create/*` (33+ files) | Symlink-only | follows automatically via .codex/prompts → .opencode/command symlink |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Single batched sed dispatch on the 24 canonical files (one Bash call with a file array + per-file sed -i with 4 -e literal substitutions). After verifying canonical .opencode/ residual was zero, applied a second batched sed dispatch to the 5 real-directory mirrors (.gemini × 4 .toml + .codex/agents/create.toml). cp byte-identical from .opencode/agents/create.md to .claude/agents/create.md and .gemini/agents/create.md. tomllib parse-check via python3.12 confirmed all 5 .toml files still parse cleanly. Final `rg --no-config --no-ignore-vcs --glob '!**/specs/**' --glob '!**/z_archive/**' ...` confirms ZERO residual hits in active scope.

cli-codex was attempted twice (first without sandbox flag, then with `--sandbox workspace-write`) but stalled both times — likely a model-startup or sandbox-approval interaction. Pivoted to direct sed for time efficiency; substitution was mechanical and well-bounded so direct execution was justified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Direct sed instead of cli-codex | cli-codex stalled twice with zero output after 2-3 min; substitution scope was small and mechanical, so direct execution was the time-efficient choice |
| sed substitution on .toml (instead of regeneration) | Discovered substitution doesn't introduce any new quote/backslash chars, so TOML escape rules are preserved. Verified via tomllib parse-check on all 5 .toml files |
| .claude/.codex command mirrors via symlink (no rsync needed) | `.claude/commands/` → `.opencode/commands/` and `.codex/prompts/` → `.opencode/commands/` are symlinks; updates flow automatically. Saved a planned rsync round-trip |
| cp .opencode/agents/create.md to .claude/.gemini agents | These are real directories; cp ensures byte-identity. .codex/agents/create.toml stays sed-substituted to preserve its TOML wrapper |
| Excluded `.opencode/specs/**` from residual sweep | Spec folder records (003 history, iteration logs, research/review records, audit-findings, resource-maps) are immutable per memory rule; their references to old paths are historical accuracy |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 24 canonical .opencode/ files swept (sed exit 0 each) | PASS — all 24 logged "OK: <path>" |
| Pre-flight `diff -rq .opencode/commands/create/ .claude/commands/create/` returns empty | PASS (and discovered: same dir via symlink) |
| Pre-flight `diff -rq .opencode/commands/create/ .codex/prompts/create/` returns empty | PASS (same dir via symlink) |
| Post-rsync `diff -rq` byte-identity | PASS (no-op for symlink mirrors) |
| 4 .gemini/commands/create/*.toml parse via tomllib | PASS — all 4 exit 0 |
| .codex/agents/create.toml parse via tomllib | PASS — exit 0; sandbox + Path Convention preserved |
| `.claude/agents/create.md` byte-identical to `.opencode/agents/create.md` | PASS (`diff -q` empty) |
| `.gemini/agents/create.md` byte-identical to `.opencode/agents/create.md` | PASS (`diff -q` empty) |
| Final residual `rg` (active scope, excluding specs/z_archive/dist/observability/.tmp/barter/changelog-history) | PASS — ZERO hits (rg exit 1) |
| Stay on `main` branch | PASS — `git branch --show-current` returns `main`; no feature branch surviving |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`.opencode/specs/**` retains old path references in historical records.** Spec folder records (063 sk-doc-agent-template-alignment, 064 agent-create, 069 sk-code-motion-dev-and-playbook, 026/000 release-cleanup iteration logs/research/review/audit/resource-map files) reference `assets/agents/` and `assets/documentation/feature_catalog|testing_playbook` because they document repo state at the time of those packets. This is intentional historical accuracy, not stale-reference debt. Memory rule: "z_archive/, spec-folder iteration logs/research/review records (immutable history)".

2. **Phase 3 verification gate not yet run.** Opus verifier (`@review` + `sk-code-review`) has not yet validated the changes in fresh context. That happens in Phase 3 (003-verify-and-ship).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
