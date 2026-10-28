---
title: "sk-code: Feature Catalog"
description: "Current-state inventory for the sk-code hub, covering its two-axis registry-driven routing, the compiled-routing fast path, the quality gate and its repository config, the rule overrides a repository can set, the sk-code and CI doctors, review reach calibration and the review floor, lens and agent verdict."
trigger_phrases:
  - "sk-code feature catalog"
  - "sk-code hub capabilities"
  - "two-axis registry routing"
  - "sk-code compiled routing"
  - "sk-code quality gate"
  - "sk-code doctor commands"
last_updated: "2026-10-28"
version: 1.0.6.0
---

# sk-code: Feature Catalog

This catalog inventories the live `sk-code` hub surface. The skill advisor routes any code-related prompt to the single identity `sk-code`; the hub resolves a WORKFLOW mode (`sk-code-quality`, `sk-code-review`) and bundles zero-or-more read-only SURFACE evidence packets (`sk-code-ci`, `sk-code-skilled`) declaratively from `mode-registry.json`. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `sk-code` hub. The hub does not implement or debug code itself. It is a declarative router that hands the resolved workflow mode (plus bundled surface evidence) to the correct nested packet. Sections 4 to 6 inventory the features the modes and their doctor commands ship: the quality gate and its repository config, the rule overrides a repository can set, the sk-code and CI doctors, the review reach rule and the review floor, lens and agent verdict.

---

## 2. TWO-AXIS MODE ROUTING

### Two-Axis Registry-Driven Routing

#### Description

`mode-registry.json` is the single source of truth for dispatching a resolved WORKFLOW mode plus zero-or-more read-only SURFACE evidence packets, discriminated by `workflowMode`, `packetKind`, and `backendKind`.

#### Current Reality

`sk-code-quality` and `sk-code-review` are WORKFLOW modes that act. `sk-code-ci` and `sk-code-skilled` are advisor-invisible SURFACE packets bundled alongside a workflow mode via `routerPolicy.outcomes.surfaceBundle`, workflow mode ordered first. The hub carries no root `references/<key>/` resource router. Resource slicing lives inside the nested packets. Stack detection reads its order from declared `surfaceDetection` blocks: every specific surface first, including skills outside the hub that declare `surface_detection`, then the single SKILLED fallback, then UNKNOWN. The registry compiler rejects a hub whose fallback is not ranked last.

#### Source Files

See [`two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`](two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) for the discriminator, bundling rule, and source anchors.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

A default-on, flag-gated, additive directive in `sk-code`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the two-axis registry-driven routing above.

#### Current Reality

The directive is on by default for `sk-code`, one of the seven activated hubs: with `SPECKIT_COMPILED_ROUTING` unset, `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<task>"` returns the authoritative decision and the hub follows it directly. Setting `SPECKIT_COMPILED_ROUTING=0` is the explicit kill-switch that forces legacy `mode-registry.json` routing; any error or a `{"servingAuthority":"legacy"}` sentinel also leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.

---

## 4. QUALITY GATE

### Codebase-Agnostic Quality Gate

#### Description

One runner prints one machine verdict for a change in any repository, from built-in sensors, a comment-hygiene call, a parse floor and the checks the repository names.

#### Current Reality

`quality-gate.cjs` checks the worktree change, a base range or named files, writes no file and never reports a pass. Its exit code is the verdict: `NO_BLOCKER_FOUND`, `BLOCKED`, `NOTHING_CHECKED`, `ERROR` or `UNVERIFIED`.

#### Source Files

See [`quality-gate/codebase-agnostic-quality-gate.md`](quality-gate/codebase-agnostic-quality-gate.md) for the scopes, the exit codes and source anchors.

### Repository Quality Config

#### Description

A committed .sk-code/quality.json names the commands a repository runs as quality checks, and a configured check starts only from a config the repository or an operator vouched for.

#### Current Reality

Discovery takes the first of `--config`, a stored `skcode.qualityConfig`, `.sk-code/quality.json` and none. A configured command runs as an argv array with no shell inside the workspace guard, and an untrusted config reads `SKIPPED_UNTRUSTED` with a repair line. The same file can switch named comment-hygiene rules off through `commentHygiene.disableRules`.

#### Source Files

See [`quality-gate/repository-quality-config.md`](quality-gate/repository-quality-config.md) for discovery, the schema, the trust boundary and source anchors.

### Rule Overrides And Hygiene Policy

#### Description

A repository drops or replaces any quality or review rule outside a fixed hard floor, in a `## Rule overrides` section of a checklist it already declares and in `commentHygiene.disableRules`.

#### Current Reality

The shared linter refuses a row that names a hard-floor id, and the quality runner's explain entry shows each declared checklist's parsed rows for several files at once. The runner, the pre-commit hook and the CI job honor the hygiene key together, and the verdict lists the disabled rules in `config.hygiene.disabled`.

#### Source Files

See [`quality-gate/rule-overrides-and-hygiene-policy.md`](quality-gate/rule-overrides-and-hygiene-policy.md) for the section format, the hard floor, the explain output and source anchors.

---

## 5. DOCTOR COMMANDS

### sk-code Setup And Quality Doctor

#### Description

/doctor:sk-code runs the read-only nine-leg setup battery by default, and its quality target shows, checks and once creates the repository quality config.

#### Current Reality

`setup` names a repair command for each failing leg, and its last leg checks the quality gate itself. `quality` names the hygiene rules the config switches off, suggests the spec-kit rules for a repository with no `specs/` folder without writing them, and writes `.sk-code/quality.json` only after approval and never over an existing file.

#### Source Files

See [`doctor-commands/sk-code-setup-and-quality-doctor.md`](doctor-commands/sk-code-setup-and-quality-doctor.md) for the legs, the quality modes and source anchors.

### CI Workflow Doctor And Switches

#### Description

/doctor:ci reports every GitHub Actions workflow with its switch state, scaffolds a new workflow from the standards templates and toggles one documented CI switch after approval.

#### Current Reality

`report` is read-only and prints switch states, never variable values. `toggle` covers six switch variables and refuses the master and message-contract switches while the workflows README forbids switching them off.

#### Source Files

See [`doctor-commands/ci-workflow-doctor-and-switches.md`](doctor-commands/ci-workflow-doctor-and-switches.md) for the targets, the switches and source anchors.

---

## 6. REVIEW CALIBRATION

### Review Reach Calibration

#### Description

A P0 or P1 review finding must name its reach, an input or caller the code's stated contract allows, and a finding that cannot name one is P2.

#### Current Reality

Out-of-contract input is P2 hardening unless the code claims to validate it, and data that crosses a trust boundary is always in reach. The escalation rule never lifts a finding with no reach.

#### Source Files

See [`review-calibration/review-reach-calibration.md`](review-calibration/review-reach-calibration.md) for the rule, its exceptions and source anchors.

### Review Floor, Default Lens And Rule Overrides

#### Description

The review mode keeps a fixed floor of security and correctness rules, applies a default lens a repository can change and records every rule source on one `Rule sources:` line.

#### Current Reality

Each checklist rule carries an id. The review reads a file's checklists and parsed override rows from the quality runner's explain entry, applies them by the shared precedence and lists applied, refused, ignored and conflicting rows. A hygiene rule the repository switched off raises no review finding.

#### Source Files

See [`review-calibration/review-floor-lens-and-overrides.md`](review-calibration/review-floor-lens-and-overrides.md) for the ids, the precedence, the outcomes and source anchors.

### Review Agent Severity Verdict

#### Description

The `@review` agent applies the review mode's rules and decides pass or fail from severity alone, with its 100-point score kept as advisory information.

#### Current Reality

Any P0 finding, or an open P1, means `REQUESTED_CHANGES` and a failed gate. Every report format uses the mode's three status values, `@orchestrate` adds the `CODE-REVIEW` marker to a review dispatch, and the report checkers fail a verdict that contradicts its findings.

#### Source Files

See [`review-calibration/review-agent-severity-verdict.md`](review-calibration/review-agent-severity-verdict.md) for the verdict table, the dispatch marker and source anchors.
