# Iteration 4 - i-have-adhd rules and mechanism

## Focus

This pass maps the ADHD source's output rules against the repository's communication,
handoff, decision and evidence boundaries. It then records the implementation mechanism
separately, because a hook, mirror, eval harness or release gate is evidence about how a
rule is delivered, not itself a prose rule.

## Output findings

- **Reader-profile model, new.** The source defines output around an ADHD reader who must
  be able to act, and it uses that model to justify action-first delivery, bounded steps,
  visible progress and low-friction endings. The current stack optimizes actionability but
  does not name this reader profile. Candidate owner is the skill, scoped to explicit
  ADHD mode rather than the canonical communication rule. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:13-29`; `communication.md:49-59`]

- **Persistent mode after activation, new with a scope condition.** The source keeps the
  mode active until a stop phrase. Its explicit opt-in command and always-on marker make
  that persistence compatible as a user-selected skill mode. Making it the default for
  every reply would conflict with the communication skill's default-off projection and
  the repository's routed scope. Candidate owner is the skill. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:15-19`;
  `.opencode/skills/sk-communication/SKILL.md:1-14`;
  `scope-and-exemptions.md:15-41`]

- **Action first with a command, path or snippet, mixed.** The action-first part is
  already-covered by the first-line payload rule and verdict-first decision rule. The
  literal preference for a command, path or snippet before explanation is a new
  execution-facing refinement and must yield to a verdict when the task is a decision.
  Candidate owner is `repo-rules/communication.md`, with the skill as an opt-in mode.
  [SOURCE: `i-have-adhd-main/skills/i-have-adhd/SKILL.md:33-40`;
  `communication.md:136-145`; `presenting-decisions.md:48-63`]

- **Number more than one step and bound the work, already-covered with a new reader
  emphasis.** Numbered steps, a visible bookmark and retention of required work already
  exist. The ADHD source adds a stronger preference for the fewest bounded steps, but its
  own escape hatches preserve full explanation and required checks. Candidate owners are
  `repo-rules/communication.md` and the skill for the reader-specific emphasis. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:42-55, 119-128`;
  `communication.md:160-181`; `AGENTS.md:204-209`]

- **End with one concrete next action under two minutes, mixed.** A concrete final handoff
  is already-covered. The under-two-minute bound is new and useful as a default for an
  open task, but it cannot replace a necessary longer action or a required verification.
  Candidate owner is `repo-rules/handoff-and-questions.md`. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:57-62, 119-128`;
  `handoff-and-questions.md:55-84, 88-112`; `evidence-and-proof.md:1-40`]

- **Suppress tangents and offer a second issue once at the end, already-covered.** The
  communication rule has the same single-answer and one-line tangent boundary. Candidate
  owner is `repo-rules/communication.md`. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:64-71`;
  `communication.md:199-206`]

- **Restate state every turn, contradicting as a literal rule.** The source asks for a
  state restatement on every turn. The repository instead triggers state restatement when
  the handoff state changes or the operator needs a new boundary, so repeating it every
  turn would add the recap that the same source asks to suppress. Candidate owner of the
  existing boundary is `repo-rules/handoff-and-questions.md`. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-80, 109-117`;
  `handoff-and-questions.md:55-84`; `communication.md:101-116`]

- **Use a task or plan tool when the harness provides one, mixed.** Planning before a
  multi-step stretch is already-covered. Requiring a particular task tool in every
  compatible harness is new and runtime-specific, so it belongs in the opt-in skill
  mechanism rather than a prose rule. Candidate owners are the root `AGENTS.md` for the
  plan obligation and the skill for tool integration. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-80`;
  `AGENTS.md:175-179`]

- **Give concrete time estimates, mixed.** The repository already requires minutes or
  hours before a long invisible stretch. The ADHD source broadens that into a general
  expectation, which is new only when a task has an open duration or checkpoint. Candidate
  owner is `repo-rules/presenting-decisions.md`. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:82-87`;
  `presenting-decisions.md:115-133`]

- **Show visible progress, already-covered at checkpoints and new as a stronger mode
  emphasis.** The root register requires updates while work proceeds and presenting
  decisions requires checkpoint expectations. The source adds a more frequent reader
  signal, but the repository does not require a progress line after every action. Candidate
  owners are the root `AGENTS.md` and `repo-rules/presenting-decisions.md`. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:89-94`;
  `AGENTS.md:150-153`; `presenting-decisions.md:115-133`]

- **State errors matter-of-factly, already-covered.** The source rejects emotional error
  framing. The root quality and truth rules require evidence-based correction and the
  communication rule rejects performance. Candidate owners are the root `AGENTS.md` and
  `repo-rules/communication.md`. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:96-101`;
  `AGENTS.md:204-209`; `communication.md:210-218`]

- **Cap visible lists at five while retaining completeness, already-covered.** The source
  explicitly distinguishes what is shown from what is retained. Communication has the
  same cap, ranking and disclosure rule and it forbids omission of needed information.
  Candidate owner is `repo-rules/communication.md`. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:103-107`;
  `communication.md:172-181, 219-221`]

- **Remove preambles, recaps, tangents, empty hedges and idioms before sending, mixed.
  The individual deletions are already-covered by communication and the wording standard.
  The combined pre-send checklist and first-line or last-line test are new as a single
  workflow, with the stack's caveat and evidence exceptions preserved. Candidate owner is
  the wording standard, with communication for reply delivery. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:109-117, 130-142`;
  `communication.md:101-116, 136-145, 185-206`;
  `hvr-rules.md:290-333, 386-449`]

- **Escape hatches, already-covered.** Full explanation, destructive confirmation,
  debugging limits, ambiguity escalation, task wins and harness or system priority all
  have matching repository boundaries. Candidate owners are the root `AGENTS.md`, the
  relevant repo rules and the skill's scope section. [SOURCE:
  `i-have-adhd-main/skills/i-have-adhd/SKILL.md:119-128`;
  `AGENTS.md:59-86, 175-196`; `handoff-and-questions.md:88-136`;
  `blast-radius.md:1-80`]

## Mechanism findings

- **Session-start hook, new mechanism.** `hooks/always-on.mjs` reads an opt-in marker
  under `$CLAUDE_CONFIG_DIR`, defaults to `~/.claude`, resolves the skill relative to the
  plugin and strips frontmatter before printing the banner. It does not block startup when
  the marker or skill is absent. `hooks/hooks.json` runs it on startup, resume, clear and
  compact with a 30-second timeout. Candidate owner is the skill and its runtime hook,
  not a communication repo rule. [SOURCE:
  `i-have-adhd-main/hooks/always-on.mjs:1-44`;
  `i-have-adhd-main/hooks/hooks.json:1-17`]

- **Runtime mirrors and persistence, new mechanism.** The OpenCode plugin registers the
  canonical skill on demand, exposes the command and appends the rules through a system
  transform. The Pi extension persists mode state, marks rules as present, reinjects them
  after compaction and handles stop phrases. The compatibility module provides safe API
  fallbacks. Candidate owner is the skill's runtime integration layer. [SOURCE:
  `i-have-adhd-main/.opencode/plugins/i-have-adhd.mjs:1-99`;
  `i-have-adhd-main/extensions/i-have-adhd.ts:1-240`;
  `i-have-adhd-main/extensions/context-compat.ts:1-61`]

- **Runtime manifest coverage, new mechanism.** The source carries separate load metadata
  for the root plugin, Codex, Claude, Claude marketplace, Agents marketplace, OpenCode,
  Gemini, Qwen, Kimi and package entrypoints, plus the OpenCode command and Gemini
  instruction file. These manifests make cross-runtime parity an explicit release concern.
  Candidate owner is the skill's runtime manifest set. [SOURCE:
  `i-have-adhd-main/plugin.json:1-4`;
  `i-have-adhd-main/.codex-plugin/plugin.json:1-38`;
  `i-have-adhd-main/.claude-plugin/plugin.json:1-14`;
  `i-have-adhd-main/.claude-plugin/marketplace.json:1-16`;
  `i-have-adhd-main/.agents/plugins/marketplace.json:1-21`;
  `i-have-adhd-main/opencode.json:1-4`;
  `i-have-adhd-main/gemini-extension.json:1-6`;
  `i-have-adhd-main/qwen-extension.json:1-6`;
  `i-have-adhd-main/kimi.plugin.json:1-12`;
  `i-have-adhd-main/package.json:1-16`;
  `i-have-adhd-main/.opencode/command/i-have-adhd.md:1-8`;
  `i-have-adhd-main/GEMINI.md:1-5`]

- **Evaluation harness, mixed.** The harness validates, plans, runs, judges and scores
  identical cases with isolation flags, a pinned model, retries and resumability. The
  rubric requires no blockers, correctness and safety within 0.1 of baseline or better,
  and a higher weighted score. The result record reports a weighted improvement of 0.427
  and fewer blockers, but the release gate still failed because the candidate retained
  three blockers and the absolute no-blocker rule won. The repository already requires
  fail-closed quality gates, but this case matrix, rubric and judge are new. Candidate
  owner is the skill. [SOURCE: `i-have-adhd-main/evals/README.md:1-84`;
  `i-have-adhd-main/evals/rubric.md:1-26`;
  `i-have-adhd-main/evals/RESULTS.md:1-111`;
  `i-have-adhd-main/scripts/run_evals.py:119-216, 330-372`;
  `i-have-adhd-main/scripts/judge.py:35-80, 135-240`;
  `sk-communication/SKILL.md:142-165`]

- **Load and release gates, mixed.** The source runs native hook checks, Claude scratch
  installation, Cursor parity comparison and Pi installation checks. The Pi checker
  verifies manifest parity, command and status behavior, persisted mode and reload, while
  the hook tests verify parity, silence, frontmatter handling and missing-plugin behavior.
  The fail-closed shape matches the communication skill's release rule, but the specific
  cross-runtime gates are new. Candidate owner is the skill's release workflow. [SOURCE:
  `i-have-adhd-main/.github/workflows/plugin-load-check.yml:1-47`;
  `i-have-adhd-main/.github/workflows/cursor-skill-sync.yml:1-25`;
  `i-have-adhd-main/.github/workflows/pi-load-check.yml:1-31`;
  `i-have-adhd-main/scripts/check_pi_extension.py:23-38, 304-400`;
  `i-have-adhd-main/tests/test_always_on_hooks.py:88-169`;
  `sk-communication/SKILL.md:188-217`]

## Contradiction list

- **C-A-01, every-turn state restatement.** It conflicts with the existing triggered,
  not-timed state handoff rule and would reintroduce recap the communication rule removes.
  Keep state restatement event-driven, then allow explicit ADHD mode to request more
  frequent reminders when the user needs them. [SOURCE: `SKILL.md:73-80, 109-117`;
  `handoff-and-questions.md:55-84`; `communication.md:101-116`]

- **C-A-02, default persistence.** Persistence after explicit activation is compatible.
  Making the mode universal would conflict with default-off projection and triggered
  routing. [SOURCE: `SKILL.md:15-19`; `sk-communication/SKILL.md:1-14`;
  `scope-and-exemptions.md:15-41`]

## Convergence telemetry

The ADHD output rules mostly restate the existing actionability, numbering, tangent,
handoff, list-cap and evidence boundaries. The genuinely new material is the reader
profile, opt-in persistent runtime, two-minute default, combined pre-send checklist and
cross-runtime mechanism. New-information estimate is 0.64, and the max-iterations policy
keeps the loop open. [SOURCE: `i-have-adhd-main/skills/i-have-adhd/SKILL.md:13-142`;
`communication.md:49-221`; `handoff-and-questions.md:55-136`]

## Next focus

Consolidate all classifications in iteration 5. Reconcile the sibling DeepSeek synthesis
against the source-to-stack evidence, list disagreements with reasons and preserve the
separate contradiction list.
