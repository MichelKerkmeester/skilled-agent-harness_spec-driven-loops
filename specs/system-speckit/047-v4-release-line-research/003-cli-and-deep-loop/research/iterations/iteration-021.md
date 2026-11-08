# Iteration 021 — cli-classifier: the cli-jev transport, its features and its key handling

## Focus

Unread ground named by the focus prompt: `.skilled/skills/cli-classifier/**`, specifically the
`cli-jev` transport (`shared/scripts/jev-transport.mjs`, `shared/scripts/jev-features.mjs`), its
existing tests, and the Jev sections of `v4.0.0.2`, `v4.0.0.3` and `v4.0.1.0`. Request building,
timeouts, error handling, key storage and the documented switches were checked against the code
with `path:line`. No live network call was made and no key was read; the only execution was the
suite's own read-only test run.

Nothing was written outside this packet. The researched tree was read only.

## Actions Taken

1. Read the release notes' Jev claims: `v4.0.0.2` §"cli-jev and the Deep Loops Do What They Say"
   (router phrasing), `v4.0.0.3` §"Jev Classifier" (four features, four switches, `/deep:model-benchmark`,
   the Pi-first route) `[SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:236]`, and `v4.0.1.0`'s
   per-skill changelog index `[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:167]`.
2. Read `jev-features.mjs` in full — the switch registry, `isOff`, `featureSwitch`, `which`,
   `jevReady`, `featureReady` `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:38]`.
3. Read `jev-transport.mjs` in full (607 lines): transport selection, `choice`/`noul` request
   parsing, Pi context and payload mapping, the Pi package resolution and preflight, the bounded
   child spawn `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:36]`.
4. Counted every `JEV_FEATURE_*` reference in the repo to test the note's four-switch claim, then
   checked `.skilled/commands/deep/` and `.skilled/commands/deep/assets/` for `/deep:model-benchmark`.
5. Ran the mode's own suite read-only: `node --test .skilled/skills/cli-classifier/shared/scripts/tests/`
   → `tests 69 / pass 69 / fail 0`. Read the fixture that pins the Pi version.

## Findings

### f-iter021-001 — bug, P1. The Pi classifier route is gated on an exact Pi version, and the real install fails that gate.

`PI_PACKAGE_VERSION = '0.99.2'` `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:36]`
is compared for equality before Pi is used at all:
`if (pi.version !== PI_PACKAGE_VERSION) return { gate: 'version' };`
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:374]`.

The Pi on this machine is **1.5.0** (`pi --version`). `resolvePiPackage` climbs from the `pi`
executable to a manifest named `@earendil-works/pi-coding-agent`
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:335]`, so the `package`
gate passes and the `version` gate is the one that fires — every classifier call falls through to
the `jev` CLI. The note's headline claim is the opposite: "Yes-or-no and choice questions go to
Pi's built-in classifier first and fall back to the `jev` command"
`[SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:259]`.

The failure is invisible by design. In the automatic route (`auto`, the default —
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:69]`) a failed gate
returns `cli()` without reporting:
`if (route.transport === 'pi') reportPiPreflightFailureOnce(...)`
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:556]`. The comment at
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:44]` states this is
deliberate ("automatic fallback stays quiet"), which makes the pin's cost silent on every machine
running a Pi other than 0.99.2 — that is, on the operator's own machine.

Release introduced: v4.0.0.3 (the Pi-first transport). Confidence: high (constant, comparator,
installed version and gate all read). Severity P1: the documented default route never runs, and a
machine with no stored Jev key therefore has no working classifier at all.

Verify: `pi --version` (prints `1.5.0`) and
`grep -n "PI_PACKAGE_VERSION\|pi.version !==" .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`.

### f-iter021-002 — drift, P1. v4.0.0.3 documents four Jev features and four off-switches; two of each do not exist.

The note names four features and four switches:
`JEV_FEATURE_CITE_DRIFT`, `JEV_FEATURE_INJECTION_SCREEN`, `JEV_FEATURE_VERDICT_FALLBACK`,
`JEV_FEATURE_HALLUCINATION_GRADER` `[SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:251]`, and
`JEV_FEATURES=0` "turns all four off" `[SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:247]`.

The registry holds two:
`'cite-drift'` and `'injection-screen'`
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:38]`.
A repo-wide `grep -rn "JEV_FEATURE_[A-Z_]*"` finds `VERDICT_FALLBACK` and `HALLUCINATION_GRADER`
in the changelog only — no module, hook, test or env reference reads either name. `featureSwitch`
throws on an unregistered name `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:84]`,
so the two documented switches are not merely inert: nothing can even ask for them.

The two missing features are both scoped to `/deep:model-benchmark`
`[SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:244]`, and that command is absent from this
release line: `.skilled/commands/deep/` holds `ai-council.md`, `research.md`, `review.md` and
`assets/`, whose `assets/` listing contains no `deep-model-benchmark*` file. So `JEV_FEATURES=0`
turns off two features, and the note's benchmark section (`--grader auto`, misspelled grader stops
the run `[SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:255]`) describes a command this tree does
not ship. Either the command was retired later in the line and the note was never amended, or the
features were documented before they landed; the note cannot tell the operator which.

Release introduced: v4.0.0.3. Confidence: high on the counts and the absence; medium on the cause
(retirement vs never-shipped) — the fix differs, the drift does not. Verify:
`grep -rc "JEV_FEATURE_VERDICT_FALLBACK" .skilled/ | grep -v changelog` (no matches) and
`ls .skilled/commands/deep/`.

### f-iter021-003 — bug (diagnostics), P2. A hung or failed `jev auth status` is reported as "no stored credential".

`jevReady` spawns the probe with a timeout
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:152]` and then maps every
outcome that is not exit 0 to one reason:
`return { ready: false, path: found, provider, reason: 'no stored credential' };`
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:156]`.

`spawnSync` returns `status: null` with `error.code === 'ETIMEDOUT'` on a timeout, and `error`
set for a spawn failure, so a service outage, a killed probe and an unauthenticated CLI all read
as the same sentence. `result.error` and `result.signal` are never inspected. The consequence is
an operator repairing the wrong thing: the message says the credential is missing when the probe
never completed. `featureReady` propagates that reason unchanged
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:176]`, so it is the only
diagnosis a caller or hook gets.

Release introduced: v4.0.0.3 (the features). Confidence: high on the mapping; the reason is a
fixed string on a single branch. Verify:
`node -e "const m=require('./.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs');"` is
not require-able (ESM), so drive the seam the tests already expose:
`node -e "import('./.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs').then(m=>console.log(m.jevReady({PATH:'/usr/bin'},{spawnSyncFn:()=>({status:null,error:{code:'ETIMEDOUT'}})}).reason))"`.

### f-iter021-004 — improvement (test blind spot), P2. The version gate is tested only against its own constant.

`function stubPiPackage(root, version = '0.99.2')`
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:48]` defaults
the fixture to the same literal the module pins, so the green suite and the broken real install are
consistent with each other. The suite is otherwise strong — 69 tests, all passing on this run
(`node --test .skilled/skills/cli-classifier/shared/scripts/tests/`).

Nothing here tells a reader whether the pin is current. A single assertion that a *different*
version (say the `pi --version` output) skips the route, or a fixture that reads the installed
manifest, would have surfaced f-iter021-001 the day it landed.

Release introduced: v4.0.0.3. Confidence: high. Verify: read the fixture default at line 48 and
`node --test .skilled/skills/cli-classifier/shared/scripts/tests/`.

### f-iter021-005 — over-engineering, P2. `which()` is copied verbatim into two sibling modules of the same directory.

`jev-features.mjs` `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:115]`
and `jev-transport.mjs` `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:294]`
each define the same PATH walker, the same empty-entry skip and the same
`isFile` + `X_OK` test. If removed and replaced by one shared helper (or a bare `spawnSync` on the
resolved name) nothing breaks: both are private, both have the same body, and no third caller
exists.

The cost is drift, not lines: a fix to one copy (a Windows `PATHEXT` case, a symlink case) leaves
the other silently different, and the two modules already disagree on their default timeout
(10 s `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:49]` vs 30 s
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:39]`), so the pair is
not maintained in lockstep.

Release introduced: v4.0.0.3. Canon note: this is duplication of identical code, not the "two
instances resemble each other" case the restraint table warns against merging. Confidence: high.
Verify: `grep -n "^function which" .skilled/skills/cli-classifier/shared/scripts/*.mjs`.

### f-iter021-006 — improvement, P2. Criteria parity with the CLI rests on a comment nobody verified.

`choiceRequestFrom` drops an `-o` pair with no `=`
`[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:117]`, justified by
"A pair with no `=` carries no key, so it is dropped exactly as the CLI's own criteria reader
drops it." That claim is the whole basis for the Pi route answering over the same option set the
CLI would have answered over. If the CLI instead errors, or keeps the bare key with an empty
value, the two routes answer different questions and `choicePayloadFor`'s all-keys-must-be-finite
requirement `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:219]`
turns the difference into a silent fallback rather than a mismatch.

Either way the answer is plausible; only the parity claim is unsupported. Confidence: medium (the
comment is unverified from this side; the CLI's behaviour was not probed, and must not be probed
live with a stored key). Verify without a key: `jev choice --help` and a malformed-pair call that
is expected to fail at argument parsing, then compare exit codes and the parsed criteria.

### Ruled out this iteration

- Key storage: no finding. Neither module reads, holds or prints a key; Pi credentials stay in
  Pi's own store via `ModelRuntime.create()`
  `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:351]`, and the `jev`
  route passes the environment through unchanged. The `key-never-echoed-on-error-path` playbook
  case is consistent with the code read.
- Timeout arithmetic: no finding. `spawnCliWithinBudget` recomputes the remaining budget before the
  CLI leg `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:495]` and the
  Pi leg is bounded by `promiseWithinTimeout` with an `AbortController`
  `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:563]`; both legs share
  one deadline rather than stacking.
- Router phrasing (`v4.0.0.2:190`): not re-audited — the registry-level phrase findings are out of
  scope this iteration by the focus prompt's exclusion.

## Questions Answered

None of the three remaining strategy key questions is answered by this iteration; the findings are
new ground, not a close on hub canon, the `deep-research-auto.yaml` UX question or executor
failure handling.

## Questions Remaining

- **Mid-run executor failure** (devin `resource_exhausted`, a builder throw): still unread across
  the run. Nothing in this iteration touched it.
- **A third confirmation of the "documented surface absent from the tree" class** (f-iter021-002
  is the second after the `check-review-findings.js` question). Where else does a release note
  name a command or script the line no longer ships?
- **Whether `spawnCli`'s `code: null` timeout outcome reaches a caller as exit 0.** `spawnCli`
  documents a spawn error as 127 `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:449]`
  and the timer settles `null` `[SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:477]`.
  How `classifier-cite-drift-scan.mjs` and the injection-screen hook map `null` to a process exit
  code is unread; if either maps it to 0, a timed-out classifier call becomes a passing check.
- **`--pure` validity** for the installed OpenCode (f-iter018-003) and the unknown-token `{...}`
  render policy: both still carried.
- **Hub canon** (`package_skill.py --strict` across the hub and its seven modes): still unproven,
  and now dwarfed by cheaper defects.

## Next Focus

Close the cheapest remaining carried question from inside this same cluster: read how the three
`spawnClassifierCall` consumers map `code: null` (a killed call) onto their own exit status —
`classifier-cite-drift-scan.mjs:511`, `classifier-screen-fetched-text.mjs:228`, and the scorer —
because f-iter021-003 and this question share one root: every non-answer is collapsed into a
plausible-looking normal outcome.
