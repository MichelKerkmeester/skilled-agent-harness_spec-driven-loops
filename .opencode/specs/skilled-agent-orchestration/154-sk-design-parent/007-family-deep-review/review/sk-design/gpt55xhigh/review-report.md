# Deep Review Report: sk-design

## Executive Summary

Verdict: FAIL

The review completed five iterations against `.opencode/skills/sk-design` and stopped at `maxIterationsReached`. No P0 blocker was confirmed, but three active P1 findings remain and the hard traceability gates (`spec_code`, `checklist_evidence`) fail. That makes PASS illegal under the review contract even though the security pass found no issue.

- Scope: skill package `.opencode/skills/sk-design`, shared references, graph metadata, parent packet traceability context.
- Active findings: P0=0, P1=3, P2=1.
- hasAdvisories: true.
- Release readiness state: in-progress.
- Stop reason: maxIterationsReached.
- Code graph: unavailable at startup; review used direct Read/Grep/Glob fallback evidence.

## Planning Trigger

Open a remediation plan before shipping the family as validated. The required work is not implementation-heavy, but it is release-readiness-significant: the SPEC child route names the wrong current child, the terminal validation packet overstates completion, and the configured 007 review packet is absent.

## Active Finding Registry

| ID | Severity | Dimension | Finding | Evidence | Status |
|---|---|---|---|---|---|
| F001 | P1 | correctness | SPEC route points at non-current `sk-design-spec` child. | `.opencode/skills/sk-design/SKILL.md:93`, `.opencode/skills/sk-design/SKILL.md:146`, `.opencode/skills/sk-design/SKILL.md:333`, `.opencode/skills/sk-design/SKILL.md:350`, `.opencode/skills/sk-design/graph-metadata.json:15-18` | active |
| F002 | P1 | traceability | Terminal validation phase claims complete while evidence is still planned and unchecked. | `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/spec.md:55`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/spec.md:62`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/tasks.md:56-68`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/tasks.md:88-92`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/implementation-summary.md:62-64`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/implementation-summary.md:129-137` | active |
| F003 | P1 | traceability | Configured 007 review spec folder is absent from the phase-parent packet. | `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/spec.md:98-105`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/graph-metadata.json:6-12` | active |
| F004 | P2 | maintainability | Resource-loading table says ALWAYS loads none, but pseudocode always loads `anti_slop_principles`. | `.opencode/skills/sk-design/SKILL.md:77-81`, `.opencode/skills/sk-design/SKILL.md:115`, `.opencode/skills/sk-design/SKILL.md:212` | active advisory |

## Remediation Workstreams

1. Fix current SPEC route truth.
   - Resolve F001 by changing the parent router's SPEC route to `sk-design-md-generator` until a real `sk-design-spec` child exists, or create/onboard `sk-design-spec` and update graph metadata consistently.
   - Re-run design-domain routing probes after the change.
2. Repair validation packet truth.
   - Resolve F002 by either executing the 006 validation work and replacing planned verification rows with observed evidence, or downgrading the phase status/summary back to in-progress.
   - Mark tasks only when evidence is present.
3. Create or rebind the review packet.
   - Resolve F003 by creating `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/007-family-deep-review` with the required docs, or rerun this lineage against an existing spec folder.
4. Clean advisory doc drift.
   - Resolve F004 by aligning the resource-loading table with the pseudocode, or changing the pseudocode so it truly loads no parent resource before selecting a child.

## Spec Seed

Minimal spec update for remediation:

- Requirement: SPEC/design-artifact prompts must resolve to a current shipped child.
- Acceptance: `DESIGN.md` extraction/authoring prompts resolve to `sk-design-md-generator` until `sk-design-spec` exists; SKILL.md, graph metadata, and advisor routing agree.
- Requirement: completion claims in the 154 terminal validation phase must be backed by observed evidence.
- Acceptance: task completion marks and implementation-summary verification rows contain real command/result evidence, not planned PASS text.
- Requirement: deep-review lineage spec folder exists or the review config points to an existing packet.
- Acceptance: configured spec folder contains at least `spec.md`, `plan.md`, `tasks.md`, and an implementation-summary/checklist surface appropriate for the level.

## Plan Seed

1. Patch `.opencode/skills/sk-design/SKILL.md` SPEC route references and related text to the current child, or onboard `sk-design-spec` fully.
2. Update `.opencode/skills/sk-design/graph-metadata.json` only if the chosen child relationship changes.
3. Reconcile `006-integration-validation` status, tasks, and implementation-summary with real validation evidence.
4. Create or correct `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/007-family-deep-review` before re-running this review.
5. Re-run advisor probes and recursive validation after fixes.

## Traceability Status

| Protocol | Level | Gate | Status | Evidence | Finding Refs |
|---|---|---|---|---|---|
| spec_code | core | hard | fail | `.opencode/skills/sk-design/SKILL.md:93`, `.opencode/skills/sk-design/SKILL.md:146`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/spec.md:55`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/spec.md:98-105` | F001, F002, F003 |
| checklist_evidence | core | hard | fail | `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/tasks.md:56-68`, `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/tasks.md:88-92` | F002 |
| skill_agent | overlay | advisory | pass | `.opencode/skills/sk-design/SKILL.md:338-342`; no explicit agent/command entry-point matches found | none |
| feature_catalog_code | overlay | advisory | partial | `.opencode/skills/sk-design/SKILL.md:87-94`, `.opencode/skills/sk-design/graph-metadata.json:8-33` | F001 |
| playbook_capability | overlay | advisory | partial | `.opencode/skills/sk-design/SKILL.md:319-324`; no `manual_testing_playbook/` subtree exists | none |

## Deferred Items

- F004 can be handled after F001-F003 because it is advisory and does not block release readiness by itself.
- No security finding was emitted; rerun security if future fixes add scripts or executable assets to the parent skill.
- The requested executor `cli-opencode model=openai/gpt-5.5-fast` was recorded but not spawned because self-invocation from inside OpenCode is prohibited without explicit parallel-detached wording.

## Audit Appendix

### Iteration Table

| Iteration | Focus | New Ratio | New Findings | Verdict |
|---:|---|---:|---|---|
| 001 | correctness | 1.00 | F001 P1 | CONDITIONAL |
| 002 | security | 0.00 | none | PASS |
| 003 | traceability | 1.00 | F002 P1, F003 P1 | CONDITIONAL |
| 004 | maintainability | 1.00 | F004 P2 | PASS |
| 005 | stabilization-replay | 0.00 | none | PASS |

### Convergence Replay

- Dimensions covered: 4/4.
- Required core protocols covered: yes, but both hard gates fail.
- Active P0: 0.
- Active P1: 3.
- Active P2: 1.
- Claim adjudication: pass for F001, F002, F003.
- Legal PASS: blocked by active P1 findings and hard traceability failures.
- Terminal stop: maxIterationsReached.

### File Coverage Matrix

| File | Coverage |
|---|---|
| `.opencode/skills/sk-design/SKILL.md` | full |
| `.opencode/skills/sk-design/references/anti_slop_principles.md` | full |
| `.opencode/skills/sk-design/references/cognitive_laws.md` | full |
| `.opencode/skills/sk-design/references/design_token_vocabulary.md` | full |
| `.opencode/skills/sk-design/graph-metadata.json` | full |
| `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/spec.md` | partial |
| `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/graph-metadata.json` | partial |
| `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/spec.md` | partial |
| `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/tasks.md` | partial |
| `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/006-integration-validation/implementation-summary.md` | partial |

### Entry-Point Search

- `.opencode/agents`: no `sk-design` references found.
- `.opencode/commands`: no `sk-design` references found.
- `.claude/agents`, `.codex`, `.agents`: no `sk-design` entry-point references found.

### Advisor Probe Snapshot

- DESIGN.md extraction prompt recommended `sk-design-md-generator` first and `sk-design` second.
- Generic visual-direction prompt recommended `sk-design` first and `sk-design-interface` second.
- Motion prompt recommended `sk-design-motion` first.
- Audit prompt recommended `sk-design-audit` first.
- Foundations prompt recommended `sk-design-foundations` and `sk-design-interface` at near-tie confidence, with ambiguity flagged.

### Verdict

Final verdict: FAIL
