---
topic: Governance + sk-doc + sk-code drift review slice
sessionId: fanout-codex-5-1780595350529-5jk4vx
mode: review
createdAt: 2026-06-04T17:51:36Z
---

# Deep Review Strategy

## Topic

Audit constitutional rules versus actual enforcement and sk-doc/sk-code standards conformance drift. The review is read-only for target files and writes only into this fan-out lineage artifact directory.

## Review Dimensions

| Dimension | Status | Notes |
|---|---|---|
| correctness | complete | Iteration 001 found one P1 contradiction/enforcement gap and one P2 stale path. |
| security | complete | Iteration 002 found one P1 whole-line allowlist bypass in comment-hygiene enforcement. |
| traceability | complete | Iteration 003 executed spec_code and checklist_evidence; found one sk-doc P1 template-rule drift. |
| maintainability | complete | Iteration 004 found one P2 broken local link in the sk-doc skill template. |

## Completed Dimensions

| Iteration | Dimension | Verdict | Notes |
|---:|---|---|---|
| 001 | correctness | CONDITIONAL | Ticket-id TODO guidance conflicts with the comment-hygiene ban; hook path summary is stale. |
| 002 | security | CONDITIONAL | Allowed durable tokens bypass forbidden-pattern checks for the rest of the comment line. |
| 003 | traceability | CONDITIONAL | Spec scope covered; checklist evidence skipped because no checklist exists; sk-doc rules drift found. |
| 004 | maintainability | PASS | P2-only broken-link drift found in sk-doc template navigation. |
| 005 | stabilization | PASS | No new findings; rolling average dropped below stop band with all dimensions covered. |

## Running Findings

| Severity | Active | Notes |
|---|---:|---|
| P0 | 0 | No blockers recorded at init. |
| P1 | 3 | F001: ticket-id TODO guidance conflicts with the no-ticket comment rule and checker coverage. F003: allowed-token comment lines bypass forbidden-pattern checks. F004: sk-doc machine rules omit the template-required references section. |
| P2 | 2 | F002: stale Claude hook path in sk-code enforcement summary. F005: stale sk-doc frontmatter reference link. |

## Files Under Review

| Scope | Coverage | Notes |
|---|---|---|
| `.opencode/skills/system-spec-kit/constitutional/**` | partial | Comment-hygiene, memory, main-branch, and spec naming rules sampled for risk drift. |
| `.opencode/skills/sk-doc/SKILL.md` | partial | Skill activation and playbook scope sampled for traceability. |
| `.opencode/skills/sk-doc/assets/**` | covered | Template rules, README template, skill template, changelog template, and frontmatter template sampled. |
| `.opencode/skills/sk-code/SKILL.md` | partial | Enforcement summary checked for correctness drift. |
| `.opencode/skills/sk-code/assets/**` | partial | OpenCode checklists checked for comment/TODO contradictions. |

## Cross-Reference Status

| Protocol | Gate | Status | Notes |
|---|---|---|---|
| spec_code | hard | partial | Requirements covered with active P1 drift findings. |
| checklist_evidence | hard | skipped-pass | No `checklist.md` exists in the slice packet. |
| feature_catalog_code | advisory | skipped-pass | No feature catalog file in declared scope. |
| playbook_capability | advisory | partial | Playbook assets present; no executable capability finding produced. |

## Known Context

- Bound `artifact_dir` directly to the fan-out override. The resolver node was intentionally not run.
- `resource-map.md` is absent in the slice packet. Skipping the resource-map coverage gate.
- Code Graph is unavailable in this runtime, so review uses direct file reads and `rg` evidence.

## What Worked

- Exact line-level reads caught a contradiction between the P0 comment-hygiene checklist and the TODO-format examples.
- Checking the actual hook script next to the SKILL summary separated a stale path advisory from a stronger enforcement failure.
- Reading the checker control flow exposed a bypass shape that the gate wrappers inherit.
- Spec-code tracing anchored the review findings to both slice requirements.
- Maintainability sweep downgraded stale-link drift to advisory rather than inflating severity.
- Stabilization scan found no new P0/P1/P2 classes after all dimensions were covered.

## What Failed

None yet.

## Exhausted Approaches

None yet.

## Ruled-Out Directions

None yet.

## Next Focus

Synthesis: compile final report with CONDITIONAL verdict because active P1 findings remain.

## Review Boundaries

- Maximum iterations: 7.
- Stop requires all four dimensions plus core traceability status covered.
- Target files are read-only.
- Writes are confined to this artifact directory.
