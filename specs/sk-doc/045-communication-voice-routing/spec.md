---
title: "Feature Specification: sk-communication consumes the human-voice mode instead of carrying its own rubric"
description: "sk-communication never defined plain English, so both projection commands carried a hand-distilled six-bullet rubric. Four of those bullets restated the Human Voice Rules. This packet routes the wording standard to its one home and keeps only the constraints the standard does not cover."
trigger_phrases:
  - "sk-communication voice routing"
  - "rewrite command voice rubric"
  - "projection plain english standard"
  - "hvr adoption sk-communication"
  - "voice guidance deduplication"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-communication consumes the human-voice mode instead of carrying its own rubric

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` (no branch created, stream 6 ran on the shared dirty tree) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-communication` rewrites agent output into "plain English" and never says what that means. Its `SKILL.md` uses the phrase seven times without defining it once. The definition ended up in the two commands instead: `/rewrite:response` and `/rewrite:response-by-external-agent` each carried an identical six-bullet rubric, hand-distilled in a prior packet and marked in that packet's own dispatch brief as deliberately "SELF-CONTAINED inside the command so it needs no package at runtime" (`specs/sk-communication/002-sk-communication-triggers/scratch/dispatch-cmd1-rewrite-response.md:19`).

Four of those six bullets restate the Human Voice Rules. "One idea per sentence" is the standard's `clarity` directive verbatim. "Plain vocabulary" is `simple_language` plus `active_voice` plus the two word lists. "Cut filler and hedging" is `conciseness` plus Setup Language Removal plus the hedging deductions. "Calm, low-embellishment tone" is `authenticity` plus Banned Metaphors plus Significance Inflation.

That is two copies of a standard that has one home, in files nothing holds in step with it. The same dispatch brief pointed the author at "the plain-English standard in `.opencode/skills/sk-communication/SKILL.md`", and no such standard exists there, which is why the rubric had to be invented in the first place.

### Purpose

The wording standard has one home, `sk-doc/shared/references/hvr-rules.md`, applied through the `sk-create-with-human-voice` mode. Every rewrite path in `sk-communication` routes to it. Each command keeps only the constraints the standard does not cover, and the two parts of the standard a projection must not apply are stated once with the reason.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The two commands that carried the rubric: `/rewrite:response` and `/rewrite:response-by-external-agent`.
- `sk-communication/SKILL.md`, which becomes the single place naming the standard, the excluded parts and the reason.
- `sk-communication/references/visual-explanation.md`, whose `novice` depth level departs from the standard on purpose and said so nowhere.

### Out of Scope

- `sk-doc` hub-root files (`ROUTER.md`, `SKILL.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-aliases.json`, `graph-metadata.json`, `description.json`): stream 5 owns them this wave. Section 9 records that this packet needs no change in any of them.
- `REPO RULES.md`, `AGENTS.md` and `repo-rules/*`: stream 4 owns them. `repo-rules/communication.md` already carries the two halves of this relationship, a pointer to `hvr-rules.md` in its section 4 and a route to `sk-communication` in its section 10, so nothing there needs adding.
- `sk-create-with-human-voice` itself. Wave A shipped it and its `SKILL.md` section 6 already lists `sk-communication` as a consumer taking "voice guidance by route rather than by a second copy". That row was a forward claim before this packet and is true after it, with no edit to the mode.
- The runtime package under `cli-communication-projection/`. Its `COPY_EDITING_INSTRUCTION` is a one-line compiled constant in the versioned prompt profile, not a voice rubric. See section 8.4.
- The body of `/rewrite:explain-visually`. Its Step 4 and Step 5 headings are cited by name from two leaf documents, and its depth rubric is a knowledge-level selector rather than voice guidance. See section 8.3.
- A voice pass over `sk-communication`'s existing prose. See section 8.5 for the measured residue and why it was not swept.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/rewrite/response.md` | Modify | Step 4 loads the standard, the scope gate and the exclusion list instead of restating a rubric. Keeps the three projection constraints the standard does not cover. Adds a `Standard By Reference` note. |
| `.opencode/commands/rewrite/response-by-external-agent.md` | Modify | Branch A gets the same treatment, minus the assistant-only constraint that does not apply when explicit target text is supplied. Adds a note that the standard reaches Branch A only. |
| `.opencode/skills/sk-communication/SKILL.md` | Modify | New section 3 subsection `The Wording Standard`: names the standard and the mode, lists the two excluded parts with the reason, states the precedence. One NEVER rule against a second copy. Route added to Related Skills and Related Workflows. |
| `.opencode/skills/sk-communication/references/visual-explanation.md` | Modify | One paragraph in section 3 recording the `novice` level's deliberate departure from the standard's analogy limits. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No live file under `sk-communication` or its commands carries a copy of voice guidance the standard owns | A repo-wide grep for the four rubric phrases returns hits only in `repo-rules/`, `REPO RULES.md` and frozen `specs/**` history |
| REQ-002 | Both rewrite commands route to the standard by path | Each command cites `sk-doc/shared/references/hvr-rules.md` and the mode's `scope-and-exemptions.md` |
| REQ-003 | Guidance the standard does not cover is kept, not deleted | The three projection constraints survive in `response.md` and two of them in `response-by-external-agent.md`, and section 8.2 records why each is not the standard's |
| REQ-004 | The parts of the standard a projection must not apply are stated once, with the reason | `SKILL.md` section 3 carries the exclusion table, and neither command restates it |
| REQ-005 | Every command touched stays valid | `validate_document.py <cmd>.md --type command` reports `VALID` with `Total issues: 0` for both edited commands |
| REQ-006 | The skill package stays valid | `package_skill.py .opencode/skills/sk-communication --check --strict` prints `Result: PASS` |
| REQ-007 | Every path and heading the new text cites resolves | Each cited file exists, each cited heading is present in the file it names |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The packet is dogfooded through the mode it adopts | `hvr_scan.py` run over all five surfaces before and after, with no file's hard-blocker count rising |
| REQ-009 | Any change needed in a file this stream does not own is written down rather than applied | Section 9 carries the answer, which is that none is needed |
| REQ-010 | The lane that departs from the standard says so where a reader would break it | `visual-explanation.md` section 3 records the `novice` exception |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Live copies of the HVR-derived rubric go from 2 to 0.
- **SC-002**: Files under `sk-communication` naming the standard go from 0 to 4.
- **SC-003**: Command validator results are unchanged from baseline: both edited commands `VALID` at 0 issues, and `explain-visually.md` keeps its one pre-existing description warning because this stream did not touch its frontmatter.
- **SC-004**: `hvr_scan.py` hard-blocker counts across the five surfaces are unchanged at 1, 9, 11, 52 and 11, and `response.md` drops one soft deduction.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Routing costs a read the copy did not. `/rewrite:response` must now load 21,145 bytes of standard plus 5,197 bytes of scope gate | Medium | Accepted deliberately, and bounded: the commands cite the standard and the gate, never the mode's 12,456-byte `SKILL.md`, because the projection lane needs the rules and the exemptions rather than the apply-or-score workflow |
| Risk | Renaming a command step heading breaks an inbound citation | Medium | Grepped first. The `explain-visually` Step 4 and Step 5 headings are cited by two leaf documents, so that command was left alone. No live file cites the headings in the two commands that were edited |
| Risk | A new reference file would need a `leaf-manifest.json` regeneration | Low | Avoided. The new text went into `SKILL.md`, which the skill's own router already treats as the projection lane's only resource |
| Risk | The `.claude` command mirrors drift from `.opencode` | Low | They are per-file symlinks, verified with `readlink` and `diff` after the edits |
| Risk | Five agents write the same tree concurrently | High | Every edit scoped to the two commands and two `sk-communication` files. Git index untouched, nothing committed |
| Dependency | Wave A commit `60212f5292` | The mode and its scope gate must exist before anything can route to them | Confirmed present before the first edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Section 8.4 names one thing the operator may want to decide later: whether the external and local rewrite branches should carry the standard too, which is a package change rather than a command change.
<!-- /ANCHOR:questions -->

---

## 8. FINDINGS

### 8.1 Where voice guidance lived

Every live location, found by grepping the four rubric phrases plus the tone vocabulary across the whole skill and the whole command tree.

| Location | What it carried | Verdict |
|---|---|---|
| `commands/rewrite/response.md` Step 4 | Six bullets. Four restate the standard, three are projection constraints, with `Assistant-only scope` unique to this command | Rerouted. Four bullets replaced by the standard, three kept |
| `commands/rewrite/response-by-external-agent.md` Step 3 Branch A | The same six bullets minus `Assistant-only scope`, because this command accepts explicit target text | Rerouted. Same treatment |
| `sk-communication/SKILL.md` | The phrase "plain English" seven times and no definition anywhere | Given the definition, by route. Now the single home for the exclusion list |
| `sk-communication/references/visual-explanation.md` section 3 | A depth rubric whose `novice` level directs the writer to lead with a familiar analogy | Kept, and the departure recorded. See 8.3 |
| `cli-communication-projection/src/**` | One line: `Rewrite only the user message in plain English. Output only the rewrite.` | Left alone. See 8.4 |
| `sk-communication/README.md`, `feature-catalog/**`, `manual-testing-playbook/**` | Descriptions of the lanes and pointers to the rubrics, no rubric content | Left alone, nothing to reroute |

### 8.2 What was kept, because the standard does not cover it

| Constraint | Why the standard does not settle it |
|---|---|
| **Assistant-only scope** | Which turn of a conversation is the target is a projection question. The standard is about how prose reads, not about which prose |
| **Preserve exact meaning** | The standard's own precedence says accuracy outranks it, and the mode's `scope-and-exemptions.md` section 3 says so. A projection needs the stronger form: the original author's claims are the accuracy baseline, so a hedge the author meant stays even where the standard prefers certainty. That sentence is in both commands because it is the projection's contract, not the standard's |
| **Exact span fidelity** | The mode's scope gate covers the same ground for a document, listing commands, paths and identifiers as never in scope. The commands keep their own operational list because it is the byte-level fidelity contract the runtime's `protectMarkdown` enforces, and it names spans the gate does not, such as timestamps and metric values |

### 8.3 The one deliberate departure

The standard caps analogies at one per concept and places them after the technical statement. The `novice` depth level in `visual-explanation.md` inverts both, leading with a familiar analogy in place of the precise term. That is correct for a reader with no background, and it is not an oversight, so section 3 of that file now says so and scopes the exception to `novice`. Without the note, a future voice pass would read the departure as a defect and rewrite a working rubric into a broken one.

### 8.4 Why the runtime package was left alone

`COPY_EDITING_INSTRUCTION` is one sentence, defined twice, at `src/config/local-provider.ts:64` and `src/runtime/external-cli-projection.ts:38`. It is the `systemInstruction` field of the versioned prompt profile, and `src/contracts/validate-policy.ts:136` requires only that it be a string. It is not a voice rubric and inlining a 21KB standard into a prompt profile would be a different change with a different risk.

The consequence is worth stating rather than hiding: the standard reaches Branch A of `/rewrite:response-by-external-agent` and not Branches B or C. An external or local rewrite is held to fidelity validation and the exact-original fallback instead. That note is now in the command's section 6.

Two adjacent observations, recorded and not fixed: the constant is duplicated across two modules rather than shared, and no test asserts its value, only that it is non-empty.

### 8.5 Measured residue, not swept

`hvr_scan.py` over the four files this stream touched reports 73 hard blockers, all of them em dashes and semicolons in prose written before this packet. `sk-communication/SKILL.md` alone holds 52. Sweeping them is a content rewrite of files that passed their gates, which is outside the frozen scope of a routing change, so the counts were captured before and after instead and none of them moved. The scanner is the tool for that sweep whenever an owner wants it.

---

## 9. NOTES FOR OTHER OWNERS

### 9.1 Stream 5, `sk-doc` hub root: no delta required

This packet adds an outbound route from `sk-communication` to a `sk-doc` mode. It needs nothing inbound. `sk-communication` is on the advisor route-exclusions denylist on purpose (`system-skill-advisor/mcp-server/config/route-exclusions.json`), so no advisor vocabulary, `ROUTER.md` intent, `RESOURCE_MAP` key or `leaf-aliases.json` entry should be added for it. No `sk-doc` hub-root file was read as needing a change, and none was touched.

### 9.2 Stream 4, `repo-rules/`: no delta required

`repo-rules/communication.md` already closes this loop from the other side. Its section 4 points at `hvr-rules.md` as the full standard for documents, and its section 10 routes a reader who did not follow to `/rewrite:response` and `/rewrite:explain-visually`. The pointer this packet added runs the other way and does not duplicate either.

---
