---
title: "Goal: Phase 5: leak-and-routing-verification"
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
    packet_pointer: "sk-code/013-private-surface-skills/005-leak-and-routing-verification"
    last_updated_at: "2026-10-23T13:55:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-005-leak-and-routing-verification"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Do the three drift scripts pass once both symlinked private skills exist? Answered by 13-drift.md during execution."
    answered_questions: []
---
# Goal: Phase 5: leak-and-routing-verification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove from a fresh clone of the public remote that the two removed surfaces left no tracked path, no live routing entry, no reachable private byte and no routing hole in either checkout that consumes this hub. Done when: `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/` holds 15 files named 00-preflight.md through 14-corpus-boundary.md; in the final clone the live tracked-path count outside `specs/` is 0 while 108 retained `specs/` paths are counted separately, the content sweep leaves 8 allowlisted D6 paths and 0 others, and the bare-token count is 0; the rebuilt trigger index holds 0 `.skilled/` paths and 69 allowlisted `specs/sk-code/007-sk-code-obsidian-surface/` paths, and the manifest, diagnostics and variants print 69, 0 and 38; the blob comparison records the private ids the base tree already carried as already public in history, records the three hub references copied from `shared/references/`, and prints 0 for new or changed content while its control prints at least 1, and the corpus probe prints 0 for its marker while its control prints at least 1; both checkouts return local-webflow, local-obsidian and sk-code for the three fixed prompts; `validate.sh --strict` on this folder prints RESULT: PASSED; and the last evidence commit is pushed with `git status --porcelain` empty and HEAD equal to origin/main.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fresh clone of `origin/main` is the authority for every path, content, blob and artifact check; the working tree is not evidence. |
| D2 | The artifact zero check is scoped to `.skilled/` paths, and the 69 retained `specs/sk-code/007-sk-code-obsidian-surface/` paths are counted against a written-out allowlist rather than folded into that zero. |
| D3 | New or changed private content is proven absent by git blob identity, while the bytes the base tree already carried and the hub references copied from `shared/references/` are recorded as already public in history; partial content is covered by the marker and token sweeps, and neither check claims the other's ground. |
| D4 | Routing is probed in the operator checkout and in the Obsidian Plugin checkout, never in the writer worktree, which holds neither symlink; both advisor processes export the two external `local-skills/` roots in `SPECKIT_PRIVATE_SKILL_ROOTS`. |
| D5 | History, tags and release assets are inventoried read-only; no rewrite, force push or asset deletion runs in this phase. |
| D6 | This phase writes only inside its own folder, never edits a private skill, a D6 kept record or a drift failure, and commits at three named points with the last push's CI result in the handoff. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/` holds 15 files named 00-preflight.md through 14-corpus-boundary.md
- [ ] in the final clone the live tracked-path count outside `specs/` is 0 while 108 retained `specs/` paths are counted separately, the content sweep leaves 8 allowlisted D6 paths and 0 others, and the bare-token count is 0
- [ ] the rebuilt trigger index holds 0 `.skilled/` paths and 69 allowlisted `specs/sk-code/007-sk-code-obsidian-surface/` paths, and the manifest, diagnostics and variants print 69, 0 and 38
- [ ] the blob comparison records the private ids the base tree already carried as already public in history, records the three hub references copied from `shared/references/`, and prints 0 for new or changed content while its control prints at least 1, and the corpus probe prints 0 for its marker while its control prints at least 1
- [ ] both checkouts return local-webflow, local-obsidian and sk-code for the three fixed prompts, with both external roots exported in `SPECKIT_PRIVATE_SKILL_ROOTS`
- [ ] `validate.sh --strict` on this folder prints RESULT: PASSED
- [ ] the last evidence commit is pushed with `git status --porcelain` empty and HEAD equal to origin/main
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
| Phase opened | Pending | Planning documents written; no task has run |
| Baselines measured | Done | 336 tracked paths, 1528 content lines at `42b41dd286`, 200 index lines (131 `.skilled`, 69 `specs/007`), 59 phrase keys, 1 advisor row |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
