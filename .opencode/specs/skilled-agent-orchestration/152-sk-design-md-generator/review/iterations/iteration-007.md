# Iteration 7: traceability — SKILL.md claims vs code

Reviewed: .opencode/skills/sk-design-md-generator/SKILL.md, .opencode/skills/sk-design-md-generator/tool/scripts/cli.ts, .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts, .opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts, .opencode/skills/sk-design-md-generator/tool/scripts/validate.ts

Findings: 5 (P0=0 P1=4 P2=1)


## F007-01 [P1] Validator checks only 12 of 17 required sections, contradicting SKILL.md's repeated 17-section claim
- File: .opencode/skills/sk-design-md-generator/tool/scripts/validate.ts:213
- Evidence: SKILL.md states "17-section DESIGN.md format" at least 10 times (lines 12, 79, 220, 224, 228, 292, 294, 320, 358, 404), but validate.ts v2Sections array (lines 213-226) contains only 12 entries: sections 0-10 and 13, missing sections 11, 12, 14, 15, 16. The numbering itself jumps from 10 to 13.
- Fix: Either update validate.ts v2Sections to check all 17 sections (add the missing section identifiers), or correct SKILL.md to reflect the actual validator coverage (12 sections checked, not 17).

```json
{
"claim": "Validator checks only 12 of 17 required sections, contradicting SKILL.md's repeated 17-section claim",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts:213"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F007-02 [P1] SKILL.md claims validate.ts checks L1-L4 stability rules but no such check is implemented
- File: .opencode/skills/sk-design-md-generator/tool/scripts/validate.ts:284
- Evidence: SKILL.md §3 VALIDATE phase (line 229): "Confirm L1/L2/L3/L4 classification rules were followed." The validate.ts module (lines 284-312) has five check functions: checkPhantomColors, checkUnknownFonts, checkFormatConsistency, checkSectionCompleteness, checkContent. None of them verify stability classification rules — no check for L4 tokens excluded, L3 annotated, or proper L1/L2 placement.
- Fix: Either add a stability-classification verification function to validate.ts, or remove the claim from SKILL.md's VALIDATE phase description.

```json
{
"claim": "SKILL.md claims validate.ts checks L1-L4 stability rules but no such check is implemented",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts:284"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F007-03 [P1] SKILL.md L1-L4 stability taxonomy (Permanent/System/Campaign/Content) doesn't match code taxonomy (infrastructure/system/campaign/content)
- File: .opencode/skills/sk-design-md-generator/SKILL.md:273
- Evidence: SKILL.md §3 table (lines 273-278) defines four layers: L1=Permanent, L2=System, L3=Campaign, L4=Content. But cluster.ts classifyTokenStability functions (lines 400-565) emit layer values as: 'infrastructure' (score >= threshold), 'system' (score >= threshold), 'campaign' (score >= 0), 'content' (fallback). The code never uses L1-L4 numbering or the term 'Permanent'. A consumer reading SKILL.md would expect JSON fields like "layer": "L1" but the actual output contains "layer": "infrastructure".
- Fix: Align the taxonomy names between doc and code. Either rename code layers to match SKILL.md (L1/L2/L3/L4 with Permanent/System/Campaign/Content), or update SKILL.md to document the actual layer values output by the clusterer.

```json
{
"claim": "SKILL.md L1-L4 stability taxonomy (Permanent/System/Campaign/Content) doesn't match code taxonomy (infrastructure/system/campaign/content)",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/SKILL.md:273"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F007-04 [P1] SKILL.md claims validate output includes "per-error line references" but most validation checks report no line numbers
- File: .opencode/skills/sk-design-md-generator/SKILL.md:230
- Evidence: SKILL.md §3 VALIDATE phase (line 230) claims: "Output: validation pass/fail with per-error line references." In validate.ts, checkPhantomColors (line 89) returns { type, value, message } with no line number. checkUnknownFonts (line 145) same. checkSectionCompleteness (line 247) no line. checkContent (line 254) no line. Only checkFormatConsistency reports line numbers for table-format (line 193 via `line ${i+1}`) and blank-lines (line 205). 4 of 5 check functions omit line references.
- Fix: Either add line-number tracking to all validation checks (tracking position in mdContent), or update SKILL.md to say "per-error line references for format errors only" instead of the universal claim.

```json
{
"claim": "SKILL.md claims validate output includes \"per-error line references\" but most validation checks report no line numbers",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/SKILL.md:230"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F007-05 [P2] WRITE phase (Phase 2) described as automated pipeline step but has no TypeScript implementation
- File: .opencode/skills/sk-design-md-generator/SKILL.md:207
- Evidence: SKILL.md §3 (line 207): "Every extraction runs as a sequential pipeline. No phase can be skipped in a full run" and lines 218-224 describe automated WRITE flow: "Read tokens.json... Compose 17-section DESIGN.md... Output: DESIGN.md at the user-specified path." The invocation section (line 253) has only a comment for Phase 2 with no actual command. No write.ts or equivalent scripts exist. The WRITE phase is manual/AI-mediated, not an automated pipeline step. cli.ts:11 confirms this: "For full DESIGN.md generation, use the Claude Code skill /design-md."
- Fix: Clarify in SKILL.md §3 that EXTRACT and VALIDATE are automated TypeScript tools while WRITE is a handover step performed by the AI agent using tokens.json + design-md-format.md. Remove the implication of full automation.
