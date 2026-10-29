---
title: "Tasks: Phase 4: hub-router-merge"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub router merge tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: hub-router-merge

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

`R` is `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`. `G` is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the replay lines on the tree with phases 002 and 003 landed (`scratch/replay-before.txt`). Verify: `node "$R"` prints seven `hub=` lines and one `total` line, and the file holds them.
- [ ] T002 Capture one compiled route per hub with a fixed prompt (`scratch/routes-before.txt`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "write a skill README"` prints one JSON object, and the file holds seven of them.
- [ ] T003 Hash the machine section of each hub router (`scratch/machine-sections-before.txt`). Verify: `sed -n '/^## .*MACHINE-READABLE ROUTER/,/^## /p' .skilled/skills/sk-doc/ROUTER.md | sha256sum` prints one hash, and the file holds seven.
- [ ] T004 Confirm the seven per-hub checks pass before the edit. Verify: `node "$G" .skilled/skills/sk-doc` prints `OK: parent-skill-check`, and the same command on the other six hub paths prints `OK`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Move the `cli-classifier` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c '^## .*MACHINE ROUTER' .skilled/skills/cli-classifier/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/cli-classifier/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER NOTES' .skilled/skills/cli-classifier/ROUTER.md` prints 1.
- [ ] T006 [P] Move the `cli-external-orchestration` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c '^## .*MACHINE ROUTER' .skilled/skills/cli-external-orchestration/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/cli-external-orchestration/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER NOTES' .skilled/skills/cli-external-orchestration/ROUTER.md` prints 1.
- [ ] T007 [P] Move the `mcp-tooling` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c '^## .*MACHINE ROUTER' .skilled/skills/mcp-tooling/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/mcp-tooling/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER NOTES' .skilled/skills/mcp-tooling/ROUTER.md` prints 1.
- [ ] T008 [P] Move the `sk-code` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c '^## .*MACHINE ROUTER' .skilled/skills/sk-code/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-code/SKILL.md` prints 1, and `grep -c '^## 11. MACHINE ROUTER NOTES' .skilled/skills/sk-code/ROUTER.md` prints 1.
- [ ] T009 [P] Move the `sk-design` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c '^## .*MACHINE ROUTER' .skilled/skills/sk-design/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-design/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER NOTES' .skilled/skills/sk-design/ROUTER.md` prints 1.
- [ ] T010 [P] Move the `sk-doc` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c '^## .*MACHINE ROUTER' .skilled/skills/sk-doc/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-doc/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER NOTES' .skilled/skills/sk-doc/ROUTER.md` prints 1.
- [ ] T011 [P] Move the `system-deep-loop` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c '^## .*MACHINE ROUTER' .skilled/skills/system-deep-loop/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/system-deep-loop/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER NOTES' .skilled/skills/system-deep-loop/ROUTER.md` prints 1.
- [ ] T012 Raise the seven editions and align their carriers (`SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `changelog/`). Verify: `node "$G" .skilled/skills/sk-doc` prints PASS on 13a and 13b, and the same command on the other six hubs does too.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Rerun the replay (`scratch/replay-after.txt`). Verify: `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing.
- [ ] T014 Rerun the compiled routes (`scratch/routes-after.txt`). Verify: the compared `action`, `selectionKind` and `targets` values match for all seven hubs.
- [ ] T015 Rerun the machine-section hashes (`scratch/machine-sections-after.txt`). Verify: `diff scratch/machine-sections-before.txt scratch/machine-sections-after.txt` prints nothing.
- [ ] T016 Regenerate the derived copies (`.hermes/skills/`, the two activation manifest roots). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS` and `node .skilled/bin/compiled-route-guard.cjs` reports seven fresh hubs.
- [ ] T017 Run the routing suites (`.skilled/skills/sk-doc/scripts/tests/`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/`, `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs`). Verify: each run reports no failure and records its passed count in `scratch/`.
- [ ] T018 Run the seven per-hub checks. Verify: `node "$G" .skilled/skills/sk-doc` prints `OK: parent-skill-check`, and the same command on the other six hub paths prints `OK`.
- [ ] T019 Run validation on this packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/004-hub-router-merge --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing, and the guard reports seven fresh hubs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---
