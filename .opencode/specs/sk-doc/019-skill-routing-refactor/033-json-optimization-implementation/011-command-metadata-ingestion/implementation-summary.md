---
title: "Implementation Outcome: Ingest command-metadata.json into Command Routing"
description: "Delivered: the canonical command-bridge projection now drives live routing in both runtimes — shadow hardening closed the three corpus-gated failure modes (ownedSignals overreach, memory:save identity loss, description false-fires) and the cutover landed with every pinned metric exact, the corpus gate at CI floors, and 53/53 across the nine routing suites."
trigger_phrases:
  - "command bridges generator outcome"
  - "command metadata ingestion outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion"
    last_updated_at: "2026-07-29T22:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Cutover landed; all routing gates green"
    next_safe_action: "Operator: push and confirm live CI"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/011-command-metadata-ingestion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Shipped against the documented allow-list residual; the system-spec-kit backfill was later found structurally illegal (S-class roots forbid command-metadata.json), so the allow-list is the permanent design"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Ingest command-metadata.json into Command Routing

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | Yes — shadow hardening `452fbc0e64` + live cutover `dffe5a06c0`, all routing gates green |
| **Track** | sk-doc |
| **Opportunities addressed** | O7 (command-metadata ingestion) + O10 (denser command-metadata/leaf-aliases e2e tests), per 029 research §3 |
| **Blast radius** | High — live rewire of `projection.ts` (advisor's hottest file) and `skill_advisor.py`'s `COMMAND_BRIDGES` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single canonical command-bridge projection derived from the fleet's 7 `command-metadata.json` files (22 entries today) plus a documented allow-list for the two commands not yet backed by JSON (`/speckit:*`, `/memory:save` — `system-spec-kit` has no `command-metadata.json`). That projection now generates both the TS `COMMAND_BRIDGES` array in `mcp-server/lib/scorer/projection.ts` (replacing 6 hand-authored, coarse entries) and the Python `COMMAND_BRIDGES` dict in `mcp-server/scripts/skill_advisor.py` (replacing 16 hand-authored, fine-grained entries plus the `COMMAND_BRIDGE_OWNER_NORMALIZATION` map) — closing a count-and-granularity drift between the two that exists today and is confirmed against the live tree. A drift-guard vitest asserts all three sources (JSON, generated TS, generated Python) agree, failing loud with named ids the moment any of them is edited without regenerating the others. Denser `command-metadata`/`leaf-aliases` e2e tests replaced the current thin coverage (2 vitest files that check bridge-id resolution but not live routing behavior) with one routing assertion per JSON-declared command.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cutover shipped as two separate commits per the program parent's guarded-rollout rule, after three earlier attempts had been corpus-gated and reverted (ownedSignals overreach, `/memory:save` identity loss, description false-fires). The shadow-hardening commit (`452fbc0e64`, prepared by GPT-5.6-SOL via cli-codex and verified independently by the orchestrator) closed those three failure modes: generated entries without a live hand-authored counterpart are excluded from scoring, each active bridge carries an exact live-field compatibility snapshot (`scoring-compatibility.json`), and inactive-entry descriptions are kept out of the lexical inputs — landing both GENERATED blocks while live routing still bound the hand-authored arrays. Only after the shadow-state capture equalled every pin exactly and the corpus gate passed at CI floors did the cutover commit (`dffe5a06c0`) swap the three live bindings (TS `COMMAND_BRIDGES`, Python `COMMAND_BRIDGES` + owner normalization) to the generated blocks. The Python CLI flags (`--emit-command-bridges`, `--check-command-bridges`, `--dump-command-bridges`) mirror the script's existing routing-projection machinery. Two latent test defects found en route were fixed: the command-namespace sanity list still expected the retired `design/` namespace (now `interface/`), and the drift-guard's post-cutover branch keyed on a `count` field the generated inventory never had, so it could never flip — its live-vs-generated assertion is now unconditional.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Derive from `command-metadata.json` rather than hand-reconciling the TS and Python arrays directly, so future command additions only require one authored JSON entry instead of three hand-edits. Keep `system-spec-kit`'s missing `command-metadata.json` out of this phase's scope and cover the gap with a documented allow-list instead, so the routing-rewire blast radius stays isolated to the advisor's two `COMMAND_BRIDGES` call sites rather than expanding into another hub's H-class metadata authoring. Ship the cutover as two separate commits (shadow-mode landing, then live cutover) specifically because `projection.ts` is the hottest, most concurrently-used file in the advisor — an in-place single-commit swap was rejected as too high-blast for a file this central.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All run post-cutover, by exit code:

| Check | Result |
|-------|--------|
| Scorer-eval capture (no `--write`) | pins exact — full 151/195, unknown 13, false-fire 5, holdout 53/72, ambiguity 17/24, review 24/31, memory_save 27/32, delegation 10/11 |
| Top-3 | 176/195 full, 55/72 holdout — both at pin |
| `score-routing-corpus.py` at CI floors | exit 0 — accuracy 0.5333, gate3 F1 0.9843, overall_pass true, historical clean |
| Nine-suite battery (ratchet, golden prompts, drift-guard, command e2e, binding, resolution, registry drift, both parity suites) | 53/53 pass |
| `--check-command-bridges` | exit 0 — status agreement, generated blocks fresh |
| Two-commit rollback structure | `452fbc0e64` shadow / `dffe5a06c0` cutover-only; single revert restores hand-authored routing |
| `validate.sh <folder> --strict` | Errors: 0 |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase does not backfill `system-spec-kit`'s missing `command-metadata.json` — the `/speckit:*` and `/memory:save` bridges stay covered by a documented allow-list, not a JSON source, and that is now the permanent design, not a deferred fast-follow: the follow-up investigation found `system-spec-kit` is an S-class root whose metadata contract forbids a `command-metadata.json`, so the documented allow-list is the structurally legal form of this coverage. This phase also does not touch the existing choreography-consumption use of `command-metadata.json` (command-authoring tooling reading `choreography[]`) — it adds an advisor-routing consumer alongside it, per the sol-high/glm-high disagreement recorded in `spec.md` §6, rather than claiming the prior consumption path was itself broken. The drift-guard and corpus gate now run in CI for real: the routing workflow was made executable during the remediation program, and its golden-prompt-gate job passed live before this cutover landed.
<!-- /ANCHOR:limitations -->
