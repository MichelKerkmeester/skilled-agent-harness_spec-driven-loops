# Iteration 43: D4-A12 - Headless Automation Proof Token Freeze

## Focus

[D4-A12 / D4] headless automation time-bomb: `od automation` can schedule or fire Open Design routines without a later agent turn, so the design proof cannot be minted lazily at the moment the routine runs. The narrow research question is where the `DESIGN_PROOF_TOKEN v1` carrier belongs for scheduled automation, and what must be frozen at schedule creation so a future unattended run cannot generate UI with stale or missing `sk-design` judgment.

newInfoRatio estimate: 0.67. Status: insight. ENFORCEABLE-vs-ADVISORY summary: schedule/routine/payload digest checks are enforceable on captured CLI/MCP/HTTP fixtures; whether a recurring design request remains semantically appropriate over time is advisory unless reduced to canonical subject and schedule policy fields.

## Actions Taken

1. Re-read the active strategy questions. Q3 explicitly asks for a deny-by-default content-bound token across MCP, CLI, HTTP, and automation; Q4 asks how the contract survives into children and the Open Design inner generation agent. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:37] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:38]
2. Re-read the Open Design transport docs for headless generation, the automation surface, and mutating gates. The skill says `start_run` / `od run start` is turn 1, `od ui respond` fires the build, and `od automation` can schedule or fire routines. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:228] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:230] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:245]
3. Checked the CLI reference for the automation-specific facts. It classifies mutating headless equivalents as STOP-and-confirm points, states `od automation create/run/runs/...` schedules or fires routines, and says schedules use `hourly:`, `daily:`, `weekdays:`, and `weekly:` forms. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:177] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:189]
4. Re-read the existing proof primitives to see whether they can carry a scheduled automation proof. The context contract requires loaded-file manifests and proof fields before design/build decisions; the context and proof cards carry surface/register/loaded-file/final READY fields, but no routine id, schedule spec, planned mutating verbs, or future-fire replay field. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:35] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:46]
5. Compared this angle against prior D4 token work. Iteration 39 bound the compiled brief/form answers to the Open Design payload, iteration 40 required child-side re-validation, and iteration 42 added token freshness and subject invalidation; none of those placed the proof at scheduled-routine creation time. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:24] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-040.md:48] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-042.md:107]

## Findings

### Finding 1: `od automation` is a delayed mutation surface, not just another immediate run command

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for schedule/routine classification and token-required fixtures; ADVISORY for final generated design quality.

The Open Design skill already treats generation as headless and multi-turn, with `start_run` firing turn 1 and `od ui respond` firing the build. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:228] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:245] The CLI reference then adds the delayed form: `od automation create/run/runs/...` "schedules or fires a routine and harvests results," is "explicitly designed for external agents," and supports recurrence forms such as `hourly:`, `daily:`, `weekdays:`, and `weekly:`. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:189]

That changes the enforcement point. The current mutating gate language tells the operator to stop and confirm before running mutating verbs. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:73] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:78] For a scheduled routine, the dangerous design-generation act may happen later, outside the current agent turn, after the `sk-design` context window has gone cold or the subject has changed. A future daemon fire cannot be trusted to reconstruct the original design judgment.

Buildable recommendation: treat `od automation create` as a design-generation boundary whenever the routine can later call `start_run`, `od ui respond`, `od media generate`, artifact writes, or any equivalent Open Design design-feeding mutation. Require `DESIGN_PROOF_TOKEN v1.automationBinding` before the schedule is created, not only before `automation run`.

Minimum fields:

```json
{
  "automationBinding": {
    "routineDigest": "sha256:...",
    "scheduleSpecDigest": "sha256:...",
    "recurrence": "hourly|daily|weekdays|weekly|manual",
    "plannedMutatingTools": ["od.automation.fire", "start_run", "od.ui.respond"],
    "subjectDigest": "sha256:...",
    "compiledBriefDigest": "sha256:...",
    "compiledFormAnswersDigest": "sha256:...",
    "loadedFilesDigest": "sha256:...",
    "maxRunsBeforeReview": 1,
    "refreshRequiredBefore": "ISO-8601"
  }
}
```

Fixture rule: a captured `od automation create` command or HTTP/MCP equivalent that schedules a design-generation routine fails if this binding is absent, if `plannedMutatingTools` omits a later generation/write verb, or if the routine body hash does not match `routineDigest`.

### Finding 2: Fire-time-only validation is too late for unattended scheduled runs

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for denying future fires when the frozen binding is absent/stale/mismatched; ADVISORY for deciding whether a recurring design subject still makes product sense.

Prior D4 work correctly says the tool boundary must revalidate immediately before Open Design mutation, including equivalent automation paths. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-040.md:48] Iteration 42 also says freshness must be checked at token mint and at the tool boundary. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-042.md:103] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-042.md:107] Scheduled automation needs one extra rule: fire-time validation may only replay a proof minted at schedule creation or at an explicit review/remint event.

The reason is simple: the future scheduled fire is not guaranteed to have an agent prompt, a loaded `sk-design` manifest, or a user present to answer Gate 3 style questions. The CLI docs call this the same store as the UI Automations tab, not an agent session that will necessarily reload design context. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:189]

Buildable recommendation: add a two-phase automation validator.

Phase 1, schedule creation: parse the routine body and schedule spec, classify whether any planned step is design-feeding or mutating, then mint/freeze the automation binding after `sk-design` context and compiled payloads exist.

Phase 2, fire time: before `automation run` or daemon-triggered scheduled execution forwards any generation/write step, recompute `routineDigest`, `scheduleSpecDigest`, `subjectDigest`, payload digests, and loaded-file digests. Deny when the binding is absent, expired, consumed, future-issued, subject-mismatched, routine-mismatched, or over its `maxRunsBeforeReview`.

Fixture rule: one valid scheduled design routine passes creation and first fire; the same token fails after routine edit, recurrence edit, subject edit, loaded-file hash change, or second fire when `maxRunsBeforeReview` is one.

### Finding 3: The current proof cards cannot represent scheduled lineage

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for adding required automation proof fields and parser checks; ADVISORY for private model reasoning inside a future Open Design run.

The current `sk-design` contract is strong for immediate work: it requires a context manifest before dispatch or design/build decisions and requires exact proof fields in parent sessions, delegated prompts, child responses, and final proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] The context card records surface, task type, scope owner, register, dials, loaded files, and staged proof fields. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:30] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:61] The proof card records proof fields, lineage attribution, and final READY/NOT READY. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:35] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:46] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:57]

None of those surfaces can answer: which routine was scheduled, which recurrence was approved, which future mutating tools are authorized, how many future fires are allowed, or whether the run being harvested came from the same frozen routine. `proof_check.py` mirrors that immediate-work scope: it checks four proof-field families and READY, with no token, schedule, or routine lineage parser. [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:16] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:25] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47]

Buildable recommendation: add an `OPEN DESIGN AUTOMATION BINDING` section to the future token/proof contract and extend the deterministic checker with `--require-open-design-automation-binding`. Keep the full Open Design source content out of the token; store only digests and compact canonical fields. The proof card can cite the token id, schedule id, routine digest, recurrence digest, planned mutating tools, and latest validation result.

Fixture rule: a proof card claiming a scheduled Open Design generation is READY fails unless it includes a binding whose routine/schedule/tool-call digests match the captured automation event log.

### Finding 4: Recurring schedules need explicit review cadence, not unlimited proof replay

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for max-run, max-age, and remint-required checks; ADVISORY for whether the user should allow recurring design generation at all.

Iteration 42 already established that a design proof token must be short-lived, single-use, and bound to the subject, brief, form answers, route, loaded files, and Open Design lineage. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-042.md:27] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-042.md:87] Scheduled automation puts pressure on "single-use" because a recurrence may be intended to fire more than once. The safe version is not an immortal token; it is an explicit review cadence.

Buildable recommendation: allow two token modes:

- `singleFire`: valid for exactly one future automation fire.
- `reviewWindow`: valid only until `refreshRequiredBefore`, only for `maxRunsBeforeReview`, and only while routine/schedule/subject/payload digests match.

When the window closes, the automation routine should pause or fail closed with "needs design proof remint" rather than reusing stale design judgment. This preserves deterministic enforcement without pretending the system can judge semantic drift forever.

Fixture rule: `singleFire` fails on second use; `reviewWindow` fails after max run count, after expiry, or after digest drift. Semantic drift outside canonical fields is logged as advisory and should ask/remint rather than silently continue.

## Questions Answered

- Q3/D4: The automation surface needs the same content-bound token as direct MCP/CLI generation, but the token must be frozen at `automation create` for any routine that can later perform design-feeding mutations. Future `automation run` or daemon-scheduled fires replay and revalidate the frozen binding; they do not mint design judgment unattended.
- Q4/D5: The contract survives headless automation by moving the proof boundary before schedule creation and adding fire-time replay. This covers the case where the future execution has no agent turn, prompt context, or user review loop.
- Q5/all: ENFORCEABLE backlog items are routine digest, schedule-spec digest, planned mutating-tool list, canonical subject digest, compiled brief/form digests, loaded-file digest, schedule id, recurrence policy, max-run/max-age review cadence, and fire-time replay. ADVISORY items are final visual taste and semantic drift not represented in the canonical subject/routine fields.

## Questions Remaining

- Where should the canonical automation binding live first: in a shared `DESIGN_PROOF_TOKEN v1` reference imported by both `sk-design` and `mcp-open-design`, or in the guarded Open Design proxy with the cards linking to it?
- What exact `od automation create` JSON shape is emitted by the live CLI/HTTP surface, and which field can carry the token without embedding Open Design source content?
- Should recurring design-generation schedules be allowed at all by default, or require explicit per-schedule opt-in with a very small `maxRunsBeforeReview`?
- How should a paused/stale automation routine surface the remint requirement back to the operator without losing the captured routine digest and prior run evidence?

## Next Focus

D4-A13 should capture or model the exact carrier surface for the token across `start_run`, `od run start`, `od ui respond`, and `od automation create/run`: which structured input field carries the proof token, how Bash/HTTP/MCP proxies parse it, and how captured event logs replay it without copying Open Design source content into repo artifacts.
