---
title: "Tasks: Fork Attribution and Changelog"
description: "Task breakdown for delisting the stale zh-CN README, disclosing fork provenance in both extension READMEs, and authoring both CHANGES-FROM-UPSTREAM.md documents."
trigger_phrases:
  - "fork attribution tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/009-fork-attribution-and-changelog"
    last_updated_at: "2026-08-08T12:43:31Z"
    last_updated_by: "spec-author"
    recent_action: "All 10 tasks completed and verified"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Fork Attribution and Changelog

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending, `[x]` complete
- Each task cites the requirement it satisfies (REQ-###) from `spec.md`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `pi-cache-optimizer/README.md`, `deep-pi/README.md`, and `vendored-fork-provenance.json` for ground truth
- [x] T002 Read `003-fork-and-guard-cache-optimizer/implementation-summary.md`, `006-fork-and-improve-deep-pi/{001,002,003}/implementation-summary.md`, and `008-implement-fork-improvements/{001,002,003}/implementation-summary.md` for the full verified change list
- [x] T003 Assemble the fact sheet and dispatch gpt-5.6-sol (cli-codex) to draft the two "Fork" sections and two `CHANGES-FROM-UPSTREAM.md` documents into scratch files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [REQ-004, REQ-005] Fact-check every drafted sentence against the cited phase evidence; correct or cut anything not directly traceable
  Found 2 inaccuracies from gaps in the fact sheet (not the drafting model's fault): deep-pi's Round 2 draft implied the pi-cache-optimizer guard was added during that round (it was added earlier, in the fork's own patch); pi-cache-optimizer's draft omitted two test files (`ownership-composition.test.ts`, `hook-guards.test.ts`) actually added alongside the `package.json` test-runner change. Both corrected before applying.
- [x] T005 [REQ-001] Delete `.pi/extensions/pi-cache-optimizer/README.zh-CN.md`
- [x] T006 [REQ-002] Splice the fact-checked "Fork" section into `pi-cache-optimizer/README.md`; write `pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md`
- [x] T007 [REQ-003] Splice the fact-checked "Fork" section into `deep-pi/README.md` immediately after the existing "## Attribution" section; write `deep-pi/CHANGES-FROM-UPSTREAM.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [REQ-006] Re-read both final READMEs; confirm `## Contents`/anchors resolve and the deep-pi Attribution section is byte-unchanged
  `pi-cache-optimizer/README.md`'s `## Contents` list now includes `[Fork](#fork)` as the first entry, all anchors resolve. `deep-pi/README.md`'s `## Attribution` section text is unchanged; `## Fork` was appended directly after it.
- [x] T009 [REQ-007] `git status --porcelain` on both extension directories; confirm exactly the 5 intended file changes and no stray output
  First pass found 2 stray artifacts predating this phase's work, hidden by an overly broad exclusion filter in an earlier unrelated verification: `.pi/extensions/deep-pi/.pi/{deep-pi-stats.json,deep-pi-report.json}` and repo-root `.pi/deep-pi-stats.json` + its `.tmp` sibling (all stale, all-zero test byproducts, `updatedAt` timestamps from 2026-08-08T09:45/09:57Z). Removed; re-ran the full deep-pi suite (81/81) and confirmed no recurrence (`find .pi/extensions -type d -name ".pi"` empty). Final sweep: exactly the 5 intended changes, zero stray output.
- [x] T010 `validate.sh --strict` on this folder; `validate.sh --recursive --strict` on the whole `039` packet
  Both exit 0, 0 errors, 0 warnings (see Evidence Record).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:evidence -->
## Evidence Record

### Baseline captured before implementation (T001-T002)

- `pi-cache-optimizer/README.md`: zero fork disclosure, links only to npm/GitHub badges for the package as published.
- `deep-pi/README.md`: existing "## Attribution" section credits `jrimmer/pi-deepseek-optimized` → `christopherarter/deep-pi` lineage, but does not mention this repo's own further local divergence.
- `vendored-fork-provenance.json`: `deep-pi` at `christopherarter/deep-pi@0f1cbd8124b4fb35df97f85aa943d730f4aae549`; `pi-cache-optimizer` at `MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a`.

### Negative controls (T017-T020)

Not applicable — documentation-only phase, no code paths to regress-test.

### Final authoritative gate (T022)

Recorded in `checklist.md` and `implementation-summary.md` once Phase 3 completes.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All of Phase 1-3's tasks checked, `implementation-summary.md` authored, `validate.sh --strict` passing for this folder and `--recursive --strict` still passing for the whole `039` packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements REQ-001 through REQ-007
- `checklist.md` — verification gates
<!-- /ANCHOR:cross-refs -->
