# Iteration 004 — swe-04: R20's lint as code, and one skip-line contract across R1, R19 and R20

- **Wave:** W2 (sibling check performed first)
- **Maps to:** RQ1, RQ3. Question 22.
- **Executor:** cli-devin model=swe-2-max (inline, no dispatch)
- **Date:** 2025-12-02

## Focus Area

swe-04 — R20's lexical lint as a program: whether `check-goal.cjs`'s criterion parser is reusable without touching exit codes, the lexical rules as functions with real `path:line` examples, the label-file schema and precision/recall scorer, a single skip-line string table spanning R1/R19/R20, and LOC/tests/placement/rollback.

## Sibling Check

- Read `lineages/mimo/iterations/iteration-002.md` (newest in mimo): the 44-row stratified sample under a referential rubric — strict 79.5% (Wilson 65.5–88.8), lenient 45.5% — and the method-gap finding (1.5% regex / ~28% one-lens / 45.5–79.5% referential are *different failure definitions*). Its scored rows are this iteration's example pool; its N-mimo-02-2 placement (lint prints inside `create-goal-auto.yaml`'s criteria step before `step_check` at :220-221) is adopted.
- Read `lineages/deepseek/iterations/iteration-005.md` and `lineages/grok/iterations/iteration-005.md` (each lineage's cap file): R20 kill lines adopted verbatim — `r20 jev arm not built: labeled_violation_rate<0.05` and `r20 jev arm not built: command was jev verify`; deepseek-05's F2 places R20's print placement under sk-doc's ownership (`create-goal-auto.yaml` is a workflow asset).
- mimo-03 remains unwritten; its state-dir census was filled in swe-03 (5/5 `not_evaluated`).

## Sources Read

- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` whole file: `CHECKS` :44-49, `getAnchorBody` :135-144, `getGoalSections` :162-201, `getCriterionItems` :207-212, `walkGoalFiles` :417-441 (`z_archive`-only skip at :433), `module.exports` :681-689, `require.main` guard :691-699, exit map :659-675 (0 pass / 1 findings / 2 errors)
- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:105-134` — rules 4–5 sit at :121-122 ("three to seven self-contained criteria"; "checkable without opening another file"), rule 8 wires `check-goal.cjs` at :110
- `.skilled/commands/create/assets/create-goal-auto.yaml:209-229` — `step_measure`/`step_check` (:220-221) before `step_6_handoff`
- `002-advisor-jev-tiebreak-arm/spec.md:111-139` — R1's gate/skip/exit-code lines; `003-goal-verifier-jev-shadow/spec.md:121` — R2's `jev arm skipped: <check>`
- mimo-02's scored sample (44 `path:line` rows with rubric verdicts) — quoted below
- BASE R20 + §9 D5 [SOURCE: BASE]

## Findings

### Q1 — Parser reuse: copy three internals; the file itself is safely requireable but exports the wrong layer

`check-goal.cjs` is **not** the R1 trap — `require.main === module` at :691 means `require()` executes nothing. But `module.exports` (:681-689) exports only packet-level runners (`checkGoalPacket`, `scanCorpus`, the four named checks) — none expose criterion text. The criterion extraction chain is internal: `loadPacketContext` (:87-124) → `extractDurableSlice`/`splitFrontmatter`/`LOG_ANCHOR` (imported from `goal-slice.cjs` at :13-18 — **these three are already shared helpers the lint can import directly**) → `getAnchorBody` (:135-144, 10 LOC) → `getGoalSections` (:162-201, 40 LOC) → `getCriterionItems` (:207-212, 6 LOC).

**Design:** the lint imports `extractDurableSlice`/`splitFrontmatter`/`LOG_ANCHOR` from `goal-slice.cjs` and copies `getAnchorBody` + `getGoalSections` + `getCriterionItems` (~60 LOC, with a comment naming the source lines — durable "ported from" note, not a spec-id). Adding the two internals to check-goal's exports would be additive and keep exit codes, but it edits an owned file for private-function exposure and widens its contract surface; the copy is the zero-contact path and stays correct unless the bullet grammar changes — which the lint's own fixtures pin. Exit codes are untouched either way since the lint is a separate file never wired into `CHECKS` (:44-49 is the frozen surface).

**Population-hygiene finding (new):** `walkGoalFiles` (:417-441) skips only `z_archive` (:433). mimo-02's row 38 — a fixture `goal.md` inside `specs/**/review/lineages/deepseek-review-3/scratch/` — enters the real corpus. The lint's walker must additionally skip `**/lineages/**/scratch/**` (and ideally report scratch paths separately), or its violation rate absorbs test debris. This is a defect the checker shares today.

### Q2 — The lexical rules as functions, with real examples

mimo-02's rubric, made mechanical. Both functions take one criterion line and return flagged spans.

**`rule4DanglingRefs(line)`** — flags referring expressions whose antecedent is not in the line:
- Extract `/(?:^|\s)(?:the|this|that|these|those|every|each|all|its|their)\s+([a-z][\w-]*(?:[\s-][a-z][\w-]*){0,2})/gi` candidates.
- A candidate survives (not flagged) iff the head noun is self-naming in the line: appears inside backticks/quotes, is a path (`/\`|\//`), is one of a locality stoplist (`repo`, `packet`, `child`, `line`, `command`, `operator`, `test`… — the rubric's "names a path, command, or the packet itself"), or is immediately followed by `:`/`=`/`of <named>` making it definitional.
- Real positives (pass — resolvable locally): `…/041-skilled-source-root-migration/001-deep-research/goal.md:60` is a *fail*; true passes from the sample: `…/032-recorded-findings-closure/007-links-scan-registry-rule/goal.md:76` ("exact command and exit code"), `…/030-spec-kit-simplification-research/006-retrieval-drift-remediation/goal.md:78` ("named command; 'this child' resolves to the packet"), `…/010-fanout-write-containment-hardening/goal.md:94` ("names its own search term; the check is an rg").
- Real negatives (fail — dangling definite descriptions): `specs/cli-jev/001-cli-jev-creation/004-catalog-and-playbook/goal.md:86` ("the run report" — unnamed artifact), `…/005-churn-cumulative-arm/goal.md:83` ("The threshold" — unnamed), `…/017-completion-gate-and-catalog-alignment/goal.md:78` ("The freshness suite … the malformed_fingerprint class" — neither actor nor proof stated).

**`rule5ExternalFile(line)`** — flags checks whose pass/fail needs another document's content:
- Patterns: `/\bas (?:described|defined|listed|recorded|shown) in\b/i`; `/\b(?:every|each|all)\s+(?:kept|matched|recorded|listed|rewritten|guarded|named|documented)\b/i` (a set enumerated elsewhere); `/\bthe (?:rows?|table|list|mapping|contract|criteria|inventory|inventory)\s+(?:in|of|from)\b/i`; `/\bwhere they\b/i`; `/\b(?:is|are) listed\b/i` without a named artifact.
- Real positives: `…/071-cli-hermes-creation/001-deep-research/goal.md:82` (paths, counts, recorded field named), `…/010-design-md-style-reference/goal.md:88` (the rg half is checkable), `…/019-forced-depth-empty-records/goal.md:82` fails R4 not R5 — outcomes observable.
- Real negatives: `…/059-skill-changelog-retrofit/003-cli-jev/goal.md:61` ("every kept file" — external set), `…/007-cli-package-residue-removal/…/003-layout-probes/goal.md:64` ("pre-probe captures", "every guarded home file"), `…/033-system-speckit-v4/…/003-restore-level-upgrade-and-vocabulary-invariance/goal.md:62` ("the documents that level declares" — a table in another document).

**Honesty constraint (from mimo-02):** these regexes approximate a *referential* rubric; they will under-flag the full class mimo-02 scored (79.5% strict). The lint's miss rate against the label file is itself the reported number — the lint claims precision-first (few false positives), and its per-rule precision/recall against `labels.jsonl` is printed every run. That is what "the base rate is method-dominated" means in code: the lint is one instrument, calibrated against labels, never quoted as the rate.

### Q3 — Label file schema and the scorer

`goal-criteria-labels.jsonl`, one row per sampled criterion line:

```json
{"id":"specs/<track>/<packet>/goal.md:83","text_sha":"…12","rubric":"mimo-02-strict-v1",
 "rule4_ok":false,"rule5_ok":true,"note":"'the threshold' is unnamed","labeler":"mimo-02"}
```

`text_sha` (first 12 of sha256) pins the label to the line's content without storing text — a labeled line stays valid only while the criterion is unedited; the scorer reports `stale` labels separately. Scorer `score-goal-lint.cjs --labels <f> --lint <lint-json>`: joins on `id`, computes per-rule TP/FP/FN/TN, precision, recall, and a Wilson 95% interval on the lint's violation rate; prints `stale=N` rows it skipped. ~80 LOC.

### Q4 — One skip-line contract across R1, R19 and R20

Shared by text (each script owns its copies; no helper package — three consumers is the extraction trigger, per BASE §-three-caller rule):

| Trigger | R1 (`score-jev-tiebreak.mjs`, 002 spec) | R19 census (`score-compaction-recall.mjs`) | R20 lint (`lint-goal-criteria.cjs` + `--jev`) |
|---|---|---|---|
| Flag absent | *no line* — census+baseline unchanged (REQ-001) | *no flag exists* — census never spawns `jev` | *no line* — lexical findings print unchanged |
| `command -v jev` fails | `jev arm skipped: jev not on PATH` (REQ-002) | n/a (no arm yet) | `jev arm skipped: jev not on PATH` |
| version ≠ `jev 0.6.2` | `jev arm refused: expected jev 0.6.2` (REQ-002) | n/a | `jev arm refused: expected jev 0.6.2` |
| `auth status` ≠ 0 | `jev arm skipped: no credential` (REQ-002) | n/a | `jev arm skipped: no credential` |
| call exit 0, key∉submitted / malformed | row `unmeasured` (REQ-010) | n/a | criterion `unmeasured` |
| exit 1 | row `unmeasured` | n/a | criterion `unmeasured` |
| exit 2 | row `unmeasured` + arm stops (`bad invocation`) | n/a | criterion `unmeasured` + arm stops |
| exit 3 mid-run | `jev arm stopped: key rejected`, finished rows `partial` | n/a | same |
| exit 4 / timeout | one backoff retry → `unmeasured` | n/a | one retry → `unmeasured` |
| exit 130 | arm stops `interrupted` | n/a | same |
| unknown record shape | n/a | `unknown record shape: <t> at <file>:<line>`, whole run exits non-zero (swe-02) | n/a |

**Divergence caught by the table:** 003 spec:121 collapses all gate failures into `jev arm skipped: <check>`, while 002 splits `skipped:` (absent binary, no credential) from `refused:` (wrong version). The family's vocabulary should unify on 002's three-line split — `refused` names a *different defect* (wrong package) than `skipped` (absent capability), and mimo-02's `jev arm skipped: <check>` template already matches. One-line amendment to 003 REQ-003.

### Q5 — LOC, tests, placement, rollback

- `lint-goal-criteria.cjs` → `.skilled/skills/sk-doc/sk-create-goal/scripts/` beside `check-goal.cjs` (~200 LOC: goal-slice imports + ~60 parser copies + `rule4DanglingRefs` ~50 + `rule5ExternalFile` ~40 + walker with scratch-skip ~25 + report ~25). Invocation mirrors the checker: `node lint-goal-criteria.cjs <packet> [--all]`, advisory only, exit 0 always.
- Tests `lint-goal-criteria.test.cjs` (~90 LOC, 7 cases): one fixture goal per polarity — R4 fail (dangling "the X"), R4 pass (named command), R5 fail ("every kept file"), R5 pass (paths+count), both-fail, zero-criteria file (no crash, `no_input` line), scratch-path exclusion.
- Placement: advisory print inside `create-goal-auto.yaml` after criteria authoring and before `step_check` (:220-221) — owner conversation with sk-doc per deepseek-05 F2 (it's a workflow asset), not a build dependency; standalone invocation works without it.
- Rollback sentence: "Delete `lint-goal-criteria.cjs`, its test, `goal-criteria-labels.jsonl`, and the one workflow line; `check-goal.cjs` is byte-unchanged and `CHECKS` never grew."

## Ruled Out

- **Adding `getCriterionItems`/`getGoalSections` to check-goal's `module.exports`** — rejected: zero-contact copy keeps the checker's exported surface and tests untouched; two more exports for one consumer is premature (three-caller rule).
- **Wiring the lint into `CHECKS` (:44-49)** — rejected: exit codes 0/1/2 at :659-675 are the frozen conformance contract; an advisory lint must not move `RESULT: PASSED`.
- **Quoting mimo-02's 79.5% as the lint's expected hit rate** — rejected: the regex pair measures a different (smaller) failure class; the lint's own precision/recall against labels is the number that counts.
- **A Jev arm inside the lint's first slice** — per BASE and both siblings: lexical only; the arm exists only past `labeled_violation_rate>=0.05`.
- **Scanning `specs/**` including `review/lineages/**/scratch/`** — rejected after finding mimo-02's row 38: fixture debris belongs to an excluded or separately-counted class.

## New Information

- **check-goal.cjs is safely requireable but exports the wrong layer** — `require.main` guard at :691 kills the R1-style trap; the parser chain is internal, so the design is "import 3 goal-slice helpers + copy ~60 LOC", not "extend exports". [SOURCE: check-goal.cjs:13-18,135-212,681-699]
- **Scratch fixtures enter the real corpus**: `walkGoalFiles` skips only `z_archive` (:433); mimo-02's row 38 proves a `review/lineages/**/scratch/` goal.md is counted — a shared defect the lint must not inherit. [SOURCE: check-goal.cjs:417-441; mimo-02 row 38]
- **The skip-line family has a naming split**: 002's `skipped:`/`refused:` distinction vs 003 REQ-003's uniform `jev arm skipped: <check>` — tabled above with the recommended unify. [SOURCE: 002 spec.md:112; 003 spec.md:121]
- **Label schema pins content, not text** (`text_sha` + `stale` counting) — new, not in any sibling. [SOURCE: this iteration]

## Metrics

- **newInfoRatio:** 0.85 — parser-reuse answer, scratch-corpus defect, skip-line divergence, label schema and the rule functions with real examples are new; placement and kills adopt siblings explicitly.
- **Novelty justification:** converts R20 from a rubric argument into two checkable functions with named real-line examples, and produces the first cross-arm skip-line contract the family has lacked.

## Sibling Outbound

- For mimo: the lint's regexes implement the strict half of its rubric; its label file schema (rubric_version field) is adopted as `rubric` here.
- For deepseek-05's F2: caller list refined — `check-goal.cjs` callers are `SKILL.md:110` + `create-goal-auto.yaml:220-221` (`step_check`) + tests; the lint adds one workflow line, not a fifth check.
