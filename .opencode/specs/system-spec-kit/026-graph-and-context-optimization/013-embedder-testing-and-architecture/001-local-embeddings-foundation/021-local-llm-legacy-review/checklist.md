---
title: "Checklist: Local-LLM legacy and outdated-docs/config-drift review (post-014)"
description: "L2 verification checklist for the 015 review packet."
trigger_phrases:
  - "015 checklist"
  - "local-llm legacy checklist"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: Local-LLM legacy and outdated-docs/config-drift review (post-014)

<!-- SPECKIT_LEVEL: 2 -->

---

## PRE-DISPATCH GATES

- [x] Packet scaffolded at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/021-local-llm-legacy-review/`
- [x] Branch is `main` (skip-branch flag used)
- [x] Recovery anchor SHA captured: `5e7095d3336510b5756ba5cac383a8e08d1d79db`
- [ ] `description.json` + `graph-metadata.json` populated (trio refresh)
- [ ] `validate.sh --strict` exit code recorded (0 = pass, 1 = warnings, 2 = errors)
- [ ] cli-codex availability confirmed (`codex --version` or env probe)

## DISPATCH GATES

- [ ] `/deep:start-review-loop:auto` dispatched with full flag set
- [ ] PRE-BOUND SETUP ANSWERS block included inline in dispatch body
- [ ] `review_target_type=files` and `review_dimensions=correctness,traceability,maintainability` bound
- [ ] `executor=cli-codex`, `model=gpt-5.5`, `reasoning=high`, `service_tier=fast` confirmed in first JSONL header

## RUN GATES (skill-owned)

- [ ] Iteration 1 produces non-empty `findingDetails` array
- [ ] Iteration 1 flags at least ONE of the known-stale anchors (ENV_REFERENCE.md voyage-4 claim; INSTALL_GUIDE.md voyage-code-3 primary; install_guides/README.md text-embedding-3-small default)
- [ ] Convergence detection runs every iteration (newFindingsRatio recorded)
- [ ] Stop reason recorded in JSONL when run halts
- [ ] No `executor.kind` mismatch in JSONL (all iterations are cli-codex/gpt-5.5/fast)

## POST-RUN GATES

- [ ] `review-report.md` exists with verdict (PASS / CONDITIONAL / FAIL)
- [ ] Severity counts present (P0, P1, P2)
- [ ] Dimension coverage section confirms all 3 dimensions touched
- [ ] ≥3 P1 findings hand-validated:
  - [ ] P1 finding A: file:line evidence verified by direct Read
  - [ ] P1 finding B: file:line evidence verified by direct Read
  - [ ] P1 finding C: file:line evidence verified by direct Read
- [ ] `git status --porcelain` shows no mutations outside `021-local-llm-legacy-review/`
- [ ] `implementation-summary.md` updated with verdict + next-step recommendation
- [ ] Continuity (`_memory.continuity`) refreshed in implementation-summary.md

## SUCCESS CRITERIA TRACEABILITY

| SC | Evidence Location |
|----|-------------------|
| SC-001 | `review/review-report.md` |
| SC-002 | Hand-validation notes in `implementation-summary.md` post-run |
| SC-003 | `git status --porcelain` output |
| SC-004 | Walltime recorded in run log; ≤ 5h |
