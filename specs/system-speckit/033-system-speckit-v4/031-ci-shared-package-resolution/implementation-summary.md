---
title: "Implementation Summary: CI shared-package resolution"
description: "The four workflows that failed on every push since 2026-09-06 now install the spec-kit workspace before running checkers that import it, the shared build's js-yaml declaration is tracked instead of gitignored, one playbook link resolves, and the runtime mirrors match the moved design commands."
trigger_phrases:
  - "ci resolution summary"
  - "what shipped ci fix"
  - "run failed emails stopped"
  - "workflows green again"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/031-ci-shared-package-resolution"
    last_updated_at: "2026-09-07T05:55:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Fixed the four red workflows at their causes"
    next_safe_action: "Read the workflow conclusions for the push"
    blockers: []
    key_files:
      - ".github/workflows/command-tree-parity.yml"
      - ".gitignore"
    session_dedup:
      fingerprint: "sha256:e8c9e4698e4c372fbaff40a281eccd0141f4c960e348df47ef573d8d3d924403"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CI shared-package resolution

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-ci-shared-package-resolution |
| **Completed** | 2026-09-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every push since 2026-09-06 mailed four failures. Three workflows ran checkers that import `@spec-kit/shared` from a bare checkout, where the workspace package does not resolve; two jobs that did install failed the shared build because the declaration that types `js-yaml` was matched by an ignore rule meant for emitted output and had never reached the repository. Underneath, the playbook validator had one bad link and the mirror sync had real drift from the design-command move.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/command-tree-parity.yml`, `playbook-operator-contract.yml`, `routing-registry-drift.yml` | Modified | Install the workspace and build `shared` before the checkers run; the two workflows whose checkers live under sk-doc install sk-doc as well |
| `.gitignore` | Modified | Negation for the ambient declaration, with the reason |
| `.opencode/skills/system-spec-kit/shared/js-yaml.d.ts` | Added | The declaration the shared build needs |
| `manual-testing-playbook/tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md` | Modified | Runbook link two levels up, not four |
| `.claude/commands/{create,design}`, `.cursor/commands` | Regenerated | Four mirrors moved with the commands |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failing steps were read from the run logs, the first failing run after the last success dated each break, and TypeScript's resolution trace plus `git check-ignore` explained the local-passes-CI-fails split. Each checker was run locally before and after the fix. The commit was assembled in a private index and the push's own workflow runs are the final proof.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Install in the workflow rather than rewire the checkers | Their `.js` imports need the compiled output; a relative require would still need a build |
| Negate the ignore rule rather than rename the file | The rule is right for emitted declarations; the exception documents the one source file |
| Regenerate the mirrors here | They are generated artifacts of a command move already on both branches; the drift was failing every push |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| YAML parse of the three workflows | OK |
| `git check-ignore` on the declaration | Matched only by the negation |
| Clean typecheck of `shared` with the declaration | Exit 0 |
| Parity checker `--quiet` | Exit 0 after the mirror sync linked 4 and removed 4 of 169 |
| Playbook validator `--strict` | PASS, 83 scenarios, 0 violations |
| Parent-skill check and skill-root metadata check | OK; 13 of 13 |
| Workflow runs for the push | Second push `15c5e3254f`: Advisory Checks, Command Tree Parity, Naming Standard Guard, Playbook Operator Contract and the drift guard's Gate-2 job green on both branches; the drift guard's lean job still fails, on six sk-design hub invariants, not on resolution |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations and Follow-ups

1. **The install step costs about a minute per workflow** Three fast gates now pay for a workspace install their checkers require.
2. **One failure remains and is not environmental** `parent-skill-check` on the sk-design hub reports six invariant failures (packet name frontmatter, router outcomes, mode-table commands, missing `changelog/`, missing benchmark baseline, manifest contract version) from that hub's own restructuring commits of 2026-09-06 and 2026-09-07; every other hub passes. It belongs to the session working on sk-design.
<!-- /ANCHOR:limitations -->
