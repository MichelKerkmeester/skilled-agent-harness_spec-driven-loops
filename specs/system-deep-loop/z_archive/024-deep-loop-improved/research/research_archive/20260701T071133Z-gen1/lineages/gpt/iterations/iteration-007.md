# Iteration 7: Preventive Validators And Runtime Hardening

## Focus

Audit code/runtime hardening opportunities beyond known defects: observability, safety, and validators to prevent recurrence.

## Findings

1. The validation system already has level-file enforcement that should catch missing `checklist.md` and `decision-record.md` when a folder declares Level 2/3: `validate.sh` defines the level contract as `Level 2 = +checklist` and `Level 3 = +decision-record` [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:100`-`.opencode/skills/system-spec-kit/scripts/spec/validate.sh:115`], and `check-level-match.sh` builds required files from the level helper and fails missing files [SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh:199`-`.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh:214`]. Recommendation: run recursive strict validation on the entire packet after cleanup and add the result to the parent `implementation-summary.md`/handover; the current drift indicates completion claims were made without the recursive gate being enforced or recorded.

2. There is a placeholder checker, but it only scans bracket placeholder patterns and explicitly ignores checkbox syntax [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh:85`-`.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh:99`; SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh:129`-`.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh:150`]. That will not catch stale generic task rows such as `Create project structure`, `Install dependencies`, or unchecked completion criteria in Complete folders. Recommendation: add a `SCAFFOLD_COMPLETION_DRIFT` validator that fails when `Status: Complete` or `completion_pct: 100` coexists with known template task phrases, `Replace template defaults`, zeroed fingerprints, or unchecked completion criteria.

3. The TypeScript health checker knows phase-parent lean trio rules and required files by level [SOURCE: `.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:53`-`.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:64`; SOURCE: `.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:120`-`.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:135`], but no observed rule reconciles phase-parent map row status against child `graph-metadata.json`/child `spec.md` statuses. Recommendation: add a phase-parent `PHASE_MAP_STATUS_SYNC` rule: parent row `Complete` requires child status Complete, and parent status Complete/In Progress must agree with child aggregate.

4. Continuity freshness parses `completion_pct` and metadata table status [SOURCE: `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:108`-`.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:130`], but the present packet shows many files with `Status: Complete` and `completion_pct: 0`. Recommendation: add a cheap consistency rule before fingerprint freshness: `Status: Complete` implies `completion_pct >= 100` or a documented deferral; `completion_pct: 0` plus Complete is a fail under strict validation.

5. Graph metadata shape validation currently checks only schema-ish fields and last-active-child existence [SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh:50`-`.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh:64`; SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh:83`-`.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh:101`]. It does not validate `key_files` adequacy against a packet's Files-to-Change table or continuity `key_files`. Recommendation: add a non-blocking first, then strict, `KEY_FILES_COVERAGE` rule that compares graph key files with spec scope and continuity key files for phase parents.

6. Deep-review synthesis already has a fan-out merge step and strongest-restriction verdict derivation [SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:1126`-`.opencode/commands/deep/assets/deep_review_auto.yaml:1139`; SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:1158`-`.opencode/commands/deep/assets/deep_review_auto.yaml:1179`], but nothing in the packet documents a required post-remediation re-adjudication pass. Recommendation: add a `review-finding-adjudicate.cjs` or workflow step that reads pre-fix finding registries and the remediation child, then emits per-finding `resolved|still_active|accepted_risk` rows with source evidence before any parent status can claim Complete.

7. Evidence marker lint is specific to `[EVIDENCE: ...]` marker syntax [SOURCE: `.opencode/skills/system-spec-kit/scripts/validation/evidence-marker-lint.ts:93`-`.opencode/skills/system-spec-kit/scripts/validation/evidence-marker-lint.ts:130`]. It does not enforce comment-hygiene on code/YAML comments. Recommendation: add comment-hygiene lint to workflow/code validation for `F-`, `ADR-`, `REQ-`, task IDs, packet IDs, and phase IDs in durable comments, with an allowlist for data/prose artifacts.

## Sources Consulted

- `validate.sh`
- `check-level-match.sh`
- `check-placeholders.sh`
- `spec-doc-health.ts`
- `continuity-freshness.ts`
- `check-graph-metadata-shape.sh`
- `evidence-marker-lint.ts`
- `deep_review_auto.yaml` synthesis section

## Assessment

- newInfoRatio: 0.46
- Novelty justification: This shifted from individual defects to concrete prevention hooks, but most signals derive from prior drift classes.
- Confidence: High that the named validators exist; medium that proposed rules belong in these exact files rather than a new validator registry entry.

## Reflection

- What worked: Reading current validators identified where to add narrow checks instead of broad process advice.
- What failed: The validator registry was not fully traced end-to-end in this iteration.
- Ruled out: Relying on evidence-marker lint to catch YAML finding-id comments; it is scoped to evidence markers, not durable comment hygiene.

## Recommended Next Focus

Convergence check: synthesize findings unless a final gap remains uncovered.
