# Deep-loop routing: how well the right command gets picked and offered

Read-only analysis of `/Users/michelkerkmeester/MEGA/Development/Skilled` at commit `f746273af58` (origin/main), 2026-11-22. All paths are relative to that root. Nothing in the repository was changed. The only writes were advisor probes, which touch gitignored cache, and files in the session scratchpad. One side effect in the scratchpad is recorded in section 2.1.

## The short version

The advisor offers a deep-loop command reliably only when the request already contains the feature's name.

- **Named** ("deep research", "deep review"): 14 of 14 loop requests got the full row, hub plus mode plus command plus `ask`.
- **Typed** (`/deep:review:auto ...`): 2 of 2.
- **Plain wording** ("investigate thoroughly", "research in depth", "run an iterative review loop", "multi-pass audit"): 2 of 26.

The repository's own corpus says the same thing: the deep tune rows pass and the deep holdout rows fail, live, today.

When a row is offered, it is always the bare command and a policy word. No suffix and no flag ever travels with it (0 of 30 command rows), and no document tells the AI when `--depth-mode=expansive`, `--extend=N`, fan-out or `--dry-run` fits. Read from the contracts and not observed in a session: after the operator says yes, the command opens a second, larger form of typed letters with no recommended option.

Six proposals follow in section 4. The first is a small change to the command gate that, by my trace of the code, fixes 7 of the measured misses. The second is one section of text in each command's presentation file that teaches the offer, the suffix and the flags.

**What this measured and what it did not.** I probed the advisor CLI, which is Gate 2's direct path. I did not run the prompt hook, and I did not watch a model act on a brief. Claims about what the AI does after the brief are read from the contracts and marked inferred.

---

## 1. Current flow, end to end

### 1.1 Request to brief

1. **Hook.** On Claude the `UserPromptSubmit` hook runs the shared handler with a 3 second timeout (`.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:78`). The handler applies a fire gate, strips a pasted earlier reply, may hold a weak follow-up to the session's last route, then calls the advisor CLI (`skill-advisor-hook.md:55-59`).
2. **No hook brief.** Gate 2 falls back to the direct call, `node .skilled/bin/skill-advisor.cjs advisor_recommend` (`AGENTS.md:65`, identical in `~/.claude/CLAUDE.md`).
3. **Brief text.** One head line plus directives. For a deep command it reads `Advisor: live; use system-deep-loop → /deep:research (ask) 0.82/0.16 pass.` (`runtime/lib/render.ts:618-619`, held by `runtime/tests/command-brief-golden.vitest.ts:57`). With no match it reads `Advisor: no skill matched.` (`render.ts:661-662`).

### 1.2 Inside the advisor: three stages, three vocabularies

A deep command row appears only when a prompt passes all three.

| Stage | What decides it | Where | Its vocabulary |
|---|---|---|---|
| One: which skill | Four scoring lanes. Deep-loop evidence is a phrase table and two loop rules | `runtime/lib/scorer/lanes/explicit.ts:95-96, 144-156, 168-169` (phrases) and `:443-449` (rules); hub `graph-metadata.json` `intent_signals` | "deep research", "deep review", "find out everything", "findings stop changing"; or a loop word (`continue`, `resume`, `iterations`, `iterative`, `multi-pass`, `loop`, `overnight`, `convergence`) plus the literal word `research` or `review` |
| Two: which mode | The hub's compiled router. `defaultMode` is `null`, so no keyword means `defer` | `.skilled/skills/system-deep-loop/hub-router.json:5, 20-38` | Fixed phrases: "deep research", "research loop", "iterative investigation", "investigate why", "deep review", "review loop", "release readiness", "audit the diff" and others |
| Three: whether the command rides along | `attachCommand`. Needs a single-mode route, then the deep-loop gate: a typed command or depth wording | `runtime/lib/command-attach.ts:515-569`, gate at `:563-566`, list at `:273-290` | `in depth`, `deep dive`, `deep research`, `deep review`, `thorough`, `thoroughly`, `exhaustive`, `iteratively`, `multiple passes`, `many passes`, `several passes`, `ask the council`, `convene`, `several models`, `final verdict`, `everything you can` |

Stage three's words (`thorough`, `in depth`, `exhaustive`, `deep dive`, `multiple passes`) appear in neither stage one nor stage two. I checked by counting each word in `explicit.ts`, `fusion.ts`, `hub-router.json` and the hub's `graph-metadata.json`: zero in all four. So the depth list only opens the gate for a prompt that already reached the hub and a single mode by other words.

Other facts that shape the result:

- **`/deep:research` and `/deep:review` have no scorer row of their own.** `TRACKED_COMMANDS` marks both `scorerRow: false` (`command-attach.ts:136-137`), and the generated bridge has `typescript.enabled: false` for both. Their `ownedSignals` in `.skilled/skills/system-deep-loop/command-metadata.json:14-18, 62-66` ("investigate a topic iteratively", "find P0 P1 P2 issues") are therefore not scored by the native scorer. The command can arrive only through the hub attach or by being typed (`runtime/handlers/advisor-recommend.ts:393-415` and `:423-446`).
- **`/doctor:deep-loop` does have its own row** (`command-attach.ts:147`), fed by five trigger phrases in `.skilled/commands/doctor/_routes.yaml:106-111`.
- **Policy.** `derivePolicy` reads only risk keys (`runtime/scripts/command-bridges/derive-command-bridges.cjs:444-450`). Both `/deep` commands carry `ask_first: ["spend"]` (`command-metadata.json:9-11, 57-59`), so both are `ask`. `/doctor:deep-loop` is `add-only` with `write_scope: spec-folder` (`_routes.yaml:97-98`), so it is `run`. The reason `spend` is dropped on the way: a row carries `command`, `policy`, `mutating` and `ownerSkillId` only (`command-attach.ts:47-52`).
- **Mode withheld.** When the route defers, the brief says `(needs a mode)` only if the prompt named the skill (`command-attach.ts:576-586`, `render.ts:559-561`). Otherwise it just says `use system-deep-loop`.
- **Operator decision already on record.** A deep loop is offered "only on depth wording" (`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md:44`, question text at `:303-320`). The proposals below stay inside that decision.

### 1.3 What the AI is told to do with the brief

- Confidence at or above 0.8 means it must invoke the skill (`AGENTS.md:67`).
- **Command in the brief** (`AGENTS.md:68`): take the skill path or the command path whole. On the command path, read the command document in full, then `run` starts it now, `start` starts it without `:auto`, and `ask` "offers it in one question and waits". A typed command outranks the policy. Nothing says what the one question contains, which suffix follows a yes, or which flags to add.
- **Gate 4** (`AGENTS.md:89-90`): an executor CLI is the how, never the route, and when the `/deep:*` command row matches alongside `cli-*` for iteration phrases, the command row wins.
- **Skill path.** The hub resolves the mode through `compiled-route.cjs` and asks on `defer` (`.skilled/skills/system-deep-loop/SKILL.md:48-51`). `ROUTER.md:90` says a mode with a command has two whole entries, and that the research packet's only entry is its command. The packet agrees: "invoked exclusively through `/deep:research:auto` or `/deep:research:confirm`" (`deep-research/SKILL.md:102`).
- **Flag selection has no home in the repo rules by design.** `REPO RULES.md:84-88` puts "which command, which model, which flags" out of scope and assigns it to `AGENTS.md` §2 and the skills.

### 1.4 The command's setup

Both `/deep` commands are thin routers: Markdown owns setup, the presentation asset owns visible wording, the YAML owns execution (`.skilled/commands/deep/research.md:9-18, 161-169`).

- **Suffix.** `:auto` is autonomous, `:confirm` is interactive, no suffix means ask (`research.md:86`).
- **`:auto`.** No form. Three tiers: resolve from flags, a `PRE-BOUND SETUP ANSWERS` block and the default table; ask one narrow question only for an ambiguous `spec_folder`; fail fast on a missing topic (`assets/deep-research-presentation.txt:17-25`).
- **`:confirm` or no suffix.** The consolidated form must be the first visible response (`research.md:50`, `deep-research-presentation.txt:9`).

| | `/deep:research` | `/deep:review` |
|---|---|---|
| Questions in the form | Q0 topic, Q1 spec folder (A/B/C), Q2 execution mode, Q3 max iterations, Q-Exec executor with 8 options A to H (`deep-research-presentation.txt:174-201`) | The same plus Q1_type target type (5 options) and Q_dims dimensions (`deep-review-presentation.txt:187-228`) |
| Answer format | Typed letters: `"A, A"`, `"WebSocket research, A, B, 15"` (`:203-207`) | Typed letters: `"skill:deep-research, B, all, A, A"` (`:230-234`) |
| Defaults | 10 iterations, convergence 0.05, depth mode `default`, lineage `auto`, executor `native` (`:146`) | 7 iterations, convergence 0.10, same otherwise (`:159`) |
| Never asked, flag only | depth mode, convergence mode, stop policy, extend, fan-out, dry run, restart | the same, plus review focus |

- **During a run.** `:confirm` pauses at approval gates, including one before every iteration (`assets/deep-research.yaml:1505-1520`; ten `approval_gate` blocks in the research YAML, eight in review). The form describes that as "Interactive -- pause at each iteration for review" (`deep-research-presentation.txt:185-187`).
- **At the end.** The completion message must lead with the answer, then findings, uncertainty, then the path (`deep-research-presentation.txt:320-338`). Next steps are `/speckit:plan`, another `/deep:research`, `/deep:review` and `/speckit:save` (`:413-418`, `deep-research.yaml:2265-2268`).

### 1.5 `/doctor:deep-loop`

Always interactive, no positional target, `--scope` its only flag (`.skilled/commands/doctor/deep-loop.md:32-33`). It asks one four-option scope question when `--scope` is absent (`assets/doctor-deep-loop-presentation.txt:17-27`). It reads the coverage graph and convergence read-only and writes one state log to the packet's scratch folder (`deep-loop.md:60-62`).

---

## 2. The probes and the accuracy measured

### 2.1 Method

- **Command:** `printf '%s' '{"prompt":"..."}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json`, one call per prompt. Every call exited 0 with `freshness: live`.
- **Thresholds in effect:** confidence 0.80, uncertainty 0.35.
- **Volume:** 84 prompts of my own in four rounds, plus the 10 deep-family rows of the repository's own corpus. Eight prompts were rerun and gave identical output.
- **Verdict rule.**
  - *right*: the top skill fits, and the command row and policy match what the request calls for, present for a loop request and absent otherwise.
  - *partial*: the hub is right but the mode or the command row is withheld on a clear loop request, the right command sits only in a lower row, or the pick is defensible.
  - *wrong*: no recommendation or another skill for a loop request, or a command offered that the request did not ask for.
- **Limits.** The verdicts are my reading, one lens. Round 1 was written before any result was seen and is the fair headline. Rounds 2 to 4 chase the misses, so their rate is biased downward on purpose.
- **Raw data:** the folder `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/91021a9f-dca3-4cb7-9743-2973efffa465/scratchpad/deep-loop-routing-analysis-data/` holds `results.json`, `results2.json`, `results3.json`, `results4.json` and `results5.json`, the prompt sets `probes.json` to `probes5.json`, the runner `probe.mjs`, and `mktable.py`, which holds the verdict I gave each probe. Holdout prompt text is removed from `probes5.json` and `results5.json`.
- **A side effect to know about.** The scratchpad already held files named `probes.json` and `probes2.json`, dated 2026-11-18, from earlier work. I wrote my prompt sets under those names without checking and overwrote both. Their earlier contents are gone and I cannot restore them. Their neighbours from the same date (`probes.log`, `probes-baseline.json`, `probes-after.json`, `probes-d3.json`, `probes-final.json`) are untouched. My files now live in the folder above, so those two names are free again.

### 2.2 Accuracy

| Slice | Right | Partial | Wrong | Total | Right | Right or partial |
|---|---|---|---|---|---|---|
| **Round 1 (unbiased)** | 17 | 6 | 9 | 32 | **53%** | **72%** |
| Round 2 | 15 | 6 | 7 | 28 | 54% | 75% |
| Round 3 | 5 | 2 | 7 | 14 | 36% | 50% |
| Round 4 | 3 | 2 | 5 | 10 | 30% | 50% |
| All my probes | 40 | 16 | 28 | 84 | 48% | 67% |
| Repository corpus, deep family | 6 | 1 | 3 | 10 | 60% | 70% |

Round 1 by category:

| Category | Right | Partial | Wrong |
|---|---|---|---|
| Clear research | 1 | 1 | 2 |
| Clear review or audit | 1 | 1 | 2 |
| Ambiguous | 2 | 0 | 3 |
| Iteration phrasing with a cli executor | 2 | 2 | 0 |
| Expansive, extend, fan-out, dry run, doctor | 4 | 2 | 1 |
| Negatives | 7 | 0 | 1 |

The slices that explain the numbers:

- **Loop requests, 42 in all.** 18 got the full row (43%).
  - Named "deep research" or "deep review": 14 of 14.
  - Typed command: 2 of 2.
  - Plain wording: 2 of 26 (R7 and H1e). Of the other 24: the hub never topped in 14 (4 with no recommendation, 10 to another skill), the hub topped but withheld the mode in 7, and the hub and mode were right but the gate stayed closed in 3.
- **Requests that should get no loop, 24 in all.** 2 got a command they did not ask for (N7 and N9). 3 more topped the deep-loop hub wrongly with no command (A3, H3b, N15).
- **Suffix and flags.** 0 of 30 command rows carried either. The recommendation has no field for them.
- **Policy.** Every `/deep` row said `ask` and every `/doctor:deep-loop` row said `run`. That matches the metadata in all cases.
- **Doctor, 9 prompts including 3 corpus rows.** `/doctor:deep-loop` led in 2 (both typed), sat in a lower row in 5, and was absent in 2.

### 2.3 The probe table

Confidence and uncertainty are shown as `c/u`. "floored" means the row passed only on the confidence floor. "Lower row" names a command carried by the second or third recommendation. In the hub route column, `route/research` means the hub's router picked that one mode, `defer` means it withheld the mode, and `-` means the top skill has no compiled route.

**Round 1, written before any result was seen**

| Id | Prompt | Top skill (confidence/uncertainty) | Hub route | Command row | Policy | Verdict | Note |
|---|---|---|---|---|---|---|---|
| R1 | Run a deep research loop on WebSocket reconnection strategies across browsers | system-deep-loop 0.94/0.12 | route/research | /deep:research | ask | right | |
| R2 | Investigate thoroughly how other agent harnesses handle context compaction, multiple passes until it converges | system-spec-kit 0.82/0.18 floored | - | - | - | wrong | depth wording present, hub absent from the result |
| R3 | I need an exhaustive investigation into why the advisor daemon leaks memory | system-skill-advisor 0.82/0.20 floored | - | - | - | wrong | topic word pulled the advisor skill; neutral-topic rerun R3b returned nothing |
| R4 | Research how competing frameworks implement convergence detection and write up what we should adopt | system-deep-loop 0.90/0.12 | defer | - | - | partial | hub right, mode withheld although the prompt opens with Research |
| V1 | Run a deep review of the system-skill-advisor skill | system-deep-loop 0.95/0.12 | route/review | /deep:review | ask | right | |
| V2 | Audit the sk-git skill iteratively for P0/P1/P2 findings before we release | sk-code 0.95/0.12 | route/sk-code-review | - | - | wrong | P0/P1/P2 and iteratively went to single-pass review |
| V3 | Is this packet release-ready? Do a thorough review of specs/system-deep-loop/loop-architecture/002-graph-engineering | system-deep-loop 0.86/0.16 | defer needs-mode | - | - | partial | hub right, needs a mode, no command |
| V4 | Audit the whole hooks tree for security problems, several passes, and give me a final verdict | sk-code 0.82/0.16 floored | route/sk-code-review | - | - | wrong | several passes and final verdict went to single-pass review |
| A1 | look into the hook timeout handling thoroughly | none | - | - | - | wrong | no recommendation at all |
| A2 | check this code | sk-code 0.86/0.22 | defer | - | - | right | |
| A3 | review my PR | system-deep-loop 0.82/0.20 floored | defer | - | - | wrong | plain PR review topped the deep-loop hub (floored) |
| A4 | do a deep dive on the auth module | none | - | - | - | wrong | deep dive is depth wording, no recommendation |
| A5 | run a deep loop on the routing code | system-deep-loop 0.84/0.16 | defer | - | - | right | |
| E1 | run 5 iterations with cli-opencode on the caching research | system-deep-loop 0.82/0.20 floored | defer | - | - | partial | hub floored, mode withheld, cli hub 0.001 behind |
| E2 | use cli-opencode gpt-5.5 high to run 10 deep review iterations on the sk-doc skill | system-deep-loop 0.94/0.16 | route/review | /deep:review | ask | right | |
| E3 | run 8 more review iterations with cli-codex on the advisor runtime | system-deep-loop 0.88/0.16 | defer | - | - | partial | hub right, mode withheld although the prompt says review iterations |
| E4 | deep research on prompt caching using cli-claude-code and cli-opencode in parallel | system-deep-loop 0.88/0.12 | route/research | /deep:research | ask | right | |
| F1 | research agent memory architectures broadly and let the loop grow its own follow-up questions | system-deep-loop 0.82/0.16 floored | defer | - | - | partial | hub floored, mode withheld |
| F2 | the research run finished but I want 5 more iterations on it | system-deep-loop 0.82/0.20 floored | defer | - | - | partial | hub floored, mode withheld |
| F3 | fan out the deep review of sk-code across three executors: codex, opencode and claude | system-deep-loop 0.93/0.16 | route/review | /deep:review | ask | right | |
| F4 | show me what the deep research fan-out would launch before it spends anything | system-deep-loop 0.91/0.12 | route/research | /deep:research | ask | right | |
| F5 | run an expansive depth deep review of the advisor runtime | system-deep-loop 0.95/0.12 | route/review | /deep:review | ask | right | |
| F6 | extend the finished deep review by 3 iterations | system-deep-loop 0.95/0.12 | route/review | /deep:review | ask | right | |
| F7 | the deep-research coverage graph looks stale and convergence never fires, check it | system-deep-loop 0.92/0.12 | route/research | - | - | wrong | no doctor row; hub routed to research |
| N1 | fix the typo in README.md line 12 | sk-doc 0.95/0.12 | route/sk-create-readme | - | - | right | |
| N2 | what does /deep:research do? | system-deep-loop 0.87/0.16 | defer | - | - | right | |
| N3 | review this function for an off-by-one bug | sk-code 0.90/0.12 | route/sk-code-review+sk-code-skilled | - | - | right | |
| N4 | what is the syntax for git rebase --onto? | sk-git 0.86/0.12 | - | - | - | right | |
| N5 | commit my changes and open a PR | sk-git 0.95/0.12 | - | - | - | right | |
| N6 | don't run /deep:review, just read review-report.md and summarize the P0 findings | system-deep-loop 0.87/0.16 | defer | - | - | right |  Lower row: /doctor:deep-loop (run). |
| N7 | explain how convergence detection works in the deep-loop runtime | command-doctor-deep-loop 0.80/0.34 | - | /doctor:deep-loop | run | wrong | an explain question got a run-policy command at the threshold edge |
| N8 | implement the fixes for the findings in the review report | sk-code 0.94/0.12 | route/sk-code-review | - | - | right | |

**Round 2, follow-ups on the round 1 misses**

| Id | Prompt | Top skill (confidence/uncertainty) | Hub route | Command row | Policy | Verdict | Note |
|---|---|---|---|---|---|---|---|
| R2b | Investigate thoroughly how other agent harnesses handle context compaction | system-spec-kit 0.83/0.18 | - | - | - | wrong | same as R2 without the pass wording |
| R3b | I need an exhaustive investigation into why websocket reconnects fail on mobile Safari | none | - | - | - | wrong | no recommendation |
| R5 | deep research: how do vector databases handle hybrid search | system-deep-loop 0.91/0.12 | route/research | /deep:research | ask | right | |
| R6 | research in depth how OAuth token rotation works across providers | none | - | - | - | wrong | research in depth, no recommendation |
| R7 | find out everything you can about MCP server sandboxing | system-deep-loop 0.85/0.16 | route/research | /deep:research | ask | right | |
| V2b | Audit the sk-git skill for P0 P1 P2 issues | sk-code 0.95/0.12 | defer | - | - | wrong | the command's own owned signal, single-pass review won |
| V5 | do a thorough code review of the advisor runtime | sk-code 0.95/0.12 | route/sk-code-review | - | - | partial | single-pass review is defensible; no loop offered on thorough |
| V6 | run an iterative review loop over the hooks folder until findings stop changing | system-deep-loop 0.95/0.12 | route/review | - | - | partial | hub and mode right, command row withheld (no depth wording) |
| V7 | release readiness review of the sk-doc skill | sk-doc 0.95/0.16 | route/sk-create-manual-testing-playbook | /create:manual-testing-playbook | start | wrong | release readiness review went to a playbook creation command |
| V8 | review the system-deep-loop skill in depth | system-deep-loop 0.95/0.16 | defer needs-mode | - | - | partial | hub right, needs a mode, no command |
| A6 | investigate why the daemon crashes on startup | system-deep-loop 0.82/0.16 floored | route/research | - | - | right | defensible; a debug read is also plausible |
| A7 | thoroughly check this code | sk-code 0.86/0.22 | defer | - | - | right | |
| A8 | look into why the tests are flaky, in depth | none | - | - | - | wrong | no recommendation |
| E5 | run 5 deep research iterations with cli-opencode on caching strategies | system-deep-loop 0.91/0.12 | route/research | /deep:research | ask | right | |
| E6 | run 5 iterations of deep review with cli-codex gpt-5.5 high on skill:sk-code | system-deep-loop 0.95/0.16 | route/review | /deep:review | ask | right | |
| E7 | use cli-opencode to run 5 iterations | cli-external-orchestration 0.95/0.12 | route/cli-opencode | - | - | right | |
| F8 | continue the deep research for 5 more iterations | system-deep-loop 0.94/0.12 | route/research | /deep:research | ask | right | |
| F9 | deep loop convergence check | system-deep-loop 0.87/0.12 | defer | - | - | partial | doctor row listed second behind the hub. Lower row: /doctor:deep-loop (run). |
| F10 | is my deep-loop graph empty or stale? | system-deep-loop 0.83/0.12 | defer | - | - | partial | doctor row listed second behind the hub. Lower row: /doctor:deep-loop (run). |
| F11 | /doctor:deep-loop --scope=review | command-doctor-deep-loop 0.88/0.16 | - | /doctor:deep-loop | run | right | |
| F12 | /deep:review:auto skill:sk-code --depth-mode=expansive | system-deep-loop 0.93/0.16 | defer | /deep:review | ask | right | typed with :auto; row still says ask, Gate 2 lets the typed command outrank it |
| F13 | /deep:research:confirm "prompt caching" --executor=cli-codex --executor=cli-opencode | system-deep-loop 0.82/0.16 floored | defer | /deep:research | ask | right | |
| N9 | summarize the research.md from the last deep research run | system-deep-loop 0.91/0.12 | route/research | /deep:research | ask | wrong | a summary request was offered a new research run |
| N10 | how does the deep loop decide to stop? | system-deep-loop 0.86/0.12 | defer | - | - | right | |
| N12 | thoroughly test the login flow in the browser | local-webflow 0.82/0.22 floored | - | - | - | right | no deep command; the wrong non-deep skill is outside this question |
| N13 | write a thorough README for the hooks folder | sk-doc 0.95/0.12 | route/sk-create-readme | /create:readme | start | right | |
| N14 | do a quick review of this diff | sk-code 0.90/0.12 | route/sk-code-review | - | - | right | |
| N15 | add a --depth-mode flag parser test to the deep-loop runtime | system-deep-loop 0.85/0.16 | defer | - | - | partial | a code task topped the hub; no command |

**Round 3, isolating the three vocabularies**

| Id | Prompt | Top skill (confidence/uncertainty) | Hub route | Command row | Policy | Verdict | Note |
|---|---|---|---|---|---|---|---|
| H1a | run an iterative review loop on skill:sk-doc | system-deep-loop 0.95/0.16 | route/review | - | - | partial | hub and mode right, command row withheld |
| H1b | start a research loop on caching strategies | system-deep-loop 0.90/0.12 | route/research | - | - | partial | hub and mode right, command row withheld |
| H1c | autoresearch the best embedding models for code search | sk-code 0.82/0.22 floored | defer | - | - | wrong | registry alias autoresearch did not win; code search in the prompt is a confound |
| H1d | audit the diff before release | system-deep-loop 0.94/0.16 | route/review | - | - | right | |
| H1e | review loop over the spec packet, multiple passes | system-deep-loop 0.95/0.12 | route/review | /deep:review | ask | right | |
| H3a | ask the council for a final verdict on this plan | command-speckit-ai-council 0.88/0.12 | - | /speckit:ai-council | ask | right | |
| H3b | convene several models to stress-test the architecture decision | system-deep-loop 0.82/0.16 floored | defer | - | - | wrong | council wording went to the deep-loop hub |
| H4 | research the caching options for our API | none | - | - | - | right | |
| H5 | review the sk-doc skill | sk-code 0.95/0.16 | route/sk-code-review | - | - | right | |
| H6 | do an exhaustive audit of the sk-doc skill across every dimension and give me a final verdict | sk-doc 0.89/0.12 | route/sk-create-quality-control | - | - | wrong | exhaustive audit with a final verdict went to sk-doc |
| H7 | investigate iteratively how the hook pipeline orders its adapters | none | - | - | - | wrong | no recommendation |
| H8 | I want a deep dive into agent memory architectures, go as deep as it takes | system-spec-kit 0.82/0.16 floored | - | - | - | wrong | deep dive went to spec-kit (floored) |
| H9 | research this until you run out of new information: how do coding agents budget context | system-spec-kit 0.82/0.22 floored | - | - | - | wrong | went to spec-kit (floored) |
| H10 | I want a multi-pass security and correctness audit of the hooks tree | sk-code 0.82/0.16 floored | route/sk-code-review | - | - | wrong | multi-pass audit went to single-pass review |

**Round 4, packet trigger phrases, doctor and lifecycle**

| Id | Prompt | Top skill (confidence/uncertainty) | Hub route | Command row | Policy | Verdict | Note |
|---|---|---|---|---|---|---|---|
| K1 | comprehensive research on prompt caching strategies | sk-prompt 0.82/0.12 | - | - | - | wrong | packet keyword trigger, went to sk-prompt |
| K2 | multi-round research into vector index compaction | none | - | - | - | wrong | packet keyword trigger, no recommendation |
| K3 | start an autonomous research session on agent sandboxes and let it run overnight | system-deep-loop 0.82/0.20 floored | defer | - | - | partial | hub floored, mode withheld |
| K4 | release readiness check on the sk-git skill | system-deep-loop 0.93/0.16 | route/review | - | - | right |  Lower row: /create:manual-testing-playbook (start). |
| K5 | pre-release review of the hooks tree | sk-code 0.90/0.12 | route/sk-code-review | - | - | wrong | packet trigger phrase, went to single-pass review |
| K6 | audit spec folder specs/system-deep-loop/loop-architecture for misalignments with the code | system-spec-kit 0.95/0.16 | - | - | - | wrong | packet trigger phrase, went to spec-kit |
| D1 | my deep review keeps running and never converges, what is wrong with its coverage graph | system-deep-loop 0.95/0.12 | route/review | /deep:review | ask | wrong | a stuck-run diagnosis was offered a new review; doctor row third. Lower row: /doctor:deep-loop (run). |
| D2 | diagnose the deep-loop coverage graph for the last research run | system-deep-loop 0.88/0.12 | defer | - | - | partial | hub top, doctor row third. Lower row: /doctor:deep-loop (run). |
| X1 | resume the deep research | system-deep-loop 0.94/0.12 | route/research | /deep:research | ask | right | |
| X2 | the deep review hit max iterations, keep going for a few more | system-deep-loop 0.95/0.12 | route/review | /deep:review | ask | right | |

### 2.4 The repository's own corpus

These are the deep-family rows of `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl`, run live. Prompt text is left out. See open question 6 about the holdout rows.

| Corpus row id | Row type / split | Top skill | Hub route | Command row | Policy | Verdict | Note |
|---|---|---|---|---|---|---|---|
| cmd-doctor-deep-loop-typed-01 | typed/none | command-doctor-deep-loop 0.86/0.16 | - | /doctor:deep-loop | run | right |  |
| cmd-doctor-deep-loop-plain-tune-01 | plain/tune | system-deep-loop 0.90/0.12 | route/research | - | - | partial | doctor row listed second. Lower row: /doctor:deep-loop (run). |
| cmd-doctor-deep-loop-plain-holdout-01 | plain/holdout | system-deep-loop 0.91/0.12 | defer | - | - | wrong | no doctor row |
| cmd-deep-research-typed-01 | typed/none | system-deep-loop 0.82/0.16 floored | defer | /deep:research | ask | right |  |
| cmd-deep-research-plain-tune-01 | plain/tune | system-deep-loop 0.83/0.12 | route/research | /deep:research | ask | right |  |
| cmd-deep-research-plain-holdout-01 | plain/holdout | none | - | - | - | wrong | no recommendation |
| cmd-deep-review-typed-01 | typed/none | system-deep-loop 0.88/0.12 | defer | /deep:review | ask | right |  |
| cmd-deep-review-plain-tune-01 | plain/tune | system-deep-loop 0.84/0.12 | route/review | /deep:review | ask | right |  |
| cmd-deep-review-plain-holdout-01 | plain/holdout | none | - | - | - | wrong | no recommendation |
| nm-system-deep-loop-01 | near-miss/none | system-deep-loop 0.92/0.12 | route/research | - | - | right |  |

Typed rows 3 of 3, tune rows 2 of 2 for the `/deep` commands, holdout rows 0 of 3. The committed baseline shows the same shape for the deep family, tune 2 of 2 and holdout 0 of 2 (`command-routing-baseline.json`, `attachedMetrics.plain_by_family.deep`), but it was captured on 2026-10-11 at another commit, so the live run above is the evidence and the file is only background.

---

## 3. Gaps, ranked by impact

### G1. A loop request in plain words gets no command row. Confirmed.

**Evidence.** 2 of 26 plain loop requests got the row, against 14 of 14 when the feature was named. Corpus holdout 0 of 3.

**Cause, read from the code.** The three vocabularies in section 1.2 do not overlap, and a prompt has to hit all three. The three ways it fails:

- **The hub never tops (14 probes).** Depth words are not stage-one evidence. "Investigate thoroughly how other agent harnesses handle context compaction" went to `system-spec-kit` (R2b). "research in depth how OAuth token rotation works across providers" returned nothing (R6). "Audit the sk-git skill iteratively for P0/P1/P2 findings before we release" went to single-pass review (V2).
- **The hub tops, the mode is withheld (7 probes).** Stage two knows fixed phrases only. "run 8 more review iterations with cli-codex on the advisor runtime" defers (E3) although it names one mode.
- **Hub and mode are right, the gate stays closed (3 probes).** "run an iterative review loop over the hooks folder until findings stop changing" routes to review and gets no command (V6), because `iterative` and `loop` are stage-one words and not on the depth list. Same for H1a and H1b.

**Why it matters most.** Without the row, Gate 2's command clause never fires, so nothing is offered. This is also the only path on which the `ask` policy exists (see G6).

### G2. No suffix or flag is ever proposed, and nothing teaches when one fits. Confirmed.

**Evidence.**
- 0 of 30 command rows carry a suffix or flag. F3 (fan-out across three executors), F5 (expansive depth) and F6 (extend by 3) all returned the bare `/deep:review (ask)`.
- A search of the skill and the commands for any sentence that says when to use expansive depth, extend or fan-out returned nothing. The flag tables say what each flag does (`research.md:101-120`), never which request calls for it.
- The Examples blocks, the most copyable surface, contain no `--depth-mode=expansive`, no `--extend` and no `--dry-run` (`deep-research-presentation.txt:381-405`, `deep-review-presentation.txt:488-507`).
- The one "when" table has a single flag row, "Exhaustive critical research: `--max-iterations 15 --convergence 0.02`" (`deep-research/references/guides/quick-reference.md:67-74`).

**Consequence.** The features released in v4.2.0.0 (`.skilled/changelog/skilled/v4.2.0.0.md:144-188`) are reachable only by an operator who already knows the flag.

### G3. The offer is followed by a second, larger form, in typed letters, with no recommendation and no cost. Text confirmed, behaviour inferred.

**Confirmed in the text.**
- The form is a typed lettered menu (`deep-research-presentation.txt:174-207`). `communication-handoff.md:126-145` calls a typed menu a failure where the runtime has a question tool, and says "Recommend one option and say why".
- The sweep that moved startup forms to the question tool (commit `9e0d3a07a40`, 2026-11-08) touched the create, design and prompt presentation files and one speckit YAML. It did not touch the two deep presentation files, and neither mentions the question tool or §5 today.
- No option is marked recommended. Q-Exec lists eight executors with up to four lines of flag internals each (`:192-201`).
- Nothing in either command document or presentation file states in advance what a run will spend. The `ask` reason is `spend`.
- Q2 offers autonomous and interactive as equals. Interactive means an approval stop before every iteration, up to ten on a default research run, and the form does not say which choice is usual.

**Inferred.** Under `ask` the AI asks one question (`AGENTS.md:68`). A yes then starts the command, and with no suffix the form is the first visible response (`research.md:50`): four questions for research, six for review. So the operator answers twice. What would confirm it: one recorded session on a deep row through `runtime/scripts/routing-accuracy/run-command-behaviour.mjs`.

### G4. A finished or stuck run dead-ends. Confirmed.

- **Completed packet.** Rerunning on one halts with "Completed deep-research packet detected. Archive or replace the existing research/ tree before starting a new session." (`deep-research.yaml:659-663`). It names neither `--extend=N` nor `--restart`, and both exist for exactly this.
- **Next steps.** After a run that stopped on `maxIterationsReached`, the suggestions are `/speckit:plan`, a new topic, `/deep:review` and `/speckit:save` (`deep-research-presentation.txt:413-418`, `deep-research.yaml:2265-2268`; review at `deep-review-presentation.txt:511-519`, `deep-review.yaml:2530-2534`). `--extend` is not among them.
- **Doctor.** `/doctor:deep-loop` is named nowhere in the hub `SKILL.md`, the hub `ROUTER.md`, either mode `SKILL.md`, either `/deep` command document or either presentation file. The hub's `ARCHITECTURE.md` and the runtime references do name it, but those are not on the path a run takes. The error tables say "State file missing: reconstruct from iteration files" (`deep-research-presentation.txt:357-364`).
- **Advisor.** A stale-graph complaint in plain words got no doctor row (F7, and one corpus holdout row). "my deep review keeps running and never converges, what is wrong with its coverage graph" was offered a new `/deep:review` (D1).

### G5. Three commands were offered that the request did not ask for. Confirmed, low rate.

- **N9**, "summarize the research.md from the last deep research run": `/deep:research (ask)`. The phrase "deep research" is on the depth list, so mentioning a past run opens the gate.
- **D1**: `/deep:review (ask)` on a diagnosis, as above.
- **N7**, "explain how convergence detection works in the deep-loop runtime": `/doctor:deep-loop (run)` at 0.80/0.34, exactly on the confidence threshold and 0.01 inside the uncertainty threshold. `run` starts without asking. The run-command guard reads only typed names (`command-attach.ts:423-436`).

Two of the three are `ask`, so the cost is one unneeded question. The third writes one scratch file.

### G6. On the skill path the `ask` policy does not exist. Inferred.

When the hub tops with no command row (10 of the 26 plain loop requests), `AGENTS.md:67` sends the AI to the skill. The research packet then says to invoke through `/deep:research:auto` or `:confirm` (`deep-research/SKILL.md:102, 217`) and has no step that offers first. `ROUTER.md:90` says to follow the command "under the policy the advisor names", and here it names none. What would confirm it: a behaviour run on a V6-shaped prompt, checking whether the model asks before it starts.

### G7. Misroutes around the hub. Confirmed.

- **Review requests leave for other skills.** "release readiness review of the sk-doc skill" got `/create:manual-testing-playbook (start)` with the hub third (V7). "do an exhaustive audit of the sk-doc skill across every dimension and give me a final verdict" went to `sk-doc` (H6).
- **The hub tops where it should not.** "review my PR" (A3, floored), "convene several models to stress-test the architecture decision" (H3b, floored), and a code task that mentions `--depth-mode` (N15).
- **Iteration phrasing with an executor.** Gate 4 holds where the row exists: in E2, E4, E5 and E6 the hub led `cli-external-orchestration` by 0.001 and carried the command. In E1 and E3 the hub led by the same margin with no row, so Gate 4's second sentence has nothing to apply to.

### G8. Drift between the skill, the command documents and the advisor. Confirmed.

| # | Where | What disagrees |
|---|---|---|
| 1 | `command-attach.ts:285-287`, `explicit.ts:156` | The depth list still holds `ask the council`, `convene`, `several models`, and the phrase table still boosts `system-deep-loop` on `several models`. The council left this hub (`system-deep-loop/SKILL.md:33`) and its command is `/speckit:ai-council`. H3b is the measured effect |
| 2 | `deep-research/SKILL.md:30-39` against `hub-router.json:34` | The packet lists `autonomous research`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research` as keyword triggers. None is in the hub vocabulary, though `system-deep-loop/SKILL.md:45` says packet triggers are checked against it. K1 went to `sk-prompt`, K2 returned nothing |
| 3 | `deep-review/SKILL.md:66-72` | Lists "audit spec folder" and "pre-release review" among its trigger phrases. K6 went to `system-spec-kit`, K5 to single-pass review. "release readiness check" did route (K4). I did not probe the other phrases in that list |
| 4 | `deep-review/SKILL.md:57` | "Invoke via `/deep:review :auto`", with a space. The canonical form is attached (`research.md:52`, `review.md:81`), and the typed-command parser needs it attached (`command-attach.ts:209`) |
| 5 | `deep-research/SKILL.md:305` | "Skill routing via `skill_advisor.py` (keywords: autoresearch, deep research)". Routing is the daemon CLI, and `autoresearch` alone did not top the hub in H1c, with "code search" in that prompt as a confound |
| 6 | `deep-research-presentation.txt:387`, `deep-research/references/guides/quick-reference.md:74` | Examples write `--max-iterations 5 --convergence 0.10` and `--max-iterations 15 --convergence 0.02` with spaces. The argument hint, the flag table and the parse rules write `=`. Whether the space form parses is unknown, I did not test it |
| 7 | Commit `9e0d3a07a40` | The deep presentation files were left out of the question-tool sweep (see G3) |

---

## 4. Proposals, most valuable first

No proposal changes `AGENTS.md`, `CLAUDE.md` or a repo rule. Proposals 1 and 3 change advisor code that scores every prompt on every runtime, so they need a spec folder, the `sk-code` route and a rebuilt `dist`, because the CLI shim refuses a stale one.

### P1. Let loop wording open the gate, and let one mode word resolve a deferred route

- **Closes:** G1 cases two and three, and G7's E1 and E3.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`.

**Change 1.** Add below `COMMAND_GAP_WORDS` (`:361`):

```ts
// Wording that names the loop itself rather than a topic. It asks for the run
// only behind a use verb, so "how does the research loop decide" stays a
// question about the loop.
export const LOOP_WORDING: readonly string[] = [
  'iterations',
  'iterative',
  'multi-pass',
  'research loop',
  'review loop',
];

const LOOP_RUN_REQUEST = new RegExp(
  `\\b${COMMAND_USE_VERB} (?:[a-z0-9'-]+ ){0,3}(?:${LOOP_WORDING.map(escapePhrase).join('|')})\\b`,
);

// The effort a deep loop spends is asked for by depth wording or by asking to
// run the loop by name.
export function asksForLoopEffort(lowered: string): boolean {
  return DEPTH_REQUEST.test(lowered) || LOOP_RUN_REQUEST.test(lowered);
}

// One word that names a mode. A prompt that carries exactly one of them and
// asks for the effort names its mode as surely as a router phrase does.
export const MODE_CUES: Readonly<Record<string, RegExp>> = {
  research: /\b(?:research|investigat(?:e|es|ing|ion)|look into|find out)\b/,
  review: /\b(?:review|audit)\b/,
};
```

**Change 2.** In `attachCommand`, replace the gate at `:563-566`:

```ts
  if (skillId === 'system-deep-loop') {
    const typesThisCommand = typedCommandIn(prompt) === commands[workflowMode];
    if (!typesThisCommand && !asksForLoopEffort(prompt.toLowerCase())) return undefined;
  }
```

**Change 3.** In `attachCommand`, before the `route.action !== 'route'` return at `:523`, add:

```ts
  // The hub's router reads fixed phrases, so it defers on "run 5 review
  // iterations" though the prompt names one mode and asks for the loop.
  if (
    skillId === 'system-deep-loop'
    && (route.action === 'defer' || route.action === 'clarify')
    && Object.prototype.hasOwnProperty.call(modeCommands, skillId)
    && !isNoEditRequest(prompt)
    && asksForLoopEffort(prompt.toLowerCase())
  ) {
    const lowered = prompt.toLowerCase();
    const cued = Object.keys(MODE_CUES).filter((mode) => (
      MODE_CUES[mode].test(lowered)
      && Object.prototype.hasOwnProperty.call(modeCommands[skillId], mode)
    ));
    if (cued.length !== 1) return undefined;
    const command = modeCommands[skillId][cued[0]];
    return commandOnlyMentioned(prompt, command) ? undefined : command;
  }
```

- **What it should change, traced by hand against the code and not yet run.** Seven misses gain the row: V6, H1a, H1b through change 2; V3, V8, E1, E3 through change 3. That takes plain loop requests from 2 of 26 to 9 of 26 with stage one untouched.
- **What it should leave alone.** A deferred route that now carries a command already exists for typed commands (F12, F13), so the output shape is not new. The corpus near-miss row `nm-system-deep-loop-01` has no use verb. N2, N6, N10 and A5 carry neither depth wording nor a run request for a loop word. F12 and F13 still arrive by the typed path.
- **Proof.**
  - Unit cases in `runtime/tests/command-attach.vitest.ts` beside the test at `:102`: each of the seven prompts returns its command, and the near-miss prompts return `undefined`.
  - Rerun my 84 probes with `probe.mjs`. Pass means the seven flip, the no-loop false offers stay at 2 of 24, and no other row changes.
  - Recapture with `capture-command-routing-baseline.mjs`; `false_offer` must stay 0 of 35.
- **Blast radius.** Medium. One file in the recommend path for every runtime, but both changes sit behind `skillId === 'system-deep-loop'`. The attach step is TypeScript only, so the Python fallback scorer is not involved. Undo is a revert and a rebuild.

### P2. Teach the offer: one section in each presentation file

- **Closes:** G2, most of G3, and G6.
- **Files:** `.skilled/commands/deep/assets/deep-research-presentation.txt` and `deep-review-presentation.txt`, a new subsection at the end of section 1. One pointer line in `research.md` and `review.md` section 3, because Gate 2 has the AI read the command document in full before it acts on `ask`.

**Pointer line** for `research.md`, added as step 0 of MODE ROUTING (and the same for `review.md` with its own names):

```
0. When the operator did not type this command, compose and ask the offer in the presentation contract's "Offer From an Advisor Brief" section before anything else. A missing advisor policy counts as `ask`.
```

**New subsection** for `deep-research-presentation.txt`:

```
### Offer From an Advisor Brief

Use this when the operator did not type the command: a brief or advisor result named
`/deep:research` with policy `ask`, or the hub route led here with no policy. A missing
policy counts as `ask`.

Ask once, through the question tool that `.skilled/repo-rules/communication-handoff.md` §5
names for your runtime, in the same call as the Gate 3 spec folder question. Put one
composed invocation in front of the operator, mark it recommended and say what it spends.
Only where §5 names no tool for this session, print the offer as text.

  Run a deep research loop on "<topic>"?
  A) Run it (Recommended): <composed invocation>
     Up to <N> iterations on <executor>. Writes to <spec folder>/research/. <one clause per flag you added and why>
  B) Step through setup first: /deep:research:confirm "<topic>"
     Asks every setup value and stops for approval before each iteration.
  C) No loop. Answer in one pass.

Compose the invocation from what the request says. Add a flag only on its signal.

| The request says | Add |
|---|---|
| Nothing beyond the topic | No flags: 10 iterations, convergence 0.05, native executor |
| A broad or open topic, "everything about", "map the space", "follow the questions it raises" | `--depth-mode=expansive`. With no `--max-iterations` the run sizes its own budget, up to 24 |
| An iteration count | `--max-iterations=N`. Add `--stop-policy=max-iterations` when the operator wants exactly N |
| One executor or model | `--executor=<kind> --model=<id>`, and `--reasoning-effort=<level>` when given |
| Two or more executors or models, or independent takes | One `--executor` group each, `cli-*` kinds only, and `--concurrency=N` |
| More passes on a run whose `research/deep-research-config.json` says `"status": "complete"` | `--extend=N` on the same topic and spec folder. Not with fan-out. Add open questions to `research/inbox.jsonl` first, or the extension can stop at once |
| An unfinished run to pick up | `--lineage-mode=resume` |
| Start over on an existing packet | `--restart` |
| "Show me first", "before it spends anything", or a fan-out the operator did not spell out | `--dry-run` |

On A, run the composed invocation with `:auto` and `--spec-folder=<the Gate 3 answer>`.
On B, run `:confirm`. On C, answer directly. Report `COMMAND: /deep:research → [started|declined]`.
```

Every row restates an existing contract: defaults (`deep-research-presentation.txt:146`), expansive and its budget (`research.md:107`, presentation `:74`), stop policy (`research.md:137`), executor groups (`research.md:118`), fan-out kinds (presentation `:97`), extend and its re-stop caveat (`research.md:116`), lineage modes (`research.md:115`), dry run (`research.md:139-149`), and the completed status the workflow itself tests (`deep-research.yaml:599`).

**For `deep-review-presentation.txt`**, the same section with these differences:

- Command names, 7 iterations, convergence 0.10, `review/` and `review/deep-review-config.json`.
- Option A also states the target type and "all four dimensions".
- The expansive row reads: "A large target such as a whole skill, a track or a tree of folders: `--depth-mode=expansive`, which splits it into sub-targets."
- One extra row: "A named concern, such as "focus on auth" or "check the migration path": `--review-focus="TEXT"`" (`review.md:107`).
- The fan-out row adds: "every lineage reviews all four dimensions, and any lineage's active P0 makes the merged verdict FAIL" (`deep-review-presentation.txt:509`).
- The extend row's caveat reads: "an extension with nothing new can stop at once, so say what the extra passes should cover" (`review.md:109`).

- **Proof.** Text cannot be proven by an advisor probe. It needs a behaviour run: three recorded sessions through `run-command-behaviour.mjs` on prompts F3, F5 and F6. Pass means the first visible response is one question whose recommended option carries the expected flag. I did not run this.
- **Blast radius.** Low to medium. Two text assets and two one-line edits in command documents that every runtime reaches by symlink. The compiled contracts under `assets/compiled/` are generated from these sources and would need regenerating; that is read from their README, I did not run the compiler. The gates the question-tool commit used apply: `sync-runtime-mirrors.cjs --check` and `validate-command-references.cjs`.

### P3. Make depth wording count at stage one

- **Closes:** part of G1 case one, the largest group at 14 probes. It targets the 10 of them that carry depth wording and a mode word.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, after the review-loop rule at `:449`. It needs `DEPTH_REQUEST` exported from `command-attach.ts:321` and `MODE_CUES` from P1.

```ts
  // Depth wording beside a research or review verb asks for the effort a deep
  // loop spends, so the hub has to rank even when the prompt never says "deep"
  // or "loop".
  if (DEPTH_REQUEST.test(lower)) {
    if (MODE_CUES.research.test(lower)) push(scores, 'system-deep-loop', 0.85, 'research-depth');
    if (MODE_CUES.review.test(lower)) push(scores, 'system-deep-loop', 0.85, 'review-depth');
  }
```

The weight 0.85 copies the two loop rules beside it.

- **What it should change. This is a prediction, the scorer's fusion decides.** Ten loop requests carry depth wording and a mode word and do not top the hub today: R2, R2b, R3, R3b, R6, A1, V2, V4, H6, H7. The ambiguous probe A8 has the same shape.
  - R3b, R6, A1, H7 and A8 have no recommendation at all today, so the hub has no rival.
  - R2, R3 and V4 face one rival sitting on the confidence floor at 0.82, and R2b one at 0.83.
  - V2 and H6 face a rival at 0.95 and 0.89. I cannot say which side wins.
  - With P1 in place each flip also resolves its mode and carries the command.
- **What it does not reach.** Of the 14, H1c, H8, H9 and H10 stay misses: none pairs a depth word with a mode word. A4, outside the loop set, stays too ("deep dive" with no mode word). F1, F2 and K3 stay partial, since they reach the hub but carry neither depth wording nor a request to run a loop by name.
- **The decision it forces.** "do a thorough code review of the advisor runtime" (V5) would now compete for the hub. The scorer keeps "code audit" with single-pass review on purpose (`runtime/lib/scorer/fusion.ts:766-771`). Open question 1 asks which way this should go. If the answer is single pass, add `&& !/\bcode (?:review|audit)\b/.test(lower)` to the review line.
- **Proof.** Rerun the 84 probes. Pass means at least the five probes with no rival (R3b, R6, A1, H7, A8) top the hub, no negative gains a command, and `advisor_validate` slices and the corpus `false_offer` count do not move. Reject it if any of N1 to N15, H3a, H4 or H5 changes its top skill.
- **Alternative I do not recommend.** Adding more phrases to `hub-router.json`, as packet 012 did with one anchor per mode. The measurement argues against it: anchored tune rows pass and holdout rows fail.
- **Blast radius.** Medium to high. This lane scores every prompt. The Python fallback scorer would diverge until it carries the same rule. Baselines need recapturing. Undo is a revert and a rebuild.

### P4. Fix the dead ends for finished and stuck runs

- **Closes:** G4.

**1.** `.skilled/commands/deep/assets/deep-research.yaml:663`, replace the message with:

```
message: "Completed deep-research packet detected. To add iterations to this run, rerun with --extend=N. To start over, rerun with --restart, which archives the current research/ tree."
```

**2.** `deep-research-presentation.txt`, Next Steps table at `:413-418`, add two rows:

```
| Stopped on `maxIterationsReached` or `maxDurationReached` with questions open | `/deep:research:auto "[same topic]" --spec-folder=[path] --extend=N` | Adds N iterations to this run in place |
| A run never converges, or its coverage graph looks empty or stale | `/doctor:deep-loop --scope=research` | Read-only graph and convergence check |
```

**3.** `deep-research.yaml:2265-2268`, add to `next_steps`:

```
- "/deep:research:auto \"{research_topic}\" --spec-folder={spec_folder} --extend=N (when the stop reason is maxIterationsReached or maxDurationReached and questions remain)"
```

**4.** The same two rows in `deep-review-presentation.txt:511-519` with `/deep:review`, the review target and `--scope=review`, and the same line in `deep-review.yaml:2530-2534` with `{review_target}`.

**5.** `.skilled/skills/system-deep-loop/SKILL.md:20`, append one sentence:

```
Use `/doctor:deep-loop` to diagnose a run whose coverage graph or convergence looks wrong.
```

- **Proof.** Item 1: a dry rerun on a completed packet prints the new message. Items 2 to 5 are text; `validate-command-references.cjs` confirms the references resolve.
- **One thing I did not verify.** The row keeps the topic because the default table marks it required with no default (`deep-research-presentation.txt:71`). Whether an extension checks that the topic matches is unknown.
- **Blast radius.** Low. Message strings and table rows. The compiled contracts need regenerating as in P2.

### P5. Ask the setup form through the question tool, with a recommendation

- **Closes:** the confirmed part of G3 and drift row 7.
- **Files:** `deep-research-presentation.txt:174` and `deep-review-presentation.txt:187`.

**1.** Replace the line `6. ASK with SINGLE prompt (include only applicable questions):` with the sentence the sibling commands already carry (`.skilled/commands/create/assets/create-readme-presentation.txt:72`):

```
6. Ask only the applicable questions, together in one turn, through the question tool that `.skilled/repo-rules/communication-handoff.md` §5 names for your runtime. Each question below becomes one tool question with its lettered options as the choices, and a free-text item such as a topic or a path is answered through the tool's own free-text option. When the tool caps how many questions one call holds, make consecutive calls in the same turn. Only where §5 names no tool for this session, print the form below as text. Do not split these questions across turns.
```

**2.** Mark the recommended options. Replace Q2 (`:185-187` and `:212-214`):

```
   Q2. Execution Mode (if no suffix):
     A) Autonomous (Recommended) -- runs every iteration, then reports
     B) Interactive -- stops for approval before each iteration, up to the iteration cap
```

and the first Q-Exec option (`:193` and `:220`), keeping each file's own agent name:

```
     A) Native (Recommended, default) — dispatch via @deep-research agent with Opus.
```

**3. Judgment, not measured.** Q-Exec's eight options carry up to four lines of flag internals each. Cut each option to its first sentence and move the rest into the paragraph that already follows the list (`:201`). I believe Claude Code's question tool takes at most four options per question, which would split Q-Exec across two questions. The repository does not record that limit and I did not test it.

- **Proof.** `sync-runtime-mirrors.cjs --check` and `validate-command-references.cjs`, as in commit `9e0d3a07a40`. Behaviour: one `:confirm` session whose first response is a tool question.
- **Blast radius.** Low. Wording in two assets, same regeneration note as P2.

### P6. Clear the drift

- **Closes:** G8 rows 1 to 6.

| # | File | Replacement |
|---|---|---|
| 1 | `runtime/lib/command-attach.ts:285-287` | Delete `'ask the council'`, `'convene'`, `'several models'` from `DEPTH_WORDING`. Keep `'final verdict'`, since a review ends in a verdict |
| 1 | `runtime/lib/scorer/lanes/explicit.ts:156` | Delete the line `'several models': [['system-deep-loop', 1]],` |
| 2 | `.skilled/skills/system-deep-loop/hub-router.json:34`, mirrored in `ROUTER.md:63` | Add to `research-aliases`: `"autonomous research"`, `"iterative research"`, `"multi-round research"`, `"deep investigation"`, `"comprehensive research"`. Then regenerate the hub's `graph-metadata.json` intent signals, the compiled contracts and the activation manifest, as commit `30ac5b51f95` did |
| 3 | `deep-review/SKILL.md:67-68` | Remove "audit spec folder" and "pre-release review", the two phrases measured not to route. Probe the rest of the list (lines 66, 67, 69, 70, 72) before keeping or removing them |
| 4 | `deep-review/SKILL.md:57` | `- Invoke via /deep:review:auto or /deep:review:confirm` |
| 5 | `deep-research/SKILL.md:305` | `- **Gate 2**: skill routing through the advisor brief, or node .skilled/bin/skill-advisor.cjs advisor_recommend (hub phrases: deep research, research loop)` |
| 6 | `deep-research-presentation.txt:387`, `deep-research/references/guides/quick-reference.md:74` | Write the examples with `=`: `--max-iterations=5 --convergence=0.10` and `--max-iterations=15 --convergence=0.02` |

- **Proof.**
  - Row 1: probe H3b must stop topping `system-deep-loop`. Whether `/speckit:ai-council` then wins is unknown.
  - Row 2: probes K1 and K2 must top the hub with the research mode. Each new alias must also be replayed against an out-of-domain prompt, which `.skilled/repo-rules/skill-hub-routing.md` §4 requires, because commit `30ac5b51f95` records that a bare "research run" pulled an unrelated user-research prompt. Run the parent-skill checker with the hub path and read its subject line (§3 of the same rule).
  - Rows 3 to 6 are text.
- **Blast radius.** Row 1 is advisor code, medium, and can ship with P1. Row 2 changes hub routing and falls under the hub routing rule. Rows 3 to 6 are low.

### Recorded, not fixed

The three false offers in G5 and the misroutes in G7 rest on one probe each. That is not enough to earn a new guard. Add them to `command-prompts.jsonl` as near-miss rows so the next tuning pass sees them: N7, N9, D1, V7, H6, A3.

---

## 5. Open questions only the operator can answer

1. **Where does "depth wording" end?** The recorded decision offers a deep loop only on depth wording. Does asking to run the loop by name count ("run an iterative review loop", "run 5 iterations")? P1 assumes yes. And should "do a thorough code review" offer `/deep:review` or stay single-pass review? P3 flips it unless you say otherwise.
2. **After a yes on the offer, what starts?** P2 recommends `:auto` with the composed flags, so the operator answers once. Today's reading of Gate 2 leads to the no-suffix form and a second round of questions. `:confirm` stops before every iteration. Which do you want as the default?
3. **Should the advisor carry the proposed invocation, or only the command?** P2 keeps the advisor as it is and has the AI compose from the command's own text. A `proposedArgs` field on the recommendation would be testable by probe, at the cost of flag knowledge living in the advisor. I recommend the text first and the field only if behaviour runs show the model ignoring it.
4. **Which executor should an offer propose?** The form says native with Opus is the default. Your standing model-routing preference separates busy work from code and review. Should a research offer propose a `cli-*` executor, or always native unless the request names one?
5. **Should `/doctor:deep-loop` outrank a new run when the wording is a complaint?** D1 offered a new review to someone asking why a review will not converge. And should a `run` command ever start on a prompt that opens with "explain" (N7)?
6. **The corpus holdout rows.** To run the repository's corpus I read the three deep-family holdout prompts, and their text appeared in my tool output. It is not reproduced in this document, and the proposals were drafted from my own probes. If you build P1 or P3 from this document, decide whether those three rows still count as sealed or should be replaced, as packet 018 did for a leaked row.
