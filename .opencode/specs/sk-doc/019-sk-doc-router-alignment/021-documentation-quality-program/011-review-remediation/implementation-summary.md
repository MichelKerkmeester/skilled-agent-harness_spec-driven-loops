---
title: "Implementation Summary: Deep-Review Remediation"
description: "Fixed the in-scope P0 blockers from the deep-review FAIL verdict (NUL-byte header corruption and two non-runnable command blocks), routed the out-of-scope findings with evidence, and staged the validator hardening behind a corpus baseline."
trigger_phrases:
  - "review remediation summary"
  - "nul corruption fix summary"
  - "021 blocker remediation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/011-review-remediation"
    last_updated_at: "2026-07-22T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Landed the validator hardening (528->528 corpus, 26/26 tests)."
    next_safe_action: "Triage the 52 P1 README-vs-code accuracy findings."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/writing-style-guide.md"
      - ".opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md"
      - ".opencode/skills/sk-doc/create-skill/README.md"
      - ".opencode/skills/system-spec-kit/mcp-server/api/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-021-011"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-review-remediation |
| **Completed** | Partial (P0 blockers fixed; validator staged) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The confirmed P0 blockers from the 20-iteration deep-review FAIL verdict were fixed and verified against disk; the findings that are not this program's regression were routed rather than fixed on this branch.

### NUL-byte header corruption (fixed)

The header-uppercase transform destroyed backtick code spans inside two parenthetical headers, writing the bytes `\x00 0 \x00` where the span had been. The original spans were read from the merge-base blob (not retyped, so the em dash stays exact) and restored: `writing-style-guide.md` line 149 became `## 6. COLOUR NAMING (`` `## Tokens — Colors` ``)` and `vision-audit-benchmark.md` line 36 became `## 2. TRANSPORT (direct API — opencode `` `--file` `` is broken here)`. Both keep the uppercased main prose and the preserved-parenthetical convention the other headers use. Every changed markdown file now has zero NUL bytes.

### Non-runnable commands (fixed)

The create-skill Quick-Start mixed create-skill-relative script paths with a repo-root `--path`; all three commands are now repo-root-relative under a "run from the repository root" note. The mcp-server/api validation block called `npm test`, which has no script definition anywhere; it now runs the suite via a subshell `npx vitest run` that matches the branch's own manual-testing-playbook.

### Routed, not fixed (out of scope)

The 1,290 broken style-catalog links are sk-design's `library/bundles/` restructure that never updated the catalog (the one 021 commit touching that file changed zero link rows), so they belong to sk-design, not this program. The `vision-audit-benchmark.md` "missing overview" is pre-existing (absent at the merge-base). The `import-policy-rules` suite has two failing assertions in runtime code, unrelated to documentation. Each is recorded with evidence for separate routing.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every finding was confirmed on disk before any edit. The corruption was repaired at the byte level so the restored code spans are exact. The command fixes were validated by running the replacement command and by resolving the script paths. The out-of-scope findings were traced to their real owner (a sk-design restructure, a pre-existing gap, a runtime test) so the scope line rests on evidence rather than avoidance.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restore spans from the merge-base blob | Byte-precise; avoids retyping the em dash or code content |
| Keep uppercased prose, restore only the span | Matches the convention the non-corrupted headers use |
| Route the 1,290 links to sk-design | The breakage is a sk-design restructure, not a 021 regression |
| Stage the validator change behind a baseline | `is_uppercase_section` gates every document; changing it needs a regression run |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| NUL scan across changed markdown | 0 bytes |
| `writing-style-guide.md` validation | VALID (0 issues) |
| `vision-audit-benchmark.md` validation | Only a pre-existing missing-overview error remains |
| create-skill / mcp-server/api commands | Runnable from the documented directory |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The validator hardening landed.** `is_uppercase_section` now rejects scrambled mixed-case and correctly exempts code spans, nested parentheticals, autolinks, function args, and identifier/product names; verified by a `528 -> 528` zero-regression corpus re-run and 26 table-driven cases. Only the 011 packet's own template-header/anchor conformance still needs finalization.
2. **Three findings are routed, not fixed.** The style-catalog links, the pre-existing missing-overview, and the import-policy test failures are recorded for separate owners.
3. **The 52 P1 README-vs-code accuracy findings are not triaged here.** They are tracked for a surface-by-surface pass.

<!-- /ANCHOR:limitations -->
