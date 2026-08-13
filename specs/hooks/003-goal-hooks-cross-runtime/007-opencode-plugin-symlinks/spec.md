---
title: "Feature Specification: OpenCode plugin browsability symlinks in the hooks tree"
description: "Add relative, browsability-only symlinks inside .opencode/hooks/ concern folders pointing at the real OpenCode plugin files in .opencode/plugins/, so every AI runtime's adapters are visible from one unified tree without relocating OpenCode's plugin-discovery files."
trigger_phrases:
  - "opencode plugin symlinks"
  - "opencode hooks browsability mirror"
  - "hooks tree opencode row"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/007-opencode-plugin-symlinks"
    last_updated_at: "2026-07-28T20:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec for OpenCode plugin symlink mirror"
    next_safe_action: "Author plan.md and tasks.md for this phase"
    blockers: []
    key_files:
      - ".opencode/hooks/README.md"
      - ".opencode/plugins/mk-cli-dispatch-audit.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Direction is reversed from the Pi pattern: real files stay in .opencode/plugins/, symlinks live in the hooks tree."
      - "The goal/opencode/ row is deferred until phase 001's goal/ concern folder exists (it now does)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: OpenCode plugin browsability symlinks in the hooks tree

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Completed** | 2026-07-29 |
| **Branch** | `skilled/v4.0.0.0` (direct, per parent packet operator choice) |
| **Authority** | `cli-external-orchestration`, with touches in `.opencode/hooks/` concern folders and skill-owned hook trees (`system-spec-kit`, `sk-git`) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `006-dispatch-shape-coverage` |
| **Successor** | `008-goal-docs-hygiene` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The unified `.opencode/hooks/` tree shows a per-runtime adapter subfolder (`claude/`, `devin/`, `codex/`, `cursor/`, `pi/`) inside every portable concern folder — except OpenCode. OpenCode's own plugin files must physically live in `.opencode/plugins/` because that is the only directory OpenCode's plugin loader discovers; they cannot be relocated the way the other runtimes' adapters were. The result is that browsing `.opencode/hooks/` gives an incomplete picture of which runtimes a given concern actually covers, and OpenCode looks unsupported when it is in fact the origin runtime for several of these guard cores.

Purpose: add relative, read-only-in-effect, browsability symlinks inside each relevant concern folder (`opencode/<file>.js`) pointing back at the real file in `.opencode/plugins/`, so the tree is visually complete without moving anything OpenCode actually loads. This is the reverse of the Pi pattern used elsewhere in this hooks tree, where the real file sits inside the concern folder and `.pi/extensions/` holds the symlink back — here the real file must stay put in `.opencode/plugins/`, so the concern folder gets the symlink instead.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Six candidate relative symlinks, one `opencode/` subfolder per concern:
  - `.opencode/hooks/dispatch/opencode/mk-cli-dispatch-audit.js` -> `../../../plugins/mk-cli-dispatch-audit.js`
  - `.opencode/hooks/mcp-route-guard/opencode/mk-mcp-route-guard.js` -> `../../../plugins/mk-mcp-route-guard.js`
  - `.opencode/hooks/post-edit-quality/opencode/mk-post-edit-quality.js` -> `../../../plugins/mk-post-edit-quality.js`
  - `.opencode/hooks/task-dispatch/opencode/mk-deep-loop-guard.js` -> `../../../plugins/mk-deep-loop-guard.js`
  - `.opencode/hooks/goal/opencode/mk-goal.js` -> `../../../plugins/mk-goal.js` (only once phase 001's `.opencode/hooks/goal/` concern folder exists as a real, populated directory — it now does, so this row is in scope for this phase rather than deferred)
  - `.opencode/skills/system-spec-kit/mcp-server/hooks/opencode/mk-spec-gate.js` -> real target `.opencode/plugins/mk-spec-gate.js` (skill-owned, not under the unified hooks tree)
  - `.opencode/skills/sk-git/scripts/hooks/opencode/mk-git-preflight-advisory.js` -> real target `.opencode/plugins/mk-git-preflight-advisory.js` (skill-owned)
- Updating the directory-tree diagram, KEY FILES table, and any per-concern prose in `.opencode/hooks/README.md`, the four affected concern READMEs (`dispatch/README.md`, `mcp-route-guard/README.md`, `post-edit-quality/README.md`, `task-dispatch/README.md`), the not-yet-authored `.opencode/hooks/goal/README.md` (owned by a later phase; this phase notes the row but does not author that README), and the two skill-owned hook READMEs (`system-spec-kit/mcp-server/hooks/README.md`, `sk-git/scripts/hooks/README.md`) to show the new `opencode/` rows.
- Verifying every symlink resolves to a real, readable file.
- A live OpenCode session confirming zero double-load through the new symlinks (OpenCode's plugin discovery is documented to scan only `.opencode/plugins/`, but this must be confirmed live, not assumed from documentation).

### Out of Scope

- Moving any OpenCode plugin file itself out of `.opencode/plugins/` — OpenCode's plugin discovery requires the real file to live there.
- Any change to plugin behavior, contents, or the plugin-side `require`/`import` targets.
- Authoring `.opencode/hooks/goal/README.md` in full (owned by phase 008 goal-docs-hygiene) — this phase only adds the `opencode/` row reference once that README exists.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every symlink is relative, not absolute. | `readlink` on each new symlink returns a relative path with no leading `/`. |
| REQ-002 | Every symlink resolves to a real, existing, readable file. | `test -r <symlink>` (following the link) succeeds for all 7 symlinks; `readlink -f` (or Python `os.path.realpath`) resolves each to the actual `.opencode/plugins/<file>.js`. |
| REQ-003 | No OpenCode plugin file is moved, renamed, or duplicated. | `git status` on `.opencode/plugins/` shows zero changes; the 5 plugin files' content hashes are unchanged before/after. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confirm OpenCode does not double-load a plugin through the new symlinks. | A live OpenCode session started from repo root loads each of the 5 plugins exactly once (verified via a live session, not a documentation-only claim). |
| REQ-005 | Directory-tree diagrams and READMEs reflect the new `opencode/` rows. | `.opencode/hooks/README.md`, the 4 affected concern READMEs, and the 2 skill-owned hook READMEs all show an `opencode/` entry where applicable; `validate_document.py` passes on every touched doc. |
| REQ-006 | The `goal/opencode/` row is only added once its concern folder is a real, populated directory. | `.opencode/hooks/goal/lib/` exists and contains real files before `.opencode/hooks/goal/opencode/mk-goal.js` is created. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 symlinks exist, are relative, and resolve to their real `.opencode/plugins/` target.
- **SC-002**: A live OpenCode session confirms zero double-load across the 5 plugins reachable through these symlinks.
- **SC-003**: `.opencode/hooks/README.md` and the 6 other touched READMEs show the `opencode/` rows and pass `validate_document.py` with 0 issues.
- **SC-004**: `git status` on `.opencode/plugins/` is clean (no plugin file touched).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | OpenCode's plugin loader could, in theory, also scan symlinked directories reachable from elsewhere in the repo, causing a plugin to load twice with two different module identities. | Duplicate hook execution (e.g. a dispatch audit entry written twice) or duplicate-registration errors at session start. | Live OpenCode session smoke test before claiming completion (REQ-004); do not rely on documentation alone. |
| Risk | A broken relative-path symlink (wrong `../` depth) silently sits in the tree until someone tries to follow it. | Misleading browsability signal; a reader assumes OpenCode support exists but the link 404s. | `readlink -f` / realpath verification on every symlink as part of the validation loop. |
| Dependency | Phase 001 (`001-goal-core-and-state`) must have created `.opencode/hooks/goal/` as a real directory before the `goal/opencode/mk-goal.js` row is added. | If 001 has not landed, that one row cannot be created (the other 6 are independent). | Confirmed already satisfied: `.opencode/hooks/goal/lib/goal-core.cjs` exists on disk at spec-authoring time. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — the reverse-direction symlink pattern, the exact file list, and the phase-001 dependency are all resolved in the parent packet's plan.
<!-- /ANCHOR:questions -->
