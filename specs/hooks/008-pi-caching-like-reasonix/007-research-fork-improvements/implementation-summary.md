---
title: "Implementation Summary: Further Improvements for the deep-pi and pi-cache-optimizer Forks"
description: "Execution summary for the 3-executor, 20-iteration deep-research run finding concrete improvement opportunities for both packet-039 forks."
trigger_phrases:
  - "fork improvement research summary"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/007-research-fork-improvements"
    last_updated_at: "2026-08-11T06:43:18.558Z"
    last_updated_by: "spec-author"
    recent_action: "Successor set to 008-implement-fork-improvements"
    next_safe_action: "Operator selects which 008 child phase to implement first"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/lineages/sol/research.md"
      - "research/lineages/luna/research.md"
      - "research/lineages/grok/research.md"
      - "research/lineages/deepseek-flash/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-007-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "20 iterations interpreted as 20 total (not 20 each), split 7/7/6 across sol/luna/grok, per the operator's explicit answer to a consolidated clarifying question."
---
# Implementation Summary: Further Improvements for the deep-pi and pi-cache-optimizer Forks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-research-fork-improvements |
| **Executed** | 2026-08-08 |
| **Level** | 2 |
| **Execution Mode** | `/deep:research:auto` fan-out, manually driven (setup + `fanout-run.cjs` dispatch + synthesis), through `cli-codex` (sol, luna) and `cli-cursor` (grok) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A real, evidence-grounded improvement roadmap for both packet-039 forks — not from one model's opinion, but from three genuinely independent models (`gpt-5.6-sol`, `gpt-5.6-luna`, Grok 4.5) each running a full research loop against the real source, cross-checked against each other.

### The run
20 iterations total, split 7/7/6 across the first three lineages, forced to full depth via a manually-added `--stop-policy max-iterations` flag (the command's own YAML asset doesn't forward this flag by default — see Known Limitations). All three lineages produced real, cited findings: sol (35 findings), luna (28 findings), grok (7 curated findings plus a P0/P1/P2 backlog). At operator request, a 4th lineage was added afterward — `deepseek-v4-flash` via `opencode-go` (cli-opencode, 4 iterations, 20 findings) — explicitly briefed to read the existing synthesis and corroborate or refute it, not restate it. 24 iterations total across 4 genuinely independent models.

### The synthesis
`research/research.md` groups every finding by how many lineages independently reached it — Tier 1 (all 4), Tier 2 (2-3 of 4), Tier 3/4 (single-lineage but well-evidenced) — rather than just concatenating four reports. The strongest, highest-confidence findings: a duplicated DeepSeek-ownership predicate across both forks with no shared source of truth (now corroborated a 4th time); `/deeppi`'s report still being UI-notify-only (the same limitation disclosed in 006, now with a concrete, 4-model-agreed fix direction); deep-pi's complete lack of a persistent stats file; cost/savings arithmetic that's a counterfactual estimate, not a causal measurement, in both forks; and missing boundary/composition tests for both. The 4th lineage's own independent read did more than corroborate: it found deep-pi's cold-start cache write is entirely invisible to its own telemetry (a real correctness bug, not just an uninstrumented economics question), issued a genuine correction downgrading an earlier TOCTOU severity claim after tracing the actual `atomicWriteFile` post-rename verification, and caught its own false negative on its final iteration. A closing priority-ranked action list is cross-validated across all four models — grok's own backlog, sol's final "adversarial prioritization" iteration, luna's staged-order finding, and deepseek-flash's corroboration all converge on the same P0→P1→P2 ordering, updated to include the new correctness bugs the 4th pass surfaced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `007-research-fork-improvements/{spec,plan,tasks,checklist,implementation-summary}.md` | Created | Full Level 2 phase-child documentation |
| `007-research-fork-improvements/research/*` | Created (runtime-owned) | Per-lineage state/iterations/findings-registries + top-level `research.md` synthesis |
| `006-fork-and-improve-deep-pi/spec.md` | Modified | Successor field updated to point at 007 |
| `008-pi-caching-like-reasonix/spec.md` | Modified | Fixed pre-existing staleness (phase 6 marked Draft, was actually Complete since 2026-08-07) and added phase 7's row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Invoked `/deep:research:auto` through the Skill tool with the full fan-out flag set resolved up front (Tier 1: no clarifying questions needed at command level, since every required field was already bound from the flags). Rather than trust the command's YAML asset to correctly wire every flag, its `step_fanout_spawn_cli` step and `fanout-run.cjs`'s own CLI parser were read directly before dispatch — this caught a real gap (`--stop-policy` isn't forwarded by the literal command template) that would have silently defeated the operator's explicit "no early convergence" requirement had it gone unchecked. The flag was added directly to the actual `fanout-run.cjs` invocation instead.

The run itself was dispatched in the background (`nohup`+`disown`) with a persistent Monitor watching the orchestration ledger, so the many minutes of real per-iteration work didn't require active polling. Two anomalies surfaced during the run and were both investigated with real commands rather than assumed: an apparent stall on the `sol` lineage (false alarm — the monitor script's own single-line display was hiding sol's real, continuous progress, confirmed via `ps` and its `state.jsonl` directly), and `sol`'s eventual "failed" terminal status (confirmed via its own state file that the actual 7-iteration research had already completed cleanly before a later, separate continuity-sync step attempted an out-of-scope write that the fan-out's write-containment guard correctly caught and reverted).

Synthesis pulled each lineage's `findings-registry.json` directly rather than just their narrative `research.md` files, to cross-match findings by semantic content into convergence tiers with confidence, not by re-reading and re-interpreting three long prose documents.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| 20 total (7/7/6), not 20 each (60 total) | Operator's explicit answer to a consolidated clarifying question, balancing cost against still having real per-model depth |
| Forced full depth via `--stop-policy max-iterations` | Operator wanted a genuine 3-way comparison at equal depth; verified afterward via each lineage's own `state.jsonl` that this actually worked (grok's declining 0.95→0.55 convergence trend would have triggered an early stop under the default policy) |
| Grok routed via cli-cursor (`cursor-grok-4.5-high-fast`) | Grok isn't a native deep-research executor kind; cli-cursor is the sanctioned fan-out adapter for it, confirmed against the real model allowlist before dispatch, not assumed |
| Included sol's findings despite its "failed" lineage status | Its research was independently confirmed complete (7/7 iterations, real `synthesis_complete` event, 35 findings) before an unrelated, later, safely-reverted write violation — discarding a genuinely complete research run because of an administrative status flag would have thrown away real evidence |
| Fixed the 039 parent's pre-existing staleness in the same pass | Found while updating the Phase Documentation Map for 007 — phase 6 had shipped Complete on 2026-08-07 but the parent's frontmatter still said "Draft, awaiting SOL review"; leaving it would mean the very next resume would rebuild context from a wrong status |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration counts per lineage | PASS — 7, 7, 6, 4 real files, matching the assigned split exactly across all 4 lineages |
| Stop policy actually enforced | PASS — all 4 lineages' own state confirms `max_iterations`/`maxIterationsReached`, not early convergence, including the cli-opencode-executed 4th lineage |
| sol's write-containment revert | PASS — `git diff` on all 3 attempted out-of-scope paths shows clean, matching the guard's own claim |
| Findings are cited, not fabricated | PASS — spot-checked citations against real repo source during synthesis, including the 4th lineage's correction and new findings |
| Monitor script false-completion bug | PASS — caught before being trusted; a BSD-grep `\|` alternation bug produced a false "DONE" signal after only the started event; verified real state directly, fixed the pattern, re-confirmed against a live 0-count check |
| Secret scan on research artifacts | PASS — zero matches |
| `validate.sh --recursive --strict` (whole 039 packet) | PASS — 0 errors, 0 warnings across parent + 7 children, after fixing a stale-metadata error on 006 and 3 errors/2 warnings on 007's initial thin documentation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`/deep:research:auto`'s YAML asset doesn't forward `--stop-policy` to `fanout-run.cjs` by default.** Confirmed by reading both files directly, not assumed. Worked around here by adding the flag to the manual invocation; the underlying YAML template (`step_fanout_spawn_cli` in `deep-research-auto.yaml`) should be fixed so future fan-out research runs get this by default rather than needing the same manual read-and-patch every time.
2. **A deep-research lineage's own post-synthesis continuity-sync step isn't containment-aware in fan-out mode.** sol's lineage attempted to write into a sibling packet's metadata after its own research was already complete. The write-containment guard caught and reverted it correctly this time, but the underlying step should scope its own writes to `{artifact_dir}` rather than relying on the guard as the only backstop.
3. **This research is itself a counterfactual estimate of value, not a validated implementation.** Every finding here is a real, cited opportunity — none has been built or tested yet. Whether any of it is worth an implementation phase 8 is an explicit open operator decision, not something this phase resolves.
<!-- /ANCHOR:limitations -->
