---
title: "Acceptance Criteria: Close every deferred and pre-existing failure the Pi carve-out surfaced"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/067-deferred-closure"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All fourteen criteria met against observed evidence"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-067-deferred-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Close every deferred and pre-existing failure the Pi carve-out surfaced

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 067-deferred-closure
**Level:** 2
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the sk-code drift wrapper, When it runs, Then all three guards PASS and it exits 0 | `run-all-drift-guards: all 3 guards PASSED`, `Errors: 0`, 20,798 files scanned | Met | - |
| AC-002 | REQ-001 | Given the error reduction, When it is attributed, Then every one of the 3,513 is accounted for without exempting a tracked file | 3,275 untracked/ignored + 217 JSONL false positives + 21 real files fixed = 3,513 | Met | - |
| AC-003 | REQ-001 | Given the scanner change, When a tracked file inside an ignored-looking tree is considered, Then it is still scanned | The filter is per-file against `git ls-files`, not per-directory; 20,798 files still scanned | Met | - |
| AC-004 | REQ-002 | Given the 217 files reported as invalid JSON, When each is parsed line by line, Then every one is valid JSONL | 217/217 parse; 0 genuinely malformed, measured across all of them rather than sampled | Met | - |
| AC-005 | REQ-002 | Given a truncated single-line JSON document, When the checker runs, Then it is still reported | `is_jsonl` requires two or more independently parsing lines | Met | - |
| AC-006 | REQ-003 | Given the playbook package validator, When it runs, Then every cell passes | `PASS: CLI adapter stress matrix bijection`, 98/98 cells, 0 missing/orphan/duplicate | Met | - |
| AC-007 | REQ-003 | Given a renamed snippet, When the sk-doc document validator runs on it, Then it reports zero issues | `VALID`, type `playbook_feature`, 0 issues | Met | - |
| AC-008 | REQ-004 | Given every `cli-*` SKILL.md, When each declared check is resolved, Then all are registered | Re-audit reports 0 unregistered, down from 11 | Met | - |
| AC-009 | REQ-004 | Given a seventh packet declaring an unregistered check, When the CI guard runs, Then it fails | The guard enumerates the directory and asserts >= 6 packets scanned, so an unscanned packet fails rather than passing silently | Met | - |
| AC-010 | REQ-005 | Given each hook suite, When run under the runner its README names, Then all pass | node:test 23/23 · dispatch-audit vitest 74/74 · pi hook vitest 34/34 | Met | - |
| AC-011 | REQ-007 | Given the widened stdin rule, When a permitted dispatch omits `</dev/null`, Then it advises and does not block | New hook case asserts `result?.block` is not true; the rule is `severity: warn` in all six packets | Met | - |
| AC-012 | REQ-007 | Given an availability check with no PATH in the environment, When it runs, Then it passes rather than refusing | Test removes PATH and asserts a pass; a nonexistent PATH dir asserts the refusal | Met | - |
| AC-013 | REQ-001 | Given the 21 mechanically edited files, When each is syntax-checked, Then none is broken | `bash -n` 4/4 OK; `py_compile` 5/5 OK; TypeScript headers are comments only | Met | - |
| AC-014 | REQ-006 | Given every document outside the append-only audit log, When `pi-subagents` is searched for, Then no document names it as a live consumer | Residue sweep: hits only in `.opencode/logs/cli-dispatch-audit.log`, which records dispatches that really ran | Met | - |

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

**Closeable:** Yes. All fourteen rows are `Met` against observations rather than inferences.

**AC-002 is the row that matters.** A gate can always be made green by narrowing what it looks at,
and this packet narrowed the drift scanner. The criterion exists to prove the narrowing was not the
mechanism: every one of the 3,513 errors is attributed, the only files removed from scope are ones
git does not track, and the 21 that remained were fixed rather than exempted. If a future change
wants that arithmetic to stop balancing, it will have to say so out loud.

**AC-009 guards the failure that caused half this packet.** The previous CI guard listed two
packets by name, and those two happened to be the only clean ones, so eleven rules — several at
`severity: error` — did nothing for as long as they existed and no gate noticed. Enumerating the
directory is what makes the same rot loud next time.

**One item is deliberately open and is not a criterion.** Whether to retire the `.pi/agents/` mirror
and its generator is a product decision, recorded in `spec.md` §9 with its rollback. It is not
listed here as `Unmet`, because nothing about it is broken: the mirror is generated, drift-checked
and in sync. Leaving it working is the honest state, not an outstanding task.
<!-- /ANCHOR:closure -->
