---
title: "Playbook Test Results: Packet-146 New Scenarios"
description: "MiMo v2.5 Pro execution of the 9 new manual-testing scenarios added for the ponytail-based refinement — sk-code-review CR-020..CR-024 and sk-code DR-001..DR-004. Deterministic guards executed; behavior rules verified against the real skill files; orchestrator cross-checked."
importance_tier: "normal"
---

# Playbook Test Results — Packet-146 New Scenarios

The playbook coverage added for this feature introduced two new categories — `sk-code-review/manual_testing_playbook/08--efficiency-and-restraint` (CR-020..CR-024) and `sk-code/manual_testing_playbook/08--design-restraint` (DR-001..DR-004). This note records a one-pass execution of those 9 scenarios.

**Date:** 2026-06-13
**Executor:** MiMo v2.5 Pro (`xiaomi/mimo-v2.5-pro --variant high`) via `cli-opencode`, COSTAR-lean brief, read-only, `--format json`, two sequential seats with a SIGKILL between (single-dispatch discipline).
**Cross-check:** orchestrator (Claude) confirmed the deterministic guards genuinely ran from the JSON tool-call stream, ground-truthed the DR-004 orphan negative case directly, and spot-checked cited line numbers.

---

## Verdicts

### sk-code-review — 08 Efficiency & Restraint

| ID | Scenario | Verdict | Evidence |
|----|----------|---------|----------|
| CR-020 | Reinvent-the-wheel detection | PASS | `code_quality_checklist.md` §6 (L117-118) — both rows present, recommend the standard/native API |
| CR-021 | Unrequested-code removal | PASS | §7 needed-ness prompt (removal, P2 default / P1 on risk) + `removal_plan.md` §2 Replacement field |
| CR-022 | Ceiling-comment downgrade | PASS | §7 downgrades a too-simple P2; security/auth/persistence/correctness explicitly excluded |
| CR-023 | Review-depth alias | PASS | `SKILL.md` §9.3 (L514) — env>config>default, ultra→ON_DEMAND, lite→M-2 skip, no floor relaxed |
| CR-024 | Rule-invariant canary | PASS | **executed**: canary exit 0 (`4 exact-string + 3 Iron Law files`); self-test all 3 cases pass |

### sk-code — 08 Design Restraint

| ID | Scenario | Verdict | Evidence |
|----|----------|---------|----------|
| DR-001 | Design Restraint Ladder | PASS | `code_quality_standards.md` ladder rungs + `phase_detection.md` Phase 0→1 gate |
| DR-002 | Implementer anti-stall | PASS | `SKILL.md` §4 — implement + scope-amendment in one response, no stall, SCOPE-LOCK held |
| DR-003 | Ceiling comment convention | PASS | `code_style_guide.md` §4 (L165) — neutral prefix, not in the hygiene allow-list |
| DR-004 | STACK_FOLDERS validator | PASS | **executed**: clean run exit 0 (`3 surfaces resolve`); orphan→problem reported / non-zero (orchestrator ground-truth) |

**Result: 9/9 PASS.**

---

## Method & Scope Caveat

- **Deterministic guards (CR-024, DR-004)** were truly executed by MiMo, with real tool-call output captured in the JSON stream. The DR-004 orphan-detection negative case (which MiMo confirmed from source) was additionally run end-to-end by the orchestrator: an orphan `assets/` folder produced a non-zero exit and was reported, and cleanup restored a clean pass.
- **The seven behavior scenarios** are "rule-present-and-fires-on-the-stated-premise" judgments grounded in the real skill files. A model dispatched through `opencode run` cannot load the Claude-runtime skill router or write to the repo (Gate 3), so it cannot reproduce a live `SURFACE: OPENCODE` emission or apply an actual edit. These verdicts therefore confirm the skill rules exist, are specific, and would drive the intended behavior — they are not a live end-to-end routing capture.
- Raw executor output: `/tmp/mimo-skcr.json`, `/tmp/mimo-skc.json` (transient).
