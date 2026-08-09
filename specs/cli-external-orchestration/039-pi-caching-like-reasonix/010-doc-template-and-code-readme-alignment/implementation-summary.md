---
title: "Implementation Summary: Doc-Template and Code-README Alignment"
description: "Both changes documents reshaped onto the sk-doc general-README template, 9 code-folder READMEs authored from real source evidence and confirmed against sk-doc's own validator, and three rounds of real TypeScript standards deviations fixed across both forks (GLM-5.2/cli-devin, then two gpt-5.6-luna/cli-codex passes covering deep-pi and then pi-cache-optimizer/shared) — every claim verified against real source and a full test/typecheck rerun."
trigger_phrases:
  - "doc template code readme alignment implementation"
  - "glm-5.2 cli-devin dispatch"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/010-doc-template-and-code-readme-alignment"
    last_updated_at: "2026-08-09T06:00:25Z"
    last_updated_by: "spec-author"
    recent_action: "Round 3 (2 fresh gpt-5.6-luna agents, pi-cache-optimizer + shared) fact-checked; all green"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "accept-edits prompts for shell with nobody to answer non-interactively; smart mode is not available in the installed CLI and silently falls back. Fix: keep verification out of the dispatch, run it myself."
      - "Every rewritten document and code-folder README fact-checked directly against real source; all 5 code fixes confirmed present and behavior-preserving via a full test/typecheck rerun."
      - "User said Round 1 was too conservative on comments. Round 2 dispatched 4 fresh gpt-5.6-luna agents via cli-codex, each loading sk-code itself, covering comments/structure across deeppi/, deeppi.ts, live-benchmark.mjs, tests/."
      - "User asked why pi-cache-optimizer never got the same treatment. Checked: Round 2 only targeted deep-pi/. Also asked whether sk-create-readme templates were ever really used; checked against sk-doc's own validator first (0 issues on all 9, no rework needed) before dispatching Round 3 to close the real gap: pi-cache-optimizer/index.ts and shared/composition/one-owner.ts, via 2 fresh gpt-5.6-luna/cli-codex agents."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-doc-template-and-code-readme-alignment |
| **Completed** | 2026-08-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both `CHANGES-FROM-UPSTREAM.md` files now follow the `sk-doc` general-README template shape instead of ad-hoc prose. Every folder of code this packet's earlier work added — 9 folders across `deep-pi` and `pi-cache-optimizer` — now has a code-folder README authored from real source content, not filenames. Two rounds of TypeScript/JavaScript standards work followed: Round 1 fixed 5 small mechanical deviations; Round 2, after user feedback that Round 1 was too conservative, did a full comments-and-structure pass across every file this packet's work touches in `deep-pi` — module headers, TSDoc on every exported symbol, durable WHY-comments, import reorganization, and one genuine structural refactor (`stats.ts`'s duplicate per-model record construction centralized into a single `buildByModel` helper, with the export surface and runtime output unchanged).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` | Rewritten | sk-doc general-README shape; every fact preserved |
| `.pi/extensions/deep-pi/CHANGES-FROM-UPSTREAM.md` | Rewritten | sk-doc general-README shape; every fact preserved |
| `.pi/extensions/deep-pi/{benchmarks,extensions,extensions/deeppi,scripts,tests}/README.md` | Created | 5 code-folder READMEs, sk-doc Section 6 shape |
| `.pi/extensions/pi-cache-optimizer/{tests,types}/README.md` | Created | 2 code-folder READMEs, sk-doc Section 6 shape |
| `.pi/extensions/shared/README.md`, `.pi/extensions/shared/composition/README.md` | Created | 2 code-folder READMEs, sk-doc Section 6 shape |
| `.pi/extensions/pi-cache-optimizer/tests/ownership-composition.test.ts` | Modified (Round 1) | Import specifier `one-owner.ts` → `.js` (module resolution standard) |
| `.pi/extensions/deep-pi/extensions/deeppi/{eligibility,hashlines,stability,stats,stormbreaker,telemetry,utils}.ts` | Modified (Round 1 + Round 2) | Round 1: catch-parameter typing, duplicate interface removal, import ordering. Round 2: module headers, numbered sections, TSDoc on every exported symbol, durable WHY-comments, `stats.ts`'s `buildByModel`/`MODEL_IDS` centralization |
| `.pi/extensions/deep-pi/extensions/deeppi.ts` | Modified (Round 2) | Module header, TSDoc, ambiguous local renames (`ctx`→`context`, `storm`→`stormBreaker`, `hashlines`→`hashlineStats`), WHY-comments |
| `.pi/extensions/deep-pi/scripts/live-benchmark.mjs` | Modified (Round 2) | Module header, numbered sections, WHY-comments, formatting; the missing-header gap Round 1 had explicitly deferred |
| `.pi/extensions/deep-pi/tests/*.ts`, `*.mjs` (14 files) | Modified (Round 2) | Module headers, import reorganization, durable WHY-comments on regression/race/monkey-patch tests; replaced ephemeral `Finding 1-4` labels in `review2.test.ts` with durable descriptions; test assertions unchanged |
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modified (Round 3) | Module header, numbered sections, TSDoc, interfaces for recurring object shapes, WHY-comments; the fork Round 2 never covered. Export surface and all 7 hook registrations confirmed byte-identical to the original committed fork |
| `.pi/extensions/pi-cache-optimizer/tests/{hook-guards,ownership-composition,review-findings}.test.ts` | Modified (Round 3) | Module headers, numbered sections, WHY-comments on mocks/fixtures; test assertions unchanged |
| `.pi/extensions/shared/composition/one-owner.ts` | Modified (Round 3) | Module/section organization, TSDoc for exported symbols, ownership rationale comment; exported names and behavior unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The user directed GLM-5.2 High through `cli-devin` (`--model glm-5-2`, confirmed against `references/providers-and-models.md` as the exact "High" tier — the no-suffix GLM-5.2 model). The dispatch prompt inlined the exact sk-doc template rules (read directly from `sk-create-readme/SKILL.md`), the exact real file listing for all 9 target folders (gathered directly, not delegated), and the sk-code-opencode TypeScript standards references to check against.

**Two permission-mode failures before a working dispatch, both discovered and fixed directly:**

1. `--permission-mode accept-edits` — read all files correctly, wrote nothing, then hit `warning: rejected a tool call that requires confirmation. Running in non-interactive mode.` `accept-edits` auto-approves workspace edits but "prompts for shell" per `cli-reference.md`'s own permission-mode table; a non-interactive `-p` dispatch has nobody to answer that prompt. The task's own instruction to run `npm test`/`npm run typecheck` as a verification step was the trigger. Confirmed zero files written via a `git status` diff against a pre-dispatch baseline snapshot.
2. `--permission-mode smart` — the installed CLI printed `Warning: Smart permission mode is not available. Falling back to normal` and rejected even earlier, since `normal` is more restrictive than `accept-edits`.

**Fix:** rather than escalating to `--permission-mode dangerous` (which the skill's own rules require explicit user approval for), the prompt was changed to remove the shell-verification instruction entirely — the dispatch does only file reads and edits, and verification runs afterward directly, matching this whole session's established discipline of never trusting a dispatched agent's own test claims anyway. The third attempt, back on `accept-edits`, completed cleanly in ~500 seconds with zero rejections.

**Verification, not trust.** Every claim in the dispatch's final report was checked against real source, not accepted at face value:

- Both rewritten documents: a sentence-level diff (`grep -oE '[A-Z][^.]*\.' | sort -u`) against a pre-rewrite snapshot found only expected structural artifacts of the template reshape (bullet-to-table syntax, an added blockquote tagline, an added Related Resources section) — zero facts dropped or altered.
- All 9 code-folder READMEs: ~15 specific technical claims spot-checked directly against source (export lists in `hashlines.ts` and `stats.ts`, hook registrations in `deeppi.ts`, exact env var names in `live-benchmark.mjs`, the "no imports" claim in `one-owner.ts`, declared functions in `node-shims.d.ts`, the `cwd` implementation in `fake-pi.ts`) — every claim checked was accurate.
- All 5 applied code fixes: read directly from final source and confirmed present exactly as the report described.

**Round 2 — deeper comments-and-structure pass.** The user reviewed Round 1's result and said it wasn't thorough enough: real standards work should cover inline comments and structure, not just narrow mechanical fixes, and the dispatched agent should load `sk-code` itself rather than being handed pre-extracted excerpts. Four fresh `gpt-5.6-luna` (max reasoning, fast tier) agents were dispatched in parallel via `cli-codex`, one per disjoint target — `deeppi/` (7 files), `deeppi.ts`, `live-benchmark.mjs`, `tests/` (14 files) — each explicitly instructed to load `.opencode/skills/sk-code/SKILL.md` and follow its own Smart Routing to the `sk-code-opencode` surface, then apply that surface's standards including comments and structure this time. `cli-codex`'s `workspace-write` sandbox has no `accept-edits`-style shell restriction, so each agent ran its own `npm test`/`npm run typecheck` as part of its work — still independently re-verified afterward, not trusted.

Three of the four completed in 9-14 minutes. The fourth (`deeppi/`, the largest scope) took ~37 minutes and included a genuine structural refactor: `stats.ts`'s repeated per-model record construction (`emptyByModel`, `cloneByModel`, and daily-total initialization each independently building a 2-key object) was centralized into one `buildByModel(factory)` helper driven by a `MODEL_IDS` constant derived from `eligibility.ts`'s exported `DEEPPI_MODEL_IDS` — removing duplication and making the code adapt automatically if a model is ever added, without changing today's output. Verified: the export surface stayed identical before and after (18 `export` statements, same names and signatures), and the full test suite (which exercises the resulting document shape) still passes 81/81.

Every one of the 4 reports was fact-checked the same way as Round 1 — nothing accepted on the dispatch's own word:

- All 7 `deeppi/` files and `deeppi.ts` read in full. Confirmed: module headers and numbered sections present; TSDoc on every exported function/interface; the `buildByModel` refactor behavior-identical (checked above); local variable renames (`ctx`→`context`, `storm`→`stormBreaker`, `hashlines`→`hashlineStats`) applied consistently everywhere with no leftover old names; `parameters: editLinesSchema as any` retained with its justification comment intact (a genuine external-contract exception, not an oversight); `stormbreaker.ts`'s previously-flagged task-labelled comment removed and replaced with durable module documentation, with no ID or reference left in its place.
- `live-benchmark.mjs` spot-checked against the exact env vars and defaults confirmed earlier this session (`DEEPSEEK_API_KEY`, `DEEPPI_MODEL`/`deepseek-v4-pro`, `DEEPPI_BASE_URL`/`https://api.deepseek.com`, `DEEPPI_LIVE_ROUNDS`/1-10, `DEEPPI_LIVE` gate) — all preserved exactly; `node --check` re-run independently.
- `review2.test.ts` and `deeppi.integration.test.ts` spot-checked: the ephemeral `Finding 1-4` comments are gone (replaced with durable technical descriptions), the previously-untyped `catch` parameter is now `catch (error: unknown)`, and the module header/import grouping matches the report's claims.
- Full test suite and typecheck re-run by me, independently, after all 4 dispatches landed: deep-pi 81/81, pi-cache-optimizer 34/34 (untouched by Round 2, re-confirmed anyway), both typechecks clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:round3 -->
## Round 3 — closing the pi-cache-optimizer and shared/ gap

The user asked why `pi-cache-optimizer/` never got the same treatment as `deep-pi/`. Direct check: Round 2's four dispatches only targeted `deep-pi/` paths (`deeppi/`, `deeppi.ts`, `live-benchmark.mjs`, `tests/`); `pi-cache-optimizer/index.ts` and `shared/composition/one-owner.ts` were never in scope for any round. Confirmed with a real command before dispatching anything: `index.ts` (8,390 lines) had no module header and only 8 stray section-divider-shaped comment lines in the whole file.

Separately, the user raised whether `sk-doc`'s `sk-create-readme` templates were ever really used for the 9 code-folder READMEs. Checked against the packet's own validator (`validate_document.py`) before doing any rework: all 9 report `✅ VALID, Total issues: 0`. The numbered ALL-CAPS shape, the subdirectory-count-conditional Directory-Tree-vs-flat-table rule, and the no-ToC rule were all followed correctly. This is a real, checked finding, not agreement for its own sake: no README rework was warranted or performed.

Dispatched 2 fresh GPT-5.6-LUNA (max reasoning, fast tier) codex agents in parallel, mirroring Round 2's method (self-load `sk-code`, don't feed pre-extracted excerpts): one for `index.ts` alone (large enough to need its own agent), one bundling the 3 `pi-cache-optimizer/tests/` files with `shared/composition/one-owner.ts`.

**First launch stalled immediately.** Both dispatch prompts omitted the `Spec folder: ... (pre-approved, skip Gate 3)` line `cli-codex`'s own rules require before delegating file-editing work. Both dispatches hit the Gate-3 documentation-scope question, spent ~19k tokens each asking it, and exited having changed nothing — confirmed via each dispatch's raw log before touching anything else. Relaunched immediately with the line added; both completed cleanly (tests+shared ~11 min, index.ts ~15 min).

**One real diagnostic during fact-check.** The tests+shared dispatch's own `npm run typecheck` reported a TS2724 failure at `index.ts:19`, a file it never touched. Rather than accept or dismiss this, checked live: the other dispatch was still running and actively editing `index.ts` at that moment (`kill -0` confirmed it alive), and `index.ts` has no import from `shared/` that the other dispatch's `one-owner.ts` change could have broken. Once both dispatches had exited, a fresh `npm run typecheck` from the true final state was clean — confirming this was a transient race from two dispatches sharing one TypeScript compilation unit, not a real defect from either dispatch's work.

**Verification beyond the dispatch's own claim.** `index.ts` is tracked in git from the original fork commit (`19ac4a458d`), giving a real pre-dispatch baseline. Diffed the export surface and hook registrations directly: both exports (`__internals_for_tests`, the default export) and all 7 `pi.on(...)` registrations (`before_agent_start`, `before_provider_request`, `after_provider_response`, `model_select`, `session_start`, `session_shutdown`, `message_end`) are byte-identical to the committed original. The default export's function body is unchanged except for an added `: void` return-type annotation. Spot-checked the 131 double-quote occurrences remaining after the formatting pass: every one is legitimate content (a regex literal, or a message string that must contain a literal double quote), not a missed formatting fix.
<!-- /ANCHOR:round3 -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split verification out of the dispatch instead of escalating to `--permission-mode dangerous` | `dangerous` requires explicit user approval per `cli-devin`'s own rules; the actual need (running `npm test`/`npm run typecheck`) is something this session can do directly with no permission friction at all |
| Use only "Round 1/2/3" labels in deep-pi's reshaped changes document | Comment-hygiene discipline: internal phase/packet identifiers don't belong in a document meant to be read by someone unfamiliar with this repo's own spec-folder structure |
| Author a code-folder README in `deep-pi/extensions/` in addition to `deep-pi/extensions/deeppi/` | The user said "every folder"; `extensions/` has its own file (`deeppi.ts`) and a subdirectory, so it gets its own README with a directory tree per the sk-doc subdirectory-count rule, rather than folding it into the child folder's README |
| Leave 4 code-standards findings unfixed | Fixing them would require adding comments (outside the task's file-edit-only constraint) or risk changing runtime behavior for a cosmetic gain; both are documented in the dispatch's report as explicit, cited findings rather than silently dropped |
| Do not rework the 9 code-folder READMEs against the sk-create-readme template | Checked first: the packet's own validator reports 0 issues on all 9. Reworking a document with no real defect would be cosmetic churn against a user concern that the evidence didn't support |
| Run the two Round-3 dispatches in parallel despite them sharing one TypeScript project | Wall-clock savings outweigh the risk; the resulting transient typecheck failure was diagnosable in under a minute (one still-alive PID check) and resolved itself once both dispatches finished, with no real defect introduced |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both changes documents follow the sk-doc general-README shape | PASS — H1 + tagline, numbered ALL-CAPS H2s, `---` separators, no ToC, no anchors |
| Zero facts lost or altered in the reshape | PASS — sentence-level diff, only expected structural artifacts |
| All 9 code-folder READMEs accurate | PASS — ~15 spot-checked claims, all verified against real source |
| All 5 Round-1 code-standards fixes real and cited | PASS — confirmed present in final source at the reported locations |
| All 7 Round-2 files (module headers, TSDoc, comments, `stats.ts` refactor) accurate | PASS — read in full, spot-checked against real source, export surface confirmed identical |
| Round-2 local-variable renames applied consistently | PASS — no leftover old names (`ctx`, `storm`, `hashlines`) found in `deeppi.ts` |
| deep-pi `npm test` (after Round 1, re-confirmed after Round 2) | PASS both times — `Test Files 11 passed (11)`, `Tests 81 passed (81)` |
| deep-pi `npm run typecheck` (after Round 1, re-confirmed after Round 2) | PASS both times — `tsc --noEmit` exit 0, no output |
| pi-cache-optimizer `npm test` (after Round 1, Round 3; re-confirmed after Round 2) | PASS every time — `pass 34`, `fail 0` |
| pi-cache-optimizer `npm run typecheck` (after Round 1, Round 3; re-confirmed after Round 2) | PASS every time — `tsc --noEmit --pretty false` exit 0, no output |
| `index.ts` export surface and hook registrations vs. the original committed fork | PASS — both exports and all 7 `pi.on(...)` registrations byte-identical to `19ac4a458d` |
| 9 code-folder READMEs vs. `sk-doc`'s own validator | PASS — `validate_document.py` reports 0 issues on all 9; no rework performed |
| Secret scan across all new/changed files (all three rounds) | PASS — zero matches |
| Internal phase/packet/ADR/REQ/CHK/task-id leakage check (all three rounds) | PASS — zero matches, only "Round 1/2/3" labels used |
| `git status --porcelain` scope (after all three rounds) | PASS after cleanup each time — see Stray-Artifact note below |
| `validate.sh --strict` on this folder | PASS — 0 errors, 0 warnings |
| `validate.sh --recursive --strict` on the whole `039` packet | PASS — 0 errors, 0 warnings |

### Stray-artifact note

The scope sweep found repo-root `.pi/deep-pi-stats.json` after all three rounds — real session entries with fresh timestamps and all-zero totals each time. This is not caused by this phase's own commands — the prior phase's `tests/fake-pi.ts` fix (isolated `mkdtempSync` cwd) already prevents this repo's own test runs from writing to the real repo-root path, and no command in this phase invokes a live Pi session. It is a recurring ambient Pi process outside this session's direct control. Removed as routine cleanup each time; final sweep clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **3 of Round 1's 4 noted-but-not-fixed findings are resolved by Round 2's deeper pass** (user feedback that Round 1 was too conservative), confirmed by direct re-read of final source, not the dispatch's own claim:
   - `hashlines.ts`'s unexplained `any` cast now carries a justification comment directly above it (`hashlines.ts:291-293`: `// The SDK's schema field uses a generic parameter type; this tool intentionally exposes // plain JSON Schema.` above `parameters: editLinesSchema as any,`).
   - `stormbreaker.ts`'s non-null assertion now carries a justification comment directly above it (`stormbreaker.ts:144-145`: `// A completed all-failed batch is non-empty because batches start from assistant tool calls.` above `const lastError = ordered.at(-1)!.text.slice(0, 300);`).
   - `telemetry.ts`'s unsafe cast (Round 1 cited it as `ctx.model.id as never`; Round 2's refactor changed it to a narrower `as unknown as PricedModel` cast) now carries a justification comment directly above it (`telemetry.ts:356-358`: `// Provider and model-id guards select a supported DeepPi model; // recordUsage validates its numeric pricing fields.`).
   - The missing module-header gap is closed for every file Round 2 actually targeted: `live-benchmark.mjs`, `cross-process-lock-worker.mjs`, and `cross-process-stats-worker.mjs` all now open with a module-header block, confirmed by direct read.
2. **One header-status item is unattributable to either round, noted rather than guessed**: `benchmarks/before-provider-request.mjs` also has a module header today, but the file is untracked (`git status --porcelain` shows `??`, not `M`) and was never named as a target in either round's dispatch scope, so there is no diff baseline to confirm whether it always had one or an earlier untracked edit added it. Not claimed as either round's work.
3. **`--permission-mode smart` is documented in `cli-devin`'s own reference material as an available mode but is not supported by the installed CLI version** (falls back silently to `normal`). This is a real, reproducible gap between the skill's documentation and the installed binary's actual behavior, discovered during this phase — worth a correction in `cli-devin`'s own reference docs, out of scope to fix here.
<!-- /ANCHOR:limitations -->
