Framework: STAR

# Iter 027 — Track 7 (stale-context detection) — completed + unreferenced packets

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Some 026 children completed their work and no other packet, code, or doc references them anymore. These are pure delete candidates — keeping them just adds search noise.

## Task

Identify every 026 child (top-level + nested) that is COMPLETED (status=complete or in_progress_with_no_recent_activity) AND has zero references from other packets / code / docs.

## Action — Pre-planning steps

1. Read iter 001-022 outputs (all classifications).
2. For each child marked "complete" in those classifications, search the repo for references via grep: `grep -r "<packet-NNN-name>" --include="*.md" --include="*.ts" --include="*.json" --include="*.yaml"`.
3. Subtract: references inside the packet itself, references inside 999 / its own descendants.
4. A packet with ZERO remaining references = completed + unreferenced.

## Result — Acceptance criteria

- Per packet: grep command + result count
- Reference list (or "none") per packet
- Final delete-candidate list with reason
- JSONL row appended

## Research Question (scoped)

For every completed 026 child:

1. How many references exist outside the packet?
2. What kinds of references? (cross-packet doc / code / scratch)
3. Is it a pure delete candidate (zero references outside packet)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-027.md`

**Required heading structure:**

```
# Iter 027 — Track 7: completed + unreferenced packets

## Question / Evidence / Findings
### Per packet
- <packet>: ref count / kinds / verdict
### Delete-candidate list
| Packet | Status | Ref count | Verdict |

## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=7, iter_id="027".

## Context

Track 7 of 999. Feeds iter 028-030.
