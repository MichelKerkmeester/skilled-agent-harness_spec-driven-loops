---
title: "Tasks: Activate the doctor helper and agents-md advisor bridges"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor bridge activation tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Activate the doctor helper and agents-md advisor bridges

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Two shell variables keep the verify lines short: `$R` is `.skilled/skills/system-skill-advisor/runtime` and `$D` is `.skilled/commands/doctor/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the starting figures (`specs/agents/021-doctor-agents-md/003-advisor-bridge-activation/spec.md`). Verify: `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` printed `typescriptActive` 29 and `pythonActive` 39, and `node $D/doctor-phrase-reach.cjs` printed `STATUS=OK phrases=142 bridges=24`.
- [x] T002 Read the activation instructions the route manifest's header names (`.skilled/commands/doctor/_routes.yaml`). Verify: step 3 names `scoring-compatibility.json` as the only file that decides whether a derived bridge routes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the four ids to both lanes (`$R/scripts/command-bridges/scoring-compatibility.json`). Verify: `node -e` over the file prints orders 29 to 32 for `command-doctor-helper`, `-agents-md-check`, `-agents-md-embed` and `-agents-md-restore`, and 40 to 43 in the Python lane.
- [x] T004 Regenerate the three derived surfaces (`$R/scripts/command-bridges/command-bridges.generated.json`, `$R/lib/scorer/projection.ts`, `$R/scripts/skill_advisor.py`). Verify: one deriver run reports `"status": "generated"` with three changed paths, and a second reports `"status": "fresh"` with none.
- [x] T005 Add the routing-slice rows (`$R/scripts/routing-accuracy/doctor-prompts.jsonl`). Verify: `node -e` prints 71 rows, 71 unique ids, and the four new waves `B-helper`, `B-agents-md-check`, `B-agents-md-embed` and `B-agents-md-restore`.
- [x] T006 Rebuild the advisor and refresh its graph (`$R`). Verify: `npm --prefix $R run build` exits 0 and `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted` exits 0.
- [x] T007 Bump the skill version and write its changelog (`.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-skill-advisor/changelog/v0.17.30.0.md`). Verify: `rg -n '^version:' .skilled/skills/system-skill-advisor/SKILL.md` prints `0.17.30.0`.
- [x] T008 Correct the catalog note that listed six active bridges (`.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md`). Verify: `rg -n -i 'inactive'` over the catalog and the doctor READMEs prints no claim about these four.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the reach probe (`$D/doctor-phrase-reach.cjs`). Verify: it exits 0 and prints `STATUS=OK phrases=164 bridges=28`, with all 22 rows of the four new bridges at `PASS`.
- [x] T010 Run the routing slice suite (`$R/tests/doctor-routing-slice.vitest.ts`). Verify: `vitest run tests/doctor-routing-slice.vitest.ts` prints 2 passed.
- [x] T011 Hold the accuracy ratchet (`$R/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`). Verify: its `metrics` block equals the committed baseline: full corpus 155 of 195, holdout 49 of 66, ambiguity 19 of 24, unknown 13, gold-none false fires 5, and the three buckets unchanged.
- [x] T012 Run the suites (`.skilled/skills/system-skill-advisor/runtime`, `.skilled/commands/doctor/scripts/tests`). Verify: `npm --prefix $R test` prints 158 files and 1353 passed, `pytest $R/tests/python` prints 8 passed, `bash $D/tests/run-all.sh` prints 931 of 931 over 41 files and `7 suite(s) passed, 0 failed`, and `bash $D/route-validate.sh` exits 0.
- [x] T013 Add the phase row to the parent and validate the packet (`specs/agents/021-doctor-agents-md/spec.md`, `specs/agents/021-doctor-agents-md/003-advisor-bridge-activation`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED` for the parent and every child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `doctor-phrase-reach.cjs` reports 28 bridges over 164 phrases at `STATUS=OK`, and the deriver reports `fresh` at 33 TypeScript and 43 Python entries
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
