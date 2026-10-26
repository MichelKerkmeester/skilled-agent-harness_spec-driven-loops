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
version: 1.5.5.0
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

- Surface checklists: `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` (the author-side overlay that sk-code-quality loads for the file types it names) and `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/`.
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

The universal floor is sections 3 to 5 of this file. Every surface gets it, UNKNOWN included, and a surface checklist adds rules to it without removing any.

### Mechanical Floor (every surface)

Three faults are P0 on every surface, because no other check can be trusted on a file that has one. The quality runner's built-in checks detect a parse failure in JSON, in JavaScript through both its CommonJS and ESM loaders, in Python, in shell, in YAML and in TOML. The YAML check parses through PyYAML and the TOML check through `tomllib`, and each runs only when the `python3` in use imports its parser. When one cannot, that check reads `SKIPPED_ABSENT` with a `repair` naming what to install, and the run stays verified because neither check is required. They also detect the conflict markers and the credential signature over every readable text file. A parse check for any language outside that list stays with the surface checklist or a configured `syntax-*` check, so no surface restates what the runner already covers.

| Rule | Review severity |
| --- | --- |
| **Parse failure**: the file does not parse in its language, which a shebang decides before the extension. A finding in plain JavaScript is heuristic and does not block, because a `.js` file may hold JSX or Flow, and a finding in a `.json` file that parses only once its comments and trailing commas are stripped is heuristic too, because the tool that reads it may accept them. The agent confirms either finding first. | P1, once a heuristic finding is confirmed |
| **Merge-conflict markers**: a text file holds the lines of an unresolved merge conflict. | P1 |
| **Credential signature**: a file holds a private-key header or a token in a known credential format. | P0 |

### Categories

P0 covers issues that have caused production incidents or reviewer-author confusion:

| # | Rule | Review severity |
| --- | --- | --- |
| 1 | **Initialization safety**: code that sets up state guards against double initialization, race conditions and partial loads. | P1. P0 when the gap is exploitable or causes data loss |
| 2 | **Input validation**: every external input (function parameters, API responses, file contents, env vars) is validated at the boundary. | P1. P0 when the gap is exploitable or causes data loss |
| 3 | **No commented-out code**: delete it. Commented code rots and misleads readers. | P1 |
| 4 | **No silent failures**: an exception either reaches the caller or is logged with enough context to debug it. | P1 |
| 5 | **No hardcoded secrets**: credentials, API keys and tokens never sit inline. They come from env vars or a secret store. | P0 |
| 6 | **No ephemeral-artifact pointers in comments**: a comment never names a spec folder, a packet, phase, task, checklist or requirement id (`T###`, `CHK-###`, `REQ-###`), a feature-catalog entry, an ADR id or a ticket id. Those get renamed or archived and leave a dangling pointer. Keep the durable WHY. The full contract is "No ephemeral-artifact pointers" in `code-style-guide.md` §4. | P1 |
| 7 | **Accessibility** (user-facing UI): interactive elements stay keyboard-operable, carry an accessible name and keep a visible focus state. | P1 |

---

## 4. P1 CATEGORIES (universal)

P1 covers issues that degrade maintainability or reliability:

| # | Rule | Review severity |
| --- | --- | --- |
| 1 | **Documentation completeness**: public APIs, exported types and complex algorithms carry docstrings or comments that explain WHY. | P2 |
| 2 | **Test coverage at boundaries**: happy path plus at least one edge case per public surface. | P1 |
| 3 | **Error message quality**: every error carries enough context for the operator to act. | P2 |
| 4 | **Resource cleanup**: file handles, network connections, subscriptions, observers and timers close or cancel deterministically. | P1 |
| 5 | **Type-safety enforcement**: in the language's own terms. TypeScript runs in strict mode without `any`. Python public functions carry type hints without `Any`. | P1 when the type check fails, P2 otherwise |
| 6 | **Naming convention adherence**: names follow the surface convention, such as camelCase in JavaScript and TypeScript or snake_case in Python and Shell. | P2 |

---

## 5. P2 CATEGORIES (universal)

P2 covers issues that improve quality but do not affect correctness or maintainability:

| # | Rule | Review severity |
| --- | --- | --- |
| 1 | **Idiomatic refinements**: code follows community style guides and project conventions. | P2 |
| 2 | **Performance polish**: optimization beyond the NFR targets. | P2 |
| 3 | **Test coverage beyond boundaries**: extra edge cases, fuzz tests and property tests. | P2 |
| 4 | **Documentation completeness for internal helpers**: private functions get explained too. | P2 |

---

## 6. SURFACE-SPECIFIC CHECKLISTS

Each surface adds its own rules to these universal tiers and gives each rule a tier. This file is the contract, and the surface checklists are the implementations.

| Surface | Phase 1.5 source | Notes |
| ------- | ---------------- | ----- |
| SKILLED | `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/` | The fallback. The SKILLED house checklist, `universal-checklist.md`, plus one per touched language (JavaScript, TypeScript, Python, Shell, Rust, JSON/JSONC) and authoring checklists for agents, commands, skills and MCP servers |
| CI | `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Rule index for GitHub Actions workflows |
| Declared specific surface | The standards its skill ships | Declared through `surface_detection` in that skill's `graph-metadata.json`. Outranks SKILLED |
| UNKNOWN | The universal floor in sections 3 to 5, the quality runner's built-in checks, the quality mode's own surface-neutral checklists that the runner lists (the JavaScript and CSS style checklists under `sk-code-quality/assets/code-quality-checklist/`) and the quality checks the repository's quality config names | sk-code does not own Go, React/Next.js, generic Node.js, React Native or Swift. Apply those, then ask for the surface and its commands. The spec-folder authoring checklist applies only where the SKILLED surface resolves, and no discovered command applies |

---

## 7. WORKFLOW

At the Phase 1.5 Code Quality Gate:

1. Identify the file type and code surface. The smart router does this, and `../stack-detection.md` holds the detection order.
2. Run the quality runner on the changed files before committing:
   ```bash
   node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs
   ```
   It reads the working-tree change by default, or `--files <path>...`, and prints one verdict. Its built-in checks cover the mechanical floor in §3, and the comment-hygiene checker is one of its sensors, so one run checks both. Zero blocking findings are required. `BLOCKED` stops completion until the finding is fixed, and `UNVERIFIED` or `NOTHING_CHECKED` never reads as clean. To suppress a known comment-hygiene false positive, put `hygiene-ok` on that comment line. The gate values and the verdict fields are in `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`.

   Three gates also enforce comment hygiene, so the runner is early feedback, not the only safety net:
   - **Write-time**: the shared router in `.skilled/hooks/post-edit-quality/` runs after every edit through one adapter per runtime (Claude Code, Codex, Devin, Cursor, Pi and OpenCode) and reports findings before the model's next turn.
   - **Commit-time**: `.skilled/scripts/git-hooks/pre-commit`, installed by `.skilled/scripts/install-git-hooks.sh`, blocks any commit with violations. Bypass with `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit`. The opt-in `.skilled/hooks/git/pre-commit` and the unregistered `sk-code-quality/scripts/hooks/claude-posttooluse.sh` are legacy, not default gates.
   - **CI**: `.github/workflows/comment-hygiene.yml` re-checks every PR to main, and `--no-verify` cannot skip it.

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

- [`../../../sk-code-quality/references/code-style-guide.md`](../../../sk-code-quality/references/code-style-guide.md) - language-agnostic naming, formatting and structure principles.
- [`../stack-detection.md`](../stack-detection.md) - surface detection order, with specific surfaces first and the SKILLED fallback last.
- [`../workflow-implement.md`](../workflow-implement.md) - Phase 1, where the Design Restraint Ladder is applied.
- [`../workflow-debug.md`](../workflow-debug.md) - root-cause analysis and command-failure recovery when Phase 1.5 fails and the fix is not obvious.
- [`../workflow-verify.md`](../workflow-verify.md) - the pre-claim gate that runs after Phase 1.5 clears, before any "done" claim.
- [`../phase-detection.md`](../phase-detection.md) - Phase 1.5 position in the sk-code lifecycle.
