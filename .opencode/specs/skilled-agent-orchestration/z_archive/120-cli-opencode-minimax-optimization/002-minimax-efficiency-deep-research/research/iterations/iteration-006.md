# Iteration 6: Validation Pass - Reconcile MiniMax Deltas Against Current Files

## Focus

Validate the iteration-005 patch-ready deltas against the actual post-phase-001 files so the follow-on packet does not duplicate provider/auth rows, stale trigger phrases, or schema-incompatible budget fields.

## Actions Taken

- Read the live `minimax-2.7` entry in `sk-prompt/assets/model-profiles.json`; it already exists with `context_length: null`, `fallback_target: null`, `primary_quota_pool: "minimax-api"`, and one `cli-opencode` executor note that still says context length and `--variant` behavior are unverified. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json]
- Read the live `cli-opencode` MiniMax docs; provider auth, login command, model selection, and `minimax/minimax-2.7` rows are already present, while the MiniMax `--variant` row still says behavior is unverified. [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md] [SOURCE: .opencode/skills/cli-opencode/SKILL.md]
- Read `sk-prompt-models/SKILL.md` and `graph-metadata.json`; trigger phrases already include MiniMax, but the dispatch matrix and `cli-opencode` ownership text still omit MiniMax. [SOURCE: .opencode/skills/sk-prompt-models/SKILL.md] [SOURCE: .opencode/skills/sk-prompt-models/graph-metadata.json]
- Read the real `cli-devin/assets/per-model-budgets.json` format; `models` is an array, not an object keyed by model id, and entries use `context_length`, `max_budget_pct`, `working_memory_tokens`, `summary_threshold_lines`, `truncation_marker_template`, and `notes`. [SOURCE: .opencode/skills/cli-devin/assets/per-model-budgets.json]
- Rechecked the current cli-opencode context-budget mirror; it points to the canonical cli-devin budget engine and lists DeepSeek, Kimi, and Qwen, but not MiniMax. [SOURCE: .opencode/skills/cli-opencode/references/context-budget.md]

## Findings

### F1 - The model-profile delta is a targeted update, not a new MiniMax entry

`minimax-2.7` already exists in `model-profiles.json`, so the follow-on packet should update the existing object only.

Exact incremental change:

```json
{
  "id": "minimax-2.7",
  "context_length": 204800,
  "fallback_target": null
}
```

Keep `fallback_target: null`. Iteration 004's fail-fast conclusion still matches the current registry state: MiniMax has a single verified executor path and no deliberately adopted different-pool fallback target. Do not set a fallback to DeepSeek, Kimi, GLM, Qwen, Haiku, Gemini, or OpenAI as part of this packet.

Replace the executor note with:

```text
Direct MiniMax.io API key (`MINIMAX_API_KEY`). Bypasses opencode-go; 204,800-token context verified. Omit `--variant` by default for `minimax/minimax-2.7`; highspeed should be selected by an exact minimax model id if `opencode models minimax` exposes one.
```

Refine the stale weakness from "context length and reasoning controls unverified" to "`--variant` mapping remains unverified; highspeed model id requires live `opencode models minimax` confirmation." The context-length part is no longer unverified after the research result.

### F2 - The budget tuple must fit the existing array schema

The previous tuple is numerically right but should be encoded in the current `per-model-budgets.json` shape. Add a `models[]` object, not top-level keyed fields and not derived `active_budget_tokens` / `reserve_tokens` fields.

Exact row:

```json
{
  "id": "minimax-2.7",
  "provider": "MiniMax",
  "context_length": 204800,
  "max_budget_pct": 70,
  "working_memory_tokens": 500,
  "summary_threshold_lines": 200,
  "truncation_marker_template": "[... truncated %d tokens]",
  "notes": "Direct MiniMax.io API via cli-opencode. 70% budget yields 143360 tokens; keep a 61440-token reserve and preserve active tool-call/tool-result message boundaries."
}
```

The tightened numbers are:

| Field | Value |
| --- | ---: |
| `context_length` | 204800 |
| `max_budget_pct` | 70 |
| dynamic prompt budget | 143360 |
| reserved margin | 61440 |
| `working_memory_tokens` | 500 |
| `summary_threshold_lines` | 200 |

Only `context_length` and `max_budget_pct` belong as budget-calculation fields in the current JSON asset. The active budget and reserve belong in the `notes` string or docs unless a later packet intentionally evolves the schema.

### F3 - cli-opencode provider/model rows should not be duplicated

`cli-opencode/references/cli_reference.md` and `cli-opencode/SKILL.md` already include MiniMax in auth pre-flight, login guidance, model selection, and explicit request routing. The follow-on should not add another MiniMax provider section.

Incremental cli-opencode reference changes should instead be:

- Update the MiniMax `--variant` row from "unverified" to "omit by default for direct MiniMax; highspeed is a separate model id if exposed; promote only after docs or live ablation prove a mapping."
- Update the default `--variant high` sentence with a MiniMax exception.
- Add a short "MiniMax variant ablation" note only once, near the existing `--variant` table.
- Add `minimax-2.7 | 204,800 | Direct MiniMax.io API; apply canonical 70% budget; preserve active tool-call/tool-result message boundaries` to `cli-opencode/references/context-budget.md`.

### F4 - sk-prompt-models needs matrix/ownership reconciliation, not new trigger phrases

`graph-metadata.json` already includes `minimax`, `minimax-2.7`, `minimax-api`, `minimax.io`, and `minimax direct api`, so adding more trigger phrases would be duplicate noise.

Incremental sentinel changes:

- Add a dispatch-matrix row: `MiniMax-2.7 | cli-opencode -> minimax (minimax-api) | active direct API; variant mapping pending ablation`.
- Update the `cli-opencode` ownership row to include MiniMax direct API in addition to DeepSeek direct API and opencode-go.
- Optionally add one link-only pattern-index row for "MiniMax prompt-quality / variant-ablation policy" pointing to `cli-opencode/assets/prompt_quality_card.md` and `cli-opencode/references/cli_reference.md`, if the follow-on creates that provider-specific note.
- Leave runtime logic out of `sk-prompt-models`; the skill remains a sentinel/index.

### F5 - The hardened follow-on scope is smaller than iteration 005 implied

Phase-001 already shipped several pieces that iteration 005 listed as patch-ready additions. The safe follow-on set is:

1. `sk-prompt/assets/model-profiles.json`: update the existing MiniMax object as described in F1.
2. `cli-devin/assets/per-model-budgets.json`: append the MiniMax array row described in F2.
3. `cli-opencode/references/context-budget.md`: add the MiniMax context-window row and continuity caveat.
4. `cli-opencode/references/cli_reference.md`: revise the existing MiniMax `--variant` policy and add a compact ablation note.
5. `cli-opencode/SKILL.md`: mirror the MiniMax `--variant` exception in the quick guidance, without adding duplicate provider rows.
6. `sk-prompt-models/SKILL.md`: add MiniMax to the dispatch matrix and ownership text.
7. `sk-prompt-models/references/pattern-index.md`: only add a link-only MiniMax policy pointer if the cli-opencode prompt-quality note is implemented.

No change is needed to `sk-prompt-models/graph-metadata.json` in this follow-on packet.

## Questions Answered

- The exact `model-profiles.json` incremental change is finalized: set `context_length` to `204800`, keep `fallback_target: null`, and update stale notes/weaknesses around verified context and unverified `--variant`.
- The per-model budget tuple is finalized against the real schema: append a `models[]` row with `context_length: 204800` and `max_budget_pct: 70`; document 143,360 active budget and 61,440 reserve in notes/docs.
- The duplicate-risk areas are identified: MiniMax provider auth/model rows and graph trigger phrases already exist and should not be re-added.

## Questions Remaining

- Live `opencode models minimax` still needs to confirm the exact highspeed model slug, if exposed.
- The MiniMax `--variant` ablation still needs a configured MiniMax provider and should remain a validation recipe, not a default policy.
- Follow-on implementation still needs to decide whether to add the optional pattern-index row based on whether it also adds provider-specific MiniMax prompt-quality text.

## Next Focus

Synthesize the final research output into the follow-on implementation plan: small, schema-compatible deltas only; no duplicate MiniMax provider rows; no MiniMax-specific runtime logic.
