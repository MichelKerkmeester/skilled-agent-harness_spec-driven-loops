---
title: Universal Code Quality Standards
description: Stack-agnostic P0/P1/P2 severity model for the Phase 1.5 Code Quality Gate.
trigger_phrases:
  - "universal code quality standards"
  - "p0 p1 p2 severity tiers"
  - "code quality gate severity"
  - "stack agnostic quality contract"
  - "design restraint ladder"
importance_tier: important
contextType: implementation
version: 1.6.0.0
---

# Universal Code Quality Standards

Stack-agnostic P0/P1/P2 severity model for the Phase 1.5 Code Quality Gate, plus the pre-write Design Restraint Ladder.

---

## 1. OVERVIEW

### Purpose

The severity contract behind every surface quality checklist in `sk-code`. P0 blocks completion. P1 needs explicit approval to defer. P2 is tracked and never blocks. Surface checklists hold the concrete rules and give each one a tier from this contract.

### Core Principle

Severity tiers exist so reviewers and authors agree on what blocks "done". A rule's tier is a stable contract: the bar does not move per PR, per author or per deadline.

### When to Use

- At the Phase 1.5 Code Quality Gate, which the `sk-code-quality` mode runs before Phase 1 (Implementation) can be called complete.
- When authoring or reviewing a surface quality checklist.
- When deciding whether a finding blocks merge or can ship as a follow-up.
- When the `sk-code-review` mode ranks findings, so reviewer and author tiers mean the same thing.

### Key Sources

- Surface checklists: the checklists each surface declares. For this repository's own code that is SKILLED, under `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/`.
- Rule ids, the hard floor and overrides: [`rule-overrides.md`](./rule-overrides.md) and [`rule-overrides.json`](./rule-overrides.json).
- Findings-first review baseline: the `sk-code-review` mode and its review output contract.

### Design Restraint Ladder (pre-write)

Before writing NEW code for an implementation task, stop at the first rung that holds. Each rung down adds code someone must read, test and keep. The ladder runs AFTER surface and intent routing, so its vocabulary matches the detected surface. It is a post-read reflex: rungs 2 to 5 need you to read what already exists.

1. **Does this need to exist at all? (YAGNI)** If the requirement looks unnecessary, recommend a scope amendment in the same response. NEVER silently cut scope. SCOPE LOCK and the Logic-Sync HALT still apply.
2. **Already in this codebase (a helper, component, service, pattern)?** Use it the way the surrounding code does.
3. **Standard library / language built-in?**
4. **Native platform or runtime feature?** Use the native API of the detected surface.
5. **An already-installed dependency?** Never add a new dependency for what a few lines do.
6. **Can it be one line?**
7. **Only then: the minimum code that works.**

Restraint never cuts a P0 item in §3 below, such as input validation, error handling, secrets handling and accessibility, or anything the user asked for.

The ladder consumes the detected surface and does NOT change surface precedence. sk-code-skilled is the fallback surface, always last, and any other declared surface outranks it. Nor does the ladder change the Iron Law: Phase 3 verification is still required. For the over-engineering, gold-plating and scope-creep detectors, see the Restraint Signals table in the repository's `AGENTS.md` and the restraint rules in its `.skilled/repo-rules/`, such as `prevent-overengineering.md`, when present.

---

## 2. SEVERITY TIERS

The Code Quality Gate puts every quality rule in exactly one tier:

| Tier   | Handling      | Completion Impact                               |
| ------ | ------------- | ----------------------------------------------- |
| **P0** | HARD BLOCKER  | Cannot claim done until fixed                   |
| **P1** | Required      | Must fix OR get user approval to defer          |
| **P2** | Optional      | Can defer with a documented reason. Non-blocking |

**Gate rule**: if ANY P0 item fails, completion is BLOCKED until fixed. P1 violations need explicit deferral approval. P2 violations are tracked but do not block.

Review ranks findings on its own scale, so the review-severity column in sections 3 to 5 maps each rule onto the ids in section 2 of [`review-core.md`](../../../sk-code-review/references/review-core.md). An author can then see how a finding reads in review before review runs. Review keeps its ids, their meanings and its judgement on each finding, so the column is a forecast and never overrides a reviewer.

---

## 3. P0 CATEGORIES (universal, apply across stacks)

The universal floor is sections 3 to 5 of this file. Every surface gets it, UNKNOWN included. It holds only rules that hold in any codebase: house style, such as doc-comment forms, typing strictness and naming schemes, belongs to the surface that chose it.

### Rule ids and overrides

Every floor rule carries an id in the `<class>.<name>` grammar of the [rule overrides contract](./rule-overrides.md) section 3, and an Override mark:

- **FIXED** rules are the hard floor in section 4 of that contract and in [`rule-overrides.json`](./rule-overrides.json). No source changes them, and a `## Rule overrides` section that names one is refused.
- **overridable** rules are the default. A repository or surface may set one to `none` or replace it in a `## Rule overrides` section of a checklist file its declaration names, as section 6 of the contract allows. Without such a row the rule applies as written here.

When more than one source speaks to the same rule, the contract's precedence in section 5 decides: the hard floor, then the repository checklist, then a specific surface, then the SKILLED fallback, then the rule as this file ships it. A surface checklist may still add rules of its own.

### Mechanical Floor (every surface)

Three faults are P0 on every surface, because no other check can be trusted on a file that has one. The quality runner's built-in checks detect a parse failure in JSON, in JavaScript through both its CommonJS and ESM loaders, in Python, in shell, in YAML and in TOML. The YAML check parses through PyYAML and the TOML check through `tomllib`, and each runs only when the `python3` in use imports its parser. When one cannot, that check reads `SKIPPED_ABSENT` with a `repair` naming what to install, and the run stays verified because neither check is required. They also detect the conflict markers and the credential signature over every readable text file. A parse check for any language outside that list stays with the surface checklist or a configured `syntax-*` check, so no surface restates what the runner already covers.

| Id | Override | Rule | Review severity |
| --- | --- | --- | --- |
| `syntax.*` | FIXED | **Parse failure**: the file does not parse in its language, which a shebang decides before the extension. A finding in plain JavaScript is heuristic and does not block, because a `.js` file may hold JSX or Flow, and a finding in a `.json` file that parses only once its comments and trailing commas are stripped is heuristic too, because the tool that reads it may accept them. The agent confirms either finding first. | P1, once a heuristic finding is confirmed |
| `conflict.*` | FIXED | **Merge-conflict markers**: a text file holds the lines of an unresolved merge conflict. | P1 |
| `secret.*` | FIXED | **Credential signature**: a file holds a private-key header or a token in a known credential format. | P0 |

### Categories

P0 covers issues that have caused production incidents or reviewer-author confusion:

| Id | Override | Rule | Review severity |
| --- | --- | --- | --- |
| `floor.initialization-safety` | FIXED | **Initialization safety**: code that sets up state guards against double initialization, race conditions and partial loads. | P1. P0 when the gap is exploitable or causes data loss |
| `floor.input-validation` | FIXED | **Input validation**: every external input (function parameters, API responses, file contents, env vars) is validated at the boundary. | P1. P0 when the gap is exploitable or causes data loss |
| `floor.commented-out-code` | overridable | **No commented-out code**: delete it. Commented code rots and misleads readers. | P1 |
| `floor.silent-failures` | FIXED | **No silent failures**: an exception either reaches the caller or is logged with enough context to debug it. | P1 |
| `floor.hardcoded-secrets` | FIXED | **No hardcoded secrets**: credentials, API keys and tokens never sit inline. They come from env vars or a secret store. | P0 |
| `floor.ephemeral-pointers` | overridable | **No ephemeral-artifact pointers in comments**: a comment never names a spec folder, a packet, phase, task, checklist or requirement id, a feature-catalog entry, an ADR id or a ticket id. Those get renamed or archived and leave a dangling pointer. Keep the durable WHY. The full contract is "No ephemeral-artifact pointers" in `code-style-guide.md` §4. | P1 |
| `floor.accessibility` | FIXED | **Accessibility** (user-facing UI): interactive elements stay keyboard-operable, carry an accessible name and keep a visible focus state. | P1 |

`floor.ephemeral-pointers` is the judgment half of a rule the runner also checks. Its machine half is the comment-hygiene checker, whose findings carry the `hygiene.*` ids of `runner-contract.md` section 5, such as `hygiene.issue`, `hygiene.task`, `hygiene.adr` and `hygiene.spec-path`. Under the contract's machine-checked rule, a `none` row for `floor.ephemeral-pointers` or for one `hygiene.*` id changes what the agent and review apply, and the runner's own check changes only through `commentHygiene.disableRules` in the repository's quality config. A `replace:` row never reaches the runner's check.

---

## 4. P1 CATEGORIES (universal)

P1 covers issues that degrade maintainability or reliability:

| Id | Override | Rule | Review severity |
| --- | --- | --- | --- |
| `floor.boundary-tests` | overridable | **Test coverage at boundaries**: happy path plus at least one edge case per public surface. | P1 |
| `floor.error-messages` | overridable | **Error message quality**: every error carries enough context for the operator to act. | P2 |
| `floor.resource-cleanup` | FIXED | **Resource cleanup**: file handles, network connections, subscriptions, observers and timers close or cancel deterministically. | P1 |
| `floor.type-safety` | overridable | **Type checks pass**: where the repository runs a type checker, the change passes it. How strict the types must be is the surface's rule. | P1 when the type check fails, P2 otherwise |
| `floor.naming` | overridable | **Naming convention adherence**: names follow the convention the repository or its surface declares. | P2 |

---

## 5. P2 CATEGORIES (universal)

P2 covers issues that improve quality but do not affect correctness or maintainability:

| Id | Override | Rule | Review severity |
| --- | --- | --- | --- |
| `floor.documentation` | overridable | **Documentation where it earns its place**: a non-obvious contract or a complex algorithm carries a comment that explains WHY. Whether public APIs carry doc comments, and in which form, is the surface's rule. | P2 |
| `floor.idiomatic` | overridable | **Idiomatic refinements**: code follows community style guides and project conventions. | P2 |
| `floor.performance-polish` | overridable | **Performance polish**: optimization beyond the NFR targets. | P2 |
| `floor.extra-tests` | overridable | **Test coverage beyond boundaries**: extra edge cases, fuzz tests and property tests. | P2 |

---

## 6. SURFACE-SPECIFIC CHECKLISTS

Each surface adds its own rules to these universal tiers and gives each rule a tier. This file is the contract, and the surface checklists are the implementations. A surface checklist may also carry a `## Rule overrides` section for an overridable floor id, under the precedence in section 3.

| Surface | Phase 1.5 source | Notes |
| ------- | ---------------- | ----- |
| SKILLED | `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/` | The fallback. The SKILLED house checklist, `universal-checklist.md`, plus one per touched language (JavaScript, TypeScript, Python, Shell, Rust, JSON/JSONC), the JavaScript and CSS house style under `js-css-style/` and authoring checklists for agents, commands, skills and MCP servers. It carries the doc-comment, typing and naming detail this floor leaves to the surface |
| CI | `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Rule index for GitHub Actions workflows |
| Declared specific surface | The standards its skill ships | Declared through `surface_detection` in that skill's `graph-metadata.json`. Outranks SKILLED |
| UNKNOWN | The universal floor in sections 3 to 5, the quality runner's built-in checks and the checks and checklists the repository's quality config names, each with its overrides applied | sk-code does not own Go, React/Next.js, generic Node.js, React Native or Swift. Apply those, then ask for the surface and its commands. The spec-folder authoring checklist applies only where the SKILLED surface resolves, and no discovered command applies |

---

## 7. WORKFLOW

At the Phase 1.5 Code Quality Gate:

1. Identify the file type and code surface. The smart router does this, and `../stack-detection.md` holds the detection order.
2. Run the quality runner on the changed files before committing:
   ```bash
   node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs
   ```
   It reads the working-tree change by default, or `--files <path>...`, and prints one verdict. Its built-in checks cover the mechanical floor in §3, and the comment-hygiene checker is one of its sensors, so one run checks both. Zero blocking findings are required. `BLOCKED` stops completion until the finding is fixed, and `UNVERIFIED` or `NOTHING_CHECKED` never reads as clean. To suppress a known comment-hygiene false positive, put `hygiene-ok` on that comment line. The gate values and the verdict fields are in `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`.

   A repository may also enforce comment hygiene outside the runner: at write time, at commit time and in CI. The verdict's `layers` field reports what a probe found for each of those layers, and a quality claim cites that field. This repository's own wiring is listed under "Comment-Hygiene Enforcement Gates" in `.skilled/skills/sk-code/sk-code-quality/SKILL.md`.

3. Load the matching surface checklist from §6.
4. Check every P0 item and fix each failure before going on.
5. Check every P1 item. Fix it or record the approved deferral.
6. Check every P2 item and track misses for follow-up. They do not block.
7. Mark each checklist item `[x]` with evidence: the code that passes the rule or the test that proves it.
8. Go to Phase 2 (Debugging) when a check fails, otherwise to Phase 3 (Verification).

---

## 8. RELATIONSHIP TO `sk-code`'s CODE-REVIEW MODE

The `sk-code-quality` mode produces **surface compliance evidence** at Phase 1.5, where the author checks their own change. The `sk-code-review` mode owns the **findings-first review output**: severity-ranked findings, risk reporting and the security and correctness minimums.

Use `sk-code-review` when:

- A PR or a stakeholder needs a structured, severity-ranked findings report.
- Security or correctness minimums need an audit.

Use `sk-code-quality` when:

- You are the author checking your own implementation before claiming done.
- You need surface-specific quality rules during development.

Both modes rank against these tiers, so author evidence and review findings add up to one quality story.

---

## 9. RELATED RESOURCES

- [`./rule-overrides.md`](./rule-overrides.md) - the override contract: the rule id grammar, the hard floor, precedence and how an override is recorded.
- [`../../../sk-code-quality/references/code-style-guide.md`](../../../sk-code-quality/references/code-style-guide.md) - language-agnostic naming, formatting and structure principles.
- [`../stack-detection.md`](../stack-detection.md) - surface detection order, with specific surfaces first and the SKILLED fallback last.
- [`../workflow-implement.md`](../workflow-implement.md) - Phase 1, where the Design Restraint Ladder is applied.
- [`../workflow-debug.md`](../workflow-debug.md) - root-cause analysis and command-failure recovery when Phase 1.5 fails and the fix is not obvious.
- [`../workflow-verify.md`](../workflow-verify.md) - the pre-claim gate that runs after Phase 1.5 clears, before any "done" claim.
- [`../phase-detection.md`](../phase-detection.md) - Phase 1.5 position in the sk-code lifecycle.
