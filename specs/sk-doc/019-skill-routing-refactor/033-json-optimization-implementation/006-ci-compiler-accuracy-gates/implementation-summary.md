---
title: "Implementation Outcome: Wire Compiler + Routing-Accuracy Gates into CI"
description: "Shipped: skill_graph_compiler.py --validate-only runs in the lean routing-drift job and score-routing-corpus.py runs in the golden-prompt-gate job behind a sha256 corpus-pin check, with floors calibrated to CI's deterministic no-sqlite fallback regime."
trigger_phrases:
  - "ci compiler accuracy gate outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
    last_updated_at: "2026-07-29T16:41:01Z"
    last_updated_by: "claude-code"
    recent_action: "Wired compiler + accuracy gates into CI; floors calibrated to the no-sqlite regime"
    next_safe_action: "Phase 007 dead-field-deletes"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Floor values — calibrated to the deterministic no-sqlite fallback regime CI actually runs (0.5333 / 0.9843 / TT 101, FT 3, FF 1), not the sqlite-regime 002 numbers, which would have red CI on first run."
      - "--validate-only alone suffices; --export-json adds only output-size coverage not required by the finding this closes."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Wire Compiler + Routing-Accuracy Gates into CI

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Scope** | One file changed: `.github/workflows/routing-registry-drift.yml` (two additive steps + one trigger-path entry); no validator logic touched |
| **Depends On** | 002 (corpus pin), 003 (fleet migrated), 004 (scaffold born-complete) — all Complete before this landed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two new CI steps close the "green-root / downstream-failure seam" (029 research O4, 3/3 lineage agreement) where a malformed `derived` block or dead `key_files` path passed every existing gate and only failed at an offline advisor rebuild:

1. **Compiler gate** — `python3 skill_graph_compiler.py --validate-only` added to the lean `routing-drift` job after the class-contract step. Stdlib-only Python, so it needs no install; it validates the full schema-version-2 `derived` block (topics/entities/causal_summary, edge weight bands, dependency cycles) and that every `key_files`/`source_docs`/`entities[].path` resolves to a real file.
2. **Accuracy gate** — in the `golden-prompt-gate` job (whose install step already builds the `@spec-kit/shared` dist the scorer's gate3 leg imports): first an inline sha256 check of all three corpus files against the pins recorded in 002's checked-in `routing-baseline.json` (scoring never proceeds against a drifted corpus), then `score-routing-corpus.py` with floors `--min-advisor-accuracy 0.5333 --min-gate3-f1 0.9843 --min-joint-tt 101 --max-joint-ft 3 --max-joint-ff 1 --require-historical-clean`.

The 002 baseline directory was added to both trigger-path blocks so a pin edit also fires the gate; the compiler and corpus files were already covered by the existing `mcp-server/**` glob.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Recon first: both scripts confirmed stdlib-only Python at the top level, but the scorer shells into `gate3-corpus-runner.mjs`, which imports the **gitignored** `system-spec-kit/shared/dist` — that dependency dictated the job placement. The dataset path must be absolute (the node child resolves relative paths from its own CWD). The floors were then calibrated against reality rather than assumed: a first gated run with 002's sqlite-regime numbers passed locally but a CI-condition simulation (the gitignored `skill-graph.sqlite` masked) **failed** — the advisor's fallback path scores lower (0.5333 vs 0.5692; TT 101 vs 108) because CI never has the daemon-built graph. The fallback regime was verified deterministic (two masked runs byte-identical) and its numbers became the floors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Calibrate floors to the regime CI actually runs.** CI has no `skill-graph.sqlite` (gitignored; only the live daemon's ingest produces it, with no reproducible build CLI), so pinning the sqlite-regime numbers would make the gate red on day one and measure a regime that never executes in CI. Both regimes are recorded here and in the spec amendment. **Hash-pin before scoring** — the corpus is verified against 002's checked-in sha256 pins first, so a silently-edited corpus fails loudly instead of moving the floor. **Split placement by dependency footprint** — compiler in the lean job (stdlib), scorer in the build-bearing job. **Strict-inequality floors at exact baseline** — the scorer fails on `<` floor / `>` ceiling, so byte-deterministic equality passes and any regression fails.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All against the real tree, including the exact CI condition:
- Compiler positive: `--validate-only` → "VALIDATION PASSED: all metadata files are valid" (11 roots), exit 0.
- Compiler negative: scratch tree with a broken `derived.key_files` path → `ERRORS in sk-git … path does not exist: does/not/exist/anywhere.md`, `VALIDATION FAILED`, exit 2.
- Accuracy positive in CI condition: `skill-graph.sqlite` masked (CI never has it) → gated run with the shipped floors exits 0; two masked runs byte-identical (deterministic).
- Accuracy negatives: raised floor (`--min-advisor-accuracy 0.99`) → exit 1; tampered corpus copy → the hash-pin check reports the drifted file and exits 2.
- Corpus hashes match 002's pins exactly (labeled `9f30cc5e…`, holdout `88a7f759…`, ambiguity `07cd2c76…`).
- Workflow YAML parses; jobs `routing-drift` (8 steps) + `golden-prompt-gate` (5 steps); the four pre-existing `routing-drift` steps byte-unchanged.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The accuracy gate measures the advisor's **no-sqlite fallback path** — the only regime CI can reproduce. The richer sqlite-regime numbers (graph boosts; 0.5692 / TT 108) are exercised locally and by the live daemon but not gated in CI; if a reproducible graph-build CLI ever ships, the floors can be re-calibrated upward to that regime. The CI job's `npm ci` legs are confirmable only on first push (same caveat as the golden-prompt gate they share a job with). `validate.sh --strict` remains blocked repo-wide by a concurrent session's incomplete pi-hook relocation (undeclared Pi-runtime dependency compiled by the mcp-server tsconfig); this phase is verified by the direct positive/negative gate runs above.
<!-- /ANCHOR:limitations -->
