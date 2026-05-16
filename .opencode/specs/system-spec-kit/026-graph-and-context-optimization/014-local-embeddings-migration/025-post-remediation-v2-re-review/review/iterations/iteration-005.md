# Iteration 005 — Local-LLM Legacy Hunt

## Focus
This iteration scanned traceability surfaces for post-022 residue in user-facing setup docs, README/SKILL/install references, config examples, and embedding-provider documentation. I focused on claims that still push explicit provider selection, stale Voyage cloud defaults, or overstate Memory MCP/CocoIndex embedding equivalence, while leaving the canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade and historical/forensic packets unflagged.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-005-001 | P1 | traceability | .opencode/skills/system-spec-kit/.env.example:66 | "#   1. Set EMBEDDINGS_PROVIDER explicitly (otherwise auto-cascade picks VOYAGE → OPENAI → llama-cpp → hf-local)" | confirmed-residue | Change the setup checklist so `EMBEDDINGS_PROVIDER=auto`/unset is the recommended default; mention explicit provider selection only as an override. |
| L-005-002 | P2 | traceability | .opencode/skills/system-spec-kit/.env.example:15 | "# Voyage AI (recommended for production)" | confirmed-residue | Replace the marketing recommendation with neutral wording such as "Voyage AI (cloud provider selected when `VOYAGE_API_KEY` is set)". |
| L-005-003 | P1 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:55 | "### Example: Voyage Code 3 Cloud Model" | confirmed-residue | Update the cloud example heading to the canonical Voyage default (`voyage/voyage-4`) or label Voyage Code 3 as a non-default legacy/code-search alternative. |
| L-005-004 | P1 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:60 | "model: voyage/voyage-code-3" | confirmed-residue | Change the example model to `voyage/voyage-4`, unless this section is explicitly retitled as a legacy/non-default alternative. |
| L-005-005 | P1 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:127 | "`voyage/voyage-code-3`" | confirmed-residue | Align the supported cloud model table with `voyage/voyage-4` as the current Voyage default and move `voyage-code-3` to clearly marked legacy/alternate status if retained. |
| L-005-006 | P1 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:202 | "`VOYAGE_API_KEY` \| `voyage/voyage-code-3`" | confirmed-residue | Map `VOYAGE_API_KEY` to `voyage/voyage-4` in default/shortcut documentation. |
| L-005-007 | P2 | traceability | .opencode/skills/mcp-coco-index/README.md:160 | "This unification means both MCP servers share the same vector space" | confirmed-residue | Qualify this as same EmbeddingGemma family/dimension only, or remove it unless Memory MCP and CocoIndex are proven to use the exact same model/runtime vector space. |
| L-005-008 | P1 | traceability | .opencode/skills/mcp-coco-index/README.md:162 | "Available alternatives include `voyage/voyage-code-3` (1024d cloud via LiteLLM, requires `VOYAGE_API_KEY`)." | confirmed-residue | Replace the visible Voyage alternative with `voyage/voyage-4`, or mark `voyage-code-3` as a non-default legacy/code-search option. |
| L-005-009 | P1 | traceability | .opencode/skills/mcp-coco-index/README.md:506 | "Switch to `voyage/voyage-code-3` (1024d cloud via LiteLLM) when you want higher-dimensional cloud embeddings" | confirmed-residue | Update the recommendation path to `voyage/voyage-4` and remove the promotional Voyage Code 3 rationale unless it is explicitly framed as a non-default alternative. |
| L-005-010 | P1 | traceability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:446 | "**Cloud alternative:** `voyage/voyage-code-3` via LiteLLM provider. Requires `VOYAGE_API_KEY` and a full index rebuild." | confirmed-residue | Change the install guide cloud alternative to `voyage/voyage-4` or clearly label Voyage Code 3 as legacy/non-default. |
| L-005-011 | P1 | traceability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:620 | "\| **Cloud option** \| Voyage Code 3 via LiteLLM (API key required, rebuild required)             \|" | confirmed-residue | Update the summary table to name the canonical Voyage cloud model (`voyage-4`) instead of Voyage Code 3. |

## Iteration summary
- Files scanned: 5010
- New findings: 11 (P0=0, P1=9, P2=2)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Prior iteration findings in `INSTALL_GUIDE.md`, `opencode.json`, `config_templates.md`, singleton `context-index.sqlite` references, legacy hf-local model registries, vitest temp DB names, and frozen review/evidence artifacts were treated as covered or intentional and were not duplicated.
