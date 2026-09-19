---
title: "Implementation Summary"
description: "Implementation summary: one instruction for the rewrite pass, resolved from the wording standard's reply base, an honest change record and the documents that declare the pass."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/baseline/specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/research/lineages/live-b/containment/baseline/specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade"
    last_updated_at: "2026-09-14T11:50:21Z"
    last_updated_by: "phase-4-leaf"
    recent_action: "Phase 4 documents written, tasks T014 to T019, T021 and T026 closed with evidence"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/SKILL.md"
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/config/copy-editing-instruction.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-sk-communication-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-sk-communication-upgrade |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rewrite pass now declares what it is and records what it did. Its instruction is the wording standard's reply base, so the standard keeps one home and no engine carries a copy. A candidate that changed nothing reports a no-op, and one that lost a claim, caveat or requirement returns the exact original.

### Phase 4: sk-communication-upgrade

Phase 4 upgraded the projection's engine and then made every document agree with it. The engine collapsed the instruction and its temperature into one declaration and pointed both provider profiles at it. The declaration resolves to the wording standard's reply base, read from the sk-doc skill the first time a prompt profile is built and then cached. Nothing is read at import. The five pass markers are stamped only inside the guard. An unchanged candidate records a no-op. The claim-omission comparison rejects a dropped claim, caveat or requirement. Thinking mode is provider-default on both profiles. The documents follow: both rewrite commands declare the pass in their own text, the wording-standard section carries the reply-base instruction and one exclusion, the feature catalog records the changed capability, and the changelog ships as 1.3.0.0.

### Files Changed

Code paths are relative to `.opencode/skills/sk-communication/cli-communication-projection/`.

| File | Action | Purpose |
|------|--------|---------|
| src/config/copy-editing-instruction.ts | Created | Holds the one instruction declaration, resolved from the wording standard's reply base |
| src/config/local-provider.ts | Modified | Builds the local profile through the shared declaration, with provider-default thinking |
| src/runtime/external-cli-projection.ts | Modified | Builds the external-cli profile through the shared declaration, with provider-default thinking |
| src/fidelity/validator.ts | Modified | Stamps the five pass markers inside the guard, wires the omission veto, builds the change kind |
| src/fidelity/semantics.ts | Modified | Adds the claim-omission comparison |
| src/fidelity/types.ts | Modified | Adds the no-op change kind and the omission reason code |
| src/contracts/projection.ts | Modified | Carries the change kind on the accepted record |
| test/providers/helpers.ts | Modified | Points the fixture at the shared declaration |
| test/config/copy-editing-instruction.test.ts | Created | Covers the resolved instruction, provider-default thinking, the omission rejection and the no-op record |
| docs/ (the packed copy of the standard) | Deleted | The standard keeps its one home in the sk-doc skill |
| .opencode/skills/sk-communication/SKILL.md | Modified | Restates the wording-standard section, version 1.3.0.0 |
| .opencode/commands/rewrite/response.md | Modified | Declares the copy-edit pass in its own text |
| .opencode/commands/rewrite/response-by-external-agent.md | Modified | Declares the same pass and names the instruction's new home |
| .claude/commands/rewrite/response.md | Modified | Mirror of the source, diffs empty |
| .claude/commands/rewrite/response-by-external-agent.md | Modified | Mirror of the source, diffs empty |
| .opencode/skills/sk-communication/feature-catalog/feature-catalog.md | Modified | Records the instruction, the omission check and the no-op record |
| .opencode/skills/sk-communication/feature-catalog/provider-and-privacy/provider-adapters-and-execution.md | Modified | Records the same capability in the feature detail |
| .opencode/skills/sk-communication/changelog/v1.3.0.0.md | Created | Version entry for the engine and document changes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The engine changes landed first, in rising risk order, under the package gate. The conductor's correction removed the packed copy of the standard from the package's docs, so the declaration reads the standard's one home at profile build. The package gate passed from that final state, 82 test files, 455 tests, exit status 0, as recorded in tasks.md.

The document changes followed. Both mirrors were copied from their sources, and both diffs printed nothing. The duplication search, `rg -n "Rewrite only the|plain English"` over the skill and the commands, returned 29 lines. They are purpose statements in the commands, the skill, the README and the bin comments, the instruction's framing in `src/config/copy-editing-instruction.ts`, which names the standard that follows it, quoted prompts in the playbook, the advisor scenarios and the benchmark report, the prompt-profile fixtures with their test stubs, and the derived metadata. No file restates the standard's rules. The enablement default and the advisor route exclusion were confirmed unchanged by search. The packet validator's opening run failed on two stale generated-metadata checks, which its own repair command and this summary address.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The instruction resolves at profile build, not at import | A packed install can import the package, and a runtime without the standard fails exactly where a provider would run without it |
| The packed copy of the standard under the package docs was removed | The standard has one home, so no second copy can drift |
| The scoring-band exclusion row was dropped | The bands live in the standard's publish supplement, which a reply never loads |
| An unchanged candidate records a no-op | A pass with five unearned markers would hide that nothing changed |
| Both mirrors are copied from their sources | The edits stay identical, so the diffs stay empty |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate, recorded from the part-one final state | PASS, 82 test files, 455 tests, exit status 0 |
| Both mirror diffs | PASS, both diff commands printed nothing, exit 0 |
| Duplication search over the skill and the commands | PASS, 29 matches, all purpose statements, framing, quoted prompts, fixtures or derived metadata |
| Enablement default and advisor route exclusion | PASS, the SKILL.md default-off paragraph and the advisor-exclusion lines are unchanged |
| Packet validation, validate.sh --strict | Opening run: FAILED, exit 2, two stale generated-metadata checks. The validator's repair command and this summary address them. Closing verdict: dispatch report |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fidelity checks array is shorter on the no-op path by design.** An unchanged candidate skips the structure and semantic comparisons, so it records none of their pass markers. A consumer that counted markers would see fewer on a no-op. The change kind field is the signal to read instead.
2. **The accepted projection contract type carries changeKind but nothing constructs it.** The type was unconstructed before this phase too. It is the wire shape a future orchestrator layer fills from the accepted fidelity result, which does carry the field and is constructed and tested.
1. **Closure gates remain open.** The Completion Criteria checkboxes and the checklist rows in tasks.md wait for their own pass. Every acceptance-criteria row is Met, with its evidence cited in its Verification cell. The dispatched scope covered tasks T014 to T019, T021 and T026.
2. **The continuity fingerprint is the scaffold placeholder.** The save workflow recomputes the session fingerprint, so this file ships with the value written at initialization.
<!-- /ANCHOR:limitations -->

---
