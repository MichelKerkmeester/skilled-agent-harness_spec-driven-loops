---
title: "Implementation Summary: Code-Graph Retirement Test Drift"
description: "Scorer hardened against null/retired skill ids (4 crash tests green); remaining 32 failures triaged as unrelated drift or corpus authoring, none masked."
trigger_phrases:
  - "code-graph retirement drift summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-code-graph-retirement-drift"
    last_updated_at: "2026-08-15T14:37:23Z"
    last_updated_by: "claude-code"
    recent_action: "Scorer null-id crash fixed via SOL-HIGH; remaining suite failures triaged"
    next_safe_action: "Owner decision on the unrelated drift and the corpus-authoring subset"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Code-Graph Retirement Test Drift

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-code-graph-retirement-drift |
| **Completed** | 2026-08-15 |
| **Level** | 2 |
| **Executor** | cli-codex `gpt-5.6-sol` high/fast (guardrailed) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A defensive hardening of the advisor scorer so a retired / null-id projection entry is skipped rather than dereferenced, plus a holdout-builder guard. This fixed the four semantic-lane-promotion crash tests the code-graph retirement caused. The larger claim — that all 36 red tests were one code-graph reconciliation — was disproven: the rest are unrelated concurrent drift or corpus authoring, and were triaged, not force-fixed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-server/lib/scorer/text.ts` | Modified | `skillNameVariants` returns `[]` for null/blank id |
| `mcp-server/lib/scorer/lanes/explicit.ts` | Modified | Skip projection entries with no valid string id |
| `mcp-server/lib/scorer/fusion.ts` | Modified | Filter invalid skill ids once at the scorer boundary |
| `mcp-server/scripts/routing-accuracy/build-holdout.mjs` | Modified | Skip unlabeled corpus rows when building holdout |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delegated to GPT-5.6 SOL HIGH via cli-codex, scope-locked to `system-skill-advisor` with a hard guardrail against weakening any gate. The executor fixed the crash at the source, regenerated `holdout-prompts.jsonl` via its own tool (byte-stable), **rejected** an `ambiguity-prompts.jsonl` regen whose delta carried unrelated `rr-hub6-*` changes, **declined** to rewrite `scorer-eval-baseline.json` (its delta was a later accuracy improvement, not retirement drift), and left every ambiguous or unrelated failure red with a written reason. The parent then reviewed the full diff (4 source files, zero test/baseline edits) and re-ran the focused suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Guard the scorer, don't touch the projection producer | A scorer must never crash on a malformed entry; skipping an unrouteable null-id skill changes no valid routing |
| Regenerate only cleanly-attributable artifacts | A regen whose delta carries unrelated changes would bake other work into this packet |
| Leave unrelated + authoring-needed failures red | Masking a real failure or fabricating corpus rows to pass a gate is worse than an honest red |
| Delegate to SOL HIGH, not DeepSeek Flash | Deep scorer/parity triage needs a capable model; a cheap fan-out would risk masking |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Notes |
|-------|--------|-------|
| Diff review | Pass | 4 source files; `git diff` shows no test/baseline/gate edit |
| Crash cluster | Pass | `semantic-lane-promotion` 4 tests green |
| Focused scorer + state-containment | Pass | `5 failed | 141 passed | 2 skipped`; residuals are bm25 / executor-delegation / lane-weight-sweep |
| Typecheck | Pass | `tsc --noEmit` exit 0 |
| Scope | Pass | nothing changed outside `system-skill-advisor/mcp-server` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **32 of the 36 failures remain red by design** — unrelated concurrent drift (Figma, mcp-tooling, CLI-hub, sk-communication, policy serializer, playbook, vocabulary, launcher, daemon, stress) belongs to other owners; the corpus-authoring subset (bm25 fixture, 31-vs-32 review floor) needs an owner decision, not fabricated rows.
2. **The full `vitest run` hangs at teardown** — `tests/launcher-bootstrap.vitest.ts` spawns a real npm install that empties `node_modules`; a separate test-infra bug worth fixing on its own.
3. **Verified via focused runs**, not the full hanging suite.
<!-- /ANCHOR:limitations -->
