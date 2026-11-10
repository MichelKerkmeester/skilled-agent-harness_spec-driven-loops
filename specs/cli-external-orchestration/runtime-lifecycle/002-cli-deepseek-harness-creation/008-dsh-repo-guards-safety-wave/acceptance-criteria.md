---
title: "Acceptance Criteria: Phase 8: dsh-repo-guards-safety-wave"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh repo guards safety wave acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/008-dsh-repo-guards-safety-wave"
    last_updated_at: "2026-11-06T07:45:32Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; AC-001 and AC-005 remain open."
    next_safe_action: "Record the decision and rerun the current keyless boot."
    blockers: ["decision-record.md missing", "current keyless boot missing"]
    key_files: ["evidence/bundle-node-test-run.txt", "evidence/keyless-guards.stderr.txt", "evidence/negative-control.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-008-dsh-repo-guards-safety-wave"
      parent_session_id: null
    completion_pct: 57
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: dsh-repo-guards-safety-wave

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/008-dsh-repo-guards-safety-wave
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
| AC-001 | REQ-001 | Given no provider key in env and a disposable `DSH_HOME`, When `dsh --profile headless` runs with the route, lineage and `.dsh/patches/guards.patch.yml` patches, `--json` and `-`, Then it exits 1 with `MISSING_CREDENTIAL` and stderr names no failed plugin and no `startup-*.log` report | `evidence/keyless-guards.stderr.txt:1` records `MISSING_CREDENTIAL` and no plugin warning at 07:18. The run predates `guards.patch.yml` (07:37) and adapter edits at 08:02, 08:04 and 08:18. A current-bundle rerun is still needed | Unmet | - |
| AC-002 | REQ-002 | Given a fixture tool call per guard, When the adapter and the matching `.pi/extensions/<guard>.ts` judge it, Then both give the same allow or deny | `evidence/bundle-node-test-run.txt:9` includes the parity cases (37 pass, 0 fail). `implementation-summary.md:49` records that each adapter calls the shared core its Pi extension imports. The tests do not execute the `.ts` files | Met | - |
| AC-003 | REQ-003 | Given a shared core that throws, When each adapter runs, Then it applies its declared error policy, and `spec-gate-enforce` and `dispatch-preflight-lint` fail closed | `evidence/bundle-node-test-run.txt:18` and `:26` show the throw cases passing. `implementation-summary.md:62` records the two fail-closed policies and the six fail-open policies | Met | - |
| AC-004 | REQ-004 | Given the finished bundle, When the label scan runs, Then no comment carries an ephemeral label | `tasks.md:69` records the valid `rg` scan exiting 1 with no output at the 08:19 snapshot. The criterion's `rg -n -E` form exits 2 under ripgrep, so the run used the same pattern without `-E` | Met | - |
| AC-005 | REQ-005 | Given the decision record, When it is read, Then it names the chosen mechanism, the rejected one and the evidence | `tasks.md:58` records that `decision-record.md` is absent. The choice is also noted without a decision record in `implementation-summary.md:77` | Unmet | - |
| AC-006 | REQ-006 | Given the bundle exists, When the docs are checked, Then both name it | `.dsh/SYNC.md:27` and `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md:59` name the bundle | Met | - |
| AC-007 | REQ-001 | Given the phase docs, When strict validation runs, Then the folder passes | `tasks.md:71` records the strict validator result for this closeout | Met | - |

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

Two rows are open. AC-001 needs one keyless boot on the current bundle. AC-005 needs `decision-record.md`.
<!-- /ANCHOR:closure -->
