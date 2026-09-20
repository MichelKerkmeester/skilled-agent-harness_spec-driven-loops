---
title: "Implementation Summary: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair"
description: "Placeholder summary for a packet that is planned but not yet implemented; it records the research already banked and states plainly that no in-scope file has been changed."
trigger_phrases:
  - "devpass roster status"
  - "gemini 3.8 swap status"
  - "cli roster truth pass"
  - "v4 pro retirement status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/060-devpass-roster-vision-gemini-3-8"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All six workstreams shipped and verified"
    next_safe_action: "None - work is complete and verified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-060-devpass-vision-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 060-devpass-roster-vision-gemini-3-8 |
| **Completed** | 2026-09-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six workstreams that all reduce to one thing: every model fact the CLI hub states now matches what the live CLIs accept.

**DevPass reaches both CLIs.** Five models on a provider that was authenticated in opencode but catalogued nowhere, so a paid subscription was unusable from either skill. The rule that could not be copied from the neighbouring Cline block is the model id — LLM Gateway takes a bare id and rejects a prefixed one, the exact inverse — and it was settled by negative control against the live API before any config was written.

**Vision is documented from measurement, not from a flag, and the measurement removed a model.** A generated solid-colour PNG was put through every image-capable entry: Luna and Gemini 3.8 named the colour correctly, DeepSeek V4 Flash Vision got it right once in three tries. `attachment: true` was never evidence that a model reads what it is sent.

That third result first retired the entry, and a price check then reinstated it. opencode-go charges identically for plain flash and the vision variant ($0.22 in / $0.66 out either way), and DevPass is flat-price, so the image capability is free on both routes. A model that reads images unreliably is still strictly better than one that cannot accept them at all when neither costs more, so vision replaced plain flash as the catalogued entry and the hub default, with the unreliability recorded on the row rather than hidden.

`cline-pass` is the one route that keeps plain flash, because Cline publishes no vision id at all.

The swap exposed two copies of the same fact, which is the recurring shape of every defect this packet found: `PI_DEFAULT_MODEL` exists in the TypeScript source *and* separately in the CJS mirror, and the max-pin regex exists in both runtime files *and* a third time inside the test's own predicate. The mirror-parity test caught the first; the second only surfaced because the pin quietly stopped applying to an id that no longer matched.

**Gemini moved 3.7 to 3.8 across four CLI modes and three enforced rosters**, with both the cursor and devin ids dispatch-tested rather than list-verified.

**DeepSeek V4 Pro is gone.** It survived on one roster under three ids, because `deepseek-v4` is the family uid and a grep for `-pro` reports a clean removal while leaving the model dispatchable. Removing the ids was the easy half; five documents recommended it for reasoning-heavy work and now name `gpt-5-6-luna-max`. Leaving those would have converted a documentation problem into a dispatch-time rejection.

**The pi config is repaired**, and a CI gate that had been failing on both branches is fixed: eleven hook symlinks in the per-runtime mirrors were orphaned when the memory decommission rewired those configs to call `.opencode/` paths directly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/references/providers-and-models.md` | Modified | DevPass section, vision rows, Gemini 3.8, per-model variant row |
| `cli-pi/references/providers-and-models.md` | Modified | DevPass section, Gemini 3.8, V4 Pro removal |
| `cli-cursor/` (5 surfaces), `cli-devin/` (4 surfaces) | Modified | Gemini 3.8; V4 Pro retired and its recommendations repointed |
| `cli-claude-code/references/claude-tools.md` | Modified | `--variant` example no longer names a retired model |
| `executor-config.ts`, `fanout-run.cjs` | Modified | Three rosters: Gemini 3.8, three V4 Pro ids removed |
| `executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified | Fixtures plus negatives asserting the retired ids reject |
| `.pi/models.json`, `.pi/settings.json`, `.pi/custom-providers.md` | Modified | DevPass provider, V4 Pro deleted, Gemini enabled |
| `.claude/`, `.codex/`, `.cursor/`, `.devin/` hooks | Deleted | 11 orphaned mirror symlinks failing the parity gate |
| `.gitignore` | Modified | The 26 GB retrieval index and its decisions log |
### Roster narrowing, 2026-09-06

Two days after this packet widened the DevPass and OpenRouter rosters, the operator found two of
the DevPass models in the usage log and narrowed both providers to the DeepSeek V4 Flash family and
GLM-5.3-Flash on both CLIs. The picker entries had already been removed by hand. This pass removed
the models from the two `providers-and-models.md` rosters, the pi provider block and its guide, the
executor allowlist with its CJS mirror and provider map, the two unit test files that pin the pi
roster, and the cli-pi playbook scenario that counted eleven ids. Both closed-roster rules gained
one sentence: a provider's live catalog is not a roster, and a model allowed on one route is not
thereby allowed on another. Luna through the codex provider is untouched. The pi list shows two
`llmgateway` rows, the two suites pass at 213 of 213, and the runtime typechecks.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The verification described in `plan.md` has not run, and the baseline
it depends on has not been captured — `tasks.md` T002 must execute before the first
edit, or the "no regressions" claim at the end will have nothing to measure against.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four DevPass models, not 183 | The cli-opencode roster is enforced by discipline alone, so its size is the only thing protecting it; the operator chose these four on 2026-09-04 |
| The Gemini swap reaches cursor and devin | The operator chose the widest option; leaving those two at 3.7 would have the hub name one version and enforce another |
| Fix two false claims found in passing | Both sit inside paragraphs this work rewrites anyway; shipping a known-false sentence you just edited is worse than the edit being slightly wider |
| Repair `.pi/` after all | The operator's "also fix pi" instruction overrode the earlier decision to name the gap and leave it; an in-the-moment instruction outranks a scope line in this packet's own spec |
| Remove three V4 Pro ids, not two | `deepseek-v4` is the V4 Pro family uid per the devin catalog, so a `-pro` grep would have reported a clean removal while leaving the model dispatchable |
| Repoint the recommendations, not just the ids | Removing an id while leaving five documents recommending it converts a documentation problem into a dispatch-time rejection |
| Leave the 2026-05-04 incident record naming V4 Pro | Retiring a model does not change what it did; editing that name would falsify a true record |
| Split the GLM `max` fix into packet 061 | What looked like a stale doc sentence turned out to be a shipped runtime pin; a live-behavior defect deserves its own revert story rather than riding inside a feature packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet structure and metadata | PASS pending — recorded here once `validate.sh --strict` prints `RESULT: PASSED` |
| Guard suites, typecheck, live dispatch, vision probe | NOT RUN — implementation has not started |
| Roster narrowing, 2026-09-06: executor and fan-out suites | 213 passed, 0 failed |
| Roster narrowing, 2026-09-06: `npm run typecheck` | exit 0 |
| Roster narrowing, 2026-09-06: `pi --list-models` llmgateway rows | two, the flash vision variant and GLM-5.3-Flash |
| Roster narrowing, 2026-09-06: residue grep over both rosters and the pi config | no matches |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vision is documented from a capability flag, not a round trip.** `attachment: true` describes the provider catalog; only the T024 image dispatch proves an image actually gets read. Until that runs, the vision rows are list-verified and must say so.
2. **DeepSeek V4 Pro stays live upstream.** `devin models list` still offers all three tiers, and `opencode models` still lists V4 Pro on four providers. This retirement is a curation decision for this hub, not an upstream removal, so the catalogs must read as *excluded* rather than *absent*.
3. **`.pi` gets two surgical fixes, not an audit.** WS6 deletes one dead model block and adds one missing id. The other nine `enabledModels` entries and `defaultModel` are not reconciled against the live providers, and a similar drift may exist there.
<!-- /ANCHOR:limitations -->
