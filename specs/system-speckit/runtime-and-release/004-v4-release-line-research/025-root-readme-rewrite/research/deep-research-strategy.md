---
title: Deep Research Strategy - root README rewrite
description: Session strategy for the deep-research run that maps the current reality of the Skilled repository for a root README rewrite.
trigger_phrases:
  - "root readme rewrite research strategy"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Runtime strategy for `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/`.

## 1. OVERVIEW

### Purpose

Persistent brain for this research session. Records what to investigate, what worked, what failed, and where to focus next.

### Question Injection Surface

Use `research/inbox.jsonl` to append external questions during an active run.

---

## 2. TOPIC
Current reality of the Skilled repository for a root README rewrite — everything that changed since v4.0.0.0, weighted toward v4.0.2.0 → v4.0.2.1 and the commits on main after the v4.0.2.1 tag

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 Release delta: what did v4.0.0.0 -> v4.0.1.0 -> v4.0.2.0 -> v4.0.2.1 -> current main HEAD each change? Use git log and git diff --stat between tags (v4.0.0.0, v4.0.1.0, v4.0.2.0, v4.0.2.1; v4.0.0.14-16 also exist), changelogs (**/changelog/**, root CHANGELOG or release notes) and spec packets closed in that range. Most weight on v4.0.2.1 and the ~37 commits after the tag, including the hook-library cleanup merged from worktree 411.
- [x] Q2 Current inventory verified against files on disk: skills and their modes and hubs (.skilled/skills/*/SKILL.md, mode-registry.json), commands (.skilled/commands/), agents (.skilled/agents/ or .claude/agents/), supported runtimes and CLI executors (Claude Code, Codex, OpenCode, Pi, Devin, DeepSeek Harness/DSH, Mistral Vibe, Cursor, Hermes), doctor commands, MCP and Code Mode.
- [x] Q3 Every dedicated hook, plugin and extension per runtime (.claude/hooks, .codex/hooks, .opencode/plugins, .pi/extensions, .devin, .dsh/plugins, .vibe, shared .skilled hook cores): name, runtime(s), what it does in one or two sentences, source path. Complete and verified, one README subsection each.
- [x] Q4 Claim audit of the current root README.md (1,773 lines): which statements are stale, wrong, missing or over-detailed versus the code. Cite README line numbers and the contradicting source.
- [x] Q5 Reader-first section order for a shorter README: what a new reader needs first (what it is, install, core workflow), what can shrink to a link, and what other READMEs in the repo (.skilled/skills/*/README.md) already own so the root can link instead of repeat.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do not edit README.md or any file outside the spec folder's research/ packet.
- No implementation, no README draft beyond a proposed section order and claim list.
- Do not re-audit the v4.0.0.0 -> v4.0.2.0 drift findings already ranked in the parent packet's research/research.md except where they bear on README claims.

---

## 5. STOP CONDITIONS
- All five key questions answered with file-cited evidence.
- Q3 hook/plugin/extension list cross-checked against a directory listing of every runtime folder (no unlisted entries).
- Convergence per config (threshold 0.05, min 3 iterations) or max 20 iterations or the 120-minute duration cap.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 Release delta: what did v4.0.0.0 -> v4.0.1.0 -> v4.0.2.0 -> v4.0.2.1 -> current main HEAD each change? Use git log and git diff --stat between tags (v4.0.0.0, v4.0.1.0, v4.0.2.0, v4.0.2.1; v4.0.0.14-16 also exist), changelogs (**/changelog/**, root CHANGELOG or release notes) and spec packets closed in that range. Most weight on v4.0.2.1 and the ~37 commits after the tag, including the hook-library cleanup merged from worktree 411.
- Q2 Current inventory verified against files on disk: skills and their modes and hubs (.skilled/skills/*/SKILL.md, mode-registry.json), commands (.skilled/commands/), agents (.skilled/agents/ or .claude/agents/), supported runtimes and CLI executors (Claude Code, Codex, OpenCode, Pi, Devin, DeepSeek Harness/DSH, Mistral Vibe, Cursor, Hermes), doctor commands, MCP and Code Mode.
- Q3 Every dedicated hook, plugin and extension per runtime (.claude/hooks, .codex/hooks, .opencode/plugins, .pi/extensions, .devin, .dsh/plugins, .vibe, shared .skilled hook cores): name, runtime(s), what it does in one or two sentences, source path. Complete and verified, one README subsection each.
- Q4 Claim audit of the current root README.md (1,773 lines): which statements are stale, wrong, missing or over-detailed versus the code. Cite README line numbers and the contradicting source.
- Q5 Reader-first section order for a shorter README: what a new reader needs first (what it is, install, core workflow), what can shrink to a link, and what other READMEs in the repo (.skilled/skills/*/README.md) already own so the root can link instead of repeat.

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- locating the release-notes file by searching commit subjects for the phrase that names it (`git show --stat` on `3e16700317c`) was a single call that replaced a broad content grep. The changelog file then carried the entire release narrative, the breaking-change list and the runtime enumeration, which is far denser per call than reading the tree. (iteration 1)
- reading the two release notes in full was the highest-yield action of the run. Each note carries the release narrative, its breaking changes and its own spec-folder closure list, so a single read replaced several git archaeology passes. (iteration 2)
- ranking `--numstat` by file count and then drilling into the single dominant path answered "what changed after the tag" in two calls and disproved the diffstat as a change measure. Chasing the top path was the whole difference — the raw totals suggested a large rewrite and the drill-down showed two scratch patches. (iteration 3)
- probing `.modes|type` across all seven registries in one call settled a shape question three iterations had carried, and reading the two registry files whole gave the mode, backend and command facts a README table needs without a second pass. The registries are dense — one read produced three of this iteration's findings. (iteration 4)
- computing section spans from consecutive heading line numbers gave an exact, self-reconciling size map (1,763 + 10 front matter = 1,773) in one call. The reconciliation is what makes the measurement trustworthy — a sampled or estimated span set would not have summed to the file total, and the 50.6% catalog share is the single number the whole recommendation rests on. Pairing it with the per-skill README skeleton in the next call is what turned a size map into a shrink map: the spans say where the lines are, the skeletons say who can absorb them. (iteration 5)
- counting the inventory before reading the claims inverted the audit. Instead of reading 1,773 lines and guessing what might be stale, the counts (skills, commands, doctor commands, templates, hooks, runtimes) became the test set, and every mismatch surfaced by arithmetic rather than by judgement. The command count is the clearest case: 43 + 2 reconciles to 45 exactly, and the apparent 46 came from two untracked operator files that a `git ls-files` check separated in one call. Without that check the audit would have "corrected" a correct number. (iteration 6)
- resolving every symlink to its target turned four opaque "mirror" directories into a readable ownership map. Counting entries alone would have produced four numbers; grouping the targets by owning tree produced the three-form model and, in the same output, exposed the Codex off-by-one. The arithmetic 12 + 10 + 5 = 27 is what made that finding citable rather than a hunch. (iteration 7)
- following the `VALIDATOR_REGISTRY_JSON` variable out of `validate.sh` replaced guessing with a pointer. One `grep` for the assignment gave the exact path, and the registry then answered the count, the category split and the warn-only subset in a single `jq` pass. The earlier failure was not a bad grep — it was searching the wrong artefact, because the script directory and the prose doc are both derived from a registry neither of them is. (iteration 8)
- diffing name sets instead of counting files. A count says "46" and stops; the set comparison proved zero missing names in every flat mirror and surfaced `goal-pi` and `goal-cursor` as the only additions, which is what makes the matrix's Files column trustworthy. Resolving link form with `ls -ld` then separated four mirror shapes that a count would have collapsed into one. (iteration 10)
- reading the seven registrations whole in one call. Each file is under 300 bytes, so a single `cat` loop produced the complete topology — server name, launcher path, env var and dialect — and the identical launcher line across seven files is what turns "MCP support" into one citable fact instead of seven. Pairing it with `git ls-files` on the same paths then separated the shipped registry from operator-local state in one line of output. (iteration 11)
- executing the README's own verification command was the cheapest possible end-to-end test of the install block. A read of the script could only have shown that the file exists; the run showed that the command exits 0, returns a 15 KB payload and names nine tools. Pairing it with the advisor's `prebuild`/`build` bodies then explained *why* the README's ordering matters, turning an instruction into a verified dependency. (iteration 12)
- measuring the artifact the rewrite must preserve, rather than re-reading its prose, produced a citable negative result in two calls. Pairing disk existence with the git index is what makes "a clone receives every target" a claim rather than an assumption; a disk-only check would have passed an untracked target silently. (iteration 13)
- choosing the surface by coverage gap instead of by topic. Q4's span list made the gap a fact rather than a hunch — 1667-1773 was never read — and that turned a 64-line FAQ into four new, citable verifications in five calls. Pairing each answer with its exact oracle (the `registerTool` call list, the defaults row, the path existence check, the gate text) is what separates "the FAQ sounds right" from a finding the rewrite can rely on. (iteration 14)
- harvesting the descriptions *first* and counting second is what surfaced the conflict. A count-first pass would have reported "15 skills" and moved on, because the loop's own output looked like an inventory. Reading the README span afterwards is what made the two numbers collide rather than one silently replacing the other. The same ordering paid in the mirror work: `ls -ld` before `git ls-files` would have shown the four parents as links and saved the misread of the "1 tracked file" result. (iteration 15)
- asking which packet claim a rewrite would *copy* turned a resolved question set into a live one. The git index settled the skill count in the same call that proved the symlink, so the contradiction cost no extra evidence — a count-first pass would have produced "15 directories" and inherited §5D's error. (iteration 16)
- naming the two utilities from the README's own headings before counting them is what exposed the double count. A count-first pass would have produced "43 + 2 = 45, consistent" and stopped; reading `README.md:1443` first showed that one of the two utilities is a file the group count already contains. The same ordering resolved the goal-command question — listing the runtime surfaces before totalling showed that `goal-cursor` exists and has no canonical twin. (iteration 17)
- following the script's own `VALIDATOR_REGISTRY_JSON` assignment instead of re-grepping the rules directory turned an "unverifiable" claim into a one-call count. The variable is the pointer and the directory is a decoy; iteration 6 and iteration 8 both approached the directory and both failed. Second, sweeping the README for `N <noun>` patterns first produced the complete test set, so the iteration measured only claims with no prior oracle rather than re-reading prose. (iteration 18)
- reading the synthesis as a claim list instead of as prose turned a document the run had treated as settled into seven measurable statements. The file had been read in iterations 5 and 17 only for the sections a finding needed; reading all 172 lines against the settled oracles is what exposed the inverted §5D conclusion and the stale open-questions block, neither of which any iteration had recorded. (iteration 19)
- asking set membership instead of counting names. The six-vs-eight conflict cannot be settled by preferring one prose line; it needed a membership test — does every named runtime have a tracked folder, and does every tracked folder appear in a prose list? Four oracles answered it in five calls. Searching the removed name across non-spec files is what surfaced the Hermes lineage: a README-only or strategy-only check would have missed the `v4.0.0.0`/`v2.0.0.0` pair entirely. (iteration 20)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `git diff --stat` across the early ranges is quadratic in practice — the `v4.0.0.0..v4.0.1.0` range covers 3365 commits and 8515+ files and did not finish inside a 120-second wait, so the call was abandoned rather than repeated. Running the same command for `v4.0.2.0..v4.0.2.1` also had to be backgrounded. (iteration 1)
- `--stat` and `--dirstat` both failed as summarisation tools — one by timeout under rename detection, the other by volume. Neither was a diff-performance problem in the way iteration 1 assumed. (iteration 2)
- probing `mode-registry.json` for a `workflowModes` field returned zero modes for all seven hubs. The registries key `modes` by numeric index, so a shape guess produced seven false negatives in one call. The retry that printed `Object.keys` was what recovered it. (iteration 3)
- the `&&` chain in the pre-write check aborted when `ls` returned exit 1 on the first absent target, so the gateway-existence check never ran in that call. A chained check on intentionally-missing files reports failure as if the check itself failed. (iteration 4)
- nothing failed this iteration, but the earlier instinct to treat §17 as the navigation answer was wrong and was caught by counting link coverage per skill rather than counting links. A link hub that omits nine of fourteen targets looks complete from its own contents. (iteration 5)
- the first verification batch used an `&&` chain that aborted on the intentionally missing root `package.json`, so four later checks never ran and had to be repeated. This is the second iteration to lose a batch to that pattern; it is now recorded in strategy §8 for the second time. (iteration 6)
- nothing failed, but reading runtime READMEs before listing directories would have been the wrong order here — the Codex README is the one document that disagrees with disk, so trusting it first would have propagated the stale count. (iteration 7)
- the first `jq` probe assumed the registry had a `rules` key and an `id` field, so it errored twice before `keys` showed a top-level array with `rule_id`. Two calls were spent on schema guesses that one `keys` call would have answered first. The same shape mistake as iteration 3's `workflowModes` probe, now on a different file. (iteration 8)
- the first `rg --files` count under-reported Pi (45 against 47 on disk). The cause was not the file count — `rg` skips gitignored and symlinked entries, so the two operator-local commands were invisible. `ls -1` is the authoritative counter here. The earlier malformed `sed` prefix in the same pass compounded it, producing a bogus "89 expected names". (iteration 10)
- nothing failed, but the first discovery pass assumed a top-level MCP file would exist for every runtime. OpenCode keeps its registration in the root `opencode.json` and DSH keeps it in a patch under `.dsh/patches/`, so a "look for `mcp.json`" search would have reported two runtimes as unregistered. The `.dsh`/`.vibe` grep is what recovered them, and it also proved Vibe's absence rather than assuming it. (iteration 11)
- the first advisor run failed on `timeout`, which macOS does not ship. The exit code was 127 — a missing wrapper, not a failing command — and retrying without it was the whole fix. The same class of mistake as iteration 4's `&&` chain: a harness assumption produced a false negative. (iteration 12)
- the first slugger collapsed runs of whitespace, so seven valid anchors looked broken. The error came from guessing a renderer rule instead of reproducing it — the same shape as iteration 3's `workflowModes` probe and iteration 8's `rules` key, now on slug generation. (iteration 13)
- the first tool-registration grep looked for object-literal `name: 'search_tools'` shapes and returned nothing, because the server registers through `mcpTools.registerTool("name", ...)` calls. That is the same schema-guess failure as iteration 3's `workflowModes` probe and iteration 8's `rules` key, now on a registration API. (iteration 14)
- the `jq '.modes[]? | .name'` probe returned zero across seven registries. It is the third schema guess of the run (iteration 3 `workflowModes`, iteration 8 `rules` key, now `modes[].name`) and the root cause is identical each time — probing a guessed key instead of printing `keys` first. The directory listing already answered the question, so the call was pure waste. (iteration 15)
- the first command-count read (`git ls-files` with a `**` pathspec) returned 89 and looked like a contradiction with both 44 and 45. The cause was pathspec depth, not a wrong number — the same class as the earlier `rg --files` under-count, where the counting instrument, not the tree, produced the anomaly. (iteration 16)
- the first depth band used `NF==3` and returned 1, because a group command document is three path segments below the repo root but four below nothing — the band was measured against the wrong base. It is the third depth-band slip of the run and the same class as iteration 16's pathspec error: the counting instrument, not the tree. (iteration 17)
- the first registry probe globbed `spec/*registry*.json`, which does not exist — the registry lives in `spec/../lib/`. The glob was a guess about location, the same class as the earlier schema guesses; the pointer line in `validate.sh:20` was authoritative and should have been read first. (iteration 18)
- the first skill-count call reused `NF==3`, the exact band blocked in iterations 16-18, and returned 1. The band was copied from the command work without re-deriving it for a file listing. The second instrument error was `ls -ld .skilled/skills/*/`, which dereferenced the symlink and agreed with the wrong number — the first case in the run where the instrument failed toward the error rather than toward a visible anomaly. (iteration 19)
- nothing failed this iteration, but the first instinct was to treat `README.md:184` as the only oracle. That would have confirmed eight and still missed that Hermes had once been a runtime, leaving the strategy's Q2 text as a live trap. The changelog search was the call that turned a count into a roster history. (iteration 20)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`--diff-filter=A --name-only` without `--no-renames` as a closure proxy.** Moves count as additions after the sub-track restructure, so the number measures path churn rather than closed packets. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`--diff-filter=A --name-only` without `--no-renames` as a closure proxy.** Moves count as additions after the sub-track restructure, so the number measures path churn rather than closed packets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`--diff-filter=A --name-only` without `--no-renames` as a closure proxy.** Moves count as additions after the sub-track restructure, so the number measures path churn rather than closed packets.

### **`git diff --dirstat=files,0` as a summary.** It emitted 21,718 per-directory lines, nearly all rounded to `0.0%`, which conveys no ranking. Aggregating `--numstat` per two-segment path is the readable form. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`git diff --dirstat=files,0` as a summary.** It emitted 21,718 per-directory lines, nearly all rounded to `0.0%`, which conveys no ranking. Aggregating `--numstat` per two-segment path is the readable form.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git diff --dirstat=files,0` as a summary.** It emitted 21,718 per-directory lines, nearly all rounded to `0.0%`, which conveys no ranking. Aggregating `--numstat` per two-segment path is the readable form.

### **`git diff --stat` on the early range.** Rename detection over 3,365 commits did not finish inside 150 s. `--no-renames` returned in seconds, so the earlier "quadratic diff" note in strategy §8 is better explained by rename detection than by diff size. This does not change the recommendation — aggregate with `--numstat` rather than emit per-file stats. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`git diff --stat` on the early range.** Rename detection over 3,365 commits did not finish inside 150 s. `--no-renames` returned in seconds, so the earlier "quadratic diff" note in strategy §8 is better explained by rename detection than by diff size. This does not change the recommendation — aggregate with `--numstat` rather than emit per-file stats.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git diff --stat` on the early range.** Rename detection over 3,365 commits did not finish inside 150 s. `--no-renames` returned in seconds, so the earlier "quadratic diff" note in strategy §8 is better explained by rename detection than by diff size. This does not change the recommendation — aggregate with `--numstat` rather than emit per-file stats.

### **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the command count.** Same class: returns 1 because group documents are four segments. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the command count.** Same class: returns 1 because group documents are four segments.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the command count.** Same class: returns 1 because group documents are four segments.

### **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the depth-2 count.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. The band was one level off; the `NF==4` pass produced the 49 that reconciles to 44. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the depth-2 count.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. The band was one level off; the `NF==4` pass produced the 49 that reconciles to 44.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the depth-2 count.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. The band was one level off; the `NF==4` pass produced the 49 that reconciles to 44.

### **`git ls-files .skilled/skills | awk -F/ 'NF==3'` as the skill count.** Returns 1 (`README.txt`) because tracked skill files sit at `NF==4`. This is the fourth `NF` band slip of the run; the band has to be stated against a declared base before a count means anything. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **`git ls-files .skilled/skills | awk -F/ 'NF==3'` as the skill count.** Returns 1 (`README.txt`) because tracked skill files sit at `NF==4`. This is the fourth `NF` band slip of the run; the band has to be stated against a declared base before a count means anything.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git ls-files .skilled/skills | awk -F/ 'NF==3'` as the skill count.** Returns 1 (`README.txt`) because tracked skill files sit at `NF==4`. This is the fourth `NF` band slip of the run; the band has to be stated against a declared base before a count means anything.

### **`git ls-files '.skilled/commands/**/*.md'` as the command count.** Returns 89 because the pathspec recurses into reference folders. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **`git ls-files '.skilled/commands/**/*.md'` as the command count.** Returns 89 because the pathspec recurses into reference folders.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git ls-files '.skilled/commands/**/*.md'` as the command count.** Returns 89 because the pathspec recurses into reference folders.

### **`ls -1A <runtime-dir> | wc -l` as a runtime-support oracle.** It reports shallow folder layout (8-21 entries) and says nothing about whether the runtime's adapters ship. The tracked-file count and the `runtimeFolders` manifest are the oracles. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: **`ls -1A <runtime-dir> | wc -l` as a runtime-support oracle.** It reports shallow folder layout (8-21 entries) and says nothing about whether the runtime's adapters ship. The tracked-file count and the `runtimeFolders` manifest are the oracles.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ls -1A <runtime-dir> | wc -l` as a runtime-support oracle.** It reports shallow folder layout (8-21 entries) and says nothing about whether the runtime's adapters ship. The tracked-file count and the `runtimeFolders` manifest are the oracles.

### **`ls -ld .skilled/skills/*/` as the link-form oracle.** The trailing slash dereferences symlinks, so it reports all 15 entries as directories and reproduces the F1 error. `git check-ignore` or `ls -ld` without the slash is the oracle. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **`ls -ld .skilled/skills/*/` as the link-form oracle.** The trailing slash dereferences symlinks, so it reports all 15 entries as directories and reproduces the F1 error. `git check-ignore` or `ls -ld` without the slash is the oracle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ls -ld .skilled/skills/*/` as the link-form oracle.** The trailing slash dereferences symlinks, so it reports all 15 entries as directories and reproduces the F1 error. `git check-ignore` or `ls -ld` without the slash is the oracle.

### **`ls .skilled/commands/**/*.md` without `globstar`.** It expands `**` as a single `*`, so it returned the correct 44 depth-2 command files while saying nothing about the 45 deeper markdown files. The number was right for the wrong reason. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **`ls .skilled/commands/**/*.md` without `globstar`.** It expands `**` as a single `*`, so it returned the correct 44 depth-2 command files while saying nothing about the 45 deeper markdown files. The number was right for the wrong reason.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ls .skilled/commands/**/*.md` without `globstar`.** It expands `**` as a single `*`, so it returned the correct 44 depth-2 command files while saying nothing about the 45 deeper markdown files. The number was right for the wrong reason.

### **`NF==3` as the command depth band.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **`NF==3` as the command depth band.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`NF==3` as the command depth band.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`.

### **A broad Q4 re-audit to cover the spelling sentence.** Q4 is answered and a second full pass would repeat iteration 6. Only the one claim Q4 never reached — `README.md:208` — was measured, and it is recorded above as a single correction. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A broad Q4 re-audit to cover the spelling sentence.** Q4 is answered and a second full pass would repeat iteration 6. Only the one claim Q4 never reached — `README.md:208` — was measured, and it is recorded above as a single correction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broad Q4 re-audit to cover the spelling sentence.** Q4 is answered and a second full pass would repeat iteration 6. Only the one claim Q4 never reached — `README.md:208` — was measured, and it is recorded above as a single correction.

### **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration measured only claims with no prior oracle. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration measured only claims with no prior oracle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration measured only claims with no prior oracle.

### **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the four README regions its findings cite. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the four README regions its findings cite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the four README regions its findings cite.

### **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the README regions its findings cite plus the heading list. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the README regions its findings cite plus the heading list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the README regions its findings cite plus the heading list.

### **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the runtime claim set. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the runtime claim set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the runtime claim set.

### **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the synthesis and the README lines it anchors. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the synthesis and the README lines it anchors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the synthesis and the README lines it anchors.

### **A broad Q4 re-audit.** Q4 is answered and blocked as a repeat in strategy §9 since iteration 10; this iteration read only the region Q4's spans never reached. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **A broad Q4 re-audit.** Q4 is answered and blocked as a repeat in strategy §9 since iteration 10; this iteration read only the region Q4's spans never reached.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broad Q4 re-audit.** Q4 is answered and blocked as a repeat in strategy §9 since iteration 10; this iteration read only the region Q4's spans never reached.

### **A per-mirror `git ls-files` count as the ownership signal for the flat mirrors.** It returns `1` for `.claude/skills`, `.devin/skills`, `.opencode/skills` and `.pi/skills` — not because one file is tracked, but because the tracked path is the *directory symlink itself*. The count was right and its interpretation was wrong; `ls -ld` on the parents is what corrected it. Candidate for reducer promotion: a link-form question needs `ls -ld`, never a file count. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **A per-mirror `git ls-files` count as the ownership signal for the flat mirrors.** It returns `1` for `.claude/skills`, `.devin/skills`, `.opencode/skills` and `.pi/skills` — not because one file is tracked, but because the tracked path is the *directory symlink itself*. The count was right and its interpretation was wrong; `ls -ld` on the parents is what corrected it. Candidate for reducer promotion: a link-form question needs `ls -ld`, never a file count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A per-mirror `git ls-files` count as the ownership signal for the flat mirrors.** It returns `1` for `.claude/skills`, `.devin/skills`, `.opencode/skills` and `.pi/skills` — not because one file is tracked, but because the tracked path is the *directory symlink itself*. The count was right and its interpretation was wrong; `ls -ld` on the parents is what corrected it. Candidate for reducer promotion: a link-form question needs `ls -ld`, never a file count.

### **A whitespace-collapsing slugger as the anchor oracle.** It produced 7 false "broken anchor" reports on a file whose anchors are all correct. The fix is to reproduce the renderer's rule (one hyphen per space), not to trust a hand-rolled approximation. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **A whitespace-collapsing slugger as the anchor oracle.** It produced 7 false "broken anchor" reports on a file whose anchors are all correct. The fix is to reproduce the renderer's rule (one hyphen per space), not to trust a hand-rolled approximation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A whitespace-collapsing slugger as the anchor oracle.** It produced 7 false "broken anchor" reports on a file whose anchors are all correct. The fix is to reproduce the renderer's rule (one hyphen per space), not to trust a hand-rolled approximation.

### **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14, and untouched here. -- BLOCKED (iteration 18, 2 attempts)
- What was tried: **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14, and untouched here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14, and untouched here.

### **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The 14 here comes from the git index as the oracle for a synthesis row, not as a new catalog count. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The 14 here comes from the git index as the oracle for a synthesis row, not as a new catalog count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The 14 here comes from the git index as the oracle for a synthesis row, not as a new catalog count.

### **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The skill count here came from the git index during the tracking check, which is the evidence that resolves the §5D collision; it is not a second count of the catalog. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The skill count here came from the git index during the tracking check, which is the evidence that resolves the §5D collision; it is not a second count of the catalog.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The skill count here came from the git index during the tracking check, which is the evidence that resolves the §5D collision; it is not a second count of the catalog.

### **Counting registrations as seven without checking the writer.** The count and the writer are different facts, and the README's sentence conflates them; the doctor doc's six-value `--runtime` list is what separates the two. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Counting registrations as seven without checking the writer.** The count and the writer are different facts, and the README's sentence conflates them; the doctor doc's six-value `--runtime` list is what separates the two.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting registrations as seven without checking the writer.** The count and the writer are different facts, and the README's sentence conflates them; the doctor doc's six-value `--runtime` list is what separates the two.

### **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** Already blocked in strategy §9 after iteration 6; this iteration confirms the reason from the other side. The directory holds 33 `check-*.sh` entry points plus 10 helpers, and the rule identity lives in a sibling JSON registry, so no grep over that directory can produce a rule count. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** Already blocked in strategy §9 after iteration 6; this iteration confirms the reason from the other side. The directory holds 33 `check-*.sh` entry points plus 10 helpers, and the rule identity lives in a sibling JSON registry, so no grep over that directory can produce a rule count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** Already blocked in strategy §9 after iteration 6; this iteration confirms the reason from the other side. The directory holds 33 `check-*.sh` entry points plus 10 helpers, and the rule identity lives in a sibling JSON registry, so no grep over that directory can produce a rule count.

### **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** The directory holds `check-*.sh` entry points plus `.cjs` helpers, and the grep returned 36 loose matches rather than a registry. The "42 rules" claim is therefore recorded as unverified rather than wrong. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** The directory holds `check-*.sh` entry points plus `.cjs` helpers, and the grep returned 36 loose matches rather than a registry. The "42 rules" claim is therefore recorded as unverified rather than wrong.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** The directory holds `check-*.sh` entry points plus `.cjs` helpers, and the grep returned 36 loose matches rather than a registry. The "42 rules" claim is therefore recorded as unverified rather than wrong.

### **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide to selected rules, not the registry. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide to selected rules, not the registry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide to selected rules, not the registry.

### **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide, not the registry. (Established in iteration 8; re-confirmed here as the reason the registry is the oracle.) -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide, not the registry. (Established in iteration 8; re-confirmed here as the reason the registry is the oracle.)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide, not the registry. (Established in iteration 8; re-confirmed here as the reason the registry is the oracle.)

### **Deriving the command count from a recursive markdown glob.** `git ls-files '.skilled/commands/*/*.md'` returns 89 because the pathspec crosses slashes into depth-7 fixtures; the depth band has to be applied before the count means anything. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **Deriving the command count from a recursive markdown glob.** `git ls-files '.skilled/commands/*/*.md'` returns 89 because the pathspec crosses slashes into depth-7 fixtures; the depth band has to be applied before the count means anything.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deriving the command count from a recursive markdown glob.** `git ls-files '.skilled/commands/*/*.md'` returns 89 because the pathspec crosses slashes into depth-7 fixtures; the depth band has to be applied before the count means anything.

### **Deriving the command count from a recursive markdown glob.** Blocked in iterations 16-17; the depth band has to be applied before the count means anything. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Deriving the command count from a recursive markdown glob.** Blocked in iterations 16-17; the depth band has to be applied before the count means anything.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deriving the command count from a recursive markdown glob.** Blocked in iterations 16-17; the depth band has to be applied before the count means anything.

### **Deriving the install path from the release notes.** The manifests and the executed command are authoritative; the release narrative only explains when the doctor family arrived. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Deriving the install path from the release notes.** The manifests and the executed command are authoritative; the release narrative only explains when the doctor family arrived.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deriving the install path from the release notes.** The manifests and the executed command are authoritative; the release narrative only explains when the doctor family arrived.

### **Deriving the runtime mapping from the release notes.** The release narrative explains when DSH and Vibe were added; the adapter directories are the authoritative inventory and were listed directly. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Deriving the runtime mapping from the release notes.** The release narrative explains when DSH and Vibe were added; the adapter directories are the authoritative inventory and were listed directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deriving the runtime mapping from the release notes.** The release narrative explains when DSH and Vibe were added; the adapter directories are the authoritative inventory and were listed directly.

### **Editing `research.md` to add a §5I for this iteration's MCP matrix.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-011.md` and `deltas/iter-011.jsonl`. Recorded under SCOPE VIOLATIONS; the material is ready to paste. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Editing `research.md` to add a §5I for this iteration's MCP matrix.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-011.md` and `deltas/iter-011.jsonl`. Recorded under SCOPE VIOLATIONS; the material is ready to paste.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `research.md` to add a §5I for this iteration's MCP matrix.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-011.md` and `deltas/iter-011.jsonl`. Recorded under SCOPE VIOLATIONS; the material is ready to paste.

### **Editing `research.md` to apply §5E–§5G.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-010.md` and `deltas/iter-010.jsonl`. Recorded under SCOPE VIOLATIONS. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Editing `research.md` to apply §5E–§5G.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-010.md` and `deltas/iter-010.jsonl`. Recorded under SCOPE VIOLATIONS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `research.md` to apply §5E–§5G.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-010.md` and `deltas/iter-010.jsonl`. Recorded under SCOPE VIOLATIONS.

### **Editing `research.md` to fold the corrections.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-019.md` and `deltas/iter-019.jsonl`. Recorded under SCOPE VIOLATIONS. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: **Editing `research.md` to fold the corrections.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-019.md` and `deltas/iter-019.jsonl`. Recorded under SCOPE VIOLATIONS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `research.md` to fold the corrections.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-019.md` and `deltas/iter-019.jsonl`. Recorded under SCOPE VIOLATIONS.

### **Editing `research.md` to fold the roster correction.** Outside this dispatch's allowed write paths; recorded under SCOPE VIOLATIONS. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: **Editing `research.md` to fold the roster correction.** Outside this dispatch's allowed write paths; recorded under SCOPE VIOLATIONS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `research.md` to fold the roster correction.** Outside this dispatch's allowed write paths; recorded under SCOPE VIOLATIONS.

### **Editing `research/research.md` to fold in Q3 and this iteration's verifications.** `progressiveSynthesis` is true in config, but this dispatch's allowed-write list names only `iterations/iteration-008.md` and `deltas/iter-008.jsonl`, so the edit was not executed. Recorded under SCOPE VIOLATIONS for the workflow owner. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Editing `research/research.md` to fold in Q3 and this iteration's verifications.** `progressiveSynthesis` is true in config, but this dispatch's allowed-write list names only `iterations/iteration-008.md` and `deltas/iter-008.jsonl`, so the edit was not executed. Recorded under SCOPE VIOLATIONS for the workflow owner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `research/research.md` to fold in Q3 and this iteration's verifications.** `progressiveSynthesis` is true in config, but this dispatch's allowed-write list names only `iterations/iteration-008.md` and `deltas/iter-008.jsonl`, so the edit was not executed. Recorded under SCOPE VIOLATIONS for the workflow owner.

### **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-013.md` and `deltas/iter-013.jsonl`. Recorded under SCOPE VIOLATIONS. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-013.md` and `deltas/iter-013.jsonl`. Recorded under SCOPE VIOLATIONS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-013.md` and `deltas/iter-013.jsonl`. Recorded under SCOPE VIOLATIONS.

### **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-014.md` and `deltas/iter-014.jsonl`. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-014.md` and `deltas/iter-014.jsonl`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-014.md` and `deltas/iter-014.jsonl`.

### **Grepping `runtime/cli/rules` for quoted uppercase rule ids.** Returns loose matches over `check-*.sh` entry points and `.cjs` helpers, not a rule count. This is the dead end that left "42 rules" unverified since iteration 6. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: **Grepping `runtime/cli/rules` for quoted uppercase rule ids.** Returns loose matches over `check-*.sh` entry points and `.cjs` helpers, not a rule count. This is the dead end that left "42 rules" unverified since iteration 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Grepping `runtime/cli/rules` for quoted uppercase rule ids.** Returns loose matches over `check-*.sh` entry points and `.cjs` helpers, not a rule count. This is the dead end that left "42 rules" unverified since iteration 6.

### **Listing Hermes as a supported runtime.** `.hermes` is absent and the CLI mode was removed in `cli-external-orchestration` v2.0.0.0. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: **Listing Hermes as a supported runtime.** `.hermes` is absent and the CLI mode was removed in `cli-external-orchestration` v2.0.0.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Listing Hermes as a supported runtime.** `.hermes` is absent and the CLI mode was removed in `cli-external-orchestration` v2.0.0.0.

### **Quoting the post-tag `--shortstat` as a measure of change.** 576,916 insertions collapses to roughly 177,000 once the two scratch patches are excluded, and to a few tens of thousands once spec packets are excluded. The raw figure is a scaffolding count. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Quoting the post-tag `--shortstat` as a measure of change.** 576,916 insertions collapses to roughly 177,000 once the two scratch patches are excluded, and to a few tens of thousands once spec packets are excluded. The raw figure is a scaffolding count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Quoting the post-tag `--shortstat` as a measure of change.** 576,916 insertions collapses to roughly 177,000 once the two scratch patches are excluded, and to a few tens of thousands once spec packets are excluded. The raw figure is a scaffolding count.

### **Re-auditing Q4 to satisfy the dispatch's stale next-focus line.** Q4 is ticked in strategy §3 and listed under §6; a second pass would produce redundant findings and no new citations. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Re-auditing Q4 to satisfy the dispatch's stale next-focus line.** Q4 is ticked in strategy §3 and listed under §6; a second pass would produce redundant findings and no new citations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-auditing Q4 to satisfy the dispatch's stale next-focus line.** Q4 is ticked in strategy §3 and listed under §6; a second pass would produce redundant findings and no new citations.

### **Re-counting the 14 templates and the 14 skills.** Settled in iterations 11 and 6; the FAQ only needed their line references confirmed. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **Re-counting the 14 templates and the 14 skills.** Settled in iterations 11 and 6; the FAQ only needed their line references confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-counting the 14 templates and the 14 skills.** Settled in iterations 11 and 6; the FAQ only needed their line references confirmed.

### **Re-counting the validation rules.** Settled in iteration 8 against the registry; this iteration only re-located the four README occurrences. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Re-counting the validation rules.** Settled in iteration 8 against the registry; this iteration only re-located the four README occurrences.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-counting the validation rules.** Settled in iteration 8 against the registry; this iteration only re-located the four README occurrences.

### **Re-deriving the four flat mirrors' tracking depth from `git status`.** `git status --porcelain .skilled/skills` printed nothing, which reads as "clean" and is actually "ignored". `git ls-files` and `ls -ld` separated the two in one call. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **Re-deriving the four flat mirrors' tracking depth from `git status`.** `git status --porcelain .skilled/skills` printed nothing, which reads as "clean" and is actually "ignored". `git ls-files` and `ls -ld` separated the two in one call.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the four flat mirrors' tracking depth from `git status`.** `git status --porcelain .skilled/skills` printed nothing, which reads as "clean" and is actually "ignored". `git ls-files` and `ls -ld` separated the two in one call.

### **Re-deriving the six-versus-eight runtime question from the release notes.** The disk directory listing settles it in one call and is the authoritative source; the release narrative only explains when dsh and Vibe were added, which the rewrite does not need. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Re-deriving the six-versus-eight runtime question from the release notes.** The disk directory listing settles it in one call and is the authoritative source; the release narrative only explains when dsh and Vibe were added, which the rewrite does not need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the six-versus-eight runtime question from the release notes.** The disk directory listing settles it in one call and is the authoritative source; the release narrative only explains when dsh and Vibe were added, which the rewrite does not need.

### **Re-reading the two release notes to satisfy the literal dispatch text.** Both are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. Blocked in strategy §9 before this iteration began. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Re-reading the two release notes to satisfy the literal dispatch text.** Both are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. Blocked in strategy §9 before this iteration began.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-reading the two release notes to satisfy the literal dispatch text.** Both are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. Blocked in strategy §9 before this iteration began.

### **Re-running `git diff --stat` for `v4.0.0.0..v4.0.1.0`.** Blocked by rename detection, and the bounded measurement plus its deleted-archive explanation already sit in the synthesis. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Re-running `git diff --stat` for `v4.0.0.0..v4.0.1.0`.** Blocked by rename detection, and the bounded measurement plus its deleted-archive explanation already sit in the synthesis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running `git diff --stat` for `v4.0.0.0..v4.0.1.0`.** Blocked by rename detection, and the bounded measurement plus its deleted-archive explanation already sit in the synthesis.

### **Re-running iteration 2's reads to satisfy the literal dispatch text.** Both release notes are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Re-running iteration 2's reads to satisfy the literal dispatch text.** Both release notes are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running iteration 2's reads to satisfy the literal dispatch text.** Both release notes are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations.

### **Re-running the Node-version audit.** Q4 settled it and iteration 12 re-confirmed the block; a second pass would repeat iteration 6. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Re-running the Node-version audit.** Q4 settled it and iteration 12 re-confirmed the block; a second pass would repeat iteration 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the Node-version audit.** Q4 settled it and iteration 12 re-confirmed the block; a second pass would repeat iteration 6.

### **Re-running the Node-version audit.** Q4 settled it: `README.md:164` says "Node.js 24" while both packages declare `^22.23.4 || ^24.22.1 || >=26.12.1`. A second pass would repeat iteration 6. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Re-running the Node-version audit.** Q4 settled it: `README.md:164` says "Node.js 24" while both packages declare `^22.23.4 || ^24.22.1 || >=26.12.1`. A second pass would repeat iteration 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the Node-version audit.** Q4 settled it: `README.md:164` says "Node.js 24" while both packages declare `^22.23.4 || ^24.22.1 || >=26.12.1`. A second pass would repeat iteration 6.

### **Re-running the synthesis-state check a third time.** Iteration 9 measured it and iteration 10 re-confirmed `research.md` unchanged at 172 lines. A third measurement would add no citation, only redundancy. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Re-running the synthesis-state check a third time.** Iteration 9 measured it and iteration 10 re-confirmed `research.md` unchanged at 172 lines. A third measurement would add no citation, only redundancy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the synthesis-state check a third time.** Iteration 9 measured it and iteration 10 re-confirmed `research.md` unchanged at 172 lines. A third measurement would add no citation, only redundancy.

### **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; nothing in this iteration's claim set depends on it. -- BLOCKED (iteration 19, 2 attempts)
- What was tried: **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; nothing in this iteration's claim set depends on it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; nothing in this iteration's claim set depends on it.

### **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; the FAQ's install-adjacent answers do not depend on it. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; the FAQ's install-adjacent answers do not depend on it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; the FAQ's install-adjacent answers do not depend on it.

### **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12: the guide's H2 structure plus the four verified anchors answer the delegation question. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12: the guide's H2 structure plus the four verified anchors answer the delegation question.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12: the guide's H2 structure plus the four verified anchors answer the delegation question.

### **Reading `INSTALL-SKILLED.md` in full.** Its H2 structure plus the four anchors the README links answers the delegation question; the guide's body is install detail the root README is supposed to link, not repeat. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Reading `INSTALL-SKILLED.md` in full.** Its H2 structure plus the four anchors the README links answers the delegation question; the guide's body is install detail the root README is supposed to link, not repeat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `INSTALL-SKILLED.md` in full.** Its H2 structure plus the four anchors the README links answers the delegation question; the guide's body is install detail the root README is supposed to link, not repeat.

### **Reading `mode-registry.json` to enumerate mode names for the 41-entry decomposition.** `jq -r '.modes[]? | .name // .id'` returned zero names across all seven registries, the same schema guess that cost iterations 3 and 8 two calls each. The directory listing was already authoritative and settled the decomposition without the registries. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **Reading `mode-registry.json` to enumerate mode names for the 41-entry decomposition.** `jq -r '.modes[]? | .name // .id'` returned zero names across all seven registries, the same schema guess that cost iterations 3 and 8 two calls each. The directory listing was already authoritative and settled the decomposition without the registries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `mode-registry.json` to enumerate mode names for the 41-entry decomposition.** `jq -r '.modes[]? | .name // .id'` returned zero names across all seven registries, the same schema guess that cost iterations 3 and 8 two calls each. The directory listing was already authoritative and settled the decomposition without the registries.

### **Reading all 14 skill READMEs in full to confirm ownership.** Their H2 skeletons plus line counts were sufficient: every one has OVERVIEW / QUICK START / HOW IT WORKS / VERIFICATION, so the ownership question is answered by the skeleton, not the prose. Only `system-spec-kit/README.md` needed its section spans, because it is the one file with COMMANDS and CONFIGURATION sections. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Reading all 14 skill READMEs in full to confirm ownership.** Their H2 skeletons plus line counts were sufficient: every one has OVERVIEW / QUICK START / HOW IT WORKS / VERIFICATION, so the ownership question is answered by the skeleton, not the prose. Only `system-spec-kit/README.md` needed its section spans, because it is the one file with COMMANDS and CONFIGURATION sections.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading all 14 skill READMEs in full to confirm ownership.** Their H2 skeletons plus line counts were sufficient: every one has OVERVIEW / QUICK START / HOW IT WORKS / VERIFICATION, so the ownership question is answered by the skeleton, not the prose. Only `system-spec-kit/README.md` needed its section spans, because it is the one file with COMMANDS and CONFIGURATION sections.

### **Reading all 35 workflow files to name badge candidates.** The map finding is about root entries; badge selection happens at rewrite time from `.github/workflows/`, which is already listed. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Reading all 35 workflow files to name badge candidates.** The map finding is about root entries; badge selection happens at rewrite time from `.github/workflows/`, which is already listed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading all 35 workflow files to name badge candidates.** The map finding is about root entries; badge selection happens at rewrite time from `.github/workflows/`, which is already listed.

### **Reading the eight runtime READMEs in full for MCP statements.** The config files are the authoritative inventory; the READMEs' MCP lines were already reached by grep, and a full read would repeat iteration 7's shape. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Reading the eight runtime READMEs in full for MCP statements.** The config files are the authoritative inventory; the READMEs' MCP lines were already reached by grep, and a full read would repeat iteration 7's shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the eight runtime READMEs in full for MCP statements.** The config files are the authoritative inventory; the READMEs' MCP lines were already reached by grep, and a full read would repeat iteration 7's shape.

### **Searching the current README for a Hermes claim to correct.** There is none; the only trace of Hermes is historical changelog prose and the strategy question text. The correction belongs in the brief, not in a README claim row. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: **Searching the current README for a Hermes claim to correct.** There is none; the only trace of Hermes is historical changelog prose and the strategy question text. The correction belongs in the brief, not in a README claim row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching the current README for a Hermes claim to correct.** There is none; the only trace of Hermes is historical changelog prose and the strategy question text. The correction belongs in the brief, not in a README claim row.

### **Treating §17 RELATED DOCUMENTS as the navigation answer.** It holds ~20 links but omits nine skill READMEs, so it is a partial index rather than the map. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating §17 RELATED DOCUMENTS as the navigation answer.** It holds ~20 links but omits nine skill READMEs, so it is a partial index rather than the map.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating §17 RELATED DOCUMENTS as the navigation answer.** It holds ~20 links but omits nine skill READMEs, so it is a partial index rather than the map.

### **Treating `prompt` as a utility rather than a group.** The README's taxonomy implies it, the disk contradicts it — `prompt/improve.md` is a group file. This is the root cause of the 43 + 2 partition, and it is now recorded rather than repeated. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: **Treating `prompt` as a utility rather than a group.** The README's taxonomy implies it, the disk contradicts it — `prompt/improve.md` is a group file. This is the root cause of the 43 + 2 partition, and it is now recorded rather than repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `prompt` as a utility rather than a group.** The README's taxonomy implies it, the disk contradicts it — `prompt/improve.md` is a group file. This is the root cause of the 43 + 2 partition, and it is now recorded rather than repeated.

### **Treating `README.md:16`'s six-name list as the current roster.** It omits DSH and Mistral Vibe, both shipped and tracked (148 and 203 files). -- BLOCKED (iteration 20, 1 attempts)
- What was tried: **Treating `README.md:16`'s six-name list as the current roster.** It omits DSH and Mistral Vibe, both shipped and tracked (148 and 203 files).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `README.md:16`'s six-name list as the current roster.** It omits DSH and Mistral Vibe, both shipped and tracked (148 and 203 files).

### **Treating `timeout 45 node ...` as portable.** macOS has no `timeout` binary, so the first advisor run exited 127 for that reason, not because the command was wrong. Retried without the wrapper and it passed. This is a harness portability trap, not a README defect. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Treating `timeout 45 node ...` as portable.** macOS has no `timeout` binary, so the first advisor run exited 127 for that reason, not because the command was wrong. Retried without the wrapper and it passed. This is a harness portability trap, not a README defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `timeout 45 node ...` as portable.** macOS has no `timeout` binary, so the first advisor run exited 127 for that reason, not because the command was wrong. Retried without the wrapper and it passed. This is a harness portability trap, not a README defect.

### **Treating iteration 7's hook counts as the whole runtime matrix.** They cover one column of seven; the matrix needed the command surface, its form, its count and its spelling. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Treating iteration 7's hook counts as the whole runtime matrix.** They cover one column of seven; the matrix needed the command surface, its form, its count and its spelling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating iteration 7's hook counts as the whole runtime matrix.** They cover one column of seven; the matrix needed the command surface, its form, its count and its spelling.

### **Treating the 15 directories on disk as the skill count.** The README's 14 is right; `local-webflow` is an external symlink. Recorded above as finding 1. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: **Treating the 15 directories on disk as the skill count.** The README's 14 is right; `local-webflow` is an external symlink. Recorded above as finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the 15 directories on disk as the skill count.** The README's 14 is right; `local-webflow` is an external symlink. Recorded above as finding 1.

### **Treating the FAQ as soft prose.** The first framing assumed FAQ answers are explanatory and hard to falsify; four of the ten turned out to have a mechanical oracle (a registration count, a defaults row, file existence, and gate text). The lesson is that a FAQ is a claim surface like any catalog section, not a commentary layer. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **Treating the FAQ as soft prose.** The first framing assumed FAQ answers are explanatory and hard to falsify; four of the ten turned out to have a mechanical oracle (a registration count, a defaults row, file existence, and gate text). The lesson is that a FAQ is a claim surface like any catalog section, not a commentary layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the FAQ as soft prose.** The first framing assumed FAQ answers are explanatory and hard to falsify; four of the ten turned out to have a mechanical oracle (a registration count, a defaults row, file existence, and gate text). The lesson is that a FAQ is a claim surface like any catalog section, not a commentary layer.

### **Using `grep -c` on section names as a duplication measure.** Title-level matching cannot distinguish a section that repeats content from one that links to it; the line-span measurement replaced it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Using `grep -c` on section names as a duplication measure.** Title-level matching cannot distinguish a section that repeats content from one that links to it; the line-span measurement replaced it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using `grep -c` on section names as a duplication measure.** Title-level matching cannot distinguish a section that repeats content from one that links to it; the line-span measurement replaced it.

### **Using top-level directory entry counts as a support measure.** `.dsh` has 8 entries and 148 tracked files, `.vibe` 8 entries and 203 tracked files; entry count measures layout, not support. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: **Using top-level directory entry counts as a support measure.** `.dsh` has 8 entries and 148 tracked files, `.vibe` 8 entries and 203 tracked files; entry count measures layout, not support.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using top-level directory entry counts as a support measure.** `.dsh` has 8 entries and 148 tracked files, `.vibe` 8 entries and 203 tracked files; entry count measures layout, not support.

### Counting `implementation-summary.md` paths as a proxy for closed packets. Definitively eliminated: the v4.0.2.1 sub-track restructure makes the measure meaningless at this scale. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Counting `implementation-summary.md` paths as a proxy for closed packets. Definitively eliminated: the v4.0.2.1 sub-track restructure makes the measure meaningless at this scale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `implementation-summary.md` paths as a proxy for closed packets. Definitively eliminated: the v4.0.2.1 sub-track restructure makes the measure meaningless at this scale.

### Describing `modes` as an object keyed by numeric index. `jq keys` over an array returns `0,1,2,…`, which is indistinguishable from object keys in output; only `jq 'type'` separates the two. Do not carry the object description forward. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Describing `modes` as an object keyed by numeric index. `jq keys` over an array returns `0,1,2,…`, which is indistinguishable from object keys in output; only `jq 'type'` separates the two. Do not carry the object description forward.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Describing `modes` as an object keyed by numeric index. `jq keys` over an array returns `0,1,2,…`, which is indistinguishable from object keys in output; only `jq 'type'` separates the two. Do not carry the object description forward.

### None this iteration. Every action produced usable evidence. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None this iteration. Every action produced usable evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. Every action produced usable evidence.

### None. Every action produced usable evidence, and the three unverified claims are now settled. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None. Every action produced usable evidence, and the three unverified claims are now settled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. Every action produced usable evidence, and the three unverified claims are now settled.

### None. Every action produced usable evidence. -- BLOCKED (iteration 11, 4 attempts)
- What was tried: None. Every action produced usable evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. Every action produced usable evidence.

### Treating `specs/hooks-plugins-extensions` post-tag churn as evidence of a shipped hook rewrite. The 1,075 files are research artifacts for a packet that describes the rewrite; the rewrite itself is the 378 files under `.skilled/hooks`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `specs/hooks-plugins-extensions` post-tag churn as evidence of a shipped hook rewrite. The 1,075 files are research artifacts for a packet that describes the rewrite; the rewrite itself is the 378 files under `.skilled/hooks`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `specs/hooks-plugins-extensions` post-tag churn as evidence of a shipped hook rewrite. The 1,075 files are research artifacts for a packet that describes the rewrite; the rewrite itself is the 378 files under `.skilled/hooks`.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **`--diff-filter=A --name-only` without `--no-renames` as a closure proxy.** Moves count as additions after the sub-track restructure, so the number measures path churn rather than closed packets. (iteration 2)
- **`git diff --dirstat=files,0` as a summary.** It emitted 21,718 per-directory lines, nearly all rounded to `0.0%`, which conveys no ranking. Aggregating `--numstat` per two-segment path is the readable form. (iteration 2)
- **`git diff --stat` on the early range.** Rename detection over 3,365 commits did not finish inside 150 s. `--no-renames` returned in seconds, so the earlier "quadratic diff" note in strategy §8 is better explained by rename detection than by diff size. This does not change the recommendation — aggregate with `--numstat` rather than emit per-file stats. (iteration 2)
- Counting `implementation-summary.md` paths as a proxy for closed packets. Definitively eliminated: the v4.0.2.1 sub-track restructure makes the measure meaningless at this scale. (iteration 2)
- **Quoting the post-tag `--shortstat` as a measure of change.** 576,916 insertions collapses to roughly 177,000 once the two scratch patches are excluded, and to a few tens of thousands once spec packets are excluded. The raw figure is a scaffolding count. (iteration 3)
- **Re-running iteration 2's reads to satisfy the literal dispatch text.** Both release notes are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. (iteration 3)
- Treating `specs/hooks-plugins-extensions` post-tag churn as evidence of a shipped hook rewrite. The 1,075 files are research artifacts for a packet that describes the rewrite; the rewrite itself is the 378 files under `.skilled/hooks`. (iteration 3)
- **Re-reading the two release notes to satisfy the literal dispatch text.** Both are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. Blocked in strategy §9 before this iteration began. (iteration 4)
- **Re-running `git diff --stat` for `v4.0.0.0..v4.0.1.0`.** Blocked by rename detection, and the bounded measurement plus its deleted-archive explanation already sit in the synthesis. (iteration 4)
- Describing `modes` as an object keyed by numeric index. `jq keys` over an array returns `0,1,2,…`, which is indistinguishable from object keys in output; only `jq 'type'` separates the two. Do not carry the object description forward. (iteration 4)
- **Reading all 14 skill READMEs in full to confirm ownership.** Their H2 skeletons plus line counts were sufficient: every one has OVERVIEW / QUICK START / HOW IT WORKS / VERIFICATION, so the ownership question is answered by the skeleton, not the prose. Only `system-spec-kit/README.md` needed its section spans, because it is the one file with COMMANDS and CONFIGURATION sections. (iteration 5)
- **Treating §17 RELATED DOCUMENTS as the navigation answer.** It holds ~20 links but omits nine skill READMEs, so it is a partial index rather than the map. (iteration 5)
- **Using `grep -c` on section names as a duplication measure.** Title-level matching cannot distinguish a section that repeats content from one that links to it; the line-span measurement replaced it. (iteration 5)
- None this iteration. Every action produced usable evidence. (iteration 5)
- **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** The directory holds `check-*.sh` entry points plus `.cjs` helpers, and the grep returned 36 loose matches rather than a registry. The "42 rules" claim is therefore recorded as unverified rather than wrong. (iteration 6)
- **Re-deriving the six-versus-eight runtime question from the release notes.** The disk directory listing settles it in one call and is the authoritative source; the release narrative only explains when dsh and Vibe were added, which the rewrite does not need. (iteration 6)
- None. Every action produced usable evidence. (iteration 6)
- **Deriving the runtime mapping from the release notes.** The release narrative explains when DSH and Vibe were added; the adapter directories are the authoritative inventory and were listed directly. (iteration 7)
- **Re-auditing Q4 to satisfy the dispatch's stale next-focus line.** Q4 is ticked in strategy §3 and listed under §6; a second pass would produce redundant findings and no new citations. (iteration 7)
- **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** Already blocked in strategy §9 after iteration 6; this iteration confirms the reason from the other side. The directory holds 33 `check-*.sh` entry points plus 10 helpers, and the rule identity lives in a sibling JSON registry, so no grep over that directory can produce a rule count. (iteration 8)
- **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide to selected rules, not the registry. (iteration 8)
- **Editing `research/research.md` to fold in Q3 and this iteration's verifications.** `progressiveSynthesis` is true in config, but this dispatch's allowed-write list names only `iterations/iteration-008.md` and `deltas/iter-008.jsonl`, so the edit was not executed. Recorded under SCOPE VIOLATIONS for the workflow owner. (iteration 8)
- None. Every action produced usable evidence, and the three unverified claims are now settled. (iteration 8)
- **A broad Q4 re-audit to cover the spelling sentence.** Q4 is answered and a second full pass would repeat iteration 6. Only the one claim Q4 never reached — `README.md:208` — was measured, and it is recorded above as a single correction. (iteration 10)
- **Editing `research.md` to apply §5E–§5G.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-010.md` and `deltas/iter-010.jsonl`. Recorded under SCOPE VIOLATIONS. (iteration 10)
- **Treating iteration 7's hook counts as the whole runtime matrix.** They cover one column of seven; the matrix needed the command surface, its form, its count and its spelling. (iteration 10)
- **Counting registrations as seven without checking the writer.** The count and the writer are different facts, and the README's sentence conflates them; the doctor doc's six-value `--runtime` list is what separates the two. (iteration 11)
- **Editing `research.md` to add a §5I for this iteration's MCP matrix.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-011.md` and `deltas/iter-011.jsonl`. Recorded under SCOPE VIOLATIONS; the material is ready to paste. (iteration 11)
- **Re-running the synthesis-state check a third time.** Iteration 9 measured it and iteration 10 re-confirmed `research.md` unchanged at 172 lines. A third measurement would add no citation, only redundancy. (iteration 11)
- **Reading the eight runtime READMEs in full for MCP statements.** The config files are the authoritative inventory; the READMEs' MCP lines were already reached by grep, and a full read would repeat iteration 7's shape. (iteration 11)
- **Deriving the install path from the release notes.** The manifests and the executed command are authoritative; the release narrative only explains when the doctor family arrived. (iteration 12)
- **Re-running the Node-version audit.** Q4 settled it: `README.md:164` says "Node.js 24" while both packages declare `^22.23.4 || ^24.22.1 || >=26.12.1`. A second pass would repeat iteration 6. (iteration 12)
- **Reading `INSTALL-SKILLED.md` in full.** Its H2 structure plus the four anchors the README links answers the delegation question; the guide's body is install detail the root README is supposed to link, not repeat. (iteration 12)
- **Reading all 35 workflow files to name badge candidates.** The map finding is about root entries; badge selection happens at rewrite time from `.github/workflows/`, which is already listed. (iteration 12)
- **Treating `timeout 45 node ...` as portable.** macOS has no `timeout` binary, so the first advisor run exited 127 for that reason, not because the command was wrong. Retried without the wrapper and it passed. This is a harness portability trap, not a README defect. (iteration 12)
- **A whitespace-collapsing slugger as the anchor oracle.** It produced 7 false "broken anchor" reports on a file whose anchors are all correct. The fix is to reproduce the renderer's rule (one hyphen per space), not to trust a hand-rolled approximation. (iteration 13)
- **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-013.md` and `deltas/iter-013.jsonl`. Recorded under SCOPE VIOLATIONS. (iteration 13)
- **Re-counting the validation rules.** Settled in iteration 8 against the registry; this iteration only re-located the four README occurrences. (iteration 13)
- **Re-running the Node-version audit.** Q4 settled it and iteration 12 re-confirmed the block; a second pass would repeat iteration 6. (iteration 13)
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12: the guide's H2 structure plus the four verified anchors answer the delegation question. (iteration 13)
- **A broad Q4 re-audit.** Q4 is answered and blocked as a repeat in strategy §9 since iteration 10; this iteration read only the region Q4's spans never reached. (iteration 14)
- **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-014.md` and `deltas/iter-014.jsonl`. (iteration 14)
- **Re-counting the 14 templates and the 14 skills.** Settled in iterations 11 and 6; the FAQ only needed their line references confirmed. (iteration 14)
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; the FAQ's install-adjacent answers do not depend on it. (iteration 14)
- **Treating the FAQ as soft prose.** The first framing assumed FAQ answers are explanatory and hard to falsify; four of the ten turned out to have a mechanical oracle (a registration count, a defaults row, file existence, and gate text). The lesson is that a FAQ is a claim surface like any catalog section, not a commentary layer. (iteration 14)
- **A per-mirror `git ls-files` count as the ownership signal for the flat mirrors.** It returns `1` for `.claude/skills`, `.devin/skills`, `.opencode/skills` and `.pi/skills` — not because one file is tracked, but because the tracked path is the *directory symlink itself*. The count was right and its interpretation was wrong; `ls -ld` on the parents is what corrected it. Candidate for reducer promotion: a link-form question needs `ls -ld`, never a file count. (iteration 15)
- **Re-deriving the four flat mirrors' tracking depth from `git status`.** `git status --porcelain .skilled/skills` printed nothing, which reads as "clean" and is actually "ignored". `git ls-files` and `ls -ld` separated the two in one call. (iteration 15)
- **Reading `mode-registry.json` to enumerate mode names for the 41-entry decomposition.** `jq -r '.modes[]? | .name // .id'` returned zero names across all seven registries, the same schema guess that cost iterations 3 and 8 two calls each. The directory listing was already authoritative and settled the decomposition without the registries. (iteration 15)
- **Treating the 15 directories on disk as the skill count.** The README's 14 is right; `local-webflow` is an external symlink. Recorded above as finding 1. (iteration 15)
- **`git ls-files '.skilled/commands/**/*.md'` as the command count.** Returns 89 because the pathspec recurses into reference folders. (iteration 16)
- **`ls .skilled/commands/**/*.md` without `globstar`.** It expands `**` as a single `*`, so it returned the correct 44 depth-2 command files while saying nothing about the 45 deeper markdown files. The number was right for the wrong reason. (iteration 16)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the four README regions its findings cite. (iteration 16)
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The skill count here came from the git index during the tracking check, which is the evidence that resolves the §5D collision; it is not a second count of the catalog. (iteration 16)
- **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the depth-2 count.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. The band was one level off; the `NF==4` pass produced the 49 that reconciles to 44. (iteration 17)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the README regions its findings cite plus the heading list. (iteration 17)
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14, and untouched here. (iteration 17)
- **Deriving the command count from a recursive markdown glob.** `git ls-files '.skilled/commands/*/*.md'` returns 89 because the pathspec crosses slashes into depth-7 fixtures; the depth band has to be applied before the count means anything. (iteration 17)
- **Treating `prompt` as a utility rather than a group.** The README's taxonomy implies it, the disk contradicts it — `prompt/improve.md` is a group file. This is the root cause of the 43 + 2 partition, and it is now recorded rather than repeated. (iteration 17)
- **`NF==3` as the command depth band.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. (iteration 18)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration measured only claims with no prior oracle. (iteration 18)
- **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide, not the registry. (Established in iteration 8; re-confirmed here as the reason the registry is the oracle.) (iteration 18)
- **Deriving the command count from a recursive markdown glob.** Blocked in iterations 16-17; the depth band has to be applied before the count means anything. (iteration 18)
- **Grepping `runtime/cli/rules` for quoted uppercase rule ids.** Returns loose matches over `check-*.sh` entry points and `.cjs` helpers, not a rule count. This is the dead end that left "42 rules" unverified since iteration 6. (iteration 18)
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; nothing in this iteration's claim set depends on it. (iteration 18)
- **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the command count.** Same class: returns 1 because group documents are four segments. (iteration 19)
- **`git ls-files .skilled/skills | awk -F/ 'NF==3'` as the skill count.** Returns 1 (`README.txt`) because tracked skill files sit at `NF==4`. This is the fourth `NF` band slip of the run; the band has to be stated against a declared base before a count means anything. (iteration 19)
- **`ls -ld .skilled/skills/*/` as the link-form oracle.** The trailing slash dereferences symlinks, so it reports all 15 entries as directories and reproduces the F1 error. `git check-ignore` or `ls -ld` without the slash is the oracle. (iteration 19)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the synthesis and the README lines it anchors. (iteration 19)
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The 14 here comes from the git index as the oracle for a synthesis row, not as a new catalog count. (iteration 19)
- **Editing `research.md` to fold the corrections.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-019.md` and `deltas/iter-019.jsonl`. Recorded under SCOPE VIOLATIONS. (iteration 19)
- **`ls -1A <runtime-dir> | wc -l` as a runtime-support oracle.** It reports shallow folder layout (8-21 entries) and says nothing about whether the runtime's adapters ship. The tracked-file count and the `runtimeFolders` manifest are the oracles. (iteration 20)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the runtime claim set. (iteration 20)
- **Editing `research.md` to fold the roster correction.** Outside this dispatch's allowed write paths; recorded under SCOPE VIOLATIONS. (iteration 20)
- **Listing Hermes as a supported runtime.** `.hermes` is absent and the CLI mode was removed in `cli-external-orchestration` v2.0.0.0. (iteration 20)
- **Searching the current README for a Hermes claim to correct.** There is none; the only trace of Hermes is historical changelog prose and the strategy question text. The correction belongs in the brief, not in a README claim row. (iteration 20)
- **Treating `README.md:16`'s six-name list as the current roster.** It omits DSH and Mistral Vibe, both shipped and tracked (148 and 203 files). (iteration 20)
- **Using top-level directory entry counts as a support measure.** `.dsh` has 8 entries and 148 tracked files, `.vibe` 8 entries and 203 tracked files; entry count measures layout, not support. (iteration 20)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q2, Q3, Q4, Q5: untouched this iteration. (iteration 1)
- Q1, residual scope: read `.skilled/changelog/skilled/v4.0.1.0.md` and `.skilled/changelog/skilled/v4.0.2.0.md`; obtain a bounded `git diff --stat` for `v4.0.0.0..v4.0.1.0` (use `--shortstat` against a single path or a `--dirstat` to stay under the time limit); confirm which spec packets closed in each range. (iteration 1)
- **Q4** — claim audit of the current 1,773-line `README.md`. (iteration 4)
- **Q3** — every dedicated hook, plugin and extension per runtime, one README subsection each. The 27 hook cores are already named and verified against disk; what is missing is the per-runtime adapter mapping. (iteration 4)
- **Q5** — reader-first section order for a shorter README. (iteration 4)
- **Q3** — every dedicated hook, plugin and extension per runtime, one README subsection each. The 27 hook cores are named and verified; the per-runtime adapter mapping is still unmeasured. (iteration 5)
- **Q4** — claim audit of the current 1,773-line `README.md`. Q5 supplies the section order the audit should walk. (iteration 5)
- None. Q1, Q2, Q3, Q4 and Q5 are all answered. The strategy §5 stop condition also requires Q3 to be cross-checked against a directory listing of every runtime folder; that cross-check is the body of this iteration, with no unlisted runtime directory found. (iteration 7)
- None. The three numeric claims the Q4 audit left unverified are now settled, and the strategy §5 stop condition (all key questions answered plus Q3 cross-checked against every runtime directory) is met. (iteration 8)
- None. (iteration 14)
- Name the two utilities in the 45-command sentence, or drop the 43 + 2 partition; the tree does not declare which files are utilities. (iteration 16)
- Fold iterations 6-15 into `research.md`; the synthesis is workflow-owned and outside this dispatch's write scope. (iteration 16)
- State the command surface as 44 canonical group commands plus the two authored runtime commands (`/goal-cursor`, `/goal-opencode`), or pick a scope and name it. Do not restate "43 in six groups plus two utilities". (iteration 17)
- Write "four documentation levels (1, 2, 3, 3+)", not "4 levels", to avoid collision with validation verbosity levels. (iteration 18)
- Publish "44 canonical commands in six groups" plus the authored runtime commands, never "43 in six groups plus two utilities". (iteration 18)
- Read the iteration files for Q3 and Q4; the synthesis has no body for either. (iteration 19)
- Treat `research.md` as a claim surface: its §5B skill rows (15), §5D skill conclusion, §5B command row and §5 open-questions block are stale against iterations 15-18 and must not be copied. (iteration 19)
- Publish eight runtimes — Claude Code, Codex, Cursor, Devin, OpenCode, Pi, DeepSeek Harness (DSH), Mistral Vibe — and do not list Hermes. Reuse the `README.md:184` / `INSTALL-SKILLED.md:57` sentence and retire the six-name line at `README.md:16`. (iteration 20)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Continuity ladder: the packet is new (no handover.md, implementation-summary.md or spec.md before this run). Free-text recipe `rg --fixed-strings "root README rewrite" specs .skilled` returned exit 1, a clean no-hit.

Prior work the operator pointed at:
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/spec.md` — phase parent: fifty-plus DeepSeek-driven iterations over v4.0.0.0 -> v4.0.2.0, five scope clusters.
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/research/research.md` (199 lines) — ranked synthesis of that release line: verified P0/P1 findings, over-engineering cut list, extension ideas, remediation phases 006-024.
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/024-root-release-docs-alignment/` — aligned PUBLIC-RELEASE.md, CONTRIBUTING.md and SECURITY.md with the tree (singular .opencode layout, manual symlinks, v4.0.0.1 release and stale counts were wrong). README.md was not in its scope.

### Bounded Context Snapshot
- Source pointers: `README.md` (1,773 lines), git tags `v4.0.0.0`, `v4.0.0.14`-`v4.0.0.16`, `v4.0.1.0`, `v4.0.2.0`, `v4.0.2.1`; 37 commits on main after `v4.0.2.1` at init (HEAD `ee7a2087ade`, a merge of worktree 411 hook-library cleanup).
- Runtime folders to inventory: `.claude/`, `.codex/`, `.opencode/`, `.pi/`, `.devin/`, `.dsh/`, `.vibe/`, `.cursor/`, `.skilled/` (skills, commands, agents, hook cores).
- Reuse candidates: per-skill `README.md` files under `.skilled/skills/*/`, skill `mode-registry.json` files, changelog folders.
- Constraints: research is read-only on every path outside `research/`; resource-map.md not present at init, so no coverage gate.

resource-map.md not present; skipping coverage gate

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-devin, model deepseek-v4-1-flash-max, timeout 900 s, workspace-write (devin --permission-mode dangerous, operator-approved for this run)
- Current generation: 1
- Started: 2026-11-16T07:59:25.000Z
