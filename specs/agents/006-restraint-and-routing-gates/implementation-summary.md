---
title: "Implementation Summary: Pre-Write Restraint and Artifact Routing in AGENTS.md"
description: "Nine edits landed in root AGENTS.md so the restraint doctrine that already lives inside sk-code fires before the first write, plus three rules that had no home anywhere: test-creation restraint, doctrine amendment, and comprehension routing."
trigger_phrases:
  - "implementation summary"
  - "restraint routing"
  - "agents.md"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-restraint-and-routing-gates"
    last_updated_at: "2026-08-29T13:43:03Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Landed nine edits, then seven fixes from an independent review"
    next_safe_action: "Packet complete; commit when the operator is ready"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/sk-code/shared/references/universal/code-quality-standards.md"
      - ".opencode/skills/sk-code/sk-code-review/assets/test-quality-checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-agents-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Pre-Write Restraint and Artifact Routing in AGENTS.md

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-restraint-and-routing-gates |
| **Completed** | 2026-08-29 |
| **Level** | 2 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nine line-level edits to the root `AGENTS.md`: six added rules and three tightened existing lines. The file went from 542 to 548 lines; `git diff --numstat` reports 9 insertions and 3 deletions.

The change divides into three kinds.

**Reachability (3 rules).** The framework already owned a Design Restraint Ladder, a test-quality checklist, and a documentation router — all of them inside skills that only load once the advisor fires at 0.8 or higher. Since advisor confidence is a property of the prompt rather than of what the agent is about to write, a low-scoring prompt reached the first write with no restraint loaded. Gate 2 now carries an artifact trigger that binds on artifact type instead: the first code write resolves an `sk-code` surface and mode, the first markdown write resolves an `sk-doc` mode, and spec-folder documents route to `system-spec-kit` instead. Section 4 gained a one-line summary of the ladder's six rungs with its authority cited, and a systems-first bullet that reframes the existing SYSTEMS and SCOPE lenses as a pre-write pass rather than a post-hoc review.

**Net-new rules (3).** Three behaviors had no home anywhere in the framework. Test-creation restraint now sits in Quality Principles, phrased as a per-test earning test rather than a budget, and explicitly governing only tests beyond the coverage bar. A fourth step under `PLAN-WORKFLOW LOCK` directs the agent to follow a skill's contract for the current task while naming the file, rule, and replacement when that contract is genuinely wrong — closing the gap where the lock said only "obey" and left a silent workaround as the path of least resistance. A rule in section 8 routes reader-comprehension failure to `sk-communication`, which is on the advisor's route-exclusion denylist and therefore unreachable by recommendation.

**Tightenings (3).** The Gate 2 output and skip lines absorb the artifact trigger. The repeat-attempt bullet under Debugging and Iteration changed from "change the approach" to an explicit instruction to restate the problem at the interface, data flow, or module boundary, and treats a fix that only special-cases a caller as evidence the seam is wrong.

### Post-review revision

An independent adversarial review by a second model found six defects in the first pass; all were verified against the real files before acting, and seven lines were rewritten in place with no net line growth.

The load-bearing one: the trigger told the agent to name an `sk-code` mode before writing code, but the registry has no acting mode for that moment — the only workspace-mutating workflow mode is the post-implementation author gate, and every surface packet is read-only. Worse, naming any mode taxonomy at all couples a document that is symlinked into every repository to one repository's mode list. The rule now names the SKILL and defers every level below it to that repo's own router, which is what the always-loaded doc could always safely assert.

The other five: routing now means LOADING what the router resolves, not emitting a route label; the seam instruction requires naming the affected files and asking, because SCOPE LOCK still binds and the code skill's repeated-failure stop still applies; the ladder says implement the frozen scope AND raise the amendment, removing an "instead" that read as permission to drop work; the test rule names its floor (happy path plus one edge case per public surface) instead of gesturing at an undefined bar, and cites the mode-agnostic universal contract rather than a mode-local checklist; and the comprehension rule is explicitly exempt from the closing caveat that would otherwise let a dense answer stand.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read `AGENTS.md` and the three candidate source skills first, mapped each operator ask against existing coverage, then applied all nine edits in one exact-match script that aborts unless every needle matches exactly once. Verified from the final state: header sequence, diff size, pointer resolution, and rung-order drift.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Name the skill, never its modes | This file is symlinked into every repository, and each repo's skill can define its own surfaces, modes, and packets. Any taxonomy written here is a coupling that goes stale in every other consumer. The reviewer's own proposed fix made this worse by pinning a surface-plus-phase pair; the operator caught it. |
| Tighten Gate 2 rather than add a sixth gate | Operator choice. A new hard gate adds per-turn friction on trivial edits without adding reach; Gate 2 already carries the REQUIRED weight the trigger needs. |
| Point at contracts instead of copying them | `AGENTS.md` is unconditional context in every runtime, so detail here is permanent cost and drifts from the skill that owns it. A prior bloat audit of this same file exists precisely because copied detail accumulated. |
| Phrase test restraint as an earning test, not a budget | A line-count budget would ship real coverage gaps as compliance. "Fails for one real reason no current test catches" screens the redundant test without touching the required one. |
| Amendment proposes, never licenses | The step keeps "follow it for this task" so it cannot be read as permission to deviate; the amendment is a proposal in the same response. |
| Additions only, no offsetting trims | Operator choice. Mixing a removal pass into this diff would make both halves harder to review, and the earlier audit's held candidates were held after verification. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Header sequence | `grep -nE '^## [0-9]+\.' AGENTS.md` | 1..10 in order, unchanged |
| Diff size | `git diff --numstat AGENTS.md` | 9 insertions, 3 deletions, within the twelve-line budget |
| Line growth | `grep -c '' AGENTS.md` | 542 to 548, six physical lines |
| Negative control | pre-edit grep for each net-new phrase | 0 hits for restraint ladder, Artifact trigger, earns its place, sk-communication, seam, YAGNI, test-quality |
| Pointer resolution | per-path existence loop over all five cited paths | all present |
| Rung drift | rung order in `code-quality-standards.md` versus the summary | identical order, YAGNI through minimum code |
| Packet validity | `validate.sh <folder> --strict` | exit 0, Errors: 0, Warnings: 0, RESULT PASSED |
| Scoped diff | `git status --short AGENTS.md specs/agents/` | only `AGENTS.md`, the parent graph metadata, and the new packet folder |
| Independent review | `cursor-agent --model cursor-grok-4.6-xhigh --mode ask` | 24566 bytes of ranked findings; 6 confirmed against source, 7 lines rewritten |
| Repo-agnostic audit | `grep -nE 'sk-code-[a-z]+\|surface=\|phase=' AGENTS.md` | no hit in any added line; sole match is pre-existing line 518 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The artifact trigger is prompt-time discipline, not a machine gate. Unlike Gate 3, no classifier enforces it; a runtime that wants enforcement would need hook work outside this packet's scope.
- Effectiveness is unmeasured. Whether the trigger reduces over-engineering in practice can only be observed across future sessions, not proven by this diff.
- The skip clause ("single-line edit to a file already read this session") relies on the agent's own judgment of what counts as single-line.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- The planned reframe of the Analysis Lenses table heading was dropped. The systems-first bullet already names the SYSTEMS and SCOPE lenses as a pre-write pass, so editing the table heading as well would have restated the same instruction in two places for no added reach. Net effect: nine edits instead of the ten originally sketched.
- The canonical metadata generator aborted on this session (it reconstructs evidence from a session transcript it could not read), so `graph-metadata.json` was produced by calling `refreshGraphMetadataForSpecFolder` directly and `description.json` was authored to the published schema. Both are tool-shaped, not hand-guessed: the fingerprint comes from the generator itself.
- Registering this packet in the track's `graph-metadata.json` also pulled in `003-communication-quality`, which the tool found missing from `children_ids`. That is pre-existing drift the deriver corrected on its own. The same refresh overwrote the track's curated `key_topics` and `causal_summary` with generic placeholders, because a bare track folder has no `spec.md` to derive from; both fields were restored, leaving the parent diff to children, timestamp, and fingerprint only.
<!-- /ANCHOR:deviations -->
