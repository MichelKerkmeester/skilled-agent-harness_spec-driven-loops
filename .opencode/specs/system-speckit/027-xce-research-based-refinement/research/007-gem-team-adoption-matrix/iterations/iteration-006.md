# Iteration 006: RQ6 diagnose-then-fix enforcement

**Focus:** RQ6 diagnose-then-fix enforcement  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.78.  
**Raw output:** prompts/iteration-006.out  ·  **Prompt:** prompts/iteration-006.prompt

### FINDINGS
| Sub-feature | gem-team mechanism (file:line) | spec-kit equivalent or GAP (file:line) | Verdict | Effort(S/M/L) | Net-new value |
| --- | --- | --- | --- | --- | --- |
| Planner-level debugger→implementer pairing | Planner must pair every debugger task with later `gem-implementer` task carrying `debugger_diagnosis` [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:64-66] | GAP: `@debug` is user-invoked only and not auto-dispatched/pair-planned [SOURCE: .opencode/agents/debug.md:42-50]; `@code` accepts an “orchestrator-provided diagnosis” but has no required pairing contract [SOURCE: .opencode/agents/code.md:119-122] | ADAPT | M | High: converts prose/root-cause discipline into a schedulable handoff invariant. |
| Orchestrator pre-wave schema gate | Gate verifies `debugger_diagnosis` has `root_cause`, `target_files`, `fix_recommendations`; missing blocks, confidence `<0.85` escalates [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:66-67] | GAP: spec-kit verifies root-cause evidence and phase order at debug delivery, not as an orchestrator pre-wave schema gate [SOURCE: .opencode/agents/debug.md:481-498]; general confidence discipline exists but is prose-level [SOURCE: AGENTS.md:38-42] | ADAPT | L | High: strongest net-new enforcement, but threshold should align with spec-kit confidence model rather than copy `0.85` blindly. |
| Implementer Bug-Fix Mode diagnosis validation | Implementer validates `debugger_diagnosis` first; missing fields return `needs_revision`; wrong diagnosis returns contradiction evidence [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/.apm/agents/gem-implementer.agent.md:110-123] | Partial equivalent: `@code` surgical fix mode returns root cause, before/after failure evidence, and verification, but does not validate a structured diagnosis object [SOURCE: .opencode/agents/code.md:119-129]; `@debug` Phase 5 verifies root cause before fixing [SOURCE: .opencode/agents/debug.md:307-317] | ADAPT | M | High: adds a useful fail-closed contract to `@code` when a debug handoff is supplied. |
| Reviewer verifies pairing | Reviewer plan review verifies diagnose-then-fix pairing for all debugger tasks [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:68] | GAP: `@review` is read-only, and `@debug` has pre-delivery checks, but no reviewer checklist item for debugger→fixer pairing [SOURCE: AGENTS.md:341-342]; debug checklist checks phase/root-cause quality, not cross-agent pairing [SOURCE: .opencode/agents/debug.md:481-498] | ADAPT | S | Medium: cheap checklist addition that closes orchestration drift. |

- [F-006-01] Gem Team’s multi-level enforcement is net-new versus spec-kit’s current prose/agent-local discipline: Gem has planner, orchestrator, implementer, and reviewer checks [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:64-68], while spec-kit has strong ordered diagnosis inside `@debug` but no machine-checked `debugger_diagnosis` handoff contract [SOURCE: .opencode/agents/debug.md:142-159].
- [F-006-02] Spec-kit’s `@debug` equivalent is methodologically stronger than Gem’s debugger in adversarial reasoning: it requires observe/analyze/hypothesize/validate/fix and Phase 4 challenge before fixing [SOURCE: .opencode/agents/debug.md:271-303], while Gem debugger produces structured RCA fields and never implements [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/.apm/agents/gem-debugger.agent.md:87-97].
- [F-006-03] The main adoption value is not “diagnose before fix” itself; spec-kit already requires understanding/root-cause discipline [SOURCE: AGENTS.md:53-60] and forbids changes without root-cause understanding [SOURCE: .opencode/agents/debug.md:521-523]. The value is a populated handoff object that downstream agents can reject when absent or incomplete [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/.apm/agents/gem-implementer.agent.md:112-123].
- [F-006-04] `debug-delegation.md` is the closest spec-kit artifact, but it is a narrative handoff template with current theory and next steps [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:77-97], not Gem’s typed `root_cause`/`target_files`/`fix_recommendations` gate [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/AGENTS.md:65-67].

### NEGATIVE / RULED-OUT
Reject replacing `@debug` with Gem’s strict “debugger diagnoses only, implementer always fixes” split. Gem debugger explicitly never implements [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/gem-team-main/.apm/agents/gem-debugger.agent.md:117-120], while spec-kit intentionally allows `@debug` Phase 5 to make the smallest scoped fix after validated hypotheses [SOURCE: .opencode/agents/debug.md:307-317].

Reject copying the `confidence < 0.85` threshold verbatim. Spec-kit’s existing confidence rule uses an 80% clarification threshold [SOURCE: AGENTS.md:38-42], so the mechanism should be adapted to that model.

### OPEN QUESTIONS
Is the adoption target expected to add this as an orchestrator/task schema only, or also as a `debug-delegation.md` template/schema upgrade?

The repo `.claude/CLAUDE.md` only contains search-routing enforcement, not diagnose-before-fix discipline [SOURCE: .claude/CLAUDE.md:3-5]; the cited diagnose equivalent appears in `AGENTS.md` and `@debug`.

### METRICS
newInfoRatio: 0.78  
novelty: Gem Team adds materially new machine-checked handoff enforcement around an existing spec-kit diagnostic discipline.  
status: complete  
focus: RQ6 diagnose-then-fix enforcement
