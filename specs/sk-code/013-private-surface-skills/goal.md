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
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-013-private-surface-skills"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Phase 004 folder mode: real folder or symlink to a private repository?"
      - "Rewrite history after phase 005's read-only inventory?"
    answered_questions: []
---
# Goal: Private Surface Skills

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the Webflow and Obsidian surfaces from the shipped sk-code hub and return them as two gitignored private skills that only the operator's local advisor routes, with nothing about them reaching a tracked file, the committed trigger index or the Hermes mirror.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hub ships `sk-code-quality`, `sk-code-review` and `sk-code-skilled`; the two surfaces return only as gitignored `local-*` skills. |
| D2 | Four slash-less root rules ignore `local-*` under `.skilled`, `.hermes`, `.codex` and `.cursor`; a blocking guard refuses a staged `local-*` path under `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin`, `.hermes`, `.codex` and `.cursor`. |
| D3 | Recorded limits: `--no-verify` bypasses the guard, history keeps the removed content, a renamed copy passes, and no standing pre-push token guard exists. |
| D4 | A followed top-level `local-*` symlink must resolve inside the skills root or a root in `SPECKIT_PRIVATE_SKILL_ROOTS`; no other link is followed. |
| D5 | Every tracked-output writer skips a `local-*` name before its first filesystem probe. |
| D6 | The boundary is the hub tree, tracked consumers naming the two surfaces, and the advisor's sk-code vocabulary; other skills' generic words, dated records and history stay unchanged. |
| D7 | No history rewrite runs here; scrubbing is an optional operator decision after phase 5's read-only inventory. |

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

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills --recursive --strict` prints `RESULT: PASSED`.
- [ ] `git ls-files` lists no path under `.skilled/skills/sk-code/sk-code-webflow/` or `.skilled/skills/sk-code/sk-code-obsidian/`, and `.skilled/skills/sk-code/mode-registry.json` declares `sk-code-quality`, `sk-code-review` and `sk-code-skilled`.
- [ ] `.skilled/skills/local-webflow/SKILL.md` and `.skilled/skills/local-obsidian/SKILL.md` exist, each skill root holds one `graph-metadata.json`, and `git status --porcelain .skilled` prints nothing.
- [ ] A fresh clone of `origin/main` prints `0 live` tracked paths matching `local-(webflow|obsidian)|sk-code-(webflow|obsidian)` from `git ls-files -- ':!specs/**'`, `108 retained` under `specs/`, and `336` at `42b41dd286`.
- [ ] `node .skilled/bin/skill-advisor.cjs advisor_recommend` in the operator checkout returns `local-webflow` for `implement a responsive webflow animation module`, `local-obsidian` for `add an obsidian plugin command palette integration`, and `sk-code` for `add a responsive css layout to the settings page`.
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
| Phase 001 | Pending | `001-ignore-and-commit-guard/tasks.md` |
| Phases 002 to 005 | Pending | Each child's `tasks.md`, in order |

### Deviations and findings

| Item | Note |
|------|------|
| The parent spec carried no D-rows | The children cite the parent packet's D1-D7, so the parent now states them under Scope > Frozen Decisions and this goal repeats them. |
<!-- /ANCHOR:log -->
