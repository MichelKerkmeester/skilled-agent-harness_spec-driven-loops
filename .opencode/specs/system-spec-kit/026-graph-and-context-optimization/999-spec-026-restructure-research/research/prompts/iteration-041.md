# Iter 041 — Track 11 (gpt-5.5 medium) — adversarial review of top-level classifications

You are a senior architect reviewing the 026 restructure proposal. Your lens: adversarial — challenge the SWE-1.6 classifications for false positives and false negatives.

## Repository

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Read these inputs

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-001.md`
2. `iteration-002.md`
3. `iteration-003.md`
4. `iteration-004.md`
5. `iteration-005.md`
6. `iteration-006.md`

These are SWE-1.6's top-level classifications of the 16 direct children (000-015) of 026.

## Task

For each of the 16 top-level packets, ask the adversarial questions:

1. **False-positive merge:** Did SWE-1.6 propose a merge that LOSES load-bearing context?
2. **False-negative merge:** Did SWE-1.6 miss a merge that SHOULD happen?
3. **False-positive delete:** Did SWE-1.6 propose a delete for a packet that's actually referenced elsewhere?
4. **False-negative delete:** Did SWE-1.6 mark a packet "load-bearing" when it's actually stale/unreferenced?
5. **Classification confidence:** Is the classification rationale sufficient (≥ 3 citations, named references), or weak?

For any flag, cite the iter number + file:line in the iter output where SWE-1.6's claim appears.

## Cross-reference with codebase

For each flagged packet, run a targeted grep to verify or refute SWE-1.6's reference claim:

```bash
grep -rn "<packet-NNN-name>" --include="*.md" --include="*.ts" --include="*.json" --include="*.yaml" \
  .opencode .codex .claude .gemini opencode.json .utcp_config.json 2>/dev/null | \
  grep -v "999-spec-026-restructure-research" | head -20
```

If the reference count differs from SWE-1.6's claim, flag the discrepancy.

## Output contract

Print to stdout (codex will capture). Required heading structure:

```
# Iter 041 — Track 11: adversarial review of top-level classifications

## Methodology
<2-3 sentence framing>

## Per-packet adversarial findings
### 026/000-release-cleanup
- SWE-1.6 verdict (from iter 001): <load-bearing | merge | delete>
- Adversarial check: <false-positive-merge | false-negative-merge | false-positive-delete | false-negative-delete | confidence-weak | passed>
- Evidence: <file:line> + <grep result summary>
- Verdict: <accept SWE-1.6 | override SWE-1.6 | flag for review>

### 026/001-research-and-baseline
<same>

...

(one section per top-level packet 000-015)

## Summary
- Total packets reviewed: 16
- SWE-1.6 verdicts accepted: <N>
- SWE-1.6 verdicts overridden: <M>
- Flagged for review: <K>
- Discrepancies found: <list>

## JSONL delta row
{"iter_id": "041", "timestamp_utc": "<ISO8601>", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "findings_count": <int>, "overrides_count": <int>, "primary_evidence_files": ["iter-001..006"]}
```

## Stop conditions

Emit the iter output then stop. Do not request further input.

## Context

This iter complements (not repeats) the 40-iter SWE-1.6 sweep. SWE-1.6 produced the original classifications; gpt-5.5 medium reviews them with adversarial framing. Findings feed track 9 (target-state proposal) — if any SWE-1.6 verdict is overridden, the target-state proposal must reflect the corrected classification.
