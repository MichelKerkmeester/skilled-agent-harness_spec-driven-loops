# Iteration 002: Security (D2) + cross-reference drift

## Focus
Security review of the import/export trust boundaries and shell surfaces: drawio_extract.py / mermaid_extract.py (already partially inspected in iteration 1), import-drawio.md, import-mermaid.md, export.md, validate-flowchart.sh, and the /create:diagram command YAML. Cross-checking SKILL.md section-number references surfaced systemic cross-reference drift (F003).

## Scorecard
- Dimensions covered: security, traceability (partial)
- Files reviewed: 7 (import-drawio.md, import-mermaid.md, export.md, create-diagram-auto.yaml, README.md + type refs via grep, validate-flowchart.sh, feature-catalog scan)
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required
- **F003**: Systemic stale SKILL.md section-number cross-references — the workflow and references point to sections that do not exist. `SKILL.md` has sections §1–§6 only (verified full read), yet `create-diagram-auto.yaml:268/305/337/390/423/504` cites "SKILL.md §9 Pre-Output Checklist" and "SKILL.md §0 style-guide gate"; `import-drawio.md:100/130/138/159` cites "SKILL.md §6–§7", "SKILL.md §6 rules 1–5", "SKILL.md §9 taste gate", "standard §7 budget"; `import-mermaid.md:92/100` cites "SKILL.md §6 connector rules" and "SKILL.md §9 taste gate"; `notation-and-validator.md:17` cites "SKILL.md §8" and `:93` cites "SKILL.md §5 notation rules and §8 validator contract". The taste gate actually lives in SKILL.md §6 SUCCESS CRITERIA; connector rules in §4 RULES (NEVER 11–15); the complexity budget in §3 HOW IT WORKS. Grep counts: §9 ×4, §7 ×1, §8 ×2, §0 ×1, §6 ×8 across the packet.
  - Impact: the /create:diagram command's HARD_BLOCK taste-gate step directs agents to a non-existent "SKILL.md §9 Pre-Output Checklist", so a literal executor cannot find the mandated gate; cross-references that should anchor an authoring skill are self-consistent only if the reader already knows the real locations. For a documentation-authoring packet, cross-reference integrity is the core deliverable.
  - Alternative explanation: the §7/§8/§9 numbering may reflect an earlier draft of SKILL.md that was reorganized to §1–§6 without updating references. Rejected as acceptable: the shipped docs must be internally consistent at v1.0.0.0.

### P2, Suggestion
- **F004**: PNG export rasterization executes any embedded JavaScript in the source HTML inside headless Chromium, inconsistent with the packet's own "never execute untrusted source" import doctrine. `references/import-export/export.md:96-112` — the Playwright snippet does `page.goto(f"file://{...}")` on the *original HTML* and screenshots `svg.first`. The skill's templates ship no JS (verified: zero `<script>` in templates/examples), but export accepts any existing diagram file the user points at, and the packet elsewhere treats rendering/executing unknown source as an execution-boundary violation (import-mermaid.md:153 "Rendering Mermaid to SVG first … crosses an unnecessary execution boundary"). Export offers no warning that the source HTML is executed in a browser.
  - Impact: low in practice (manual-only, local, user-supplied files), but the skill's own trust doctrine is internally inconsistent. Recommend rendering the extracted SVG (no script surface) or documenting the script-execution caveat.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | create-diagram-auto.yaml:268 vs SKILL.md | F003 section drift |
| checklist_evidence | partial | hard | SKILL.md:508 | carried from F001 |
| skill_agent | partial | overlay | SKILL.md vs diagram.md + create-diagram-auto.yaml | Router split correct, but §-references drift (F003) |

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: security, traceability (cross-reference discovery)
- Novelty justification: security pass confirmed the import trust boundaries are sound (bounded decompression, DTD/ENTITY rejection, size caps, no source execution in the extractors); the section-reference drift is a fresh, high-value cross-reference finding.

## Claim Adjudication Packets

```json
{
  "findingId": "F003",
  "claim": "create-diagram-auto.yaml and the import/export references cite SKILL.md sections §0/§7/§8/§9 that do not exist in the shipped SKILL.md (sections §1-§6), so the command's HARD_BLOCK taste-gate step and authoring references point at non-existent anchors.",
  "evidenceRefs": [
    ".opencode/commands/create/assets/create-diagram-auto.yaml:268",
    ".opencode/commands/create/assets/create-diagram-auto.yaml:337",
    ".opencode/skills/sk-doc/sk-create-diagram/references/import-export/import-drawio.md:100",
    ".opencode/skills/sk-doc/sk-create-diagram/references/import-export/import-mermaid.md:92",
    ".opencode/skills/sk-doc/sk-create-diagram/references/ascii-format/notation-and-validator.md:17",
    ".opencode/skills/sk-doc/sk-create-diagram/SKILL.md:14"
  ],
  "counterevidenceSought": "Full read of SKILL.md confirmed sections: 1 WHEN TO USE, 2 SMART ROUTING, 3 HOW IT WORKS, 4 RULES, 5 REFERENCES, 6 SUCCESS CRITERIA — no §7/§8/§9/§0. Grepped the whole packet for 'SKILL.md §' references and counted the drift.",
  "alternativeExplanation": "Section numbering may refer to an earlier draft or to the create-flowchart sibling SKILL.md. Rejected: import-drawio.md/import-mermaid.md live inside sk-create-diagram and reference its own SKILL.md; create-diagram-auto.yaml explicitly resolves skill_contract to this packet's SKILL.md.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If SKILL.md section headers are renumbered to match (adding §7/§8/§9) or every cross-reference is corrected to the real §1-§6 locations, downgrade to P2 documentation drift.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery — systemic cross-reference failure in an authoring skill's own contract" }
  ]
}
```

```json
{
  "findingId": "F004",
  "claim": "export.md's PNG procedure executes the source HTML (including any embedded JavaScript) in headless Chromium, contradicting the packet's stated 'never execute untrusted source' import doctrine without warning the user.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/sk-create-diagram/references/import-export/export.md:108",
    ".opencode/skills/sk-doc/sk-create-diagram/references/import-export/import-mermaid.md:153"
  ],
  "counterevidenceSought": "Checked templates and examples for <script> (none found); confirmed export is manual-only and user-initiated; considered that the source is normally the skill's own generated HTML.",
  "alternativeExplanation": "Export rendering is a standard browser-rasterization technique and the threat is local/manual-only, so it may be acceptable by design. Rejected as a non-issue: the packet's own doctrine flags crossing execution boundaries on source, and a one-line warning or SVG-first path would align the two.",
  "finalSeverity": "P2",
  "confidence": 0.75,
  "downgradeTrigger": "Dropped entirely if export.md adds an explicit caveat that the source HTML is rendered in a headless browser and may execute embedded scripts, or switches the PNG path to render the extracted SVG.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery — advisory inconsistency, low practical risk" }
  ]
}
```

## Ruled Out
- XXE / decompression-bomb in drawio_extract.py: PASS — `_reject_unsafe_xml` blocks DTD/ENTITY before any parse; `_decompress_limited` caps expansion at 64 MiB; input capped at 32 MiB.
- Mermaid extractor execution: PASS — parses bounded text only, never renders/fetches/executes; caps 4 MiB / 2000 nodes / 5000 edges.
- Shell injection in validate-flowchart.sh: PASS — all file arguments are quoted and passed as grep/awk operands, never eval'd; filename is not interpolated into patterns.
- Secrets/credentials in packet: PASS — secrets scan found only incidental prose (auth, tokenize) matches, no credentials.
- Self-contained no-JS claim: PASS — zero `<script>` in all templates and examples.

## Dead Ends
- [Auditing every one of the 27 type refs for §-drift individually]: not necessary; the systemic grep already quantified the drift set. (Iteration 2)

## Recommended Next Focus
D3 Traceability — run the spec_code and checklist_evidence protocols end-to-end: verify the 27-type claim, template-variant claims, hub-registration claim (mode-registry.json), and feature-catalog vs implementation parity; also validate the manual-testing-playbook scenarios against the shipped scripts/commands (playbook_capability).

Review verdict: CONDITIONAL
