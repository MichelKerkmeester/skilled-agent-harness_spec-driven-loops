---
title: "Implementation Summary: Phase 5: alignment-report-fixes"
description: "The ten distinct findings of the alignment report on phases 1 to 4 are fixed: the registry step names its directory, its changelog passes the shape checker, and the command, playbook, READMEs, routing and release notes now cover it."
trigger_phrases:
  - "alignment report fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/005-alignment-report-fixes"
    last_updated_at: "2026-11-14T18:24:12Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the ten alignment report findings in the working tree"
    next_safe_action: "Review the diff, then commit the phase and decide on the push"
    packet_purpose: "Purpose: Each finding in the report ends as a shipped fix, and a re-check of the same run lists none of them as still open."
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-agent/SKILL.md"
      - ".skilled/commands/create/assets/create-agent-auto.yaml"
      - ".skilled/skills/sk-doc/hub-router.json"
      - ".skilled/agents/markdown.md"
      - ".skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.9.0.md"
    session_dedup:
      fingerprint: "sha256:213ef1c0e4f7985e1bec4f0bbacfe0a6b1f9080245d7a263f3d3f3560f47299e"
      session_id: "scaffold-005-alignment-report-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "fa2239b1-aae7-4376-829c-aef188f40861"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T18:24:12Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-alignment-report-fixes |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The registry step that phase 4 shipped now holds on every surface that touches it. An author who uses `/create:agent`, reads the skill README or asks the advisor about the agent registry reaches the same step, and the step no longer orders a record the roster check rejects.

### Phase 5: alignment-report-fixes

`/local-skilled-alignment` checked the phase 1 to 4 change and reported eleven findings, ten distinct. Step 13 of the creation workflow now applies to an agent under `.skilled/agents/` and says a Claude-only agent gets no record. The `v1.0.8.0` changelog entry passes the shape checker and says step 14 gained a sentence. `/create:agent` adds the record and runs the roster check in both modes, and the `@markdown` agent's write boundary names the registry and the rosters as outputs of that command. The playbook has a seventh scenario that runs the check without a record and with one. The skill README and the root README name the step. The prompt `add my agent to the agent registry` now returns `sk-doc` first. The harness reference lists `read`, the open release notes name `sk-create-agent`, and the trigger-index outputs match a fresh generation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | Modified | B-1 and CR-2: steps 13 and 14 name `.skilled/agents/`, the keyword line gains `agent registry`, version 1.0.9.0 |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md` | Modified | C-1 and C-2: passes the shape checker and says step 14 gained a sentence |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.9.0.md` | Created | The entry for this phase's packet version |
| `.skilled/skills/sk-doc/sk-create-agent/README.md` | Modified | C-4: the registry step in quick start, troubleshooting and verification |
| `.skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook/` | Modified, Created | B-3: scenario `AGV-003` and its rows in the root playbook |
| `.skilled/commands/create/assets/create-agent-auto.yaml`, `create-agent-confirm.yaml`, `create-agent-presentation.txt` | Modified | D-1: step `step_4b_registry_record`, the roster check in validation and the report line |
| `.skilled/agents/markdown.md`, `.claude/agents/markdown.md`, `.codex/agents/markdown.toml`, `.pi/agents/markdown.md`, `.dsh/agents/markdown.patch.yml` | Modified, Regenerated | D-1: the write boundary and the `/create:agent` row |
| `.skilled/skills/sk-doc/hub-router.json`, `ROUTER.md`, `sk-create-agent/ROUTER.md`, `graph-metadata.json` | Modified, Regenerated | CR-2: `agent registry` on each surface that carries the agent mode's vocabulary |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the two `sk-doc` compiled-routing manifests | Regenerated | CR-2: the compiled copies of the hub vocabulary |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` | Modified | CR-1: `read` in the tool list |
| `README.md` | Modified | C-4: the `/create:agent` entry names the registry record |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modified | C-3 and BAT-01: the component paragraph names `sk-create-agent` |
| The four trigger-index outputs under `.skilled/skills/system-spec-kit/runtime/` | Regenerated | A-1: the manifest hash matches the tree |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline of every check went into `scratch/baseline.txt` before the first edit. The agent packet was fixed first, then the command and the `@markdown` agent, then the hub vocabulary, then the three single-line fixes. Each finding was closed with the command that found it. The advisor replay, the thirteen probes, the hub gates, the drift guard suites and the routing accuracy gate ran after the vocabulary change, and their output is in `scratch/after.txt`. The alignment battery was then re-run over the working tree. The orchestrating session made the edits directly. Nothing is committed or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope the step in the skill and leave the roster script alone | The script reads `.skilled/agents/` by design. The report found the instruction wrong: it ordered a record for an agent the script cannot see |
| One routing phrase, `agent registry`, where the report suggested registry and roster phrases | `agent roster` and `roster check` were added and replayed. With them `build a team roster page in react` returned `sk-doc` above `sk-code`. `agent registry` alone fixes both failing prompts and leaves that prompt with `sk-code` |
| A sub-step `step_4b_registry_record` in the workflow files, not a seventh step | The files, the command document and the presentation all describe six steps. A sub-step adds the behavior without renumbering them, as `step_5b_quality_validation` already does |
| The workflow step points at step 13 of the skill for the record's fields | A second copy of the field list would drift from the skill the next time a field changes |
| Extend the `v4.0.2.1` notes and leave the tag where it is | A new version file would announce a release nobody cut. Moving a tag is the operator's call |
| No bullet for the registry step in the release notes, only the component paragraph | The notes sit at the shape checker's 280-line ceiling. A bullet made it 281 and failed the check |
| Edits made by the orchestrating session, not a DeepSeek executor | Phases 1 to 4 handed DeepSeek exact old and new text to apply. Authoring that text is the whole change here, so a second hop added a 20-minute dispatch per edit and no second opinion |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| B-1: `rg -c 'For a new agent under' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` | 1 |
| C-1, C-2: `check_changelog_shape.py` on `v1.0.8.0.md` and `v1.0.9.0.md` | `SUMMARY files=2 pass=2 fail=0`, exit 0. Baseline: `v1.0.8.0.md` failed with four problems, exit 1 |
| C-4: `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/README.md`, and `validate_document.py` on the README | 3, and `VALID` with 0 issues |
| B-3: `validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook` | `PASS package=sk-doc/sk-create-agent`, `scenarios=7`, `violations=0`, exit 0 |
| D-1: `rg -c 'sync-agent-roster'` on both workflow files, YAML parse, and the command tests | 3 in each file, both parse, `15 passed` |
| D-1: `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs` | `agent-roster: OK`, exit 0, and `11 agent(s) checked, all comparable mirrors in sync`, exit 0 |
| CR-2: advisor replay of the report's two failing prompts | `add my agent to the agent registry`: `sk-doc 0.590` first, was `sk-code 0.233`. `the agent registry needs a record for my new persona`: `sk-doc 0.545`, was no recommendation |
| CR-2: the report's thirteen probes, `run-probes.cjs` | `pass=13 fail=0 cannot_run=0` |
| CR-2: hub gates, each exit 0 | Hub vocabulary source, router intent signals, vocabulary reach, skill graph freshness, compiled route guard, admission, parent-skill check, leaf manifest, derived freshness, root metadata and frontmatter version |
| CR-2: drift guard suites, scorer ratchets and the routing accuracy gate | `22 passed`, `59 passed` and `overall_pass: true` with no threshold failure |
| CR-1: `rg -c 'subagent., .read.'` on `guards-and-hooks.md` | 1 |
| C-3, BAT-01: the release-coverage row of the re-run battery | Pass. It failed in the report |
| A-1: `generate-trigger-index.mjs --check` after the regeneration | `trigger index matches the corpus`, 0 stale documents, exit 0, no `manifest hash differs` note |
| The alignment battery re-run over the working tree | `pass=76 fail=0 cannot_run=0 not_applicable=2`, exit 0, over the 45 uncommitted files. The report's run had `fail=1` |
| `validate.sh specs/agents/007-agent-alignment-follow-ups --recursive --strict` | Six `RESULT: PASSED` lines, 0 errors each. This folder has 1 warning: `decision-record.md present but Level 1 declared` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A roster prompt with no other agent word finds nothing.** `my agent roster check is red` returns no recommendation, because the roster phrases were dropped to protect an unrelated prompt. A prompt that also says `agent file` or `new agent` routes to the skill.
2. **The `/create:agent` step is prose a model follows, not code.** No test runs the workflow end to end. The check that catches a skipped step is the roster check the validation step now runs.
3. **The alignment lanes were not re-run.** The battery, the probes and each finding's own command were replayed. A second DeepSeek review of this phase's diff was not dispatched.
4. **The release notes carry no feature bullet for the step.** They name `sk-create-agent` in the component paragraph only, because the file is at its line ceiling.
<!-- /ANCHOR:limitations -->

---
