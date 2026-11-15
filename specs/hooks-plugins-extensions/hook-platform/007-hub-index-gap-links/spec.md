---
title: "Feature Specification: Hook hub index gap links and conversation scenario renames"
description: "Twelve Vibe guard scripts and two OpenCode plugins had no link from .skilled/hooks, so the hook hub index missed them. Twenty-nine conversation scenarios also carried a -conversation suffix that no rule asks for."
trigger_phrases:
  - "hub index gap links"
  - "hook hub index gap links and conversation scenario"
  - "vibe guard browsability symlink"
  - "conversation scenario suffix rename"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Hook hub index gap links and conversation scenario renames

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/412-hub-index-gap-links` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/hooks` is the index of every runtime hook, plugin and extension, but twelve Vibe guard scripts in `.vibe/plugins/repo-guards/` and the OpenCode `ask-surface-guard.js` and `decision-capture.js` plugins had no link from it. A reader who browses a concern folder sees every runtime except these. Separately, 29 conversation scenario files in the cli-external-orchestration playbooks end in `-conversation` although no playbook rule asks for it and no twin needs the suffix to stay distinct.

### Purpose
Every Skilled hook, plugin and extension is reachable from `.skilled/hooks`, and conversation scenarios without a single-prompt twin carry plain kebab-case names.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
A scan resolved every runtime hook file and classified it as held by `.skilled/hooks`, linked from it, or missing.
```text
before (origin/main bcd15801196): {"IN_HOOKS":61,"LINKED_FROM_HOOKS":94,"MISSING":68}
after this change:                {"IN_HOOKS":61,"LINKED_FROM_HOOKS":108,"MISSING":54}
dangling links inside .skilled/hooks: 0
```
The 54 still unlinked are one-line Pi entry stubs that re-export a covered file, OpenCode `lib/` helpers, the DSH bundle entry and its lineage marker, the Vibe `lib/hook-io.mjs` helper and `render-home-hooks.cjs`, and the two vendored third-party Pi packages.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a browsability symlink under `<concern>/vibe/` for each of the twelve Vibe guard scripts.
- Add `opencode/` browsability symlinks for `ask-surface-guard.js` and `decision-capture.js`.
- Update the hub README and the concern READMEs whose trees list runtime folders.
- Rename the 29 conversation scenarios that have no single-prompt twin and rewrite every live link to them.
- Regenerate the trigger index and its fixtures.

### Out of Scope
- The 11 conversation scenarios whose plain name would collide with a single-prompt twin. They keep the suffix because it is what tells the two files apart.
- Conversation scenarios outside the cli-external-orchestration hub. The operator chose the CLI playbooks only.
- Spec-folder history that names the old scenario paths. Those docs record what was true when written.
- Moving the vendored Pi packages into `.skilled/hooks`. They are third-party forks, not Skilled hooks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/<concern>/vibe/*.mjs` (12 links) | Create | Symlinks to `.vibe/plugins/repo-guards/` |
| `.skilled/hooks/{ask-surface-guard,decision-capture}/opencode/*.js` | Create | Symlinks to `.opencode/plugins/` |
| `.skilled/hooks/README.md` and eight concern READMEs | Modify | Trees and wiring text name the new links |
| 29 `*-conversation.md` scenarios | Rename | Drop the suffix |
| Three playbook indexes and the scenarios themselves | Modify | Links and runner commands use the new names |
| Trigger index and retrieval fixtures | Regenerate | Paths follow the renames |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every Vibe guard script and every OpenCode plugin is linked from `.skilled/hooks` | The coverage scan reports `LINKED_FROM_HOOKS` 108 and no dangling link |
| REQ-002 | No live doc links to a renamed path | `check-markdown-links.cjs` reports 0 broken |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The renamed playbooks still validate | `validate-playbook-package.cjs --package <root>` prints PASS with 0 violations for the hub and Vibe packages |
| REQ-004 | No hook suite regresses | Hook vitest suites and the OpenCode plugin suite pass. The node:test collection fails only where origin/main already fails |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The coverage scan moves from 94 to 108 linked files with 0 dangling links.
- **SC-002**: No file under `.skilled/skills/cli-external-orchestration` ends in `-conversation.md` unless a single-prompt twin shares its stem.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Mistral Vibe session in worktree 383 edits the same scenario files | Its next merge from main meets rename conflicts | Renames are pure `git mv` plus link edits, so git detects them and a merge carries edits across |
| Risk | A symlink under `.skilled/hooks` gets loaded twice by a test collector | Med | The CI collectors use `find -type f`, which skips links. The hook suites ran green after the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
