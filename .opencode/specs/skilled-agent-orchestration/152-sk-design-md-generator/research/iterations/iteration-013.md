# Iteration 013 — Track C (deepseek)

## Focus
Remaining context levers (observed/recommended boundary, cardinal-rules pre-write gate, AP-29 at VALIDATE, fidelity-audit intent, sentinels, ABSENT-stamp)

## Findings
1. **[P0] C4: Motion fallback blurs OBSERVED vs RECOMMENDED** — design_md_format.md §10 provides a fallback for when no motion data exists: 'When implementing, consider adding subtle transitions (150ms ease for hover states, 300ms for reveals) to prevent visual jarring.' This models INVENTION as acceptable output—the writer fabricates design advice (150ms, 300ms) that was never observed. The prose intermixes one factual observation ('No transitions or animations were detected') with unsolicited recommendation, erasing the boundary between extracted ground-truth and invented advice. This is the template-level root cause of interpretive fabrication.
   - Recommendation: In design_md_format.md §10 lines 586-592, replace the blended fallback prose with hard-labeled blocks:

```
## 6.5. Motion System

**OBSERVED:** No transitions, animations, or motion tokens were detected in the extraction data. The site relies on instant state changes.

**RECOMMENDED:** When implementing, respect `prefers-reduced-motion`. If motion is later added, a starting point is 150ms ease for hover feedback and 200-300ms ease-out for reveals/reveals—but these values were NOT measured from the source and must be validated against design intent.
```

The OBSERVED: prefix gates factual claims; the RECOMMENDED: prefix gates invented advice. The prompt template (§2) must also mandate that all RECOMMENDED blocks carry a disclaimer: 'NOT measured from source.'
   - Evidence: tool/resources/design_md_format.md:§10 (lines 586-592), assets/design_md_prompt_template.md:§2 (lines 40-53)
2. **[P1] C5: cardinal_rules_card not a pre-write gate** — cardinal_rules_card.md is documented as 'a pre-validate self-check' (SKILL.md:§5 line 341) but is ABSENT from the §2 Resource Loading Levels table (lines 99-107). It is not loaded under ALWAYS, EXTRACT_WRITE, VALIDATE, or any conditional tier. The prompt template (§2 lines 34-57) inlines six cardinal rules manually rather than referencing the authoritative document. This means the cardinal rules are duplicated (and can drift) between the card, the prompt template, and SKILL.md §3. The card is a post-hoc audit tool when it should be a pre-write constraint injected into the generation prompt.
   - Recommendation: Three coordinated edits:
1. SKILL.md §2 Resource Loading Levels table (line 103): add `assets/cardinal_rules_card.md` to the ALWAYS row (alongside design_md_format.md and writing_style_guide.md).
2. SKILL.md §2 RESOURCE_MAP (line 132): add `assets/cardinal_rules_card.md` to EXTRACT_WRITE array.
3. design_md_prompt_template.md §2 (line 39, before 'CARDINAL RULES'): insert: `Read assets/cardinal_rules_card.md—the authoritative fidelity contract. Every rule in that document is non-negotiable and takes precedence over any inline summary.` Then reduce the inline rules to a 1-line summary referencing the card.
   - Evidence: SKILL.md:§2 (lines 99-107, 132-134), SKILL.md:§5 (line 341), assets/design_md_prompt_template.md:§2 (lines 40-53), assets/cardinal_rules_card.md:§2 (lines 31-44)
3. **[P1] C6: validate.ts is blind to prose anti-patterns at VALIDATE** — Contrary to the angle's premise, anti_patterns.md IS listed in the VALIDATE resource-loading row (SKILL.md §2 line 105) and in the RESOURCE_MAP VALIDATE array (line 135). However, validate.ts (lines 287-310, checkContent) only checks: typography table presence, and color count >= 8. It performs ZERO prose-quality checks. None of the 28 anti-patterns—including AP-02 (Generic Description/banned words), AP-08 (Meaningless Don'ts), AP-13 (Key Characteristics Without Values), AP-25 (Unnamed Principles), AP-26 (Convention Assumption)—are detected. Even if anti_patterns.md is loaded into the agent's context, the automated validator cannot flag interpretive fabrication. The prospective AP-29 (Interpretive Fabrication: fabricating recommendations when evidence is absent, e.g., 'consider adding 150ms ease') would be equally undetectable.
   - Recommendation: Three coordinated edits:
1. anti_patterns.md: add AP-29 after line 721 (before §2 Summary Checklist):

### AP-29: Interpretive Fabrication
**Description:** Inventing design advice, recommendations, or rationale that was not observed in the extracted data—most commonly in fallback prose when data is absent. **Bad:** 'When implementing, consider adding subtle transitions (150ms ease for hover states).' **Why:** The 150ms was fabricated; no motion data existed. This reads as design authority when it is pure invention. **Correct:** 'OBSERVED: No motion data detected. RECOMMENDED: [only if explicitly solicited, with NOT MEASURED disclaimer].' **Detection:** Flag any sentence containing 'consider adding', 'we recommend', 'should use', 'try using' in sections where the corresponding tokens.json data is empty or absent.

2. validate.ts: add checkProseFidelity() function that: greps for banned adjectives (AP-02 list from writing_style_guide.md), flags recommendation-like prose in empty-data sections (AP-29), and checks for named-principle presence (AP-25). Wire as a warning-level check (not hard-fail, since LLM-based detection is heuristic).

3. SKILL.md §2: confirm anti_patterns.md VALIDATE entry (already present at line 105/135—document this as confirmed).
   - Evidence: SKILL.md:§2 (lines 99-107, 132-139), tool/scripts/validate.ts:287-310 (checkContent), tool/resources/anti_patterns.md:§1 (lines 23-755), tool/resources/design_md_format.md:§10 (lines 586-592)
4. **[P1] C7: No first-class fidelity-audit intent** — The smart router (§2) has four intents: EXTRACT_WRITE, VALIDATE, REPORT, STUDY. VALIDATE checks hex accuracy and section structure—purely structural checks. There is no intent that audits PROSE fidelity: whether descriptive claims ('whispered authority', 'chromatic depth', 'gallery emptiness') are grounded in observed evidence or fabricated. A fidelity-audit intent would load prose-checking resources (writing_style_guide.md for banned words, anti_patterns.md for fabrication patterns, cardinal_rules_card.md for the verbatim-value contract) without requiring re-extraction. This is distinct from generic VALIDATE because it inspects narrative claims, not structural conformance.
   - Recommendation: Three coordinated edits in SKILL.md §2:
1. INTENT_MODEL (after line 129): add
```python
"FIDELITY_AUDIT": {"keywords": [("fidelity", 4), ("audit", 4), ("prose check", 4), ("claim verification", 4), ("fabrication", 4), ("anti-pattern", 3), ("deep audit", 4)]},
```
2. RESOURCE_MAP (after line 139): add
```python
"FIDELITY_AUDIT": ["tool/resources/design_md_format.md", "tool/resources/writing_style_guide.md", "tool/resources/anti_patterns.md", "assets/cardinal_rules_card.md"],
```
3. Resource Loading Levels table (after line 107): add row:
`| CONDITIONAL | FIDELITY_AUDIT intent | tool/resources/writing_style_guide.md, tool/resources/anti_patterns.md, assets/cardinal_rules_card.md |`
   - Evidence: SKILL.md:§2 (lines 99-139), tool/scripts/validate.ts:241-310, tool/resources/writing_style_guide.md:§2 (lines 39-41)
5. **[P2] C8: No source-traceable sentinels** — Neither the prompt template nor validate.ts implements per-claim source traceability. The claims.json sidecar from prior iterations provided external traceability, but inline source sentinels (e.g., `<!-- src: tokens.colorTokens[3].hex -->`) would make individual claims auditable within the document and survive transport (copy-paste, export). The existing `stripHtmlComments` function (validate.ts:51-53) already strips `<!-- ... -->` blocks, so HTML-comment sentinels can be stripped before delivery trivially. Inline sentinels are preferable to a claims.json sidecar because: (a) the document remains self-contained and portable, (b) sentinels survive copy-paste of individual sections, (c) no separate sidecar file to lose or desync.
   - Recommendation: Two coordinated edits:
1. design_md_prompt_template.md §2 CARDINAL RULES: add rule 7 after line 52:
`7. Every non-obvious value claim must include a strippable source sentinel as an HTML comment on the same line or the line immediately following: <!-- src: tokens.colorTokens[3].hex -->, <!-- src: tokens.fontInfo.fontFaces[0].family -->, <!-- src: tokens.motion.durations[0].value -->. These are stripped before final delivery via stripHtmlComments.`

2. validate.ts: add `checkSourceSentinels(md, tokens)` that verifies every hex value in the document has a `<!-- src:` sentinel within ±3 lines. Flag hex values without sentinels as warnings (not hard-fail during transition). Reuse stripHtmlComments for delivery stripping (already implemented at line 51-53). Prefer inline sentinels over claims.json sidecar for portability.
   - Evidence: assets/design_md_prompt_template.md:§2 (lines 40-57), tool/scripts/validate.ts:51-53 (stripHtmlComments), tool/scripts/validate.ts:57-93 (checkPhantomColors)
6. **[P1] C12: checkSectionCompleteness is header-only, not data-driven** — checkSectionCompleteness (validate.ts:241-285) is a pure string-match check: it searches for section headers like `## 6.5. Motion System` and fails if absent. It does not consult tokens.json. This means: (a) a DESIGN.md whose §6.5 contains only the fabrication-prone fallback prose ('consider adding 150ms ease...') passes validation, (b) sections where evidence genuinely does not exist (no motion, no icons, no dark mode) are still REQUIRED to have a header and some content—incentivizing the writer to fabricate filler. The format spec column says 'Required: yes' but provides fallback prose that models invention. The angular proposes: 'Required when evidence exists, else stamped ABSENT'—sections become data-driven conditional requirements.
   - Recommendation: Three coordinated edits:
1. validate.ts checkSectionCompleteness (line 241): change signature to `checkSectionCompleteness(md: string, tokens?: DesignTokens)`. When tokens is provided, make section requirements data-driven:
- §2.5 Dark Mode: required only when `tokens.darkMode?.supported === true`
- §6.5 Motion System: required only when `tokens.motion?.durations?.length > 0`
- §12 Iconography: required only when `tokens.iconography?.detected === true`
When evidence is absent and the section IS present, check that it uses the standardized ABSENT stamp format: `## X. SectionName [ABSENT — no data detected]` (not fabrication-prone fallback prose).

2. design_md_format.md §1 table (line 37): change §6.5 Motion System from 'Required: yes' to 'Required: conditional (data-driven)'. Change §12 Iconography from 'yes' to 'conditional (data-driven)'. Change §2.5 Dark Mode from 'conditional (darkMode.supported)' to 'conditional (data-driven, darkMode.supported)'.

3. design_md_format.md §10 (line 589-592): replace the fabrication-prone fallback prose with:
```
## 6.5. Motion System [ABSENT — no motion data detected]

The extraction captured no transitions, animations, or motion tokens. The site relies on instant state changes. No recommendations are provided—motion design choices should be made by a designer with access to interaction prototypes, not inferred from a static extraction.
```
This removes the invention incentive and makes the ABSENT stamp a first-class concept.
   - Evidence: tool/scripts/validate.ts:241-285 (checkSectionCompleteness), tool/resources/design_md_format.md:§1 (lines 27-48 table), tool/resources/design_md_format.md:§10 (lines 586-592)

## Questions Answered
- Where does the observed-vs-recommended boundary blur? design_md_format.md §10 Motion fallback prose—the sole template-level source of fabricated design advice.
- Should cardinal_rules_card.md constrain generation? Yes—it must be added to ALWAYS resource load level and injected into the prompt template as a pre-write gate, not kept as post-hoc audit.
- Is anti_patterns.md actually absent at VALIDATE? No—the SKILL.md §2 table includes it at line 105. The real gap is validate.ts being structurally blind to all 28 anti-patterns.
- What distinguishes fidelity-audit from VALIDATE? Fidelity-audit checks prose claims against observed evidence; VALIDATE checks structural conformance (hex accuracy, section presence). They are complementary passes.
- Inline sentinels vs claims.json sidecar? Inline sentinels win on portability, survival through copy-paste, and no desync risk. stripHtmlComments already handles stripping.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Implement AP-29 and the prose-fidelity check function (checkProseFidelity) in validate.ts—specific regex patterns for banned adjectives, recommendation-without-disclaimer detection, named-principle presence.
- Wire data-driven section requirements into checkSectionCompleteness—requires tokens.json schema inspection to confirm motion/iconography/darkMode field paths.
- Add sentinel generation to the prompt template and sentinel validation to validate.ts—define the exact `<!-- src: ... -->` format and proximity tolerance.
- Implement fidelity-audit.ts as a standalone validator script (or as a --prose flag on validate.ts) that runs the anti-pattern checks validate.ts currently cannot.
- Test the OBSERVED/RECOMMENDED boundary through the full pipeline: extract → write with new template → validate with new data-driven checks—confirm no fabricated values survive.

## Next Focus
- Implement AP-29 and the prose-fidelity check function (checkProseFidelity) in validate.ts—specific regex patterns for banned adjectives, recommendation-without-disclaimer detection, named-principle presence.
- Wire data-driven section requirements into checkSectionCompleteness—requires tokens.json schema inspection to confirm motion/iconography/darkMode field paths.
- Add sentinel generation to the prompt template and sentinel validation to validate.ts—define the exact `<!-- src: ... -->` format and proximity tolerance.
- Implement fidelity-audit.ts as a standalone validator script (or as a --prose flag on validate.ts) that runs the anti-pattern checks validate.ts currently cannot.
- Test the OBSERVED/RECOMMENDED boundary through the full pipeline: extract → write with new template → validate with new data-driven checks—confirm no fabricated values survive.

## Summary
Six context-layer levers identified across the remaining track. P0: the Motion fallback prose in design_md_format.md §10 is the template-level root cause of interpretive fabrication—it models invention as acceptable output. P1 gaps: cardinal_rules_card.md is not a pre-write gate (missing from the resource-loading table), validate.ts is structurally blind to all 28 anti-patterns (despite anti_patterns.md being loaded at VALIDATE), no fidelity-audit intent exists in the smart router, and checkSectionCompleteness is a header-only string match that incentivizes fabrication when evidence is absent. P2: no source-traceable sentinels exist, though stripHtmlComments already handles the stripping path. The prescription is: hard OBSERVED/RECOMMENDED labels in the format spec, inject cardinal_rules_card as a pre-write gate, add AP-29+prose checks to the validator, create a fidelity-audit intent, add inline sentinels, and make section requirements data-driven.
