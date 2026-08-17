---
title: "Tasks: Phase 3 package-baseline-gates"
description: "Task ledger for packaging, provenance, and baseline verification."
trigger_phrases:
  - "package-baseline-gates tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/003-package-baseline-gates"
    last_updated_at: "2026-08-16T14:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ran package gates: tsc 0, 57 tests, pack 9 files; README provenance added"
    next_safe_action: "Hand off to the 002-subagent-handoff workstream"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 3 package-baseline-gates

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T301 Compare the upstream manifest and package guidance. — compared `package.json` against upstream `context/pi-openai-fast-mode/package.json`; `pi.extensions`, peers, and scripts match.
- [x] T302 [P] Define the expected pack file list and provenance assertions. — pack list (`package.json`, `README.md`, `LICENSE`, `src/*.ts`) and the `9b28456` provenance assertion recorded in `checklist.md`.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T303 Set package name, keywords, `pi.extensions` -> `./src/index.ts`, peer dependencies, scripts, and included files. — `package.json` name/keywords set (via 002); `pi.extensions` + peers + `files` already correct.
- [x] T304 Update README provenance and preserve the MIT LICENSE. — README identity/paths updated + `## Provenance` cites `9b28456`; LICENSE unchanged.
- [x] T305 Confirm strict no-emit TypeScript settings, review lockfile churn, and assert Pi core packages are peers with no `dist/` requirement (grep). — `tsconfig.json` no-emit; `peerDependencies` = Pi core; no `dist/`; `package-lock.json` present.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T306 Run `npm run typecheck` and `npm test` from the fork. — typecheck exit 0; test exit 0, 57 passed.
- [x] T307 Run identity/provenance/license greps and `npm pack --dry-run`, comparing its output to the enumerated file list. — pack = 9 files (`package.json`, `README.md`, `LICENSE`, `src/*.ts`), no dist/tests/tsconfig; name `pi-fast-mode-w-subagent-support`.
- [x] T308 Record the handoff receipt, the Node version used (>=22.19), and ensure no settings/install files changed. — Node `v25.6.1`; `.pi/settings.json` untouched; changes confined to the package + spec docs.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
