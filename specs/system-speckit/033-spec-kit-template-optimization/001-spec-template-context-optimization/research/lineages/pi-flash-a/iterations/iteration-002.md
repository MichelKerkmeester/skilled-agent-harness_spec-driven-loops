# Iteration 2: Documentation Logic vs Agent Engineering Harness Patterns

## Focus
Map the $1.2M Agent Engineering harness patterns (Default-FAIL, fresh-context evaluator, self-authored handoff, external memory, complexity-matches-task) onto system-speckit documentation logic (Gate 3 classifier, Documentation Levels 1-3+, validate.sh rule set, doc workflow). Priority: machine-checked plan adherence.

## Findings

### F2.1 — Default-FAIL is implemented: completion requires evidence, not claims (already-exists, axis: plan-adherence, surface: doc-logic)
- `AGENTS.md:11` "The Iron Law: NO completion claims without running stack-appropriate verification" — the Default-FAIL contract verbatim.
- `check-evidence.sh:10` (RULE EVIDENCE_CITED, severity warning) rejects evidence-shaped labels for completed P0/P1 items — "only explicit semantic markers count" (`[evidence: ...]`/`[deferred: ...]`); `check-completion.sh` tracks P0_MISSING_EVIDENCE/P1_MISSING_EVIDENCE counters. The harness pattern "every claim has to be proven before the task closes" already ships as a machine rule.
- [SOURCE: AGENTS.md:11], [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh:10], [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:37-44]

### F2.2 — AC-coverage rule (the machine-checked "plan adherence" gate) EXISTS but is disabled-by-default and advisory-only (genuine-gap, axis: plan-adherence, surface: doc-logic)
- `check-ac-coverage.sh` implements requirement→task/checklist coverage: computes coverage denominator, covered count, configured floor (default 0.9), and an infeasibility escape hatch.
- BUT `validation-rules.md:75-79`: "AC_COVERAGE is intentionally registered at INFO severity and stays disabled unless `SPECKIT_AC_COVERAGE=true`... advisory... The `SPECKIT_AC_COVERAGE_ENFORCE` flag is documented as a future promotion switch." So the strongest plan-adherence mechanism in the repo is dormant by design; nothing in `.opencode/` or CI sets the env var (grep: only the rule + docs reference it).
- Concrete fix shape (report-only): promote AC_COVERAGE to default-on warn severity (or set `SPECKIT_AC_COVERAGE=true` in the completion gate), keeping the manual-infeasible escape hatch. This is the single highest-leverage plan-adherence change available — the machinery exists, only the default is off.
- [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:13-16], [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation-rules.md:75-79]

### F2.3 — No machine check that work matches plan scope; SCOPE LOCK is prose-only (genuine-gap, axis: plan-adherence, surface: doc-logic)
- validate.sh runs 36 rules (`scripts/rules/`), including check-files/check-sections/check-anchors/check-level-match, but zero rules compare implemented content against plan.md/tasks.md scope (grep for scope/plan in validate.sh and rules dir: no hits). The framework's SCOPE LOCK (AGENTS.md §1 "Only modify files explicitly in scope") is a prompt-level instruction with no validator counterpart.
- In harness terms: Default-FAIL is enforced for evidence and completion, but "adherence to the declared plan" has no machine gate — a fresh-context evaluator (deep-review) can flag scope drift, but it is not part of the standard completion gate.
- Concrete fix shape (report-only): a `check-scope-adherence.sh` rule (warn severity) that verifies changed-file lists per task row land within plan.md/tasks.md declared paths — analogous to the existing `check-files.sh`/`check-template-staleness.sh` patterns.
- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:742-839], [SOURCE: AGENTS.md:14-15]

### F2.4 — Fresh-context evaluator already exists as deep-review (already-exists, axis: plan-adherence, surface: doc-logic)
- `deep-review/SKILL.md` (§3) is the LEAF read-only evaluator with fresh context that "cannot modify anything... only pass or fail with a reason" — the harness pattern implemented more maturely (P0/P1/P2 severity ratios, convergence).
- [SOURCE: .opencode/skills/system-spec-kit/../system-deep-loop/deep-review/SKILL.md:298]

### F2.5 — Self-authored handoff + external memory already exist (already-exists, axis: general-opt, surface: doc-logic)
- `handover.md.tmpl` (154 lines) is command-owned with `creationTrigger: memory-save` (spec-kit-docs.json); `_memory.continuity` frontmatter in spec.md (seen in this very packet: `implementation-summary.md` carries `_memory.continuity`, ADR-004 allows direct edits) — the "progress file that survives context windows" pattern.
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json (handover.md entry)], [SOURCE: .opencode/skills/system-spec-kit/SKILL.md §Memory Save Rule]

### F2.6 — Complexity-matches-task already exists as a rule (already-exists, axis: general-opt, surface: doc-logic)
- `check-complexity.sh:10-12` (RULE COMPLEXITY_MATCH, severity warn) validates declared level vs actual content — the Agentless "complexity should match the task" lesson, as a validator rule.
- [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh:10-12]

### F2.7 — Gate 3 classifier is a write-boundary classifier, not a token reducer (already-exists w/ scope note, axis: general-opt, surface: doc-logic)
- `gate-3-classifier.ts:838` (`classifyPrompt`) + `applyGate3Satisfaction` (line 652) resolve prebound spec folders and write boundaries for autonomous executors; it is a decision classifier (~887 lines), not a context reducer. Classifying it as "a reducer" would be a category error — its job is routing the Gate 3 question, and it does that.
- [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:838]

## Sources Consulted
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (rule registry, run_all_rules, detect_level)
- `.opencode/skills/system-spec-kit/scripts/rules/` (36 rules: check-evidence, check-ac-coverage, check-complexity, check-completion, check-scope-absent)
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`
- `.opencode/skills/system-spec-kit/references/validation/validation-rules.md`
- `AGENTS.md`, `.opencode/skills/system-deep-loop/deep-review/SKILL.md`
- `grep -rn "SPECKIT_AC_COVERAGE"` (repo-wide enablement scan)

## Assessment
- newInfoRatio: 0.8
- Novelty justification: the disabled-by-default AC_COVERAGE discovery and the absence of any scope-adherence rule are new; harness-pattern already-exists mappings confirm the charter's hypothesis with concrete rule/line evidence.
- Confidence: high — all claims from direct file reads; F2.2 promotion impact is estimated.

## Reflection
- Worked: grepping the env-var enablement across the repo turned a "rule exists" claim into "rule exists but is dead code by default" — the difference between already-exists and genuine-gap.
- Ruled-out: adding a new fresh-context evaluator to speckit (deep-review already owns it); re-architecting Gate 3 (it is a classifier by contract).
- Failed: none.

## Recommended Next Focus
Iteration 3: context/memory system — memory_context/memory_search retrieval path, token-budget/dedup/synthesis-input reducer presence; verify deep-loop reducer prior art (findings-registry dedup, contradiction-supersession) so template/doc-logic findings are classified against what actually ships.
