---
title: "Feature Specification: sk-vision standards + hook restructure"
description: "Rebuild sk-vision docs to sk-create-skill standards and consolidate the Pi/OpenCode adapters under a single skill-owned hooks/ tree, symlinked to every host load path."
trigger_phrases:
  - "sk-vision skill standards"
  - "sk-vision hooks restructure"
  - "sk-vision opencode plugin hooks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure"
    last_updated_at: "2026-08-17T10:28:40.000Z"
    last_updated_by: "claude"
    recent_action: "Rebuilt sk-vision docs and consolidated host adapters under hooks/."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure/spec.md"
      - ".opencode/skills/sk-vision/SKILL.md"
      - ".opencode/skills/sk-vision/hooks/opencode/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-013-skill-standards-and-hook-restructure"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision standards + hook restructure

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `012-cli-agnostic-adapters` |
| **Successor** | N/A |
| **Handoff Criteria** | Docs pass the sk-create-skill package gate, all four host load paths resolve, the OpenCode adapter builds and loads, runtime tests stay green, and the sk-vision-scoped changes are committed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase child aligns the shipped sk-vision skill to `sk-create-skill` documentation standards and unifies its host adapters under one skill-owned `hooks/` tree. It runs as three internal workstreams (docs, Pi adapter, OpenCode adapter) documented in `plan.md`.

**Scope Boundary**: `.opencode/skills/sk-vision/` (docs, `hooks/`, manifests, the runtime build entry) plus the host load paths (`.opencode/plugins/sk-vision.js`, `.pi/extensions/sk-vision.ts`, `.opencode/hooks/sk-vision/`). Do not change the vision-runtime core behavior, the 13 tool contracts, or any non-sk-vision work uncommitted in the checkout.

**Dependencies**:
- `sk-create-skill` owns the SKILL.md/README templates and the package validation gate.
- `system-skill-advisor` is the canonical exemplar for the `hooks/<runtime>/` source + symlink-mirror pattern.
- The vision-runtime `dist/` is a gitignored bundle; the OpenCode adapter is emitted the same way.

**Deliverables**:
- A self-contained SKILL.md and a template-conformant README.
- A single `hooks/` source tree feeding all four host load paths by symlink.
- A standalone OpenCode adapter built beside its source.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped sk-vision skill did not meet `sk-create-skill` standards and its adapters were inconsistently placed. `SKILL.md` was thin and split its runtime detail into a separate `references/runtime-reference.md`; `README.md` omitted several required template sections. The Pi adapter lived at `pi/sk-vision.ts` and was symlinked only into `.pi/extensions/`, while the OpenCode adapter existed only as a re-export of the built `vision-runtime/dist/plugin.js` — the two hosts sourced their adapters from different places, and neither was mirrored into the shared `.opencode/hooks/` fleet directory. A parallel, uncommitted attempt to move the Pi adapter had left `.pi/extensions/sk-vision.ts` dangling.

### Purpose
Bring the docs up to standard and give both hosts one skill-owned source tree (`hooks/pi`, `hooks/opencode`) that is symlinked to every host load path, matching the `system-skill-advisor` pattern.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rebuild `SKILL.md` to the standalone-skill template, folding `references/runtime-reference.md` into it and deleting the reference doc and its directory.
- Rebuild `README.md` to the README template (add Knowledge Layer, Integration & Navigation, Troubleshooting, FAQ, Verification, Related Documents).
- Re-point `leafRoots` to `feature-catalog/` and regenerate the Class-S manifests.
- Move the Pi adapter to `hooks/pi/sk-vision.ts`; re-point `.pi/extensions/sk-vision.ts`; add the `.opencode/hooks/sk-vision/pi` mirror.
- Author a standalone OpenCode adapter at `hooks/opencode/sk-vision.ts`; add a build entry; symlink `.opencode/plugins/sk-vision.js` to the emitted `.js`; add the `.opencode/hooks/sk-vision/opencode` mirror; gitignore the build artifact.

### Out of Scope
- Any change to the vision-runtime core, the 13 tool contracts, or the Python runtime.
- The unrelated `pi-fast-mode-w-subagent-support` work uncommitted in the checkout.
- Merging to any other branch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/SKILL.md` | Update | Rebuilt to template, self-contained (protocol/methods/env/troubleshooting folded in) |
| `.opencode/skills/sk-vision/README.md` | Update | Rebuilt to the README template |
| `.opencode/skills/sk-vision/references/runtime-reference.md` | Delete | Folded into SKILL.md |
| `.opencode/skills/sk-vision/leaf-manifest.config.json` | Update | `leafRoots` → `feature-catalog` |
| `.opencode/skills/sk-vision/leaf-manifest.json` / `leaf-aliases.json` | Regenerate | `ci-skill-root-metadata.cjs --fix` |
| `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts` | Move | From `pi/sk-vision.ts` |
| `.opencode/skills/sk-vision/hooks/opencode/sk-vision.ts` | Create | Standalone OpenCode adapter importing the shared `src` core |
| `.opencode/skills/sk-vision/vision-runtime/scripts/build.ts` | Update | Emit `hooks/opencode/sk-vision.js` |
| `.opencode/skills/sk-vision/.gitignore` | Create | Ignore the OpenCode adapter build artifact |
| `.opencode/plugins/sk-vision.js`, `.pi/extensions/sk-vision.ts`, `.opencode/hooks/sk-vision/{pi,opencode}` | Update/Create | Host load-path symlinks into `hooks/` |

### Verification evidence

- `ci-skill-root-metadata.cjs` reports `OK [S] sk-vision`; `validate_skill_package.py` `--check: PASS`.
- SKILL.md is 1,949 words (under the 5k cap).
- All four host symlinks resolve (`.pi/extensions/sk-vision.ts`, `.opencode/plugins/sk-vision.js`, both `.opencode/hooks/sk-vision/*` mirrors).
- `bun run build` emits `hooks/opencode/sk-vision.js`; it loads as a plugin `function`; `bun test` = 8 pass / 0 fail.
- `hooks/pi/sk-vision.ts` registers 13 tools.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Docs pass the standards gate | `validate_skill_package.py --check` PASS; SKILL.md under 5k words |
| REQ-002 | Reference folded, not orphaned | `references/runtime-reference.md` deleted; runtime detail present in SKILL.md |
| REQ-003 | One skill-owned hooks source | Pi and OpenCode adapters live under `hooks/`; host paths are symlinks/re-exports |
| REQ-004 | Every host load path resolves | all four sk-vision host symlinks resolve to a real file |
| REQ-005 | OpenCode adapter builds and loads | `bun run build` emits the `.js`; it exports a plugin `function` |
| REQ-006 | No runtime regression | `bun test` stays green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Class-S metadata valid | `ci-skill-root-metadata.cjs` reports `OK [S] sk-vision` |
| REQ-P2 | Build artifact not committed | `hooks/opencode/sk-vision.js` is gitignored |
| REQ-P3 | Scope isolation | only sk-vision paths are staged; unrelated checkout work is untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] SKILL.md rebuilt to template and self-contained. Evidence: `validate_skill_package.py --check: PASS`; SKILL.md 1,949 words.
- [x] README rebuilt to template. Evidence: README carries AT A GLANCE, OVERVIEW+Knowledge Layer, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS.
- [x] Reference folded and deleted. Evidence: `references/` removed; `leafRoots` → `feature-catalog`; `ci-skill-root-metadata.cjs` `OK [S] sk-vision`.
- [x] Pi adapter under `hooks/`, all its host paths resolve. Evidence: `.pi/extensions/sk-vision.ts` and `.opencode/hooks/sk-vision/pi/sk-vision.ts` resolve to the 20KB source.
- [x] OpenCode adapter authored, built, loads. Evidence: `bun run build` emits `hooks/opencode/sk-vision.js`; default export type `function`.
- [x] No runtime regression. Evidence: `bun test` → 8 pass / 0 fail.
- [ ] sk-vision-scoped changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | OpenCode adapter duplicates the src plugin glue | Two copies could drift | Both import one shared core; the glue is thin host orchestration, recorded in `implementation-summary.md` |
| Risk | Build artifact symlink dangles on fresh checkout | OpenCode plugin fails until `bun run build` | Same contract as the gitignored `dist`; documented |
| Risk | Committing on a busy `v4` checkout | Unrelated work could be swept in | Stage only sk-vision paths explicitly |
| Dependency | `sk-create-skill` templates and gate | Required for the docs standard | Validated with `validate_skill_package.py` |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: How should the OpenCode adapter be shaped, given `dist` is a bundle and OpenCode loads `.js`? **A**: A `.ts` source under `hooks/opencode/` importing the `src` core, emitted to a loadable `.js` by the build — parallel to the Pi adapter.
- **Q**: What symlink form for the `.opencode/hooks/sk-vision/*` mirrors? **A**: Per-file symlinks with `../../../skills/...` relative paths, matching the `system-skill-advisor` exemplar.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
