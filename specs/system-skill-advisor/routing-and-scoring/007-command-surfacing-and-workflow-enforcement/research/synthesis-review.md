# Synthesis Review: Command Surfacing and Workflow Enforcement

Independent review of `research/research.md` against its three lineage syntheses and the repository, written 2026-11-12 by a fresh session with no part in the research. Every citation below was opened or the command was run in this worktree. Labels: **CONFIRMED** means I opened the line or ran the command. **WRONG** carries the correct fact. **UNVERIFIED** says what would confirm it. A sentence that starts with "Judgment:" is my reading, and it says what evidence would change it.

Short path names used below: `advisor/` is `.skilled/skills/system-skill-advisor/runtime/`, `bridges/` is `advisor/scripts/command-bridges/`, `routes` is `.skilled/commands/doctor/_routes.yaml`, `goldfish/` is `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/`.

---

## 1. VERDICT

- **What holds.** The four stacked gaps are real: the inventory counts, the missing command contract in the public schema, the doctor-only runnable map and a hook that is advisory and fails open. The 0.08 sort adjustment exists. Most eliminated alternatives stand.
- **What is wrong.** Three premises under the recommendations fail. Non-doctor command rows are not slash-only, and plain chat already surfaces two of them. The phrases R2 wants to generate exist for 19 of 45 commands and would not match either prompt the spec measured. The "start" default rests on commands running their own setup, and the repository already records a model-started `/deep:research` that skipped it.
- **What is missing.** The advisor can already resolve a hub skill to its mode in about 50 ms, and the mode registry already names the command, so 19 commands need a join and no new scoring. No recommendation covers runtimes that get no brief, the private untracked command, the 12 create commands Claude Code does not expose by name or what happens after a command is started.

---

## 2. CLAIM CHECK

### 2.1 Inventory (research.md sections 1 and 3)

| # | Claim | Status | Evidence |
|---|---|---|---|
| C1 | 45 command files: 13 create, 3 deep, 3 design, 17 doctor, 1 prompt, 7 speckit, 1 loose | CONFIRMED, with one addition | `Glob .skilled/commands/**/*.md` minus the doctor fixtures gives 45. The loose file is not tracked: `git ls-files .skilled/commands/local-skilled-alignment.md .skilled/commands/speckit .skilled/commands/prompt` lists the speckit and prompt files and nothing for the loose file. So the tracked set is 44 |
| C2 | 62 bridge rows over 43 command strings, from 19 metadata, 8 allow-list and 35 doctor routes. 40 active for TypeScript, 50 for Python | CONFIRMED | `bridges/command-bridges.generated.json:4-11`. My recount with `node -e` over `entries`: 62 rows, 43 unique strings, 22 TypeScript-off, 12 Python-off |
| C3 | Three hand-kept sources, activated by a fourth | CONFIRMED | `bridges/derive-command-bridges.cjs:663-668` merges the three. `:24` and `:404-438` read `scoring-compatibility.json` |
| C4 | The hooks use the TypeScript scorer | CONFIRMED, with a limit | `advisor/../hooks/skill-advisor-hook.md:38`: the CLI reaches the daemon and falls back to the Python scorer with a `degraded` result |
| C5 | Five shipped commands have no bridge under their own name | CONFIRMED | Recount output: `/local-skilled-alignment`, `/prompt:improve`, `/speckit:handoff`, `/speckit:save`, `/speckit:search` |
| C6 | Three bridge names have no command file | CONFIRMED | `bridges/allow-list.json:32`, `:39`, `:46`, `:53` |
| C7 | The 22 TypeScript-inactive rows cover every deep and design command, 11 of 13 create commands and four speckit commands | WRONG by one row | That list sums to 21. The 22nd is `command-prompt-improver` for `/prompt`. The number that matters is larger: 26 of 45 live commands have no TypeScript-active row under their own name. Only 19 do, the 17 doctor commands plus `/create:agent` and `/create:manual-testing-playbook` |
| C8 | Ten command strings carry more than one bridge id, all doctor routes | WRONG | Nine are doctor commands. The tenth is `/memory:save`, with ids `command-memory-save` and `memory:save` (`bridges/allow-list.json:38-50`) |

### 2.2 Scoring (sections 1 and 4)

| # | Claim | Status | Evidence |
|---|---|---|---|
| C9 | Non-doctor command projections carry slash strings as their only keywords, so plain prose has nothing to match | WRONG | True for one row, `command-spec-kit` (`advisor/lib/scorer/projection.ts:86`). The other four active non-doctor rows carry prose: `:101`, `:116`, `:131`, `:146`. Measured: `create a new agent for code review` returns `create:agent` 0.821 first. `save context` returns `memory:save` and `command-memory-save`. The 22 disabled rows have no keywords at all (`derive-command-bridges.cjs:485-490`) |
| C10 | `command-deep-research` is projected with `routingEnabled: false` | CONFIRMED | `projection.ts:1061-1062` |
| C11 | Shipped threshold is 0.8 | CONFIRMED | `advisor/lib/compat/contract.ts:10` |
| C12 | At threshold 0 the planning prompt's candidates are `sk-doc` 0.62, `sk-code` 0.59, `system-spec-kit` 0.59, no command | CONFIRMED | My run with `confidenceThreshold: 0`: 0.6202, 0.5923, 0.5887 |
| C13 | A command candidate loses 0.08 in the sort when the prompt has no slash. The pi lineage's denial is wrong | CONFIRMED | `advisor/lib/scorer/fusion.ts:1197-1198` |
| C14 | A typed `/deep:research` gives `system-deep-loop` 1.6 and `command-spec-kit` 0.45 | CONFIRMED | `advisor/lib/scorer/lanes/explicit.ts:97`. Measured outcome: `/deep:research how retrieval scoring works` is ambiguous, `system-deep-loop` 0.82/0.20 against `command-spec-kit` 0.82/0.12 |
| C15 | Only a read-only command lifts off the read-only floor, and the deriver sets the flag only for read-only doctor routes | CONFIRMED | `fusion.ts:686-691`, `derive-command-bridges.cjs:306-308`, `:508-510` |
| C16 | Prose reaches a non-doctor command id through hand-written phrase rows covering three commands | CONFIRMED | `explicit.ts:168-175` |
| C17 | The spec's two prompts return no recommendation | CONFIRMED | Both runs returned `recommendations: []`, exit 0 |

### 2.3 Output contract (section 5)

| # | Claim | Status | Evidence |
|---|---|---|---|
| C18 | The recommendation has no kind, runnable string or policy | CONFIRMED, with two omissions | `advisor/schemas/advisor-tool-schemas.ts:294-309`, a `.strict()` object. The scorer already carries `kind` internally (`advisor/lib/scorer/types.ts:47`, `:158`) and the handler drops it (`advisor/handlers/advisor-recommend.ts:306-350`). The public schema already has `workflowMode` and `compiledRoute` (`:307-308`), which the synthesis never uses |
| C19 | Two brief forms, "use X" and "ambiguous: X vs Y" | CONFIRMED | `advisor/lib/render.ts:544-546`, `:557-558` |
| C20 | A typed `/speckit:plan` renders as ambiguous `command-spec-kit` against `system-spec-kit` | CONFIRMED | My run of `/speckit:plan add a login page`: `command-spec-kit` 0.82/0.20, `system-spec-kit` 0.82/0.16, `ambiguous: true` |
| C21 | Cap is 80 tokens, 120 when ambiguous, four characters per token | CONFIRMED | `render.ts:97-100` |
| C22 | The `Also:` line is dropped when it does not fit | CONFIRMED | `render.ts:524-527` |
| C23 | The runnable line comes only from a generated doctor map | CONFIRMED | `render.ts:109-150`, `:219-224`, `:509-520` |

### 2.4 Run or ask (sections 6, 12 and 13)

| # | Claim | Status | Evidence |
|---|---|---|---|
| C24 | Only the doctor manifest declares risk. The 19 metadata entries and the rest declare nothing | WRONG as "only" | Every mode row in the three hub registries declares `toolSurface.mutatesWorkspace` (`.skilled/skills/sk-doc/mode-registry.json:34`, `:68`). My listing shows `true` for all 19 command-bearing modes. It is a coarse flag, but it is declared. The nine commands with nothing declared are the seven speckit commands, `/prompt:improve` and the loose file |
| C25 | Every command declares `Bash` | CONFIRMED | Frontmatter scan: 45 of 45. 33 also declare `Write` or `Edit` |
| C26 | `/doctor:install` is a read-only guide and `/doctor:env` mutates | CONFIRMED | `routes:604-610`, `:773-778`. The surfaced string for env is `/doctor:env list` (`:778`) while the class is set for the whole command |
| C27 | 25 commands accept `:auto` or `:confirm`, and an omitted suffix lands on a confirm or ask path | CONFIRMED for the count and two routers | Scan: 25. `.skilled/commands/speckit/plan.md:33` asks for the mode. `.skilled/commands/create/agent.md:49` binds an omitted mode to the confirm workflow. I opened two routers, not 25 |
| C28 | The opencode lineage asks before 27 commands | WRONG | Its table marks 11 commands Run and 34 Ask (`lineages/opencode-deepseek/research.md:169-213`). The Strict column in research.md section 12 also has 34 asks |
| C29 | The pi lineage asks before 15 | CONFIRMED | `lineages/pi-deepseek/research.md:183` |
| C30 | A started command still runs its own setup, asks for a mode, asks Gate 3 and stops for a yes | WRONG as a guarantee | `goldfish/001-research-egm-checks-and-chat-path-gaps/scratch/incident-chat-started-loop.md:11-23`: on 2026-11-11 a session invoked `deep:research`, read 420 of 2,539 lines of the workflow, then called the runner directly. "`phase_init` never ran at the packet level: no lock, no session classification, no spec check." research.md:199 names exactly this as the evidence that would change its judgment |

### 2.5 Invocation and chat reach (sections 7 and 8)

| # | Claim | Status | Evidence |
|---|---|---|---|
| C31 | Six runtimes mirror the command tree as a user-facing slash surface. Devin has none | CONFIRMED for the mirrors, UNVERIFIED for Codex as a slash surface | Counts: `.claude/commands` 45, `.cursor/commands` 46, `.codex/prompts` 45, `.pi/prompts` 46, `.dsh/prompts` 45, `.opencode/commands` linked. `.devin/SYNC.md:20`. Codex's public page says custom prompts load from `~/.codex/prompts`, are not shared through a repository and are deprecated (search summary of `developers.openai.com/codex/custom-prompts`, page not opened). Typing `/` in Codex in this checkout would confirm whether `.codex/prompts` lists |
| C32 | Seven brief adapters, the hook reference documents six and omits DSH | CONFIRMED | Six rows at `skill-advisor-hook.md:53-58`. DSH adapter at `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs`. The enum holds eight labels (`advisor/lib/advisor-runtime-values.ts:10-19`), and Copilot is excluded from registration (`.skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts:11-14`) |
| C33 | Claude Code lets the model start a command through the Skill tool | CONFIRMED, with a limit the synthesis missed | This session's Skill tool lists 33 of the 45 by name. It lists one entry `create`, carrying the `/create:skill` description, and no `create:agent`, `create:readme` or the other ten. I called `Skill(create:readme)` and got `Unknown skill: create:readme`. The incident record line 11 shows a real model-started `deep:research`. No command file sets `disable-model-invocation` (frontmatter keys are `description`, `argument-hint`, `allowed-tools`) |
| C34 | No runtime other than Claude Code is verified | Settled per runtime in section 2.7 | See below |
| C35 | A command file is a router over Markdown and YAML, so a model that reads files can follow it | CONFIRMED as a mechanism | Codex, Pi and DSH stubs do exactly this for the typed path: "Read that file in full and follow it exactly" (`.codex/SYNC.md:37-44`, `.pi/SYNC.md:80-83`, `.dsh/SYNC.md:32`). It is not proof the model keeps to the workflow, see C30 |
| C36 | The brief fires on every prompt | WRONG in three cases | The prompt gate declines short prompts (`skill-advisor-hook.md:37`). Cursor's event "does not fire under the tested CLI build" (`.cursor/SYNC.md:84`). A DSH fan-out leaf gets no brief (`.dsh/SYNC.md:47`). Any failure yields `{}` (`skill-advisor-hook.md:25`) |
| C37 | The only command sentence in `AGENTS.md` is the Gate 4 tie-break, at line 89 and not 90 | CONFIRMED | `AGENTS.md:89`. Line 90 is blank |
| C38 | The ruleset forbids hand-rolling a plan-named workflow and lacks a discovery step | CONFIRMED | `AGENTS.md:22-27` |
| C39 | The goldfish packet chose a runner refusal and rejected hook and doc wording for its case | CONFIRMED | `goldfish/001-research-egm-checks-and-chat-path-gaps/research/research.md:33-37`, `:50`, `:69` |
| C40 | All three lineages reached the three-layer mechanism independently | WRONG | The codex lineage never proposes a Gate 2 sentence. It says Gate 2 already supplies a CLI fallback and that "invoke" should be read as loading the workflow (`lineages/codex-luna/research.md:108`, `:127`). Two lineages proposed the sentence, and by research.md:11 those two are one lens |
| C41 | A dispatched child has stop-for-yes turned into record-and-continue | CONFIRMED | `AGENTS.md:84` |
| C42 | Whether the brief reaches a child session is unobserved | Now observed for Claude Code | This session runs with `AI_SESSION_CHILD=1` and received `Advisor: live; ambiguous: sk-code 0.94/0.16 vs system-spec-kit 0.95/0.16 pass.` from the prompt hook. The advisor has no child gate: a search for `AI_SESSION_CHILD` and `isChildSession` across `.skilled/skills/system-skill-advisor`, build output excluded, returns no match. The one child control is the DSH leaf marker (`.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:133`) |

### 2.6 Linkage, measurement, prior art (sections 9 to 11)

| # | Claim | Status | Evidence |
|---|---|---|---|
| C43 | Several routers never load the mode `SKILL.md`, for example `/create:skill` and `/create:agent` | CONFIRMED | `create/agent.md:1-72` names a presentation file and two YAML files only. `create/skill.md:71` is the only `SKILL.md` mention and it describes generated output |
| C44 | 27 of 45 command files reference no skill path | CONFIRMED within one | My scan: 28 files contain no `.skilled/skills/<name>` path and 38 contain no `SKILL.md` mention. The number depends on the pattern |
| C45 | `/create:skill-parent` names an owner mode with no directory of its own, a dangling owner | WRONG | The registry maps `sk-create-skill-parent` to packet `sk-create-skill` (`sk-doc/mode-registry.json:53-74`). All three choreography resources for the command exist on disk (my existence check printed no missing path) |
| C46 | Nine skills have no command front door | CONFIRMED under the lineage's definition | Five have no command of any kind: `cli-classifier`, `cli-external-orchestration`, `cli-orca`, `mcp-code-mode`, `mcp-tooling`. Four own doctor routes through a `skill_agent` tag: `sk-code`, `sk-git`, `system-skill-advisor`, `system-skilled-doctor` |
| C47 | The corpus has 195 rows and scores 158 of 195 at the 2026-10-11 baseline | CONFIRMED | `advisor/scripts/routing-accuracy/scorer-eval-baseline.json`: `full_corpus_top1` 158/195, `holdout_top1` 50/66, `ambiguity_top1` 20/24, `gold_none_false_fire` 5 |
| C48 | No row is keyed to a command group outside doctor and memory-save | CONFIRMED at bucket level | Six bucket names in `labeled-prompts.jsonl`, none a command group. `doctor-prompts.jsonl` holds 78 rows with `expected_top: command-doctor-*`, consumed by `advisor/tests/doctor-routing-slice.vitest.ts` |
| C49 | The ambiguity slice has no expected-ambiguous labels and the replay gate does not assert abstention | UNVERIFIED | I did not open `derive-ambiguity-slice.mjs:5-23` or `prompt-policy-gold-replay.vitest.ts:44-83`. Opening them confirms it |
| C50 | Doctor lead phrases over-trigger: "disable comment hygiene gate" leads with `/doctor:git hooks` | CONFIRMED | My run: `command-doctor-git-hooks` 0.8962 first, `sk-code` 0.8678 second |
| C51 | Claude Code merged commands into skills with a `disable-model-invocation` field. Codex deprecated custom prompts for skills | CONFIRMED from search summaries of the official pages | `code.claude.com/docs/en/skills` and `developers.openai.com/codex/custom-prompts`. I read the search summaries, not the pages |
| C52 | GitHub Copilot documents a context-dependent slash picker | UNVERIFIED | Not searched. Opening the cited Copilot page confirms it |
| C53 | The run's config carried two disagreeing stop-policy fields | UNVERIFIED | I did not open `lineages/codex-luna/deep-research-config.json:3-9` and `:96` |

### 2.7 Premises under the recommendations

| # | Premise | Status | Evidence |
|---|---|---|---|
| C54 | R1: the command tree plus each hub's `mode-registry.json` describes every command | WRONG | Only three registries carry a command (`sk-doc`, `sk-design`, `system-deep-loop`), covering 19. `system-spec-kit`, `sk-prompt` and `system-skilled-doctor` have no `mode-registry.json`. A deriver that fails "when a live command is in neither" fails on 26 commands on its first run |
| C55 | R2: every command has `userIntent.ownedSignals` to generate phrases from | WRONG | Only the 19 metadata entries have the field. The matcher needs the whole phrase, contiguous, on word boundaries (`explicit.ts:242-263`). `/deep:research` owns "investigate a topic iteratively", "run a research convergence loop" and "gather deep technical findings" (`.skilled/skills/system-deep-loop/command-metadata.json:9-13`). None occurs in "research how our retrieval scoring works in depth". `/speckit:plan` has no metadata at all |
| C56 | R2: enabling each command's TypeScript row is the route to plain-chat reach | Contradicts a recorded design rule the synthesis cited without reading it that way | `sk-doc/mode-registry.json:12`: modes are "resolved by hub membership", a command-bridge mode is "never advisor-scored", and there are "No lexical/alias-fold modes (avoids the advisor-projection extension + CI drift-guard)" |
| C57 | The compiled route is not mentioned anywhere in the synthesis | Missing fact | `advisor_recommend` with `includeCompiledRoute: true` returns the resolved mode: `create a readme for the utils folder` gives `sk-doc` with `workflowMode: sk-create-readme`. `make a chart of monthly revenue by region` gives `sk-design-chart`. `run deep research on caching strategies` gives `research`. A direct call to `.skilled/bin/compiled-route.cjs` took 39 to 56 ms in seven runs. The hook turns it off (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:221`) |

### 2.8 Can a model start a slash command itself

| Runtime | Finding | Basis |
|---|---|---|
| Claude Code | Yes for 33 of 45 by name. No for 12 create commands. `/create:skill` is reachable as `create` | Observed in this session, live test above. Judgment on cause: `create/skill.md` collides with the `SKILL.md` convention on a case-insensitive disk, so the folder reads as one skill. Renaming the file in a scratch checkout and relisting would confirm it |
| OpenCode | No documented model path. A parent process can start one with `opencode run --command` | `.opencode/SYNC.md:66`. Search summary of `opencode.ai/docs/commands`: commands are user-triggered templates, while skills are loaded by the model through a skill tool |
| Codex | No. The mirror is a pointer stub that tells the model to read the command file | `.codex/SYNC.md:35-44`. There is no `.codex/skills` |
| Pi | No model path found. The mirror is a pointer stub | `.pi/SYNC.md:27`, `:80-83`. Public Pi docs not fetched, so UNVERIFIED beyond the repository |
| Cursor | No model path found, and the brief is dormant | `.cursor/SYNC.md:32`, `:84`. Public Cursor docs not fetched |
| Devin | No command surface at all. Skills are exposed | `.devin/SYNC.md:20` |
| DSH | No. "dsh has no agent-file loader and no command loader" | `.dsh/SYNC.md:49` |

The one instruction that works on all seven is "read the command document and follow it". It is also what the typed path already does on Codex, Pi and DSH.

---

## 3. THE FULL RECOMMENDATION SET

Order of entries: the ten merged recommendations, then recommendations a lineage made that the merge dropped or softened (L1 to L12). Gaps are in section 4. Priority words: must, should, could.

### R1. One generated inventory

- **Merged text.** Derive the inventory from the command tree plus each hub's `mode-registry.json`. Fail when a live command is in neither or a bridge names a missing spelling. Keep route-level targets beneath the command.
- **Verdict: AMEND. Priority: must.**
- **Change.** The command tree owns identity, meaning name and existence. Attributes live with the owner: `command-metadata.json` in the owning skill, and `routes` for doctor. Add `command-metadata.json` to `system-spec-kit` (seven commands) and `sk-prompt` (one). In `bridges/derive-command-bridges.cjs`, read the tracked files under `.skilled/commands/*/` and fail when a tracked command has no metadata entry or doctor route, and when an entry names a command with no file. Use the registry `command` field only as a cross-check. Keep one record per doctor route.
- **Evidence.** The tree is the only complete source and every mirror generator already reads it (`.codex/SYNC.md:29`, `.pi/SYNC.md:27`, `.dsh/SYNC.md:32`, `.claude/SYNC.md:26`, `.cursor/SYNC.md:32`). The deriver already reads any skill's metadata file (`derive-command-bridges.cjs:78-114`). The allow-list itself says the rows exist because "system-spec-kit owns the live planning command but has no command-metadata.json yet" (`bridges/allow-list.json:7`). C54 shows why registries cannot be the second source.
- **This settles the identity question.** The codex lineage held ownership open. Judgment: the tree owns identity because it is the only source where a missing row means the command does not exist. Would change it: a command that must exist without a file.
- **Depends on.** Nothing. First build phase after the baseline.
- **Proof.** `node bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`. Add a fixture command file with no metadata and the same check exits 1 naming it. Remove a command file and the check names the orphan entry.

### R2. Plain-chat reach

- **Merged text.** Keep the threshold. Generate plain-language phrases from `userIntent.ownedSignals`, enable every TypeScript row, keep the 0.08 adjustment as a tie-break and add a same-owner precedence rule.
- **Verdict: REPLACE the mechanism, keep the threshold. Priority: must.**
- **Change, part A: attach, for the 19 hub commands.** Keep the owner skill as the scored candidate. When a compiled hub resolves one mode (`action: route`, `selectionKind: single`) and that mode's registry row has a `command`, attach the command to the skill's recommendation. Files: `advisor/handlers/advisor-recommend.ts` (`enrichCompiledRoutes` and `publicRecommendation`), a small registry lookup the deriver can generate, and `hooks/lib/skill-advisor-cli-fallback.ts:221` so the hook asks for the route of the top passing hub. Leave the 17 hub rows disabled as scoring candidates.
- **Change, part B: phrases, for the 8 commands with no hub mode.** Author intent phrases in the new `system-spec-kit` and `sk-prompt` metadata files, written as words users type and checked against chat-style corpus rows. Project them onto one row per command. This replaces the umbrella `command-spec-kit` row and the two retired memory ids.
- **Evidence for A.** C57: the mode resolves today in about 50 ms. The owner skill already passes for plain prompts: `create a readme for the utils folder` gives `sk-doc` 0.94, `write a changelog entry for this release` gives `sk-doc` 0.89, `make a chart of monthly revenue by region` gives `sk-design` 0.82, `run deep research on caching strategies` gives `system-deep-loop` 0.88. Commands as candidates misbehave today: a typed `/speckit:plan` is ambiguous with its owner, `save context` spends two of three slots on two ids for one command, and `create:agent` at 0.82 sorts above `sk-code` at 0.95. C56: the sk-doc registry rules out advisor-scored modes.
- **Evidence for B.** `system-spec-kit` is not a compiled hub (its `compiledRoute` was null in my run) and has no registry, so its seven commands need their own rows. C55: generated `ownedSignals` cannot be the source.
- **Judgment.** Attach beats compete for hub commands. Would change it: a baseline showing owner-skill recall for chat prompts below command-row recall after phrases are added.
- **Depends on.** R1 and the R8 baseline.
- **Proof.** Against the captured baseline: `plan a new feature for the login page` returns `/speckit:plan`. `create a readme for the utils folder` returns `sk-doc` with command `/create:readme`. `full_corpus_top1` stays at or above 158/195, `holdout_top1` at or above 50/66 and `gold_none_false_fire` at or below 5. A typed `/speckit:plan` is no longer `ambiguous: true`.

### R3. Output contract and brief

- **Merged text.** Add `kind`, `command`, `policy` and `ownerSkillId`. Render `use <skill> → <command> (<policy>)` in the head for every family. Do not raise the cap.
- **Verdict: AMEND. Priority: must.**
- **Change.** In `advisor/schemas/advisor-tool-schemas.ts:294-309` add `command` (the runnable string with its route target), `policy` (`run`, `start` or `ask`), `ownerSkillId` (only on a row that is itself a command bridge) and `kind` (already present internally, copy it through at `advisor-recommend.ts:306-350`). Collapse rows that share one command into one entry before the top-K cut. In `advisor/lib/render.ts`, replace the doctor-only map at `:109-150` with a generated map for every command and put the command and policy in the required head, not the `Also:` line. Extend the deriver's `renderDoctorCommandStrings` (`derive-command-bridges.cjs:591-604`).
- **Evidence.** C18, C22, C23. The `Also:` line is dropped when over the cap (`render.ts:524-527`), so anything the model must act on belongs in the head, as the codex lineage said. Duplicate ids crowd the list today (`save context` run).
- **Depends on.** R1, R4.
- **Proof.** A schema test accepts the four fields and rejects an unknown fifth. Golden briefs, one per family, each at or under 320 characters before the directive block. `save context` returns one entry for `/speckit:save`. A daemon on the old build still answers: the CLI already retries once without a rejected option (`skill-advisor-hook.md:38`), and a test should pin that for the new fields.

### R4. Risk class and policy

- **Merged text.** Carry a risk class and write target in each command's metadata and derive `policy` from it. Strictness left open.
- **Verdict: AMEND. Priority: must.**
- **Change.** Reuse the doctor enum `mutating: read-only | add-only | mutates` and `gate3_location` (`routes:40-41`) in every `command-metadata.json` entry. Add one optional list, `ask_first`, with four allowed reasons: `settings`, `outside-repo`, `spend`, `relaunch`. The deriver computes `policy` and fails on an unknown reason or a missing class. Give `/doctor:env` per-action classes the way `/doctor:update` already has them (`routes:740-758`).
- **The rule, in two sentences.** Run a route outright when it declares `read-only`, or `add-only` with every write inside the bound spec folder. Ask one question first when the route changes settings or installs, touches anything outside tracked files, spawns executors or iterations or relaunches the session, and start every remaining route without `:auto` so its own setup, Gate 3 and checkpoints do the asking.
- **Mechanical form.** `ask_first` non-empty gives `ask`. A doctor route classed `mutates` gives `ask`. `read-only`, or `add-only` into the spec folder, gives `run`. Everything else gives `start`.
- **Evidence.** The repository already ships this split for a model-chosen command: `/doctor:helper` "runs a read-only pick under that command's own router and prints a writing pick as one line for the operator" (`routes:458`), and a default target is "never on a mutating route" (`routes:46-50`). A tracked-file edit is the top tier of the reversibility ladder, "Proceed" (`.skilled/repo-rules/blast-radius.md:63`), and "an install still waits for a yes" (`:64`). Gate 3 fires on every write whatever the command does (`AGENTS.md:73`), so a second question before it breaks the single-prompt rule in `AGENTS.md` section 2. An omitted mode lands on confirm or a mode question (C27).
- **How this settles the lineage split.** The strict line asks 34 times, mostly for writes the user's own sentence requested. The ladder line runs `/speckit:implement` with no question. The merged "start" is right for the middle band but wrong to lean on the command's setup alone (C30). The rule above keeps "start" only where an independent gate exists, and asks where none does.
- **Judgment.** The middle band is a preference, see section 7. Would change it: an R8 behaviour run where a started create or speckit command skips its setup, or an unsafe-start rate above zero.
- **Depends on.** R1.
- **Proof.** The deriver emits a policy for all 44 tracked commands and every doctor route. A table-driven test asserts the four mechanical rows. Changing a doctor route from `read-only` to `mutates` flips its policy to `ask` in the generated file.

### R5. Invocation per runtime

- **Merged text.** One command identity with a per-runtime adapter. Use a model-invocable command where the host has one. Elsewhere load the command document and follow it, or ask the user to type it. Derive the runtime list from the hook registrations.
- **Verdict: AMEND. Priority: must.**
- **Change.** Make "read the command document in full and follow it" the single instruction on every runtime. Treat Claude Code's Skill tool as an optional shortcut for the 33 names it lists. Never tell the model to type a slash command. Ask the user to type one only when the model cannot read the file. Document the per-runtime table from section 2.8 in `skill-advisor-hook.md` and add the DSH row.
- **Evidence.** Section 2.8. The typed path on Codex, Pi and DSH is already this instruction (C35). The Skill tool misses 12 create commands (C33).
- **Depends on.** R3.
- **Proof.** A behaviour run per runtime: a chat prompt that should reach `/create:readme` ends with `create-readme` workflow YAML read before the first write. On Claude Code the same holds for a create command the Skill tool does not list.

### R6. The Gate 2 sentence

- **Merged text.** Three layers: the brief carries command and policy, one sentence in Gate 2 binds the behaviour, the command file is the body.
- **Verdict: AMEND. Priority: must. Not sufficient alone.**
- **Change.** Add one bullet to Gate 2 in `AGENTS.md` after line 67. Proposed text, about 430 bytes:

  > - **Command in the brief.** A brief or CLI result that names a command names the workflow: read that command's document in full and follow it, never a hand-built substitute. `run` starts it now. `start` starts it without `:auto`, so its own setup asks. `ask` offers it in one question and waits. A typed command or explicit instruction outranks the policy. Output: `COMMAND: [/name] → [started|offered|declined]`

  Rewrite the Gate 4 tie-break at `AGENTS.md:89` in the same edit, because it names the `command-spec-kit` id that R2 retires.
- **Is the sentence enough? No, for five reasons.**
  1. Some sessions get no brief: Cursor, DSH leaves, short prompts and any hook failure (C36).
  2. For the prompts the spec measured, a brief does arrive and it says `Advisor: no skill matched.` (`render.ts:600-601`). Gate 2 then says "< 0.8 → general approach" (`AGENTS.md:67`). The merged clause "when no brief arrived, call the advisor" does not fire, and the CLI returns the same empty list. Recall is the binding constraint, so R2 must land first.
  3. A model that started the right command still left the workflow (C30). Prose bound to prose.
  4. The goldfish research declined to restate its trigger in `AGENTS.md` and took a script refusal, the only change that "blocks rather than advises" (`goldfish/synthesis.md:94`).
  5. The space is tight. The last anchored section must end inside a 16,384-byte prefix (`.skilled/commands/doctor/assets/agents-md-manifest.json:12-14`). Blast-Radius Management ends at byte 15,690 by my offset scan, so the headroom is 694 bytes. This number is derived, and `/doctor:agents-md check` is the real gate.
- **What makes it sufficient.** R2 for recall, L4 for runtimes with no brief, G1 for the skill-first path, G2 for adherence after start and the `COMMAND:` output token so a transcript can be scored.
- **Depends on.** R2, R3, R4.
- **Proof.** `/doctor:agents-md check` passes with the bullet in place. The R8 behaviour run reports the share of chat prompts that end with the command document read, per runtime, against the pre-change run.

### R7. Skill and command linkage

- **Merged text.** Link command-first. A skill recommendation implies a command only when the selected mode's registry row records one. Never invent a front door.
- **Verdict: KEEP, with one addition. Priority: should.**
- **Change.** As merged, and R2 part A is its implementation. Add: `ownerSkillId` for the eight non-hub commands comes from the new metadata files, which answers open question 2 in research.md for all but the private command.
- **Evidence.** Registry rows record the command "even on metadata-routed modes" (`sk-doc/mode-registry.json:13`). Two modes have `command: null` and must surface no command (`sk-create-frontmatter`, `sk-create-quality-control`, and `.skilled/skills/sk-doc/sk-create-quality-control/SKILL.md:13`).
- **Depends on.** R1.
- **Proof.** A prompt that routes to `sk-create-quality-control` returns `sk-doc` with no `command` field. A prompt where the hub defers (`update the docs` returned `action: defer`) returns no `command` field.

### R8. Measurement

- **Merged text.** A command-routing harness beside the calibration corpus, five row types per command, child variants, six metrics, thresholds from a captured baseline.
- **Verdict: AMEND. Priority: must, and first.**
- **Change.** Do not build a new harness. Generalise the doctor slice: one `command-prompts.jsonl` in `advisor/scripts/routing-accuracy/` with the `doctor-prompts.jsonl` shape (`id`, `prompt`, `expected_top`, `expected_second`) plus `expected_command` and `expected_policy`, scored by a sibling of `advisor/tests/doctor-routing-slice.vitest.ts`. Capture the baseline before any scorer change. Row types per command: typed slash, plain chat, near miss where the owner skill alone should win, missing argument, must-not-start. Add the opencode lineage's partial-slash and quoted-slash variants. Add a second layer the merge lacks: a behaviour run that reads transcripts for the `COMMAND:` token and for the workflow file being read.
- **Evidence.** The earlier doctor research rejected "a new accuracy harness from scratch" because "the corpus, capture script and baseline exist" (`specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:189`) and put measurement first (`:227`). A scorer metric cannot see C30, where the route was right and the workflow was abandoned.
- **Metrics.** Command recall at 1, command precision, false offer rate on gold-none rows, policy accuracy, skill and command agreement, and from transcripts the command-start rate and unsafe-start count.
- **Depends on.** Nothing for the baseline. R6 for the transcript token.
- **Proof.** The baseline file records per-command recall for all 44 tracked commands before the change, and the existing four numbers (158/195, 50/66, 20/24, false fire 5) are unchanged by adding the slice.

### R9. Mirror the platform pattern (opencode lineage, folded into prior art by the merge)

- **Lineage text.** Command metadata carries an invocation policy equivalent to `disable-model-invocation`, the command document is the body, the brief names command and policy. Host frontmatter cannot be the mechanism.
- **Verdict: KEEP as the rationale for R4. Priority: could, no separate build.**
- **Change.** None beyond R4. Do not add `disable-model-invocation` to the command files: `.claude/commands` holds per-file symlinks (`.claude/SYNC.md:26`), so the field would land in the canonical file, and it would also stop a model from starting an `ask` command after the user said yes.
- **Evidence.** C51. One runtime of seven reads the field.
- **Proof.** `rg -n "disable-model-invocation" .skilled/commands` returns nothing after the build.

### R10. Failure-mode controls

**R10a. Same-owner precedence. Verdict: REPLACE. Priority: must, built inside R3.** A ranking rule between a command and its owner is not needed once hub commands are attached (R2 part A) and rows sharing a command collapse (R3). For the eight non-hub commands, merge the command row and its owner skill into one brief line instead of ranking them. Evidence: C20 and the `/deep:research` run in C14. Proof: no typed command in the slice returns `ambiguous: true` against its own owner.

**R10b. Child authority. Verdict: AMEND. Priority: must.** The merged control, "a child may start read-only and add-only commands only, unless its parent's brief names the command", needs no new rule text. `AGENTS.md:84` already bars a child from acting outside its lineage directory, which covers settings and tracked writes elsewhere. What is missing is mechanical: the brief reaches a child on Claude Code (C42). Change: when `AI_SESSION_CHILD=1`, the hook renders `start` and `ask` commands as `(parent-named only)` and renders `run` only for `read-only`. Files: `advisor/lib/render.ts` and the hook handler. DSH already drops the brief for a leaf (`.dsh/SYNC.md:47`). Proof: a hook smoke test with the variable set shows the downgraded line. A child behaviour run records zero started `ask` commands.

**R10c. Route once per turn and command. Verdict: AMEND. Priority: could.** The risk is derived, not observed. Gate 2 already says "A skill already in context is not re-read" (`AGENTS.md:68`). Change: the `COMMAND:` token from R6 is emitted once per command per session, and a brief naming a command already started or declined is ignored. No counter subsystem, as the pi lineage argued. Proof: a transcript with two writes inside one started command shows one `COMMAND:` line.

**R10d. Keep lead phrases diagnostic. Verdict: KEEP. Priority: could.** Evidence: C50. Change: a deriver check that a `lead_phrases` entry contains a state or health word, plus a must-not-lead row for `disable comment hygiene gate` in the slice. Judgment: whether that prompt should lead with the doctor command is arguable, since the hook gate is what the user named. Would change it: the operator saying it should lead.

**R10e. Keep the loop's parent and leaf boundary. Verdict: KEEP. Priority: must, no change.** Evidence: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:84-90`. Proof: R10b's child run, since a leaf that starts `/deep:research` would break it.

### L1. Retire the allow-list rows and the three dead ids (pi and opencode lineages, softened to nothing in the merge)

- **Verdict: KEEP. Priority: should.**
- **Change.** Once the two new metadata files exist, delete all eight rows of `bridges/allow-list.json`, then the file. That removes `/spec_kit`, `/memory:save` and `/prompt`. The same change must update `explicit.ts:95-99` and `:174-175`, the Python table, `AGENTS.md:89` and any corpus row whose gold label is a retired id.
- **Evidence.** C6. Every allow-list reason says the row exists for want of a metadata file (`allow-list.json:7`, `:14`, `:21`, `:28`, `:42`).
- **Depends on.** R1, R2 part B, R6.
- **Proof.** `rg -n "command-spec-kit|memory:save|command-memory-save|command-prompt-improver" .skilled AGENTS.md` returns only changelog lines. The drift guard `advisor/tests/command-bridges-drift-guard.vitest.ts` passes.

### L2. One activation source (pi lineage: "one generated source, one activation list")

- **Verdict: AMEND. Priority: should.**
- **Change.** Stop hand-keeping activation for non-doctor commands in `bridges/scoring-compatibility.json`. A command with metadata is active by construction: attached through its hub, or scored through its own row. Keep the file only for the two per-platform fields that have no other home, `order` and the Python slash markers, and generate defaults for those.
- **Evidence.** A new doctor route needs "a hand-written entry in both the typescript and python lists" (`bridges/README.md:58`), and 22 rows are off simply because nobody wrote one (C2).
- **Depends on.** R1, R2.
- **Proof.** Adding a command with metadata and no compatibility entry yields an active command, and the deriver check stays fresh.

### L3. Drive the read-only flag from the class for every command (pi lineage, dropped)

- **Verdict: KEEP. Priority: should.**
- **Change.** `isReadOnlyRoute` (`derive-command-bridges.cjs:306-308`) reads the same `mutating` field for non-doctor rows, so `/speckit:search` can answer a list or show question.
- **Evidence.** C15. Only 15 rows carry the flag today and all are doctor.
- **Depends on.** R4.
- **Proof.** `show me which packets mention the token cap` returns `/speckit:search` with policy `run`, and a `mutates` command stays under the floor for the same wording.

### L4. Generated pointer block for runtimes with no brief (pi lineage, dropped)

- **Verdict: KEEP, raised to must.**
- **Change.** Extend the generator that already writes the Gate 1 pointer into `.cursor/rules/skill-routing.md:20-28` (`sync-gate1-pointers.cjs`) to write a second fenced block carrying Gate 2's direct advisor call and the new command sentence. Devin inherits Cursor's rules per the pi lineage, which I did not check.
- **Evidence.** Cursor's dynamic brief is dormant (`.cursor/SYNC.md:84`, and the rule file says so at `.cursor/rules/skill-routing.md:18`). The pi lineage's elimination row "depend on hook delivery for parity" was dropped from research.md section 14.
- **Depends on.** R6.
- **Proof.** The generator's `--check` exits 0. A Cursor behaviour run on a chat prompt shows the advisor CLI called before the first write.

### L5. A typed suffix or explicit instruction overrides the default (opencode lineage, dropped)

- **Verdict: KEEP. Priority: must, inside the R6 sentence.**
- **Evidence.** Gate 2 option C already honours explicit direction (`AGENTS.md:66`). Without the clause, a user who types `/doctor:git hooks` gets asked whether to run it.
- **Proof.** A typed command with policy `ask` produces `COMMAND: ... → started` and no offer.

### L6. Arguments and mode state in the route result (codex lineage finding 3, cut to four fields in the merge)

- **Verdict: REPLACE. Priority: should.**
- **Lineage text.** Give the model bound and missing arguments, command-specific mode and required approval.
- **Replacement.** The brief carries the runnable string including the route target and nothing else. Every other argument is resolved by the command's own setup. The CLI JSON adds the existing `argumentHint` for callers who want it.
- **Evidence.** Multi-target doctor routers refuse an inferred target: "Do not infer it from conversation history, open files, earlier runs or repository state" (`.skilled/commands/doctor/git.md:17`). So the target must come from the brief, which is why the runnable string includes it (`derive-command-bridges.cjs:204`). The mode is asked by the command (`plan.md:33`). Carrying argument state in an 80-token brief duplicates what the command owns.
- **Proof.** The brief for a git-hooks prompt shows `/doctor:git hooks`. A started `/speckit:plan` with no suffix asks the mode question.

### L7. Preserve enabled, disabled and unspecified states (codex lineage finding 2, dropped)

- **Verdict: AMEND. Priority: could.**
- **Change.** `scoringCommandBridges` treats a missing `routingEnabled` as enabled (`projection.ts:1239-1242`). The five hand-authored rows at `projection.ts:78-154` lack the field and duplicate generated rows. Delete the hand-authored array once L1 lands, and make the field required on the type.
- **Evidence.** The array's remaining consumers are a drift-guard test and the Python table (`rg HAND_AUTHORED_COMMAND_BRIDGES`: `advisor/tests/command-bridges-drift-guard.vitest.ts:17`, `advisor/scripts/skill_advisor.py:2296`).
- **Proof.** `tsc` fails on a projection row without `routingEnabled`.

### L8. Abstention and ambiguity gold labels (codex lineage findings 6 and 8, mentioned but not recommended in the merge)

- **Verdict: KEEP. Priority: should, inside R8.**
- **Change.** Add `expected_ambiguous` and gold-none rows to the command slice and assert abstention on them.
- **Evidence.** C49, which I did not verify. If it is false this entry shrinks to the gold-none rows for commands.
- **Proof.** The slice test fails when a must-not-start row returns a command.

### L9. Skill and command agreement, and slash variants (opencode lineage R8, dropped from the merged metric list)

- **Verdict: KEEP. Priority: should, inside R8.** Agreement is the right metric for R2 part A: the share of rows where the attached command belongs to the recommended skill. It should be 100 percent by construction, so any miss is a registry defect.

### L10. Runtime list from registrations, and document DSH (codex lineage finding 5, kept as a half sentence in merged R5)

- **Verdict: KEEP. Priority: should.**
- **Change.** Generate the adapter table in `skill-advisor-hook.md` from the hook registry, drop `copilot` from `advisor/lib/advisor-runtime-values.ts:12` or mark it retired, and add the DSH row.
- **Evidence.** C32.
- **Proof.** A test compares the enum, the registry and the documented table and fails on a difference.

### L11. One owner for the stop-policy field (codex lineage, open question 6 in the merge)

- **Verdict: KEEP as a finding, with a home. Priority: could.**
- **Change.** Out of this packet's scope. Record it against `system-deep-loop`: one stop-policy field in the config, or a regression case that pins which wins.
- **Evidence.** C53, not verified by me.
- **Proof.** A config holding both fields with different values fails validation or passes a pinned precedence test.

### L12. Brief line order: command, policy, consequence (opencode lineage R10)

- **Verdict: AMEND. Priority: could.**
- **Change.** Command and policy in the head. No consequence line. The policy word is the consequence note, and R6 defines the three words once.
- **Evidence.** The opencode lineage itself measured that a third line competes with the directive block inside 120 tokens.
- **Proof.** The golden briefs from R3.

---

## 4. GAPS

### G1. The skill-first chat path never reaches the command

- **Problem.** For hub commands the chat path that fires today is skill-first: the advisor says `use sk-doc`, Gate 2 says the skill must be invoked, the hub router picks the mode. Nothing then hands the mode to its command's workflow. I found no handoff rule in `sk-doc/ROUTER.md` or `sk-doc/SKILL.md` (a search for the registry-command pattern returned keyword lists and one per-mode note). The lineages dismissed skill pointers because "skills load after routing", but routing already succeeds for these prompts (R2 evidence).
- **Recommendation.** In the three hub routers, one rule: when the selected mode's registry row has a `command`, read that command's document and follow it under its policy. One mode packet already says this for itself: "The intended entry point is `/create:goal`" (`.skilled/skills/sk-doc/sk-create-goal/SKILL.md:140`), and `deep-research/SKILL.md:84` says the skill "is invoked exclusively through" its command.
- **Verdict on the eliminated alternative.** research.md section 14 eliminated skill pointers for discovery. That stands. As a handoff after discovery it is the cheapest link on every runtime that loads skills, Devin and Cursor included. **Priority: should.** It needs the operator decision D2 in section 7.
- **Depends on.** R4. Hub router edits fall under `.skilled/repo-rules/skill-hub-routing.md`.
- **Proof.** On a runtime with no brief, a chat prompt for a README ends with `create-readme` workflow YAML read before the first write.

### G2. Nothing checks that a started command is followed

- **Problem.** C30. The recorded hand-roll happened after the right command was loaded. The cause given is size: a 2,540-line workflow and no runner for the single-executor path, so the session "looked for a runner" (`incident-chat-started-loop.md:12`, `:27`).
- **Recommendation.** Two steps. First, measure: the R8 behaviour run on the three heaviest workflows records whether init ran. Second, only where a bypass script exists, add a refusal in that script in the shape of the shipped one-lineage refusal (`goldfish/synthesis.md:26`). Do not build an append-gateway gate or a new hook: the goldfish research rejected both with reasons (`goldfish/001-research-egm-checks-and-chat-path-gaps/research/research.md:36-37`). **Priority: should.**
- **Judgment.** A runner for the single-executor loop would remove the cause, and a 250-line driver already exists in that packet's scratch folder. The goldfish research ruled a runner out "for now". Would change it: the behaviour run showing skipped init on a second workflow.
- **Proof.** Behaviour run: zero started loops without a lock file and a completed init step.

### G3. A plain "build X" request has no front door

- **Problem.** The most common chat request is a write with no packet. The advisor recommends `sk-code`, `sk-doc` and `mcp-tooling` for it and not `system-spec-kit` (`goldfish/001-research-egm-checks-and-chat-path-gaps/scratch/trust-checks.md:17`). No recommendation says which command owns that turn.
- **Recommendation.** Bind it to Gate 3, not to the scorer. When Gate 3's answer is a new packet, the workflow that creates it is `/speckit:plan`, or `/speckit:complete` when the user asked to build. Put the sentence where it costs no prefix bytes: the spec-gate first-mutation notice and the `create.sh` next-steps block, both of which already carry a one-line pointer from the goldfish packet (`goldfish/synthesis.md:30`, `:95-97`). **Priority: should.**
- **Proof.** A hooked chat session that starts a write with no packet shows the notice naming the command, and the behaviour run shows the plan workflow read before `spec.md` is written.

### G4. The 45th command is private

- **Problem.** `.skilled/commands/local-skilled-alignment.md` is not tracked (C1). The deriver already excludes private skills: "A private skill is local to one checkout and must never reach a tracked bridge file" (`derive-command-bridges.cjs:81-83`). "Surface all 45" would write a private name into tracked files.
- **Recommendation.** The tracked inventory covers 44. The deriver skips untracked `local-*` command files the same way it skips `local-*` skills. **Priority: must.** Surfacing the private command through a gitignored overlay is decision D5.
- **Proof.** With the file present, `derive-command-bridges.cjs --check` is fresh and `rg -n "local-skilled-alignment" bridges/ advisor/lib` returns nothing.

### G5. Claude Code hides 12 create commands from the model

- **Problem.** C33. On Claude Code the Skill tool exposes one `create` entry and rejects `create:readme`.
- **Recommendation.** Confirm the cause in a scratch checkout, then fix it in the mirror generator, for example by not linking a file named `skill.md` directly inside a command folder. Until then R5's uniform instruction covers it. **Priority: should.**
- **Proof.** A fresh Claude Code session lists 13 `create:*` entries.

### G6. The degraded path has no command fields

- **Problem.** When the daemon is down the CLI falls back to the Python scorer (`skill-advisor-hook.md:38`), which matches doctor bridges "only on a typed slash command" (`bridges/README.md:60`) and has its own table.
- **Recommendation.** State the contract: on a degraded result the brief shows the skill only and never a command. Generate the Python table's `command` and `policy` from the same inventory so a typed command still resolves. **Priority: should.**
- **Proof.** With `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, a typed command returns its command and policy and a plain prompt returns a skill with no command.

### G7. Declared choreography that no router follows

- **Problem.** All 19 metadata entries declare a three-step load through two `SKILL.md` files. The routers do not perform it (C43).
- **Recommendation.** A test that every `choreography[].resource` is named by the command router or its workflow YAML. Where it fails, change the metadata to say what the router does. **Priority: could.**
- **Proof.** The test passes for all 19 entries.

---

## 5. PER-COMMAND TABLE

Rule applied: section 3, R4. `run` means start with no question. `start` means load the command without `:auto` and let its setup ask. `ask` means offer it in one question and wait. A typed command or explicit instruction overrides the column.

Basis words: **declared** means a manifest states the class today. **inferred** means no manifest states it and R4 must author it. For hub commands the declared fact is only `mutatesWorkspace: true` in the mode registry, and the write target is inferred from the argument hint.

| # | Command | Surface | Verdict by route | Basis |
|---|---|---|---|---|
| 1 | `/create:agent` | yes | start | declared `mutatesWorkspace: true`, target inferred |
| 2 | `/create:benchmark` | yes | start | same |
| 3 | `/create:changelog` | yes | start | same. Becomes ask if `--release` publishes anything, which I did not check |
| 4 | `/create:command` | yes | start | same |
| 5 | `/create:diff` | yes | start | same. A report at a named path |
| 6 | `/create:feature-catalog` | yes | start | same |
| 7 | `/create:goal` | yes | start | same |
| 8 | `/create:manual-testing-playbook` | yes | start | same |
| 9 | `/create:readme` | yes | start | same |
| 10 | `/create:repo-rule` | yes | start | same |
| 11 | `/create:skill` | yes | start | same, `sk-doc/mode-registry.json:19-40` |
| 12 | `/create:skill-parent` | yes | start | same, `:53-74` |
| 13 | `/create:with-human-voice` | yes | start | same. Edits a named file |
| 14 | `/deep:ai-council` | yes | ask | inferred `spend` |
| 15 | `/deep:research` | yes | ask | inferred `spend`. Executors and iterations |
| 16 | `/deep:review` | yes | ask | inferred `spend` |
| 17 | `/design:chart` | yes | start | declared `mutatesWorkspace: true`, new file at a named path |
| 18 | `/design:diagram` | yes | start | same |
| 19 | `/design:extract` | yes | start | same. Reads a URL the user named. Becomes ask if the workflow installs a browser or writes outside the repository, which I did not check |
| 20 | `/doctor:agents-md` | yes | `check` run. `embed`, `restore` ask | declared, `routes:490-536` |
| 21 | `/doctor:ci` | yes | `report` run. `scaffold`, `toggle` ask | declared, `routes:379-424` |
| 22 | `/doctor:deep-loop` | yes | run | declared add-only into spec scratch, `routes:85-91` |
| 23 | `/doctor:env` | yes | ask today. `list` run once the manifest classes it read-only | declared `mutates` for the whole command, `routes:773-778`. See R4 |
| 24 | `/doctor:git` | yes | `setup` run. `hooks`, `standards` ask | declared, `routes:292-341` |
| 25 | `/doctor:helper` | yes | run | declared read-only, `routes:452-458` |
| 26 | `/doctor:install` | yes | run | declared read-only guide, `routes:604-610`. The opencode lineage's "install mutates" is wrong |
| 27 | `/doctor:mcp` | yes | `install`, `debug` ask | declared, `routes:706-722` |
| 28 | `/doctor:overlay` | yes | `status` run. `apply`, `repin` ask | declared, `routes:627-686` |
| 29 | `/doctor:runtime-mirrors` | yes | run | declared read-only, `routes:224-230` |
| 30 | `/doctor:setup` | yes | run | declared read-only, `routes:354-360` |
| 31 | `/doctor:sk-code` | yes | `setup` run. `quality` ask | declared, `routes:256-279` |
| 32 | `/doctor:sk-skill` | yes | `check` run. `convert` ask | declared, `routes:434-473` |
| 33 | `/doctor:skill-advisor` | yes | `skill-budget`, `parent-skill`, `skill-graph-freshness`, `router-reach` run. `tune`, `rebuild` ask | declared, `routes:105-212` |
| 34 | `/doctor:speckit` | yes | run | declared add-only into packet scratch, `routes:64-70` |
| 35 | `/doctor:symlink` | yes | `check` run. `link`, `unlink` ask | declared, `routes:548-594` |
| 36 | `/doctor:update` | yes | `check` run. `align` start. `apply`, `rollback`, `record-base`, `compat` ask | declared per action, `routes:736-758`. The `align` write target is inferred |
| 37 | `/prompt:improve` | yes | start | inferred. No manifest |
| 38 | `/speckit:plan` | yes | start | inferred. Mode question at `plan.md:33`, Gate 3 |
| 39 | `/speckit:implement` | yes | start | inferred. Tracked code under a bound packet |
| 40 | `/speckit:complete` | yes | start | inferred. Same |
| 41 | `/speckit:resume` | yes | start | inferred. Gate 3 counts a resume as continuity state, `AGENTS.md:73` |
| 42 | `/speckit:save` | yes | start | inferred. Writes inside the bound packet |
| 43 | `/speckit:search` | yes | run | inferred read-only. No `Write` or `Edit` in its frontmatter |
| 44 | `/speckit:handoff` | yes | ask | inferred `relaunch` |
| 45 | `/local-skilled-alignment` | no in the tracked inventory | start if surfaced locally | untracked private file, see G4 |

Count at command level, taking the strictest route of a multi-route command: 7 run, 22 start, 15 ask and 1 not surfaced. Counting routes instead, 15 of the 17 doctor commands have at least one route that runs. `/doctor:env` and `/doctor:mcp` have none today.

Where this differs from research.md section 12: `/doctor:env` and `/doctor:update` get route-level verdicts, `/speckit:implement` and `/speckit:complete` move from ask to start, `/design:extract` moves from ask to start and the private command is not surfaced. Judgment on the three moves: each follows the rule mechanically and each is a tracked write the user's own request asks for. Would change it: the operator choosing the stricter option in D1.

---

## 6. BUILD ORDER

| Phase | Contents | Exit check |
|---|---|---|
| 0. Baseline | R8 corpus slice, L8, L9. No scorer change | `command-prompts.jsonl` committed with rows for all 44 tracked commands. A baseline file records per-command recall. The four existing numbers are unchanged: 158/195, 50/66, 20/24, false fire 5 |
| 1. Inventory and metadata | R1, R4 fields, G4, the `/doctor:env` action classes | `derive-command-bridges.cjs --check` is fresh. It exits 1 on a fixture command with no metadata. Every tracked command and doctor route has a class and a derived policy |
| 2. Reach | R2 parts A and B, L2, L3, R10a | Command recall rises against the phase 0 baseline with no drop in the four existing numbers. No typed command is ambiguous with its own owner |
| 3. Contract and brief | R3, L6, L12, G6, then L1 and L7 | Schema test and golden briefs pass. `save context` returns one entry. The retired ids are gone from code and from `AGENTS.md` |
| 4. Binding | R6, L5, R5, L4, R10b, G1, G3, L10 | `/doctor:agents-md check` passes. The pointer generator's `--check` exits 0. The child smoke test shows the downgraded line |
| 5. Behaviour proof | R8 transcript layer, G2, G5, R10c, R10d | Per runtime: command-start rate reported against the pre-change run, zero unsafe starts, zero started loops without init |

Phase 4 before phase 2 would ship a sentence that binds to a brief saying "no skill matched". Phase 3 before phase 1 would ship fields with no data behind 26 commands.

---

## 7. OPERATOR DECISIONS

These are preferences. Evidence narrows them and does not settle them.

- **D1. The middle band: start or ask.** For a tracked in-repository write that the user's own sentence asked for, should the model start the command and let its setup ask, or ask first whether to use the command. Recommended: start. The write was requested, Gate 3 asks anyway and a second question breaks the single-prompt rule. The stricter option adds a question before each of the 22 commands marked start and protects against a model that skips setup, which G2 measures. This includes `/speckit:implement` and `/speckit:complete`, where research.md chose ask.
- **D2. Is the command the entry for a hub mode.** When the advisor routes to `sk-doc` and the hub picks a mode that has a command, should the model follow the command's workflow or the mode packet's own contract. Recommended: the command, because it carries the setup, Gate 3 and the checkpoints, and two mode packets already say so. The other option keeps today's behaviour, where the command is an alternative surface.
- **D3. How readily to offer a deep loop.** Should a plain "research X in depth" be offered `/deep:research`. Recommended: offer only on wording about depth, iteration or convergence, and set the bar from the phase 0 false offer rate. A lower bar annoys users who wanted an answer in chat.
- **D4. Retire `command-spec-kit` from Gate 4.** It needs an `AGENTS.md` edit beside the new sentence. Recommended: yes, in the same edit, so the file never names an id the scorer no longer has.
- **D5. Surface the private command locally.** Recommended: not now. One command for one checkout does not earn an overlay mechanism.

---

## 8. EVIDENCE RUNS

Commands run in this worktree on 2026-11-12, all exit 0 unless stated.

- `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"…"}' --format json` on 27 prompts. Results quoted in sections 2 and 3.
- The same with `options.includeCompiledRoute: true` on four prompts, and with `confidenceThreshold: 0, uncertaintyThreshold: 1, topK: 5` on eight.
- `node .skilled/bin/compiled-route.cjs --hub <hub> --prompt-stdin` on seven prompts: 39 to 56 ms each. Two returned `action: defer`.
- `node -e` recounts over `command-bridges.generated.json`, the three `command-metadata.json` files, seven `mode-registry.json` files, the 45 command frontmatters and `AGENTS.md` byte offsets.
- `git ls-files` on the loose command file: no output for it.
- `Skill(create:readme)` in this Claude Code session: `Unknown skill: create:readme`.
- Three web searches limited to the official documentation domains of Claude Code, Codex and OpenCode. I read the search summaries and did not open the pages.

Not done: `validate.sh --strict` on this packet was not run, because the session's permission mode refused the command, so this review makes no claim about the packet's validation state. No advisor, hook, command or `AGENTS.md` file was changed. No child session other than this one was observed. No runtime other than Claude Code was started. The Pi, Cursor and Copilot public documentation was not searched.
