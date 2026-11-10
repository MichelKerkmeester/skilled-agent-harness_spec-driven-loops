---
title: "Acceptance Criteria: Phase 9: dsh-context-guards-and-goal-bridge"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh context guards and goal bridge acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge"
    last_updated_at: "2026-11-06T07:58:56Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; AC-002 to AC-006 remain open."
    next_safe_action: "Update SYNC.md, complete parity checks, then rerun the boot."
    blockers: ["phase 008 open", "SYNC.md incomplete", "parity checks open"]
    key_files: ["evidence/keyless-guards-boot.txt", "../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt", "evidence/message-contract-run.txt", ".dsh/plugins/repo-guards/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-009-dsh-context-guards-and-goal-bridge"
      parent_session_id: null
    completion_pct: 14
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: dsh-context-guards-and-goal-bridge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture packet `goal.md` with frontmatter, When `goal-context` runs on its seam, Then the injected context holds the `chat_slice` that `goal.cjs packet <fixture>` prints and none of the frontmatter | `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs:420` asserts exact `chat_slice` equality and rejects a `---` line. `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt:27` records the passing case | Met | - |
| AC-002 | REQ-002 | Given an `agent/created` fixture, When `session-start-context` runs, Then it injects the session-prime output the Pi extension injects for the same workspace | `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs:497` stubs `runSessionPrime` and proves the call arguments and stub injection. `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt:29` records the pass. It does not compare output with the Pi extension | Unmet | - |
| AC-003 | REQ-003 | Given no provider key and a disposable `DSH_HOME`, When the phase 008 keyless boot runs with the extended `.dsh/patches/guards.patch.yml`, Then it exits 1 with `MISSING_CREDENTIAL` and stderr names no failed plugin | `evidence/keyless-guards-boot.txt:5` records `MISSING_CREDENTIAL` and `:6` records no `did not activate` line. `tasks.md:71` records that the run predates the adapter edits, so a current-bundle rerun is needed | Unmet | - |
| AC-004 | REQ-004 | Given a `compaction/summary` fixture event, When `session-compact-context` runs, Then either packet context is restored or the adapter is recorded as deferred with its reason | `.dsh/plugins/repo-guards/README.md:138` records the deferral and reason. The criterion allows that documented deferral; the stricter `.dsh/SYNC.md` task remains open | Met | - |
| AC-005 | REQ-005 | Given `git-message-gate` ships, When the sk-git message-contract fixtures run through it, Then each gives the verdict `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` expects | `evidence/message-contract-run.txt:40` and `:48` record 38 passing standalone cases. `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt:36` records the two gate cases. `tasks.md:56` records that the contract cases bypass the gate | Unmet | - |
| AC-006 | REQ-006 | Given the six optional adapters, When the bundle and `.dsh/SYNC.md` are read, Then each is shipped with a test or named as deferred with a reason | `.dsh/SYNC.md:40` names only `session-compact-context`. `.dsh/plugins/repo-guards/README.md:138` to `:141` list four deferrals with reasons. `tasks.md:58` records the mismatch | Unmet | - |
| AC-007 | REQ-001 | Given the phase docs, When strict validation runs, Then the folder passes | `tasks.md:74` records the strict validator result for this closeout | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

AC-002, AC-003, AC-005 and AC-006 remain open. AC-002 needs the session-prime comparison, AC-003 needs the current keyless rerun, AC-005 needs the gate run through the contract cases, and AC-006 needs the deferrals listed in `.dsh/SYNC.md`. AC-004 is met by the README deferral record, while task T007 still requires the stricter SYNC entry. This phase also depends on phase 008, which remains open.
<!-- /ANCHOR:closure -->
