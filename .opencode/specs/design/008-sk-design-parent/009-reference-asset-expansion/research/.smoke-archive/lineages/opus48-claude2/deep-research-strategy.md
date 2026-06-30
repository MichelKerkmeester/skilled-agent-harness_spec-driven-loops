# Deep Research Strategy — opus48-claude2 lineage

Fan-out lineage (Claude Opus 4.8) for `009-reference-asset-expansion`. Single-iteration cap (`maxIterations: 1`).

## 2. TOPIC

For each of the five `sk-design` sub-skills (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`), determine the highest-leverage expansions to their `references/` and `assets/`, grounded in (1) the 001 corpus research + gap-analysis and (2) the 43-entry external corpus, honoring an if-effective bar.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which of the 43 external corpus entries are actually cited by the live family, and which are unused?
- [x] Per mode, which existing references/assets are thin, stale, or missing?
- [x] What is the single highest-leverage cross-cutting addition?
- [x] For each mode, where is expansion NOT effective (do-not-add)?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Taxonomy and architecture (already decided in 001/002 — the five modes are fixed).
- Net-new sub-skills (e.g. `design-spec`, `design-interaction`, `design-slides` were considered and NOT built; do not propose them).
- Any implementation of the references/assets — this is a findings-only research phase.
- Out-of-family / out-of-scope corpus (`output-skill`, `canvas-design`, `frontend-slides`, `slidev`, `ui-skills-root`).

---

## 5. STOP CONDITIONS
- `maxIterations: 1` reached → synthesize and stop (this is a fan-out lineage; convergence is evaluated at the merge step, not within the lineage).
- Per-mode matrix produced with cited sources, effort estimates, and do-not-add lists.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Corpus utilization mapped: 21 of 43 entries are distilled/cited; ~12 are deliberately out-of-scope; ~10 high-value entries are un-distilled (impeccable, taste-skill, gpt-tasteskill, emil-design-eng, redesign-skill, bencium, design-lab, bolder/quieter/distill, overdrive, stitch-skill).
- The highest-leverage cross-cutting add is `shared/register.md` (brand-vs-product operating register), a dependency of the transform-verb, model-tells, remediation, and pre-flight adds.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Building a corpus-utilization map by grepping the live `sk-design` tree for `external/` citations, then diffing against the 43-entry corpus directory: it isolated exactly which sources are un-distilled. (iteration 1)
- Reading each mode's `corpus_map.md` first (foundations/motion/audit have one; interface/md-generator do not): the maps state precisely what was distilled and the distillation boundary, so coverage vs gap was unambiguous. (iteration 1)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Bash compound commands with brace-regex/`-m` flags and `cd` tripped the sandbox; switched to single-purpose `grep`/`find` calls and the Read tool. (iteration 1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Net-new sub-skill proposals — BLOCKED (iteration 1)
- What was tried: mapping un-distilled corpus (stitch forward-authoring, designer-skills interaction breadth, slides) to new children.
- Why blocked: out of scope per the spec; the 002 decision built exactly five modes.
- Do NOT retry: propose folds into existing modes' references/assets only.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- md-generator forward-authoring (stitch gap 10): inverts the measured-extraction identity; net-new capability. (iteration 1, evidence: design-md-generator/SKILL.md:14,250)
- Foundations color-strategy commitment axis: already in palette_theming.md §2. (iteration 1, evidence: palette_theming.md:35-47)
- Standalone overdrive motion reference: nice-to-have, high slop-risk. (iteration 1, evidence: gap-analysis.md:30)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Should `shared/register.md` be the literal home, or should interface and audit each carry a register-aware variant? (Recommend shared/ + per-mode consumption; confirm at merge.)
- Does foundations data-viz belong in foundations or stay a quality-floor check in interface's `ux_quality_reference.md §7`? (Recommend foundations for build-side encoding depth.)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Lineage complete (maxIterations reached). Hand the per-mode matrix to the fan-out merge step for cross-lineage convergence.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- 001 corpus research settled taxonomy: five modes exist; `research.md` (architecture) + `gap-analysis.md` (16-gap baseline, re-validated to 15 confirmed + 3 new N1–N3).
- gap-analysis severities: 05 register = must-add (highest leverage, gates 04/07/11/N1/N2); should-adds = 04 transform verbs, 07 model tells, 08e emil motion, 09 gpt-taste, 11 remediation, 14d data-viz, N1 mock-content, N2 layout pre-flight; nice-to-haves = 06 overdrive, 08b bencium, 12 design-lab, 16 visual-critique, N3 brand-seed color.
- `resource-map.md` not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 1
- Convergence threshold: 0.05 (evaluated at merge, not within lineage)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (per-mode expansion matrix)
- Current generation: 1
- Started: 2026-06-26
