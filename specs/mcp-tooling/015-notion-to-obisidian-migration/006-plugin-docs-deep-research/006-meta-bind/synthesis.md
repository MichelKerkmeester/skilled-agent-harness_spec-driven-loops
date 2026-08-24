---
title: "Meta Bind docs — synthesis of deep-research into an actionable edit plan"
description: "Fresh-reviewer synthesis that turns the 006-meta-bind deep-research findings into a prioritized, evidence-cited plan for correcting the shipped mcp-obsidian Meta Bind reference docs — headlined by the =now() timestamp correctness bug."
importance_tier: "normal"
contextType: "analysis"
version: "0.1.0.0"
---

# Meta Bind docs — research synthesis and edit plan

## Verdict

The shipped Meta Bind docs teach a **correctness bug**: they stamp a button-written timestamp with `value: "=now()"` (and cite `"=now().format('YYYY-MM-DD HH:mm')"` as "the documented pattern"). Meta Bind has **no `now()` function and no `=`-prefixed expression language** — `=now()` is a Dataview convention misapplied. The correct form is an `updateMetadata` action with `evaluate: true` and a plain-JavaScript `value: "new Date().toISOString()"`. This appears at **10 sites across 4 of the 5 shipped files** and must be fixed everywhere. Secondary corrections: the `js`-action signature is documented wrong (it does not call an exported function), and the JS-Engine→Meta-Bind metadata coupling (`engine.getPlugin(...).api`) plus the "enable JavaScript in Meta Bind settings" prerequisite are missing.

All evidence is from the plugin author's **official docs** (`moritzjung.dev/obsidian-meta-bind-plugin-docs`). The installed compiled `main.js` (v1.5.1) was **not** parsed — see the residual caveat below. The correction *direction* is not in doubt; a `main.js` confirmation of exact `evaluate` handling and the `js` `file`-resolution base should land before edits ship.

Repo path of the docs under review: `.opencode/skills/mcp-tooling/mcp-obsidian/` — reference files under `references/plugins/meta-bind/`, catalog at `feature-catalog/plugins/meta-bind.md`.

---

## Prioritized edit table

Line numbers are as read 2026-08-22. All paths are relative to `.opencode/skills/mcp-tooling/mcp-obsidian/`.

### P0 — `=now()` correctness bug (fix every instance)

| # | Target file · anchor | Change | Evidence + source | main.js confirm? |
|---|---|---|---|---|
| P0-1 | `references/plugins/meta-bind/workflows.md` §2 Step 2 (line 49) | In the Start-button code block, replace `value: "=now()"` → `value: "new Date().toISOString()"` (keep `evaluate: true`). | `updateMetadata` `evaluate:true` treats `value` as a plain JS expression; no `now()` exists. Research VERIFY-res-1. Source: `/reference/buttonactions/updatemetadata/` | Yes — confirm `evaluate` handling in v1.5.1 main.js |
| P0-2 | `references/plugins/meta-bind/workflows.md` §2 Step 3 (line 66) | End-button code block: same replacement `=now()` → `new Date().toISOString()`. | Same as P0-1. | Yes |
| P0-3 | `references/plugins/meta-bind/workflows.md` §2 Step 3 blockquote (line 70) | Rewrite: drop "`value: "=now()"` is the documented pattern" and the `"=now().format('YYYY-MM-DD HH:mm')"` claim. State that timestamps use plain JS (`new Date().toISOString()`); for a display format use JS `Date` methods (Meta Bind ships no formatting helper). Remove the "grammar is VERIFY" framing (RESOLVED). | Meta Bind has no `now()`/`.format()`; no `=` language. Research VERIFY-res-1. Source: `/reference/buttonactions/updatemetadata/` | Yes |
| P0-4 | `references/plugins/meta-bind/data-model.md` §5 button block example (line 78) | Code block: `value: "=now()"` → `value: "new Date().toISOString()"`. | Same as P0-1. | Yes |
| P0-5 | `references/plugins/meta-bind/data-model.md` §5 action-catalog table, `updateMetadata` row (line 95) | Remove the false "(prefix `=`)": rewrite the cell to "with `evaluate: true`, `value` is a **plain JavaScript expression** (current value available as `x`; other props via `getMetadata(bindTarget)`)". | No `=` prefix; `value` is JS. Research VERIFY-res-1 (official wording quotes `x` and `getMetadata`). Source: `/reference/buttonactions/updatemetadata/` | Yes |
| P0-6 | `references/plugins/meta-bind/data-model.md` §5 VERIFY bullet "The timestamp expression" (line 107) | Remove/replace: this VERIFY item is RESOLVED. State the answer (plain JS `new Date().toISOString()`, no `now()`/`=`) instead of "must be confirmed… whether `now()`/`.format(...)` are the exact callables". Keep the `inlineJS`/`js` fallback mention. | RESOLVED — Research VERIFY-res-1. | Yes (for exact evaluate handling) |
| P0-7 | `references/plugins/meta-bind/data-model.md` §1 intro (line 15) | Reframe "the evaluated-expression grammar (how `now()`/date formatting is written) … flagged VERIFY": the grammar is now known (plain JS). Keep only the residual "confirm exact `evaluate` handling against installed v1.5.1 main.js". | RESOLVED — Research VERIFY-res-1. | Yes (residual) |
| P0-8 | `references/plugins/meta-bind/troubleshooting.md` §2 row "Timestamp written literally as `=now()`" (line 25) | Reframe the symptom/fix: literal write means `evaluate: true` is missing so `value` is stored as a raw string. Fix = set `evaluate: true` **and** use a plain JS expression (`new Date().toISOString()`). Remove the "`now()`/`.format()` grammar is VERIFY" language. | RESOLVED — Research VERIFY-res-1; `evaluate:true` gates JS evaluation. Source: `/reference/buttonactions/updatemetadata/` | Yes (for exact evaluate handling) |
| P0-9 | `references/plugins/meta-bind/meta-bind.md` §1 (line 35) | Reframe "how `now()` is formatted inside an `updateMetadata` `value` … flagged VERIFY": grammar RESOLVED (plain JS). Reduce to the residual main.js confirmation. | RESOLVED — Research VERIFY-res-1. | Yes (residual) |
| P0-10 | `references/plugins/meta-bind/meta-bind.md` §4 guardrail (line 68) | Reframe "Never invent the evaluated-expression grammar … How `now()`/date formatting is written … VERIFY": it is now documented (plain JS, no `=`). Keep the "don't invent the JS-file signature / confirm against installed plugin" spirit but point at the resolved answer. | RESOLVED — Research VERIFY-res-1 + res-2. | Partly (js file base) |

### P1 — js-action signature, ObsAPI coupling, prerequisites

| # | Target file · anchor | Change | Evidence + source | main.js confirm? |
|---|---|---|---|---|
| P1-1 | `references/plugins/meta-bind/data-model.md` §5 catalog, `js` row (line 98) | Correct "Runs an exported function from a vault JS file" → the `js` action runs the file **as-is (not a module export)** with a global `context`; `file` is **relative to vault root**; optional `args?`. Interface: `{type:'js', file, args?}`. | Research VERIFY-res-2. Sources: `/reference/buttonactions/runjavascript/`, `/reference/buttonactions/inlinejs/` | Yes — confirm `file`-resolution base in main.js |
| P1-2 | `references/plugins/meta-bind/data-model.md` §6 "Callable file" example (lines 128-136) | Replace `export function execute(params) { … }` + "params shape is VERIFY" with the real `js`-action contract: file executes as-is; `context.args`, `context.buttonConfig`, `context.buttonContext` (and `context.file.path` in coupling). Keep JS-Engine `importJs()` module-export separate — the doc currently conflates the two. | Research VERIFY-res-2 + coupling section. Sources: `/reference/buttonactions/runjavascript/`, `/api/interfaces/buttoncontext/` | Yes |
| P1-3 | `references/plugins/meta-bind/data-model.md` §6 (add) | Document the metadata coupling: from a script, read/write metadata via `engine.getPlugin('obsidian-meta-bind-plugin').api` (the `ObsAPI`) — `parseBindTarget`, `getMetadata`, `setMetadata`, `updateMetadata`, `subscribeToMetadata` — **not** `engine.setMetadata`. Add the "don't destructure ObsAPI methods (lose `this`, throw); call as `mb.method()`" gotcha. | Research "How js/inlineJS couple to JS Engine". Sources: `/guides/api/`, `/api/classes/obsapi/`, js-engine `/api/classes/engine/` | Inferred from docs — confirm ObsAPI surface in main.js if edited precisely |
| P1-4 | `references/plugins/meta-bind/data-model.md` §5/§6 + `troubleshooting.md` §2 row (line 28) | Add the second JS prerequisite everywhere JS actions are discussed: **JavaScript must be explicitly enabled in Meta Bind settings** (Settings → Meta Bind → Enable JavaScript), in addition to JS Engine installed+enabled. | Research VERIFY-res-2 prerequisites. Source: `/reference/buttonactions/runjavascript/` | No (settings toggle, not code) |
| P1-5 | `references/plugins/meta-bind/workflows.md` §2 Step 5 (line 76-78) | Update the JS-Engine fallback to compute elapsed time via `engine.getPlugin('obsidian-meta-bind-plugin').api` reading `startTime`/`endTime` (not an unspecified export). Note this is more reliable than a mathjs view field (no date support; updates only while note open). | Research "Corrected task-timer recipe" + coupling. Sources: `/guides/api/`, `/guides/viewfields/` | Yes (js file base) |
| P1-6 | `references/plugins/meta-bind/troubleshooting.md` §2 `js-engine` row (line 28) | Broaden causes: add "JavaScript not enabled in Meta Bind settings" and "destructured ObsAPI method / used `engine.setMetadata` instead of `getPlugin(...).api`"; the "exported function signature wrong" cause is stale (no export). | Research VERIFY-res-2 + coupling gotcha. Sources: `/reference/buttonactions/runjavascript/`, `/guides/api/` | Yes |

### P2 — completeness and polish

| # | Target file · anchor | Change | Evidence + source | main.js confirm? |
|---|---|---|---|---|
| P2-1 | `references/plugins/meta-bind/data-model.md` §2 input fields (lines 23-31) | Complete the type list (`date, dateTime, editor, imageListSuggester, imageSuggester, inlineList, inlineListSuggester, inlineSelect, list, listSuggester, multiSelect, progressBar, select, slider, suggester, textArea, time`) and add the `INPUT[type(arg1,arg2):bindTarget]` argument syntax (e.g. `inlineSelect(option(a),option(b))`). Drop the "VERIFY uncommon type spellings" (RESOLVED). | Research "Confirmed input-field syntax". Source: `/guides/inputfields/` | No |
| P2-2 | `references/plugins/meta-bind/data-model.md` §3 bind targets (lines 46-50) | Add the 4th form `memory^propName` — in-memory only, not persisted (good for transient values). | Research input-field bind-target forms. Source: `/guides/inputfields/` | No |
| P2-3 | `references/plugins/meta-bind/data-model.md` §4 + `workflows.md` §4 computed VIEW (line 58 / 107) | Resolve the VIEW VERIFY: view-field computation uses **mathjs, not JS** — `VIEW[{a} * {b}]` (bind targets in `{curly}`), `VIEW[{a}*{b}][math:c]` saves to target `c`; types `math|text|link|image`. Note mathjs has **no date functions** by default. | Research "Confirmed … view-field syntax". Source: `/guides/viewfields/` | No |
| P2-4 | `references/plugins/meta-bind/data-model.md` §5 button table (line 89) | Note `action` and `actions` are **mutually exclusive** (using both is an error). | Research "Button blocks". Source: `/guides/buttons/` | No |
| P2-5 | `references/plugins/meta-bind/troubleshooting.md` (add a gotchas set) | Add: view fields update **only while the note is open** (closed source note breaks cross-note compute); circular view-field dependencies are detected/prevented; **JS View Fields disabled by default** (security); programmatic API objects need `mount()`/`unmount()` (lifecycle leaks). | Research "Missing workflows and gotchas". Sources: `/guides/viewfields/`, `/guides/api/` | Inferred — confirm behaviors if asserted strongly |
| P2-6 | `references/plugins/meta-bind/data-model.md` §4/§6 | Add the MathJS extension pattern for date/custom functions in view fields: a JS-Engine **startup script** calling `mb.mathJSImport({ … })` (not an in-note block — timing). | Research "MathJS extension pattern". Source: `/guides/custommathjs/` | Inferred |
| P2-7 | `feature-catalog/plugins/meta-bind.md` §4 guardrail (line 49) | The guardrail says the evaluated-expression grammar and `js`-action signature are "both `VERIFY`". Both are now RESOLVED — soften to "confirmed from official docs; confirm exact evaluate handling / js file base against installed main.js". | RESOLVED — Research VERIFY-res-1 + res-2. | Residual only |
| P2-8 | `references/plugins/meta-bind/meta-bind.md` §1 (line 35), `workflows.md` §intro (line 11) | Global "VERIFY before shipping" framing is stale for the two named unknowns. Reframe to "confirmed from official docs; confirm exact `evaluate` handling + `js` file base against installed v1.5.1 main.js". | RESOLVED — Research provenance + confidence section. | Residual only |

---

## VERIFY-flag resolution

Both unknowns the shipped docs flagged as VERIFY are **RESOLVED** by the research, from the plugin author's official docs.

- **VERIFY 1 — the `now()`/timestamp-expression grammar: RESOLVED.** Meta Bind has **no** `now()` and **no** `=`-prefixed language. A timestamp is written by `updateMetadata` with `evaluate: true` and a plain JS `value` (`"new Date().toISOString()"`); inside the expression the current property value is `x` and other props are read via `getMetadata(bindTarget)`. Display formatting uses JS `Date` methods — Meta Bind provides no formatter. Source: `/reference/buttonactions/updatemetadata/`.
- **VERIFY 2 — the `js` inline-button action signature: RESOLVED.** `{type:'js', file, args?}` where `file` is relative to **vault root**; the file runs **as-is (not a module export)** with a global `context` (`.args`, `.buttonConfig`, `.buttonContext`, and `.file.path` in coupling). Companion `{type:'inlineJS', code}`. Prereqs: JS Engine installed+enabled **and** JavaScript enabled in Meta Bind settings. Metadata read/write couples via `engine.getPlugin('obsidian-meta-bind-plugin').api` (ObsAPI), never `engine.setMetadata`; don't destructure ObsAPI methods. Sources: `/reference/buttonactions/runjavascript/`, `/reference/buttonactions/inlinejs/`, `/api/interfaces/buttoncontext/`, `/guides/api/`, `/api/classes/obsapi/`.

**Residual caveat (owed before edits land):** The installed compiled **`main.js` (v1.5.1) was not parsed** — all findings are official-docs-only. Confirm two things against the installed bundle: (a) the exact `updateMetadata` `evaluate` handling (that `evaluate:true` runs `value` as JS and `new Date().toISOString()` lands as expected), and (b) the `js` action's `file`-resolution base (vault-root vs config-dir). This closes the loop; it does not change the correction direction, since `=now()` is a definite negative finding from the author's own docs.

---

## Do-NOT-change (confirmed correct)

- **`updateMetadata` is the right action** for stamping frontmatter timestamps, and `evaluate: true` is required — keep both; only the `value` and the `=`/`now()` claims change.
- **`inlineJS` catalog row** (`data-model.md` §5, line 96: "`inlineJS | code | Runs inline JavaScript (via JS Engine)`") matches `{type:'inlineJS', code}` — correct.
- **The core file-layer model** — author `INPUT`/`VIEW`/`BUTTON` text and read/write frontmatter, never drive the rendered widget — is correct and is the right guardrail throughout.
- **Plugin identity facts**: repo `mProjectsCode/obsidian-meta-bind-plugin`, manifest id `obsidian-meta-bind-plugin` vs store slug `meta-bind`, installed v1.5.1, JS-Engine companion `js-engine` v0.3.6 — consistent with research; leave as-is.
- **Total-Time column is a Notion Bases formula, not a Meta Bind field** — correct division of responsibility; keep.
- **`action` (single) / `actions` (array) both exist** — correct; only *add* the mutual-exclusivity note (P2-4).
- **Bind-target forms `propName`, `scope['prop name']`, `file#propName`** — correct; only *add* the 4th `memory^` form (P2-2).
- **`feature-catalog/plugins/meta-bind.md`** contains **no `=now()`** and needs no code correction — only the stale-VERIFY guardrail softening (P2-7).

---

## CONFIRMED vs INFERRED

**CONFIRMED (official docs, cross-referenced, no contradictory evidence in the research):**
- `=now()`/`=`-prefix language does not exist in Meta Bind; timestamps use plain JS with `evaluate:true`. (VERIFY-res-1)
- `js` action = `{type:'js', file (vault-root-relative), args?}`, runs file as-is with `context`. (VERIFY-res-2)
- Metadata coupling via `engine.getPlugin('obsidian-meta-bind-plugin').api`; don't-destructure gotcha; JS-enable-in-settings prereq.
- Input-field type list + arg syntax; 4 bind-target forms; view fields use mathjs (no date functions); `action`/`actions` mutual exclusivity.

**INFERRED / official-docs-only (not verified against installed binary):**
- Exact `updateMetadata` `evaluate` runtime handling in v1.5.1 `main.js` — **owed** (residual caveat).
- The `js` action `file`-resolution base in `main.js` — **owed** (residual caveat).
- Gotchas P2-5/P2-6 (view-field liveness, circular-dependency prevention, JS View Fields default-off, lifecycle mount/unmount, `mb.mathJSImport`) are from guide pages, not the binary — assert with normal doc confidence, not as binary-verified.

> **main.js verification still owed:** parse the installed `obsidian-meta-bind-plugin/main.js` (v1.5.1) for (a) `updateMetadata` `evaluate` handling and (b) the `js`-action `file` base, before the P0/P1 edits are marked shipped. Everything else can proceed on the official-docs evidence above.
