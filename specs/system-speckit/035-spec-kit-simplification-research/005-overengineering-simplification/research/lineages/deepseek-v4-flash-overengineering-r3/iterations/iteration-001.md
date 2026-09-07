# Iteration 001 — KQ-R3a: validator-registry rows 1-12, rule value first half

Session: fanout-deepseek-v4-flash-overengineering-r3-1788784311216-27elid | run 1 | focus: rows 1-12 of `runtime/cli/lib/validator-registry.json` — per row: defect class caught, sibling/template overlap, test-name coverage by rule id. Rule scripts' header comments only (mandate); registry descriptions cited for cross-half rows.

Evidence reads (4 calls): census `research/confirmed-findings.md` (one call, as instructed — no prior-round row re-reported without new evidence), `runtime/cli/lib/validator-registry.json`, header comments of `rules/check-files.sh`, `check-placeholders.sh`, `check-comment-hygiene.sh`, `check-scaffold-never-touched.sh`, `check-status-cross-doc-consistency.sh`, `check-level.sh`, `check-ac-coverage.sh`, `check-ac-closure.sh`, head of `runtime/lib/validation/spec-doc-structure.ts`, `ANCHORS_VALID` implementation site in `runtime/lib/validation/orchestrator.ts`, head of `rules/check-level-match.sh` (row 21 — cross-half evidence for the F3-01 overlap claim), and a test-tree grep of the 12 rule ids. No node/validate/git executed.

## Row-by-row (rows 1-12)

| Row | rule_id | script_path | Defect class (header/registry) | Sibling/template overlap | Test files naming id |
|---|---|---|---|---|---|
| 1 | FILE_EXISTS | rules/check-files.sh | Required spec docs missing for declared level | candidate: LEVEL_MATCH (row 21) — same class per registry descriptions | 9 |
| 2 | PLACEHOLDER_FILLED | rules/check-placeholders.sh | Unfilled placeholders `[YOUR_VALUE_HERE:]` / `[NEEDS_CLARIFICATION:]` | none — header documents mustache exemption + post-edit-hook split | 4 |
| 3 | COMMENT_HYGIENE_MARKER | rules/check-comment-hygiene.sh | Ephemeral finding markers in HTML comments | none — header documents the sk-code dual-lane split (different files, different domain) | 1 |
| 4 | SCAFFOLD_NEVER_TOUCHED | rules/check-scaffold-never-touched.sh | Scaffold-signature markers present while spec.md claims Complete | no (scaffold markers ≠ placeholder markers) | 2 |
| 5 | STATUS_CROSS_DOC_CONSISTENCY | rules/check-status-cross-doc-consistency.sh | spec.md / implementation-summary.md status classify to different buckets | no (sufficiency is a different defect class) | 1 |
| 6 | LEVEL_DECLARED | rules/check-level.sh | Level declared vs inferred (info) | family: level trio — census-kept (F6); not re-reported | 3 |
| 7 | AC_COVERAGE | rules/check-ac-coverage.sh | AC traceability coverage (advisory) | family: AC pair — census-kept (F6); not re-reported | 1 |
| 8 | AC_CLOSURE | rules/check-ac-closure.sh | Closure gate: unmet AC rows / waiver w/o ADR | family: AC pair — distinct defect class (closure vs coverage) | 1 |
| 9 | ANCHORS_VALID | native:orchestrator | Anchor syntax/pairing/order/uniqueness | candidate vs GREP_CONVENTION (row 20, anchor grammar) — judged in iteration 2 | 7 |
| 10 | FRONTMATTER_MEMORY_BLOCK | ts:spec-doc-structure | Canonical `_memory` continuity frontmatter blocks | candidate vs FRONTMATTER_VALID (row 19) — judged in iteration 2 | 2 |
| 11 | MERGE_LEGALITY | ts:spec-doc-structure | Generated merge payloads vs target anchor shape | documented split vs ANCHORS_VALID (authored vs generated) | 2 |
| 12 | SPEC_DOC_SUFFICIENCY | ts:spec-doc-structure | implementation-summary sufficiency after save/write | distinct (status consistency checks classification, not sufficiency) | 1 |

The ts rows 10-12 share one module (`runSpecDocStructureRule`, `runtime/lib/validation/spec-doc-structure.ts`, five rules total incl. rows 13/14) — census F8 already recorded the deliberate decision not to collapse that family; not re-reported.

## Findings

**F3-01 [P2 — overlap candidate across the split] FILE_EXISTS (row 1) and LEVEL_MATCH (row 21) carry the same defect class in the registry itself.**
- Claim side: registry row 1 — `"Validates required spec documents for the declared documentation level"` (validator-registry.json, first entry); registry row 21 — `"Checks required files match the declared documentation level"`. Two rows, one `authored_template`, one `authored_template`; different scripts (`rules/check-files.sh` 106 lines vs `rules/check-level-match.sh` 254 lines, the latter sourcing `utils/template-structure.js`).
- Actual: `check-files.sh` header enumerates "Level 1: spec.md, plan.md, tasks.md; Level 3: Level 2 + decision-record.md" — the same per-level required-doc set a LEVEL_MATCH checker would verify. Header-only evidence cannot prove behavioral duplication; the body check belongs to iteration 2 (row 21 read).
- Severity: P2 (candidate; class-level overlap demonstrated, behavior pending).
- Recommendation: **merge** (after verifying in iteration 2) — or, if the two really differ (existence vs strictness), the registry descriptions must be re-written to name the split, since as written they name the same defect.

**F3-02 [P2 — overlap candidate] FRONTMATTER_MEMORY_BLOCK (row 10, ts) and FRONTMATTER_VALID (row 19, `rules/check-frontmatter.sh`) both validate YAML frontmatter.**
- Claim side: registry row 10 `"Validates canonical _memory continuity frontmatter blocks"`; registry row 19 `"Validates YAML frontmatter structure and required semantic values"`.
- Actual: two validators over the same document zone (frontmatter), one generated (`_memory` block, ts), one authored (script). Whether their scans are disjoint (generated vs authored payloads) or overlapping (both parse the same YAML frontmatter) is unverified — header of check-frontmatter.sh is row 19, iteration 2.
- Severity: P2. Recommendation: **document** the disjointness in both headers, or **merge** if they are not disjoint.

**F3-03 [P2 — stale header comment] `rules/check-files.sh` header's level table omits Level 2 and the closure document.**
- Claim side: header comment lines 9-13 — "Level 1: spec.md, plan.md, tasks.md / Level 3: Level 2 + decision-record.md".
- Actual: the post-011 level contract (census §4, fixed in 011) names acceptance-criteria.md as the L2+ closure doc; a header that enumerates "Level 2" only by reference and never names the closure doc is missing the one document whose presence is the level's distinguishing feature. If the body still validates the new set, the comment is wrong; if the body omits the closure doc, the rule is wrong. Header-only evidence: the claim is about the comment, and it is demonstrably incomplete.
- Severity: P2. Recommendation: **fix** (comment per body, or body per contract).

## Verified correct this iteration

- Every row 1-12 names a distinct defect class at description level except the two candidates above (which are the findings).
- Test coverage: all 12 ids are named by at least one test file under `runtime/cli/tests` or `runtime/tests` (FILE_EXISTS 9, PLACEHOLDER_FILLED 4, COMMENT_HYGIENE_MARKER 1, SCAFFOLD_NEVER_TOUCHED 2, STATUS_CROSS_DOC_CONSISTENCY 1, LEVEL_DECLARED 3, AC_COVERAGE 1, AC_CLOSURE 1, ANCHORS_VALID 7, FRONTMATTER_MEMORY_BLOCK 2, MERGE_LEGALITY 2, SPEC_DOC_SUFFICIENCY 1). No row 1-12 has an overlapping sibling AND no test — the angle's finding criterion fires for no row here.
- PLACEHOLDER_FILLED's header documents its parity with the orchestrator's validatePlaceholders and the post-edit-hook split — the dual implementation is explicit, not silent duplication.
- COMMENT_HYGIENE_MARKER's header documents the sk-code dual-lane split (spec-doc HTML comments vs code comments) — explicit, correct.
- The census rows touching rows 6-8 (F6 kept) and rows 10-14 (F8 kept) were respected; nothing re-reported.

## Open questions

1. Do FILE_EXISTS and LEVEL_MATCH behave identically, and which one has the more complete per-level set (iteration 2 will read row 21's header)?
2. Do FRONTMATTER_MEMORY_BLOCK and FRONTMATTER_VALID scan disjoint payloads (generated vs authored)?
3. Does ANCHORS_VALID overlap GREP_CONVENTION's anchor-grammar scan (iteration 2)?
4. Test files were counted by id string, not by reading the tests: a test may name an id only in a registry-completeness assertion rather than exercise the rule. Not read (budget) — an open question.
