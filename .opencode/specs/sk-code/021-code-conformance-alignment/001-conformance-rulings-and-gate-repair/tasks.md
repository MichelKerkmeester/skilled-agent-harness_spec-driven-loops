---
title: "Tasks: Conformance Rulings and Gate Repair"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate repair tasks"
  - "conformance rulings tasks"
  - "comment checker fixtures"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/001-conformance-rulings-and-gate-repair"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded completed repairs and left the live smoke and failing gates visibly open"
    next_safe_action: "Verifier to run the live Write smoke and inspect the widened-gate backlog"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Tasks: Conformance Rulings and Gate Repair

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Confirm every finding against HEAD before any edit. Re-run `node --check .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` and record the result against commit `a83080a83b`. Re-read `run-all-drift-guards.sh:23,47` to confirm SYN-1. Stat both pre-commit files and both post-edit adapters and confirm `.git/hooks/pre-commit` still resolves to `.opencode/scripts/git-hooks/pre-commit` (SYN-2). Grep `check-comment-hygiene.sh` for each claimed vocabulary hole. Recount the test-filename census per pattern. Re-read 020's Non-Goals and Out of Scope. Re-check the frozen directory manifest three children derive work lists from. Strike any finding that no longer reproduces, with evidence — never silently. RB-005-06 was verified against the live census. Evidence: implementation-summary.md baseline and census sections.
- [x] T002 Capture the program baseline: run `python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root <R>` for every lane root child 003 will touch, plus the current `.opencode/skills/sk-code` root, and record the output verbatim. Assert a clean packet-scoped `git status` before capture, or the baseline is worthless (`.opencode/bin` · `.opencode/hooks` · `.opencode/plugins` · `.opencode/scripts` · `.opencode/commands/doctor/scripts` · `.github/hooks/scripts` · the lane B and lane C roots named in child 003's plan). Evidence: implementation-summary.md baseline table and packet-scoped clean-status receipt.
- [x] T003 [P] Diff the two pre-commit files rule by rule and the two post-edit adapters rule by rule. Produce an inventory of every rule each carries, so retiring one cannot silently drop a rule (`.opencode/scripts/git-hooks/pre-commit`, `.opencode/hooks/git/pre-commit`, `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, `.opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh`). Evidence: ADR-011 and the pre-edit pair diff receipt in implementation-summary.md.
- [x] T004 Resolve or escalate the operator decisions this phase depends on: **[OPERATOR-DECISION: Q4 — exact-header automated check]**, **[OPERATOR-DECISION: Q5 — three-guard scan scope]**, **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]**. Evidence: decision-record.md:100 ADR-008 through ADR-010.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the generic-label semantic boundary into the decision record before touching any matcher: a label is forbidden when it identifies an external artifact, permitted when it names a durable concept. Include the adversarial cases — a durable protocol name containing a numeral, a packet directory name with no numeric prefix, a label inside a string literal, a label inside a URL (`decision-record.md`). Evidence: ADR-005 and the paired fixture suite.
- [x] T006 Add the failing fixtures first, one positive and one negative per new rule, and record each failing run: the missing feature-catalog rule, the numeric-hyphen phase-path shape, and the bounded generic-label rule (`.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh`). Evidence: pre-change rc 1, four expected positive failures, SHA-256 6291136e850bf7aa58a31e6bb83e30171e189d82a02396cfb24cb7d52688164b.
- [x] T007 Implement the three rules so each fixture pair goes green, with no new hits on the durable-prose negative fixtures (`.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`). Evidence: 21 passes, rc 0, SHA-256 85b8f01d65998ca1dc10e22984b92a3bd4b25fbc88c2887b6025ab3b1d2eef0a.
- [x] T008 Reconcile the hook pairs to one installed path per lifecycle event, absorbing into the retained file any rule the inventory from T003 shows is uniquely carried by the other. Retire or explicitly document the non-installed file as non-installed. Evidence: ADR-011 and 39 passing post-edit integration tests.
- [x] T009 Correct the standard's enforcement pointers so every hook path it names exists and is installed (`.opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:243-244`). Evidence: standard pointer diff and ADR-011.
- [x] T010 Add the parse-integrity regression fixture for the wired post-edit adapter, demonstrated failing against a copy with a syntax error reintroduced. The merge-marker repair itself already landed as `a83080a83b` — do not re-apply it. Evidence: fixture catches an appended `<<<<<<< HEAD` marker and passes, rc 0, SHA-256 0c37f7d8a1ed1568c54494289910e2e59b3ed1ef3268d8de76106cfb3491d816.
- [x] T011 [P] Amend the test-filename vocabulary table to the repository's real convention — `*.vitest.ts`, `*.test.ts`, `*.test.cjs`, `*.test.mjs`, `*.test.sh`, `test_*.py` — each with its discovery contract, and remove the pattern that matches zero files (`.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md:292-295`). Evidence: implementation-summary.md census.
- [x] T012 Unify the discovery contract: extend `ROOTS` to include `.opencode/hooks` and recognise the `.test.cjs` form, so one documented convention spans the Node runner and the Vitest configs (`.opencode/scripts/run-node-tests.mjs`). Evidence: 86-line discovery listing, rc 0, SHA-256 b5bc39c1ea3ef772ebc80a7cbd844d765e38dd79c294bdf3dc1106f1112362bb.
- [x] T013 Add the discovery canary: a test asserting the runner's discovered file count equals an independently-globbed count, failing (not warning) on divergence (`.opencode/scripts/run-node-tests.mjs` test surface). Evidence: `node .opencode/scripts/run-node-tests.mjs --list` rc 0 with the canary active.
- [x] T014 Apply the three-guard scan-root change per **[OPERATOR-DECISION: Q5 — three-guard scan scope]**; recommended form is a widened root with `--fail-on-warn` withheld until the sweep lands (`.opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:23,47`). Evidence: final offline-complete wrapper capture is recorded in implementation-summary.md.
- [x] T015 Implement the opt-in exact-header check per **[OPERATOR-DECISION: Q4 — exact-header automated check]**, with the documented exception list for plugins, fixtures, assets and examples derived from the verifier's existing advisory-downgrade behaviour. If Q4 is answered "leave manual", record why instead and notify child 003 that its gate falls back to a scripted per-file header assertion (`.opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py`). Evidence: doctor-scripts opt-in run, rc 1, seven EXACT-HEADER findings plus one existing warning, SHA-256 0cbf88c506a1f36b895f3d7b616ab60beeb2a555f011ef788d7b95ae011b9971.
- [x] T016 Record the six binding rulings with their evidence and their consequence for named children: vendored and generated code out of scope; runtime mirrors limited to authored non-symlink files; benchmark fixture subjects permanently exempt while harnesses stay in scope; test naming amended not migrated; generic labels bounded by the T005 boundary; pattern and example assets are authored code under a manual gate (`decision-record.md`). Evidence: ADR-001 through ADR-006.
- [x] T017 Record the two-lane worklist doctrine: a mechanical verifier `PASS` never clears a manual gate, so every child carries both a machine work list and a manual work list (`decision-record.md`). Evidence: ADR-007.
- [x] T018 Apply the 020 border amendment per **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** in the current 020 spec (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/020-sk-code-opencode-alignment/spec.md`). No separate `020-amendment.md` exists; the resolved border is recorded directly in 020 and the deviation is documented in ADR-010.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Test happy path manually: write a scratch file containing a spec-folder pointer in a comment through the Write tool and confirm the post-edit gate reports the violation. A clean pass here is the only proof the gate is live.
- [x] T020 Test edge cases: run `check-comment-hygiene.test.sh` and confirm every negative fixture stays clean — no durable-prose false positive. Confirm the parse-integrity fixture fails when the adapter is deliberately broken. Evidence: final fixture receipts in implementation-summary.md.
- [x] T021 Run `bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` at the new scan root and record its output as the program baseline that children 002-005 report deltas against. Evidence: full 497-line capture, direct rc 1, in implementation-summary.md; the gate remains failing on existing findings and offline router-sync.
- [x] T022 Assert the amended standard is checkable: for each pattern in the amended table, glob it at HEAD and confirm a non-zero match count. Evidence: implementation-summary.md:113 final census command and SHA.
- [x] T023 Update documentation: reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` and `implementation-summary.md` so no document claims a completion state another contradicts. Evidence: all child docs now state In Progress and name the remaining live-smoke/gate blockers.
- [x] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record exit 0. Evidence: 51 lines, rc 0, SHA-256 6e705bb66fb13df336c2351267af469e4b98f2fc749ffae0bab063c3820bc501.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Program baseline captured and named, so later children can cite it
- [ ] Every ruling recorded; no child needs to re-litigate scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
