# Iteration 3: D3 Traceability — Core protocols: spec_code + checklist_evidence

## Focus
Dimension: traceability. Core protocols: spec_code (normative claims vs shipped behavior) and checklist_evidence (completion marks vs evidence). Adjudicate the doc-vs-worktree contradiction: packet docs claim "Planned — no implementation yet" while uncommitted implementations of all four phases exist in the working tree.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 9
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.73

## Findings

### P1, Required
- **F007**: Packet docs are materially stale — "no implementation started" contradicts an uncommitted full-phases implementation in the working tree, `specs/system-speckit/034-spec-template-context-optimizations/implementation-summary.md:54`, [Evidence: implementation-summary.md:54 "No template, validation, or MCP code has been touched" and spec.md:37 "Planned — no implementation yet", while `git status --short` shows uncommitted modifications to ALL surfaces §3 Files to Change lists: memory-search.ts (+103), template-guide.md, validation-rules.md, validator-registry.json, check-ac-coverage.sh (default flipped false→true), all five manifest templates (research.md.tmpl restructured into per-level gates; spec/plan/tasks/impl-summary consolidated 2017 lines removed), plus untracked check-scope-adherence.sh and memory-search-token-budget.vitest.ts. File mtimes (16:41–18:05) post-date the packet docs (14:54). Either the docs are stale or the implementation is uncommitted work in progress — either way the packet's current-state claims are contradicted by observable evidence.]
- **F008**: REQ-004 acceptance "runs by default at warn severity" is not satisfied — the flip enables the advisory scan at INFO severity and the rule never emits a warn status, `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:172`, [Evidence: spec.md:110 REQ-004 acceptance requires "Rule runs by default at warn severity... a known-under-covered packet warns (not errors)". Working tree flips `SPECKIT_AC_COVERAGE:-false` → `:-true` (check-ac-coverage.sh:11) but the rule sets `RULE_STATUS="pass"` unconditionally (only assignment in the file; `grep -c 'RULE_STATUS="warn"'` = 0) and validator-registry.json still declares AC_COVERAGE severity `info`. An under-covered packet therefore logs an advisory message but validate.sh reports pass — the acceptance's "warns (not errors)" observable is unmet.]

### P2, Suggestion
- **F009**: `spec-kit-docs.json` research entry lacks the REQ-001 "level contract" upgrade, `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:124`, [Evidence: the `research/research.md` documents entry exists with template/owner/creationTrigger/absenceBehavior but the documents schema has no level/levelContract key (verified via json key inspection); REQ-001 acceptance requires "a research.md documents entry with level contract + absenceBehavior". The `levels.lazyAddonDocs` list (spec-kit-docs.json:150) already names research/research.md, so the gating contract is partially expressed — but the specific "level contract" field REQ-001 names does not exist, leaving the acceptance unverifiable.]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | implementation-summary.md:54 vs git status; spec.md:110 vs check-ac-coverage.sh:172 | REQ-004 acceptance unmet (no warn emission); current-state claims contradicted by working tree |
| checklist_evidence | pass | hard | checklist.md CHK-001..019 | All unchecked — no false completion marks; protocol passes (nothing claims completion) |

## Assessment
- New findings ratio: 0.73
- Dimensions addressed: traceability
- Novelty justification: F007 is the doc-vs-worktree contradiction (core spec_code fail); F008 is the REQ-004 warn-severity acceptance gap; F009 extends F004 with the concrete current-state of the docs entry. F009 partially overlaps F004 (same schema field) — noted for synthesis dedup (merge into F004).

## Ruled Out
- "Uncommitted changes are unrelated drift": [every changed path is listed in spec §3 Files to Change or is the direct artifact of those requirements (test + rule file)], [git status --short vs spec.md Files to Change]
- "REQ-004 satisfied by default flip alone": [the acceptance requires an observable warn on under-covered packets; the rule never sets warn status], [grep RULE_STATUS]

## Dead Ends
- None.

## Recommended Next Focus
D4 Maintainability — template consolidation quality, doc structure, comment hygiene, and the maintainability claims in plan.md Phase 2 (source shrink vs drift risk).

Review verdict: CONDITIONAL