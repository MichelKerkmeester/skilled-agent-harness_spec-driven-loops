# Iteration 003 — Six-runtime hook matrix: how much is parity scaffolding? (KQ3)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 3 | focus: runtime/hooks/{opencode,claude,codex,cursor,pi,devin} — adapters, spec gate, completion evidence, session hooks; parity cost vs. actually-exercised runtimes
Evidence reads: per-runtime file/LOC survey (`find … -exec cat | wc -l`), adapter self-descriptions (frontmatter/README of each), wrapper + delegation structure in `lib/`. Reads cost: 3 shell calls.

## What the matrix is

`runtime/hooks/` — 1,712? no: counted **claude 13 files / 4,249 LOC**; **codex 10 / 1,069**; **cursor 12 / 1,523**; **devin 12 / 1,608**; **pi 10 / 667**; **lib 8 / 4,030** ("Runtime-Neutral Hook Helpers: the Gate-3 spec-gate policy core, repository-root resolution, and small ESM stdin/JSON helpers"); plus `shared-provenance.ts` (112) and a 171-line `hooks/README.md`. Total ≈ **13.4k lines of hook machinery**, of which 4 adapters (codex, cursor, devin, pi) self-describe as: "normalize <host> lifecycle payloads and delegate to the existing Claude hook implementations."

The claude dir additionally defines a **fallback contract** (claude/README): every registration in `.claude/settings.json` wraps its adapter as `node <adapter> || { <stderr marker>; <fallback JSON>; }` — a degraded-adapter prints `mk-hook-drift host=claude event=<event> adapter=<name>` and answers the host anyway, and the "runtime-mirrors doctor asset" reads the marker as a degraded-adapter signal.

## Findings

**F11 [P1 — clear waste] The out-of-process integration choice costs a ceremony the in-process equivalent does not: 3.6k lines of spread between two adapters implementing the same contractual job.**
- Where: `runtime/hooks/claude/` (4,249 LOC, 13 files, plus its own degradation protocol) vs `runtime/hooks/pi/` (667 LOC, 10 files, "extension factories for Gate-3 spec-gate enforcement and session-lifecycle context, discovered through relative symlinks in .pi/extensions/").
- Cost: the claude lineage pays, per hook, for three extra behavioral paths — (a) the primary adapter, (b) the `||`-fallback answering the host, (c) the stderr `mk-hook-drift` marker + the doctor-asset that interprets it — plus a per-host registration schema. The pi adapter implements the same Gate-3 spec-gate + session-lifecycle contract in-process, where the host's own failure model covers the degraded case. Spread: 4,249−667 = **3,582 LOC** for the ceremony, ≈6.4× the in-process cost. The ceremony additionally needs its own documentation (hooks/README, 171 lines) and its own doctor surface to be readable at all — ceremony whose reader is more machinery.
- Protects: guaranteed answers to the host when a Node subprocess fails (real, but only because the adapters are out-of-process by design).
- Recommendation: **merge** — port the claude-side registrations to the host's native extension mechanism (the pi pattern); the 3.6k LOC ceremony + its doctor-asset are the payout. Retains the validated Gate-3 policy core (lib) untouched.

**F12 [P2 — candidate] Five registration schemas, five verification stories, one behavioral contract — the parity tax.**
- Where: `runtime/hooks/{claude,codex,cursor,devin,pi}/` — 4 of 5 adapters exist only to normalize payloads and delegate to the claude implementations; each carries its own registration schema and its own "verified live" narrative (devin: "verified live under `devin -p` with the documented registration schema"; pi: "discovered through relative symlinks").
- Cost: 5× registration docs, 5× verification procedures, 4× duplication of the dispatch glue; every host-settings change (e.g. `.claude/settings.json`) must preserve the fallback wrapping or the degradation signal goes dark.
- Recommendation: **keep** (documented parity = documented capability), flagged for the run-9 census: which of the 5 registrations does this repo actually exercise — if a host has no registration in the checkout, its adapter is parity scaffolding awaiting the delete.

**F13 [P2 — candidate] The six-runtime premise ships 5/6: the `opencode/` adapter dir is empty (0 files), while the OpenCode-side integration — the primary runtime this skill targets (`.opencode/skills/…`) — lives somewhere else entirely.**
- Where: `runtime/hooks/opencode/` — 0 files (counted; the survey lists it with `files=0 lines=0`).
- Cost: a permanent note in the matrix for a runtime with no adapter here; every "six-runtime" doc pass re-reads an empty dir. Symbolically: the root doc itself warns that where `.opencode` is a symlink, "the spec scripts and generators can silently no-op — exit 0, zero output" — and the matrix's own answer is relative *symlinks* in `.pi/extensions/`, the same fragile mechanism the doctor asset exists to detect.
- Recommendation: **merge** — either delete the empty dir or move the OpenCode registration into the same native-adapter mechanism; and prefer hard files over relative symlinks in the pi integration so the "silently no-op" failure class does not reproduce.

## Counts (survey)

- 5 delegating adapters: 4,867 LOC (codex 1,069 + cursor 1,523 + devin 1,608 + pi 667) — 36% of the 13.4k-line hook surface — exist to normalize-and-delegate to the claude reference.
- 1 reference implementation: claude, 4,249 LOC / 13 files, with its own degradation protocol (primary/fallback/marker/doctor).
- 1 empty adapter: opencode/ (0/0).

## Not pursued here

- Whether a 5th/6th registration (`.cursor/settings.json`, `.codex/config.toml`, `.devin/…`) actually exists in this checkout → run 9 census (outside this skill tree; recorded only as observed counts).
