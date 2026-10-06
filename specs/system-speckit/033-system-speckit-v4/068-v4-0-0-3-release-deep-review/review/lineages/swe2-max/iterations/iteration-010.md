# Iteration 010 — sweep: sk-create-* leaf skills + commands/create + commands/speckit

## Scope and method

- **`leaf-route-replay.cjs`** (835 lines, new) — read-only replay of every
  parent hub's stage-two keyword block against gold scenarios; zero model
  calls, no credentials, fs/regex only. Transcript scan patterns
  (`ROUTER_READ_*`) tolerate N-level JSON escaping via `\\*` runs.
  `tests/leaf-route-replay.test.cjs` → **22/22 pass**.
- **`ci-router-vocabulary-reach.cjs`** — the file carried **two literal NUL
  bytes** at v4.0.0.2 (map keys `\x00` between declaredBy and phrase), which
  made git/diff treat it as binary. Fixed this release: `\u0000` escapes —
  identical key semantics, source is now text. Also new: `--concurrency N`
  (clamped `Math.max(1, Number||DEFAULT)` — NaN/zero/negative/missing value
  all safe), `PROBE_ATTEMPTS=3` retry bounded to exit-75 only, probe failures
  reported as `probe-error` (never collapse to pass — the comment's reasoning
  is correct: a failed ask is not an unreachable phrase), and `--limit`
  refused under `CI` (exit 2: "a sampled run cannot gate a build").
- **`rule-experiment.py`** (511 lines, new) — controlled A/B harness for
  repo-rule edits. All subprocess argv-form (node/git/executor CLIs); prompts
  pass as positional argv, never through a shell; `AI_SESSION_CHILD=1` +
  `SYSTEM_SPEC_GATE_ENFORCE=0` set for child runs — matching the documented
  Gate 3 child-dispatch exemption. Runs in `shutil.copytree`'d isolated dirs,
  `RUN_TIMEOUT` bounded, transcripts exported to files.
- **`measure-rule-compliance.py`** (680 lines, new) — argv-form `git log
  --follow`/`rev-parse` calls; `sha:path` revision args can't be
  flag-injected. Read-only analytics.
- **`ci-router-vocabulary-reach.cjs` NUL-byte history** — the literal NULs
  existed in v4.0.0.2; this release removed them. Worth noting only because
  nothing flags non-ASCII/control bytes in committed sources — but the
  release fixed the instance it had, so no finding.
- **`skill-md-template.md`** — teaches the hard-rules sidecar correctly
  ("Not a frontmatter key… `hard-rules.json` … `{id, check, message,
  severity}`"), matching the verified migration (iteration 4). Description
  ceiling updated to ~6,400 — matches commit `4ffc4097b7`'s raised limit.
- **`create-journey-proof.test.cjs`** — removed dead `stageDoctorSupport`
  staging (31 lines); no dangling references; test still passes.
- **`create-changelog-{auto,confirm}.yaml`** — SELECT CONTENT stage added
  before format selection (reader-impact filter, merge-by-effect, drop
  internal labels/housekeeping); tag_message now derives from the editorial
  title's first colon→comma; release-notes formatting pinned (`&nbsp;`
  before H2, footer link line). Both workflow variants updated in the same
  direction — consistent.
- **`create-skill-parent-{auto,confirm}.yaml`** — references renamed to
  `/doctor:skill-advisor parent-skill`; verified `skill-advisor.md` route
  table has the `parent-skill` target → `doctor-parent-skill.yaml` and
  `_routes.yaml:141-142` binds it.
- **`speckit/` command docs** — `/doctor speckit-retrieval` →
  `/doctor:speckit` and `/doctor skill-advisor :auto` →
  `/doctor:skill-advisor tune` renames applied; both targets resolve in
  `_routes.yaml` (`:41` speckit-retrieval, `:81` tune). `plan.md`,
  `implement.md`, `complete.md`, `save.md` gained the two warn-only rule
  disclosures (FRONTMATTER_VALUES + SOURCE_TAGS with the 2026-10-04 cutoff)
  — consistent with registry registration verified in iteration 5.
- `steer.md` — re-read; unchanged.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Review verdict: PASS
