---
title: "Implementation Plan: Phase 16: claude-create-reach-and-doctor-default"
description: "Rename /create:skill to /create:sk-skill on every runtime with no alias and drop the mirror check's allowlist, read a negated show-up or appear phrase as a strong doctor problem cue, show the AGENTS.md Gate 2 call on stdin, add intent phrases to five commands with a real-embedding holdout count, and keep the brief-cost run's health records in its sandbox."
trigger_phrases:
  - "claude create reach and doctor default plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: claude-create-reach-and-doctor-default

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON and JSONL for the command, the hub and the corpus, CommonJS for the mirror and doctor scripts, TypeScript and Python for the advisor's generated blocks, Node ES modules for the captures and the brief-cost script |
| **Framework** | The runtime mirror sync (`MS`), the bridge deriver, the skill advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`), the `/doctor` scripts and the `/doctor:agents-md` manifest tooling |
| **Storage** | Tracked command files, mirrors and baselines. The advisor database is re-embedded by `skill_graph_scan`, a coordinator step |
| **Testing** | `node --test` for the mirror, manifest and doctor tests, Vitest in `ADV`, the fixture and real command captures, the scorer eval, the generators' checks and coordinator-run live checks |

### Overview
Five lanes. Lane A renames `/create:skill` to `/create:sk-skill`: the coordinator moves the file with `git mv`, workers change the name area by area, the deriver and the mirror and agent generators rewrite what they own, and the mirror check loses its allowlist and matches `skill.md` in any capitalisation. Lane B adds the negated show-up cue. Lane C rewrites `AGENTS.md` line 65, test first. Lane D adds intent phrases to five commands after lanes A and B are built, and the coordinator measures holdout as a count on the real embedder before and after. Lane E points the cost run's hook children at the sandbox for `TMPDIR`, test first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each mechanism is read in code and recorded in `spec.md` section 2 with the command that measured it.
- [ ] Q1 and Q2 are answered in `spec.md` section 10. Q3 is answered too: `v2.10.0.0`.
- [ ] T001 confirms the base and T002 records the before numbers in `scratch/before.txt`.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, or `Unmet` only for the live listing while it waits on the operator.
- [ ] T016 prints `visibility claude 44/44`, T021 holds every fixture floor, T020 prints the holdout delta and T027 holds every floor against `scratch/before.txt`.
- [ ] T028's old-name scan lists the nine kept files and nothing else.
- [ ] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the source and regenerate the rest. A command's name lives in its file name, its owner's metadata and the hub that routes to it. Everything else that carries the name is either hand-written prose, which a worker edits, or a generated file, which only its generator writes. The mirror check stops excusing the one folder and checks the cause instead.

### Key Components
- **`.skilled/commands/create/sk-skill.md`**: the command file under its new name, moved by `git mv` so its history follows.
- **`derive-command-bridges.cjs`**: names the bridge `command-create-sk-skill`, writes `command-bridges.generated.json` and the marked blocks of `projection.ts`, `skill_advisor.py` and `command-attach.ts`, and fails while `scoring-compatibility.json` names an unknown inventory id.
- **`MS` and the six `sync-prompts` and `sync-agents` generators**: rewrite the Claude and Cursor command links, the Codex, Pi and DSH prompt stubs and the Codex, Pi and DSH agent copies, and delete the stale ones.
- **`commandVisibility` and `collapseDrift`** (`MS`): match `skill.md` in any capitalisation, with no allowlist.
- **`STRONG_PROBLEM_CUE`**: gains `show(?:s|ing)? up` and `appear(?:s|ing)?`.
- **`AGENTS.md` line 65**: the stdin form, with the manifest and the Cursor rule regenerated.
- **`_routes.yaml` and `system-spec-kit/command-metadata.json`**: carry the five commands' new phrases. The deriver passes them to the bridges and `skill_graph_scan` re-embeds them.
- **`measure-brief-cost.mjs`**: the hook child's environment gains `TMPDIR` set to the sandbox folder.

### Data Flow
`.skilled/commands` and each owner's metadata feed the deriver, which feeds the scorer's projection, the Python scorer and the attach tables, which the build compiles. The mirror and agent generators read the same command tree and agent sources and write every runtime's copy. `skill_graph_scan` embeds the command text into the advisor database. The fixture capture scores the corpus with the built scorer, and the real capture scores it with the live embedder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The command file and its owner's metadata | Name `/create:skill` | Renamed with no alias | T003, T005, T006, T028 |
| Bridge deriver outputs | Carry `command-create-skill` | Regenerated as `command-create-sk-skill` | T014, `DRV` |
| Claude, Cursor, Codex, Pi and DSH command copies | Carry the old file or stub name | Regenerated by `MS` and the three prompt syncs | T016, `PSY`, `SRM` |
| Agent copies of the `markdown` agent | Name `/create:skill` | `.claude/agents/markdown.md` by hand, the Codex, Pi and DSH copies by their generators | T009, T016, `ASY`, `AMSC` |
| OpenCode and Devin | Read through folder links | Unchanged, they follow the rename | T016 |
| `validate-command-tree-parity.sh:126-128`, `.skilled/scripts/git-hooks/pre-commit:437` and `doctor-runtime-mirrors.yaml:34` | Run `node $MS --check` | Unchanged. They pass once T016 has run | T027 |
| Served canary fixture under `.skilled/bin/lib/compiled-routing` | Byte copy of an archived spec file | Kept. `CRS` proves the closure still resolves | T006, T027 |
| `doctorProblemCue` consumers | `applyDoctorHelperHandoff` in `fusion.ts:1134` | One caller, no signature change | T011, `VALL` |
| `AGENTS.md` line 65 copies | The manifest, `.cursor/rules/skill-routing.md:35` and the home-folder `CLAUDE.md` link | The first two regenerated, the link follows the main checkout | T015 |
| Doctor routes and the speckit search metadata | Hold the phrases of five commands | Gain the new phrases | T019, `RV`, `DPR` |
| Brief-cost hook children | Inherit the shared `TMPDIR` | Use the sandbox | T013, T025 |

Same-class producers: the `OLDP` scan in `tasks.md` lists every file that names the old command. `rg -n "skill\.md" $MS` lists every place that decides a Claude collapse, and `rg -n "STRONG_PROBLEM_CUE|WEAK_PROBLEM_CUE" $ADV/lib` lists the two cue lists. Generated outputs and their checks: `DRV` for the deriver, `SRM` for `MS`, `PSY` and `ASY` for the six runtime generators, `AMSC` for the hand-kept Claude agent copy, `MAN` and `GPC` for the `AGENTS.md` copies and `SLICE` for the command baseline. Matrix axes: command file name (`skill.md`, `SKILL.md`, other) by folder content, cue (negated show-up, other strong, weak, none) by passing skill, and real capture (before lane D, after lane D) by split.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the base, records every floor and check in `scratch/before.txt` and moves the command file (T001 to T003). Implementation runs the waves in `tasks.md`: the area edits of lane A with lanes B, C and E, then the deriver and the `AGENTS.md` line, then the coordinator's regeneration, rebuild, re-embed and real capture, then lane D's phrases, a second rebuild and real capture, the fixture recapture, the live checks and the changelog entry once Q3 is answered. Verification runs every floor, the old-name scan and the boundaries, then writes the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The collapse check in both capitalisations, the cue's new and unchanged phrases, the gate-2 body's stdin form, the cost run's child `TMPDIR` and the typed attach of the new name | `node --test`, Vitest in `ADV` |
| Integration | The deriver and every generator check, the fixture capture and its slice test, the scorer eval, the doctor route checks, the sk-doc hub check, the compiled-route closure and the real captures before and after lane D | The generators' `--check` modes, `capture-command-routing-baseline.mjs`, `capture-scorer-eval-baseline.mjs` |
| Manual | Claude's command folder and mirror line, the operator's live listing, one hook brief, one CLI call and one cost run | Coordinator, and the operator for the listing |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator answers to Q1 and Q2 | Operator | Answered 2026-11-13 | None |
| Operator answer to Q3 | Operator | Answered: `v2.10.0.0` | T026 runs in wave 8 |
| Phase 015 committed | Internal | Green, `3b48f0e5f1` | None |
| Fresh `ADV` builds and a restarted daemon | Internal | Coordinator's, T017 and T020 | Captures refuse a stale build and live checks read an old one |
| Ollama on `127.0.0.1:11434` | External | Running on 2026-11-13 per segment four | T017, T018 and T020 mark themselves `[B]`. No task starts it |
| A Claude Code session for the live listing | Operator | Operator's to run | T023 stays open, and REQ-012 holds on the folder and the mirror line meanwhile |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a floor drops below its line in `scratch/before.txt`, a generator check fails after its run, the closure check fails or the real capture loses a typed or floor row.
- **Procedure**: revert this phase's commit, which restores `create/skill.md` through the recorded `git mv`. Then run `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, the three `sync-prompts` and three `sync-agents` generators, `npm run build` in `ADV` and `skill_graph_scan` so every copy and the database follow. Nothing under the home folder was written.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 015 committed | Implementation |
| Implementation | The before numbers and the moved command file | Verification |
| Verification | Every implementation task | The parent's close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## DECISIONS ALREADY MADE

The operator's answers are in `spec.md` section 10. Three planning choices shape the tasks and are recorded here so a reader sees them first. Corpus row ids keep their old text, because a holdout row may change only in `expected_command` and every id keeps one convention. The served canary fixture keeps `/create:skill`, because it is a byte copy of an archived spec file and the closure check holds the two equal. The new intent phrases are fixed before the second real capture, and no phrase changes after the holdout count is read, so the count stays out of sample.
<!-- /ANCHOR:decisions -->
