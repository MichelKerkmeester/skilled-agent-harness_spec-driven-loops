---
title: "Skills Audit: All Skills Alignment Sweep"
description: "Per-skill audit ledger for sk-doc compliance, current-reality alignment, DQI proxy and follow-on routing."
trigger_phrases:
  - "skills audit"
  - "all skills alignment"
importance_tier: "critical"
contextType: "research"
---
# Skills Audit: All Skills Alignment Sweep

Audit ledger for the 19-skill documentation sweep.

---

## 1. AUDIT METHOD

### Inputs Read

| Input | Evidence |
|---|---|
| sk-doc operating manual | `.opencode/skills/sk-doc/SKILL.md` |
| SKILL template | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` |
| Skill README template | `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` |
| Skill reference template | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` |
| Skill asset template | `.opencode/skills/sk-doc/assets/skill/skill_asset_template.md` |
| Frontmatter rules | `.opencode/skills/sk-doc/assets/frontmatter_templates.md` |
| Machine template rules | `.opencode/skills/sk-doc/assets/template_rules.json` |
| Recent advisor handover | `008-skill-advisor/.../009-system-skill-advisor-extraction/handover.md` |
| Recent restructures | `git log --oneline -50` |

### Automated Checks

| Check | Command | Baseline Result |
|---|---|---|
| SKILL.md structure | `python3 .opencode/skills/sk-doc/scripts/quick_validate.py <skill> --json` | 19/19 valid; 3 CLI description soft warnings |
| Primary README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme --blocking-only <README>` | 21/21 valid across root + skill READMEs |
| Current-reality grep | `rg` for advisor/code-graph/CocoIndex/embedding terms | Found stale root README `system_code_graph` language and advisor compat path leftovers |

### DQI Proxy

DQI proxy uses four local signals: template pass, frontmatter budget, current-reality accuracy, and scanability. Scores are approximate because this packet does not run the full sk-doc DQI pipeline.

---

## 2. BATCH MATRIX

| Batch | Skills | Baseline | Action |
|---|---|---|---|
| A | cli-claude-code, cli-codex, cli-gemini, cli-opencode | Structurally valid; three description-budget warnings | Trim CLI frontmatter and verify current invocation docs |
| B | deep-agent-improvement, deep-ai-council, deep-research, deep-review | Structurally valid | Verify state-machine docs and no stale current-reality refs |
| C | mcp-chrome-devtools, mcp-coco-index, mcp-code-mode | Structurally valid | Verify MCP topology, CocoIndex fork/embedding and code-mode surfaces |
| D | sk-code, sk-code-review, sk-doc, sk-git, sk-prompt | Structurally valid | Verify sk-doc authority and general skill docs |
| E | system-code-graph, system-skill-advisor, system-spec-kit, root READMEs | Structurally valid, but root README stale | Align root current-reality docs and advisor/code-graph references |

---

## 3. PER-SKILL STATUS

| Skill | Primary Docs | Baseline DQI | Findings | Status |
|---|---:|---:|---|---|
| cli-claude-code | 41 md | 88 | `SKILL.md` description 133 chars, over 130 soft target | Aligned in Batch A |
| cli-codex | 46 md | 87 | `SKILL.md` description 144 chars, over 130 soft target; current `gpt-5.5` docs are intentional per skill | Aligned in Batch A |
| cli-gemini | 34 md | 88 | `SKILL.md` description 132 chars, over 130 soft target | Aligned in Batch A |
| cli-opencode | 48 md | 90 | No blocking sk-doc findings; `opencode-go` docs match current skill policy | Verified in Batch A |
| deep-agent-improvement | 81 md | 90 -> 91 | No blocking sk-doc findings; JSONL/journal docs current | Verified in Batch B |
| deep-ai-council | 80 md | 90 -> 91 | No blocking sk-doc findings; council state and derived graph docs current | Verified in Batch B |
| deep-research | 88 md | 90 -> 91 | No blocking sk-doc findings; deferred lifecycle language is explicit current truth | Verified in Batch B |
| deep-review | 86 md | 90 -> 93 | Removed duplicate `_TODO` quick-reference sections and corrected canonical `deep-review-state.jsonl` playbook references | Aligned in Batch B |
| mcp-chrome-devtools | 35 md | 90 | No blocking sk-doc findings | Pending Batch C |
| mcp-coco-index | 188 md | 91 | Need verify post-040 embedding wording and fork docs | Pending Batch C |
| mcp-code-mode | 45 md | 90 | No blocking sk-doc findings | Pending Batch C |
| sk-code | 119 md | 90 | No blocking sk-doc findings | Pending Batch D |
| sk-code-review | 32 md | 90 | No blocking sk-doc findings | Pending Batch D |
| sk-doc | 72 md | 92 | Template authority; minimal-change policy | Pending Batch D |
| sk-git | 44 md | 90 | No blocking sk-doc findings | Pending Batch D |
| sk-prompt | 40 md | 90 | No blocking sk-doc findings | Pending Batch D |
| system-code-graph | 50 md | 94 | Skill docs already use `mk-code-index`; root README still stale | Pending Batch E |
| system-skill-advisor | 121 md | 91 | Some advisor docs still mention old compat dist path or wrong DB path | Pending Batch E |
| system-spec-kit | 1305 md | 90 | Primary docs validate; targeted root/current-reality checks still needed | Pending Batch E |

---

## 4. CURRENT-REALITY FACTS

| Topic | Current Fact | Source |
|---|---|---|
| Skill advisor MCP | Standalone MCP server named `system_skill_advisor` | 013/009 handover and skill docs |
| Advisor tool IDs | `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`; skill graph tools also live with advisor | `system-skill-advisor/INSTALL_GUIDE.md` |
| Advisor DB | `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` | `system-skill-advisor/mcp_server/database/README.md` |
| Code graph canonical docs | `mk-code-index` namespace with stable `code_graph_*`, `detect_changes`, `ccc_*` tool IDs | `system-code-graph/SKILL.md` |
| CocoIndex | Soft-forked `cocoindex_code` MCP with vendored wrapper and semantic code search | root README and `mcp-coco-index` docs |
| Embeddings | `EMBEDDINGS_PROVIDER=auto` cascade favors Voyage/OpenAI, then local llama-cpp GGUF, then hf-local fallback | root README and runtime config notes |

---

## 5. FOLLOW-ON CANDIDATES

| Candidate | Scope | Reason | Status |
|---|---|---|---|
| `016-runtime-config-mk-code-index-parity` | Runtime config/source alignment for `opencode.json`, `.codex/config.toml`, `.gemini/settings.json` if operator wants all clients renamed from `system_code_graph` to `mk_code_index` | Config/source edits are forbidden in this doc-only packet; audit found mixed current runtime names | Candidate, not yet final deferred item |
