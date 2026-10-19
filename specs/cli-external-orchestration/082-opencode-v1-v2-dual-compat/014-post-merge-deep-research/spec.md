---
title: "Research Record: Post-merge deep research on the dual-compat work"
description: "Ten steered deep-research iterations over what four branches landed on main: OpenCode dual compatibility, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner. They look for drift, bugs and refinements, the best dual-version architecture, and sk-code-skilled and sk-doc conformance."
trigger_phrases:
  - "post merge deep research"
  - "dual compat drift research"
  - "pi fast mode trusted project"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/014-post-merge-deep-research"
    last_updated_at: "2026-10-19T21:50:59Z"
    last_updated_by: "generate-context"
    recent_action: "Synthesized four iterations into research.md, ending on a manual stop"
    next_safe_action: "Fix the ranked remediation list in research/research.md section 9"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/steering-log.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "082-014-post-merge-deep-research"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->
# Research Record: Post-merge deep research on the dual-compat work

<!-- SPECKIT_LEVEL: research -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | research |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Findings** | `research/research.md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 18 |
| **Predecessor** | 013-sk-vision-v2-tools-and-loose-ends |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four branches reached main on 2026-10-19: the OpenCode dual-compat build, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner. Merging them surfaced faults no single branch saw. `session-relaunch.js` arrived without the dual export, both packets were numbered `hooks/023`, and a plain `pi --help` in the trusted main checkout lists no `--fast`. The open question is what else has drifted, which bugs remain, and what the dual-version design should look like now that all four branches share one tree.

### Purpose
Produce a ranked, evidence-labelled remediation list and an architecture recommendation for the merged tree. This session runs angles A21, A22, A26 and the closing architecture synthesis A30. Angles A23, A24-A25, A27 and A28-A29 run in parallel as sibling phases 015-018, because one research lineage cannot run iterations concurrently. A30 reads their `research/research.md` files. Findings live in `research/research.md`, and the steering for each iteration is in `research/steering-log.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Pi fast-mode copy claim in a trusted project, and Pi's extension loading order and event bus
- Plugin bridge drift: plugins without the dual export, and tests that pin a hard-coded plugin list
- sk-vision's OpenCode 2 runtime: tool registration, the grace path, `close()`, interpreter checks and the venv race
- cli-opencode docs and flags against OpenCode 1.19.3 and 2.0.32
- The doctor battery and the dual-version CI workflow
- Command, agent and config dual reads, including generators that still write under `.skilled/commands/`
- Worktree provisioning, the adapter suite runner and the hooks vitest config
- sk-code-skilled conformance of changed code and sk-doc conformance of changed docs
- The dual-version architecture and the ranked remediation list

### Out of Scope
- Changing code or docs - this phase researches; fixes land in later phases
- The operator's global installs, `~/.pi` and the shared OpenCode 2 service - read-only evidence at most
- The original 20-iteration run in `../research/` - kept as it was
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Why does a plain run in the trusted main checkout register no `--fast` while `-a`, `-na` and worktrees do?
- Which plugins, tests and generators still assume one OpenCode version or a fixed file list?
- Which changed files miss the sk-code-skilled and sk-doc contracts?
- Research topic: what drift, bugs and refinements remain in the work four branches merged to main on 2026-10-19 (opencode v1/v2 dual compatibility, the pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner), what is the best dual-version architecture, and where do the changed code and docs miss the sk-code-skilled and sk-doc contracts
- Deep research is active for this topic; `research/research.md` stays the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (abridged from `research/research.md`, which stays canonical).** The session stopped by hand at 4 of 10 iterations (`manualStop`) once all ten angles were covered, with 4 of 5 key questions answered; the sibling phases 015 to 018 ran the other six angles.

- P1: in the trusted main checkout Pi registers no `--fast`, because a pre-trust user symlink copy wins the claim and is then pruned by realpath dedupe (confirmed). Fix: register the flag before the claim gate.
- P1: sk-vision's teardown leak and grace downgrade (015), and five package trees missing from the provision list with no completeness guard (017).
- P1: the v2 plugin suites pin 12 and 5 names against 17 files; replace them with an inventory read from disk.
- Architecture: one bridge per surface plus one shared enforcement pattern (disk-derived inventories, equality tests and exceptions manifests in blocking CI); sk-vision stays a listed native-dual exception.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
