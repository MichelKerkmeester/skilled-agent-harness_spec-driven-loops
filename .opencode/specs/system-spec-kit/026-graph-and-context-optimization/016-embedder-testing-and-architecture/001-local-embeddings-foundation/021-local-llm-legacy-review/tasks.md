---
title: "Tasks: Local-LLM legacy and outdated-docs/config-drift review (post-014)"
description: "Discrete task list for the 015 review packet."
trigger_phrases:
  - "015 tasks"
  - "local-llm legacy tasks"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Local-LLM legacy and outdated-docs/config-drift review (post-014)

<!-- SPECKIT_LEVEL: 2 -->

---

## TASK BREAKDOWN

| ID | Task | Status | Owner | Evidence |
|----|------|--------|-------|----------|
| T-001 | Capture recovery anchor SHA before any dispatch | DONE | main-agent | `5e7095d3336510b5756ba5cac383a8e08d1d79db` |
| T-002 | Scaffold 015 packet via `create.sh --level 2 --skip-branch --path` | DONE | main-agent | Packet root files exist |
| T-003 | Fill spec.md/plan.md/tasks.md/checklist.md with review-packet content | DONE | main-agent | This commit |
| T-004 | Refresh description.json + graph-metadata.json with packet identity | TODO | main-agent | Trio fields populated |
| T-005 | Strict-validate the packet pre-dispatch (exit 0 or warnings only) | TODO | main-agent | `validate.sh --strict` output |
| T-006 | Dispatch `/spec_kit:deep-review:auto` with the full flag set | TODO | main-agent | State JSONL header written |
| T-007 | Monitor iteration progress (no per-iter approval under `:auto`) | TODO | main-agent | JSONL iteration count grows |
| T-008 | Iterations 1–20 execute via cli-codex (gpt-5.5 high fast) | TODO | deep-review skill | Per-iter `iteration-NNN.md` + JSONL row |
| T-009 | Convergence detection triggers or 20-cap reached | TODO | deep-review skill | `stop_reason` field in JSONL |
| T-010 | `review-report.md` synthesized with verdict + finding tables | TODO | deep-review skill | File exists, non-empty |
| T-011 | Hand-validate ≥3 P1 findings against source | TODO | main-agent | Verification notes in summary |
| T-012 | Update `implementation-summary.md` with verdict + next-step rec | TODO | main-agent | Continuity refresh |
| T-013 | `git status --porcelain` confirms no out-of-scope mutations | TODO | main-agent | clean output |

---

## DEPENDENCIES

- T-004 blocks T-005
- T-005 blocks T-006
- T-006 → T-007 → T-008 → T-009 → T-010 (skill-owned sequential)
- T-010 blocks T-011
- T-011 blocks T-012
- T-012, T-013 are terminal verification steps
