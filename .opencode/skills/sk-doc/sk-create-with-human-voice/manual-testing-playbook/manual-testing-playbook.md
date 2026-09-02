---
title: "create-with-human-voice: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, review and orchestration guidance, execution expectations and per-feature validation files for the create-with-human-voice sk-doc workflow packet."
version: 1.1.0.2
---

# create-with-human-voice: Manual Testing Playbook

This document combines the manual-validation contract for the `create-with-human-voice` workflow packet into a single reference. The root playbook is the operator directory, the review protocol and the orchestration guide: it explains how a realistic user-driven test is run, how evidence is captured, how a result is graded and where each per-feature validation file lives. The per-feature files carry the execution contract for each scenario, including the user request, the agent-facing prompt, the command sequence, the source anchors and the validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `create-with-human-voice` packet. The root document is the directory, the review surface and the orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `tell-detection/`
- `scope-gate/`
- `scoring-and-rescan/`

This packet ships no `feature-catalog/`. Every scenario therefore records the absence explicitly in its own source table rather than linking to a catalog entry that does not exist.

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`; generated report Markdown is renderer-owned and never hand-authored.

The sentence above is the package contract wording, carried verbatim from `sk-create-manual-testing-playbook`. Its semicolon is a hard blocker under the standard this packet owns. It stays, because the string is pinned by the contract rather than chosen here, which is the recorded-exemption case `references/scope-and-exemptions.md` section 3 calls text something else pins.

### Package shape

Every per-feature file carries the plain operator-scenario frontmatter: `title`, `description`, `stage` and the four-part `version`. None of them carry a Lane C benchmark field (`id`, `expected_intent`, `expected_resources`, `expected_workflow_mode` or `expected_leaf_resources`). This package is not a skill-benchmark corpus, and any one of those fields would risk the routing-gold classification the package validator uses to exclude a file from the operator-scenario contract it owns.

---

## 1. OVERVIEW

This playbook covers the operator-visible surface of the `create-with-human-voice` packet across three categories: tell detection, the scope gate and scoring with its re-scan. Each feature keeps its ID and links to a dedicated feature file carrying the full execution contract. The operator validator computes the census from the walked tree, so this document does not hand-maintain a count.

Coverage runs in both directions on purpose. Tell detection covers text the mode must flag. The scope gate covers text the mode must leave alone, which is the half a term-list scanner will never volunteer.

Every scenario is runnable today against the shipped standard, the shipped scanner and the two shipped fixtures. None of them edits the packet. The recovery path for the whole package is `git checkout` of any file a run touched by mistake.

### A Clean Mechanical Scan Is Not A Pass

One property shapes every grading rule below. **The scanner checks a term list and nothing else.** It prints the eleven categories it cannot check on every single run: three-item enumeration, triple headers, setup language, synonym cycling, false ranges, fragmented headers, copula avoidance, significance inflation, generic conclusions, sentence rhythm and personality.

So the inverted rule for this package is that **a run reporting a pass from the scanner's exit code alone is a `FAIL`**, whatever the number was. A reader has to answer the judgment pass. A run that skipped it measured a subset and reported it as the whole document.

Exit 2 is a failure and never a pass. It means the scanner could not read the standard and is refusing to report a clean scan, so a run that reads exit 2 as "no findings" has inverted the fail-closed control the packet depends on.

### Realistic Test Model

1. A realistic user request is given to an orchestrator. Nobody asks for a term-list scan. They say a draft reads like a machine wrote it.
2. The orchestrator decides whether to work locally, delegate to sub-agents or invoke another CLI or runtime.
3. The operator captures the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root, so every `.opencode/skills/sk-doc/sk-create-with-human-voice/` subpath in this package resolves.
2. `python3` is on PATH. The scanner is one file with no third-party dependency.
3. The two shipped fixtures are present and unmodified: `scripts/tests/fixtures/voice-dirty.md` and `scripts/tests/fixtures/voice-clean.md`. A scenario asserting a fixture number cannot be graded against an edited fixture.
4. The working tree is clean for the packet paths, so any diff is attributable to the run.
5. The control pair in `references/scoring-and-verification.md` section 6 has been run once before the first wave starts. It proves the parser still reads the standard. A scanner exiting 2 invalidates every scenario that follows it.
6. No scenario here is destructive. A run that produces a diff under the packet has already failed the scenario it was executing.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript, with the exit status of every scanner invocation
- User request used
- Agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- The scanner block verbatim: hard blockers, mechanical deductions, mechanical ceiling and the not-scored list
- The judgment findings a reader added, or an explicit statement that a reader found none
- Every exempt span named, with the class it falls under and the reason
- Both scan numbers on any run that edited text
- `git status --porcelain <target>` for the target path
- Scenario verdict with rationale (`PASS`, `FAIL` or `SKIP`)

A transcript without the not-scored list cannot be graded. That list is the evidence the judgment pass was owed, so a report that drops it has removed the one line proving the run knew what it had not checked.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`. These scenarios are agent-driven, so a step is usually what an agent does: read a reference, apply a gate, report or refuse to report a number.
- `->` separates sequential steps.
- Repo-relative paths are written as `.opencode/skills/sk-doc/sk-create-with-human-voice/...`. The packet root means that directory wherever the packet is installed.
- Commands in this package avoid shell pipes so each step is one deterministic invocation that survives being copied into a table cell.

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

- **A clean mechanical scan is not a `PASS`.** A run reporting a pass from the scanner's exit code alone is a `FAIL`, whatever the number was. The eleven categories the scanner prints as unchecked are the reader's, and a run that never answered them has not scored the document.
- **Exit 2 is a `FAIL`.** The scanner could not read the standard and refused to report a clean scan. Reading that as a pass inverts the control.
- **An edit during a `score` run is a `FAIL`.** The score operation reports and does not touch bytes, so `git status --porcelain` on the target is the deciding evidence rather than a formality.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution, and each `SKIP` must name the blocker

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` (`HVT-001`, `HVS-001`, `HVR-002`) forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files.
4. No unresolved blocking triage item remains.

`SCOPE GATE` carries more weight than the other two categories. A missed tell costs a reader some polish. A voice edit inside a quotation, an error string or a byte-pinned fixture changes what a document claims and the damage is silent.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Record feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate the remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run the control pair from `references/scoring-and-verification.md` section 6 before wave one. Every scenario in this package quotes a scanner number, so a parser that has stopped reading the standard invalidates the whole run rather than one scenario.
6. Run `SCOPE GATE` as the first wave. It is entirely read-only, it is the cheapest wave and it decides whether the other two waves are measuring the right spans.
7. Never run two scenarios against the same operator-supplied target at once. Both assert on `git status --porcelain` for that path, so neither result would be attributable.
8. After each wave, save context and evidence, then begin the next wave.
9. Record the utilization table, per-feature file references and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role, Context, Action, Format contract when the actor is an orchestrator
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. TELL DETECTION (`HVT-001..HVT-003`)

### HVT-001 | Hard blocker terms on the dirty fixture

#### Description
Verify the mechanical pass reports every hard blocker class the shipped dirty fixture carries, reports the matching arithmetic and exits non-zero. Critical.

#### Scenario Contract
Prompt: `Run the human voice scan over the packet's dirty fixture and tell me what it finds.`

The fixture is byte-pinned as a control. It reports 6 hard blockers, -33 mechanical deductions and a ceiling of 67/100 and the scanner exits 1. The same violations appear a second time inside a fenced block and an inline code span, and neither copy may appear in the output.

Desired user-visible outcome: the user sees the findings grouped by class, the arithmetic and the list of categories the run did not check.

#### Test Execution
> **Feature File:** [HVT-001](tell-detection/hard-blocker-terms.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### HVT-002 | A finding is a candidate, not a verdict

#### Description
Verify a mechanical finding is sense-checked before it is accepted, so the literal noun sense of a blocked term survives the pass while the metaphorical verb sense does not.

#### Scenario Contract
Prompt: `The scanner flagged two occurrences of the same word in this file. Fix the writing.`

The scanner reports both senses because it matches spelling. A run that edits both, or dismisses both, has treated the output as a verdict. The right result keeps one, changes the other and records the kept one as an exception.

Desired user-visible outcome: the user gets one edit, one recorded exemption and the reason each was decided that way.

#### Test Execution
> **Feature File:** [HVT-002](tell-detection/word-sense-is-a-candidate.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### HVT-003 | The judgment pass the scanner cannot run

#### Description
Verify the eleven unchecked categories are answered by a reader, so a clean mechanical result is never reported as a clean document.

#### Scenario Contract
Prompt: `Score this draft against the human voice rules and tell me whether it is ready to publish.`

The scanner prints its unchecked list on every run, including a run with no findings at all. A reply quoting the ceiling and stopping there has answered a fifth of the standard.

Desired user-visible outcome: the user gets the mechanical number and a reader's findings on structure, sentence habits, content habits and voice, kept apart so each is traceable.

#### Test Execution
> **Feature File:** [HVT-003](tell-detection/judgment-pass-not-covered-by-the-scanner.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 8. SCOPE GATE (`HVS-001..HVS-004`)

### HVS-001 | Every exempt span is named

#### Description
Verify the scope gate runs before the first finding and that each declined span is named in the report with its class and reason, rather than silently skipped. Critical.

#### Scenario Contract
Prompt: `Do a voice pass on this file. Some of it is quoted material, so be careful.`

The gate loads on every path, `apply` and `score` alike. A report with no exemption rows on a file that carries quoted material has skipped the gate or has run it and thrown the record away, and the two are indistinguishable to the next reader.

Desired user-visible outcome: the user can see which spans were out of bounds and why, so the same spans are not re-litigated on the next run.

#### Test Execution
> **Feature File:** [HVS-001](scope-gate/exempt-spans-are-named.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### HVS-002 | Code and quotations stay untouched

#### Description
Verify a voice pass edits no code block, quotation, error string, command, generated file, released changelog entry or byte-pinned fixture and that the masking behind the scanner's default is understood rather than assumed.

#### Scenario Contract
Prompt: `Clean up the writing in this document. It has a few code samples and an error message in it.`

The scanner masks fenced blocks and inline code spans by default, and `--include-code` opts back in. A diff touching any protected span is a `FAIL` however much better the prose reads.

Desired user-visible outcome: the prose improves and the carried text is byte-identical afterwards.

#### Test Execution
> **Feature File:** [HVS-002](scope-gate/code-and-quotations-untouched.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### HVS-003 | A document about the standard

#### Description
Verify a document about the standard, the standard itself included, is identified as self-referential before a score is quoted, because it scores catastrophically against itself while being completely correct.

#### Scenario Contract
Prompt: `Score the human voice rules reference against the human voice rules.`

The target lists every blocked term, so the mechanical pass reports dozens of hard blockers. Quoting that number without saying what the target is turns a correct document into a failing one.

Desired user-visible outcome: the user is told the target is self-referential, what the raw number is and why it does not mean the document is bad.

#### Test Execution
> **Feature File:** [HVS-003](scope-gate/document-about-the-standard.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### HVS-004 | Accuracy outranks the standard

#### Description
Verify a banned term whose removal would change what the sentence claims is kept, and that the exception is recorded with its reason rather than resolved by rewriting the claim.

#### Scenario Contract
Prompt: `This sentence uses a banned word. Rewrite it so it passes.`

The sentence states a fact that the banned term carries. Any replacement that makes the sentence say something different is the failure this scenario exists to catch, and it is the failure a fluent rewrite hides best.

Desired user-visible outcome: the sentence still says what it said, and the report explains why the term stayed.

#### Test Execution
> **Feature File:** [HVS-004](scope-gate/accuracy-outranks-the-standard.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 9. SCORING AND RESCAN (`HVR-001..HVR-002`)

### HVR-001 | A score reports and does not edit

#### Description
Verify the `score` operation leaves the target byte-identical, using the clean fixture, which reports no mechanical findings, a ceiling of 100/100 and exit 0.

#### Scenario Contract
Prompt: `How does this file score against the human voice rules? Do not change anything.`

An empty `git status --porcelain` for the target is the whole assertion. A run that scored correctly and also touched the file has failed, because the two operations this mode routes are separated by exactly that property.

Desired user-visible outcome: the user gets a number and an unchanged file.

#### Test Execution
> **Feature File:** [HVR-001](scoring-and-rescan/score-does-not-edit.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### HVR-002 | The re-scan after a rewrite

#### Description
Verify the scanner is re-run after any rewrite and that both numbers are reported, because rewriting to remove tells introduces new ones. Critical.

#### Scenario Contract
Prompt: `This draft reads like AI wrote it. Fix it.`

A sentence that loses one banned word reaches for another, and a three-item list rewritten under pressure becomes a four-item list whose fourth item says nothing. A single after-score proves nothing about what the pass did.

Desired user-visible outcome: the user sees the before number, the after number and what changed between them.

#### Test Execution
> **Feature File:** [HVR-002](scoring-and-rescan/rescan-after-rewrite.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/hvr_scan.py` against the two shipped fixtures | The mechanical subset: punctuation bans, blocker words, phrase blockers, soft deductions and the masking of code spans | Direct. `HVT-001` and `HVR-001` execute exactly this pair as the operator-facing control |
| `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | This playbook package's own operator-scenario contract | None directly. It validates the playbook, not the workflow the playbook tests |

The packet ships no automated test for the judgment pass, and none is possible: the eleven categories the scanner prints as unchecked are unchecked because a pattern cannot settle them. This playbook is the operator-facing equivalent for that half of the standard and does not claim to be more.
