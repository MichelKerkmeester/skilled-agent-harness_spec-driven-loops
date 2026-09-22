---
title: "Implementation Summary"
description: "Every living MiMo reference — skill documents, the pi settings' enabledModels, the deep-loop enforcement pair with its mirrors and tests, and the pi HerMeS pairing roster — now reads the v2.6 generation, and the two renamed ids resolve under the official Xiaomi Direct provider because the definitions the upstream xiaomi catalog still lacked arrived in .pi/models.json."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/076-mimo-v2-6-cutover"
    last_updated_at: "2026-09-22T07:42:58Z"
    last_updated_by: "template-author"
    recent_action: "MiMo v2.5→v2.6 cutover: living surfaces, deep-loop enforcement pair, settings, and the official-xiaomi provider wiring; all gates passed"
    next_safe_action: "Operator runs one live dispatch at xiaomi/mimo-v2.6-pro to confirm the official endpoint answers, then commits"
    blockers: []
    key_files:
      - ".pi/settings.json"
      - ".pi/models.json"
      - ".skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-076-mimo-v2-6-cutover"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the gateway serve mimo-v2.6-pro-ultraspeed for HerMeS, or does the HTTP-400 rationale carry over from the v2.5 spelling? The packet retains the pairing either way; a live probe belongs to the playbook's next run."
      - "The installed pi's xiaomi-provider catalog and the models-store still publish only the v2.5 ids; they remint themselves when upstream updates."
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
| **Spec Folder** | 076-mimo-v2-6-cutover |
| **Completed** | 2026-09-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every living surface that names a MiMo id — five skill document surfaces, the pi settings, the deep-loop
allowlist that decides whether a Pi or HerMeS dispatch resolves at all — now reads the v2.6 generation, and the
ids are not just printed but registered: a `providers.xiaomi.models` definition in `.pi/models.json` puts
both renamed ids on the official Xiaomi Direct provider today, where the bundled catalogs still only
advertise their v2.5 predecessors. The enforcement half moved in the same pass as the documentation half,
because the pairing between Pi's roster and HerMeS's lives in string literals and the tests that compare
them; a rename that moved one side and not the other is exactly the drift those tests exist to catch.

### MiMo v2.5 → v2.6 across skills, settings, enforcement and the official provider

The rename itself is mechanical and case-preserving — `mimo-v2.5` → `mimo-v2.6` and `MiMo-V2.5-Pro` →
`MiMo-V2.6-Pro`, anchored so the bare `mimo-v2` generation (`-pro`, `-omni`, `-flash`, no `.5`) never
moves. What makes it more than a sed is the company the id keeps: `PI_SUPPORTED_MODELS` and
`HERMES_SUPPORTED_MODELS` in `executor-config.ts`, their synchronous mirrors in `fanout-run.cjs`, the
provider map that turns a bare literal into a `<provider>/<id>` selector, and eight test expectations
including the pairing assertion ("Hermes = Pi's roster minus the one id the gateway refuses") all moved
together, because a rename that respects the pairing keeps every copy equal by construction.

The pi-side resolution needed one more file than the original directive named. The bundled pi-ai 0.87.0
catalog and the machine's etag-fetched `models-store.json` (fetched 2026-09-22T07:49Z) both still publish
only `mimo-v2.5`, `-pro` and `-pro-ultraspeed` under the `xiaomi` provider, so the renamed
`enabledModels` entries had nothing to resolve. A `providers.xiaomi.models` array in `.pi/models.json`
— the same mechanism the cline-pass precedent uses — defines both ids on the official Xiaomi Direct
provider. A throwaway `PI_CODING_AGENT_DIR` probe proved before the tracked edit that such an array
MERGES with the built-in registration rather than replacing it, that the v2.5 trio survives untouched,
and that omitting the context fields would have dropped the picker to its 128K/16.4K defaults. What the
probe could not know, and the final `pi --list-models` run showed, is that the upstream catalogs for
`opencode-go` and `openrouter` already publish `mimo-v2.6` ids — so the 1M/131.1K context shape this
packet inherited for the official route is the same shape those routes print, while the per-id costs
remain the one genuinely inherited, unverified number.

### Files Changed

The authoritative row-per-file ledger lives in `spec.md` §3 (25 rows: 22 modified, 3 created). In short:
`.pi/settings.json` and `.pi/models.json` at the root; seven cli-opencode living documents, one cli-pi
reference, five cli-hermes surfaces, the deep-ai-council example surfaces; the four deep-loop
enforcement/test files; three SKILL.md version bumps; and one new changelog entry per affected skill
(`v1.4.7.0.md`, `v1.5.5.0.md`, `v1.0.1.0.md`). The mid-flight addition is `.pi/models.json`, which was
not in the original directive and entered the ledger by operator instruction.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

On the current branch (`main`, operator-selected) with no branch machinery, because the working tree's
only pre-existing dirt was one machine-state hunk in `.pi/settings.json` — recorded, not absorbed. Every
edit landed through two case-anchored, global replacements over an enumerated 20-file list, or — for the
`models.json` definitions and the three changelog entries — as written additions. The behavioral gates
are the 070 trio: `executor-config.vitest.ts`, `fanout-run.vitest.ts` and `combo-matrix.vitest.ts`, the
suites that actually read the renamed allowlists, run once before the first edit (259/259, exit 0,
203.82 s) and once from the final state (259/259, exit 0, 242.30 s). A full `npm test` was attempted
twice and wedged past 300 s and past 600 s on the lineage integration tests, which dispatch real CLIs;
the trio is the 070 precedent's scope for exactly this reason and covers every suite that reads what this
packet changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Living surfaces only — historical changelog bodies, the dated PI-017 evidence cell and the benchmark reports keep the v2.5 spellings | They record what was true when written; the 070 precedent kept nine such files, and rewriting history would make those records say the releases shipped what they did not |
| Enforcement, mirrors and tests moved in one pass | The pairing comment in `fanout-run.cjs` says it: two lists meant to hold the same ids drift, and the drift surfaces as a model one runtime accepts and the other refuses; the pairing and provider-map tests are what keep the copies honest, so they moved with what they assert |
| The `.pi/models.json` definitions inherit their display fields from the official v2.5 predecessors | Upstream publishes no v2.6 metadata for the `xiaomi` provider yet (observed: the 0.87.0 catalog and today's 07:49Z etag-fetched store); the 1M/131.1K context shape is corroborated by the same ids' published rows under `opencode-go` and `openrouter` in the same listing, while the costs remain the one INFERRED carry-over, labeled as such in `spec.md` §6 |
| Packet scaffolded with the kit's `create.sh`, then relocated | The tool's default wrote to `.opencode/specs/.../001-...`; the track lives at `specs/cli-external-orchestration/` (075 validates `RESULT: PASSED` there), so the fresh, contentless scaffold moved and took the track's next number, 076 |
| Verification by the 070 trio, not the full suite | The full runtime wedges twice-observed on lineage integration tests that dispatch real CLIs; the trio covers every suite whose assertions this packet edited and adds `combo-matrix` across the mirrors |
| Minimal-then-inherited model definitions | The probe showed bare entries register but advertise 128K/16.4K — true-but-misleading picker facts; the inherited family shape is the smaller falsehood, and it is labeled |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline: 070 trio + `npm run typecheck`, before any edit | PASS — 259/259, exit 0, 203.82 s; typecheck exit 0 |
| Residue scan (`mimo[- ]?v2\.5`, case-insensitive) over `.pi/settings.json`, `.pi/models.json`, the three skills | PASS — survivors are exactly the permitted set: six historical changelog bodies, the dated PI-017 evidence cell, and the two prose mentions inside the new v1.4.7.0 entry that narrate the old spelling |
| The four deep-loop enforcement/test files and the two council files | PASS — zero v2.5 survivors; the v2.6 occurrence counts land exactly on the pre-read shapes (executor-config 3, fanout-run.cjs 5, executor-config tests 6, fanout-run.vitest 2, council 3) |
| `.pi/settings.json` and `.pi/models.json` parse | PASS — `JSON.parse` exit 0 on both; the settings carry `xiaomi/mimo-v2.6-pro` and `xiaomi/mimo-v2.6-pro-ultraspeed` |
| Final: 070 trio + typecheck, after all edits | PASS — 259/259, exit 0, 242.30 s (at baseline); typecheck exit 0 |
| `pi --list-models`, real agent dir, after the `.pi/models.json` wiring | PASS, exit 0 — `xiaomi mimo-v2.6-pro` and `mimo-v2.6-pro-ultraspeed` list at 1.0M/131.1K, reasoning yes, images no, alongside the untouched `mimo-v2.5` trio; the same listing also shows `mimo-v2.6-flash`/`-pro`(-ultraspeed) under `opencode-go` and `openrouter` |
| Repository frontmatter-version gate | PASS — 2932 files, ok = 2923, 9 skipped (no frontmatter), zero failures, exit 0; the three new changelog entries carry `version` |
| Version bumps | PASS — exactly one occurrence each: cli-pi 1.5.5.0, cli-opencode 1.4.7.0, cli-hermes 1.0.1.0, each at SKILL.md line 5 |
| Spec-kit validator, this packet, `--strict` | PASS — Errors: 0, Warnings: 1 (continuity freshness not opted in — the advisory the 075 precedent also carries), `RESULT: PASSED`, exit 0; the packet identity, freshness slack and link checks all pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The upstream `xiaomi`-provider catalog still publishes only the v2.5 trio.** Both the 0.87.0
   static catalog and the 2026-09-22T07:49Z etag-fetched `models-store.json` (lastModified 2026-09-21)
   agree on the three v2.5 ids, so this packet's definitions in `.pi/models.json` are what makes the
   renamed ids resolve. When upstream publishes v2.6 metadata, the store remints the picker and the
   inherited display fields get their independent confirmation; until then the picker shows this
   packet's inherited, labeled values.
2. **The cost fields are INFERRED, the context shape corroborated.** The 1M/131.1K context and
   131.1K maxTokens match what the same ids' published rows show under `opencode-go` and `openrouter`
   in the same `pi --list-models` output; the per-id costs (0.435/0.87 and 1.305/2.61) are the official
   v2.5 predecessors' numbers, carried forward because the mechanical-cutover premise of this packet says
   the generation changed, not the economics. A picker disagreement would surface as a wrong number, not
   a wrong dispatch.
3. **The HerMeS `-ultraspeed` exclusion rationale is recorded against the v2.5 spelling.** The gateway's
   HTTP-400 observation dates from the earlier generation; the pairing this packet preserves is
   structural (Hermes = Pi's roster minus that id), and whether `mimo-v2.6-pro-ultraspeed` also answers
   400 on the HerMeS route is what the testing playbook's next live run establishes. Nothing in this
   packet's gates depends on it.
4. **The full runtime suite still wedges.** Two attempts (300 s, 600 s) stalled on the lineage
   integration tests that dispatch real CLIs; the log is at `/tmp/deep-loop-baseline.log`. The trio
   covers every suite that reads what changed, and the deviation is recorded in `plan.md` §5 — but a
   machine with more patience than this one still owes the suite a complete run.
5. **The pre-existing `lastChangelogVersion` 0.86.1 → 0.87.0 hunk rode along** in `.pi/settings.json`.
   It is machine state that predates this packet (pi's own update), recorded here rather than silently
   absorbed; a `git checkout` of that file as rollback would also restore 0.86.1, which is more than
   this packet changed.
6. **The dated records now differ from the shipped ids.** The PI-017 evidence cell and the five
   historical changelog bodies describe the pre-cutover world on purpose. A reader comparing this
   packet's roster against those records sees two generations; that is the cost of the 070 precedent,
   accepted here deliberately.
<!-- /ANCHOR:limitations -->

---
