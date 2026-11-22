---
title: "Implementation Plan: Phase 6: verification"
description: "Prove each mode with a playbook run, run the 14-step Bladebro macOS plan after the install yes, then benchmark both routing stages and run the alignment check."
trigger_phrases:
  - "verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbooks and benchmark reports |
| **Framework** | `/create:manual-testing-playbook`, a two-stage routing replay (producer pending, `spec.md` section 7), `/local-skilled-alignment` |
| **Storage** | None |
| **Testing** | Manual playbook runs, the live 14-step Bladebro run, a two-stage routing benchmark |

### Overview
Ask once for the Bladebro install yes with its rollback. After the yes, run the 14-step macOS plan in `spec.md` section 3, recording real output beside expected output, with the R-SEC-1 and R-SEC-2 gates on the real-browser steps. Write and run the three mode playbooks and the hub-routing playbook, enroll the new roots in the fail-closed allowlist, benchmark both routing stages, and run `/local-skilled-alignment`. Scope comes from `../001-research/research/research.md` §8, §9, §11 and `iterations/iteration-006.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `../001-research/research/research.md` section for this phase read and this spec refined from it (§8, §9, §11, plus `iteration-006.md`)
- [ ] 002-005 complete, and 005's two-stage replays pass for all three modes
- [ ] The operator has answered the install question (yes or no)
- [x] The operator has answered the benchmark-producer question in `spec.md` section 7 (2026-11-21: the two-stage replay)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Three mode playbook runs and the hub-routing run recorded, the live Bladebro run in place (or an operator-approved deferral of it), and the alignment report lists no open blocker
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual verification pass

### Key Components
- **Install gate**: one operator question naming the rollback; nothing in steps 3-14 runs without the yes
- **Bladebro playbook**: the 14-step run; agent-browser probe in steps 7-10, real-browser probe in steps 11-13
- **Chrome DevTools, Aside and hub-routing playbooks**: evidence each mode and the hub work from the new paths
- **Routing benchmark and alignment report**: evidence the routing and connected surfaces agree

### Data Flow
The install answer decides the Bladebro branch: a yes leads to steps 3-14, a no leads to an "unverified on macOS" record that keeps REQ-001 open as a blocker. Playbook results, the benchmark and the alignment report feed the parent's completion criteria. A packet correction goes to 004, a routing miss to 005.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup asks for the install yes and runs steps 1-6. Implementation runs steps 7-14, writes and runs the playbooks, enrolls the new roots and runs the benchmark. Verification runs `/local-skilled-alignment`, confirms teardown, and records the results. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each step of the 14-step plan passes when its real output matches the expected output column; a mismatch is recorded as a finding, not retried away. Each playbook's recorded run, the playbook validator's zero-violation result for each new root, the benchmark report's per-mode stage-one and stage-two rates, and the alignment report's blocker list.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`npm` and Node 14 or later for the Bladebro install after approval, a Chromium-family browser on macOS, `shasum`, and the two installed CLIs `aside` and `bdg`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a step fails, a digest mismatches, or Bladebro misbehaves on macOS. Apply that step's rollback from the plan table (`bladebro stop`, `rb off`, `rb forget`, removing the MCP entry), then `npm uninstall -g bladebro` and remove the doctor-reported data root once no needed named session remains. Record the failure in the playbook and mark the mode unverified on macOS.
<!-- /ANCHOR:rollback -->

---
