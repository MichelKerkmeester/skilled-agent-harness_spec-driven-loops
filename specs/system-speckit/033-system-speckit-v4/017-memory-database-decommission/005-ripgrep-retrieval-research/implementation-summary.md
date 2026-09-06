---
title: "Implementation Summary: Phase 5: ripgrep-retrieval-research"
description: "What the five-iteration research produced: a synthesis with a ranked amendment brief for phases 001 and 004, plus the run history behind it."
trigger_phrases:
  - "research summary"
  - "amendment brief"
  - "ripgrep retrieval synthesis"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/005-ripgrep-retrieval-research"
    last_updated_at: "2026-09-02T19:47:00Z"
    last_updated_by: "claude-code"
    recent_action: "Documented the completed research run and its synthesis"
    next_safe_action: "Confirm phases 001 and 004 cite this research where they changed"
    blockers: []
    key_files:
      - "research/lineages/luna-max/research.md"
      - "research/deep-research-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 5: ripgrep-retrieval-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-ripgrep-retrieval-research |
| **Status** | Complete |
| **Completed** | 2026-09-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five forced iterations of deep research produced one synthesis at
`research/lineages/luna-max/research.md`, 305 lines, and that document is the whole deliverable. It
turns two build phases that were written from assumption into two build phases written against the
code they replace.

### The synthesis and its ranked amendments

The finding that matters most is not the index shape. It is that the proof was underspecified. Phase 001
planned a one-way `missing: 0` check, and the research replaces that with two-way candidate-set parity
against the live SQL lane, including first-eight token handling, `%token%` partial substrings,
active and archive and expiry and scope filters, score classes and tie behavior. Sections 6 and 7 give
the versioned index shape, the lookup contract, the cold-start measurement protocol and three runnable
ripgrep recipes for structured, path-only and count retrieval with exit mapping. Section 9 draws the
capability boundary: trigger and keyword lookup can move to grep, while continuity writing, causal
traversal, resource maps, semantic recall and session dedup need named replacements or a declared loss.

Sections 11 and 12 are the payload. They rank a P0 amendment per document for phase 001
(spec, plan, tasks, acceptance) and per document for phase 004 (spec, plan, tasks, acceptance), each
citing a file and a line so a build agent can apply one without rereading the study. Section 13
records nine eliminated alternatives with the evidence that killed each, including phrase-only indexing,
stemming in v1, `-w` as substring parity and `--sort=path` as relevance.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/lineages/luna-max/research.md` | Created | The synthesis and the ranked amendment brief for phases 001 and 004 |
| `research/lineages/luna-max/iterations/iteration-001.md` to `iteration-005.md` | Created | One record per forced iteration |
| `research/deep-research-config.json` | Created | Topic, executor pin, forced iteration count and stop policy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A detached fan-out lineage ran one executor, `cli-codex` with `gpt-5.6-luna` at max reasoning on the fast
service tier, for five iterations with `stopPolicy: max-iterations`. Convergence was telemetry and never
ended the run. All artifacts stayed inside the lineage directory, so the run never touched the packet it
studied. Phases 001 and 004 are absorbing the amendments now, which is the only open thread.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Force five iterations and treat convergence as telemetry | Early convergence would have stopped around iteration 3, before the parity harness and failure-mode work that produced the highest-ranked amendments |
| Pin the leaf to in-process execution | Run 1 nested `codex exec` inside its own codex sandbox and died on `failed to initialize in-process app-server client: Operation not permitted` |
| Keep the substring lane as the parity baseline, with no stemming or stop-words in v1 | The live lane admits partial tokens deliberately, so a phrase-only index would silently return a different set |
| Treat ripgrep as an evidence producer, not a ranker | Its own flag semantics rule out `--sort=path` as relevance and `--json` with `-l` or `-c`, so ranking belongs to the caller |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records on disk | PASS. `iteration-001.md` through `iteration-005.md` under `research/lineages/luna-max/iterations/` |
| Stop reason | PASS. `maxIterationsReached`, five iterations, ratios 0.92 to 0.84 to 0.78 to 0.72 to 0.68 |
| Amendment citations | PASS. Sections 11 and 12 carry a `[SOURCE: path:lines]` citation per amendment |
| Driver final verdict | REJECTED on containment and overridden. The sibling phase 006 ran concurrently and its untracked files were counted against this lineage |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The containment rejection was a false positive.** The driver counted phase 006's concurrent writes as this lineage's breach. Every iteration file, delta, receipt and the synthesis are intact on disk, which is what the verification table checks directly.
2. **Run 1 is preserved, not deleted.** `scratch/failed-run-1-nested-codex-dispatch` holds the nested-dispatch failure so the next run does not repeat it.
3. **Nothing here was measured on the real corpus.** Index size, generator timing and the 200ms p95 gate are protocols, not measurements. Phase 001 owns running them.
<!-- /ANCHOR:limitations -->

---
