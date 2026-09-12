---
title: "Synthesis: Goal unification research, D1-D8 decision-ready backlog"
description: "Third-lens synthesis of the 15-iteration goal-unification research program: one verdict per decision D1 through D8, the contradictions the repo settles, proposed AGENTS.md wording for D8, and the implementation facts the build phases must own."
trigger_phrases:
  - "goal unification synthesis"
  - "goal unification D1 D8 verdicts"
  - "goal posture AGENTS.md row"
  - "goal durable slice budget"
  - "packet goal single source backlog"
importance_tier: important
contextType: research
---

# Synthesis: Goal unification research, D1-D8

> Read this first in phase 002. It is a third lens over two lineages: run 1
> (`lineages/deepseek/research.md`, iterations 1-10, `deepseek-v4.1-flash`) and run 2
> (`lineages/glm/research.md`, iterations 11-15, `glm-5.3-flash`). Where the two disagree this
> document names a winner and shows the repo line that settles it. It does not average them.
> Every claim about current behavior carries a `[SOURCE: path:line]` that was opened and
> confirmed while writing this file. D8 was never researched by either lineage and is grounded
> here from scratch.

---

## 1. VERDICT PER DECISION

Ranked by implementation risk, highest first. Risk here means the chance that a naive build
produces something that passes its own tests and is still wrong.

### Rank 1. D5, per-runtime surfaces. Highest risk.

**Chosen.** Ship the packet-backed goal path on pi and opencode at full capability, on cursor in
a degraded injection-only form, and treat devin as a build rather than a wiring change, because
its adapter does not exist and the repo currently records its absence as intentional.

**Rejected.** Ship all six uniformly, rejected because Claude Code and Codex expose no adapter
surface in this repository at all: there is no `/goal` command and no goal hook under
`.claude/hooks/`, while a host-private store exists outside it (44 files matching
`~/.claude/projects/*/memory/goal_*.md`, plus `~/.codex/goals_1.sqlite` and
`~/.codex/prompts/goal_opencode.md`, all confirmed present). Reject also "cursor at parity",
because the cursor adapter is `sessionStart` only and its command surface cannot prove session
binding [SOURCE: .opencode/hooks/goal/README.md:67].

**Enforcement site.** `resolveGoalScope` in `.opencode/hooks/goal/lib/goal-core.cjs:174`, which
throws `MISSING_SESSION_ID` on a blank identity [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:177],
and the per-runtime adapter table [SOURCE: .opencode/hooks/goal/README.md:66].

**What run 2 corrected.** Run 1 cited the delivery matrix at `README.md:96-103`. Those lines are
the KEY FILES section heading and its table rule [SOURCE: .opencode/hooks/goal/README.md:96],
[SOURCE: .opencode/hooks/goal/README.md:99]. The matrix is at `:66-71`, verified. Run 1 also
cited "does not import this core" at `:31`, which is a different sentence about core ownership
[SOURCE: .opencode/hooks/goal/README.md:31]. The real sentence is at `:25`
[SOURCE: .opencode/hooks/goal/README.md:25]. Run 2 is right on both.

**What this lens corrects in run 2.** Run 2 completed the Devin hook enumeration to four events.
The registration file carries eight: `SessionStart`, `UserPromptSubmit`, `PreToolUse`,
`PostToolUse`, `PermissionRequest`, `Stop`, `PostCompaction`, `SessionEnd` (confirmed by parsing
`.devin/hooks.v1.json`). The four run 2 named are a subset, so the surface available to a devin
goal adapter is wider than either lineage recorded.

**Confidence.** Confirmed for every in-repo surface. Unknown for host injection caps on every
runtime except opencode.

### Rank 2. D6, budget and truncation. High risk, and the numbers moved.

**Chosen.** Two tiers. Warn at 3000 characters of measured durable slice, error at 4000, both
enforced in the TypeScript validator that already owns `goal.md` specifics, with a second
consumer-side length check at set time.

**Rejected.** A 4000-only error, rejected by measurement below. Enforce nothing, rejected because
a 15,028-byte `goal.md` already shipped with no rule reporting it
[SOURCE: specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md:61]. Consumer-side
only, kept as a second guard rather than the primary, because it cannot fire until a paste happens.

**Enforcement site.** `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`,
which already treats `goal.md` as a document whose continuity block is mandatory, by its absence
from the optional set [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:213],
with the reason stated in the comment above it
[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:210],
and whose anchors are required whenever present
[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:229].

**What run 2 corrected in run 1, and what this lens corrects in run 2.** Run 1 computed an
injected prompt ceiling of roughly 2900 characters by subtracting the build-time reserve of 1900
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:67] from the injection cap of 4800
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:62]. That mixes two different paths and run 2 is
right to reject it. The real ceiling is dynamic
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:417] and the full block returns early when it fits
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:419]. Run 2 estimated the overhead at 890 to 925
characters and the resulting budget at 3875 to 3910, marked INFERRED.

This lens computed it directly from the block template
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:405] with the real constants. The overhead is 337
characters with an empty objective, 917 with a full 576-character objective preview and default
verifier fields, and 1198 in the worst case where the verifier reason fills its 280-character
allowance [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:63]. The prompt budget therefore spans
3602 to 4463, not a narrow band near 3900. Run 2's central estimate is right for the typical case
and its width is wrong. Run 2 also measured the directive line at 132 characters. It is 109.

The consequence survives both corrections: with a full objective preview the budget is 3883, so a
legal 4000-character prompt is cut by 117 characters, and the cut lands on the tail where the
criteria live [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:37].

**The measurement that changes the recommendation.** Run 2 measured this packet's own parent
durable slice at 3732 characters on the widest counting and called it 4000-legal with 268
characters of headroom. Measuring the same file now, with the same definition (everything after
the frontmatter's closing fence at line 36, up to the log anchor), gives **3994 characters against
a 4000 error cap**. Six characters of headroom, at `completion_pct: 5`
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:28]. The file
grew by two lines between run 2 and now, and those two lines were the D8 decision row
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:58] and its
criterion [SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:99].
Adding one decision and one criterion consumed 262 of 268 remaining characters. A 4000-only rule
would give this packet's own author no warning, and the next amendment breaches the cap. Run 2's
recommendation change from one tier to two is not merely defensible, it is now urgent.

**Live truncation, confirmed on this file.** The objective plus criteria measure 1301 characters
(160 plus 1141). The injected objective preview is clamped to
`min(4000, max(60, min(600, floor(4800 * 0.12)))) = 576`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:368],
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:386]. Forty-four percent of the operator copy
reaches the model. Run 2 measured 1182 and 49 percent on the earlier file. Both lineages are
directionally right and the current numbers are worse.

**Confidence.** Confirmed, by independent arithmetic over the read constants.

### Rank 3. D4, resend and reminder mechanics. High risk, because it is new tooling in a space a prior packet deliberately left to agent behavior.

**Chosen.** An edge trigger on a hash of the normalized durable slice, deduplicated per session,
with the dedup key scoped by packet path so returning to a packet resends.

**Rejected.** Turn cadence, rejected because it fires with nothing changed. File `mtime`, rejected
because log appends and git operations must not trigger
[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:79].
The continuity fingerprint in frontmatter, rejected because `goal.md` ships a zero placeholder
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:22]. Manual only, rejected
because that is today and the rule is prose with no implementing code.

**Enforcement site.** The render path
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:391], where the stored prompt is already resolved
with a fallback, is the ready seam for a slice projection. The plugin's brief cache must key on
the hash [SOURCE: .opencode/plugins/opencode-goal.js:43] or a stale entry suppresses the resend.

**What run 2 corrected.** Run 1 anchored the trigger rule at playbook line 57. That line promises
a reporting rule without carrying a number
[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:57].
The trigger is at `:73` [SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:73]
and the 3000 figure sits inside a worked example at `:112`
[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:112].
Run 2 is right, and its reading of the 029 exclusion is the important one: 029 excluded verifying
what an operator pasted [SOURCE: specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:71]
and declared the rule agent behavior rather than tooling
[SOURCE: specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:72]. It
did not exclude detecting that the slice changed. Mechanizing detection is inside the boundary.
Mechanizing paste verification is outside it.

**Confidence.** Confirmed for the rule text and the exclusions. Inferred for the dedup schema,
which one round-trip through `setGoal` would confirm
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:897].

### Rank 4. D3, the frontmatter-strip contract. Medium-high risk, concentrated in one seam.

**Chosen.** One extractor that splits frontmatter with the regex the validator already uses, then
slices the body by anchors, resolving the phase conditional rather than stripping it blindly.
Two slices, not one: a durable slice for chat, injection and CLI show, and a narrower objective
slice of pointer plus criteria for the runtime objective.

**Rejected.** YAML parsing as the boundary, rejected because no goal surface carries a parser and
the block is nested. Slicing to the second fence, rejected because it ships template scaffolding
into the 576-character preview. A materialized slice file, rejected because two files drift.

**Enforcement site.** A runtime-neutral CommonJS module under `.opencode/hooks/goal/lib/` that the
CommonJS core and the ESM plugin both consume, pinned by a golden test against the validator's own
splitter [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17].

**What run 2 corrected.** Run 1 anchored the directive and log markers at template lines 48 and
99. Those lines exist and say something else
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:48],
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:99]. The markers are at
`:41` [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:41] and `:101`
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:101]. Run 2 also surfaced
the real contradiction in the contract: the trigger says anything above the log, and the mandated
payload says the full text of the file
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:58]. Taken literally that
ships the frontmatter and the volatile log the same document excludes
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:104]. This packet's own
parent already words it correctly
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:62]. The template
and the playbook are what must change.

**Confidence.** Confirmed for the contradiction and the anchors. Unknown whether the ESM plugin
can import a CommonJS module in its runtime without a build step, which one import attempt settles.

### Rank 5. D1, session-to-packet binding. Medium risk, strong precedent.

**Chosen.** An explicit per-session pointer, written only by a deliberate bind, never inferred.

**Rejected.** Conversational only, rejected because it is lost at compaction and a hook never sees
it. Nearest-packet inference from cwd, rejected because the repo's own detector names the phased
case ambiguous [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:103]
and because goal selection must never guess
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:72]. Command-mediated derivation alone,
rejected as insufficient because the chat resend is not command-mediated.

**Enforcement site.** A bind resolver beside `resolveGoalScope`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:174], with the composite scope key unchanged
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:191] and the record path derived from it
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:203].

**What run 2 corrected.** Run 1's ADR anchors at `:36`, `:41`, `:43`, `:47` and `:51` land in the
anchor comment region of the decision record, not on its rules
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:41]. The real lines are `:65`, `:72`,
`:73`, `:83` and `:87`, all verified
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:83],
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:87]. Run 2 also refuted run 1's claim
that the CLI prints an `unbound` state. The precedent is the requirement
[SOURCE: specs/hooks/009-goal-isolation/spec.md:152].

**What this lens corrects in run 2.** Run 2 concluded that `unbound` adoption is documentation
continuity rather than code. The vocabulary is already asserted in the shipped test suite: a new pi
session is expected to start unbound
[SOURCE: .opencode/hooks/goal/pi/goal-pi.test.mjs:227]. The precedent is stronger than run 2
credited, and the implementation inherits an existing behavioral assertion.

**Confidence.** Confirmed.

### Rank 6. D2, legacy store fate. Low risk, and the migration is nearly empty.

**Chosen.** Demote the store to a per-session index plus liveness and telemetry. The directive is
read from `goal.md`, never duplicated into the record.

**Rejected.** Retire outright, rejected because locks, retention and telemetry have no home in a
git-tracked document [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:524],
[SOURCE: .opencode/plugins/opencode-goal.js:37]. Keep the objective duplicated, rejected because
two authors of one truth means the record silently wins at injection. Liveness into frontmatter,
rejected because per-session state in a shared committed file is exactly the removed failure
[SOURCE: specs/hooks/009-goal-isolation/spec.md:48].

**Enforcement site.** Read at `readGoalRecordForScope`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:622], write at `setGoal`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:897], record shape at `buildNewRecord`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:869].

**What run 2 corrected.** Nothing was overturned. Run 2 added that legacy adoption is conditional
on the store being the workspace's own
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:195], and that the ADR's environment variable
spelling [SOURCE: specs/hooks/009-goal-isolation/decision-record.md:71] does not match the code's
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:42].

**What this lens adds, and it is decisive for cost.** The store directory currently contains one
file, a README, and no records at all (directory listing of
`.opencode/skills/.state/goal/`, which resolves from
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:44]). The migration note both lineages wrote is
correct and, on this checkout, describes zero live records. Neither lineage checked. Phase 002 can
treat D2 as a schema decision rather than a data migration, subject to the caveat that other
checkouts may hold records.

**Confidence.** Confirmed on this checkout. Inferred for other machines.

### Rank 7. D7, isolation reconciliation and authority. Low build risk, high review value.

**Chosen.** Share content, keep selection, liveness, telemetry and locks per session. Auto-update
may touch only the log and continuity bookkeeping. Durable-slice changes stay command-mediated and
operator-ratified.

**Rejected.** Per-session copies of the directive, rejected as re-created drift. Auto-rewriting
durable sections, rejected because it makes the operator copy meaningless and fires a resend per
edit. Operator-only durable writes, rejected because it contradicts the auto-update requirement.

**Enforcement site.** The per-command tool whitelist ladder is the precedent already in the tree:
plan, implement and complete may set
[SOURCE: .opencode/commands/speckit/plan.md:4], resume may only read
[SOURCE: .opencode/commands/speckit/resume.md:4].

**What run 2 corrected.** Run 1 cited the failure enumeration at `009/spec.md:77`, which is the
mechanism [SOURCE: specs/hooks/009-goal-isolation/spec.md:77]. The enumeration is at `:81`
[SOURCE: specs/hooks/009-goal-isolation/spec.md:81]. Run 2 also found the design pre-derived: the
critical dependency requires the management path to acquire the same identity as the injection
hook [SOURCE: specs/hooks/009-goal-isolation/spec.md:54], and the recorded mitigation is one shared
resolver plus a set-then-inject canary test
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:129]. That is the acceptance test,
already written down.

**Confidence.** Confirmed.

### Rank 8. D8, where the always-on goal posture lives. Lowest risk, and the repo answers it cleanly.

**Chosen.** One row in `AGENTS.md` section 4, under POST-EXECUTION GATES, shaped like the MEMORY
SAVE RULE row, plus one Quick Reference entry. No repo rule.

**Rejected.** A repo rule under `repo-rules/`, rejected by the repo's own decision test. The rule
router loads only when a trigger matches the action you are about to take
[SOURCE: REPO RULES.md:12], and when nothing fires `AGENTS.md` alone governs
[SOURCE: REPO RULES.md:18]. The authoring mode states the refusal directly: content that must bind
when no trigger fires belongs in the always-loaded document
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:41], and never write a rule that must
bind when no trigger fires, because that is an `AGENTS.md` row
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:200]. The goal posture is always-on
by definition, so it fails decision test 1. Rejected also: skill docs only, because the posture
must bind agents that never load `system-spec-kit`, and the mechanics that do live there already.

**Enforcement site.** `AGENTS.md` section 4, immediately after the MEMORY SAVE RULE block
[SOURCE: AGENTS.md:303], and the Quick Reference table beside the save and resume rows
[SOURCE: AGENTS.md:475].

**Escalation note.** The authoring mode requires escalation when a request needs an `AGENTS.md`
change beyond a pointer [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:209]. Adding
a posture row is such a change, so it is an operator decision, which D8 already records as made.

**Confidence.** Confirmed.

---

## 2. CONTRADICTIONS AND HOW THE REPO SETTLES THEM

**D5 says devin ships. Run 1 rated devin defer. The repo records devin's absence as deliberate.**
The delivery matrix carries an explicit by-design row for devin
[SOURCE: .opencode/hooks/goal/README.md:71], and a prior packet's requirement states that docs and
tracked files must agree that devin goal adapters were decommissioned
[SOURCE: specs/hooks/009-goal-isolation/spec.md:150]. The frozen decision and the repo do not
contradict each other about facts, only about future work. Building devin requires four things,
none of which exist: an adapter module beside the pi and cursor ones, a command surface, a change
to the by-design row and to REQ-010's evidence, and an injection cap for the devin host. The hook
surface is the one thing already present and it is wider than either lineage reported, with eight
registered events in `.devin/hooks.v1.json`. Phase 002 should record devin as a build item with a
named adapter file, not as a wiring item, and should amend the by-design row in the same change so
REQ-010 stays true.

**D6's 4000 is a live cap, not a headroom figure.** Run 2 treated 4000 as comfortable. The current
measurement is 3994. This is not a disagreement between lineages, it is a fact that moved after
run 2 finished. Phase 002 must either raise the cap, split the packet, or ship the warning tier
before the next amendment, because the next single decision row breaches it.

**Criterion 5 names resume as a writer. The whitelist makes resume read-only.** The criterion says
plan, implement, complete, resume and save update the parent
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:99], while resume
carries only the status tool [SOURCE: .opencode/commands/speckit/resume.md:4]. The packet's own
precedence rule requires this to be named rather than silently resolved
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:77]. Phase 002 must choose:
widen resume's whitelist, or amend the criterion to say resume resends without mutating. The second
is cheaper and preserves the read-only posture a prior packet chose deliberately.

**Criterion 1 asks three documents to agree, and today none of them do.** The template carries no
number. The playbook's only figure is 3000 and it sits inside a worked example
[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:112].
`spec-kit-docs.json` names the goal template
[SOURCE: .opencode/skills/system-spec-kit/templates/spec-kit-docs.json:20] and contains no
occurrence of 4000 at all. The units differ too: the restored rule says characters
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:96] while the
precedent speaks bytes
[SOURCE: specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md:61]. On this file
they are identical, 7204 either way, so the choice is free and must still be made explicitly.

**The playbook points at a rule that does not exist.** It routes the durable budget to
`validation-rules.md` [SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:137].
That file exists at `.opencode/skills/system-spec-kit/references/validation/validation-rules.md`
and contains no occurrence of goal, 3000 or 4000. Run 1 flagged this and run 2 left it unknown.
It is confirmed dangling.

**The charter's own contract path is wrong.** It cites `.opencode/hooks/hooks/injection-contract.md`.
That file does not exist. The real path is `.opencode/hooks/injection-contract.md`. Run 1 caught
this correctly.

---

## 3. PROPOSED AGENTS.md WORDING FOR D8

Insert as a new block in section 4, POST-EXECUTION GATES, directly after the MEMORY SAVE RULE
block that ends at [SOURCE: AGENTS.md:309], matching that row's shape: a bold heading, a trigger
line, then bullets.

> #### GOAL POSTURE RULE [ALWAYS ON]
> Trigger: a session bound to a spec packet, on every turn.
> - The bound packet's `goal.md` is the single source of goal state. Read it, never a
>   remembered summary of it, and never send its frontmatter to chat, to an objective, or to an
>   injection path.
> - When anything in the durable slice changes, a decision, a binding row or a criterion,
>   resend the stripped slice in chat unprompted, and keep reminding while the goal is unset.
> - Work never stops because a goal is unset or a reminder went unanswered. Only the operator
>   stops it.
> - After a goal is set, acknowledge it in one line and continue immediately. Do not restate it,
>   and do not ask whether to proceed.

Quick Reference entry, for the table that already carries the save and resume rows
[SOURCE: AGENTS.md:475]:

| **Goal state** | the bound packet's `goal.md` | durable slice is the source → resend stripped on change → never stop for it |

**Is a repo rule also warranted? No.** The posture must bind on every turn of a bound session, and
a repo rule only loads when its trigger matches the action about to be taken
[SOURCE: REPO RULES.md:12]. Content that holds when no trigger fires is the authoring mode's most
common refusal [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:41] and its first
never [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:200]. D8 already anticipates
the one case that would change this: if phase 002 finds content that is genuinely trigger-scoped,
for example what to do when a durable edit collides with another session's edit, that fragment,
and only that fragment, could earn a rule. Nothing found in either lineage is trigger-scoped. The
mechanics, the strip function, the budget, the dedup key, belong to `system-spec-kit`, which is
where a rule file is forbidden to put them
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:201].

---

## 4. IMPLEMENTATION FACTS THE BUILD PHASES MUST OWN

1. **The durable slice of this packet's parent is 3994 characters against a 4000 cap.** Independent
   measurement, definition matching run 2's widest counting, on
   [SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:36] through
   the log anchor. Ship the warning tier before the next amendment.
2. **The injected prompt budget is dynamic and spans 3602 to 4463**, computed from the block
   template [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:405] and the budget line
   [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:417]. Both lineages' figures were wrong. Use the
   worst case, 3602, when sizing anything that must survive injection.
3. **The objective preview clamps to 576 characters** and this packet's objective plus criteria
   measure 1301, so 44 percent reaches the model
   [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:386]. The projection must put the pointer first
   so a truncation keeps the address.
4. **The extractor seam is a CommonJS module both runtimes consume**, pinned against the
   validator's frontmatter regex
   [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17].
   The phase conditional must be resolved, not stripped
   [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:66].
5. **The dedup key is packet path plus normalized slice hash.** A bare slice hash suppresses a
   resend when a session returns to a packet it left. The plugin's 512-entry brief cache must
   include the hash [SOURCE: .opencode/plugins/opencode-goal.js:43].
6. **The numeric policy lives twice.** The caps
   [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:60] and the preview constants
   [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:67] are duplicated verbatim in the plugin
   [SOURCE: .opencode/plugins/opencode-goal.js:29],
   [SOURCE: .opencode/plugins/opencode-goal.js:45]. A shared module or a thinned plugin is the only
   way this stops drifting.
7. **The plugin reads three session-id spellings** behind a fail-closed guard
   [SOURCE: .opencode/plugins/opencode-goal.js:355],
   [SOURCE: .opencode/plugins/opencode-goal.js:333]. Any new bind path must match all three.
8. **The pointer vocabulary already exists in the file.** The continuity block carries
   `packet_pointer` [SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:14].
   Adopt it rather than minting a second name, which also defuses the collision caution about the
   continuity facet named goal
   [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:46].
9. **The acceptance test is prescribed, not invented**: one shared resolver plus a set-then-inject
   canary [SOURCE: specs/hooks/009-goal-isolation/decision-record.md:129].
10. **The contract being extended still owes its own delivery freshness**
    [SOURCE: specs/hooks/009-goal-isolation/spec.md:64]. This packet's verification gate is where
    that debt comes due.
11. **The parent scaffold gap is real.** Phase mode scaffolds child goals but not the parent
    [SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:126], which is
    why this parent was hand-rendered and why its drift is worth checking against the template.
12. **The store is empty.** Zero records under `.opencode/skills/.state/goal/` on this checkout,
    resolved from [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:44]. The migration note costs
    nothing to honor here.

---

## 5. OPEN UNKNOWNS

| Unknown | Cheapest confirming action |
|---|---|
| Host injection caps for pi, cursor, devin, claude-code and codex | For pi this is now a recorded negative: the installed docs describe a 50KB and 2000-line limit that governs tool output, not injected prompt text. For the rest, one live session per runtime with a deliberately oversized block, observing where it is cut. Until then treat 4800 as the only enforced ceiling. |
| Whether the ESM plugin can import a CommonJS slice module without a build step | One import attempt in the plugin's runtime. Ten minutes, and it decides whether D3 ships one module or two. |
| The second writer of `lastSpecFolder` | One grep over `user-prompt-submit.ts` for its assignments. Run 2 inferred it and ran out of tool calls. |
| Whether any other checkout holds live goal records | One directory listing per machine. Affects only how much the migration note has to do. |
| Whether the core honors the ADR's environment variable spelling | It does not, on the read code [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:42]. What stays unknown is whether anything in the tree still sets the ADR spelling. One grep settles it. |
| Whether a devin host exposes a command surface at all | Read the devin extension docs the way run 2 read the pi ones. This is the gate on D5's devin half. |

