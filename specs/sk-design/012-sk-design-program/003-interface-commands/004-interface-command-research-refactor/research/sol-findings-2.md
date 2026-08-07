# SOL-fast Research Report (dispatch 2: create-command alignment + benchmarking)

> cli-opencode openai/gpt-5.6-sol-fast, high; read sk-doc create-command standard + our contract test.

# `/interface:*` Command Conformance and Benchmark Report

## Executive Verdict

The five commands are behaviorally tested but **not aligned with the `create-command` authoring contract**.

The principal conflict is architectural:

- The standard classifies this family as a mode-pair router with a thin Markdown dispatcher, owned presentation asset, and paired auto/confirm workflows (`.opencode/skills/sk-doc/create-command/assets/command-contract.json:47-82`).
- The current test explicitly requires each Markdown wrapper to remain “a literal command body, not a thin router” (`.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:129-140`).
- Every wrapper calls itself the normative prompt and relegates the presentation asset to fixtures, which reverses the standard ownership boundary; for example, `.opencode/commands/interface/design.md:32-39`.
- All five fail the shared command validator with two blocking errors: missing `PURPOSE` and `INSTRUCTIONS`. They are not recognized as routers because they lack the router detection sections defined in `.opencode/skills/sk-doc/shared/assets/template-rules.json:109-123`.

The existing contract test passes 12/12, but it currently proves the wrong authoring topology.

---

## A. Exact Create-Command Authoring Contract

### A1. Authority and command type

`sk-doc` is only the routing hub; command-specific authoring rules live in the `create-command` packet (`.opencode/skills/sk-doc/SKILL.md:23-35`, `.opencode/skills/sk-doc/SKILL.md:112-114`).

These five commands are namespace, mode-based routers:

- Namespace path: `.opencode/commands/<namespace>/<action>.md` maps to `/<namespace>:<action>` (`.opencode/skills/sk-doc/create-command/SKILL.md:115-132`).
- Names must be lowercase hyphen-case matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` (`.opencode/skills/sk-doc/create-command/SKILL.md:119-122`).
- A mode-pair router owns one presentation asset and paired `_auto.yaml` and `_confirm.yaml` workflows (`.opencode/skills/sk-doc/create-command/SKILL.md:170-179`).
- A router is a thin dispatcher, not a full prompt body (`.opencode/skills/sk-doc/create-command/SKILL.md:327-329`).

The machine contract currently describes the correct topology but stale paths and aliases: it names `.opencode/commands/design/*.md` and `/design:*`, not the live `.opencode/commands/interface/*.md` and `/interface:*` surface (`.opencode/skills/sk-doc/create-command/assets/command-contract.json:47-82`). That source of truth must be updated before conformance can be machine-enforced reliably.

### A2. Frontmatter

Every command requires YAML frontmatter beginning on line 1.

| Field | Contract |
|---|---|
| `description` | Required, single-line, concise, action-oriented, no YAML block scalar; target ≤110 characters. |
| `argument-hint` | Required when input is expected; target ≤140 characters. |
| `allowed-tools` | Required in practice for these commands; list only tools actually used and use fully qualified MCP IDs. |

Sources: `.opencode/skills/sk-doc/create-command/SKILL.md:188-219`, `.opencode/skills/sk-doc/create-command/assets/command-template.md:303-348`.

The current lengths comply:

| Command | Description | Hint |
|---|---:|---:|
| `/interface:design` | 93 | 61 |
| `/interface:foundations` | 100 | 59 |
| `/interface:motion` | 102 | 73 |
| `/interface:audit` | 110 | 72 |
| `/interface:design-reference` | 96 | 69 |

### A3. Argument grammar

The required grammar is:

- `<argument>` means required.
- `[argument]` means optional.
- `--flag` means a boolean flag.
- Optional flags taking values should expose the value, such as `[--scope <scope>]`.
- Parse `:auto` or `:confirm` before dispatching the remaining arguments.
- Every advertised execution mode must have both a real workflow asset and an execution-target mapping.

Sources: `.opencode/skills/sk-doc/create-command/SKILL.md:209-219`, `.opencode/skills/sk-doc/create-command/SKILL.md:291-325`.

Current grammar drift:

| Command | Drift | Corrected shape |
|---|---|---|
| `/interface:design` | Metadata says `--mode` takes a value, but the hint says only `[--mode]` (`command-metadata.json:365-373`). | `<target> [--mode <mode>] [--register <brand\|product>] [:auto\|:confirm]` |
| `/interface:foundations` | Required `<axis> <target>` is clear; register syntax should be normalized. | `<axis> <target> [--register <brand\|product>] [:auto\|:confirm]` |
| `/interface:motion` | Metadata says `--library` takes a value, but the hint says only `[--library]` (`command-metadata.json:782-790`). | `<component-state> [--library <library>] [--register <brand\|product>] [:auto\|:confirm]` |
| `/interface:audit` | Metadata says `--scope` takes a value, but the hint says only `[--scope]` (`command-metadata.json:24-34`). | `<target> [--scope <scope>] [--score] [--register <brand\|product>] [:auto\|:confirm]` |
| `/interface:design-reference` | Required URL and required `--output <dir>` are correctly represented; register syntax should be normalized. | `<live-url> --output <dir> [--register <brand\|product>] [:auto\|:confirm]` |

### A4. Mandatory input gate

Because every command advertises at least one required `<argument>`, every wrapper must place a blocking input gate **immediately after frontmatter and before all other content**.

The gate must:

- Detect empty, undefined, or whitespace-only `$ARGUMENTS`.
- Ignore mode suffixes when deciding whether substantive input exists.
- Stop immediately on missing input.
- Ask a command-specific question.
- Wait for the answer.
- Accept input only from `$ARGUMENTS` or that explicit answer.
- Forbid inference from context, screenshots, conversation history, or open files.

Sources: `.opencode/skills/sk-doc/create-command/SKILL.md:221-242`, `.opencode/skills/sk-doc/create-command/assets/command-template.md:362-409`.

There is a template defect to correct: the router skeleton places its gate placeholder after the H1 and introductory paragraph (`.opencode/skills/sk-doc/create-command/assets/command-router-template.md:48-56`), contradicting both the packet and exhaustive command template. The gate must move directly below frontmatter.

### A5. Router body structure

The fully authored router uses this exact H2 vocabulary and order:

```markdown
## 1. ROUTER CONTRACT
## 2. OWNED ASSETS
## 3. MODE ROUTING
## 4. EXECUTION TARGETS
## 5. PRESENTATION BOUNDARY
## 6. WORKFLOW SUMMARY
```

Sources: `.opencode/skills/sk-doc/create-command/SKILL.md:337-350`, `.opencode/skills/sk-doc/create-command/assets/command-router-template.md:58-108`.

Enforcement levels:

| Level | Sections |
|---|---|
| Blocking router core | `OWNED ASSETS`, `PRESENTATION BOUNDARY` |
| Required authored end state for new routers | All six canonical sections in order |
| Compiled-stub exemption | Only commands carrying `render-command-contract` |

The validator detects a router through `PRESENTATION BOUNDARY` or two router structural sections, then switches from general `PURPOSE`/`INSTRUCTIONS` requirements to the router core (`.opencode/skills/sk-doc/shared/scripts/validate_document.py:557-617`).

### A6. Ownership boundary

The router owns:

- Mandatory input gate.
- Argument and mode parsing.
- Owned-assets table.
- Execution-target selection.
- Presentation boundary.
- Short workflow summary.

The presentation asset owns:

- Startup and consolidated setup prompts.
- Dashboard and checkpoint layouts.
- Success and failure templates.
- Next-step wording.

The workflow YAML owns execution. The router must not contain inline dashboards, setup-question templates, result templates, or next-step presentation text (`.opencode/skills/sk-doc/create-command/SKILL.md:329-352`; `.opencode/skills/sk-doc/create-command/assets/command-presentation-template.md:18-26`).

### A7. Content and validation rules

Command bodies must be executable and behavioral rather than rationale-heavy reference manuals. H2 headings use numbered, uppercase names; H3 steps use full integers; structured statuses are required (`.opencode/skills/sk-doc/create-command/SKILL.md:244-289`).

Before acceptance:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <command>
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <command> --type command
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <command>
```

`validate_document.py` must exit `0` (`.opencode/skills/sk-doc/create-command/SKILL.md:381-406`; `.opencode/skills/sk-doc/shared/references/validation.md:42-67`).

---

## B. Five-Command Conformance Checklist

### B1. Cross-command matrix

| Requirement | Design | Foundations | Motion | Audit | Design Reference |
|---|:---:|:---:|:---:|:---:|:---:|
| Valid namespace and hyphen-case filename | Pass | Pass | Pass | Pass | Pass |
| Single-line description ≤110 characters | Pass | Pass | Pass | Pass, exactly 110 | Pass |
| Argument hint ≤140 characters | Pass | Pass | Pass | Pass | Pass |
| Precise value-taking flag grammar | Fail | Partial | Fail | Fail | Partial |
| Least-privilege tool surface | Pass | Pass | Pass | Pass | Pass |
| Required-input gate immediately after frontmatter | Fail | Fail | Fail | Fail | Fail |
| Canonical six-section router body | Fail | Fail | Fail | Fail | Fail |
| Numbered uppercase H2 headings | Fail | Fail | Fail | Fail | Fail |
| Owned-assets table | Fail | Fail | Fail | Fail | Fail |
| Explicit presentation boundary | Fail | Fail | Fail | Fail | Fail |
| Paired auto/confirm assets exist | Pass | Pass | Pass | Pass | Pass |
| Execution-target table references both workflows | Pass | Pass | Pass | Pass | Pass |
| Thin router rather than normative prompt | Fail | Fail | Fail | Fail | Fail |
| Four typed statuses | Pass | Pass | Pass | Pass | Pass |
| Two or three invocation examples in shipped contract | Fail | Fail | Fail | Fail | Fail |
| Shared command validator exits `0` | Fail | Fail | Fail | Fail | Fail |

### B2. Concrete drift by command

| Command | Missing or drifting behavior |
|---|---|
| `/interface:design` | Required `<target>` has no mandatory gate. `## Register & Lanes` and `## Execution Targets` are unnumbered and noncanonical (`design.md:27-37`). The body is a full normative prompt, while the presentation asset is demoted to fixtures (`design.md:39`). `--mode` omits its required value grammar. |
| `/interface:foundations` | Required `<axis>` and `<target>` have no gate. Both H2s are unnumbered (`foundations.md:27-36`). No `OWNED ASSETS` or `PRESENTATION BOUNDARY`. The wrapper declares itself normative (`foundations.md:38`). |
| `/interface:motion` | Required `<component-state>` has no gate. `--library` omits its value. Both H2s are unnumbered (`motion.md:27-36`). No canonical router structure; wrapper remains normative (`motion.md:38`). |
| `/interface:audit` | Required `<target>` has no gate. `--scope` omits its value. Both H2s are unnumbered (`audit.md:27-36`). Its review-only and never-applies-fixes guarantee is correct (`audit.md:19`) and already tested (`interface-command-contract.test.mjs:143-146`). |
| `/interface:design-reference` | Required URL and output directory have no gate. Both H2s are unnumbered (`design-reference.md:27-36`). Overwrite/authentication confirmation is described (`design-reference.md:13`) but not expressed through the standard router gate and destructive-policy structure. Its measured-only token guarantee is correct (`design-reference.md:23`) and already tested (`interface-command-contract.test.mjs:148-153`). |

### B3. Contract and test-suite drift

1. **Stale machine contract:** the authoritative family contract still points to `/design:*` rather than `/interface:*` (`command-contract.json:47-82`).

2. **Test enforces the inverse topology:** `interface-command-contract.test.mjs` explicitly rejects thin routers and demands literal wrapper behavior (`interface-command-contract.test.mjs:129-140`).

3. **Presentation is duplicated across surfaces:** the test requires every visible output block in the wrapper, presentation, auto workflow, and confirm workflow (`interface-command-contract.test.mjs:53-61`). The standard assigns visible wording to the presentation asset only.

4. **No authoring-structure checks:** the test does not parse frontmatter, mandatory-gate placement, heading order, router sections, or least-privilege tools. It mostly performs substring checks after loading the four package files (`interface-command-contract.test.mjs:28-34`, `interface-command-contract.test.mjs:156-164`).

5. **The design-specific checker is also drifting:** it compares metadata, examples, choreography, preconditions, handoff, register, and lanes (`design-command-surface-check.mjs:1357-1428`), but currently expects custom unnumbered headings such as `## ROUTER CONTRACT`, `## PRECONDITIONS`, and `## INTERFACE TASK LANES`. Those expectations must be nested under the canonical numbered sections rather than create competing H2 vocabulary.

6. **Current verification is misleading:** the contract test passes 12/12, while all five `validate_document.py --type command` runs fail and `design-command-surface-check.mjs --json` reports 26 drift findings.

---

## C. Objective Benchmark Design

### C1. Three-layer harness

| Layer | Purpose | Execution |
|---|---|---|
| Static conformance | Prove authoring structure, assets, grammar, and safety deterministically | CI on every change |
| Deterministic behavioral fixtures | Prove routing, mode selection, statuses, boundaries, and negative cases | Node test runner with mutated fixtures |
| Live outcome benchmark | Measure actual model routing, output usefulness, safety, consistency, latency, and cost | Pinned runtime/model, repeated runs |

This follows the existing benchmark split between deterministic router replay and live execution (`.opencode/skills/sk-design/benchmark/README.md:18-23`). Baselines should be immutable and new runs stored separately (`benchmark/README.md:45-55`).

### C2. Static conformance measurements

Extend `interface-command-contract.test.mjs` to assert:

| Measurement | Pass criterion |
|---|---|
| Frontmatter parsing | Five of five parse successfully |
| Description | Single line and ≤110 characters |
| Argument hint | Exact match to `command-metadata.json.argumentGrammar.render`; ≤140 characters |
| Tool policy | Exact expected tool set; no unqualified MCP IDs |
| Mandatory gate | Present directly after frontmatter for every required argument |
| Router headings | Exact six headings, exact order, full-integer numbering |
| Owned assets | Presentation, auto, and confirm assets listed and present |
| Mode completeness | Every advertised mode maps to an existing workflow |
| Presentation ownership | No startup prompt, dashboard, result template, or next-step template in wrappers |
| Machine-contract parity | Family path, aliases, modes, assets, and destructive policy match `/interface:*` |
| Validation | Name checker and `validate_document.py --type command` both exit `0` for all five |

### C3. Required adversarial unit fixtures

Retain the existing negative tests for copied taste tables, nested public-command dispatch, evidence-free verification, and silent amendment (`interface-command-contract.test.mjs:77-100`).

Add mutated fixtures that must fail for:

- Missing mandatory gate.
- Gate appearing after the H1.
- Gate that permits contextual inference.
- Missing `OWNED ASSETS`.
- Missing `PRESENTATION BOUNDARY`.
- Noncanonical or reordered H2 headings.
- Advertised `:auto` mode with missing auto YAML.
- Execution target pointing to a nonexistent asset.
- Value-taking flag rendered as a boolean.
- Extra broad tool permission.
- Inline startup or result template in the wrapper.
- Presentation asset absent.
- Stale `/design:*` alias or asset path.
- Read-only modes attempting `Write`, `Edit`, or `Bash`.
- Design-reference overwrite without explicit confirmation.

### C4. Live fixture corpus

Use at least eight scenarios per command, producing a 40-scenario corpus:

| Fixture class | Expected behavior |
|---|---|
| Complete `:auto` invocation | Correct mode and auto workflow; no broad setup prompt |
| Complete `:confirm` invocation | Correct mode and exactly one consolidated prompt |
| No substantive arguments | `STATUS=ASK`; no workflow or project tool runs |
| Partial arguments | Ask only for missing required fields |
| Sibling-owned request | `STATUS=DEFER`; recommend but never invoke sibling command |
| Adversarial embedded instructions | Treat reference material as evidence, not instructions |
| Unavailable mandatory evidence | `STATUS=FAIL` or blocked proof state with named cause |
| Mode-specific safety case | Audit remains review-only; design-reference measures rather than invents |

Use `command-metadata.json` as the gold source for argument grammar, preconditions, examples, output fields, and tool policy. Its per-command output contracts are defined at:

- Audit: `command-metadata.json:156-170`
- Foundations: `command-metadata.json:326-340`
- Design: `command-metadata.json:596-610`
- Design reference: `command-metadata.json:743-757`
- Motion: `command-metadata.json:890-904`

### C5. Live metrics and pass criteria

| Dimension | Metric | Pass criterion |
|---|---|---|
| Routing | Correct internal `workflowMode` | 100% for unambiguous fixtures |
| Deferral | Correct sibling/hub recommendation without invocation | 100% |
| Input gating | Missing-input fixtures stop before tools | 100% |
| Mode selection | Correct auto/confirm target | 100% |
| Tool safety | Unauthorized or out-of-scope mutations | Zero |
| Status contract | One valid `STATUS=OK\|ASK\|FAIL\|DEFER` result | 100% |
| Output schema | Required artifact fields present | 100% |
| Evidence honesty | Unsupported `verified`, measured, or validated claims | Zero |
| Presentation | Confirm uses one consolidated prompt; auto avoids it unless blocked | 100% |
| Repeatability | Same route, status, and required fields across three runs | ≥95%; safety cases remain 100% |
| Quality | Locked mode-specific rubric score | ≥90%, with no dimension below 80% |
| Efficiency | Tokens and latency versus frozen baseline | No p95 regression above 10% without documented quality gain |

Subjective visual quality should not be accepted through model self-grading alone. Use deterministic artifact checks first, then blinded pairwise review against the frozen baseline for brief fit, specificity, preservation of constraints, accessibility, and non-generic design quality. Require a candidate win rate of at least 60%, no safety regression, and no loss in deterministic conformance.

### C6. Recommended test-suite change

Replace the current “literal command body, not a thin router” test with:

```text
every wrapper is a canonical mode-pair router
every required argument is router-gated before content
every wrapper lists and resolves its owned assets
presentation text exists only in the presentation asset
every wrapper and machine contract agree on /interface:* paths
```

Keep the existing mode stability, typed-status, mode-specific audit/md-generator, amendment, nested-dispatch, and evidence-integrity checks. Move visible-block assertions from “all four files contain every block” to “the presentation asset owns every visible block; workflows reference it; the router does not duplicate its templates.”