---
title: "Goal: Phase 4: private-local-skills"
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
    packet_pointer: "sk-code/013-private-surface-skills/004-private-local-skills"
    last_updated_at: "2026-10-24T16:20:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Closed the phase: both commits pushed, 22 of 22 criteria Met"
    next_safe_action: "Run phase 005 verification"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-004-private-local-skills"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Folder mode: symlink to two external repositories (operator, 2026-10-23)"
---
# Goal: Phase 4: private-local-skills

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Restore the Webflow and Obsidian evidence surfaces as two gitignored symlinks into their own external repositories, one public and one private, so the operator's local advisor routes them while this checkout tracks neither link nor content. Done when: both `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` are symlinks into their repository's `local-skills/` directory, both are ignored here, and the target trees hold 162 and 66 files; the Webflow link audit prints exactly one `BROKEN ... -> target` line and `AUDIT_FAIL=1` while the Obsidian audit prints no `BROKEN` line and `AUDIT_FAIL=0`; each `SKILL.md` carries `name: local-webflow` or `name: local-obsidian`, no `packetKind`, and each skill root holds exactly one `graph-metadata.json`; a throwaway advisor database holds one `skill_nodes` row for each of `local-webflow` and `local-obsidian`; `git status --porcelain .skilled` and `git diff --cached --name-only` print nothing in this checkout, and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints exactly two `!!` lines; `git -C /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com ls-files local-skills/local-webflow` lists 162 paths and `git -C "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin" ls-files local-skills/local-obsidian` lists 66 after each target commit, while each `git -C <repo> show --name-only --format= HEAD` lists no path outside its own `local-skills/<name>`, and each push ran only after an explicit operator yes; `zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'` prints both roots joined by `:`; `validate.sh --strict` on the phase folder prints `RESULT: PASSED` and the phase commit's file list holds no path outside the phase folder; ADR-001 records the operator's answer and `implementation-summary.md` names both repositories.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | ADR-001 records the operator's answer: symlink mode, two external repositories, one per skill. T003, T004 and T094 are the recorded real-folder alternatives and never run. |
| D2 | Both trees are restored from `42b41dd286` into their own repository's `local-skills/` directory and linked into the operator's main checkout; this checkout tracks only this phase's documents, and each target repository tracks only `local-skills/<name>`. |
| D3 | This phase starts only after phase 003's `local-*` compiler skip is present on `main`, because that compiler follows a symlink today. |
| D4 | Each skill carries exactly one skill-root `graph-metadata.json` and no `description.json`. |
| D5 | The evidence records paths and counts only, the documents commit stages files by name, and each target-repository commit stages only `local-skills/<name>` by path. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] both `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` are symlinks into their own repository's `local-skills/` directory, both are ignored here, the target trees hold 162 and 66 files, `git status --porcelain .skilled` and `git diff --cached --name-only` print nothing, and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints exactly two `!!` lines
- [x] `git -C /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com ls-files local-skills/local-webflow` lists 162 paths and `git -C "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin" ls-files local-skills/local-obsidian` lists 66 after each target commit
- [x] `zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'` prints `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills`
- [x] the Webflow link audit prints exactly one `BROKEN ... -> target` line and `AUDIT_FAIL=1` while the Obsidian audit prints no `BROKEN` line and `AUDIT_FAIL=0`
- [x] each `SKILL.md` carries `name: local-webflow` or `name: local-obsidian`, no `packetKind`, and each skill root holds exactly one `graph-metadata.json`
- [x] a throwaway advisor database holds one `skill_nodes` row for each of `local-webflow` and `local-obsidian`
- [x] `validate.sh --strict` on the phase folder prints `RESULT: PASSED`, the phase commit's file list holds no path outside the phase folder, ADR-001 records the two-repository symlink answer, and `implementation-summary.md` names both repositories
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
| Phase opened | Done | Planning documents written, then every task ran |
| Target commits | Done | Webflow `4434c1b3` and Obsidian `c6cd64b7`, each on its `origin/main` |
| Phase commits | Done | `e8256b8044` (launcher allowlist fix and test) and `ff993936c7` (phase documents), pushed `75ef2608d0..ff993936c7`; `HEAD` and `origin/main` both read `ff993936c7ddd2d08b8051c1152642a82ce7cb65` |
| Independent review | Done | 7 PASS rows in `scratch/review-round-1.md` |
| Strict validation | Done | `RESULT: PASSED`, 0 errors and 0 warnings |

### Deviations and findings

| Item | Note |
|------|------|
| Commit split | The launcher code went in its own commit `e8256b8044`, the phase documents in `ff993936c7`, and the closing edit lands as a third commit, so the closing commit is not the one T106 shows |
<!-- /ANCHOR:log -->
