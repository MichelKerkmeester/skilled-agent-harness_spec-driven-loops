---
title: "Implementation Plan: Phase 4: hub-router-merge"
description: "Move each of the seven hubs' MACHINE ROUTER prose from SKILL.md into a named section of its root ROUTER.md, leave one pointer line behind, and prove the move with an identical replay capture and identical compiled route decisions."
trigger_phrases:
  - "hub router merge plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: hub-router-merge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js, Python 3.9 for the checks |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest, `node --test`, the per-hub check and the replay capture |

### Overview
The seven hub SKILL.md files trade their MACHINE ROUTER section and the SMART ROUTING sentence that points at it for one pointer line, and each root `ROUTER.md` gains the moved prose as a final named section. The stage-two machine block stays where it is and remains the only replay source. The proof is an identical replay capture, identical compiled route decisions and seven green per-hub checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing and `compiled-route-guard.cjs` reports seven fresh hubs
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One pointer, one prose home

### Key Components
- **Root `ROUTER.md`**: owns the stage-two machine block and, after the move, the routing prose that explains it.
- **SKILL.md pointer**: one line at the end of SMART ROUTING that names the sibling `ROUTER.md`.
- **Replay and guard**: the replay scores the machine block against the hub's gold rows, and the compiled-route guard checks the manifest against the bytes it hashed.

### Data Flow
The runtime loads SKILL.md, the agent reads the pointer and then reads `ROUTER.md` only when it selects hub resources. The replay parses the machine block in `ROUTER.md`, converts every resource path to a typed leaf pair and scores it against the hub's committed gold rows. The move adds no second map, so that path and its scores stay the same.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the replay lines, the machine-section hashes and one compiled route per hub. Implementation moves the seven hubs and raises their editions. Verification reruns every capture, refreshes the generated files and runs the gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The replay capture is the main proof. Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` before the first edit and after the last one, redirect each run to `scratch/replay-before.txt` and `scratch/replay-after.txt`, and require `diff` to print nothing. The capture prints one line per hub plus a total, and today the total reads `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`.

The decision capture is the second proof. Run `node .skilled/bin/compiled-route.cjs` once per hub, passing that hub's id and a prompt from its playbook, and use the same hub and prompt pair on both sides. For `sk-doc`, `--hub sk-doc --prompt "write a skill README"` returns a `route` to `sk-create-readme` today. Compare the `action`, `selectionKind` and `targets` fields. The `effectivePolicyHash` and `generation` fields change by design, because the compiler hashes the SKILL.md bytes.

The remaining checks are `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` for each hub, `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`, `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills/sk-doc --check-router`, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` and `pytest .skilled/skills/sk-doc/scripts/tests/`. Each must report its affirmative marker, not merely a zero exit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 002's resolver and phase 003's rewritten checks block the first edit. The pre-commit route re-mint gate refreshes each compiled-route manifest and its authored copy when a hub SKILL.md is staged, and the doc version bump gate raises each edited `ROUTER.md` version, so no manifest or version is edited by hand.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the replay capture differs on a hub, or a hub returns a different compiled route after the move. Procedure: revert the phase commit. The re-mint gate runs on the revert commit and stages the restored manifests, so rerun `node .skilled/bin/compiled-route-guard.cjs` and require seven fresh hubs.
<!-- /ANCHOR:rollback -->

---
