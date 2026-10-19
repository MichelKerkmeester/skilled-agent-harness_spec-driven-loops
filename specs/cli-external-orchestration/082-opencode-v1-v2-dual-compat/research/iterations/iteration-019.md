# Iteration 19 — A16: Release cadence, pinning, and what "perfect" can promise

## Focus

Measure the actual release cadence of the v1 and v2 lines from the npm registry; read the v2
documentation for any stability, beta, semver or support-window statement; then derive
(1) minimum supported versions with a reason per floor, (2) the pinning strategy for
`.opencode/package.json`, (3) runtime detection of an unsupported version, (4) a support-window
policy, and (5) an honest statement of what "perfect compatibility" can and cannot guarantee.

## Actions Taken

1. `npm view <pkg> dist-tags` for `opencode-ai`, `@opencode/cli`, `@opencode/plugin`, `@opencode-ai/plugin`.
2. `npm view opencode-ai time --json` and `npm view @opencode/cli time --json`, reduced in a node
   one-liner to per-minor counts, first/last dates and spans.
3. Read the repo's two manifest pins and every `@opencode-ai/plugin` / `zod` declaration via `rg`.
4. Fetched `https://opencode.ai/v2/docs/` (no stability statement present) and
   `https://opencode.ai/v2/docs/migrate-v1` (breaking-change and compatibility statements present).
5. Read `research/deep-research-strategy.md` §3 to confirm all five key questions are already ticked,
   so this iteration claims no new key-question tick.

## Findings

### F1 — `latest-1` is NOT a v1 maintenance signal; the prompt's premise is falsified

`opencode-ai` dist-tags resolve as: `latest` = **1.19.3**, `latest-1` = **1.1.4**.
`latest-1` names an early-1.x line, not "one major behind". Using it to judge whether v1 is still
maintained would have reported 1.1.4 and concluded v1 was abandoned roughly sixteen minors early.

v1 maintenance must instead be read from the packages that carry the v1 scope:
`opencode-ai@latest` = 1.19.3 and `@opencode-ai/plugin@latest` = 1.19.3, both published
**2026-10-16T12:32Z** — the same day as the newest v2 publish. The v1 line is actively maintained.

### F2 — Release-cadence table

| Line | npm package(s) | Versions in window | First → last | Span | Versions/day |
|---|---|---|---|---|---|
| v1 1.18.x | `opencode-ai` | 36 | 2026-07-14 → 2026-10-06 | 84 d | ~0.43 |
| v1 1.19.x | `opencode-ai` | 4 | 2026-10-11 → 2026-10-16 | 5 d | ~0.80 |
| v2 2.0.x | `@opencode/cli` | 33 | 2026-09-11 → 2026-10-16 | 35 d | **~0.94** |

Total 1.x versions published: 458. Total 2.x versions published: 33, all inside a single minor (2.0.x).
v2 ships at more than **double** the v1 1.18 cadence, and the entire 2.x line has never left 2.0.

Named dates used below: `1.18.34` = 2026-09-30T22:38Z · `1.18.35` = 2026-10-06T20:21Z ·
`1.19.0` = 2026-10-11T01:38Z · `1.19.3` = 2026-10-16T12:32Z.

### F3 — v1 and v2 live in different npm scopes, and the repo's manifest only names the v1 one

- v1: `opencode-ai` + `@opencode-ai/plugin` (scope `@opencode-ai/`), `latest` = 1.19.3.
- v2: `@opencode/cli` + `@opencode/plugin` (scope `@opencode/`), `latest` = 2.0.32.

The repo pins `@opencode-ai/plugin` `1.18.34` in both manifests
[SOURCE: .opencode/package.json:7] and [SOURCE: .skilled/package.json:4]. Neither
`@opencode/cli` nor `@opencode/plugin` appears anywhere in the repo. Consequence: on a v2-only
install the repo declares **no v2 type surface at all**, and there is no rename that fixes it —
the v2 package simply has a different name.

### F4 — The 1.18.34 pin predates the v2-aware v1 line, so iterations 1–3 measured the wrong host

`1.18.34` was published 2026-09-30; the 1.18 line then shipped `1.18.35` on 2026-10-06, and 1.19.0
opened on 2026-10-11. The pin is therefore one patch behind the end of its own minor **and three
releases behind the line the repo actually targets** (1.19.x). The 1.19 line is the one whose CLI
deliberately rejects v2 keys rather than silently stripping them — the plan's own observation that
1.19.x reports "V2 permissions are not supported by OpenCode V1". Every v1-side plugin-contract
measurement taken against `1.18.34` (plugin default-export shapes, `PluginInput` domain list,
`session.messages` signature) describes a host that is not the target host. Those findings remain
valid only as a lower bound.

### F5 — v2 publishes no stability guarantee, and v1 publishes no end-of-life statement

From `https://opencode.ai/v2/docs/migrate-v1`, verbatim:

- "V2 has three intentional breaking changes:"
- "Plugins use a new plugin API."
- "The server API and clients have new contracts."
- "Terminal client configuration moves from layered `tui.json(c)` files to one global `cli.json` file (auto migrated)."
- "V1 plugin implementations do not run in V2. Moving a file or renaming its config entry is not enough."
- "the server API is an intentional breaking change."
- "Integrations that call the V1 server API must migrate to the V2 API."
- "Supported V1 functionality outside those areas is intended to remain compatible with V1."

There is **no** stability, beta, "not production ready" or semver guarantee on the page, and
**no** statement of how long v1 stays supported. `https://opencode.ai/v2/docs/` carries no
stability statement either. `2.0.32` is published under the plain `latest` tag, so v2 is
*shipped*, not flagged as beta — but *shipped* is not the same as *guaranteed*.

The last quoted line is load-bearing in the other direction: OpenCode commits that V1 functionality
outside the three named areas "is intended to remain compatible with V1". That is an intent
statement about V1's own stability, not a guarantee about V2's.

### F6 — Minimum supported versions (floor table)

| Host | Floor | Reason |
|---|---|---|
| v1 | **1.19.0** | 1.19.x is the first v1 line that *knows about* v2 config keys and rejects them explicitly. On 1.18.x those keys are silently stripped, so a misconfigured dual-compat install looks healthy while doing the wrong thing. A loud rejection is a supportable failure; a silent strip is not. |
| v2 | **2.0.32** | The only 2.0.x measured anywhere in this run. Every v2 contract finding — plugin definition shape, `session.messages`, `run --standalone`, env propagation, server API — was taken against 2.0.32, and no earlier 2.0.x was probed. Declaring an untested patch as supported is the exact claim this run cannot back. |

The previously proposed **1.18.29 floor for object plugin entries is superseded** by the 1.19.0
floor: 1.19.0 is a strict superset requirement, so 1.18.29 is dead weight.

### F7 — Pinning strategy

1. **v1 host dependency:** move `@opencode-ai/plugin` from `1.18.34` to the exact `1.19.3` in both
   manifests. Exact, not `^` — F2 shows the minor moves in days, and the F4 history is what a
   caret range buys you.
2. **v2 host dependency:** add `@opencode/plugin@2.0.32` as a **devDependency only**, in a separate
   optional dependency group, never as a runtime dependency. The runtime reason is iteration 11's
   A10-Q1 result: plugins must stay runtime-import-free, so the v2 package exists to type-check,
   not to `import` from at load time.
3. **`zod`:** currently undeclared in [SOURCE: .opencode/package.json:7]'s manifest while
   `@opencode-ai/plugin` re-exports it — a floating transitive. Either declare it at the major the
   host itself resolves, or (preferred) remove bare imports from plugin sources entirely so the
   question stops mattering.
4. **Do not try to unify the two dependencies.** F3 makes them different packages in different
   scopes; a single specifier cannot name both.

### F8 — Runtime detection of an unsupported version

Detect from the binary, never from the environment — iteration 14 established that on v2 the env a
plugin sees comes from the background daemon, not the invoking client, so an env probe can report
the wrong host.

Acceptance predicate, on the parsed `opencode --version` output:

- parse `major.minor.patch`; reject any non-numeric core rather than coercing it;
- accept `major === 1 && minor >= 19`;
- accept `major === 2 && (major.minor.patch) >= 2.0.32`;
- reject everything else with a message naming **the floor for that major** and **why** (F6), and
  exit non-zero. Never warn-and-continue: F6's whole argument is that a silent misconfiguration on
  the wrong floor is indistinguishable from success.

### F9 — Support-window policy

"Test on each new v2 minor" is the wrong cadence for a line that currently publishes ~0.94
versions/day (F2), and it is also the wrong shape: 2.0.x has not yet *had* a second minor.
The policy instead:

- **Certify per v2 minor at `.0`, plus one pinned patch per calendar month.** Re-run the probe suite
  against `2.<minor>.0` when it appears and against the then-current `latest` patch at the start of
  each month; pin exactly what passed.
- **Retest immediately, off-cycle,** on any release whose notes touch the four surfaces this repo
  depends on: the plugin definition shape, the session/message API, the config schema, and `run`
  flags.
- **Drop v1 when `opencode-ai@latest` — the v1 line, not `latest-1` — has gone ≥ 30 days without a
  publish.** That is a measurable trigger rather than a date, and at F2's v1 cadence it fires only
  on a real stop, not on a quiet week.
- **Record the tested set in one place**, so "supported" has an artifact behind it rather than a
  recollection.

### F10 — What "perfect compatibility" can and cannot promise

**Can guarantee:**

1. Against the two pins in F7, every repo agent, command, skill, plugin and config file loads and
   the enumerated divergence set is complete for the surfaces this run probed.
2. The divergence is explicit: a reader can name, per surface, whether v1 and v2 take the same
   file or two.
3. A host outside the tested set fails **loudly**, with the floor and the reason (F8).

**Cannot guarantee:**

1. **Forward compatibility.** v2 publishes ~1 version/day, has already declared three intentional
   breaking changes, and publishes no semver statement (F2, F5). "Perfect" against 2.0.32 says
   nothing about 2.1.0.
2. **Behaviour on un-probed surfaces.** Every surface this run could not reach — the carried-forward
   questions still open in the state log — is an unverified assumption inside the compatibility
   claim, not outside it.
3. **That v1 is still there.** There is no v1 end-of-life statement (F5) and no `latest-1` signal
   (F1); the only observable is the v1 line's publish date.

The honest formulation for the docs: *"Verified against OpenCode 1.19.3 and 2.0.32 on <date>.
Those are the only versions the dual-compat claim covers. Later versions are unsupported until
re-verified; earlier ones are refused."*

## Questions Answered

No strategy key question was newly answered — all five (§3) were already ticked before this
iteration, so `answeredQuestions` is empty. Within A16, the iteration's own sub-questions are
answered as F1 (cadence), F6 (floors), F7 (pinning), F8 (detection), F9 (window), F10 (limits).

## Questions Remaining

- **A16-Q1 (new, P1):** Does `@opencode/plugin@2.0.32` re-export `zod`, and at which major? If it
  does not, the v2 leg needs `zod` declared even in the type-only direction, and F7 item 3 becomes
  mandatory rather than preferred.
- **A16-Q2 (new, P1):** Do `@opencode-ai/plugin` (v1 scope) and `@opencode/plugin` (v2 scope)
  coexist in one `node_modules` without colliding on type names such as `Plugin`, `PluginInput` or
  `Hooks`? Decides whether one type-check configuration can cover both legs or two are needed.
- **A16-Q3 (new, P2):** Does `opencode --version` print a bare `2.0.32` on the v2 binary, and does
  it accept `--version` in both flag positions? F8's parser depends on both.
- **A16-Q4 (new, P2):** Does v1 1.19.3's version string carry a build suffix (e.g. `1.19.3-<hash>`)?
  A naive strict parse would reject it; F8 says reject non-numeric cores, which could refuse a
  valid host.
- **A16-Q5 (new, P2):** What is the publish date of `2.0.0` relative to `2.0.32`? F2's span starts at
  2026-09-11 but that is the first 2.x entry, not confirmed to be 2.0.0 — if 2.0.x opened as a
  rapid stabilization burst, the ~0.94/day rate is a burn-in rate and not the steady state F9
  should plan around.
- Carried forward and untouched: `plugins` (plural) vs `plugin` (singular) config tolerance on both
  versions; `.opencode/plugins/` discovery unions and flat-file loading on v2; `sk-vision.js`
  symlink following; `run --format json` schema and `--standalone`; `ORCA_OPENCODE_PLUGIN_API`
  host-derived replacement; the `Reload` mixin; `session.idle` / `session.execution.*`; `SystemPart`
  shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; the v2 event
  scheme; command-template `` !`cmd` `` injection; `.opencode/command` vs `.opencode/commands` scan;
  `Q-R1`–`Q-R5`; `-m provider/model#variant` on v1 1.19.3; `run` positional-directory behaviour;
  hidden `--dangerously-skip-permissions`; `models` positional provider on v2; `OPENCODE_DB` on v1;
  `opencode upgrade --major` interactivity; `bun add -g` / `pnpm add -g` two-prefix layout;
  `opencode2 uninstall` vs the background service; A14-Q1–A14-Q5.

## Next Focus

Iteration 20 of 20 — the final iteration. Synthesise the run into the packet's closing artifact
rather than opening new surface: reconcile the divergence set across all sixteen areas (A1–A16),
carry F4's caveat (v1-side measurements taken against 1.18.34, not 1.19.3) into the synthesis so no
earlier v1 contract claim is restated as settled, and land F6–F10 as the publishable floor, pinning,
detection and support-window text. Answer A16-Q1–Q5 only where a single cheap registry or `--version`
read settles them; otherwise record them as the run's known-unknowns.

## SCOPE VIOLATIONS

None. All reads were of repo files, npm registry metadata and public documentation; all writes went
to this packet's `research/iterations/` and `research/deltas/` paths.
