---
title: "Goal: move the source root from .opencode to .skilled"
description: "The durable directive for the skilled source-root migration, executed autonomously from probes to rollout, and the criteria that decide when it is done."
trigger_phrases:
  - "skilled migration goal"
  - "source root migration directive"
  - "skilled migration completion criteria"
  - "skilled migration binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration"
    last_updated_at: "2026-09-16T20:35:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Amended criterion 6 for the ADR-003 keep-list after the phase 004 review"
    next_safe_action: "Regenerate metadata, validate the packet recursively, then execute phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: move the source root from .opencode to .skilled

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every skill, command, agent, hook, plugin and script lives under `.skilled/`, every runtime resolves them there, and nothing that works today breaks.

### Decisions

Frozen; changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Phases run in binding order; none starts until its predecessor validates. |
| D2 | Autonomous from A to Z; stop only for a regression still red after three repairs, contradicting findings, or a probe voiding the design. Pushes to skilled/v4.0.0.0 and main, the global hook reinstall and this machine's home configs are pre-authorized, rollback first. |
| D3 | Opus agents plan. DeepSeek V4.1 Flash max (cli-pi, LLM Gateway) executes: one short literal brief per unit, kebab-case outputs, suite-verified before the next. Layout, cutover order and contract files get a second model family; the orchestrator verifies every return. |
| D4 | Work stays in worktree 055; renames get rename-only commits, generated files are regenerated not edited, historical records stay frozen. |
| D5 | `.opencode/` stays resolvable for opencode, root discovery and consumers; 004 decides its final shape. |

### Operator copy

The operator's copy of this directive judges completion. Resend this slice,
frontmatter excluded, whenever anything above the log changes; keep reminding
while unset, without stopping work.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase**; decisions above outrank it.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-deep-research/goal.md` |
| 002 | `002-per-runtime-reference-map/goal.md` |
| 003 | `003-layout-probes/goal.md` |
| 004 | `004-migration-design/goal.md` |
| 005 | `005-gate-and-ci-readiness/goal.md` |
| 006 | `006-dual-root-code-and-contracts/goal.md` |
| 007 | `007-source-root-move/goal.md` |
| 008 | `008-links-and-generated-state/goal.md` |
| 009 | `009-reference-rewrite/goal.md` |
| 010 | `010-machine-and-consumer-cutover/goal.md` |
| 011 | `011-verification-and-rollout/goal.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All eleven phases validate PASSED, acceptance criteria met
- [ ] `.skilled/` holds the authored tree; `.opencode/` keeps only what 004 chose
- [ ] Each runtime live-loads its skill, command and agent surfaces from `.skilled/` or a synced copy
- [ ] Drift guards, retrieval and deep-loop suites pass; pushed-tip CI adds no failure to the pre-005 baseline
- [ ] No tracked file outside changelogs, reports and specs names a dropped `.opencode` path
- [ ] Global hooks and home configs here point at `.skilled/` or an ADR-003 kept path, rollback recorded
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
| Phases 001 and 002 | Done | Committed and pushed at `728c4f3efc` |
| Goal, 11-phase map, goals for 001 and 002 | Done, committed locally `d26f0c60ca` | Worktree 055 |
| Phases 003 to 011 planned | Done, committed locally `d26f0c60ca` | Nine Opus agents, 17:57Z to 18:36Z; each wrote only its own five or six files; 746 `file:line` citations resolve inside their files, none out of range |
| Phase 003 layout probes | Done, committed locally `951f4fae18` | Nine records, strict validation PASSED; not pushed |
| Phase 004 migration design | Done | L1 accepted; 25-step cutover amended by 7 GPT-5.6 findings; strict validation PASSED |
| CI on the pushed tip | Checked | All 22 runs for `1d198996ca` and `728c4f3efc` completed; the naming guard went red, then green at `728c4f3efc` |

### Deviations and findings

| Item | Note |
|------|------|
| CI was red before this packet pushed | Playbook Operator Contract fails with the same 16 lines at 06:40Z as at 17:32Z; Spec-Kit Check fails the same 2 tests at 01:24Z as at 17:29Z (`hook-registration-sync` expected 81 to be 77, `lazy-goal.md` snapshot). A green-CI criterion was unreachable, so criterion 4 and D2's stop rule now compare against a baseline recorded before 005 |
| 008 regenerates what a red test covers | `hook-registration-sync` already fails; 008 must record its failure before regenerating hook registrations, so the baseline stays distinguishable from a regression |
| 004's step 24 said "CI on the tip is green" | Reconciled: step 24 now compares with the failure sets 005 records, and 005's T003 captures each red workflow's failing lines |
| The main checkout is shared | Other sessions keep uncommitted work there (`council-graph.sqlite`, containment directories, `.stderr` files). Steps 18 and 19 must check for live sessions and dirty paths under `.opencode/` before the fast-forward |
| A Pi dispatch bootstraps the advisor | A read-only DeepSeek smoke test in the worktree (`PONG 4`, 7 s, 2026-09-16 18:31Z) installed `node_modules` and built `dist` for system-skill-advisor there: 4,454 ignored files, no tracked change |
| cli-pi runs as direct print mode | The shared runtime's only cli-pi path is `fanout-run.cjs`, whose write containment confines a lane to its lineage; edit units therefore run as `pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max </dev/null` with the child preamble and `AI_SESSION_CHILD=1`, each verified by the orchestrator |
| Phase returns verified | 005: 79 citations resolve, gate lines `pre-commit:50,95,180` and `pre-push:52-54,252` confirmed. 004: 143 resolve; stale `003-migration-design` fixed in its implementation summary. 008: 77 resolve, `sync-skills-hermes --check` drift and `dist-freshness.cjs:28` confirmed |
| 003 and 004 numbered probes differently | 004's plan now carries a crosswalk from its P1 to P9 to 003's questions and records. 003 gained rows R12 (opencode skills) and R13 (`code_mode` launcher) and a shape B2 clone for the install-files variant |
| 006 REQ-014 decided | The five root-discovery twins, `install-git-hooks.sh` ownership, the `.gitignore` twins and the publish step join 006 (T065 to T070), following 004's steps 6 to 8 |
| The naming guard fails a pure move | It checks rename destinations against base paths, so four grandfathered names fail once under `.skilled/`. 005 REQ-012 makes a basename-preserving rename pass; the fixture `Spec_Draft.md` keeps its name because the name is its purpose |
| Criteria 3 and 5 amended | Codex agents are TUI-only, `pi -p` has no persona and Devin has no commands, and three runtimes read agents from the synced `.claude/agents` copy, so criterion 3 names each runtime's own surfaces. `specs/**` is history under D4, so criterion 5 names the frozen classes |
| Spec-folder renames commit with their content | The `spec-remint` pre-commit gate blocks a spec folder whose documents are partly staged, so the 003-to-004 renumber committed together with its rewritten documents. D4's rename-only rule keeps applying to the authored tree in 007 |
| Probes point at the whole-directory link | Every probed loader works through `.opencode -> .skilled`. Per-entry links break the three opencode plugins that import `@opencode-ai/plugin/tool`, so phase 004's tree selects L1 |
| Pi's DevPass route for DeepSeek broke at 19:21Z | The gateway rejects `developer`-role messages for DeepSeek V4.1 Flash with HTTP 400. Lanes run through `/tmp/skilled-pi-agent` with `llmgateway.compat.supportsDeveloperRole: false`. The shared `.pi/models.json` needs the same key for every Pi session on the machine |
| The repository is public | Phase 003 kept its 668-row home scan out of the repository because it names private repositories. Later phases apply the same rule to anything read from the home directory |
| Criterion 6 allows ADR-003 kept paths | The phase 004 review (F-02) showed the global Hermes `code_mode` launcher argument must stay `.opencode/bin/...`, because consumer projects expose only `.opencode`. ADR-003 K13 keeps it |
<!-- /ANCHOR:log -->
