---
title: "Research Phase: Further Improvements for the deep-pi and pi-cache-optimizer Forks"
description: "Three-executor deep research (GPT-5.6 SOL high fast, GPT-5.6 LUNA max fast via cli-codex; Grok 4.5 high fast via cli-cursor) over 20 non-converging iterations that find concrete, evidence-based improvement opportunities for both packet-039 forks — correctness, test coverage, telemetry/observability, cost-economics, and maintainability — building on 003's and 006's already-recorded open limitations."
trigger_phrases:
  - "improve deep-pi further"
  - "improve pi-cache-optimizer further"
  - "fork improvement research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/007-research-fork-improvements"
    last_updated_at: "2026-08-08T07:03:28Z"
    last_updated_by: "spec-author"
    recent_action: "Successor set to 008-implement-fork-improvements"
    next_safe_action: "Operator selects which 008 child phase to implement first"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-007-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Findings warranted a follow-up phase: 008-implement-fork-improvements decomposes the 13-item action list into 3 planning-only children matching its own P0/P1/P2 tiers. Whether any child is implemented remains an operator decision."
      - "Split: 20 total (sol=7, luna=7, grok=6), forced full depth via --stop-policy=max-iterations; confirmed per lineage's own stopReason=max_iterations, not assumed."
      - "3 lineages: sol 35, luna 28, grok 7+backlog findings, synthesized by convergence tier. sol's admin 'failed' tag is from a reverted post-synthesis write, not its research (complete, included)."
      - "4th lineage added 2026-08-08: deepseek-v4-flash/opencode-go, 4 iters, confirmed 4/4 complete, 20 findings. Corroborated 3 Tier-1 findings, added 7 new, issued 1 correction (downgraded a TOCTOU claim), self-corrected its own iter-1 false negative."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase: Further Improvements for the deep-pi and pi-cache-optimizer Forks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of N |
| **Predecessor** | 006-fork-and-improve-deep-pi |
| **Successor** | 008-implement-fork-improvements |
| **Handoff Criteria** | All 24 iterations (7 sol + 7 luna + 6 grok + 4 deepseek-v4-flash) logged with real findings; `research/research.md` synthesizes correctness/coverage/observability/economics/maintainability opportunities for both forks with citations; no fabricated findings — met, confirmed against each lineage's own state.jsonl and findings-registry.json |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 039 shipped two working forks — `pi-cache-optimizer` (003, DeepSeek-guarded) and `deep-pi` (006, hardened DeepSeek-direct telemetry) — both verified live and benchmarked. Neither fork's future improvement surface has been researched: known gaps already on record (deep-pi's `/deeppi` report not observable non-interactively even via `pi --mode rpc`; deep-pi keeps no persistent stats file; one live regression substituted a source-level test for a missing credential; pi-cache-optimizer's cold-start behavior for newly-added models is uncharacterized) are disclosed limitations, not researched opportunities.

### Purpose
Run a genuine 3-executor, cross-model deep-research pass — not a single model's opinion — to surface concrete, evidence-based improvement opportunities for both forks across correctness, test coverage, telemetry/observability, cost-economics, and maintainability. Report findings only; any resulting implementation is a separate follow-up phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research (not implement) improvement opportunities in `.pi/extensions/pi-cache-optimizer/` and `.pi/extensions/deep-pi/`, and their specs at `../003-fork-and-guard-cache-optimizer/` and `../006-fork-and-improve-deep-pi/`
- Four independent, non-early-converging lineages: `gpt-5.6-sol` (high, fast, cli-codex, 7 iterations), `gpt-5.6-luna` (max, fast, cli-codex, 7 iterations), Grok 4.5 (`cursor-grok-4.5-high-fast`, cli-cursor, 6 iterations), and `deepseek-v4-flash` via `opencode-go` (cli-opencode, 4 iterations, added after the first synthesis specifically to corroborate or refute it) — 24 iterations total, forced to full depth
- Synthesis of all four lineages' findings into one `research/research.md`, with agreement/disagreement across executors noted explicitly, including any corrections a later lineage makes to an earlier one

### Out of Scope
- Implementing any recommended fix — this phase reports findings only
- Re-litigating 001/002's original Reasonix feasibility research or the 003/004 fork/adopt decisions, both already closed
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 24 iterations run to completion across 4 lineages, no early convergence | `research/lineages/{sol,luna,grok,deepseek-flash}/` each show their full assigned iteration count in state logs |
| REQ-002 | Findings synthesized with real citations, not fabricated | `research/research.md` cites actual file paths/line numbers/commands for every claim |
| REQ-003 | Cross-executor agreement/disagreement is reported, not hidden | Synthesis explicitly notes where lineages converged on the same finding vs. diverged |
| REQ-004 | Any workflow-level defect discovered while running this phase is disclosed against the workflow, not silently worked around | `spec.md` §6 records the `--stop-policy` non-forwarding gap and the lineage write-containment finding, both with real evidence |
| REQ-005 | A priority-ranked action list is produced from the findings, not left as an unordered dump | `research/research.md`'s closing section ranks P0/P1/P2 actions, cross-validated against all 3 lineages' own prioritization output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A concrete, ranked list of improvement opportunities exists for both forks, each backed by a real source citation
- **SC-002**: No finding is accepted into the synthesis without at least one lineage's independent evidence
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 003/006 forks already shipped and live-verified | Research needs a real, working baseline to critique | Both confirmed Complete and pushed to `origin/skilled/v4.0.0.0` before this phase started |
| Risk | The auto workflow's `step_fanout_spawn_cli` command template does not forward `--stop-policy` to `fanout-run.cjs`, even though the script itself accepts that flag | Without it, fan-out lineages could default to `stopPolicy=convergence` and stop before their assigned iteration count | Added `--stop-policy=max-iterations` directly to the manual `fanout-run.cjs` invocation for this run; worth a separate bug report against the YAML asset, tracked as an open note here rather than silently worked around |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **RESOLVED (2026-08-08):** the findings did warrant a follow-up phase. `../008-implement-fork-improvements/` decomposes `research/research.md`'s 13-item priority-ranked action list into 3 child phases whose boundaries are the research's own tiers — 001 correctness floor (the 4 P0 items), 002 observability and economics (the 5 P1 items), 003 maintainability and provenance (the 4 P2 items). That phase is planning only: it authored specs, not code. Whether any child is actually implemented is still an operator decision, now tracked there rather than here.

A second, workflow-level gap surfaced during this run, independent of the fork findings above: `/deep:research:auto`'s own `step_fanout_spawn_cli` template doesn't forward `--stop-policy` to `fanout-run.cjs` (see §6); and separately, a lineage's own post-synthesis continuity-sync step attempted an out-of-scope write outside its lineage sandbox (safely caught and reverted by the write-containment guard, but worth a fix so it isn't relying on that guard). Both are disclosed here as real findings against the deep-research workflow itself, not against either fork.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../006-fork-and-improve-deep-pi/spec.md`
- **Related**: `../003-fork-and-guard-cache-optimizer/spec.md`, `../006-fork-and-improve-deep-pi/spec.md` (the two forks under research)
