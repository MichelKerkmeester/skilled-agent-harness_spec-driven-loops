---
title: "Implementation Summary"
description: "`.skilled/CROSS-CLI.md` told a reader that every OpenCode plugin imports the plugin SDK, when none imports it at run time and two only name it in JSDoc type comments, that its counts were current, and that two files existed that do not; it never mentioned OpenCode 2, the `.markdown` rule or the dual-version CI. This phase corrects the map against the tree so a reader who follows it lands on a real file and a real number."
trigger_phrases:
  - "cross cli map refresh implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/059-cross-cli-map-refresh"
    last_updated_at: "2026-10-22T21:47:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Writer pass 4 and review round 2 complete; map checks pass; push pending"
    next_safe_action: "Push the map correction to main and record CI on the pushed commit"
    blockers: []
    key_files:
      - ".skilled/CROSS-CLI.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-cross-cli-map-refresh"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Do any plugins import the plugin SDK at run time: no; two name it only in JSDoc type comments, and `.opencode/package.json` supplies those types"
      - "Does `.skilled/plugins` link per entry: no, it is one directory link back to `.opencode/plugins`"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 059-cross-cli-map-refresh |
| **Status** | Complete |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.skilled/CROSS-CLI.md` is the file that tells you, for any surface, whether a runtime links it, generates it or authors it, and that answer decides where your edit belongs. It had drifted far enough to mislead: it said every plugin imports the plugin SDK, it never mentioned the second OpenCode version the packet now supports, and it listed two files that do not exist. The corrections below bring it back in line with the tree.

### Phase 59: cross-cli-map-refresh

The map keeps its shape and its counts. What changes is that each count is now the tree's, each named path is a real one, and the two OpenCode versions are stated where a reader looks for how `commands/` is read.

**The plugin SDK, stated correctly.** No plugin imports the plugin SDK at run time. Two of the sixteen authored plugin files, `opencode-goal.js` and `system-skill-advisor.js`, name it only in a JSDoc type comment, and `.opencode/package.json` supplies those types. `.opencode/plugins/` holds 16 authored plugin files plus `sk-vision.js`, a link to the built sk-vision bundle. The map says the types come from `package.json`, so the `plugins/` directory is explained by the surface it serves rather than by an import that does not exist.

**OpenCode 2, which the map never mentioned.** Both versions load the same 17 plugins. Each plugin default-exports one `{ id, setup, server }` object: OpenCode 1 runs `server`, and OpenCode 2 runs `setup`, which wraps the same `server`. Both register every `*.md` file under a `commands/` folder as a command at any depth, so markdown in `.skilled/commands/` that is not a command is named `.markdown`. In CI, the OpenCode Dual-Version Battery runs on both versions, and OpenCode Plugin Tests runs the plugin unit tests once.

**Stale counts, corrected.** Agents 12 becomes 11 plus the Claude-only `Explore.md`; OpenCode plugins 15 becomes 16 authored files plus the `sk-vision.js` link; commands and prompts 33 becomes 38; Pi prompts 35 becomes 38 generated plus the authored `goal-pi.md` and `vision.md`; hook links move from 21 to 27 for Claude and from 18 to 22 each for Codex and Cursor and from 21 to 25 for Devin; Pi extension links move from 16 to 19 plus one shared adapter under `extensions/lib/`; runtime mirrors move from 168 to 194 across 8 trees; the hook registry moves from 29 to 32.

**Files that do not exist.** `.codex/AGENTS.md` and `.devin/config.local.json` are removed, and the Devin file is named as `config.json`. `.claude/settings.local.json` is described as a per-machine file git ignores rather than left looking like part of the map.

**Missing entries, added.** `repo-rules` links in every runtime that has one, `.opencode/scripts`, `.opencode/package-lock.json`, `.devin/skills`, and Pi's `pi-blackhole-config.json`, `pi-cache-optimizer-config.json` and `types/`.

**The links, named as they are.** `.skilled/plugins` is one link back to `.opencode/plugins`, not a set of per-entry links. Inside `.opencode/plugins/`, the one link is `sk-vision.js`, which points at the built bundle under `.skilled/skills/sk-vision/vision-runtime/dist/`. The Pi `extensions/README.md` and `extensions/lib/README.md` are authored files, and the map now lists them as such.

**The counts stay, with a rule beside them.** The counts are what the map is for, so removing them in favour of pointing at the generators would cost a reader the answer they came for. Instead the map says that each generator's `--check` prints the live count and that the live count wins, so a stale number is caught by running a command rather than by re-reading the tree.

### The Four Writer Passes

DeepSeek v4.1 flash at high thinking (cli-pi, llmgateway) made four passes over the file.

- **Pass 1:** the counts, the missing entries, the OpenCode 2 note and the generator note.
- **Pass 2:** the plugins-link sentence, which described `.skilled/plugins` as per-entry links when it is one directory link back to `.opencode/plugins`; this pass also moved the Claude-only `Explore.md` sentence to where a reader meets the agent fork.
- **Pass 3:** four review findings. Pi prompts are 38 generated with `goal-pi.md` and `vision.md` authored; the Pi `extensions/README.md` and `extensions/lib/README.md` are authored; the plugins count is 16 plus the `sk-vision.js` link, and the SDK supplies types only; the CI sentence now credits only the Dual-Version Battery with both versions, while Plugin Tests runs the unit tests once.
- **Pass 4:** two wording fixes. Each plugin default-exports one `{ id, setup, server }` object, with OpenCode 1 running `server` and OpenCode 2 running `setup`, which wraps it; and the `.opencode` "Reads from here" cell now matches its links.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/CROSS-CLI.md` | Modified | Corrected the plugin SDK fact, OpenCode 2 and the `.markdown` rule, the counts, two removed files and seven missing entries, the link sentences and the live-count rule |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's packet, filled from the scaffold and reconciled with what the writer and reviewer runs found |
| `../spec.md` | Modified | The phase map row for 059 and the 057 to 059 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at high thinking wrote the map in four passes over the facts re-derived from `git ls-tree` and the two generator `--check` runs. Separately, a read-only DeepSeek v4.1 flash session at thinking max checked every number and path: round 1 returned FAIL with 1 P1 and 4 P2s, and round 2 returned PASS with 3 P2s, so the review round found the count that was still wrong rather than confirming the first correction. Passes 3 and 4 fixed the findings; the one P2 left open is recorded under Known Limitations.

The validators ran over the finished file. `validate_document.py` reported VALID with one warning, the repository link guard resolved 14,206 links with none broken, and both generator `--check` runs agreed with the doc. Luna was not used; the operator moved review to DeepSeek on 2026-10-21.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the counts in the map and state the live-count rule beside them | The counts are what the map is for; a reader asking how many hooks exist wants the number, and the `--check` sentence is what turns a stale number into a caught one |
| State the plugin SDK fact as types-only rather than "three import it" | No plugin imports the SDK at run time; two name it only in JSDoc type comments and `.opencode/package.json` supplies those types, which is the fact a reader editing a plugin needs |
| Correct the plugin SDK claim rather than loosen it | The `plugins/` directory is authored in `.opencode/` because it is OpenCode's own surface and `package.json` supplies the types its JSDoc references; a claim that all or three plugins import the SDK would misstate why the directory cannot live elsewhere |
| State the dual export once, as one `{ id, setup, server }` object per plugin | It is the fact that explains how one file set serves both versions, and the earlier wording made it sound like two export shapes |
| Call `.skilled/plugins` one link back to `.opencode/plugins` | The old text described per-entry links; there is a single directory link, and the map has to match what `ls -la` shows |
| Add OpenCode 2, the `.markdown` rule and the dual-version CI in one paragraph | They are one fact about one folder: both versions read `commands/` the same way, which is exactly why a non-command file there needs the `.markdown` name |
| Drop the two files that do not exist instead of describing them as optional | A map that names a path a reader cannot open costs more trust than the entry adds, and `.devin/config.json` is the file the reader wanted anyway |
| Give the review to a separate read-only session, twice | The writer had already reconciled the numbers once; a session that only reads caught a prompt count the writer had carried forward, and a second round proved the fix instead of trusting it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py .skilled/CROSS-CLI.md` | VALID: 1 warning, `document_type_fallback`, so the README rules were applied to the map |
| Repository link guard | PASS: 7,794 files, 14,206 links, 0 broken |
| `sync-runtime-mirrors.cjs --check` | PASS: 194 mirrors across 8 trees, in sync |
| `sync-hook-registrations.cjs --check` | PASS: 32-hook registry, 19 Pi extensions resolve |
| `validate.sh 059-cross-cli-map-refresh --strict` | PASS: `RESULT: PASSED` |
| `validate.sh 082-opencode-v1-v2-dual-compat --recursive` | PASS: `RESULT: PASSED` |
| Push | recorded after push |
| CI | recorded after push |

### Reviewer Verdicts

| Round | Verdict | Findings | Outcome |
|-------|---------|----------|---------|
| Round 1 | FAIL | 1 P1: the Pi prompt count was still the pre-generation number. 4 P2s, including the Pi extension READMEs, the plugins count and SDK sentence, and the CI sentence that gave Plugin Tests both versions. | Fixed across writer passes 3 and 4 |
| Round 2 | PASS | 3 P2s: the dual-export wording, the `.opencode` "Reads from here" cell that did not match its links, and the plugins entry-count scope. | The two wording findings fixed in writer pass 4; the entry-count finding left as written, with the reason under Known Limitations |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The counts are a snapshot.** They were right at the commit this phase read, and any surface added afterwards makes them wrong until someone re-runs the generators. The map states this and names the command, so the limitation is bounded rather than removed.
2. **The `validate_document.py` warning remains.** `document_type_fallback` applies the README rules to the map because it is a repository-level document rather than a skill or command page. The document validates, and the warning is a classification notice rather than a content fault, so it is left visible instead of silenced.
3. **The `.opencode` plugins cell counts entry files, not every tracked file.** It reads 16 authored plugin files plus the `sk-vision.js` link, while the directory holds 61 tracked entries when `lib/` and `tests/` are included. That is the map's level of detail: it answers what a reader finds at the top of the plugin directory, and the third round-2 P2 was left as written for that reason.
4. **The push and the CI record are still open.** The push task and the CI-record task in `tasks.md` remain unticked, and this file says nothing about a pushed commit until they close.
<!-- /ANCHOR:limitations -->

---
