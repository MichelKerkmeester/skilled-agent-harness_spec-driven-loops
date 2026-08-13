---
title: "Verification Checklist: Maintainability and Provenance"
description: "Verification gates for the P2 maintainability-and-provenance phase: the sequencing gate, per-seam extraction discipline, packaging integrity, provenance drift detection, the credential-independent fixture, and the two-part benchmark packaging fix."
trigger_phrases:
  - "maintainability and provenance checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/008-implement-fork-improvements/003-maintainability-and-provenance"
    last_updated_at: "2026-08-08T10:16:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded final verification, extraction deferral, and the loopback-boundary limitation"
    next_safe_action: "Run the provenance check on demand after future fork edits"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No extraction was selected after the measured coupling scan; prompt transforms were lowest at 60 shared identifiers and zero tracked extension-state references."
      - "The provenance check is on-demand and report-only."
      - "The local boundary fixture ran live in a permitting sandbox and a deepPiDormant logic bug it exposed was fixed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Maintainability and Provenance

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Completion status:** the phase was implemented within the authorized scope. Benchmark packaging, provenance, and the real local boundary session are complete (the boundary session's live run was deferred at build/review time by sandbox restrictions, then actually run and its logic bug fixed in a permitting sandbox); extraction is explicitly deferred with evidence. No pi-cache-optimizer source, tests, or package metadata were changed.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phases 001 and 002 both Complete and green before any seam is touched
  [EVIDENCE: tasks.md T002] Verification: both predecessor checklists were Complete; deep-pi `npm test` passed 11 files/76 tests and pi-cache-optimizer passed 34 tests, both exit 0, before coupling measurement.
- [x] CHK-002 [P0] Operator authorization to modify files under `.pi/extensions/` obtained and recorded
  [EVIDENCE: tasks.md T003] Verification: the user explicitly authorized direct implementation and fixed the phase write authority.
- [x] CHK-003 [P1] Packaging baseline captured in both forks before any edit
  [EVIDENCE: `npm pack --dry-run` baseline] Verification: baseline dry-runs recorded 12 deep-pi files and 5 pi-cache-optimizer files; the final delta is accounted for in T024.
- [x] CHK-004 [P1] Both `benchmark:live` defects and pi-cache-optimizer's packaging constraints re-confirmed against the live source
  [EVIDENCE: tasks.md T004-T005] Verification: direct reads confirmed the missing script, missing allowlist entry, and optimizer package constraints before implementation.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each extraction step moves exactly one seam
  [EVIDENCE: `pi-cache-optimizer/index.ts` unchanged] Verification: no extraction step occurred; the optimizer entry module remains unchanged, so no multi-seam diff exists.
- [x] CHK-011 [P0] Every extracted module joins the `files` allowlist in the same step that creates it
  [EVIDENCE: tasks.md T014] Verification: no module was extracted; the benchmark script and `scripts` allowlist entry landed together.
- [x] CHK-012 [P1] Seam selection was made on measured coupling, not on conceptual tidiness
  [EVIDENCE: `tasks.md` T012; lowest pair 60/0] Verification: the seven measured pairs were recorded; prompt transforms were lowest at 60 shared identifiers/0 state references, but no candidate met the low-coupling bar.
- [x] CHK-013 [P1] The provenance check reports rather than enforces
  [EVIDENCE: `node check-vendored-fork-provenance.mjs --json`; exit code 0] Verification: deliberate drift was reported without a build failure; the clean report also exited 0.
- [x] CHK-014 [P1] The local provider fixture is test-scoped and unreachable from any production path
  [EVIDENCE: boundary fixture source] Verification: the script writes temporary `models.json` under an isolated agent directory and does not modify `.pi/settings.json` or production package resolution.
- [x] CHK-015 [P1] No item in this phase changed runtime data flow
  [EVIDENCE: `git diff --stat` scoped audit] Verification: no optimizer source moved; provenance and fixture scripts are unimported tooling, and the benchmark entry point is opt-in/default-skip.
- [x] CHK-016 [P1] No unrelated files or incidental edits
  [EVIDENCE: `git status --short` scoped audit] Verification: task-created changes are limited to the permitted deep-pi package/script, two repository tooling scripts plus their record, and this phase's docs; unrelated pre-existing dirty files are not attributed here.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Characterization tests passed against unmodified source before their seam moved
  [EVIDENCE: `index.ts` unchanged] Verification: not applicable because no seam was selected or moved; the source remained unmodified.
- [x] CHK-021 [P0] Phase 001's contract tests stayed green across every extraction step
  [EVIDENCE: focused tests passed 3/3 and 9/9] Verification: deep-pi composition passed 3 tests; pi-cache-optimizer composition plus six hook guards passed 9 tests; no extraction step existed between runs.
- [x] CHK-022 [P0] `npm pack --dry-run` clean in both forks from the final state
  [EVIDENCE: final pack output] Verification: deep-pi total 13 files includes `scripts/live-benchmark.mjs`; pi-cache-optimizer total 5 files remains clean.
- [x] CHK-023 [P0] The provenance check self-tested in both directions
  [EVIDENCE: tasks.md T017] Verification: one-character edit reported a changed deep-pi hash; revert restored `drift: false` for both forks.
- [x] CHK-024 [P1] `benchmark:live` verified in both of its independent failure modes
  [EVIDENCE: tasks.md T006-T007/T018] Verification: safe default execution exited 0 and the pack listing contains the script.
- [x] CHK-025 [P1] A real Pi session exercised the `opencode/deepseek-v4-flash-free` boundary against the local fixture
  [EVIDENCE: real fixture run + before/after logic diff] Verification: deferred at build time (`listen EPERM`) and again at HANDOFF review (`mkdtemp EPERM`), but a run in a permitting sandbox executed it end to end (`piExitCode: 0`, `loopbackOnly: true`, `optimizerActive: true`) and surfaced a real bug — file-presence-only `deepPiDormant` reported `false`/exit 1 on a run where `deepPiRecordedResponses` was genuinely `0`, because `session_shutdown` writes the file regardless of ownership. Fixed to check content; the same run then reports `deepPiDormant: true` and exits 0, and reverting the fix on the same run reproduces the original false failure.
- [x] CHK-026 [P1] Both extensions still resolve after packaging changes
  [EVIDENCE: `pi list --approve`] Verification: exit 0 resolved `extensions/pi-cache-optimizer` and `extensions/deep-pi` to their in-repo paths.
- [x] CHK-027 [P1] Every failing step was reverted whole rather than patched forward
  [EVIDENCE: `git status --short` after fixture attempt] Verification: no extraction failure occurred; the blocked fixture attempt cleaned its temp directory and left no repository artifact.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The four-lineage ordering agreement held in practice
  [EVIDENCE: `npm test` gate passed 11/76 and 34/34] Verification: predecessor completion and the real two-command gate were recorded before the coupling scan; no seam was touched.
- [x] CHK-FIX-002 [P1] All four P2 action-list items are addressed or explicitly deferred with a reason
  [EVIDENCE: spec.md requirements] Verification: extraction (REQ-002/004) is deferred by measured coupling, provenance and benchmark packaging are complete, and the local live boundary (REQ-006) is complete — its live session was deferred by sandbox loopback/mkdtemp restrictions at build and review time, then actually run and fixed in a permitting sandbox.
- [x] CHK-FIX-003 [P1] Stopping after one seam, if that is what happened, is recorded as a decision with evidence
  [EVIDENCE: `tasks.md` T012/T015; lowest pair 60/0] Verification: no seam was selected; the lowest measured count was 60 shared identifiers, so the stop occurred before characterization and extraction.
- [x] CHK-FIX-004 [P1] 006/003's disclosed credential limitation is still on record after the fixture works
  [EVIDENCE: spec.md REQ-006 and implementation-summary.md] Verification: the local fixture is not presented as an upstream-provider proof; the inherited limitation remains explicit.
- [x] CHK-FIX-005 [P1] Open questions from `spec.md` §7 resolved and recorded before this phase closes
  [EVIDENCE: spec.md §7] Verification: extraction worth, first seam, and provenance cadence are answered with the measured counts, no-extraction decision, and on-demand recommendation.
- [x] CHK-FIX-006 [P2] The upstream merge-conflict cost of extraction is quantified rather than asserted
  [EVIDENCE: tasks.md T015] Verification: no conflict surface was added; the lowest candidate's 60 shared identifiers and required new module/allowlist/import review were the measured stop rationale.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The local provider fixture holds no credential and reaches no network
  **Deferred live:** source/config inspection confirms only a synthetic CLI key and a `127.0.0.1` endpoint; the attempted bind failed before any request, so no live outbound observation is claimed.
- [x] CHK-031 [P0] No secrets or credentials introduced in the provenance script, the fixture, or the benchmark script
  [EVIDENCE: secret-pattern scan] Verification: the changed tooling contains no assigned secret or committed credential; `DEEPSEEK_API_KEY` is an explicit runtime environment gate in the opt-in benchmark and is never defaulted or logged.
- [x] CHK-032 [P1] The benchmark script does not embed or require a live API key to be present in the repo
  [EVIDENCE: benchmark source and safe run] Verification: default execution skips; live execution reads `DEEPSEEK_API_KEY` only from the environment and does not print it.
- [x] CHK-033 [P1] The provenance report does not leak file contents
  [EVIDENCE: `vendored-fork-provenance.json` contains hashes only] Verification: output contains identities, file names, and SHA-256 hashes only; it never emits source bytes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist reflect actual execution state, not planning-time defaults
  [EVIDENCE: completion docs] Verification: status is Complete, all task/checklist boxes are resolved, and command evidence plus deferrals are recorded.
- [x] CHK-041 [P1] The provenance baseline is recorded where the next person will find it
  [EVIDENCE: `.opencode/scripts/vendored-fork-provenance.json`] Verification: both identities, allowlisted file sets, and current hashes are stored beside the runnable check.
- [x] CHK-042 [P1] Extraction, if pursued, leaves a map of what moved where
  [EVIDENCE: no extraction] Verification: no source moved; the candidate line ranges and measured counts are recorded in `tasks.md` T012 and `plan.md` §3.
- [x] CHK-043 [P2] Any deviation from `plan.md` §3's approach is recorded with its reason
  [EVIDENCE: explicit deferrals] Verification: no extraction and the loopback-blocked live fixture are both documented with their evidence and impact.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `scripts/` exists in deep-pi and is in the `files` allowlist
  [EVIDENCE: deep-pi package and pack output] Verification: the directory and allowlist entry are present together; the dry-run lists `scripts/live-benchmark.mjs`.
- [x] CHK-051 [P1] The provenance script and local fixture live outside both packages' shipped file sets
  [EVIDENCE: both pack listings] Verification: neither `.opencode/scripts/` file appears in either package's 13/5-file listing.
- [x] CHK-052 [P1] No temp or scratch artifact left inside either extension directory or this spec folder
  [EVIDENCE: `git status --short` final cleanup audit] Verification: the boundary runner removes its temp root; no task-created scratch file remains in either extension or this packet.
- [x] CHK-053 [P2] `implementation-summary.md` was added only after implementation completed
  [EVIDENCE: post-verification summary] Verification: the summary is being added after implementation, self-tests, focused tests, full suites, typechecks, pack checks, and documentation validation.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 22 | 22/22 |
| P2 Items | 3 | 3/3 |

**Status**: Complete — all 37 gates are resolved. REQ-005 and REQ-007 passed; REQ-006's live session was deferred at build/review time by sandbox loopback/`mkdtemp` restrictions, then actually run, its `deepPiDormant` logic bug fixed, and the fix proven with a before/after run on the same live fixture; extraction was not pursued because no measured seam met the low-coupling bar. Both fork suites, typechecks, phase 001 contract tests, provenance self-tests, package dry-runs, and approved `pi list` passed from the final state.
<!-- /ANCHOR:summary -->
