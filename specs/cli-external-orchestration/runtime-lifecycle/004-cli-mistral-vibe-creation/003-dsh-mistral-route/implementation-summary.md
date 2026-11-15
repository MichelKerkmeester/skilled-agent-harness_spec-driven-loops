---
title: "Implementation Summary"
description: "The dsh Mistral route was built, failed its keyed runs on dsh 0.2.2-rc.3, and was retired by operator decision; the dsh roster is back to two routes and Mistral work goes through Vibe."
trigger_phrases:
  - "dsh mistral route implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/003-dsh-mistral-route"
    last_updated_at: "2026-11-15T09:58:58Z"
    last_updated_by: "generate-context"
    recent_action: "Keyed runs failed on reasoning output, so the dsh Mistral route was retired"
    next_safe_action: "None: the phase is closed, and Mistral work goes through cli-mistral-vibe"
    packet_purpose: "Purpose: Add a Mistral route to dsh that completes a keyed dispatch, without changing the two existing routes."
    blockers: []
    key_files:
      - "scratch/keyed-runs/raw-stream-reasoning-high.txt"
      - "scratch/keyed-runs/04-store-off-reasoning-off/stdout.jsonl"
      - "implementation-summary.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:d6c5f5531668d102b2ac8e0fd50d32d0b03cf272220e17afb55dafa85c088a1a"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "425e79e1-c5de-4edb-b8bb-77ee620d2538"
      workspace: "/Users/michelkerkmeester/worktrees/public/383-mistral-vibe-runtime"
      savedAt: "2026-11-15T09:58:58Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-dsh-mistral-route |
| **Completed** | 2026-11-15, with the route retired |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

dsh has no Mistral route. The phase built one on 2026-11-14 and retired it on 2026-11-15, after the first keyed runs showed dsh 0.2.2-rc.3 cannot read Mistral's reasoning output. Mistral work goes through `cli-mistral-vibe`.

### Phase 3: dsh-mistral-route

The route patch followed the other two routes' shape without `compat.thinkingFormat: deepseek`, because Mistral rejects a `thinking` field. The keyed runs then found two more problems. Mistral's OpenAI-compatible endpoint answers 422 to the `store` field, which `supportsStore: false` fixes. With any reasoning level, Mistral streams `delta.content` as a list of `thinking` chunks, and dsh fails with `text-delta text must be a string`. No patch setting changes that, and dsh accepts no native Mistral API. Only reasoning `off` completed. The operator decided Mistral work belongs to Vibe, so the route came out again.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.dsh/patches/route-mistral-deepseek.patch.yml` | Created, then deleted | Mistral route patch |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified, then reverted | `DSH_ROUTE_PATCHES` admitted the third patch and now lists two |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | The acceptance test became `dsh hard rules refuse the retired Mistral route` |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` | Modified, then reverted | Rule messages name two routes |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md` | Modified | Two-route roster, and section 4 records why Mistral is never dispatched |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md`, `README.md`, `references/runtime-folder-and-sync.md`, `changelog/v1.0.2.0.md` | Modified, created | Two-route wording and the retirement changelog |
| `.skilled/skills/cli-external-orchestration/SKILL.md`, `README.md`, `feature-catalog/`, `cli-mistral-vibe/` docs, `.skilled/skills/sk-prompt/SKILL.md` | Modified | Two-route wording and the updated test count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The draft composed offline first, and a direct API check settled the reasoning field. The committed patch composed with the lineage and guards patches, and a keyless run passed the guard and failed with `MISSING_CREDENTIAL`. Once the key was exported, five keyed runs and one raw stream capture located the failure, saved in `scratch/keyed-runs/`. The retirement reversed the route's own hunks from its commit, kept the OpenCode and Pi Mistral routes, and moved every version forward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No DeepSeek thinking format | Mistral answers 422 `extra_forbidden` to a `thinking` field |
| Retire the route rather than ship it with reasoning off | Operator decision on 2026-11-15: Mistral work goes through the Vibe CLI, so a dsh route without reasoning adds nothing |
| Keep v1.0.1.0's changelog and add v1.0.2.0 | A released changelog entry stays, and the retirement is its own version |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Keyed run, shipped patch at `max` | FAIL: exit 1, 422 `extra_forbidden` on `store` |
| Keyed run, `supportsStore: false` at `max` and `high` | FAIL: exit 1, `text-delta text must be a string` |
| Keyed run, native `mistral-conversations` API | FAIL: dsh accepts only four API names. `--dump-config` still exited 0 with empty stderr |
| Keyed run, `supportsStore: false` with reasoning `off` | PASS: exit 0, `reason.kind` `completed`, text `OK` |
| Raw stream at `reasoning_effort: high` | `delta.content` arrives as `[{"type":"thinking",...}]` |
| Dispatch suites after the retirement | PASS: 69 of 69 (`dispatch-rule-checks.test.mjs` 64, `dsh-dispatch.test.mjs` 5), dispatch audit 130 of 130 |
| README, catalog and Vibe playbook validators | PASS: 3 of 3 READMEs, catalog 0 violations, playbook 51 scenarios 0 violations |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`--dump-config` does not check the provider API name.** It accepted `mistral-conversations` with exit 0 and empty stderr, and only a real run refused it. A composition check alone does not prove a route patch is valid.
2. **A later dsh could read Mistral's thinking chunks.** If a dsh release parses that shape, a Mistral route would need a new phase, with the `store` fix from these runs.
<!-- /ANCHOR:limitations -->

---
