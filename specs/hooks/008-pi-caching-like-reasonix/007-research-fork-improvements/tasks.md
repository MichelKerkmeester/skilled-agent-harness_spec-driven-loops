---
title: "Tasks: Further Improvements for the deep-pi and pi-cache-optimizer Forks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fork improvement research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/007-research-fork-improvements"
    last_updated_at: "2026-08-08T05:52:36Z"
    last_updated_by: "spec-author"
    recent_action: "4th lineage (deepseek-v4-flash/opencode-go) added and folded into research.md"
    next_safe_action: "Operator decides whether findings warrant an 008 implementation phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-007-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Further Improvements for the deep-pi and pi-cache-optimizer Forks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolved the fan-out config: 3 executors (sol/luna/grok), 7/7/6 iterations, concurrency 3; validated as JSON before use
- [x] T002 Created `007-research-fork-improvements/spec.md` (Level 2, phase child of 039) and updated `006/spec.md`'s Successor field to point to it
- [x] T003 Acquired the packet's advisory lock via `loop-lock.cjs acquire`, created `research/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Invoked `/deep:research:auto` through the Skill tool with the full fan-out flag set (research topic, `--spec-folder`, `--max-iterations=20`, `--stop-policy=max-iterations`, 3x `--executor` blocks, `--concurrency=3`)
- [x] T005 Read `deep-research-auto.yaml`'s `step_fanout_spawn_cli` and `fanout-run.cjs`'s own arg parser directly before dispatch — found and fixed a real gap: the YAML's literal command template never forwards `--stop-policy` to the script, even though the script accepts and uses it. Added the flag directly to the manual invocation rather than trusting the documented flag on faith
- [x] T006 Dispatched `fanout-run.cjs` in the background (`nohup`+`disown`), armed a persistent Monitor on the orchestration ledger (progress + terminal events)
- [x] T007 Investigated an apparent sol "stall" (only luna showing in monitor notifications for 7+ minutes) directly via `ps` and sol's own `state.jsonl` — confirmed false alarm, sol was actively running with continuous real progress; the gap was the monitor script's own single-line-per-check display, not a real hang
- [x] T008 Investigated sol's eventual "failed" terminal ledger event directly rather than accepting the summary at face value: confirmed via `state.jsonl` that sol's actual research completed cleanly (7/7 iterations, `synthesis_complete`, 35 findings) before a post-synthesis continuity-sync step attempted 3 out-of-scope writes into sibling packet 006 and the repo-wide `specs/descriptions.json`; confirmed via `git diff` that the write-containment guard reverted all 3 cleanly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Pulled each lineage's `findings-registry.json` directly (sol: 35 findings, luna: 28, grok: 7 curated + P0/P1/P2 backlog) and cross-matched by semantic content into 3 convergence tiers
- [x] T010 Authored `research/research.md`: Tier 1 (all 3 lineages independently found it), Tier 2 (2 of 3), Tier 3 (single-lineage, well-evidenced), a ruled-out-directions section, and a priority-ranked P0/P1/P2 action list cross-validated against all 3 lineages' own prioritization output
- [x] T011 Released the advisory lock via `loop-lock.cjs release` with the exact acquire nonce (plain owner-pid release failed silently until the nonce was supplied — confirmed via the lock file's own recorded `acquire_nonce`)
- [x] T012 Reconciled `007/spec.md`'s frontmatter/status/open-questions to the real outcome (100% complete, sol's administrative-vs-research distinction stated explicitly)
- [x] T013 Reconciled the 039 parent's `spec.md`: found and fixed a pre-existing staleness bug unrelated to this phase (phase 6 had shipped Complete on 2026-08-07 but the parent's frontmatter/Phase Documentation Map still said "Draft, awaiting SOL review") — updated phase 6's row to Complete, added phase 7's row, added the 006→007 Phase Handoff Criteria row, resolved 3 stale planning-time Open Questions
- [x] T014 Regenerated `description.json`/`graph-metadata.json` for 006, 007, and the 039 parent
- [x] T015 `validate.sh --recursive --strict` on the whole 039 packet: first pass surfaced 1 error on 006 (stale generated metadata, fixed by T014's regen) and 3 errors + 2 warnings on 007 (missing Level-2 files, thin requirements table) — fixed by authoring this file plus `checklist.md`/`implementation-summary.md` and adding 2 more genuine P1 requirements; re-run confirmed 0 errors/0 warnings across all 8 folders
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: 4th Lineage Addition (Operator Request)

- [x] T016 Re-acquired the packet's advisory lock (using the exact acquire nonce, matching T011's earlier finding that plain owner-pid release/acquire fails silently once a nonce is on record); backed up the existing 3-lineage `orchestration-summary.json` before re-running the fan-out dispatcher against the same `research/` directory
- [x] T017 Confirmed `opencode-go/deepseek-v4-flash` as a real, live-verified model id (cli-opencode's own `providers-and-models.md` reference, not assumed) before composing the dispatch; read `cli-opencode/SKILL.md` first per the CLI dispatch preload rule
- [x] T018 Dispatched a single-executor fan-out (cli-opencode, `opencode-go/deepseek-v4-flash`, 4 iterations, label `deepseek-flash`) targeting the same `--base-artifact-dir`, briefing it explicitly to read the existing `research/research.md` and corroborate-or-refute rather than restate it
- [x] T019 Caught and fixed a real bug in my own monitor script mid-run: a `\|` BRE alternation pattern doesn't work the same on macOS/BSD `grep` as on GNU `grep`, causing a false "DONE" signal after only the lineage's `started` event. Verified this directly (real state file showed only 1 event, process still alive) before trusting any completion signal, switched to `grep -E` with proper `|` alternation, and confirmed the fix against a live 0-count check before re-arming
- [x] T020 Verified the real terminal state directly rather than trusting the ledger event alone: `state.jsonl` shows 4/4 iterations, `synthesis_complete`, `stopReason: maxIterationsReached`, 20 findings — confirming the manually-added `--stop-policy` fix (T005 from the first pass) also works correctly for a cli-opencode lineage, not just cli-codex/cli-cursor
- [x] T021 Pulled the 4th lineage's `findings-registry.json` and re-synthesized `research/research.md`: upgraded 3 findings to 4-lineage corroboration, added a new Tier 1 correctness finding (deep-pi's cold-start cache write is invisible to its own telemetry), issued one real correction (downgrading sol's `f-deeppi-cas-gap` TOCTOU severity after the 4th lineage traced `atomicWriteFile`'s actual post-rename verification), and added a Tier 4 section for 6 more genuinely new findings not caught by the first 3 lineages — including the lineage's own self-correction of a false negative from its first iteration
- [x] T022 Updated the priority-ranked action list to fold in the new P0 correctness bugs (cold-start telemetry, report-command side effect) rather than leaving them stranded in the findings tiers with no action-list representation
  Evidence: `research/research.md`'s priority-ranked list now has 13 items (was 9) with items 1 and 4 being the two new P0 correctness bugs, and a closing note explaining why sol's `f-deeppi-cas-gap` was intentionally dropped from the list.
- [x] T023 Released the advisory lock with the correct nonce; regenerated `description.json`/`graph-metadata.json`; re-ran `validate.sh --recursive --strict` on the whole 039 packet; cleaned up the scratchpad dispatch script/log
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 3 lineages' real research output verified directly against their own state files, not trusted from summary events alone
- [x] `validate.sh --recursive --strict` on the whole 039 packet: 0 errors, 0 warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../006-fork-and-improve-deep-pi/`
<!-- /ANCHOR:cross-refs -->
