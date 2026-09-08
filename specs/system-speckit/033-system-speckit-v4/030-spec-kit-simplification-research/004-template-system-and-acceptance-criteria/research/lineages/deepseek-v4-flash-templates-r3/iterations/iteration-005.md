# Iteration 005 — Overlap with sk-doc's templates

- Angle: template directories under `.opencode/skills/sk-doc` that carry spec-kit document templates (searched by file name for spec.md / acceptance-criteria, at most 8 hits), compared against the system-spec-kit template of the same document class.
- Verdict: there is no overlap. The name search returns exactly two files, both test fixtures for sk-doc's own document validator; sk-doc ships no spec-kit-document templates, and the string "Acceptance Criteria" appears nowhere under sk-doc. The two fixtures are the only near-matches, and they diverge from the spec-kit spec template in structure — worth a row only as a documented seam, not a competing template.
- Tool calls: 2 evidence reads + artifact writes.

## Findings (1: 1×P2)

### f-iter005-001 [P2] — sk-doc's spec fixtures model a "Feature Specification" with no anchors or required sections, unlike the spec-kit spec template
- THE CLAIM (fixture side): `.opencode/skills/sk-doc/scripts/tests/valid-spec.md` and `scripts/tests/specs/auto-detect-spec.md` both declare `title: "Feature Specification: …"` and describe themselves as "Minimal valid spec fixture" for `validate_document.py` — a class named exactly like system-spec-kit's central document.
- WHAT THE SPEC-KIT TEMPLATE REQUIRES: `system-spec-kit/templates/core/spec.md.tmpl` scaffolds the full anchored structure (ANCHOR:metadata region, purpose/scope gates, `SPECKIT_TEMPLATE_SOURCE` marker, `SCAFFOLD_VALIDATION_COUNTS` block appended by `create.sh:647-661`), and the manifest's `sectionGates` (`spec-kit-docs.json` levels rows) enforce those anchors.
- COMPARISON: the fixtures are 9-11 lines: frontmatter (title/description/trigger_phrases/importance_tier/contextType) + one H1 + one sentence — no anchors, no sections, no metadata table, no template-source marker.
- CONSEQUENCE: no conflict today (the fixtures are harness inputs for `validate_document.py`, not offered templates, and they are intentionally minimal), but the same-named document class has two incompatible shapes in one repo: the fixture shape is what sk-doc's own validator models as valid; the spec-kit shape is what the packet gates enforce. Any future "document type" routing that uses the fixture as a canonical sample would model the wrong spec.
- SEVERITY: P2 (wrong-in-principle, no current consumer conflict).
- RECOMMENDATION: document — rename the fixtures (or their H1) to mark them as validator harness samples (e.g. "Validator Fixture: Spec-Like Document") and add a comment that the canonical spec shape is system-spec-kit's `spec.md.tmpl`, so the two classes cannot be confused.

## Verified correct on this angle

- No `acceptance-criteria`-named or "Acceptance Criteria"-containing file exists under `.opencode/skills/sk-doc` (file-name search + content grep: 0 hits) — no duplicated acceptance template.
- The full `*.tmpl` / `*template*` / `*templates*` inventory under sk-doc (feature-catalog, command, agent, benchmark, readme, install-guide templates, plus `shared/assets/template-rules.json` and `llmstxt-templates.md`) holds no spec-kit document template; the many templates are sk-doc's own document classes (commands, agents, benchmarks, READMEs).
- The only other document-class overlap candidates (sk-doc's readme/install-guide templates named by hvr-rules.md Section 10) are not spec-kit documents — they sit in `sk-doc/sk-create-readme/assets/` and are owned by that mode; no scope collision with spec-kit templates.
- The search surface consumed 2 of the allowed 8 hits; the remaining 6 were not needed because the universe holds only 2.

## Open questions

1. Whether sk-doc's `validate_document.py --type spec` is ever invoked on system-spec-kit spec folders (if yes, the minimal fixture shape could fail spec-kit packets and vice versa); the validator script was not read within budget.
2. Whether any other skill under `.opencode/skills/` (outside sk-doc) carries a spec-kit document template — outside this angle's scope, listed as a possible follow-up.
