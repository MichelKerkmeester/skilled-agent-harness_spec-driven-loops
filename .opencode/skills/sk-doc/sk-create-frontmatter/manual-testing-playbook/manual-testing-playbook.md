---
title: "create-frontmatter: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, review and orchestration guidance, execution expectations, and per-feature validation files for the create-frontmatter sk-doc workflow packet."
version: 1.0.0.4
---

# create-frontmatter: Manual Testing Playbook

This document combines the full manual-validation contract for the `create-frontmatter` workflow packet into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `create-frontmatter` packet. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `field-and-class-resolution/`
- `description-budget/`
- `version-derivation/`

This packet ships no `feature-catalog/`. Every scenario therefore records the absence explicitly in its own source table rather than linking to a catalog entry that does not exist.

### Package shape

Every scenario file carries exactly three frontmatter keys: `title`, `description` and a four-part `version`. Those three are what `validate-playbook-package.cjs` requires of a scenario, and all eleven files sit inside the operator-scenario contract.

Do not add routing-gold keys. That validator treats a file carrying a non-empty `expected_workflow_mode` **and** a valid `expected_leaf_resources` block as a routing-gold fixture and filters it out of the operator-scenario contract entirely. Add the pair to every file and no file is left to validate: the package then reports `SKIP` at exit zero instead of `PASS`, which no gate reads as a regression. Routing gold belongs to the hub corpora the playbook manifest declares by root, and this is an operator-scenario package.

The consequence is worth stating plainly, because it looks like a defect and is not. `load-playbook-scenarios.cjs` recognises a scenario file only by an `id`, `expected_intent` or `expected_resources` key in its frontmatter, so it raises `EMPTY_PLAYBOOK` against this package. Every `sk-doc` mode packet behaves the same way. These scenarios are run by hand and persisted through the runner named below, never through the benchmark loader.

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`. Generated report Markdown is renderer-owned and never hand-authored.

---

## 1. OVERVIEW

This playbook covers the operator-visible surface of the `create-frontmatter` packet across three categories: field and class resolution, description budget, and version derivation. Each feature keeps its own ID and links to a dedicated feature file with the full execution contract. The operator validator computes the exact census from the walked tree. This document does not hand-maintain counts.

Coverage note: every scenario is runnable today against the shipped `SKILL.md`, the field reference in `assets/`, and the versioning standard in `references/`. Ten scenarios are read-only. `FMC-001` writes one temporary document under the packet's `references/` directory so a real gate can read the block it authored, and recovery is deleting that file.

### This Mode's Failures Are Silent

One property shapes every grading rule below. **Nothing in this contract fails loudly at the point of failure.**

- A `description` over the shared project budget does not error. The longest entries are dropped from auto-discovery and the skill simply stops being found, which the field reference states in its budget section and the packet README repeats in its troubleshooting table.
- An edit count taken without the per-file numstat gate does not error. It returns a number three to five times too high, and the versioning standard's own worked case is a document edited four times reading as `1.5.0.19`.
- A frontmatter block that is correct for one document class and wrong for the class in hand does not look wrong when the field is read on its own. The packet README says this is where the most time is wasted.
- A path inside a cited command that has since moved does not error either. It sends the operator to a directory that is no longer there, and the run reads as clean.

The consequence for grading: **a scenario that produces confident output with no verification step is a `FAIL`**, regardless of how correct the output looks. Every scenario in this package names a check that would have caught the silent case, and the check is the deliverable rather than the answer.

### Realistic Test Model

1. A realistic user request is given to an orchestrator. Nobody asks for a frontmatter contract. They say a block was rejected, a skill stopped being found, or a version looks wrong.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI or runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound, the verification step ran, and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root, so `.opencode/skills/sk-doc/sk-create-frontmatter/` subpaths and the shared-tier script paths resolve.
2. The document class under test is named before starting. The field set follows from the class, and a scenario run against an unnamed class is not gradeable.
3. The packet's anchor inputs are recorded before starting: the `version` in `SKILL.md` and the highest filename version in `changelog/`. The anchor is the higher of the two, so a single reading of either one cannot be graded.
4. The working tree is clean for the target paths, so any diff is attributable to the run.
5. `node` and `python3` are on the path, and `git` history is present. The version scenarios read commit history. A shallow clone changes the numbers and makes the run a `SKIP` rather than a `FAIL`.
6. The one scenario that writes, `FMC-001`, MUST verify recovery is possible before execution. It creates one temporary document under the packet's `references/` directory and recovery is deleting it. No other scenario writes anything, and no scenario runs the versioning engine in `apply` mode.
7. Operators note that `frontmatter-version.mjs compute` writes `frontmatter-version-manifest.csv` and `frontmatter-version-manifest.json` into the repository root unless `--manifest-out` is passed. Both are run residue and are removed before the scenario is graded.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript, including exit status
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- The document class the run resolved, and the field set it derived from that class
- The verdict reached: authored, fixed, declined, skipped, or halted
- For a declined action: the rule named and the document it was read from
- For an authored block: the file path, the field set, and the position of `version` in the block
- For a version claim: the anchor used, its two inputs, and the gated edit count
- `git status --porcelain` for the target paths
- Scenario verdict with rationale (`PASS`, `FAIL`, or `SKIP`)

A scenario whose evidence is an answer with no check attached cannot be graded, because this contract's failures do not announce themselves. The check is what separates a right answer from a plausible one.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`. These scenarios are agent-driven, so a step is usually what an agent does: read a class row, apply a rule, author or decline to author a block.
- `->` separates sequential steps.
- Repo-relative paths are written as `.opencode/skills/sk-doc/sk-create-frontmatter/...`. The packet root means that directory wherever the packet is installed.
- Commands in this package avoid shell pipes so each step is a single deterministic invocation that survives being copied into a table cell.
- `--skill` on the two shared-tier version tools takes a top-level skill directory name, so the value for this packet is `sk-doc` rather than `sk-create-frontmatter`. A run that passes the packet name discovers zero files and reports success over an empty set.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under the three category folders
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Three rules override intuition in this package specifically:

- **An unverified answer is a `FAIL`**, however correct it reads. Every failure this contract guards is silent, so confidence without a check is exactly the symptom under test.
- **A declined action is a `PASS`** when the scenario expects one. `FMC-003` and `FMV-003` and `FMV-005` all end without a write, and they are graded on whether the refusal names the rule and its source.
- **A shorter answer is not automatically a better one.** `FMB-002` inverts the budget scenario: a description trimmed under budget by deleting its routing tokens is a `FAIL` even though the length check now passes.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, a critical check failed, or the answer arrived with no verification step
- `SKIP`: a specific sandbox or runtime blocker prevents execution, and each `SKIP` must name the blocker

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` (`FMC-001`, `FMB-002`, `FMV-002`, `FMV-004`) forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root directory sections and backed by per-feature files.
4. No unresolved blocking triage item remains.

`VERSION DERIVATION` carries more weight than the other two categories, because it is the only one whose wrong answer is a number that looks entirely reasonable.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Place feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run `FIELD AND CLASS RESOLUTION` as the first wave. Class resolution precedes every other question in this contract, so a failure here explains failures downstream and is the cheapest to diagnose.
6. Run `DESCRIPTION BUDGET` second. It is entirely read-only and its three scenarios share one source section, so a single reader can hold all three.
7. Run `VERSION DERIVATION` last and give it the widest slot. Its scenarios read git history, which is the slowest step in the package.
8. Never run two version scenarios in parallel against the same skill while either one is writing a manifest to the repository root. Both write the same default filenames, so neither result would be attributable.
9. After each wave, save context and evidence, then begin the next wave.
10. Record the utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role, Context, Action, Format contract when the actor is an orchestrator
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. FIELD AND CLASS RESOLUTION (`FMC-001..FMC-003`)

### FMC-001 | Author a reference block

#### Description
Verify that a new document under `references/` is resolved to its document class first, given the five-field block that class carries, and closed with `version` as the last key before the closing delimiter.

#### Scenario Contract
Prompt: `I am adding a new reference document under a skill's references folder. What frontmatter does it need?`

The class is Skill Reference or Asset, so the block is `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, and then `version`. Composing the field set from memory instead of copying the class template is the failure this scenario catches. Writes one temporary document under the packet's `references/`, recoverable by deleting it.

Desired user-visible outcome: a block that passes the packaging gate on the first run, with the class named as the reason each field is there.

#### Test Execution
> **Feature File:** [FMC-001](field-and-class-resolution/author-a-reference-block.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMC-002 | Class row before field row

#### Description
Verify that a rejection naming a field is diagnosed by reading the class row rather than the field row, when the same field is required for one document class and absent from another.

#### Scenario Contract
Prompt: `The validator says my file is missing allowed-tools, but the file right next to it does not have allowed-tools and it passes. Which one is wrong?`

Neither is wrong. `allowed-tools` is a required field for a skill manifest and is not part of the five-field reference and asset block. Reading the field in isolation makes both files look inconsistent, which is exactly the wasted time this scenario measures.

Desired user-visible outcome: the user learns the two files are different document classes, and which row settles it.

#### Test Execution
> **Feature File:** [FMC-002](field-and-class-resolution/class-row-before-field-row.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMC-003 | Out-of-scope class

#### Description
Verify that a request to add `version` to a command or agent file is declined, with the out-of-scope table quoted rather than paraphrased, and the reason given rather than implied.

#### Scenario Contract
Prompt: `Add the 4-part version field to my command file under .opencode/commands so it matches the skills.`

The version standard lists `.opencode/commands/*.md` and `.opencode/agents/*.md` out of scope explicitly, rather than leaving the absence of a rule to be inferred. A run that adds the field anyway has read the format rules without reading the scope section above them.

Desired user-visible outcome: the user learns the field does not belong there, sees the clause that says so, and is told these files are governed separately.

#### Test Execution
> **Feature File:** [FMC-003](field-and-class-resolution/out-of-scope-class.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 8. DESCRIPTION BUDGET (`FMB-001..FMB-003`)

### FMB-001 | Trim an over-budget description

#### Description
Verify that an over-budget description is trimmed by dropping the four documented categories of content, and that the trim is measured against the soft target rather than judged by eye.

#### Scenario Contract
Prompt: `This skill description is way too long and the validator is warning about it. Shorten it.`

The drop list is specific: product enumerations, stack lists, marketing prose, and parenthetical jargon. The field reference carries a worked case that goes from 545 characters to 125 by removing exactly those, and keeps every routing keyword.

Desired user-visible outcome: a description inside the soft target whose remaining words are the ones the advisor matches on.

#### Test Execution
> **Feature File:** [FMB-001](description-budget/trim-an-over-budget-description.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMB-002 | Trim that loses routing tokens

#### Description
Verify the inverted case: a description trimmed under budget by deleting the skill name and the mode suffixes is a `FAIL` even though the length check now passes, because those tokens are the routing signal.

#### Scenario Contract
Prompt: `I got the description down to 60 characters. Good enough?`

Length is a necessary condition and not a sufficient one. The keep list names the skill-name token, the primary verb, the primary domain noun, the mode suffixes and the numeric specifics, and the packet README states plainly that a description trimmed by deleting them is under budget and no longer routes.

Desired user-visible outcome: the user is told the trim is a regression despite passing the length check, and which tokens have to come back.

#### Test Execution
> **Feature File:** [FMB-002](description-budget/trim-that-loses-routing-tokens.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMB-003 | Silent discovery drop

#### Description
Verify that the budget is explained as a shared project-wide allowance whose breach drops the longest entries from auto-discovery with no error at the point of failure, and not as a per-file style preference.

#### Scenario Contract
Prompt: `One of our skills stopped showing up for the model, but it still works when I name it directly. Nothing errored. What happened?`

The described symptom is the documented one: over the project total, the longest descriptions are dropped from the available-skills list, the skills stay invocable explicitly, and nothing warns. A run that answers with a per-file length rule has diagnosed the wrong scope.

Desired user-visible outcome: the user learns the cost is shared, that their own file may be fine, and which check surfaces accumulated drift.

#### Test Execution
> **Feature File:** [FMB-003](description-budget/silent-discovery-drop.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 9. VERSION DERIVATION (`FMV-001..FMV-005`)

### FMV-001 | Changelog-anchored derivation

#### Description
Verify that the anchor is taken as the higher of the manifest frontmatter version and the highest changelog filename version, compared as integer tuples, and that both inputs are read before the answer is given.

#### Scenario Contract
Prompt: `What version should a new reference doc in this skill get?`

Reading only the manifest is the common shortcut, and the standard says the changelog is frequently the more current of the two. Comparing the two as strings rather than as integer tuples is the second failure mode, and it only shows once a segment reaches double digits.

Desired user-visible outcome: the derived version, plus both inputs and which one won.

#### Test Execution
> **Feature File:** [FMV-001](version-derivation/changelog-anchored-derivation.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMV-002 | Numstat gate

#### Description
Verify that the build segment counts only commits whose own added-plus-deleted line count for that file is above zero, and that the ungated count is shown to be wrong rather than asserted to be wrong. Critical.

#### Scenario Contract
Prompt: `How many times has this file actually been edited? I need the build number for its version.`

Two inflators are documented: a historical repository-wide move that left every file carrying its pre-move history as commits that changed zero of its lines, and bulk sweeps that touch a file's siblings. The gate removes both, and the standard puts the naive count at three to five times too high.

Desired user-visible outcome: a gated count, the ungated count beside it, and the gap named.

#### Test Execution
> **Feature File:** [FMV-002](version-derivation/numstat-gate.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMV-003 | Skip on differ

#### Description
Verify that a human-set `version` differing from the computed one is skipped and reported rather than silently overwritten, that the explicit update flag is named as the only override, and that the manifest exception is stated.

#### Scenario Contract
Prompt: `Run the versioning over this skill. I hand-set one of these versions on purpose, so be careful.`

The correct outcome writes nothing to that file and says so. `SKILL.md` is the one intentional exception, because it is the anchor of record and its reconciliation is not gated by the update flag.

Desired user-visible outcome: the conflicting file is named, the run is reported as skipped for it, and the override is described rather than used.

#### Test Execution
> **Feature File:** [FMV-003](version-derivation/skip-on-differ.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMV-004 | Idempotent rerun

#### Description
Verify that re-running the versioning over an already-versioned tree changes no bytes, and that a run which rewrites bytes is a `FAIL` even when every resulting version string is correct. Critical.

#### Scenario Contract
Prompt: `I already ran the versioning yesterday. Is it safe to run it again?`

It is safe only because the standard requires a byte-level no-op and requires line-wise edits. A YAML re-serializer produces the same version strings and a different file, which is why byte equality rather than value equality is the assertion.

Desired user-visible outcome: a second run whose diff is empty, with the empty diff shown rather than claimed.

#### Test Execution
> **Feature File:** [FMV-004](version-derivation/idempotent-rerun.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### FMV-005 | No frontmatter is skipped

#### Description
Verify that an in-scope file with no frontmatter block at all is skipped and reported, never given a synthesized block, and that the corpus gate treats it as skipped rather than failed.

#### Scenario Contract
Prompt: `The gate says one file was skipped. Fix it so everything is covered.`

The instinct is to add a block. A versioning pass never synthesizes one, and the gate counts frontmatter-less docs as skipped by design rather than as a gap to be closed by the pass. Whether a block belongs there at all is a class question, and it is answered somewhere else.

Desired user-visible outcome: the file is named, the skip is explained as intended, and adding a block is presented as a separate decision.

#### Test Execution
> **Feature File:** [FMV-005](version-derivation/no-frontmatter-is-skipped.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `shared/scripts/quick_validate.py` | The packet `SKILL.md` only: field presence, `version` format, and the description soft target | Direct on the length half of `FMB-001` and `FMB-002`. It reads no other file, and it cannot tell a well-routed description from a badly trimmed one |
| `shared/scripts/check-frontmatter-versions.sh` | Presence and format of `version` across every in-scope doc | Direct on `FMV-005`. It is a presence gate and never checks whether a version is the right one |
| `sk-create-skill/scripts/package_skill.py` | Packet structure plus the resource-doc field set across the `references/` and `assets/` subtrees | Direct on `FMC-001` and `FMC-002`, and the only shipped gate that reads a reference block inside a mode packet. It checks that `importance_tier` and `contextType` are present and deliberately does not check their values |
| `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | This playbook package's own operator-scenario contract | None directly. It validates the playbook, not the contract the playbook tests |

Note: `create-frontmatter` owns rules and not enforcement, so no automated suite decides the questions this playbook asks. The two shared-tier scripts above check presence and format. Whether a field belongs to the class in hand, whether a trim kept its routing tokens, and whether an edit count was gated are all judgments, and this playbook is the operator-facing manual equivalent.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

This package has no feature catalog. The index below is the playbook catalog.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| FMC-001 | Author a reference block | FIELD AND CLASS RESOLUTION | [FMC-001](field-and-class-resolution/author-a-reference-block.md) |
| FMC-002 | Class row before field row | FIELD AND CLASS RESOLUTION | [FMC-002](field-and-class-resolution/class-row-before-field-row.md) |
| FMC-003 | Out-of-scope class | FIELD AND CLASS RESOLUTION | [FMC-003](field-and-class-resolution/out-of-scope-class.md) |
| FMB-001 | Trim an over-budget description | DESCRIPTION BUDGET | [FMB-001](description-budget/trim-an-over-budget-description.md) |
| FMB-002 | Trim that loses routing tokens | DESCRIPTION BUDGET | [FMB-002](description-budget/trim-that-loses-routing-tokens.md) |
| FMB-003 | Silent discovery drop | DESCRIPTION BUDGET | [FMB-003](description-budget/silent-discovery-drop.md) |
| FMV-001 | Changelog-anchored derivation | VERSION DERIVATION | [FMV-001](version-derivation/changelog-anchored-derivation.md) |
| FMV-002 | Numstat gate | VERSION DERIVATION | [FMV-002](version-derivation/numstat-gate.md) |
| FMV-003 | Skip on differ | VERSION DERIVATION | [FMV-003](version-derivation/skip-on-differ.md) |
| FMV-004 | Idempotent rerun | VERSION DERIVATION | [FMV-004](version-derivation/idempotent-rerun.md) |
| FMV-005 | No frontmatter is skipped | VERSION DERIVATION | [FMV-005](version-derivation/no-frontmatter-is-skipped.md) |
