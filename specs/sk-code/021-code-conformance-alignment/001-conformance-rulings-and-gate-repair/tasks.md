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
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown for gate repair and rulings"
    next_safe_action: "Run T001"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
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

- [ ] T001 Confirm every finding against HEAD before any edit. Re-run `node --check .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` and record the result against commit `a83080a83b`. Re-read `run-all-drift-guards.sh:23,47` to confirm SYN-1. Stat both pre-commit files and both post-edit adapters and confirm `.git/hooks/pre-commit` still resolves to `.opencode/scripts/git-hooks/pre-commit` (SYN-2). Grep `check-comment-hygiene.sh` for each claimed vocabulary hole. Recount the test-filename census per pattern. Re-read 020's Non-Goals and Out of Scope. Re-check the frozen directory manifest three children derive work lists from. Strike any finding that no longer reproduces, with evidence — never silently. RB-005-06 is unconfirmed by the synthesis author and must be verified or struck here.
- [ ] T002 Capture the program baseline: run `python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root <R>` for every lane root child 003 will touch, plus the current `.opencode/skills/sk-code` root, and record the output verbatim. Assert a clean packet-scoped `git status` before capture, or the baseline is worthless (`.opencode/bin` · `.opencode/hooks` · `.opencode/plugins` · `.opencode/scripts` · `.opencode/commands/doctor/scripts` · `.github/hooks/scripts` · the lane B and lane C roots named in child 003's plan).
- [ ] T003 [P] Diff the two pre-commit files rule by rule and the two post-edit adapters rule by rule. Produce an inventory of every rule each carries, so retiring one cannot silently drop a rule (`.opencode/scripts/git-hooks/pre-commit`, `.opencode/hooks/git/pre-commit`, `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, `.opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh`).
- [ ] T004 [B] Resolve or escalate the operator decisions this phase depends on: **[OPERATOR-DECISION: Q4 — exact-header automated check]**, **[OPERATOR-DECISION: Q5 — three-guard scan scope]**, **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]**. Blocked until answered; do not guess.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the generic-label semantic boundary into the decision record before touching any matcher: a label is forbidden when it identifies an external artifact, permitted when it names a durable concept. Include the adversarial cases — a durable protocol name containing a numeral, a packet directory name with no numeric prefix, a label inside a string literal, a label inside a URL (`decision-record.md`).
- [ ] T006 Add the failing fixtures first, one positive and one negative per new rule, and record each failing run: the missing feature-catalog rule, the numeric-hyphen phase-path shape, and the bounded generic-label rule (`.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh`).
- [ ] T007 Implement the three rules so each fixture pair goes green, with no new hits on the durable-prose negative fixtures (`.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`).
- [ ] T008 Reconcile the hook pairs to one installed path per lifecycle event, absorbing into the retained file any rule the inventory from T003 shows is uniquely carried by the other. Retire or explicitly document the non-installed file as non-installed.
- [ ] T009 Correct the standard's enforcement pointers so every hook path it names exists and is installed (`.opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:243-244`).
- [ ] T010 Add the parse-integrity regression fixture for the wired post-edit adapter, demonstrated failing against a copy with a syntax error reintroduced. The merge-marker repair itself already landed as `a83080a83b` — do not re-apply it.
- [ ] T011 [P] Amend the test-filename vocabulary table to the repository's real convention — `*.vitest.ts`, `*.test.ts`, `*.test.cjs`, `*.test.mjs`, `*.test.sh`, `test_*.py` — each with its discovery contract, and remove the pattern that matches zero files (`.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md:292-295`).
- [ ] T012 Unify the discovery contract: extend `ROOTS` to include `.opencode/hooks` and recognise the `.test.cjs` form, so one documented convention spans the Node runner and the Vitest configs (`.opencode/scripts/run-node-tests.mjs`).
- [ ] T013 Add the discovery canary: a test asserting the runner's discovered file count equals an independently-globbed count, failing (not warning) on divergence (`.opencode/scripts/run-node-tests.mjs` test surface).
- [ ] T014 [B] Apply the three-guard scan-root change per **[OPERATOR-DECISION: Q5 — three-guard scan scope]**; recommended form is a widened root with `--fail-on-warn` withheld until the sweep lands (`.opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:23,47`).
- [ ] T015 [B] Implement the opt-in exact-header check per **[OPERATOR-DECISION: Q4 — exact-header automated check]**, with the documented exception list for plugins, fixtures, assets and examples derived from the verifier's existing advisory-downgrade behaviour. If Q4 is answered "leave manual", record why instead and notify child 003 that its gate falls back to a scripted per-file header assertion (`.opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py`).
- [ ] T016 Record the six binding rulings with their evidence and their consequence for named children: vendored and generated code out of scope; runtime mirrors limited to authored non-symlink files; benchmark fixture subjects permanently exempt while harnesses stay in scope; test naming amended not migrated; generic labels bounded by the T005 boundary; pattern and example assets are authored code under a manual gate (`decision-record.md`).
- [ ] T017 Record the two-lane worklist doctrine: a mechanical verifier `PASS` never clears a manual gate, so every child carries both a machine work list and a manual work list (`decision-record.md`).
- [ ] T018 [B] Apply the 020 border amendment exactly as specified in the package's `020-amendment.md`, per **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/020-sk-code-opencode-alignment/spec.md`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Test happy path manually: write a scratch file containing a spec-folder pointer in a comment through the Write tool and confirm the post-edit gate reports the violation. A clean pass here is the only proof the gate is live.
- [ ] T020 Test edge cases: run `check-comment-hygiene.test.sh` and confirm every negative fixture stays clean — no durable-prose false positive. Confirm the parse-integrity fixture fails when the adapter is deliberately broken.
- [ ] T021 Run `bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` at the new scan root and record its output as the program baseline that children 002-005 report deltas against.
- [ ] T022 Assert the amended standard is checkable: for each pattern in the amended table, glob it at HEAD and confirm a non-zero match count.
- [ ] T023 Update documentation: reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` and `implementation-summary.md` so no document claims a completion state another contradicts.
- [ ] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record exit 0.
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
