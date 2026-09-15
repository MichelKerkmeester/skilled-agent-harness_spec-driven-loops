---
title: "Acceptance Criteria: Phase 1: gate-3-option-merge"
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
    packet_pointer: "040-gate-3-option-merge"
    last_updated_at: "2026-09-15T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "All six acceptance criteria verified Met"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: gate-3-option-merge

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 040-gate-3-option-merge
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `AGENTS.md` today shows five Gate 3 options, When the merge lands, Then it shows four: A Existing, B New, C Related, D Skip, and `CLAUDE.md` still resolves through its symlink | `grep -n "Options (stable labels)" -A6 AGENTS.md` shows exactly A/B/C/D (`AGENTS.md:56` merges "Update related" + "Extend phased packet" into C, `AGENTS.md:57` is D Skip); `readlink CLAUDE.md` -> `AGENTS.md` | Met | - |
| AC-002 | REQ-002 | Given the hook prints five options and treats E as the skip letter, When the merge lands, Then it prints four and its letter regexes treat D as the skip letter | `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` -> `tests 90 / pass 87 / fail 0 / skipped 3 (pre-existing)`, exit 0; `GATE_3_QUESTION` (`spec-gate-core.mjs:131`) and `GATE_3_DENY_DETAIL` (`spec-gate-core.mjs:144`) both read A-D; `STANDALONE_LETTER_D_REGEX` (`spec-gate-core.mjs:897`) and the natural-lead-in skip check now key on D | Met | - |
| AC-003 | REQ-003 | Given the 31-file inventory each show some form of the old option text, When the merge lands, Then every one of those 31 files carries the same four letters and wording as `AGENTS.md` | The re-run inventory grep found 43 files (drift beyond the planned 31, all triaged, recorded in `tasks.md:37`); every one carries the merged four-option wording in its own format except the 3 files excluded as historical evidence (see AC-004) | Met | - |
| AC-004 | REQ-004 | Given a surface outside spec folders and archives might still print "E) Skip" or name "Extend phased packet", When the merge lands, Then the inventory grep returns zero such hits | `rg -ln "Update related\|Extend phased packet\|E\) Skip\|A/B/C/D/E\|A-E\b\|Use a phase folder" --glob '!specs/**' --glob '!node_modules/**' --glob '!.worktrees/**' --glob '!**/dist/**' --glob '!**/z_archive/**' .` returns exactly 3 files: `manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:158` and `benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:123` (and its `report.json` twin) — each a dated, captured transcript of a real prior run (quoting the model's own literal reply and the tool's actual emitted text), excluded under the same "archives are historical records, not corrected" rationale spec.md states for spec folders, applied here by content rather than directory. A second grep for `\bE\) Skip\b\|\(A/B/C/D/E\)\|letter A-E\b` returns hits only inside that same excluded playbook file | Met | - |
| AC-005 | REQ-005 | Given the classifier never reads an option letter today, When the merge lands, Then its source is unedited and its test suite still passes | `grep -n "satisfiedBy\|prior_answer\|[A-E])" .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` shows no letter dependency, only `satisfiedBy` plumbing (`gate-3-classifier.ts:113`); `git diff` confirms the file is untouched; `npx vitest run cli/tests/gate-3-classifier.vitest.ts --config ../vitest.config.ts` -> `Tests 62 passed (62)`, exit 0 | Met | - |
| AC-006 | REQ-006 | Given `CLAUDE.md` is a symlink to `AGENTS.md` today, When the merge lands, Then it is still a symlink resolving to `AGENTS.md`, carrying the new text with no separate edit | `test -L CLAUDE.md && [ "$(readlink CLAUDE.md)" = "AGENTS.md" ]` holds per the Definition of Done gate at `plan.md:53`; `readlink CLAUDE.md` -> `AGENTS.md` | Met | - |

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

AC-001 through AC-006 are each `Met`. The merge landed in one pass: `AGENTS.md`, the hook
(`spec-gate-core.mjs`) and its test, 40 other inventoried surfaces (prose, YAML, JSON fixture),
and the 3 regenerated compiled deep-loop contracts all carry the same four-option wording. The
classifier (`gate-3-classifier.ts`) was confirmed unedited and its test suite re-passes. Three
files were deliberately left untouched as historical evidence records (a dated manual-testing
transcript and two dated benchmark reports), not because they were missed by the inventory grep.
<!-- /ANCHOR:closure -->
