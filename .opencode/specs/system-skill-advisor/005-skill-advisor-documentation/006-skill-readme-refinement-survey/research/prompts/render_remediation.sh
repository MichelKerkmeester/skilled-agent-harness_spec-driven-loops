#!/usr/bin/env bash
# Renders per-skill remediation prompts + agent-configs from audit-report.json
set -u
SKILL=$1
REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
PACKET=$REPO/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/006-skill-readme-refinement-survey
AUDIT=$PACKET/research/audit-report.json
PROMPT_FILE=$PACKET/research/prompts/remediation-$SKILL.md
RECIPE_TMP=$PACKET/research/prompts/agent-config-remediation-$SKILL.json
RECIPE_SRC=$REPO/.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json
TARGET_README=$REPO/.opencode/skills/$SKILL/README.md

# Extract per-skill findings from audit
FINDINGS=$(python3 -c "
import json
d = json.load(open('$AUDIT'))
for s in d['skills']:
    if s['skill'] == '$SKILL':
        print('Section 1 tables to remove or move:')
        for t in s.get('section1Tables', []):
            print(f\"  - lines {t['startLine']}-{t['endLine']} ({t['columns']} cols, {t['rows']} rows): {t['purpose']} -> {t['conversionHint']}\")
        em = s.get('emDashes', {})
        if em.get('count', 0) > 0:
            print(f\"Em dashes: {em['count']} total\")
            for c in em.get('citations', []):
                print(f\"  - line {c.get('line')}: {c.get('literalContext','')[:120]}\")
        bw = s.get('bannedWords', [])
        if bw:
            print('Banned words:')
            for w in bw:
                print(f\"  - line {w.get('line')}: {w.get('word')} in: {w.get('literalSentence','')[:120]}\")
        coupling = s.get('crossSkillCoupling', [])
        legit_only = all('legitimate' in c.get('judgment','').lower() for c in coupling)
        if coupling:
            print(f\"Cross-skill coupling: {len(coupling)} hits ({'all legitimate; KEEP' if legit_only else 'review'})\")
        break
")

cat > "$PROMPT_FILE" << EOF
REMEDIATE: $SKILL/README.md per packet-005-style refinement rules.

# Goal

Modify exactly one file: \`$REPO/.opencode/skills/$SKILL/README.md\`

Apply the refinements catalogued in the audit report for skill \`$SKILL\`. Output the modified README directly in-place (the agent-config allows writes only to this one path).

# Sequential thinking

Call \`mcp__sequential_thinking__sequentialthinking\` with at least 5 thoughts: (1) read the current README and confirm each finding's line numbers against actual content via grep, (2) plan the prose/bullet replacements for each \xa71 table, (3) plan em-dash replacements (period, comma, parenthesis, or sentence-restructure as appropriate), (4) verify cross-skill refs stay if legitimate, (5) compose the rewrite.

# Refinement findings (from audit-report.json)

$FINDINGS

# Rules

1. **Zero tables in \`## 1. OVERVIEW\`.** Convert each \xa71 table to prose paragraphs or bulleted lists. If the table is genuinely reference data (Key Statistics with numbers), keep it but move it to a later section (\xa73 FEATURES or \xa75 CONFIGURATION). Update the TOC if you move a table.
2. **Em dashes.** Replace \`\xe2\x80\x94\` with \`.\`, \`,\`, or parentheses. When the em dash separates a parenthetical, use parentheses. When it begins a sentence fragment, start a new sentence. Do NOT introduce new banned punctuation.
3. **Banned words.** If the audit flagged any (e.g. "leverage"), rewrite the sentence to avoid the banned word. EXCEPTION: if the word appears inside an explanation OF the banned-word list (e.g. sk-doc's HVR rules section), keep it as-is.
4. **Cross-skill refs.** Legitimate refs (sibling CLI comparisons in Related sections, consumer dependencies, semantic+structural pairs) STAY. Only remove refs the audit explicitly flagged as inappropriate (the audit found 0 such refs across all 17 skills, so this rule is mostly a no-op).
5. **Preserve all factual content.** Statistics, version numbers, file paths, command examples, configuration values must all carry through. Only the presentation changes.
6. **Anchor pairs.** If you move a table out of \xa71, update both the table's location AND any TOC entry pointing at it.

# Output contract

Write the entire revised README to \`$REPO/.opencode/skills/$SKILL/README.md\`. Do not produce any other files. Do not edit any other file.

After writing, emit a short summary to stdout:
- Tables converted: N
- Tables moved to \xa7M: N
- Em dashes replaced: N
- Lines before / after: X / Y

# Constraints

- Read-only access to all files EXCEPT the target README.
- Per-iter budget ~12 tool calls.
- Output valid markdown; preserve YAML frontmatter shape.
- Do NOT add new tables in \xa71. Do NOT introduce new em dashes. Do NOT touch SKILL.md, INSTALL_GUIDE.md, or any other file.
EOF

# Render per-skill agent-config with Write rule for this skill's README only
sed -e "s|<repo-root>|$REPO|g" -e "s|<packet-root>|$PACKET|g" "$RECIPE_SRC" > "$RECIPE_TMP"
python3 -c "
import json
p = '$RECIPE_TMP'
d = json.load(open(p))
# Override write rules: only the target README
d['permissions']['allow'] = [r for r in d['permissions']['allow'] if not r.startswith('Write(')]
d['permissions']['allow'].append('Write($TARGET_README)')
json.dump(d, open(p,'w'), indent=2)
"

echo "rendered: $PROMPT_FILE"
echo "rendered: $RECIPE_TMP"
