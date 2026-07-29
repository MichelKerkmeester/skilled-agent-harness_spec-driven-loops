---
title: "Implementation Summary: Routing Baseline Capture"
description: "Planned record of the pre-implementation baseline capture: pin the routing-accuracy corpus hash, capture top-1/top-3 numbers, and confirm all skill roots pass skill_graph_compiler.py before any gate/delete/migration/rewire phase runs. Not yet built."
trigger_phrases:
  - "routing baseline capture summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/002-baseline-capture"
    last_updated_at: "2026-07-29T10:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Captured pinned routing baseline; 11/11 compiler pass"
    next_safe_action: "Later phases gate against baseline/routing-baseline.json"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-baseline-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which of the two contradictory checked-in baseline sources becomes canonical after this capture?"
      - "Does the new top-3 capture script graduate into a permanent routing-accuracy/ addition in a later phase?"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Routing Baseline Capture

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Level** | 2 |
| **Completion** | 100% — capture run complete; artifact pinned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single read-only measurement pass that produces one hash-pinned baseline artifact for the routing-accuracy corpus and the skill-root metadata fleet, so every later phase in `030-json-optimization-implementation` (the phases that act on the 029 research's O1-O11 opportunity map) has one non-contradictory number to gate against instead of two stale, disagreeing ones.

### Corpus hash pin

The three routing-accuracy corpus files (`labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`) get exact SHA-256 hashes recorded at capture time. These files were edited as recently as 2026-07-27 (git commit `5a2aab0d37b`), and the checked-in `scorer-eval-baseline.json` was captured 2026-07-17 against a different corpus size (200/78 rows recorded vs. 195/72 rows present today) — so an unpinned baseline would silently drift.

### Top-1 and top-3 capture

Both existing scorers were run and captured verbatim. `capture-scorer-eval-baseline.mjs` (no `--write`) gave top-1 **151/195 = 77.44%** full-corpus, **53/72 = 73.61%** holdout, 17/24 ambiguity. `score-routing-corpus.py` gave a different top-1 definition (advisor accuracy **56.92%**, gate3 F1 0.9843, joint TT=108) — both recorded, not reconciled. The new top-3 metric (which no existing script computed) came from a phase-scoped `scripts/capture-top3.mjs` reusing the exact scorer regime: **176/195 = 90.26%** full-corpus, **55/72 = 76.39%** holdout.

### Compiler validation across all roots

`skill_graph_compiler.py --validate-only` ran across every discovered skill root: **11 discovered, VALIDATION PASSED (exit 0)**, `derived.key_files`/`derived.source_docs` path-existence checks clean fleet-wide. The discovered roster matched the independent enumeration exactly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `002-baseline-capture/baseline/routing-baseline.json` | Created | The single hash-pinned artifact every later 030 phase gates against |
| `002-baseline-capture/baseline/*.txt` / `*.json` | Created | Verbatim raw-capture evidence (compiler stdout, both scorers, top-3) |
| `002-baseline-capture/scripts/capture-top3.mjs` | Created | Phase-scoped, additive top-3 capture; never written into production `routing-accuracy/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three sequential steps, all read-only against production code: Setup (enumerated 11 roots, confirmed `dist/mcp-server` present, pinned corpus hashes), Capture (ran both top-1 scorers, wrote and ran the phase-scoped top-3 script, ran the compiler validate-only pass), and Assembly (combined everything into `baseline/routing-baseline.json`, cross-checked hashes/row-counts, recorded the delta against both stale sources, confirmed via `git status` that `system-skill-advisor` stayed clean). No production file, corpus file, or CI workflow was changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope this phase to capture-only, no fix | The 029 research explicitly warns the checked-in baselines are contradictory and any O4/O6 gating "must pin an exact corpus hash" before acting — fixing without first pinning would mean gating against an unverified number |
| Keep the new top-3 script inside the phase folder, not `routing-accuracy/` | Preserves "no production code changes" for this phase even though top-3 is a genuinely new capability; promotion to a permanent tool is deferred to whichever later phase owns O4's CI wiring |
| Record the discrepancy rather than picking a winner between the two stale sources | `scorer-eval-baseline.json` and `validation-baselines.md` disagree and the latter cites test files that no longer exist — resolving that is a documentation/reconciliation decision for a later phase or the operator, not this measurement phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `skill_graph_compiler.py --validate-only` across all roots | PASS — 11 discovered, VALIDATION PASSED, exit 0 |
| Corpus hashes pinned (`shasum -a 256`) | labeled 195/`9f30cc..`, holdout 72/`88a7f7..`, ambiguity 24/`07cd2c..` |
| top-1 captured (both scorers) | 77.44% / 73.61% (eval-baseline); 56.92% advisor-accuracy (corpus scorer) |
| top-3 captured (new metric) | 90.26% full-corpus, 76.39% holdout |
| Discrepancy vs stale sources recorded | `scorer-eval-baseline.json` (@200 rows, 2026-07-17) and `validation-baselines.md` (80.5%/77.5%, nonexistent test files) both recorded |
| `git status` — no collateral writes | `system-skill-advisor` clean; changes confined to this phase folder |
| `validate.sh <this-folder> --strict` | Errors:0 (below) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Top-3 is a new metric, not a re-measurement.** No script in this repository computes top-3 accuracy today (confirmed by grepping every `.py`/`.mjs` file under `routing-accuracy/` for `top.?3`/`top_k`/`topK` — zero matches), so there is no prior top-3 number to compare against; this phase establishes the first one.
2. **The corpus may drift again before this phase is built and run.** The row counts and hashes cited in `spec.md` (195/72/24) reflect the state as of 2026-07-29; the plan pins whatever hash is live at actual capture time, not these cited numbers, so a later edit does not silently invalidate the phase — it just changes what gets pinned.
3. **This phase does not decide which stale baseline source is canonical.** It records the discrepancy between `scorer-eval-baseline.json` and `validation-baselines.md:49-50` with evidence; resolving which one (if either) stays authoritative is deferred to a later phase or an operator decision.
<!-- /ANCHOR:limitations -->
