---
title: "Implementation Plan: Prompt-time rule injection research"
description: "Plan for the prompt-keyed research round: apply the injection bar to eighteen candidates and record each refusal with its deciding test."
trigger_phrases:
  - "prompt-time rule injection plan"
  - "injection bar test plan"
  - "refused candidate ledger"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/001-deep-research"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Plan executed: eighteen candidates refused, one promotion named"
    next_safe_action: "Hand the promotion target to the operator decision"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Prompt-time rule injection research

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Documentation and evidence only; no runtime code |
| **Sources** | The resident-layer document, the `repo-rules/` corpus, the gate implementations |
| **Driver** | Ten research iterations on DeepSeek V4.1 Flash at max thinking through `cli-pi` |
| **Evidence** | One citation per claim; every refusal names the test that produced it |

### Overview

Candidates arrive from the prompt-keyed question, each is tested against the bar this repository already set, and every refusal is recorded with its deciding test. The round ends with the bar stated once, the corpus left at Gate 5, and the one uncovered read-side obligation named with its promotion target.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [x] Eighteen candidates judged, each with its deciding test recorded.
- [x] The bar stated in one sentence and applied uniformly to every candidate.
- [x] The uncovered read-side obligation named with its promotion target and owner.

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-first refusal: read the gate and the resident text a candidate would duplicate, cite the line, and only then judge. A candidate is admitted only when its prohibition has a gate behind it and no always-loaded text already carries it.

### Key Components

- **The bar**: the slot test that separates an injectable prohibition from a restated disposition.
- **The refusal set**: eighteen candidates, each with the test that refused it.
- **The promotion target**: the single read-side obligation the resident layer does not yet carry.

### Data Flow

Candidate from the prompt-keyed question to the bar test (gate citation plus resident-layer citation) to a refusal record or an admission. Refusals accumulate in the iteration records; the decision record carries the bar and the promotion target forward.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Enumerate
- [x] Collect candidates from the rule corpus and the hook surface.

### Phase 2: Test
- [x] Apply the bar to each candidate against its gate and the resident text.

### Phase 3: Record
- [x] Publish the bar, the refusal set, and the promotion target.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Evidence standard, applied to every claim in this phase:

| Check | Scope | Rule |
|-------|-------|------|
| Citation | Every claim | The citation resolves to the line it names |
| Refusal | Every refused candidate | The deciding test is stated, not implied |
| Bar | Every admission | The candidate names a prohibition a gate enforces |

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The gate corpus | Internal | Green | The bar cannot be applied without the enforcing text |
| The resident-layer document | Internal | Green | A duplicate cannot be detected without it |

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The bar is revised, or a refused candidate is later shown to name a gate prohibition.
- **Procedure**: No code changed. Re-open the refusal record for the affected candidate and restate the bar in the decision record; the corpus is untouched either way.

<!-- /ANCHOR:rollback -->

## RELATED DOCUMENTS

- **Specification:** `spec.md`
- **Tasks:** `tasks.md`
