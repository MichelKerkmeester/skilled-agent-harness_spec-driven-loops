---
title: "Decision Record: 094 - RCAF-vs-natural-human heuristic"
description: "ADR for the rubric cli-codex applies per scenario when naturalizing canonical Prompt fields across all manual_testing_playbook packages."
trigger_phrases:
  - "094 decision record"
  - "rcaf heuristic adr"
  - "natural human prompt heuristic"
importance_tier: "high"
contextType: "doc-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/094-playbook-prompt-naturalness"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored ADR for the heuristic"
    next_safe_action: "Apply Phase A sk-doc edits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: 094 - RCAF-vs-natural-human heuristic

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Default canonical playbook Prompt to natural-human voice; reserve RCAF for orchestrator-as-actor scenarios

**Status**: Accepted (2026-05-07)

**Context**:
The repo has 16 manual_testing_playbook directories with ~498 per-feature scenarios. Every scenario pins a canonical `Prompt:` (or `RCAF Prompt:`) field that's tested for byte-equality against the 9-col scenario table cell. The current convention defaults to RCAF (Role-Context-Action-Format) form: "As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}."

The user observed: "The prompts often start with 'As a ....' But that usually won't be added by real humans in normal queries." Real human prompts to an AI are direct: "review my PR", "commit my changes", "fix this bug", "explain what this does". RCAF reads as a templated wrapper around a simple human request.

Inventory of all 16 playbooks shows the existing scenarios already capture both voices: the `Real user request:` field is consistently natural, while the `Prompt:` field is consistently RCAF. The two forms diverge from the same scenario, which is informative — RCAF isn't more accurate, it's more formal.

**Decision**:
The canonical `Prompt:` field defaults to natural-human voice. RCAF is reserved for scenarios where the actor IS an AI orchestrator delegating to another tool/AI/agent.

The rubric cli-codex applies per scenario:

| Use **RCAF** ("As a {ROLE}...") when… | Use **natural-human** when… |
|---|---|
| The actor IS an AI orchestrator delegating to another tool/AI/agent (cross-CLI delegation, multi-agent dispatch, agent handback). | A human is asking the AI directly in conversation. |
| Safety-refusal scenarios where the role context (e.g., "git safety reviewer") changes the expected behavior. | Code review on a PR, commit my changes, start a feature, fix a bug, explain this code, run this analysis. |
| Internal validation contracts where the orchestrator IS the operator (e.g., "validation operator validates context retrieval against …"). | Most of `Real user request:` field content already in the playbook — that field IS the natural form. |
| The scenario explicitly tests AI-agent permissions, scope, or read-only constraints (e.g., "@review stays read-only"). | Workflow questions ("how should I approach X?"), preference questions ("which model should I use?"). |

**When in doubt: prefer natural-human.** RCAF is the exception, natural is the default.

**Voice guidelines for natural-human prompts**:
- Imperative or interrogative ("Review this PR for security issues", "Why is this test flaky?", "Help me start an OAuth feature").
- Compact enough for a 9-col table cell (single sentence, ideally <25 words).
- Specific to the test scenario — not "do a code review" but "Review this auth diff and flag any P0 blockers".
- Match voice to the existing `Real user request:` field but more compact.

**Voice guidelines for RCAF when retained**:
- Keep the canonical "As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}." structure.
- The Role must be an AI orchestrator role (e.g., "external-AI conductor", "git safety reviewer", "validation operator"), NOT a generic human role like "developer" or "engineer".

**Consequences**:

*Positive*:
- Playbooks read like real human-AI interactions, making them more useful as regression tests.
- Operators running scenarios get prompt phrasing closer to what they'd actually use.
- Cross-AI scenarios (where RCAF is genuinely needed) become more visible because they're the exception, not the default.
- New playbooks created via `/create:testing-playbook` default to natural voice automatically.

*Negative*:
- One-time refactor cost: ~280 prompts updated across 16 playbooks (~3 hours wall-clock via cli-codex medium fast).
- Risk of misclassification: cli-codex might convert an orchestrator-scenario to natural form, losing the testing contract. Mitigated by the rubric being explicit and orchestrator spot-check on 5 random per playbook.
- Heuristic introduces a small judgment call per scenario; not strictly mechanical.

**Alternatives Rejected**:

*Option B: Keep RCAF as the universal default*. Rejected because user feedback is direct and clear; ~56% of scenarios feel formulaic; the existing `Real user request:` field already proves the natural form is preferred when one is forced to pick.

*Option C: Author a third "Natural User Prompt" field alongside RCAF Prompt and Real user request*. Rejected as field bloat; the playbook contract already has too many fields; the right move is to make the canonical Prompt field flexible, not add another.

*Option D: Mechanical regex strip of "As a X, " prefix from all prompts*. Rejected because it discards the genuine RCAF cases (cross-CLI delegation, etc.) and the resulting prose is often grammatically broken.

*Option E: Update sk-doc templates only and leave existing playbooks as-is*. Rejected because the user explicitly asked for "every single playbook in the repo" — the existing prompts are the visible regression coverage and need to be naturalized too.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: cli-codex (gpt-5.5 medium fast) is the executor for Phase B refactors

**Status**: Accepted (2026-05-07)

**Context**:
~498 files need targeted prompt-field rewrites. The work is well-bounded (per-scenario classification + dual-location update), templated (heuristic rubric is explicit), and reversible (no code changes, no destructive ops). The orchestrator could do this work directly via Edit tool calls but it would consume orchestrator context for hundreds of small edits.

**Decision**:
cli-codex with `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` (DEFAULT shape per cli-codex SKILL.md and per user direction this turn). One dispatch per playbook; sequential (per memory rule about parallel CLI unreliability). system-spec-kit (321 files) split into 23 per-category dispatches.

**Consequences**:
- Trades latency (~3h total) for orchestrator context preservation and consistent application of the heuristic.
- cli-codex sees the full per-feature file context and can classify per-scenario without orchestrator round-trips.
- Each dispatch is idempotent and re-runnable.

**Alternatives Rejected**:

*Option B: Orchestrator does all edits directly*. Rejected because ~498 sequential Edit calls would consume context heavily; cli-codex is the right tool for bounded mechanical-with-judgment work at this scale.

*Option C: cli-codex high reasoning (slower, deeper)*. Rejected because medium suffices for the heuristic — classification is well-defined; high adds latency without quality gain on this task. (Contrast packet 093 where prose authoring justified high.)
<!-- /ANCHOR:adr-002 -->
