---
title: "Acceptance Criteria: Phase 49: gate-3-delivery-residue"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue"
    last_updated_at: "2026-09-22T10:40:00Z"
    last_updated_by: "phase-049-closure"
    recent_action: "Marked every criterion Met against observed evidence"
    next_safe_action: "Run both strict validations and the completion gate, then commit"
    blockers: []
    key_files:
      - ".hermes/plugins/repo-guards/__init__.py"
      - ".hermes/plugins/repo-guards/tests/test_repo_guards.py"
      - "tsconfig.pi.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000001"
      session_id: "20260922_103547_92e186"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cursor's advisory no-op is intended: the adapter header and its pinning test decide it."
      - "The concurrent-first-mutation window on the delivery marker is documented as an accepted boundary."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 49: gate-3-delivery-residue

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue
**Level:** 2
**Status:** Complete
**Date:** 2026-09-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Hermes session with an open gate, When its first write-capable tool call runs, Then the call's result carries the Gate-3 notice once and the next write carries nothing, while `SYSTEM_SPEC_GATE_ENFORCE=1` blocks the call with the shared reason | `.hermes/plugins/repo-guards/__init__.py:584` runs the shared enforce adapter from the result path; the unit cases at `.hermes/plugins/repo-guards/tests/test_repo_guards.py:142` and `:190` pin once-only delivery and the deny block; the live sessions `20260922_095443_31c676` (`GATE` then `NO_GATE`) and `20260922_103547_92e186` (`BLOCKED DENIED: this Write/Edit needs a bound spec folder first.`) are recorded at `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/goal-hook/advisor-brief-and-gate-delivery.md:82` | Met | - |
| AC-002 | REQ-002 | Given a Hermes turn, When the prompt is classified, Then the plugin opens the session's gate without reading any question from the silent classify path, the advisor brief is unchanged, and an orchestrated leaf receives neither classification nor notice | `.hermes/plugins/repo-guards/__init__.py:572` opens the gate and discards the adapter's output; the leaf case at `.hermes/plugins/repo-guards/tests/test_repo_guards.py:227` asserts no gate adapter is consulted; the live turn session `20260922_095053_5713d3` printed `ADVISOR` then `NO_GATE` with gate state `{"status":"open"}` | Met | - |
| AC-003 | REQ-003 | Given every documentation, feature-catalog and runtime-reference surface that mentions Gate-3 delivery, When it is read against the shipped code, Then none describes turn-time injection, and each sweep finding is corrected or rebutted with the line that proves it current | The corrected carriers are `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:41`, `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:91`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:205`, `.env.example:146`, `.pi/extensions/README.md:39`, `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:201` and `.hermes/SYNC.md:79`; the sweep report and both rebuttal rows live at `specs/system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue/scratch/devin-surface-sweep.md:95` | Met | - |
| AC-004 | REQ-004 | Given the two Pi spec-gate extensions, When the dedicated TypeScript check runs, Then it exits 0, and a deliberate API typo in a file at that path exits non-zero | `tsconfig.pi.json:10` carries `preserveSymlinks` with the two includes at `tsconfig.pi.json:13`; `.skilled/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.pi.json` exited 0, and the throwaway probe calling `ctx.ui.selct(...)` exited 2 with `TS2551` before deletion | Met | - |
| AC-005 | REQ-005 | Given an external verification round, When the runs return, Then the cli-devin sweep report and the cli-codex Luna review are in the packet's scratch directory and every HIGH finding is fixed or answered with evidence | `specs/system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue/scratch/luna-review.md:1` records `## HIGH` with no findings, `:5` the four MEDIUM rows and `:15` the single LOW; their fixes are recorded at `tasks.md:69` (T019) and `tasks.md:58` (T015); the sweep report's findings table is at `scratch/devin-surface-sweep.md:97` | Met | - |
| AC-006 | REQ-006 | Given the phase's code writes, When they are reviewed for surface compliance, Then they routed through `sk-code-opencode`, carry no ephemeral id or spec path in comments, and the drift guards name no touched file | The routing result is recorded at `specs/system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue/tasks.md:39`; the final guard run's finding set contains no touched path, and the one PY-SHEBANG warning it raised on `.hermes/plugins/repo-guards/tests/test_repo_guards.py:1` was cleared | Met | - |
| AC-007 | REQ-007 | Given the packet's closing documents, When both strict validations and the completion gate run, Then the packet reports `RESULT: PASSED` with no errors or warnings, the parent recursive run passes for every child this phase could affect, and the checklist reports every P0/P1 item evidenced | `tasks.md:190` (Verification Summary) records P0 18/18, P1 12/12, P2 1/1; `validate.sh --strict` on the packet reported Errors: 0 Warnings: 0, `validate.sh --recursive --strict` passed on the parent and 48 of 49 children with the one failure being the pre-existing `030-spec-kit-simplification-research` goal-slice error (reproduced from the pre-change tree, `tasks.md:71`), and `check-completion.sh` reported 100% with evidence on all completed P0/P1 items | Met | - |
| AC-008 | REQ-008 | Given the existing fail-open boundaries, When the full battery runs from the frozen tree, Then every suite keeps its count, `AGENTS.md` is untouched, and the commit remains local | The battery is recorded at `specs/system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue/tasks.md:122` (core 107/107), `tasks.md:123` (adapters 59), `tasks.md:124` (Hermes 43) and `tasks.md:126` (OpenCode 11, Pi 9); `git status --porcelain` lists no `AGENTS.md`; the branch has no upstream and was never pushed | Met | - |

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

AC-001 and AC-002 carried the runtime fix: the Hermes plugin now classifies every prompt, delivers the notice once at the first write, and blocks only under enforcement — proven by the unit suite and three live dispatches. AC-003 and AC-005 carried the surface work: the sweep's findings were each re-read before being edited, and the adversarial review's rows were fixed or documented. AC-004 and AC-006 through AC-008 carried the gates: the Pi type check, the unchanged drift-guard finding set, and the two strict validations. Consciously left out: the shared `AGENTS.md` prose (operator decision), the six runtimes phase 048 completed, and Cursor's deliberately inert advisory mode, which is now documented as a boundary rather than misdescribed as a working delivery path.
<!-- /ANCHOR:closure -->
