---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "An exhaustive verify-first sweep (after fixing a shell-mangling grep bug that caused prior false-negatives) proved the 014 CocoIndex/rerank/ccc deprecation residue is closed except a 2-item live-doc tail, now fixed. Records the kept-exceptions and the cross-encoder/027 caveat."
trigger_phrases:
  - "deprecation residue completeness verdict"
  - "coco ccc rerank cleanup closed"
  - "exhaustive sweep methodology bug"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/016-remediate-residue-tail"
    last_updated_at: "2026-05-25T16:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Closed 2-item residue tail; recorded verdict + kept-exceptions"
    next_safe_action: "Commit the residue-tail packet to main"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/README.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-residue-tail-001"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 016-remediate-residue-tail |
| **Completed** | 2026-05-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet ends the wave-by-wave residue hunt with a single exhaustive, verify-first sweep that proves the 014 CocoIndex / rerank-sidecar / ccc deprecation residue is closed — and records *why* the survivors are deliberately kept, so a future session doesn't re-litigate it.

### The methodology fix that mattered
Prior "grep returned 0" claims were unreliable: `-g '!...'` exclude globs built in an unquoted shell variable get mangled by zsh (history-expansion / glob-no-match), silently breaking `rg` under `2>/dev/null` → false-negative "0 residue." The corrected sweep uses **inline single-quoted** `-g '!...'` excludes + **per-token** greps (no fragile mega-alternation) + `--hidden`, cross-checked with raw no-exclude counts. This is the durable lesson: directory sweeps with variable-expanded excludes lie; per-file greps and inline-quoted excludes do not.

### The residue tail (fixed)
- `deep-loop-runtime/lib/deep-loop/README.md` — removed the "Rerank sidecar: `…/sidecar_ledger.py`" helper-list line (`rg --files` confirmed the path is deleted).
- `manual_testing_playbook.md` — reframed a test scenario's "CCC stubs / CCC trio" → "code_graph status/scan/verify handlers" (stale naming for the renamed handlers).

### The completeness verdict
Every other coco/ccc/rerank hit was classified into a KEEP bucket with a named reason (see Known Limitations). The deprecation-residue scope is closed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md` | Modified | drop deleted `sidecar_ledger.py` helper line |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | "CCC stubs/trio" → code_graph handler names |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Sequential-Thinking-driven: enumerated all residue token-classes + all grep pitfalls, ran the corrected exhaustive sweep, then **filesystem-verified every referenced artifact** (`rg --files`) before deciding fix-vs-keep — which is how the cross-encoder zone got correctly deferred (the `ensure-rerank-sidecar.cjs` is gone, but `cross-encoder.ts` is live + wired into stage3, `SPECKIT_CROSS_ENCODER` is still allowlisted, and a `027-xce-research-based-refinement` arc is active). Only the 2 pure-doc dead-path items were changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Narrow "residue" to deleted-EXTERNAL-artifacts; exclude the live rerank pipeline | `rerank`/`cross-encoder` match a LIVE in-process subsystem (stage3 wired); sweeping them would gut memory search |
| DEFER `sidecar-client.ts:170` | It's in the actively-evolving cross-encoder subsystem (027 arc + live allowlist); editing risks colliding with in-flight work — operator should decide |
| Keep accurate-history / frozen / generated refs | Documenting a removal correctly, or a frozen benchmark, is not residue; corrupting frozen data falsifies records |
| Fix only the 2 pure-doc dead-path refs | They point at confirmed-deleted files in live docs with zero subsystem entanglement |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sidecar_ledger` in deep-loop README | PASS — 0 (line removed) |
| "CCC stubs/trio" in playbook scenario | PASS — 0 (reframed to code_graph) |
| Referenced artifacts deleted (`ensure-rerank-sidecar.cjs`, `sidecar_ledger.py`) | PASS — `rg --files` == 0 |
| Live rerank pipeline untouched | PASS — `cross-encoder.ts`/stage3 unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **In-process rerank/MMR pipeline is LIVE, not residue** — `cross-encoder.ts`, `reranker.ts`, `local-reranker.ts`, `stage3-rerank.ts`, `mmr-reranker.ts` (+ ~50 tests). Stage3 is wired in the orchestrator. Untouched.
2. **`sidecar-client.ts:170` deferred** — a JSDoc referencing the deleted `ensure-rerank-sidecar.cjs` + `SPECKIT_CROSS_ENCODER`. The var is still allowlisted and the cross-encoder subsystem is evolving (`027-xce` arc), so this is flagged for operator decision rather than auto-edited.
3. **Accurate-history kept** — `embedder_pluggability.md` "⚠️ Obsolete as of 014" banner; `SKILL.md` / `embedder_architecture.md` / `registry.ts` "removed in 014" notes.
4. **Frozen data kept** — `benchmarks/**`, `observability/smart-router-measurement-*.{jsonl,md}` (`labelSkill:"mcp-coco-index"`); historical records.
5. **Generated artifacts kept** — `scripts/.folder-list.txt` / `.scan-lines.txt` / `.no-frontmatter-list.txt` / `.unscanned.txt` listing historical spec-folder names; regenerate naturally.
6. **Documented operator exceptions kept** — cli-* `pkill ccc search` orphan-sweep; `F-AC3-*` / `409-fixture` frozen test fixtures.
7. **Open question (separate scope)** — whether the in-process cross-encoder is dormant-dead vs conditionally-live is a dead-code question for the rerank pipeline, not deprecation residue; warrants a dedicated review if desired.
<!-- /ANCHOR:limitations -->
