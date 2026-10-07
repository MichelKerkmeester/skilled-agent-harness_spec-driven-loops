---
title: "Implementation Summary"
description: "A Jev `choice` or `noul` call with no transport named now goes to Pi when Pi can answer it, and to the jev CLI otherwise, with no extra output."
trigger_phrases:
  - "pi default transport implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review/001-pi-default-transport"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs"
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
      - ".skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs"
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs"
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs"
      - ".skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs"
      - ".skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-pi-default-transport |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Jev `choice` or `noul` call with no transport named now goes to Pi when Pi can answer it, and to the jev CLI otherwise, with no extra output. Eight more scorers call Jev through that transport and record which route answered.

### Phase 1: pi-default-transport

`resolveTransport` returns `auto` when neither the call option nor `JEV_TRANSPORT` names a route. On `auto`, `spawnClassifierCall` runs the cached Pi preflight and calls Pi when the package, version, model and credential gates pass, otherwise the CLI, silently. `JEV_TRANSPORT=jev` still forces the CLI and an explicit `pi` keeps its one skip line. A `noul` request becomes a Pi `bool` question, which Pi sends as the same wire `noul` the CLI sends, and comes back as `{ answers: { answer: { noul } }, model }`. Every outcome names its route as `transport`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Modify | Automatic route, noul mapping, route name on each outcome |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Modify | Cases for auto on choice and noul, each gate, the kill switch and the noul fallback |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Modify | Jev judgment calls go through the transport, and call records carry `transport` |
| `The eight scorers' suites` | Modify | Pin `JEV_TRANSPORT=jev` in the shared run helper, plus one record-shape case each |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs and score-clarify-default.test.cjs` | Modify | Pin `JEV_TRANSPORT=jev` |
| `.skilled/skills/cli-classifier/shared/scripts/README.md, cli-jev/SKILL.md, the catalog entry and index, the playbook scenario` | Modify | Describe the default, the ten callers, noul and the four gates |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast on cli-codex built the transport in two runs, because the first stopped on failed edit matches and sent `noul` as a Pi question type Pi does not have. The session found that type from Pi's own `types.d.ts` and `wireRequest`, and the second run fixed it. Luna then routed the eight scorers. DeepSeek V4.1 Flash max on cli-pi wrote the docs. Cross-family review: DeepSeek reviewed the code with a decoy Pi package first on PATH (no scorer test imported it) and Luna reviewed the docs. Both P1s were fixed and the session checked each fix.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fall back silently on the automatic route | Nothing asked for Pi, so a skip line would only add output to every scorer run |
| Send noul as a Pi `bool` question with no criteria | Pi rewrites `bool` to the wire `noul` and passes other fields through, so the request matches the CLI's |
| Leave the Pi transport benchmark unchanged | It drives its own CLI and Pi arms and never calls the transport, so the default cannot blur it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Transport and benchmark suites | 83 of 83 with `TYPESAFE_API_KEY` set and unset, baseline 79 |
| Eight scorer suites, key set and unset | 032 38, 035 50, 025 and 024 78, 017 30, 026 and 031 62, 029 29. Baselines 37, 49, 76, 29, 60, 28 |
| Two pinned suites | 62 of 62 before and after |
| Live smoke | With the key: Pi, noul 0.99 in 1,198 ms, choice `feature` 0.89 in 206 ms. Without it: CLI, noul 0.99 in 1,959 ms, choice `feature` 0.89 in 325 ms. No line printed |
| Docs | `validate_document.py` exit 0 on all five, and the playbook's step 5 prints its expected signal |
| Drift guard | rc 1 with 56 errors, all in another packet's evidence scripts, none in a changed file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Pi's payload has no `usage` or answer `type`. None of the eight scorers reads either
2. A record's `model` comes from the CLI auth probe, so a Pi-answered record shows the CLI's model name
3. On a CLI fallback, `wallMs` includes the failed Pi attempt
4. 026's auth record carries no `transport` field
5. On the official provider, Pi answers only when `TYPESAFE_API_KEY` is in the caller's environment or Pi's store holds a `typesafe` key
<!-- /ANCHOR:limitations -->

---


