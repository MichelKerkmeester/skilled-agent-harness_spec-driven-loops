---
title: "Tasks: Maintainability and Provenance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "maintainability and provenance tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/003-maintainability-and-provenance"
    last_updated_at: "2026-08-08T10:16:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded completed implementation tasks, evidence, and explicit deferrals"
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
      - "No seam was extracted after coupling measurement; prompt transforms were lowest at 60 shared identifiers and zero tracked extension-state references."
      - "The local provider fixture could not bind 127.0.0.1 in the sandbox, so the real Pi boundary remains deferred."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Maintainability and Provenance

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture a packaging baseline in both forks: `npm pack --dry-run` output saved for later comparison (read-only, executable before authorization). Evidence: deep-pi baseline was 12 files with no `scripts/`; pi-cache-optimizer baseline was 5 files with `index.ts` as its only shipped source. Both passed using isolated npm caches because the default cache was not writable.
- [x] T002 [B] REQ-001 gate: confirm phases 001 and 002 are both Complete, then re-run both forks' suites from their final state and record the actual output — this gates T012 onward, not the small items. Evidence before any seam measurement: deep-pi `npm test` exit 0, 11 files/76 tests; pi-cache-optimizer `npm test` exit 0, 34 tests/8 suites.
- [x] T003 [B] Obtain explicit operator authorization to modify files under `.pi/extensions/`. Every task from T004 onward is gated behind it. Evidence: the user authorized direct implementation, fixed this phase folder, and explicitly prohibited a documentation-scope question.
- [x] T004 Re-confirm both `benchmark:live` defects against the live source: the declaration at `deep-pi/package.json:56`, the absent `scripts/` directory, and the `files` allowlist at `:36-41` with no `scripts` entry. Evidence: direct source read confirmed all three defects before T006/T007.
- [x] T005 Re-confirm pi-cache-optimizer's packaging constraints: `files: ["index.ts"]` at `package.json:18-20`, `pi.extensions` at `:21-26`, the `#extension` import map at `:27-29`, and the upstream repository at `:45-48`. Evidence: direct source read confirmed the constraints; the package metadata was not changed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] REQ-007: create `.pi/extensions/deep-pi/scripts/live-benchmark.mjs` at the exact path `package.json:56` already declares, so the location is fixed rather than chosen. Evidence: file created; `node --check` passed; default `npm run benchmark:live` printed the safe skip message and exited 0.
- [x] T007 [P] REQ-007: add `"scripts"` to deep-pi's `files` allowlist in the same change as T006, so neither half of the two-part defect ships alone. Evidence: `npm pack --dry-run` listed `scripts/live-benchmark.mjs` at 2.5 kB, total 13 files.
- [x] T008 [P] REQ-005: author the provenance and drift script covering both forks — upstream identity plus a content hash over each fork's shipped file set, so the hash covers what actually ships rather than the whole directory. Evidence: `.opencode/scripts/check-vendored-fork-provenance.mjs` records deep-pi `0f1cbd8124b4fb35df97f85aa943d730f4aae549` and pi-cache-optimizer `5132d137ce28cb91ec12a5475832df4d5154085a` from the 039 vendoring record.
- [x] T009 [P] REQ-005: make the script report rather than enforce; a check that fails a build on the first legitimate local patch would be worse than the gap it closes. Evidence: clean and deliberate-edit reports both exited 0; drift is represented in JSON and human output, not as a build failure.
- [x] T010 [P] REQ-006: stand up a local OpenAI-compatible provider registered under the `opencode` provider name with the `deepseek-v4-flash-free` model id, in a test-scoped Pi configuration that no production path resolves. Evidence: the boundary script writes `models.json` under a temporary `PI_CODING_AGENT_DIR`, uses only `127.0.0.1`, and passes a synthetic CLI key outside the repository.
- [x] T011 [P] REQ-006: drive a real Pi session against that model and observe the boundary directly — deep-pi dormant, pi-cache-optimizer active — replacing the source-level substitute 006/003 disclosed. **Deferred:** the real attempt could not start because `server.listen(0, "127.0.0.1")` returned `EPERM`; no live ownership result is claimed and 006/003's limitation remains.
- [x] T012 REQ-002/REQ-004: measure coupling for the seven candidate seams (prompt transforms, provider adapters, persistence, routing, diagnostics, commands, hooks) by shared identifiers and module-level state touched; select the lowest-coupling one on the numbers, not on tidiness. Evidence: prompt transforms 60/0, provider adapters 139/1, persistence 145/1, routing 106/0, diagnostics 195/0, commands 101/6, hooks 118/14 (shared identifiers/state references); no seam met the low-coupling bar.
- [x] T013 REQ-002: [DEFERRED: no seam selected; source remained unmodified] characterization tests were not added because no candidate met the low-coupling bar.
- [x] T014 REQ-002/REQ-003/REQ-004: [DEFERRED: no seam extracted; no package change needed] no package allowlist or import-map change was needed.
- [x] T015 REQ-004: re-read the cost of that single seam — characterization effort, allowlist and import-map churn, and how the diff would conflict with an upstream change — and decide on that evidence whether to continue. Evidence: stopped before extraction; the lowest candidate measured 60/0 shared identifiers/state references, so a new module and upstream conflict surface were not justified by a concrete maintenance failure.
- [x] T016 REQ-004: [DEFERRED: no first seam; no second seam existed] no second seam was staged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 REQ-005 self-test both ways: make a deliberate one-character local edit, confirm the check reports drift; revert, confirm it reports none. Evidence: changing `DEFAULT_ROUNDS` from 3 to 4 changed deep-pi's hash and reported `shipped file content changed`; reverting restored equal current/recorded hashes and `drift: false` for both forks.
- [x] T018 REQ-007 verified in both halves: the script runs, and `npm pack --dry-run` lists `scripts/live-benchmark.mjs` — confirming only one half does not close the defect. Evidence: safe skip run exit 0 and final pack listing includes the script.
- [x] T019 REQ-006 verified to reach no network and hold no credential, and 006/003's disclosed limitation kept on record rather than deleted once the fixture works. **Deferred live:** static fixture inspection confirms no stored credential and loopback-only endpoint; the bind failure prevented outbound-session observation, and the inherited limitation remains in `spec.md` and `implementation-summary.md`.
- [x] T020 Per extracted seam: **Not applicable:** no extraction step occurred. Final evidence instead includes both full suites, both typechecks, phase 001's 3-test deep-pi composition run, optimizer's 9-test composition/guard run, and both package dry-runs.
- [x] T021 Revert-on-failure discipline confirmed: any failing step was reverted whole rather than patched forward, and the record says which. Evidence: `git status --short` after the fixture attempt showed no extraction step or temp artifact; no extraction step failed.
- [x] T022 Both extensions still resolve in a real `pi list` after the packaging changes in both forks. Evidence: `PI_CODING_AGENT_DIR=/private/tmp/codex-pi-agent-list-approved PI_OFFLINE=1 pi list --approve` exited 0 and resolved both local extension paths.
- [x] T023 `git diff --numstat` scoped to `spec.md` §3's file list, with the extraction diff attributable seam by seam rather than as one bulk change. Evidence: final scoped status/diff audit records only the intended deep-pi package/script, repo tooling, and phase docs as this phase's additions; pre-existing dirty files are called out separately.
- [x] T024 Compare the final `npm pack --dry-run` output against T001's baseline in both forks and account for every difference. Evidence: deep-pi changed from 12 to 13 files solely by adding `scripts/live-benchmark.mjs` and its allowlist; pi-cache-optimizer remained at 5 files with no package change.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`; T011, T013, T014, T016, and T019 carry explicit deferral or not-applicable reasons
- [x] T002 and T003's blocks cleared, with no `[B]` tasks remaining. Evidence: `tasks.md` contains no `[B]` task markers.
- [x] REQ-001's gate evidence recorded before the first seam was touched, with real command output
- [x] The no-extraction decision is recorded with coupling counts and the upstream-conflict rationale, not left as an abandoned task
- [x] `npm pack --dry-run` clean in both forks, and `pi list --approve` resolves both extensions
- [x] `validate.sh <this-folder> --strict` exits with 0 errors and 0 warnings after the final documentation update
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../002-observability-and-economics/`
- **Evidence source**: `../../007-research-fork-improvements/research/research.md`
<!-- /ANCHOR:cross-refs -->
