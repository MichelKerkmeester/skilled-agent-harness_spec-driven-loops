---
title: "Implementation Summary: Forbid ephemeral-artifact references in code comments"
description: "In progress. sk-code rule + comments-only cleanup of deep/system skills. This file carries the canonical continuity block for resume."
trigger_phrases:
  - "comment hygiene summary"
  - "ephemeral reference implementation"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Created Level 3 spec folder and authored all six canonical docs"
    next_safe_action: "Begin Part A (sk-code rule): canonical rule in code_style_guide.md §4"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/universal/code_style_guide.md"
      - ".opencode/skills/sk-code/references/universal/code_quality_standards.md"
      - ".opencode/skills/sk-code/references/opencode/shared/universal_patterns.md"
      - ".opencode/skills/sk-code/references/webflow/shared/cross_language_rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000119"
      session_id: "119-comment-ref-hygiene-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Rule scope: Broad + revise §4"
      - "Labor split: Claude authors rule; CLI-DEVIN executes; CLI-CODEX reviews"
      - "Spec folder: new Level 3 with decision-record.md"
      - "Code locations: comments only (Bucket A)"
---
# Implementation Summary: Forbid ephemeral-artifact references in code comments

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/119-comment-ref-hygiene |
| **Completed** | (in progress) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: IN PROGRESS.** This packet adds a durable `sk-code` rule forbidding ephemeral-artifact pointers in inline comments and removes existing offenders from the deep and system skills. As of this writing, the Level 3 spec folder and its six canonical docs are authored; Part A (the sk-code rule) and Part B (the cleanup) are not yet executed.

### Planned: the sk-code rule (Part A)
A single canonical "no ephemeral-artifact pointers in comments" rule in the universal layer, an aggressive revision of the contradicting OpenCode §4, a Webflow pointer, and echo-site reconciliation.

### Planned: comments-only cleanup (Part B)
A chunked, comments-only sweep of ~135 Bucket-A sites across deep-agent-improvement, system-code-graph, system-skill-advisor, and system-spec-kit — executed by CLI-DEVIN/SWE-1.6, reviewed by CLI-CODEX/gpt-5.5, green-gated per chunk.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(To be completed.) Delivery is a strict per-chunk loop: executor edits comments only -> compile/test green-gate -> reviewer audits the diff -> per-chunk commit. The validation phase runs on the smallest skills first to prove the loop before the system-spec-kit bulk.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Instance-vs-structural rule (ADR-001) | Forbid perishable pointers without breaking the engine's functional path literals |
| Aggressive §4 revision (ADR-002) | A manual "strip before archival" step is exactly the discipline that already failed |
| Comments-only scope (ADR-003) | Fake fixtures cannot go stale; path constants are the engine, not comments |
| DEVIN executes / CODEX reviews (ADR-004) | Uses both mandated CLIs to strengths; independent review catches scope drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Level 3 docs authored | PASS (spec, plan, tasks, checklist, decision-record, implementation-summary) |
| description.json + graph-metadata.json | PASS (generated) |
| validate.sh --strict | PENDING |
| Part A rule | PENDING |
| Part B cleanup + suites green | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Cleanup intentionally leaves Bucket-B functional literals and Bucket-C test fixtures in place (ADR-003); a separate engine-refactor packet would be required to change the spec-folder path structure itself.
<!-- /ANCHOR:limitations -->
