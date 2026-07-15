# Cross-Hub Vocabulary Collision Report

**Scope:** read-only measurement. **Status:** analysis artifact — recommends classifications, changes nothing.

This report maps the normalized routing vocabulary advertised by the four routing hubs — `sk-code`, `sk-design`, `deep-loop-workflows`, `deep-loop-runtime` — and classifies every cross-hub overlap so a later (gated) vocab-migration patch (WU-3) can be well-targeted. The core finding it documents is that the advisor's parent-hub confusion is a **half-landed vocabulary migration**: `deep-loop-workflows` still advertises single-pass code-audit / code-review vocabulary that `sk-code` now rightfully owns. The clash is *unidirectional* (every disputed code phrase flows `deep-loop → sk-code`), which is the evidentiary signature of a migration that moved the doctrine but not the vocabulary — not a symmetric design collision. This is corroborated in the deep-review packet's own prose, which **already** defers single-pass review to sk-code (`deep-review/SKILL.md:37` "Simple single-pass code review (use `sk-code`'s code-review mode instead)"; `:447` "sk-code's code-review mode for single-pass review doctrine") while its routing aliases and keyword blocks still grab `code audit` / `code-audit`.

> **Caveat — anchors are source-truth, not runtime-truth.** Every `file:line` below was re-verified live against the working tree at report time. The advisor itself routes through a **compiled `dist/`** projection, not these JSON/MD source files directly (the drift-guard `routing-registry-drift-guard.vitest.ts` keeps the compiled maps in sync). This is a mutable tree; pins drift. **Re-verify each cited phrase and line at gated-patch time before editing.**

The normalizer precedent for any future guard is `deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` — `normalizePhrase()` at `:61` (lowercase → trim → strip boundary non-word chars → collapse `[-\s]+` to a single space) is reusable, but `checkVocabSync({ skillRoot })` at `:263` accepts a **single** `skillRoot` and reads only that one hub's `hub-router.json` (`:276`), `mode-registry.json` (`:277`), and `graph-metadata.json` (`:316`). It therefore detects one hub's *internal* drift and can **never** see cross-hub collisions. A cross-hub guard would reuse `normalizePhrase()` but iterate all four `skillRoot`s. *(Reuse target only — not invoked by this report.)*

---

## 1. Collision matrix

Normalized phrase = the phrase after `normalizePhrase()` folding. Source-surface tags: `mr:aliases` = mode-registry `modes[].aliases`; `hr:keywords` = hub-router `vocabularyClasses[].keywords`; `gm:domains` / `gm:intent_signals` / `gm:trigger` (= `derived.trigger_phrases`) / `gm:key_topics` = graph-metadata fields; `skill.kw` = SKILL.md keyword/trigger blocks.

| Normalized phrase | Owning hub(s) | Owner mode(s) | Intent class | Source surface(s) — re-verified `file:line` | Projected fields | Classification |
|---|---|---|---|---|---|---|
| `audit` (bare) | contested: sk-code + sk-design (+ deep-loop review-loop; +runtime infra) | sk-code `code-review`/`quality`; sk-design `audit` | code-audit **vs** design-audit **vs** review-loop **vs** executor-provenance — 4 distinct intents, no single owner | sk-code `gm:domains` `sk-code/graph-metadata.json:69` ("audit"); sk-design `gm:domains` `sk-design/graph-metadata.json:50` ("design-audit"), `mr:aliases` `sk-design/mode-registry.json:103` (mode key "audit") + `:117`, `hr` router-signal `sk-design/hub-router.json:61`; deep-loop `gm:trigger` `deep-loop-workflows/graph-metadata.json:82` ("code audit"); runtime `gm:key_topics` `deep-loop-runtime/graph-metadata.json:104` ("executor-audit", distinct) | advisor metadata/trigger index; hub router scoring | **needs-owner** |
| `review` (bare) | contested: sk-code + sk-design + deep-loop | sk-code `code-review`; sk-design `audit`; deep-loop `review` | code/PR review **vs** design review **vs** iterative review-loop — no single owner | sk-code `hr:keywords` `sk-code/hub-router.json:49` ("review","reviewer"), `gm:domains` `sk-code/graph-metadata.json:68`; sk-design `mr:aliases` `sk-design/mode-registry.json:117` ("design review","review the ui"), `hr:keywords` `sk-design/hub-router.json:288`-`289`; deep-loop `mr:aliases` `deep-loop-workflows/mode-registry.json:70` ("review loop"), `hr:keywords` `deep-loop-workflows/hub-router.json:60`, `gm:trigger` `deep-loop-workflows/graph-metadata.json:78` | advisor trigger index; hub router scoring | **needs-owner** |
| `code review` (← `code-review`) | **sk-code** (rightful) | `code-review` | single-pass code / PR review | **owner:** sk-code `gm:intent_signals` `sk-code/graph-metadata.json:127`, `mr:aliases` `sk-code/mode-registry.json:55`, `hr:keywords` `sk-code/hub-router.json:49`. **borrower:** deep-loop `gm:domains` `deep-loop-workflows/graph-metadata.json:50` ("code-review") | advisor trigger/metadata index | **demotion-candidate** |
| `code audit` (← `code-audit`, `code audit`) | intent owned by **sk-code**; literal string only in deep-loop | sk-code `code-review`/`quality`; deep-loop `review` | single-pass code audit (sk-code intent via "audit"+findings+quality-gate) — deep-loop holds the literal string | **owner (intent):** sk-code `gm:domains` `sk-code/graph-metadata.json:69` + `gm:intent_signals` `:127`-`139`. **borrower (literal):** deep-loop `gm:trigger` `deep-loop-workflows/graph-metadata.json:82`, `mr:aliases` `deep-loop-workflows/mode-registry.json:70` ("code-audit"), `hr:keywords` `deep-loop-workflows/hub-router.json:60` ("code-audit") | advisor lexical projection (deep-review); trigger index | **demotion-candidate** |
| `iterative code audit` | deep-loop literal; borrows sk-code's "code audit" | deep-loop `review` | *loop-qualified* but still names sk-code's code-audit territory | deep-loop `gm:trigger` `deep-loop-workflows/graph-metadata.json:79`, `mr:aliases` `deep-loop-workflows/mode-registry.json:70`, `hr:keywords` `deep-loop-workflows/hub-router.json:60` | advisor lexical projection; trigger index | **demotion-candidate** |
| `code review loop` | deep-loop | deep-loop `review` | iterative (loop-qualified) but borrows sk-code's "code review" head | deep-loop `gm:intent_signals` `deep-loop-workflows/graph-metadata.json:64` ("code review loop") | advisor metadata index | **demotion-candidate** (softest — see §3) |
| `workflowmode` / `backendkind` / `mode-registry` (discriminator triplet) | all hubs (shared infra) | n/a — schema plumbing | shared discriminator/registry vocabulary; identical intent everywhere | sk-code `gm:key_topics` `sk-code/graph-metadata.json:175`,`:176`,`:174` + `hr:keywords` `sk-code/hub-router.json:40`; sk-design `gm:key_topics` `sk-design/graph-metadata.json:126`,`:127`,`:125` + `hr:keywords` `sk-design/hub-router.json:99`,`:100`,`:98`; deep-loop `gm:key_topics` `deep-loop-workflows/graph-metadata.json:100`,`:102`,`:99` + `hr:keywords` `deep-loop-workflows/hub-router.json:54` | hub-identity router class (low weight) | **allowed-shared** |
| `convergence` / `coverage-graph` | deep-loop-workflows + deep-loop-runtime (same family) | deep-loop backend | shared deep-loop backend infra; identical intent | deep-loop-workflows `gm:domains` `deep-loop-workflows/graph-metadata.json:53`,`:54`; deep-loop-runtime `gm:domains` `deep-loop-runtime/graph-metadata.json:74`,`:73` + `gm:intent_signals` `:84` | advisor metadata index | **allowed-shared** |
| `executor-audit` | deep-loop-runtime only | runtime backend | executor **provenance** audit — distinct from code/design audit; false-positives a naive "audit" substring scan | deep-loop-runtime `gm:key_topics` `deep-loop-runtime/graph-metadata.json:104` | advisor metadata index | **allowed-shared** |

**Row counts by classification:** `needs-owner` = 2 · `demotion-candidate` = 4 · `allowed-shared` = 3 (grouped; ~6 phrases) · `collision` = **0** (see note).

> **On the empty `collision` tier.** Under the strict taxonomy — *same normalized string, ≥2 hubs, different intent, no rightful owner and not a bare ambiguous token* — **no residual row qualifies.** The bare tokens `audit`/`review` route to `needs-owner` (per the taxonomy's own examples; remedy = qualification), and every specific code-phrase clash has a clear rightful owner (`sk-code`) so routes to `demotion-candidate` (remedy = rewrite/remove). The absence of a symmetric collision is itself the finding: the disputes are **directional** (`deep-loop → sk-code`), i.e. a half-landed migration, not a two-sided vocabulary collision. The "3-way collisions" named in the brief are analyzed as the `needs-owner` rows in §3.

---

## 2. Line-pin corrections & extensions vs. the seeded anchors

- **Confirmed exact:** deep-loop `gm` `code-review`:50, `code review loop`:64, `iterative code audit`:79, `code audit`:82; deep-loop `mr:aliases`:70; sk-code `gm` audit:69 / findings:73 / intent_signals:127-139; sk-design `gm` design-audit:50 / design audit:65 / accessibility audit:66 / ui critique:108 / performance audit:110 / audit-mode:132; normalizer `:61` / single `skillRoot` `:263`.
- **Corrected:** runtime `executor-audit` is at `deep-loop-runtime/graph-metadata.json:104` (anchor set implied ~L106).
- **Extension — a THIRD routing surface the anchors omit:** `deep-loop-workflows/hub-router.json:60` (`vocabularyClasses.review-aliases.keywords`) also carries the full stale set `["deep-review","review loop","iterative code audit","severity weighted findings","code-audit","release-readiness"]`. The anchor note named only graph-metadata + mode-registry; the runtime router config is a co-equal third surface.
- **Extension — SKILL.md keyword/trigger blocks are derivation SOURCES:** `deep-loop-workflows/SKILL.md:8` (Keywords: `code-audit`), `:25` / `:132` (mode table "iterative code audit"); `deep-review/SKILL.md:10` (Keywords: `code-audit`), `:76` (trigger phrases "code audit","quality audit"), `:106` (`REVIEW_SETUP` keywords "code audit"), `:499` (Gate-2 keywords "code audit"). Because `gm.derived.trigger_phrases` is regenerated from these blocks + `mr:aliases` at reindex, editing `gm:79`/`gm:82` alone is **futile**.
- **Preserve markers found (do NOT touch):** `deep-review/SKILL.md:37` and `:447` already document the correct boundary (single-pass → sk-code). These are the evidence the doctrine migrated; leave them.

---

## 3. High-risk rows callout

**3-way `audit` (needs-owner).** Three legitimately different intents share the bare token: sk-code **code-audit** (`sk-code/graph-metadata.json:69` domain "audit", backed by intents "code review"/"security review"/"quality gate"/"findings"/"audit packet docs" at `:127`-`139`); sk-design **design-audit** (`sk-design/graph-metadata.json:50`; mode key "audit" at `sk-design/mode-registry.json:103`; router-signal at `sk-design/hub-router.json:61`); deep-loop **review-loop** (surfacing as "code audit" at `deep-loop-workflows/graph-metadata.json:82`). A fourth, `executor-audit` (`deep-loop-runtime/graph-metadata.json:104`), is distinct provenance infra that would false-positive a substring scan. **No single owner** — the remedy is *qualification* (`code audit` → sk-code; `design audit` → sk-design; loop sense → `convergence review`), not assignment of the bare token to one hub. `design audit` and `executor-audit` are already correctly qualified and are **not** demotion targets.

**3-way `review` (needs-owner).** sk-code owns **code/PR review** (`sk-code/hub-router.json:49` "review"/"reviewer"/"code review"); sk-design owns **design review** (`sk-design/mode-registry.json:117` "design review"/"review the ui"); deep-loop owns the **iterative review-loop** (`deep-loop-workflows/mode-registry.json:70` "review loop"; `hub-router.json:60`). Each qualified form is legitimately owned; only the bare token is ambiguous. Remedy = ensure deep-loop's review vocabulary stays *loop-qualified* and never bare.

**`code audit` (demotion, high-risk).** The literal phrase lives **only** in deep-loop, but the *intent* — single-pass code audit — is sk-code's. deep-loop is legitimate for the **iterative** sense **only** when it says so explicitly (`review loop`, `convergence review`). Bare `code audit` (`deep-loop-workflows/graph-metadata.json:82`; `mode-registry.json:70`; `hub-router.json:60`) reads as single-pass and must be rewritten to loop-shaped vocab. `iterative code audit` is loop-qualified yet still borrows the "code audit" head, so it is also a rewrite target (→ `iterative review loop` / `multi-pass review loop`). `code review loop` (`:64`) is the **softest** case — genuinely loop-qualified — but it still borrows sk-code's "code review" head; the minimal fix is dropping "code" (→ `review loop`, already a preserved term).

---

## 4. Demotion-candidate shortlist (targets for the gated WU-3 patch)

Rewrite the phrases below to loop-shaped vocabulary — **`iterative review loop`**, **`multi-pass review loop`**, **`convergence review`**, **`review-loop artifacts`** — or remove them. **Preserve** deep-loop's legitimate direct-invocation / loop-shaped terms: `deep-review`, `review loop`, `:review:auto`, `/deep:review`, `severity weighted findings`, `release-readiness`, and the boundary prose at `deep-review/SKILL.md:37`/`:447`.

### 4a. Source surfaces — MUST move together (edit-authoritative)

| Surface | `file:line` | Stale phrase(s) | Recommended action |
|---|---|---|---|
| mode-registry `deep-review.aliases` | `deep-loop-workflows/mode-registry.json:70` | `iterative code audit`, `code-audit` | → `iterative review loop`, `convergence review` (keep `deep-review`, `review loop`, `severity weighted findings`, `release-readiness`) |
| hub-router `review-aliases.keywords` | `deep-loop-workflows/hub-router.json:60` | `iterative code audit`, `code-audit` | mirror the mode-registry rewrite exactly (runtime router scoring surface) |
| graph-metadata `domains` (authored) | `deep-loop-workflows/graph-metadata.json:50` | `code-review` | → `review-loop` (or remove; unqualified sk-code territory) |
| graph-metadata `intent_signals` (authored) | `deep-loop-workflows/graph-metadata.json:64` | `code review loop` | → `iterative review loop` (drop the "code" head) |
| SKILL.md keyword/trigger blocks | `deep-loop-workflows/SKILL.md:8`, `:25`, `:132`; `deep-review/SKILL.md:10`, `:76`, `:106`, `:499` | `code-audit`, `code audit`, `iterative code audit` | rewrite to loop vocab; these feed trigger-phrase derivation |

### 4b. Derived surfaces — auto-correct on reindex (do NOT hand-edit)

| Surface | `file:line` | Stale phrase(s) | Note |
|---|---|---|---|
| graph-metadata `derived.trigger_phrases` | `deep-loop-workflows/graph-metadata.json:79`, `:82` | `iterative code audit`, `code audit` | Regenerated from 4a's `mr:aliases` + SKILL.md keyword blocks. Editing here alone is futile — a reindex re-derives the stale phrases. Fix 4a, then reindex. |
| description.json | `deep-loop-workflows/description.json` | (derived echoes) | Auto-generated; re-derives from the same sources. |

**Load-bearing dependency:** the three routing configs in 4a (`mode-registry.json`, `hub-router.json`, `graph-metadata.json` authored fields) **and** the SKILL.md keyword blocks must be patched in one change. If any is missed, the next `generate-context`/reindex re-derives the stale `code audit` / `iterative code audit` phrases back into `derived.trigger_phrases` (and `description.json`), silently re-opening the collision.

---

## 5. Coverage note

Every hub-root JSON that exists was read in full with line numbers, plus targeted greps to confirm pins:

| Hub | `graph-metadata.json` | `mode-registry.json` | `hub-router.json` | Notes |
|---|---|---|---|---|
| `sk-code` | read ✓ | read ✓ | read ✓ | full three-surface inventory |
| `sk-design` | read ✓ | read ✓ | read ✓ | full three-surface inventory |
| `deep-loop-workflows` | read ✓ | read ✓ | read ✓ | full; + SKILL.md + deep-review/SKILL.md grepped for stale vocab |
| `deep-loop-runtime` | read ✓ | **absent** | **absent** | backend peer carries no mode-registry/hub-router; graph-metadata is CLEAN of code/design-audit routing vocab (only `executor-audit` infra + `convergence`/`coverage-graph` shared terms) |

**Additional surfaces read/greped:** `parent-hub-vocab-sync.cjs` (normalizer precedent, `:61`/`:263`); `deep-loop-workflows/SKILL.md` and `deep-review/SKILL.md` (derivation-source keyword blocks and preserve-boundary prose). **Not inventoried** (out of routing scope, noted for completeness): `manual_testing_playbook/**` and `deep-ai-council/references/**` also mention the vocab but are test/doc surfaces, not advisor-routing-load-bearing. **Not read:** the compiled `dist/` advisor projection (runtime-truth) — deliberately, per the source-truth caveat; re-verify against it at gated-patch time.
