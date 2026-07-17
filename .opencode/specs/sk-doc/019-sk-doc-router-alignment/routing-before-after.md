---
title: "Skill Routing — Before vs After"
description: "Plain-terms before/after of how the skill routing system works: the parent-hub router (mode selection), the normal/child-mode router (file selection), the JSON config files behind them, and the route-gold benchmark that scores them. Companion to routing-config-and-advisor-reference.md."
trigger_phrases:
  - "routing before and after"
  - "how skill routing changed"
  - "hub router vs normal router explainer"
  - "route-gold benchmark logic"
importance_tier: "important"
contextType: "reference"
---

# Skill Routing — Before vs After

> Two questions the router answers: **which skill/mode** handles a request, and **which files** it should load. This walks the parent-hub router, the normal/child-mode router, the JSON files behind them, and the benchmark that scores them — what each looked like before the consistency work, and what changed.

**Snapshot:** 6 hubs fixed · route-gold 7/7 PASS · 91 scenarios green · `create-skill` canon aligned.

Legend: 🟠 **Before** · 🟢 **After** · 💡 plain-terms note.

---

## 1. The big picture — routing is two questions, in two layers

Every request has to be pointed at the right expertise. The system splits that into two independent decisions, each scored separately.

```
LAYER 0  Advisor  → right SKILL   ("is this git / routing / design?")
LAYER 1  Hub      → right MODE    (prompt-improve vs prompt-models)
LAYER 2  Surface  → right FILES   (which leaf reference/asset docs to load)
```

This program touched **Layer 1** (mode selection) and **Layer 2** (file selection). The three **tiers** of skill differ only in how much machinery they need:

| Tier | What it is | Routing machinery it owns |
|------|------------|---------------------------|
| **Parent hub** | A skill with several modes (`sk-doc`, `sk-prompt`) | `hub-router.json` + `mode-registry.json` + one rolled-up `leaf-manifest.json` + a shared surface router |
| **Child mode** | One mode inside a parent (`create-skill`) | Just a registry entry in its parent; its leaves roll up into the parent's manifest. No JSON of its own. |
| **Normal** | A standalone single-purpose skill (`system-spec-kit`) | A registry-less `leaf-manifest.config.json` + an inline router in its own `SKILL.md`. No hub JSONs. |

> 💡 **In plain terms:** the parent is a switchboard with several lines; a mode is one line on that board; a normal skill is a phone with a single line. The work made all three wire up the same way — and made the switchboard stop ringing every line at once.

---

## 2. Parent-hub router (`SKILL.md` + `hub-router.json`)

A parent hub scores the request against each mode's keyword **classes**. The scoring is deliberately simple — and that simplicity was the trap.

### The scoring rule (unchanged, but now understood)

- **Binary per mode:** a mode scores its full `weight` if *any one* of its vocabulary classes matches the text — otherwise `0`. Matches don't stack.
- **Ambiguity delta:** the router keeps every mode within `1` point of the top score. So two modes at weights 4 and 5 that both fire are *both* selected.

### What went wrong — and the fix

| 🟠 Before — shared catch-all class | 🟢 After — identity on the default only |
|---|---|
| Every mode carried a generic `hub-identity` class (hub name, "mode-registry", "workflowmode"). | The catch-all stays on the **default mode only** — or is removed so hub-generic words *defer*. |
| Any hub-generic word made *all* modes fire at base weight → within the delta → **all selected at once**. | Each specialised mode fires **only on its own vocabulary**. |
| `sk-doc`: a 2-topic request selected **8 modes**. `sk-prompt`: specialised `prompt-models` outranked the default on the bare word "prompt". | To beat the default outright, a specific signal's `weight` is raised so the gap exceeds the delta (`prompt-models` 5 → 6). |
| The gate checking "did it pick exactly the right modes?" was **BLOCKED** on 6 of 7 hubs. | Each hub selects exactly the intended mode(s). **7/7 PASS.** |

**Concrete — `sk-prompt/hub-router.json`, the actual change:**

```jsonc
// BEFORE — prompt-models fired on the bare word "prompt" and outranked the default
"prompt-models": {
  "weight": 5,
  "classes": ["prompt-models-aliases", "prompt-models-runtime", "hub-identity"]
}

// AFTER — no shared catch-all; higher weight so a NAMED model wins alone
"prompt-models": {
  "weight": 6,
  "classes": ["prompt-models-aliases", "prompt-models-runtime"]
}
// prompt-improve (the default) KEEPS hub-identity — hub-generic words route here.
```

> 💡 **In plain terms:** every mode used to share one "sounds like this hub" keyword bucket, so mentioning the hub at all rang every line. Now only the default line answers the generic call; the specialist lines pick up only when you say their specific name.

### The second layer: hub → files

Picking a mode is only half the job. A second router — `shared/references/smart_routing.md`, an `INTENT_SIGNALS` + `RESOURCE_MAP` block — then chooses which **leaf files** to load inside that mode. Two hubs (`sk-code`, `sk-doc`) had this layer under- or over-emitting; it was corrected so the files loaded match the mode's documented contract.

---

## 3. Normal & child-mode router

A **normal** skill has no modes to choose between — it routes straight from intent to files. A **child mode** borrows its parent's machinery. Both gained a *typed* file surface they didn't have before.

| 🟠 Before — flat, untyped | 🟢 After — typed `(mode, leaf)` pairs |
|---|---|
| A router emitted a flat list of paths — `references/x.md` — with no notion of which mode owned them. | Every routable file is a **typed pair**: `(workflowMode, leafResourceId)`. |
| Only 6 of 12 top-level skills had a resolvable typed surface; the rest were flat-only. | All 11 hubs + normals now carry a resolvable typed surface. |
| No machine-checkable link between "the mode you routed to" and "the file you loaded." | Normals declare it registry-free via `leaf-manifest.config.json`; children roll their leaves up into the parent's one manifest. |

> 💡 **In plain terms:** before, a skill said "load these files." Now it says "for *this mode*, load *these* files" — so a test can check the pairing, not just that some file loaded. That typed pairing is what the whole benchmark leans on.

**How a normal skill declares its surface (no hub JSONs):**

```jsonc
// system-spec-kit/leaf-manifest.config.json — a normal, single-mode skill
{
  "workflowMode": "system-spec-kit",
  "leafRoots": ["references", "assets"],   // ONLY these are routable docs
  "excludeIndexFiles": true,
  "resourceContractVersion": 1
  // scripts/, mcp_server/, templates/ … excluded — engine, not docs
}
```

A generator reads this and emits the skill's `leaf-manifest.json`. The key discipline: **only real documentation corpora are routable leaves** — runtime/engine folders are deliberately excluded, so the router can never "route" to a script.

---

## 4. The JSON system — five files, one contract

The routing config is a small set of JSON files. Some pre-existed and were *fixed*; others are the *new* typed surface.

| File | What it holds | Before → After |
|------|---------------|----------------|
| `hub-router.json` | Layer-1 mode selection: `routerPolicy` (default mode, ambiguity delta, tie-break), `routerSignals` (per-mode weight + classes), `vocabularyClasses` (keyword buckets). | **Fixed.** Catch-all class pulled off specialised modes; weights separated so specific signals win alone. |
| `mode-registry.json` | The list of a hub's modes and their metadata (`workflowMode`, `packetKind`, `backendKind`, `toolSurface`, advisor routing). | *Structure unchanged.* The authority for "which modes exist"; router keys must match it exactly. |
| `leaf-manifest.json` *(typed)* | Layer-2 typed surface: `modes[]`, each with a `workflowMode`, its `packet`, and the `leaves` (canonical resource ids) it may load. | **Filled.** Now present on all 11 units (was 6). Regenerated + byte-stable-checked. |
| `leaf-aliases.json` *(new)* | The typing seam: a flat list of `{workflowMode, leafResourceId, diskPath}` — maps each leaf id to its file, resolving shared-tier aliases. | **Added.** Lets the benchmark recover typed pairs from a flat router output. |
| `leaf-manifest.config.json` *(new)* | Registry-less config for normals: the one `workflowMode`, which `leafRoots` are routable, what to exclude. | **Added.** The normal-tier pattern — a typed surface without any hub JSONs. |

A sixth artifact, `shared/references/smart_routing.md`, isn't JSON but holds the Layer-2 `INTENT_SIGNALS` + `RESOURCE_MAP` the manifest is derived against. The *contract* that converts a raw path into a canonical `(workflowMode, leafResourceId)` pair lives in one library, so a prefix is never stripped ad-hoc.

| 🟠 Before — uneven & flat | 🟢 After — uniform typed pairs |
|---|---|
| Typed surface on ~half the skills; two incompatible playbook shapes. | Every unit resolvable to `(mode, leaf)` pairs; one canonical shape as the target. |
| Gold in old vocabularies: uppercase intent names (`DOC_QUALITY`) and `{mode}/SKILL.md` stand-ins for real files. | Gold points at the *current mode names* and the *real leaf files* — derived from each scenario's stated intent, never copied from router output. |

---

## 5. Benchmark logic — the route-gold gate

The benchmark replays the router deterministically (no model) and compares what it emits against authored "gold." This is the **route-gold gate**. Its exact matching rules are what made the fixes precise.

### The matching rules (the part that bites)

| Lane | Rule | Means |
|------|------|-------|
| Intent (mode) | `sameSet(observed, expected)` | **Exact set equality.** The router must select *exactly* the intended modes — one extra or missing mode fails it. This is why over-emission (8 modes) blocked the gate. |
| Resources — frontmatter hubs | `sameSet(observed, expected)` | **Exact set.** The leaves loaded must exactly match the gold set. |
| Resources — `sk-code` shape | `subset + forbidden` | Every expected leaf must appear (extras tolerated), plus a forbidden-prefix guard. A looser lane for the index-table skill. |

| 🟠 Before — blocked & skill-specific | 🟢 After — green & tier-neutral |
|---|---|
| 6/7 hubs `BLOCKED-BY-ROUTE-GOLD` — the routers genuinely mis-selected. | 7/7 hubs PASS (aggregates 90–100), 91 scenarios matched. |
| The shared harness hard-coded an `MR-`/`CB-` id prefix meaning "browser test" — an `sk-code` convention that collided with other skills reusing `MR-`. | The prefix hard-code is gone — replaced by an explicit `declaredKind` frontmatter signal any skill can set. |
| Committed scorecards held stale numbers from before the reorg. | A CI freshness gate regenerates every manifest and fails on drift, so scorecards can't silently rot. |

### Two things the benchmark taught us

- **The ambiguity delta is a fixed constant in the replay.** The `ambiguityDelta` field in the JSON is *not read* by the scorer (it hard-codes `1`). So precision is tuned with weights and classes — never by editing that field, which looks like it should work but does nothing.
- **Green ≠ correct, without teeth.** A deterministic pass proves the config *coheres*; it does not prove routing *quality* if the gold were written to match the router. That is why the current step is a **mutation test** (corrupt the gold and the router, confirm the score drops) plus a live-mode reality-check — to prove the green has teeth and isn't circular.

> 💡 **In plain terms:** the test used to be blocked because the routers were actually wrong, and the test itself had one skill's naming baked in. Now the routers are right, the test treats every skill the same way, and the next step is to shake the test hard to prove a "pass" can't be faked.

---

## 6. The core lesson — one anti-pattern explained six hubs

Nearly every hub failed for the *same* reason, and the fix was the same shape each time.

| 🟠 Anti-pattern — shared catch-all | 🟢 Rule — specific vocab wins |
|---|---|
| A generic class (`hub-identity`, `authoring-actions`) on *multiple* modes. | A catch-all belongs on the **default mode only** (or nowhere → defer). |
| With binary scoring + the delta, that class makes all those modes co-fire on generic words → over-emission → blocked. | Specialised modes fire only on their own vocabulary. Beat the default with a **weight gap > delta**, not a shared class. |

**Written into the canon:** the `create-skill` hub-router template shipped the catch-all on every mode — so it was minting the bug into every new skill. It now places the catch-all on the default mode only and carries a note explaining why, with an explicit exception for **detection-routed** hubs (like `sk-code`, which chooses its mode from surface markers, not keywords, and so is immune).

> **Bottom line.** Before: routers over-selected because every mode shared a generic keyword bucket, the gold pointed at stale names/paths, and the test had one skill's conventions baked in. After: each mode answers only to its own name, files are typed to their mode, the gold is derived from intent, the test is skill-neutral — and the template that creates new skills now teaches the correct pattern instead of the broken one.

---

## Scope note

"Before" here means the state **before this consistency program** (uneven typed surfaces, a blocked gate, a skill-specific harness) — the arc across the whole program, not a single session. The route-gold gate proves deterministic *coherence*; live-mode routing *quality* is being verified separately (mutation + live-mode teeth-proof).

**See also:** `routing-config-and-advisor-reference.md` (what every routing artifact does, in reference form).
