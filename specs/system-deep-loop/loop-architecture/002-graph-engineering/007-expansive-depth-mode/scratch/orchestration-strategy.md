# Orchestration strategy: building phases 001-013 plus 014

Analysis only. Nothing here was dispatched. Every executor fact cites the file it came from; probes I ran are marked **probed 2026-11-17**. Anything the docs do not settle is marked UNKNOWN with what would settle it.

Packet: `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode` (PKT below). Build model: DeepSeek V4.1 Flash at max reasoning.

---

## 0. Operator decisions 2026-11-17 (these override anything below that disagrees)

1. **001 merges first.** Wave 1 builds 001, 003, 005, 007 and 009 in parallel; 001 merges before any other phase.
2. **One sk-git worktree per phase**, created only through the sk-git allocator. No phase shares a worktree, and no branch is made with git primitives.
3. **Concurrency 8 across three DeepSeek V4.1 Flash max pools**: cli-pi on `llmgateway`, cli-mistral-vibe (the Mistral Vibe CLI with `deepseek-flash`, whose row carries `thinking = "max"`), and cli-opencode on OpenCode Go. This is the explicit N that cli-opencode `integration-patterns.md` §8 requires. It is a ceiling, not a target: each phase is a serial chain of one-change dispatches, so the real number of live dispatches equals the number of live phases, which peaks at 5 in waves 1 and 2 (section 5).
4. **Playbooks per phase.** Each implementation phase writes its own manual testing playbook scenarios through `/create:manual-testing-playbook`. Phase 014 only verifies coverage, updates the feature catalogs and runs `/local-doc-alignment` and `/local-skilled-alignment`, fixing findings and rerunning. The per-phase list is in `cross-phase-handoff.md` §1.
5. **The "OpenCode Go hangs" claim is downgraded** (section 2): no repository evidence shows a pinned Go route hanging.
6. **Build order** follows the plan review's X-4: 005 before 004; 012 before 010 and 011; 003 and 004 before 011; 010 after 004-007; 011 after 008-010; 014 last. The waves in section 5 are rebalanced for it.

---

## 1. Facts that change the plan

1. **The dispatch unit is one task, not one phase.** cli-pi Rule 12 (`cli-pi/SKILL.md:168-169`): "A DeepSeek V4.1 Flash build brief carrying five changes across five runtime files read about 995,000 characters in 25 minutes and wrote nothing. Chain the changes as separate dispatches." cli-mistral-vibe Rule 11 says the same, and the operator's standing feedback is "short, one change, literal". So each phase is a **serial chain of one-task dispatches in its own worktree**, and parallelism exists only **across phases**. Phase size is measured in open tasks (`tasks.md`): 001 has 28, 010 has 33, 011 has 32, 002/004/006/007/012 have 10, 009 has 12, 014 has 10, 005 has 9, 003/008/013 have 7. The 010, 011 and 014 counts are after the 2026-11-17 plan-review edits; the others are from the first read and change as their phases add the handoff tasks.
2. **The critical path is 001, then the slowest of 004, 006 and 012, then 010, then 011, then 014**, about 28 + 10 + 33 + 32 + 10 open tasks. 005 runs in wave 1, so 004's wait on it costs nothing as long as 005 merges before 001 does. That chain sets wall-clock time. Making the waves wider does not shorten it.
3. **Hidden hotspot: the two compiled contracts.** `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown` carry sha256 `sourceDigests` of both workflow YAMLs, both command docs, both configs, both prompt-pack templates, both agents, both loop-protocol docs and more. `runtime/tests/unit/check-contract-drift.vitest.ts:171` ("passes against the real current compiled contracts") fails the full vitest gate in any tree where a digested source changed without regeneration. Phases 001, 002, 005, 008, 010, 011, 012 and 013 touch digested sources, but only 005 lists the regeneration. No "Files to Change" table lists these two files, and yet every one of those phases writes them.
4. **The spec-gate env name in the brief is stale.** The code reads `SYSTEM_SPEC_GATE_ENFORCE` (`.skilled/bin/worktree-session.sh:174-192`, `.opencode/plugins/system-spec-gate.js:163`, `.claude/hooks/README.md:126`). `git grep -n MK_SPEC_GATE_ENFORCE -- ':!specs'` returns no match in any tracked file, hidden directories included (probed 2026-11-17). The operator's memory note for packet 020 carries the old name. Use `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 ... </dev/null`.
5. **Dependencies come from the parent map, research §20 and each child's Dependency row.** The `Predecessor`/`Successor` rows in 003 through 008 form a numbering chain (003 to 004 to 005 to 006 to 007 to 008) that contradicts their own Dependency rows ("None. This phase has no prerequisite slice"). The authoritative sources agree with each other, so this is not a Logic-Sync halt. The hard edges are 010 after 004, 005, 006, 007 and 012, and 011 after 003, 004, 008, 009, 010 and 012, plus 004 after 005 (plan review X-4: 004 reads a heading the pack emits only after 005). 001 comes first by order and by operator decision.
6. **Line anchors will go stale.** 001 inserts steps into both YAMLs, which shifts every line cited by 002 (`:1442`), 012 (`:1112-1207`, `:1206`) and 013 (`:1539`, `:1634`). Briefs anchor on step and function names, never on line numbers.
7. **Command workflows run natively, not through DeepSeek briefs.** Each phase's playbook task runs `/create:manual-testing-playbook` natively in that phase's worktree, after its code tasks and before its gate. Phase 014 runs natively through `/create:feature-catalog`, `/local-doc-alignment` and `/local-skilled-alignment`, plus a coverage check over the scenarios the phases wrote. Under the PLAN-WORKFLOW LOCK none of these is split into single-change briefs. 014 has 10 open tasks.
8. **No `timeout` or `gtimeout` binary on this machine** (probed 2026-11-17: `command not found`, and `command -v gtimeout` is empty). Hang detection needs a PID watchdog (section 9).

---

## 2. Executor comparison

All three reach DeepSeek V4.1 Flash, and they are three **separate quota pools**: OpenCode Go, DevPass (LLM Gateway) and Mistral's Vibe budget. That is the strongest argument for using more than one.

| | cli-opencode + OpenCode Go | cli-pi + llmgateway (DevPass) | cli-mistral-vibe + deepseek-flash |
|---|---|---|---|
| **Exact model id** | `opencode-go/deepseek-v4.1-flash` (probed 2026-11-17: listed by `opencode models --standalone` on 2.3.0 and `opencode1 models opencode-go` on 1.19.x) | `llmgateway/deepseek-v4.1-flash-1017` (`cli-pi/references/providers-and-models.md:100`) | alias `deepseek-flash`, which resolves to row `deepseek-v4-1-flash-1017` on provider `mistral` (`cli-mistral-vibe/references/providers-and-models.md:75,84`) |
| **Which release** | The Go gateway's own `deepseek-v4.1-flash`. Pi's roster says the Go and DevPass routes "now carry different releases" (`cli-pi/.../providers-and-models.md:96`), so this is **not** the 2026-10-17 release. The exact Go build is UNKNOWN | 2026-10-17 release | 2026-10-17 release, hosted by Mistral |
| **Max reasoning** | OpenCode 2: `-m opencode-go/deepseek-v4.1-flash#max`. OpenCode 1: `--model opencode-go/deepseek-v4.1-flash --variant max` (`cli-opencode/references/providers-and-models.md:78,157`) | `--thinking max` (`cli-pi/.../providers-and-models.md:100`; the fan-out pin `isFlashMaxPinnedModel` forces max) | No flag exists. `thinking = "max"` is a property of the row (`cli-mistral-vibe/SKILL.md:89`, NEVER 6) |
| **Credential** | Present on both versions (probed: `opencode auth list` shows "OpenCode Go API key stored", and `opencode1 providers list` shows "OpenCode Go api") | `LLMGATEWAY_API_KEY` is set (probed) | Keychain item `ai.mistral.vibe`, exported as `MISTRAL_API_KEY` before launch (`SKILL.md:98`). Presence not probed |
| **Binary** | `opencode v2.3.0` (probed). The skill is verified on 2.3.0 and 1.19.4 | `pi` 1.5.2 (probed). Record the version at run time (`cli-pi/references/cli-reference.md:36,59`) | `vibe 3.1.2` (probed), which matches the hard pin |
| **Live quota** | UNKNOWN. The Go plan is a "subsidized 2x usage" monthly window. Pi's roster records that window closing mid-program on 2026-09-07 (`cli-pi/.../providers-and-models.md:96`); that is a past window, not today's. The endless-429 symptom in `cli-opencode/SKILL.md:141` is documented for a run that **inherits** an out-of-quota default provider without `-m`; every shape in this plan pins `-m`. Whether a pinned Go route with an empty quota also retries silently is UNKNOWN; the step-0 probe settles it | UNKNOWN rate limit. Standard tier, so "no weekly cap applies" (`cli-opencode/.../providers-and-models.md:90`) | UNKNOWN. An exhausted budget fails with `402 API budget exhausted` (`cli-mistral-vibe/.../providers-and-models.md:158`) |
| **Cost** | Flat subscription inside the window, catalog $0.15 in / $0.60 out per 1M tokens (`:78`) | $0.15 in / $0.60 out / $0.003 cached per 1M, billed per token, discounted by the 3x credit bonus (`:100`) | Bills the Vibe plan budget with the sign-in key. List rate is $0.30 / $1.20 / $0.007 (`cli-pi/.../providers-and-models.md:111`) |
| **Concurrency ceiling** | Documented default is **one dispatch at a time**. N parallel runs need explicit operator authorization, and each is killed by its own PID (`cli-opencode/references/integration-patterns.md:424-434`). Provider rate limit UNKNOWN | No documented ceiling, and no single-dispatch rule in the packet. Provider rate limit UNKNOWN | No documented ceiling. Provider rate limit UNKNOWN |
| **Write confinement** | Weakest. OpenCode 2 takes its working directory from `PWD` and "names the repository's first checkout as the workspace root", so a worker in a linked worktree can write into main (`cli-opencode/SKILL.md:242`, `shared/references/child-dispatch-preamble.md` "The Repository Root Line"). A 2026-05-04 incident deleted 44 files (RM-8, `SKILL.md:237-246`). There is a probe: `cli-opencode/scripts/probe-worktree-confinement.cjs` | Runs in its cwd. `--tools` gives a least-privilege allowlist (`cli-pi/SKILL.md:112`). Confinement beyond cwd is not documented: UNKNOWN | A write into a checkout needs `--add-dir <checkout>` plus a scratch cwd **inside** the checkout, below its root, with `VIBE_HOME` outside it (`SKILL.md:94`). A lineage "runs with `--auto-approve` and has no confinement" (`SKILL.md:190`) |
| **Outcome signal** | JSON event stream (`--format json`). The exit code is not a verdict | Exit code is "never an availability or auth signal" (`SKILL.md:86`). Print mode buffers until the end, so an empty log mid-run looks the same as a hang (`SKILL.md:78-83`) | Strongest: `out/export.json` must record `exit_code` 0 **and** `outcome` `finished` (`SKILL.md:116`). A denied tool call can still exit 0 (`SKILL.md:88`) |
| **Runaway guard** | None built in | None built in | `--time-limit`, `--max-price`, `--max-turns`, `--max-tokens`. A tripped budget gives exit 3 (`cli-reference.md:112-123`) |
| **Quirks to honor** | `</dev/null` always. `--standalone` required on OpenCode 2. Pin `-m` always. No `--agent`. Inline the persona. Never `--share`. Kill only by captured PID. The full plugin runtime loads | `</dev/null`. `--offline`. Provider-qualified `--model` only, because the split form is refused. `PI_BLACKHOLE_PASSIVE=true`, or pi-blackhole compacts the child at 272K tokens and sends it back to reading (`SKILL.md:90-94`). A broken `.pi/extensions/*.ts` fails the whole session | Copy `.vibe/config.toml` into a fresh `VIBE_HOME`, or the alias exits 1. Render the hooks with `render-home-hooks.cjs`. Print mode only. Experimental: "behavior outside the saved captures stays UNKNOWN" |
| **Build-write evidence** | Dispatch-verified 2026-09-11 for the Go DeepSeek route (`providers-and-models.md:78`). Per-file build writes on Go DeepSeek V4.1 Flash max are recorded, through cli-pi on opencode-go (`specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement/003-hook-docs-and-standards-alignment/plan.md:30`), and an OpenCode 1.18.32 pre-flight on `opencode-go/deepseek-v4.1-flash` passed (`.../001-git-hook-review-fixes/plan.md:110`). A build through cli-opencode on OpenCode 2 is not recorded | DevPass DeepSeek is the deep-loop fan-out default. The one recorded build failure is the multi-change brief above | "a child write went through" from a scratch cwd (`manual-testing-playbook.md:325`). A multi-file write under `--add-dir` into a worktree is UNKNOWN, and so is whether print mode needs `--auto-approve` for those writes |

**Reliability ranking for build writes (my judgment from the docs above; a step-0 probe per lane would change it):** cli-pi/DevPass first, then cli-opencode/Go (unknown live quota and the OpenCode 2 confinement risk, not a recorded hang), then cli-mistral-vibe (experimental write path).

**On the "OpenCode Go hangs" claim (operator question, checked 2026-11-17).** Repository evidence does not support it as a property of the Go route. The two documented hangs are an **unpinned** run inheriting an out-of-quota default provider (`cli-opencode/SKILL.md:141`) and a missing `</dev/null` on OpenCode 1 (`SKILL.md:139`, `references/providers-and-models.md:185`). Every dispatch shape here pins `-m` and closes stdin, which removes both causes. What stays UNKNOWN is the live Go quota and how a pinned route behaves when that quota is empty. The step-0 one-turn probe settles the first, and the 60 s watchdog in section 10 bounds the second. The claim is downgraded from "hangs" to "UNKNOWN for a pinned route".

---

## 3. Recommended executor mix

- **Primary lane: cli-pi + `llmgateway/deepseek-v4.1-flash-1017` + `--thinking max`.** It carries the critical-path phases 001, 004, 006, 010 and 011. 012, now also on the path to 010, sits on the Go pool with a move to Pi as its fallback. Reasons: the credential was probed, it serves the 2026-10-17 release, there is no weekly cap, there is no single-dispatch rule, and it does not load OpenCode's plugin runtime.
- **Second pool: cli-opencode + `opencode-go/deepseek-v4.1-flash#max`, on OpenCode 2.** It carries off-critical-path phases (005, 009, 012, 008). Its live quota is UNKNOWN until the step-0 probe; a stall is caught by the watchdog like any other lane. Fallback: move the phase to the Pi pool.
- **Third pool: cli-mistral-vibe `deepseek-flash`** (Mistral Vibe CLI; the row carries `thinking = "max"`). Small phases (003, 002, 013), and only after the step-0 write probe passes (section 11). Fallback: the Pi pool.
- **Recorded deviation.** cli-opencode Rule 15 L4 prefers `cli-copilot` + `gpt-6-sol` "for multi-phase / phase-parent targets". The operator named DeepSeek V4.1 Flash, and each dispatch here is one task inside one child phase in its own worktree. L1-L3 still apply in full.
- **Concurrent dispatches:** the operator authorized N = 8 on 2026-11-17, split as a per-pool ceiling of Pi 3, Go 3, Vibe 2. Because each phase runs one dispatch at a time, the live count is the number of live phases: 5 at most, in wave 1 (Pi 2, Go 2, Vibe 1) and wave 2 (Pi 2, Go 1, Vibe 2), so the ceiling is never reached by this wave plan. Do not cite the fan-out runner's cap. `executor-config.ts:912` (`max(8).default(2)`) applies to research/review lineages only, and these are build dispatches.

---

## 4. File-overlap matrix

Paths are abbreviated: `S/` = `.skilled/skills/system-deep-loop/`, `T/` = `S/runtime/tests/`. Only files touched by two or more phases are listed.

| File | Phases |
|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | 001, 002, 010, 012, 013 (005 check-only) |
| `.skilled/commands/deep/assets/deep-review.yaml` | 001, 008, 011, 012, 013 |
| `compiled/deep-research.contract.markdown` (regenerated) | 001, 002, 005, 010, 012, 013 |
| `compiled/deep-review.contract.markdown` (regenerated) | 001, 008, 011, 012, 013 |
| `.skilled/commands/deep/research.md` | 001, 010 |
| `.skilled/commands/deep/review.md` | 001, 011 |
| `S/runtime/scripts/convergence.cjs` | 003, 010, 011 |
| `S/deep-research/scripts/reduce-state.cjs` (research reducer) | 001, 004, 010 |
| `S/runtime/scripts/reduce-state.cjs` (review reducer) | 001, 004, 008, 011. **004 edits `:2184-2215` and 008 edits `:2185`, the same region** |
| `S/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | 001, 006 |
| `deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts` | 001, 006 |
| `S/runtime/lib/legacy-projections/deep-research-contract.ts` | 001, 006 |
| `S/deep-research/assets/deep-research-config.json` | 001, 010 |
| `S/deep-review/assets/deep-review-config.json` | 001, 011 |
| `.skilled/agents/deep-research.md` | 001, 010 (005 check-only) |
| `.skilled/agents/deep-review.md` | 001, 011 |
| `S/deep-research/assets/prompt-pack-iteration.md.tmpl` | 005, 010 |
| `S/runtime/lib/deep-loop/prompt-pack.ts` | 010, 011 |
| `S/runtime/scripts/fanout-merge.cjs` | 009, 010, 011 |
| `S/runtime/scripts/fanout-run.cjs` | 010, 011 |
| `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json` | 010, 011 |
| Frontier admission helper (name UNKNOWN, created by 010) | 010, 011 |
| `T/unit/verify-iteration.vitest.ts` | 006, 013 |
| `T/unit/deep-review-state-reducer.vitest.ts` | 004, 008 |
| `T/integration/review-depth-convergence.vitest.ts` | 003, 008, 011 |
| `T/unit/fanout-merge.vitest.ts` | 009 (and likely 010, 011 under "existing suites") |
| `T/unit/prompt-pack.vitest.ts` | 005 (and likely 010) |
| `T/unit/deep-research-reduce-state.vitest.ts` | 004 (and likely 010) |
| `T/integration/convergence-script.vitest.ts` | 007 (and likely 010 stop-decision cases) |

Phases sharing **no** file with 001, once contract regeneration is centralized: **003, 005, 007, 009**. Files owned by one phase only: `dispatch-iteration.cjs` and `executor-audit.ts` (002), `continuity-thread.cjs` (004), `upsert.cjs` and `coverage-graph-query.ts` (007), `divergent-pivot.ts` and `divergent-pivot.cjs` (012), and `divergent-review-pivot.ts` (011). Appends to the end of a shared test file conflict too, so shared test files count as overlaps.

---

## 5. Wave plan

Operator decision: **001 merges first**, and wave 1 builds 001, 003, 005, 007 and 009 in parallel. None of those four shares a file with 001 once contract regeneration is centralized (section 4). The waves below are rebalanced for the X-4 order. A phase may start as soon as every phase it waits on has merged, so the waves are a reading aid, not a barrier.

| Wave | Starts when | Phases (pool) | In-wave merge order |
|---|---|---|---|
| **1** | Baseline captured (section 8) | **001** (Pi, critical), 007 (Pi), 005 (Go), 009 (Go), 003 (Vibe, fallback Pi) | 001 first. Then 005 (004 waits on it), 007, 009, 003 as each finishes. None overlaps 001, so each rebases trivially |
| **2** | 001 merged; for 004 also 005 merged | **004** (Pi, critical), **006** (Pi, critical), **012** (Go, critical for 010 and 011), 002 (Vibe), 013 (Vibe, after the X-5 decision is recorded). Start 002 and 013 only once 003 has finished on Vibe, or move one of them to Pi, so the Vibe pool stays at 2 | 004 and 012 first, then 006. 013 after 006 (shared `verify-iteration.vitest.ts`). 002 last (shares `deep-research.yaml` with 012 and 013) |
| **3** | For 010: 004, 005, 006, 007 and 012 merged. For 008: 004 merged (shared review-reducer region) | **010** (Pi, critical), 008 (Go) | 008 when ready; 010 when ready, rebased onto any wave-2 straggler that touched `deep-research.yaml` |
| **4** | 003, 004, 008, 009, 010 and 012 merged | **011** (Pi, critical) | Single phase |
| **5** | 001-013 merged | **014**: coverage check, catalogs and both alignment checks, run natively through the commands (section 1 fact 7) | Single phase. A code finding goes back to the owning phase |

- **Live phases per wave** are 5, 5, 2, 1 and 1, so the operator's ceiling of 8 is never the limit. Wave 2 per pool: Pi 2 (004, 006), Go 1 (012), Vibe 2 (002, 013).
- **Why 012 moved up the queue.** 010 and 011 gate the pivot branch 012 rewrites, so 012 now sits on the path to 010. Merging it first in wave 2 keeps 010 from waiting on it.
- **Why 005 merges early in wave 1.** 004 cannot start until 005 has merged, and 004 is on the critical path.
- **Idle-lane note.** Wave 1's small phases finish well before 001's 28 tasks. Their lanes then sit idle until 001 merges. That idle time is the cost of 001 merging first with no conflicts.
- **Option B (accelerator, still needs operator approval).** Start 006 in wave 1 beside 001, in its own worktree, and merge it right after 001. 004 can no longer join it, because it must wait for 005. The price is a rebase over 001 in `legacy-compatibility.ts`, both ledger schema and type files and the research projection (001 adds the `run_extended` stem; 006 widens `iteration_completed`). Option A stays the recommendation, because 001's shared tables are its riskiest change.

---

## 6. Isolation

- **One git worktree per phase** (operator decision 2026-11-17), at the existing location `~/worktrees/public/NNN-<slug>`. It is outside the checkout, which avoids the OpenCode 2 ancestor-`.opencode` plugin merge that hits `.worktrees/` (`sk-git/references/worktree-workflows.md` §10).
- **Worktrees come only from sk-git.** Branches come only from the sk-git allocator (`sk-git/scripts/worktree-naming.sh create`), never from `git branch`, `git checkout -b` or `git switch -c`.
- **One integration branch** receives the phase merges in the order of section 9. Pushing to `main`, and any push outside the sk-git allowlist, waits for an explicit operator go-ahead.
- **OpenCode 2 confinement (required on the Go lane):**
  - a leading `cd "$WT"`
  - `PWD="$WT"` exported on the same command
  - the preamble's `REPOSITORY ROOT: $WT` line
  - `node .skilled/skills/cli-external-orchestration/cli-opencode/scripts/probe-worktree-confinement.cjs` run once against the exact dispatch shape before wave 1 (exit 1 means a tool path left the worktree)
  - the RM-8 L1 lines (section 7)
- **Vibe write shape:** `RUN_DIR` is a gitignored scratch folder inside the worktree, below its root. Pass `--add-dir "$WT"` with `VIBE_HOME` outside the checkout. Copy `config.toml` in and render the hooks. Whether that folder needs a `.gitignore` entry, or should live under the phase's own `scratch/` (which is tracked), is for the operator to decide at step 0.
- **Symlinked dependencies gap.** The worktree wrapper symlinks the shared `node_modules`/`dist` (`sk-git/SKILL.md:74-76`). For each phase, the verifier confirms the suites ran against the worktree's source and not main's built output. This matters most for 001's two `system-spec-kit` suites. If a suite imports a built `dist`, rebuild it inside the worktree first.
- **Freeze while a phase runs.** The orchestrator changes nothing inside a worktree while a dispatch is live there (`delegation-and-orchestration.md` §2.2).

---

## 7. Per-child dispatch brief shape

Before each dispatch, the orchestrator (Opus, native) turns one `tasks.md` implementation task into one brief. Setup and research tasks ("read X, record Y") and verification tasks run natively, never through DeepSeek. Template, under 40 lines:

```text
REPOSITORY ROOT: <worktree absolute path>
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.
You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0
are set. The spec folder is: <PKT>/<NNN-child> (pre-approved). Proceed directly. Do not print
A/B/C/D options. A failed edit match means a stale anchor: re-read the file and retry; halt
only after three failures on the same file. Your task is complete only when the file is
changed on disk and the check below has been run.

PERSONA: <operative core of .claude/agents/code.md: scope, verification, return shape>

TASK <Tnnn>: <one sentence>.
FILE: <one path>
ANCHOR: function `<name>` / YAML step `<step_id>` (not a line number)
EDIT: <literal before/after, or the exact rule to add>
ALLOWED WRITE PATHS: <that file> [+ <one named test file>]
BANNED OPERATIONS: git commit/push/reset/checkout/stash/rebase, rm of any tracked file,
  edits outside ALLOWED WRITE PATHS, regenerating compiled contracts, editing tasks.md,
  implementation-summary.md, spec.md or any spec-folder doc.
COMMENTS: keep the durable WHY; never put spec paths, phase numbers or REQ/ADR/task ids in code.
CHECK: cd .skilled/skills/system-deep-loop/runtime && npx vitest run <one suite>
RETURN: the changed path, the CHECK's last 15 lines and its exit code. Nothing else.
```

- **One change per brief:** one file, or one source file plus its one test. Chain the next brief only after the orchestrator has read the diff.
- **Persona trim, recorded as a deviation.** cli-opencode Rule 18 and the canonical card call for the full persona. `.claude/agents/code.md` runs to 454 lines, and the operator's "short brief" feedback wins here, so the trim is declared at each dispatch site.
- **Command shapes per lane.** The env prefix on all three is `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`.
  - Pi: `cd "$WT" && ... PI_BLACKHOLE_PASSIVE=true pi -p "$BRIEF" --model llmgateway/deepseek-v4.1-flash-1017 --thinking max --mode text --offline </dev/null > out.log 2> err.log`
  - OpenCode 2: `cd "$WT" && PWD="$WT" ... opencode run --standalone -m opencode-go/deepseek-v4.1-flash#max --format json "$BRIEF" </dev/null > out.jsonl 2> err.log`
  - Vibe: the `SKILL.md:72` shape plus `--add-dir "$WT"` and `--time-limit`. Add `--auto-approve` only if the step-0 probe shows writes are otherwise denied.

---

## 8. Verification gate per phase

**Before wave 1 (orchestrator, native):** run the full `npx vitest run` in `S/runtime`, plus the named `system-spec-kit` suites, on the main checkout. Record pass/fail counts. A phase is blamed only for failures beyond this baseline.

**After each dispatch (orchestrator):**
- `git -C "$WT" status --porcelain` lists only that brief's allowed paths.
- Read the diff.
- Run the brief's CHECK yourself. The child's report is a claim.
- For Pi, ignore the exit code and read the artifacts. For Vibe, require `export.json` `0`/`finished`. For OpenCode, parse the event stream for errors.

**Phase gate (native verifier: Sonnet for small phases; Opus for 001, 010, 011 and every merge). The playbook task (`/create:manual-testing-playbook`) runs natively before this gate, and the gate checks its scenario exists:**
1. Diff the paths against the phase's "Files to Change" allowlist, plus the two compiled contracts where section 4 lists them.
2. Regenerate the touched compiled contracts in the worktree (`node S/runtime/scripts/compile-command-contracts.cjs --command deep/research --write`, and the same for `deep/review`). This is an orchestrator step and never a child step.
3. Run the phase's named suites. Then rerun the full runtime vitest gate and compare against the baseline.
4. Run the phase-specific gates:
   - 001: `check-ledger-stem-producers.cjs` and `check-projection-coverage.cjs` exit 0; both `system-spec-kit` suites pass.
   - 006: `check-projection-coverage.cjs`.
   - 004 and 007: SC-001 fail-before/pass-after, proved by running the new cases on the pre-change commit.
   - 005: REQ-006 `git diff --stat` shows no `deep-review/` file.
   - 010 and 011: golden byte-identity on the default path.
5. Open every `file:line` the verifier quotes.
6. The verifier, not the child, ticks `tasks.md`, writes `implementation-summary.md` and runs `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <child> --strict`, requiring an explicit `RESULT: PASSED`. For Level 2 and 3 children (001, 010, 011), it also works through every row of `acceptance-criteria.md`.

---

## 9. Merge order and conflict plan

1. **Overall merge order:** 001, 005, 007, 009, 003, then 004, 012, 006, 013, 002, then 008, 010, then 011, then 014.
2. **Rebase before the final gate.** Each phase rebases onto the integration tip before its final full-suite run, so the gate tests the code that will actually merge.
3. **Compiled contracts never merge textually.** On a conflict, take either side, run `compile-command-contracts.cjs --write` for both commands on the merged tree, and rerun `check-contract-drift`.
4. **Workflow YAML conflicts** (002, 012 and 013 in `deep-research.yaml`; 008, 012 and 013 in `deep-review.yaml`; 010 and 011 later) are resolved natively by Opus, by step id. The edits sit in different steps (`if_cli_claude_code`, the pivot failure branch, `redispatch_once`, the dimension rule), so a 3-way merge usually resolves them. Rerun the YAML-reading suites, such as `stop-policy-yaml-parity` and the verify-iteration YAML assertion.
5. **Review-reducer region (004 and 008):** 008 waits for wave 3 by design. 008's briefs are written against the post-004 file, and no merge resolution is planned.
6. **Shared test files (006 and 013, 004 and 008, 003, 008 and 011):** keep both sets of cases, then rerun that suite.
7. **Merge by explicit path** (`git commit -- <paths>`), and only paths the orchestrator has read. Never `git add -A` (`delegation-and-orchestration.md` §7).

---

## 10. Failure and retry policy

- **Hang watchdog.** There is no `timeout` binary. Launch in the background and capture `PID=$!`. Poll every 60 s:
  - `git -C "$WT" status --porcelain` for progress
  - the log size
  - for OpenCode, `stream error ... 429` in a `--print-logs` stderr

  Kill only that PID and its children (`kill -9 $PID; pkill -9 -P $PID`), never a blanket `pkill -f`.
- **Wall-clock limit.** Proposed at 20 minutes per one-change brief, from the 25-minute no-write evidence. On Vibe use `--time-limit 1200`. This number is my judgment and the operator may set it.
- **Classify the failure before retrying.** A delegate that asked A/B/C/D or wrote nothing at exit 0 is a brief failure: grep the transcript for the question. A 401, 402, 429 or "No API key" in the output is a provider failure. A diff outside the allowed paths is a scope failure: revert those paths in the worktree only. A failed check is a code failure.
- **Retry ladder, per brief:**
  1. Re-dispatch once on the same lane, with the brief corrected for what the failure revealed (sharper anchor, smaller edit).
  2. Move to the Pi lane. If Pi itself failed, move to the Go lane.
  3. The orchestrator makes the edit natively and records why.

  Three failures on the same task is the stop point (`AGENTS.md` §3, three failed fixes). Record it in the phase's `scratch/` and do not loop.
- **Provider failure on a lane.** Stop new dispatches on that lane, move its queue to Pi, and tell the operator. Never substitute a model the operator did not approve (`cli-opencode/SKILL.md` Rule 11). GPT models stay off this plan.
- **Phase gate failure.** Repair it through new single-change briefs. The phase does not merge, and phases that depend on it in later waves do not start.

---

## 11. Operator steps and open items

**Step 0, before wave 1** (each step is a small live call, and the operator approves the spend):
1. One-turn probe per lane, reply-only (`OK`), each with `-m` pinned and stdin closed: Pi DevPass, OpenCode Go and Vibe `deepseek-flash`. This settles the live quota that is UNKNOWN in section 2, and the Go probe is the direct test of the downgraded hang claim.
2. Vibe write probe: one trivial edit into a throwaway worktree under `--add-dir`, with and without `--auto-approve`. Read `export.json` `config.enable_auto_approve` and the diff. If it fails, Vibe leaves the plan and 003 and 013 move to Pi.
3. Run `probe-worktree-confinement.cjs` against the OpenCode 2 dispatch shape.
4. Concurrency is authorized at N = 8 (operator, 2026-11-17); the per-pool ceiling is Pi 3, Go 3, Vibe 2.

**Decided by the operator on 2026-11-17:** 001 merges first; one sk-git worktree per phase; concurrency 8 across the three pools; each phase writes its own playbook scenarios (so 001's "both loop playbooks" entry stays in 001, written through the command).

**Still for the operator:**
- Option B (start 006 beside 001), yes or no.
- The X-5 decision for 013 and 006 (which landed reasons skip redispatch) before either builds.
- Accept or replace the Proposed ADRs in 010 (ADR-001 to ADR-005) and 011 (ADR-001 to ADR-004) before those phases start.

**Still UNKNOWN:**
- provider rate limits on all three lanes
- the Go route's exact DeepSeek build
- Vibe multi-file write behavior under `--add-dir`
- whether any suite in 001's `system-spec-kit` set reads a built `dist`
- whether the Go route's exact DeepSeek build matches DevPass's 2026-10-17 release
- 010's admission helper is now proposed as `runtime/scripts/frontier-admit.cjs` (010 plan ADR-004), pending operator acceptance
