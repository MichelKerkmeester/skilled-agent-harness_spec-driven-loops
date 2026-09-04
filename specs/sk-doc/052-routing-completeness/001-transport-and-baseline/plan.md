---
title: "Implementation Plan: Phase 1: transport-and-baseline"
description: "The approach taken to name the governing routing transport: three reads of the dispatch chain rather than an output comparison, one gate-text fix verified against a cold daemon, and two reading rules frozen for later phases."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/001-transport-and-baseline"
    last_updated_at: "2026-09-02T19:56:10Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the approach taken and its verification commands"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "research/transport-finding.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-001-transport-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: transport-and-baseline

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the advisor scorer, Node for its CLI front door, Markdown for the output |
| **Framework** | The system-skill-advisor MCP server and its daemon |
| **Storage** | `skill-graph.sqlite`, read only |
| **Testing** | Live daemon calls plus targeted greps, with no test suite added |

### Overview

The question was settled by reading code rather than by running an experiment. Comparing the
two scorers' outputs shows that they differ, which was already known, and does not show which
one the runtime calls. Three reads of the dispatch chain answered that directly, and each one
is a path a reader can open.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (not applicable, since the phase adds no code)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A single scorer library behind two front doors. The advisor handler imports the scorer
in-process, and the CLI reaches the same scorer over a socket to the daemon.

### Key Components
- **`mcp-server/handlers/advisor-recommend.ts`**: imports `scoreAdvisorPrompt` from
  `../lib/scorer/fusion.js` at line 13. This is the read that names the governing scorer.
- **`hooks/lib/skill-advisor-cli-fallback.ts`**: the handler's only fallback. It speaks the
  same tool surface over a socket, so it is a transport rather than a second scorer.
- **`mcp-server/lib/scorer/fusion.ts`**: the comparator at line 749 blends command, intent and
  conflict adjustments into the sort key, none of which the reply exposes.
- **`mcp-server/scripts/skill_advisor.py`**: the Python scorer. Its one caller outside its own
  directory is a validation handler that sits off the routing path.

### Data Flow

A prompt reaches the advisor handler, which scores it in-process through the fusion module and
returns a ranked `recommendations` array. A caller using the CLI reaches the same scoring
through the daemon socket. Rank is the array order. The `confidence` field is clamped at a
floor of 0.82 for anything surfaced, and `score` carries the discriminating value.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The one behavioural edit in this phase is the Gate 2 manual fallback line in `AGENTS.md`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` Gate 2 fallback | Tells a person which command to run when no hook brief appears | Updated to name the daemon CLI | `4e66155b6c`, 2 insertions and 2 deletions |
| `mcp-server/scripts/skill_advisor.py` | The Python scorer, used by validation | Unchanged, and named in the gate text as a non-fallback | `grep -rn "skill_advisor.py" .opencode/skills/system-skill-advisor/hooks/lib/` returns no match |
| `.opencode/bin/skill-advisor.cjs` | The daemon-backed CLI the gate now names | Unchanged, and verified as the same scorer the hook consults | Daemon stopped, one call issued, which self-started it and answered |
| `research/transport-finding.md` | The citable record of the three reads | Created | `03f5db4876`, 65 lines |

Required inventories:
- Same-class producers: `rg -n 'skill_advisor.py' .opencode/skills/system-skill-advisor`.
- Consumers of changed symbols: `rg -n 'scorer/fusion' .opencode/skills/system-skill-advisor --glob '!dist/**'`.
- Matrix axes: transport (in-process handler, daemon CLI, Python command) by claim (which scorer,
  which rank source, which confidence reading).
- Algorithm invariant: rank is the order of the returned array, and no external re-sort can
  reconstruct it because the sort key uses adjustments the reply does not carry.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static read | The dispatch chain and the comparator | `grep`, direct file reads |
| Live probe | Floor and rank behaviour on real replies | `.opencode/bin/skill-advisor.cjs advisor_recommend` |
| Cold-start | The Gate 2 fallback answering from a stopped daemon | Daemon stopped, one CLI call issued |

Verification commands, all run from the repository root:

```bash
grep -rn "skill_advisor.py" .opencode/skills/system-skill-advisor/hooks/lib/
grep -n "scorer/fusion" .opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts
grep -n "let ranked = recommendations.sort" .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts
node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"dqi score"}' --format json --timeout-ms 60000
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor daemon | Internal | Green | No live probe, so the floor rule rests on a code read alone |
| `skill-graph.sqlite` | Internal | Green | Declared-signal extraction for phase 002 cannot start |
| `AGENTS.md` | Internal | Green | The written gate keeps naming a scorer that does not route |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The named transport turns out to be wrong, or the gate-text change sends readers to a command that does not answer.
- **Procedure**: `git revert 4e66155b6c` restores the previous Gate 2 fallback line. The finding document is additive and can be deleted without touching runtime behaviour.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read the chain) ──► Core (record the rules) ──► Verify (probe live)
                                     │
                                     └──► Gate 2 fallback fix
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify, Gate fix |
| Gate fix | Core | None |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | Reading three files in the dispatch chain |
| Core Implementation | Low | One 65-line finding document |
| Verification | Low | Four commands and one cold-start check |
| **Total** | | **One working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (not applicable, since the change is one documentation line under git)
- [x] Feature flag configured (not applicable, since no runtime toggle exists for this)
- [x] Monitoring alerts set (not applicable, since no service behaviour changed)

### Rollback Procedure
1. `git revert 4e66155b6c` to restore the previous Gate 2 fallback text.
2. Confirm `AGENTS.md` again names the previous command.
3. Re-read the finding document, since it stays true either way.
4. Notify nobody, since the change is internal to the repository's own instructions.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Read the chain   │───►│ Freeze the rules │───►│ Probe them live  │
└──────────────────┘    └────────┬─────────┘    └──────────────────┘
                                 │
                        ┌────────▼─────────┐
                        │ Gate 2 fallback  │
                        └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Dispatch-chain read | None | The named transport | The finding, the gate fix |
| Finding document | Dispatch-chain read | Floor rule, rank rule | Phase 002 method |
| Gate 2 fallback fix | Dispatch-chain read | One corrected instruction | None |
| Live probe | Finding document | Measured floor evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read the advisor handler import and its only fallback** - the read that names the scorer - CRITICAL
2. **Read the comparator in `fusion.ts`** - establishes the rank rule - CRITICAL
3. **Record both in `research/transport-finding.md`** - what phase 002 cites - CRITICAL

**Total Critical Path**: Three reads and one document.

**Parallel Opportunities**:
- The Gate 2 fallback fix and the live floor probe can run after step 1.
- The comparator read does not block the gate fix.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Transport named | A file and line resolve the governing scorer | `03f5db4876` |
| M2 | Reading rules frozen | Floor and rank rules recorded with evidence | `03f5db4876` |
| M3 | Written gate agrees with the automation | `AGENTS.md` names the daemon CLI | `4e66155b6c` |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The advisor daemon governs automatic routing

**Status**: Accepted

**Context**: Two scorers answer the routing question and disagree on roughly a third of
prompts, with the 0.8 invocation bar often falling between their answers.

**Decision**: The TypeScript scorer reached through the advisor daemon governs automatic
routing. The Python scorer validates and never routes. Every measurement in this packet calls
the daemon CLI.

**Consequences**:
- Routing numbers in this packet describe the path the runtime takes.
- A number produced through the Python command describes the manual path and has to say so.

**Alternatives Rejected**:
- Comparing the two scorers' outputs: shows that they differ, not which one the runtime calls.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] The phase scope in `spec.md` section 3 is read before any file is opened.
- [x] Every writable path is inside this phase folder, apart from the one `AGENTS.md` line.
- [x] Live probes read exit status from a file rather than through a pipe.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Read the dispatch chain before writing any claim about which scorer routes. |
| TASK-SCOPE | No scorer, weight or registry edit. The only runtime edit is the Gate 2 fallback line. |
| TASK-EVIDENCE | Every claim cites a file and line, a command with its output, or a commit. |

### Status Reporting Format

Report one line per task: the task id, its state, and the evidence that settles it. Evidence is
a command with its observed output, a `file:line`, or a commit sha.

### Blocked Task Protocol

A task is BLOCKED when the daemon does not answer or a cited path does not resolve. Record the
blocker in `tasks.md` beside the task, and stop rather than substituting an inferred answer.
