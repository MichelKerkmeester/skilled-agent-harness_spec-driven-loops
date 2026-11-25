# Iteration 10: The LearningProposal review against a Skilled skill proposal

## Focus
Frontier node F-2-008 (depth 2, scope OpenBot-main/api/openapi/learning.yaml, .skilled/skills): How does an OpenBot LearningProposal review (pending_review, approved, rejected with evidence) map onto a Skilled skill proposal?

## Actions Taken
1. Read the `LearningProposal` and `LearningProposalDetail` schemas in `learning.yaml`.
2. Read the approve and reject endpoints, their descriptions, idempotency parameter and 409 response.
3. Read the evidence endpoint and the insight shape.
4. Searched `.skilled/skills/` for any existing proposal folder or proposal mechanism.
5. Read the skill-advisor's trust gate and exit codes, which is the only existing write gate a proposal could pass through.

## Findings
1. `LearningProposal` requires `id`, `runId`, `operation`, `status`, `title`, `description`, `reason`, `createdAt`, `reviewedAt` and `publishedSkillId`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2124]
2. `runId` is "The run that proposed it." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2142]
3. `operation` is `add | update | remove` — "Whether it adds a skill, changes one, or removes one." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2146]
4. `status` is `pending_review | approved | rejected`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2150]
5. `publishedSkillId` is "The skill an approval published. Null until approved." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2167]
6. `LearningProposalDetail` adds `files` — "Every file the skill would hold", each `{path, content}` — and `insights`, each `{id, statement, impact}`, described as "What Learning noticed that led to it." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2186]
7. Evidence is a separate read, not an embedded field: "Read each insight's evidence on its own", served by `/settings/learning/insights/{insightId}/evidence`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2188] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:1224]
8. Approve "publishes the skill change to every Bot that learns there. Approving it again answers the same review. Only an administrator may. Recorded on the audit trail." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:1130]
9. Reject publishes nothing: "Rejecting it again answers the same review; rejecting an approved one is refused." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:1181]
10. Both review calls take an `IdempotencyKey` and answer 409 `LearningProposalReviewed` for a proposal already reviewed. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:1141] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:1163]
11. Skilled has no proposal mechanism at all: no `proposals/` folder exists under `.skilled/skills/`, and no SKILL.md mentions one. [SOURCE: .skilled/skills/ (find for proposal directories, 0 hits)]
12. The one existing gate a proposal would pass through is the skill-advisor's trust gate: `skill_graph_propagate_enhances` is trusted only for a real apply write (`mode=apply` with `dryRun` not `true`), and report, propose and dry-run calls stay read-safe. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:85]
13. A refused trusted mutation exits 64. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:94]
14. Four fields map directly: `runId` is the run record's id, `operation` is add, update or remove on a skill folder, `files` is the proposal folder's contents, and `publishedSkillId` is the skill folder name after apply. [INFERENCE: based on findings 1 through 6 and 12]
15. `status` should be derived, not stored, exactly as a needs-you item derives its state: `pending_review` is a proposal with no answer, `approved` is one with an answer and an applied skill, and `rejected` is one with an answer and no applied skill. [INFERENCE: based on findings 4 and 9, and the derived-state rule recorded in iteration 6]
16. The smallest proposal store is `{stateRoot}/{identityKey}/proposals/{proposalId}/` holding the files verbatim plus one `proposal.json`, with a needs-you item per proposal so `bots inbox` and `bots answer` stay the only review surface. [INFERENCE: based on findings 6, 11 and 15]
17. Approve must be idempotent and reject must be refused after approve, which the derived state gives for free: a second answer finds the item already answered and returns the same review. [INFERENCE: based on findings 8, 9 and 15]
18. The one thing Skilled cannot copy is the administrator check: `bots answer` has no role check today, so on a shared host anyone who can run the CLI can approve. That is acceptable for a few people on one machine and is the first thing to change on a shared host. [INFERENCE: based on findings 8 and 11]

## Ruled Out
- Storing `status` as a field on the proposal. Every value is readable from the answer and the applied skill, so a stored copy could disagree with them, which is the same failure the needs-you item avoids.
- Embedding evidence in the proposal. OpenBot serves evidence from its own endpoint so a reviewer reads it on demand; embedding it would make every proposal carry its whole transcript.
- A new review command beside `bots answer`. The needs-you item already carries a question, options, an answer and evidence, which is the whole proposal review.
- Applying a proposal without the skill-advisor's trusted mutation path. That path is the only write the advisor trusts, and a second write path would bypass its gate.

## Dead Ends
- Looking for an existing proposal or draft mechanism in `.skilled/skills/`. There is none: skills are authored directly, and the only staged-write pattern in the tree is the needs-you item.

## Edge Cases
- Ambiguous input: none. The node names both sides of the mapping.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2124-2260
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:1122-1230
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:224-260
- .skilled/skills/ (find for proposal directories)
- .skilled/skills/system-skill-advisor/SKILL.md:80-95

## Assessment
- New information ratio: 0.86
- Questions addressed: How does an OpenBot LearningProposal review (pending_review, approved, rejected with evidence) map onto a Skilled skill proposal?
- Questions answered: How does an OpenBot LearningProposal review (pending_review, approved, rejected with evidence) map onto a Skilled skill proposal?

## Reflection
- What worked and why: reading the approve and reject descriptions rather than only the schema. The schema says `status` is three values; the descriptions say approve is idempotent, reject is refused after approve, and only an administrator may review. Those three sentences decide the whole design, and none of them is visible in the field list.
- What did not work and why: looking for a proposal mechanism to extend. Skilled has none, so the proposal store has to be built from the needs-you item rather than adapted from an existing draft path.
- What I would do differently: read the endpoint descriptions before the schema. The schema tells you what is stored; the descriptions tell you what the review actually guarantees.

## Recommended Next Focus
The smallest change and its size and risk for each of the eight OpenBot parts, now that the memory, sync, skill-store and proposal mappings are all recorded.
