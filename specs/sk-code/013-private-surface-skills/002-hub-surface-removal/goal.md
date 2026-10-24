---
title: "Goal: Phase 2: hub-surface-removal"
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
    packet_pointer: "specs/sk-code/013-private-surface-skills/002-hub-surface-removal"
    last_updated_at: "2026-10-23T12:40:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Applied T001 to T038 uncommitted in the main checkout; T039 partial"
    next_safe_action: "Finish T039 (code-quality-standards.md lines 16, 24, 39, 49, 56), then continue at T040"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deepseek-v4.1-flash-1017-002-planning"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: hub-surface-removal

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove both example surfaces from the shipped `sk-code` hub so it ships only `sk-code-quality`, `sk-code-review` and `sk-code-skilled`, with no tracked file or generated artifact outside the dated records still naming them.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Both packets leave the tracked tree with `git rm -r`; the content stays reachable at `42b41dd286`, and phase 4 rebuilds it under ignored `local-*` symlinks to two external `local-skills/` folders. |
| D2 | Only the named generator writes `leaf-manifest.json`, `graph-metadata.json`, the README manifests, the Hermes copies and the compiled-routing manifest. |
| D3 | `ROUTER.md` and `graph-metadata.json`'s `causal_summary` are the only hand-edited artifacts in that generated set. |
| D4 | Four `WEBFLOW:` tag lines in three files stay, and every `changelog/` and `benchmark/reports/` record stays byte-identical to `42b41dd286`. |
| D5 | The trigger index and the three retrieval fixtures are left to CI; no task writes them and no criterion counts them. |
| D6 | The closure is the two greps in AC-007, not every mixed-case mention; the three recorded survivors stay. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `git ls-files` lists zero paths under `.skilled/skills/sk-code/sk-code-webflow/` and `.skilled/skills/sk-code/sk-code-obsidian/`
- [ ] `mode-registry.json` declares the three workflow modes `sk-code-quality,sk-code-review,sk-code-skilled` and the surface axis `["sk-code-skilled"]`
- [ ] `rg -c 'sk-code-webflow|sk-code-obsidian'` over `.skilled/skills/sk-code`, `.skilled/bin`, `.skilled/commands/doctor`, `.skilled/skills/sk-doc`, `README.md` and `.skilled/skills/README.txt` prints `0`
- [ ] `rg -n 'WEBFLOW|OBSIDIAN'` over `.skilled/skills/sk-code` and `.hermes/skills/sk-code*` prints exactly four lines in three files
- [ ] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` prints `doc-claims: 4/4 checks passed`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict` prints `RESULT: PASSED`, `git status --porcelain` is empty, and `git rev-parse HEAD` equals `git rev-parse origin/main`
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
| Phase opened | Done | `tasks.md` holds 108 tasks in execution order |
| Setup, baselines and deletions | Done | T001 to T004: hook trusted, phase 001 on `origin/main`, baselines 158/164/1338 recorded, 226 staged deletions |
| Registries and leaf manifest | Done | T005 to T014: three modes and one surface declared, `vocabularyClasses` at 11 keys, `leaf-manifest.json OK` from the generator check |
| `ROUTER.md` and hub documents | In progress | T015 to T038 applied uncommitted; T039 partial with five `code-quality-standards.md` lines still to edit |
| Consumers, tests and closure | Pending | T040 to T108 |

### Deviations and findings

| Item | Note |
|------|------|
| T039 partial | `code-quality-standards.md` still holds 5 `webflow\|obsidian` lines at :16, :24, :39, :49 and :56; the ~82, ~118 and ~177 edits are applied |
| Work uncommitted | All phase-002 work is in the worktree only: 226 staged deletions plus 15 modified files; nothing is committed or pushed |
<!-- /ANCHOR:log -->
