# cli-devin SWE-1.6 — Job C: Spec-folder graph-metadata.json fixes (P1)

## ROLE
You are a senior metadata curator. Update `parent_id` and `derived.status` fields in 7 graph-metadata.json files using `python3` JSON manipulation (NOT raw sed — JSON structure must remain valid). Two field changes per file. No other edits.

Spec folder (pre-approved Gate 3): `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/` — skip Gate 3.

## CONTEXT

Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

**Background**: Phase 115 + Phase 114/007 are both complete and shipped, but the per-child `graph-metadata.json` files have stale `parent_id: null` and `derived.status: "planned"` fields. The `generate-context.js` canonical save script wipes these per memory rule [[feedback_generate_context_regenerates_parent_metadata]]. Manual repair is the established pattern.

The 7 files to fix:

| # | Path | Set `parent_id` to | Set `derived.status` to |
|---|------|----|----|
| 1 | `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan/graph-metadata.json` | `"skilled-agent-orchestration/115-deep-ai-council-rename"` | `"complete"` |
| 2 | `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/002-sk-ai-council-skill-rename/graph-metadata.json` | same | `"complete"` |
| 3 | `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/003-ai-council-agent-4-runtime-rename/graph-metadata.json` | same | `"complete"` |
| 4 | `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/004-sibling-edges-and-typescript/graph-metadata.json` | same | `"complete"` |
| 5 | `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/005-root-docs-hooks-and-index/graph-metadata.json` | same | `"complete"` |
| 6 | `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/006-reindex-and-validate/graph-metadata.json` | same | `"complete"` |
| 7 | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-models-rename/graph-metadata.json` | `"skilled-agent-orchestration/114-small-ai-model-optimization"` | `"complete"` |

**Why python3, not sed/jq**: The JSON files contain nested structures + may have duplicate keys (a known quirk per memory). Python with `json.load` / `json.dump` indent=2 normalizes structure; sed risks string-corruption inside arrays. `jq` works too but `python3` is the canonical approach in this repo.

## ACTION (pre-planning — execute in order)

### Step 1: Write a python helper
Compose a one-shot python3 script that:
1. Takes (file_path, parent_id, status) as args.
2. Loads the JSON.
3. Sets `data["parent_id"] = parent_id`.
4. Sets `data.setdefault("derived", {})["status"] = status`.
5. Writes the JSON back with `indent=2`.

**Acceptance**: script runnable as `python3 -c "<inline>"` per file, no syntax errors.

### Step 2: Apply to all 7 files
Run the python script once per file from the table above. Verify after each:
- `jq '.parent_id, .derived.status' <file>` returns the expected `parent_id` string and `"complete"`.

**Acceptance**: after all 7 runs, `jq` on each file shows the correct values.

### Step 3: Re-validate spec folders
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename --strict`. Expect exit 0.
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-and-rename-plan --strict` through `006-reindex-validate-reconcile --strict` (6 child validations). Expect exit 0 each.
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-models-rename --strict`. Expect exit 0.

**Acceptance**: all 8 validate runs (parent + 6 children + 007) report `RESULT: PASSED`.

## FORMAT (bundle-gate STANDARD)

Emit a single fenced JSON block under heading `## BUNDLE`:
```json
{
  "edits": [
    {"file": "<path>", "field": "parent_id", "old": "<value>", "new": "<value>", "verified_by": "<jq output>"},
    {"file": "<path>", "field": "derived.status", "old": "<value>", "new": "complete", "verified_by": "<jq output>"}
  ],
  "validation": {
    "115_parent": "PASSED | FAILED <reason>",
    "115_001": "PASSED | FAILED",
    "115_002": "PASSED | FAILED",
    "115_003": "PASSED | FAILED",
    "115_004": "PASSED | FAILED",
    "115_005": "PASSED | FAILED",
    "115_006": "PASSED | FAILED",
    "114_007": "PASSED | FAILED"
  }
}
```

After the bundle, append a 50-100 word narrative confirming all 7 files updated + all 8 validations pass.

End of prompt.
