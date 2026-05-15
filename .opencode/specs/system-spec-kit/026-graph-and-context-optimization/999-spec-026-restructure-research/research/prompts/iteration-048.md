# Iter 048 — Track 11 (gpt-5.5 medium) — blast-radius analysis for proposed deletes

You are a senior architect. Your lens: blast-radius — for each proposed delete, what depends on this packet that could break?

## Repository

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Read these inputs

- `iteration-030.md` (consolidated delete-candidate list with HIGH/MEDIUM/LOW confidence)
- `iteration-027.md` / `028.md` / `029.md` (the source iter that produced delete classifications)

## Task

For each delete candidate, compute the blast radius:

### Reference types
- **Spec doc references:** packets that name this packet in their spec.md / impl-summary / decision-record / handover
- **Code references:** code files that name this packet (tests, scripts, README sections)
- **Graph references:** graph-metadata.json `manual.depends_on` arrays that name this packet
- **Index references:** memory-index entries (graph-metadata.json `derived.trigger_phrases` / `key_topics` etc.) that name this packet
- **External references:** changelog entries, README.md mentions, AGENTS.md mentions
- **Symbolic references:** scripts that hardcode this packet's path (e.g., a hook script that reads .opencode/specs/.../NNN-name/...)

### Blast classification
- **CONTAINED:** zero external references — safe to delete
- **SHALLOW:** ≤ 3 doc-only references — safe with minimal cleanup
- **MEDIUM:** > 3 references, mostly historical — needs explicit reference-removal in same packet
- **DEEP:** code references / graph references / hardcoded paths — DO NOT DELETE, archive instead

For each delete candidate, run a targeted grep to find references:

```bash
PACKET_PATH=".opencode/specs/.../NNN-packet-name"
PACKET_NAME=$(basename "$PACKET_PATH")

grep -rn "$PACKET_NAME" --include="*.md" --include="*.ts" --include="*.json" --include="*.yaml" \
  .opencode .codex .claude .gemini opencode.json .utcp_config.json 2>/dev/null | \
  grep -v "$PACKET_PATH" | grep -v "999-spec-026-restructure-research" | head -20
```

## Output contract

Print to stdout. Required heading structure:

```
# Iter 048 — Track 11: blast-radius analysis for deletes

## Methodology

## Per-delete blast radius
### Delete candidate 1: <packet-path>
- Confidence (from iter 030): <HIGH | MEDIUM | LOW>
- Reference inventory:
  - Spec doc refs: <count, key examples with file:line>
  - Code refs: <count + examples>
  - Graph refs: <count + examples>
  - Index refs: <count + examples>
  - External refs: <count + examples>
  - Symbolic refs: <count + examples>
- Blast classification: CONTAINED | SHALLOW | MEDIUM | DEEP
- Required cleanup if deleted: <list of files needing reference removal>
- Verdict: PROCEED | PROCEED_WITH_CLEANUP | ABORT (move to archive) | REQUIRES_REVIEW

### Delete candidate 2
<same>

(repeat for every delete candidate from iter 030)

## Aggregate
- Total delete candidates: <N>
- CONTAINED (safe): <count>
- SHALLOW: <count>
- MEDIUM: <count>
- DEEP (do not delete): <count>
- Total cleanup operations needed if all PROCEED + PROCEED_WITH_CLEANUP execute: <int>

## Recommended adjustment to delete list
- Aborted from delete list: <list> (with reason)
- Adjusted to PROCEED_WITH_CLEANUP: <list>
- Confirmed CONTAINED safe: <list>

## JSONL delta row
{"iter_id": "048", "timestamp_utc": "<ISO8601>", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "deletes_evaluated": <int>, "deep_count": <int>, "aborts": <int>, "primary_evidence_files": ["iter-027/028/029/030"]}
```

## Stop conditions

Emit then exit.

## Context

This iter is the safety check before execution. A "HIGH-confidence delete" that has 12 cross-references requires reference cleanup as part of the delete; otherwise the delete creates dangling references. Track 12 / synthesis must respect these verdicts.
