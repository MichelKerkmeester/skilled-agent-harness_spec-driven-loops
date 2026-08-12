# Iteration 004: Maintainability (D4)

## Focus
Maintainability review of the `sk-create-diagram` packet: documentation duplication, dead-link audit (proper per-file resolution), changelog/benchmark coherence, example-corpus vs current-skin drift, script-level duplication between the two extractors, and the cost of safe follow-on change given the cross-reference drift.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 9 (changelog/v1.0.0.0.md, benchmark/reports/README.md, scripts/README.md, scripts/drawio_extract.py, scripts/mermaid_extract.py, README.md, feature-catalog + references via link audit)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P2, Suggestion
- **F008**: The two IR extractors duplicate substantial logic — `clean_label`, `_has_cycle`, `shape_family`, `analyze`, `digest`, `to_json`, and `main` all appear in both `scripts/drawio_extract.py` and `scripts/mermaid_extract.py`. `.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py` (e.g. lines 217, 596, 640, 759, 859, 919) and `scripts/mermaid_extract.py` (e.g. lines 234, 1054, 1084, 1089, 1177, 1312, 1374).
  - Impact: any fix to one extractor's parsing/rendering logic (e.g. a budget-flag or digest change) must be mirrored in the other by hand; there is a documented "0 committed regression suite" (scripts/README.md), so drift risk is real. Not a correctness bug today — the two parsers are genuinely different grammars — but the shared digest/analysis scaffolding is a candidate for a shared module.
  - Alternative explanation: duplication may be intentional for stdlib-only standalone distribution (each script runnable on its own). Rejected as a blocker to this advisory: both are packet-local, so a shared `_ir_common.py` module does not break standalone execution and would halve the maintenance surface.

- **F009**: Shipped example corpus predates the current style-guide skin and is acknowledged as such in-doc — `style-guide.md:50` ("The pre-baked example HTML files in `assets/` were built under an earlier skin. Regenerating them against the current `style-guide.md` is a v5.1 task.") Combined with F001 (1,357 off-grid coordinates, off-grid font sizes), the 34-example corpus is simultaneously the *reference the skill tells agents to copy* and a *non-compliant artifact*. `.opencode/skills/sk-doc/sk-create-diagram/references/foundations/style-guide.md:50`, `.opencode/skills/sk-doc/sk-create-diagram/assets/examples/example-*.html (34)`.
  - Impact: agents copying examples inherit grid violations and the stale skin; the "single source of truth" claim is undermined until regeneration. This is the maintenance-debt expression of F001 — tracked separately because the remedy (regenerate corpus or explicitly demote examples to illustrative-only) differs from the doc-contract fix.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | style-guide.md:50 vs examples | F009 skin drift |
| checklist_evidence | partial | hard | scripts/README.md test count | 0 regression suite |

## Assessment
- New findings ratio: 1.0 (2 P2, both fully new)
- Dimensions addressed: maintainability
- Novelty justification: link audit (0 dead links with correct per-file resolution), duplicate-logic audit, and skin-drift audit are fresh angles; the dead-link clean result plus the duplication findings complete the picture.

## Ruled Out
- Dead relative links in markdown: PASS — proper per-file resolution found **0 dead links** across the packet (an earlier naive CWD-relative scan was a false positive).
- Changelog vs reality: PASS — changelog's "27 type references with one canonical example each + a small set of special-pattern examples" matches the shipped 27 type refs and 34 examples (27 + specials: oauth×3, quadrant-consultant, loop-terminal, import×2, dp-security-matrix etc.).
- Benchmark README index: PASS — run index matches folders; export-guidance correctly shows SKIP (Playwright blocker), consistent with playbook IMP-003.
- Scripts README honesty: PASS — accurately states 3 code files, 3 CLI entrypoints, 0 regression suites.

## Dead Ends
- [Per-file manual link walk]: the automated per-file resolver covered all markdown; no manual pass needed. (Iteration 4)

## Recommended Next Focus
D4 stabilization pass — re-examine whether the P1 findings (F001, F003, F005) can be consolidated into one root cause (post-reorganization doc/maintenance debt) and confirm no additional severity transitions; prepare for convergence check. If convergence holds (all 4 dims covered, ratios stabilized), proceed to synthesis.

Review verdict: PASS
