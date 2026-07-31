---
title: Advisor Index Handoff
description: The shared vocabulary create and doctor render after a skill is scaffolded or diagnosed - metadata ownership, refresh ownership, the verification-state enum, and which branches carry the full handoff versus the narrow leaf-freshness signal.
trigger_phrases:
  - "advisor index handoff"
  - "does create refresh the advisor"
  - "skill_graph_scan vs advisor_rebuild"
  - "leaf-manifest fresh stale missing"
  - "create doctor shared vocabulary"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Advisor Index Handoff

The shared field vocabulary that `/create:skill`, `/create:skill-parent`, `/doctor:skill-advisor`, and `/doctor:parent-skill` all render after touching a skill root, so that scaffolding a skill and diagnosing its advisor state describe the same reality in the same words.

---

## 1. OVERVIEW

**Core Principle**: One vocabulary, not one formatter. Create and doctor are separate prompt-asset workflows with genuinely different result shapes (create reports a scaffold; doctor reports a mutating, phase-gated diagnostic run) — see `research.md` Theme F1/F2 in `035-create-doctor-skill-advisor-alignment/001-research/`. What must stay identical across both is the field names, the metadata-ownership statements, and the verification-state enum below, not the surrounding prose or layout.

**When to Use**:
- Wiring a create or doctor workflow asset's completion/report section (A5 in `002-core-alignment-fixes/plan.md`)
- Writing a contract test that pins the shared vocabulary across adapters (A6)
- Deciding whether a given create branch renders the full handoff or the narrow leaf-freshness signal only (§4)

> **Advisor refresh is always operator-owned.** No `/create:*` or `/doctor:*` workflow calls `skill_graph_scan` or `advisor_rebuild` as a side effect of scaffolding or diagnosing a skill. Every workflow that touches a skill root reports refresh status as `NOT RUN` and prints the exact command the operator would run — never chains it automatically (research.md Theme B1/B7, "Questions Answered").

---

## 2. METADATA OWNERSHIP

Four files carry advisor-relevant metadata on a skill root. Each has exactly one producer; none is validated against another's vocabulary.

| File | Producer | What it is | Advisor relevance |
| --- | --- | --- | --- |
| `description.json` | authored | Descriptive hub-doctor metadata | **None.** Not discovered or validated by the graph compiler. Never becomes advisor input, and never validated against graph vocabulary — see §5 Guardrail. |
| `graph-metadata.json` | authored | Sole hub advisor identity | The only file `skill_graph_scan` discovers and `skill_graph_validate` checks. |
| `leaf-manifest.json` | **generated** | Leaf/resource projection derived from the registry and packet corpus | Never hand-edited. State is `fresh`, `stale`, or `missing` — see §4. |
| `command-metadata.json` | authored, H-only, optional | Slash-command-to-mode binding | Present and validated when the hub owns commands; omitted (not empty) when it owns none. |

Full generated-versus-authored rules and the H/S class matrix live in `skill-root-metadata-contract.md` in this same directory — this document only states the subset relevant to the create → advisor handoff.

---

## 3. REFRESH OWNERSHIP

Refresh is a deliberate, explicit operator choice between two non-equivalent paths — never an unconditional chain, because `advisor_rebuild` already calls the same metadata indexer internally before publishing its own generation (research.md Theme B7).

```bash
cd "<selected_repo>"

# Full advisor refresh (rebuild + republish)
node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted --workspace-root "$PWD" --force true --format json

# Graph-only refresh (scan without republishing the advisor)
node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --skills-root "$PWD/.opencode/skills" --format json
```

Verification, run after either refresh path (or on its own to diagnose current state):

```bash
node .opencode/bin/skill-advisor.cjs skill_graph_validate --format json
node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
```

`skill_graph_scan` resolves `process.cwd()` as workspace root and rejects paths outside it — the `cd` is load-bearing, not decorative, when the operator is working from a linked worktree (research.md Theme B6).

---

## 4. VERIFICATION-STATE VOCABULARY

Every refresh or validation field a create/doctor workflow renders uses exactly one of these four states:

| State | Meaning |
| --- | --- |
| `NOT RUN` | Operator-owned action was not taken by this workflow (the default for every create-time refresh field). |
| `PASSED` | The action ran and its result was clean. |
| `FAILED` | The action ran and found a real problem (structural graph error, failed test, generation error). |
| `UNAVAILABLE (retryable)` | The call threw, returned a non-ok status, or the payload was malformed — typically the advisor IPC socket being cold (exit 75). Never render this as `FAILED`; it is a transport state, not a finding. |

`leaf-manifest.json` freshness uses its own three-value state, not the four above, because it describes a generated file's currency rather than a pass/fail check:

| State | Meaning |
| --- | --- |
| `fresh` | Generated after the current registry/packet corpus; content matches what `generate-leaf-manifest.cjs --write` would produce now. |
| `stale` | Present but predates a later registry/packet change. |
| `missing` | Not present on disk. |

Doctor severity derivation for `skill_graph_validate` (`pass`/`warn`/`fail`/`unavailable`) and the workflow-level terminal states (`fail`/`partial`/`pass`/`skipped_unverified`) are doctor-specific compositions of this vocabulary, not additional enums — see `doctor-skill-advisor.yaml`'s `phase_4_verify` for the full derivation.

---

## 5. CLASS APPLICABILITY

H-only fields render **omitted**, not `N/A` or a false negative, on standalone (class-S) roots — `description.json`, `mode-registry.json`, `hub-router.json`, and `command-metadata.json` are structurally forbidden there (`skill-root-metadata-contract.md` §3). A standalone `/create:skill` result that reported `description.json: MISSING` would be wrong; it should not mention the field at all.

**Guardrail (do not build this):** `description.json` stays descriptive and is never validated against graph vocabulary, and standalone `/create:skill` never asserts parent-hub metadata files. This boundary was raised and re-confirmed across nine iterations of research (Theme C, research.md) specifically because it is the mistake future maintainers are most likely to reintroduce — resist adding a `description.json` ↔ `graph-metadata.json` equality check or a parent-file requirement to a standalone assertion, however tempting it looks as a "consistency" improvement.

---

## 6. BRANCH SCOPE — WHO RENDERS WHAT

| Branch | Renders |
| --- | --- |
| Standalone `/create:skill` full-create | Full handoff, `standalone` scope (H-only fields omitted) |
| Standalone `/create:skill` full-update | Full handoff, `standalone` scope |
| Parent `/create:skill-parent` create | Full handoff, H-specific values (`leaf-manifest.json` freshness from the scoped generator this workflow just ran) |
| Parent `/create:skill-parent` update | Full handoff, H-specific values |
| Reference-only / asset-only create branches | **Not** the full handoff — only the narrow conditional `node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check <skillDir>` leaf-freshness signal, gated on the changed path falling under a configured leaf root |
| `/doctor:skill-advisor` | Full handoff vocabulary, live values from `skill_graph_validate`/`advisor_rebuild`/`advisor_validate` |
| `/doctor:parent-skill` | Full handoff vocabulary; read-only — distinguishes `leaf-manifest.json` missing from stale and points at the scoped generator, never attempts repair |

Rendering the full handoff on a reference/asset-only branch would be misleading: those branches touch roots where the H-only fields are forbidden, so most of the handoff would be inapplicable noise around one real signal (research.md Theme F7).
