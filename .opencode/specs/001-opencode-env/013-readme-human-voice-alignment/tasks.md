# Tasks: README Human Voice Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Wave 1: Priority Files + Skill Update (CRITICAL PATH)

- [ ] T001 Apply HVR to root .opencode/README.md (style reference)
- [ ] T002 Apply HVR to system-spec-kit/README.md (keep anchors, priority alignment)
- [ ] T003 Apply HVR to mcp_server/README.md (strip anchors, priority alignment)
- [ ] T004 Update workflows-documentation/SKILL.md with HVR enforcement section
- [ ] T005 Update workflows-documentation/references/ with HVR rules integration
- [ ] T006 Commit Wave 1 with descriptive message

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Wave 2: Skill READMEs Batch A

- [ ] T007 [P] Agent 1: Apply HVR to workflows-code--web-dev/README.md
- [ ] T008 [P] Agent 1: Apply HVR to workflows-code--full-stack/README.md
- [ ] T009 [P] Agent 1: Apply HVR to workflows-code--opencode/README.md
- [ ] T010 [P] Agent 1: Apply HVR to workflows-documentation/README.md
- [ ] T011 [P] Agent 2: Apply HVR to workflows-git/README.md
- [ ] T012 [P] Agent 2: Apply HVR to workflows-chrome-devtools/README.md
- [ ] T013 [P] Agent 2: Apply HVR to mcp-figma/README.md
- [ ] T014 [P] Agent 2: Apply HVR to mcp-code-mode/README.md
- [ ] T015 Commit Wave 2

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Wave 3: Spec Kit Internal READMEs

- [ ] T016 [P] Agent 1: Apply HVR to system-spec-kit/templates/README.md (and sub-READMEs)
- [ ] T017 [P] Agent 1: Apply HVR to system-spec-kit/scripts/README.md (and sub-READMEs)
- [ ] T018 [P] Agent 2: Apply HVR to system-spec-kit/references/README.md (and sub-READMEs)
- [ ] T019 [P] Agent 2: Apply HVR to system-spec-kit/assets/README.md (if exists)
- [ ] T020 [P] Agent 3: Apply HVR to remaining system-spec-kit sub-directory READMEs
- [ ] T021 Commit Wave 3

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Wave 4: Agent, Command, and Top-Level READMEs

- [ ] T022 [P] Agent 1: Apply HVR to .opencode/agent/ READMEs (if any exist)
- [ ] T023 [P] Agent 2: Apply HVR to .opencode/command/ READMEs (if any exist)
- [ ] T024 [P] Agent 3: Apply HVR to remaining .opencode/ top-level READMEs
- [ ] T025 Commit Wave 4

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Wave 5: Mop-Up

- [ ] T026 Inventory all README.md files, cross-reference with completed tasks
- [ ] T027 [P] Process any README files missed in Waves 1-4
- [ ] T028 Commit Wave 5

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Wave 6: Verification

- [ ] T029 Run grep check: zero em dashes across all README files
- [ ] T030 Run grep check: zero semicolons outside code blocks
- [ ] T031 Run grep check: zero banned words (leverage, robust, seamless, utilize, comprehensive, cutting-edge, innovative, streamline, facilitate, empower, holistic, synergy, paradigm)
- [ ] T032 Run grep check: zero Oxford commas
- [ ] T033 Verify anchor tags only in system-spec-kit/README.md
- [ ] T034 Spot-check 5 random READMEs for natural voice and meaning preservation
- [ ] T035 Fix any violations found in T029-T034
- [ ] T036 Final commit with corrections (if needed)

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Wave 6 verification passed with zero violations
- [ ] workflows-documentation skill contains permanent HVR section

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS - README Human Voice Alignment
36 tasks across 6 waves
Waves 2-5 parallelizable after Wave 1
-->
