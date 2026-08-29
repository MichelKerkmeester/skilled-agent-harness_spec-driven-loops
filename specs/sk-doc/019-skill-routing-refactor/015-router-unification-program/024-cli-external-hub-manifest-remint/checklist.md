---
title: "Verification Checklist: cli-external-orchestration Activation Manifest Re-Mint"
description: "The verification checklist for the re-mint, closed against observed command output rather than inspection."
trigger_phrases:
  - "re-mint checklist"
  - "activation manifest verification"
  - "compiled routing checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/024-cli-external-hub-manifest-remint"
    last_updated_at: "2026-08-29T22:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed every checklist item against observed command output"
    next_safe_action: "None; repair live on main and v4 at the same commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-cli-external-hub-manifest-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-external-orchestration Activation Manifest Re-Mint

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item is closed by a command whose output and exit status were read. A command run without
reading its status does not close anything here.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] The failing hub was named by the guard, not assumed. Evidence: `cli-external-orchestration stale-manifest`.
- [x] The failure was reproduced before any edit. Evidence: `resolve.cjs` returned the legacy sentinel.
- [x] Both manifest copies were located before either was written. Evidence: promoted and authored paths, byte-identical at `84e253d5…`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No source, compiler or resolver logic was changed. Evidence: the diff is two JSON lines.
- [x] The sanctioned tool performed the write. Evidence: `compiled-route-manifest.cjs refresh`, which publishes atomically and preserves serving fields.
- [x] Serving fields survived the re-mint. Evidence: `servingAuthority: compiled`, `shadowOnly: false` in the result record.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] The manifest suite passes. Evidence: 42 pass, 0 fail.
- [x] The bin suite passes. Evidence: 34 pass, exit 0, with the untracked advisor `dist/` supplied so no test was skipped for a missing artifact.
- [x] The promoted closure verifies. Evidence: `--verify` exit 0, five hubs resolve, 0 reads under the spec tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] The reproduction command now succeeds. Evidence: `action: "route"` to `cli-cursor`.
- [x] The whole fleet is fresh, not just the repaired hub. Evidence: guard exit 0, five hubs `fresh`.
- [x] The pre-existing canary failure was negative-controlled rather than attributed to this change. Evidence: identical failure on pristine `origin/main`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] No credential, host or token value appears in the change. Evidence: the diff is two policy hashes.
- [x] The fail-safe posture is unchanged. Evidence: the identity binding that produced the fallback is untouched and still rejects drift.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] The input coupling is written down. Evidence: `spec.md` names `sourceInputs()` reading all seven `SKILL.md` files.
- [x] The traps found here are recorded. Evidence: the guard's piped-exit-status trap and the `--skill-root` shape are stated in `spec.md` and `implementation-summary.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Only the two intended files changed. Evidence: `git status` after residue removal.
- [x] Build residue was removed. Evidence: the harness-created `activation/` and `compiled/` directories and the copied `dist/` are gone.
- [x] The frozen rollout record was not modified. Evidence: `009-parent-hub-rollout` artifacts absent from the diff.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

The hub serves compiled again, proven by the command that showed it serving legacy. The fleet guard
exits 0, both routing suites pass from the final state, and the working tree carries exactly the two
manifests the fix requires.
<!-- /ANCHOR:summary -->
