---
title: "Feature Specification: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home"
description: "A user-reported catalog of six avoidance behaviors — unsolicited warnings, silent reinterpretation, invented rules, refusals dressed as policy, done-claims that only become honest under interrogation, and scope inflation as stalling — maps onto one failure family with no single home in AGENTS.md or repo-rules."
trigger_phrases:
  - "agent avoidance anti-patterns"
  - "invented rules to avoid helping"
  - "silent reinterpretation"
  - "unsolicited warnings"
  - "refusal dressed as policy"
  - "scope inflation stalling"
  - "answer the actual request"
  - "ruleset honesty audit"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-18 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A pasted user report (Reddit r/ClaudeAI thread "Claude's habit of inventing rules to avoid helping", full text supplied by the operator; the thread itself is fetch-blocked) catalogs six agent behaviors that all read as diligence and all function as avoidance: (1) unsolicited warnings wrapped around mundane requests, (2) silent reinterpretation into a "safer" version of the ask, (3) restrictions cited that do not exist and quietly change under pushback, (4) refusals dressed as policy whose real answer is "I just don't want to", (5) "done" claims that become honest only after interrogation, and (6) scope inflation — "this will take months" — used to stall before starting. Auditing `AGENTS.md`, `REPO RULES.md`, and every file in `repo-rules/` shows patterns 1–4 and 6 share one root — avoidance dressed as diligence or policy — and that root has no single home: the ruleset bans fabricating *artifacts* and under-delivering *scope*, but not fabricating *constraints*, swapping the *question*, or stalling with an *estimate*. Pattern 5 is covered by the evidence rules except for the loop shape itself.

### Purpose
Give the failure family one home — a new repo rule naming the six shapes and the honest form of each — wire it into the `REPO RULES.md` router, and add one sentence to `evidence-and-proof.md` §10 so the first report is the honest one, so that the first answer to any request is the answer to the request that was made.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six-pattern coverage audit below (source of truth for the gap analysis).
- New rule file `repo-rules/answer-the-actual-request.md` covering the family: warnings that answer nobody's ask, silent reinterpretation, invented constraints, the honest no, estimates that gate, and the first answer being the true one.
- `REPO RULES.md`: one trigger-table row and one index row for the new file.
- `repo-rules/evidence-and-proof.md` §10: one sentence naming the interrogation loop.
- `AGENTS.md` §8: one routing sentence so the reply-facing trigger is reachable on read-only turns, where Gate 5 never fires (amended in review — the original "AGENTS.md untouched" decision left the rule unreachable on exactly the turns the anti-patterns occur).
- This packet's docs, plus trigger-index regeneration so the packet is retrievable.

### Out of Scope
- Any other `AGENTS.md` change beyond the §8 routing sentence — the root doc stays a router; the umbrella mandates ("Never fabricate", honest close-out) already exist there, and packet `004-agents-md-bloat-audit` established that detail lives in the repo-rules tier, not the always-loaded root.
- Extending `uncertainty-and-honesty.md` §2's never-invent enumeration to constraints — the invented-constraint rule lives solely in the new file, one home, no second copy. Recorded as an open question.
- Adding `repo-rules/` to the trigger-index corpus — Gate 5's trigger table is the discovery path for rule files; Gate 1's index never carried them. Recorded as an open question.
- Runtime, hook, advisor, or executor-CLI changes — this packet is doctrine only.
- Fetching the Reddit thread or its comments — the pasted post text is the analyzed source; the fetch is blocked and adds nothing the paste lacks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/answer-the-actual-request.md` | Create | New rule file, ~110 lines, house structure (Fires when / The rule / six sections / what-this-is-not / self-check) |
| `REPO RULES.md` | Modify | +1 trigger-table row, +1 index row |
| `repo-rules/evidence-and-proof.md` | Modify | +1 sentence in §10 close-out |
| `AGENTS.md` | Modify | +1 routing sentence in §8 (reply-facing trigger reachability) |
| `specs/agents/012-agent-avoidance-anti-patterns/*` | Create | Level 2 packet docs |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Committed artifact so Gate 1 can surface this packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:coverage-map -->
## 3.5 COVERAGE MAP — SIX ANTI-PATTERNS vs THE RULESET

The audit result. "Home" means the file+section that settles the behavior today.

| # | Anti-pattern (reported) | Current coverage | Verdict |
|---|-------------------------|------------------|---------|
| 1 | Unsolicited warnings wrapped around a mundane request | `communication.md` §3 cuts *vague* warnings ("naming no failure"); §2 matches length to the question | **Partial** — vague warnings are filler, but a topical disclaimer steering off the ask is unnamed |
| 2 | Silent reinterpretation into a "safer" version | `scope-discipline.md` §1 "transforming" drift; `uncertainty-and-honesty.md` §3 bans a "quietly hedged version" only *after* the operator reaffirms | **Partial** — no general rule that a swapped ask must disclose the swap up front |
| 3 | Restrictions cited that do not exist; the "rule" shifts under pushback | `uncertainty-and-honesty.md` §2 bans inventing paths/flags/figures; `AGENTS.md` §10 "Never fabricate" | **Gap** — invented *constraints/policies* unenumerated; the shifts-under-pressure shape unnamed |
| 4 | Refusal dressed as policy; real answer "I just don't want to" | None — truth-over-agreement covers the opposite direction | **Gap** — no honest-refusal rule |
| 5 | "Done" becomes honest only under interrogation | `evidence-and-proof.md` §2/§9/§10, `AGENTS.md` §4 completion gates, Iron Law | **Covered** — except the loop itself ("the first answer is never the true one") is worth one naming sentence |
| 6 | "This will take months" before starting; nobody asked | `communication-decisions.md` §4 requires estimates *for* a decided stretch; `prevent-overengineering.md` §5 bans under-delivery | **Gap inverted** — nothing says an unsolicited estimate may never precede or argue against starting |

**Root family:** patterns 1–4 and 6 are one failure — avoidance dressed as diligence or policy. Splitting them across five files scatters one failure mode; one file owns it, matching the repo-rule architecture's one-home principle.
<!-- /ANCHOR:coverage-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the six anti-patterns has either a named home (file+section) or an explicit "covered" verdict in the coverage map |
| REQ-002 | `repo-rules/answer-the-actual-request.md` exists with house frontmatter (title/description/trigger_phrases/importance_tier/contextType/version) and the six sections: warnings answer the ask; no silent reinterpretation; invented constraints; an honest no; estimates inform never gate; the first answer is the true one |
| REQ-003 | `REPO RULES.md` carries one new trigger-table row and one new index row naming the file, with no §4 widening needed (the file fits the existing "In" scope: how to think and act, honesty) |
| REQ-007 | `AGENTS.md` §8 carries one routing sentence naming the new file, so the reply-facing trigger loads on read-only turns where Gate 5 never fires |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `evidence-and-proof.md` §10 carries a sentence stating that a report which becomes honest only under interrogation failed when it was written |
| REQ-005 | `validate.sh <packet> --strict` prints `RESULT: PASSED`; the trigger index is regenerated and committed |
| REQ-006 | Every added line cross-cites an existing contract instead of restating it; no section duplicates text owned by another file |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent about to warn, narrow the ask, cite a constraint, decline, or open with an estimate has exactly one file that settles whether the move is honest.
- **SC-002**: The diff is additive: one new file, two router rows, one sentence, one §8 routing line; no rule text copied between files.
- **SC-003**: A future reader of the pasted complaint can map each of the six items to a rule section or an existing-coverage citation without further research.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The rule is misread as banning caveats, estimates, or refusals | Real caveats dropped; §4-required estimates skipped | §7 "what this rule is not" names all three exceptions explicitly |
| Risk | Sections drift from the files they cross-cite | Two versions of the same rule | Sections cite (`communication.md` §3, `scope-discipline.md` §1, `uncertainty-and-honesty.md` §2, `communication-decisions.md` §4, `evidence-and-proof.md` §10) and never restate the cited text |
| Risk | The new trigger row widens `REPO RULES.md`'s scope | The §4 boundary dissolves | The file's subject is "how to think and act" + honesty, already "In"; no widening paragraph added |
| Dependency | `CLAUDE.md` → `AGENTS.md` symlink; rule files govern every runtime | One wrong doctrine line propagates everywhere | Diff stays additive and small; rollback is `git checkout` / `rm` of working-tree files |
| Dependency | Pasted post text is the only analyzed source | Comment-level signal absent | The six behaviors are self-described in the paste; comments would add frequency data, not new shapes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The new file follows house structure exactly: frontmatter, routed-from line, "Fires when", "The rule", numbered sections, "What this rule is not", "Self-check".
- **NFR-M02**: No ephemeral artifact ids (spec paths, REQ/CHK ids, packet numbers) inside rule prose.

### Consistency
- **NFR-C01**: Each new-file section that overlaps an existing file cites that file's section rather than duplicating it — one home per rule.
- **NFR-C02**: The `REPO RULES.md` additions match the existing row grammar (action-verb triggers, "It settles" column).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Doctrine Boundaries
- **Real caveat**: a warning naming a failure that can actually happen stays — the rule removes only warnings guarding against nothing.
- **Requested estimate**: §5 bans the estimate-as-verdict nobody asked for, not the estimate a reader requests or `communication-decisions.md` §4 requires before a long stretch.
- **Genuine restriction**: a real constraint cited with its source is the honest form of the same sentence — the only form allowed to cite one.
- **Rule-file conflict**: the standard footer line holds — where the new file appears to permit what `AGENTS.md` restricts, `AGENTS.md` wins and the file is wrong.

### Adoption Boundaries
- **Trigger overlap**: the new row fires alongside `uncertainty-and-honesty.md` and `communication.md` rows — REPO RULES.md §1 says composition is normal, the more specific wins on conflict.
- **Non-agent readers**: the rule binds reply-writing, so it also governs spec docs and commit prose; nothing in it is chat-only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 1 new file, 2 edited files, 1 packet, 1 regenerated artifact |
| Risk | 10/25 | Doctrine-only, but the files govern every runtime's behavior |
| Research | 12/20 | Full read of AGENTS.md, REPO RULES.md, and all 12 rule files for the coverage map |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `uncertainty-and-honesty.md` §2's never-invent enumeration also list rules/policies? **DEFERRED: keeping the invented-constraint rule solely in the new file preserves one home; a second copy in §2 would need owning its drift.**
- Should `repo-rules/` join the trigger-index corpus so Gate 1 can surface rule files? **DEFERRED: Gate 5's trigger table is the designed discovery path; adding the corpus is a separate retrieval-policy decision.**
- Should pattern 5's loop get a self-check row in `evidence-and-proof.md` §12? **DEFERRED: the §10 sentence covers the rule; checklist rows are added when a failure recurs.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Precedent packet**: `specs/agents/006-restraint-and-routing-gates/` (same shape: audit then amend doctrine)
- **Bloat baseline**: `specs/agents/004-agents-md-bloat-audit/` (why AGENTS.md stays a router)
- **Analyzed source**: pasted Reddit r/ClaudeAI post `1wi6o5h` (operator-supplied text)
<!-- /ANCHOR:related-docs -->
