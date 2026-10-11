---
title: "Implementation Summary"
description: "Ten-iteration deep research found that doc-version verify fails by construction and recommends keeping the version on SKILL.md only."
trigger_phrases:
  - "doc version contract implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract"
    last_updated_at: "2026-10-11T17:41:01Z"
    last_updated_by: "deep-research-orchestrator"
    recent_action: "Ran ten deep-research iterations and wrote the checked synthesis"
    next_safe_action: "Fix phase: apply R1 to R4 and R6 from research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:b67d088073d296e0c4cb490898da1bd70aebe9a0a392087d4fceeee2fb486d38"
      session_id: "dr-001-doc-version-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 to Q5, see research/research.md Section 4"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-doc-version-contract |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now know why `frontmatter-version.mjs verify` exits 1 on every skill, and you have a ranked, evidence-backed fix. The check fails by construction, not by accident: the per-doc build count `W` comes from git history and writing it is itself an edit, the skill-era segment goes stale whenever a changelog advances, and nothing runs `verify` or reconciles the values.

### Phase 1: doc-version-contract

The run measured the whole fleet: `verify` exits 1 on 14 of 14 skills with 2,795 mismatches over 2,909 docs, while the format-only `gate` exits 0 on all 14. The smallest contract that stays green by construction keeps `version` on `SKILL.md` alone, equal to the max of its own value and the highest changelog filename. That path never reads git, and `verify` over the 57 `SKILL.md` files exits 0 today. `research/research.md` Section 11 ranks seven recommendations; R1 drops the per-doc version from child doc classes. No product file changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Checked synthesis with the ranked R1 to R7 table |
| `research/` (iterations, deltas, state, strategy, registry, dashboard, resource map, ledgers, receipts) | Created | The loop's state and ten iterations |
| `spec.md` | Modified | Pre-init research context and the generated findings fence under Open Questions |
| `implementation-summary.md`, `goal.md`, `tasks.md` | Modified | Outcome, log and task state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sub-orchestrator executed the `/deep:research` auto YAML step by step. Each of the ten iterations was dispatched through the YAML's `cli-pi` branch (`buildLineageCommand` plus `runAuditedExecutorCommand`) as `pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max`, with `AI_SESSION_CHILD=1` and stdin closed. Every iteration passed `verify-iteration.cjs`; iteration 10 needed the workflow's single redispatch. The orchestrator then re-ran the load-bearing measurements itself, resolved all 46 cited path:line references in the synthesis, and corrected four executor claims (`research/research.md` Section 13).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the package recipient as the "external author" | No in-repo source defines the term; the packaged zip is the one surface that leaves the repository without git history |
| Rank removal of the child-doc version first | 573 of 710 mismatches in the three named skills are a stale era, and no consumer reads the child value |
| Correct executor counts rather than quote them | Iterations 6, 8 and 10 counted each skill's summary line as a mismatch; re-counting moved 713 to 710 and 2,798 to 2,795 |
| Prepend the child preamble and inline the agent persona to each rendered prompt | `cli-pi` SKILL.md rules 10 and 11 require both, and the YAML's `cli-pi` branch passes the rendered pack alone |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records in the state log | 10 `"type":"iteration"` records |
| `verify-iteration.cjs` per iteration | Exit 0 for all ten (iteration 10 on its redispatch) |
| Fleet `gate` / `verify`, orchestrator run | `gate` exit 0 on 14/14 skills; `verify` exit 1 on 14/14, 2,795 mismatches |
| `verify --paths` over 57 `SKILL.md` files | Exit 0, `ok=57` |
| Cited path:line resolution in `research/research.md` | 46 of 46 resolve to the claimed content |
| Goal criteria and strict validation | See `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **External author is assumed.** The run defined it as the package recipient. A named consumer of single extracted docs would reverse R1 for that doc class.
2. **Two telemetry steps were not run.** The single-loop heartbeat rows in `orchestration-status.log` were skipped; they are observability only and no gate reads them.
3. **Some inventory claims rest on executor reads.** The 68 changelog entries carrying a version and the absence of validator callers in hooks were not re-run by the orchestrator.
<!-- /ANCHOR:limitations -->

---


