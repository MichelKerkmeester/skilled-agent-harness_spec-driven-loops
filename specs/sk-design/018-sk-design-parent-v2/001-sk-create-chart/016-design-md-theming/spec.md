---
title: "Feature Specification: DESIGN.md theming"
description: "Let the chart corpus take its colours, typeface and corner ladder from any v3 Style Reference DESIGN.md that sk-design-md-generator produced, on request, through one script that derives a gated palette, writes themed copies of the chosen forms and refuses a palette that fails the corpus gates."
trigger_phrases:
  - "chart from design md"
  - "theme charts from style reference"
  - "match the site's chart colours"
  - "apply design md to chart"
  - "design-md colour system"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: DESIGN.md theming

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-design-md-generator` measures a live site into a v3 Style Reference, a `DESIGN.md` whose colour table, typography section and radius table hold every value verbatim. `sk-design-chart` cannot use any of it. Its 26 forms carry one of three stock colour systems whose values must equal `assets/color/palettes.json` byte for byte, its typeface is a hard-coded system stack, and its corner ladder is fixed. A reader who asks for a chart in the style of a measured site gets a hand edit of a palette block, with no gate proving the borrowed colours still read on their ground.

### Purpose
Give the corpus one request-time path from a `DESIGN.md` to themed chart files: a script that reads the Style Reference, derives a chart palette in the corpus' role vocabulary, proves it against the same numeric gates the stock systems clear, and writes themed copies of the requested forms with provenance the checker can verify. The stock corpus does not change; a themed copy is a delivery, and it passes the checker as one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. **A derivation script, `scripts/apply-design-md.cjs`.** Input: a `DESIGN.md` path, optionally the sibling `tokens.json`, a list of forms or `--all`, an output directory, and `--scheme light`, `dark` or `both`. It parses the `## Tokens — Colors` table (Name, Value, Token, Role), the primary typeface and its substitute stack under `## Tokens — Typography`, and the `### Border Radius` table, exactly as `sk-design-md-generator/references/design-md-format.md` specifies them.
2. **Role mapping.** Surface is the lightest background-role colour; ink the darkest neutral text-role colour; muted the neutral text tone below the ink nearest the text gate, darkened by the least amount that clears it when it sits just under, or the ink let out toward the surface when the table has no second neutral tone; rule is ink at the stock alpha. Series one to four are the chromatic tokens that clear the mark gate on the derived surface, taken verbatim and ordered greedily by hue distance from the hues already chosen; when fewer than four clear, the table's neutral text tones fill the rest darkest first with the ink held back until last. Emphasis is the most saturated remaining accent that clears the mark gate and the emphasis floor against series one, or the ink when every clearing hue is spent, as the stock categorical system does. When the `DESIGN.md` declares a dark theme or `tokens.json` carries `darkMode`, the dark ground is derived the same way from those values; otherwise the stock dark chrome is kept and the series are re-derived against it. Every mapping decision is printed with the token name and the ratio measured, and a darkened muted says so on its line. (Amended during verification: the first build darkened series and emphasis colours toward ink to clear a gate, which put values in the provenance block that the Style Reference never held; series and emphasis are now measured or nothing, and muted is the one role that may leave the table.)
3. **Gate before write.** The script computes the corpus gates from `palettes.json` on the derived palette and refuses to write when one fails, naming role, ratio, gate and the nearest table colour that would clear it; there is no override flag. The gates are the ones the stock checker applies to a neutral or categorical system: the text gate on ink and muted, the mark gate on every series and on emphasis, and the emphasis floor against series one. The ramp step and end gates belong to a magnitude ramp, which a colour table does not supply, so ordered forms (`bullet`, `calendar-grid`, `heat-matrix`, `progress-single`) are never themed: naming one is refused and `--all` skips it with a note. When a request names no reference, `--default` themes from the `cursor` bundle in the style library. (Amended during verification: the first build applied the ramp gates to every themed block and required four chromatic colours regardless of the forms requested.)
4. **Themed output.** Each chosen form is copied with its palette blocks rewritten as `system=design-md`, the `chart-color-system` meta set to `design-md` so the checker can still hold the tag and the blocks to one another, a provenance comment carrying the `DESIGN.md` path, its SHA-256 and the generator's version, the body and mono font stacks set from the typeface section with the substitute stack preserved, and the corner ladder mapped from the radius table (nearest measured value per rung, never above the stock rung's role). `CHART_DATA`, `READOUT`, `CURVE`, geometry and everything else stay byte-identical.
5. **Checker acceptance.** `check-corpus.cjs` learns the `design-md` system: for such a block the source-equality comparison is replaced by a provenance check (comment present, hash well-formed) and the same numeric gates are computed on the inline values in both themes. Every other family runs unchanged. A new `--extra <dir>` option lets the checker scan a themed output directory with the file-level families so a delivery can be proved outside the package.
6. **One proof delivery.** `assets/examples/` gains one form themed from the bundled stripe example Style Reference under `sk-design-md-generator/references/examples/stripe/`, produced by the script, so the corpus itself carries a passing `design-md` block.
7. **Routing and references.** `SKILL.md` gains the activation trigger and the routing branch for a request that names a `DESIGN.md`, a style reference or a measured site's look; `references/design-md-theming.md` states the mapping rules, the gates and the refusal behaviour; `template-contract.md` and `color-system.md` record the fourth system and its provenance rule; the boundary sentence that sends style references away is rewritten to send the extraction away and keep the application here.

### Out of Scope

- Extracting anything from a site: that stays `sk-design-md-generator`'s job, and the script never fetches.
- Changing any stock palette value, gate or the three stock systems.
- Theming the corpus in place; the output is always a copy in the caller's directory or a delivery.
- Reading a `DESIGN.md` that is not v3: the script says which section it failed to find and stops.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` | Create | Parse, derive, gate, write |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | `design-md` system acceptance with inline gates; `--extra <dir>` |
| `.opencode/skills/sk-design/sk-design-chart/scripts/README.md` | Modify | The new script and option documented |
| `.opencode/skills/sk-design/sk-design-chart/assets/examples/<form>-stripe-style.html` | Create | Proof delivery from the stripe example |
| `.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md` | Create | Mapping rules, gates, refusal, provenance |
| `.opencode/skills/sk-design/sk-design-chart/references/{template-contract,color-system}.md`, `SKILL.md`, `README.md` | Modify | Fourth system, routing branch, boundary sentence, version bump |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v1.4.0.0.md` | Create | The bump |
| `.opencode/skills/sk-design/sk-design-chart/scripts/tests/apply-design-md.test.cjs` | Create | Parser, mapping and refusal cases on fixture Style References |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `apply-design-md.cjs` parses the colour table, typography section and radius table of a v3 `DESIGN.md` per `design-md-format.md`, and reports the section name when one is missing |
| REQ-002 | The derived palette fills every chrome role, four series and emphasis for the light ground and the dark ground, and each mapping is printed with the token chosen and the ratio measured |
| REQ-003 | The script refuses to write any file when a derived value fails a corpus gate, naming role, ratio, gate and the nearest clearing colour; there is no override flag |
| REQ-004 | A themed copy differs from its source form only in the two palette blocks, the provenance comment, the font stacks and the corner ladder; `CHART_DATA`, `READOUT`, `CURVE` and geometry are byte-identical |
| REQ-005 | `check-corpus.cjs` accepts `system=design-md` blocks by provenance plus inline numeric gates in both themes, runs every other family unchanged on them, and gains `--extra <dir>` for themed output outside the package |
| REQ-006 | One delivery themed from the bundled stripe Style Reference lives under `assets/examples/` and the full corpus prints `RESULT: PASSED` with it, static and `--render` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `SKILL.md` routes a request naming a `DESIGN.md`, a style reference or a measured site's look to the script, and the boundary sentence sends extraction away while keeping application here |
| REQ-008 | `references/design-md-theming.md` states the mapping, the gates, the refusal and the provenance rule; `template-contract.md` and `color-system.md` record the fourth system; `changelog/v1.4.0.0.md` and the version fields carry the bump |
| REQ-009 | Tests cover the parser on the four bundled example Style References, one refusal (a palette whose accent fails the mark gate) and one byte-identity check on a themed copy |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/apply-design-md.cjs <stripe DESIGN.md> --forms bar-columns,daily-line --out <dir>` writes two files, prints one mapping line per role and ends with `RESULT: PASSED`; `check-corpus.cjs --extra <dir>` prints `RESULT: PASSED` on them.
- **SC-002**: The same command against a fixture whose only accent fails the mark gate writes nothing and ends with `RESULT: FAILED` naming the role, ratio and gate.
- **SC-003**: `diff` between a source form and its themed copy shows changes only inside the palette blocks, the provenance comment, the font stacks and the corner ladder.
- **SC-004**: The full corpus with the stripe delivery prints `RESULT: PASSED` static and under `--render`; the four bundled example Style References all parse.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-design-md-generator/references/design-md-format.md` v3 and its four bundled examples | The parse contract and the test fixtures | Parse by the documented headings and columns; tests run on all four |
| Dependency | Phase 15's visual system | Themed copies inherit it | Build after phase 15 is committed; never edit the same templates concurrently |
| Risk | A measured site has too few chromatic colours for four series | Med | Derive fewer series and say so; a form whose capacity exceeds the count is refused with the number |
| Risk | Provenance acceptance opens a hole in source equality | High | The `design-md` branch is limited to blocks carrying a well-formed hash comment and still runs every numeric gate; stock systems keep byte equality |
| Risk | Font stacks from the site are not installed on the reader's machine | Low | The substitute stack from the typography section is preserved after the measured face |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Deriving and writing all 26 forms from one `DESIGN.md` completes in under ten seconds without a browser.

### Security
- **NFR-S01**: The script reads local files only; a URL argument is refused. No template gains an external reference, so font faces are named, never linked.

### Reliability
- **NFR-R01**: The same `DESIGN.md` produces byte-identical output on two runs; the hash in the provenance comment is of the input file.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a `DESIGN.md` with no chromatic colour yields a neutral derivation and says so.
- Maximum length: a colour table longer than the series capacity is ranked and truncated, with the dropped tokens listed.

### Error Scenarios
- External service failure: none; everything is local.
- Network timeout: not applicable; URLs are refused.

### State Transitions
- A themed copy never becomes a template; the output directory is the caller's, and the one proof delivery is the only themed file inside the package.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: about 10, LOC: several hundred, Systems: 2 modes touched |
| Risk | 8/20 | Auth: N, API: N, Breaking: N; a checker branch that must not weaken source equality |
| Research | 3/10 | The v3 format and the four examples are local |
| Coordination | 6/15 | Script, checker, references, routing and one delivery |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None block the build. Recorded for the operator:

- Should a themed copy be allowed to keep the stock chrome and borrow only the series and emphasis? The build derives all roles; a `--chrome stock` flag would be a small addition if wanted.
<!-- /ANCHOR:questions -->

---
