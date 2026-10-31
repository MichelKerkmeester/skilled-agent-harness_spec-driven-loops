---
title: "Acceptance Criteria: Phase 5: central-doctor-playbook"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "central doctor playbook acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/005-central-doctor-playbook"
    last_updated_at: "2026-10-31T16:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the packet: every criterion is Met against the Phase 005 evidence section"
    next_safe_action: "None - packet closed; the orchestrator refreshes the generated metadata"
    blockers: []
    key_files:
      - "specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md"
      - ".skilled/manual-testing-playbook/doctor-commands/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: central-doctor-playbook

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** commands/005-doctor-symlink-install/005-central-doctor-playbook
**Level:** 2
**Status:** Complete
**Date:** 2026-10-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

The evidence line cited in each `Met` row is the run the orchestrator recorded in `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md`, section "Phase 005". The quote is verbatim, and the line number in the record is given after it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a new package at `.skilled/manual-testing-playbook/` holding the moved scenarios and the merged guide, When the package validator runs against it, Then it prints `PASS` with `violations=0` and exits 0 | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` printed `PASS package=.skilled/manual-testing-playbook tier=FAIL_CLOSED scenarios=61 categories=1 operator=61 routing_gold_excluded=0 violations=0 warnings=12`, exit 0. The 12 warnings are `BACKTICK_PATH_UNRESOLVED` on example paths the scenarios carried before the move. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:178` | Met | - |
| AC-002 | REQ-002 | Given 57 doctor scenarios spread over six skill playbook packages, When each is moved with `git mv` into the central package, Then no skill keeps a doctor-commands folder | `ls -d .skilled/skills/*/manual-testing-playbook/doctor-commands` printed no matches, quoted as "no matches, so no skill keeps a doctor-commands folder". Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:181` | Met | - |
| AC-003 | REQ-003 | Given two moved scenarios whose ids collided with existing central numbers, When DOC-393 becomes DOC-400 and DOC-394 becomes DOC-401, Then no two of the 61 central scenarios share a `DOC-` id | "Duplicate `DOC-` IDs among the 61 central scenarios: 0". Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:180` | Met | - |
| AC-004 | REQ-004 | Given four doctor commands that had no scenario, When DOC-402 to DOC-405 are written and the coverage list is read over the package, Then every one of the 16 doctor commands is named by at least one central scenario | "Coverage: every one of the 16 doctor commands is named by at least one central scenario", followed by the per-command counts from `setup 5` through `install 1, symlink 2`. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:182` | Met | - |
| AC-005 | REQ-005 | Given a fleet run that walks every playbook package, When the validator discovers the central package and the fail-closed allowlist names it, Then the run exits 0 and its verdict list differs from main's by one `PASS` line for the new package | The no-argument fleet run "exit 0, with 52 PASS and 4 SKIP", and "Diffed against main's fleet verdicts, the only difference is the new line `PASS package=.skilled/manual-testing-playbook`". Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:179` | Met | - |
| AC-006 | REQ-006 | Given nine central files with no `Provenance:` line, When each gets one and the provenance walk covers the central package, Then `workflow-invariance.vitest.ts` and `playbook-provenance-paths.vitest.ts` pass | `npx vitest run --config ../../vitest.config.ts --project cli tests/workflow-invariance.vitest.ts tests/playbook-provenance-paths.vitest.ts` from `system-spec-kit/runtime/cli` gave "2 files, 5 tests passed". The nine files were the seven moved advisor routing and setup scenarios, the category README and the root, and each now carries one `Provenance: manual only - ...` line. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:183` | Met | - |
| AC-007 | REQ-007 | Given an advisor index that still read 62 scenario files, When it reads 48 across 9 categories, Then the advisor playbook and scorer suites pass | `npx vitest run tests/manual-testing-playbook.vitest.ts tests/scorer/native-scorer.vitest.ts` from the advisor runtime gave "2 files, 23 tests passed". The index change that made it pass is recorded in the same section: the line that said "all 62 scenario files" failed the suite and now says 48. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:184` | Met | - |
| AC-008 | REQ-008 | Given runtime mirrors, prompt mirrors and advisor bridges that carry the moved paths, When every generator reruns in `--check` mode, Then each reports its copy current | "211 mirrors across 9 trees are in sync", "43 prompts are in sync" from each of the pi, codex and hermes syncs, and `"status": "fresh"` from the bridge deriver. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:187` | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every row rests on a run recorded from the final tree, and the corrections made at closeout, the nine missing provenance lines, the stale row count, the stale advisor index line and the reverted changelog edit, are covered by those runs, so the packet closes.
<!-- /ANCHOR:closure -->
