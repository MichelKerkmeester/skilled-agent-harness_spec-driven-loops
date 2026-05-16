Framework: BUILD

# Iter 001 — Track 1: 000-release-cleanup 59-child enumeration

You are a SWE-1.6 deep-research iteration worker (v1.0.4.1 recipe — sequential_thinking mandatory pre-output). Stay read-only EXCEPT for the iter output file. Cite evidence with file:line.

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output.

**Goal:** Enumerate all 59 direct children of `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/`. Identify duplicate prefixes (e.g., two `006-*` or `007-*` packets). Classify each by theme (release-readiness / cleanup / audit / post-program / followup / orphan).

**Steps:**

1. `ls -1` the 000 dir; extract every `NNN-name/` entry
2. For each entry, read `description.json` → capture description + status
3. Identify duplicate-prefix groups (multiple packets sharing `006-` or `007-` prefix)
4. Classify each by theme via the spec/description keywords
5. Aggregate: how many active vs stale; what proportion is each theme

**Acceptance criteria per step:**

- Step 1: 59 entries enumerated (verify via `ls -1 | grep -cE '^[0-9]{3}-' = 59`)
- Step 2: each entry has description + status (or "missing-description.json" flag)
- Step 3: duplicate-prefix groups listed
- Step 4: theme classification per packet
- Step 5: aggregate stats

**Stop condition:** Emit iteration-001.md then exit.

## Research Question (scoped)

For `026/000-release-cleanup/`:

1. Full 59-child enumeration with description + status
2. Duplicate-prefix collisions (renumber required)
3. Theme classification per packet
4. Aggregate: how many active vs stale; theme distribution

## Output contract

**Write to (recipe grants Write scope):** `research/iterations/iteration-001.md`

Required heading structure:

```
# Iter 001 — Track 1: 000-release-cleanup enumeration

## Question
## Evidence
- <ref_file file="<path>" lines="N-M" /> tags throughout

## Findings
### Full child enumeration
| Packet | Description | Status |

### Duplicate-prefix collisions
| Prefix | Packet A | Packet B | Resolution proposal |

### Theme classification
| Theme | Count | Examples |

### Aggregate stats

## Gaps for next iter
## JSONL delta row
{"iter_id": "001", "timestamp_utc": "<ISO8601>", "executor": "cli-devin", "model": "swe-1.6", "track": 1, "status": "complete", "findings_count": <int>, "primary_evidence_files": [<paths>]}
```

## Context

Packet 998 is the deeper second-pass research after Wave 1 (packet 107). 000-release-cleanup is the meta-phase that Wave 1 deferred recataloging due to its 59-child scale. This iter scopes the recatalog problem.
