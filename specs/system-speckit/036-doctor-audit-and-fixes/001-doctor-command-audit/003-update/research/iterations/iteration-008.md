# Iteration 008 — Q5a: Exact flag surface and whether align ever applies

## Focus

Q5a: what is the exact flag surface of the release family (`--dry-run` default? `--accept <proposal>?`)
and does `align` ever apply an adopted file, or does it always hand off to `apply`? This iteration
grounds both halves in the repo's existing flag conventions and in the two-phase `accept`/`ship`
promotion machinery that already ships in `deep-improvement`.

## Actions Taken

1. Reloaded run state (config, strategy) and the iteration-007 narrative to carry DR-Q4-001
   (release family = `check`/`apply`/`align`; rebuild relocated to `/doctor:rebuild`) into this
   iteration.
2. Enumerated the doctor command surface (`.skilled/commands/doctor/` router, assets, scripts).
3. Read the sk-create-command contract sections that own flags and pacing:
   `references/argument-hints-and-modes.md` (§2 hint patterns, §3 `:auto`/`:confirm`) and
   `SKILL.md` Steps 9–11 (argument grammar, budget, mode completeness, router-as-first-class).
4. Read the repo's `--dry-run` corpus and route-registration mechanics:
   `.skilled/commands/deep/research.md`, `.skilled/commands/doctor/env.md`,
   `.skilled/commands/doctor/assets/doctor-env.yaml`, `.skilled/commands/doctor/_routes.yaml`,
   `.skilled/commands/doctor/scripts/route-validate.sh`, plus the current router
   `.skilled/commands/doctor/update.md` and its `user_inputs`/`field_handling`/presentation blocks.
5. Searched `.skilled` and this packet for `--accept` / decision-file idioms. Found the decisive
   precedent: `deep-improvement`'s two-phase promotion (`promote-candidate.cjs --phase=accept|ship`,
   `--approve`, `--acceptance-file`) with its contract and E2E-050 test expectations.

## Findings

### F-008-1 — `--dry-run` is an opt-in preview flag with a settled semantic contract; it is never the default and never an execution mode

- `deep/research.md:30` — `dry_run` is "default false unless `--dry-run` is present".
- `deep/research.md:128` — "`--dry-run` is a first-class flag on the confirm flow, not a third
  execution mode. It still performs real setup resolution, artifact-root resolution, focus
  selection, prompt rendering, and convergence reads when those steps can run without side effects."
- `doctor/env.md:33` — "A selector and --dry-run are workflow inputs, not execution modes."
- `doctor-env.yaml:93` declares the flag under `accepted_arguments`; `doctor-env-presentation.txt`
  (`:43`, `:150`) plus `doctor-env.yaml:114` give the full semantics: dry-run prints the identical
  destination and exact proposed lines, skips the real-write confirmation, makes no write, and
  continues to `STATUS=OK` with a dry-run note.
- `argument-hints-and-modes.md:36` — the canonical hint pattern for it is
  `"<target> [--dry-run] [--confirm]"`, described as "flags alter safety or preview behavior".
- Route registry treatment: `_routes.yaml:68-69` registers `dry_run` in `setup_vars` and
  `--dry-run` in `allowed_flags` for the mutating skill-advisor route, while the read-only
  skill-budget route (`_routes.yaml:90-94`, `mutating: read-only`) carries `--json`/`--top-n` but
  no `--dry-run`. `route-validate.sh:65,79,87` validates those `allowed_flags` lists.

Consequence: a read-only route does not advertise `--dry-run`; a mutating route does, as its
zero-write mode. `--dry-run` is therefore **never the default**, and a command that only reads does
not need it.

### F-008-2 — The repo already separates an `accept` phase from a `ship` phase; that is exactly the align/apply split

`deep-improvement` ships a two-phase promotion whose semantics are the release family's align/apply
contract, already proven and tested:

- `promote-candidate.cjs:680-681` — usage is
  `--phase=accept|ship ... --approve=<receipt> [--acceptance-file=...]`.
- `promotion-gate-contract.md:159,208` — the acceptance state is written to an explicit
  `--acceptance-file={...}.accepted.json`.
- `manual-testing-playbook/end-to-end-loop/two-phase-promotion-and-rollback.md:45` (E2E-050) pins
  the properties: "accept leaves canonical untouched, ship writes the accepted snapshot, rollback
  restores the backup"; "ship returns `status: "shipped"` and writes accepted snapshot content,
  not the mutated candidate file"; a drifted ship "exits 1"; the failure path restores the target
  and records `promotion_blocked_branch_preserved` + `canonical_target_changed`.

Mapping: **align = accept phase** (classify, snapshot the accepted bytes, never touch the skill
tree), **apply = ship phase** (write accepted snapshot bytes only, refuse on drift since acceptance,
git-based rollback). This is the same mutation-class split recorded in F-iter007-001 and the same
"apply consumes accepted decisions only" property noted in finding-5-17. It also respects
finding-5-14: never auto-write merged text; resolution stays with the human.

### F-008-3 — `--accept <proposal>` is not this repo's idiom; the accepted decision file is the consent channel

- No command in `.skilled/commands` or the sk-doc contract uses a proposal-id accept flag. The only
  `--accept*` flags found are script-level and different in kind: `--accept-payload` (scoring
  scripts), `--accept-hooks` (Hermes dispatch policy), and `--acceptance-file` (promotion).
- The repo's accept idiom is a **file**, not an id: `--acceptance-file` carries the accepted snapshot
  and fingerprints that the ship phase verifies before writing.
- The repo's command-level flag vocabulary is booleans (`--force`, `--no-snapshot`,
  `--cleanup-legacy`, `update.md:3`) plus bounded values (`--scope=...` at `_routes.yaml:52,69`,
  `--top-n=N` at `:93`) and paths (`--spec-folder=PATH`, `--config-dir`, `--acceptance-file`).
  Proposal ids do not appear anywhere.

Consequence: the accept moment belongs to `align` (per-file decisions: `adopt-release` |
`keep-local` | `keep-local-and-record-divergence`, per skill `defer`, per finding-5-15). `apply`
does not re-offer acceptance; it consumes the decision file and refuses to invent one.

### F-008-4 — Q5a design record: exact router hint, per-route flag surface, and align's handoff rule

**Align never applies.** Its write class is run-state artifacts only (`add-only` in the
`_routes.yaml` vocabulary seen at `:53`; the doctor-deep-loop precedent at `:50-54` writes a state
JSON under the active spec folder's scratch and is classified `add-only`). It never writes a skill
file. Its handoff is a first-class output: the decision-file path plus the exact
`/doctor:update apply --decisions=<path>` next step.

**Proposed surface** (router hint summarizes per `SKILL.md:217`; the router's EXECUTION TARGETS
enumerates the exhaustive list; `_routes.yaml` records the per-route `allowed_flags` for
`route-validate`):

```
argument-hint: "[check|apply|align] [--json] [--dry-run] [--release=<tag>] [--decisions=<path>] [--scope=all|<skill,...>]"
```

| Action | Flags | Mutation class | Notes |
|---|---|---|---|
| `check` | `--json`, `--release=<tag>` | read-only | Needs no `--dry-run`: dry-run marks a mutating route's no-write mode, and check is read-only by construction (F-008-1). `--release=<tag>` pins the upstream side for audits/re-checks (tag-authoritative identity, F-006-1). |
| `align` | `--dry-run`, `--release=<tag>`, `--scope=all\|<skill,...>` | add-only (run-state artifacts) | `--scope` extends the route-scope convention (`_routes.yaml:52,69`). `--dry-run` = print proposals, write no artifacts, `STATUS=OK` with a dry-run note (doctor-env semantics). Per-file decisions are taken interactively; all proposals and decisions land in the route's run-scoped state dir (finding-5-16). |
| `apply` | `--dry-run`, `--decisions=<path>` | mutates (skill bodies; git rollback) | `--decisions` defaults to the latest align run's file recorded in route state; absent file = apply release to un-customized skills only and report customized ones untouched (safe default, never overwrite customized without accepted decisions). Does **not** accept `--release`: the decision file pins the release reachability, and a mismatched pin refuses with a re-align instruction. |

Pacing and consent:

- Carry over `update.md:31`'s posture: "This command is always interactive; deleted mode suffixes
  are invalid." Do not advertise `:auto|:confirm`, so the mode-completeness rule (`SKILL.md:325-327`,
  both assets plus an EXECUTION TARGETS row per advertised mode) is not triggered.
- `apply` always asks the startup confirmation before the first write, mirroring
  `update.md:48-49` and `doctor-update-presentation.txt:5-21` ("Ask this prompt before any mutating
  phase unless `--force=true`"; `1) Proceed`, `X) Cancel`, Enter = proceed). `align` asks its
  consolidated decision batch once per skill, not per micro-question
  (`argument-hints-and-modes.md:65`).
- Rollback: `apply` stages, writes accepted bytes, and rolls back via git (the release family's
  mutation class), while `/doctor:rebuild` keeps its VACUUM-snapshot rollback (DR-Q4-001).

**Rejected alternatives.**

- `--accept=<proposal>` / `--accept=all`: no precedent, and the decision unit is per-file, not one
  proposal. Batch acceptance belongs in align's confirmation UI and is recorded in the decision file
  (F-008-3).
- `--dry-run` as the default or as a third mode: contradicts `deep/research.md:128` and
  `doctor/env.md:33`; the default protection is the confirmation gate (F-008-1).
- A `--force` bypass for apply's drift refusal: drift means the file moved since acceptance, which is
  a changed contract, not a warning to downgrade. The ship-phase precedent exits 1 instead
  (E2E-050, F-008-2). If a headless apply is ever needed, the repo-native spelling would be
  `--force` (an auto-answered confirmation, `update.md:49`) rather than `--accept`/`--yes`, but v1
  should not ship it.
- `align` applying adopted files itself: would duplicate apply's staging/rollback/drift machinery
  and merge two mutation classes into one route (F-008-2, F-iter007-001).

**Interaction with still-open Q3b:** the decision record's location (git-tracked ledger vs gitignored
run state) changes where align writes, but not its flag surface; either way align stays `add-only`
and never writes the skill tree.

## Questions Answered

- **Q5a** — answered. `--dry-run` is opt-in (default false), never a mode; `check` carries no
  dry-run because it is read-only; `align` and `apply` carry it with the doctor-env zero-write
  semantics. There is no `--accept <proposal>` flag: the accept channel is align's per-file decision
  file, which apply consumes and verifies against accepted fingerprints. Align always hands off to
  apply and never writes a skill file; apply is the only skill-body writer.

## Questions Remaining

- **Q5**: remaining shape work — EXECUTION TARGETS rows, YAML phase structure per action, the
  presentation asset, the `_routes.yaml`/standalone registration and phrase transfer from
  `_routes.yaml:234/236`, and reuse of install/sync scripts (flag surface is now closed).
- **Q3b**: divergence ledger git-tracked vs gitignored (F-008-4 folds it into align's write class).
- **Q1c**: system-skill-advisor frontmatter/changelog mismatch — error or warning.
- **Q3a**: exact hash input of `provenance_fingerprint` — cheap close-out.
- **Q1b**: composite child skills as independent update units — decision needed.
- **Q1 / Q1a**: release detection and the no-git/no-`gh` degradation path (carried;
  F-iter007-005 constraint: package.json is not a version source).
- **Q4a**: rename mechanics and reference sweep for the rebuilt command (implementation-level).

## Next Focus (recommendation)

Close the remaining decision conversions in one batch: Q3b (ledger location), Q1b (child skills as
update units), Q1c (mismatch severity) and the Q3a verification, then finish Q5's structure
(EXECUTION TARGETS rows, per-action YAML phases, presentation asset) with the flag surface frozen by
this iteration.

## SCOPE VIOLATIONS

None executed. All research paths were read-only; the flag surface and design decisions above are
proposals for the implementation packet, and no researched file was modified.
