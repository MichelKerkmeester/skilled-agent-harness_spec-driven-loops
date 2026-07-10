# Turnkey Design: code-opencode / code-webflow Language-Slice Intent Split

> Deferred deliverable of the cross-skill routing sweep. This captures the full diagnosis
> and a turnkey fix design for the one GENUINE over-routing case the sweep found, so a
> scoped follow-up child packet can execute it under proper drift-guard + baseline discipline.

## The problem (genuine over-routing, both surfaces)

Both sk-code surface children route a **single-language** task to **every** language's standards files:

| Surface | `LANGUAGE_STANDARDS` RESOURCE_MAP | Loads for ANY language keyword |
|---------|-----------------------------------|--------------------------------|
| `code-opencode` | javascript + typescript + python + shell trios | **12 files** |
| `code-webflow`  | css + html + javascript files                  | **9 files**  |

Measured (Mode-A router-replay, per scenario):

| Scenario | intents | routed | gold | waste |
|----------|---------|--------|------|-------|
| `01--language-standards/001-typescript-standards` | IMPLEMENTATION, LANGUAGE_STANDARDS | 18 | 3 | 15 |
| `01--language-standards/002-python-standards` | LANGUAGE_STANDARDS | 14 | 3 | 11 |
| `01--language-standards/003-shell-standards` | LANGUAGE_STANDARDS | 14 | 3 | 11 |

This is **genuine** over-routing (waste survives DEFAULT-tier exclusion), NOT the harmless
gold-under-spec artifact the other swept skills had — so gold-aligning would be DISHONEST
(it would bless loading python+shell guides for a typescript task). The fix is a real router
precision change.

The fix already MATCHES the documented design, which the machine block currently contradicts:
- `code-opencode/SKILL.md` §1: "slices evidence by the detected language so a TypeScript task
  never pulls the Python/shell/config guides."
- Parent `sk-code/shared/references/smart_routing.md` prose rows 217-219 already list
  `TYPESCRIPT` / `PYTHON` / `SHELL` as separate per-language maps; line 476 restates the
  language sub-slice. Only the **machine** `RESOURCE_MAP` block (~441-462) still lumps them.

## The fix (per-language intent split)

Replace the single `LANGUAGE_STANDARDS` intent with per-language intents in **both** surface
children AND the parent machine block, keeping keyword scope tight per language:

- `code-opencode`: `LANGUAGE_STANDARDS` → `JAVASCRIPT` (`.cjs`/`.mjs`/`commonjs`/javascript),
  `TYPESCRIPT` (`typescript`/`.ts`/`.tsx`), `PYTHON` (`python`/`.py`/`docstring`),
  `SHELL` (`shell script`/`bash`/`.sh`) — each mapping only its own `references/<lang>/` trio.
- `code-webflow`: `LANGUAGE_STANDARDS` → `CSS` / `HTML` / `JAVASCRIPT` over its own
  `references/{css,html,javascript}/` files.
- Parent `smart_routing.md` machine block: mirror both children — INTENT_SIGNALS gains the new
  per-language keys; RESOURCE_MAP gains `code-opencode/references/<lang>/…` and
  `code-webflow/references/<lang>/…` blocks; the lumped `LANGUAGE_STANDARDS` block is removed.

## Drift-guard reconciliation (all must stay green)

1. **`sk-code-router-sync.vitest.ts`** — the `parent == union(re-prefix(children)) + tier` check
   is a MECHANICAL per-intent mirror. A symmetric split in parent + both children passes. The
   path-coverage checks (exists-on-disk / covers-every-doc / prose-explicit-path) are
   intent-agnostic (they flatten to a path SET, unchanged by regrouping) — they pass unchanged.
2. **`surface-slice-sync.vitest.ts`** — asserts a single-surface task never leaks the other
   surface. The split only tightens WITHIN a surface, so cross-surface slicing is unaffected.
3. **`parent-hub-vocab-sync.vitest.ts`** — check whether `parent_hub_router.json` advisor vocab
   projects `LANGUAGE_STANDARDS` keywords; if so, update the projection to the new keys.

## Baseline re-capture (deliberate behavior change)

The split DELIBERATELY changes the sk-code hub's Mode-A routing output (a single-language task
loads fewer files), so the P0/P3 "byte-identical hub baseline" invariant is intentionally
broken here. Re-capture `sk-code/benchmark/router-baseline/` as part of the follow-up and note
the delta (fewer routed files = the intended improvement), rather than treating it as a regression.

## Residual not fixed by the split (separate issue)

`001-typescript-standards`'s prompt ("…before I implement a feature") also trips `IMPLEMENTATION`
on the `implement`/`feature` keywords, so even post-split it routes TYPESCRIPT(3)+IMPLEMENTATION(6)=9
against a gold of 3. This is a keyword-collision judgment call, NOT split-fixable:
- Do NOT narrow IMPLEMENTATION keywords (breaks the real `006-implementation-authoring` scenario).
- Do NOT reword the scenario prompt to dodge the collision (anti-gaming rule §7).
- The honest options are (a) treat these as multi-intent scenarios and set gold to the designed
  multi-intent load, or (b) keep `expected_intent: LANGUAGE_STANDARDS` single-intent gold and
  accept the residual as measured over-routing. The follow-up packet should decide explicitly.

## Why deferred from the sweep

This is a runtime-behavior change to the LIVE sk-code hub (every code task routes through it),
touching both surface children + the parent projection + advisor vocab + 3 drift guards + a
baseline re-capture. The program plan flags parent-projection work as correctness-critical
own-phase work with its own byte-baseline gate. Executing it at the tail of a long session on a
shared branch invites a half-landed router migration — the exact failure the plan's risk section
warns against. It is captured here turnkey for a dedicated follow-up child.
