---
title: "Implementation Summary: Phase 2: Delegation and Orchestration Rule"
description: "The rule set gained a seventh file binding the delegating posture - orchestrate rather than author, brief with evidence, and let no single model verdict close a question, including your own. The router gained two rows plus a scope-boundary correction, because listing agent dispatch as out of scope would have left the router contradicting its own trigger table."
trigger_phrases:
  - "delegation rule shipped"
  - "orchestrate posture"
  - "router scope boundary"
  - "one model one opinion"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-repo-rules-router/002-delegation-orchestration-rule"
    last_updated_at: "2026-08-31T05:37:23Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Wrote and wired the delegation and orchestration rule, and corrected the router scope statement"
    next_safe_action: "Begin phase 3: read the executor contract, then bind the five-iteration research run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-delegation-orchestration-rule"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-delegation-orchestration-rule |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rule set now covers the act this repository leans on hardest and had no rule for:
handing work to something else. `repo-rules/delegation-and-orchestration.md` binds the
posture - orchestrate rather than author, brief with evidence rather than preference,
and treat no single model's verdict as an answer, including your own.

### The seventh rule

Nine sections, each grounded in a failure rather than a principle. The posture switch
names what changes the moment work leaves your hands, including the verification step
that did not exist before. The briefing section says to keep your expected conclusion
out of the prompt, because telling a delegate what you expect builds a machine for
confirming it. Section 4 splits factual questions, where one delegate plus your own
check is enough, from judgment questions, where one lens is not a finding and the file
prescribes three concrete moves instead of a caution. Section 6 turns the rule inward:
skipping delegation because you already know the answer is the same single-lens failure
with no paper trail.

The file names no model, no flag, no env var, and no version, so a CLI roster change
cannot invalidate a sentence in it. Executor mechanics stay where they are owned, and
the rule points there rather than copying.

### Router scope boundary

`REPO RULES.md` section 4 previously listed "agent dispatch" as out of scope for this
directory. Left alone, the router would have contradicted itself: a trigger row routing
a delegation action to a rule the scope statement said was not covered here. The
statement now draws the line where it actually falls - dispatch *mechanics* are out,
the posture held while dispatching is in.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `repo-rules/delegation-and-orchestration.md` | Created | The seventh rule, 164 lines, in phase 1's format |
| `REPO RULES.md` | Modified | One trigger row, one index row, and the section 4 scope-boundary correction |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Inventory first. `rg` across `AGENTS.md` and all six rule files showed what delegation
language already existed: `AGENTS.md` carries the mechanics (read the executor's
`SKILL.md` before composing a prompt; a finding is a hypothesis), and
`evidence-and-proof.md` section 7 carries the sub-agent-report case. Neither carries the
posture. The rule was written to expand that gap and to link to both rather than restate
either.

Then five checks, each recorded: a forbidden-token scan proving no executor mechanics
leaked in; a format check confirming 9 numbered headers, all uppercase, with 9 dividers;
link resolution over all four links in the file, with URL-encoded paths decoded before
testing; router row counts confirming 7 trigger rows, 7 index rows, 7 rule files; and a
diff-scope check confirming this phase touched exactly two paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct `REPO RULES.md` section 4 rather than write the rule around it | Adding a delegation rule under a scope statement that excludes dispatch would have left the router self-contradicting at the exact point a reader consults it |
| Draw the boundary at plumbing versus posture | It is the line that already existed implicitly - `AGENTS.md` owns which agent and which flags; nothing owned how to think while dispatching |
| Point at `cli-X/SKILL.md` instead of summarizing it | A dispatch flag copied into prose goes stale at the next CLI change, and this repository has already lost a session to exactly that |
| Split factual from judgment questions in section 4 | Requiring a second lens for every dispatch would be expensive and wrong; requiring it for judgment calls is the part that actually fails |
| Turn the rule inward in section 6 | A rule that only polices delegates would let the delegator's unchecked opinion through, which is the same failure with fewer witnesses |
| No fixed number of independent lenses | A number nothing earned is the unearned specificity `overengineering.md` exists to stop; the principle binds, the count is the orchestrator's |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Forbidden-token scan for executor mechanics | PASS - no model uid, CLI flag, env var, or version string in the file |
| Format conformance with phase 1 | PASS - 9 numbered headers, 9 uppercase, 9 dividers |
| Link resolution, URL-decoded | PASS - 4 of 4 links resolve, including `../REPO%20RULES.md` |
| Router row counts | PASS - 7 trigger rows, 7 index rows, 7 rule files |
| Diff scope for this phase | PASS - exactly `repo-rules/delegation-and-orchestration.md` and `REPO RULES.md` |
| Overlap inventory before drafting | PASS - `rg` over `AGENTS.md` and all rule files; the posture was genuinely uncovered |
| Clause audit: every section names a failure | PASS - sections 1 through 8 each name a concrete failure |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **164 lines, four over the parent packet's ~160 soft ceiling.** It is the longest rule in the set, one line above `evidence-and-proof.md` at 158. Recorded rather than trimmed, because the sections that would go are section 6 (the rule turned inward) and section 8 (what this is not), and both exist to stop a specific misreading.
2. **A third router edit was needed beyond the planned two rows.** The section 4 scope correction was not anticipated when the phase was planned. The packet's SC-003 claim - a new rule costs one file plus two router rows - held for the rows themselves, but the scope statement had to move too. That is a real amendment to the architecture claim, not a rounding error, and it is recorded in AC-009.
3. **Nothing enforces the posture.** The rule fires from a document instruction, like every sibling. An agent that never loads `REPO RULES.md` never sees it.
4. **The "diverge the lens" guidance is untested here.** Phase 3 runs a single executor family on operator instruction, which is exactly the case section 4 says to widen for a judgment question. The tension is recorded in that phase's open questions rather than resolved by quietly ignoring either.
<!-- /ANCHOR:limitations -->

---


