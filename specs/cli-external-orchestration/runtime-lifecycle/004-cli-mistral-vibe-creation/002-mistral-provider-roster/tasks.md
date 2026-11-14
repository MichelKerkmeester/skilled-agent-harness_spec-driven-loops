---
title: "Tasks: Phase 2: mistral-provider-roster"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mistral provider roster tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: mistral-provider-roster

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`O` is `.skilled/skills/cli-external-orchestration/cli-opencode`. `P` is `.skilled/skills/cli-external-orchestration/cli-pi`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List the live Mistral ids on both CLIs (`evidence/probes.md`). Verify: `opencode models --standalone | grep '^mistral/'` and `pi --list-models mistral` both print `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash`.
- [x] T002 [P] Probe both ids on OpenCode beside a DevPass control (`evidence/probes.md`). Verify: all three `opencode run` replies read `OK`.
- [x] T003 [P] Probe both ids on Pi beside a DevPass control (`evidence/probes.md`). Verify: the control reads `OK` and both Mistral ids read `OK` with a valid `--api-key`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `mistral` section and effort row (`O/references/providers-and-models.md`). Verify: `rg -c 'mistral/' O/references/providers-and-models.md` prints at least 4.
- [x] T005 Change the reachable-provider count to five (`O/SKILL.md`). Verify: `rg -n 'Five providers are reachable' O/SKILL.md` prints one line.
- [x] T006 Add the `mistral` section, direct dispatch only (`P/references/providers-and-models.md`). Verify: `rg -n 'Direct dispatch only' P/references/providers-and-models.md` prints one line.
- [x] T007 Change the reachable-provider count to five (`P/SKILL.md`). Verify: `rg -n 'Five providers are reachable' P/SKILL.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate the four edited docs (`O`, `P`). Verify: `validate_document.py` prints `Total issues: 0` for each.
- [x] T009 Run the default-model test (`O/scripts/tests/default-model-id.test.cjs`). Verify: `node` prints `pass 6` and `fail 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `evidence/probes.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: See `evidence/probes.md`
<!-- /ANCHOR:cross-refs -->

---
