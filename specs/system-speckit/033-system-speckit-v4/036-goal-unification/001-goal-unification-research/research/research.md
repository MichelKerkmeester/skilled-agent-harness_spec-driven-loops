---
title: "Research: Goal unification, merged synthesis of both lineages"
description: "Canonical merged research record for packet 036 phase 001: decision matrix D1 through D8 with run-2 corrections applied, runtime feasibility, the unified design, the merged risk register, the migration note, and full provenance including the write-containment note."
trigger_phrases:
  - "goal unification research"
  - "packet goal single source"
  - "goal hook rebuild decision matrix"
  - "goal durable slice budget"
  - "goal runtime feasibility"
importance_tier: important
contextType: research
---

# Research: Goal unification, merged synthesis

> Canonical record for phase 001 of packet 036. It merges two sequential fan-out lineages and one
> verification pass by a third model family. Where the lineages disagree, the repository decides and
> the winner is named. Every claim about current behavior carries a `[SOURCE: path:line]` that was
> opened and confirmed. Design conclusions are marked CLAIM. Unconfirmed items are INFERRED or
> UNKNOWN with the action that would settle them.

---

## 1. OBJECTIVE AND METHOD

### Objective

Decide how the cross-runtime goal hook at `.opencode/hooks/goal/` and the OpenCode plugin at
`.opencode/plugins/opencode-goal.js` should be rebuilt so that a packet `goal.md` under `specs/` is
the single source of goal state, nested when the packet is phased and singular otherwise, while
spec-kit keeps the parent goal current and resends it in chat with frontmatter excluded.

### Method

Two lineages, run sequentially on the same research folder, with no early convergence and a
max-iterations stop policy.

| Run | Iterations | Model | Executor | Reasoning | Role |
|-----|-----------|-------|----------|-----------|------|
| 1 | 1 to 10 | `deepseek-v4.1-flash` | cli-pi through llmgateway | max | Open the eight angles, produce the first decision matrix |
| 2 | 11 to 15 | `glm-5.3-flash` | cli-pi through llmgateway | max | Verify, refute or deepen run 1 against the repository |

Both lineages ran under `sandboxMode: workspace-write` with the research folder as the write
surface, one angle per iteration, a ceiling of twelve evidence calls per iteration, and no
sub-dispatch. Run 1 averaged a new-information ratio of 0.665, declining from 0.90 to 0.50 with a
rebound at iteration 8 where budget arithmetic was first measured. Run 2 averaged 0.60,
non-monotonic, peaking at iteration 14 where the budget was measured against this packet's own
parent file.

A third pass, by a different model family, wrote this document and `synthesis.md`. Its remit was to
open at least one cited line per decision, refuse to average the lineages where they disagree, and
ground D8, which neither lineage researched because it was added to the parent goal after the
charter was frozen.

### Coverage against the charter's eight angles

A1 session-to-packet binding, A2 frontmatter strip, A3 legacy store fate, A4 resend mechanics,
A5 per-runtime feasibility, A6 isolation regression, A7 auto-update authority, A8 budget and
truncation. All eight were opened in run 1. Run 2 re-attacked A1 as the thinnest-evidenced angle,
then A5, then A6 with A7, then A8 with A2, then synthesized. Run 2 recorded 27 corrections across
its four evidence iterations and overturned no chosen option from run 1. One recommendation changed,
D6, from a single error threshold to two tiers.

---

## 2. DECISION MATRIX

Run 1 options, with run 2 corrections applied and with the third pass's own verification and
additions marked.

### D1. A session binds to one packet

**Chosen.** An explicit per-session pointer, written only by a deliberate bind action, never
inferred from the working directory or from conversation.

| Rejected | Why |
|---|---|
| Conversational only, the Gate 3 answer stays in context | Lost at compaction, and a hook never sees context at all |
| Nearest-packet inference from the working directory | The repository's own detector names the phased case ambiguous [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:103], and goal selection must never guess [SOURCE: specs/hooks/009-goal-isolation/decision-record.md:72] |
| Derivation only when a speckit command mutates | Insufficient, because the chat resend is not command-mediated |

**Enforcement site.** A bind resolver beside `resolveGoalScope`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:174]. The composite scope key stays as it is
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:191] and the record path derives from it
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:203]. The writer is the speckit set step, not a hook.

**Run 2 corrections applied.** Run 1's five ADR anchors land in the decision record's anchor
comment region rather than on its rules
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:41]. The rules are at `:65`, `:72`,
`:73`, `:83` and `:87`, all confirmed
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:83]. Run 1's claim that the CLI prints
an unbound state is refuted. The precedent is the requirement that a new or forked session id starts
unbound [SOURCE: specs/hooks/009-goal-isolation/spec.md:152].

**Third-pass addition.** Run 2 concluded that unbound adoption is documentation continuity only.
The vocabulary is already asserted in shipped tests
[SOURCE: .opencode/hooks/goal/pi/goal-pi.test.mjs:227]. The behavioral precedent exists in code.

### D2. The legacy store is demoted, not retired

**Chosen.** Demote `.opencode/skills/.state/goal/` to a per-session index carrying the packet
pointer, the operator copy, liveness, telemetry and dedup state. The directive itself is read from
`goal.md` at render time and never duplicated into the record.

| Rejected | Why |
|---|---|
| Retire outright | Locks [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:524], retention and rotation [SOURCE: .opencode/plugins/opencode-goal.js:37] have no home in a git-tracked document |
| Keep the objective duplicated in the record | Two authors of one truth, and the record's copy silently wins at injection |
| Move liveness into `goal.md` frontmatter | Per-session state in a shared committed file is the failure a prior packet removed [SOURCE: specs/hooks/009-goal-isolation/spec.md:48] |

**Enforcement sites.** Read at `readGoalRecordForScope`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:622], write at `setGoal`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:897], record shape at `buildNewRecord`
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:869].

**Run 2 additions.** Legacy adoption is conditional on the store being the workspace's own
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:195], so a redirected store never adopts legacy
scoped keys. The decision record's environment variable spelling
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:71] does not match the code's
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:42].

**Third-pass addition, decisive for cost.** The store directory contains one README and zero
records on this checkout. The path resolves from
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:44]. Neither lineage checked. D2 is a schema
decision here, not a data migration.

### D3. Frontmatter is never sent, and one extractor serves every surface

**Chosen.** One extractor. Split the frontmatter with the regex the validator already uses, then
slice the body by anchors, resolving the phase conditional rather than stripping it. Produce two
slices: a durable slice for chat resend, injection and CLI show, and a narrower objective slice of
pointer plus binding sentence plus criteria for the runtime objective.

| Rejected | Why |
|---|---|
| YAML parsing as the boundary | No goal surface carries a parser, and the block is nested under `_memory.continuity` |
| Cut to the second fence and take the rest | Ships template scaffolding into the 576-character objective preview |
| A materialized slice file beside `goal.md` | Two files drift, and a stale slice resends superseded criteria |

**Enforcement site.** A runtime-neutral CommonJS module under `.opencode/hooks/goal/lib/` that the
CommonJS core and the ESM plugin both consume, pinned by a golden test against the validator's
splitter [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17].

**Run 2 corrections applied.** Run 1's anchor citations at template lines 48 and 99 point at other
content [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:48]. The markers
are at `:41` [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:41] and `:101`
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:101]. Run 2 also found the
governing contradiction: the trigger says anything above the log, while the mandated payload says
the full text of the file [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:58],
which literally read would ship the frontmatter and the volatile log that the same template excludes
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:104]. This packet's parent
already words it correctly
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:62]. CLAIM: the
durable-slice reading is the intended one and the template plus playbook must be corrected to match.

### D4. A durable-slice change triggers an unprompted resend

**Chosen.** An edge trigger on a hash of the normalized durable slice, deduplicated per session,
with the dedup key scoped by packet path.

| Rejected | Why |
|---|---|
| Turn cadence | Fires when nothing changed |
| File modification time | Log appends and git operations are explicit non-triggers [SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:79] |
| The frontmatter continuity fingerprint | `goal.md` ships a zero placeholder [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:22] |
| Manual only | That is today, and the rule is prose with no implementing code |

**Enforcement site.** The render path, where the stored prompt already resolves with a fallback
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:391], is the seam for a slice projection. The
plugin's 512-entry brief cache must key on the hash
[SOURCE: .opencode/plugins/opencode-goal.js:43].

**Non-blocking semantics.** A missing file yields no reminder and no error, matching the adapters'
fail-open contract. Work never stops because the goal is unset.

**Run 2 corrections applied.** Run 1 anchored the trigger at playbook line 57, which promises a
reporting rule without carrying a number
[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:57]. The
trigger is at `:73`
[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:73]. Run
2's reading of the prior packet's exclusions is the load-bearing one: it excluded verifying what an
operator pasted [SOURCE: specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:71]
and declared the rule agent behavior rather than tooling
[SOURCE: specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:72]. It
did not exclude change detection. Mechanizing detection is inside that boundary.

### D5. Goal commands ship for pi, opencode, cursor and devin

**Frozen by the operator.** The research does not re-litigate it. What the research adds is the
cost of honoring it. Pi and opencode ship at full capability. Cursor ships degraded, injection only,
because its adapter is `sessionStart` only and its command surface cannot prove session binding
[SOURCE: .opencode/hooks/goal/README.md:67]. Devin is a build, not a wiring change, because no
adapter exists and the repository records that absence as intentional
[SOURCE: .opencode/hooks/goal/README.md:71]. Claude Code and Codex keep their native goal surfaces
and reach nesting through speckit commands and conversation, which matches what those surfaces
actually are.

**Enforcement site.** `resolveGoalScope`, which throws on a blank identity
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:177], plus the per-runtime adapter table
[SOURCE: .opencode/hooks/goal/README.md:66].

**Run 2 corrections applied.** Run 1 cited the delivery matrix at `README.md:96-103`, which is the
KEY FILES section [SOURCE: .opencode/hooks/goal/README.md:96]. The matrix is at `:66-71`. Run 1
cited the non-import sentence at `:31` [SOURCE: .opencode/hooks/goal/README.md:31], and it is at
`:25` [SOURCE: .opencode/hooks/goal/README.md:25]. The plugin accepts three session-id spellings
[SOURCE: .opencode/plugins/opencode-goal.js:355] behind a fail-closed guard
[SOURCE: .opencode/plugins/opencode-goal.js:333].

**Third-pass correction to run 2.** Run 2 completed the devin hook enumeration to four events. The
registration file carries eight: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse,
PermissionRequest, Stop, PostCompaction and SessionEnd. The devin surface is wider than either
lineage recorded, which lowers the cost of the frozen decision.

### D6. The parent durable slice is at most 4000 characters

**Frozen number, and the research decides how it is enforced.** Chosen: two tiers. Warn at 3000
characters of measured durable slice, error at 4000, both in the TypeScript validator, with a
consumer-side length check at set time as a second guard.

| Rejected | Why |
|---|---|
| A 4000-only error | Gives no warning before the cap, and this packet is six characters from it |
| Enforce nothing | A 15,028-byte `goal.md` already shipped unreported [SOURCE: specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md:61] |
| Consumer-side only | Cannot fire until a paste happens, so it is a second guard, not the primary |

**Enforcement site.** `spec-doc-structure.ts`, which already owns `goal.md` specifics: its
continuity block is mandatory by its absence from the optional set
[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:213], for the
reason stated above it
[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:210], and its
anchors are required whenever the document is present
[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:229].

**Budget arithmetic, corrected twice.** Run 1 derived an injected prompt ceiling near 2900 by
subtracting the build-time reserve of 1900
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:67] from the injection cap of 4800
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:62]. That mixes the build path into the injection
path. Run 2 correctly identified the real mechanism, a dynamic budget
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:417] with an early return when the full block fits
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:419], and estimated 3875 to 3910 as INFERRED. The
third pass computed it directly from the block template
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:405]: the overhead is 337 characters with an empty
objective, 917 with a full 576-character objective preview and default verifier fields, and 1198
when the verifier reason fills its allowance
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:63]. The prompt budget therefore spans 3602 to 4463.
Run 2's central figure is right for the typical case, its width is too narrow, and its measurement
of the directive line at 132 characters is wrong. It is 109.

**The measurement that moved.** Run 2 measured this packet's parent durable slice at 3732 with 268
characters of headroom. The same measurement now gives 3994 against the 4000 cap, six characters of
headroom, at five percent completion
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:28]. The file grew
by two lines between run 2 and this pass, the D8 decision row
[SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:58] and its
criterion [SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:99],
which together consumed 262 of the 268 remaining characters. The warning tier is load-bearing.

**Live truncation, confirmed.** The objective plus criteria measure 1301 characters. The injected
objective preview clamps to 576 [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:368],
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:386]. Forty-four percent of the operator copy
reaches the model, and the loss is the criteria tail.

**Cut order, reusable unchanged.** Log, then restated child detail, then decision prose. Criterion
wording never counts, and the last resort is splitting the packet
[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:57].

### D7. Research precedes every build decision, and isolation is reconciled by a split

**Chosen.** Share content, keep selection, liveness, telemetry and locks per session. Auto-update
may touch only the log and continuity bookkeeping. Durable-slice changes stay command-mediated and
operator-ratified. A child change that alters a parent decision or criterion is applied to the
parent first, and the parent is resent.

| Rejected | Why |
|---|---|
| Per-session copies of the directive | Re-creates the drift the single source removes |
| Auto-rewriting durable sections | Makes the operator copy meaningless and fires a resend per edit |
| Operator-only durable writes | Contradicts the auto-update requirement |

**Enforcement site.** The per-command whitelist ladder already in the tree: plan, implement and
complete may set [SOURCE: .opencode/commands/speckit/plan.md:4], resume may only read
[SOURCE: .opencode/commands/speckit/resume.md:4].

**What was actually removed by the prior isolation packet.** A repository-wide singleton where the
last writer replaced every session's record
[SOURCE: specs/hooks/009-goal-isolation/spec.md:48], producing last-writer-wins global steering
[SOURCE: specs/hooks/009-goal-isolation/spec.md:81]. None of that forbids sharing content. It
forbids implicit selection and shared per-session facts.

**Run 2 strengthening.** The design is pre-derived by that packet's own critical dependency, which
requires the management path to acquire the same identity as the injection hook
[SOURCE: specs/hooks/009-goal-isolation/spec.md:54], and by its recorded mitigation, one shared
resolver plus a set-then-inject canary test
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:129]. That mitigation is this packet's
acceptance test, already written down. Caveat: that packet's own status is implementation verified
with delivery freshness pending [SOURCE: specs/hooks/009-goal-isolation/spec.md:64].

### D8. The always-on goal posture is one AGENTS.md row

**Not researched by either lineage.** It was added to the parent goal after the charter froze.
Grounded here from the repository.

**Chosen.** One block in `AGENTS.md` section 4 under POST-EXECUTION GATES, shaped like the MEMORY
SAVE RULE block [SOURCE: AGENTS.md:303], plus one Quick Reference entry beside the save and resume
rows [SOURCE: AGENTS.md:475]. Mechanics stay in `system-spec-kit`.

| Rejected | Why |
|---|---|
| A repo rule under `repo-rules/` | A rule loads only when its trigger matches the action about to be taken [SOURCE: REPO RULES.md:12], and when nothing fires `AGENTS.md` alone governs [SOURCE: REPO RULES.md:18]. Content that must bind with no trigger is the authoring mode's most common refusal [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:41] and its first never [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:200] |
| Skill documentation only | The posture must bind agents that never load `system-spec-kit`, and the mechanics already live there |

**Scope check.** The router's scope statement puts posture in [SOURCE: REPO RULES.md:73] and
mechanics out [SOURCE: REPO RULES.md:80]. The goal posture is posture, but unconditional posture,
which routes it to the always-loaded document. The authoring mode also requires escalation
for an `AGENTS.md` change beyond a pointer
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:209], and D8 records that operator
decision as already made.

**Residual case D8 itself names.** If phase 002 finds genuinely trigger-scoped content, for example
what to do when one session's durable edit collides with another's, that fragment alone could earn a
rule. Nothing in either lineage is trigger-scoped.

---

## 3. RUNTIME FEASIBILITY TABLE

| Runtime | Identity source | Command surface | Hook surface | Injection cap | Verdict |
|---|---|---|---|---|---|
| pi | `ctx.sessionManager.getSessionId()` and `ctx.cwd` [SOURCE: .opencode/hooks/goal/README.md:66] | `/goal-pi`, plus `bin/goal.cjs` with scope flags | input, session_start, turn_end | Core-enforced 4800 [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:62]. Host cap UNKNOWN, recorded negative: the installed docs describe a 50KB and 2000-line limit that governs tool output, not injected prompt text | Ship |
| opencode | `sessionID`, `sessionId` or `session.id` [SOURCE: .opencode/plugins/opencode-goal.js:355] behind a fail-closed guard [SOURCE: .opencode/plugins/opencode-goal.js:333] | Native plugin tools and `/goal-opencode` | Plugin lifecycle and prompt transform | 4000, 4000 and 4800 [SOURCE: .opencode/plugins/opencode-goal.js:29] | Ship |
| cursor | `session_id` then `conversation_id`, workspace from `workspace_roots[0]` [SOURCE: .opencode/hooks/goal/README.md:67] | Command exists but cannot prove binding [SOURCE: specs/hooks/009-goal-isolation/spec.md:54] | sessionStart only | UNKNOWN | Ship degraded, injection only |
| devin | Hook payload session id | None found | Eight registered events in `.devin/hooks.v1.json`, wider than run 2 reported | UNKNOWN | Build, not wiring. Frozen as shipping by D5 |
| claude-code | Host-private, 44 files under `~/.claude/projects/*/memory/goal_*.md` | No `/goal` command, no goal hook under `.claude/hooks/` | Session prime and stop hooks exist for other purposes | UNKNOWN | Native surface kept. Nesting through speckit commands and conversation [SOURCE: .opencode/hooks/goal/README.md:69] |
| codex | Host-private `~/.codex/goals_1.sqlite` | `~/.codex/prompts/goal_opencode.md` | Completion-evidence stop hook | UNKNOWN | Native surface kept [SOURCE: .opencode/hooks/goal/README.md:70] |

**How to treat the unknowns.** Until a host cap is observed, the core's 4800 is the only enforced
ceiling, and any slice that must survive injection should be sized against the worst-case prompt
budget of 3602 rather than the typical 3883.

---

## 4. THE UNIFIED DESIGN

```text
packet goal.md  (canonical, git-tracked, one per packet, nested when phased)
   |
   |  (1) split frontmatter with the validator's regex, BOM and leading comments tolerated
   |      frontmatter -> validation only, never chat, never injection, never an objective
   |
   |  (2) slice the body by anchors: directive start to before the log anchor
   |      the phase conditional is RESOLVED, not stripped
   |
   |  (3) normalize, then sha256  =>  durableSliceHash
   |
   +--> CHAT RESEND   edge trigger when hash differs from the record's last resent hash,
   |                  dedup key = packetPath + hash, pointer on the first line
   +--> INJECTION     goal_prompt receives the slice projection, clamped to the prompt budget
   +--> OBJECTIVE     pointer + binding sentence + criteria verbatim, never a file body
   +--> CLI SHOW      the same projection as injection

per-session record  (the demoted store, still alive)
   identity    scope key sha256([workspace, runtime, sessionId]), runtime label
   binding     packetPath (null until an explicit bind), boundAt, boundBy
   copy        objective, the operator's copy, what the runtime judges against
   integration lastResentSliceHash, lastResentAt
   liveness    status, revision, timestamps
   telemetry   turnsUsed, tokenBudget, verifier fields, usage source
   machinery   locks, archive, retention
```

**The separation that makes "single source" coherent.** There is one source for content, the file,
and exactly one place that remembers what this session was told, the record. The objective is a copy
by design [SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:104],
and the resend exists to keep that copy current. The prompt text is read from the file at render
time so no stored duplicate can drift.

**Invariants preserved.** No injection without session identity
[SOURCE: specs/hooks/009-goal-isolation/spec.md:136]. No passive adoption of legacy state
[SOURCE: specs/hooks/009-goal-isolation/spec.md:141]. No fallback to the singleton
[SOURCE: specs/hooks/009-goal-isolation/spec.md:164]. Selection is never guessed
[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:72]. The objective is never a file body
[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:172].

**The extractor's one trap.** The template wraps the binding section in a phase conditional
[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:66]. A naive prefix or
suffix stripper would ship phase-only text into a singular packet's slice. This is the concrete
argument for slicing by anchors rather than by line range.

**The half-edited-file branch must be decided, not inherited.** If the log anchor is missing, the
extractor can fall back to body-to-end or return no slice. Body-to-end would silently resend the
entire log forever. CLAIM: return no slice, emit a diagnostic, and keep the last known good slice
for display.

---

## 5. RISK REGISTER

| # | Risk | Evidence | Mitigation and where it lives |
|---|---|---|---|
| R1 | Shared-state regression, a packet-shared file re-introducing the removed singleton | [SOURCE: specs/hooks/009-goal-isolation/spec.md:48] | Only content is shared. Selection, liveness, telemetry and locks stay per session |
| R2 | Concurrent durable edits by two sessions | Scenario analysis, run 1 iteration 9 | Directive edits are command-mediated and ratified. The log is the only append area and never triggers a resend. Git remains the conflict layer |
| R3 | Two implementations drifting | The plugin does not import the core [SOURCE: .opencode/hooks/goal/README.md:25], and the numeric policy is duplicated [SOURCE: .opencode/plugins/opencode-goal.js:45] against [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:67] | One shared slice and hash module, or a thinned plugin. Golden test against the validator's splitter |
| R4 | Resend spam | [SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:79] | Edge trigger on the slice hash, dedup key includes the packet path, log excluded, no writes during a resend |
| R5 | Frontmatter leak into chat or the model | [SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:12] | One extractor plus a seven-assertion leak test over three fixtures |
| R6 | Silent truncation of the criteria tail | Measured live at 44 percent injected on this packet [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:386] | Two-tier validator rule, pointer-first projection, consumer-side length check at set time |
| R7 | Dangling pointer when a packet is renamed or deleted | Scenario analysis, run 1 iteration 9 | Unbound state, no injection, no fallback, diagnosed through the CLI |
| R8 | Stale dedup entry from one packet suppressing another | Scenario analysis, run 1 iteration 9 | Packet-scoped dedup key, and the plugin's brief cache keyed on the hash [SOURCE: .opencode/plugins/opencode-goal.js:43] |
| R9 | Documentation pointing at rules that do not exist | The playbook routes the budget to a file that carries no goal rule [SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:137]. The charter's contract path is one directory too deep. The decision record's environment variable spelling does not match the code [SOURCE: specs/hooks/009-goal-isolation/decision-record.md:71] | Fix the citations in the implementation packet, in the same change that lands the rule |
| R10 | Naming collision with the existing continuity goal facet | [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:46] | Largely defused: adopt the frontmatter's existing `packet_pointer` [SOURCE: specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md:14] rather than minting a second vocabulary |
| R11 | The cap is breached by the packet that commissions it | Durable slice measured at 3994 against 4000 | Ship the warning tier first, or split the packet, before the next amendment |
| R12 | Extending a contract whose own delivery is unverified | [SOURCE: specs/hooks/009-goal-isolation/spec.md:64] | This packet's verification gate is where that debt is settled |

---

## 6. MIGRATION NOTE

| Existing artifact | Behavior under the chosen design |
|---|---|
| Scoped records `<scopeKey>.json` [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:203] | Read unchanged. A missing packet pointer means no packet content is injected until an explicit bind. No rekey |
| Records carrying an objective and no packet | Stay valid operator copies. The next bind attaches a packet, and nothing is auto-adopted |
| The legacy singleton `active-goal.json` [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:45] | Tooling unchanged: inspect, quarantine, migrate and archive stay as they are. Inspect and archive remain scope-free, migrate stays scope-bound |
| Redirected stores | Never adopt legacy scoped keys, because adoption is conditional on the store being the workspace's own [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:195] |
| Archived snapshots under the archive subdirectory [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:47] | Untouched. They are history, not state |
| Plugin records under hex and sha256 session keys [SOURCE: .opencode/plugins/opencode-goal.js:358], [SOURCE: .opencode/plugins/opencode-goal.js:362] | Keys unchanged. Records gain the pointer and dedup fields once the shared module lands, or the plugin is thinned to an adapter |
| `goal.md` files that predate the resync rule | Unaffected. The playbook binds the agent regardless [SOURCE: specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:116] |
| `goal.md` files over budget | The new rule reports the overrun. Tooling never rewrites the file |

**Scale of the migration on this checkout.** Zero records exist under the store directory. The
table above is the contract, and on this machine it has nothing to migrate. Other checkouts may
differ, so the contract still ships.

---

## 7. CONFIRMED VERSUS INFERRED VERSUS UNKNOWN

**Confirmed.** Every `[SOURCE: ...]` in this document was opened during the third pass. Also
confirmed: the injection block overhead of 337, 917 and 1198 characters and the resulting prompt
budget span of 3602 to 4463, computed from the read constants. The durable slice of this packet's
parent at 3994 characters against a 4000 cap, and the total file at 7204 characters and 7204 bytes,
so the character-versus-byte choice is free on this file. The objective plus criteria at 1301
characters against a 576-character preview. Seven of seven binding-table children have a `goal.md`,
sized 3408 to 4466 bytes, so the binding-row existence rule would pass today. The store holds one
README and no records. `spec-kit-docs.json` names the goal template
[SOURCE: .opencode/skills/system-spec-kit/templates/spec-kit-docs.json:20] and contains no
occurrence of 4000. The validation rules file exists and carries no goal budget rule. The devin
registration carries eight hook events. Claude Code has 44 memory goal files, no goal command and no
goal hook. Codex has a goals database and a goal prompt.

**Inferred, with what would confirm.** The per-session record field set, confirmed by implementing
one schema and round-tripping it through `setGoal`. The leak-test matrix, confirmed by the tests
themselves. The second writer of the last-spec-folder carrier, confirmed by one grep over
`user-prompt-submit.ts`. The variability of the overhead constituents, which depends on verifier
verdict and reason lengths at render time.

**Unknown.** Host injection caps for cursor, devin, claude-code and codex. For pi the result is a
recorded negative rather than a number. Whether the ESM plugin can import a CommonJS slice module
without a build step, settled by one import attempt. Whether any other checkout holds live goal
records. Whether anything in the tree still sets the decision record's environment variable
spelling. Whether a devin host exposes a command surface at all, which gates the devin half of D5.

---

## 8. PROVENANCE

### What each lineage contributed

**Run 1, deepseek, iterations 1 to 10.** The eight angles opened, the first full option set per
decision with rejections and enforcement sites, the objective-versus-prompt separation that makes
the single-source claim coherent, the packet-scoped dedup key, the end-to-end pipeline diagram, the
seven-assertion leak test, the phase-conditional trap, the CommonJS and ESM seam, the risk register,
and the migration note. Stop reason: max iterations reached. Run 1 also recorded its own errata, a
set of plugin constants cited one line low.

**Run 2, glm, iterations 11 to 15.** Verification. Twenty-seven corrections across four evidence
iterations, no chosen option overturned, one recommendation changed. The corrections cluster in four
groups: the decision record's rule anchors, the prior packet's problem statement plus template plus
playbook anchors, the goal README and plugin anchors, and the budget mechanism. Run 2 also produced
the first measurement of a real parent durable slice, the conditional legacy-adoption fact, the
pointer-adoption path through the existing frontmatter vocabulary, the identification of the
template-versus-playbook payload contradiction, the resume whitelist conflict with criterion 5, and
the second restored validator rule that run 1 never recorded.

**Third pass, this document and `synthesis.md`.** Independent verification of at least one cited
line per decision. Direct computation of the injection overhead, which corrects both lineages. A
fresh measurement of the durable slice, which moved from 3732 to 3994 after run 2 finished. The
empty-store finding. The eight-event devin enumeration. The shipped-test precedent for the unbound
vocabulary. The confirmation that the validation rules file carries no goal rule, closing one of run
2's unknowns. And the grounding of D8, which neither lineage researched.

### Where the lineages disagreed, and who was right

| Point | Run 1 | Run 2 | Settled |
|---|---|---|---|
| Injected prompt ceiling | Approximately 2900 | 3875 to 3910, INFERRED | Neither. It is 3602 to 4463 depending on the objective preview and verifier fields. Run 2's mechanism is right, its width is wrong |
| Budget enforcement tiers | One error threshold at 4000 | Warn at 3000, error at 4000 | Run 2, and more strongly than it knew |
| Decision record anchors | `:36`, `:41`, `:43`, `:47`, `:51` | `:65`, `:72`, `:73`, `:85`, `:87` | Run 2 |
| Template anchor markers | `:48` and `:99` | `:41` and `:101` | Run 2 |
| Goal README delivery matrix | `:96-103` | `:66-71` | Run 2 |
| The unbound precedent | The CLI prints it | Documentation continuity from a prior requirement | Run 2 on the refutation, and stronger still: it is asserted in shipped tests |
| Devin hook events | Two named | Four named | Neither. Eight are registered |
| Directive line length | Not measured | 132 characters | Neither. It is 109 |
| Store contents | Not checked | Not checked | Neither checked. It is empty |

### Containment note

Both driver runs were marked failed by the fan-out driver, and the run summary records one lineage
failing with an exit-class failure and no salvage miss. The cause in both cases was write
containment, tripped by other sessions editing unrelated paths while the lineages were running. Run
1's containment patch reverts edits under `.opencode/skills/mcp-tooling/`. Run 2's reverts edits
under `.opencode/skills/sk-design/`. Neither path is in either lineage's write surface, which was
this research directory. The research artifacts themselves are complete: ten iteration files and a
synthesis for run 1, five iteration files and a synthesis for run 2, with deltas, ledgers and state
events for both. The reverted files were restored from the patches preserved under each lineage's
`containment-reverted/` directory. The failed status is an artifact of the containment mechanism
reacting to concurrent sessions, not a research failure, and it does not reduce the standing of any
finding above.

### What this research did not do

No code edits, no template edits, no validator changes, no generation or validation scripts, no git
writes, and no writes outside this research directory. The open seams listed in section 7 are handed
to phase 002, which writes the decision records, and to the build phases that follow it.
