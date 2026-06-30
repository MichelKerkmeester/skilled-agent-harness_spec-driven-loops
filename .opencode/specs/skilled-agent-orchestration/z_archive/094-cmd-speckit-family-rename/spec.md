---
title: "Feature Specification: rename commands/spec_kit/ -> commands/speckit/ across all runtimes"
description: "Rename the SpecKit slash-command directory and update every reference (~1,170 files) so the invocation surface uses /speckit:* instead of /spec_kit:*."
trigger_phrases:
  - "speckit rename"
  - "spec_kit to speckit"
  - "commands/speckit"
  - "slash command rename"
  - "cli-devin rename dispatch"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/094-cmd-speckit-family-rename"
    last_updated_at: "2026-05-23T15:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Completed repo-wide rename + audit sweep + commit"
    next_safe_action: "Confirm via speckit:resume"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/"
      - ".gemini/commands/speckit/"
      - ".opencode/skills/system-spec-kit/scripts/tests/test-phase-command-workflows.js"
      - ".opencode/commands/README.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000132"
      session_id: "main-agent-2026-05-23-speckit-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - q: "Surfaces to rename — slash commands only, or also framework skill?"
        a: "Slash commands only. system-spec-kit framework skill preserved."
      - q: "Changelog / z_archive — update or preserve historical refs?"
        a: "Update everywhere, no exceptions."
      - q: "Permission mode for cli-devin SWE-1.6?"
        a: "--permission-mode dangerous, operator-approved (recorded in dispatch log)."
---
# Feature Specification: rename commands/spec_kit/ -> commands/speckit/

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` (no feature branch — per `[Stay on main, no feature branches]` memory) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The SpecKit slash-command directory was named `spec_kit/` (snake_case with underscore), inconsistent with the recent rename convention shipping `speckit` (single token) across the repo — e.g., `/create:sk-skill → /create:skill` and `doctor/help.md → doctor/speckit.md`. The directory name drives the slash-command form, so every `/spec_kit:plan`, `/spec_kit:complete`, etc. invocation was misaligned with the canonical short form.

### Purpose
Make the slash-command surface consistent: invoke as `/speckit:plan`, `/speckit:complete`, `/speckit:implement`, `/speckit:resume`. All ~1,170 body-text references repo-wide aligned with the new directory name.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `.opencode/commands/spec_kit/` -> `.opencode/commands/speckit/` (source dir)
- Rename `.gemini/commands/spec_kit/` -> `.gemini/commands/speckit/` (Gemini runtime)
- `.claude/commands` and `.codex/prompts` are symlinks to `.opencode/commands` — auto-inherit
- Rename 8 YAML assets `spec_kit_*` -> `speckit_*` under `commands/speckit/assets/`
- Update every body reference: `/spec_kit:* -> /speckit:*`, `commands/spec_kit/` paths, yaml basenames
- Fix 8 broken-by-rename files inside `system-spec-kit/` (5 tests + script comment + SKILL.md + README.md) so the framework skill's tests still resolve real paths
- Audit second pass + close residual P0/P1 stale refs found in `.opencode/commands/README.txt` and the broken-test file

### Out of Scope (preserved verbatim)
- `system-spec-kit` framework skill name (stays `system-spec-kit`)
- `.opencode/specs/system-spec-kit/` spec folder (stays)
- Z_archive historical references inside system-spec-kit/ (P2 historical, not actionable)
- Iteration JSON logs in deep-research/deep-review sessions (historical session records)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Type |
|----|-------------|------|
| R1 | Directory rename completes without losing git history | Functional |
| R2 | YAML asset basenames renamed to match `speckit_*` pattern | Functional |
| R3 | Every `/spec_kit:*` body-text reference outside the allowlist becomes `/speckit:*` | Functional |
| R4 | Every `commands/spec_kit/` path reference outside the allowlist becomes `commands/speckit/` | Functional |
| R5 | `system-spec-kit` framework skill and its spec folder remain unmodified | Constraint |
| R6 | The framework skill's live tests resolve to real renamed paths (not broken) | Functional |
| R7 | `/speckit:plan`, `/speckit:complete`, `/speckit:implement`, `/speckit:resume` invocations work | Functional |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `rg -il '/spec_kit:|commands/spec_kit/|spec_kit_*.yaml'` outside the system-spec-kit allowlist returns ZERO matches
- `.codex/prompts` and `.claude/commands` symlinks intact and resolve to `.opencode/commands/`
- 16 `speckit_*.yaml` assets present (8 source + 8 via symlink)
- `node .opencode/skills/system-spec-kit/scripts/tests/test-phase-command-workflows.js` exits 0 (89/89 PASS)
- Skill list shows `speckit:complete`, `speckit:plan`, `speckit:implement`, `speckit:resume`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| SWE-1.6 misses references inside Gemini TOML embedded markdown bodies | Pre-planning step 3 explicit grep for `/spec_kit:` after sweep; bundle-gate verification |
| Over-replacement into `system-spec-kit/` paths | Explicit exclusion list in dispatch prompt with guard-grep before each write batch |
| Dispatch stalls despite `--permission-mode dangerous` | Background dispatch with log capture; SIGKILL + re-dispatch protocol |
| ~2,000-file blast radius makes review hard | Objective verification gates (zero stale matches required); audit second pass |
| Skill-graph compiled cache stale after metadata changes | Compiler rebuild via `skill_graph_compiler.py --export-json --pretty` |
| `git add -A` not scope-strict (operator parallel work bundled in) | Acknowledged in commit message; second commit used strict scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. All scope decisions resolved through interactive AskUserQuestion prompts during planning.
<!-- /ANCHOR:questions -->
