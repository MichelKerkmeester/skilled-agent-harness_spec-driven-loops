# Iteration 006 — KQ-R2b: shell-rule spine, F8 re-examination, date-gated validation

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 6 | focus: the F8 keep-row re-examination (new evidence?), the 5:1 canonical-save spine, the level/complexity/AC rule pairs, and the date-gated graduation constants.
Evidence reads: `runtime/cli/rules/check-canonical-save.sh:18-48`, `runtime/cli/rules/check-canonical-save-helper.cjs:13-27,132-212` (switch + constants), `runtime/cli/rules/check-level.sh:3-21`, `check-level-match.sh:3-141`, `check-complexity.sh:3-122`, `check-ac-coverage.sh:6,308`, `check-ac-closure.sh:11,217-255` (run 2). Reads cost: 4 bash calls. No node/validate/git.

## F8 re-examination — NEW EVIDENCE, verdict: the stated keep-reason HOLDS

Round one/census kept the 10-rows-on-2-implementations multiplex because "each row names a distinct failure the report attributes." New evidence read: `check-canonical-save-helper.cjs:134-212` — a `switch(selectedRule)` emits a **rule-specific message per CANONICAL_SAVE_* code** (ROOT_SPEC_REQUIRED: "Live packet root is grandfathered until…"; SOURCE_DOCS_REQUIRED: "Empty derived.source_docs is grandfathered until…"; LINEAGE_REQUIRED: "save_lineage is required for graph writes on or after {cutoff}"; PACKET_IDENTITY_NORMALIZED: distinct text; the fifth beyond the excerpt). The report's failure text is genuinely per-rule. **The round-one/census reason is empirically correct → F8 is NOT re-listed; R2's "collapse" remains a legibility trade (8 fewer rows) the census deliberately declined — confirmed with direct evidence, not assumption.**

Corollary observation (recorded, not a finding): `check-canonical-save.sh:18` defaults `selected_rule` to `CANONICAL_SAVE_ROOT_SPEC_REQUIRED` when `SPECKIT_CANONICAL_SAVE_RULE` is unset — a direct future caller gets silent first-rule attribution (the round-one F1 silent-failure mode). Two call sites exist today (orchestrator env round-trip, tests), so the trap is latent. Label: keep, with a one-line hardening note (fail loud on unset env) IF a third direct call site ever appears.

## Adjacent pairs: distinct, not duplicative (observed-kept)

- `check-level.sh` (LEVEL_DECLARED, info): explicit vs inferred declaration. `check-level-match.sh` (LEVEL_MATCH, error, 254 L): declared-level consistency across docs. `check-complexity.sh` (COMPLEXITY_MATCH, error, 207 L): declared complexity label vs content. Three checks, three different declared fields/degrees — no collapse candidate.
- `check-ac-closure.sh` (AC_CLOSURE, error, 363 L): rows all Met/Waived/Superseded + ADR-cited waivers + cutoff. `check-ac-coverage.sh` (AC_COVERAGE, info, 403 L): requirement coverage. Distinct verdicts (gate vs visibility), consistent with the F6 keep (info rows state, never fail).

## Date-programmed validation (new angle, round one never touched it)

`check-canonical-save-helper.cjs:13-16`: `CANONICAL_SAVE_CUTOFF = '2026-05-01T00:00:00Z'`, `CANONICAL_SAVE_ALLOWLIST_UNTIL = '2026-05-01'`, and `:132` `allowlistActive = ALLOWLIST_UNTIL > new Date().toISOString()`. Same graduation shape as `check-ac-closure.sh`'s creation cutoff (ITERATION 2) and `generated-metadata-integrity.ts`'s grandfather-report mode. Today is 2026-09-07 — **the canonical-save allowlist grace already expired 4 months before this audit**: packets created before 2026-05-01 with missing lineage/source-docs now fail hard rather than being grandfathered, and the ONLY remaining mention of the expiry is the code comment (`:132`) plus the helper's per-rule messages. The docs' grandfather statements (validation-rules.md canonical-save section) may still present the pre-graduation state. Cost: hardcoded dates in code (3 constants + 2 in the closure rule, 2 in the integrity bridge = ~7 date constants in-tree), time-dependent verdicts for identical packets (audit trail: a validation result is not reproducible across the cutoff). Protects: the migration itself (graduation is the documented design). Severity: P2-candidate — but per the three-outcome test the graduation mechanism IS the validated design; the residual is doc-synchronization (whether validation-rules.md states the graduated state) and the distribution of 7 magic dates across 3 files. Recommendation: **keep** (mechanism), with a one-line check: confirm validators' docs describe the post-2026-05-01 state; fold the constants into one shared reference if they must move (they should not need to move often).

## Findings

**No new findings this iteration.** The F8 keep-row was the target of re-examination; its reason holds under direct evidence; the level/complexity/AC pairs are distinct; the date-graduation mechanics are validated design with a doc-sync note. Recorded observations: latent attribution fallback (kept), date-constant distribution (kept + sync note).

## Provisional counts

- Canonical-save helper: 5 switch branches (one per CANONICAL_SAVE_* row) — 5 distinct messages verified.
- Date constants observed: CANONICAL_SAVE_CUTOFF + ALLOWLIST_UNTIL (helper) + AC_CLOSURE cutoff + integrity grandfather mode = 4 sites.
- Adjacent-pair checks examined: 3 pairs (level/level-match/complexity; ac-closure/ac-coverage; frontmatter/integrity/status-cross-doc) — all distinct verdict domains.
