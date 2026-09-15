---
title: "Deep-Research Strategy: runtime surface parity across the seven runtimes (lineage deepseek)"
trigger_phrases:
  - "runtime surface parity research"
  - "devin commands gap"
---
# Deep-Research Strategy: runtime surface parity (lineage `deepseek`)

> Fan-out lineage, executor `cli-pi` model `deepseek-v4.1-flash` at max. Ten iterations, stop policy
> max-iterations. Convergence before iteration 10 is telemetry only: broaden the angle, never
> synthesize early. Research only: every write stays inside this lineage directory.

## Research Topic

The repo authors commands, agents, skills, goal state and hooks once and mirrors them into each
runtime's dotfolder. The mirrors have drifted, and one runtime has no command surface at all. Map
every surface against every runtime, find each gap, decide which gaps are real versus correct by
nature, and produce a ranked, phase-ready plan. Every recommendation names the file and generator it
changes, the gap it closes, the test that proves it, and what it costs.

## Known Context

`resource-map.md not present; skipping coverage gate` (`resource_map_present: false`).

Committed facts from the commissioning session (verified live in this lineage where marked):

| Fact as chartered | Lineage verification |
|---|---|
| `.opencode/commands` holds 46 authored command files | **Contradicted: 35.** 46 is the raw `*.md` count under `.opencode/commands`; 11 of those are asset/contract/README files under `assets/` and `scripts/` |
| Claude 33 / Codex 33 / Cursor 35 / Pi 35 / Hermes 33 / Devin 0 | Confirmed, with a mechanism correction: Claude's and Cursor's 33 are **symlinks**, which `find -type f` does not count |
| Skills mirrors Claude 14, Pi 14, Hermes 68, Devin/Cursor/Codex zero | Mechanisms differ per runtime (whole-dir symlink versus generated copies) — pinned in iteration 3 |
| All seven runtimes carry `agents/` | Confirmed; mirror mechanisms differ (symlink / copy / nested-directory symlink) |
| Goal adapters for cursor, devin, opencode, pi only | Pinned in iteration 4 |
| Every dotfolder carries `SYNC.md` except `.opencode` | Confirmed (6 files, 741 lines total) |
| Hermes ships generated markdown-only skill copies | Confirmed, 68 regular files, 0 symlinks |

Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.
Seven runtime surfaces: `.opencode` (authored source), `.claude`, `.codex`, `.cursor`, `.pi`,
`.hermes`, `.devin`.

## Key Questions

1. What is the exact per-runtime command matrix, and is every count difference a deliberate exclusion rule or drift?
2. What does the Devin CLI actually load as a command surface, and is a mirror even loadable?
3. Why do Devin, Cursor and Codex carry no skills mirror — correct by nature or unclosed gap?
4. For all seven runtimes, how does a packet goal reach a session, and what does a missing path cost?
5. Are the agents mirrors in sync with the authored source, and which gate enforces that?
6. Which mirrors are generated, which hand-maintained, which generators have `--check`, and which checks are wired into a running gate?
7. Which hook packages reach which runtimes, and which absences are runtime-specific by nature?
8. What can `.devin/` carry, proven per config file or flag?
9. Is there a single gate that would notice any runtime falling behind on any surface?
10. What is the ranked recommendation list and the phase decomposition?

## Answered Questions

(none yet)

## What Worked

- A mirror-census by `comm` over normalized entry names (path separators flattened) resolves
  present/absent/renamed in one pass and exposes the `RUNTIME_NATIVE_COMMANDS` rename set immediately.

## What Failed

(none yet)

## Exhausted Approaches

- Counting mirror files with `find -type f`. It silently reports 0 for `.claude/commands`, whose 33
  entries are symlinks. Every subsequent census uses `find`-total plus an explicit symlink count.

## Ruled-Out Directions

(none yet)

## Next Focus

Iteration 1: Command census — build the exact matrix of authored commands against the six mirrors,
name the generator and its `--check` mode per mirror, and separate deliberate exclusion from drift.

---

## Iteration Log

> Live sections. The reducer-owned rollup lives in this file's header sections; each entry below is
> appended by the running iteration and is never rewritten. **Next Focus = the last entry's
> `Next Focus` line.** Iteration 10 (synthesis) is never a STOP candidate before the cap.

### Iteration 1 — Command census

- **Worked:** name-normalized `comm` diff over `find` output resolved present/absent/renamed in one
  pass, and surfaced the two renames immediately; reading `command-scope.cjs` converted every count
  difference from suspected drift into stated policy.
- **Failed:** `find -type f` reported `.claude/commands` as zero entries because its 33 commands are
  symlinks. Census method corrected for the rest of the lineage.
- **Ruled out:** repairing the 33-versus-35 spread; it is policy (`command-scope.cjs:21,27-30`) and
  mirroring `vision.md` into Claude would contradict the recorded host capability.
- **Charter correction:** "46 authored commands" → 35 authored commands + 11 non-command markdown
  files. Recorded as discrepancy `d1`.
- **Next Focus:** Iteration 2 — Devin command surface: what the CLI actually loads, and whether a
  command mirror is loadable at all.

### Iteration 2 — Devin command surface

- **Worked:** querying the installed binary (`devin --help`, `devin skills --help`) and reading the
  removing commit (`git show a2241041b0`) instead of reasoning from current state. The commit body
  answers "gap or decision" with a quotation.
- **Failed:** an `rg -rn` search; ripgrep read `-r` as `--replace n` and returned mangled text. Search
  flags are now chosen deliberately, never incidentally.
- **Ruled out:** closing the `.devin/commands/` absence by mirroring 35 commands — no loader exists,
  and the retired mirror was skill-shaped (`.devin/skills/<cmd>/SKILL.md`).
- **Charter correction:** Devin's zero is a documented operator directive with a BREAKING CHANGE
  note; the equivalent affordance is native `.opencode/skills/*` discovery as slash commands.
- **Next Focus:** Iteration 3 — skills surface for Devin, Cursor and Codex: loader existence, whether
  the repo could feed it, and correct-absence versus gap.

### Iteration 3 — Skills surface

- **Worked:** reconciling a manifest's own arithmetic against the filesystem (56 + 12 = 68 verified
  `.hermes/SYNC.md:24`) before trusting the rest of that line; reading each runtime's SYNC inventory
  as the authoritative loading contract.
- **Failed:** `.codex/SYNC.md` asserts an absent directory without naming the missing capability, and
  that assertion was briefly read as the answer. Codex's loader contract stays unconfirmed and is
  recorded as an open question.
- **Ruled out:** proposing a `.cursor/skills/` mirror — Cursor's skills are user-level and
  Cursor-managed; the actionable Cursor gap is the ungenerated packet list in `rules/skill-routing.md`.
- **New gap class:** a mirror can exist, pass `--check`, and still not load (Hermes: 61 of 68). Drift
  gates measure file equality, not runtime loadability.
- **Doc drift:** `.cursor/SYNC.md:32` claims 36 commands; the live tree holds 35.
- **Next Focus:** Iteration 4 — goal parity across all seven runtimes.

### Iteration 4 — Goal parity

- **Worked:** reading the hub's standard before its table. "Not called fully supported unless
  injection and management bind the same native current-session identity" turned six rows into a
  ranked classification and exposed Hermes's missing row.
- **Failed:** an empty `rg -i goal` in `.claude/settings.json` / `.codex/hooks.json` was briefly read
  as "nothing exists". An empty manifest result is evidence about the manifest, not the runtime.
- **Ruled out:** a `goal-codex.md` stub as the primary fix; probe the host path first.
- **New gap class:** the authoritative goal hub omits a runtime that has a working binding.
- **Next Focus:** Iteration 5 — agents parity: in-sync versus merely present, and which gate covers
  which runtime.

### Iteration 5 — Agents parity

- **Worked:** running the gate instead of reading it. The byte diff said "drifted", the gate said "in
  sync", and both were true; running the gate's own tokenizer against the real bodies produced the
  resolution (a semantic rewrite preserved the token set) and a live blind-spot instance.
- **Failed:** the body-diff pass first classified `deep-research` as plain drift. A byte diff and a
  gate verdict answer different questions.
- **Ruled out:** a content gate for Cursor/Devin/Hermes agents — symlinks cannot drift; link
  resolution is the right check and it exists.
- **New gap class:** a mirror can pass a token-set gate while its instruction text has changed
  (`deep-research.md`: "append `idea_observed`" vs "record … through the gateway").
- **Count drift:** the roster is 12; every manifest's "(13)" counts `README.txt`.
- **Next Focus:** Iteration 6 — generator coverage: generated vs hand-maintained, `--check` existence,
  and gate wiring for each.

### Iteration 6 — Generator coverage

- **Worked:** inverting the question — enumerate generators *and* their target files, then ask which
  targets have no producer. That is what caught three manifests claiming no hook generator exists
  while one generator renders all four registration files and both gates run its `--check`.
- **Failed:** iterations 1–5 carried the manifests' "hand-authored" label for three hook configs.
  Repeating a manifest's self-description is not evidence about the file; the inventory is corrected.
- **Ruled out:** generators for `.codex/config.toml` and Pi's operator-state files.
- **Charter correction class:** not a runtime falling behind, but a *claim* falling behind — a closed
  known-gap left in the docs.
- **Next Focus:** Iteration 7 — hook parity: which hook packages reach which runtimes, which are
  runtime-specific by nature, which are unported.

### Iteration 7 — Hook parity

- **Worked:** holding two lenses (directory census and the registry's binding table) and chasing every
  disagreement. Both disagreements resolved into mechanism differences and the chase produced the Pi
  guard-layer finding.
- **Failed:** the first matrix pass marked `goal/opencode` as a working adapter; iteration 4 had already
  established it is a browsability-only symlink that nothing loads through.
- **Ruled out:** a Pi hook-drift checker as a *parity* fix — real, but it belongs in drift detection.
- **Negative result that is a finding:** after correcting Cursor's rule-file vision path and Pi's
  four-advisory bundle, no hook is unported. Hooks are where parity actually holds.
- **Next Focus:** Iteration 8 — what `.devin/` can carry, with a config file or flag proving each row.

### Iteration 8 — What Devin can carry

- **Worked:** verifying instead of counting. Extracting the 21 script paths `hooks.v1.json` actually
  invokes and resolving each symlink is a parity check; counting 21 links is only a parity claim.
- **Caution recorded:** `devin rules paths` / `devin skills list` were not re-run (only `--help`,
  `skills --help`, `version`); the rules-inheritance and skill-discovery rows are quoted from the
  manifest and the cli-devin packet, so they are second-hand.
- **Ruled out:** reading the zero-command surface as parity debt; it is a boundary the runtime and an
  operator directive both place.
- **Boundary shape rule:** a surface reaches Devin as a nested symlink, a generated registry entry, a
  `.devin/skills/<name>/SKILL.md` skill-shaped directory, or nothing at all.
- **Next Focus:** Iteration 9 — drift detection: partial gates, their blind spots, and the cheapest
  detector that would have caught the Devin command gap.

### Iteration 9 — Drift detection

- **Worked:** asking what each gate *asks*, not what it checks. Every checker compares a mirror to its
  source; none compares a runtime to its expected surface set — which is the Devin class of gap.
- **Failed (self-corrected):** iteration 6 said four `--check` modes run nowhere; true of automation,
  false of the repo. `/doctor runtime-mirrors` runs the Pi checkers. Corrected in iteration 9.
- **Ruled out:** automating semantic agent-body divergence; that class needs a reviewer.
- **Cheapest detector:** a surface-coverage assertion table, generalizing the roster checker's pattern;
  the exemption registry for commands already exists in `command-scope.cjs` but is wired to
  generators, never used to assert coverage.
- **Next Focus:** Iteration 10 — synthesis: ranked recommendations, the five charter deliverables, and
  the phase decomposition.
