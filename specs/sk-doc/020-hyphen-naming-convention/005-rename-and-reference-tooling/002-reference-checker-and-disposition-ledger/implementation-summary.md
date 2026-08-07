---
title: "Implementation Summary: reference checker and disposition ledger (020 phase 005.002)"
description: "The checker now turns the rename engine's semantic map into a complete CAS-ready reference ledger without writing to the scanned repository."
trigger_phrases:
  - "reference checker implementation"
  - "disposition ledger fixture results"
  - "CAS-ready reference sites"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
    last_updated_at: "2026-07-18T07:41:15Z"
    last_updated_by: "codex"
    recent_action: "Built and verified the reference checker"
    next_safe_action: "Consume the ledger in the reference rewrite executor"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/reference_checker.py"
      - ".opencode/skills/sk-doc/shared/scripts/reference_checker_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/reference_checker_extractors.py"
      - ".opencode/skills/sk-doc/shared/scripts/reference_checker_models.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_reference_checker.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-002-reference-checker"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The checker delegates semantic-map validation to the rename engine's public loader."
      - "The ledger records static sites with Git blob preimages and dispositions every dynamic site."
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
| **Spec Folder** | 002-reference-checker-and-disposition-ledger |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The migration now has a read-only checker that follows the rename engine's exact map contract. You can scan a disposable Git repository and obtain one ordered ledger containing every map row, every mapped static reference and every dynamic require, source or glob site. The checker writes JSON to stdout and rejects stale, dirty or empty scans before it reports acceptance.

### Reference Resolution and Ledger

The extractor covers JavaScript and TypeScript modules, Markdown links, frontmatter path values, JSON, YAML, TOML, shell source and executable operands, registries and symlink targets. It ignores code identifiers and structured-data keys. Policy imports keep Python, generated, tool-mandated and frozen paths aligned with the existing guard.

Each static site records a stable site ID, character span and Git blob preimage. The ledger tells the rewrite executor to regenerate when that preimage drifts. Dynamic sites need a disposition, rationale and evidence. Missing or pending decisions block the ledger.

### Plan Identity and Closure Proof

The checker uses the rename engine's public semantic-map loader, so both tools agree on schema, collisions, classifications and exact map-byte hashing. The ledger binds BASE, HEAD, map hash, ordered operations, tree cleanliness and the pre-write checks a later executor must repeat. Every rename operation carries `git mv --` argv, including leading-hyphen operands. Preserved rows carry no move argv.

The checker computes reference-graph strongly connected components from map dependencies and observed mapped references. It rejects a declared closure when observed references would split or merge that batch. Mixed `.ts` and `.sh` fixture entries land in one SCC.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `reference_checker.py` | Created | Read-only CLI with ledger output on stdout |
| `reference_checker_core.py` | Created | Git manifest, policy boundary, resolution, SCC and ledger validation |
| `reference_checker_extractors.py` | Created | Typed static and dynamic reference extraction |
| `reference_checker_models.py` | Created | Engine-map adapter, immutable identities and CAS records |
| `test_reference_checker.py` | Created | Disposable Git fixture matrix and failure gates |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All runtime evidence used `TemporaryDirectory` Git repositories. The full fixture committed every input before the scan and compared tracked content, object IDs, modes, symlink text, index state and status before and after. No test invoked a rename or reference rewrite against this worktree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegate map parsing to the rename engine | One loader keeps path rules, classifications and collision behavior identical across both tools. |
| Emit ledger JSON to stdout | Writing a report inside the scanned repository would break clean-tree identity and violate the read-only contract. |
| Hash Git blob preimages in process | The checker gets the same CAS identity without writing an object to Git. |
| Derive and verify SCC batches | Extension queues can split a reference cycle. Graph components keep the atomic batch tied to dependencies. |
| Require evidence for dynamic dispositions | A label without rationale and evidence cannot prove that a dynamic site received review. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Checker fixtures (`test_reference_checker.py`) | PASS, 9/9 |
| Shared sk-doc Python tests | PASS, 30/30 |
| Disposable dry-run harness (`test_complete_matrix_emits_cas_ready_read_only_ledger`) | PASS, 18 tracked files, 1 symlink, 13/13 map rows and unchanged snapshot |
| Python syntax and comment hygiene | PASS, 5/5 files |
| Python line length | PASS, 0 lines above 120 characters |
| Optional Python linters | SKIPPED, `ruff`, Black, flake8 and mypy are not installed |
| Child `validate.sh --strict` | PASS, Errors 0 and Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dynamic expressions need reviewed input.** The checker auto-dispositions only literal glob patterns. Other dynamic require, source or glob expressions need a disposition file keyed by site ID or site key.
2. **The checker does not rewrite content.** The separate executor must verify each preimage again and regenerate a drifted batch before any disposable-fixture write.
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation, created after disposable-repository verification.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
