---
title: "Goal: Package Baseline Gates"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/003-package-baseline-gates"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Package Baseline Gates

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Turn the fork into an attributable raw-TypeScript Pi package whose manifest loads `./src/index.ts`, keeps Pi core as peer dependencies and cites upstream commit `9b28456`, and that passes typecheck, the upstream Vitest suite and `npm pack --dry-run`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The tarball ships only `package.json`, `README.md`, `LICENSE` and `src/*.ts`. The `files` allowlist excludes `tsconfig.json` and `tests/`, and no `dist/` is built. |
| D2 | `LICENSE` stays the upstream MIT text with the upstream copyright, byte for byte. |
| D3 | `package-lock.json` is generated for the fork in this phase rather than carried from upstream. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `package.json` sets `pi.extensions` to `["./src/index.ts"]` and declares Pi core under `peerDependencies`
- [x] `npm pack --dry-run` reports `pi-fast-mode-w-subagent-support@0.3.0` with 9 files (`package.json`, `README.md`, `LICENSE` and six `src/*.ts`) and no `dist/`, `tests/` or `tsconfig.json`
- [x] `npm run typecheck` exits 0 and `npm test` exits 0 with 57 tests passed across 4 files
- [x] `README.md` has a `## Provenance` section citing upstream commit `9b28456`, and `LICENSE` is the unchanged MIT text
- [x] `node --version` reports at least 22.19 and `package-lock.json` is present in the package
- [x] `.pi/settings.json` is unchanged by this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Manifest, peers and no-emit config | Done (2026-08-16) | `tasks.md` T301, T303, T305 |
| README provenance and license | Done | `tasks.md` T304; `implementation-summary.md` Provenance and License rows |
| Typecheck, suite and pack | Done | `tasks.md` T306, T307; `implementation-summary.md` Pack row (9 files) |
| Toolchain and scope | Done | `tasks.md` T308 (Node `v25.6.1`; `.pi/settings.json` untouched) |

### Deviations and findings

| Item | Note |
|------|------|
| Missing `checklist.md` | `tasks.md` T302 says the pack list and provenance assertion were recorded in `checklist.md`, but this Level 2 folder holds no `checklist.md`. No tick here relies on it |
| Pack list corrected | The earlier planned file list included `tsconfig.json` and `tests/`; it was corrected to the 9-file tarball (`implementation-summary.md` Key Decisions) |
| `pi.image` | Still points at the upstream preview image (`implementation-summary.md` Known Limitations 2) |
<!-- /ANCHOR:log -->
