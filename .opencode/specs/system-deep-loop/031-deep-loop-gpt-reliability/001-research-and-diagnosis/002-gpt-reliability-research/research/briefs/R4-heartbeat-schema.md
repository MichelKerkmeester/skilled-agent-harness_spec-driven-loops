# Research Brief R4 — Heartbeat/checkpoint record schema for structured modes

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the design.

## Context (verified by prior research)

Structured modes stall compliantly: council licenses simulate-all-seats-then-
persist (per-seat writes only at phase 4); context's parallel sweep barrier-
joins with no mid-sweep appends; review/improvement count only COMPLETE
end-of-iteration records so budget-killed correct work earns zero credit; the
benchmark watchdog resets on output OR artifact mtime. Improvement resume is
unshipped (lineage 'new' only) so checkpoints currently aid liveness, not
continuation.

## Your task — design ONE shared progress-record convention

Read (repo-root relative):
1. `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/state_format.md`
   — the existing council state-record schema/versioning rules.
2. `.opencode/commands/deep/assets/deep_context_auto.yaml` lines 400-550 — the
   sweep steps where per-seat appends would land.
3. `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl`
   lines 70-120 — the current completion-record contract it must NOT collide with.

Deliverables:
1. **Progress-record schema** (one JSONL shape usable by council/context/review/
   improvement): type name that completion reducers ignore by default, fields
   (phase, step, seat/unit id, started|completed, timestamp, optional artifact
   path), and the rule for when a step MUST emit one (any step expected to run
   >60s without another write).
2. **Insertion points**: for council (seat/critique/adjudication steps) and
   context (sweep launch + per-seat settle) — exact step names from the files
   with before/after excerpt for ONE representative step each.
3. **Reducer safety**: the one-line rule that keeps existing reducers correct
   (ignore unknown types? or explicit allowlist?) grounded in state_format.md's
   compatibility rules.
4. **Watchdog interplay**: why this resets no-progress kills without masking
   real stalls (progress records require actual step transitions), and which
   033 cells verify (ACB-004/005, CXB-004 liveness; IMB-001-high partial credit).

## Output contract (strict)
Markdown, no preamble, sections DELIVERABLE 1-4, cite file:line. One schema,
not four.
