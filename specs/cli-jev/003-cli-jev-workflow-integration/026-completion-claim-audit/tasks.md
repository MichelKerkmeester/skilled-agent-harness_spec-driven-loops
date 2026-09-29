---
title: "Tasks: Phase 26: completion-claim-audit"
description: "Ordered tasks for the completion claim audit: setup and fixtures, the zero-call census with per-word counts and label gate, the Deem and Jev noul arms with their verdicts, the system-spec-kit docs and the gated live runs."
trigger_phrases:
  - "completion claim audit tasks"
  - "score-completion-claims tasks"
  - "completion claim census tasks"
  - "completion claim label gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 26: completion-claim-audit

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

**Task Format**: `T### [P?] Description (file path)`

R below is `.skilled/skills/system-spec-kit/runtime`, S is `R/scripts/completion-claim-audit/score-completion-claims.mjs` and T is `R/tests/completion-claim-audit.vitest.ts`. Vitest commands run from R. F is phase 003's fixture `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the operator released this phase. Parent goal D3, amended by the operator's "Bind and release", released it on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`)
- [ ] T002 Read the owner's contracts: `R/scripts/README.md`, `R/lib/hooks/completion-evidence-sentinel.cjs:55-120` and its exports at `:553-578`, `R/hooks/claude/completion-evidence-stop.cjs` and `R/scripts/compaction-recall/score-compaction-recall.mjs`. Record the `npx vitest run tests/completion-evidence-sentinel.vitest.ts tests/hook-completion-evidence-stop.vitest.ts tests/completion-evidence-pi-extension.vitest.ts` baseline (files, passed, failed) and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route
- [ ] T003 [P] Build synthetic fixtures in `R/tests/completion-claim-audit-fixtures/`: rows with claims inside and outside the tail, one per pattern word, false-fire and missed-claim turns, a labels file across both classes and stub `cli-deem` and `jev` scripts that log one line per call. No real conversation text
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Census: load `detectCompletionClaim` and `COMPLETION_CLAIM_PATTERN` from the sentinel through `createRequire`, run the detector on each row's `raw_text`, record the first pattern word in each fired row's 400-character tail and print `rows:`, `fires:` and one count per word. No row text in any output (S). REQ-002
- [ ] T005 Labels parser and gate: the JSONL shape, `claim` of `yes` or `no` only, unknown ids exit 2 naming the row, the labels file's SHA-256, `stop: fewer than 30 labeled rows` and `stop: fewer than 5 labeled <yes|no> rows` (S). REQ-004
- [ ] T006 Regex errors and zero-call output: false fires and missed claims with their per-word split, the regex's accuracy, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-001, REQ-003
- [ ] T007 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time at 60.5 ms per call (S). REQ-006, REQ-010
- [ ] T008 Deem arm: the fixed `-q` printed verbatim, one `noul` per labeled row with the tail on stdin and closed, 0.5 as the `yes` threshold, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-009, REQ-010
- [ ] T009 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, `--accept-payload` with `jev arm skipped: payload not accepted` and the payload class and token estimate (S). REQ-007, REQ-008
- [ ] T010 Jev arm: one `jev auth test --provider P`, then three `noul` calls per row with no answer cache, the modal call, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-009, REQ-010
- [ ] T011 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, `flips: n/a (commit pair)` for Deem, integer counts and an exact p, the verdict line and `report.json` under `--out`, the requalify lines and `--out` required and outside the repository before any call (S). REQ-005, REQ-010, REQ-011
- [ ] T012 [P] One inventory row and one tree line for S in `R/scripts/README.md`
- [ ] T013 [P] Parent goal D6 docs through sk-doc: one sentence in `SKILL.md`, one line in `README.md`, the next changelog file after `v4.3.0.0.md`, one catalog entry under `feature-catalog/tooling-and-scripts/` with its index row and one playbook scenario under `manual-testing-playbook/tooling-and-scripts/` with its index row (`.skilled/skills/system-spec-kit/`). REQ-013
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Tests: `npx vitest run tests/completion-claim-audit.vitest.ts` exits 0 with at least 16 passed and 0 failed, then the sentinel's three suites fail nothing beyond T002's baseline (T). REQ-012
- [ ] T015 Zero-call census on F with stub binaries first on `PATH`: expect `rows: 50 fires: 4` and `stop: fewer than 30 labeled rows`, both stub logs empty and no 40-character slice of any row's text in stdout. Record the counts in `goal.md`'s log
- [ ] T016 [B] Past the label gate only: one live `--deem --out <dir>` run on the operator's labeled rows. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log. Waits on 30 labels from the operator
- [ ] T017 [B] Only when the operator passes `--jev --accept-payload`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag
- [ ] T018 `git status --porcelain` matches T002's after every census and model run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-008
- [ ] T019 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T012 and T013 changed. REQ-013
- [ ] T020 Cross-family review of S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or the phase closes at its label gate with T016 and T017 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's labels
- [ ] No `[B]` blocked task remains other than those two
- [ ] Manual verification passed: the zero-call census ran on phase 003's fixture with stub binaries first on `PATH`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Research record**: R4 and open question 9 in `../001-deep-research/research/research.md` sections 11 and 12, carried by `../007-classifier-deep-research/research/research.md` sections 12 and 13
<!-- /ANCHOR:cross-refs -->

---
