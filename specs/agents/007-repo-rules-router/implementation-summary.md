---
title: "Implementation Summary: Repo Rules Router and Thinking-Discipline Rule Snippets"
description: "AGENTS.md pointed at a REPO RULES.md that did not exist. This packet creates it as a router and backs it with six on-demand rule leaves covering restraint, scope, evidence, blast radius, root cause and honesty — adding zero lines to the always-loaded surface."
trigger_phrases:
  - "repo rules summary"
  - "rule router shipped"
  - "overengineering rule"
  - "thinking discipline rules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-repo-rules-router"
    last_updated_at: "2026-08-31T03:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped REPO RULES.md and six /repo-rules leaf documents"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "REPO RULES.md"
      - "repo-rules/overengineering.md"
      - "repo-rules/scope-discipline.md"
      - "repo-rules/evidence-and-proof.md"
      - "repo-rules/blast-radius.md"
      - "repo-rules/root-cause.md"
      - "repo-rules/uncertainty-and-honesty.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-31-agents-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Router location: root `REPO RULES.md` (settled by the existing `AGENTS.md:153` pointer)"
      - "Rule set: six leaves, thinking/acting only, skills excluded (operator, 2026-08-31)"
      - "`AGENTS.md` left unmodified — the pointer already binds"
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
| **Spec Folder** | 007-repo-rules-router |
| **Status** | Complete |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`AGENTS.md` line 153 has been telling every runtime to apply `REPO RULES.md` "when the repository has one". This repository did not have one. That hook is now live, pointing at a real router, backed by six rule documents that expand the operating discipline `AGENTS.md` could only afford to state as single table rows — and the always-loaded surface grew by zero lines, because nothing was added to `AGENTS.md` itself.

### The router — `REPO RULES.md`

You match on **the action you are about to take**, not the topic of the request, and the trigger table hands you exactly one file. That distinction is what makes it usable: "you are about to delete, overwrite, migrate" is something an agent can check against its own next tool call; "this is a risky task" is not.

The router holds no rules of its own. It carries a loading protocol (load before the action, not after; a file already in context is not re-read; two matches load both), a four-tier precedence ladder that puts `AGENTS.md` hard blockers above everything and states plainly that no rule file relaxes one, the trigger table, an index, and an explicit statement of what it does *not* cover — skill routing, workflow selection, spec-folder mechanics and agent dispatch all stay in `AGENTS.md`, so each has exactly one home.

### The six rules — `/repo-rules/`

Each leaf has the same four-part shape: `Fires when` (the actions that trigger it), `The rule` (one binding sentence), an expanded body, and a closing self-check. Each is readable standalone.

`overengineering.md` is the one the operator asked for by name. Its centre is a seven-rung restraint ladder from *build nothing* to *add a dependency*, with one hard condition: you may climb a rung only by writing the sentence that says what fails at the rung below, with a real symbol and a real caller in it. "It's cleaner" is not a failure; "a future caller might" is not a failure. Around that sit the pre-write pass, an expanded signal table, per-domain restraints for options, abstraction, error handling, defensive checks, tests, performance and dependencies, and a section stating what restraint is *not* — so it can never be read as licence to deliver less than the frozen scope.

The other five: `scope-discipline.md` (three drifts, adjacent-defect protocol, plan-deviation protocol, amendment over absorption), `evidence-and-proof.md` (observed/derived/inferred tiers, the four ways a green run lies, negative controls, baselines), `blast-radius.md` (stakes read, reversibility ladder, the rollback sentence, persistence boundaries), `root-cause.md` (the diagnostic loop, symptom-fix smells, the two-attempt rule, seam naming), and `uncertainty-and-honesty.md` (confidence bands, UNKNOWN, contradiction halts, honest close-out).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `REPO RULES.md` | Created | Router: loading protocol, precedence ladder, trigger table, index, scope statement (71 lines) |
| `repo-rules/overengineering.md` | Created | Restraint ladder, pre-write pass, signal table, per-domain restraints (155 lines) |
| `repo-rules/scope-discipline.md` | Created | Frozen scope, adjacent defects, plan deviation, amendments (131 lines) |
| `repo-rules/evidence-and-proof.md` | Created | Claim tiers, command evidence, baselines, final-state proof (135 lines) |
| `repo-rules/blast-radius.md` | Created | Reversibility, rollback sentence, persistence boundaries (128 lines) |
| `repo-rules/root-cause.md` | Created | Diagnostic loop, two-attempt rule, seam naming (146 lines) |
| `repo-rules/uncertainty-and-honesty.md` | Created | Confidence bands, UNKNOWN, contradiction halt, close-out (137 lines) |
| `specs/agents/007-repo-rules-router/*` | Created | Level 2 packet: spec, plan, tasks, acceptance criteria, this summary |
| `AGENTS.md` | **Unchanged** | Its §3 pointer already binds `REPO RULES.md`; SCOPE LOCK held |

### Post-review revision

A fresh reviewer with no session context audited the result and found one defect class wearing four hats: the leaves had been written as free-standing doctrine rather than as expansions bounded by a tier-1 document, so wherever the leaf author held an opinion it silently outranked `AGENTS.md`. Three leaves handed an agent permission `AGENTS.md` withholds — a pushed commit sat in the reversible tier against the fresh-go-ahead push policy, a "two-attempt rule" invented a retry count `AGENTS.md` explicitly says does not govern debugging, and a default-allow scope list widened Law 2 — while the router's own precedence table named two of the three §1 hard blockers. All four are fixed, and every leaf now opens with a bounding line stating that `AGENTS.md` wins wherever the two appear to disagree, so the class cannot recur silently.

The same pass removed five verbatim duplications of always-loaded text — the confidence table, six restraint-signal rows, the test-quality paragraph, the plan-deviation protocol and the finishing bullets — each a drift pair waiting to diverge, and each exactly what the prior bloat audit exists to prevent. It also closed one real gap: `AGENTS.md` §4's task-specific proof patterns had been dropped, so nothing told an agent to enumerate every variant before transforming, or to derive a computed answer a second way.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read `AGENTS.md` end to end first, then classified every existing `REPO RULES.md` reference to find out whether anything real consumed the name — one true consumer (`AGENTS.md:153`), four mentions scoped to a different repository's copy inside `sk-code`. That is what settled the router's location without a question: the path was already named, so choosing anything else would have left the live pointer dangling.

Selection of the six rules came from a pass over `AGENTS.md` §2, §3, §4 and §7 looking for rows that are correct but have no room to say *how* to apply them, minus everything skill-, workflow-, spec- and dispatch-related per the operator's exclusion. Router and leaves were authored against that one selection decision, so the trigger table and the `Fires when` blocks could not drift apart.

Verification was four mechanical checks plus a read-through, all run from the final state: link resolution, git-ignore visibility, an excluded-vocabulary sweep, and a structural section count. The sweep caught one real leak — `scope-discipline.md` §5 said "a named workflow", which was rewritten to "a named tool or procedure" — and the re-sweep came back clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Root `REPO RULES.md`, not `repo-rules/README.md` | `AGENTS.md:153` already names that exact path. Any other location leaves the live pointer dangling and needs an `AGENTS.md` edit to fix. |
| Router holds zero rule text | A rule change then touches exactly one file, and a seventh rule costs one new file plus two router rows. |
| Trigger on the action, not the topic | An agent can match "about to delete" against its own next tool call. It cannot reliably match "this is risky". |
| Expand `AGENTS.md`, never relocate from it | Moving a rule out creates a window where it lives in neither place. The rows stay authoritative; the leaves say how to apply them. |
| `AGENTS.md` left unmodified | The §3 pointer is already conditional and already fires. Editing an always-loaded 483-line document for no functional gain is exactly what SCOPE LOCK exists to prevent. |
| Six rules, not ten | Every leaf replaces an existing compressed `AGENTS.md` row. No rule was invented for a problem this repository has not had — which is the rule `overengineering.md` itself states. |
| Prose-style communication excluded | The operator scoped this to how the AI thinks and acts. `AGENTS.md` §8 governs how a reply reads. Honest close-out, which is an action, is carried in `uncertainty-and-honesty.md` §5. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Router link resolution — every `repo-rules/*.md` href tested with `[ -f ]` | PASS — 6 `OK`, 0 `MISSING` |
| Git visibility — `git check-ignore -v` on the new paths | PASS — exit 1, no ignore rule matches |
| Excluded-vocabulary sweep — `skill`, `workflow`, `spec folder`, `mcp`, `advisor`, `dispatch` across `repo-rules/` | PASS — `NO MATCHES` after one rewrite; `sub-agent` retained twice in `evidence-and-proof.md` deliberately, as an evidence-tier rule about treating a reported finding as a hypothesis |
| Structural conformance — one `Fires when`, one `The rule`, one self-check per leaf | PASS — `fires=1 rule=1 selfcheck=1` across all six |
| Cross-reference integrity | PASS — 9 reference lines across 8 distinct pairs, all pointing by filename rather than restating |
| Consumer inventory — `grep -rn "REPO RULES" . --include=*.md` | PASS — 5 hits: 1 real consumer (unchanged), 4 scoped to another repository |
| `validate.sh specs/agents/007-repo-rules-router --strict` | PASS — `RESULT: PASSED`, exit 0, Errors: 0 Warnings: 0. First run returned 5 errors (stale derived metadata, missing `description.json`, a narrative `next_safe_action`, a stale Spec Folder value) plus a `COMPLEXITY_MATCH` warning; all six were fixed and the whole gate re-run from the final state |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing enforces the rules.** The trigger is a document instruction, not a hook or a validator. A runtime that never reads `AGENTS.md` §3 never reaches any of this. Mitigated only by writing triggers on checkable actions; not solved.
2. **No per-stack conventions.** `REPO RULES.md` conventionally also carries lint commands, build gates and framework idioms. None are established for this repository, and inventing them would break the rule in `overengineering.md`. The router has room for them when they exist.
3. **`AGENTS.md` §3 still says "when the repository has one".** Now that it does, the pointer could be strengthened to a named load. Deferred to the operator rather than absorbed — `AGENTS.md` was outside this packet's frozen scope.
4. **MCP daemons were unavailable this session.** Spec Kit Memory and Skill Advisor both timed out, so Gate 1 trigger matching and post-save semantic indexing did not run. Packet docs authored and validated normally; the continuity fingerprint is the scaffold placeholder and would be refreshed by a `/memory:save` once the daemon is reachable.
<!-- /ANCHOR:limitations -->

---
