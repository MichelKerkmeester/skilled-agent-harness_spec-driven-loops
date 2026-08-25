---
title: "Verification Checklist: Gateway State-Write Contract Remediation"
description: "Level-3 verification checklist mapping each of the ten 014-review findings plus the merge-tool bug to a remediation task and its required evidence, with the quality gates and security-adjacent closed-gate replay obligations."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation"
    last_updated_at: "2026-08-25T14:25:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Generate metadata and run validate --strict"
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Gateway State-Write Contract Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

This is a **planning** checklist: items are `[ ]` until the authorized build closes them with cited evidence. Mark `[x]` only with `file:line`, a command + exit status, a `N/N` count, or a named tool. A finding is a hypothesis until confirmed against the real symptom; every P0/P1 item requires a reproduced-then-cleared check, not a doc edit alone.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The ten findings are confirmed against source before any edit. [Evidence: `014/review/review-report.md` §3 registry; re-verified `prompt-pack-iteration.md.tmpl:118`, `append-mode-event.ts:191,205`, `verify-iteration.cjs:167`, `check-agent-gateway.sh:26-31`.]
- [ ] CHK-002 [P0] ADR-002 intent check (G1) answered before touching runtime. [Evidence: `decision-record.md` ADR-002 status flipped to Accepted with the consumer-exists answer recorded.]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The three prompt-pack templates route through the gateway with no direct-write fallback. [Evidence: grep of the 3 `.tmpl` files — zero `>> {state_log}`, one `append-mode-event.cjs` each.]
- [ ] CHK-004 [P0] The single ADR-002 runtime file changed cleanly (A or B, not both). [Evidence: scoped diff touches only `append-mode-event.ts` OR `verify-iteration.cjs`.]
- [ ] CHK-005 [P1] No collateral edits outside the named target surfaces. [Evidence: `git diff --stat` = target surfaces + this packet only.]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] Negative control (G2): gateway-only-leaf deadlock reproduced pre-fix, absent post-fix, in a real dispatch. [Evidence: captured `state_record_missing` + redispatch before; clean pass + exit status after.]
- [ ] CHK-007 [P1] Merge fixture (G5): `fanout-merge.cjs` yields a non-empty, non-PASS merge on one active finding. [Evidence: fixture run output.]
- [ ] CHK-008 [P1] Deep-loop runtime tests pass at baseline+delta. [Evidence: vitest baseline count before WS1; re-run delta after.]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P0] F-008 closed — no artifact instructs a direct append; gateway-only write passes validation. [Evidence: G3 grep clean + G2 pass.]
- [ ] CHK-010 [P1] F-001 closed — ai-council no longer mandates decommissioned `sequential_thinking`. [Evidence: grep result; `.pi/mcp.json` reconciled.]
- [ ] CHK-011 [P1] F-002 closed — research/review leaves + packs carry the injection guard. [Evidence: guard block present; closed-gate replay.]
- [ ] CHK-012 [P1] F-003+P1-002 closed — SKILL doctrine names the gateway; no "SINGLE state writer" claim. [Evidence: `deep-review/SKILL.md` diff; grep for gateway mention.]
- [ ] CHK-013 [P1] P1-001 closed — confirm YAMLs carry write-containment. [Evidence: both `*-confirm.yaml` diffs; closed-gate replay.]
- [ ] CHK-014 [P1] P1-003 closed — guard fails closed with a count floor. [Evidence: guard exits non-zero on a synthetic missing agent.]
- [ ] CHK-015 [P2] P2-001..004 addressed. [Evidence: guard regex fixture (P2-003), ASCII-arrow + sandbox-prose + "JSONL delta" edits on touched files.]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-016 [P0] Security-adjacent workstreams (WS3/WS5/WS6) closed with closed-gate replay + file:line/command evidence, per the review's `fixCompletenessRequired`. [Evidence: replay records for T006/T008/T009.]
- [ ] CHK-017 [P0] No secrets introduced; no `.sqlite`/`.jsonl` in the tracked diff. [Evidence: grep of tracked changes.]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-018 [P1] ADR-002 amended in place to the chosen direction with the intent evidence; ADR-003/004 accepted or amended. [Evidence: `decision-record.md` status fields.]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-019 [P1] Scoped diff = the named target surfaces + this packet; no runtime residue, no stray files. [Evidence: `git status --porcelain` sweep.]
- [ ] CHK-020 [P1] `013` left untouched (immutable; already on main). [Evidence: `013` not in the modified set except the guard script it hosts, which WS6 owns by design.]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

At plan time all items are `[ ]`. The build is complete only when T001–T010 close each item with evidence, G1–G6 are green, and `validate.sh --strict` exits 0. The load-bearing proofs are CHK-006 (negative control) and CHK-009 (F-008 closed) — a green validate alone does not close the P0.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [ ] CHK-021 [P1] All four artifact layers (prompt-pack, persona, runtime, validator) agree on the gateway. [Evidence: §3 architecture layers each cited post-fix.]

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [ ] CHK-022 [P2] No per-iteration latency regression from the gateway call vs the former redirect. [Evidence: iteration duration baseline+delta, if measurable; else marked non-applicable with reason.]

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [ ] CHK-023 [P1] The change is revertible without leaving the projection/validator half-wired. [Evidence: a dry-run `git revert` of the WS1 commit restores the research-only shape cleanly.]

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [ ] CHK-024 [P1] Comment hygiene held — no spec/packet/finding ids embedded in edited code/scripts. [Evidence: pre-commit gate clean.]

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [ ] CHK-025 [P1] Packet docs reconciled — spec status, plan, tasks, checklist, ADR statuses, and implementation-summary agree on the final state. [Evidence: metadata reconcile + validate.]

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [ ] CHK-026 [P0] Operator approval of the plan (ADR-002 direction especially) before the runtime build starts. [Evidence: operator go-ahead recorded.]

<!-- /ANCHOR:sign-off -->
