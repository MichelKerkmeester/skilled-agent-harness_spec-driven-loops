# Routing-phrase reader inventory

Command: `rg -n "trigger_phrases" .skilled/skills/system-skill-advisor/runtime .skilled/skills/sk-doc --glob '*.ts' --glob '*.cjs' --glob '*.py'` (non-test hits), plus `rg -n "frontmatter" runtime/scripts/*.py`.

| Reader | Reads | Source |
|--------|-------|--------|
| `runtime/lib/scorer/projection.ts:748-754` | `derived.trigger_phrases` (and `intent_signals`) | `graph-metadata.json` |
| `runtime/lib/scorer/executor-delegation.ts:266-270` | `derived.trigger_phrases` | `graph-metadata.json` |
| `runtime/lib/skill-graph/metadata-sanitizer.ts:76` | `trigger_phrases`, `key_topics` sanitizing | `graph-metadata.json` derived block |
| `runtime/lib/skill-graph/skill-graph-db.ts` (`skill_nodes.trigger_phrases`) | indexed copy | `graph-metadata.json` |
| `runtime/scripts/skill_graph_compiler.py:336-365` | `derived.trigger_phrases` validation | `graph-metadata.json` |
| `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:396-425` | `derived.trigger_phrases` vs `intent_signals` | `graph-metadata.json` |
| `sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | preserves hand-curated `trigger_phrases` | `graph-metadata.json` |
| `runtime/lib/skill-graph/doc-frontmatter.ts` | `trigger_phrases` of `references/` and `assets/` docs, only when `SPECKIT_ADVISOR_DOC_TRIGGERS=true` | reference/asset doc frontmatter |
| `runtime/scripts/skill_advisor.py:987-997` | the same opt-in doc harvest | reference/asset doc frontmatter |
| `runtime/scripts/skill_advisor_runtime.py:53-190` | `name`, `description`, inline `keywords` | `SKILL.md` frontmatter |
| `sk-doc/shared/scripts/validate_document.py`, `sk-create-repo-rule/scripts/check-repo-rules.cjs` | document-format validation, not routing | doc frontmatter |

No runtime routing reader consumes `trigger_phrases` or `intent_signals` from a skill's own `SKILL.md` frontmatter.

Decision: `graph-metadata.json` is the routing source of truth. Skill frontmatter is not populated with routing phrases for the other 13 skills, and the readers stay as they are. The decision is documented in `.skilled/skills/system-skill-advisor/SKILL.md` section 3 ("Routing phrases come from graph-metadata.json"), where skill authors and the advisor's maintainers read it.
