---
title: "Implementation Summary: Cursor model registry and routing"
description: "Composer-2.5 registered as a Cursor-native prompt-craft profile in sk-prompt/prompt-models, with cli-cursor wired into the check-prompt-quality-card-sync.sh CI gate."
trigger_phrases: ["cli-cursor model registry summary", "composer profile implementation"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing"
    last_updated_at: "2026-07-24T10:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented and live-verified phase 005 (Composer registry + CI gate)"
    next_safe_action: "Begin phase 006 (manual testing playbook)"
    blockers: []
    key_files: [".opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json", ".opencode/skills/sk-prompt/prompt-models/references/models/composer-2.5.md", ".opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Composer-only vs. executor rows on every hosted frontier model: Composer-only.", "Composer's exact version slug: composer-2.5 / composer-2.5-fast, live-confirmed."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 005-cursor-model-registry-and-routing |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Composer, Cursor's own native model, now has a full prompt-craft profile in `sk-prompt/prompt-models` — the registry's first entry driven by `cli-cursor` rather than `cli-opencode`. The `check-prompt-quality-card-sync.sh` CI gate learned about `cli-cursor` across all 3 of its coverage points, so the packet's `prompt-quality-card.md` is now gated identically to its siblings.

### `references/models/composer-2.5.md` (new)
Authored mirroring `deepseek-v4-pro.md`'s 8-section shape (Overview / Identity / Recommended Framework / Benchmark Evidence / Tuned Template Snippet / Dispatch Gotchas / See Also) — the unbenchmarked-model precedent, not the benchmark-heavy `glm-5.2.md`, since Composer has zero prior empirical dispatch data in this repo. `recommended_frameworks` set to RCAF primary / no fallback / medium pre-planning / `status: "default-unverified"`, matching the deepseek-v4-pro shape exactly. Named `composer-2.5.md` (not the originally-planned `composer.md`) because `check-prompt-quality-card-sync.sh` CHECK 3 requires the profile filename to exactly match the registry `id`.

### `assets/model-profiles.json`
New `composer-2.5` entry: executor `cli-cursor`, provider `cursor`, quota_pool `cursor-subscription`, `context_length: null` (unexposed by the CLI), `capability: {modalities: ["text"]}` (the minimal shape `deepseek-v4-pro` uses, not the rich opencode-specific `variant_flag`/`agent_policy` block the small-model-rotation entries carry — Cursor CLI has neither flag). Registry `version` bumped 1.5 → 1.6; top-level `description` extended to mention Composer/cli-cursor.

### `references/models/_index.md`
Added the `composer-2.5` row to the ACTIVE MODELS table; clarified the "frontier models are out of scope" line to explicitly name Cursor's hosted frontier ids (`gpt-5.6-sol-*`, `claude-opus-4-8-*`, `cursor-grok-4.5-*`) as included in that exclusion.

### `check-prompt-quality-card-sync.sh`
Added `cli-cursor` to all 3 coverage points identified by reading the script in full: the `cli_cards` array (CHECK 1), the `cli_skills` array (CHECK 2), and the `CLI_EXECUTOR_HUB_METADATA` Python dict (CHECK 4). Did not touch the pre-existing `cli-codex` gap in these same arrays — out of scope per Scope Lock. `FAMILY` dict (CHECK 4's family-token map) needed no edit: `composer-2.5`'s default fallback token (`mid.split("-")[0]` = `"composer"`) already matches what `cli-external-orchestration/graph-metadata.json` carries from phase 003.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read `references/models/glm-5.2.md` (217 lines, benchmark-heavy) then `references/models/deepseek-v4-pro.md` (187 lines) — chose the latter as the structural template since both Composer and DeepSeek-v4-pro share zero prior dispatch data in this repo.
2. Read `references/models/_index.md` and `check-prompt-quality-card-sync.sh` in full to enumerate every place a new model/executor needs registering before writing any content.
3. Confirmed the account was authenticated (`cursor-agent about` → Pro tier, `mkerkmeester@proton.me`) and live-enumerated the model roster via `cursor-agent --list-models` — confirmed `composer-2.5` and `composer-2.5-fast` exist exactly as phase 001/003 had already documented from the product page; no context-length or pricing metadata is exposed by the CLI even authenticated.
4. Ran a live smoke dispatch (`cursor-agent -p "Reply with exactly: pong" --model composer-2.5 --mode ask --output-format text </dev/null`) — returned `pong`, confirming Composer is reachable end-to-end through `cli-cursor`, not just enumerable.
5. Resolved the open "Composer-only vs. hosted-frontier executor rows" question: `model-profiles.json`'s own description scopes it to the small-model rotation, none of Cursor's hosted frontier ids were already present, and `_index.md` already excluded frontier models before this phase — Composer-only was the only consistent answer.
6. Authored `composer-2.5.md`, wired the registry/index/CI-gate edits, then ran `check-prompt-quality-card-sync.sh` — first run failed CHECK 3 (filename `composer.md` didn't match registry id `composer-2.5`); renamed the file (it was still untracked, confirmed via `git status --porcelain` before `mv`) and fixed the two live cross-references (`_index.md`, `model-profiles.json` `profile_ref`).
7. Re-ran the gate — `GUARD PASS` across all 4 checks.
8. Updated `spec.md`/`plan.md`/`tasks.md`/`checklist.md` (this phase) plus the parent packet `spec.md`'s file-change table (1-line filename correction) to reflect the resolved questions and final `composer-2.5.md` filename.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Composer-only, no hosted-frontier executor rows.** `model-profiles.json` is explicitly scoped ("Shared small-model profile registry for cli-opencode dispatch") and none of Cursor's hosted frontier ids were already present as entries; adding them would mean creating brand-new profile entries for `gpt-5.6-sol`/`claude-opus-4-8`/`cursor-grok-4.5` — already excluded by this spec's own §3 Out of Scope.
- **Profile filename is `composer-2.5.md`, not `composer.md`.** `check-prompt-quality-card-sync.sh` CHECK 3 hard-requires `references/models/{registry_id}.md`; the original plan's filename choice predated reading the sync script in full. Renamed before committing (file was still untracked, verified via `git status --porcelain`).
- **Minimal `capability` block (`{modalities: ["text"]}`), not the rich opencode-specific shape.** The `variant_flag`/`agent_policy`/`format_mode`/`quota_pool` sub-fields on `kimi-k2.7-code`/`minimax-m3`/`mimo-v2.5-pro`/`glm-5.2` describe `cli-opencode`-specific dispatch mechanics (`--variant`, `--agent`) that live-verified do not exist on `cursor-agent`. Composer instead follows `deepseek-v4-pro`'s minimal shape.
- **Live-confirmed the version slug rather than leaving it TBD.** Phase 001 left the live roster TBD (auth-gated); by this phase the operator had completed `cursor-agent login`, so `composer-2.5`/`composer-2.5-fast` are recorded as confirmed facts (with citation), not carried forward as a TBD placeholder. Context window and pricing remain TBD — the CLI does not expose them even authenticated.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `model-profiles.json` valid JSON | PASS — `python3 -c "import json; json.load(...)"` exits 0 |
| `check-prompt-quality-card-sync.sh` | PASS — `GUARD PASS — tables not inlined, Tier-3 pointer-only, registry complete, all models discoverable` (all 4 checks) |
| No fabricated auth-gated spec | PASS — `grep -n -i "TBD\|unconfirmed" composer-2.5.md` → 4 hits (context window, avg wall-clock, context-window rationale, context budget) |
| Live Composer dispatch | PASS — `cursor-agent -p ... --model composer-2.5 --mode ask` returned `pong` |
| Profile structural parity with `deepseek-v4-pro.md` | PASS — same 8 section headers, same `recommended_frameworks` shape |
| Security: no embedded credential | PASS — `grep -riE "sk-\|api[_-]?key\|token.{0,3}=\|CURSOR_(API_KEY\|AUTH_TOKEN)\s*="` on the new/changed content → 1 unrelated pre-existing hit (deepseek's `DEEPSEEK_API_KEY` env-var name), 0 inside Composer content |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. Composer's context window and pricing remain TBD — `cursor-agent --list-models`/`models` do not expose them even on an authenticated Pro-tier account, and Cursor's product page does not publish them either. Re-verify at a later date if a task depends on the figure.
2. `avg_iter_wall_clock_min` is `null` — no dispatch history exists for Composer in this repo yet; will only become measurable after real task dispatches accumulate.
3. The pre-existing `cli-codex` gap in `check-prompt-quality-card-sync.sh`'s coverage arrays (present before this phase) was left untouched, per Scope Lock — this phase only added `cli-cursor`.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `../001-cursor-contract-pin/implementation-summary.md`
- `../003-cli-cursor-skill-packet/implementation-summary.md`
- `.opencode/skills/sk-prompt/prompt-models/references/models/deepseek-v4-pro.md` (structural precedent)
