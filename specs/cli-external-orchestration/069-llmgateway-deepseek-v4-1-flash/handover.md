---
title: "Session Handover — 069 DeepSeek V4.1 Flash route repoint"
description: "Continuity handover for cli-external-orchestration/069: pass 1 closed the DevPass route, pass 2 reopened it for the opencode-go and cline-pass siblings. opencode-go is dispatch-verified; cline-pass is listing-only and blocked on models.dev plus the monthly quota. Two live gates are deferred."
trigger_phrases:
  - "session handover"
  - "deepseek v4.1 flash route"
  - "opencode-go cline-pass repoint"
  - "listing-only cline-pass"
  - "deferred live gates"
  - "resume 069"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash"
    last_updated_at: "2026-09-11T10:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Second pass implemented and verified except two deferred live gates; all work uncommitted"
    next_safe_action: "Run the pi-side live turn, then the cline-pass turns after the quota window resets (~2026-09-17 09:30Z)"
    blockers:
      - "cline-pass monthly quota exhausted until ~2026-09-17"
      - "models.dev carries no cline-pass V4.1 entry, so opencode cannot resolve the id"
    completion_pct: 85
---
# Session Handover — 069 DeepSeek V4.1 Flash route repoint

Continuity handover for `cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash`. **Read this first on resume.** Written 2026-09-11. All work is **uncommitted** — see §5.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## When To Use This

Load this handover when resuming packet 069, when touching any DeepSeek Flash model id in the two CLI
rosters or the `.pi` config, or when someone asks whether `cline-pass` serves V4.1 Flash. It is also the
record of *why* the cline-pass row is deliberately marked unproven.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-09-11, the second (reopened) pass of packet 069
- **To Session:** the session that runs the deferred live gates and closes the packet
- **Phase Completed:** IMPLEMENTATION + VERIFICATION, with two live gates deferred by design
- **Handover Time:** 2026-09-11T10:30:00Z
- **Recent action:** the opencode-go route is dispatch-verified and moved, including the cli-opencode mode
  default; the cline-pass route was moved as the operator directed and marked listing-only

**The packet is In Progress and deliberately not closeable** (`acceptance-criteria.md` → `Closeable: No`).

It ran as two passes. The first (2026-09-10, previously Complete) moved the DevPass/LLM Gateway route to
`deepseek-v4.1-flash` after the gateway deactivated `deepseek-v4-flash-vision-exp` and began answering `410`.
That pass **excluded** the `opencode-go` and `cline-pass` siblings by operator scope. The operator then
reopened it on 2026-09-11: *"Update `opencode-go/deepseek-v4-flash-vision-exp`,
`cline-pass/cline-pass/deepseek-v4-flash` for deepseek v4.1 flash — cline and opencode go both support it
already."*

**That premise was half right, and the split is the whole point of this handover.**
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
| --- | --- | --- |
| Reopen this packet rather than start a new one | The operator asked for this spec specifically. One packet keeps the reversal of the original exclusion where the exclusion was made | `decision-record.md` ADR-001; AC-013 marked `Superseded` |
| Move `opencode-go` completely, including the mode default | Verified like-for-like: same cost, context, output ceiling, image input and effort variants | `cli-opencode/SKILL.md`, both rosters, `.pi/settings.json`, the deep-loop pin test |
| Wire `cline-pass` but mark it **listing-only** | It is what the evidence supports: a listing and nothing else. Promoting it would advertise a route that fails on first dispatch — the exact defect this packet removes | Both rosters, `.pi/models.json`, `.pi/custom-providers.md`, the id-format playbook |
| Keep `cline-pass/cline-pass/deepseek-v4-flash` as a named fallback | It is the only dispatch-verified Cline DeepSeek route and the replacement has no measurement behind it | 4 prose mentions — **do not "clean these up"** |
| No runtime pin change | The regex already matched `deepseek-v4.1-flash`; only the test assertion named the old route | `executor-config.vitest.ts` only |

### 2.2 Blockers Encountered

**Blockers:** cline-pass monthly quota; models.dev cline-pass catalog gap; cli-pi self-dispatch denial

| Blocker | Status | Resolution/Workaround |
| --- | --- | --- |
| `cline-pass` monthly quota exhausted | **OPEN** — resets ~2026-09-17 09:30Z | Observed 2026-09-11T08:26Z: `429 "You have reached your monthly Clinepass limit. The limit resets in 6d 1h"`. Gate 2 waits on it |
| models.dev has no cline-pass V4.1 entry | **OPEN** — external | opencode resolves cline-pass from models.dev, so the id dies at resolution. Independent of the quota; report them separately |
| cli-pi self-dispatch denied from inside a pi session | **OPEN** — by design | `shouldDenyPiDispatch` in `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`. **A Claude Code session is not a pi session, so it should not apply — try Gate 1** |

### 2.3 Files Modified

**Key files:** both skills' rosters and `SKILL.md`s, `.pi/models.json`, `.pi/settings.json`, `.pi/custom-providers.md`, the 069 packet, `specs/descriptions.json`

| File | Change Summary | Status |
| --- | --- | --- |
| `cli-opencode/SKILL.md` | Mode default ×4, keywords, anchor → `1.4.6.0` | complete |
| `cli-opencode/references/providers-and-models.md` | opencode-go row (new default), cline-pass row → listing-only, intro, defaults table, envelope, effort table | complete |
| `cli-opencode/references/cli-reference.md` | Cline login example id | complete |
| `cli-pi/SKILL.md` | anchor → `1.5.3.0` | complete |
| `cli-pi/references/providers-and-models.md` | opencode-go row, cline-pass intro/gotcha/row, 2 dispatch examples | complete |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md` | id, expected `defaultModel`, quota skip blocker — **both copies** | complete |
| `.pi/models.json` | cline-pass `id`/`name` → V4.1 (context/output **inherited, not measured**) | complete |
| `.pi/settings.json` | 2 `enabledModels` entries | complete |
| `.pi/custom-providers.md` | ids, dispatch, verify, quota caveat, remove steps | complete |
| `system-deep-loop/…/executor-config.ts` | one pin-comment example | complete |
| `system-deep-loop/…/executor-config.vitest.ts` | pin assertion → live opencode-go literal | complete |
| 069 `spec.md` / `plan.md` / `tasks.md` / `acceptance-criteria.md` / `implementation-summary.md` | In Progress, Phase 4, AC-014…021, `Closeable: No`, 85% | complete |
| 069 `description.json` / `graph-metadata.json` | regenerated | complete |
| `specs/descriptions.json` | +1 row (069), 0 siblings touched, 3,861 → 3,862 | complete |

**New files:** `069/decision-record.md` (ADR-001), `069/handover.md` (this file),
`cli-opencode/changelog/v1.4.6.0.md`, `cli-pi/changelog/v1.5.3.0.md`.

### 2.4 Traps & Scar Tissue

Carry only what the next reader cannot re-derive.

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| --- | --- | --- | --- |
| **The premise can be half true** | A request asserts two routes both work | Load-bearing | Probe each **independently**. `opencode-go` and `cline-pass` split on exactly this |
| **A quota `429` masks model validity** | Any `429` on a shared account | Load-bearing | Always run the **known-good control id** beside the candidate. Without it a failure cannot be attributed |
| **opencode resolves cline-pass from models.dev, not from Cline** | Dispatching a cline-pass id absent from models.dev | Load-bearing | Fails *at resolution* with `Unexpected server error` and **no log line** — silent and misleading. Check `opencode models cline-pass` first |
| **pi's catalog silently lags models.dev** | Adding an id to `.pi` config | Load-bearing | `pi --list-models` omitted it until `pi update --models`. A *correct* config resolved to nothing, with no error |
| **cli-pi self-dispatch denied inside pi** | Any `pi` dispatch from a pi session | Load-bearing | Compound commands (vars, `&`, `&&`) are classed `ambiguous` and also denied. **Even `pi --help` is denied** — read `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/README.md` for the flags instead |
| **A README flag table is not the flag list** | Concluding a CLI lacks a flag because its README omits it | Load-bearing | `--mode text` DOES exist and is pi's default output mode: the arg parser accepts `text`, `json` and `rpc`, and `pi --help` documents it. The README omits it precisely because it is the default. An earlier pass here recorded the opposite as a trap after reading only the README. Verify against the installed binary, not the docs |
| **`timeout` is not on macOS** | Wrapping a long dispatch | Defensive | Background watchdog: `( sleep 150; kill -9 $pid ) &` |
| **`description.json`'s `description` is capped at 150 chars** | Hand-writing a description | Load-bearing | `MAX_DESCRIPTION_LENGTH = 150`; truncates **mid-word, no warning**. Prefer the generator |
| **`upsertDescriptionCacheEntry`'s docstring is wrong** | Trusting it | Defensive | It claims "a per-folder save routes through this" — it does not. Read the call sites |
| **`specs/descriptions.json` has no wired writer** | Expecting a per-folder save to update the aggregate cache | Defensive | `savePerFolderDescription` never touches it; the rebuild functions have **zero production callers** |
| **The track-level `graph-metadata.json` is stale repo-wide** | Backfilling a parent | Defensive | `children_ids` jumps `034 → 065`, omitting 069 + ~20 others. The backfill **refuses** it (`target is not a spec folder`) |
| **`edit_lines` line-count off-by-one** | Editing a file with no trailing newline | Defensive | `line_count` must be `wc -l` **+ 1** |
| **Concurrent sessions mutate this tree** | Any `git status` | Load-bearing | `mcp-tooling/020` and `system-speckit/035` changed *during* this work and were not mine. Check mtimes before attributing a diff |
| **The old cline id must survive in prose** | "Cleaning up" leftover ids | Load-bearing | `cline-pass/cline-pass/deepseek-v4-flash` is the **deliberate fallback** in 4 places |
| **Comment hygiene gate** | Adding a code comment | Load-bearing | **Never** put `ADR-`/`REQ-`/`CHK-`/task ids or spec paths in code comments. Write the durable WHY |
| **Naming the suites you ran is not the same as running the suites your change touches** | Claiming no regressions after a roster or route change | Load-bearing | This pass verified `fanout-run.vitest.ts` and `executor-config.vitest.ts` and reported 213 passing. The route change also broke `combo-matrix.vitest.ts`, which hardcoded `opencode-go/deepseek-v4-flash` as the representative pi command and was never run. Corrected 2026-09-12 during unrelated work. Grep the retired literal across the whole test tree, not just the files you edited |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `acceptance-criteria.md` §CLOSURE — AC-013 is `Superseded`; **AC-014 and AC-018 carry the work**
- **Next safe action:** run Gate 1, then Gate 2 when the quota window resets
- **Cold-read order:** 1. `decision-record.md` (ADR-001 = the scope reversal) → 2. `tasks.md` Phase 4 →
  3. `acceptance-criteria.md` §CLOSURE → 4. this file
- **Context:** the only thing standing between this packet and closure is two live turns

**Gate 1 — pi-side live turn (try it; you are probably not blocked):**

```bash
# -p selects print mode. --mode text also exists and is the default; either is fine here.
pi -p "Reply with exactly this token and nothing else: PI_V41_OK" \
  --provider opencode-go --model deepseek-v4.1-flash \
  --thinking max --offline </dev/null
```

**Gate 2 — cline-pass, on or after ~2026-09-17 09:30Z.** Control first:

```bash
# 1. Control. If this 429s, the window has not reset — STOP, do not test V4.1.
opencode run --model cline-pass/cline-pass/deepseek-v4-flash --variant xhigh \
  --format json --dir /tmp "Reply with exactly this token and nothing else: CLINE_CTRL_OK" </dev/null

# 2. Candidate, only if the control answered.
opencode run --model cline-pass/cline-pass/deepseek-v4.1-flash --variant xhigh \
  --format json --dir /tmp "Reply with exactly this token and nothing else: CLINE_V41_OK" </dev/null

# 3. cli-pi route (config-declared, so pi resolves it even when opencode cannot).
#    Note: pi print mode prints to stdout. --mode text exists too, as the default mode.
pi -p "reply OK" --provider cline-pass --model cline-pass/cline-pass/deepseek-v4.1-flash \
  --thinking xhigh --offline </dev/null
```

**Before step 2, re-check the catalog gap:** `opencode models --refresh cline-pass | grep deepseek`. If
models.dev still has no cline-pass V4.1 entry, opencode fails at resolution **regardless of quota** — a
different defect from the quota, and it must be reported separately.

**If the V4.1 turn fails,** revert the cline-pass row to `cline-pass/cline-pass/deepseek-v4-flash` in all of:
both rosters (incl. the `### cline-pass` intro and the effort-table row), `.pi/models.json`,
`.pi/settings.json`, `.pi/custom-providers.md`, and **both** copies inside
`.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md`
(the scenario contract at ~line 28 *and* the PI-023 table at ~line 46 — they duplicate the expectations, so they
must agree). Then update AC-017/AC-021.

### 3.2 Priority Tasks Remaining

1. Run Gate 1 (pi-side turn) and record the result; pass → AC for REQ-008 upgrades from catalog-only
2. Run Gate 2 after the quota resets — control, then candidate — and either confirm V4.1 or revert the row
3. Re-run derived metadata (§5) and close the packet: `Closeable: Yes`, `completion_pct: 100`, `Status: Complete`

### 3.3 Critical Context to Load

- [ ] `decision-record.md` — ADR-001, the scope reversal
- [ ] `acceptance-criteria.md` — AC-014 (opencode-go verified) and AC-018 (the control that attributes the 429)
- [ ] `implementation-summary.md` — `_memory.continuity` for quick continuity updates
- [ ] `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` — only if a pi dispatch is denied
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All work is present in the working tree — **nothing is committed or stashed** (§5)
- [x] Continuity written to `_memory.continuity` in `implementation-summary.md` and in this file
- [x] No breaking changes left mid-implementation; the repo's runtime tests pass from this state
- [x] Tests: `fanout-run.vitest.ts` + `executor-config.vitest.ts` → **213 tests, 213 pass, 0 fail**
- [x] Frontmatter gate: `check-frontmatter-versions.sh` → 2,894 files, exit 0
- [x] Packet validator: `validate.sh … --strict` → **PASSED, Errors: 0, Warnings: 1**. The one warning is
      `FRONTMATTER_MEMORY_BLOCK`, not `AC_COVERAGE`: the validator prints `AC_COVERAGE` as a passing advisory
      and marks only `FRONTMATTER_MEMORY_BLOCK` as a warning. Of its five issues, one is in this file.
      Re-run it after §5's command sequence if you edit this folder
- [ ] Two deferred live gates — **open by design**, named with owners in §3.1
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### Git state

- **Branch** `skilled/v4.0.0.0`, HEAD `bce3ad789d`
- **Nothing staged or committed.** The packet exists only in the working tree
- **The tree also carries edits that are not mine** (goal-hook docs, `feature-catalog.md`, `barter/`, plus
  concurrent `mcp-tooling/020` and `system-speckit/035` JSON changes). **Stage only the files in §2.3** — a
  blanket `git add -A` would sweep in unrelated and concurrent work

### Regenerating the derived JSONs (both sanctioned, both scoped)

```bash
# graph-metadata.json — default mode refreshes ONE packet, never walks the repo
node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js \
  specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash [--dry-run]

# description.json — OMIT --description so it derives from spec.md (see note 3 below)
node .opencode/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js \
  specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash specs --level 2
```

The backfill writes **only** `graph-metadata.json` — it never touches `description.json`, so a curated
description survives a refresh (it will simply be flagged as drift by the validator).

### Validator notes (confirmed, not guessed)

`validate.sh --strict` failed this packet with **5 errors** and now reports **`Errors: 0  Warnings: 1`**. What
it enforces, in the order that bit:

1. **Every doc needs a `SPECKIT_TEMPLATE_SOURCE:` line within its first 70 lines.** The check is literal —
   any line containing `SPECKIT_TEMPLATE_SOURCE:` passes, there is no allowlist — but it *is* enforced, and
   it was missing from both new files. Use `handover | v1.0` and `decision-record | v2.2`
2. **Every doc needs at least one `<!-- ANCHOR:name -->…<!-- /ANCHOR:name -->` pair.** `handover.md` uses
   `when-to-use`, `handover-summary`, `context-transfer`, `next-session`, `validation-checklist`,
   `session-notes`; `decision-record.md` uses `adr-001` plus its `-context` / `-decision` /
   `-alternatives` / `-consequences` children
3. **`description.json` must equal `derivePacketSynopsis(spec.md)` exactly** — it is a string comparison,
   not a similarity threshold. A curated `--description` **is flagged as drift.** Regenerate it *without*
   `--description` so it derives from `spec.md`
4. **That has a real consequence worth knowing:** the index entry for this packet can only change by editing
   `spec.md`'s **problem sentence** (resolution order is: overview paragraph → problem sentence →
   frontmatter `description:` → title → first line). The derived value currently describes the **first pass
   only** and does not mention the reopen, `opencode-go` or `cline-pass`. Fixing that means editing the
   problem sentence, not the JSON
5. **`GENERATED_METADATA_DRIFT` short-circuits when the source hashes are current,** so drift only surfaces
   after a doc edit. That makes the failure intermittent: **re-run the backfill after every edit to this
   folder**, then re-validate — the fingerprint covers `handover.md` and `decision-record.md` too
6. **AC evidence needs `file:line` citations.** Corrected: `AC_COVERAGE` is NOT the remaining warning, it
   reports as a passing advisory. The single warning is `FRONTMATTER_MEMORY_BLOCK`. The coverage numbers were
   also wrong: 15 of 21 criteria carry malformed citations, not 16, and 7 came from the first pass, not 6.
   The remaining 8 are every criterion this pass wrote, so the majority of the deficit is new rather than
   inherited
7. Changelogs are **excluded** from the frontmatter gate (`EXCLUDED_DIRS` contains `changelog`), which
   instead anchors on `max(SKILL.md version, max changelog version)` — keep SKILL.md ≥ the newest changelog

**Verified command sequence (run in this order, after any edit):**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js \
  specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash          # refresh fingerprint

bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \
  specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash --strict # expect Errors: 0
```

### Open questions for the operator

1. **Is the Cline Pass plan supposed to serve V4.1 at all?** models.dev's cline-pass entry lists only
   `deepseek-v4-flash` and `deepseek-v4-pro`. If the plan does not carry it, revert rather than leave pending
2. **Fix the track-level staleness?** `specs/cli-external-orchestration/graph-metadata.json` omits ~20
   children; only `--all` repairs it, and it would bump hundreds of timestamps
3. **Fix `upsertDescriptionCacheEntry`'s docstring,** or wire the per-folder save to the aggregate cache as
   it claims? It is currently documented-but-untrue
<!-- /ANCHOR:session-notes -->

---
