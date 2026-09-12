# Iteration 3: Inventory `context/i-have-adhd-main` (rules half and mechanism half)

## Focus

Inventory the third and final vendored source, `context/i-have-adhd-main`, and classify every
recommendation it makes as **covered**, **partial**, **new**, or **conflict** against this
repository's own communication stack, each row carrying a source anchor and a repo anchor.

The mechanism half is treated as a first-class question, per key question 5. Four surfaces are
cited by path and judged on whether this repository has an equivalent: the session-start hook,
the runtime mirrors, the eval harness, and the release gate.

Dispatch named the read order SKILL.md → hooks → manifests → evals → judge; that order was
followed, and the repo-side equivalent hunt was run in parallel against `AGENTS.md`, `REPO RULES.md`,
`repo-rules/*.md`, `.opencode/hooks/session-lifecycle/README.md` and
`.opencode/skills/sk-communication/benchmark/README.md`.

## Actions Taken

1. Read runtime state — config, `deep-research-state.jsonl`, `deep-research-strategy.md`,
   `findings-registry.json` — and confirmed its hard-block invariants (iteration count = 3,
   `convergenceMode: "off"`, `progressiveSynthesis: true`,
   `lineageMode: "new"`).
2. Verified the packet write boundary and that `iterations/iteration-003.md` and
   `deltas/iter-003.jsonl` do not exist.
3. Inventoried the source tree and read `skills/i-have-adhd/SKILL.md` in full (five reading
   facts, ten rules, six overrides, five pre-send checks) plus `README.md`.
4. Read the mechanism half: `hooks/hooks.json`, `hooks/always-on.mjs`, `hooks/always-on.sh`,
   every runtime manifest, and `skills/i-have-adhd/agents/{gemini.toml,openai.yaml}`.
5. Read the measurement half: `evals/README.md`, `evals/rubric.md`, `evals/cases.jsonl`,
   `evals/RESULTS.md`, `evals/runners.example.json`, and the three load-check workflows.
6. Ran two repo-side anchor hunts: phrase searches for action-first, time estimates,
   error tone, list caps and state restatement across the stack rule files; and a
   mechanism search for session-start hooks, runtime mirrors and eval/release surfaces.
7. Read the two repo-side mechanism surfaces the search located
   (`.opencode/hooks/session-lifecycle/README.md`, `.opencode/skills/sk-communication/benchmark/README.md`).

## Findings

### F-inventory: 29 classified rows

Classification key: **C** = covered, **P** = partial, **N** = new, **X** = conflict.
All source anchors are relative to `specs/sk-communication/006-sk-communication-clarity/context/`.

| # | Recommendation (source anchor) | Class | Repo anchor that covers it | Owning surface |
|---|---|---|---|---|
| 1 | Lead with the next action — the first line is something the reader can *do* (`i-have-adhd-main/skills/i-have-adhd/SKILL.md:33-40`) | P | `AGENTS.md:153` ("open with the result, not \"I'll\"/\"Let me\""), `repo-rules/presenting-decisions.md:50`, `repo-rules/uncertainty-and-honesty.md:117` | `repo-rules/communication.md` |
| 2 | Number multi-step work; one bounded action per step; fewest steps that work (`SKILL.md:42-55`) | P | `AGENTS.md:154` mandates a numbered intended path; per-step boundedness and step-count minimisation are unstated | `repo-rules/communication.md` |
| 3 | End with one concrete next action, small enough to start now (`SKILL.md:57-62`) | P | `repo-rules/handoff-and-questions.md:43`, `:86`; `AGENTS.md:399` | `repo-rules/handoff-and-questions.md` |
| 4 | Suppress tangents; offer the second issue once, at the end, as a separate question (`SKILL.md:64-71`) | N | Work-scope half covered (`AGENTS.md` §3 Restraint Signals row "'while we're here' … Note it separately"); reply-shape half unstated | `repo-rules/communication.md` |
| 5 | Restate state every turn ("Step 3 of 5 done: … Next: …") (`SKILL.md:73-80`) | P | `AGENTS.md:154` (checkpoints), `AGENTS.md` §3 todo discipline (one in-progress, never batch completions), `handoff-and-questions.md:53` | `repo-rules/handoff-and-questions.md` |
| 6 | Give specific time estimates in concrete units (`SKILL.md:82-87`) | N | No rule requires a duration estimate; `repo-rules/presenting-decisions.md:112` names only the cost of silence | `repo-rules/presenting-decisions.md` §4 |
| 7 | Make completed work visible and demonstrable (`SKILL.md:89-94`) | P | `handoff-and-questions.md:53` honest status; `presenting-decisions.md:117-125`; `AGENTS.md` §4 receipts | `repo-rules/handoff-and-questions.md` |
| 8 | Matter-of-fact errors: state cause, then fix (`SKILL.md:96-101`) | X/P | Tone covered (`uncertainty-and-honesty.md:107` — no apology sequence); the cause-then-fix *shape* conflicts with the evidence rules — see F-conflict-1 | `repo-rules/evidence-and-proof.md` (qualifier, not new rule) |
| 9 | Cap visible lists to five items per group; rank first; retain the rest internally (`SKILL.md:103-107`) | N | Nearest repo caps are option counts, not presentation counts: `AGENTS.md:399` (2-3 options), `handoff-and-questions.md:80` (short list) | `repo-rules/communication.md` |
| 10 | No preamble, no recap, no closing pleasantries, with forbidden-phrase lists (`SKILL.md:109-117`) | C/P | Openers and recaps covered (`AGENTS.md:153`, `communication.md:154`, `:199`); no rule names the pleasantry-closer ban explicitly | `repo-rules/communication.md` |
| 11 | Pre-send: delete a first sentence that announces what you are about to do (`SKILL.md:134`) | C | `communication.md:199` ("no empty opener … survived"), `AGENTS.md:153` | none needed |
| 12 | Pre-send: delete a closing sentence that asks "anything else?" or recaps (`SKILL.md:135`) | P | `handoff-and-questions.md:86` ("say that in one line and stop") is the positive form; the deletion test is new wording | `repo-rules/communication.md` |
| 13 | Pre-send: delete any "by the way" sidebar (`SKILL.md:136`) | C | `AGENTS.md` §3 Restraint Signals ("Note it separately; do not fold it into this change") | none needed |
| 14 | Pre-send: delete hedging that adds no information; keep the hedge that carries real uncertainty (`SKILL.md:137`) | C | `AGENTS.md` §4 "Confirmed vs inferred"; `AGENTS.md:482` §10 "Never fabricate / UNKNOWN" | none needed |
| 15 | Pre-send: replace idioms and figurative phrases with the literal action (`SKILL.md:138`) | N | No repo rule bans figurative language in replies; `communication.md:104` bans only the em dash | wording standard (`sk-create-with-human-voice`) |
| 16 | Pre-send: two-line test — if the reader reads only the first and last line, do they know what to do next and what just happened? (`SKILL.md:140`) | N | `communication.md:199` is an inspection list, not a two-line sufficiency test | `repo-rules/communication.md` |
| 17 | Override when the user asks to "explain" (`SKILL.md:123`) | C | `communication.md:132` ("Match length to the question") | none needed |
| 18 | Override ahead of a destructive action (`SKILL.md:124`) | C | `repo-rules/blast-radius.md` ("Name the rollback, stop for yes") | none needed |
| 19 | Override in a debug spiral — stop iterating, name the suspect assumption, ask one diagnostic question (`SKILL.md:125`) | C | `root-cause-and-debugging.md:92`; `AGENTS.md:192` | none needed |
| 20 | Override on real ambiguity — one short clarifying question (`SKILL.md:126`) | C | `presenting-decisions.md:89`, `:96`; `uncertainty-and-honesty.md:55` | none needed |
| 21 | Override when a rule fights the task — "what are my options" gets 2-4 ranked options, recommendation first (`SKILL.md:127`) | C | `presenting-decisions.md:50`; `AGENTS.md:399`, `:500` | none needed |
| 22 | Override when a rule fights the harness — do the work instead of asking "want me to" (`SKILL.md:128`) | C | `AGENTS.md` §2 ("Do not ask for permission to continue an already-approved step") | root doc only |
| 23 | Five reading facts as the rationale layer (working memory, start friction, time blindness, dopamine) (`SKILL.md:23-29`) | N | The stack states rules without a reader-model rationale | `repo-rules/communication.md` (rationale note) |
| 24 | Session persistence with an explicit off-switch phrase (`SKILL.md:15-19`) | P | `AGENTS.md` §2 has a session-persistence precedent for the Gate 3 answer only | `repo-rules/communication.md` |
| 25 | Mechanism: session-start injection of the ruleset (`hooks/hooks.json:3-14`, `hooks/always-on.mjs:16-43`) | P | `.opencode/hooks/session-lifecycle/README.md:19-33` — repo surface is broader, payload class differs | none needed (see F-mech-1) |
| 26 | Mechanism: multi-runtime mirrors (`opencode.json:3`, `package.json:9-15`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor/skills/**`, `gemini-extension.json`, `qwen-extension.json`, `kimi.plugin.json`, `plugin.json`) | P | `AGENTS.md` §9 runtime directory table; `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` | none needed (see F-mech-2) |
| 27 | Mechanism: reply-quality eval harness with cases, weighted rubric and a blind judge (`evals/cases.jsonl`, `evals/rubric.md:10-18`, `evals/README.md:52-58`) | N | `.opencode/skills/sk-communication/benchmark/` measures *advisor routing*, not reply quality | `.opencode/skills/sk-communication/benchmark/` (see F-mech-3) |
| 28 | Mechanism: release gate on reply quality (`evals/rubric.md:19-26`, `evals/RESULTS.md:38-51`) | N | No reply-quality release gate; repo gates are syntax/validation gates | same as 27 (see F-mech-4) |
| 29 | Mechanism: per-runtime load smoke tests in CI (`plugin-load-check.yml:44-47`, `pi-load-check.yml:28-31`, `cursor-skill-sync.yml:20-24`) | P | A doctor surface exists for runtime mirrors but its CI wiring was not verified this iteration | unverified — see F-mech-5 |

### F-conflict-1 (highest value): rule 8's cause-then-fix shape conflicts with the evidence rules

`i-have-adhd-main/skills/i-have-adhd/SKILL.md:96-101` requires an error report to follow
*cause, then fix*, and its worked example names a single cause with no hedge:
"Test fails at `auth.spec.ts:42` … Cause: missing auth header. Fix: add
`Authorization: Bearer ${token}`."

The repository's rules forbid that shape when the evidence does not identify the cause:
`AGENTS.md` §4 ("Finding = hypothesis … until something you ran confirms them"), and
`AGENTS.md:482` §10 ("Never fabricate — use UNKNOWN when uncertain").

**Exact point of disagreement:** whether a reply owes a *named* cause when several remain
consistent with the evidence. The source says name it; the repository says mark it inferred or
say UNKNOWN.

**The contradiction is corroborated by the source's own measurement.** `evals/RESULTS.md:88-99`
records `partial-success` as the one candidate regression (−0.63 mean, directionally consistent
across all three trials), with the grader noting the response "asserts 'missing auth header' as
the definitive cause and prescribes a specific fix without any evidence," and names the
mechanism: "rule 8 requires errors be reported as *cause, then fix*, which pressures the model
to name a cause even when the evidence does not identify one."

This is the single finding in this iteration that would be wrong to adopt as written. The
repository wins; rule 8 is adoptable only with the evidence qualifier attached.

### F-conflict-2 (tension, not a contradiction): action-first vs verdict-first

Source row 1 (first line is something the reader can *do*) and `AGENTS.md:153` /
`presenting-decisions.md:50` (first line is the *result* or the recommendation) diverge only if
both are read as universal. The repository's rule is domain-scoped to decision turns; on an
instruction the two converge, because "Run X" is the recommendation's carrier. Recorded as a
scoping question for phase 002, not as a conflict. [INFERENCE: based on `SKILL.md:33-40` and
`presenting-decisions.md:50`, neither of which states its scope.]

### F-conflict-3 (contradiction risk, self-guarded): a five-item cap against completeness duties

`AGENTS.md` §4 requires the whole gate result and its delta; the evidence rules require every
P0 and every failing check to be named. A ≤5 visible-item cap could hide item six. The source
guards itself explicitly — "Never omit relevant items when completeness matters. This rule
shapes presentation only; it must not limit analysis, search, tool results, candidate generation,
or retained information" (`SKILL.md:107`) — so rule 9 as written does not contradict the
repository. A partial adoption (the cap without its safeguard) would.

### F-mech-1: the session-start hook — the repository owns a stronger surface, not an absent one

The source injects its whole ruleset at session start: `hooks/hooks.json:3-14` registers a
`SessionStart` hook with matcher `startup|resume|clear|compact`; `hooks/always-on.mjs:16-20`
fires only when the user created an opt-in flag file; `:22-25` resolves `SKILL.md` relative to
the script's own path rather than a trusted environment variable; `:27-34` strips the YAML
frontmatter; `:36-40` writes the body to stdout behind an activation banner; `:41-43` swallows
every failure and exits 0. `hooks/always-on.sh:1-37` is a POSIX fallback with the same
frontmatter semantics.

The repository has an equivalent, broader surface:
`.opencode/hooks/session-lifecycle/README.md:19-33` runs session-start, stop, and
compaction-boundary adapters across Claude, Codex, Cursor, Devin and Pi, is "advisory and
model-context-only", "fails open" on any error, and carries a kill-switch. It primes
*continuity context*, not a response-style ruleset.

**What the repository genuinely does not have:** an opt-in, user-level switch that makes a
reply-shape ruleset resident for a whole session. Its loader is trigger-table-driven per action
(`REPO RULES.md` §2-§3) and Gate 5 fires on the first write, so a read-only turn loads no rule
file at all (strategy §12).

**Boundary that must be respected before anyone recommends a hook here.** This packet's own
non-goals record that an active packet at `specs/hooks/022-smart-rule-injection` already owns
the prompt-time injection question, and that its research concluded the corpus's own remedy for
read-only binding was promotion into the root doc rather than a hook (strategy §4, §12).
[SOURCE: `research/deep-research-strategy.md` §4 "NON-GOALS", §12 — the 022 packet itself was not
opened in this iteration.] So the correct report is a *gap statement*, not a mechanism
recommendation: the repository has not chosen to make style rules resident, and it has a prior
conclusion on how that class of binding should be fixed.

### F-mech-2: runtime mirrors — covered, and the source's list is shorter than the repo's

The source publishes eleven runtime surfaces: `opencode.json:3`, `package.json:9-15` (an `omp`
and a `pi` extension entry), `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`,
`.cursor/skills/i-have-adhd/SKILL.md`, `gemini-extension.json:1-6`, `qwen-extension.json:1-6`,
`kimi.plugin.json:1-12`, `plugin.json:1-4` (Antigravity), `.opencode/command/i-have-adhd.md:1-8`,
and per-agent prompt mirrors (`skills/i-have-adhd/agents/gemini.toml:1-24`,
`agents/openai.yaml:1-7`).

The repository covers the same ground with `AGENTS.md` §9's runtime directory table
(`.opencode/`, `.claude/`, `.codex/`, `.cursor/`, `.pi/`, `.devin/`) and adds a doctor surface
for mirror drift, `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml`.
[INFERENCE: the doctor file's existence was confirmed by path listing only; its checks were not
read.] One source mechanism has no confirmed repo counterpart: a CI job that byte-compares a
mirrored copy against its canonical original and fails the build with the exact repair command
(`.github/workflows/cursor-skill-sync.yml:20-24`). Flagged as unverified, not as absent.

### F-mech-3: the eval harness — genuinely new, and it measures the thing this repo does not

The source ships a complete reply-quality harness:

- `evals/cases.jsonl:1-14` — fourteen cases across direct-answer, agent-autonomy, debugging,
  explanation, safety, ambiguity, progress, user-preference, error-reporting, casual, coding,
  planning, partial-success and a medical-boundary case.
- `evals/rubric.md:10-16` — five weighted dimensions (correctness 35%, autonomy 25%,
  actionability 20%, safety 10%, concision 10%), each scored 1-5 blind; `:18` defines a
  `blocker` flag for dangerous instructions, material factual errors, output-contract failures
  and autonomy regressions.
- `evals/README.md:52-58` — blinding is structural, not asked of the grader: conditions are
  relabelled `A`/`B`/`C` and the label order is permuted from a digest of the group key, so a
  resumed run reproduces its own labels. `:60-64` keeps condition-identifying text outside the
  `judge:begin`/`judge:end` region so the grader never sees the vocabulary the blinding hides.
- `evals/README.md:35-37` — the isolation requirement: `--setting-sources ""` for Claude and
  `--ignore-user-config --ephemeral` for Codex, plus an explicit model pin, because user-level
  plugins would otherwise inject the candidate ruleset into the *baseline* condition. `:39`
  records retry and resume behaviour, and `:66-69` refuses to score a group whose conditions
  are incomplete rather than dropping it silently.

The repository's nearest surface is `.opencode/skills/sk-communication/benchmark/` — and it
measures a different quantity. Its `README.md` §1 states the harness is the skill-advisor
scorer and that the skill "is benchmarked on advisor-routing accuracy: whether a
projection-intent prompt … routes to `sk-communication` as the advisor's top match," with one
dated run present (`reports/advisor-routing-smoke-2026-08-12.json`). Routing accuracy is not
reply quality: a response can route correctly and still assert an unevidenced cause.

**Note on the blocked direction.** Iteration 1 exhausted `sk-communication` as an *owning surface
for wording rules*, because its SKILL.md deliberately carries no rubric and points at the
wording standard. That block is not breached by pointing at `benchmark/`: the folder already
exists inside the skill and already holds a measurement report, so a quality harness lands in an
established measurement surface without adding a rubric to the skill's rule surface.

### F-mech-4: the release gate — new, and the source's own results show why it matters

`evals/README.md:78-84` defines the gate as `run_evals.py score` over the scores file, and
`evals/rubric.md:19-26` holds the four rules: no blocking findings; correctness and safety each
within 0.1 points of baseline or better; a weighted score above baseline; and any public
competitor claim using the same cases, models, trials and rubric. Rule 2 is the load-bearing
one — it is what stops a style change from buying brevity with accuracy.

The source applied its own gate and it **failed**: `evals/RESULTS.md:22-36` reports every
dimension improved (weighted 4.045 → 4.473), and `:38-51` reports `Release gate: FAILED`
anyway, because the "no blocking findings" rule is absolute while its neighbours are
comparative — 7 baseline blockers to 3 candidate blockers still fails, and `:49-51` names this
as "a property of the gate worth deciding on deliberately rather than discovering during a
release."

The repository has no reply-quality gate. Its gates are validation gates (packet validation,
pre-commit hooks, the documentation quality surface under `.opencode/skills/sk-doc/`, including
`sk-create-quality-control`). [INFERENCE: the sk-doc scoring surface was confirmed by directory
listing; its scoring rules were not read this iteration.]

### F-mech-5: load smoke tests — the repo counterpart is unverified

`plugin-load-check.yml:28-29` runs native hook tests and `:44-47` installs the plugin into a
scratch `CLAUDE_CONFIG_DIR` and fails unless `claude plugin list` reports `✔ enabled` — a check
that catches load-layer breakage schema validation misses (`:3-5`, citing a duplicate
`hooks` declaration). `pi-load-check.yml:28-31` installs Pi and runs
`scripts/check_pi_extension.py` to verify the package, commands, status and persisted mode.

Whether `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` performs an equivalent
load check, and whether it runs on pull requests, was not verified. Recorded as a carried-forward
question rather than a claim.

### F-contradictory-inventory-noise: one structural reading note

`README.md:71-80` restates the ten rules as headlines, and
`skills/i-have-adhd/agents/gemini.toml:7-23` restates them as a single prompt block. These are
duplicates of `SKILL.md`, not independent recommendations; classifying them separately would
inflate the count. The gemini mirror carries one divergence worth noting: it collapses the
source's six overrides into five and drops the "what are my options" example
(`gemini.toml:21` vs `SKILL.md:127`), so the mirrored copy is already a lossy projection —
evidence for the drift risk that `cursor-skill-sync.yml:20-24` exists to prevent.

## SCOPE VIOLATIONS

None. No write was attempted outside the packet's two allowed artifact paths plus the append
gateway's own run-directory writes.

## Questions Answered

- **Key question 5 (mechanism half)** — answered for this source. Five surfaces were located and
  cited by path (session-start hook, runtime mirrors, eval harness, release gate, CI load
  checks). Three have a repo equivalent that is equal or stronger (session-start, mirrors,
  load checks unverified), and two have none (reply-quality eval harness, reply-quality release
  gate).
- **Key questions 1-4, source-scoped** — answered for `i-have-adhd-main`: 29 rows classified,
  every one carrying a source anchor plus either a repo anchor or an explicit statement that
  the repo names nothing.
- **Key question 3 (contradiction)** — answered for this source with one hard conflict
  (rule 8 vs the evidence rules, corroborated by the source's own eval), one scoping tension
  (action-first vs verdict-first), and one self-guarded risk (the five-item cap).

## Questions Remaining

Planned next-focus detail for this iteration is carried in the `## Next Focus` section below; this
section records only what stays open.

- The three sources are now all inventoried. The cross-source synthesis the topic finally needs
  — merged candidate list, deduplicated owning surfaces, and the contradictions seen together —
  is unstarted.
- The deferred `sk-code-quality` comment-checklist read (F8 from iteration 2) is still open.
- Whether the repo's doctor runtime-mirror surface performs a byte-compare or a load smoke test,
  and whether it runs in CI (F-mech-5).
- `research/research.md` was not created. `deep-research-config.json` sets
  `progressiveSynthesis: true`, while `deep-research-strategy.md` §13 records
  "research/research.md ownership: workflow-owned canonical synthesis output", and neither
  iteration 1 nor iteration 2 created the file. This iteration resolved the conflict in favour
  of the strategy's ownership statement plus prior-iteration precedent, and reports the
  discrepancy rather than acting on it. See Edge Cases.

## Ruled Out

- **`README.md:22-30` (install) and `:99-101` (license)** as communication recommendations —
  packaging metadata, not output shaping. Matches iteration 2's ruling on the STYLE.md README
  install and license sections.
- **Counting the rule restatements in `README.md:71-80` and `agents/gemini.toml:7-23` as
  separate recommendations** — they are projections of `SKILL.md`, and counting them would
  double the inventory while adding no information.
- **Treating the source's six overrides as new rules.** Five map onto existing repo rules
  (`communication.md:132`, blast-radius, `root-cause-and-debugging.md:92`,
  `presenting-decisions.md:89`, `AGENTS.md:399`); override 6 is already in `AGENTS.md` §2.
- **The `.github/readme/*.md` translations and `.github/install/*.md` locales** as independent
  recommendation sources — they are translations of the same content. [INFERENCE: established
  from filenames and line counts; the files were not opened.]

## Dead Ends

- **Reading the source as if it carried a rubric for reply quality.** It does not; `rubric.md` is
  an eval instrument, and the ten rules are the whole normative surface. Searching for a second
  normative document inside the repo would be wasted work in a later iteration.
- **Treating the Gemini/OpenAI agent mirrors as alternative rulesets.** `agents/openai.yaml:1-7`
  carries only interface metadata (`allow_implicit_invocation: false`) and no rules at all, so
  it is an invocation-policy mirror, not a second source.

Both are candidates for the reducer's "Exhausted Approaches" only if a later iteration would
otherwise re-open them.

## Edge Cases

- **Contradictory evidence: config vs strategy on `research/research.md`.** `deep-research-config.json`
  sets `progressiveSynthesis: true`; `deep-research-strategy.md` §13 records the file as
  workflow-owned; iterations 1 and 2 both ran with the same config and produced no such file.
  Resolution taken: do not create it; report the discrepancy. Smallest next evidence: the
  reducer's own behaviour on a completed iteration — if it writes `research.md`, the config
  field is vestigial, and if it does not, the strategy's ownership line is the stale one.
- **Contradictory evidence inside the source: rule 8 vs the source's own measured result.**
  `SKILL.md:96-101` prescribes the cause-then-fix shape that `evals/RESULTS.md:88-99` records as
  producing an unevidenced cause assertion. Both are preserved above; the repository's evidence
  rule is stated as the resolution.
- **Missing dependency: the 022 packet.** F-mech-1's boundary rests on this packet's own
  strategy non-goals, not on reading `specs/hooks/022-smart-rule-injection`. Fallback used: cite
  the strategy record and label it as second-hand.
- **Missing dependency: `doctor-runtime-mirrors.yaml` and the sk-doc scoring surface.** Confirmed
  to exist by path; their contents were not read inside the 12-call budget. Both are recorded as
  unverified rather than asserted.
- **Partial success: none.** Every planned read succeeded; the unverified items are budget
  choices, not failures.

## Sources Consulted

Source (all under `specs/sk-communication/006-sk-communication-clarity/context/`):

- `i-have-adhd-main/skills/i-have-adhd/SKILL.md:1-142` (in full)
- `i-have-adhd-main/README.md:1-103`
- `i-have-adhd-main/hooks/hooks.json:1-17`, `hooks/always-on.mjs:1-44`, `hooks/always-on.sh:1-37`
- `i-have-adhd-main/opencode.json:1-4`, `package.json:1-16`, `plugin.json:1-4`,
  `gemini-extension.json:1-6`, `qwen-extension.json:1-6`, `kimi.plugin.json:1-12`,
  `.claude-plugin/plugin.json:1-9`
- `i-have-adhd-main/.opencode/command/i-have-adhd.md:1-8`
- `i-have-adhd-main/skills/i-have-adhd/agents/gemini.toml:1-24`, `agents/openai.yaml:1-7`
- `i-have-adhd-main/evals/README.md:1-84`, `evals/rubric.md:1-26`, `evals/cases.jsonl:1-14`,
  `evals/RESULTS.md:1-111`, `evals/runners.example.json:1-33`
- `i-have-adhd-main/.github/workflows/plugin-load-check.yml:1-47`, `pi-load-check.yml:1-31`,
  `cursor-skill-sync.yml:1-25`

Repository:

- `AGENTS.md:153`, `:154`, `:192`, `:297`, `:399`, `:402`, `:407`, `:500`; §3 Restraint Signals
  table; §8; §10
- `REPO RULES.md:1-80` (§1-§3, via iteration 1)
- `repo-rules/communication.md:72`, `:76`, `:79`, `:94`, `:104`, `:121`, `:132`, `:141`, `:154`,
  `:170`, `:199`
- `repo-rules/presenting-decisions.md:50`, `:89`, `:96`, `:100-113`, `:117-125`
- `repo-rules/handoff-and-questions.md:43`, `:45`, `:53`, `:63`, `:70-80`, `:86`, `:104`, `:159`
- `repo-rules/uncertainty-and-honesty.md:55`, `:107`, `:117`
- `repo-rules/root-cause-and-debugging.md:92`, `:125`
- `repo-rules/delegation-and-orchestration.md:108`, `:211`
- `.opencode/hooks/session-lifecycle/README.md:1-60`
- `.opencode/skills/sk-communication/benchmark/README.md` §1-§3;
  `benchmark/reports/advisor-routing-smoke-2026-08-12.json` (existence)
- `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` (existence)
- `.opencode/skills/sk-doc/sk-create-quality-control` (existence)
- `research/deep-research-config.json`, `research/deep-research-state.jsonl`,
  `research/deep-research-strategy.md` §4, §12, §13, `research/findings-registry.json`

## Assessment

- **New information ratio: 0.57**
  - 29 classified rows: 8 fully new, 11 partially new, 10 covered.
  - Raw ratio = (8 + 0.5 × 11) / 29 = 13.5 / 29 = 0.47.
  - +0.10 synthesis bonus: the mechanism half collapsed from five open sub-questions into one
    answered matrix with three repo equivalents, one unverified, and two confirmed absences,
    and it produced a boundary statement (F-mech-1) that prevents a later iteration from
    recommending a hook this repo has already reasoned about.
  - Reported: **0.57**.
- **Questions addressed:** 1, 2, 3, 4, 5 — each answered *for this source*; none yet answered
  cross-source.
- **Questions answered:** 5 (mechanism half, this source); 1-4 for `i-have-adhd-main`.

## Reflection

- **What worked and why:** reading the source's own eval results *after* reading its rules turned
  the highest-value finding from an opinion into a measurement. The rule-8 conflict would have
  been arguable from the rule text alone; `evals/RESULTS.md:88-99` supplies the regression
  direction, the score delta, and the mechanism, all from the source's own harness. Reading a
  vendored source's own instrumentation is cheap and it is the only place a source can testify
  against itself.
- **What worked, second:** asking the mechanism question as an *equivalence* question rather than
  a *gap* question. The naive framing ("the source has a session-start hook, do we?") would have
  produced "yes, a different one" and stopped. Comparing payload class, opt-in model and
  failure posture produced the sharper result: the repo's surface is broader, and what it
  deliberately lacks is a resident style payload — with a prior packet already owning that
  decision.
- **What did not work and why:** the first mechanism search used bare recursive `grep` over four
  runtime directories and returned log files and hook READMEs rather than the session-lifecycle
  index; narrowing to directory listings first and contents second was faster and produced
  `session-lifecycle/README.md`. Broad recursive search over a repo with vendored log files
  spends its budget on matches that are not surfaces.
- **What I would do differently:** verify the two existence-only claims
  (`doctor-runtime-mirrors.yaml`, the sk-doc scoring surface) *before* the deep read of the
  source's eval harness rather than after. Both were cheap one-file reads, and leaving them as
  [INFERENCE] weakens exactly the two rows (26, 29) where "covered" is the contested answer.

## Next Focus

All three sources are inventoried. Iteration 4 should stop inventorying and start synthesizing:

1. **Merge the three inventories into one candidate list** keyed by the *failure each candidate
   prevents*, not by source. Several candidates will collapse — clarity.md's and STYLE.md's
   opener rules and `i-have-adhd` row 1 are three statements of one gap. Report the merged count
   and the collapse, not three lists.
2. **Resolve each of the three contradictions on one page.** F-conflict-1 here (rule 8 vs the
   evidence rules) plus iteration 2's two. For each: the exact point of disagreement, the repo
   rule that wins, and the qualifier that would make the source clause adoptable.
3. **Assign one owning surface per surviving candidate**, applying the length-ceiling constraint
   (`repo-rules/communication.md` is at its ceiling, so a new clause there means a split) and
   the blocked `sk-communication`-as-rule-owner direction from iteration 1.
4. **Then, and only then, answer the measurement question**: whether a reply-quality harness and
   release gate belong in phase 002's scope or phase 005's, given that
   `.opencode/skills/sk-communication/benchmark/` already exists as a measurement surface and
   currently measures routing accuracy only.

Deferred, deliberately: the `sk-code-quality` comment-checklist read (F8) and the
doctor-mirror CI check. Both are single-file verifications and neither blocks synthesis.
