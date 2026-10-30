---
title: "Goal: verification and docs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/005-verification-and-docs"
    last_updated_at: "2026-10-30T17:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Pass captured, both rows answered, docs landed"
    next_safe_action: "Close the 001 phase parent and the top 021 packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: verification and docs

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the check and embed pair together on every fixture, settle the two claims the design could only infer, and leave the doctor family's documentation naming the new surfaces.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every fixture gets its own captured transcript, and the transcripts are the evidence the criteria cite. |
| D2 | A manual row records an unknown with its reason rather than a default pass. |
| D3 | The documentation locations are resolved from the sk-doc router at this child's start, never guessed. |
| D4 | A defect found here goes back to the child that owns it, and its gate is rerun there. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Every baseline command from the parent phase spec reruns from the final tree with the same pass line
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`
- [x] `ls scratch/e2e | wc -l` prints `9`, one transcript per fixture
- [x] Both manual rows carry a recorded observation or a recorded unknown with its reason
- [x] `git status --porcelain` names only files named by children 001 to 005 and no local-only path
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Specification, plan, tasks and criteria authored | Done | This packet's four documents |
| Implementation | Done | `scratch/e2e/` holds nine transcripts, `scratch/baseline.txt` holds both captures, and the recursive gate prints `RESULT: PASSED` |
| Documentation rows | Done | The script README, the catalog category, the two playbook scenarios and the four changelogs |

### Deviations and findings

| Item | Note |
|------|------|
| `adopted` plans on the pre-apply tree | Its lines sit in an unmarked block, so the plan has real work to show. The `NOTHING TO DO` pairing holds on the reconfigured tree. |
| Restore leaves one empty `.cursor` folder | Every recorded file is byte-identical; the folder cleanup belongs to the engine's own child. |
| The sk-doc activation manifest was regenerated and the retrieval corpus was left to CI | The version bump staled the hub's compiled policy manifest, which its own tool republished. The new documents also staled the trigger index, which the Trigger Index Rebuild workflow regenerates after the merge, so the index files are not part of this change. |
| Both manual rows record `UNKNOWN` | No live session was reachable, and a default pass would claim a fact nobody observed. |
<!-- /ANCHOR:log -->
