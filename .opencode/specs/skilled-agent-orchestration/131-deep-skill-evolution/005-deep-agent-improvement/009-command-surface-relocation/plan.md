---
title: "Implementation Plan: Deep Agent Improvement Command Surface Relocation"
description: "Move the agent improvement command into the deep family, make /prompt the root prompt command, remove improve command folders, and rewrite stale references across docs, mirrors, skills, specs, and archives."
trigger_phrases:
  - "implementation plan deep agent command relocation"
  - "deep start agent improvement loop assets"
  - "prompt root command migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/009-command-surface-relocation"
    last_updated_at: "2026-05-24T06:55:51Z"
    last_updated_by: "codex"
    recent_action: "completed command surface migration verification"
    next_safe_action: "report final status"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
      - ".opencode/commands/prompt.md"
      - ".gemini/commands/prompt.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000010"
      session_id: "codex-2026-05-24-command-surface-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use exact-string replacement for old command names and paths."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep Agent Improvement Command Surface Relocation

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Markdown slash commands, YAML workflow assets, TOML runtime mirrors, skill docs/spec docs |
| **Primary Commands** | `/deep:start-agent-improvement-loop`, `/prompt` |
| **Storage** | Repository files only |
| **Testing** | `rg` gates, spec validator, skill-advisor smoke tests, alignment drift script |

### Overview

This migration is a command-surface relocation, not a behavior rewrite. The plan is to move/rename files first, run exact-string reference rewrites across the repo, then manually normalize live command indexes and mirrors where a blind replacement would produce the wrong canonical surface.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready

- [x] User supplied exact target phase folder.
- [x] User supplied canonical public surfaces and asset names.
- [x] User chose repo-wide reference rewriting, including archives and changelogs.

### Definition of Done

- [x] Old improve folders are absent.
- [x] New deep assets and Gemini mirrors exist.
- [x] Zero-old-reference grep gate returns no matches.
- [x] Spec validation passes for child and recursive parent.
- [x] Routing smoke tests return expected skills.
- [x] Alignment drift check is run and result reported.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Command family relocation with root utility split.

### Key Components

- **OpenCode command specs**: executable Markdown contracts under `.opencode/commands/`.
- **YAML workflow assets**: mode-specific workflow files loaded by command setup.
- **Runtime mirrors**: Gemini TOML files that delegate to OpenCode command specs.
- **Skill/routing docs**: deep-agent-improvement, prompt-improver, cli-opencode, and skill-advisor references that shape operator routing.
- **Spec metadata**: child `009` docs plus parent phase map.

### Data Flow

Operators invoke `/deep:start-agent-improvement-loop` or `/prompt`. OpenCode/Gemini command surfaces load the canonical Markdown command spec, which then loads either skill references or deep-loop YAML assets. Skill-advisor and agents describe the same public surface so dispatch and documentation agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Agent loop command entrypoint | Update syntax, examples, and asset paths | Positive grep for `/deep:start-agent-improvement-loop` and asset load lines |
| `.opencode/commands/prompt.md` | Prompt command entrypoint | Update setup text, purpose, and examples to `/prompt` | Positive grep for `/prompt`, zero grep for `the legacy prompt-improvement command` |
| `.opencode/commands/deep/assets/*` | Deep workflow assets | Move old assets to new names | `ls` asset check |
| `.opencode/commands/README.txt` | Command index | Remove improve group; add deep/root surfaces | Manual read + grep |
| `.gemini/commands/*` | Runtime mirrors | Move agent mirror under deep and add root prompt mirror | File checks + TOML contents |
| Prompt-improver agents | Fresh-context prompt worker docs | Update command surface/path references | Exact grep |
| Skill-advisor routing | Skill selection smoke | Ensure new phrases route | Smoke commands |
| Spec parent `005` | Phase parent map | Add child `009` | Recursive spec validation |

### Producer Inventory

Exact producers of removed command surfaces are strings, not APIs. The producer inventory is the repo-wide `rg --hidden --glob '!.git'` gate for removed command names, command paths, and legacy asset name tokens.

### Consumer Inventory

Consumers are command specs, runtime mirrors, prompt-improver agents, skill docs, command indexes, specs, archives, and changelogs. All are updated by exact replacements plus manual normalization of live command indexes and mirrors.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. Implementation Phases

### Phase 1: File Moves

- Move the legacy auto asset to `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`.
- Move the legacy confirm asset to `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`.
- Move Gemini agent mirror from improve to deep.
- Remove empty improve command groups.

### Phase 2: Command Surface Rewrite

- Update deep agent command syntax, load paths, examples, and related commands.
- Update prompt command syntax, setup/error/purpose text, and examples.
- Add/update Gemini mirrors for the new root/deep surfaces.
- Remove stale non-canonical Gemini prompt mirror drift.

### Phase 3: Repo-Wide Reference Rewrite

- Apply exact replacements for old command names, old paths, and old asset names.
- Include hidden files, archives, changelogs, specs, skill docs, runtime agents, and root docs.
- Re-run zero-reference gate until clean.

### Phase 4: Spec Metadata

- Populate this `009-command-surface-relocation` Level 3 phase.
- Add `009` to parent phase map and `children_ids`.
- Ensure `description.json` and `graph-metadata.json` exist for the child.

### Phase 5: Verification

- Run file existence/deletion checks.
- Run old/new reference grep gates.
- Run child and recursive parent spec validation.
- Run skill-advisor smoke tests.
- Run OpenCode alignment drift check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Check | Command | Expected |
|-------|---------|----------|
| File checks | `test ! -e ... && ls ...` | Old folders absent and new assets present |
| Old-reference gate | `rg --hidden --glob '!.git' '<old-reference-pattern>' .` | No matches |
| Positive-reference gate | `rg --hidden --glob '!.git' '<new-reference-pattern>' .` | Matches in command/docs surfaces |
| Spec validation | `validate.sh <child> --strict` and parent recursive validation | Exit 0 |
| Routing smoke | `skill_advisor.py ... --threshold 0.8` | Expected skills pass threshold |
| Alignment drift | `verify_alignment_drift.py --root .opencode` | Run and record pass/fail |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Purpose | Status |
|------------|---------|--------|
| `deep-agent-improvement` skill | Runtime loop implementation and docs | Present |
| `sk-prompt` skill | Prompt command implementation route | Present |
| `system-skill-advisor` | Routing smoke tests | Present |
| Spec validator | Documentation gate | Present |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Rollback would restore the old command group and aliases, which conflicts with the user request. If a hard failure appears, the practical rollback is to stop, report the exact failing gate, and leave the new command surfaces in place while fixing the failing mirror or reference.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L3: Phase Dependencies

| Phase | Depends On |
|-------|------------|
| File Moves | User-provided target paths |
| Command Surface Rewrite | File moves complete |
| Repo-Wide Rewrite | Canonical command names chosen |
| Spec Metadata | Phase folder exists |
| Verification | All edits complete |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L3: Effort

| Area | Effort | Notes |
|------|--------|-------|
| File moves | Low | Git moves and directory cleanup |
| Reference rewrite | Medium | Broad hidden-file sweep |
| Spec docs | Medium | Level 3 packet and parent metadata |
| Verification | Medium | Multiple gates and drift script |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L3: Enhanced Rollback

Rollback is intentionally constrained: do not recreate removed aliases unless the user changes the requirement. Fix forward by correcting stale references, mirrors, or docs that fail validation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: Dependency Graph

```text
assets moved
  -> command specs updated
  -> mirrors updated
  -> repo-wide reference rewrite
  -> spec metadata update
  -> validation gates
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

The critical path is asset move, command spec update, zero-reference cleanup, then validation. Parent metadata can be fixed after the command surface is stable, but completion cannot be claimed until both child and parent validation gates run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: Milestones

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 File migration | New assets exist; old improve folders absent |
| M2 Surface alignment | Command docs and mirrors use canonical names |
| M3 Reference cleanup | Zero-old-reference gate clean |
| M4 Spec completion | Child and parent metadata validate |
| M5 Routing verification | Skill-advisor and alignment checks recorded |
<!-- /ANCHOR:milestones -->
