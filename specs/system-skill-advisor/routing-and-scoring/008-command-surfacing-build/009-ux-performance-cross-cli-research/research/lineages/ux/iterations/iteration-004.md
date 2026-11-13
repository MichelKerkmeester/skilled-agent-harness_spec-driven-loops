# Iteration 4: First run in an external repository after phase 008

## Focus

What a person installing Skilled into an external repository sees on first run, and where the path still fails silently after the embedder work phase 008 plans. Chosen as the first unchecked key question after KQ3; it is also the only question whose evidence is a person's experience rather than a model transcript.

## Actions Taken

1. Read the install path: `INSTALL-SKILLED.md` sections 2 and 3, the two build commands, "Check the Install", the printed step table, and the link-merge rules.
2. Read the `/doctor:setup` leg contract, especially the advisor leg's exit taxonomy.
3. Read the daemon's first-start behaviour and the shared embedder cascade's probe timeout.
4. Read the link engine's merge rule for a folder the target already owns.
5. Checked the checkout's own hook registration to confirm what a target repo would have to carry.

## Findings

1. **The first-run confirmation skips the advisor exactly when it is cold.** `/doctor:setup`'s advisor leg is `advisor_status --warm-only`; exit 75 with no dist warning is **SKIP because the daemon is not running**, and phase 008's embedder leg copies that shape. The install guide calls step 5 "Confirms the whole setup works", but on a fresh install the daemon has never started, so the two legs that matter for command surfacing are skipped rather than passed. The user gets a green line for a check that did not run. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57] [SOURCE: INSTALL-SKILLED.md:118]

2. **A hung embedder provider on first start can outlast the whole hook budget.** The first daemon start calls `ensureActiveEmbedder()`, which runs the shared cascade; each provider probe may take `DEFAULT_TIMEOUT_MS = 2_500` ms. The Claude shim gives the child 2,200 ms by default inside a 2,500 ms hook. One slow probe therefore exceeds the hook's entire child budget, and the first prompt of a new install is the one that loses its brief. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:117] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38] [SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:315]

3. **A project with its own hook config never gets the advisor hook, and nothing checks.** The link engine's merge keeps every local path, and the guide says a folder the project already has keeps its own files. A repo with an existing `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` or `.devin/hooks.v1.json` therefore keeps it and never receives the `UserPromptSubmit` entry the checkout carries. `/doctor:symlink check` validates link shape, and no `/doctor:setup` leg reads the target's hook config, so the result is a silent no-brief install reported healthy. [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:821] [SOURCE: INSTALL-SKILLED.md:143]

4. **The spelling gap is narrower than iteration 3 recorded.** `INSTALL-SKILLED.md` already tells the reader that Codex, Cursor and Pi spell commands with a hyphen and that Devin reaches the spec-kit workflows through its `/system-spec-kit` skill. The person-facing problem is therefore not missing documentation but that the model-visible brief carries only the canonical spelling and has no per-runtime form to offer; the install guide's sentence is read once, not at prompt time. [SOURCE: INSTALL-SKILLED.md:65]

## Recommendations

1. **Add a "Prove it" step to `INSTALL-SKILLED.md` section 2, right after "Check the Install".** The step runs `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"create a readme for the utils folder"}' --format json` and expects `.data.recommendations[0].skillId` to be `sk-doc` and, after phase 005, `.command` to be `/create:readme`. Gain: a cold install gets a deterministic pass or a named failure instead of a SKIP; the command starts the daemon on purpose, so `/doctor:setup`'s read-only invariant is respected. The measured signal is a top recommendation at 0.95 confidence on today's build. Verify: the documented command prints `sk-doc` on a healthy checkout and a non-zero exit with a repair line when the advisor is absent.
2. **Bound the daemon-start cascade below the hook budget.** In the launcher that spawns the advisor daemon (`.skilled/bin/system-skill-advisor-launcher.cjs`, the path the install guide names), set `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` to 750 for the daemon's first start, matching phase 008's prompt-embedding deadline, and let the first prompt run phrase-only if the provider cannot answer inside it. Gain: the first prompt is bounded by the 2,200 ms child budget instead of being lost to a 2,500 ms probe; the user sees a brief on prompt one. Verify: a test launches the daemon against a hung stub provider and asserts `advisor_recommend` returns inside 2,200 ms, and `advisor_status` reports the lane as degraded with the existing `prompt_embedding_timeout` reason.
3. **Check the target's hook wiring on the first run.** Add a check to `/doctor:symlink check --root <dir>` (script `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`) that reads the target's `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` and reports `hook-missing <runtime>` when a file exists without a `UserPromptSubmit` entry pointing at the linked adapter. Gain: the silent failure class in finding 3 becomes a named row with a repair, and a pre-existing settings file stops being invisible. Verify: a fixture target with a settings.json lacking the entry prints `hook-missing claude` and exits 1, the same fixture with the entry exits 0, and the real checkout exits 0 for the four native runtimes.

## Ruled Out

- **Adding a recommendation leg to `/doctor:setup`.** The route's own invariant forbids starting the advisor daemon, and a leg that starts it would make the read-only diagnostic write runtime state. The "Prove it" step belongs in the install guide, where starting the daemon is the point.
- **Showing a degraded-lane line in the hook brief.** Operator answer Q037 keeps the hook brief unchanged for a switched-off meaning lane; the setup check, the status tool and the JSON warning are the chosen surfaces, and phase 008 already adds them.

## Dead Ends

- Looking for a first-prompt cold-start number in the packet: the measured files record warm embeddings, warm CLI calls and warm hook latency, and no recorded cold daemon start. The gap is stated rather than guessed.
- Looking for a setup leg that reads the target's hook config: the five legs (six after 008) cover sk-code, sk-git, trigger index, runtime mirrors, the advisor and the embedder, and all run in the checkout or against the checkout's store.

## Edge Cases

- Ambiguous input: none. The question and the evidence path were both explicit.
- Contradictory evidence: iteration 3 finding 2 read the native spellings as an undocumented person-facing gap; `INSTALL-SKILLED.md:65` documents the hyphen rule and Devin's skill route. The correction is recorded here and narrows the finding to the prompt-time brief, where the install guide cannot help.
- Missing dependencies: a real cold start cannot be measured without stopping the running daemon, which the lineage rules forbid, so finding 2 is a bound from two published constants, not a timed observation.
- Partial success: findings 1 and 3 are confirmed by file contents; finding 2 is a provable budget inversion whose end-to-end effect is inferred.

## Sources Consulted

- `INSTALL-SKILLED.md:55,63,65,118,143`
- `.skilled/commands/doctor/assets/doctor-setup.yaml:57`
- `.skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:117`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38`
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:315`
- `.skilled/commands/doctor/scripts/symlink-engine.cjs:821`
- `.claude/settings.json` and `.codex/hooks.json` hook entries
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/steer.md`

## Assessment

- New information ratio: 0.88
- Questions addressed: KQ4 (what an external repository sees on first run, and what still fails silently)
- Questions answered: KQ4 — the confirmation skips the cold advisor, the first start can outlast the hook budget, and a pre-existing hook config silently wins

## Reflection

- What worked and why: following the person's path step by step instead of reading the phase plans exposed that "Confirms the whole setup works" is literally false on a cold install, and reading the target-side merge rule found the hook-wiring hole.
- What did not work and why: trying to find a recorded cold-start number failed; the repository records warm numbers only, which is itself the finding.
- What I would do differently: measure the cold start in an isolated copy with its own daemon socket, if a future phase may stop a daemon; this lineage cannot.

## Recommended Next Focus

The measured cost ledger: what the brief, the hook and the embedder cost per prompt and per session, which part is invisible to the person, and which measured number is missing before a budget can be set.
