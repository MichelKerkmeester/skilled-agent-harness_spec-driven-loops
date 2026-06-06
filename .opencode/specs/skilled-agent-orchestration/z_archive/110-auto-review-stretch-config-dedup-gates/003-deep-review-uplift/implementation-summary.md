---
title: "Implementation Summary: Phase 3 H-7 extend synthesis dedup with content_hash"
description: "Extends existing deep-review synthesis dedup with content_hash two-tier matching; H-9 deferred per council §10.5"
trigger_phrases:
  - "110 phase 003-dr-uplift summary"
  - "deep-review synthesis dedup content_hash"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/110-auto-review-stretch-config-dedup-gates/003-deep-review-uplift"
    last_updated_at: "2026-05-16T12:30:00Z"
    last_updated_by: "cli-opencode-deepseek-v4-pro"
    recent_action: "implemented_H7_content_hash_dedup_H9_deferred"
    next_safe_action: "phase_4"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/SKILL.md"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:c99cb4c72278a2b9978644c12d0ae3f5432e81584c34b5036b88d7cfd49eaaa6"
      session_id: "2026-05-16-110-003-dr-uplift-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "H-7 two-tier: PRIMARY content_hash, FALLBACK file:line+title"
      - "content_hash = sha256(file_path + line_range + finding_type + normalized_description_80chars)"
      - "H-9 deferred to packet 111+"
      - "Emission requirement: findingDetails[] must include content_hash"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | `110/003-deep-review-uplift` |
| **Status** | Complete |
| **H-9 Status** | Deferred to packet 111+ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### .opencode/skills/deep-review/SKILL.md
- Added **§9 FINDING DEDUP (Packet 110, H-7)** with three subsections:
  - **§9.1 Two-Tier Deduplication**: PRIMARY `content_hash` computation, FALLBACK `file:line + normalized_title`
  - **§9.2 Synthesis Behavior**: dimension merging on matching content_hash, backward compatibility
  - **§9.3 Emission Requirement**: every `findingDetails[]` entry must include `content_hash`
- Added **§10 H-9 DEFERRED**: explicit deferral to packet 111+ with rationale

### deep_start-review-loop_auto.yaml
- Updated `step_build_finding_registry` algorithm (6 steps, was 5):
  1. Extract findings from JSONL delta files (was "iteration files")
  2. **NEW**: Compute content_hash for each finding with formula
  3. **NEW**: Two-tier dedup (PRIMARY content_hash, FALLBACK file:line+title)
  4. Track lifecycle with dimensions array
  5. Resolve contradictions
  6. Count active findings
- Content hash formula: `sha256(file_path + "\u001f" + line_range + "\u001f" + finding_type + "\u001f" + normalized_description_80chars)`

### deep_start-review-loop_confirm.yaml
- Identical updates to the auto variant

### H-7 Finding Dedup Details
- **PRIMARY key**: `content_hash` — robust across dimensions, eliminates false duplicates from slightly different titles
- **FALLBACK key**: `file:line + normalized_title` — preserves backward compatibility with all existing JSONL state files
- **Dimension merging**: When same content_hash appears from multiple dimensions, synthesis produces ONE entry with `dimensions: [dimA, dimB, ...]`
- **No migration required**: Legacy records without `content_hash` continue to work via the fallback path
- **Emission**: New findings must include `content_hash` in `findingDetails[]`

### H-9: DEFERRED
- H-9 (bounded evidence interpolation) is not implemented
- Rationale: current deep-review prompts point agents at files and state rather than embedding all evidence inline; no concrete evidence interpolation path currently exists
- Deferred to packet 111+ per council §10.5
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Edits to 3 files via exact string matching
- SKILL.md: new §9 and §10 appended after existing §8
- Both YAML files: `step_build_finding_registry` algorithm extended in-place
- Single commit on `main` branch
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Unit Separator (\u001f) as boundary**: Same as Phase 2 M-1 to prevent hash collisions between fields
2. **80-char description normalization**: Sufficient for uniqueness while keeping hash inputs bounded
3. **Two-tier not three-tier**: Adding a SHA-of-SHA tier would add complexity without clear benefit; primary+fallback covers all cases
4. **Emission requirement without enforcement**: The YAML workflow _documents_ that findings MUST include content_hash, but the reducer treats missing fields as legacy records (graceful degradation)
5. **H-9 explicitly deferred**: Per council mandate (§10.5), H-9 is NOT implemented. The deferral is documented in SKILL.md §10 and the impl summary metadata
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/110-auto-review-stretch-config-dedup-gates/003-deep-review-uplift --strict` — exit 0
- YAML syntax: unchanged YAML structure (algorithm blocks are multi-line strings); no YAML parsing errors introduced
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- content_hash is computed from description text, not finding body — minor description variations between dimensions may still produce different hashes for the same logical finding
- No runtime enforcement of content_hash emission — the reducer must implement graceful fallback for missing fields
- YAML workflow does not include content_hash computation in the prompt pack template — the agent is expected to compute it based on the algorithm spec
<!-- /ANCHOR:limitations -->
