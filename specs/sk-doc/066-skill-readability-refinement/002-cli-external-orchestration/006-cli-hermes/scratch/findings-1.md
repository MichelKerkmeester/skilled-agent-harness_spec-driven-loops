### .skilled/skills/cli-external-orchestration/cli-hermes/README.md
- [P1] README.md:148 | 8 | The `.hermes/` surface index (141-146) omits `.hermes/agents/` and `.hermes/manual-testing-playbook/`, both live symlinks, and line 148 then asserts "There is no `.hermes/agents/`" while line 73 tells the reader to dispatch through that folder. | Add rows after line 146 and replace line 148 with:
  ```
  | `.hermes/agents/` | Whole-directory symlink to `.skilled/agents`; each file is mirrored as the `agent-<name>` skill |
  | `.hermes/manual-testing-playbook/` | Whole-directory symlink to this packet's playbook root |
  ```
  ```
  There is no Hermes flag that loads an agent file, so `.hermes/agents/` is only the source the `agent-<name>` skills are generated from.
  ```
  and add `.hermes/agents/` to the Repo surface row at line 40.
- [P2] README.md:102 | 8 | The STRUCTURE tree lists every packet folder but not `hard-rules.json` at the packet root, and the Path table (119-137) repeats that gap and also omits `manual-testing-playbook/`, `benchmark/` and `changelog/` that the tree shows. | Insert after line 104:
  ```
  +-- hard-rules.json            # Dispatch preflight checks read beside SKILL.md
  ```
  and add after line 131:
  ```
  | `hard-rules.json` | Dispatch preflight checks read beside `SKILL.md` |
  | `manual-testing-playbook/` | Playbook root, symlinked into `.hermes/` |
  | `benchmark/` | Benchmark index for playbook-derived reports |
  | `changelog/` | Packet-local changelog |
  ```
- [P2] README.md:27 | 7 | One paragraph carries four mechanisms: the missing agent flag, the generator mirror, the plugin binding, and the inline fallback. | Replace line 27 with:
  ```
  **Hermes has no agent flag.** Its profiles are whole-home islands and its sub-agents receive a goal and context rather than a file, so there is nothing to point at. A persona therefore reaches a session two ways at once:

  - The generator mirrors each shared agent as the preloadable skill `agent-<name>`, which carries the whole text.
  - An environment variable names it, so the repo plugin binds it for the session.

  Inlining the persona at the top of the prompt stays the fallback for a run without the plugin or the mirror, which keeps every dispatch `{persona + task}` and never a bare task.
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/ROUTER.md
- [P2] ROUTER.md:64 | 5 | The self-invocation skip gate sits after Prerequisite Detection, the first dispatch step it governs. | Move lines 64-87 to after line 54, and in line 51 replace `the prerequisite probes, the self-invocation guard` with `the self-invocation guard, the prerequisite probes`.
- [P2] ROUTER.md:60 | 2 | `render_bare_url`: the URL sits inside a `~~~` fence, which the render check does not track as code, so it reports a bare URL. | Change the opening `~~~bash` on line 59 to ```` ```bash ```` and the closing `~~~` on line 62 to ```` ``` ````. Content is unchanged and the warning clears.
- [P2] ROUTER.md:144 | 7 | The Call Sequence sentence packs six helper bodies and two documents into one paragraph. | Replace line 144 with:
  ```
  The call sequence is `route_hermes_resources(task)`. Its helper bodies are written once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md) with `<PROVIDER>` set to `hermes`:

  - `discover_markdown_resources()`
  - `_guard_in_skill()`
  - `load_if_available()`
  - `score_intents()`
  - `select_intents()`
  - `get_routing_key()`
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md
- [P1] SKILL.md:20 | 9 | The body carries a phase number ("the phase 001 research synthesis") and pending-work language ("once recorded", "await the pin"), and the contract pin exists at the linked path, so the sentence tells a reader a recorded artifact is still outstanding. | Replace lines 20-25 (keeping both citation targets and the v0.21.1 provenance) with:
  ```
  provider. The evidence base is the research synthesis and the contract pin:
  [research synthesis](../../../specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/research.md),
  [contract pin](../../../specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin/implementation-summary.md).
  Claims marked **source-read, unconfirmed** come from the installed Hermes source (v0.21.1) and stay
  unconfirmed until a live run records otherwise.
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/assets/prompt-quality-card.md
- [P2] prompt-quality-card.md:20 | 4 | The OVERVIEW is a bare paragraph: no Purpose and no When to Use, unlike the asset template and the sibling `cli-pi` card. | Replace `## 1. OVERVIEW` plus the paragraph at line 22 with:
  ```
  ## 1. OVERVIEW

  ### Purpose

  This card is the Hermes-specific layer over the canonical prompt-quality card: framework choice and quality checks stay canonical, and only the mechanics of a safe Hermes dispatch live here.

  ### When to Use

  - Composing or reviewing any Hermes dispatch prompt
  - Checking a prompt for the Hermes mechanics the canonical card does not carry
  - Resolving which tier of the two-tier precedence rule applies
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/assets/prompt-templates.md
- [P2] prompt-templates.md:85 | 7 | One paragraph packs six builder flags, the stdin choice, the toolset-plus-web policy and the reasoning tier. | Replace line 85 with:
  ```
  The builder emits this shape:

  - `chat -Q --oneshot --query-file -`, with the prompt on stdin
  - `--yolo`, `--ignore-rules` and `--source tool`
  - `--max-turns 200`
  - `--run-budget` one margin under the lineage timeout
  - `-t terminal,file,skills,todo`, plus `web` per the web-search policy
  - `--reasoning max`, the roster's pinned tier

  `--worktree` and `-z` never appear.
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md
- [P1] agent-delegation.md:46 | 10 | `## 3A.` is a letter-suffixed H2, the one `render_h2_numbering` finding the skill's known-debt record tolerates. | Renumber in place: `3A`→`4`, `4`→`5`, `5`→`6`, `6`→`7`; heading text after each number stays identical. Verified this clears the render warning, and no inbound citation into this file names a section number.
- [P2] agent-delegation.md:19 | 4 | The OVERVIEW contains only Core Principle, with no Purpose and no When to Use. | Insert after the Core Principle paragraph:
  ```
  ### Purpose

  Records every route a repo persona can take into a Hermes dispatch, and the reason a profile or a `delegate_task` child cannot stand in for one.

  ### When to Use

  - Composing a dispatch that carries a resolved agent persona
  - Deciding whether to preload `agent-<name>` or inline the persona
  - Checking what a `delegate_task` child may and may not do
  - Finding the prompt template for a nested `.skilled/commands` command
  ```
- [P2] agent-delegation.md:48 | 7 | A single paragraph carries five mechanisms: the agents link, the generator mirror and its size limit, the plugin binding, the `--ignore-rules` evidence, and the inline fallback. | Replace line 48 with:
  ```
  `.hermes/agents/` links the shared runtime-neutral agent files, and `sync-skills-hermes.cjs` mirrors each as the preloadable skill `agent-<name>` because Hermes has no agent flag and caps a plugin prompt section at 4000 characters (a 22k persona in a section was skipped outright).

  The native-shaped dispatch pairs:

  - `-s agent-<name>`, the skill that carries the whole persona
  - `HERMES_AGENT_PERSONA=<name>`, the name the plugin's persona section binds for the session

  `HERMES_ENABLE_PROJECT_PLUGINS=1` must be set for the plugin to load.

  `--ignore-rules` is passed alongside `-s`: a live A/B under the flag showed the preload still reaching the model, so omitting it only bled SOUL.md, memories and session search into the leaf. Inline stays the fallback for a run without the plugin or the mirror.
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md
- [P2] cli-reference.md:22 | 4 | The OVERVIEW opens with a description of Hermes and the headless forms table, with no Purpose and no When to Use. | Insert after `## 1. OVERVIEW`:
  ```
  ### Purpose

  Be the single source a dispatcher checks before running Hermes, so every flag, exit code and approval rule a run depends on is looked up rather than remembered.

  ### When to Use

  - Composing or auditing a `hermes chat` dispatch command
  - Looking up a flag, an exit code or an environment variable
  - Deciding whether a run may write or must stay read-only
  ```
- [P2] cli-reference.md:82 | 7 | A ~180-word paragraph packs ordinary writes, the approval gate, the blocked-call message, the `--yolo` lift, hardline floors, the missing sandbox and terminal backends. | Replace line 82 with:
  ```
  Observed 2026-09-14, correcting the source-read claim the research carried:

  - **Ordinary writes and commands need no flag.** A headless `chat -q` runs them without approval.
  - **Only a flagged call reaches the approval gate.** That covers Hermes's dangerous-command pattern set, for example `rm -rf <path>`, and a write whose immediate parent directory is `.hermes`.
  - **A blocked call says so.** In single-query mode without `--yolo` the call is blocked with `BLOCKED: Command flagged as dangerous (...) but single-query mode (-q) runs without a user present to approve it`.
  - **`--yolo` lifts that gate.** `approvals.single_query_mode: approve` in `config.yaml` does the same globally. Hardline floors stay blocked even under `--yolo`.
  - **There is no OS sandbox flag.** A read-only dispatch is read-only because its `-t` list omits `terminal` and `file`.
  - **Terminal backends** (docker, ssh, modal and others) are config-level hardening, not per-run flags.
  ```
- [P2] cli-reference.md:128 | 7 | Both paragraphs in this section are comma-run lists of commands, so a reader has to parse eleven commands out of prose. | Replace lines 128-130 with:
  ```
  Never run:

  - `hermes skills trust|install|update`
  - `hermes mcp add|remove`
  - `hermes plugins install|enable`
  - `hermes config set`
  - `hermes import-agent`
  - `hermes setup`, `hermes update`
  - `hermes profile create|use`

  Each changes the operator's `~/.hermes`. A prompt that needs one stops and reports.

  Read-only commands a dispatch may run, always with stdin closed:

  - `hermes --version`
  - `hermes status` (which does not show custom providers)
  - `hermes doctor`
  - `hermes config show|get`
  - `hermes tools list`, `hermes skills list`, `hermes plugins list`, `hermes mcp list`, `hermes hooks list`
  - `hermes prompt-size`
  ```

### .skilled/skills/cli-external-orchestration/cli-hermes/references/hermes-tools.md
- [P2] hermes-tools.md:21 | 4 | The OVERVIEW contains only Core Principle, with no Purpose and no When to Use. | Insert after the Core Principle paragraph:
  ```
  ### Purpose

  Give a dispatcher the Hermes surfaces that behave unlike every sibling, so it knows what a leaf may rely on and what stays an operator step.

  ### When to Use

  - Choosing the `-t` toolset list for a leaf
  - Checking whether a project skill or plugin will load
  - Planning a write that lands inside `.hermes/`
  - Deciding whether MCP, hooks or profiles can ship in the repo
  ```
- [P2] hermes-tools.md:55 | 7 | One bullet carries three separate mechanisms in ~120 words: scanner cost and quarantine, the generated copies, and the listing behavior. | Split at the sentence boundaries into three bullets: keep the first sentence on line 55, then add as new sibling bullets `The repo therefore ships … (verified live for \`sk-git\`, \`cli-hermes\` and \`system-spec-kit\`).` and `` `hermes skills list` enumerates … excluded from the index. ``
- [P2] hermes-tools.md:88 | 9 | "documented in this packet" is the progress token the rubric bars from the body. | Replace `Each is an operator step documented in this packet; a dispatch never performs one.` with `Each is an operator step this skill documents; a dispatch never performs one.`
