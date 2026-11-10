# Iteration 10: Synthesis

## Focus

Rank every recommendation from iterations 1 to 9 by `(operator impact × confidence) / cost`, group into
do now / do next / do not with `file:line` citations, then propose the phase decomposition. This is the
plan the operator will scaffold from. The charter's five deliverables are consolidated in
`research.md`; this iteration produces the ranking and the phases.

## Deliverable index

| Charter deliverable | Where |
|---|---|
| 1. Command matrix + the rule explaining every exclusion | `research.md` §2 (from iteration 1) |
| 2. Surface parity table (present / absent-correct / absent-gap) | `research.md` §3 (iterations 1–8) |
| 3. The Devin boundary with proof per row | `research.md` §4 (iteration 8) |
| 4. The ranked recommendation list | **this file, §1** |
| 5. The proposed phase decomposition | **this file, §2** |

## 1. Ranked recommendations

Score = `(operator impact × confidence) / cost`, on three bands each. "Operator impact" is the
reduction of *silent* failure risk for someone using a runtime — not the elegance of the fix.

### Do now

**R1 — Wire the four existing `--check` modes into pre-commit and CI.**
Impact: high. Confidence: high. Cost: low.
Two of seven runtimes (Pi, Hermes) have translation-heavy mirrors whose four working drift modes run in
neither gate, and Pi also has no hooks checker. This is a list edit, not code.
`.opencode/scripts/git-hooks/pre-commit:147-155` and `.github/workflows/spec-kit-check.yml:142-148`
would each gain `pi/sync-agents-pi.cjs --check`, `pi/sync-prompts-pi.cjs --check`,
`hermes/sync-prompts-hermes.cjs --check`, `hermes/sync-skills-hermes.cjs --check`.

**R2 — Add `sync-gate1-pointers.cjs --check` to pre-commit.**
Impact: medium. Confidence: high. Cost: low (one line).
It already runs in CI (`spec-kit-check.yml:148`) and is absent from the commit-time list, so the
dev-time and CI gate sets disagree about the same file.

**R3 — Strict-YAML frontmatter parse gate.** (Broadest protection per line of code.)
Impact: high. Confidence: high. Cost: low.
The only *silent* failure class found in this research: Devin drops an entire file whose unquoted
`description` contains a colon, and it has already hidden 12 of 36 files once. No gate exists for it,
and the files it would check are canonical for all seven runtimes.
`.devin/SYNC.md:67-74,128`.

**R4 — Surface-coverage assertion table.** (Would have caught the Devin class.)
Impact: high. Confidence: medium-high. Cost: low.
Generalize `agent-roster-mirror-check.cjs:24-46` from one surface to
`(runtime × surface → mirror | exemption reason)`. Every current checker asks "is this mirror equal to
its source?"; none asks "does this runtime have a surface here at all?" — which is why a whole command
surface could vanish with every gate green (iterations 6, 9).

**R5 — Record the Devin command exemption where the other two exclusions live.**
Impact: medium. Confidence: high. Cost: trivial (~2 lines).
`command-scope.cjs:21,27-30` already holds the two legitimate-absence reasons
(`goal-opencode.md`, `vision.md`). Devin's operator-directed removal lives only in prose
(`.devin/SYNC.md:20`) and a commit message, so the next auditor must re-derive it. Adding it makes the
absence a declaration rather than an absence.

**R6 — Correct the eight documentation drifts.** (Every future audit currently re-derives wrong numbers.)
Impact: medium. Confidence: high. Cost: low (text only).

| # | File | Claim | Live truth |
|---|---|---|---|
| a | `.codex/SYNC.md:120` | "`hooks.json` and `config.toml` are hand-authored. No generator produces them" | `hooks.json` is generated from `hook-registry.json`; only `config.toml` is hand-authored |
| b | `.devin/SYNC.md:31` | `hooks.v1.json` "hand-authored" | generated (same registry) |
| c | `.devin/SYNC.md:126` | "`hooks.v1.json` is hand-authored and unmirrorable" | same; the event *set* is unique, the file is generated |
| d | `.devin/SYNC.md:74` | present-tense "36 commands" teaching example | historical; the surface was removed |
| e | `.cursor/SYNC.md:32` | `commands/*.md (36)` | 35 |
| f | `.cursor/SYNC.md:36` | `mcp.json` is a symlink with a double hop | a real file |
| g | `.codex/SYNC.md:25`, `.pi/SYNC.md:26`, `.devin/SYNC.md:29` | agents "(13)" | 12 (`README.txt` counted) |
| h | `.opencode/hooks/goal/README.md:71-84` | per-runtime table of six | Hermes has a working binding and is missing from the table |

**R7 — Add the Hermes row to the goal hub and to `goal-plugin.md`.**
Impact: medium. Confidence: high. Cost: trivial.
The omission causes a false "no goal support" conclusion in the next audit, and the binding is real:
`.hermes/plugins/repo-guards/__init__.py:124,744,845`.

### Do next

**R8 — Extend `sync-gate1-pointers.cjs` to render the `.cursor/rules/skill-routing.md` packet list.**
Impact: medium. Confidence: medium. Cost: low-medium.
5 of 13 top-level skill packets are unrouted in the file Devin also reads
(`.cursor/SYNC.md:114`). The generator already reads a canonical source, renders into two targets, and
implements `--check`, so the delta is a second block plus a directory scan.

**R9 — MCP config generator for `.claude` / `.cursor` / `.devin`.**
Impact: low-medium. Confidence: medium. Cost: medium.
Three byte-identical copies with no checker, one of which a manifest wrongly calls a symlink
(R6f). `.pi/mcp.json` needs a dialect map (`transport`, `lifecycle`); the pattern is already proven by
`sync-hook-registrations.cjs:144`.

**R10 — Probe the Claude and Codex native goal commands on live hosts.**
Impact: medium. Confidence: low until probed. Cost: low (needs operator hosts).
The repo's only evidence is a dated operator confirmation; neither `.claude/settings.json` nor
`.codex/hooks.json` carries a goal registration that would fail loudly if the host changed
(`.opencode/hooks/goal/README.md:82`). If the probe fails, the named fallback is a `goal-codex.md`
prompt stub — added *after* the probe, not instead of it.

**R11 — Review the seven Hermes-quarantined skills.**
Impact: low-medium. Confidence: medium. Cost: unknown (depends on Hermes's prose scanner).
61 of 68 generated skills load; the other seven are excluded by Hermes's own scanner and cannot be
fixed by changing the generator (`.hermes/SYNC.md:24`). The action is either a prose rewrite or an
accepted limitation recorded as such.

**R12 — Periodic manual review of Pi's hand-authored guard bridges.**
Impact: medium. Confidence: medium. Cost: ongoing, low per cycle.
Pi's `extensions/*.ts` are "native code, not config", hand-authored against the shared guard cores,
with "no drift checker"; a core change surfaces only at runtime (`.pi/SYNC.md:18,29,113`).

### Do not

**D1 — Do not mirror the 35 commands into `.devin/commands/`.** No Devin loader consumes a command tree
(`devin --help`); the retired mirror was `.devin/skills/<cmd>/SKILL.md` and was removed on operator
directive (commit `a2241041b0`). If the surface is ever wanted back, the shape is shape 3 in
iteration 8 §F6.

**D2 — Do not add `.cursor/skills/`.** Cursor's skills live in `~/.cursor/skills-cursor/` and are
Cursor-managed; the real Cursor gap is R8 (`.cursor/SYNC.md:39`).

**D3 — Do not mirror `vision.md` into Claude, Codex or Hermes.** "Claude has no sk-vision integration"
and the host asymmetry is the recorded reason (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:10,21`).

**D4 — Do not add goal adapters for Cursor or Devin management.** Cursor's limit is an identity limit in
the host, not a missing adapter, and both adapters already write a turn on every injection
(`.opencode/hooks/goal/README.md:77,84`).

**D5 — Do not write a `.codex/config.toml` generator.** TOML plus an inline MCP block plus a
hand-authored `[features]` section has no clean single-key merge analogue (`.codex/SYNC.md:120` — the
still-true half of that claim).

**D6 — Do not automate semantic agent-body comparison.** Token-set equality is what the repo has today
and it hid a real instruction change (iteration 5). A similarity score would either fire constantly or
miss it; the control is a reviewer.

**D7 — Do not add content gates for the Cursor/Devin/Hermes agent trees.** They are symlinks with
resolution checks already in place (`agent-roster-mirror-check.cjs:27-32`).

## 2. Phase decomposition

Six phases. Each names its scope in one line, its dependencies, and the gate that closes it. Numbers
are not a sequence for P4 — it can run first because it is text-only.

**P1 — Gate coverage close-out**
*Scope:* make every working `--check` mode reachable by both gates, and make the two gate sets agree.
*Changes:* `pre-commit:147-155` **+** `spec-kit-check.yml:142-148` → add the four unwired modes;
`pre-commit` → add `sync-gate1-pointers.cjs --check`.
*Dependencies:* none.
*Closing gate:* the four generators' `--check` modes exit 1 on induced drift and 0 on restore; the
pre-commit list and the CI list are provably identical (R1, R2).

**P2 — Silent-failure guard**
*Scope:* nothing canonical may be silently dropped by a stricter host parser.
*Changes:* one gate script parsing frontmatter strictly over `.opencode/agents/*.md` and
`.opencode/commands/**/*.md`; wired like the other checkers.
*Dependencies:* P1's wiring pattern (or independent).
*Closing gate:* a fixture file with an unquoted colon-bearing `description` fails; the same file with
quotes passes (R3, `.devin/SYNC.md:128`).

**P3 — Surface-coverage assertion**
*Scope:* a whole surface cannot go missing without a recorded reason.
*Changes:* one table (`runtime × surface → mechanism | exemption reason`), one walk, exit 1 on an
uncovered pair with no exemption; seed with the Devin command exemption and reclassify the existing
command-scope sets into it.
*Dependencies:* P1 (gate wiring).
*Closing gate:* removing a mirror directory (or replaying the Devin case) fails the assertion; adding
an exemption entry passes it (R4, R5).

**P4 — Documentation reconciliation**
*Scope:* every manifest states the count and the mechanism that today's files actually have.
*Changes:* the eight rows in R6 plus R7, each edit carrying its live count as evidence.
*Dependencies:* none — do this first if only one phase runs.
*Closing gate:* a reviewer re-derives each corrected number from the tree; a doc-consistency check is
optional and would be a ninth recommendation (R6, R7).

**P5 — Cursor routing completeness**
*Scope:* the routing rule that Cursor and Devin both read lists every loadable packet.
*Changes:* extend `sync-gate1-pointers.cjs` to render the packet list into
`.cursor/rules/skill-routing.md`.
*Dependencies:* P4 (the same file is already being corrected).
*Closing gate:* adding a skill packet directory without regenerating fails `--check` (R8).

**P6 — Host-behaviour probes**
*Scope:* replace unverifiable claims about host behaviour with recorded probe outcomes.
*Changes:* probe the Claude/Codex native goal command; classify the seven Hermes-quarantined skills as
rewrite-or-accept; review Pi's guard bridges against the shared cores.
*Dependencies:* none; requires live hosts.
*Closing gate:* each claim in the goal hub and the runtime manifests is either backed by a reproduced
observation or marked unverified with its confirming check (R10, R11, R12).

## 3. What this lineage could not settle

- **Claude's and Codex's native goal commands** — operator-confirmed 2026-09-12, re-checkable only on a
  live host. Marked unverified in F4 of iteration 4 and carried as R10.
- **Codex having no skill loader** — inferred from an absence assertion in `.codex/SYNC.md:36`, never
  confirmed against the runtime's own contract. Confirming check: enumerate Codex's loader surfaces.
- **Devin's retired mirror roster** — the commit states 35 entries, not which 35. Confirming check:
  list the deleted paths in `a2241041b0` and diff against today's command tree.
- **The exact load-time cost of a new pre-commit checker** — estimated from the closest analogue
  (`agent-roster-mirror-check.cjs`, a file walk), not measured by writing it. R3/R4's cost band is
  low-confidence-high, not measured.
- **Two Devin rows quoted second-hand** — `devin rules paths` / `devin skills list` were not re-run in
  this session; only `--help`, `skills --help` and `version`. Both are marked as such in iteration 8.

## Assessment

`newInfoRatio: 0.95` — This iteration converts nine iterations of evidence into decisions, and the
ranking is the one artifact the operator acts on. Novel relative to the raw findings: the observation
that R1–R7 are all *list edits and text edits* with no new mechanism, and that the only genuinely new
code worth writing is R3 and R4.

Confidence: **high** on the ranking's inputs (each R cites a file:line established in an earlier
iteration). **Medium** on the phase boundaries: P2/P3 could merge into one gate script, and P5 could be
folded into P4 if the operator prefers fewer landings. The dependency that matters is P1 → P3.

## Reflection

Worked: scoring by *silent failure risk* rather than by surface elegance. That is what pushes the four
unwired `--check` modes and the strict-YAML gate above the more visible "Devin has no commands" story —
the Devin absence is loud, documented and correct, while the four unwired modes are quiet and wrong.

Failed: nine iterations produced eight documentation drifts and no single place that owns "the numbers
in the manifests". A tenth recommendation (a doc-consistency checker) was considered and deliberately
not added — R6 is a review-and-edit task, and a checker for prose counts would be the kind of
imported-best-practice tool that fails its own cost test.

Ruled out: recommending the Devin command surface be restored. It is a boundary the runtime and an
operator directive both place; the honest recommendation is to *record* it (R5), not to reverse it.

## Recommended Next Focus

None — this is iteration 10 of 10. The lineage stops at `maxIterationsReached` and the synthesis is
written to `research.md`.
