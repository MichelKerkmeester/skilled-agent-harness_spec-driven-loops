---
title: "Feature Specification: Phase 9: skills"
description: "A BOT.md cannot name a skill, so a bot's whole competence is the prose in its body, and nothing turns a finished run into a proposed skill. This phase adds a skills list that loads SKILL.md bodies into the prompt under a byte cap, and bots skill propose, which writes a draft and a proposal.json into a proposals folder for review through a needs-you item with a staged-write pin."
trigger_phrases:
  - "skills list byte cap"
  - "bots skill propose"
  - "skill proposal review"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: skills

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-vault |
| **Successor** | 010-conversations |
| **Handoff Criteria** | A BOT.md carrying a `skills` list parses, passes `bot-check.cjs` and dispatches with those bodies in the prompt under the caps; `bots skill propose <run-id>` writes a draft and a `proposal.json` and raises one review item; answering that item records the decision, enqueues no resume, and refuses `proposal-stale` once the target changed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The authored `skills` list, the loader that puts those bodies in the prompt under a byte cap, and the propose-and-review path with its staged-write pin. Recording a skill from a demonstration stays out, as the research says. The terminal pane that would list proposals is phase 003's, and it reads only what `bots ... --json` prints.

**Dependencies**:
- Phase 001-activity-and-actor, whose needs-you item reviews the proposal and whose `by:` field names who answered it.
- The existing definition parser, prompt builder, needs-you item, run record, reserved-id list and checker, all unchanged in contract.
- The sixteen skill folders under `.skilled/skills/`, discovered from frontmatter with no registration step [SOURCE: .skilled/skills/README.txt:33].

**Deliverables**:
- `runtime/lib/skills.ts` and `runtime/lib/skill-proposal.ts`.
- The `skills` key in `runtime/lib/definition.ts`, and the loaded bodies in `runtime/lib/dispatch.ts`.
- The loader call and its two refusals in `runtime/lib/runner.ts`.
- The proposal seam in `runtime/lib/answer.ts`, the `proposals` folder in `runtime/lib/state-root.ts`, and the reserved id in `runtime/lib/label.ts`.
- The `skill` verb in `.skilled/bin/bots.cjs` and three invariants in `scripts/bot-check.cjs`.
- The template, the author reference and the run mode updated to name the key and the verb.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A BOT.md declares a trigger, a runtime, a budget, a posture and a body, and the parser's key set holds twelve keys with no `skills` among them [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92-107]. So a bot's whole competence is the prose in its body: the sixteen skills under `.skilled/skills/` are reachable only by a person typing a slash command, and a headless run has nobody to type one. The prompt builder takes the body, the bound spec folder and an optional checkout root, and nothing else [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315-332]. The third origin OpenBot names, a skill proposed from use, has no path here either: a run record holds what ran and what it exited with, and nothing reads it back into a skill [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:59-67].

### Purpose
One authored `skills` list that loads those bodies into the prompt under a byte cap, and one verb that turns a finished run into a reviewable proposal with a pin that refuses a stale one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Three command groups, run from the repository root on 2026-11-25, measure the gap this phase closes.

```text
$ rg -n 'skills' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts .skilled/skills/system-skilled-bots/assets/bot-template.txt
$ echo $?
1

$ node .skilled/bin/bots.cjs skill propose run-1
bots: unknown verb: skill
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
$ echo $?
2

$ wc -c .skilled/skills/*/SKILL.md | grep -v total | sort -rn | head -1
   32362 .skilled/skills/sk-git/SKILL.md
$ ls -d .skilled/skills/*/ | wc -l
      16
```

The first block is the missing field: neither the parser nor the shipped template mentions a skill, so `rg` exits 1 with no output. The second is the missing verb: `skill` is not in `VERB_SPECS`, so the CLI exits 2 with `unknown verb` [SOURCE: .skilled/bin/bots.cjs:63-77]. The third measures the prompt budget the caps are set against: the largest of the sixteen `SKILL.md` files is 32,362 bytes, and the sixteen together are 219,862 bytes, so a list naming all of them cannot fit any sane prompt and a cap has to refuse rather than truncate.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an optional `skills: [name, ...]` list to BOT.md, each name a skill folder under the skilled tree, and load each named `SKILL.md` body into the prompt after the standing body [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:67].
- Bound the load with two byte caps, one per skill and one across the list, and refuse by name rather than truncate, because a half-loaded `SKILL.md` is a half instruction.
- Add `bots skill propose <run-id> [--name <skill-name>]`, which reads one run record and writes a draft `SKILL.md` plus a `proposal.json` naming the target path and the revision it read, into the identity's proposals folder [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:67].
- Review that proposal through one needs-you item, and pin the review to the revision the proposal read, so an answer is refused once the target has changed [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:20].
- Add three checker invariants so a bad `skills` list fails before anything installs, and name the key and the verb in the template, the author reference and the run mode.

### Out of Scope
- Recording a skill from a demonstration - the research records it as having no counterpart and no design, and open question 6 leaves it open [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:189].
- `bots skill accept`, or any copy of a draft into `.skilled/skills/` - a skill is a repository file changed through git, and the runtime writes no file inside a checkout; the operator moves the draft themselves.
- Proposing from conversations - there is no conversation store until phase 010, so a proposal reads a run record and nothing else.
- Loading a skill's reference files - only `SKILL.md` is loaded; a child reads a reference on demand through the path the body names.
- Per-skill enable, disable, versioning or dependency resolution - the list is a list of names, and a name either resolves or refuses.
- A terminal pane listing proposals - phase 003 draws over `bots ... --json`, and this phase adds no pane and no `--json` shape for proposals.
- A per-run record of which skills were loaded - the prompt is already recorded on a parked item, and a second record would be a second truth.
- OpenBot's sharing scopes and admin approval tiers - there is no sign-in to govern, and one team reads one state root.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/skills.ts` | Create | The name grammar, the two caps, `parseSkillList`, `loadSkills`, `renderSkillsPrompt` and the refusal names. |
| `.skilled/skills/system-skilled-bots/runtime/lib/skill-proposal.ts` | Create | The proposals folder, `writeProposal`, `readProposal`, `proposalReviewItem`, `settleProposalAnswer` and the pin. |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Accept the `skills` key and carry `skills: string[]` on `BotDefinition`. |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modify | `buildBotPrompt` takes the loaded skills and appends their blocks after the body. |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Load the skills before dispatch and refuse `skill-unknown`, `skill-too-large` or `skills-over-budget`. |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Call the proposal seam before the resume enqueue, and report a recorded review instead of a request. |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Name and create the identity's `proposals` folder. |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | Modify | Add `skill-proposals` to `RESERVED_BOT_IDS`. |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Name the two new modules and their group. |
| `.skilled/bin/bots.cjs` | Modify | Add the `skill` verb with its `propose` action and `--name` option. |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify | Add the `skills-unknown`, `skills-too-large` and `skills-over-budget` invariants. |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | Add the commented `skills` key. |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | Name `skills` in the field list. |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modify | Name `bots skill propose` and the proposal review beside `bots answer`. |
| `.skilled/skills/system-skilled-bots/runtime/tests/skills.vitest.ts` | Create | The name grammar, both caps, the loader and the prompt rendering. |
| `.skilled/skills/system-skilled-bots/runtime/tests/skill-proposal.vitest.ts` | Create | The proposal files, the review item and the pin. |
| `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts` | Modify | The `skills` key and its two shape refusals. |
| `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts` | Modify | The prompt with and without loaded skills. |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | The loader call and its three refusals. |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | The recorded review, the absent resume and the stale pin. |
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Modify | The three new hard invariants and their fixtures. |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Modify | The `skill propose` verb, its output and its exit codes. |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/` | Create | One clean skills fixture and one defect fixture per new hard invariant. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A BOT.md may carry `skills`, a list of skill names, and `BotDefinition` carries it as `skills: string[]` defaulting to `[]`. The parse stays shape-only, so a name that does not resolve is a runner and checker refusal, never a parse refusal [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:60-73]. |
| REQ-002 | The runner loads each named skill's body from `<skilledTree>/.skilled/skills/<name>/SKILL.md` and appends it to the prompt after the standing body, inside one `<skill_content name="<name>">` block per skill, following the wrapper OpenGhost uses [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:6-7]. A name that does not resolve refuses the run before dispatch as `skill-unknown`. |
| REQ-003 | One body over 40,960 bytes refuses `skill-too-large`, and a list whose bodies sum over 65,536 bytes refuses `skills-over-budget` naming the skill that crossed the line. Neither cap truncates, because a truncated `SKILL.md` is a half instruction. |
| REQ-004 | `bots skill propose <run-id> [--name <skill-name>]` reads one run record and writes `<stateRoot>/<identity>/proposals/<run-id>/SKILL.md` and `proposal.json`, the latter naming the target path, the revision read, the run id, the bot id and the creation instant [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:377]. |
| REQ-005 | The same verb writes one needs-you item whose id is the run id, whose `botId` is the reserved `skill-proposals`, and whose evidence names the draft, the `proposal.json` and the run folder, so an open review never holds a real bot's runs [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287-298]. |
| REQ-006 | Answering a proposal review records the decision and enqueues no resume request, and the pin is checked first: a target whose current digest differs from `revisionRead`, or which now exists where the proposal read none, refuses `proposal-stale` and writes nothing [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:20]. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The checker gains three hard invariants, `skills-unknown`, `skills-too-large` and `skills-over-budget`, each failing closed with its own defect fixture, so a bad list fails before anything installs [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:39-58]. |
| REQ-008 | A `skills` list naming the same skill twice is refused `skills-duplicate`, and a name outside the skill-name grammar is refused `skills-name-invalid`, both at parse time because both are shape. |
| REQ-009 | The draft is checked for secret literals before it is written, and a match refuses `proposal-secret` naming the key and never the value, through the detector the answer path already uses [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:88-89]. |
| REQ-010 | The shipped template, the author reference and the run mode each name the `skills` key or the `bots skill propose` verb, so an author and a reader find it where they already look. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A BOT.md with `skills: [sk-code]` passes `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <checkout>` with exit 0, and a dispatched run's prompt holds that skill's body inside its `<skill_content>` block.
- **SC-002**: A list naming a skill that does not exist refuses the run as `skill-unknown` before dispatch, and the checker exits 1 naming `skills-unknown`.
- **SC-003**: A list whose bodies sum over 65,536 bytes refuses `skills-over-budget` and the prompt is never built, so no truncated body reaches a child.
- **SC-004**: `bots skill propose <run-id>` writes both proposal files and raises exactly one review item, and `bots inbox` lists it under `skill-proposals` without holding that bot's next run.
- **SC-005**: Answering the review records the decision with no resume request queued, and answering it after the target changed refuses `proposal-stale` and leaves the item open.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The skilled tree path the loader reads | No skill resolves, so every `skills` list refuses | The runner already carries `context.skilledTree` and the checker resolves its own tree; the loader takes the path as an argument and restates no default |
| Dependency | `findSecretLiteral` and `collectKnownSecrets` | A draft could carry a secret into the state root | Both exist and are unchanged; the proposal path calls them before the write, as the answer path does |
| Risk | The prompt budget | A large list crowds out the standing body and the child's own work | Two caps refuse by name, and the measured largest body is 32,362 bytes against a 40,960-byte per-skill cap |
| Risk | A review item that holds a bot | A proposal nobody reviews stalls that bot for the expiry window | The item carries the reserved `skill-proposals` id, which no definition may take, so `holdForBot` never matches a real bot |
| Risk | A proposal written against a target that then changes | An operator accepts a draft that no longer applies | `proposal.json` records the digest it read, and the answer refuses `proposal-stale` on any difference |
| Risk | A draft that quotes a run's stdout | A secret literal lands in the state root | The draft is checked before the write and the refusal names the key, never the value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Loading a `skills` list reads one `SKILL.md` per name and nothing else; it opens no reference folder, no run folder and no SQLite index.
- **NFR-P02**: The caps are measured on the bytes read, so a list that would exceed them is refused before the prompt string is built, and no body is read twice.

### Security
- **NFR-S01**: The draft and the `proposal.json` are written owner-only under the identity state root, like every other file there, and never inside a checkout.
- **NFR-S02**: The draft is checked for secret literals before it is written, and the refusal names the key or prefix it matched, never the value.
- **NFR-S03**: A skill body reaches the prompt as text inside its own block, so a body that names a decision marker cannot be read as the child's own decision.

### Reliability
- **NFR-R01**: A skill file that cannot be read refuses `skill-unreadable` and never dispatches a run with a partial list.
- **NFR-R02**: A damaged `proposal.json` reads as "not a proposal review", so the answer path falls back to its existing behaviour rather than refusing every answer.
- **NFR-R03**: A proposal whose review item already exists refuses `review-already-exists` and overwrites nothing, so an open question is never erased.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a BOT.md with no `skills` key, or with `skills: []`, behaves exactly as it does today, so every existing bot keeps working and its prompt is byte-identical.
- Maximum input: a list whose bodies sum to exactly 65,536 bytes is accepted and one byte more refuses `skills-over-budget`; a single body of exactly 40,960 bytes is accepted and one byte more refuses `skill-too-large`.
- Failure path: a name that does not resolve refuses `skill-unknown`, an unreadable file refuses `skill-unreadable`, and each refuses before dispatch so no child starts with a partial list; a proposal answered after its target changed refuses `proposal-stale` and leaves the item open for a fresh proposal.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Two new modules, seven modified runtime files, one CLI verb, one checker, three docs and eight test files |
| Risk | 12/25 | The prompt budget and a new state folder; no auth, no API, no data migration, and no checkout write |
| Research | 10/20 | The research settles the list, the caps' existence and the review path; the cap values, the proposals location and the reserved id are decided here |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Where do proposals live: the state root, or a `proposals/` folder beside `.skilled/skills/`?** The vibe-1 lineage puts it beside the skills folder [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/lineages/vibe-1/research.md:105], and the merged research says only "a proposals folder" [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:67]. Decided: the identity's `proposals` folder under the state root, because state a run must not write lives outside every checkout [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131], unreviewed content must not land in the checkout before review, and a worktree run's tree is thrown away. Reversal condition: if a later packet adds `bots skill accept`, the accepted draft moves into the checkout through that verb and the proposals folder stays where it is.
- **Does an open proposal review hold the bot?** An open item for a bot refuses every later run of that bot [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:832-846], and a proposal is a repository change awaiting review, not a decision the bot needs to continue. Decided: the review item carries the reserved `skill-proposals` id, which `RESERVED_BOT_IDS` already refuses to a definition [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/label.ts:28], so no bot is held. Reversal condition: if a second review kind needs the same treatment, replace the reserved id with a `kind` field on the item rather than reserving a second id.
- **What are the two byte caps?** The research names a cap and no number [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:67]. Decided: 40,960 bytes per skill and 65,536 bytes across the list, measured against today's tree, where the largest body is 32,362 bytes and the sixteen total 219,862 bytes, so every current skill loads alone and no list of all sixteen does. Reversal condition: if a real bot needs two large skills at once, raise the total cap and record the prompt size that forced it.
- **Is the `<skill_content>` wrapper a lifted file?** The parent spec requires one `THIRD_PARTY_NOTICES.md` entry per lifted file [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:82]. Decided: no entry, because a tag name and a two-line convention are not a copied file and no line of `skills.js` is reproduced. Reversal condition: if any line of that file is copied, the notice entry is required before the copy lands.
<!-- /ANCHOR:questions -->

---
