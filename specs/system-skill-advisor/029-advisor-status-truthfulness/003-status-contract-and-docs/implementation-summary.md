---
title: "Implementation Summary"
description: "The trusted gate, the scorer citations, the phrase-boost bound, the routing-phrase source and an opt-in embeddings health surface are now stated where operators read them, and the health surface is reachable through the CLI."
trigger_phrases:
  - "status contract and docs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/033-advisor-status-truthfulness/003-status-contract-and-docs"
    last_updated_at: "2026-10-03T07:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped and verified phase 3"
    next_safe_action: "Parent session reviews the diff and commits the packet"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/embedders/embeddings-health.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts"
      - ".skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-status-contract-and-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-status-contract-and-docs |
| **Status** | Complete |
| **Completed** | 2026-10-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: done. Each contract the audit found missing now sits where an operator reads it, and `advisor_status` can report embeddings health through the CLI. Before, a live `includeSemanticHealth` call failed with `Unknown parameter(s)` and exit 64.

### Phase 3: status-contract-and-docs

The two mutating command pages now state the trusted gate. `advisor_rebuild` and `skill_graph_scan` each say the CLI refuses an untrusted call with exit 64, quote the refusal message, and name the `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` alternative. No catalog page exists for `skill_graph_propagate_enhances`. `SKILL.md` already states its apply-only gate, so no page was invented for it.

The scorer reference was re-measured after the bound landed. It now cites `explicit.ts:27-107` for `TOKEN_BOOSTS`, `:115-246` for `PHRASE_BOOSTS` and `:313-322` for the review-plus-write block. Its examples name values that exist: `deep-research` at 1.3, `deep research` at 1.0 (both to system-deep-loop), and `chrome devtools` to mcp-tooling.

`PHRASE_BOOST_BOUND = { min: -1.0, max: 2.0 }` now sits beside `PHRASE_BOOSTS`. Its comment ties the range to the doctor proposal validator. The guard suite fails on any amount outside the interval, and a second test pins the doctor asset's `phrase_boost_range` to the constant so the two cannot drift apart.

The routing-phrase source is now a recorded decision. A reader inventory found no runtime routing reader that takes `trigger_phrases` or `intent_signals` from a skill's own `SKILL.md` frontmatter. The daemon routes from `graph-metadata.json`. `SKILL.md` section 3 now says so, and names the opt-in doc-frontmatter harvest as the one exception.

`advisor_status` accepts `includeEmbeddingsHealth`. With it, the status carries `embeddingsHealth`: the provider resolution, from the shared factory's `getProviderInfo`, and one bounded read-only GET of the model server's `/api/health`. If either half fails, that half reports `unavailable` with an error class, and the call still succeeds. Plain calls do no probe and gain no key. The CLI manifest and the tool descriptor now declare `includeSemanticHealth`, `includeEmbeddingsHealth` and `debug`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md` | Modified | Trusted gate and exit 64 |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-graph-scan.md` | Modified | Trusted gate and exit 64 |
| `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md` | Modified | Re-measured citations, corrected examples, the bound |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | `PHRASE_BOOST_BOUND` beside the map |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts` | Modified | Bound check and doctor-range pin |
| `.skilled/skills/system-skill-advisor/runtime/lib/embedders/embeddings-health.ts` | Created | Fail-soft provider and model-server probe |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modified | `includeEmbeddingsHealth` input, `embeddingsHealth` output |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modified | Attach the probe on the async command path only |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` | Modified | Declare the three advisor_status options |
| `.skilled/skills/system-skill-advisor/runtime/tools/advisor-status.ts` | Modified | Same options on the tool descriptor |
| `.skilled/skills/system-skill-advisor/runtime/tests/embedders/embeddings-health.vitest.ts` | Created | Reachable, unreachable, timeout, provider failure, tcp target, epoch timestamps |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modified | Plain call has no key; option with an absent socket reports unavailable |
| `.skilled/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts` | Modified | The CLI accepts both health options |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` | Modified | Health surface, read cost, fail-soft contract |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Routing-phrase decision and the status fields (body only) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash wrote the bound, its tests and all the documentation. GPT-6 Luna wrote the health surface and hit its usage limit after the code and tests were on disk. The remaining checks were run here: build, targeted suites and typecheck. A live call then showed the real server reports timestamps as epoch milliseconds, which the first version rejected as `bad_response`. DeepSeek fixed that, with a test that replays the observed payload. The runtime was rebuilt and the daemon restarted before the live calls. Evidence is in `scratch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `graph-metadata.json` is the routing-phrase source of truth; skill frontmatter is not populated | No runtime routing reader takes those frontmatter fields (`scratch/phrase-readers.md`). Populating 13 frontmatters would add an unread copy that drifts |
| Declare the bound as a constant and enforce it in the existing guard suite, with no runtime clamp | The map is code reviewed at edit time; a failing test is the earliest signal, and the lane already clamps emitted scores at 1 |
| Probe only in `handleAdvisorStatus`, opt-in | `readAdvisorStatus` is synchronous and sits on the recommend path; a model-server outage must never slow or fail status |
| Mirror the model-server target resolution in the advisor | The client's resolver is private to system-spec-kit, which this phase does not own; the mirror carries a comment naming its source |
| Keep a non-2xx health answer as `bad_response` with the HTTP code | It is what was observed (a 503 while the server respawned); reporting it plainly is truer than guessing a state |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/bin/skill-advisor.cjs skill_graph_scan --format json` | exit 64, `skill_graph_scan requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` |
| `node .skilled/bin/skill-advisor.cjs advisor_rebuild --format json` | exit 64, `advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` |
| `rg -n -- "--trusted"` on both pages | one paragraph each, exit 0 |
| `rg -n "mcp-chrome-devtools\|explicit.ts:8-90\|explicit.ts:92-186\|explicit.ts:295-303" advisor-scorer.md` | no match, exit 1 |
| `npx vitest run tests/command-bridge-resolution-guard.vitest.ts` | PASS, 8/8 |
| `npx vitest run tests/handlers/advisor-status.vitest.ts tests/embedders/embeddings-health.vitest.ts tests/cli-exit-taxonomy.vitest.ts` | PASS, 3 files, 29/29 (after the rebuild; before it the CLI tests correctly refused a stale dist with exit 69) |
| `npx vitest run tests/embedders/embeddings-health.vitest.ts tests/handlers/advisor-status.vitest.ts` after the timestamp fix | PASS, 24/24 |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 |
| Live health call, server up | `modelServer.state: reachable`, `serverState: ready`, `dim: 768`, `device: cpu` |
| Health call, server socket absent | `modelServer.state: unavailable`, `errorClass: unreachable`, `connect ENOENT /tmp/p2-absent-hf.sock`; freshness unaffected |
| Plain `handleAdvisorStatus` | no `embeddingsHealth` key |
| `validate_document.py` on the edited docs | VALID, 0 issues |
| Full runtime suite | 133 of 135 files passed before the cross-packet description fix; the whole suite is green after it (135/135 files, see phase 2) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The server-down case was exercised at the target, not by stopping the shared model server.** Other sessions use that server, so the probe was pointed at an absent socket through the built handler instead.
2. **The target resolution is mirrored.** If the model-server client changes its resolution order, `embeddings-health.ts` must follow. The source is named in the code comment.
3. **A socket path longer than the platform limit reports `probe_failed` (EINVAL)**, not `unreachable`. That was observed with a long scratch path, and real targets are short.
<!-- /ANCHOR:limitations -->

---

## Handed Off

None. Every edited file is under `.skilled/skills/system-skill-advisor/`.
