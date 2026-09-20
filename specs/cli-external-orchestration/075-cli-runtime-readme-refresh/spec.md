---
title: "Feature Specification: Refresh the eight cli runtime READMEs and their folder maps"
description: "Six of the eight cli runtime READMEs carry no directory tree at all, two more omit files that exist on disk, and cli-pi's README is the only one of the eight holding a broken markdown link because its contract pin points at a packet that has since moved into z_archive."
trigger_phrases:
  - "cli runtime readme refresh"
  - "runtime readme folder map"
  - "cli-pi stale contract pin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Refresh the eight cli runtime READMEs and their folder maps

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-09-20 |
| **Branch** | `worktrees/057-cli-runtime-readme-refresh` |
| **Workspace** | `.worktrees/057-cli-runtime-readme-refresh` (off `skilled/v4.0.0.0`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every runtime packet under `.skilled/skills/cli-external-orchestration/` ships a `README.md`, and they
have drifted from the folders they describe. Six of the eight carry no directory tree at all, so a
reader cannot see what a packet contains without listing the directory. Three reference files that
exist on disk are named nowhere: `cli-opencode/references/context-budget.md`,
`cli-opencode/references/permissions-matrix.md` and `cli-pi/references/providers-and-models.md`.
`cli-hermes` has a tree but omits its own `feature-catalog/` directory. `cli-jev` fails the shared
document validator for a missing overview section, the one runtime of the eight that does. And
`cli-pi` holds the only broken markdown link among the eight, because its contract pin cites a packet
path that has since been archived.

### Purpose

Bring all eight runtime READMEs in line with `sk-create-readme` — a directory tree plus a file/role
table naming every immediate subdirectory and every `references/` and `assets/` file — and repoint the
cli-pi contract pin, so each packet documents the folder it actually ships.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The eight runtime READMEs under `.skilled/skills/cli-external-orchestration/`: an added or extended
  `STRUCTURE` section for each, one fenced directory tree plus a `File | Role` table.
- `cli-jev`'s missing overview section, which the shared validator blocks on.
- The three reference files that exist but are named nowhere.
- The cli-pi stale contract pin: the same one-substring path repair across the 9 files that hold it as
  a markdown link, plus regeneration of the `.hermes/skills/cli-pi/SKILL.md` mirror.

### Out of Scope

- The hub `README.md` and `ROUTER.md` — not a runtime packet README, not asked for.
- `cli-orca` and every skill outside `cli-external-orchestration` — separate ownership.
- The 5 remaining repo-wide broken links (2 in `sk-create-skill/references/parent-skill/`, 1 in
  `system-spec-kit/runtime/hooks/cursor/`, 2 in `system-spec-kit/runtime/hooks/devin/`) — same class of
  stale path, different packets, pre-existing and unreported by the ask.
- The 3 `cli-pi/changelog/*.md` pin-path occurrences — see the note under Files to Change.
- The pre-existing hermes mirror drifts (7) and the pre-existing frontmatter violations (14, all
  `cli-orca`) — reds that predate this work and are not caused by it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-claude-code/README.md` | Modify | Add `STRUCTURE` section, renumber |
| `.skilled/skills/cli-external-orchestration/cli-codex/README.md` | Modify | Add `STRUCTURE` section, renumber |
| `.skilled/skills/cli-external-orchestration/cli-cursor/README.md` | Modify | Add `STRUCTURE` section, renumber |
| `.skilled/skills/cli-external-orchestration/cli-devin/README.md` | Modify | Add `STRUCTURE` section, renumber |
| `.skilled/skills/cli-external-orchestration/cli-hermes/README.md` | Modify | Extend existing tree with `feature-catalog/` |
| `.skilled/skills/cli-external-orchestration/cli-jev/README.md` | Modify | Retitle section 1 to `OVERVIEW`, extend `LAYOUT` tree |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | Modify | Add `STRUCTURE` section, name 2 unlisted references |
| `.skilled/skills/cli-external-orchestration/cli-pi/README.md` | Modify | Add `STRUCTURE` section, name 1 unlisted reference, repoint pin |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Repoint 2 pin links |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/*.md` | Modify | Repoint 6 pin links (agent-delegation, cli-reference, integration-patterns, mcp-and-third-party-packages, native-skills-and-extensions, pi-tools) |
| `.skilled/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md` | Modify | Repoint 2 pin links |
| `.hermes/skills/cli-pi/SKILL.md` | Modify | Regenerated mirror of the canonical body |

**Note on the changelog pins.** `cli-pi/changelog/{v1.0.0.0,v1.1.0.0,v1.2.0.0}.md` hold 3 further
occurrences of the same stale path. They stay as they are, for two reasons. The link checker's own
`EXCLUDE_SEGMENTS` names `/changelog/` deliberately, on the stated ground that a changelog records what
was true when it was written; and those three links are additionally broken in relative depth
independently of this change, so the one-substring repair would leave them broken either way. That is a
separate repair in a separate file class, recorded here rather than absorbed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All eight runtime READMEs pass the shared document validator | `validate_document.py` prints `VALID:` for 8/8, 0 blocking errors (before: 7/8, `cli-jev` blocked) |
| REQ-002 | Every README names its immediate subdirectories and every `references/` + `assets/` file | Folder-coverage check reports 0 missing across all 8 (before: 4 missing — `feature-catalog/`, 2 opencode references, 1 pi reference) |
| REQ-003 | The cli-pi contract pin resolves from all 9 files that hold it as a link | `check-markdown-links.cjs` reports 0 broken links naming the cli-pi cluster (before: 10) |
| REQ-004 | The `.hermes/skills/cli-pi/SKILL.md` mirror matches the canonical body after the SKILL.md edit | Body diff between canonical and mirror is empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each README's H2 headings stay sequentially numbered 1..N with no gaps or duplicates | Sequential-numbering check passes for all 8 |
| REQ-006 | Each README carries a fenced `text` directory tree | Fenced-tree check passes for all 8 (before: 2/8) |
| REQ-007 | The edits are additive: no existing section removed, reordered, or reworded | Scoped diff inspection shows insertions and the mechanical renumbering only |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 8/8 READMEs `VALID` under `validate_document.py` with 0 blocking errors, against a
  measured before-state of 7/8 with `cli-jev` blocked.
- **SC-002**: The repo-wide broken-link count falls from 15 to 5, and no remaining broken link names any
  of the eight READMEs or the cli-pi cluster. The 5 that remain are the named out-of-scope files.
- **SC-003**: A reader of any runtime README can see that packet's complete file inventory without
  leaving the file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renumbering headings breaks an internal reference or the numbering rule | Med | Validator plus a sequential-numbering check in the packet verifier; a single file reverts with `git checkout -- <file>` |
| Risk | A delegated child edits outside its one README | Med | Prompt-level scope lock, then a `git status --porcelain` audit after every batch and `git checkout --` on any stray |
| Risk | A child hangs with no output | Med | The runtime runner SIGTERMs each child at a 25-minute bound; per-child logs are the evidence |
| Risk | Regenerating the hermes mirror also rewrites 7 unrelated drifts and prunes a stale copy | Low | Regenerate, then `git checkout --` every mirror that is not the cli-pi one |
| Risk | The commit gate re-mints a compiled-routing activation manifest when `cli-pi/SKILL.md` is staged | Low | Assert the re-mint differs only by `effectivePolicyHash` rather than assume; do not treat it as scope creep |
| Dependency | The shared deep-loop runtime owns cli-pi command construction and execution | High if absent | Dispatch goes through the runtime's exported builder and runner; no packet-local adapter |
| Dependency | `llmgateway` provider credentials for the dispatched children | High if absent | Pi reports a missing key in output text, never via exit code; a child that reports it is a failed dispatch, re-run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The three that existed were resolved before implementation: the git workspace (fresh worktree off
`skilled/v4.0.0.0`), the documentation level (1, no phases), and the dispatch executor
(`cli-external-orchestration/cli-pi`, model `glm-5.3-flash`).
<!-- /ANCHOR:questions -->

---
