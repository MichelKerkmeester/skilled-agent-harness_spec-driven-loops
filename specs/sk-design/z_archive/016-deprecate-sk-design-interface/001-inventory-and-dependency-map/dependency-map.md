---
title: "Dependency Map: sk-design deprecation reference inventory"
trigger_phrases: []
---
# Dependency Map: sk-design deprecation reference inventory

> Authoritative classification of every `sk-design` / `interface:` reference in the repository, each tagged with a reconcile bucket and the action a later phase (002-006) will take. Built from `git grep` over tracked files (fast, excludes node_modules/untracked). This map is the single source of truth for the five downstream phases.

## BUCKET COUNTS

| Bucket | Files | Handled in | Action |
|--------|------:|-----------|--------|
| **to-extract** | 7,932 | 002 | `git mv` md-generator (120) + styles (7,812) into the new standalone skill root |
| **to-delete** | 336 | 005 | hub tree minus md-generator+styles (328) + `.opencode/commands/interface/**` (8) |
| **frozen-evidence** | 78 | — | leave untouched (dated benchmark reports + deep-improvement fixtures) |
| **generated-artifact** | 19 | 006 | regenerate via tooling (advisor graph + compiled routing) — do NOT hand-edit |
| **live-contract** | ~208 | 006 | reconcile; split below into ~55 actionable-runtime + ~150 incidental |

*Reconciliation:* `git grep -lI "sk-design"` = 5,354 tracked files total (the bulk are inside `specs/**` history and the `sk-design/**` tree itself). Outside the tree + specs: 305 pool files (`sk-design` + `interface:` tokens, de-duplicated). 305 = 78 frozen + 19 generated + 208 live-contract (±1 from multi-token overlap).

---

## TO-EXTRACT (moves with the new skill — phase 002)

Target root: `.opencode/skills/sk-design-md-generator/` (name kept; promoted to top-level).

- `.opencode/skills/sk-design/sk-design-md-generator/**` (120 files) → `.opencode/skills/sk-design-md-generator/**`
- `.opencode/skills/sk-design/styles/**` (7,812 files) → `.opencode/skills/sk-design-md-generator/styles/**`

### Internal rewiring required after the move (phase 003)

md-generator has exactly **5 outward references** that break once the parent hub is gone:

| File | Line | Current ref | Fix |
|------|-----:|-------------|-----|
| `backend/tests/corpus-baseline-v3.test.ts` | 19 | `path.resolve(__dirname,'../../../styles/library/manifests/retrieval-manifest.json')` | **CODE** — after nesting styles under the new root, `../../../styles` → `../../styles` (tests→backend→root, then /styles) |
| `SKILL.md` | 365 | `../shared/register.md` | repoint to the folded design-knowledge copy (phase 004) |
| `references/authoring-boundary.md` | 133 | `../../shared/register.md` | repoint to the folded design-knowledge copy (phase 004) |
| `assets/source-of-truth-router-card.md` | 94 | `../../shared/assets/register-card.md` | repoint to the folded design-knowledge copy (phase 004) |
| `feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md` | 41 | absolute `.opencode/skills/sk-design/shared/procedure-card-schema.md` | repoint to the folded design-knowledge copy (phase 004) |

> The 4 `shared/` refs are the reason phase 004 (fold condensed design knowledge) must land before/with the rewire: `register.md`, `register-card.md`, and `procedure-card-schema.md` are salvaged from the doomed `shared/` into the standalone skill, then these links point at the internal copies. Only the 1 `styles` ref is a pure path recompute.

### Standalone-root metadata to CREATE (phase 003)

md-generator currently has only `SKILL.md` frontmatter (it was a hub mode). As a standalone root it needs: `graph-metadata.json` (advisor identity — inherit the extraction + general-design-knowledge trigger phrases from the hub `graph-metadata.json`), and root docs already present (`README.md`, `INSTALL-GUIDE.md`, `changelog/`). No hub-only files (`mode-registry.json`, `hub-router.json`, `description.json`, `command-metadata.json`) — it is a standalone skill, not a hub, per the skill-root-metadata contract.

---

## TO-DELETE (phase 005 — after 002-004 verified green)

- **Entire `.opencode/skills/sk-design/**` minus `sk-design-md-generator/` and `styles/`** = 328 files. This includes: hub root files (`SKILL.md`, `ROUTER.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`), the whole `sk-design-interface/` mode, `shared/` (minus the salvaged subset), `benchmark/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/`.
- **`.opencode/commands/interface/**` = 8 files**: `design.md` + its 3 assets (`interface-design-*`) → DELETE (`/interface:design` retires). `design-reference.md` + its 3 assets (`interface-design-reference-*`) → the DESIGN.md-extraction command **must survive** (success criterion). RESOLUTION NOTE for 005/006: the goal says "delete `.opencode/commands/interface`" AND "keep `/interface:design-reference` working" — these conflict. Recreate/rebind the surviving extraction command to the standalone skill (either keep a slim `commands/interface/design-reference.*` bound to `sk-design-md-generator`, or move it to a new command namespace). Operator-visible decision; flagged, not silently resolved.

---

## LIVE-CONTRACT RECONCILE LIST (phase 006 — the actionable core)

### Group A — Root & catalog docs (EDIT)
| Path | Action |
|------|--------|
| `README.md` | remove sk-design hub + interface/motion/audit design-surface mentions; where a design capability is listed, point to standalone `sk-design-md-generator` (CSS→DESIGN.md + condensed design knowledge) |
| `AGENTS.md` | same; update the §10 Quick Reference "UI / design work" row and any sk-design routing lines |
| `.opencode/skills/README.txt` | drop sk-design hub entry; add/keep standalone `sk-design-md-generator` |
| `.opencode/agents/README.txt`, `.opencode/commands/README.txt`, `.opencode/install-guides/README.md` | drop hub/interface references; repoint design mentions to the standalone skill |

### Group B — Agent definitions (EDIT, all runtimes)
| Path | Action |
|------|--------|
| `.claude/agents/design.md`, `.opencode/agents/design.md`, `.codex/agents/design.toml`, `.pi/agents/design.md` | the `design` agent currently "routes to interface/foundations/motion/audit/md-generator" — rewrite to the standalone `sk-design-md-generator` (extraction + condensed design knowledge); drop the hub/interface routing |
| `.cursor/rules/skill-routing.md` | update the design routing entry |
| `.claude/agents/deep-alignment.md`, `.opencode/agents/deep-alignment.md`, `.codex/agents/deep-alignment.toml`, `.pi/agents/deep-alignment.md` | update sk-design as an alignment authority → standalone skill; drop interface/motion/audit taste-authority lanes |

### Group C — cli-* Design Standards Loading (EDIT)
`cli-external-orchestration/SKILL.md`, `cli-claude-code/{SKILL.md,README.md,references/agent-delegation.md}`, `cli-codex/SKILL.md`, `cli-cursor/SKILL.md`, `cli-devin/SKILL.md`, `cli-opencode/{SKILL.md,assets/prompt-templates.md,manual-testing-playbook/manual-testing-playbook.md,manual-testing-playbook/prompt-templates/minimax-design-context-manifest.md}` — rewrite the "load `sk-design` hub → resolve `interface`/`md-generator` via mode-registry" rule + `DESIGN_DISPATCH_MANIFEST` to "load standalone `sk-design-md-generator`"; drop the hub/register/interface-mode framing.

### Group D — deep-alignment adapters (EDIT — repoint authority)
`scripts/adapters/sk-design.cjs`, `references/adapters/sk-design-adapter.md`, `references/adapters/sk-design-known-deviations.md`, `feature-catalog/adapter-contract/adapter-sk-design.md`, `manual-testing-playbook/discovery-and-adapters/sk-design-static-adapter.md`, `feature-catalog/lane-resolution/authority-registry.md`, plus `deep-alignment/{SKILL.md,README.md,scripts/scoping.cjs,references/discover-contract.md}` where they name sk-design — repoint the sk-design authority to the standalone skill (extraction-focused); remove interface/motion/audit taste adapters.

### Group E — mcp-tooling (EDIT — design pairing)
`mode-registry.json`, `SKILL.md`, `README.md`, `feature-catalog/*`, `mcp-mobbin/manual-testing-playbook/pairing/sk-design-pairing.md`, `mcp-refero/manual-testing-playbook/pairing/sk-design-pairing.md`, `mcp-figma/**` design-system docs, `graph-metadata.json` (edges reference sk-design) — update "pairs with sk-design hub / interface taste authority" → "pairs with standalone `sk-design-md-generator`".

### Group F — compiled-routing tooling (EDIT + REGENERATE)
`.opencode/bin/compiled-route-guard.cjs`, `.opencode/bin/compiled-route-sync.cjs`, `.opencode/bin/README.md`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — remove `sk-design` from the served-hub set these enumerate; then regenerate the compiled artifacts (see generated-artifact below).

### Group G — deep-improvement skill-benchmark (REVIEW — likely leave)
`deep-improvement/scripts/skill-benchmark/{design-dispatch-boundary-proof,design-token-lint,load-playbook-scenarios,luna-acceptance}.cjs` + their `tests/*.vitest.ts` — benchmark infrastructure that exercises sk-design dispatch. Their fixtures are frozen-evidence. Review whether they break when the skill folder moves; likely leave (they assert historical behavior) or minimally repoint. Flag any that hard-fail.

### Group H — Incidental mentions (~150 files — REVIEW, default NO-CHANGE)
Changelogs (`sk-doc`, `sk-code`, `sk-prompt`, `mcp-tooling`, `system-spec-kit`), test files, examples, and `sk-doc/sk-create-skill/references/**` that use `sk-design` as a documentation EXAMPLE or past-tense prose. Default: **no change** (editing changelogs/examples is churn without runtime value). Exception: `sk-doc/sk-create-skill` docs that hold up sk-design as a *canonical hub example* may be repointed to a surviving hub (e.g. `mcp-tooling`, `sk-doc`) if desired — low priority, operator-optional.

---

## FROZEN-EVIDENCE — leave untouched (78 files)

Globs: `**/benchmark/reports/**` (dated routing/benchmark reports, e.g. `2026-07-21--*`) and `**/deep-improvement/**/fixtures/sk-design*` (dispatch/craft/alias/holdout fixtures, `.public.json`/`.private.json`). Editing dated evidence corrupts the record (operator Q2 decision). `specs/**` history is likewise excluded.

---

## GENERATED-ARTIFACT — regenerate via tooling, do NOT hand-edit (19 files)

| Artifact | Regenerate with |
|----------|-----------------|
| `.opencode/bin/lib/compiled-routing/**` (incl. `009-parent-hub-rollout/006-sk-design/**`, `serving-closure.manifest.json`, `014-runtime-engine`) | `node .opencode/bin/compiled-route-sync.cjs` (after removing sk-design from the served-hub source; verify with `compiled-route-guard.cjs`) |
| advisor `skill-graph.json`, `skill_advisor.py` booster/corpus, `command-bridges/command-bridges.generated.json`, `routing-accuracy/labeled-prompts.jsonl` | advisor rebuild: `mcp mk_skill_advisor advisor_rebuild` / `skill_graph_scan` (MCP), or the daemon CLI `node .opencode/bin/skill-advisor.cjs`; rescan after the skill tree changes so the hub node is dropped and the standalone `sk-design-md-generator` node is added |
| `leaf-manifest.json` (system-deep-loop) + `.opencode/skills/system-deep-loop/runtime/database/*.sqlite`, `observability-events.jsonl` | regenerated by their own runtimes; not hand-edited |

---

## NOTES / AMBIGUITIES FOR DOWNSTREAM PHASES

- **`/interface:design-reference` survival vs `commands/interface/` deletion** — conflicting goal directives (see TO-DELETE). Must be resolved with the operator in 005/006.
- **`design` agent fate** — rewrite to the standalone skill vs. retire the agent entirely. Recommend rewrite (design-extraction stays dispatchable).
- **Advisor trigger-phrase split** — the hub `graph-metadata.json` carries ~60 design phrases; the standalone skill inherits extraction + general-design-knowledge phrases, the pure "invent new direction / N variations / motion choreography" phrases retire. Verified by advisor re-scan in 006.
- **Group H default is NO-CHANGE** — do not mass-edit changelogs/examples/tests; that inflates the diff and rewrites history-ish content for no runtime benefit.
