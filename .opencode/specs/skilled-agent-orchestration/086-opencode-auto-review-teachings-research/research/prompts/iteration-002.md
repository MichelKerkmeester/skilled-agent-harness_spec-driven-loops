# Deep Research Iteration 002 of 20 — Read auto-review.example.json (config schema sample)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 2 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` repository's `auto-review` package (branch `issue-136-package-auto-review`).

**Prior iter context**: iteration 001 should have pinned an upstream commit SHA and recorded it as `PINNED_UPSTREAM_SHA: <sha>` at the top of `research/iterations/iteration-001.md`. **You MUST grep for that SHA and reuse it.**

**Why this iter exists**: every plugin's runtime behavior is parameterized by its config. The `auto-review.example.json` is the operator-facing template — it documents the fields users are expected to override. Capturing the example exactly tells us (1) what behaviors are config-tunable vs hardcoded, (2) what defaults the upstream author chose, (3) how field names hint at internal design (e.g., `reasoning` instead of `reasoning_effort` suggests this targets a specific SDK schema).

**Cross-reference**: iter 003 reads `auto-review.ts` part 1 which contains the `loadConfig` function and `AutoReviewConfig` type. The example.json fields should map 1:1 with the TypeScript type. If they don't, that's a finding.

## TASK

### Step 1 — Reuse pinned SHA from iter 001

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' research/iterations/iteration-001.md | head -1)
if [ -z "$SHA" ]; then
  echo "WARN: iter-001 did not pin a SHA; re-pinning now"
  SHA=$(gh api repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review --jq '.commit.sha' 2>/dev/null) \
    || SHA=$(curl -s "https://api.github.com/repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review" | jq -r '.commit.sha')
fi
echo "USING_SHA=$SHA"
```

### Step 2 — Fetch the example config

```bash
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.example.json?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-example-002.json \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.example.json" > /tmp/upstream-example-002.json
cat /tmp/upstream-example-002.json
```

### Step 3 — Parse every field and document

For each top-level field in the JSON, fill the schema table below. If a field's value is itself an object or array, document the nested structure too.

| Field | Type | Example value | Inferred purpose | Comments / defaults |
|-------|------|---------------|------------------|---------------------|

### Step 4 — Hypothesize the runtime-default for each field

The example file shows ONE valid configuration. The runtime defaults (when a user has NO config file) are encoded in `auto-review.ts` lines 1-50 (`loadConfig` returns `{}` on any error, then `AutoReviewPlugin` reads each config field with `?? <default>`). Predict the default for each field based on the example value (e.g. if `model: "github-copilot/gpt-5.5"` is the example, the default is probably `""` or `null` with dynamic inference fallback). Mark each prediction as PREDICTED until iter 003 confirms.

### Step 5 — Note any field that doesn't appear in the README extraction table from iter 001

If iter 001's `Config schema` row missed a field, that's a documentation gap in the upstream README. Flag it.

## SCOPE (this iteration only)

- `packages/auto-review/auto-review.example.json` — entire file
- `research/iterations/iteration-001.md` — read-only, for SHA + README extraction table
- **No writes outside `research/iterations/iteration-002.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
# Reuse pinned SHA
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-001.md 2>/dev/null | head -1)
echo "USING_SHA=$SHA"

# Fetch example.json
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.example.json?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-example-002.json \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.example.json" > /tmp/upstream-example-002.json
wc -l /tmp/upstream-example-002.json

# Validate JSON
jq '.' /tmp/upstream-example-002.json > /dev/null && echo "valid JSON" || echo "INVALID JSON"

# List top-level keys
jq -r 'keys[]' /tmp/upstream-example-002.json

# Print each field's type
jq -r 'to_entries[] | "\(.key): \(.value | type)"' /tmp/upstream-example-002.json
```

## CONSTRAINTS

- READ-ONLY: no upstream mutations, no local source mutations.
- Cite `packages/auto-review/auto-review.example.json:<line>` for every claim about the example contents.
- If a field's purpose is ambiguous from the example alone, mark it `INFERRED` and propose what iter 003 should verify.
- Reuse the SHA pinned in iter 001; do not re-pin unless iter 001 explicitly failed.
- Stop adding new probes past minute 4; spend minute 4-6 writing output.
- Do NOT dispatch any cli-* tool.

## COMMON FAILURE MODES

1. **Iter-001 SHA missing**: if `grep` finds no `PINNED_UPSTREAM_SHA:` in iter-001 output, re-pin and record the new SHA in your own iter-002 output as a fallback. Note this in your Summary so iter 020 knows iter 001 failed.
2. **JSON parse error**: if `jq` rejects the file, it's not valid JSON — record `INVALID JSON` and quote the parse error.
3. **0-byte file**: same handling as iter 001's "Empty file" case — record `VERIFIED-MISSING`.

## OUTPUT FORMAT

Write to `research/iterations/iteration-002.md` with this EXACT structure:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha-from-iter-001-or-new> -->

# Iteration 002 — auto-review.example.json (config schema sample)

## Summary
<2-4 sentence verdict: number of config fields, which are optional vs required, any surprising defaults>

## Files/Commands Reviewed
- `packages/auto-review/auto-review.example.json` (N lines at sha <sha>)
- `research/iterations/iteration-001.md` (SHA reuse)

## Findings

### Config Schema Extraction
| Field | Type | Example value | Inferred default | Inferred purpose |
|-------|------|---------------|------------------|------------------|
| <field1> | <type> | `<value>` | `<predicted-default>` | <purpose> |
| ... | | | | |

### Gaps vs Iter-001 README extraction
| Field | Documented in README? | Notes |
|-------|----------------------|-------|
| <field> | YES / NO | <note> |

### Suspicious Fields
| Field | Why suspicious | Verify in iter |
|-------|----------------|----------------|
| <field> | <reason> | iter-003 (auto-review.ts type definition) |

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — describe how much new info this iter added beyond iter-001 README extraction. `dimension status: FULLY EXTRACTED / PARTIAL (need iter-003 to confirm types)`.
```

Then append exactly one line to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":2,"focus":"example.json config schema","mechanismsExtracted":0,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] SHA reused from iter-001 OR fallback-pinned (with note in Summary)
- [ ] Config schema table has one row per top-level field
- [ ] Each row has a PREDICTED runtime default (verifiable in iter 003)
- [ ] Gap-vs-iter-001 table flags any field undocumented in README
- [ ] Output file ≥ 40 lines

Begin.
