---
title: "sk-code-obsidian: Manual Testing Playbook"
description: "Operator-facing directory for the sk-code-obsidian surface's routing-recall corpus: intent detection, resource-loading isolation, unknown-fallback handling, cross-CLI dispatch stability, token-cost baselines, holdout generalization, and surface-detection precision."
version: 2.0.0.0
---

# sk-code-obsidian: Manual Testing Playbook

Routing-recall corpus for the `sk-code-obsidian` surface. These scenarios exercise the
machine-readable `INTENT_SIGNALS`/`RESOURCE_MAP` in `SKILL.md` §2b, the `OBSIDIAN` surface detection
in §1 that causes the hub to bundle this packet, and the coverage-breadth categories below —
resource-loading isolation, unknown-fallback handling, cross-CLI dispatch stability, token-cost
baselines, holdout generalization, and surface-detection precision — modeled on `sk-doc`'s own
category taxonomy while staying inside the `operator-scenario` contract this package already passes
under `tier: FAIL_CLOSED`. Every scenario lives in a category subfolder at the playbook root; the
category directory owns grouping, not display order.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP`
> outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into
> `sk-code-obsidian/benchmark/reports/<dated-run-label>/`.

---

## Categories

| # | Category | Folder | Scenario IDs | One-line summary |
|---|---|---|---|---|
| 1 | Intent Detection | `intent-detection/` | OB-001 .. OB-007 | One or more scenarios per intent the surface's `INTENT_SIGNALS` declares (`IMPLEMENTATION` x2, `CODE_QUALITY` x2, `DEBUGGING`, `VERIFICATION`, `STACK_STANDARDS`). |
| 2 | Resource Loading | `resource-loading/` | OB-008 .. OB-010 | Isolation: references-only (`STACK_STANDARDS`), assets-only (`VERIFICATION` checklist alone), and a deliberate references+assets mixed load (`CODE_QUALITY`). |
| 3 | Unknown Fallback | `unknown-fallback/` | OB-011 .. OB-013 | A literal-keyword multi-intent collision, a zero-keyword prompt resolving `DEFAULT_RESOURCE`, and a two-unrelated-tasks scope collision requiring an explicit split. |
| 4 | Cross-CLI Dispatch | `cross-cli-dispatch/` | OB-014 .. OB-016 | Short-prompt baseline across CLI runtimes, a long scene-setting prompt stress-testing keyword extraction, and a three-turn same-session dispatch checked for stale resource carryover. |
| 5 | Token Cost Baseline | `token-cost-baseline/` | OB-017 .. OB-019 | Cost normalization: floor (1 reference), median (3 references), ceiling (13 references spanning every declared intent plus one unmapped reference). |
| 6 | Agent Dispatch | `agent-dispatch/` (waived) | — | Waived: this packet is read-only, advisor-invisible (`routingClass: metadata`), and never routes as a primary per `SKILL.md` §1/§5; its evidenced work (`src/`, `styles.css`, `tools/screenshots/`) lives in a separate Obsidian plugin repository outside this monorepo, so a real dispatch that executes work is outside this playbook's write boundary. |
| 7 | Holdout | `holdout/` | OB-H01 .. OB-H06 | Natural-phrasing rewrites of all five fitted intents (OB-H01..H05) plus one independent, keyword-blind probe (OB-H06) for a reference `SKILL.md` §2b never wires to any declared intent. |
| 8 | Surface Detection | `surface-detection/` | OB-020, OB-021 | Positive control confirming the three `OBSIDIAN` markers and precedence order; negative control confirming a Mobile CLI (`PI_REMOTE`) target pulls in none of this packet's evidence. |

---

## Scenario Index

### 01 — Intent Detection
- **OB-001** — [intent-detection/renderer-feature-routing.md](intent-detection/renderer-feature-routing.md) — IMPLEMENTATION: new row-pipeline column type reusing existing `.db-*` classes.
- **OB-002** — [intent-detection/modal-screenshot-routing.md](intent-detection/modal-screenshot-routing.md) — IMPLEMENTATION: a screenshot scenario for one of the 17 unphotographed modals.
- **OB-003** — [intent-detection/db-class-rename-routing.md](intent-detection/db-class-rename-routing.md) — CODE_QUALITY: a `.db-*` rename swept across `styles.css` and every fixture.
- **OB-004** — [intent-detection/folder-docs-routing.md](intent-detection/folder-docs-routing.md) — CODE_QUALITY: the folder-doc pairing threshold for `tools/screenshots/scenarios/`.
- **OB-005** — [intent-detection/debugging-routing.md](intent-detection/debugging-routing.md) — DEBUGGING: a calendar-renderer mobile overflow under the `is-phone` body class.
- **OB-006** — [intent-detection/verification-routing.md](intent-detection/verification-routing.md) — VERIFICATION: a full completion-claim gate run with the lint-delta baseline.
- **OB-007** — [intent-detection/stack-standards-routing.md](intent-detection/stack-standards-routing.md) — STACK_STANDARDS: the `isDesktopOnly`/`FileView`/`WorkspaceLeaf` API boundary.

### 02 — Resource Loading
- **OB-008** — [resource-loading/references-only-isolation.md](resource-loading/references-only-isolation.md) — STACK_STANDARDS isolation: zero `assets/` entries for a pure stack-knowledge question.
- **OB-009** — [resource-loading/assets-only-isolation.md](resource-loading/assets-only-isolation.md) — VERIFICATION isolation: exactly one `assets/` entry, zero `references/`, for a checklist-only follow-up.
- **OB-010** — [resource-loading/mixed-load-isolation.md](resource-loading/mixed-load-isolation.md) — CODE_QUALITY isolation: a deliberate 2-reference + 2-asset mix for a folder-doc-plus-banner question about `src/views/modals/`.

### 03 — Unknown Fallback
- **OB-011** — [unknown-fallback/ambiguous-multi-intent.md](unknown-fallback/ambiguous-multi-intent.md) — `CODE_QUALITY`+`VERIFICATION` collide in one coherent rename-then-verify sentence; union evidence expected.
- **OB-012** — [unknown-fallback/zero-keyword-prompt.md](unknown-fallback/zero-keyword-prompt.md) — zero `INTENT_SIGNALS` keyword hits; resolves the real-file `DEFAULT_RESOURCE` pair.
- **OB-013** — [unknown-fallback/disambiguation-required.md](unknown-fallback/disambiguation-required.md) — `DEBUGGING`+`IMPLEMENTATION` collide across two unrelated tasks in one prompt; an explicit split/priority question is expected, not a silent merge.

### 04 — Cross-CLI Dispatch
- **OB-014** — [cross-cli-dispatch/short-prompt-baseline.md](cross-cli-dispatch/short-prompt-baseline.md) — a five-word `IMPLEMENTATION` prompt resolved identically across `cli-opencode` and `cli-claude-code`.
- **OB-015** — [cross-cli-dispatch/large-prompt-stress.md](cross-cli-dispatch/large-prompt-stress.md) — a ~1,400-character `VERIFICATION` prompt resolving the same set `OB-006`'s short form resolves.
- **OB-016** — [cross-cli-dispatch/multi-step-dispatch.md](cross-cli-dispatch/multi-step-dispatch.md) — three sequential turns (`IMPLEMENTATION` → `CODE_QUALITY` → `VERIFICATION`) in one session, checked for cross-turn resource bleed.

### 05 — Token Cost Baseline
- **OB-017** — [token-cost-baseline/floor-single-resource.md](token-cost-baseline/floor-single-resource.md) — floor: exactly one reference for a narrow `isDesktopOnly` question.
- **OB-018** — [token-cost-baseline/median-load.md](token-cost-baseline/median-load.md) — median: exactly three references for a typical folder-doc-plus-banner question about `src/data/`.
- **OB-019** — [token-cost-baseline/ceiling-load-all.md](token-cost-baseline/ceiling-load-all.md) — ceiling: thirteen references for a full pre-release audit spanning every declared intent plus `accessibility.md`.

### 06 — Agent Dispatch (waived)
No scenarios. See the Categories table above for the one-sentence waiver reason.

### 07 — Holdout
Natural-phrasing holdouts — same fitted scenario, decontaminated wording (no `INTENT_SIGNALS`
keyword vocabulary):
- **OB-H01** — [holdout/implementation-natural.md](holdout/implementation-natural.md) — IMPLEMENTATION via natural phrasing (decontaminates `OB-001`).
- **OB-H02** — [holdout/code-quality-natural.md](holdout/code-quality-natural.md) — CODE_QUALITY via natural phrasing (decontaminates `OB-003`).
- **OB-H03** — [holdout/debugging-natural.md](holdout/debugging-natural.md) — DEBUGGING via natural phrasing (decontaminates `OB-005`).
- **OB-H04** — [holdout/verification-natural.md](holdout/verification-natural.md) — VERIFICATION via natural phrasing (decontaminates `OB-006`).
- **OB-H05** — [holdout/stack-standards-natural.md](holdout/stack-standards-natural.md) — STACK_STANDARDS via natural phrasing (decontaminates `OB-007`).

Independent probe — authored against no fitted scenario, keyword-blind and `INTENT_SIGNALS`-blind:
- **OB-H06** — [holdout/accessibility-independent.md](holdout/accessibility-independent.md) — tests whether [../references/accessibility.md](../references/accessibility.md), a real file `SKILL.md` §2b wires to no declared intent group, still surfaces for a plainly relevant question.

All six carry a routing-recall contract scored the same way this package's other operator scenarios
are: by frontmatter/path agreement, not by the `expected_workflow_mode`/`expected_leaf_resources`
pair fields the sibling `routing-gold` contract uses (deliberately absent here — see the alignment
note below).

### 08 — Surface Detection
- **OB-020** — [surface-detection/obsidian-surface-resolution.md](surface-detection/obsidian-surface-resolution.md) — positive control: the three `OBSIDIAN` markers and the `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN` precedence order.
- **OB-021** — [surface-detection/negative-control-non-obsidian.md](surface-detection/negative-control-non-obsidian.md) — negative control: a Mobile CLI (`app-mobile/`/`app-relay/`/`packages/pi-rpc-protocol/`) target resolves `PI_REMOTE` and cites zero `sk-code-obsidian` evidence.

---

## Global Preconditions

1. `.opencode/skills/sk-code/sk-code-obsidian/SKILL.md` is at HEAD-of-main and contains the §1
   surface-detection block and the §2b `INTENT_SIGNALS`/`RESOURCE_MAP` block this corpus exercises.
2. Every path cited in every scenario's `expected_resources` resolves under
   `.opencode/skills/sk-code/sk-code-obsidian/` — verified directly with `test -e`, never assumed
   from `SKILL.md` §2b's `RESOURCE_MAP` text alone (see the honesty note below).
3. For `OB-021`, `.opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md` §1 is present and documents
   its own `PI_REMOTE` markers, since the negative control's pass condition depends on that sibling
   packet's markers staying accurate.
4. For `OB-014`, at least two CLI runtimes (`cli-opencode`, `cli-claude-code`) are installed and
   authenticated.
5. Token-cost baselines (`OB-017` → `OB-018` → `OB-019`) MUST run in order on the same CLI to keep the
   floor/median/ceiling comparable.
6. Holdout scenarios (`OB-H01`..`OB-H06`) are excluded from any fitted-routing aggregate; they score
   only the fitted-vs-held-out generalization gap and, for `OB-H06`, the unmapped-reference
   reachability question.

---

## Pass / Fail Grading

For every scenario in this package:

- **PASS** iff: every path in the scenario's `expected_resources` resolves under the skill root, the
  frontmatter's `expected_surface`/`expected_intent` agree with the scenario's own documented
  objective, and any category-specific isolation check (resource-type count, cross-turn bleed check,
  precedence check) also holds.
- **FAIL** iff: any `expected_resources` path is missing, the frontmatter surface/intent disagree with
  the scenario's documented objective, or a category-specific isolation check fails (an unexpected
  resource type appears, a stale carryover is observed, an `OBSIDIAN` marker is found in a
  negative-control target, or vice versa).
- **SKIP** iff: a specific sandbox, credential, or runtime blocker prevents the check from running —
  for example, `OB-014`/`OB-016` require an unavailable second CLI runtime, or `OB-021` cannot reach
  the sibling `sk-code-mobile-cli` packet's `SKILL.md` in the current sandbox. Document the named
  blocker; a bare `SKIP` with no stated cause is not a valid outcome.

---

## Evidence Capture

For each scenario run, capture:

1. The exact prompt (or, for `OB-016`, the exact three-turn sequence) sent to the CLI.
2. The resolved surface and intent (or intents, for the two `unknown-fallback` collision scenarios).
3. The list of resources the workflow reports as loaded, and, for `resource-loading/` scenarios, the
   per-type count (`references/` vs `assets/`).
4. Input + output token counts, required for `token-cost-baseline/` (`OB-017`..`OB-019`) and
   `cross-cli-dispatch/` (`OB-014`..`OB-016`).
5. Wall-clock latency from dispatch to first byte, for `cross-cli-dispatch/` (`OB-014`..`OB-016`).
6. For `OB-021`, explicit confirmation that zero `sk-code-obsidian/references/` or
   `sk-code-obsidian/assets/` paths were cited.

Persist evidence under `/tmp/ob-<SCENARIO_ID>-<label>.txt` per scenario so cross-run and cross-CLI
comparison stays reproducible, then finalize through `run-manual-playbook-scenario.cjs` per the
result-persistence contract above.

---

## Alignment note (read before editing this package)

This package adopted `sk-doc`'s category taxonomy and index depth without adopting `sk-doc`'s
contract. `sk-doc`'s own playbook is registered in `playbook-corpus-manifest.json` as
`routing-gold`, uses a four-way `PASS`/`PARTIAL`/`FAIL`/`SKIP` grading vocabulary, and keys each
scenario off `expected_workflow_mode`/`expected_leaf_resources` pairs. None of that applies here on
purpose: this package stays `operator-scenario`, `tier: FAIL_CLOSED`, and uses only `PASS`/`FAIL`/
`SKIP` — `PARTIAL`, `READY`, `UNAUTOMATABLE`, and `BLOCKED` are forbidden vocabulary throughout this
directory and every file beneath it. Do not add `expected_workflow_mode` or `expected_leaf_resources`
frontmatter fields to any scenario in this package; doing so would reclassify it as `routing-gold`
and silently drop it from this package's operator-scenario census.

## Honesty note: `SKILL.md`'s own map has drifted from the shipped tree

`SKILL.md` §2b's own `RESOURCE_MAP` names a few reference filenames
(`references/single-stylesheet-ownership.md`, `references/screenshot-fixture-harness.md`,
`references/obsidian-api-boundary.md`, `assets/renderer-implementation-checklist.md`,
`assets/comment-grammar-checklist.md`, `assets/debug-checklist.md`) that do not match the shipped
tree — the real files are `references/stylesheet-ownership.md`, `references/screenshot-harness.md`,
`references/obsidian-plugin-api.md`, and the seven checklists actually present under `assets/`
(`comment-banner-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`,
`folder-docs-checklist.md`, `modal-coverage-checklist.md`, `screenshot-coverage-checklist.md`,
`verification-checklist.md`). `OB-H06` documents a second, distinct kind of drift beyond stale
filenames: `references/accessibility.md`, `references/theme-variables.md`,
`references/operations/operations.md`, `references/setup/setup.md`,
`references/quality/doc-quality-gate.md`, and `references/skill-reference-integrity.md` are all real,
shipped files that `SKILL.md` §2b's `INTENT_SIGNALS`/`RESOURCE_MAP` block wires to no declared intent
group at all — not renamed, simply unmapped. Every `expected_resources` path in every scenario in
this package was checked against the live packet directory with `test -e`, never against `SKILL.md`'s
map alone; per this packet's own smart-router note, each scenario's curated set is a core subset and
is not required to mirror `RESOURCE_MAP` exactly.
