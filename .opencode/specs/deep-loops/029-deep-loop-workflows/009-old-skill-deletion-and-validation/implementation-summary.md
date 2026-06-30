---
title: "Implementation Summary: Old-skill deletion and full-surface validation (partial — B1 council-graph probe)"
description: "Phase 009: the B1 /doctor deep-loop council-graph probe built and verified, plus gate sign-off to 13/18 P0 — CHK-060 closed via clean skill_graph_scan (rejectedEdges=0) and CHK-065 descoped via decision-record.md (baseline unrecoverable); four process-circumstantial P0 (CHK-001/010/021/030) remain."
trigger_phrases:
  - "deep-loop-workflows phase 009 implementation"
  - "B1 council-graph doctor probe"
  - "old-skill-deletion-and-validation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/009-old-skill-deletion-and-validation"
    last_updated_at: "2026-06-16T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closed CHK-060 (skill_graph_scan rejectedEdges=0); descoped CHK-065"
    next_safe_action: "Ratify CHK-065 descope; clear 4 circumstantial P0 (001/010/021/030)"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/assets/doctor_deep-loop.yaml"
      - ".opencode/commands/doctor/_routes.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-009-b1-council-graph-probe-implementation"
      parent_session_id: null
    completion_pct: 72
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Old-skill deletion and full-surface validation (partial)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 147-deep-loop-workflows/009-old-skill-deletion-and-validation |
| **Completed** | 2026-06-16 (B1 probe + gate sign-off to 13/18 P0; CHK-060 closed, CHK-065 descoped; remediation under packet 156 deep-review) |
| **Level** | 2 |
| **Actual Effort** | B1 probe + 6-gate verification (scoped remediation slice) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The packet-156 deep review found that phase 009's headline B1 gate — `/doctor deep-loop` must probe the council graph (`council-graph.sqlite`), not only the deep-loop coverage graph — was never implemented, even though the destructive five-skill deletion the gate was meant to guard had already shipped. This slice builds that probe and reconciles the checklist to what is genuinely verified.

The read-only deep-loop doctor now covers the council graph alongside the deep-loop coverage graph: a new `council` scope (and an `all` scope that becomes the default), council-graph presence/staleness detection, an `ai-council/**` source-inventory glob, council `status`/`query`/`convergence` sampling at `loopType=council`, and a council-specific recommendation (replay via `replay-graph-from-artifacts.cjs`, since `/doctor:update` does not rebuild the council graph). The route manifest's `allowed_flags` was widened so `--scope=council|all` is accepted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Modified | Add council scope, council-graph probe/staleness, `ai-council/**` inventory, council convergence sampling, and council replay recommendation |
| `.opencode/commands/doctor/_routes.yaml` | Modified | Widen `deep-loop` `allowed_flags` to `--scope=research\|review\|council\|both\|all`; update gate3_location to note council reads |
| `checklist.md` | Modified | Mark CHK-060 verified (skill_graph_scan rejectedEdges=0) and CHK-065 descoped (decision-record.md) on top of the prior twelve; four process gates (CHK-001/010/021/030) stay circumstantial; summary to 13/18 P0 |
| `decision-record.md` | Created | ADR-001 records the CHK-065 descope: byte-identical phase-001 parity replay is unrecoverable (pre-merge baseline at rewritten paths); substitute behavioral-parity evidence accepted |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This slice was executed as remediation of the packet-156 deep-review P1 (B1 never built; the destructive deletion shipped without its gate), not via phase 009's original full gated pipeline. The probe was added by extending the existing read-only `doctor_deep-loop.yaml` workflow and the `_routes.yaml` manifest — no new script — mirroring the deep-loop-graph handling onto the council graph. Verification ran the runtime council surface directly (`status`/`query`/`convergence.cjs --loop-type council` against the `sandbox/dac-019` namespace) plus the route validator. Only the six gates actually exercised were marked; the twelve heavy/process gates were left open rather than back-dated.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Default scope `all` (research+review+council) | The doctor's job is full deep-loop coverage; `both` is retained as a research+review-only subset for back-compat |
| Council drift recommends `replay-graph-from-artifacts.cjs`, not `/doctor:update` | The council graph is derived from `ai-council/**` artifacts and is rebuilt by the council replay path; `/doctor:update` rebuilds only the deep-loop coverage graph |
| Verify only the 6 gates actually run; leave 12 unmarked | Honest reconciliation — the deletion shipped and is functional, but the heavy parity/rebuild/validation gates were not run in this slice |
| Probe stays read-only | Phase-009 B1 is a diagnostic gate; no mutation, consistent with the doctor's read-only contract |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| CHK-022 one hub graph-metadata | Pass | `find deep-loop-workflows -name graph-metadata.json` → exactly one |
| CHK-023 B1 council-graph probe | Pass | doctor + route extended; live `status.cjs --loop-type council` → status:ok, totalNodes:2 |
| CHK-024 route validation | Pass | `route-validate.sh` → PASS, 9 routes, 0 errors |
| CHK-025 council status/query/convergence smoke | Pass | all three `--loop-type council` → status:ok (convergence CONTINUE 0.4; query 0 unresolved) |
| CHK-026 five old dirs deleted | Pass | only `deep-loop-runtime` + `deep-loop-workflows` remain |
| CHK-064 convergence loopTypes | Pass | `convergence.cjs:300` rejects anything outside research\|review\|council\|context |
| Both edited YAML files | Pass | `yaml.safe_load` parses clean |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four process P0 gates remain (13/18 verified).** A 2026-06-15 gate sign-off closed CHK-002/020 (phase-001 baseline present + coverage), CHK-061/062/063 (advisor routing, agent mirror parity, registry completeness), and CHK-066 (validate.sh --strict for phase 009 + parent control file, both 0/0) on top of the earlier council/route/deletion six. On 2026-06-16 the two actionable gates closed: **CHK-060** — `skill_graph_scan --trusted` rebuilt the skill graph with **rejectedEdges:0** (82 edges, generation 7013→7014; graph healthy at 20 skills with deep-loop family=2, confirming the five old skill IDs are absent), run once the skill-graph inputs were quiescent (the concurrent session's ~366 dirty files are all spec-side, which the skill scan does not read); and **CHK-065** — the byte-identical phase-001 parity replay was formally descoped via `decision-record.md` ADR-001, because the captured baseline is PRE-merge source hashes at old paths that the merge's intentional moves + path rewrites invalidate (no artifact-hash baseline or path-rewrite map exists), with behavioral parity resting on the 351 passing deep-loop-runtime tests plus the packet-156 wave-2/3 verifications. The four remaining P0 are CHK-001/010/021/030 (circumstantial-process — the merge completed the 001→009 chain and shipped functional, and this is a doc/code reorg with no secrets, but these were not formally gate-run).
2. **Parent 152 "Complete/100%" remains contingent.** The destructive deletion already shipped and is git-recoverable; the merge is functionally validated by the 351 passing deep-loop-runtime tests (per the packet-156 review), but the parent's completion claim is not fully backed until the four remaining circumstantial process gates (CHK-001/010/021/030) are formally run.
3. **B1 verified against an existing council namespace fixture** (`sandbox/dac-019`), not a full live `/doctor deep-loop --scope=all` end-to-end run through the interactive command surface.

<!-- /ANCHOR:limitations -->
