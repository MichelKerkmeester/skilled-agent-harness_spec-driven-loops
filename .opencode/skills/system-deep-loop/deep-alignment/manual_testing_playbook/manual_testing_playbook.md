---
title: "deep-alignment: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, alignment run protocol, orchestration guidance, and per-scenario validation files for the deep-alignment mode."
version: 1.0.0.0
---

# deep-alignment: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real, not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers (the scoping / convergence / partition / reducer / adapter scripts), and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the operator-facing manual testing contract for the `deep-alignment` mode into a single reference. The root playbook acts as the directory, alignment protocol, and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `entry-points-and-modes/`
- `lane-resolution-and-scoping/`
- `discovery-and-adapters/`
- `verify-first-and-known-deviations/`
- `iteration-and-convergence/`
- `read-only-and-gated-remediation/`
- `report-emission-per-lane/`
- `state-and-fault-tolerance/`

---

## 1. OVERVIEW

This playbook provides 31 deterministic scenarios across 8 categories validating the current `deep-alignment` mode surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and live source anchors.

`deep-alignment` audits artifacts against a **named standard authority's own creation rules** (sk-doc, sk-git, sk-design, sk-code), not general code correctness (`deep-review`) and not hub structure (`parent-skill-check.cjs`). Every scenario keeps that boundary crisp: a lane is `(authority x artifact-class x scope)`, findings are re-verified against live ground truth before they are asserted, documented conventions are suppressed, and the audited target is read-only unless a separate gated remediation pass is explicitly opted into.

### BUILD-STATE NOTE (read before running the entry-points category)

The mode ships its **contract and its runnable scripts** but not yet its command layer. As of this packet's release:

- The mode contract (`SKILL.md`), the mode `README.md`, the four convergence/partition/reducer/remediate scripts, the five authority adapters, the reference docs, and the config-template asset **exist** (the scripts and adapters are runnable today; `SKILL.md` and `README.md` are the shipped docs).
- The `/deep:alignment` command, the `deep_alignment_auto.yaml` / `deep_alignment_confirm.yaml` workflows, and the `@deep-alignment` LEAF agent are the phase-009 "last-mile" deliverable and **do NOT exist yet** — treat any `/deep:alignment` invocation shown in this playbook as the *planned* surface, never as an operational capability (confirmed by `changelog/v1.0.0.0.md`: "the mode is not runnable yet... the `/deep:alignment` command does not exist until then", and `references/state_machine_wiring.md` §2, which names the command YAML + LEAF agent as "phase 009's own deliverable, not built here"). The mode's `README.md` **does** now exist at `.opencode/skills/system-deep-loop/deep-alignment/README.md`.

Scenarios therefore validate the **documented invocation contract in `SKILL.md` and the behavior of the runnable scripts**, never a live command/YAML/agent file. Any scenario that would require the phase-009 command layer to exist is out of this playbook's scope until that layer ships.

### REALISTIC TEST MODEL

1. Start from the user-facing conformance-audit intent rather than a synthetic command checklist.
2. Inspect the mode contract (`SKILL.md`) and public reference docs before lower-level script internals when that order matters.
3. Capture enough evidence for another operator to reproduce the verdict without re-deriving the scenario.
4. Report a concise user-facing verdict, not just raw implementation notes.

---

## 2. GLOBAL PRECONDITIONS

- `deep-alignment` mode-packet exists at `.opencode/skills/system-deep-loop/deep-alignment/`.
- Mode contract exists at `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md`.
- Mode README exists at `.opencode/skills/system-deep-loop/deep-alignment/README.md`.
- Loop scripts exist under `.opencode/skills/system-deep-loop/deep-alignment/scripts/`: `scoping.cjs`, `check-convergence.cjs`, `partition-corpus.cjs`, `remediate-hook.cjs`.
- Five authority adapters exist under `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/`: `sk-doc.cjs`, `sk-git.cjs`, `sk-design.cjs`, `sk-code.cjs`, `sk-design-live-render.cjs`.
- The per-lane reducer exists at `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`.
- Reference docs exist under `.opencode/skills/system-deep-loop/deep-alignment/references/`: `scoping_protocol.md`, `discover_contract.md`, `lane_config_schema.md`, `state_machine_wiring.md`, plus `references/adapters/*.md` (adapter specs + per-authority known-deviation lists).
- Config-template asset exists at `.opencode/skills/system-deep-loop/deep-alignment/assets/deep_alignment_config_template.json`.
- The wiring regression test exists at `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs`.
- **Not yet built (out of scope, see BUILD-STATE NOTE):** `/deep:alignment` command, `deep_alignment_auto.yaml` / `deep_alignment_confirm.yaml`, `@deep-alignment` agent. (The mode `README.md` is now built and is a precondition above, not a gap.)

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- A clear PASS/FAIL verdict with reasoning.
- Evidence captured from actual file contents and actual script output instead of assumptions.
- Cross-source consistency checks across `SKILL.md`, the reference docs, the scripts, and the config-template asset.
- The exact prompt used for the scenario when the root summary is not enough on its own.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Use `rg` and `sed` to gather deterministic evidence from source; use `node` to exercise a runnable script's real handler where the scenario is about behavior, not documentation.
- Execute steps in order so the higher-level contract (`SKILL.md`, reference docs) is checked before lower-level script internals whenever that sequencing matters.
- Keep the final verdict anchored to captured evidence rather than inferred behavior.

---

## 5. ALIGNMENT PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/<category-name>/`
3. Scenario execution evidence including script stdout, exit codes, and any `alignment/` state fixtures a script-behavior scenario constructs
4. Feature-to-scenario coverage map (every DAL-NNN appears in section 13)
5. Triage notes for all non-pass outcomes including scoping validation failures, convergence stalls, and reducer corruption warnings

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (the named scripts/references/assets exist and are the current on-disk versions).
2. The canonical prompt and command sequence were executed against the canonical deep-alignment surface.
3. Expected signals are present in the captured file contents and/or script output.
4. Evidence is complete and readable, including exit codes and any JSON output the exercised handler produced.
5. Outcome rationale is explicit and references the user-visible behavior named in the scenario.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, an invariant violated (a finding asserted without a live re-probe, a documented convention flagged as drift, an audited artifact modified during the default loop, or convergence declared on an OR rather than an AND), or a critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (DAL-004 dual-path lane identity, DAL-016 verify-first, DAL-017 known-deviation suppression, DAL-020 coverage-AND-stability, DAL-024 read-only default, or DAL-025 gated-remediation no-op) forces feature verdict to `FAIL` and blocks release.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (every DAL-NNN under a category folder is referenced in section 13).
4. No unresolved blocking triage item remains.
5. The four invariants (verify-first, known-deviation suppression, read-only default, gated remediation) have each been exercised at least once and behaved as documented.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put feature-specific acceptance caveats (adapter finding shapes, convergence threshold constants, config-file error contract, dormant-vs-active deviation entries) in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Probe capacity before parallelizing audit work.
- Keep one coordinator slot free when using sub-agents.
- Group scenarios by category so any `alignment/` fixtures a script-behavior scenario builds are not mixed across waves.
- Run the iteration/convergence and report categories only after the lane-resolution and discovery categories are already verified, since they depend on the same lane shape.

---

## 7. ENTRY POINTS AND MODES

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. It validates the documented invocation contract in `SKILL.md` and the runnable scoping/convergence surface — not a live command/YAML/agent file (see the BUILD-STATE NOTE in section 1).

### DAL-001 | Invocation contract and forbidden patterns

#### Description
Verify that `SKILL.md` documents a single, coherent invocation contract (argument-hint, exclusive `/deep:alignment` entry, FORBIDDEN INVOCATION PATTERNS) that matches the mode's read-only, lane-first, verify-first design.

#### Scenario Contract
Prompt: `Validate the deep-alignment invocation contract in SKILL.md and report whether the argument-hint, exclusive-command rule, and FORBIDDEN/ALWAYS lists agree with the mode's four invariants.`

Expected signals: The frontmatter argument-hint names `[target] [authority] [:auto|:confirm] [--lane-config <file.json>] [--max-iterations=N] [--convergence=N]`; the NEVER list forbids custom dispatchers, direct CLI loops, direct `@deep-alignment` Task dispatch, ad-hoc state, and ungated remediation; the ALWAYS list requires exclusive command invocation, lanes-before-discovery, per-finding re-verification, and a read-only default.

#### Test Execution
> **Feature File:** [DAL-001](entry-points-and-modes/invocation-contract-and-forbidden-patterns.md)

### DAL-002 | Parameter surface: modes and loop tuning

#### Description
Verify that the `:auto|:confirm` mode flags and the `--max-iterations` / `--convergence` tuning parameters named in the argument-hint reconcile with the config-template defaults and the runnable `check-convergence.cjs` flags.

#### Scenario Contract
Prompt: `Validate deep-alignment parameter handling for :auto/:confirm, --max-iterations, and --convergence across the SKILL argument-hint, the config template, and check-convergence.cjs.`

Expected signals: `deep_alignment_config_template.json` carries `maxIterations: 10`, `convergence.coverageThreshold: 1.0`, `convergence.stabilityWindow: 2`, `convergence.combination: "AND"`, and `executionMode: "auto"`; `check-convergence.cjs` defaults match (`DEFAULT_MAX_ITERATIONS=10`, `DEFAULT_COVERAGE_THRESHOLD=1.0`, `DEFAULT_STABILITY_WINDOW=2`) and expose `--max-iterations`, `--coverage-threshold`, `--stability-window`; the single argument-hint `--convergence` maps to the config's two-field convergence object (the command-level glue is phase 009's, not built yet).

#### Test Execution
> **Feature File:** [DAL-002](entry-points-and-modes/parameter-surface-modes-and-tuning.md)

### DAL-003 | Config-file-only non-interactive path

#### Description
Verify that the non-interactive path is `--lane-config <file.json>` only (ADR-011), that `scoping.cjs`'s CLI refuses to guess lanes without it, and that the interactive path is the invoking command's conversational question, not a terminal prompt.

#### Scenario Contract
Prompt: `Validate that deep-alignment's non-interactive scoping path is config-file-only and that scoping.cjs errors rather than guessing lanes when --lane-config is absent.`

Expected signals: `scoping.cjs main()` requires `--lane-config` and exits with an input-validation error (exit `3`) and an explicit message pointing at the interactive fallback when the flag is absent; `scoping_protocol.md` §6 and `lane_config_schema.md` §1 lock the config-file-only rule; `resolveLanesFromSelections()` is the interactive path the invoking command calls, not a readline loop.

#### Test Execution
> **Feature File:** [DAL-003](entry-points-and-modes/config-file-only-non-interactive-path.md)

---

## 8. LANE RESOLUTION AND SCOPING

This category covers 6 scenario summaries while the linked feature files remain the canonical execution contract. All anchor to `scripts/scoping.cjs` and the `scoping_protocol.md` / `lane_config_schema.md` references.

### DAL-004 | Two resolution paths produce one identical lane shape

#### Description
Verify that the interactive path (`resolveLanesFromSelections`) and the config-file path (`resolveLanesFromConfig`) both funnel through the same `validateLane`/`validateScope` and produce an indistinguishable resolved lane tuple.

#### Scenario Contract
Prompt: `Validate that an interactively-resolved deep-alignment lane and a --lane-config lane are byte-identical once resolved, because both call the same validateLane/validateScope choke point.`

Expected signals: Equivalent input through both entrypoints yields identical `{authority, artifactClass, scope}` tuples; both call `validateLane` -> `validateScope`; `scoping_protocol.md` §4 states "one shape, two producers".

#### Test Execution
> **Feature File:** [DAL-004](lane-resolution-and-scoping/dual-path-identical-lane-shape.md)

### DAL-005 | Authority x artifact-class registry enforcement

#### Description
Verify that `AUTHORITY_ARTIFACT_CLASSES` is the single registry, that an unknown authority fails naming the registered set, and that a real authority paired with an unsupported artifact-class (e.g. `sk-git` + `docs`) fails naming both values.

#### Scenario Contract
Prompt: `Validate deep-alignment authority/artifact-class registry enforcement: unknown authority and unsupported pairing both fail fast with named values.`

Expected signals: `AUTHORITY_ARTIFACT_CLASSES` maps `sk-doc->docs`, `sk-git->git-history`, `sk-design->designs`, `sk-code->code`; `validateLane` rejects an unknown authority listing the registered set, and rejects a valid-authority/invalid-class pairing naming both values and the authority's supported class(es).

#### Test Execution
> **Feature File:** [DAL-005](lane-resolution-and-scoping/authority-artifact-class-registry.md)

### DAL-006 | Scope-shape validation and repo-root containment

#### Description
Verify the three scope shapes (`paths`, `globs`, `branchRange`), that `paths`/`globs` values are non-empty and validated against the repo root (traversal rejected via `validateNamespaceValue`), and that `branchRange` requires non-empty `from`/`to`.

#### Scenario Contract
Prompt: `Validate deep-alignment scope-shape validation: the three SCOPE_TYPES, non-empty paths/globs values run through the repo-root guard, and branchRange from/to requirements.`

Expected signals: `SCOPE_TYPES = ['paths','globs','branchRange']`; a `..`-traversal or repo-escaping `paths`/`globs` value fails the lane (NFR-S01, via `validateNamespaceValue`); an empty `values` array fails; a `branchRange` missing `from` or `to` fails; refs are not repo-root-validated.

#### Test Execution
> **Feature File:** [DAL-006](lane-resolution-and-scoping/scope-shape-and-repo-root-validation.md)

### DAL-007 | Empty lane-config resolves to zero lanes

#### Description
Verify that an empty lane-config array (`[]`) is valid and resolves to zero lanes rather than an error, mirroring the "empty resolves, does not fail" pattern used for empty scopes.

#### Scenario Contract
Prompt: `Validate that an empty deep-alignment --lane-config array resolves to zero lanes and is not an error.`

Expected signals: `resolveLanesFromConfig([])` returns `[]`; `lane_config_schema.md` §2 states an empty array is valid; downstream, zero applicable lanes becomes the convergence "nothing to converge" signal, not a crash.

#### Test Execution
> **Feature File:** [DAL-007](lane-resolution-and-scoping/empty-lane-config-zero-lanes.md)

### DAL-008 | Fail-closed error contract

#### Description
Verify that any lane-config validation failure fails the whole file (never a partial or best-effort lane set), exits `3`, and that unreadable/invalid-JSON files fail the same way.

#### Scenario Contract
Prompt: `Validate the deep-alignment lane-config fail-closed error contract: one bad lane fails the whole file with exit 3, and missing/invalid-JSON files fail identically.`

Expected signals: `parseLaneConfigFile` raises `INPUT_VALIDATION` (exit `3`) on a missing file, unreadable file, non-JSON content, or any failing lane; `lane_config_schema.md` §8's error table names the offending value/lane; no partial lane set is ever returned.

#### Test Execution
> **Feature File:** [DAL-008](lane-resolution-and-scoping/fail-closed-error-contract.md)

### DAL-009 | Multi-authority single run

#### Description
Verify that one run resolves N lanes (not a cross-product) — the "sk-code and sk-git and/or sk-design in one pass" precedent resolves to exactly the named combinations, with no hard-coded lane ceiling.

#### Scenario Contract
Prompt: `Validate deep-alignment multi-authority resolution: the worked 3-lane example resolves to exactly 3 named lanes, not a full artifact-class x authority cross-product.`

Expected signals: The `lane_config_schema.md` §7 worked example (sk-code/code, sk-git/git-history, sk-design/designs) resolves to 3 lanes; `scoping_protocol.md` §3 states only named combinations become lanes and lane count is unbounded by the engine (SC-002).

#### Test Execution
> **Feature File:** [DAL-009](lane-resolution-and-scoping/multi-authority-single-run.md)

---

## 9. DISCOVERY AND ADAPTERS

This category covers 6 scenario summaries while the linked feature files remain the canonical execution contract. Five scenarios exercise one authority adapter each (`discover`/`standardSource`/`check`); the sixth verifies the authority-agnostic three-method contract they all share.

### DAL-010 | sk-doc adapter: discover / standardSource / check

#### Description
Verify the reference adapter wraps (does not reimplement) `validate_document.py` + `extract_structure.py`: a markdown-walk `discover()`, a `standardSource('sk-doc')` pointing at real validators/templates, and a `check()` mapping blocking errors -> P0, warnings -> P1, DQI below the 75 floor -> P2, plus a verify-first reality-alignment sub-check.

#### Scenario Contract
Prompt: `Validate the sk-doc alignment adapter: markdown discover(), validator-wrapping standardSource(), and the P0/P1/P2 + DQI-floor + verify-first check() shape.`

Expected signals: `discover({type:'paths'|'globs'})` walks `.md` files excluding `node_modules`/`dist`/etc. and a `branchRange` scope returns empty; `standardSource('sk-doc')` returns the two Python validators + create-skill templates + `core_standards.md` + `knownDeviations`; `check()` emits blocking->P0 / warnings->P1 / `dqi-below-threshold`->P2 and only records a reality-drift finding when a caller-supplied claim is already contradicted with cited reprobe evidence.

#### Test Execution
> **Feature File:** [DAL-010](discovery-and-adapters/sk-doc-adapter.md)

### DAL-011 | sk-git adapter: commit-message grammar and branch naming

#### Description
Verify the sk-git adapter discovers commits (via `git log from..to`) and branches, ports the real `commit-msg` hook grammar (subject format, vague summaries, body-required-if-≥4-paths), applies the wt/{NNNN}-{name} rule only to worktree-backed branches (excluding the main checkout), and re-reads live git before every finding.

#### Scenario Contract
Prompt: `Validate the sk-git alignment adapter: branchRange discover(), ported commit-msg grammar, worktree-backed branch-naming check, and its verify-first live git re-reads.`

Expected signals: `discover({type:'branchRange'})` returns commit + branch artifacts and a `paths`/`globs` scope returns empty; `checkCommitGrammar` mirrors `commit-msg` (`SUBJECT_RE`, `VAGUE_SUMMARIES`, `historicalFileCount>=4` body rule against the commit's OWN diff-tree, not today's index); exempt subjects (`Merge`/`Revert "`/`fixup!`/`squash!`/`amend!`) are pre-checked out; a non-`wt/` branch is flagged only when `git worktree list --porcelain` shows it backs a live linked worktree; `commitExists`/`branchExists` re-probe live git first.

#### Test Execution
> **Feature File:** [DAL-011](discovery-and-adapters/sk-git-adapter.md)

### DAL-012 | sk-design static adapter: DESIGN.md structural conformance

#### Description
Verify the static (non-rendering) sk-design adapter discovers `DESIGN.md`/`tokens.json`, checks the 11 required headings + banned patterns (extractor-var leak, `Variant-N`, frequency dump) + Quick-Start color consistency + `tokens.json` parse-validity, and treats audit-rubric judgment as a verify-first reasoning-agent layer requiring a cited dimension.

#### Scenario Contract
Prompt: `Validate the sk-design static alignment adapter: DESIGN.md/tokens.json discover(), structural + banned-pattern deterministic checks, and the cited-dimension verify-first audit-rubric layer. Confirm it never renders.`

Expected signals: `discover()` collects only `DESIGN.md`/`tokens.json` (branchRange->empty); `checkDesignDoc` flags missing required headings (P0), banned patterns (P1), and Quick-Start color drift (P1); `checkTokensJsonArtifact` flags invalid JSON; `checkAuditRubric` records a finding only for a caller-supplied `verifiedFindings` entry carrying both a `dimension` and a `citation`; the adapter never renders or drives chrome-devtools (STATIC-ONLY, NFR-S01).

#### Test Execution
> **Feature File:** [DAL-012](discovery-and-adapters/sk-design-static-adapter.md)

### DAL-013 | sk-code hybrid adapter: deterministic + reasoning-agent layers

#### Description
Verify the hybrid sk-code adapter classifies each artifact's surface (OPENCODE/WEBFLOW/UNKNOWN), runs the real deterministic tools (`verify_alignment_drift.py`, `verify-minification.mjs`, `test-minified-runtime.mjs`) with correct severity mapping, excludes the tree-mutating `minify-webflow.mjs`, and only emits reasoning-agent findings from caller-supplied, cited `verifiedFindings`.

#### Scenario Contract
Prompt: `Validate the sk-code hybrid alignment adapter: surface classification, the deterministic tool-wrapping layer (ERROR->P0 / WARN->P1), the excluded mutating minifier, and the verify-first reasoning-agent dispatch/translate layer.`

Expected signals: `classifySurface` returns OPENCODE for `.opencode/...`, WEBFLOW for `src/2_javascript/` or content markers, else UNKNOWN (surface-undetected finding, never guessed); OPENCODE drift ERROR->P0 / WARN->P1; WEBFLOW FAIL->P0; `standardSource().excludedFromCheck` names `minify-webflow.mjs` (writes to the tree); `buildReasoningLayerDispatch` prepares a packet but judges nothing; `checkPatternConformance` emits a finding only for a `matchesStandard:false` entry with cited `evidence`.

#### Test Execution
> **Feature File:** [DAL-013](discovery-and-adapters/sk-code-hybrid-adapter.md)

### DAL-014 | sk-design-live-render adapter: render-evidence contract

#### Description
Verify the live-render adapter never renders anything itself: `check()` requires caller-supplied `options.renderResult` (obtained through `design-mcp-open-design`), returns a single honest `render-unavailable` finding when absent, rejects a wrong dispatch boundary with a P0, and runs threshold checks only over supplied measurements.

#### Scenario Contract
Prompt: `Validate the sk-design-live-render alignment adapter: it never renders standalone, requires renderResult, enforces the design-mcp-open-design dispatch boundary, and never fabricates a pass.`

Expected signals: `discover()` classifies `url` vs `componentEntry` targets (branchRange->empty); `check()` with no `renderResult` returns exactly one `render-unavailable` P1 finding (`producedBy:'unavailable'`); a `renderResult.dispatchedThrough` other than `design-mcp-open-design` returns a `dispatch-boundary-violation` P0; supplied `measurements` drive contrast/touch-target/CWV threshold findings; `judgmentFindings` require `evidence` + `rubricSection`.

#### Test Execution
> **Feature File:** [DAL-014](discovery-and-adapters/sk-design-live-render-adapter.md)

### DAL-015 | Authority-agnostic three-method adapter contract

#### Description
Verify every adapter implements the same three methods with a single-parameter `discover(scope)`, that discover emits `FILE` seed nodes shaped for `upsert.cjs`, and that the loop never branches on authority — so a new authority registers by adding a method trio and one registry entry, not by editing the loop.

#### Scenario Contract
Prompt: `Validate the deep-alignment authority-agnostic adapter contract: all five adapters export discover/standardSource/check, discover(scope) takes one parameter, and discover emits FILE seed nodes.`

Expected signals: all five adapter modules export `discover`, `standardSource`, `check`; `discover(scope)` is single-parameter (no authority arg); each `discover` returns `{artifacts, nodes}` with `kind:'FILE'` nodes carrying `authority`/`artifactClass` metadata; `discover_contract.md` §6 states a fifth authority needs no change to the contract, `scoping.cjs`, or the loop.

#### Test Execution
> **Feature File:** [DAL-015](discovery-and-adapters/authority-agnostic-adapter-contract.md)

---

## 10. VERIFY-FIRST AND KNOWN DEVIATIONS

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. It validates alignment invariants 1 (verify-first) and 2 (known-deviation suppression).

### DAL-016 | Verify-first: no finding without a live re-probe

#### Description
Verify that no finding is asserted from pattern-matching alone: every adapter's reasoning-agent sub-check drops entries lacking cited evidence and only emits for confirmed contradictions, and the deterministic adapters re-read live ground truth (git, validators) inside `check()` rather than trusting `discover()`-time state.

#### Scenario Contract
Prompt: `Validate the deep-alignment verify-first invariant: reasoning-agent sub-checks never invent a finding, and deterministic adapters re-probe live reality inside check().`

Expected signals: `checkRealityAlignment` (sk-doc), `checkPatternConformance` (sk-code), `checkAuditRubric` (sk-design), and `checkJudgmentFindings` (live-render) each return zero findings with no caller-supplied verified evidence and skip any entry missing its required citation/evidence; sk-git's `check()` calls `commitExists`/`getCommitMessage`/`branchExists` live; SKILL.md ALWAYS-#2 and NEVER-#1 state the rule.

#### Test Execution
> **Feature File:** [DAL-016](verify-first-and-known-deviations/verify-first-no-finding-without-reprobe.md)

### DAL-017 | Known-deviation suppression

#### Description
Verify each authority's `standardSource` carries a known-deviation list parsed from its own reference doc's fenced JSON block, that a match suppresses only the matching finding (never the whole artifact), and that active vs dormant entries are honestly distinguished.

#### Scenario Contract
Prompt: `Validate deep-alignment known-deviation suppression: each authority loads its own list from its reference doc, a match suppresses only that finding, and dormant entries are marked as such.`

Expected signals: each adapter's `loadKnownDeviations()` parses the ```json block in its `references/adapters/sk_*_known_deviations.md`; `suppressKnownDeviations` filters only matching findings; sk-doc's `compact-pointer-card-dqi` is `active` (suppresses `dqi-below-threshold` only when the validator exited 0 and docType is `readme`/`asset`) while other sk-doc entries are `dormant`; SKILL.md ALWAYS-#3 and NEVER-#2 state the rule.

#### Test Execution
> **Feature File:** [DAL-017](verify-first-and-known-deviations/known-deviation-suppression.md)

### DAL-018 | sk-git exempt-subject pre-check vs post-hoc suppression

#### Description
Verify that git-generated subjects (`Merge`/`Revert "`/`fixup!`/`squash!`/`amend!`) are a structural pre-check exemption (never evaluated), distinct from post-hoc known-deviation suppression, and that the pre-hook-install commit-date deviation matches on `commitDate < HOOK_INSTALL_DATE`.

#### Scenario Contract
Prompt: `Validate that sk-git treats git-generated subjects as a structural pre-check exemption (REQ-005), not a known-deviation suppression, and honors the pre-hook-install commit-date deviation.`

Expected signals: `isExemptSubject` short-circuits `checkCommit` before any grammar evaluation (empty findings, mirroring the hook's own `case ... exit 0`); the exemption is NOT implemented as a `knownDeviations` entry; `matchesDeviation` supports `requiresCommitBeforeHookInstall` comparing `finding.detail.commitDate` against `HOOK_INSTALL_DATE`.

#### Test Execution
> **Feature File:** [DAL-018](verify-first-and-known-deviations/sk-git-exempt-precheck-vs-suppression.md)

---

## 11. ITERATION AND CONVERGENCE

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract. It anchors to `partition-corpus.cjs` and `check-convergence.cjs`.

### DAL-019 | Corpus partitioning round-robin

#### Description
Verify `partition-corpus.cjs` walks the discovered corpus lane-by-lane in declaration order (wrapping), slices `batchSize` (default 5) unaudited artifacts per call using the reducer's per-lane checked count, skips zero-length or exhausted lanes, and returns `{done:true}` only when every lane's corpus is exhausted.

#### Scenario Contract
Prompt: `Validate deep-alignment corpus partitioning: lane-declaration-order round-robin, batch slicing against the reducer's checked count, skip of exhausted/zero lanes, and the done=true terminal.`

Expected signals: `resolveNextSlice` returns the next lane with unaudited artifacts in corpus-declaration order, wrapping; a fully-checked or zero-artifact lane is skipped without ending the walk; `{done:true}` only when all corpora are exhausted; this is distinct from deep-review's fixed four-dimension rotation.

#### Test Execution
> **Feature File:** [DAL-019](iteration-and-convergence/corpus-partitioning-round-robin.md)

### DAL-020 | Coverage AND dry-run stability convergence

#### Description
Verify convergence requires BOTH artifact-coverage >= threshold AND dry-run stability (never OR): full coverage with unstable findings does not converge, and stable-but-uncovered does not converge.

#### Scenario Contract
Prompt: `Validate deep-alignment convergence AND-semantics: CONVERGED requires coverageMet AND stability.stable, never either alone.`

Expected signals: `checkConvergence` computes `converged = coverageMet && stability.stable`; a run with 100% coverage but a recent new-finding iteration returns `CONTINUE`; a stable-but-incompletely-covered run returns `CONTINUE`; `state_machine_wiring.md` §4 states "AND, not OR" with the rationale.

#### Test Execution
> **Feature File:** [DAL-020](iteration-and-convergence/coverage-and-stability-and-semantics.md)

### DAL-021 | Max-iterations independent hard stop

#### Description
Verify that `iterationsRun >= maxIterations` forces `STOP_MAX_ITERATIONS` regardless of the coverage/stability AND-pair — an independent safety backstop applied after the AND-pair is evaluated.

#### Scenario Contract
Prompt: `Validate the deep-alignment max-iterations hard stop: it fires independently of coverage/stability once the iteration cap is reached.`

Expected signals: with coverage not met and stability false, reaching `maxIterations` returns `STOP_MAX_ITERATIONS` (not `CONTINUE`); `check-convergence.cjs` applies the cap after the AND-pair; the wiring test's `testMaxIterationsIndependentHardStop` asserts exactly this (`coverage.met=false`, `stability.stable=false`, decision `STOP_MAX_ITERATIONS`); default cap is 10.

#### Test Execution
> **Feature File:** [DAL-021](iteration-and-convergence/max-iterations-hard-stop.md)

### DAL-022 | Dry-run stability window fails closed on a fresh run

#### Description
Verify `computeDryRunStability` fails closed to "not stable" when fewer than `window` iterations are recorded, so a fresh run can never converge on its first iteration by construction.

#### Scenario Contract
Prompt: `Validate that deep-alignment's dry-run stability window fails closed: with fewer than N recorded iterations, stability is false and a fresh run cannot converge on iteration 1.`

Expected signals: `computeDryRunStability(records, window)` returns `{stable:false, reason:'fewer than N iterations recorded'}` when `records.length < window`; the last-`window` iterations must all report `newFindingsRatio === 0` to be stable; a single non-zero (or unrecognized) `newFindingsRatio` in the window keeps it unstable.

#### Test Execution
> **Feature File:** [DAL-022](iteration-and-convergence/dry-run-stability-fail-closed.md)

### DAL-023 | Nothing-to-converge and vacuous-lane exclusion

#### Description
Verify that zero applicable lanes returns `NOTHING_TO_CONVERGE`, and that a lane which discovered zero artifacts is excluded from both sides of the coverage ratio (vacuously covered / NOT_APPLICABLE) rather than blocking or falsely passing convergence.

#### Scenario Contract
Prompt: `Validate deep-alignment's nothing-to-converge signal and vacuous-lane handling: zero applicable lanes -> NOTHING_TO_CONVERGE, and a zero-artifact lane is excluded from the coverage ratio.`

Expected signals: `checkConvergence` returns `NOTHING_TO_CONVERGE` when `registry.overall.nothingToConverge`; `computeArtifactCoverage` skips a lane with zero discovered artifacts on both sides of the ratio; the reducer marks that lane `NOT_APPLICABLE`; the wiring test's `testZeroLanesCleanExit` and `testZeroArtifactLaneIsNotApplicable` assert both behaviors.

#### Test Execution
> **Feature File:** [DAL-023](iteration-and-convergence/nothing-to-converge-and-vacuous-lane.md)

---

## 12. READ-ONLY AND GATED REMEDIATION

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. It validates alignment invariants 3 (read-only default) and 4 (gated remediation).

### DAL-024 | Read-only default: audited artifacts are never modified

#### Description
Verify the default loop observes and reports only: `SKILL.md`'s `allowed-tools` carries no Write/Edit, CONVERGE writes nothing, adapters read but never mutate audited artifacts, and the one wrapped tool that would mutate the tree (`minify-webflow.mjs`) is explicitly excluded from `check()`.

#### Scenario Contract
Prompt: `Validate the deep-alignment read-only default: no Write/Edit in the default surface, CONVERGE is decision-only, and the tree-mutating minify-webflow.mjs is excluded from the sk-code check().`

Expected signals: `SKILL.md` `allowed-tools` lists read/query tools plus Task/Bash reserved for gated remediation, with a note that the default surface has no Write/Edit; `check-convergence.cjs` writes nothing (decision only); `sk-code.cjs standardSource().excludedFromCheck` names `minify-webflow.mjs` with a read-only-by-default reason; the static sk-design adapter never renders; SKILL.md ALWAYS-#4 and NEVER-#3 state the rule.

#### Test Execution
> **Feature File:** [DAL-024](read-only-and-gated-remediation/read-only-default-surface.md)

### DAL-025 | Gated remediation hook is an enterable no-op

#### Description
Verify `remediate-hook.cjs` proves the post-REPORT transition exists and is safe to enter while performing no remediation action: it always returns `{status:'not_implemented', state:'REMEDIATE'}`, touches no files or git, accepts `--confirm` without acting, and cites the operator-gate rule.

#### Scenario Contract
Prompt: `Validate the deep-alignment gated-remediation hook: it is enterable, returns not_implemented, mutates nothing, and stays gated behind an explicit operator opt-in.`

Expected signals: `enterRemediateHook()` returns `status:'not_implemented'`, `state:'REMEDIATE'`, a message citing ADR-005 invariant 4 and SKILL.md's ungated-remediation NEVER rule, and a `safetyDiscipline` list (scoped staging / worktree-when-diverged / doc-only when concurrent); `--confirm` is parsed but not actionable; the wiring test asserts `alignment/` file listing is identical before and after the hook runs.

#### Test Execution
> **Feature File:** [DAL-025](read-only-and-gated-remediation/gated-remediation-hook-noop.md)

---

## 13. REPORT EMISSION PER LANE

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. It anchors to `runtime/scripts/reduce-alignment-state.cjs`.

### DAL-026 | One report section per lane, never blended

#### Description
Verify the reducer emits `alignment-report.md` with one `## Lane:` section per lane, each authority's findings kept under its own heading rather than interleaved across authorities (SKILL.md ALWAYS-#5), and that the report is auto-generated (never hand-edited).

#### Scenario Contract
Prompt: `Validate deep-alignment report emission: one section per lane in alignment-report.md, findings never blended across authorities, report auto-generated.`

Expected signals: `renderAlignmentReport` writes an overall summary plus one `## Lane: <authority> / <artifactClass> / <scope>` section per lane, with per-severity subsections; the report frontmatter says "Auto-generated ... Never manually edited"; SKILL.md ALWAYS-#5 requires one report per lane, not one blended report.

#### Test Execution
> **Feature File:** [DAL-026](report-emission-per-lane/one-report-per-lane.md)

### DAL-027 | Worst-verdict overall rollup

#### Description
Verify the overall verdict is the WORST per-lane verdict (via `VERDICT_SEVERITY_RANK`), never an average — a single FAIL lane fails the run regardless of clean lanes, `NOT_APPLICABLE` never raises the overall verdict, and an all-NOT_APPLICABLE run reports a trivial PASS flagged `nothingToConverge`.

#### Scenario Contract
Prompt: `Validate deep-alignment's worst-verdict rollup: a single FAIL lane fails the run, NOT_APPLICABLE never raises the verdict, and an all-NA run is a trivial PASS flagged nothingToConverge.`

Expected signals: `buildOverallRollup` uses `VERDICT_SEVERITY_RANK` (FAIL=3 > CONDITIONAL=2 > PASS=1 > NOT_APPLICABLE=0) to pick the worst; a FAIL lane among clean lanes yields overall FAIL; an all-NOT_APPLICABLE run yields `verdict:'PASS'` with `nothingToConverge:true`; per-lane verdict derives P0->FAIL / P1->CONDITIONAL / else PASS (zero-artifact -> NOT_APPLICABLE).

#### Test Execution
> **Feature File:** [DAL-027](report-emission-per-lane/worst-verdict-overall-rollup.md)

### DAL-028 | Finding dedup and fail-closed severity

#### Description
Verify findings dedup across iterations via `findingDedupKey` (contentHash, else severity|type|artifact|message), that a re-emitted finding counts once, and that a finding without a recognized P0/P1/P2 severity is dropped (fail-closed, never guessed) rather than counted.

#### Scenario Contract
Prompt: `Validate deep-alignment finding dedup and fail-closed severity: repeated findings count once, and an unrecognized-severity finding is dropped rather than guessed.`

Expected signals: `findingDedupKey` prefers `contentHash`, else a `severity|type|artifact|message` fallback that does not reach for an adapter-specific field; `buildLaneEntry` keeps only the first occurrence per key; `normalizeSeverity` returns null for a non-P0/P1/P2 value and that finding is skipped; `SEVERITY_WEIGHTS` (P0=10, P1=5, P2=1) drive the composite score.

#### Test Execution
> **Feature File:** [DAL-028](report-emission-per-lane/finding-dedup-and-fail-closed-severity.md)

---

## 14. STATE AND FAULT TOLERANCE

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. It anchors to the `alignment/` state-file layout, the reducer's corruption handling, and the end-to-end wiring test.

### DAL-029 | alignment/ state-file layout and file protection

#### Description
Verify the `alignment/` state-file layout and the config-template `fileProtection` contract: config immutable/frozen at SCOPE, corpus auto-generated at DISCOVER, state JSONL append-only, registry + report reducer-owned/auto-generated, lock operator-controlled — and that a separate corpus file exists because lanes are per-run (unlike deep-review's fixed dimensions).

#### Scenario Contract
Prompt: `Validate the deep-alignment alignment/ state-file layout and fileProtection contract from state_machine_wiring.md and the config template.`

Expected signals: `state_machine_wiring.md` §3 documents the `alignment/` layout (config, corpus, state.jsonl, findings-registry, report, lock, iterations/, deltas/, prompts/, dispatch-receipts/); the config template's `fileProtection` block marks config `immutable`, corpus `auto-generated`, state.jsonl `append-only`, registry/report `auto-generated`, lock `operator-controlled`; `deep-alignment-corpus.json` has no deep-review analog because lanes are resolved per-run.

#### Test Execution
> **Feature File:** [DAL-029](state-and-fault-tolerance/alignment-state-file-layout.md)

### DAL-030 | Malformed JSONL surfaces corruptionWarnings, never crashes

#### Description
Verify the reducer's `parseJsonlDetailed` collects malformed lines into `corruptionWarnings` (with line number, truncated raw, and error) and sets `hasCorruption`, rather than dropping them silently or crashing, and that `check-convergence.cjs` best-effort-skips malformed lines when building its ordered iteration view.

#### Scenario Contract
Prompt: `Validate deep-alignment fault tolerance: malformed state-log JSONL becomes corruptionWarnings in the registry (fail-visible), and convergence still derives an ordered iteration view.`

Expected signals: `parseJsonlDetailed` returns `{records, corruptionWarnings}` where each warning has `{line, raw, error}` and `raw` is truncated past 200 chars; the reducer's registry carries `corruptionWarnings` + `hasCorruption`; `check-convergence.cjs readJsonlIterationRecords` skips unparseable lines (best-effort) and still counts well-formed `iteration` records.

#### Test Execution
> **Feature File:** [DAL-030](state-and-fault-tolerance/malformed-jsonl-corruption-warnings.md)

### DAL-031 | End-to-end state-machine wiring regression

#### Description
Verify the shipped regression test drives the whole loop — SCOPE (`scoping.cjs`) -> DISCOVER (seeded corpus) -> ITERATE (`partition-corpus.cjs`) -> CONVERGE (`check-convergence.cjs`) -> REPORT (`reduce-alignment-state.cjs`) -> REMEDIATE (`remediate-hook.cjs`) — and that the loopType decision (REQ-001) is honestly a self-contained manual coverage check, not a reused `convergence.cjs` code path.

#### Scenario Contract
Prompt: `Validate deep-alignment end-to-end wiring by running state-machine-wiring.test.cjs, and confirm check-convergence.cjs is the documented NFR-R01 manual fallback (convergence.cjs's enum does not accept "alignment").`

Expected signals: `node scripts/tests/state-machine-wiring.test.cjs` runs all four tests and prints the pass line; `state_machine_wiring.md` §2's state-to-script map matches the scripts exercised; §5 documents that `convergence.cjs`'s loopType enum (research/review/council/context) does not accept "alignment", so `check-convergence.cjs` is the NFR-R01-sanctioned self-contained coverage check, and Option A (extend the enum) is a scoped future recommendation, not done here.

#### Test Execution
> **Feature File:** [DAL-031](state-and-fault-tolerance/state-machine-wiring-regression.md)

---

## 15. AUTOMATED TEST CROSS-REFERENCE

Unlike `deep-review`, `deep-alignment` ships one real automated regression test that this playbook anchors to directly, alongside the live scripts, reference docs, mode contract, and config-template asset.

- `Automated wiring test`: `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` (run: `node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs`)
- `SKILL.md`: `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
- `Scoping`: `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`
- `Convergence`: `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
- `Partition`: `.opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs`
- `Remediate hook`: `.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs`
- `Reducer`: `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`
- `Adapters`: `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/{sk-doc,sk-git,sk-design,sk-code,sk-design-live-render}.cjs`
- `Scoping Protocol`: `.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md`
- `Discover Contract`: `.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md`
- `Lane Config Schema`: `.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md`
- `State Machine Wiring`: `.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md`
- `Adapter specs + known deviations`: `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/`
- `Config template`: `.opencode/skills/system-deep-loop/deep-alignment/assets/deep_alignment_config_template.json`

---

## 16. FEATURE CATALOG CROSS-REFERENCE INDEX

### ENTRY POINTS AND MODES

- DAL-001: [Invocation contract and forbidden patterns](entry-points-and-modes/invocation-contract-and-forbidden-patterns.md)
- DAL-002: [Parameter surface: modes and loop tuning](entry-points-and-modes/parameter-surface-modes-and-tuning.md)
- DAL-003: [Config-file-only non-interactive path](entry-points-and-modes/config-file-only-non-interactive-path.md)

### LANE RESOLUTION AND SCOPING

- DAL-004: [Two resolution paths produce one identical lane shape](lane-resolution-and-scoping/dual-path-identical-lane-shape.md)
- DAL-005: [Authority x artifact-class registry enforcement](lane-resolution-and-scoping/authority-artifact-class-registry.md)
- DAL-006: [Scope-shape validation and repo-root containment](lane-resolution-and-scoping/scope-shape-and-repo-root-validation.md)
- DAL-007: [Empty lane-config resolves to zero lanes](lane-resolution-and-scoping/empty-lane-config-zero-lanes.md)
- DAL-008: [Fail-closed error contract](lane-resolution-and-scoping/fail-closed-error-contract.md)
- DAL-009: [Multi-authority single run](lane-resolution-and-scoping/multi-authority-single-run.md)

### DISCOVERY AND ADAPTERS

- DAL-010: [sk-doc adapter: discover / standardSource / check](discovery-and-adapters/sk-doc-adapter.md)
- DAL-011: [sk-git adapter: commit-message grammar and branch naming](discovery-and-adapters/sk-git-adapter.md)
- DAL-012: [sk-design static adapter: DESIGN.md structural conformance](discovery-and-adapters/sk-design-static-adapter.md)
- DAL-013: [sk-code hybrid adapter: deterministic + reasoning-agent layers](discovery-and-adapters/sk-code-hybrid-adapter.md)
- DAL-014: [sk-design-live-render adapter: render-evidence contract](discovery-and-adapters/sk-design-live-render-adapter.md)
- DAL-015: [Authority-agnostic three-method adapter contract](discovery-and-adapters/authority-agnostic-adapter-contract.md)

### VERIFY-FIRST AND KNOWN DEVIATIONS

- DAL-016: [Verify-first: no finding without a live re-probe](verify-first-and-known-deviations/verify-first-no-finding-without-reprobe.md)
- DAL-017: [Known-deviation suppression](verify-first-and-known-deviations/known-deviation-suppression.md)
- DAL-018: [sk-git exempt-subject pre-check vs post-hoc suppression](verify-first-and-known-deviations/sk-git-exempt-precheck-vs-suppression.md)

### ITERATION AND CONVERGENCE

- DAL-019: [Corpus partitioning round-robin](iteration-and-convergence/corpus-partitioning-round-robin.md)
- DAL-020: [Coverage AND dry-run stability convergence](iteration-and-convergence/coverage-and-stability-and-semantics.md)
- DAL-021: [Max-iterations independent hard stop](iteration-and-convergence/max-iterations-hard-stop.md)
- DAL-022: [Dry-run stability window fails closed on a fresh run](iteration-and-convergence/dry-run-stability-fail-closed.md)
- DAL-023: [Nothing-to-converge and vacuous-lane exclusion](iteration-and-convergence/nothing-to-converge-and-vacuous-lane.md)

### READ-ONLY AND GATED REMEDIATION

- DAL-024: [Read-only default: audited artifacts are never modified](read-only-and-gated-remediation/read-only-default-surface.md)
- DAL-025: [Gated remediation hook is an enterable no-op](read-only-and-gated-remediation/gated-remediation-hook-noop.md)

### REPORT EMISSION PER LANE

- DAL-026: [One report section per lane, never blended](report-emission-per-lane/one-report-per-lane.md)
- DAL-027: [Worst-verdict overall rollup](report-emission-per-lane/worst-verdict-overall-rollup.md)
- DAL-028: [Finding dedup and fail-closed severity](report-emission-per-lane/finding-dedup-and-fail-closed-severity.md)

### STATE AND FAULT TOLERANCE

- DAL-029: [alignment/ state-file layout and file protection](state-and-fault-tolerance/alignment-state-file-layout.md)
- DAL-030: [Malformed JSONL surfaces corruptionWarnings, never crashes](state-and-fault-tolerance/malformed-jsonl-corruption-warnings.md)
- DAL-031: [End-to-end state-machine wiring regression](state-and-fault-tolerance/state-machine-wiring-regression.md)
