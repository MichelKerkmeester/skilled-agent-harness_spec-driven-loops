# Review B: Component Entries and the v4.0.0.2 Release Additions

Read-only review of seven new component changelog entries and the lines added to `.skilled/changelog/skilled/v4.0.0.2.md`, checked against the packet 030 commits, the phase implementation summaries, the current source and the sk-create-changelog contract (`SKILL.md` and `references/version-bump-rules.md`, plus `assets/changelog-template.md` where SKILL.md defers to it).

Paths in the table are short forms:

- `ssk` = `.skilled/skills/system-spec-kit`
- `sdl` = `.skilled/skills/system-deep-loop`
- `ceo` = `.skilled/skills/cli-external-orchestration`
- `ssa` = `.skilled/skills/system-skill-advisor`
- `sco` = `.skilled/skills/sk-code/sk-code-opencode`
- `deep/` = `.skilled/commands/deep/assets`
- `rel` = `.skilled/changelog/skilled/v4.0.0.2.md`
- `p030` = `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement`

Line numbers for `rel` are line numbers in the working-tree file.

---

## Findings

| ID | file:line | Claim quoted | Verdict | Evidence | Proposed replacement |
|----|-----------|--------------|---------|----------|----------------------|
| B01 | `ssk/changelog/v4.1.4.0.md:26` | "The hook READMEs and the feature catalog cover the prompt check, the status line on a turn without a suggestion and the runtime label. They no longer promise a hook that never starts the advisor daemon." | WRONG | 6b0a01f72b rewrote `cli-runtime-warm-only-fallbacks.md` but left `ssk/feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md:28` saying "Hook and plugin integrations use `--warm-only` so no prompt-time cold spawn occurs". The hook passes `--no-warm-only` at `ssa/hooks/lib/skill-advisor-cli-fallback.ts:246`. The hook READMEs hold no prompt-check or status-line text (grep over `ssk/runtime/hooks/*/README.md` returns nothing). They carry the runtime label (`codex/README.md:20`, `cursor/README.md:48`, `devin/README.md:37`) | **The hook docs describe the advisor path as it runs.** The hook READMEs name each adapter's runtime label and the shim's budget cap. Two feature catalog entries cover the prompt check and the status line on a turn without a suggestion, and the hook fallback entry no longer promises a hook that never starts the advisor daemon. |
| B02 | `ssk/changelog/v4.1.4.0.md:23` | "a value that is unset or not a positive whole number counts as 2,200" | IMPRECISE | 9ccb4dd416. `ssk/runtime/hooks/claude/user-prompt-submit.ts:107-111` uses `Number.parseInt`, so `1.5` counts as 1 and `300ms` counts as 300. The README row at `ssk/runtime/hooks/claude/README.md:21` says "does not parse to a positive integer" | An operator's `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is capped at 2,200, and a value that is unset or does not parse to a positive whole number counts as 2,200. |
| B03 | `ssk/changelog/v4.1.4.0.md:15` | "stopped the advisor at the same moment the advisor gave up on its own call" | IMPRECISE | bc111f2af5 message: "The Claude shim killed the advisor hook at 2,500 ms, the same budget the hook gave its own CLI call". `ssk/runtime/hooks/claude/user-prompt-submit.ts:22,118` kills the hook child. `ssa/hooks/claude/user-prompt-submit.ts:115,174` is the hook's own 2,500 ms budget for its advisor call | The hook shim that runs the skill advisor hook in Claude, Codex, Cursor and Devin stopped the hook at the same moment the hook gave up on its advisor call, so a slow advisor left the turn with nothing. |
| B04 | `ssk/changelog/v4.1.4.0.md:25` | "It now reads the number from the folder name" | IMPRECISE | 8036425eaa. `ssk/runtime/cli/spec/create.sh:1217-1231` computes `PHASE_START_INDEX` from the highest existing phase folder, and `create.sh:1489` sets `_phase_number=$((PHASE_START_INDEX + _i - 1))`. Nothing reads the new folder's name. The same number names the folder at `create.sh:1238-1246` | It now labels the phase with the number its folder carries, which continues after the parent's highest existing phase. |
| B05 | `ssk/changelog/v4.1.4.0.md:25` | "and the labels it had written wrong were corrected" | SCOPE | 8036425eaa message: "six in this packet and 18 in other packets". Every relabeled file is a `description.json` under `specs/` (for example `specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin/description.json`). None is under `ssk/`, so the repair is repository spec data, not a system-spec-kit change | Drop the clause, so the sentence reads: It now labels the phase with the number its folder carries. |
| B06 | `ssk/changelog/v4.1.4.0.md` (no line) | Not recorded: scenario 457 run and record steps | MISSING | cd0df4a38e rewrote `ssk/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:89` (run the Pi suite from `.skilled` through `hooks/vitest.config.ts`) and `:103` (record each result by hand, because the persistence wrapper is retired). Both change what an operator runs | **Scenario 457 runs as written.** It runs the Pi suite from `.skilled` through the hooks test config and has the operator record each result by hand, since the tool that saved results is retired. |
| B07 | `sdl/runtime/changelog/v1.5.1.0.md:22` | "research also matches a finding by its id" | IMPRECISE | 9ccb4dd416. Before it, `deep/deep-research-auto.yaml:2132` (at `9ccb4dd416^`) already keyed on `candidate.id`. `sdl/runtime/scripts/synthesis-closeout.cjs:201-202` adds `candidate.findingId`. `p030/010-review-advisories-and-codex-cleanup/implementation-summary.md` Key Decisions: "research keys a finding by `findingId` too" | Where the copies disagreed it keeps the stricter rule, so review now refuses a symlinked artifact and research also matches a finding by its `findingId` field. |
| B08 | `sdl/runtime/changelog/v1.5.1.0.md:23` | "**The ledger census reads the new script.** The census checks that every event the ledger schema declares has a real writer." | CONTRACT | 9ccb4dd416 adds the script at `sdl/runtime/scripts/check-ledger-stem-producers.cjs:61`. The census is a maintainer consistency check that no workflow user runs. `SKILL.md` §8 Omission Decision-Aid rule 2 drops "internal machinery names the user never touches". Judgment: the rule is the source, and the call on whether a runtime reader touches the census is mine | Delete this bullet, since the census is a maintainer check that no reader of the release acts on. |
| B09 | `sdl/deep-research/changelog/v1.15.1.0.md:24` | "which also matches a finding by its id" | IMPRECISE | Same as B07: 9ccb4dd416, `synthesis-closeout.cjs:201-202`, and research already matched on `id` before the change | Both research workflows call the deep-loop runtime's close-out script, which also matches a finding by its `findingId` field. |
| B10 | `ceo/cli-codex/changelog/v1.9.5.0.md:28` | "Run `node .skilled/bin/install-codex-hooks.mjs` once to remove the copies an earlier version wrote." | MISSING | f09c000537 made Codex's project `.codex/hooks.json` the only registration, and Codex loads it only for a trusted checkout: `ceo/cli-codex/references/hook-contract.md:44-47`, `ceo/cli-codex/README.md:241` ("trust the checkout in `~/.codex/config.toml`"), `ceo/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:47`. A checkout that is not trusted runs no repository hook once the copies are gone. The Upgrade omits the trust step | Run `node .skilled/bin/install-codex-hooks.mjs` once to remove the copies an earlier version wrote, and make sure `~/.codex/config.toml` marks the checkout as trusted, since Codex loads `.codex/hooks.json` only for a trusted checkout. |
| B11 | `ceo/cli-codex/changelog/v1.9.5.0.md:23` | "**The installer only removes.**" | CONTRACT | f09c000537 message: "nothing is added". `.skilled/bin/install-codex-hooks.mjs:324-378` has no add path. A script or person who ran the installer to register hooks now gets the reverse, and an untrusted checkout loses its hooks (B10). `SKILL.md` §8 Structure rule 8 requires an inline `**Breaking:**` marker, and `SKILL.md` §5 fact 7 sends any breaking change to the expanded format. Judgment: whether this counts as breaking is mine. It also bears on the bump, and the installer has no component of its own (B12) | **Breaking:** the installer no longer adds this repository's hooks to `~/.codex/hooks.json`, so a checkout Codex does not trust runs none of them until `~/.codex/config.toml` marks it trusted. |
| B12 | `ceo/cli-codex/changelog/v1.9.5.0.md:15,23` | "the copies `install-codex-hooks.mjs` wrote" and "`.skilled/bin/install-codex-hooks.mjs` takes this repository's entries out of `~/.codex/hooks.json`" | SCOPE | f09c000537 changed `.skilled/bin/install-codex-hooks.mjs`, which sits outside `ceo/cli-codex/`. No `.skilled/changelog/` component owns `.skilled/bin` (`ls .skilled/changelog/`). cli-codex's own changes are its README, `references/hook-contract.md` and scenario CX-016. `014-changelog-alignment/spec.md` §3 treats the parallel case, pi-cache-optimizer with no component, as release notes only. Judgment: cli-codex documents the installer at `hook-contract.md:106`, so this is the nearest home. The operator decides whether that is enough | **The docs describe a removal-only installer.** The hook contract says `.skilled/bin/install-codex-hooks.mjs` takes this repository's entries out of `~/.codex/hooks.json`, backs the file up first and keeps every third-party entry. |
| B13 | `ceo/changelog/v1.7.1.0.md` (no line) | Not recorded: the scenario's adapter count | MISSING | cd0df4a38e changed `ceo/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:25,47` from eight adapters to seven, because the code-graph freshness adapter was deregistered, and repointed its spec packet path. The scenario's preconditions and smoke step changed with it | **The scenario tests the seven adapters that remain.** The code-graph freshness adapter left with the code graph, so the scenario no longer expects it. |
| B14 | `sco/changelog/v1.0.1.0.md:20` | "`SKILL.md`, the README, the scripts README, the alignment verification reference, the verification scenario and the wrapper's own header all say two guards." | CONTRACT | 8036425eaa touched those six files. `SKILL.md` §8 Omission Decision-Aid rule 2 drops file-by-file inventories, and `SKILL.md` §9 check 12 enforces it | **The docs count the guards the wrapper runs.** Every page that describes the drift gate now says two guards, and so does the wrapper's own header. |
| B15 | `sco/changelog/v1.0.1.0.md` (no line) | Not recorded: nothing checks router equality now | MISSING | 8036425eaa rewrote `sco/references/shared/alignment-verification-automation.md:58-61,122-126` to say the equality suite "was deleted" and "nothing checks RESOURCE_MAP equality now". The old text named a live guard. Template §3 Keep list: "Honest corrections of a claim a previous release got wrong" | **The docs say nothing checks router equality now.** The alignment reference used to name a guard that compared the routing map with its files, and it now says that guard was deleted and nothing replaced it. |
| B16 | `rel:11` | `- "skill advisor prompt hook"` | CONTRACT | `SKILL.md` §5 Frontmatter Contract: "The identity phrases first, then one or two topic phrases". The added phrase makes five topic phrases (`rel:7-11`). Four were already there. Also noted, not counted: the untouched `rel:7` phrase `v4.0.0.2 goal changes` carries a version number, which the same rule forbids | Keep two topic phrases after the identity pair, for example `leaner goals` and `skill advisor prompt hook`. |
| B17 | `rel:144` | "Pi, which runs the hook in its own process, races the call against the same budget and falls back the same way." | WRONG | bc111f2af5 and a6ef03bae7. `ssa/hooks/pi/prompt-advisor.ts:12-22` sets Pi's budget to the operator value uncapped, or 2,500 ms by default, and `:263-276` races the call against that budget plus a 300 ms margin. The shim's 2,200 ms figure and its cap (`ssk/runtime/hooks/claude/user-prompt-submit.ts:106-111`) do not apply to Pi | Pi runs the hook inside its own process and races the call against the hook's own budget plus 300 ms, then falls back to the directives block. |
| B18 | `rel:156` | "a repeat in the same session shrinks to that line" | IMPRECISE | e18d6073b8 message: "reduces a repeat in a known session to that line ... Unknown sessions, the kill switch and thrown errors still get the whole text". Also `ssk/feature-catalog/ux-hooks/directive-lifecycle-dedup.md:19` | The fallback now opens with one line that names the case, and a repeat in a session the hook already knows shrinks to that line. |
| B19 | `rel:160-167` | "#### What Five CLIs Found" / "every defect those runs found is fixed" over the bullets "**Long prompts get a route.**" and "**Prompts stay out of the process list.**" | WRONG | The five-CLI runs (phase 8, fixed by cd0df4a38e) found the lease, plugin and sandbox defects. The prompt-in-argv defect is review finding R2-P2-001 (`p030/006-fanout-deep-review/review/review-report.md:88`). The long-prompt defect is sibling N5, with N7, found while verifying phase 10 fixes (`p030/010-review-advisories-and-codex-cleanup/spec.md:83-84`). Both are fixed by 9ccb4dd416 | Heading: What Five CLIs and a Review Found. Opening: The advisor's own test scenarios ran inside Pi, OpenCode, Devin, Cursor and Codex, and a two-model review with its follow-up checks found more. Every defect below is fixed. |
| B20 | `rel:48` | "Runs in Pi, OpenCode, Devin, Cursor and Codex found the rest, and each defect is fixed." | IMPRECISE | Same evidence as B19. Two of the fixed defects came from the review and its follow-up, not from the CLI runs | Runs in Pi, OpenCode, Devin, Cursor and Codex and a two-model review found the rest, and each defect is fixed. |
| B21 | `rel:180-184` | Paragraph at `rel:184` ("`--stop-policy=max-iterations` now keeps review confirm ...") sits under "#### Fan-Out Runs Close as Complete" | CONTRACT | `SKILL.md` §8 Structure rule 3: short benefit-led H4 per item. Rule 6: `&nbsp;` between H4 items. The stop-policy, quality-guard and shared-script changes (9ccb4dd416) are separate items from the fan-out close fix (ed22403e09, a8e92f05ca), and the heading names only the fan-out fix | Put `&nbsp;` and a new H4 before `rel:184` that reads: Runs Stop Where You Asked. |
| B22 | `rel:192` (no line for the omission) | Not recorded: the model is now told to count the final empty line | MISSING | 852e7cb6c2 changed the `line_count` description (`.pi/extensions/pi-cache-optimizer/index.ts:7957-7958`) and added a prompt guideline (`index.ts:8451-8452`) and a README line (`.pi/extensions/pi-cache-optimizer/README.md:131`). Together they tell the model to count the final empty line, which prevents the refusal the section describes | The `line_count` description and the edit guidance now tell the model to count that final empty line, as Pi's own read notices do. |
| B23 | `rel:204` | "Run `node .skilled/bin/install-codex-hooks.mjs` once to remove the repository hooks an earlier installer copied into `~/.codex/hooks.json`." | MISSING | Same as B10: f09c000537, `ceo/cli-codex/references/hook-contract.md:44-47`, `ceo/cli-codex/README.md:241` | **Codex hook copies.** Run `node .skilled/bin/install-codex-hooks.mjs` once to remove the repository hooks an earlier installer copied into `~/.codex/hooks.json`, and make sure `~/.codex/config.toml` marks the checkout as trusted, since Codex then loads its hooks from `.codex/hooks.json`. |

---

## Claims Checked and Confirmed

### 1. system-spec-kit v4.1.4.0

- The title form `system-spec-kit v4.1.4.0, <editorial title>` matches the H1 `# v4.1.4.0, ...`, as in sibling `ssk/changelog/v4.1.3.0.md`. Contract: `SKILL.md` §5 Frontmatter Contract.
- The description is 191 characters and two clauses in one sentence, inside the 250 cap.
- Trigger phrases: the identity pair comes first, then two topic phrases of 3 to 4 words with no version number.
- Compact format fits: five non-breaking changes. The summary is 3 sentences, the glance list is 5 one-line bullets and there are 13 non-blank body lines. No H3.
- Version v4.1.3.0 to v4.1.4.0 is a patch bump, and `ssk/SKILL.md` reads `version: 4.1.4.0`.
- The shim runs the advisor hook for Codex, Cursor and Devin: `ssk/runtime/hooks/codex/shared.ts:103-110` spawns `../claude/user-prompt-submit.js`, and each adapter calls it (`codex/user-prompt-submit.ts:19`, `cursor/user-prompt-submit.ts:50`, `devin/user-prompt-submit.ts:19`).
- The shim still kills at 2,500 ms and gives the hook 2,200 ms: `ssk/runtime/hooks/claude/user-prompt-submit.ts:22,24,106,118` (bc111f2af5, 9ccb4dd416).
- The operator value is capped at 2,200: `user-prompt-submit.ts:108-111` (9ccb4dd416).
- The Codex, Cursor and Devin adapters set `SPECKIT_RUNTIME`: `codex/shared.ts:109`, `cursor/shared.ts:153`, `devin/shared.ts:118` (bc111f2af5).
- An appended phase used to come out as Phase 1: 8036425eaa diff replaces `Phase ${_i}` with `Phase ${_phase_number}`.
- The hook docs dropped the warm-only promise in the fallback catalog entry: 6b0a01f72b, `ssk/feature-catalog/feature-catalog.md:78`. B01 covers the leaf that still makes it.
- Scenario 433 used to send `hello`, which the gate declines: 6b0a01f72b diff of `cli-hook-transport-down-fail-open.md`.
- Scenario 433 now sends a routable prompt, `cli-hook-transport-down-fail-open.md:51` (6b0a01f72b). It sandboxes its advisor at `:45` (cd0df4a38e) and tears down without a signal at `:16` (06272727c3).
- Upgrade: a value above 2,200 counts as 2,200 and lower values behave as before (`user-prompt-submit.ts:110`).
- Scope: every claim sits under `ssk/` except B05.

### 2. deep-loop runtime v1.5.1.0

- The identity phrase `deep-loop-runtime` matches the contract's name for the runtime, which has no `SKILL.md`. The description is 164 characters. There are two topic phrases. "grok 4.7" names a model version, not a release version, so the phrase is accepted.
- The compact shape is right: 3 bullets, a 2-sentence summary and 10 non-blank body lines. v1.5.0.1 to v1.5.1.0 is a patch bump.
- One close-out script replaces four inline copies: 9ccb4dd416 message ("one script replaces the four synthesis close-outs"). The file is `sdl/runtime/scripts/synthesis-closeout.cjs`, 454 lines, and all four workflows call it (`deep/deep-review-auto.yaml:2263`, `deep-review-confirm.yaml:1749`, `deep-research-auto.yaml:2046`, `deep-research-confirm.yaml:1519`).
- Review now refuses a symlinked artifact: `synthesis-closeout.cjs:114-120`. The pre-change review `hasFile` had no symlink check (`git show 9ccb4dd416^:.skilled/commands/deep/assets/deep-review-auto.yaml`).
- "keeps the stricter rule" matches the phase 10 implementation summary, Key Decisions.
- The census scans the new script: `check-ledger-stem-producers.cjs:61`, and the stems now name it as producer in `deep-research-ledger-types.ts` (9ccb4dd416). Accurate, though B08 questions keeping it.
- Eight Grok 4.7 ids, low through xhigh, each with a `-fast` sibling: `sdl/runtime/lib/deep-loop/executor-config.ts:382-389` and `sdl/runtime/scripts/fanout-run.cjs:2284-2291` (ac156a7112).
- "Each was confirmed by a live dispatch first" comes from the ac156a7112 message.
- Scope: `executor-config.ts`, `fanout-run.cjs` and the close-out script are all runtime files.

### 3. deep-review v1.11.1.0

- The name `deep-review` matches `sdl/deep-review/SKILL.md`. The description is 161 characters, with two topic phrases.
- The compact shape is right: 5 bullets, a 2-sentence summary. v1.11.0.36 to v1.11.1.0 is a patch bump, and `SKILL.md` reads `1.11.1.0`.
- The root dashboard was required on every run, so fan-out reviews logged `synthesis_incomplete`: a8e92f05ca message.
- It is now required only without lineage logs, and a single review without one still fails: a8e92f05ca message, `synthesis-closeout.cjs:311-315`.
- Review folds lineage state logs into its totals: `synthesis-closeout.cjs:293-297`, and the phase 10 summary says "so a fan-out review reports its real iteration count".
- `--stop-policy=max-iterations` holds in review confirm: `deep/deep-review-confirm.yaml:629,651` (9ccb4dd416). Review auto already had the rule (2 matches at `9ccb4dd416^`), so naming only confirm is correct.
- Both review workflows call the shared script, which refuses a symlinked artifact: see entry 2.
- The completion rule in `SKILL.md` says a fan-out run keeps its dashboards per lineage: `sdl/deep-review/SKILL.md:427` (6b0a01f72b).
- Scope: the command YAMLs under `.skilled/commands/deep/` belong to deep-review under `SKILL.md` §6 rule 4.

### 4. deep-research v1.15.1.0

- The name `deep-research` matches its `SKILL.md`. The description is 160 characters, with two topic phrases. v1.15.0.0 to v1.15.1.0 is a patch bump.
- The fan-out close and the single-run failure: ed22403e09 message and diff (`deep-research-auto.yaml` and `deep-research-confirm.yaml`, `lineageLogs.length > 0 ? [] : ...`).
- Both workflows now honor the stop policy as their own step: `deep/deep-research-auto.yaml:695` and `deep-research-confirm.yaml:643`, both step `3a` (9ccb4dd416).
- Confirm lost its quality guards in an earlier parity edit, and they are back: phase 10 summary ("Research confirm had lost the quality-guard body of its step 9 in an earlier parity edit. It is back").
- A test holds each confirm workflow to its auto twin: `sdl/runtime/tests/unit/stop-policy-yaml-parity.vitest.ts:70-76` (9ccb4dd416).
- Scope: correct. Only B09 is imprecise.

### 5. cli-codex v1.9.5.0

- The title and H1 carry the editorial title in contract form. The description is 150 characters, with two topic phrases. v1.9.4.0 to v1.9.5.0 is a patch bump, and `SKILL.md` reads `1.9.5.0`.
- Codex loads a trusted checkout's `.codex/hooks.json`, the installer copied repository hooks into `~/.codex/hooks.json`, each event ran twice, and the copies ran in sessions started anywhere: f09c000537 message and phase 9 implementation summary.
- The installer removes repository entries and orphans whose script is gone, and keeps third-party entries: `.skilled/bin/install-codex-hooks.mjs:119-136` (f09c000537).
- It backs up before a change: `install-codex-hooks.mjs:365-373`.
- `--check` reports `duplicate=N`: `install-codex-hooks.mjs:197-224`.
- `--check` prints `install-codex-hooks: OK` followed by the target path: `install-codex-hooks.mjs:339`.
- The README, hook contract and full-auto scenario now point to the checkout's `.codex/hooks.json`: f09c000537 diff of `ceo/cli-codex/README.md`, `references/hook-contract.md` and `manual-testing-playbook/session-continuity/full-auto-hooks.md`.

### 6. cli-external-orchestration v1.7.1.0

- The name matches the hub `SKILL.md`. The entry lives in the hub's own `changelog/`, which `.skilled/changelog/cli-external-orchestration/parent` links to. The description is 168 characters, with one topic phrase. v1.7.0.0 to v1.7.1.0 is a patch bump.
- The live step runs from the checkout: `codex-hook-parity.md:90-94` (f09c000537, `codex exec -C "$PWD"`).
- The checkout must be trusted in `~/.codex/config.toml`: precondition at `codex-hook-parity.md:47`.
- The installer step checks removal with a dry run, a real run, a re-run with no change and `--check` printing OK: `codex-hook-parity.md:99` onward (f09c000537).
- Scope: the scenario sits under the hub, outside any member packet, so the hub's parent changelog is the right home (`SKILL.md` §6 rule 7).

### 7. sk-code-opencode v1.0.1.0

- The name matches its `SKILL.md`. The description is 115 characters, with one topic phrase. v1.0.0.5 to v1.0.1.0 is a patch bump.
- The docs promised three guards while the wrapper runs two: 8036425eaa diff. `sco/scripts/README.md:32` now expects `all 2 guards PASSED`, and `sco/scripts/run-all-drift-guards.sh:60` prints it.
- The router-sync suite is retired: `run-all-drift-guards.sh:6-12`.
- A note after the guard calls records what it checked: `run-all-drift-guards.sh:50-53`. It predates this release (blame b45ea54cea, 2026-09-11). The sentence states a fact and does not claim the note is new, so it is accepted.

### 8. v4.0.0.2 added lines

- The description is 211 characters and two sentences. The identity pair `v4.0.0.2 release notes` and `skilled v4.0.0.2` now comes first (`rel:5-6`), which fixes the old order.
- The glance list has 12 bullets, exactly the cap. The Why section has 3 paragraphs, and the added one has 3 sentences.
- There are five topical H2 sections, inside the one-to-five range.
- H4 headings are 4 to 6 words. `&nbsp;` separates H4 items (`rel:146,152,158,170`), `---` separates H2 sections (`rel:176,186,194`) and there is no H3.
- The added lines have no semicolons, em dashes or Oxford commas.
- "A slow advisor left four runtimes with nothing" (`rel:33`): the bc111f2af5 message names Claude, Codex, Cursor and Devin.
- The hook paid for routing work nobody read, and skipping it saves a median 65 ms (`rel:33,150`): 3a33a5ea47 message and `p030/003-hook-path-cli-spawn-trim/implementation-summary.md:31,126`.
- The hook now sends `includeCompiledRoute: false`: `ssa/hooks/lib/skill-advisor-cli-fallback.ts:221`.
- `/help` and short acknowledgements never reach the advisor (`rel:150`): 3a33a5ea47 message.
- The shim claims at `rel:144` for Claude, Codex, Cursor and Devin match entry 1, and B17 covers the Pi sentence.
- The fallback head names the case, and OpenCode mirrors it (`rel:156`): e18d6073b8 message.
- A second launcher deleted the live lease (`rel:164`): phase 9 summary on F21 and the cd0df4a38e message.
- OpenCode refused the plugin over its extra exports (`rel:165`): cd0df4a38e message and phase 9 summary on F10.
- The 64 KiB versus 10,000-character limit (`rel:166`): 9ccb4dd416 message and `p030/010.../spec.md:83`. The fact is right, and B19 covers where it is filed.
- Prompts travel over stdin (`rel:167`): 9ccb4dd416 message ("No advisor caller puts a prompt in argv") and `ssa/runtime/skill-advisor-cli.ts` `--json -`.
- A sandboxed advisor keeps its state files (`rel:168`): cd0df4a38e message and phase 9 summary on F3 and F17.
- Codex runs each hook once (`rel:174`): see entry 5.
- The Deep Loops facts (`rel:182,184`) match entries 2 to 4.
- Pi's `edit_lines` refusal (`rel:192`): 852e7cb6c2 and `.pi/extensions/pi-cache-optimizer/index.ts:8163-8170`.
- A non-empty `line_hashes` list must cover the range: 9ccb4dd416 and `index.ts:7987,8191-8200`.
- Upgrade `rel:205`: see entry 1.
- Upgrade `rel:206`: the retry is at `ssa/runtime/skill-advisor-cli.ts:1444-1452` and the restart advice at `p030/003.../implementation-summary.md:136`.
- Upgrade `rel:207`: `ssa/changelog/` now lists `v0.1.0.0.md` through `v0.12.0.0.md`, and the working tree shows `v0.5.0.md` renamed to `v0.5.0.0.md`.

### Validators run

Both scripts ran on all eight files:

- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` printed `VALID ... Total issues: 0` for each file.
- `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>` printed `hard blockers: 0` for each file.

The exit status I captured belonged to the `tail` in the pipeline, not to the validator, so the evidence is the printed text. Neither script checks topic-phrase count, attribution or source accuracy. Every finding above sits in that gap.

### Observations outside the question scope, not counted

- `ssk/feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md:28` and its description (`:3`) still describe the hook as warm-only. This is a source doc defect behind B01, and fixing it is outside this phase's write scope.
- Two advisor changes appear in the phase 10 summary but not in the release's Skill Advisor section: `advisor_validate` now accepts all seven runtimes, and advisor logs are now private (`0o700` for the directory, `0o600` for each log). The advisor is outside the seven components Q4 names, so this is left to review A.

---

WRONG: 3 · UNSUPPORTED: 0 · IMPRECISE: 7 · CONTRACT: 5 · SCOPE: 2 · MISSING: 6 (23 findings)
