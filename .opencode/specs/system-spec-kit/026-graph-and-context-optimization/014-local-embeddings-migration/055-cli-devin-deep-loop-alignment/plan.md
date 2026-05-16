---
title: "Plan: 059 cli-devin deep-loop alignment"
description: "5-phase plan: scaffold + gpt-5.5 review, commands, agents, cli-devin skill+references+assets, verify+commit."
trigger_phrases:
  - "059 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/055-cli-devin-deep-loop-alignment"
    last_updated_at: "2026-05-15T19:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote 5-phase plan"
    next_safe_action: "gpt-5.5 review"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:c519ddcb009267a78533d75c25e1891575e692368213ae33c7a6adab6381c3d4"
      session_id: "059-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 059 cli-devin deep-loop alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML + JSON; sonnet @markdown writes; cli-codex (gpt-5.5 xhigh fast) reviews scaffold |
| **Framework** | Direct surgical edits driven by the 056+058 retrospective (no new iter loop needed) |
| **Storage** | n/a |
| **Testing** | sk-doc validate per file; agent-config JSON parse check; strict-validate packet |

### Overview

5 phases:

1. **Scaffold + gpt-5.5 review** — packet files done; cli-codex review surfaces design flaws before execution
2. **Command updates** — extend deep-research + deep-review executor enum to cli-devin
3. **Agent updates** — add SWE-1.6 iter contract subsection to @deep-research + @deep-review
4. **cli-devin updates** — SKILL.md section + 2 new references + 3 new assets
5. **Verify + commit** — sk-doc validate all touched files; sonnet double-check; commit on main
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 058 + 056 packets shipped
- [x] cli-devin SKILL.md authority + sk-doc validator available
- [x] Retrospective findings captured (in conversation; will write to `research/retrospective.md` Phase 1)

### Definition of Done
- [ ] gpt-5.5 review complete; findings incorporated or explicitly deferred
- [ ] 2 commands updated
- [ ] 2 agents updated
- [ ] cli-devin SKILL.md updated + 2 references + 3 assets created
- [ ] All touched files validate clean
- [ ] Strict-validate packet PASS
- [ ] Sonnet @markdown + @review double-check 0 P0
- [ ] Single primary commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

No deep-loop iter run this packet — the 056+058 retrospective IS the research. Sonnet @markdown applies surgical edits in 3 batches (commands / agents / cli-devin skill+refs+assets) using the retrospective as the authoritative source.

### Key Components

- **cli-codex review dispatcher**: `codex exec --model gpt-5.5 -c model_reasoning_effort="xhigh" -c service_tier="fast" --sandbox workspace-write <prompt> </dev/null`
- **Sonnet @markdown dispatcher**: `Agent({ subagent_type: 'markdown', prompt: ... })` Task tool, 3 batches
- **Retrospective**: `research/retrospective.md` captures the 7 lessons + 4 actionable surfaces
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold + gpt-5.5 review
- [x] 7 packet files
- [ ] Author `research/retrospective.md` from in-conversation findings
- [ ] Dispatch cli-codex gpt-5.5 xhigh fast review
- [ ] Capture review findings; incorporate into spec/plan or explicitly defer

### Phase 2: Command updates
- [ ] Add `cli-devin` to executor enum in `deep-research.md` (lines 79, 124, 137) + sister places
- [ ] Same for `deep-review.md`
- [ ] Update YAML dispatch switch (assets/spec_kit_deep-research_auto.yaml + spec_kit_deep-review_auto.yaml if exists) to handle cli-devin shape: `devin -p --prompt-file ... --model swe-1.6 --permission-mode auto </dev/null`
- [ ] Per-file sk-doc validate

### Phase 3: Agent updates
- [ ] Add "SWE-1.6 Iter Contract" subsection to `@deep-research` agent (inside SMART ROUTING)
- [ ] Same for `@deep-review` agent
- [ ] Per-file sk-doc validate

### Phase 4: cli-devin updates
- [ ] Add "Deep-Loop Iter Contract" section to cli-devin SKILL.md (between §2 SMART ROUTING and §3 HOW IT WORKS)
- [ ] Create `cli-devin/references/deep-loop-iter-contract.md` (canonical 7-lesson reference)
- [ ] Create `cli-devin/references/agent-config-recipes.md` (catalog of the 2 JSON recipes + usage examples)
- [ ] Create `cli-devin/assets/deep-loop-iter-template.md` (per-iter prompt template with named sections for research-survey, review-critique, synthesis)
- [ ] Create `cli-devin/assets/agent-config-deep-research-iter.json` (SWE 1.6 + read-only tools + research system instructions)
- [ ] Create `cli-devin/assets/agent-config-deep-review-iter.json` (SWE 1.6 + narrower tool allowlist + review system instructions)
- [ ] Smoke-test each agent-config JSON with `devin -p --agent-config <path> "test prompt" --print </dev/null` (light smoke test only)

### Phase 5: Verify + commit
- [ ] sk-doc validate all touched files
- [ ] Strict-validate 059 packet
- [ ] Sonnet @markdown + @review parallel double-check
- [ ] Patch any P0
- [ ] Backfill implementation-summary
- [ ] Final commit on main: `feat(014/059): cli-devin deep-loop alignment across 6 surfaces (commands + agents + cli-devin skill+refs+assets)`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| sk-doc compliance | Per touched file | `validate_document.py` |
| JSON parse | 2 agent-config files | `python3 -c "import json; json.load(open(...))"` |
| Agent-config smoke | Each JSON | `devin -p --agent-config <path> "echo test" --print --print-format text </dev/null` (lightweight) |
| Strict-validate | Packet | `validate.sh --strict` |
| Independent review | Sonnet | Task tool @markdown + @review |
| gpt-5.5 scaffold review | Pre-Phase-2 design check | cli-codex |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 058 shipped | Internal | Met |
| cli-codex (gpt-5.5 xhigh fast) | External | Met |
| Sonnet @markdown via Task tool | Internal | Met |
| devin CLI binary | External | Met (used in 056 + 058) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: gpt-5.5 review finds blocking design issue, or sonnet @markdown over-edits agents/commands, or agent-config smoke-test rejects shape.
- **Procedure**:
  - gpt-5.5 review blocker: halt Phase 2, refine spec
  - Sonnet over-edit on commands/agents: revert touched files, redispatch with tighter scope
  - JSON smoke-test fails: drop the JSON; ship only the markdown references + iter template
- **Recovery baseline**: HEAD before Phase 2 (this packet's Phase 1 scaffold commit).
<!-- /ANCHOR:rollback -->
