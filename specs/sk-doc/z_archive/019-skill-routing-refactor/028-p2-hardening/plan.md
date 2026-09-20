---
title: "Implementation Plan: Skill-Metadata P2 Hardening"
description: "Fix the ten P2 review findings in three lanes — silent-failure hardening, containment tightening, and test/documentation honesty — each at its cited site with a proving test, then verify with the full gate sweep and an adversarial diff review."
trigger_phrases:
  - "skill metadata p2 hardening plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/028-p2-hardening"
    last_updated_at: "2026-07-29T06:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Applied all ten fixes across three lanes"
    next_safe_action: "Land after adversarial verify"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-p2-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Skill-Metadata P2 Hardening

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Close all ten P2 findings from the deep-review backlog, grouped into the report's three remediation lanes: (A) silent-failure hardening of the fleet gates, (B) containment tightening of authored paths, (C) test and documentation honesty. Each fix lands at the exact site the review cited; every new load-bearing behavior gets a negative-case test. No contract, schema, or generated-byte change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Fleet gates | 11/11 pass (exit 0); exit 2 on non-directory/missing input, verified end-to-end |
| Unit suites | contract, leaf-resource, journey-proof all green; three new negative cases pass |
| Watcher suite | both daemon-watcher vitest files green (real-chokidar integration included) |
| Doctor + drift | parent-skill-check 0 FAIL on touched hubs; 3/3 drift guards |
| No regression | generated manifest bytes byte-identical; no `.opencode/package.json` pin bump committed |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new components. The fixes are surgical edits to existing enforcement code and its tests. The gates keep their discovery-first structure; the hardening adds a directory-shape precheck in `run()` (so discovery still tolerates a missing tree while a bad `--skills-dir` fails loudly), narrows the top-level `readdir` catch to ENOENT-only, and adds a `path.relative`-based containment guard in the standalone-config reader before the walker runs. The choreography probe drops its skill-root fallback to match the documented repo-root-relative contract. The watcher's `isWithin` swaps a hardcoded `/`-prefix test for `isAbsolute`, correct on both separators.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Silent-failure hardening (lane A → P2-A, P2-E, P2-H)

Both fleet gates gain a `statSync` directory precheck in `run()` returning exit 2 on a missing or non-directory root; the freshness gate's "cannot run" code moves 1→2 to match its sibling, with both headers documenting code 2. The top-level `findSkillRoots` catch narrows to ENOENT-only and rethrows anything else. The two deliberate skip-and-continue subdir catches gain a WHY comment.

### Phase 2: Containment tightening (lane B → P2-B, P2-C, P2-J)

`readStandaloneConfig` rejects a `packet` that resolves outside the skill root with `PACKET_OUT_OF_ROOT`. The command-metadata schema flags a within-entry duplicate owned signal under its own code and continues. The choreography resource probe resolves repo-root-relative only, dropping the skill-root fallback that contradicted the contract.

### Phase 3: Test and documentation honesty (lane C → P2-D, P2-F, P2-G, P2-I)

`isWithin` becomes cross-drive correct via `isAbsolute`. The watcher test resolves chokidar from a candidate list (advisor `node_modules` first, then spec-kit). The journey proof asserts scaffold-vs-template shape equivalence for the standalone graph-metadata and leaf-manifest.config. The pre-push first-push diff-guard fallback gains a WHY comment.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three new negative-case unit tests prove the new behaviors are load-bearing: `DUPLICATE_OWNED_SIGNAL_WITHIN_ENTRY` (contract test), gate exit-2 on a non-directory `--skills-dir` (contract test), and `PACKET_OUT_OF_ROOT` on an escaping standalone packet (leaf-resource test). Each asserts a specific error code or exit code that exists only because of its fix. The pre-existing suites (journey proof, both watcher vitest files, drift guards) confirm no regression; the two fleet gates re-run to 11/11 with byte-identical output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The review backlog at `../027-program-deep-review`. The advisor `node_modules` (symlinked, gitignored) is needed only to run the watcher vitest locally. No new runtime dependency.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are additive guards, tests, and comments across ten files. Reverting the packet commit restores the prior behavior exactly; no data migration, no generated-file regeneration, no contract change to undo.
<!-- /ANCHOR:rollback -->
