---
title: "Implementation Plan: Phase 9: skills"
description: "Adds a skills list to BOT.md, loads those SKILL.md bodies into the prompt under a per-skill and a total byte cap, and adds bots skill propose, which writes a draft and a proposal.json into the identity's proposals folder and raises one review item whose answer is pinned to the revision the proposal read."
trigger_phrases:
  - "skills list plan"
  - "skill proposal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: skills

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22, loaded through the runtime's own `tsx`; one CommonJS CLI and one CommonJS checker |
| **Framework** | None; the bots runtime is a flat module set with a hand-written CLI front door |
| **Storage** | JSON files and one Markdown draft under the user-level state root, plus the derived SQLite status index |
| **Testing** | Vitest, with fixtures copied into a temp repository and an isolated environment |

### Overview
Two new modules carry the work: `skills.ts` holds the name grammar, the two caps and the loader and is pure apart from the reads, and `skill-proposal.ts` holds the proposals folder, the review item and the pin. `definition.ts` gains the `skills` key as shape only, `dispatch.ts` appends the loaded blocks after the standing body, and `runner.ts` calls the loader before dispatch so a bad list refuses before a child starts. `answer.ts` gains one seam that records a review decision instead of enqueuing a resume. Proof is `bot-check.cjs` over a clean fixture and three defect fixtures, `bots skill propose` over a real run record, and the vitest suites for the two new modules and the six modified ones.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The measured behavior block in `spec.md` holds four commands and their verbatim output

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <fixture>` exits 0 for a skills fixture and 1 for each of the three defect fixtures
- [ ] `node .skilled/bin/bots.cjs skill propose <run-id>` exits 0 over a real run record, and `bots inbox` lists one review item under `skill-proposals`
- [ ] Docs updated (spec/plan/tasks, the template, the author reference, the run mode, the runtime README)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered module set with a pure core. The parser stays shape-only, a loader owns the reads and the caps, a proposal module owns the files and the pin, and the CLI and the checker hold no rules.

### Key Components
- **`skills.ts`**: `SKILL_NAME_PATTERN` reuses the bot-id grammar, because a skill folder is named the same way [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:88]; `parseSkillList` validates the list shape and refuses `skills-name-invalid` and `skills-duplicate`; `loadSkills` reads `<skilledTree>/.skilled/skills/<name>/SKILL.md` and refuses `skill-unknown`, `skill-unreadable`, `skill-too-large` and `skills-over-budget`; `renderSkillsPrompt` returns one `<skill_content name="<name>">` block per skill, the wrapper OpenGhost uses [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:6-7]. The caps are `SKILL_MAX_BYTES = 40_960` and `SKILLS_TOTAL_MAX_BYTES = 65_536`, both measured against today's tree in `spec.md`.
- **`skill-proposal.ts`**: `proposalFolder` and `proposalFile` name `<stateRoot>/<identity>/proposals/<run-id>/`; `writeProposal` reads one run record [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:377], builds the draft, checks it for secret literals through `findSecretLiteral` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:287], writes both files and returns the review item; `proposalReviewItem` builds that item with the reserved `skill-proposals` bot id; `settleProposalAnswer` is the one seam `answer.ts` calls, and it returns "not a proposal", a `proposal-stale` refusal, or "recorded".
- **`definition.ts`**: gains `skills` in `FRONTMATTER_KEYS` and `skills: string[]` on `BotDefinition`, filled by `parseSkillList` and defaulting to `[]` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:60-73].
- **`dispatch.ts`**: `buildBotPrompt` takes an optional `skills` list and appends each rendered block after the body, so the standing instructions stay first [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315-332].
- **`runner.ts`**: calls `loadSkills` with `context.skilledTree` before the prompt is built, and turns each refusal into a refused run record, so no child starts with a partial list [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1043-1049].
- **`answer.ts`**: calls `settleProposalAnswer` after the secret check and before the resume enqueue; a recorded review returns without a request, and a stale pin returns `proposal-stale` with nothing written [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:88-89].
- **`label.ts`**: `RESERVED_BOT_IDS` gains `skill-proposals`, so no definition may take that id and `holdForBot` never matches a real bot [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/label.ts:28].
- **`bots.cjs`**: gains `skill` with `ids: 2`, parsed the way `schedule` already is, so `skill propose <run-id>` reads as one action and one id [SOURCE: .skilled/bin/bots.cjs:63-77].

### Data Flow
1. An author writes `skills: [sk-code, sk-doc]` in BOT.md. `parseDefinition` calls `parseSkillList`, which checks the shape only, and the definition carries the two names.
2. The checker resolves each name against its own skilled tree and fails `skills-unknown`, `skills-too-large` or `skills-over-budget` before anything installs.
3. A run reaches the prompt build. The runner calls `loadSkills`, which reads each body once, measures it, and either returns the blocks or refuses. A refusal becomes a refused run record with the reason named, and no child starts.
4. `buildBotPrompt` joins the standing body and the blocks, and the child sees each skill inside its own `<skill_content>` element.
5. `bots skill propose <run-id> --name <skill-name>` reads the run record, builds a draft from the record's identity, exit and run folder, checks it for secret literals, writes the draft and `proposal.json`, and writes one review item under the reserved `skill-proposals` id.
6. `bots answer <run-id> accept` reaches `settleProposalAnswer`, which recomputes the target's digest. A match records the answer and returns with no request; a difference refuses `proposal-stale` and leaves the item open.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This change touches a schema boundary, persistence, path handling and shared policy, so the inventory is filled even though the packet is not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/definition.ts` | Produces the `BotDefinition` every reader consumes | update: accept `skills`, carry `skills: string[]` | `rg -n "skills" runtime/lib/definition.ts` names the key, the field and the two refusals |
| `runtime/lib/dispatch.ts` | Builds the prompt from the body | update: append the loaded blocks after the body | `rg -c "buildBotPrompt" runtime/lib/dispatch.ts` still prints 1, and `tests/dispatch.vitest.ts` covers both shapes |
| `runtime/lib/runner.ts` | Builds the prompt at the dispatch point | update: call `loadSkills` and refuse before dispatch | `rg -n "loadSkills" runtime/lib/runner.ts` prints the import and the call |
| `runtime/lib/answer.ts` | Records an answer and enqueues one resume | update: call the proposal seam and skip the enqueue for a review | `rg -n "settleProposalAnswer" runtime/lib/answer.ts` prints the import and the call |
| `runtime/lib/state-root.ts` | Names the per-identity folders | update: add `proposals` to `IdentityStatePaths` and create it | `rg -c "proposals" runtime/lib/state-root.ts` prints at least 2 |
| `runtime/lib/label.ts` | Holds the reserved bot ids | update: add `skill-proposals` | `rg -n "RESERVED_BOT_IDS" runtime/lib/label.ts` prints a line holding `skill-proposals` |
| `runtime/lib/installer.ts` | Refuses a reserved id when it builds a label | unchanged: it reads `RESERVED_BOT_IDS`, so the new id is refused with no edit | `rg -c "RESERVED_BOT_IDS" runtime/lib/installer.ts` still prints 2 |
| `runtime/lib/needs-you.ts` | Validates and writes items | unchanged: the review item satisfies the existing schema, including `id === runId` | `rg -n "item-id-not-run-id" runtime/lib/needs-you.ts` still prints one line |
| `runtime/lib/status-index.ts` | Consumes records and items into rows | unchanged: a review item is an item like any other | `rg -n "proposal" runtime/lib/status-index.ts` prints nothing |
| `runtime/lib/request-queue.ts` | Consumes `IdentityStatePaths` | unchanged: it reads the request folders only | `rg -c "IdentityStatePaths" runtime/lib/request-queue.ts` still prints 2 |
| `scripts/bot-check.cjs` | Audits a checkout before anything installs | update: three new hard invariants | `node scripts/bot-check.cjs <defect fixture>` exits 1 and names the invariant |
| `.skilled/bin/bots.cjs` | Parses one verb and one id | update: the `skill` verb and its `--name` option | `node .skilled/bin/bots.cjs skill propose <run-id>` exits 0 or 4, never 2 |

Required inventories:
- Same-class producers: `rg -c 'skills:' .skilled/skills/system-skilled-bots/runtime/lib/*.ts .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints nothing and exits 1, so no module and no template produces the field today. The three `skills` hits in `isolation.ts:200`, `installer.ts:115` and `state-root.ts:36` are path segments, not the field.
- Consumers of changed symbols: `rg -c 'buildBotPrompt' .skilled/skills/system-skilled-bots/runtime/lib/*.ts .skilled/skills/system-skilled-bots/runtime/tests/*.ts` prints `dispatch.ts:1`, `runner.ts:2` and `tests/dispatch.vitest.ts:5`. `rg -c 'RESERVED_BOT_IDS' .skilled/skills/system-skilled-bots/runtime/lib/*.ts .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` prints `label.ts:3`, `installer.ts:2` and `bot-check.cjs:2`. `rg -c 'IdentityStatePaths' .skilled/skills/system-skilled-bots/runtime/lib/*.ts` prints `state-root.ts:4` and `request-queue.ts:2`.
- Matrix axes: the list (absent, empty, one name, several names) x resolution (resolves, unknown, unreadable) x size (under both caps, exactly at a cap, one byte over either cap) x proposal state (no proposal, open review, answered review, target changed since the proposal). The required rows are the four list shapes against a resolving name, then each of the three resolution outcomes, then each cap boundary, then the four proposal states against one run record.
- Algorithm invariant: the prompt a child receives holds exactly the bodies the caps admitted, in the order the list names them, each inside its own block, and no body is ever truncated. Adversarial cases: a name carrying a path separator or `..`, a name that resolves outside the skills folder, a body of exactly 40,960 bytes and one of 40,961, a list summing to exactly 65,536 and one summing to 65,537, a duplicate name, a target that changed between propose and answer, and a target that did not exist when the proposal was written but does at the answer.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads `runtime/lib/definition.ts`, `dispatch.ts:315-332`, `runner.ts:1043-1049`, `answer.ts:88-89`, `label.ts:28` and `state-root.ts:117-131`, and records the baseline suite result and the four call sites. Implementation adds `skills.ts` and `skill-proposal.ts`, wires the `skills` key, the prompt blocks, the loader call, the proposal seam, the `proposals` folder, the reserved id, the `skill` verb and the three checker invariants. Verification runs `bot-check.cjs` over a clean skills fixture and each defect fixture, `bots skill propose` and `bots answer` over a real run record, and the runtime's vitest suite.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseSkillList`, `loadSkills`, `renderSkillsPrompt`, both caps, `writeProposal`, `settleProposalAnswer` | Vitest, `runtime/tests/skills.vitest.ts` and `skill-proposal.vitest.ts` |
| Integration | The loader call and its refusals through `runBot`; the recorded review and the stale pin through `answerItem`; the `skill` verb through the real CLI | Vitest with a stub executor, `runtime/tests/runner.vitest.ts`, `answer.vitest.ts` and `cli-run.vitest.ts` |
| Contract | The checker over one clean skills fixture and one defect fixture per new invariant | `node scripts/bot-check.cjs <fixture>`, `runtime/tests/bot-check.vitest.ts` |
| Manual | `bots skill propose` then `bots inbox` then `bots answer` over a fixture checkout | The CLI, read-only apart from the state root |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `definition.ts` and `dispatch.ts` | Internal | Green | The list has nowhere to live and the prompt has no place to put a block, so REQ-001 and REQ-002 are blocked |
| `run-record.ts` `readRunRecord` | Internal | Green | A proposal has no source, so REQ-004 is blocked |
| `dispatch.ts` `findSecretLiteral` and `collectKnownSecrets` | Internal | Green | The draft cannot be checked, so REQ-009 is blocked |
| `needs-you.ts` and `answer.ts` | Internal | Green | The review has no surface and no decision record, so REQ-005 and REQ-006 are blocked |
| `label.ts` `RESERVED_BOT_IDS` | Internal | Green | The review item would hold a real bot, so REQ-005 degrades to a stalled bot |
| `better-sqlite3` | External | Green | Not needed: this phase reads no index |
| Phase 001-activity-and-actor | Internal | Yellow | The review item still works; only the `by:` field naming who answered is missing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A bot whose `skills` list resolves stops dispatching, or an answer to a proposal review refuses when the target has not changed.
- **Procedure**: Revert the phase's commits. A BOT.md that carries a `skills` key then fails to parse as `unknown-key`, so the rollback also reverts those files, or the operator deletes the key. A `proposals` folder and a review item left under the identity state root are inert once the modules are gone, because nothing reads them, and they are deleted by hand.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
