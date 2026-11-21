---
title: "Goal: shared embeddings package"
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
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package"
    last_updated_at: "2026-11-20T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-497-ollama-lane-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: shared embeddings package

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Delete the shared embeddings package, the HuggingFace model server and their npm dependency, so no package or lockfile ships them.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The `shared/types.ts` edit lands before the package is deleted. |
| D2 | `shared/chunking.ts` and `shared/utils/retry.ts` are deleted with the package and their tests. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npm run build` and `npm test` each exit 0 in `.skilled/skills/system-spec-kit/shared/` and in `.skilled/skills/system-spec-kit/`.
- [x] The advisor clean build, `run-all.sh` and the sk-doc test suite each exit 0.
- [x] `npm ci` exits 0 in every package whose lockfile this phase changed.
- [x] `git grep -l "@huggingface/transformers" -- ':!specs'` lists no file except the residue check and its test, which search for that string on purpose.
- [x] No tracked file is named `hf-model-server.cjs`, `model-server-supervision.cjs`, `shared/chunking.ts` or `shared/utils/retry.ts`.
- [x] `git grep -n ollama-preserve -- .skilled/scripts/orphan-mcp-sweeper.sh` still returns its guard line.
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
| Phase 005 | Implemented, not committed | `tasks.md` T042 to T052 pass on the working tree: criteria 1, 2, 4 (ADR-011 reading), 5 (on the tree the commit records) and 6 hold; criterion 3 waits on T053 |
| Phase 005 | Complete | Committed as 1f85a9dd6dd. T053 closed: npm ci exit 0 in the three packages by the conducting session's report after the operator's yes; @huggingface and onnxruntime-node absent; both typechecks exit 0; shared tests 9 of 9. AC-014 Met. Supersedes the rows above. |
| Completion criteria | Complete | all six ticked: build, test, advisor suites and npm ci per the Verification table; criterion 4 now names the residue check, the only two non-spec files that hold the transformers string; criteria 5 and 6 rechecked on the tree |

### Deviations and findings

| Item | Note |
|------|------|
| Criterion 4 reading | The residue check must name `@huggingface/transformers` to find it, so the grep reads with `sweep-lane-residue.mjs` excluded (`plan.md` ADR-011). The parent objective exempts the check's own allowlisted files and outranks this criterion's wording. |
| Criterion 3 blocked on the operator | `npm ci` is an install, a stop-for-yes in AGENTS.md section 3; the unattended run regenerates lockfiles offline only. The operator runs `npm ci --offline --no-audit --no-fund` in the three packages to meet it. |
<!-- /ANCHOR:log -->
