# Iteration 001: Correctness (D1)

## Focus
Correctness review of the `sk-create-diagram` skill: routing/format-resolution logic (SKILL.md §2), accessibility SVG contract (§3 Output), 4px-grid rule (§3 Layout), connector rules (§4 NEVER 11-15), and shipped artifacts (examples, templates, scripts) as executable evidence of the contract.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6 (SKILL.md, style-guide.md, notation-and-validator.md, validate-flowchart.sh, drawio_extract.py, mermaid_extract.py) + batch scans of assets/examples/*.html (34) and assets/templates/*.html (4)
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required
- **F001**: Internal contract contradiction — the mandatory 4px-grid rule forbids the font sizes the style-guide typography tokens prescribe, and shipped examples violate both. `SKILL.md:337`, `references/foundations/style-guide.md:92-99`, `assets/examples/*.html`
  - SKILL.md §3 Layout declares the 4px grid "non-negotiable": font sizes must come from `(8/12/16/20/24/28/32/40)` and "if a coordinate ends in 1, 2, 3, 5, 6, 7, or 9 — fix it."
  - style-guide.md §2 (the "single source of truth" per SKILL.md ALWAYS rule 5) prescribes `sublabel` = **9px**, `eyebrow` = **7–8px**, `callout` = **14px** — 9, 7, and 14 are not divisible by 4 and are not in the allowed font-size set.
  - The shipped example corpus (the skill's own reference artifacts, which agents copy) uses 1,357 `x`/`y` coordinate values not divisible by 4 and off-grid font sizes (9px ×104, 8.5px ×86, 10px ×61, 11px ×52, 7px ×56, 6px, 13px, 72px). E.g. `example-flowchart.html:90` (`y="230"` + `y="239"` text baseline) and `font-size="8.5"` at `example-flowchart.html:140`.
  - Impact: an agent enforcing the grid rule verbatim cannot produce output consistent with the token guide or the reference examples; the examples themselves fail the SKILL.md §6 "Every font size, coord, width, height, gap divisible by 4?" checklist gate. This is a genuine spec contradiction, not editorial nitpicking.
  - Alternative explanation: text baseline `y` and small label sizes may be considered implicit exemptions (stroke/opacity are exempt but text baselines are not listed). Rejected because the grid rule lists font sizes explicitly with no text-position exemption, and the checklist gate is unconditional.

### P2, Suggestion
- **F002**: Validator-mechanics doc drifts from the actual validator regex for connector detection. `references/ascii-format/notation-and-validator.md:32`, `scripts/validate-flowchart.sh:60`
  - The doc claims connectors are detected as `→`, `↓`, `├─`, or `└─`; the script greps `→|↓|▼|▶|├─` (`▼`, `▶` instead of `└─`). A file whose only connector marker is `└─` would fail `check_arrows` per the doc but pass per the script.
  - Impact: minor authoring confusion; the doc and script disagree about which tokens satisfy the arrows check.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | SKILL.md:337 vs style-guide.md:92-99, examples | Grid/typography contradiction (F001) |
| checklist_evidence | partial | hard | SKILL.md:508 "Every font size, coord..." | Checklist gate fails on shipped examples |

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: correctness
- Novelty justification: first pass over the skill's core contract artifacts; both findings are fresh, evidence-backed observations.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "The mandatory 4px-grid rule (SKILL.md) forbids font sizes 9/7/14 and grid-valid coordinates that the style-guide typography tokens prescribe and that shipped examples use, creating an internal contract contradiction.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/sk-create-diagram/SKILL.md:337",
    ".opencode/skills/sk-doc/sk-create-diagram/SKILL.md:508",
    ".opencode/skills/sk-doc/sk-create-diagram/references/foundations/style-guide.md:92",
    ".opencode/skills/sk-doc/sk-create-diagram/references/foundations/style-guide.md:97",
    ".opencode/skills/sk-doc/sk-create-diagram/assets/examples/example-flowchart.html:90",
    ".opencode/skills/sk-doc/sk-create-diagram/assets/examples/example-flowchart.html:140"
  ],
  "counterevidenceSought": "Checked whether the grid rule lists an exemption for text baselines or small label sizes (it does not); checked whether examples were regenerated to the current skin (style-guide.md:50 says examples predate the current skin, which explains drift but does not resolve the contradictory typography tokens).",
  "alternativeExplanation": "The pre-baked examples were built under an earlier skin and the 9px/7px tokens may be the intended modern values while the grid rule's font-size list is stale. Rejected as sole explanation: style-guide.md is declared the single source of truth and still prescribes 9/7/14 today, so the contradiction is live in current docs.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If SKILL.md and style-guide.md are reconciled (either the grid rule gains an explicit font-size exemption matching the token table, or the token table is re-expressed in grid-valid sizes) and examples are regenerated, downgrade to P2 documentation debt.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery — live spec contradiction with shipped-artifact evidence" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "notation-and-validator.md documents connector detection tokens (└─) that the shipped validate-flowchart.sh does not actually match (it uses ▼/▶), so the doc is not a faithful description of the validator.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/sk-create-diagram/references/ascii-format/notation-and-validator.md:32",
    ".opencode/skills/sk-doc/sk-create-diagram/scripts/validate-flowchart.sh:60"
  ],
  "counterevidenceSought": "Grep of validate-flowchart.sh for the exact token list and of the reference doc for the claimed connector markers; confirmed the discrepancy verbatim.",
  "alternativeExplanation": "The doc may intentionally describe intended semantics while the script's ▼/▶ set is the live implementation. Rejected as non-issue: the doc purports to describe 'how the validator inspects a file' and its mechanics section must match the script.",
  "finalSeverity": "P2",
  "confidence": 0.9,
  "downgradeTrigger": "Resolved when notation-and-validator.md:32 lists the same tokens as validate-flowchart.sh:60 (or the script is updated to include └─).",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery — doc/script drift, advisory" }
  ]
}
```

## Ruled Out
- Accessibility SVG contract (role="img", aria-labelledby, first-child title, prefixed IDs): PASS — confirmed in example-high-level.html:55-56 (main SVG carries role="img" + aria-labelledby; 12 decorative glyph SVGs correctly use aria-hidden="true"), consistent with SKILL.md:385.
- No-JS self-contained claim: PASS — no `<script>` in any template or example.
- Python extraction scripts: PASS compile (py_compile) and structurally sound (bounded decompression, DTD/entity rejection, size caps in both drawio_extract.py and mermaid_extract.py).
- ASCII validator exit contract: PASS — validate-flowchart.sh exits 0 on warning-only runs (verified against assets/ascii-patterns/simple-workflow.md).
- Connector orthogonal r=8 rule: not asserted — the presence of `<line x1=` in many examples needs shared-axis verification beyond this iteration's budget; deferred to D3/D4 passes.

## Dead Ends
- [Per-line coordinate audit across all 34 examples]: too token-expensive; quantified via aggregated grep (1,357 off-grid values) instead. (Iteration 1)

## Recommended Next Focus
D2 Security — verify untrusted-source handling claims (import treats source labels as untrusted data), the Python scripts' trust boundaries (already partially inspected), and the `--json`/shell-command surfaces for path/command-injection exposure; also confirm export.md procedures don't introduce shell execution of source-derived strings.

Review verdict: CONDITIONAL
