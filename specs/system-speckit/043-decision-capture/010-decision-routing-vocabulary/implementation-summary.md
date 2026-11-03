---
title: "Implementation Summary"
description: "A request such as \"record this as a decision\" now routes to system-spec-kit on the native advisor, where it used to return no skill. Four phrases joined system-spec-kit's intent signals and a DECISION intent joined its ROUTER.md; the design and git prompts that mention a decision keep their routes."
trigger_phrases:
  - "decision routing vocabulary implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/010-decision-routing-vocabulary"
    last_updated_at: "2026-11-03T11:00:00Z"
    last_updated_by: "orchestrator-closeout"
    recent_action: "Built the decision vocabulary, rebuilt the advisor and proved the six probes on a live index"
    next_safe_action: "Commit only the system-spec-kit part of skill-graph.json, then pin the commit in CHK-FIX-007"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/graph-metadata.json"
      - ".skilled/skills/system-spec-kit/ROUTER.md"
      - ".hermes/skills/system-spec-kit/ROUTER.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-decision-routing-vocabulary |
| **Completed** | 2026-11-03, not yet committed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

"Record my chat reply as a decision" used to return an empty recommendation list on a live advisor. It now returns `system-spec-kit` at 0.8301, so the session loads the save workflow that writes operator decisions.

### Phase 10: decision-routing-vocabulary

system-spec-kit's `intent_signals` grew from 31 to 35 with "as a decision", "decision record", "operator decision" and "record my answer". No bare "decision" was added, because sk-design already owns that word. `ROUTER.md` gained a DECISION intent in three places: the §2 bullet at line 58, `INTENT_SIGNALS` at line 182 with weight 4 as MEMORY uses, and `RESOURCE_MAP` at line 289. The intent loads `references/memory/save-workflow.md` and `references/validation/decision-format.md`. The Hermes copy of the router, the exported graph and the SQLite index were then regenerated from those two sources.

### Follow-up after the alignment rerun (2026-11-03)

A later commit added "decision capture" and "chat candidate" as two more signals. The alignment rerun showed they pulled other skills' requests into system-spec-kit: "Research how other tools handle decision capture in transcripts" and "Dispatch this decision capture work to the Claude Code CLI" both routed there. Both phrases were replaced with four that name the feature's own objects: "decision capture queue", "decision capture folder", "decision capture state" and "this chat candidate", 39 signals in all. Show and list questions about the queue were still held below the advisor's read-only floor, so `readOnlyRouteAllowed` in `system-skill-advisor/runtime/lib/scorer/fusion.ts` now lifts system-spec-kit for a read-only question that names a decision-capture noun, and only for a read-only question.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modified | Four new intent signals, 35 in all |
| `.skilled/skills/system-spec-kit/ROUTER.md` | Modified | DECISION bullet, `INTENT_SIGNALS` entry and `RESOURCE_MAP` entry |
| `.hermes/skills/system-spec-kit/ROUTER.md` | Regenerated | `sync-skills-hermes.cjs` output, six added lines |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerated | `skill_graph_compiler.py --export-json` output; also carries another session's six sk-doc signals, see Known Limitations |
| `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` | Rebuilt | `advisor_rebuild` output, gitignored |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified (follow-up) | Read-only lift for decision-capture nouns, gated on a read-only question |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` | Modified (follow-up) | Four gate cases: the lift, another skill, no decision noun, a research request |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two source edits went to `llmgateway/deepseek-v4.1-flash-1017` at max effort through cli-pi. That is the parent goal's D6 fallback, used because `gpt-6-luna` was out of quota. The orchestrator ran every other step itself: the 008 check, the advisor rebuild and live control before the edit, the Hermes sync, the graph export and its diff against HEAD, the second rebuild, the six probes and the closing checks. The close-out reran the freshness panel, sk-skill-check, card sync, the Hermes check and the leaf-manifest check, and each exited 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four phrases of two or more words, no bare "decision" | A single word would pull every design or git prompt that mentions a decision; the four collision probes stayed identical |
| No trigger-index entry in this child | Once the advisor routes, the DECISION intent loads both docs. An index rebuild would pull unrelated uncommitted frontmatter into this child's diff |
| The Hermes router copy is in scope | It is generated from `ROUTER.md`, and the C9 mirror row fails without it |
| Feature-object phrases, not the feature's name | The bare name "decision capture" won research, dispatch and component requests; the four object phrases appear only in requests about the queue, its folder, its state or one candidate |
| The read-only lift needs a read-only question | A lift applies to any prompt, and the first version sent "Research how other tools handle decision capture" to system-spec-kit |
| The ADR edge case now routing to system-spec-kit first is accepted | ADRs live in a packet's `decision-record.md`, a spec-kit file, so "write an architecture decision record" belongs there |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Probe lines are `jq` projections of `advisor_recommend`, all at `"freshness":"live"`. The control was taken after `advisor_rebuild` returned `rebuilt: true` and before any edit. The post-change lines were taken after the export and a second rebuild, at generation 2143.

| Prompt | Live control | After the change |
|--------|--------------|------------------|
| Record my chat reply as a decision | no recommendation | system-spec-kit 0.8301, uncertainty 0.12 |
| record this as a decision | no recommendation | system-spec-kit 0.8461, uncertainty 0.16 |
| decision tree | sk-design 0.82, uncertainty 0.16 | identical |
| colour decision | sk-design 0.8461, uncertainty 0.16 | identical |
| decision branch | sk-git 0.9365 (0.12), then sk-design 0.8416 (0.16) | identical |
| architecture decision | sk-design 0.82, uncertainty 0.3 | identical |
| write an architecture decision record (edge case) | sk-design 0.82 (0.2), system-spec-kit 0.82 (0.22), sk-doc 0.82 (0.16) | system-spec-kit 0.9222 (0.12), then sk-design 0.82 (0.2), sk-doc 0.82 (0.16) |

| Check | Result |
|-------|--------|
| 008 closed | PASS: `90:**Closeable:** Yes` |
| `intent_signals` count, four-phrase count, bare `decision` | PASS: 35, 4, nothing (exit 1) |
| sk-skill-check before and after | C7 21 and 21 before; after, C6 PASS, C7 PASS 22 and 22, C8 INFO fresh, C9 PASS, `Result: PASS`, exit 0 |
| `sync-skills-hermes.cjs --check` | PASS: `PASS: 65 Hermes skill copies in sync`, exit 0 |
| Graph export diff against HEAD | Exit 0; the scalar-path diff shows the four system-spec-kit signals and the six sk-doc signals from another session, nothing else |
| `skill-graph-freshness.cjs --strict` | PASS: exit 0, `STALE COMPILED: none`, `SIGNAL DRIFT compiled vs disk: none` |
| `check-card-sync.sh` | PASS: `CARD SYNC OK`, exit 0 |
| `generate-leaf-manifest.cjs --check` | PASS: `leaf-manifest.json OK (1fbc955023a8...)`, exit 0 |
| Reach check, filtered to the four phrases | PASS: no row names any of them, probe-error 0 |
| Reach check, whole skill | FAILED: declared 43, wrong-hub 10, outranked 1, no-reach 24, probe-error 0; every failing row is an older phrase |
| Follow-up: the alignment probes, 14 prompts | 11 pass; P08, P09 and P13 fail identically with the decision words removed, so they are general advisor reach, not this vocabulary |
| Follow-up: `route-gates.vitest.ts` | PASS: 15 of 15 |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED`, Errors 0, Warnings 0, after `repair-derived.cjs --apply` re-derived this folder's graph metadata (the first run failed GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT only) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The exported graph carries another session's sk-doc change.** `.skilled/skills/sk-doc/graph-metadata.json` held six uncommitted signals (playbook scenario, playbook conversation, multi-turn conversation script, manual test scenario, json conversation, conversation runner) when the export ran, so `skill-graph.json` holds them too. The commit that lands this child must stage only the system-spec-kit part of that file.
2. **No live reach baseline exists from before the edit.** The only pre-change reach run met a stale advisor and printed 39 probe errors, so the reach numbers cannot be compared before and after.
3. **The reach check still fails for system-spec-kit as a whole.** Ten wrong-hub rows, one outranked row and 24 no-reach rows name older phrases such as "skill advisor hook", "save context" and "new spec". They predate this child and sit outside its four phrases.
4. **The trigger index still finds nothing for decision prompts.** The lookup exits 1 for both prompts, as planned. The advisor route and the DECISION intent load the docs instead.
<!-- /ANCHOR:limitations -->

---
