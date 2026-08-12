---
title: "Implementation Summary: Grok 4.6 Support for cli-cursor & cli-devin"
description: "Grok 4.6 added to cli-cursor and cli-devin's enforced allowlists alongside the still-supported Grok 4.5, with a new xhigh tier live-verified end to end, and every touched roster sorted alphabetically."
trigger_phrases:
  - "implementation"
  - "summary"
  - "grok 4.6"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | cli-external-orchestration/036-grok-4.6-support |
| **Completed** | 2026-08-12 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

cli-cursor and cli-devin now dispatch Grok 4.6 alongside Grok 4.5, not instead of it, and every id in both allowlists was proven callable through the real CLI before it landed anywhere in the repo. Getting here took two passes: the first read "replace all mention of Grok 4.5 with the new Grok 4.6" as a retire-and-replace swap and shipped that; a direct operator follow-up ("make sure grok 4.5 is also still in the roster") caught the mistake before anything was committed, and a second pass restored 4.5, alphabetized every touched roster, and rewrote the affected docs, tests, and changelog entries in place.

### Live-verified allowlist addition

`CURSOR_SUPPORTED_MODELS` grew from 10 to 18 entries and `DEVIN_SUPPORTED_MODELS`'s curated Grok family grew from 3 to 7 uids — both versions, side by side. Grok 4.6 ships a fourth reasoning tier, `xhigh`, that 4.5 never had, on both platforms. Both `executor-config.ts` allowlists and their hand-duplicated `fanout-run.cjs` mirrors were updated together, resorted alphabetically, and every id — new AND retained — was dispatch-tested end to end before being written into any allowlist or doc: `cursor-agent -p --model cursor-grok-4.6-high`/`-xhigh` and `cursor-grok-4.5-high`, `devin -p --model grok-4-6-high`/`-xhigh` and `grok-4-5-high`, all from a trusted scratch workspace. The `model[effort=...]` bracket rejection was re-tested for the new id too and still fails the same way it did for 4.5.

### A caught misstatement, and a caught scope miss

An early draft of the migration note claimed Cursor "retired" the 4.5 ids from its live roster. A follow-up `cursor-agent --list-models` call (needed anyway to re-verify the bracket rejection) showed that's false — both `cursor-grok-4.5-*` and `cursor-grok-4.6-*` are still listed side by side; only this repo's curated allowlist choice ever dropped 4.5, and even that choice was itself later corrected. The same check against `devin models list` confirmed the same pattern on Devin. Every doc now says "this skill's allowlist adds 4.6 alongside 4.5" rather than implying any retirement, vendor-side or otherwise.

### Documentation sweep, twice

19 files across two skills (cli-cursor: SKILL.md, README.md, 4 references files, 2 assets, 1 manual-testing playbook; cli-devin: SKILL.md, README.md, 2 references files) plus 3 cross-reference docs in sibling skills (`cli-pi/references/pi-tools.md`, `shared/references/smart-routing.md`, `sk-prompt/sk-prompt-models/references/models/_index.md`) had their Grok examples, tier counts, and allowlist counts updated — first to describe a 4.5→4.6 swap, then corrected to describe both versions coexisting with alphabetized roster tables. Two new changelog entries (`v1.3.0.0.md` in each skill) were rewritten in place during the correction, since they were still uncommitted drafts from the same session rather than shipped history; the six prior changelog entries (v1.0–v1.2 in each skill) were never touched.

### What was deliberately left alone

Dozens of historical spec-folder artifacts (deep-research lineages, manual-testing-playbook evidence directories, prior spec docs under `specs/ai-systems/027-*`, `specs/sk-doc/019-*`, `specs/system-speckit/032-*`, and others) name Grok 4.5 because that's the model that actually ran when those records were written. Rewriting them would misrepresent history rather than fix a bug, so they were inventoried and left untouched throughout both passes. The same applies to `.opencode/logs/cli-dispatch-audit.log` (an append-only audit trail) and one illustrative example folder name in `sk-doc/sk-create-benchmark/SKILL.md` that just demonstrates a naming convention, not a functional claim.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Live verification came first, code second, docs third, in both passes. Before any file changed in Phase 1, `cursor-agent --list-models` and `devin models list` established the exact shape of the new Grok 4.6 family — which surfaced the tier-width fork that became ADR-001 (full adoption including `xhigh`, operator-selected). The two runtime enforcement points and their vitest coverage were updated and re-run before touching a single doc, so the documentation sweep was describing code that already worked.

The first pass shipped a retire-and-replace implementation and reported it complete. The operator's direct follow-up two messages later — keep 4.5, and alphabetize every roster — was a genuine correction to already-reported-done work, not a continuation of open scope. Because nothing had been committed, the correction was applied in place: the allowlists were widened back to include 4.5 (independently re-dispatch-tested, not just restored from memory of the earlier pass), every array and table was resorted alphabetically, and the still-uncommitted changelog drafts and spec docs were rewritten rather than layered with a second "we changed our mind" entry. A repo-wide grep swept the whole `.opencode/` tree three times across both passes — before editing, after the first pass, and after the correction — to confirm the only remaining "Grok 4.5" strings are the historical changelogs and the intentional migration-note prose explaining that both versions coexist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Adopt the full Grok 4.6 family (8 Cursor ids, 4 Devin uids) rather than a 4.5-parity subset | Grok 4.6 ships a real `xhigh` tier on both platforms; artificially hiding it would just require a follow-up packet the first time someone asks for it. See ADR-001. |
| Keep Grok 4.5 in both allowlists alongside 4.6, rather than retiring it | Direct operator instruction after the first pass shipped a retire-and-replace version; no caller with an existing 4.5-pinned workflow should break. See ADR-002. |
| Sort every touched allowlist array and roster table alphabetically instead of grouping by family | Direct operator instruction; also a more stable convention as more Grok (or other) versions land over time. See ADR-002. |
| Live-dispatch-test every id — new and retained — before it appears in an allowlist | A model listed in `--list-models` output isn't proof it actually returns a response, and "it worked before" isn't proof it still does after a roster change; the allowlist is a hard-enforced safety gate. |
| Correct the "Cursor/Devin retired 4.5" draft claim before it shipped | Re-checking the live roster after writing a first draft of the migration note caught a factually wrong claim (the vendor still lists 4.5) before it was committed to any doc. |
| Leave historical spec-folder evidence and the audit log untouched | Those records document what actually ran at the time; rewriting them to say 4.6 would fabricate history rather than reflect it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cursor-agent -p --model cursor-grok-4.6-high "..."` (trusted scratch workspace) | PASS — returned `OK Cursor Grok 4.6` |
| `cursor-agent -p --model cursor-grok-4.6-xhigh "..."` | PASS — returned `OK Cursor Grok 4.6` |
| `cursor-agent -p --model cursor-grok-4.5-high "..."` (re-verified after the correction) | PASS — returned `OK Cursor Grok 4.5` |
| `cursor-agent -p --model 'cursor-grok-4.6[effort=high]'` | PASS (expected failure) — `Cannot use this model`, exit 1 |
| `devin -p --model grok-4-6-high -- "..."` | PASS — returned `OK Grok 4.6 High` |
| `devin -p --model grok-4-6-xhigh -- "..."` | PASS — returned `OK Grok 4.6 XHigh` |
| `devin -p --model grok-4-5-high -- "..."` (re-verified after the correction) | PASS — returned `OK Grok 4.5 High` |
| `npm test` (targeted: `executor-config.vitest.ts` + `fanout-run.vitest.ts`) | PASS — 188/188 tests (one unrelated wall-clock-timing flake seen once, confirmed pass on rerun) |
| `npm run typecheck` (`system-deep-loop/runtime`) | PASS — clean, no diagnostics |
| Repo-wide `rg -rniE "grok[ _-]?4\.5\|grok-4-5\|grok45" .opencode/` (post-correction) | PASS — only the audit log and intentional historical/migration-note prose remain |
| Manual inspection of every touched roster table/array | PASS — ascending alphabetical order by id, or by family name then id |
| `feature-catalog.md` and 5 sibling manual-testing playbooks under `cli-external-orchestration/` | PASS — checked, confirmed no stale Grok mentions (only cli-cursor's playbook had one, fixed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **DeepSeek V4 Pro's uid shape changed upstream too**, noticed incidentally while reading `devin models list` (tiered uids `deepseek-v4-pro-{low,high,max}` now appear alongside the untiered `deepseek-v4-pro` slug this repo pins). Out of scope for this packet — the user asked about Grok specifically — and not touched. Worth a follow-up packet if DeepSeek dispatch ever starts behaving unexpectedly.
2. **The broader `npm test` run (whole `system-deep-loop/runtime` suite, not just the files this packet touched)** surfaced pre-existing failures in unrelated subsystems (deep-review rollback/gateway/fencing tests). `git status` confirms this packet modified only 4 code/test files (`executor-config.ts`, `fanout-run.cjs`, `executor-config.vitest.ts`, `fanout-run.vitest.ts`); none of the failing tests live in or import those files. Not investigated further — fixing unrelated pre-existing test debt is out of scope for a Grok roster change. The targeted run scoped to exactly the files this packet changed is the authoritative evidence (188/188 green, reported above).
3. **`validate.sh --strict` could not run** on this spec folder: it depends on `system-spec-kit/mcp-server/dist/lib/validation/spec-doc-structure.js`, which fails to import (`zod` and `better-sqlite3` are both missing from `mcp-server/node_modules` — a pre-existing, unrelated broken install). Substituted a manual structural check instead: all 6 required Level-3 docs present, each carries `SPECKIT_LEVEL: 3` and full frontmatter, and both `description.json`/`graph-metadata.json` are valid JSON with real (not fabricated) SHA-256 content hashes. Fixing the `mcp-server` dependency install is a separate, unrelated packet.
4. **This packet shipped a wrong first version before correcting it.** The initial implementation retired Grok 4.5 from both allowlists, which directly contradicted what the operator wanted once asked. Nothing from that version was committed, so the correction happened in place rather than as a visible revert — but it's worth naming plainly: the first read of "replace all mention of Grok 4.5 with the new Grok 4.6" was wrong, and a more careful first pass would have asked whether "replace" meant retire-and-swap or add-and-supersede before touching a fail-closed dispatch allowlist twice.
<!-- /ANCHOR:limitations -->
