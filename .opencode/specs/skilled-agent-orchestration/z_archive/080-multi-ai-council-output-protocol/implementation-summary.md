---
title: "Implementation Summary: Multi-AI Council Output Protocol"
description: "Post-implementation summary for packet 080. Documentation and protocol shipped; orchestrator-level writes deferred."
trigger_phrases:
  - "ai-council implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/080-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T13:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 2-3 complete (agent body, references, mirrors, vitest); CHK-022 smoke test deferred"
    next_safe_action: "Commit packet 080 to main"
    blockers: []
    key_files:
      - ".opencode/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/references/multi-ai-council/"
      - ".opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts"
    session_dedup:
      fingerprint: "sha256:64801e987501ad4d2afbcf6c07ab0768724433cdf1be58fba15d351cea3de8c9"
      session_id: "implsumm-080-author"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should ai-council/ be added to validator strict checks? Free-form (per ADR-004)."
      - "Where do shared references live? Under system-spec-kit/references/multi-ai-council/."
      - "Should ai-council-state.jsonl have a runtime validator? Convention-only for v1 (per ADR-003)."
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/080-multi-ai-council-output-protocol` |
| **Phase** | 1-3 complete (documentation + protocol shipped) |
| **Status** | DONE; CHK-022/023 deferred (orchestrator-level writes scoped to follow-on) |
| **Date** | 2026-05-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 1 — Spec + design lock-in

- `description.json` + `graph-metadata.json`
- Level 3 `spec.md` with executive summary, 12 canonical sections, and `ai-council/` folder layout
- `plan.md` with 7 anchored sections + L2/L3 add-ons (phase-deps, effort, dependency-graph, critical-path, milestones)
- `tasks.md` with phase-1/phase-2/phase-3/completion/cross-refs anchors
- `checklist.md` in `**CHK-XXX** [P*]` format (29 items across 7 verification surfaces + 6 L3+ surfaces)
- `decision-record.md` with 4 ADRs (lightweight bound, folder layout, state schema, validator policy)

### Phase 2 — Agent body + references + mirrors

- `.opencode/agents/multi-ai-council.md` — added §12 Output Protocol, §13 Invocation Contract, §14 State Schema, §15 Convergence Signal (placed BEFORE §16 SUMMARY so the SUMMARY ASCII box stays as the closing section). Final LOC: 683 (under 750 cap per CHK-011).
- `.claude/agents/multi-ai-council.md`, `.gemini/agents/multi-ai-council.md`, `.codex/agents/multi-ai-council.toml` — all 3 runtime mirrors carry the same 4 new sections in the same order.
- `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md` (38 LOC) — directory tree reference
- `.opencode/skills/system-spec-kit/references/multi-ai-council/seat-diversity-patterns.md` (35 LOC) — lens combination guidance
- `.opencode/skills/system-spec-kit/references/multi-ai-council/convergence-signals.md` (27 LOC) — 2/3 rule + escape hatches
- `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` (68 LOC) — JSONL schema + worked example + resume semantics

### Phase 3 — Validator regression + smoke test

- `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts` — 2 test cases:
  1. `validate.sh` does not flag `ai-council/` as unknown (uses packet 080 itself)
  2. Validator treats `ai-council/` as free-form (synthetic packet with arbitrary internal layout)
- Validator code itself was NOT modified — `validate.sh` already accepts unknown subfolders by design (ADR-004); the regression test prevents future regressions.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Spec docs (Phase 1) were authored directly by claude-opus-4-7 to canonical template-anchor structure with valid sha256 frontmatter fingerprints and `**CHK-XXX** [P*]` checklist item format. Substantive Phase 2-3 implementation work (agent body §12-§15 + references + mirrors + vitest) was dispatched via cli-codex with `gpt-5.5` model at `--variant high --service-tier fast` per user direction. The codex sandbox blocked `.codex/` writes (it lives inside codex's own state path), so the codex TOML mirror was patched manually with the same 4 sections.

A subsequent reorder pass moved §12-§15 ABOVE the §16 SUMMARY ASCII box (which was originally §12) so the SUMMARY closing diagram stays as the final section across all 4 runtimes. Done via a Python script applied uniformly to all 4 files.

The implementation followed the `/spec_kit:implement` 9-step workflow in autonomous mode:

1. Plan + spec review
2. Tasks breakdown
3. Consistency analysis
4. Quality checklist
5. Implementation prerequisites check
6. Development (cli-codex dispatch + direct edits + Python reorder)
7. Completion (this file + nested changelog)
8. Save context (canonical spec docs)
9. Workflow finish

Strict validation (`validate.sh --strict`) passed throughout: errors=0, warnings=0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

See `decision-record.md` for the full ADRs:

- **ADR-001**: Lightweight bound — no dedicated skill folder. Verified absent.
- **ADR-002**: Folder layout mirrors `research/` and `review/` patterns. Adopted.
- **ADR-003**: State schema is JSONL with convention-only validation for v1. Documented in `state-format.md`.
- **ADR-004**: Validator continues to treat `ai-council/` as free-form; vitest regression test added.

### Implementation-time choices (not in original ADRs)

- **Section placement**: Output Protocol/Invocation Contract/State Schema/Convergence Signal placed as §12-§15 BEFORE the §16 SUMMARY box, so the ASCII summary remains the closing visual. (User request after initial dispatch placed them after SUMMARY.)
- **CHK-022 deferral**: The live smoke test (dispatching `@multi-ai-council` on packet 080 to write actual `ai-council/` artifacts) is deferred. The agent currently has `write: deny`, `edit: deny`, `bash: deny`, `patch: deny` — preserving its planning-only invariant. Granting `ai-council/`-scoped writes (matching the deep-research/deep-review pattern) is in scope for a follow-on packet (e.g., 081). v1 ships the documented protocol; future invocations exercise it once permissions are extended.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Surface | Status | Evidence |
|---------|--------|----------|
| Spec docs (Phase 1) | PASS | `validate.sh --strict` exit 0; errors=0, warnings=0 |
| Agent body — primary | PASS | `.opencode/agents/multi-ai-council.md` 683 LOC; §12-§16 present in correct order |
| Agent body — 4 mirrors | PASS | All 4 runtimes (.opencode/.claude/.codex/.gemini) carry §12-§15 + §16 SUMMARY in identical order |
| Reference files (Phase 2) | PASS | 4 files under `system-spec-kit/references/multi-ai-council/`, each <300 LOC |
| Vitest regression test (Phase 3) | PASS | Codex-dispatch confirmed targeted run: 1 file, 2 tests passed |
| `ai-council/` smoke test (Phase 3) | DEFERRED | Agent has `write: deny`; orchestrator-level writes scoped to follow-on packet |
| No new skill folder | PASS | `.opencode/skills/multi-ai-council/` does not exist |
| Permission invariant | PASS | All 4 runtimes retain `write: deny`/`edit: deny`/`bash: deny`/`patch: deny` |

### Success criteria status (spec.md §5)

| ID | Criterion | Status |
|----|-----------|--------|
| SC-001 | Council writes to `ai-council/` | DEFERRED (depends on permission grant in follow-on) |
| SC-002 | Second invocation appends round-002 | DEFERRED (depends on SC-001) |
| SC-003 | `council-report.md` matches canonical structure | PASS (structure documented in agent §12 + folder-layout.md) |
| SC-004 | Agent body documents folder layout + invocation contract | PASS (§12 + §13) |
| SC-005 | `validate.sh --strict` accepts new subfolder | PASS (validator unchanged; vitest regression test added) |
| SC-006 | No dedicated skill folder | PASS |
| SC-007 | Resume from partial state log produces coherent next round | PASS-DOCUMENTED (§13 + state-format.md `Resume Semantics`); not exercised live |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Orchestrator-level writes deferred**: The agent retains `write: deny` per its planning-only invariant. Live writes to `ai-council/` artifacts require either (a) granting `write: allow` (matching deep-research/deep-review pattern) or (b) a separate orchestrator that consumes the agent's plan output and writes artifacts. v1 documents the protocol; v1.1 would extend permissions or add an orchestrator. Tracked as CHK-022/CHK-023 deferred in `checklist.md`.
- **Convention-only state schema**: Per ADR-003, `ai-council-state.jsonl` is not runtime-validated in v1. If schema drift becomes a problem, formalize a TypeScript validator in a follow-on packet.
- **4-runtime mirror sync is manual**: No automation guards against future drift between `.opencode`, `.claude`, `.codex`, `.gemini` agent files. A linter could be added later.
- **Smoke test exercises one round only**: Even after permissions are extended, the smoke test will exercise a single round-001 dispatch. Multi-round + resume flows will need explicit test fixtures.
- **Convergence detection is simple 2/3 agreement**: Sophisticated convergence math is explicit non-goal N1. If the 2/3 signal proves insufficient in practice, a follow-on can add a typed convergence module.
<!-- /ANCHOR:limitations -->

---

## Cross-References

- `spec.md` — design contract (Level 3, 12 sections + executive summary)
- `plan.md` — implementation sequence (3 phases)
- `decision-record.md` — 4 ADRs
- `checklist.md` — 29 verification items in CHK-XXX format
- `tasks.md` — task ledger
- `.opencode/agents/multi-ai-council.md` §12-§15 — Output Protocol, Invocation Contract, State Schema, Convergence Signal
- `.opencode/skills/system-spec-kit/references/multi-ai-council/` — 4 shared reference files
- `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts` — validator regression test
