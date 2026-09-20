---
title: "Implementation Summary"
description: "The cli-jev packet exists: a transport SKILL.md with eight declared hard rules, four references that carry the pinned contract, a question-shaping card, a changelog and a benchmark baseline — every rule declared with the implementation that enforces it."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/002-cli-jev-skill-packet"
    last_updated_at: "2026-09-20T10:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the cli-jev packet: SKILL.md, four references, assets, changelog, benchmark"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-jev/SKILL.md"
      - ".skilled/skills/cli-external-orchestration/cli-jev/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-002-cli-jev-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which of the eight rules can a check actually enforce? All eight, because each maps to a predicate over the command line rather than to a judgment about intent"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cli-jev-skill-packet |
| **Completed** | 2026-09-20 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet the hub loads for a Jev judgment: a transport `SKILL.md` that says what the mode is and is not, and four references that carry the pinned contract without restating it. The mode is deliberately not an executor — no file tools, no loop, no lineage — and the document opens by saying so, because the plausible misuse is treating a returned probability as permission to act.

### Phase 2: cli-jev skill packet

Eight hard rules, each paired with the check that enforces it: availability, stdin bounding, `choice` cardinality, `score` cardinality, `--value` against `run`, the `custom` endpoint requirement, inline credentials and the `jev-mcp` host-only rule. Two are advisory because a legitimate reading exists — a harness may pass a key as an environment variable, and a probe may legitimately own a server subprocess — and six are blocking because the violation produces a wrong answer or a hang.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-jev/SKILL.md` | Created | Transport contract: when to use, how it works, eight hard rules, references, success criteria |
| `cli-jev/README.md` | Created | Mode-level overview and quick start |
| `cli-jev/references/cli-reference.md` | Created | Subcommands, flags, state forms, exit taxonomy, auth |
| `cli-jev/references/providers-and-models.md` | Created | Provider table, key resolution, translation, the gateway-key answer |
| `cli-jev/references/integration-patterns.md` | Created | Gate, triage, branch and batch patterns plus the what-not-to-do table |
| `cli-jev/references/mcp-server.md` | Created | The four-tool surface, verbatim state, the operator wiring block |
| `cli-jev/assets/question-shaping-card.md` | Created | How to write the question, per judgment type |
| `cli-jev/changelog/v1.0.0.0.md` | Created | The packet's first release entry |
| `cli-jev/benchmark/README.md`, `benchmark/reports/README.md` | Created | Baseline and the report index |
| `cli-jev/manual-testing-playbook/manual-testing-playbook.md` | Created | Playbook root; scenario files land in the next phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every claim in the references traces to phase 001's evidence, and every rule traces to a probe that exhibited the failure mode it prevents. The stdin rule exists because the CLI reads state to EOF when the flag carries no inline value — observed, not imagined — and the two cardinality rules exist because the CLI sends a single-option request while the MCP server refuses it, which is exactly the asymmetry a dispatcher has to be told about.

The post-edit frontmatter gate caught the first reference during authoring: a packet reference under `references/` needs the four-part version field. Both the gate and the fix are recorded because the next packet author hits the same thing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Transport, not workflow and not surface.** A workflow acts and a surface is read-only context; a transport returns a value with an external effect and no workspace mutation. The rules, the tool surface and the registry entry all follow from that one classification.
- **Declare only rules the command line can prove.** A rule like "ask a well-formed question" belongs in the assets card, not in `hard_rules`, because no predicate over a command can check it and an unenforceable rule trains a reader to ignore the list.
- **Two advisory rules, argued rather than assumed.** Both warn-only rules describe a violation with a legitimate variant, and the packet says which variant is legitimate rather than leaving the reader to guess.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reference frontmatter versions | All four carry `version: 1.0.0.0`; the frontmatter-versions gate passes |
| Declared rules map to known checks | The dispatch test suite's CI guard resolves all eight ids |
| Packet shape | `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/`, `changelog/` all present |
| Hub registration | Not this phase; the per-hub gate reports the packet as an allowlisted child in phase 003 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The packet documents an unauthenticated contract.** The provider response bodies are as pinned in phase 001: source-read, not observed.
- **`mcp-server.md` documents a wiring step this packet does not take.** No repository MCP config carries `jev-mcp`; the reference says so explicitly rather than implying a connection exists.
<!-- /ANCHOR:limitations -->
