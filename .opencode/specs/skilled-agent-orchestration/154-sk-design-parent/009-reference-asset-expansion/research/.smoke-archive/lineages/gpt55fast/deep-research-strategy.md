# Deep Research Strategy - gpt55fast Lineage

## 1. TOPIC
For each of the five current `sk-design` modes, determine the highest-leverage expansions to references and assets, grounded in prior corpus research, current gap analysis, the 43-entry external corpus, and the live `.opencode/skills/sk-design` family.

<!-- ANCHOR:key-questions -->
## 2. KEY QUESTIONS (remaining)
- [x] Which expansion should happen first across modes?
- [x] Which additions belong to each mode as references versus assets?
- [x] Which tempting additions fail the if-effective bar or violate scope?
<!-- /ANCHOR:key-questions -->

## 3. NON-GOALS
- No taxonomy or architecture changes.
- No net-new sub-skills.
- No implementation edits to `.opencode/skills/sk-design`.
- No writes outside this lineage artifact directory.

## 4. STOP CONDITIONS
- Stop after one iteration because `config.maxIterations` is 1.
- Stop after producing `research.md` with inventory gaps, prioritized additions, and do-not-add lists for all five modes.

<!-- ANCHOR:answered-questions -->
## 5. ANSWERED QUESTIONS
- The shared Brand-vs-Product operating register is the prerequisite expansion because it gates transforms, model-specific defect tells, remediation, realistic mock content, and mechanical pre-flight checks.
- `design-audit` receives the most should-add work: detector cards, remediation triage, anti-AI-copy checks, and mechanical pre-flight gates.
- `design-interface`, `design-foundations`, `design-motion`, and `design-md-generator` each need a small number of reusable references/assets, not broad corpus ingestion.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED
- Triangulating `gap-analysis.md` severity against each live mode's resource map kept recommendations in existing homes instead of drifting into new taxonomy.
- Treating assets as reusable cards/templates exposed the highest leverage additions: pre-flight cards, detector cards, prompt templates, and handoff templates.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED
- The initial external corpus glob returned no files; direct directory read confirmed the 43 entries and avoided a false absent-corpus conclusion.
- Memory lookup with the supplied session id failed earlier because it was not a server-managed memory session; direct source reads were used instead.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)
- Broad taxonomy expansion: blocked by user scope and prior architecture decisions.
- Whole-corpus ingestion: too much context for the mode routers and lower leverage than gap-targeted assets.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS
- New `design-spec` or `design-interaction` children: out of scope for this lineage even though the gap analysis identifies them as possible future children.
- Implementation edits to current skills: this lineage is research-only.
- YAML-owned spec writeback or memory save outside the lineage: violates the bound artifact-dir constraint.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 10A. CARRIED-FORWARD OPEN QUESTIONS
- None for this lineage. Implementation approval remains a separate follow-up.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
If implementation is approved later, add shared `register.md` first, then update `design-audit` assets before lower-priority mode refinements.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 11. KNOWN CONTEXT
- Prior architecture research established five core children/modes and the split between interface invention and md-generator extraction.
- Gap analysis is current-state validated and explicitly states add decisions are gated.
- Current live `sk-design` mode packets already have reference bases; only `design-md-generator` currently has assets.
- `resource-map.md` was not present in the target spec folder, so the coverage gate was skipped.

## 12. RESEARCH BOUNDARIES
- Max iterations: 1.
- Convergence threshold: 0.05.
- Per-iteration budget: 12 tool calls, 10 minutes.
- Executor: `cli-opencode` with `openai/gpt-5.5-fast`.
- Started: 2026-06-26T15:25:50Z.
