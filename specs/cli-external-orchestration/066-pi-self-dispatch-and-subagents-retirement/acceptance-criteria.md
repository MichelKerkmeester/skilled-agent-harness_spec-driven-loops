---
title: "Acceptance Criteria: Let a Pi session dispatch cli-pi, and retire the pi-subagents route"
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
    packet_pointer: "cli-external-orchestration/066-pi-self-dispatch-and-subagents-retirement"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Eighteen of nineteen criteria met against observed evidence; AC-002 is operator-only"
    next_safe_action: "Operator runs the live Pi dispatch for AC-002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-066-pi-self-dispatch"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Let a Pi session dispatch cli-pi, and retire the pi-subagents route

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 066-pi-self-dispatch-and-subagents-retirement
**Level:** 2
**Status:** Complete pending AC-002
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a bash dispatch composed inside a Pi session naming `cli-pi`, When the preflight hook evaluates it, Then it is not denied by name | 33 passed. The matrix row `cli-pi named by the user` is now `false`; `git diff` shows both the deny branch and its block message removed | Met | - |
| AC-002 | REQ-001 | Given a real Pi session, When `cli-pi` is dispatched from it, Then the command reaches the pi binary | Operator-run from inside Pi. **Cannot be observed from this runtime** — if unrun, this row stays `Unmet` and the packet says so rather than inferring it from AC-001 | Unmet | - |
| AC-003 | REQ-002 | Given a `cli-pi` config whose only signal is the pi binary in process ancestry, When `validateExecutorDispatchAllowed` runs, Then it returns `allowed: true` | `allows a cli-pi dispatch whose only signal is the pi binary in process ancestry` -> `{allowed: true}` | Met | - |
| AC-004 | REQ-002 | Given a `cli-pi` config whose only signal is a lockfile in a Pi state path, When the guard runs, Then it returns `allowed: true` | `allows a cli-pi dispatch whose only signal is a pi dispatch lockfile` -> `{allowed: true}` | Met | - |
| AC-005 | REQ-003 | Given each of the other five executor kinds with an ancestry signal, and again with a lockfile signal, When the guard runs, Then every one is refused | 10 parameterized cases (five kinds x ancestry and lockfile), all refusing. This is the case that fails on a kind-agnostic exemption | Met | - |
| AC-006 | REQ-003 | Given a `cli-pi` dispatch inside a fan-out lineage, and again with `cli-pi` already in the dispatch stack, When the guard runs, Then both are refused with `recursion-guard-lineage` and `recursion-guard-stack` | both cases passing: `recursion-guard-lineage` and `recursion-guard-stack` still refuse cli-pi | Met | - |
| AC-007 | REQ-003 | Given the adapter stress suite, When it runs after the carve-out, Then test 13 for `cli-pi` still passes unchanged | 19 passed, 1 skipped, file untouched. The negative control holds | Met | - |
| AC-008 | REQ-002 | Given the `env` layer, When the diff is read, Then `EXECUTOR_SESSION_ENV_BY_KIND` still has no `cli-pi` entry | `git diff` shows `EXECUTOR_SESSION_ENV_BY_KIND` unchanged; no cli-pi entry added | Met | - |
| AC-009 | REQ-004 | Given the `cli-pi` packet, When `grep -ric "self.invocation"` runs over it, Then hits appear only under `changelog/`, `benchmark/reports/`, the surviving `stress/self-invocation.md` cell, and links to that cell's path | Residue grep: 4 hits inside the stress cell (its own manifest-bound title, id and path) and 1 index link to it. Nothing instructs a reader to refuse for being inside Pi | Met | - |
| AC-010 | REQ-005 | Given the hub, When `grep -ric "pi-subagents"` runs over it, Then hits appear only under `changelog/` and `benchmark/reports/` | Residue grep: zero hits outside `changelog/` and `benchmark/reports/` | Met | - |
| AC-011 | REQ-005 | Given `references/agent-delegation.md`, When the leaf manifest is checked, Then the file still exists and the `cli-pi` leaf set is unchanged | file present and rewritten; `git status` shows no change to `leaf-manifest.json` | Met | - |
| AC-012 | REQ-004 | Given `stress/self-invocation.md`, When the playbook package validator runs, Then no `[missing-playbook]`, `[orphan-playbook]` or `[playbook-metadata]` failure is reported | zero `missing-playbook`, `orphan-playbook`, `duplicate-playbook-cell`, `invalid-playbook` or `playbook-metadata` failures | Met | - |
| AC-013 | REQ-006 | Given the hub's SKILL, README and ROUTER, When each universal guard claim is read, Then each states the `cli-pi` carve-out and which layers still hold | hub SKILL.md Recursion Guards section, its NEVER rule, README `:34`/`:91` and ROUTER.md all now state the carve-out and which layers still bind | Met | - |
| AC-014 | REQ-007 | Given `graph-metadata.json`, When the vocabulary and `causal_summary` are read, Then neither offers `pi-subagents` nor a `cli-pi` self-invocation guard as routable | `pi-subagents` removed from the pi vocabulary; `causal_summary` now names the cli-pi exception. `:202` was cli-opencode's own guard vocabulary and is still accurate, so it was left alone | Met | - |
| AC-015 | REQ-008 | Given `SKILL.md` and `README.md`, When their version fields are compared, Then both read 1.5.0.0 and a `v1.5.0.0` changelog entry exists | both read `version: 1.5.0.0`; `changelog/v1.5.0.0.md` exists | Met | - |
| AC-016 | REQ-001, REQ-002 | Given a baseline captured before the first edit, When both guard suites and `tsc --noEmit` are rerun after, Then the pass count is not lower and the `tsc` error set is unchanged | 170 passed vs 156 baseline (+14, all new); `tsc --noEmit` exit 0 with the same empty error set | Met | - |
| AC-017 | REQ-004 | Given `dispatch-rule-checks.mjs`, When `KNOWN_CHECKS` is read after the edit, Then it is unchanged | `git status` shows `dispatch-rule-checks.mjs` unmodified; `KNOWN_CHECKS` still lists the same six checks | Met | - |
| AC-018 | REQ-008 | Given the packet folder, When `validate.sh --strict` runs, Then it prints `RESULT: PASSED` with `Errors: 0` | `RESULT: PASSED` observed with `Errors: 0  Warnings: 0`, read from the output rather than inferred from an exit code | Met | - |
| AC-019 | REQ-004, REQ-005 | Given the scoped diff, When it is reviewed, Then no file outside `spec.md` §3 was changed and no changelog or benchmark record was edited | no changelog or benchmark record edited; one file added beyond the table, the pre-existing test that pinned the old cli-pi lockfile verdict | Met | - |

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

**Closeable:** Not yet — 18 of 19 rows are `Met`; AC-002 remains `Unmet` and is the operator's to run.

**AC-002 was not promoted from AC-001.** The Pi preflight hook runs inside Pi. Its unit tests pass
and prove the deny branch is gone and that a named `cli-pi` dispatch now takes the override path;
they do not prove a real Pi session's dispatch reaches the binary. That distinction is the reason
this row exists, so it stays `Unmet` rather than being closed on the strength of its neighbour.

**AC-005 and AC-007 are the negative controls, and both were run rather than read.** AC-005 exercises
ten parameterized cases proving the other five executor kinds still refuse on both exempted layers —
it fails if the exemption is ever rewritten kind-agnostically. AC-007 runs the shipped adapter stress
suite untouched; its stack-layer cell staying green is what proves the carve-out did not reach past
the two layers ADR-001 named.

**AC-009 was corrected before it was ever verified.** As first drafted it required zero
`self-invocation` hits outside `changelog/` and `benchmark/reports/` except the stress cell itself,
which overlooked that the cell's own filename propagates into any link pointing at it. The criterion
now allows those links. This is a drafting fix to an unobserved criterion, not a rewrite of a
recorded observation — no row's history was altered.
<!-- /ANCHOR:closure -->
