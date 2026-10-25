---
title: "Goal: Private Surface Skills"
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
    packet_pointer: "sk-code/013-private-surface-skills"
    last_updated_at: "2026-10-23T14:10:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Phase 001 landed on main as 7648ae8b56; phase 002 in progress uncommitted"
    next_safe_action: "Finish phase 002 T039, then continue at T040"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-013-private-surface-skills"
      parent_session_id: null
    completion_pct: 27
    open_questions:
      - "Rewrite history after phase 005's read-only inventory?"
    answered_questions:
      - "Phase 004 layout: gitignored symlinks to two external local-skills/ folders, answered 2026-10-23."
---
# Goal: Private Surface Skills

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the Webflow and Obsidian surfaces from the shipped sk-code hub and return them as two `local-*` skills this checkout links to but never tracks, kept in two external repositories (Obsidian public by operator choice, Webflow private) and routed only by the operator's local advisor, with nothing reaching a tracked file, the committed trigger index or the Hermes mirror.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hub ships `sk-code-quality`, `sk-code-review` and `sk-code-skilled`; the two surfaces return only as gitignored `local-*` symlinks to two external `local-skills/` folders. |
| D2 | Four slash-less rules ignore `local-*` under `.skilled`, `.hermes`, `.codex`, `.cursor`; a blocking guard refuses a staged `local-*` path under all eight skill roots. |
| D3 | Recorded limits: `--no-verify` bypasses the guard, history keeps the content, a renamed copy passes, and no standing pre-push token guard exists. |
| D4 | A followed top-level `local-*` symlink must resolve inside the skills root or one of the two roots in `SPECKIT_PRIVATE_SKILL_ROOTS`; no other link is followed. |
| D5 | Every tracked-output writer skips a `local-*` name before its first probe. |
| D6 | The boundary is the hub tree, tracked consumers naming the two surfaces, and the advisor's sk-code vocabulary; generic words elsewhere, dated records and history stay unchanged. |
| D7 | No history rewrite here; scrubbing is an optional decision after phase 5's inventory. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-ignore-and-commit-guard | `001-ignore-and-commit-guard/goal.md` |
| 002-hub-surface-removal | `002-hub-surface-removal/goal.md` |
| 003-advisor-vocabulary-cleanup | `003-advisor-vocabulary-cleanup/goal.md` |
| 004-private-local-skills | `004-private-local-skills/goal.md` |
| 005-leak-and-routing-verification | `005-leak-and-routing-verification/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills --recursive --strict` prints `RESULT: PASSED`.
- [x] `git ls-files` lists no path under `.skilled/skills/sk-code/sk-code-webflow/` or `.skilled/skills/sk-code/sk-code-obsidian/`, and `.skilled/skills/sk-code/mode-registry.json` declares `sk-code-quality`, `sk-code-review` and `sk-code-skilled`.
- [x] `.skilled/skills/local-*/SKILL.md` exists through its symlink, each skill root holds one `graph-metadata.json`, and `git status --porcelain .skilled` prints nothing.
- [x] A fresh clone of `origin/main` prints `0 live` paths matching `local-(webflow|obsidian)|sk-code-(webflow|obsidian)` from `git ls-files -- ':!specs/**'`, `108 retained` under `specs/`, and `336` at `42b41dd286`.
- [x] `node .skilled/bin/skill-advisor.cjs advisor_recommend` in the operator checkout, with both external roots in `SPECKIT_PRIVATE_SKILL_ROOTS`, returns `local-webflow` for `implement a responsive webflow animation module`, `local-obsidian` for `add an obsidian plugin command palette integration`, and `sk-code` for `add a responsive css layout to the settings page`.
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
| Parent planning documents finished | Done | `spec.md` map, handoff blocks and open questions rewritten, `goal.md` authored on 2026-10-23 |
| Phase 001 | Done | Harness `pre-commit gates: 131 passed, 0 failed`, commit `7648ae8b56` on `origin/main` |
| Phase 002 | Done | Commit `e3beac65f4` plus the compiled-graph follow-up `1218b94938` on `origin/main`, CI 15 of 15 green |
| Phase 003 | Done | Four review rounds closed with no open P0 or P1; advisor suite 147 files green, Python `pass=84`; committed with the advisor refactor on 2026-10-24 |
| Phase 004 | Done | Commits `e8256b8044` and `ff993936c7` on `origin/main`, plus the external commits `4434c1b` (anobel.com) and `c6cd64b7` (Obsidian Plugin); operator approvals recorded in `004-private-local-skills/scratch/operator-approvals.md` |
| Phase 005 | Done | Commits `01742752c1` and `ee0fdc94eb` on `origin/main`; 15 of 15 criteria Met, a final-tip clone at `634c32b3c7` matched the earlier run, strict validation passed |

### Deviations and findings

| Item | Note |
|------|------|
| The parent spec carried no D-rows | The children cite the parent packet's D1-D7, so the parent now states them under Scope > Frozen Decisions and this goal repeats them. |
<!-- /ANCHOR:log -->
