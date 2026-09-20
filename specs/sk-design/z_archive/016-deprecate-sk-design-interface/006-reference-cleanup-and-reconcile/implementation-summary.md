---
title: "Implementation Summary: Repo-wide reference cleanup and reconcile after the sk-design delete"
description: "Reconcile complete: every live cross-skill contract that named the deleted sk-design hub is fixed (advisor graph identity + edges, command bridges regenerated from tooling, advisor/contract tests retuned, judgment-boundary docs reframed as out-of-scope, leaf manifests regenerated), the one benign routing-graph parity ripple recorded and re-run green, and the generated-artifact + frozen-evidence residual enumerated for main-side regeneration."
trigger_phrases:
  - "reconcile sk-design references summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/006-reference-cleanup-and-reconcile"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Live-contract reconcile complete; residual enumerated; parity drift recorded"
    next_safe_action: "validate.sh --strict on packet + skill root; operator-gated scoped commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/command-bridges.generated.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Repo-wide reference cleanup and reconcile after the sk-design delete

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Mutation Class** | mutates (live-contract edits + generated-artifact regeneration) |
| **Executor** | main agent, in-context |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every *live* reference to the deleted `sk-design` hub was reconciled, under one honesty rule — the survivor is an extraction leaf, not a judgment hub, so a hub reference is **removed** from an enumeration or **reframed as out-of-scope**, never mechanically repointed at the leaf:

- **Advisor graph identity + edges.** The survivor's `graph-metadata.json` `family` was corrected from the invalid `sk-design` (which red the graph even at HEAD) to `sk-util`. The two edges that named the survivor as part of the hub-era pairing — `mcp-tooling`'s `depends_on` and `sk-code`'s `siblings` — were removed so the graph is hub-free and symmetric.
- **Command bridges regenerated from tooling.** `command-bridges.generated.json` (with `projection.ts` and `skill_advisor.py`) was rebuilt via `derive-command-bridges.cjs`, dropping the sk-design hub node and the two `interface:` command nodes; the artifact now greps zero `sk-design`.
- **Advisor / contract tests retuned.** `command-binding-existence` dropped `sk-design` from HUBS and `interface` from its namespaces; `skill-root-metadata-contract` removed the hub class and added the survivor as standalone; `command-bridges-drift-guard` count guard → `[6, 28]`; `command-metadata-e2e` metadataCount → `20`.
- **Judgment-boundary docs reframed.** `sk-create-diff` (SKILL.md + README) and `sk-create-diagram` (README) now describe the retired design-judgment boundary as "out of scope"; the sk-design design-task variant was removed from the minimax model card; sk-design was dropped from the manual-testing-playbook package manifest and `validate-playbook-package.cjs`.
- **Leaf manifests regenerated.** `system-deep-loop`'s leaf-manifest (`--fix`) dropped the two deleted adapters; the survivor's `leaf-manifest.json` + `leaf-aliases.json` were regenerated for the standalone root.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An authoritative live-surface sweep (`rg -P 'sk-design(?!-md-generator)'`, excluding specs, benchmarks, changelogs, reports, the survivor, fixtures, and jsonl) returned 68 files. Each was classified into one of four buckets, and only the *live-contract* bucket was edited. Generated artifacts were rebuilt from their own generators rather than hand-patched, so each stays a faithful function of its inputs. Every judgment reference was tested against the honesty rule before editing: enumerations lost the hub entry; boundary docs gained an "out of scope" framing; nothing was repointed to make the extraction leaf look like a taste authority.

The single parity divergence the delete introduced (`rr-iter3-146`) was handled with a negative control: it was confirmed **green at the pre-delete HEAD baseline** (via a stash of this work), which proves it is a benign routing-graph ripple from removing the hub nodes — one saturated multi-lane tie where the Python reference keeps `sk-code` and the native TS scorer diverges to `sk-doc` — not a genuine regression. It was then recorded, with operator authorization, in both parity suites and the approved-divergences fixture, and the suites re-ran green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Remove-or-reframe, never false-repoint.** Where `sk-design` appeared as a judgment hub in an enumeration it was removed (a leaf cannot stand in for a hub); where a doc drew a boundary against design taste, that capability became "out of scope". This keeps the surviving skill's identity honest — measured CSS extraction, not design judgment.
- **Regenerate, don't hand-edit, generated artifacts.** Command bridges and leaf manifests were rebuilt from their generators so the projection remains derivable and drift-guarded, rather than a hand-patched snapshot that would silently rot.
- **Defer generated routing artifacts to main-side regen.** The compiled-routing `006-sk-design/` cohort, `compiled-route-*.cjs`, `serving-closure.manifest.json`, and the advisor diagnostic `skill-graph.json` are rebuilt by their own tooling on `main` and were already stale/broken in this checkout; regenerating them inside a feature checkout would fight the main-side rebuild. Recorded as documented residual, not a silent gap.
- **Record the benign drift only after a negative control.** The parity divergence was accepted only after proving it was green pre-delete — a reviewed single-row allowance, not a blanket suppression.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Live-surface sweep, re-run:** README.md, AGENTS.md, opencode.json, `.opencode/skills/README.txt` = 0 live hub refs; agent defs across all six runtimes (`.opencode`/`.claude`/`.codex`/`.cursor`/`.pi`/`.devin`) = 0; every `cli-external-orchestration` hit is under frozen `benchmark/reports/**`. Live-contract reconcile is complete.
- **Command bridges:** `command-bridges.generated.json` greps zero `sk-design`; the survivor is family `sk-util`.
- **Tests:** the reconciled advisor tests (parity ×2 at 104, drift-guard `[6, 28]`, metadata-e2e `20`, command-binding-existence, skill-root-metadata-contract) are aligned on disk; a full HEAD-baseline run confirmed the other 7 failing tests (advisor-validate ×2, graph-health, cli exit-128 ×3, cli-parity) are **pre-existing** at clean HEAD, not introduced here.
- **Residual enumerated:** compiled-routing cohort + `skill-graph.json` (main-side regen); frozen fixtures + model-benchmark records + benchmark reports; illustrative template/playbook examples.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Generated routing artifacts are not regenerated in this checkout** (documented residual): the compiled-routing `006-sk-design/` cohort and the advisor `skill-graph.json` still name the hub and must be rebuilt by their tooling on `main`.
- **Pre-existing failures remain out of scope:** the advisor-validate handler, the graph-health sk-vision↔sk-code asymmetry, and the cli exit-128 job-semantics/parity tests were red at clean HEAD before this work and are not addressed here.
- **Illustrative examples retained:** skill-creation templates, the command-contract worked-example, and playbook scenarios that use `sk-design` as a teaching example are deliberately left — they document a pattern, not a live route.
- Fully reversible while uncommitted (`git checkout -- <file>` per edit). Nothing committed or pushed.
<!-- /ANCHOR:limitations -->
