# Iteration 1: D1 Correctness — Requirement logic, acceptance criteria, and gate integrity

## Focus
Dimension: correctness. Scope: spec.md REQ-001..006 acceptance criteria, plan.md phase ordering and quality gates, the packet's own authoritative gate state, and the referenced implementation surfaces as they exist in the working tree.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.72

## Findings

### P1, Required
- **F001**: Byte-identical render gate is RED — golden snapshot suite fails at all four levels, `scaffold-golden-snapshots.vitest.ts:44`, [Evidence: `npx vitest run scripts/tests/scaffold-golden-snapshots.vitest.ts` → 4 failures, "Snapshot `...1-spec.md 1` mismatched" at Levels 1/2/3/3+; spec.md.tmpl carries an 809-line uncommitted diff (`git diff --stat` shows spec.md.tmpl 809 changed lines, plan.md.tmpl 795, tasks.md.tmpl 360, implementation-summary.md.tmpl 439); snapshot file `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` shows no working-tree modification (`git status --short` on scripts/tests is empty). REQ-002 acceptance ("rendered output per level is byte-identical to pre-change") is therefore not satisfied by the current working tree — either the consolidation changed output or the snapshots are stale and uncommitted. Either way the plan's central safety proof (plan.md §4 Phase 2 "Prove") does not pass today.]
- **F002**: The packet fails its own authoritative gate — `validate.sh --strict` on the reviewed folder exits 2 with DESCRIPTION_SHAPE error, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:22`, [Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-speckit/034-spec-template-context-optimizations --strict; echo $?` → exit=2, "! DESCRIPTION_SHAPE: description.json has 1 shape error(s)"; description.json is missing the `level` field (rule check-description-shape.sh requires `level` to be string or number; sibling packet 033's description.json carries `"level": 1`, 034's does not). CHK-019 ("validate.sh --strict clean on this packet") is therefore unmet at review time.]

### P2, Suggestion
- **F003**: Stale line-count constant "944" — spec.md:108 and plan.md:50/73 cite "944 lines" for research.md.tmpl, but the committed template is 946 lines and the working-tree file is 948 (`git show HEAD:...research.md.tmpl | wc -l` = 946; working tree = 948). Directionally the gating claim holds (L1 render now 175 lines), but the constant is drift-prone and the acceptance metric is not pinned to a reproducible measurement command.
- **F004**: REQ-001 acceptance references a "level contract" field that does not exist in the documents schema — spec.md:108 ("`spec-kit-docs.json` gains a `research.md` documents entry with level contract + absenceBehavior"). The documents entries in spec-kit-docs.json carry only `template`, `owner`, `creationTrigger`, `absenceBehavior` (verified programmatically; `research/research.md` entry already exists at spec-kit-docs.json:124). No `level`/`levelContract` key exists in the schema, so the acceptance criterion is not verifiable as written and the requirement's "gains" framing is partially already true.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | validate.sh:22, description.json, spec.md:108 | Normative claims partially verifiable; REQ-002 gate failing, REQ-001 acceptance references nonexistent schema field |
| checklist_evidence | pass | hard | checklist.md CHK-001..019 | All items unchecked (pre-impl) — no false completion marks |

## Assessment
- New findings ratio: 0.72
- Dimensions addressed: correctness
- Novelty justification: F001/F002 are observed command failures (snapshot suite red, validate exit 2); F003/F004 are spec-precision issues. All four are new; none refine prior findings.

## Ruled Out
- Template-consolidation output correctness by manual inspection: [Snapshot mismatch already proves output changed at Level 1/2/3/3+; manual diff inspection of 2,300+ changed template lines would not change the verdict.], [snapshot failure output]
- Claiming REQ-002 satisfied: [byte-identical proof is explicitly the acceptance gate and it is failing], [vitest output]

## Dead Ends
- None — all evidence paths resolved.

## Recommended Next Focus
D2 Security — trust boundaries of the uncommitted changes (scope-adherence rule reading git diff output, AC_COVERAGE escape hatch, memory-search budget drop logic, template renderer input handling).

Review verdict: CONDITIONAL