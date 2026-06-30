# Iteration 043 — Empirical (host-run experiment)

## Focus
The completeness critic (iter-39) flagged that no EMPIRICAL check had been run. This iteration measures section-coverage on the REAL anobel `tokens.json` to test the core thesis: that empty/thin sections are the invention sites.

## Method
Counted backing token data per DESIGN.md section in `output/anobel-com/tokens.json` (+ raw-data.json for interaction captures). Flagged sections with 0 (EMPTY) or <3 (thin) backing items.

## Findings

1. **[P0] Empty sections empirically coincide with the known hallucinations** — `§6 Shadows = 0 tokens`. This is the EXACT section where "gradient-as-depth replaces shadow elevation" was fabricated: 0 shadow tokens + the format-spec's mandatory §6 "named depth principle" = the writer fills the void with invented narrative. The hallucination is not random; it is structurally forced at the empty section.
   - Evidence: tokens.json shadowTokens.length === 0; design_md_format.md §9 requires a named depth principle.
2. **[P0] The focus-consistency fabrication maps to a thin field** — `§9 focusIndicator.style = {}` (1 thin captured). Empty focus style + the default-true `consistent` bug + the §13 "document focus styles" instruction = the fabricated "focus is consistent". Confirmed at the data level.
   - Evidence: a11yTokens.focusIndicator.style === {}; a11y-extract.ts returns consistent:true on empty.
3. **[P0] The one properly-gated section did NOT fabricate** — `§2.5 DarkMode = 0` tokens, and the DESIGN.md correctly OMITTED §2.5 (ABSENT-stamped by the existing dark-mode gate). This is the proof-of-concept: where an absence-gate exists, an empty section produces NO invention. Generalizing this gate to §6/§9/§6.5 is therefore empirically validated, not speculative.
   - Evidence: darkMode.supported === false; DESIGN.md has no §2.5 (validator section-completeness treats 2.5 as conditional).
4. **[P1] Full coverage map (anobel)** — populated: §2 Color(15), §3 Type(11), §4 Components(10 variants), §9 Contrast(29), §10 Breakpoints(16), §11 interaction(34), §12 Icons(535), §17 cssVars(1245), Radii(11), Gradients(6), Motion(4 dur/4 keyframes), Spacing(5). EMPTY: §2.5 DarkMode, §6 Shadows. Thin: §9 focusStyles(1). The rich sections did not fabricate; the empty/thin ones did (or would absent a gate).

## Questions Answered
- Was an empirical check run? Yes — section-coverage measured on real tokens.json.
- Do empty sections empirically coincide with fabrication? Yes — §6 Shadows (gradient-depth) + §9 focus (consistent) are the empty/thin sections, and both fabrications occurred there.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Measure deltaE<10 vs <3 clustering on the same tokens (deferred — needs cluster.ts harness)

## Next Focus
- Verify the highest-risk Track-B fixes (round 3); then synthesize research.md.

## Summary
Empirical section-coverage on the real anobel tokens.json confirms the thesis with measured data: the two known hallucinations occurred at the EMPTY (§6 Shadows) and THIN (§9 focus) sections, while the one section with an existing absence-gate (§2.5 dark mode) produced no invention. The "gate-on-evidence + ABSENT-stamp" recommendation is empirically validated — §2.5's gate is the working proof-of-concept to generalize.
