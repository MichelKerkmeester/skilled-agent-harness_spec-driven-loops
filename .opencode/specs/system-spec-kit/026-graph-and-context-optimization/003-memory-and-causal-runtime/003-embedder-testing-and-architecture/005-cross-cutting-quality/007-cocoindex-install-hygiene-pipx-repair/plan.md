---
title: "Plan: CocoIndex install hygiene pipx repair [template:level_1/plan.md]"
description: "Plan for applying the CocoIndex pipx editable repair after the completed diagnosis packet."
trigger_phrases:
  - "cocoindex pipx repair"
  - "pipx editable cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/007-cocoindex-install-hygiene-pipx-repair"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored implementation plan stub"
    next_safe_action: "Repair pipx editable install after operator-side config is available"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: CocoIndex install hygiene pipx repair

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Wait for operator-side pipx write access, apply the editable install repair, prove `ccc` loads current modules, then update harness/docs with evidence.

| Phase | Focus | Output |
|-------|-------|--------|
| A | Confirm predecessor evidence and target files | Implementation starts from the cited source lines and current code |
| B | Implement scoped changes | Source and tests updated only for this packet's requirements |
| C | Run focused verification | Unit/integration/perf evidence captured in the packet |
| D | Closeout | Strict-validate packet and update implementation summary |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All P0 requirements in `spec.md` have direct test or command evidence.
- The focused test command for this packet exits 0.
- No production data, runtime DB, or operator-local config is changed without an explicit operator step.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/007-cocoindex-install-hygiene-pipx-repair --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The repaired state is not a repo-only change: pipx must point its installed package at the repo `mcp_server` in editable mode. Repo docs/harness changes should be evidence-following, not predictive. The executable verification is the source of truth.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A - Discovery

1. Re-read predecessor packet and source files named in `spec.md`.
2. Confirm current line numbers before editing.
3. Identify the smallest test surface that proves the change.

### Phase B - Implementation

1. Run the editable pipx repair from an environment with pipx write access.
2. Verify pipx direct URL and executable module imports.
3. Apply harness hardening if the repaired executable stack matches local source.
4. Update install guide stale-pipx troubleshooting with real commands/evidence.

### Phase C - Verification

1. Run `which ccc` and `~/.local/bin/ccc --version`.
2. Inspect pipx `direct_url.json` for editable source linkage.
3. Run module import checks for the previously missing modules.
4. Run strict-validate on the packet.

### Phase D - Closeout

1. Update `implementation-summary.md` from PRE-IMPLEMENTATION to the actual result.
2. Run strict validation on this packet.
3. Preserve any operator-side blockers in the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Pipx direct URL inspection.
- Python import checks inside the pipx executable environment.
- CocoIndex benchmark/harness smoke only after repair passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Operator-side pipx log/venv permissions.
- Predecessor diagnosis packet implementation summary.
- CocoIndex mcp_server source tree.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. If editable install fails, leave pipx unchanged or reinstall prior stable package.
2. Revert any harness/docs edits made after failed evidence.
3. Record the exact pipx error in implementation-summary blockers.
<!-- /ANCHOR:rollback -->
