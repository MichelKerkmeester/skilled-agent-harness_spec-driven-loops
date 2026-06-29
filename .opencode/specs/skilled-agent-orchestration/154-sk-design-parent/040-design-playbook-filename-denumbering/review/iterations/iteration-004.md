[0m
> build · glm-5.2
[0m
[0m→ [0mRead .opencode/skills/sk-design/graph-metadata.json
[0m→ [0mRead .opencode/skills/sk-code-review/graph-metadata.json
[0m
[0m$ [0mpython3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --validate-only
WEIGHT-BAND WARNINGS (4):
  - WEIGHT-BAND: deep-loop-workflows edges.depends_on[1] weight 0.6 outside recommended band [0.7, 1.0]
  - WEIGHT-BAND: deep-loop-workflows edges.siblings[0] weight 0.7 outside recommended band [0.4, 0.6]
  - WEIGHT-BAND: mcp-figma edges.depends_on[1] weight 0.45 outside recommended band [0.7, 1.0]
  - WEIGHT-BAND: sk-prompt-models edges.enhances[0] weight 0.8 outside recommended band [0.3, 0.7]

WEIGHT-PARITY WARNINGS (1):
  - WEIGHT-PARITY: mcp-figma depends_on mcp-code-mode weight=0.45 vs mcp-code-mode prerequisite_for mcp-figma weight=0.7 (diff > 0.1)
Discovered 20 skill graph-metadata.json files
VALIDATION PASSED: all metadata files are valid
[0m
```json
{"pass":"graph-symmetry-008","findings":[]}
```

VALIDATION PASSED; no symmetry errors. Reciprocals verified: sk-design↔sk-code-review sibling 0.4/0.4 (sk-design:23, sk-code-review:22); sk-design prerequisite_for mcp-figma/mcp-open-design at 0.7 (sk-design:39-49) with balanced reciprocal depends_on (no parity warning emitted for this pair — only the pre-existing mcp-code-mode↔mcp-figma pair flagged, out of scope). Remaining 4 weight-band + 1 parity warnings are all pre-existing on unrelated edges, not symmetry defects.
