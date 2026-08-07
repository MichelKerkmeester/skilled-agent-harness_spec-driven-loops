---
title: "Verification Checklist: Command Metadata as a Hub Standard"
description: "Evidence-backed verification that the command-metadata standard is enforced fleet-wide, faithful to command docs, and covered by tests, scaffolder, and cross-model review."
trigger_phrases:
  - "command metadata checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/022-command-metadata-generalization"
    last_updated_at: "2026-07-28T13:08:48Z"
    last_updated_by: "claude-code"
    recent_action: "Marked verification items with evidence"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-command-metadata-generalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Command Metadata as a Hub Standard

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries the command or artifact that proves it; nothing is marked from memory.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Command ownership mapped from mode registries, not guessed (sk-doc 12 declared / 11 with definition files, deep-loop 8, sk-prompt 1, sk-design 2, others none) [evidence: `mode-registry.json` scans: 11+8+1+2 commands mapped; `.opencode/commands/doc/` absent on disk]
- [x] CHK-002 [P1] sk-design file confirmed to carry all six core fields before the schema was frozen [evidence: `command-metadata.json` key probe on sk-design returned 6/6 core fields]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] New library is pure (no fs/require of disk state), no shebang, 'use strict', numbered sections, single exports block [evidence: `command-metadata-schema.cjs` has zero `require` of fs; probes injected by caller]
- [x] CHK-004 [P1] Gate changes follow the file's existing helper and violation-shape conventions [evidence: `checkCommandMetadata()` mirrors `checkDerivedAliases()` violation shape]
- [x] CHK-005 [P1] sk-code drift guards 3/3 (`run-all-drift-guards.sh`) [evidence: `run-all-drift-guards.sh` output: 3/3 guards PASSED]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P1] Contract suite passes with new H-required / S-forbidden / uniformity cases [evidence: `skill-root-metadata-contract.test.cjs` prints its pass line, exit 0]
- [x] CHK-007 [P1] Doctor leaf-manifest suite passes with the fixture carrying `[]` [evidence: `parent-skill-check-leaf-manifest.test.cjs` prints its pass line, exit 0]
- [x] CHK-008 [P1] Seeded mutations (unknown ownerMode, unresolvable choreography resource) fail the gate and were restored [evidence: seeded probe then `ci-skill-root-metadata.cjs`: FAIL with 2 codes, restored, checked=11 passed=11]
- [x] CHK-009 [P1] Freshness gate 11/11 (command-metadata is not a leaf; manifests untouched) [evidence: `ci-leaf-manifest-freshness.cjs`: checked=11 fresh=11 failed=0]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P1] All seven hubs carry the file; fleet gate `checked=11 passed=11` [evidence: `ci-skill-root-metadata.cjs`: checked=11 passed=11 failed=0]
- [x] CHK-011 [P1] sk-design's file byte-identical to HEAD (subset compatibility, no migration) [evidence: `git diff` contains no sk-design/command-metadata.json hunk]
- [x] CHK-012 [P1] `/doc:quality` omission recorded as a pre-existing registry inconsistency, not silently included [evidence: spec.md Out of Scope + implementation-summary Key Decisions carry the `/doc:quality` note]
- [x] CHK-013 [P1] Scaffold proof: `--kind parent` and standalone both pass the gate end-to-end, proof-solo OK [S], fixed=2 then clean] [evidence: `init_skill.py` both kinds then gate `--fix`: checked=2 passed=2 fixed=2, re-run fixed=0]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P1] No new execution paths: the validator reads JSON and probes existence only; probes are caller-injected and root-contained [evidence: `command-metadata-schema.cjs` imports nothing; gate injects `fs.existsSync` only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-015 [P1] Canonical contract doc v1.1.0.0: matrix row, rationale section, violation-code row, adding-a-root [evidence: `skill-root-metadata-contract.md` frontmatter reads version 1.1.0.0]
- [x] CHK-016 [P1] No create-skill text still describes the file as an sk-design overlay [evidence: `grep -r overlay` under create-skill returns only the graduated-note and generic mechanism text]
- [x] CHK-017 [P1] SKILL.md parent step 5, scripts/README gate row, lib/README rows updated [evidence: `git diff` hunks in SKILL.md:254, scripts/README.md, scripts/lib/README.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-018 [P1] New library sits in `scripts/lib/` beside its siblings; authored files at hub roots only; no nested copies [evidence: `git status` shows lib in scripts/lib/ and 6 root-level command-metadata.json files]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Fleet gate 11/11 with per-hub command validation, all suites and guards green, mutation probe load-bearing, scaffold proof for both classes, SOL adversarial review clean of unrefuted P0/P1.
<!-- /ANCHOR:summary -->
