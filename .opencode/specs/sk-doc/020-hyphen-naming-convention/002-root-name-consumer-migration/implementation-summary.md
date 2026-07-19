---
title: "Implementation Summary: root-name consumer migration"
description: "Catalog and playbook consumers now accept both registered root forms and refuse missing, coexisting or unsupported roots before classification, discovery, routing or emission."
trigger_phrases:
  - "root-name consumer migration summary"
  - "hyphen naming phase 002 implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
    last_updated_at: "2026-07-18T07:18:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Kebab-cased the leaked matrix .cjs name flagged by the phase-004 guard"
    next_safe_action: "Begin phase 005 rename tooling"
    blockers:
      - "The sandbox cannot create the shared worktree index.lock, so no files can be staged or committed"
    key_files:
      - ".opencode/skills/sk-doc/scripts/tests/test_root_name_consumer_matrix.py"
      - ".opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs"
      - ".opencode/skills/sk-doc/shared/scripts/naming_root_resolver.py"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-migration-exec"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "explicit.ts contains stable routing identifiers, not a filesystem-root consumer"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-root-name-consumer-migration |
| **Verified** | 2026-07-18 |
| **Level** | 2 |
| **Status** | Implementation verified, commit blocked |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Catalog and playbook consumers now reject ambiguous or unsupported filesystem names before they classify a document, discover a benchmark, route a quality check or emit a manifest. Registered underscore and hyphen names still produce the same typed root result. The matrix covers every active filesystem boundary in the reviewed manifest.

### Fail-closed consumer boundaries

The Lane C loader throws typed errors for missing roots, coexisting roots, unsupported near-matches and unsupported index names. The generator validates that boundary before reading router data. The classifier handles POSIX and Windows separators and raises before an unsupported root can become `readme`.

Create-skill packaging, leaf generation, topology checks, frontmatter versioning, post-edit routing and contract drift now expose bounded root checks. The de-numbering guards refuse unsupported roots before scanning. The manifest also records that `explicit.ts` handles stable routing identifiers rather than filesystem paths.

### Debt-tolerant target guard

The existing guard keeps its filename and legacy default. A normal run still accepts today's underscore-content tree. The `--enforce-hyphen-target` mode reverses the content rule, accepts hyphen names and rejects underscore names. A later rename phase can enable that mode without changing the guard again.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/shared/scripts/naming_root_resolver.py` and Python consumers | Modified | Refuse unsupported roots and preserve typed dual-name reads |
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/` | Modified | Fail before empty discovery or generator staging |
| `sk-doc/create-skill/scripts/` and JS consumers | Modified | Validate root boundaries before routing or emission |
| `sk-doc/scripts/tests/test_root_name_consumer_matrix.{py,cjs}` | Created | Derive and test all 13 active filesystem rows |
| `sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py` | Modified | Add the default-off hyphen-target mode |
| `manifest/consumer-manifest.md` | Modified | Correct the identifier-only advisor row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation uses bounded name maps and typed errors at each consumer boundary. Tests supply real old, new, missing, coexisting and unsupported roots. The work remains uncommitted because this sandbox cannot write the shared Git worktree metadata.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep legacy guard behavior as the default | Today's physical tree still uses underscore content, so immediate target enforcement would block unrelated work |
| Enable target enforcement with `--enforce-hyphen-target` | The rename phase can activate the final rule without another semantic rewrite |
| Treat near-match roots as errors | A generic fallback can hide a missed rename as `readme`, an empty corpus or an unrelated route |
| Exclude `explicit.ts` from filesystem matrix rows | The file reads routing identifiers and has no root resolution boundary |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Consumer matrix | PASS: `test_root_name_consumer_matrix.py`, 28 assertions and 13/13 manifest filesystem rows |
| Lane C | PASS: `sk-doc=32`, `sk-code=30` |
| Classifier and guard regression | PASS: `test_category_classification_denumbered.py`, 14/14 checks |
| Resolver regression | PASS: `test_naming_root_resolver.py`, 16/16 checks |
| Syntax and diff checks | PASS: Python compile with temp bytecode cache, `node --check` and `git diff --check` |
| Packet validation | PASS: final `validate.sh --strict`, Errors 0 and Warnings 0 after metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Git writes are blocked.** The sandbox rejects `.git/worktrees/0068-sk-doc-020-migration-exec/index.lock`, so the requested commits do not exist. Run scoped staging and commits from a Git-writable session.
2. **The optional Vitest runner is unavailable.** No local Vitest binary exists and `npx` cannot reach the registry. The direct JS matrix covers the changed empty-playbook behavior.
<!-- /ANCHOR:limitations -->
