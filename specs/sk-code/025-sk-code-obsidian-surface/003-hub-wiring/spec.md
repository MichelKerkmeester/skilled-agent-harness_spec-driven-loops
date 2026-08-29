---
title: "Feature Specification: sk-code-obsidian hub wiring"
description: "Wire the OBSIDIAN surface into the live sk-code hub — mode-registry.json, hub-router.json, stack-detection.md, and the generated leaf-manifest.json — so a plugin prompt bundles sk-code-obsidian instead of deferring."
trigger_phrases:
  - "sk-code-obsidian hub wiring"
  - "OBSIDIAN surface routing"
  - "sk-code mode-registry obsidian entry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/003-hub-wiring"
    last_updated_at: "2026-08-28T21:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Wired OBSIDIAN surface into hub"
    next_safe_action: "Author skill references"
    blockers: []
    key_files:
      - "$HUB/.opencode/skills/sk-code/mode-registry.json"
      - "$HUB/.opencode/skills/sk-code/hub-router.json"
      - "$HUB/.opencode/skills/sk-code/shared/references/stack-detection.md"
      - "$HUB/.opencode/skills/sk-code/leaf-manifest.json"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether this leaf carries its own graph-metadata.json: no — a nested one is a NESTED_IDENTITY violation, per the packet's frozen constraints (operator via goal.md, 2026-08-28)"
---
# Feature Specification: sk-code-obsidian hub wiring

> Phase chain: parent [`../spec.md`](../spec.md), predecessor `002-repo-convention-audit` (the
> measured plugin audit this wiring cites), successor `004-skill-core` (authors `SKILL.md` and
> `README.md` against the routing this phase makes live).

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Before this phase, `sk-code`'s router had no `OBSIDIAN` surface. A prompt naming the plugin's own
files resolved to `defer` — confirmed directly:
`compiled-route.cjs --hub sk-code --prompt "fix the table renderer in the obsidian note database
plugin src/views"` returned `{"action":"defer","targets":[]}`. Worse, a literal "is there a
`.opencode/` segment at or above CWD" detection test would have misfired the moment `OBSIDIAN` was
added, because the plugin repo symlinks `.opencode`, `.claude`, `.codex`, `.cursor`, and `.devin`
at its root back to the hub — every task in the plugin repository would have reported `OPENCODE`.

### Purpose

Wire the `OBSIDIAN` surface into the four live hub files that govern routing —
`mode-registry.json` (the mode entry and the surface-axis list), `hub-router.json` (the router
signal, its vocabulary classes, and the tie-break order), `shared/references/stack-detection.md`
(the detection precedence and the symlink-resolution guard), and the generated
`leaf-manifest.json` (refreshed to match) — so that a plugin prompt bundles `sk-code-obsidian`
deterministically, without regressing any of the hub's other four surfaces.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Appending a sixth `modes[]` entry, `sk-code-obsidian`, to `mode-registry.json`, and appending
  `"sk-code-obsidian"` to `extensions.surface-axis.surfaces`.
- Verifying the five proposed aliases do not clash with any of the hub's existing aliases before
  landing them.
- Adding a `routerSignals["sk-code-obsidian"]` entry, two new `vocabularyClasses`
  (`code-obsidian-aliases`, `code-obsidian-runtime`), and a `routerPolicy.tieBreak` slot to
  `hub-router.json`.
- Rewriting `shared/references/stack-detection.md`'s surface table, precedence order, and detection
  branches to add `OBSIDIAN`, including the symlink-resolution guard that keeps `OPENCODE` scoped
  to the hub's own resolved files.
- Refreshing the generated `leaf-manifest.json` and re-running the fleet metadata gate so the hub
  serves the change rather than a stale manifest.
- Proving the wiring with the hub's own CLI: a negative control before the change, four positive
  routes after it, and a three-case regression check against the hub's other surfaces.

### Out of Scope

- Authoring `sk-code-obsidian/SKILL.md`, `README.md`, or any packet content — phase `004-skill-core`
  and later leaves own that.
- Any change to the plugin's own source (`src/`, `tools/`, `styles.css`) — phases `009` and `010`.
- Re-measuring the plugin tree; `002-repo-convention-audit/audit.json` is the frozen source this
  phase's detection markers (manifest fields, `esbuild.config.mjs`, `.db-*` classes) cite.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `$HUB/.opencode/skills/sk-code/mode-registry.json` | Modify (performed prior to this record) | Sixth `modes[]` entry `sk-code-obsidian`; `extensions.surface-axis.surfaces` extended to 4 entries |
| `$HUB/.opencode/skills/sk-code/hub-router.json` | Modify (performed prior to this record) | `routerSignals["sk-code-obsidian"]`, two new `vocabularyClasses`, `routerPolicy.tieBreak` appended |
| `$HUB/.opencode/skills/sk-code/shared/references/stack-detection.md` | Modify (performed prior to this record) | OBSIDIAN row, rewritten precedence, numbered detection branch, symlink guard, 5 new test-case rows, version 4.1.0.10 -> 4.2.0.0 |
| `$HUB/.opencode/skills/sk-code/leaf-manifest.json` | Regenerate (performed prior to this record) | Generated file; refreshed via `compiled-route-manifest.cjs refresh`, not hand-authored |
| `spec.md` | Replace scaffold | This document |
| `plan.md` | Replace scaffold | The execution record for the wiring and its proof commands |
| `tasks.md` | Replace scaffold | The task breakdown for this phase |
| `implementation-summary.md` | Create | The delivered-work summary |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sk-code-obsidian` is registered as a `surface`-kind mode with no write access | `mode-registry.json`'s new `modes[]` entry carries `packetKind: surface`, `backendKind: evidence-base`, `allowed: [Read, Bash, Grep, Glob]`, `forbidden: [Write, Edit, Task]`, `mutatesWorkspace: false`, `routingClass: metadata`, `grandfatheredFolderMismatch: false`, and 5 aliases; confirmed by direct read of the live file. |
| REQ-002 | The 5 proposed aliases are disjoint from every existing alias in the hub | A script-verified check against the live `mode-registry.json` found 34 existing aliases across the hub's 5 other modes and 0 clashes with the 5 proposed aliases. |
| REQ-003 | `OBSIDIAN` detection cannot be fooled by the plugin repo's symlinks back to the hub | `stack-detection.md`'s symlink guard states explicitly that `OPENCODE` holds only when the **resolved** real path (symlinks followed) lands inside the hub's own `.opencode/` directory — a literal unresolved path test would report `OPENCODE` for every task in the plugin repo, because the plugin symlinks `.opencode`, `.claude`, `.codex`, `.cursor`, and `.devin` at its root back to the hub. |
| REQ-004 | A representative plugin prompt bundles `sk-code-obsidian` after the change, and did not before it | Negative control: `compiled-route.cjs --hub sk-code --prompt "fix the table renderer in the obsidian note database plugin src/views"` returned `{"action":"defer","targets":[]}` before the change. After the change and the manifest refresh, the same prompt and three others each route to `sk-code-obsidian`. |
| REQ-005 | The hub's other four surfaces still route correctly after the change | Regression check: an `app-mobile`-flavored prompt still resolves to `sk-code-mobile-cli`, a Webflow-flavored prompt still resolves to `sk-code-webflow`, and an `.opencode/skills`-flavored prompt still resolves to `sk-code-opencode`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The generated manifest is refreshed, not left stale | Status read `causeCode: stale-manifest` (policy hash `eeae98f8…` vs. current `834a0e38…`) before the refresh; `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .opencode/skills/sk-code` returned `fresh=true`; status afterward reads `causeCode: compiled-serving`, fingerprint `82764d6d…`. |
| REQ-007 | The fleet metadata gate passes clean after the refresh | `ci-skill-root-metadata.cjs` first failed with `STALE_GENERATED_FILE: leaf-manifest.json is stale`; after `--fix` it reports `checked=14 passed=14 failed=0`, exit code 0. |
| REQ-008 | The hub-side diff stays inside the wiring this phase owns | The measured hub diff is exactly 5 modified files plus the new untracked packet directory — no file outside `mode-registry.json`, `hub-router.json`, `shared/references/stack-detection.md`, `leaf-manifest.json`, and one further generated companion captured in that count was touched by this phase. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mode-registry.json` carries a sixth `modes[]` entry for `sk-code-obsidian` and a
  4-entry `extensions.surface-axis.surfaces` list, both confirmed by a live file read.
- **SC-002**: `hub-router.json` carries `routerSignals["sk-code-obsidian"]`, the two
  `code-obsidian-*` vocabulary classes, and `sk-code-obsidian` as the last entry in
  `routerPolicy.tieBreak`.
- **SC-003**: `stack-detection.md` states the precedence `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW
  > UNKNOWN`, carries the symlink guard, and its `version:` frontmatter field reads `4.2.0.0`.
- **SC-004**: Four representative plugin prompts route to `sk-code-obsidian` through
  `compiled-route.cjs`, where the same class of prompt returned `defer` before the change.
- **SC-005**: The three regression prompts (`app-mobile`, Webflow, `.opencode/skills`) still route
  to their original surfaces after the change.
- **SC-006**: `ci-skill-root-metadata.cjs` exits 0 with `checked=14 passed=14 failed=0` after the
  manifest refresh.

### Acceptance Scenarios

- **Scenario 1**: **Given** the hub's router had no `OBSIDIAN` signal, **when** a plugin-flavored
  prompt was routed before this phase, **then** `compiled-route.cjs` returned `{"action":"defer",
  "targets":[]}`.
- **Scenario 2**: **Given** the same prompt and three others naming plugin-specific work (a
  screenshot scenario, a `.db-*` class rename, a code-quality review), **when** they are routed
  after this phase's change and manifest refresh, **then** all four resolve to `sk-code-obsidian`.
- **Scenario 3**: **Given** the plugin repository symlinks `.opencode` at its root back to the hub,
  **when** a target inside the plugin's `src/views/` is routed, **then** the symlink guard's
  resolved-path check keeps the result `OBSIDIAN`, not `OPENCODE`.
- **Scenario 4**: **Given** the generated manifest was stale immediately after the JSON edits,
  **when** `mint` is run against the existing manifest, **then** it returns `already-exists` and
  performs no update; only `refresh` updates an existing manifest.
- **Scenario 5**: **Given** `ci-skill-root-metadata.cjs` first failed on `leaf-manifest.json`,
  **when** it is re-run with `--fix` after the refresh, **then** it reports `checked=14 passed=14
  failed=0` and exit code 0.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A literal, unresolved-path `.opencode/` detection test would report `OPENCODE` for every task inside the plugin repo, because the repo symlinks `.opencode` (and `.claude`, `.codex`, `.cursor`, `.devin`) at its root back to the hub | `OBSIDIAN` would never win detection inside the plugin's own tree, defeating the entire phase | The symlink guard resolves symlinks first and requires the **resolved** real path to land inside the hub's own `.opencode/` directory before `OPENCODE` holds; genuine hub files still win `OPENCODE`, plugin source does not |
| Risk | A new alias set could silently clash with an existing mode's alias and steal its routing | Ambiguous or incorrect bundling for an unrelated surface | Alias disjointness was verified by script against the live file before landing: 34 existing aliases across 5 modes, 0 clashes with the 5 proposed |
| Risk | Editing `mode-registry.json`/`hub-router.json` without refreshing the generated manifest leaves the hub serving stale routing | The four-prompt proof would pass locally against source JSON but the live served router would still `defer` | `compiled-route-manifest.cjs refresh` was run and its `fresh=true` result and the `causeCode` transition (`stale-manifest` -> `compiled-serving`) were captured as proof, not assumed |
| Dependency | `002-repo-convention-audit/audit.json` | Source for the plugin markers cited in `stack-detection.md`'s OBSIDIAN detection branch (`manifest.json`/`minAppVersion`, `esbuild.config.mjs`, `from "obsidian"` imports, `.db-` classes) | Already measured and committed before this phase started |
| Dependency | `ci-skill-root-metadata.cjs`, the fleet metadata gate | Confirms the generated manifest and the hub's other 13 checked units stay internally consistent after the edit | Run to failure first (`STALE_GENERATED_FILE`), then re-run with `--fix` to a clean `14/14` pass, both captured as proof |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Detection Boundaries
- **A target path lands under the plugin's own `src/` tree, several directories below a symlinked
  `.opencode/` at the repo root**: the symlink guard still resolves to `OBSIDIAN`, because no
  **resolved** path segment lands inside the hub's own `.opencode/` directory — confirmed by the
  `src/views` case in the four-prompt proof.
- **A target path is a genuine hub file reached through the hub's own `.opencode/` tree**: the guard
  still resolves to `OPENCODE`; the guard changes how the test is performed, not which surface wins
  when a real hub file is the target.

### Manifest Boundaries
- **`mint` is run against a manifest that already exists**: it returns `already-exists` and performs
  no update. This is recorded as a trap, not treated as a passing refresh — `refresh` is the correct
  verb for an existing manifest, and using `mint` here cost a cycle before the correct command was
  found.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two JSON registry files, one reference markdown file, one generated manifest, across the router's mode/signal/detection/tie-break layers |
| Risk | 12/25 | A routing regression here silently misroutes or defers every future plugin-flavored prompt across all five hub surfaces; the symlink guard is a subtle correctness trap |
| Research | 8/20 | Required reading the live registry/router schema, the existing detection precedence, and the manifest refresh contract before editing |
| **Total** | **30/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

None. The design plan (`001-surface-design-plan/mode-design-plan.md`) resolved the registry shape,
router wiring, and detection precedence in advance; this phase's own scope (landing that design and
proving it live) leaves nothing open.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Packet Goal**: [`../goal.md`](../goal.md)
- **Packet Roadmap**: [`../roadmap.md`](../roadmap.md)
- **Design Plan**: [`../001-surface-design-plan/mode-design-plan.md`](../001-surface-design-plan/mode-design-plan.md)
- **Measured Audit**: [`../002-repo-convention-audit/audit.json`](../002-repo-convention-audit/audit.json)
- **Successor**: [`../004-skill-core/spec.md`](../004-skill-core/spec.md)
- **Hub Files Wired**: `$HUB/.opencode/skills/sk-code/{mode-registry.json,hub-router.json,shared/references/stack-detection.md,leaf-manifest.json}`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

<!-- /ANCHOR:related-docs -->
