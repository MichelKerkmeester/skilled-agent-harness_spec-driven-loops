---
title: "Implementation Summary: Phase 2 M-1 + M-2 sk-code-review uplift"
description: "Adds PR-state content-hash dedup and opt-in min-evidence gate with skip taxonomy per council §10.3"
trigger_phrases:
  - "110 phase 002-sk-cr summary"
  - "sk-code-review efficiency gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/002-sk-code-review-uplift"
    last_updated_at: "2026-05-16T12:00:00Z"
    last_updated_by: "cli-opencode-deepseek-v4-pro"
    recent_action: "implemented_M1_pr_state_dedup_M2_min_evidence_gate"
    next_safe_action: "phase_3"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/SKILL.md"
      - ".opencode/skills/sk-code-review/references/pr_state_dedup.md"
    session_dedup:
      fingerprint: "sha256:1d057c999aeef23f40e68845aa76d2bb45e4575f858951c4750b078fb9f9d716"
      session_id: "2026-05-16-110-002-sk-cr-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "M-1 signature: sha256(commit_subject + diff_content_hash)"
      - "M-1 cache: .opencode/.sk-code-review-cache/<repo-ref>.jsonl, 100 entries max"
      - "M-2 default: off (SK_CODE_REVIEW_MIN_CHANGED_LINES=0)"
      - "M-2 skip taxonomy: 6 risk classes never skipped"
      - "Both gates emit COMMENTED status, never silently approve/block"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | `110/002-sk-code-review-uplift` |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### .opencode/skills/sk-code-review/SKILL.md
- Added **§9 PR-STATE EFFICIENCY GATES (Packet 110)** with two subsections:
  - **§9.1 M-1: PR-State Content-Hash Dedup** — signature scheme, cache format, retention, skip behavior
  - **§9.2 M-2: Opt-In Minimum Evidence Gate** — env var, changed-line counting command, conservative skip taxonomy, skip behavior
- Added **§10 REFERENCES: EFFICIENCY GATES** linking to the new reference doc
- Preserved all existing sections (1-8) unchanged

### .opencode/skills/sk-code-review/references/pr_state_dedup.md (NEW)
- Detailed M-1 implementation reference:
  - Signature computation with example bash commands
  - Cache format (JSONL schema per line)
  - Retention rules (100 entries, no TTL)
  - Skip behavior spec
  - Cache write rules
  - Location rationale

### M-1: PR-State Content-Hash Dedup
- **Signature**: `sha256(commit_subject + "\u001f" + sha256(git diff <base>...HEAD))`
- **Cache path**: `.opencode/.sk-code-review-cache/<repo-ref>.jsonl`
- **Cache schema**: `{"signature": "<hex>", "timestamp": "<ISO>", "prev_sha": "<sha>"}`
- **Retention**: last 100 entries per repo-ref
- **Skip output**: `Review status: COMMENTED (no changes since last review at <prev_sha>)`

### M-2: Opt-In Minimum Evidence Gate
- **Env var**: `SK_CODE_REVIEW_MIN_CHANGED_LINES` (default 0 = disabled)
- **Line counting**: `git diff --numstat <base>...HEAD | awk '{added+=$1; removed+=$2} END {print added+removed}'`
- **6 risk classes never skipped**:
  1. Security/Authentication/Authorization
  2. Config files
  3. Persistence (SQL, migrations, schema, repositories)
  4. Dependency manifests (package.json, Cargo.toml, *.lock, etc.)
  5. Sandboxing/Subprocess/Exec
  6. Public-facing responses (handlers, routes, API controllers)
- **Skip output**: `Review status: COMMENTED (skipped: diff below evidence threshold of N lines, no sensitive paths touched)`
- Gate is always opt-in; without env var set, M-2 has zero effect
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Edit to existing SKILL.md appended §9 and §10 after §8
- New reference doc created at `references/pr_state_dedup.md`
- Single commit on `main` branch
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **M-1 uses commit_subject in signature**: A diff-only hash would miss the case where the same diff is part of different logical PRs. Including the commit subject disambiguates.
2. **Unit Separator (\u001f) as boundary**: Prevents hash collision between subjects ending with hex chars and diff hashes.
3. **M-2 is ALWAYS opt-in**: Default `SK_CODE_REVIEW_MIN_CHANGED_LINES=0` means zero effect unless explicitly set. No operator gets surprised by skipped reviews.
4. **Skip taxonomy uses file paths, not diff content**: Path-based matching is deterministic and cheap; content-based heuristics would require parsing diffs and could miss renamed sensitive files.
5. **Cache uses JSONL per repo-ref**: Simpler than a database, inspectable with `cat`/`tail`, and naturally append-only with head-based pruning.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/002-sk-code-review-uplift --strict` — exit 0
- M-1/M-2 are specification-only changes (no runtime code to test); enforcement is delegated to review-agent dispatch infrastructure
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- M-1 cache pruning occurs on write, not on read — a repo with infrequent reviews may keep stale entries indefinitely until the 101st review
- M-2 taxonomy covers common patterns but is not exhaustive — new file conventions (e.g., `*-security-policy*`) may need manual review until added
- No runtime enforcement code shipped in this phase — both gates are documented contracts for downstream review dispatch to implement
<!-- /ANCHOR:limitations -->
