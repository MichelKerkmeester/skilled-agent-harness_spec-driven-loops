---
title: "Implementation Summary: Phase 5 foldin-prompt-models"
description: "Folded sk-prompt-models into sk-prompt/prompt-models via one atomic bundle; the hub is now fully canon-clean."
trigger_phrases:
  - "prompt-models foldin summary"
  - "phase 005 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/005-foldin-prompt-models"
    last_updated_at: "2026-07-09T16:35:00Z"
    last_updated_by: "claude"
    recent_action: "Atomic bundle executed; retroactively closed a phase-003 gap"
    next_safe_action: "Proceed to phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-prompt-models"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "parent-skill-check.cjs sk-prompt: 0 invariant failures, 0 warnings — matches sk-code/sk-design/system-deep-loop/sk-doc"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-foldin-prompt-models |
| **Completed** | 2026-07-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

This was the highest-risk phase in the program — a 2,616-file directory move bundled atomically with the two hardcoded functional path repoints and the `/deep:model-benchmark` write-target repoint, so no window existed where a live consumer pointed at a dead path. The bundle held: `sk-prompt` now passes `parent-skill-check.cjs` with 0 failures and 0 warnings, matching the other three canonical hubs three phases ahead of schedule.

### Atomic Relocation Bundle

`git mv .opencode/skills/sk-prompt-models .opencode/skills/sk-prompt/prompt-models` moved the entire tree — including the live `benchmarks/` write target — as one git-tracked rename. Before deleting the packet's own `graph-metadata.json` (identity dissolution), its `enhances → cli-opencode` edge (raised from the hub's existing `0.4` to the packet's stronger empirical `0.8`) and its rich domain/intent-signal/trigger-phrase content were folded into the hub's `graph-metadata.json`. The two hardcoded `model_profiles.json` path joins (`executor-delegation.ts` + its compiled `dist/js`, and `skill_advisor.py`) and all 20 `/deep:model-benchmark` write-target lines (across the command doc and 2 YAML workflow assets) were repointed in the same pass — no separate commit boundary between the move and these repoints.

### Internal Packet Consistency

Beyond the bundle's required scope, also fixed the packet's own internal relative-path references (9 files: `SKILL.md`, `pattern_index.md`, `cli_prompt_quality_card.md`, and 6 `references/models/*.md` files) — the packet nested one directory level deeper than before, so every cross-skill relative link needed either an extra `../` (external siblings like `cli-opencode`) or a same-hub sibling repoint (to `prompt-improve/`). Also bulk-normalized ~30 self-identity prose mentions of `sk-prompt-models` to `prompt-models`, and fixed two now-broken references to the deleted packet-level `graph-metadata.json` (repointed to the hub's).

### Retroactive Gap Fix

Running `parent-skill-check.cjs` on the fully-populated hub surfaced a phase-003 miss: the hub-level `changelog/`, `manual_testing_playbook/`, and `benchmark/` companion directories (required by the parent-hub doctrine at scaffold time) were never created. Closed additively here — hub changelog `v1.0.0.0.md` documenting the whole fold-in, a hub-routing manual-testing playbook (4 scenarios: `SP-001..004`), and a `benchmark/.gitkeep` placeholder for phase 007's Lane-C run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt-models/*` (2,616 files) | Moved (git mv) | Relocated into `sk-prompt/prompt-models/` |
| `sk-prompt/prompt-models/graph-metadata.json` | Deleted | Identity dissolution |
| `sk-prompt/graph-metadata.json` | Modified | Folded edges/domains |
| `executor-delegation.ts` + compiled `dist/js`, `skill_advisor.py` | Modified | Hardcoded path repoint |
| `model-benchmark.md` + 2 YAML assets | Modified | Write-target repoint (20 lines) |
| 9 packet-internal files | Modified | Relative-path depth correction |
| `sk-prompt/{changelog/v1.0.0.0.md, manual_testing_playbook/, benchmark/.gitkeep}` | Created | Retroactive phase-003 gap fix |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Every sub-step verified before moving to the next: `git status` rename detection confirmed the move landed as a rename not a delete+add; `test -f`/`test -d` confirmed both repointed targets exist on disk; grep re-sweeps confirmed zero remaining old-path hits in the named consumers; `parent-skill-check.cjs` was the final gate, run twice (once surfacing the phase-003 gap, once confirming 0/0 after the fix).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Fold edges into the hub's graph-metadata.json BEFORE deleting the packet's own file | Doing it in the other order risks losing the edge content if interrupted mid-phase; source-then-delete is the safe sequencing. |
| Fix internal packet cross-references beyond the bundle's literal task list | The 9 files' relative paths were objectively broken by the extra nesting depth — leaving them broken would silently degrade the packet's own documentation the first time someone followed a link. |
| Close the phase-003 gap now rather than deferring to phase 008 | It's purely additive (3 new directories/files, zero relocation risk) and the check was already run as part of this phase's own verification — deferring would mean re-discovering the same gap later. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `git status` rename detection | PASS — whole-tree rename, not delete+add |
| Hardcoded path-join targets exist on disk | PASS — `test -f` on `assets/model_profiles.json` at the new path |
| Model-benchmark write target exists | PASS — `test -d` on `benchmarks/` at the new path, 2,585 files |
| `parent-skill-check.cjs .opencode/skills/sk-prompt` (first run) | 3 FAILs (hub-level changelog/manual_testing_playbook/benchmark missing — phase 003 gap) |
| `parent-skill-check.cjs .opencode/skills/sk-prompt` (after gap fix) | **PASS — 0 invariant failures, 0 warnings** |
| `validate.sh 005-foldin-prompt-models --strict` | Run after this summary — see phase folder validation output |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **The broader ~50-file documentation referrer sweep is NOT done here.** This phase only touched the bundle-critical functional paths (2 hardcoded call sites, model-benchmark automation) plus the packet's own internal references. The remaining prose/documentation referrers (cli-opencode docs, system-deep-loop docs, playbook cross-references, install guides, root AGENTS.md/README.md) are explicitly phase 006's scope.
2. **The hub-level manual-testing playbook (`SP-001..004`) is newly authored, not yet executed.** It describes the expected routing behavior but hasn't been run against a live dispatch in this session.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

