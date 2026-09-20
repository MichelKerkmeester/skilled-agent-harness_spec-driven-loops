---
title: "Mutation and ownership boundaries"
description: "Separates read-only discovery from state-changing Orca operations and keeps sibling owners in charge of the surfaces cli-orca does not own."
trigger_phrases:
  - "mutation and ownership boundaries"
  - "orca mutation boundary"
  - "orca archive hook gate"
  - "orca worktree all scoping"
  - "cli-orca ownership split"
version: 1.0.0.0
---

# Mutation and ownership boundaries (cli-orca)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Separates read-only discovery from state-changing Orca operations and keeps sibling owners in charge of the surfaces cli-orca does not own.

The contract exists so an agent cannot treat a mutating command as a read because its name sounds safe. A command's safety class comes from the live guide and the requested operation, never from its verb. Where an operation changes state it needs explicit operator intent, and where a surface belongs to a neighbouring skill the request defers instead of being absorbed.

---

## 2. HOW IT WORKS

The classification rule is to treat a surface as state-changing unless the live guide and the requested operation prove otherwise. The state-changing set covers worktree create, set or remove including setup hooks and archive operations, terminal create, send, split, rename, switch or close, agent launch, handoff, account selection or authentication, automation create, edit, run or remove, and browser navigation, typing, form submission, uploads, downloads, evaluation and tab management. Artifact share, update, unshare and delete together with any skill-sharing or publishing action are state-changing in the same class. Read-only discovery such as listings, shows, reads, waits, snapshots, `--help`, `--version`, `skills get` and `agent-context --json` stays free. Mutating or destructive work requires explicit authorization, and a denied artifact or skill share such as `artifact_sharing_disabled` fails before any upload and is a final permission result rather than a reason to retry with different credentials.

Worktree removal passes through the archive-hook gate. The removal call runs with `--run-hooks`, and when the archive hook exits non-zero or ends unverifiable, Orca reports `worktree_archive_hook_failed` and blocks the deletion. `--force` does not bypass the failure. The documented `--allow-failed-archive-hook` override is a separate explicit decision, valid only together with the hook flag, and it must be reported when used instead of folded into an ordinary deletion. Neither the official guide nor the stub files document this gate, so the boundaries reference establishes it from source inspection of the upstream removal gate and names that inspection as the sole evidence. Bulk terminal close is destructive in the same class: it stops every terminal process in exactly that workspace and durably removes tabs, layouts and agent-resume records, and the result stays unverified until the host confirms every process stopped, with no retry against another host as a substitute for evidence.

The `--worktree all` scoping trap sits inside the browser and emulator lanes. Browser commands default to the current worktree and its active tab, and `--worktree all` exists for intentional reads only, because mutating verbs run unscoped under it. An unscoped mutating verb is no longer a targeted action, so a read-intent flag combined with a write verb widens the blast radius past everything the operator asked for.

The ownership split keeps the neighbours in charge. `sk-git` owns generic git worktrees, branches and commits. `mcp-chrome-devtools` owns Chrome and CDP inspection, HAR capture, Lighthouse and performance traces. `mcp-aside-devtools` owns generic agentic browser work not tied to Orca state. The official `computer-use` skill owns desktop control of a visible app window through `orca computer`, and external pages needing page automation go to a tool such as Playwright or CDP. The official `orchestration` skill owns supervised multi-agent coordination, while full ownership handoffs stay with `orca-cli`. An unrelated `OpenOrca` model label and the bare `orca` token route nowhere in this skill. A request that crosses into generic CDP work, generic agentic browser work, supervised orchestration or an unverified MCP surface escalates instead of being handled here.

The ownership matrix and the routing vocabulary are stated canonically in [SKILL.md](../../SKILL.md); the split above expands that statement for this safety surface.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-orca/SKILL.md` | Guardrail contract | States the mutation boundary, the authorization rule, the receipt-backed terminal claims and the NEVER rules against silent executable switching and unproven shutdown claims. |
| `.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md` | Guardrail reference | Classifies every lane into state-changing and read-only operations, fixes the archive-hook gate and its provenance, and holds the browser ownership matrix with the untrusted-content and credential rules. |
| `.skilled/skills/cli-orca/references/orca-cli-reference.md` | Command families | Records the worktree address form, the creation and removal call shapes and the removal safety note the guardrail enforces. |
| `.skilled/skills/cli-orca/references/session-and-runtime.md` | Session contract | Holds the receipt rules that decide what a terminal send or bulk close proved and the handoff-versus-orchestration split. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Node test | Document validator that classifies this catalog leaf and enforces the Validation And Tests table contract it carries. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Test harness | Fleet gate proving the cli-orca root carries a byte-fresh leaf manifest, so the references this feature cites stay declared routing targets. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Test harness | Package completion gate running the skill package checks for the standalone skill root. |
| `.skilled/skills/cli-orca/references/troubleshooting.md` | Reference | Recovery rows for the blocked states this feature governs, including a failed archive hook, an unverified bulk close and a denied share. |
| `specs/cli-orca/001-mcp-orca-cli/benchmark/reports/orca-integration/2026-09-19--orca-integration/routing-results.json` | Reference | Recorded routing replays covering the deferrals that hold the ownership split in place, including the generic git worktree case. |

---

## 4. SOURCE METADATA

- Group: Safety
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `safety/mutation-and-ownership-boundaries.md`

Related references:

- [../feature-catalog.md](../feature-catalog.md): the package index linking this leaf
- [../../references/mutation-and-browser-boundaries.md](../../references/mutation-and-browser-boundaries.md): the safety-class contract behind the mutation list and the archive-hook gate
- [../../references/orca-cli-reference.md](../../references/orca-cli-reference.md): the worktree address and removal call shapes the gate governs
