Independent code review (READ-ONLY). git/rg/python3/node for inspection only. Do NOT modify any file.

# Task
Audit git commit `1e58d845af` (TOC + `<!-- ANCHOR -->` removal). This is **Iteration 5 of 10**. Focus: **MAINTAINABILITY — exhaustive stale-guidance/contradiction enumeration**.

# ALREADY KNOWN (do not re-report; these are being remediated)
- P1: orphaned numbered-TOC link lists (~8 files).
- P1: readme_template.md:76,293 stale "optional anchors" guidance.
- P1: 117 verification docs over-claim full TOC cleanup (002 + 004 impl-summaries).
- P2: stale TOC/anchor guidance in validation.md, sk-doc/README.md, skill_asset_template.md, create_folder_readme_{auto,confirm}.yaml, create/README.txt.

# This iteration — produce the COMPLETE remaining set (be exhaustive, not sampled)
Goal: enumerate EVERY remaining doc location that still mandates, recommends, generates, or instructs creation of a Table of Contents or `<!-- ANCHOR -->` markers, and so contradicts the new "no TOC / no anchor" policy — so remediation can be complete. Search the whole repo, not a sample:
- `rg -n -i 'table of contents|\bTOC\b|<!-- ?ANCHOR|anchor link|section anchor|require_toc|tocRequired|optional anchor|anchors help' .opencode --glob '*.md' --glob '*.yaml' --glob '*.json' --glob '*.txt'`
- For each hit, classify as: (a) NEW stale guidance/contradiction to fix, (b) already-known (skip), (c) correct new-policy statement ("no TOC", "Never", "forbidden", "do not add"), or (d) carve-out / legitimate reference.
- Pay attention to: other `assets/*template*.md` or `references/*.md` under sk-doc beyond those already known; agent definitions (`.opencode/agents/`, `.claude/agents/`) or other command files that mention TOC/anchors; any `*.json` schema/config beyond template_rules.json.

# Carve-outs / correct statements — do NOT flag
`system-spec-kit/templates/**` anchors; `sk-doc/scripts/tests/**` fixtures; `research/research.md` ToC; Webflow "Table of Contents" in `sk-code`; inline anchor mentions documenting the live spec-kit anchor system (grep/sed examples, validation_rules.md, template_compliance_contract.md, save_workflow.md, troubleshooting.md, level_decision_matrix.md, template_mapping.md); any statement that TOCs/anchors are NOT used / forbidden / Never.

# Output (stdout only)
1. "## Iteration 5 — Maintainability (exhaustive stale-guidance enumeration)": the grep approach + a categorized list. Give the COMPLETE list of category-(a) NEW locations as `file:line — short reason`.
2. Per NEW finding: `- [P1|P2] <file>:<line> — <claim>` (P1 if it would actively regenerate TOC/anchors via /create or validator; P2 if it is stale prose/checklist).
3. If none beyond known: "No NEW stale-guidance locations found."
4. FINAL LINE exactly:
`FINDINGS_JSON: {"iteration":5,"dimension":"maintainability","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`
