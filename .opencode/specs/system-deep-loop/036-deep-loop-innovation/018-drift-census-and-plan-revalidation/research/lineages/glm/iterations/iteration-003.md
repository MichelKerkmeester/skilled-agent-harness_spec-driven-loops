# Iteration 3: Phases 004-006 drift

## Focus

Iteration 3's focus was Q-003: drift over phases 004 (architecture coverage + transition contract), 005 (fanout live-tools unblock — touched by `739b85ac57` itself), and 006 (transition authorized-ledger core — touched indirectly by `6cd8ab14e4e` and `708d25acf04`). Resolve every runtime path each phase names against pinned HEAD; flag any premise invalidated by the typed-pair routing surface or the cli-opencode unblock.

## Actions Taken

1. Read `004/spec.md`, `004/` child listing — three children: `001-spine-architecture-adr`, `002-recommendation-ledger-bijective-map`, `003-transition-versioning-and-rollback-policy`. No `plan.md` at parent (parent is a phase hub).
2. Read `005/spec.md` and `005/plan.md` — extracted runtime path citations: `runtime/scripts/fanout-run.cjs:1382`, `runtime/lib/deep-loop/executor-config.ts`, `runtime/tests/unit/executor-config.vitest.ts`, `runtime/tests/unit/fanout-run.vitest.ts`, `002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs:47`.
3. Read `006/spec.md` — extracted citations: `runtime/` (general), `002-deep-loop-effectiveness-and-fanout/research/research-modes.md`, `004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`.
4. Resolved every cited path at HEAD with `git cat-file -e 739b85ac57:<path>`.
5. Read `git show --stat 739b85ac57` + commit body — what the cli-opencode unblock actually shipped (17 lines, dispatch-env only).
6. Grepped `fanout-run.cjs` and `executor-config.ts` for phase-005 deliverable keywords: `liveTools`, `webSearch`, `invocationFingerprint`, `capability preflight`, `live-search`.
7. Verified phase-005's premise (cli-codex argv starts with `exec`) by reading `fanout-run.cjs` around the cited line.

## Findings

### F3.1 — Phase 004: zero drift detected (candidate negative control)

Phase 004 is a phase parent with three children. Cited paths inside phase 004 are intra-packet (`001-spine-architecture-adr`, `002-recommendation-ledger-bijective-map`, `003-transition-versioning-and-rollback-policy`) — all resolve at HEAD. Phase 004 does NOT cite any `runtime/` path that could have been renamed by `cc77a1e550a`, nor any routing-registry path that could have been touched by `6cd8ab14e4e` / `708d25acf04` / `908efde8d8f`.

Phase 004's `001-spine-architecture-adr` is referenced by phase 006 (`006/spec.md:54` cites `../004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`) and that path resolves.

No first-order drift. No second-order drift (phase 004 establishes the spine ADR; nothing in the routing commits invalidates an architecture-decision record). **Phase 004 = still valid.** This is a candidate for the negative-control slot (Q-009), subject to confirmation in iteration 7's full sweep.

[SOURCE: `004/spec.md` (no `runtime/` path citations); `git cat-file -e 739b85ac57:...001-spine-architecture-adr/spec.md` resolves; `git cat-file -e 739b85ac57:...002-recommendation-ledger-bijective-map` resolves; `git cat-file -e 739b85ac57:...003-transition-versioning-and-rollback-policy` resolves.]

### F3.2 — Phase 005: cited paths resolve, premise intact, deliverables NOT shipped (still valid)

Phase 005 cites five runtime paths. All five resolve at HEAD:
- `runtime/scripts/fanout-run.cjs` — RESOLVES (file exists, line 1382 currently lands inside the `buildLineageCommand` docstring; function definition is intact at lines ~1383-1390).
- `runtime/lib/deep-loop/executor-config.ts` — RESOLVES.
- `runtime/tests/unit/executor-config.vitest.ts` — RESOLVES.
- `runtime/tests/unit/fanout-run.vitest.ts` — RESOLVES.
- `002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs` — RESOLVES.

Phase 005's stated premise — "the `cli-codex` command builder starts argv with `exec`" so leaves cannot request `codex --search exec` — is STILL TRUE at HEAD. `fanout-run.cjs:1390-1391` shows `const args = ['exec', ...]` in the cli-codex branch. The reason phase 005 exists is intact.

Phase 005's planned deliverables (`liveTools.webSearch: inherit|disabled|cached|live` policy, per-kind adapters with `invocationFingerprint`, manifest expansion with `models[]`/`branches[]`/`replicas`) are NOT YET shipped. Grep for `liveTools|webSearch|invocationFingerprint|capability preflight|live-search` in `fanout-run.cjs` and `executor-config.ts` returns ZERO hits. The work phase 005 plans is still on the table.

The only commit in range touching `fanout-run.cjs` is `739b85ac57` itself — and it is ORTHOGONAL to phase 005's scope: a 17-line cli-opencode dispatch-env fix (inject `MK_SPEC_GATE_DISABLED=1` + `AI_SESSION_CHILD=1`, drop hard-coded `--pure`, fix the `--dangerously-skip-permissions` splice). Phase 005's `REQ-007` (legacy fan-out backward-compatibility) actually dovetails with `739b85ac57`'s "no regression observed" guarantee.

**Phase 005 = still valid** (with cosmetic note: `:1382` citation now lands in a docstring; the function it points at is unchanged in shape).

[SOURCE: `005/spec.md:52` (premise: cli-codex starts argv with exec); `fanout-run.cjs:1390-1391` (`args = ['exec', ...]` still true); grep `liveTools|webSearch|invocationFingerprint` in `runtime/scripts/fanout-run.cjs` and `runtime/lib/deep-loop/executor-config.ts` = 0 hits; `git show --stat 739b85ac57` shows only `fanout-run.cjs` changed, 17 lines, dispatch-env scope.]

### F3.3 — Phase 006: cited paths resolve, no drift detected

Phase 006 cites two intra-packet paths plus the general `runtime/` substrate. Both intra-packet citations resolve at HEAD:
- `002-deep-loop-effectiveness-and-fanout/research/research-modes.md` — RESOLVES.
- `004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md` — RESOLVES.

Phase 006's scope is the DARK substrate: versioned event envelope, typed append-only ledger, replay fingerprints, fail-closed transition-authorization gateway. It is explicitly "dark (non-authoritative)" — legacy writers remain the source of truth until phase 014. None of the routing commits (`6cd8ab14e4e`, `708d25acf04`, `908efde8d8f`) touch ledger, event-envelope, or transition-authorization paths.

The typed-pair routing surface (`708d25acf04`) added `resourceContractVersion: 1` to `mode-registry.json`. Phase 006 doesn't read `mode-registry.json` — it writes a parallel typed event substrate. No interaction.

**Phase 006 = still valid** (no first-order or second-order drift). Candidate for negative control alongside phase 004.

[SOURCE: `006/spec.md:48` (handoff criteria — dark substrate); `006/spec.md:54` (citations); `git cat-file -e 739b85ac57:...research-modes.md` resolves; `git cat-file -e 739b85ac57:...001-spine-architecture-adr/spec.md` resolves; `git diff 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop/mode-registry.json` shows only metadata changes, no ledger/event-envelope paths.]

## Questions Answered

- **Q-003** (phases 004-006 drift): ANSWERED. All three phases = still valid. Every cited runtime path resolves; phase 005's premise (cli-codex starts with `exec`) is intact and its deliverables are unshipped; phase 006's dark substrate is untouched by the routing commits. Phases 004 and 006 are negative-control candidates (zero drift).

## Questions Remaining

- Q-004 (phases 007-009), Q-005 (phases 010-012), Q-007 (phases 014-015), Q-008 (phases 016-017 + packet-033 question B), Q-009 (negative control confirmation — phase 004 or 006 likely).

## Sources Consulted

- `004/spec.md`, `004/{001,002,003}/` listings
- `005/spec.md:52,54,61,63,64,65` and `005/plan.md:33,38,65,66,73,80,98,101`
- `006/spec.md:48,54,65,66,67`
- `git cat-file -e 739b85ac57:<path>` for all 9 cited paths (all resolve)
- `git show --stat 739b85ac57` + commit body (cli-opencode unblock, 17 lines, dispatch-env only)
- `fanout-run.cjs:1378-1395` (buildLineageCommand, cli-codex argv still starts with `exec`)
- Grep `liveTools|webSearch|invocationFingerprint|capability preflight|live-search` in `fanout-run.cjs` and `executor-config.ts` (0 hits)
- `git diff 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop/mode-registry.json` (30-line diff, no ledger paths)

## Assessment

- **newInfoRatio: 0.55** — About half net-new: the per-phase verdicts (004/005/006 still valid) are new, and the "phase 005 deliverables unshipped" finding (F3.2) is a load-bearing negative result that protects phase 005 from being marked redundant. The path-resolution technique reuses iter 1's `git cat-file -e` approach, which is the re-derived half.
- **Novelty justification:** F3.2's "phase 005's deliverables are NOT in tree even though `739b85ac57` touched the same file" is the kind of premise check the spec's SC-003 demands (flag phases whose work has been overtaken — here, the inverse: confirm the work has NOT been overtaken). That required grepping the deliverable surface, not just resolving paths.
- **Confidence:** high. Every verdict is reproducible from the documented `git cat-file -e` and grep commands.
- **Tool-call budget:** 4/12 used. Reserved headroom for state writes.

## Reflection

### What worked

- Resolving EVERY cited path before judging: turned up zero path failures for phases 004-006, which is itself the negative-control evidence Q-009 needs.
- Reading `739b85ac57`'s commit body before assuming "the commit named in 005's bucket must have shipped 005's deliverables": the commit is a 17-line dispatch-env fix, not phase 005's implementation. The plan.md F1.3 "medium" risk rating for phase 005 could have been a false positive without this check.
- Grepping for the deliverable keywords (`liveTools`, `webSearch`, `invocationFingerprint`): the zero-hit result is positive evidence the phase is still needed, not just unchanged.

### What failed

- _Approach (rejected):_ "Trust the iter-1 F1.3 risk rating of `medium` for phase 005." _Reason ruled out below._

### Ruled out

- _Approach:_ "Mark phase 005 needs-refinement because `739b85ac57` touched `fanout-run.cjs`." _Reason ruled out:_ `739b85ac57` is a 17-line dispatch-env fix orthogonal to phase 005's scope; phase 005's cited line and function are intact; phase 005's deliverables are unshipped and still needed. _Evidence:_ `git show --stat 739b85ac57` = 17 lines in `fanout-run.cjs`; grep for `liveTools|webSearch|invocationFingerprint` = 0 hits.

## Recommended Next Focus

Iteration 4: Phases 007-009 drift. Phase 007 (shared evidence + control services — touched by skill-benchmark typed-pair series), 008 (compatibility shadow + rollback bridge), 009 (fanout fan-in durable orchestration — touched by `739b85ac57` and `9259c23e313`). Resolve every runtime path each phase names; flag any second-order drift from the typed-pair skill-benchmark rewrites.
