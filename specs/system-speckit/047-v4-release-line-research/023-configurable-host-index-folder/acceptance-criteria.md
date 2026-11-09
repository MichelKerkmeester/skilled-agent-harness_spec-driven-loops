---
title: "Acceptance Criteria: Let a host repository name its trigger index folder"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "configurable host index folder acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/023-configurable-host-index-folder"
    last_updated_at: "2026-11-09T18:41:01Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Review the twelve-file diff and commit it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-configurable-host-index-folder"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Let a host repository name its trigger index folder

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `023-configurable-host-index-folder`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a host root whose `.skilled-host.json` names `"indexDir": ".index"`, When generation runs and then a bare lookup runs from that root, Then `.index/trigger-index.json` is written, `.speckit-index/` is not created, and the lookup `source` line names `.index/trigger-index.json` | Test "generates into the named directory and the lookup reads it" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:401`) passes in the observed 48-case run | Met | - |
| AC-002 | REQ-002 | Given a host root with no settings file, When the folder is resolved and generation runs, Then `hostIndexDir` returns `.speckit-index` and the index lands in `.speckit-index/trigger-index.json` | Test "keeps the default directory when the host names none" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:393`) passes in the observed run | Met | - |
| AC-003 | REQ-003 | Given a root that names `.index`, When the host check runs, Then a root holding `.index/` is a host, and a root holding only a stale `.speckit-index/` is not | Test "counts the named directory, not the default, as the host signal" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:421`) passes in the observed run. The mutation check was recorded by the operator and was not re-run here: restoring the hard-coded default made this case fail | Met | - |
| AC-004 | REQ-004 | Given a project linked into a host that names `.index`, and no settings file in the project, When a bare lookup runs from the project, Then it reads the host's `.index/trigger-index.json` | Test "lets a linked project read the directory its owning host names" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:433`) passes in the observed run | Met | - |
| AC-005 | REQ-005 | Given `indexDir` set to `../outside`, When the lookup or the generator runs, Then both exit 2, stderr names `.skilled-host.json`, and `.speckit-index/` is not written | Test "exits 2 from both scripts on a setting it cannot honor" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:525`) passes in the observed run | Met | - |
| AC-006 | REQ-005 | Given `indexDir` set to `../outside`, `/abs/index`, `.`, `.skilled/index`, `specs/index`, `.SKILLED/index`, `Specs/index`, `.git/idx`, `node_modules/x`, an empty string or the number 42, When `hostIndexDir` runs, Then it throws an error that states the rule the value broke | The eleven "rejects indexDir ... rather than falling back" cases from the `it.each` block (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:458`) pass in the observed run | Met | - |
| AC-007 | REQ-006 | Given a settings file that is not JSON, When `hostIndexDir` runs, Then it throws an error that contains `not valid JSON` | Test "rejects a settings file that is not JSON" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:578`) passes in the observed run | Met | - |
| AC-008 | REQ-007 | Given the 15 related cli test files, When they run after the change, Then every baseline pass holds | Clean run recorded in the Verification table of `implementation-summary.md:111`: `Test Files  15 passed (15)` and `Tests  297 passed and 1 skipped (298)`, exit 0. The baseline of 269 passed and 1 skipped (270) is operator-recorded before the change and was not re-run here | Met | - |
| AC-009 | REQ-008 | Given an `indexDir` that is a link out of the host, a link into `specs/`, an existing regular file, or `" .index "` with blank space around it, When `hostIndexDir` runs, Then the first three throw and the last returns `.index` | Tests "rejects a directory that is a link to somewhere outside the host", "rejects a directory that is a link into the corpus", "rejects a name that is already a regular file" and "ignores blank space around the directory name" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:477`) pass in the observed 48-case run | Met | - |
| AC-010 | REQ-009 | Given a host whose `indexDir` is `../outside`, When `upgrade-legacy.mjs --refresh-markers` runs from that host, Then it exits 2, stderr names `.skilled-host.json` and prints no stack trace | Test "exits 2 from the legacy upgrade on a setting it cannot honor" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:514`) passes in the observed 48-case run | Met | - |
| AC-011 | REQ-010 | Given a host that names `.index`, holds no index there and still holds `.speckit-index/trigger-index.json`, When a bare lookup runs, Then stderr names the leftover index and the named folder, the exit status is not 2, and the line is gone once the index is regenerated | Test "says on stderr that a named folder holds no index while the default one still does" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:557`) passes in the observed 48-case run | Met | - |
| AC-012 | REQ-011 | Given a project linked into a host that keeps an index of its own, When a bare lookup runs from the project, Then it reads the project's index | Test "reads the index the project keeps itself before its host is asked" (`.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:301`) passes in the observed 48-case run | Met | - |

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

**Closeable:** Yes

Every row is Met, and each row names the run that observed it. The mutation check and the 269-passed baseline are operator-recorded, and their rows say so.
<!-- /ANCHOR:closure -->
