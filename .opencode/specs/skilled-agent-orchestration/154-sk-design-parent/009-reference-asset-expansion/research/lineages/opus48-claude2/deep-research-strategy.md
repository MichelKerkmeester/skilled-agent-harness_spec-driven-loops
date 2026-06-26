# Deep Research Strategy — sk-design reference & asset expansion (lineage opus48-claude2)

## 1. TOPIC

For each of the five sk-design sub-skills (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`), determine the highest-leverage expansions to their `references/` and `assets/`. Ground every recommendation in (1) the prior corpus research and gap-analysis at `154-sk-design-parent/001-corpus-research/research/`, and (2) the 43-entry external corpus at `154-sk-design-parent/external/`. Inspect each mode's current references and assets under `.opencode/skills/sk-design`. Deliverable: a per-mode expansion matrix in `research.md`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 (design-interface): answered iter 1 — vendored base, 0 assets, un-distilled craft corpus; 5 additions (IF-A1/R1/R2 should, IF-R3/R4 nice).
- [x] Q2 (design-foundations): answered iter 2 — data-viz hole (FN-R1), three-dials intake (FN-R2, cross-cutting), brand-seed (FN-R3), token-starter asset (FN-A1).
- [x] Q3 (design-motion): answered iter 3 — emil frequency-decision gate (MO-R1) is the real 08e gap; gesture basics already covered.
- [x] Q4 (design-audit): answered iter 4 — densest; model-tells (AU-R1), remediation (AU-R2), transform verbs (AU-R3), N1/N2, audit-report asset (AU-A1).
- [x] Q5 (design-md-generator): answered iter 5 — most mature; mostly do-NOT; gap-10 forward-authoring out of scope; only MD-A1 nice-to-have.
- [x] Q6 (cross-cutting): answered iter 6 — register.md (XC-1) must-add prerequisite; zero-assets pattern; N1/N2 shared twins (author once).
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Taxonomy and architecture decisions (already settled by 001-corpus-research and the 154 parent).
- Net-new sub-skills (e.g. `design-spec`, `design-interaction`, `design-slides`) — out of scope; only expansions to the FIVE existing modes' references/assets.
- Any implementation of the references or assets themselves — findings only; the build is a separate gated follow-up.
- Re-deriving the gap severities from scratch; the validated gap-analysis table is an authoritative input to build on, not re-litigate.

---

## 5. STOP CONDITIONS
- All five modes plus the cross-cutting question (Q1–Q6) have an evidence-backed per-mode matrix entry: inventory gaps + prioritized additions (type/title/why/sources/effort) + do-NOT-add list.
- New-information ratio falls below threshold after the five modes + cross-cutting pass are documented (expected ~iteration 6).
- Max 10 iterations.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
All six (Q1–Q6) resolved across iterations 1–6. The per-mode expansion matrix, cross-cutting prerequisites (XC-1 register, XC-2 first-asset pattern, XC-3 author-once N1/N2), the family priority ranking, and the eliminated-alternatives table are consolidated in `research.md`.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading each mode's `corpus_map.md` first to learn exactly which corpus entries it already cites — turned "what's missing" into a precise diff. (iters 1–4)
- Grepping live references before recommending (gesture basics in motion, model-tells absent in audit) prevented redundant additions. (iters 3–4)
- Treating the gap-analysis table as authoritative input and grounding/prioritizing it rather than re-deriving severities. (all)
- Holding `register.md` as an explicit cross-cutting prerequisite instead of forcing it into one mode's column. (iter 6)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[Populated after iteration 1]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- gpt-taste Python-RNG randomization in interface — redundant with `variation_diversity.md` (iter 1).
- Splitting foundations into color+layout children — taxonomy decided, out of scope (iter 2).
- Heavy Gestalt/grid reference in foundations — already covered (iter 2).
- Gesture basics into motion — already in `micro_interactions.md` §4 (iter 3).
- Motion-performance review into motion — audit boundary (iter 3).
- Duplicating critique/CWV/a11y in audit — already in `critique_hardening.md` + `accessibility_performance.md` (iter 4).
- Stitch forward-authoring into md-generator — different contract; `design-spec` child; out of scope (iter 5).
- A sixth intake/register child — register is shared content, not a sub-skill (iter 6).
- Duplicating N1/N2 independently in interface + audit — author once, reference twice (iter 6).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Populated after iteration 1]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Converged at iteration 6. Synthesis complete — `research.md` holds the per-mode expansion matrix. No further iterations. Follow-up (separate, gated): build XC-1 `shared/register.md` first, then the audit cluster (AU-R1/R2/A1), authoring N1+N2 once each.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Inputs (read-only) confirmed present
- Corpus research synthesis: `001-corpus-research/research/research.md` (232 lines; settled taxonomy + structural model + per-child corpus-source map).
- Gap-analysis: `001-corpus-research/research/gap-analysis.md` (current-state-validated; 15 confirmed + 3 new N1–N3 gaps; severity table mapped to modes). This is the authoritative gap baseline.
- External corpus: `154-sk-design-parent/external/` — 41 markdown entries + 2 vendored dirs (`apple-bento-grid-main/`, `designer-skills-main/`) = 43 entries.

### Current sk-design inventory (the expansion target) — confirmed via filesystem
- **design-interface** — 13 references, **0 assets**. Vendored from Anthropic `frontend-design` (Apache-2.0); has NO `corpus_map.md`. References: `aesthetics/{README,apple_bento,brutalist,minimalist,soft}`, `design-grounding/{design_inventory,design_references_mcp}`, `design-process/{design_principles,real_ui_loop,ux_quality_reference,variation_diversity}`, `mcp-tooling/{mobbin_tools,refero_tools}`. Draws on NONE of the taste/craft corpus.
- **design-foundations** — 5 references, **0 assets**. `color/{oklch_workflow,palette_theming}`, `type/typography_system`, `layout/layout_responsive`, `corpus_map`. Cites: oklch-skill, colorize, layout, baseline, adapt, designer-skills typography-scale/readable-measure.
- **design-motion** — 5 references, **0 assets**. `motion_strategy`, `micro_interactions`, `animate_presence_patterns`, `performance_reduced_motion`, `corpus_map`. Cites: animate, interaction-design, delight, morphing-icons, 12-principles, mastering-animate-presence, fixing-motion-performance, make-interfaces-feel-better.
- **design-audit** — 5 references, **0 assets**. `audit_contract`, `critique_hardening`, `accessibility_performance`, `anti_patterns_production`, `corpus_map`. Cites: audit, critique, polish, harden, optimize, fixing-accessibility, fixing-motion-performance, clarify, pseudo-elements.
- **design-md-generator** — 8 references + 4 worked DESIGN.md examples (vercel/linear/supabase/stripe) + 2 assets (`cardinal_rules_card`, `design_md_prompt_template`) + `feature_catalog/` + Playwright `backend/`. The MOST mature mode.

### Structural observation
4 of 5 modes have references but **zero `assets/`** — only md-generator ships assets. Asset additions (prompt cards, fill-in templates, checklists, scaffolds) are a near-green-field opportunity for interface/foundations/motion/audit.

### Shared base (parent `sk-design/shared/`)
Present: `anti_slop_principles.md`, `cognitive_laws.md`, `design_token_vocabulary.md`. **Absent: `register.md`** — confirming gap-05 (Brand-vs-Product operating register, the must-add) is genuinely unmet. It is parent-shared, not a per-mode file, but gates audit + interface additions.

### Gap-analysis → mode map (authoritative baseline to build on)
- **interface**: 09 gpt-taste (should), N1 mock-content (should), N2 layout pre-flight gate (should), 12 design-lab loop (nice), 08b bencium (nice). Plus the un-distilled taste corpus.
- **foundations**: 14d data-viz (should), 08t taste three-dials intake (should), N3 brand-seed color (nice), 14g gestalt depth (nice, mostly covered).
- **motion**: 08e emil gesture/interaction (should), 06 overdrive advanced rendering (nice).
- **audit**: 07 model-tells (should), 11 remediation playbook (should), N1 mock-content (should), N2 layout pre-flight gate (should), 16 visual-critique 7-lens (nice), 04 transform verbs (should, audit/interface mode).
- **md-generator**: 10 forward DESIGN.md authoring — but gap-analysis routes this to a NEW `design-spec` child = OUT OF SCOPE here.
- **shared/cross-cutting**: 05 register (must), 04 transform verbs, 07 model-tells.
- **Out of family / out of scope**: 01 slides, 02 canvas, 03 anti-truncation (sk-code), 13 process lifecycle, 15 interaction (new child), 10 spec (new child).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (per-mode expansion matrix)
- Lineage: opus48-claude2; executor cli-claude-code model=claude-opus-4-8; generation 1
- Started: 2026-06-26T18:00:00Z
