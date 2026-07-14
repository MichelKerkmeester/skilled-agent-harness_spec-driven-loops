---
title: "Verification Checklist: headless model-matrix hardening for the deep-alignment loop"
description: "Verification protocol and per-category checks (pre-impl, code quality, testing, fix completeness, security, docs, file organization, architecture, performance, deploy, compliance, sign-off) for the deep-alignment hardening packet, with evidence slots open until implementation runs."
trigger_phrases:
  - "deep-alignment hardening checklist"
  - "deep-alignment matrix verification"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/015-headless-model-matrix-hardening"
    last_updated_at: "2026-07-14T08:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored verification checklist; evidence slots open"
    next_safe_action: "On approval, fill evidence and mark items"
---
# Verification Checklist: headless model-matrix hardening for the deep-alignment loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Mark `[x]` only with cited evidence (command output, file:line, or a live-run artifact path). No item is checked on assertion alone. Shared-runtime items additionally require a before/after regression comparison. Priority: **[P0]** HARD BLOCKER · **[P1]** required or deferred with approval · **[P2]** nice-to-have.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Regression baseline for deep-review + deep-research captured. Evidence: ______
- [ ] CHK-002 [P0] Pre-change snapshots of `alignment.md` + `deep_alignment_auto.yaml` taken. Evidence: ______
- [ ] CHK-003 [P1] Throwaway `alignment/` smoke target confirmed. Evidence: ______

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No comment-hygiene violations (no spec paths / ADR-REQ-CHK-task ids in code or YAML comments). Evidence: ______
- [ ] CHK-011 [P0] Shared-runtime edits are additive-only; sibling loop-types/values untouched. Evidence: ______
- [ ] CHK-012 [P1] `native` executor still rejects non-null model/effort flags (config gating intact). Evidence: ______

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Runtime vitest green incl. new alignment + `ultra` cases. Evidence: ______
- [ ] CHK-021 [P0] Regression baseline re-run post-Phase-B → zero delta. Evidence: ______
- [ ] CHK-022 [P0] Driver matrix 9 runs reach REPORT with real findings. Evidence: ______
- [ ] CHK-023 [P1] Leaf matrix 4 runs complete one audited iteration. Evidence: ______

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] REQ-001 driver reaches REPORT, no narrate-then-stop. Evidence: ______
- [ ] CHK-031 [P0] REQ-002 sibling loops behavior-unchanged. Evidence: ______
- [ ] CHK-032 [P0] REQ-003 external executor resolved + audited; native default preserved. Evidence: ______
- [ ] CHK-033 [P0] REQ-004 `fanout-run --loop-type alignment` + convergence flags honored. Evidence: ______
- [ ] CHK-034 [P0] REQ-006 representative matrix all-pass (or documented). Evidence: ______
- [ ] CHK-035 [P1] REQ-005 `ultra` expressible / REQ-007 prompt-pack rendered (or deferred w/ approval). Evidence: ______

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] CLI leaf branches use `--sandbox workspace-write`; write paths scoped to `alignment/`. Evidence: ______
- [ ] CHK-041 [P0] No `--dangerously-skip-permissions` on any opencode dispatch; every dispatch `</dev/null`. Evidence: ______
- [ ] CHK-042 [P1] Read-only audit contract preserved (loop never modifies audited artifacts). Evidence: ______

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `alignment.md` advertises executor flags ONLY after the dispatch branch exists. Evidence: ______
- [ ] CHK-051 [P1] implementation-summary records the matrix results table + documented skips. Evidence: ______

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] New prompt-pack template lives under `deep-alignment/assets/` with a convention-correct name. Evidence: ______
- [ ] CHK-061 [P0] `validate.sh --strict` Errors:0; 059 parent rolled up. Evidence: ______

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-062 [P0] Status flipped to Complete only after all P0 items carry evidence. Evidence: ______
- Status: PENDING (planning-only; no implementation started). Blocking items open: all (awaiting operator plan approval).

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [ ] CHK-070 [P0] deep-alignment dispatch mirrors deep-review's executor topology (resolve → branch → validate → audit). Evidence: ______
- [ ] CHK-071 [P1] No forked dispatcher introduced; shared runtime reused. Evidence: ______

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [ ] CHK-080 [P2] Phase C stays within the bounded representative subset; premium-token spend logged. Evidence: ______
- [ ] CHK-081 [P2] No added per-iteration latency on the native path (unchanged default). Evidence: ______

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [ ] CHK-090 [P0] strict validate Errors:0; 059 parent rolled up. Evidence: ______
- [ ] CHK-091 [P0] Committed + FF-pushed to v4 via isolated worktree (no force-push). Evidence: ______

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [ ] CHK-100 [P0] Comment-hygiene clean across all touched code + YAML. Evidence: ______
- [ ] CHK-101 [P1] Read-only audit contract preserved; loop never mutates audited artifacts. Evidence: ______

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [ ] CHK-110 [P1] `alignment.md` executor-flag advertisement gated on the dispatch branch. Evidence: ______
- [ ] CHK-111 [P1] implementation-summary records matrix results + documented skips. Evidence: ______

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [ ] CHK-120 [P0] All P0 requirements satisfied with cited evidence.
- [ ] CHK-121 [P1] P1 requirements satisfied or deferred with operator approval.
- Reviewer: ______  ·  Date: ______

<!-- /ANCHOR:sign-off -->
