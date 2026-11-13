---
title: "Acceptance Criteria: Phase 6: gate-2-binding-and-runtime-pointers"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "gate 2 binding and runtime pointers acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers"
    last_updated_at: "2026-11-12T20:30:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "None. Every criterion is Met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-gate-2-binding-and-runtime-pointers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: gate-2-binding-and-runtime-pointers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `SSK` is `.skilled/skills/system-spec-kit/runtime`. `SYNC` is `$SSK/cli/runtime-mirrors/sync-gate1-pointers.cjs`. `S` is this phase's `scratch/` folder.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited `AGENTS.md`, When Gate 2 is read, Then exactly one line starts `- **Command in the brief.**` and it equals the drafted text | `rg -c "^- \*\*Command in the brief\.\*\*" AGENTS.md` prints 1, and `diff <(rg "^- \*\*Command in the brief" AGENTS.md) $S/bullet-draft.txt` prints nothing Evidence: Rerun during closure on 2026-11-13: `rg -c` printed 1 and the `diff` printed nothing, exit 0. Cites: AGENTS.md:68 | Met | - |
| AC-002 | REQ-002 | Given the bullet and the regenerated manifest, When the check engine, the manifest check and the canary run, Then the check prints `STATUS=OK` with A4 `44 current` and A6 at or under 16384, the manifest check prints `PASS` with 31 pins, and the canary prints `OK` | `node .skilled/commands/doctor/scripts/agents-md-check.cjs`, `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check`, `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` Evidence: `scratch/after-check.txt` prints `STATUS=OK rows=12 findings=0 unknown=0`, A4 `44 current` and A6 `16092 of 16384`. The manifest check printed `PASS: 44 sections, 31 pins, derived matches AGENTS.md`. The canary printed `OK: all rule invariants present`. Cites: scratch/after-check.txt:15, scratch/verification-evidence.txt:4, scratch/verification-evidence.txt:10 | Met | - |
| AC-003 | REQ-003 | Given the regenerated Cursor rule, When the generator checks it, Then it exits 0 and the rule holds the Gate 2 call line and the bullet once each. A hand edit in block two exits 1, and a root with no bullet gets block one only | `node $SYNC --check` exits 0, `rg -c "Command in the brief" .cursor/rules/skill-routing.md` prints 1, and `(cd $SSK/cli && npx vitest run tests/gate1-pointer-sync.vitest.ts --config ../vitest.config.ts --root .)` reports 7 passed Evidence: sync `--check` exit 0, `Command in the brief` counts 1 in the Cursor rule and the pointer test reports 7 passed (T025, T029). Cites: scratch/verification-evidence.txt:6, scratch/verification-evidence.txt:11 | Met | - |
| AC-004 | REQ-004 | Given `AI_SESSION_CHILD=1`, When a brief surfaces a `start` or `ask` command or an add-only `run` command, Then it renders `(parent-named only)`, and with the variable unset or `0` the brief is byte-equal to phase 005's | In `ADV`, `npx vitest run tests/render-child-session.vitest.ts` reports 7 passed, and `AI_SESSION_CHILD=1 bash $S/hook-first-line.sh "disable comment hygiene gate"` prints `/doctor:git hooks (parent-named only)` Evidence: the child render test reports 7 passed, 0 failed. The probe with the child variable printed `sk-git → /doctor:git hooks (parent-named only)` and without it `sk-git → /doctor:git hooks (ask)` (T023, T033). Cites: scratch/verification-evidence.txt:17, scratch/verification-evidence.txt:21 | Met | - |
| AC-005 | REQ-005 | Given the three hub routers, When section 4 is read and the hub check runs, Then each holds one handoff bullet and each check exits 0 | `rg -c "has two whole entries"` prints 1 in each `ROUTER.md`, and `parent-skill-check.cjs` exits 0 for `sk-doc`, `sk-design` and `system-deep-loop` Evidence: rerun during closure: `has two whole entries` counts 1 in each of the three `ROUTER.md` files. T032 printed `exit=0` for `sk-doc`, `sk-design` and `system-deep-loop`. Cites: scratch/verification-evidence.txt:19, .skilled/skills/sk-doc/ROUTER.md:434 | Met | - |
| AC-006 | REQ-006 | Given the edited notice and `create.sh`, When the spec gate test runs, Then the pinned notice holds the `/speckit:plan` line and the test reports 0 failed, and the standard next steps name both commands | `(cd $SSK && node --test tests/hooks/spec-gate-core.test.mjs)` prints `fail 0`, `rg -c "speckit:plan" $SSK/hooks/lib/spec-gate/spec-gate-core.mjs` prints 1, and `rg -c "6. Plan the work with /speckit:plan" $SSK/cli/spec/create.sh` prints 1 Evidence: T030 printed `pass 107` and `fail 0`. Rerun during closure: `speckit:plan` counts 1 in `spec-gate-core.mjs` and `6. Plan the work with /speckit:plan` counts 1 in `create.sh`. Cites: scratch/verification-evidence.txt:12, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:178, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2431 | Met | - |
| AC-007 | REQ-007 | Given the hook reference, When the parity test runs, Then the hook index, the adapter table and the enum hold the same 7 runtimes and the reference holds the invocation table. An extra index name is reported | In `ADV`, `npx vitest run tests/hooks/advisor-runtime-list-parity.vitest.ts` reports 2 passed, and `rg -n "^### Starting a surfaced command" .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` prints 1 line Evidence: rerun during closure: the parity test reports 2 passed and the `rg -n` printed one line, `90:### Starting a surfaced command`. Cites: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:90 | Met | - |
| AC-008 | REQ-008 | Given `copilot` removed from `ADVISOR_RUNTIME_VALUES`, When a stored diagnostics or outcome record, a new diagnostic record or `advisor_validate` input carries it, Then both readers skip the stored record without throwing, `serializeAdvisorHookDiagnosticRecord` throws and `AdvisorValidateInputSchema` rejects the input, and the enum holds seven labels | In `ADV`, `npx vitest run tests/legacy/runtime-label-removal.vitest.ts tests/legacy/advisor-observability.vitest.ts` reports 0 failed with 5 cases in the first file, and `rg -c "copilot" lib/advisor-runtime-values.ts` prints nothing Evidence: rerun during closure: `runtime-label-removal.vitest.ts` reports 5 passed, and with the observability test 2 files and 17 passed, 0 failed. `rg -c "copilot"` on the enum file printed nothing, exit 1. Cites: scratch/verification-evidence.txt:13, scratch/verification-evidence.txt:14 | Met | - |
| AC-009 | REQ-009 | Given the whole change, When the advisor suite, the type check and a scoped diff run, Then the suite reports 0 failed, the type check exits 0 and the diff names only planned files | In `ADV`, `npm test` and `npm run typecheck`, then `git -c core.fsmonitor=false diff --stat` against `spec.md` section 3 Evidence: `npm test` reports 173 files passed, 1528 passed, 6 skipped, 0 failed and the type check exits 0 (T031). The scoped diff names only files in `spec.md` section 3. The four compiled-routing activation manifests joined that table through the scope amendment of 2026-11-13, taken under the packet goal's autonomous-decision rule and recorded in `../decision-record.md`. The two test files of phases 005 and 010 landed in their own commit `48c3207a99` and left this diff. Cites: scratch/verification-evidence.txt:16, scratch/verification-evidence.txt:24 | Met | - |

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

The phase is built, verified and closed. AC-001 to AC-009 are `Met` with the evidence above. AC-009 closed after the scope amendment of 2026-11-13 added the four activation manifests to `spec.md` section 3. The refresh was needed because the router bullets made two hubs serve stale routes.
<!-- /ANCHOR:closure -->
