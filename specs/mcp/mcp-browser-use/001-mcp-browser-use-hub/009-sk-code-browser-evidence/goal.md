---
title: "Goal: Phase 9: sk-code-browser-evidence"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk code browser evidence goal"
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence"
    last_updated_at: "2026-11-22T21:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Validation passes for 009 and the parent after the tsx link and repair"
    next_safe_action: "Operator decides on commit and push. A live browser run of the row is open"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-22-sk-code-browser-evidence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 9: sk-code-browser-evidence

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make sk-code's frontend verification name the `mcp-browser-use` hub, so a changed page is checked in whichever browser mode the user has installed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The `sk-code-frontend` row names the hub, not one browser mode, because each user may have a different mode installed. Operator decision on 2026-11-22. It overrides an unverified reviewer suggestion to pin the Chrome DevTools mode. |
| D2 | The agent uses a browser session it owns. It opens the user's signed-in browser only when the user asks. |
| D3 | The change is a verification step, not routing. Advisor signals and graph edges stay unchanged. |
| D4 | A browser run that did not happen is reported as NOT RUN with its reason. It is never dropped silently. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `parent-skill-check.cjs .skilled/skills/sk-code` exits 0 and prints 0 warnings
- [x] `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` and exits 0
- [x] `validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence --strict` prints `RESULT: PASSED`
- [x] `validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub --recursive --strict` prints `RESULT: PASSED` for every folder it names
- [x] `check-goal.cjs` prints `RESULT: PASSED` on this packet and on the parent
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
| `sk-code-frontend` row names the hub | Done | `rg -c 'mcp-browser-use' .skilled/skills/sk-code/ROUTER.md` prints 1. HEAD's row still reads `page rendered in a browser`, and the worktree no longer does |
| Versions moved to router 2.3.24.0 and sk-code 3.12.2.0 | Done | The version loop in spec.md's Measured Behavior, run on the worktree, prints 2.3.24.0 for `ROUTER.md` and 3.12.2.0 for the other four files |
| Changelog `v3.12.2.0.md` | Done | `rg -n '^version: 3.12.2.0'` prints `10:version: 3.12.2.0` |
| Parent phase map row 9 and handoff row 008 to 009 | Done | Parent `spec.md`: row 9 reads Complete, and the 008 to 009 handoff row has real criteria |
| Parent binding row for 009 | Done | Parent `goal.md` line 78 holds the 009 row |
| `parent-skill-check.cjs` on sk-code | Done | `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0 |
| `verify-router-sync.cjs` | Done | `router-sync: 5/5 checks passed`, exit 0 |
| Goal checks on this packet and the parent | Done | `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on each, exit 0 |
| tsx link for the repair | Done | `.skilled/skills/system-spec-kit/node_modules/tsx` is a symlink to worktree 514's copy, not an install. It unblocked `repair-derived.cjs` |
| Repair on this packet and the parent | Done | `repair-derived.cjs --apply` ran on 009 and the parent after the link |
| Strict validation, this packet | Done | `validate.sh ... --strict` prints `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`, exit 0 |
| Strict validation, parent recursive | Done | `validate.sh ... --recursive --strict` prints `RESULT: PASSED` for all 10 folders, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Repair unblocked by a `tsx` symlink | The first `repair-derived.cjs --folder <packet> --apply` exited 2 and printed `re-derive: exit 1`, because its child process loads `.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs`, which was absent. The symlink in Progress cleared it. Nothing was installed, and the generated JSON was not hand-edited before the repair ran |
| Parent `children_ids` lacked 009 | Resolved by the repair run on the parent. The parent's `graph-metadata.json` now lists 009 |
| Advisor replay not re-run | Exit 69, because the `system-skill-advisor` runtime has no build in this worktree. The earlier run is carried as evidence and labelled that way. The build was not run, since it writes outside the packet |
| No live browser run | The row's browser steps have not run on a real page. Spec section 7 names this as open |
| Reviewer's Chrome DevTools pin | Not adopted. The operator named the hub on 2026-11-22, which D1 records |
| `create.sh` placeholders in the parent | The `[Phase 9 scope]` phase row and the `[Criteria TBD]` handoff row for 008 to 009 were replaced with real text. The 006 to 007 `[Criteria TBD]` row is left as it was, as 008 did |
| Child file modes | `create.sh` wrote mode 600. The files were set to 644 to match the sibling packets |
| Frontmatter narrative warning | `recent_action` and `next_safe_action` in this file and in the summary were long and two-sentence. They were shortened to one sentence each |
<!-- /ANCHOR:log -->
