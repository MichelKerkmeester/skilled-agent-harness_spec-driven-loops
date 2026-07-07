---
title: "Verdict Matrix: Phase 023 - Full Manual Playbook Execution"
description: "3-tier rollup (dispatch, scenario, release-readiness) for the first genuine end-to-end manual execution of sk-design's manual_testing_playbook, 56 real cli-opencode dispatches across 37 scenario IDs."
trigger_phrases:
  - "verdict matrix"
  - "phase 023 release readiness"
  - "sk-design playbook release gate"
importance_tier: "high"
contextType: "general"
---
# Verdict Matrix: Phase 023 - Full Manual Playbook Execution

Aggregated from the 10 child waves' own `dispatch-log.md` files (Tier 1, authoritative). This document is Tier 2 (per-scenario rollup) and Tier 3 (release-readiness gate). All figures cross-checked directly against each wave's dispatch-log.md, not from memory.

---

## Tier 3: Release-Readiness Gate

Computed exactly per `manual_testing_playbook.md` Section 5's rule: **READY** requires zero FAIL features, all 16 critical-path scenarios PASS, 100% coverage, no unresolved blocking triage.

| Gate Check | Result |
|---|---|
| Coverage | 37/37 scenario IDs dispatched (100%) — 56 real `opencode run` calls across 10 waves |
| Scenario-level verdicts | 20 PASS / 8 PARTIAL / 9 FAIL |
| Zero FAIL features? | **No** — 9 scenario-level FAILs |
| All 16 critical-path scenarios PASS? | **No** — 9 PASS / 2 PARTIAL / 5 FAIL (see table below) |
| **RELEASE VERDICT** | **NOT READY** |

### Critical-path scenario detail (16 of 37)

| Scenario | Verdict | Why (if not PASS) |
|---|---|---|
| MR-001 | PASS | |
| MR-002 | PASS | |
| MR-003 | PASS | |
| MR-004 | PARTIAL | Advisor probe top-1 `sk-code` (0.872) over `sk-design` (0.8486); live dispatch itself resolved correctly |
| MR-005 | PASS | |
| MR-007 | **FAIL** | Advisor routes Open Design wiring to `sk-code`, not `sk-design`; live dispatch also used `apply_patch` (mutating) against a global config file |
| AI-001 | **FAIL** | Rolls up 6 probes (P1-P5 PASS); P6 (Open Design) advisor probe routes to `sk-code` top-1, the scenario's own literal FAIL trigger |
| AI-002 | PASS | |
| TV-001 | **FAIL** | Rolls up 4 variants (V2,V4 PASS); V1 escalated into `sk-code` and made a real, self-caught+reverted repo edit; V3 misrouted to `foundations` via a real `design-interface/SKILL.md` routing-prose conflict |
| TV-002 | **FAIL** | Rolls up 4 variants (V1-V3 PASS); V4 made zero skill-tool calls, answered as generic copywriting |
| MG-001 | PASS | |
| MG-004 | **FAIL** | Resolved `foundations` instead of `md-generator`; never loaded `design-md-generator/SKILL.md`; brief values appeared as unlabeled CSS custom properties |
| SR-003 | PASS | |
| PB-001 | PASS | |
| PB-002 | PARTIAL | Advisor probe missed `sk-design` top-1 (infra: native advisor unavailable, local fallback used); resolved a bundled `audit`+`foundations` rather than pure `foundations` |
| PB-003 | PASS | |

---

## Tier 2: Full Scenario Rollup (37 IDs)

Feature-verdict rule (`manual_testing_playbook.md` Section 5): PASS iff every constituent dispatch PASS; PARTIAL iff at least one PARTIAL and none FAIL; FAIL iff any constituent dispatch FAIL.

| Scenario | Constituent dispatches | Verdict | Wave |
|---|---|---|---|
| MR-001 | MR-001 | PASS | 001 |
| MR-002 | MR-002 | PASS | 001 |
| MR-003 | MR-003 | PASS | 001 |
| MR-004 | MR-004 | PARTIAL | 001 |
| MR-005 | MR-005 (S1) | PASS | 010 |
| MR-006 | MR-006 | PASS | 001 |
| MR-007 | MR-007 | **FAIL** | 002 |
| AI-001 | P1,P2,P3,P4,P5,P6 | **FAIL** | 003 + 010(P5) |
| AI-002 | AI-002 | PASS | 002 |
| AI-003 | AI-003 | PASS | 002 |
| AI-004 | AI-004 | PASS | 002 |
| TV-001 | V1,V2,V3,V4 | **FAIL** | 004 |
| TV-002 | V1(004),V2,V3,V4(005) | **FAIL** | 004 + 005 |
| TV-003 | TV-003 | **FAIL** | 005 |
| TV-004 | TV-004 | **FAIL** | 005 |
| TV-005 | TV-005 | PASS | 006 |
| MG-001 | MG-001 (S4) | PASS | 010 |
| MG-002 | MG-002 (S5) | PARTIAL | 010 |
| MG-003 | MG-003 (S6) | PARTIAL | 010 |
| MG-004 | MG-004 (S7) | **FAIL** | 010 |
| SR-001 | SR-001 | **FAIL** | 002 |
| SR-002 | P1,P2,P3 | PASS | 006 |
| SR-003 | SR-003 | PASS | 006 |
| SR-004 | SR-004 | PASS | 007 |
| PB-001 | PB-001 | PASS | 007 |
| PB-002 | PB-002 | PARTIAL | 007 |
| PB-003 | PB-003 (S3) | PASS | 010 |
| PB-004 | PB-004 | PASS | 007 |
| PB-005 | primary + negative control | PASS | 007 |
| PB-006 | PB-006 | PARTIAL | 008 |
| PB-007 | PB-007 | PARTIAL | 008 |
| FR-001 | foundations,interface,motion(008),audit(009),md-generator(S8,010) | PARTIAL | 008 + 009 + 010 |
| FR-002 | motion(009),md-generator(S9,010) | PASS | 009 + 010 |
| HM-001 | HM-001 | **FAIL** | 009 |
| HM-002 | HM-002 | PASS | 009 |
| HM-003 | HM-003 | PASS | 009 |
| HM-004 | HM-004 | PARTIAL | 009 |

**Totals: 20 PASS / 8 PARTIAL / 9 FAIL / 37 scenarios.**

---

## Real bugs found (candidates for a scoped follow-up remediation phase)

1. **Open Design wiring misroutes at the advisor tier** (`MR-007`, `AI-001`-P6): both the standalone probe and, for `MR-007`, the live dispatch's own internal advisor call rank `sk-code` above `sk-design` for "wire Open Design" prompts.
2. **`design-interface/SKILL.md`'s own routing prose conflicts with the registry's `commandProjectionParity`** (`TV-001`-V3, `TV-003`): "hierarchy"/"clarify" vocabulary pulls requests to `foundations` even when the registry maps the same verb to `interface`.
3. **`interface` mode skips its own ALWAYS-marked shared resources** (`SR-001`): `context_loading_contract.md` never loaded despite being marked non-optional in `design-interface/SKILL.md`'s own Resource Loading Levels table.
4. **`typeset`/`colorize` excluded-alias rule is not enforced** (`TV-004`): `foundations` loads alongside `interface` specifically because of these two excluded terms, the scenario's own literal FAIL trigger.
5. **`md-generator`'s router precedence loses to `foundations` on a brief-only, no-URL request** (`MG-004`): the anti-hallucination authoring-boundary docs (`references/authoring_boundary.md`, `assets/source_of_truth_router_card.md`) are never reached because the mode never resolves.
6. **Hub manager violates "intake before routing"** (`HM-001`): declares a full mode bundle before asking for the screenshots/deck it needs.
7. **Weak-signal transform-verb prompts can produce zero skill routing at all** (`TV-002`-V4): "delight ... gratuitous" produced a fully generic copywriting answer with no `skill` tool call.
8. **`MG-002`/`MG-003` advisor-tier consistently loses to `sk-doc`** on DESIGN.md-validation-shaped prompts — same pattern both times, worth checking if it's a systematic vocabulary gap rather than two independent misses.

## Real side effects from this execution run (operator-visible, not silently absorbed)

- **Self-caught and reverted** (confirmed clean via `git status`): `AI-002`'s edit to `executor-config.ts`+vitest; `TV-001`-V1's edit to `README.md`.
- **`~/.config/opencode/opencode.json`** was mutated by `MR-007`/`AI-001`-P6 (added a native `open-design` MCP entry) — reverted separately this session after confirming `.utcp_config.json`'s Code Mode entry is this repo's actual canonical wiring; the packet's own docs (~11 files) were corrected to stop recommending the native path for this repo.
- **`DESIGN.md` (repo root, untracked) + empty `design-extracts/example-com/`** from `AI-001`-P5 (a timed-out first attempt left the empty dir; the successful retry wrote `DESIGN.md` to repo root instead of a sandbox, since the prompt never specifies an output path) — cleaned up as part of this phase's close-out (see `implementation-summary.md`).
- **A real Open Design project + generation run** were created by `HM-004` (project `linear-grounded-settings-page`, run `b8362f10-b306-4254-83d7-2bfc343183dc`) — left running; cleanup, if wanted, is an operator action through Open Design itself, not something this phase's execution can safely automate.
