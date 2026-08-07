---
title: "Tasks: Validation-Gate Hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "validation gate hardening"
  - "evidence cited redesign"
  - "scaffold never touched complete match"
  - "strict pass freshness sweep"
  - "metadata disk path consistency"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/009-validation-integrity-hardening"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Validation-Gate Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm 008-metadata-rename-reconciliation's current status (does not block this phase landing, only the future F4 enforce-flip) -- verified as shipped before implementation; the new disk rule remains advisory by default via `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE=false`.
- [x] T002 Read 011-scheduled-dq-sweep's `plan.md` and spec.md in full to inform the REQ-009 workflow-consolidation decision -- confirmed the sibling sweep is planned/unbuilt, so this phase ships a separate report-only freshness workflow.
- [x] T003 [P] Build the rename-drift fixture: description.json/graph-metadata.json agreeing with each other but not the real on-disk path -- `validation-gate-hardening.vitest.ts` creates `system-speckit/999-real-packet` with metadata id `system-speckit/999-stale-packet`; advisory and enforced assertions both passed.
- [x] T004 [P] Build the status-drift fixture: spec.md Status=Planned, implementation-summary.md Status=Complete -- `validation-gate-hardening.vitest.ts` creates `system-speckit/998-status-drift`; advisory and enforced assertions both passed.
- [x] T005 [P] Stage the two real bare-evidence-stamp fixtures as read-only reference copies -- `validation-gate-hardening.vitest.ts` reproduces bare evidence-stamp cases with tautology text and asserts `EVIDENCE_CITED` fails both.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Build the shared canonical-status classifier with its Complete/Shipped/Done/Planned/Draft/In-Progress classification table (.opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh) -- `validation-gate-hardening.vitest.ts` classification-table test passed.
- [x] T007 Build the disk-truth identity rule reusing derivePacketIdFromPath(), default-off behind SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE (.opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh) -- targeted vitest asserts advisory exit 0 by default and exit 2 when the flag is true.
- [x] T008 Build the cross-doc status-consistency rule sourcing status-classifier.sh, default-off behind SPECKIT_STATUS_CROSS_DOC_ENFORCE (.opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh) -- targeted vitest asserts advisory exit 0 by default and exit 2 when the flag is true.
- [x] T009 Fix the literal Complete* match at line 53 to call status-classifier.sh (.opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh) -- targeted vitest asserts Shipped-plus-marker fails and Planned-plus-marker passes.
- [x] T010 Replace the three bare-marker substring checks (lines 90, 93, 96) with one content-substance heuristic over the full item text, including the tautology deny-list (.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh) -- targeted vitest and the known-good packet validation both passed after calibration.
- [x] T011 Register METADATA_DISK_PATH_CONSISTENCY and STATUS_CROSS_DOC_CONSISTENCY rule entries (.`opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`) -- known-good validation output lists both new rule ids.
- [x] T012 Build the freshness-sweep entrypoint per the T002 coordination decision, fanning out validate.sh --json over completion-claiming folders and diffing against the last recorded result (.opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts) -- targeted vitest asserts malformed `validate.sh --json` output is reported and the fixture file remains unchanged.
- [x] T013 Add the scheduled plus workflow_dispatch report-only workflow per the T002 coordination decision (.`github/workflows/strict-pass-freshness-sweep.yml`) -- workflow file added with scheduled/manual triggers and no commit/write step.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Confirm flags-off inertness: zero new failures across the fixture set with both new flags unset -- `npx vitest run ../scripts/tests/validation-gate-hardening.vitest.ts --reporter=verbose` passed advisory-default assertions for both staged rules.
- [x] T015 Confirm flag-on drift detection: both drifted fixtures fail once SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE / SPECKIT_STATUS_CROSS_DOC_ENFORCE are set true -- targeted vitest asserts both enforced runs exit 2.
- [x] T016 Confirm the scaffold-never-touched fix against the Shipped-plus-marker (now fails) and Planned-plus-marker (still passes) fixtures -- targeted vitest asserts exit 2 for Shipped and exit 0 for Planned.
- [x] T017 Confirm the evidence-content redesign against all four real fixtures: both bare-stamp files now fail, 032-boot-integrity-rebuild-maintenance-marker's 25 items all now pass -- targeted vitest asserts the two bare stamps fail, and `validate.sh ...032... --strict --no-recursive` passed with Errors 0 Warnings 0.
- [x] T018 Confirm the freshness sweep is report-only (dirty scratch fixture's working tree unchanged after a run) and correctly surfaces a planted regression -- targeted vitest asserts unchanged fixture content and malformed-output error reporting; broader subtree sweep timed out at 180s and was not used as pass evidence.
- [x] T019 Run validate.sh --strict against a known-good and a known-bad packet sample and confirm no unexpected regressions -- known-good `032-boot-integrity-rebuild-maintenance-marker` passed; known-bad fixture paths in `validation-gate-hardening.vitest.ts` produced expected failures.
- [x] T020 Update documentation (spec/plan/tasks/checklist) -- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` record implemented files, evidence, verification, and residual rollout limits.
- [x] T021 Pin the five benchmark metrics and their reproduce commands from plan.md's Benchmark table -- plan.md Benchmark table remained authoritative and each row is covered by the named vitest or the known-good packet validation.
- [x] T022 Author the named test suite asserting the classifier table, the content heuristic, the drift-detection fixtures, and the sweep's regression detection (.opencode/skills/system-spec-kit/scripts/tests/validation-gate-hardening.vitest.ts) -- `npx vitest run ../scripts/tests/validation-gate-hardening.vitest.ts --reporter=verbose` passed 6/6 tests.
- [x] T023 Register both rollout flags in ALL_SPECKIT_FLAGS plus FLAG_CHECKERS and prove flags-off byte-identical rule-output hash (.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts) -- `npx vitest run tests/flag-ceiling.vitest.ts ../scripts/tests/validation-gate-hardening.vitest.ts` passed 12/12 tests.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

- [x] T024 [P1] A failing folder absent from a non-empty baseline falls through to `status: 'pass'` (`scripts/sweep/strict-pass-freshness.ts:189`). Every current failure must resolve to `regression`, `first-run`, or another explicit failing state — never `pass`. Evidence: partial-baseline test (one folder recorded passing, a different failing folder absent). DONE 2026-07-10 — truth table closed: failing folder absent from a loaded baseline -> new-failure + exit 1; first-run only when no baseline file loaded; empty-loaded-baseline treated as real content (stricter). Partial-baseline + empty-baseline tests red pre-fix via git-show scratch copy (strict-pass-freshness.ts:180-204; strict-pass-freshness.vitest.ts). Sonnet-max verified ACCEPT.
- [x] T025 [P1] The scheduled workflow never supplies `--baseline`, so every failure is a non-failing first-run and the gate can stay green indefinitely (`.github/workflows/strict-pass-freshness-sweep.yml:28`). Persist the previous JSON report as artifact/cache, pass it via `--baseline`, publish the new report for the next run. DONE 2026-07-10 — workflow restores previous report via actions/cache@v4 rotating run_id key + restore-keys prefix (saves every run), passes --baseline only when present, uploads artifact always, two-job gate propagates failure (.github/workflows/strict-pass-freshness-sweep.yml; YAML parse clean). Sonnet-max verified ACCEPT.
- [x] T026 [P1] Both enforce flags accept only literal lowercase `true` while ENV_REFERENCE documents `true`/`1` (`scripts/rules/check-metadata-disk-consistency.sh:55`, `check-status-cross-doc-consistency.sh:51`). Adopt one shared boolean parser; test `true`, `1`, uppercase, false, unset. DONE 2026-07-10 — shared parser scripts/lib/parse-bool-flag.sh (true/1/yes/on case-insensitive) sourced by both rules via BASH_SOURCE-relative idiom proven stable under validate.sh dispatch; enforce-flag matrix true/1/TRUE/yes/on->warn, false/0/unset->pass (test-validation-extended.sh run_enforce_flag_matrix_test). Sonnet-max verified ACCEPT.
- [x] T027 [P2] The metadata helper swallows malformed JSON as absent, producing false passes (`scripts/rules/check-metadata-disk-consistency-helper.cjs:27`). Return structured parse errors so the rule emits at least a warning. DONE 2026-07-10 — helper returns {value,parseError}; parseErrors surface as advisory warn tier before mismatch check; end-to-end validate.sh --json shows METADATA_DISK_PATH_CONSISTENCY status warn with real parse-error text incrementing summary.warnings (helper.cjs:27-33,89-104; rule :49-57). Sonnet-max verified ACCEPT.
- [x] T028 [P2] `resolveInsideRepo()` is lexical; a symlink inside the repo can point outside and pass containment (`strict-pass-freshness.ts:82`). Compare `fs.realpathSync()` of root and requested roots. DONE 2026-07-10 — resolveInsideRepo realpath-compares repo root vs requested roots when paths exist, throwing Root-escapes-repository (exit 2) on symlink escape; test creates a repo-local symlink to an external dir and asserts rejection; both prior accepted lanes’ logic in the file verified undisturbed. Sonnet-max verified.
