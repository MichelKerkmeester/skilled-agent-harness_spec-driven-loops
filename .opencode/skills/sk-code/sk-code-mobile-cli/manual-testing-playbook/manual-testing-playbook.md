---
title: "code-mobile-cli: Manual Testing Playbook"
description: "Operator-facing directory for the code-mobile-cli (PI_REMOTE) routing-recall corpus: intent detection, resource loading, unknown-fallback, cross-CLI dispatch, token-cost baselines, holdout generalization, and surface detection."
version: 2.0.0.0
---

# code-mobile-cli: Manual Testing Playbook

Routing-recall corpus for the `code-mobile-cli` surface. These scenarios exercise the machine-readable
`INTENT_SIGNALS` and `RESOURCE_MAP` in `SKILL.md` §2b, and the `PI_REMOTE` surface detection in `SKILL.md`
§1 that causes the hub to bundle this packet behind a workflow mode. The corpus is organized into eight
category folders at the playbook root, mirroring the coverage breadth of the sk-doc smart-router playbook
while staying inside this package's own operator-scenario contract (`PASS`/`FAIL`/`SKIP` only — this
package is `tier: FAIL_CLOSED` and does not carry the routing-gold exemption sk-doc's corpus does).

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and
> reason are persisted through `run-manual-playbook-scenario.cjs` into
> `sk-code-mobile-cli/benchmark/reports/<dated-run-label>/`.

Every scenario except `surface-detection/` assumes the hub's surface detection has already resolved
**PI_REMOTE** (CWD or changed/target files under `app-mobile/`, `app-relay/`, or `packages/pi-rpc-protocol/`,
per `SKILL.md` §1) and bundled this packet behind a workflow mode; that scenario then exercises which
reference/asset set the sample prompt's intent should load. `surface-detection/` is the one category that
tests the `PI_REMOTE` resolution step itself, including a negative control. A scenario's verdict is `PASS`
when every path in its `expected_resources` resolves under the skill root and its frontmatter
surface/intent agree with its category's documented contract, `FAIL` when either check fails, and `SKIP`
only when a specific sandbox or runtime blocker (for example, a required CLI runtime is not installed or
authenticated) prevents the check from running.

**Curated-subset honesty note**: an individual scenario's `expected_resources` is a curated core subset of
its intent's full `RESOURCE_MAP` entry, not always an exact mirror — several scenarios (for example
`PR-004`) intentionally list fewer paths than the full map to keep the routing-recall check narrow. Both
the curated subsets used throughout this corpus and the full `RESOURCE_MAP` entries in `SKILL.md` §2b were
verified against the shipped tree with `test -e` while authoring this package; none were missing at
authoring time. Re-verify with `test -e` before trusting any path — do not copy a path out of `SKILL.md`
§2b without checking, since the map is not treated as authoritative over the filesystem.

---

## 1. OVERVIEW

The `code-mobile-cli` manual testing playbook validates `PI_REMOTE` surface detection, `INTENT_SIGNALS`
intent classification, and `RESOURCE_MAP` resource loading through deterministic, evergreen scenarios. No
scenario in this package executes a real Pi Remote app command — `app-mobile/`, `app-relay/`, and
`packages/pi-rpc-protocol/` do not live in this repository, so every scenario is a routing-recall check
against this packet's own frontmatter, `SKILL.md`, and shipped `references/`/`assets/` tree.

---

## Categories

| # | Category | Folder | Scenario IDs | One-line summary |
|---|----------|--------|---------------|-------------------|
| 1 | Intent Detection | `intent-detection/` | PR-001 .. PR-007 | One scenario per declared intent (`IMPLEMENTATION` x2, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `LANGUAGE_STANDARDS`, `ACCESSIBILITY`) proving the exact prompt classifies correctly and resolves its curated resource subset. |
| 2 | Resource Loading | `resource-loading/` | PR-008, PR-009 | Isolation: a references-only load (`LANGUAGE_STANDARDS`, zero assets) and a mixed reference-plus-asset load (`CODE_QUALITY`, full eight-path set). **Assets-only is waived** — see the note below the table. |
| 3 | Unknown Fallback | `unknown-fallback/` | PR-010 .. PR-012 | Zero-keyword prompt falling back to `DEFAULT_RESOURCE`; an ambiguous `DEBUGGING`/`VERIFICATION` multi-intent prompt resolved via shared-resource overlap; a genuine `CODE_QUALITY`/`LANGUAGE_STANDARDS` keyword collision (`"folder docs"`) requiring documented disambiguation. |
| 4 | Cross-CLI Dispatch | `cross-cli-dispatch/` | PR-013 .. PR-015 | Short-prompt baseline, large-prompt stress (long discursive input with incidental keyword noise), and multi-step sequential dispatch stability across `cli-claude-code` and `cli-opencode`. |
| 5 | Token-Cost Baseline | `token-cost-baseline/` | PR-016 .. PR-018 | Floor (`DEFAULT_RESOURCE`, 2 paths), median (`VERIFICATION`, 4 paths), ceiling (deduplicated union of all six intents plus `DEFAULT_RESOURCE`, 22 paths). |
| 6 | Agent Dispatch | *(waived)* | — | **Waived** — see the note below the table. |
| 7 | Holdout | `holdout/` | PR-H01 .. PR-H06 | Generalization probes excluded from the fitted routing aggregate: three natural-phrasing rewrites (`PR-H01`..`PR-H03`, decontaminated of literal `INTENT_SIGNALS` keywords) and three independent keyword-blind probes (`PR-H04`..`PR-H06`), spanning all six declared intents across the two sets. |
| 8 | Surface Detection | `surface-detection/` | PR-019, PR-020 | `PI_REMOTE` resolution itself across all three declared trigger paths (`app-mobile/`, `app-relay/`, `packages/pi-rpc-protocol/`), plus a negative control confirming an unrelated surface's task does not bundle this packet. |

**Category 2 waiver (assets-only isolation)**: no declared intent in this surface's `RESOURCE_MAP`
resolves to an assets-only set — every one of the six intents (`IMPLEMENTATION`, `CODE_QUALITY`,
`DEBUGGING`, `VERIFICATION`, `LANGUAGE_STANDARDS`, `ACCESSIBILITY`) pairs at least one reference alongside
any asset it carries, so this specific isolation case does not exist for `PI_REMOTE` and is documented as
waived rather than faked with an invented resource set.

**Category 6 waiver (agent dispatch)**: this packet is `routingClass: metadata`, **advisor-invisible**,
read-only, and per `SKILL.md` §5 "never routes as a primary and mutates nothing" — it never itself becomes
a dispatch target the way `@markdown` or a workflow mode does. Its own source-gates runner
(`scripts/run-source-gates.sh`) executes against the Pi Remote app repository, which does not live in this
repository (every scenario in `intent-detection/` states this explicitly), so no scenario authored here
can dispatch that real execution either. Real execution happens one layer up, in whichever workflow mode
(`sk-code-quality`, `sk-code-review`) bundles this packet as evidence — see that workflow's own manual
testing playbook for its agent-dispatch scenarios.

---

## Scenario Index

### 01 — Intent Detection
- **PR-001** — [intent-detection/token-edit-routing.md](intent-detection/token-edit-routing.md) — `IMPLEMENTATION`: component-token retint request routes to the token/retint/theme evidence set.
- **PR-002** — [intent-detection/comment-convention-routing.md](intent-detection/comment-convention-routing.md) — `IMPLEMENTATION`: presentation-comment seam request routes to the same evidence set as a named retint.
- **PR-003** — [intent-detection/guardrail-routing.md](intent-detection/guardrail-routing.md) — `CODE_QUALITY`: guardrail-fence audit request routes to the fence list and audit checklist.
- **PR-004** — [intent-detection/debugging-routing.md](intent-detection/debugging-routing.md) — `DEBUGGING`: retint-leak symptom routes to the verification method, not implementation evidence.
- **PR-005** — [intent-detection/verification-routing.md](intent-detection/verification-routing.md) — `VERIFICATION`: pre-completion-claim request routes to the browser-free verification method and checklist.
- **PR-006** — [intent-detection/language-standards-routing.md](intent-detection/language-standards-routing.md) — `LANGUAGE_STANDARDS`: naming-convention question routes to the token-layer and theme-remap evidence.
- **PR-007** — [intent-detection/accessibility-routing.md](intent-detection/accessibility-routing.md) — `ACCESSIBILITY`: WCAG-contrast confirmation routes to the guardrail fence list and verification method.

### 02 — Resource Loading
- **PR-008** — [resource-loading/references-only-load.md](resource-loading/references-only-load.md) — `LANGUAGE_STANDARDS` prompt loads exactly its eight `references/` paths with zero `assets/`.
- **PR-009** — [resource-loading/mixed-load.md](resource-loading/mixed-load.md) — `CODE_QUALITY` prompt loads the full paired reference-plus-asset set (five references, three assets).

### 03 — Unknown Fallback
- **PR-010** — [unknown-fallback/zero-keyword-prompt.md](unknown-fallback/zero-keyword-prompt.md) — Zero-`INTENT_SIGNALS`-match prompt falls back to `DEFAULT_RESOURCE` (two paths, not zero and not every resource).
- **PR-011** — [unknown-fallback/ambiguous-multi-intent.md](unknown-fallback/ambiguous-multi-intent.md) — `DEBUGGING`/`VERIFICATION` keyword co-occurrence resolves to `DEBUGGING`, whose own map already carries `verification.md`.
- **PR-012** — [unknown-fallback/disambiguation-required.md](unknown-fallback/disambiguation-required.md) — `CODE_QUALITY`/`LANGUAGE_STANDARDS` share the literal `"folder docs"` keyword; documents the tie-break rule and resolution.

### 04 — Cross-CLI Dispatch
- **PR-013** — [cross-cli-dispatch/short-prompt-baseline.md](cross-cli-dispatch/short-prompt-baseline.md) — Minimal `IMPLEMENTATION` prompt resolves identically across `cli-claude-code` and `cli-opencode`.
- **PR-014** — [cross-cli-dispatch/large-prompt-stress.md](cross-cli-dispatch/large-prompt-stress.md) — Long, discursive `VERIFICATION` prompt with incidental `IMPLEMENTATION`/`ACCESSIBILITY` noise still isolates correctly across CLI runtimes.
- **PR-015** — [cross-cli-dispatch/multi-step-dispatch.md](cross-cli-dispatch/multi-step-dispatch.md) — Three sequential turns (`IMPLEMENTATION` -> `CODE_QUALITY` -> `VERIFICATION`) each resolve independently, with no cross-turn resource bleed.

### 05 — Token-Cost Baseline
- **PR-016** — [token-cost-baseline/floor-single-resource.md](token-cost-baseline/floor-single-resource.md) — Floor: `DEFAULT_RESOURCE` fallback, 2 paths.
- **PR-017** — [token-cost-baseline/median-load.md](token-cost-baseline/median-load.md) — Median: full `VERIFICATION` set, 4 paths.
- **PR-018** — [token-cost-baseline/ceiling-load-all.md](token-cost-baseline/ceiling-load-all.md) — Ceiling: deduplicated union of all six intents plus `DEFAULT_RESOURCE`, 22 unique paths (15 references, 7 assets).

### 06 — Agent Dispatch

Waived — see the Category 6 waiver note above the Categories table.

### 07 — Holdout (Generalization Probes)

Natural-phrasing holdouts — same fitted scenario, decontaminated wording (no `INTENT_SIGNALS` keyword
vocabulary):
- **PR-H01** — [holdout/implementation-natural.md](holdout/implementation-natural.md) — `IMPLEMENTATION` via natural phrasing (rewrites `PR-001`/`PR-013`).
- **PR-H02** — [holdout/debugging-natural.md](holdout/debugging-natural.md) — `DEBUGGING` via natural phrasing (rewrites `PR-004`/`PR-011`).
- **PR-H03** — [holdout/accessibility-natural.md](holdout/accessibility-natural.md) — `ACCESSIBILITY` via natural phrasing (rewrites `PR-007`).

Independent holdouts — authored blind to the `INTENT_SIGNALS` keyword list:
- **PR-H04** — [holdout/ind-code-quality.md](holdout/ind-code-quality.md) — `CODE_QUALITY`, keyword-blind.
- **PR-H05** — [holdout/ind-verification.md](holdout/ind-verification.md) — `VERIFICATION`, keyword-blind.
- **PR-H06** — [holdout/ind-language-standards.md](holdout/ind-language-standards.md) — `LANGUAGE_STANDARDS`, keyword-blind.

All six carry a `holdout` category and are excluded from the fitted routing aggregate, scored only for the
fitted-vs-held-out generalization gap.

### 08 — Surface Detection
- **PR-019** — [surface-detection/pi-remote-positive-detection.md](surface-detection/pi-remote-positive-detection.md) — `PI_REMOTE` resolves for each of the three declared trigger paths independently.
- **PR-020** — [surface-detection/negative-control-non-mobile-cli.md](surface-detection/negative-control-non-mobile-cli.md) — A sibling-surface task does not resolve `PI_REMOTE` and loads zero `sk-code-mobile-cli` resources.

---

## Global Preconditions

1. `.opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md` is at HEAD-of-main and contains the §1 surface-detection triggers, the §2b `INTENT_SIGNALS`/`RESOURCE_MAP`/`DEFAULT_RESOURCE` block, and the §5 rules this corpus cites.
2. Every path named in every scenario's `expected_resources` resolves on disk under
   `sk-code-mobile-cli/references/` or `sk-code-mobile-cli/assets/` — verified with `test -e`, not assumed
   from `SKILL.md` §2b's prose.
3. This corpus never dispatches a real Pi Remote app command: `app-mobile/`, `app-relay/`, and
   `packages/pi-rpc-protocol/` do not live in this repository.
4. Cross-CLI scenarios (`PR-013`..`PR-015`) require both CLI runtimes under test (`cli-claude-code`,
   `cli-opencode`) to be installed and authenticated; document the specific missing runtime as the blocker
   if a `SKIP` verdict is used.
5. Token-cost baselines (`PR-016` -> `PR-017` -> `PR-018`) SHOULD run in order on the same CLI runtime to
   keep the floor/median/ceiling comparable.
6. `PR-015` (multi-step dispatch) MUST run its three turns in one continuous session, in order, not as
   three independent dispatches.

---

## Pass / Fail Grading

For every scenario in this corpus:

- **PASS** iff: every path in `expected_resources` resolves on disk, and the resolved surface/intent match
  the scenario's documented contract (frontmatter `expected_surface`/`expected_intent`, or the documented
  negative-control expectation for `PR-020`).
- **FAIL** iff: any `expected_resources` path is missing, the resolved surface or intent disagrees with
  the scenario's documented contract, or (for isolation scenarios) a resource outside the documented set
  loads.
- **SKIP** iff: a specific sandbox or runtime blocker prevents the check from running — for example, a
  required CLI runtime (`PR-013`..`PR-015`) is not installed or authenticated. A bare `SKIP` with no named
  blocker is not a valid verdict.

This package uses `PASS`/`FAIL`/`SKIP` only. It does not use `PARTIAL`, `READY`, `UNAUTOMATABLE`, or
`BLOCKED` — those are forbidden verdict vocabulary under this package's operator-scenario contract.

---

## Evidence Capture

For each scenario run, capture:

1. The exact prompt sent (copied verbatim from the scenario's `### Prompt` section).
2. The resolved surface and intent, plus the full list of resources the dispatch reports as loaded.
3. The `test -e` transcript for every path in the scenario's `expected_resources`.
4. For cross-CLI scenarios (`PR-013`..`PR-015`): the per-runtime transcripts side by side.
5. For token-cost scenarios (`PR-016`..`PR-018`): the resolved-set path count.

Persist the `PASS`/`FAIL`/`SKIP` outcome and reason through `run-manual-playbook-scenario.cjs` into
`sk-code-mobile-cli/benchmark/reports/<dated-run-label>/`, per the result-persistence contract above.
Intermediate command transcripts captured during a run may be kept under `/tmp/pr-<SCENARIO_ID>-<cli>.txt`
for cross-CLI comparison before that final persistence step.
