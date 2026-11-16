---
title: "Goal: Phase 3: literal-hook-renames"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "literal hook renames goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames"
    last_updated_at: "2026-11-15T14:58:52Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-hook-library-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: literal-hook-renames

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Three hook folders and 16 hook files carry names that state the feature they belong to, and every reference to an old name points at the new one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One rename runs at a time. Each is followed by the registry edit, both sync runs and the hand-written references, in the repair order of `SYNC.md`. |
| D2 | Any move of the spec sub-track named after `dispatch` runs through `relocate.mjs`, not by hand. |
| D3 | Benchmark reports and captured question screens keep the paths they were recorded with, and the searches below leave both out. |
| D4 | Registry hook ids and handover log event ids stay as they are. The test file `subagent-guard.test.cjs` keeps its name. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `ls -d` on `cli-dispatch`, `subagent-dispatch-guard` and `completion-evidence` under `.skilled/hooks/` exits 0, and on `dispatch`, `task-dispatch` and `completion` reports all three as missing
- [x] `find .skilled/hooks -name 'claude-posttooluse.cjs' -o -name 'dispatch-guard.cjs' -o -name 'ask-capture-*'` prints nothing, `find .skilled/hooks/decision-capture -name 'decision-capture-post*'` lists 6 files and `find .skilled/hooks/session-handover/claude .skilled/hooks/session-handover/codex -name 'handover-*.mjs'` lists 8 files
- [x] `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**' -e 'hooks/(dispatch|task-dispatch|completion)/' -e 'claude-posttooluse\.cjs' -e 'ask-capture-post' -e '(^|[^a-z-])dispatch-guard\.cjs' -e '(^|[^a-z-])(compact-pointer|context-nudge|stop-arm|prompt-seed|subagent-guard)\.mjs' .` prints nothing
- [x] `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**' -P -e '(?<![a-z-])(?<!hooks/)(dispatch|task-dispatch|completion)/(lib|claude|codex|cursor|devin|dsh|pi|opencode|vibe|tests)\b' .` prints nothing, and `rg -n -U --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**' -e "['\"]hooks['\"],\s*['\"](dispatch|task-dispatch|completion)['\"]" .` prints nothing
- [x] `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` each print PASS, and `find .skilled/hooks .claude/hooks .codex/hooks .cursor/hooks .devin/hooks .dsh/plugins/repo-guards/adapters .pi/extensions -type l ! -exec test -e {} \; -print` prints nothing
- [x] The hook Vitest tree and the OpenCode plugin tests report 0 failed, and the hook `node --test` suites fail only the `hook-stdin-deadline.test.mjs` case that failed before the first rename
- [x] `test_readme_manifest.py`, `test_readme_verdict_parity.py` and `generate-trigger-index.mjs --check` each exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `/create:goal` run on 2026-11-15 from this phase's `spec.md` |
| Phase planning | Pending | |
| Phase planning | Done | /speckit:plan run on 2026-11-15. spec.md, plan.md, tasks.md and acceptance-criteria.md hold no unfilled token |
| Criteria amended at planning | Done | Seven criteria. The old-name search now names each renamed file and leaves out benchmark reports and captured screens, claude-posttooluse is matched with its .cjs extension, and new criteria cover the eight handover- names, the relative and segment-built paths, dangling links and the suites. Decisions D3 and D4 added |
| Renames R1 to R7, sub-track move, manifest and trigger index | Done | After each rename both sync checks printed PASS, the dangling-link find printed nothing, and the suites printed 501 passed, 1838 pass with 1 fail and 591 pass. Verdict baseline rebase, final gates, review and summary still open |
| Final gates and close | Done | Ten registered Claude adapter commands exited 0 with no drift line. Every baseline gate matched the T001 counts. The README reference check printed `fail=95` after two sibling links were fixed. The review gate returned APPROVED on its first run with two suggestions, one applied and one reported at close |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the phase was planned | The objective, decisions and criteria come from the Phase Context and Handoff Criteria in this phase's `spec.md`, because its scope sections and `acceptance-criteria.md` were still scaffolds. Amend this goal when the phase is planned |
| No criterion for the eight `handover-` adapter names | The phase spec does not name the eight files yet. Add the check when planning lists them |
<!-- /ANCHOR:log -->
