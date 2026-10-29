---
title: "sk-code-skilled: Manual Testing Playbook"
description: "Routing-recall corpus for the sk-code-skilled surface: one scenario per declared intent, plus the always-load shared tier, the guard exit statuses and the SKILLED surface detection the packet rests on."
version: 1.2.2.0
---

# sk-code-skilled: Manual Testing Playbook

This document combines the routing-recall validation contract for the `sk-code-skilled` packet into one
operator reference. The root playbook holds the package directory, the review protocol and the grading
rules. The per-feature files under the category folders hold the scenario-specific execution contract for
each scenario.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and
> reason are recorded into
> `sk-code-skilled/benchmark/reports/<dated-run-label>/`.

---

## 1. OVERVIEW

Routing-recall corpus for the `sk-code-skilled` surface. These scenarios exercise the machine-readable
intent signals, resource map and default tier in `ROUTER.md` §3, and the surface detection that causes the
hub to bundle this packet. The corpus is derived from the walked tree, split into category folders by
resource domain.

Coverage note: the corpus covers all ten prompt intents that `ROUTER.md` §3 declares machine-readably —
`IMPLEMENTATION`, `CODE_QUALITY`, `VERIFICATION`, `HOOKS`, `CONFIG`, `JAVASCRIPT`, `TYPESCRIPT`, `PYTHON`,
`SHELL` and `RUST` — with one scenario per intent, and it adds the three things those routes rest on: the
six-path shared tier every route loads (OC-011), the guard exit statuses the verification route promises
(OC-008), and the `SKILLED` surface detection that bundles the packet (OC-012). Every scenario except
OC-012 assumes the hub's surface detection has already resolved `SKILLED`; OC-012 proves the declaration
that assumption rests on.

### Categories

| # | Category | Folder | Scenario IDs |
|---|---|---|---|
| 1 | Language Standards | `language-standards/` | OC-001 .. OC-003, OC-009 .. OC-010 |
| 2 | Config and Hooks | `config-hooks/` | OC-004 .. OC-005 |
| 3 | Authoring and Verification | `authoring-verification/` | OC-006 .. OC-008 |
| 4 | Routing Tier and Surface Detection | `routing-tier/` | OC-011 .. OC-012 |

### Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | OC-001 | TYPESCRIPT | [typescript-standards.md](language-standards/typescript-standards.md) |
| 2 | OC-002 | PYTHON | [python-standards.md](language-standards/python-standards.md) |
| 3 | OC-003 | SHELL | [shell-standards.md](language-standards/shell-standards.md) |
| 4 | OC-004 | CONFIG | [config-schema.md](config-hooks/config-schema.md) |
| 5 | OC-005 | HOOKS | [hooks-wiring.md](config-hooks/hooks-wiring.md) |
| 6 | OC-006 | IMPLEMENTATION | [implementation-authoring.md](authoring-verification/implementation-authoring.md) |
| 7 | OC-007 | CODE_QUALITY | [code-quality-gate.md](authoring-verification/code-quality-gate.md) |
| 8 | OC-008 | VERIFICATION | [verification-alignment.md](authoring-verification/verification-alignment.md) |
| 9 | OC-009 | RUST | [rust-standards.md](language-standards/rust-standards.md) |
| 10 | OC-010 | JAVASCRIPT | [javascript-standards.md](language-standards/javascript-standards.md) |
| 11 | OC-011 | IMPLEMENTATION (shared default tier) | [shared-default-tier.md](routing-tier/shared-default-tier.md) |
| 12 | OC-012 | surface detection (no intent) | [skilled-surface-detection.md](routing-tier/skilled-surface-detection.md) |

A routing scenario passes when every path in its `expected_resources` resolves under the skill root and its
frontmatter surface and intent agree with the tables above. OC-011 additionally requires every path in its
`expected_resources` to appear in the replay output, and OC-012 declares detection markers instead of a
resource list and passes when the registry block matches them. OC-008 also grades the exit status of each
guard step. A scenario fails when a listed path is missing, a replay omits a listed path, a guard returns an
unexpected status, or the frontmatter disagrees with the table. A scenario is graded `SKIP` only when a
specific sandbox or runtime blocker prevents the check from running.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` resolves on disk.
3. `ROUTER.md` §3 (MACHINE ROUTER) resolves, carrying the machine-readable `DEFAULT_RESOURCE`,
   `INTENT_SIGNALS` and `RESOURCE_MAP` blocks. §2b describes the routing but does not carry the blocks.
4. Every path a scenario lists under `expected_resources` resolves under the packet root.
5. OC-012 additionally needs `.skilled/skills/sk-code/mode-registry.json` to parse.
6. No scenario in this playbook is destructive. Each one reads files, runs read-only guards, and writes
   nothing.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript, including the exit status of every command that is executed
- User request used
- Exact prompt used
- The resolved frontmatter block and the `INTENT_SIGNALS` excerpt the prompt matched
- Output snippets for each path check in `expected_resources`
- For OC-011, the replay's emitted resource list; for OC-012, the printed registry block
- For OC-008, the `PASS` or `FAIL` line of every guard step and its exit status
- Scenario verdict with rationale: PASS, FAIL, or SKIP
- The dated report label the outcome was recorded under

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.
- Paths in a scenario are relative to the repository root unless the scenario names the packet root.
- Resource paths in a scenario are relative to `.skilled/skills/sk-code/sk-code-skilled/`.
- A guard step that is graded on its exit status ends with `; echo "rc=$?"`, so the transcript carries the
  status instead of leaving it to the shell's next command.
- A replay step calls `assets/scripts/router-replay-lib.cjs` directly, so the emitted resource list is
  printed rather than inferred from the maps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map, section 12
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions in section 2 were satisfied.
2. Prompt and command sequence were executed as written.
3. The frontmatter surface and intent agree with the root index in section 12.
4. Every path in `expected_resources` resolves under the packet root.
5. Every guard step returned the exit status its Expected entry names.
6. Evidence is complete and readable.
7. Outcome rationale is explicit.

### Exit-Status Grading

A step that names an expected status is graded on that status, not on a green run. The status is captured in
the transcript by the step's own `echo "rc=$?"`, so an operator reads the number rather than assuming it:

- `rc=0` means the command completed and found nothing blocking.
- `rc=1` on a guard means the guard found a problem. When a step expects `rc=1` because it turns advisory
  findings into a gate, the same findings must appear in the earlier ungated step; a `rc=1` with no findings
  above it, or a `rc=0` while findings are listed, is a `FAIL` of the step.
- `rc=2` on a tool that documents a usage error or an advisory verdict means exactly that; read the named
  verdict or usage line rather than treating the status as a crash.

A step whose expected status cannot be produced on the live tree is a `FAIL`, not a `SKIP`: the tree is the
fixture for every scenario here, so a divergence is drift to explain.

### Scenario Verdict

- `PASS`: every path in `expected_resources` resolves, every replay shows the expected emission, every
  guard step returns its named status, and the frontmatter surface and intent agree with the tables above
- `FAIL`: a listed path is missing, a replay omits a listed path, a guard step returns an unexpected status,
  or the frontmatter surface or intent disagrees
- `SKIP`: a specific sandbox or runtime blocker prevents the check from running

### Feature Verdict Rules

- `PASS`: every mapped scenario for the feature is `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. Every scenario in the root index has a per-feature file behind it.
3. Coverage is complete for the index in section 12 (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put scenario-specific acceptance caveats in the matching
per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning for the routing-recall package. It is not a runtime support matrix by
itself.

### Operational Rules

1. The package is small enough for one operator in one wave, except OC-008's test step, which takes about
   twenty seconds on its own.
2. Pre-assign each scenario ID and its per-feature file before execution.
3. Save the evidence for each scenario before recording its verdict.
4. Record the evidence paths and the dated report label in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field
- Expected surface and intent
- Expected resource set, path by path
- Desired user-visible outcome
- Feature-specific acceptance caveats

---

## 7. LANGUAGE STANDARDS (OC-001..OC-003, OC-009..OC-010)

### OC-001 | TypeScript standards routing

#### Description

Verify a TypeScript implementation prompt classifies as `TYPESCRIPT` and loads the strict-mode style guide,
the type-system quality standards and the tsconfig and module quick reference instead of a generic
implementation checklist.

#### Scenario Contract

Prompt: `For an OpenCode TypeScript module, apply the typescript .ts standards before I implement a feature.`

Expected intent `TYPESCRIPT` with seven expected resources: the two style-guide parts, the three
quality-standards parts, and the two quick-reference parts under `references/typescript/`.

Desired user-visible outcome: the reply cites the TypeScript strict-mode, type-system and tsconfig
contracts, not a language-agnostic organization checklist.

#### Test Execution

> **Feature File:** [OC-001](language-standards/typescript-standards.md)

### OC-002 | Python standards routing

#### Description

Verify a `.py` argparse and docstring review prompt classifies as `PYTHON` and loads the Python style guide,
quality standards and quick reference triad.

#### Scenario Contract

Prompt: `Review this python .py argparse helper for docstring and quality standards.`

Expected intent `PYTHON` with three expected resources: the style guide, the quality standards and the quick
reference under `references/python/`.

Desired user-visible outcome: the reply quotes Python-specific docstring and quality rules rather than a
generic implementation tier.

#### Test Execution

> **Feature File:** [OC-002](language-standards/python-standards.md)

### OC-003 | Shell standards routing

#### Description

Verify a bash `.sh` review prompt classifies as `SHELL` and loads the shell style guide, the quality
standards with their priority blockers and shellcheck checks, and the shell quick reference.

#### Scenario Contract

Prompt: `Check this shell script bash .sh wrapper against standards before release.`

Expected intent `SHELL` with six expected resources: two style-guide parts, two quality-standards parts and
two quick-reference parts under `references/shell/`.

Desired user-visible outcome: the reply names the shell priority blockers and shellcheck expectations rather
than a generic checklist.

#### Test Execution

> **Feature File:** [OC-003](language-standards/shell-standards.md)

### OC-009 | Rust standards routing

#### Description

Verify a napi-rs and WASM prompt classifies as `RUST` and loads the full Rust style guide, quality standards
and quick reference trio, including the interop-model and TypeScript-parity anchors.

#### Scenario Contract

Prompt: `For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.`

Expected intent `RUST` with all seventeen expected resources: the seven style-guide parts, the five
quality-standards parts and the five quick-reference parts under `references/rust/`.

Desired user-visible outcome: the reply holds the Rust module to its TypeScript oracle using the parity and
interop resources, not a partial trio.

#### Test Execution

> **Feature File:** [OC-009](language-standards/rust-standards.md)

### OC-010 | JavaScript standards routing

#### Description

Verify a CommonJS plugin prompt classifies as `JAVASCRIPT` and loads the JavaScript style guide, the
module/docs and security/exemption quality standards, and the JavaScript quick reference.

#### Scenario Contract

Prompt: `Review this CommonJS .cjs plugin against the javascript style guide and .mjs interop risks.`

Expected intent `JAVASCRIPT` with four expected resources: the style guide, the two quality-standards parts
and the quick reference under `references/javascript/`.

Desired user-visible outcome: the reply cites the no-TUI-write plugin rule and the security and test
exemption standards, not the generic implementation tier.

#### Test Execution

> **Feature File:** [OC-010](language-standards/javascript-standards.md)

---

## 8. CONFIG AND HOOKS (OC-004..OC-005)

### OC-004 | Config schema routing

#### Description

Verify a JSONC descriptor and config-schema review prompt classifies as `CONFIG` and loads the config style
guide, quality standards, quick reference and config checklist.

#### Scenario Contract

Prompt: `Review the jsonc descriptor config schema for a skill and point out schema issues.`

Expected intent `CONFIG` with four expected resources: the three `references/config/` docs and
`assets/checklists/config-checklist.md`.

Desired user-visible outcome: the reply validates the descriptor against the config schema rules rather than
a generic implementation checklist.

#### Test Execution

> **Feature File:** [OC-004](config-hooks/config-schema.md)

### OC-005 | Hooks wiring routing

#### Description

Verify a session-prime and pre-tool-use wiring prompt classifies as `HOOKS` and loads the single maintained
hook-entrypoint reference.

#### Scenario Contract

Prompt: `Explain how session-prime and pre-tool-use hooks should be wired for an OpenCode plugin bridge.`

Expected intent `HOOKS` with one expected resource, `references/shared/hooks.md`.

Desired user-visible outcome: the reply describes the checked-in wiring and the plugin-bridge delivery path
from that one maintained file, not a broader implementation or config set.

#### Test Execution

> **Feature File:** [OC-005](config-hooks/hooks-wiring.md)

---

## 9. AUTHORING AND VERIFICATION (OC-006..OC-008)

### OC-006 | Implementation authoring routing

#### Description

Verify a new skill-authoring module prompt classifies as `IMPLEMENTATION` and loads the language-agnostic
universal-patterns and code-organization tier plus all four authoring checklists.

#### Scenario Contract

Prompt: `Implement a new OpenCode skill-authoring module and include command-authoring and mcp server authoring considerations.`

Expected intent `IMPLEMENTATION` with nine expected resources: five `references/shared/` docs and the
agent, command, skill and MCP-server authoring checklists.

Desired user-visible outcome: the reply works from every authoring checklist the module touches, not a
single-checklist subset.

#### Test Execution

> **Feature File:** [OC-006](authoring-verification/implementation-authoring.md)

### OC-007 | Code quality gate routing

#### Description

Verify a lint, format, naming and code-smell prompt classifies as `CODE_QUALITY` and loads the full
twelve-file authoring checklist set, including the three `js-css-style` parts.

#### Scenario Contract

Prompt: `Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.`

Expected intent `CODE_QUALITY` with twelve expected resources: the universal checklist, the JavaScript
checklist with its three `js-css-style` parts, the TypeScript, Python and Shell checklists, and the four-part
Rust checklist. The list mirrors `RESOURCE_MAP["CODE_QUALITY"]` entry for entry.

Desired user-visible outcome: the quality gate cites each applicable checklist, rather than one language's
subset.

#### Test Execution

> **Feature File:** [OC-007](authoring-verification/code-quality-gate.md)

### OC-008 | Verification alignment routing

#### Description

Verify a completion-claim, type-check and alignment-drift prompt classifies as `VERIFICATION`, loads the
alignment-verification-automation reference and the drift-guard scripts README, and runs the guards those
documents describe.

#### Scenario Contract

Prompt: `Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.`

Expected intent `VERIFICATION` with two expected resources, plus nine graded steps: the routing checks, the
two `expected_resources` paths, the drift verifier with and without `--fail-on-warn`, the router-sync guard
at `--checks 1a,1b,2`, the seven test files, and the quality gate's `--explain` advisory verdict.

Desired user-visible outcome: the reply reports guard results it ran, with their exit statuses, instead of
asserting that the gate passed.

#### Test Execution

> **Feature File:** [OC-008](authoring-verification/verification-alignment.md)

---

## 10. ROUTING TIER AND SURFACE DETECTION (OC-011..OC-012)

### OC-011 | Shared default tier routing

#### Description

Verify the six-path `DEFAULT_RESOURCE` tier resolves and joins the resources a routed intent emits, so the
guardrail doc every route loads is graded rather than assumed.

#### Scenario Contract

Prompt: `Implement a small helper inside a .skilled skill and tell me which shared references you load.`

Expected intent `IMPLEMENTATION` with the six `DEFAULT_RESOURCE` paths as its expected resources, all of
which must appear in the replay output ahead of the intent's own checklists.

Desired user-visible outcome: the reply shows the shared guardrails tier being loaded first, not a route that
carries only its checklists.

#### Test Execution

> **Feature File:** [OC-011](routing-tier/shared-default-tier.md)

### OC-012 | SKILLED surface detection

#### Description

Verify `mode-registry.json` declares the `SKILLED` surface as the fallback with the `.skilled/` path marker
and the `sk-code-skilled` packet, so a Skilled-surface prompt resolves to this surface before any intent is
scored.

#### Scenario Contract

Prompt: `Which surface does a .skilled/ task resolve to, and why does the skill-code packet load with it?`

Expected declaration: label `SKILLED`, role `fallback`, packet `sk-code-skilled`, and the `.skilled/` and
`.opencode/` path markers, compared against the two-step detection prose in `SKILL.md` §1.

Desired user-visible outcome: the reply names `SKILLED` for `.skilled/` work, cites the registry block rather
than prose alone, and explains that the packet is bundled as surface evidence beside the workflow mode.

#### Test Execution

> **Feature File:** [OC-012](routing-tier/skilled-surface-detection.md)
> **Catalog:** [two-axis-registry-driven-routing](../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md)

---

## 11. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/tests/verify-router-sync.test.cjs` | Legs 1a, 1b, 2 and 3 against a throwaway hub, plus the `--checks` selector; does not exercise leg 4 | OC-008 |
| `scripts/tests/run-all-drift-guards.test.cjs` | The wrapper's pass, warn and fail aggregation, including the exit-1 path | OC-008 |
| `scripts/tests/verify-doc-claims.test.cjs` | The path, name, surface and load-tier claim checks, plus the exit-2 usage paths | OC-008 |
| `scripts/tests/verify-router-sync-git-timeout.test.cjs` | Leg 1b's bounded `git check-ignore` | OC-008 |
| `scripts/tests/declared-surfaces-parity.test.cjs` | The replay library and the plugin declare the same surfaces for the live hub | OC-012 |
| `scripts/tests/quality-checklist-map.test.cjs` | The `SKILLED` quality checklist map against the quality defaults and surface declarations | OC-007 |
| `scripts/tests/router-stage-two-quality.test.cjs` | Stage-two intent selection for a restraint request | OC-007 |

Each module builds its own throwaway tree, so a failure is a real regression rather than shared state.

The router-sync guard's leg 4 replays every routing scenario in the hub, including the sibling packets'
playbooks, so its verdict is hub-wide: a sibling packet's red scenario fails it too. The legs this packet
owns are graded in OC-008 step 7, and OC-011 step 4 shows the same emission check for one prompt inside this
package.

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| OC-001 | TypeScript standards routing | LANGUAGE STANDARDS | [OC-001](language-standards/typescript-standards.md) |
| OC-002 | Python standards routing | LANGUAGE STANDARDS | [OC-002](language-standards/python-standards.md) |
| OC-003 | Shell standards routing | LANGUAGE STANDARDS | [OC-003](language-standards/shell-standards.md) |
| OC-004 | Config schema routing | CONFIG AND HOOKS | [OC-004](config-hooks/config-schema.md) |
| OC-005 | Hooks wiring routing | CONFIG AND HOOKS | [OC-005](config-hooks/hooks-wiring.md) |
| OC-006 | Implementation authoring routing | AUTHORING AND VERIFICATION | [OC-006](authoring-verification/implementation-authoring.md) |
| OC-007 | Code quality gate routing | AUTHORING AND VERIFICATION | [OC-007](authoring-verification/code-quality-gate.md) |
| OC-008 | Verification alignment routing | AUTHORING AND VERIFICATION | [OC-008](authoring-verification/verification-alignment.md) |
| OC-009 | Rust standards routing | LANGUAGE STANDARDS | [OC-009](language-standards/rust-standards.md) |
| OC-010 | JavaScript standards routing | LANGUAGE STANDARDS | [OC-010](language-standards/javascript-standards.md) |
| OC-011 | Shared default tier routing | ROUTING TIER AND SURFACE DETECTION | [OC-011](routing-tier/shared-default-tier.md) |
| OC-012 | SKILLED surface detection | ROUTING TIER AND SURFACE DETECTION | [OC-012](routing-tier/skilled-surface-detection.md) |

### Catalog Coverage

OC-012 links the `two-axis-registry-driven-routing` catalog entry, whose declared surface-detection order is
exactly what that scenario checks.

No dedicated catalog entry exists for the other scenarios. The catalog inventories hub and packet behavior —
mode routing, compiled routing, the quality gate, the doctors and review calibration — and does not hold a
per-intent entry for this surface's reference sets. Each of those scenarios therefore cites `SKILL.md` §2 and
`ROUTER.md` §3 as its contract source instead of a catalog file.
