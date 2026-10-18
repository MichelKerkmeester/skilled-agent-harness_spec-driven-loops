---
title: "Goal: Phase 7: install-guidance-and-setup-helper"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "install guidance and setup helper goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/007-install-guidance-and-setup-helper"
    last_updated_at: "2026-10-18T12:45:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-install-guidance-and-setup-helper"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: install-guidance-and-setup-helper

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a user one setup helper and one install reference that reproduce the OpenCode 1.19.3 and 2.0.32 layouts side by side, v1 only or v2 only, without touching an existing install.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | The helper derives every path from HOME, so a throwaway HOME is the whole isolation boundary for a proof. |
| L2 | The helper writes the launcher last, and only after both npm installs succeed. |
| L3 | The helper never runs uninstall, upgrade or a service command. Rollback lines are printed, never executed. |
| L4 | The reference says that `--version` shows the version and does not show that plugins load. Plugin load is the proof in 008. |
| L5 | The reference labels the `opencode.db` adoption claim as documented, because the launcher comment is the only source. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] With a throwaway HOME and the PATH in plan.md section 4.3, `opencode-setup.sh both` exits 0, and the names `opencode` and `opencode2` print `1.19.3` and `opencode v2.0.32`.
- [x] A second `both` run in the same throwaway HOME changes no file, as the hash comparison shows, and every step prints its rollback line.
- [x] `opencode-setup.sh check` on the throwaway layout names both binaries, classifies each by output shape, and exits 0 without a file change.
- [x] The operator's install paths and config folders show the same snapshot before and after the proof.
- [x] `validate_document.py` on `references/install-and-versions.md` with `--type install_guide` reports no blocking error.
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
| Planning documents filled | Done | `validate.sh --strict` output in the orchestrator report |
| Operator snapshot (T001) | Done | `scratch/snapshot-before.txt`; final bracket in `scratch/bracket/` |
| Helper written (T004) | Done | `scripts/opencode-setup.sh`, by DeepSeek (decision 0) |
| Proof of `both` (T010) | Done | `scratch/final/both-1.txt`, exit 0, both versions |
| Idempotence and check (T011, T012) | Done | `scratch/final/idempotence.txt`, one tree hash after run 1, run 2 and check |
| Reference validation (T014) | Done | `scratch/final/validator.txt`, 0 issues |
| Final snapshot (T015) | Done | `scratch/bracket/before-after.diff`: no difference caused by the proof; the two shm timestamps it lists also move with nothing of the orchestrator's running (decision 16) |
| Review | Done | `scratch/review-verify7-luna.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| Validator type | The reference file name does not match the `install_guide` auto-detect rule. Default: pass `--type install_guide` explicitly. Open question Q7 in spec.md. |
| Working version check | The brief says "working pair". This phase proves that each name reports its version. Plugin load belongs to 008. Decision L4. |
| Database adoption | The claim that v2 migrates `opencode.db` in place is in the launcher comment and iteration-015 F6. Nothing probed it, so the reference labels it documented. |
| Service behaviour | Whether an install script starts the v2 service is unknown (Q6). The snapshot records the process list before and after. Resolved for this proof: the throwaway install started no service process (`scratch/final/ps-after-both.txt`). |
| Executors | The operator asked for DeepSeek wherever possible, so DeepSeek wrote the code and Luna reviewed it, the reverse of T004 and T006 (decision 0). |
| v2 log append | The v2 binary logs every launch, which broke the no-file-change criteria. The helper now probes with `XDG_DATA_HOME` set to a temporary folder (decisions 18 and 19). |
| Operator-HOME listing | An earlier `opencode models` listing of the orchestrator's touched the operator's database (decision 14). The final bracket replaced that comparison with no such command inside it (decision 16). |
<!-- /ANCHOR:log -->
