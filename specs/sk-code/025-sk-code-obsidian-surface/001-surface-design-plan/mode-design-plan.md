---
title: "Design Plan: sk-code-obsidian surface"
description: "The concrete, cite-backed design for the sk-code-obsidian read-only SURFACE packet — registry entry, hub-router wiring, the OBSIDIAN detection branch, the reference map, and the build-packet handoff. Plan only; no skill files are authored here."
trigger_phrases:
  - "sk-code-obsidian design plan"
  - "obsidian surface packet design"
  - "obsidian mode-registry entry"
importance_tier: "important"
contextType: "implementation"
---

# Design Plan: sk-code-obsidian Surface

This document designs `sk-code-obsidian`, a read-only `sk-code` SURFACE evidence packet for the
Obsidian Note Database plugin. It writes no skill file. Every claim below is checked against a
live file in `$HUB/.opencode/skills/sk-code/` (the hub) or `002-repo-convention-audit/audit.json`
(the measured plugin state); each section says which.

---

## 1. OVERVIEW

`sk-code` today detects three surfaces — `WEBFLOW`, `OPENCODE`, `PI_REMOTE` — plus `UNKNOWN` (`shared/references/stack-detection.md` §1-2). Code work on this plugin resolves `UNKNOWN`: it is generic Node.js outside `.opencode/` with no Webflow or Pi Remote marker (`stack-detection.md` §4, row "Root `package.json` with no `.opencode/` target"). Nothing loads — not the Obsidian API boundary, not the single-stylesheet model, not the `.db-*` grammar, not the capture harness, not the real gate commands.

`sk-code-obsidian` closes that gap the same way `sk-code-mobile-cli` closed it for the Pi Remote app: a fourth `packetKind: "surface"` entry in `mode-registry.json`, a fourth `OBSIDIAN` branch in `stack-detection.md`, and a packet whose shape mirrors `sk-code-mobile-cli/` file-for-file (`goal.md` §3, "the template is binding"). This plan produces no packet file. It produces the registry entry, the router wiring, the detection branch, the reference map, and the file-by-file handoff a later build packet executes — grounded in the measured audit at `002-repo-convention-audit/audit.json` rather than an aspirational one.

---

## 2. PACKET IDENTITY

- **Folder equals `packetSkillName` equals `sk-code-obsidian`.** This is the default naming policy for every new packet, workflow or surface (`parent-skills-nested-packets.md` §7, "`folder == packetSkillName` is the default for every new packet"). No `grandfatheredFolderMismatch` case applies.
- **No packet-level `graph-metadata.json` or `description.json`.** `sk-code`'s own `SKILL.md` §3 states it plainly: "Each mode or surface packet is self-contained and carries no per-packet `graph-metadata.json`; only this hub carries one." The metadata contract backs this with a gate: `description.json` is H-only ("No production consumer reads a skill-root `description.json` ... the contract forbids it", `skill-root-metadata-contract.md` §3), and a second `graph-metadata.json` below a hub root fails as `NESTED_IDENTITY` (`skill-root-metadata-contract.md` §5). A build packet that adds either file to `sk-code-obsidian/` fails the fleet gate on sight.
- **Companion files the packet does carry**, per the companion-file policy (`parent-skills-nested-packets.md` §7): `SKILL.md`, `README.md`, `references/` (five purpose-named subfolders, mirroring `sk-code-mobile-cli/references/{operations,release,setup,standards,quality}/`), `assets/` (on-demand checklists), `manual-testing-playbook/`, `changelog/`, and `scripts/` (the gates runner). `leaf-manifest.json` is generated, never authored, by `ci-skill-root-metadata.cjs --fix` (`skill-root-metadata-contract.md` §4).

---

## 3. THE `mode-registry.json` ENTRY

Verified live: `extensions.surface-axis.surfaces` currently reads
`["sk-code-webflow", "sk-code-opencode", "sk-code-mobile-cli"]`
(`mode-registry.json:19`). This packet appends a fourth name.

```jsonc
// modes[] — new entry, appended after sk-code-mobile-cli
{
  "workflowMode": "sk-code-obsidian",
  "packetKind": "surface",
  "backendKind": "evidence-base",
  "toolSurface": {
    "allowed": ["Read", "Bash", "Grep", "Glob"],
    "forbidden": ["Write", "Edit", "Task"],
    "mutatesWorkspace": false,
    "bashAllowlist": []
  },
  "packet": "sk-code-obsidian",
  "packetSkillName": "sk-code-obsidian",
  "grandfatheredFolderMismatch": false,
  "aliases": [
    "obsidian plugin implementation",
    "obsidian plugin code",
    "note database plugin",
    "obsidian plugin surface",
    "db-* class grammar"
  ],
  "advisorRouting": {
    "routingClass": "metadata"
  }
}
```

```jsonc
// extensions.surface-axis.surfaces — append "sk-code-obsidian"
"surfaces": ["sk-code-webflow", "sk-code-opencode", "sk-code-mobile-cli", "sk-code-obsidian"]
```

`toolSurface` is byte-identical in shape to `sk-code-webflow`, `sk-code-opencode`, and `sk-code-mobile-cli`'s entries (`mode-registry.json:62-76, 78-95, 96-113`) — every surface is read-only with the same four tools, per the surface-packet constraint that `toolSurface.allowed` is limited to read/search commands and `mutatesWorkspace` is `false` (`parent-skills-nested-packets.md` §1).

**Alias disjointness, checked against the live file.** The five registered modes carry 33 aliases today (`mode-registry.json:36, 55, 73, 91, 109`): 13, 10, 3, 3, and 5 respectively. None reads `"obsidian plugin implementation"`, `"obsidian plugin code"`, `"note database plugin"`, `"obsidian plugin surface"`, or `"db-* class grammar"` — the five proposed aliases are disjoint from all 33 and already lowercase, per the case-folded match requirement (`parent-skills-nested-packets.md` §7).

---

## 4. THE `hub-router.json` WIRING

Verified live: `routerSignals` has one entry per registered `workflowMode`, each weighted `4` (`hub-router.json:17-41`); `routerPolicy.tieBreak` currently reads `["sk-code-quality", "sk-code-review", "sk-code-webflow", "sk-code-opencode", "sk-code-mobile-cli"]` (`hub-router.json:7`) — workflow modes first, surfaces after, per doctrine (`parent-skills-nested-packets.md` §2, "Tie-break order lists workflow modes first and surface packets after them").

```jsonc
// routerSignals — new key, weight matches every existing surface
"sk-code-obsidian": {
  "weight": 4,
  "classes": ["code-obsidian-aliases", "code-obsidian-runtime", "hub-identity"],
  "resources": ["sk-code-obsidian/SKILL.md"]
}
```

```jsonc
// vocabularyClasses — two new classes, "code-" prefix (not "sk-code-"),
// matching the live pattern: code-webflow-aliases, code-mobile-cli-runtime, etc.
"code-obsidian-aliases": {
  "keywords": [
    "obsidian plugin implementation", "obsidian plugin code", "note database plugin",
    "obsidian plugin surface", "db-* class grammar", "obsidian", "obsidian plugin",
    "note-database"
  ]
},
"code-obsidian-runtime": {
  "keywords": [
    "obsidian api", "itemview", "workspaceleaf", "plugin.ts", "manifest.json",
    "esbuild.config.mjs", "styles.css", ".db-", "vault", "metadatacache", "tfile"
  ]
}
```

```jsonc
// routerPolicy.tieBreak — append at the end, after sk-code-mobile-cli
"tieBreak": [
  "sk-code-quality", "sk-code-review", "sk-code-webflow",
  "sk-code-opencode", "sk-code-mobile-cli", "sk-code-obsidian"
]
```

This mirrors the two vocabulary strategies named in doctrine: `sk-code` builds match phrases from parts rather than mirroring every alias verbatim, so `code-obsidian-aliases` composes the registry aliases plus a few bare nouns (`"obsidian"`, `"obsidian plugin"`) the way `code-mobile-cli-aliases` does (`hub-router.json:80-82`) — one vocabulary strategy held consistently, not mixed (`parent-skills-nested-packets.md` §7).

---

## 5. `stack-detection.md` — THE OBSIDIAN BRANCH

**New precedence, as specified for this packet**: `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN`. OBSIDIAN sits directly under OPENCODE because its markers (`manifest.json`'s `minAppVersion` key, `esbuild.config.mjs`, `from "obsidian"` imports) are as unambiguous as OPENCODE's own `.opencode/` target test and never collide with PI_REMOTE's app-workspace paths or WEBFLOW's CDN/vanilla-animation markers. Placing it above WEBFLOW matters: an Obsidian plugin repository is, structurally, a TypeScript + `package.json` tree that would otherwise read as "generic Node.js" and fall to `UNKNOWN` under the existing generic-Node guard (`stack-detection.md` §2, "Generic Node.js outside `.opencode/` and without WEBFLOW markers stays UNKNOWN") — OBSIDIAN's markers must be checked before that fallback is reached.

```bash
# 2b. OBSIDIAN (Note Database plugin — Obsidian Plugin repo and its worktrees)
# CWD or any changed/target file under the Obsidian Plugin repo tree.
[ -f "manifest.json" ] && grep -q '"minAppVersion"' manifest.json
[ -f "esbuild.config.mjs" ]
grep -lq 'from "obsidian"\|extends Plugin\b\|extends ItemView\b' src/**/*.ts 2>/dev/null
grep -lq '\.db-[a-zA-Z-]' styles.css 2>/dev/null
```

### CRITICAL GUARD — the symlinked `.opencode/` trap

The Obsidian Plugin repository symlinks `.opencode`, `.claude`, `.codex`, `.cursor`, and `.devin` at its root back to the hub, so the hub's skills, agents, and commands are visible to tooling that expects those folders at a repo root. **A naive "does `.opencode/` exist above CWD" test misfires here**: walking up from any CWD inside the plugin repo — `src/views/`, three levels deep, anywhere — finds that symlinked entry at the repo root and reports OPENCODE for every task in this repository, even one that never touches a hub file.

The correct test is not existence of a `.opencode`-named entry near CWD; it is whether the **resolved (symlink-followed) real path** of CWD or of the changed/target file lands inside the hub's actual directory, `~/MEGA/Development/Code_Environment/Public/.opencode/`. OPENCODE detection must resolve symlinks before testing the `.opencode/` segment, never test the literal, unresolved path string. A task whose CWD is `Obsidian Plugin/.worktrees/.../src/views` resolves OBSIDIAN, because no *resolved* target path lands in the hub's tree — the symlink three levels up is irrelevant. A target that really is `Obsidian Plugin/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md` still resolves OPENCODE, because following that symlink lands inside the hub — the guard changes *how* the test is done, not the OPENCODE-wins outcome for genuine hub files.

### TEST CASES (append to `stack-detection.md` §4)

| Context | Expected Surface | Reason |
| --- | --- | --- |
| CWD `Obsidian Plugin/.worktrees/001-.../src/views`, target `DatabaseView.ts` | **OBSIDIAN** | `manifest.json` + `esbuild.config.mjs` + `obsidian` imports resolve; no *resolved* target path lands in the hub's `.opencode/` tree, despite the symlink at the repo root |
| Root `package.json`, no `manifest.json`, no `.opencode/` target | UNKNOWN | Generic Node.js is not owned; OBSIDIAN's positive markers are required, not merely the absence of other surfaces |
| Target's literal path string contains `.opencode/`, but its *resolved* real path lands outside `~/.../Code_Environment/Public/.opencode/` (a broken or repointed symlink) | **not OPENCODE** | The realpath gate refuses OPENCODE on a string match alone |
| Target `Obsidian Plugin/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md`, whose resolved path lands inside the hub | **OPENCODE** | The symlink genuinely targets hub content; OPENCODE still wins once the path is resolved |
| WEBFLOW marker (`gsap.to(`) present in a plugin `tools/` script, alongside `manifest.json` at repo root | **OBSIDIAN** | OBSIDIAN's repo-root markers win over a library-import marker, the same way OPENCODE's CWD/target wins over a WEBFLOW library marker in a mixed-marker repo (`stack-detection.md` §4, "Mixed-marker repo") |

---

## 6. REFERENCE MAP

Proposed `references/` content, mirroring `sk-code-mobile-cli/SKILL.md` §2's table shape. None of these files exist yet — this is the design a build packet (phase 005 of the roadmap) authors against.

| Reference | What it carries |
| --- | --- |
| `references/obsidian-api-boundary.md` | The Obsidian API surface `main.ts` consumes in one import line (`Plugin`, `ItemView`, `WorkspaceLeaf`, `Vault`, `MetadataCache`, `TFile`), `manifest.json`'s `minAppVersion`/`isDesktopOnly` contract, and the `onload`/`onunload` boundary. |
| `references/single-stylesheet-ownership.md` | `styles.css` is the one stylesheet — 18,931 lines, measured — with no component-scoped `<style>` blocks, unlike mobile-cli's Svelte scoping. Where a rule belongs; that a split is an operator decision this packet documents but does not make (`roadmap.md` §4). |
| `references/db-class-naming.md` | The `.db-*` grammar: 1,196 distinct classes measured, 769 orphaned (no fixture references them), 427 referenced by fixtures. What an edit or rename must not silently orphan. |
| `references/screenshot-fixture-harness.md` | `scenarios.mjs`'s registration contract, `verify.mjs`'s source-hash gate (180 entries measured), the hand-fixture-vs-real-renderer distinction, and `theme.css`/`runtime-vars.css` standing in for host variables (`AGENTS.md`). |
| `references/verification.md` | The gate commands and measured baseline: `tsc --noEmit` (0), `build` (0), `vitest run` (386/49 files), `screenshots:verify` (180 entries), `lint` (115 known problems — recorded, not a target). |
| `references/comment-grammar.md` | The target `MODULE:` banner and numbered box-drawing convention (0 of 249 files today, measured), distinguished from the pre-existing Chinese CSS cheat sheet in `styles.css`, plus `AGENTS.md`'s rule against spec/req/task ids in comments. |
| `references/folder-docs.md` | The `README.md`/`CODE.md` threshold (3+ direct source files, or a child source folder), mirrored from mobile-cli, and the six folders that owe docs today (`audit.json` → `folderDocs.owesReadmeAndCode`). |
| `references/view-renderer-architecture.md` | The `src/views/*Renderer.ts` family (Table, Board, Gallery, List, Calendar, Timeline, Chart), the `src/data/` pipeline (`DataSource`, `RowPipeline`), and `main.ts` as the single `Plugin` entry registering both view types. |
| `references/source-naming.md` | The kebab-case target: 232 PascalCase / 16 kebab-case filenames measured, the `camelCase`/`_shared` exceptions, and the manifest-driven rename this reference documents but phase 010 executes. |
| `references/workflow-implement.md` · `workflow-debug.md` · `workflow-verify.md` | The shared implement → debug → verify doctrine, symlinked from `../../shared/references/` (§8). |

Checklists (`assets/`) are named in §7's `RESOURCE_MAP` and pulled on demand, not part of the initial evidence slice — the same discipline `sk-code-mobile-cli/SKILL.md` §4 states.

---

## 7. SMART ROUTING (§2b, machine-readable)

Mirrors `sk-code-mobile-cli/SKILL.md` §2b's shape: an intent→resource projection the parent hub's `ROUTER.md` §11 unions in, re-prefixed with `sk-code-obsidian/`, once the packet is authored.

```python
DEFAULT_RESOURCE = [
    "references/obsidian-api-boundary.md",
    "references/comment-grammar.md",
]

INTENT_SIGNALS = {
    "IMPLEMENTATION":    {"weight": 1, "keywords": ["view renderer", "add renderer", "table renderer", "database view", "implement", "build", "new column type", "row pipeline"]},
    "CODE_QUALITY":      {"weight": 1, "keywords": ["module banner", "section banner", "folder docs", "naming", "quality gate", "lint", "kebab-case", "comment grammar"]},
    "DEBUGGING":         {"weight": 1, "keywords": ["debug", "broken", "regression", "wrong render", "empty state bug", "pipeline diagnostics"]},
    "VERIFICATION":      {"weight": 1, "keywords": ["verify", "tsc --noEmit", "vitest", "screenshots:verify", "completion claim", "gate baseline"]},
    "STACK_STANDARDS":   {"weight": 1, "keywords": ["obsidian api", "itemview", "workspaceleaf", "manifest.json", "esbuild", ".db-", "styles.css", "single stylesheet"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "references/view-renderer-architecture.md",
        "references/db-class-naming.md",
        "references/single-stylesheet-ownership.md",
        "assets/renderer-implementation-checklist.md",
    ],
    "CODE_QUALITY": [
        "references/comment-grammar.md",
        "references/folder-docs.md",
        "references/source-naming.md",
        "assets/comment-grammar-checklist.md",
        "assets/folder-docs-checklist.md",
    ],
    "DEBUGGING": [
        "references/view-renderer-architecture.md",
        "references/verification.md",
        "assets/debug-checklist.md",
    ],
    "VERIFICATION": [
        "references/verification.md",
        "references/screenshot-fixture-harness.md",
        "assets/verification-checklist.md",
    ],
    "STACK_STANDARDS": [
        "references/obsidian-api-boundary.md",
        "references/single-stylesheet-ownership.md",
        "references/db-class-naming.md",
        "references/screenshot-fixture-harness.md",
    ],
}
```

The five named `assets/*.md` checklists are proposed names for phase 006 to author, not files that exist. Intent names, keywords, and checklist filenames are this plan's proposal for the build packet to adopt or amend — nothing here is generated by tooling.

---

## 8. WORKFLOW-DOCTRINE SYMLINKS

`sk-code`'s implement → debug → verify doctrine lives once, under `shared/references/workflow-implement.md`, `workflow-debug.md`, and `workflow-verify.md`, and is symlinked into each surface rather than forked (`SKILL.md` §5; `sk-code-mobile-cli`'s own copies at `references/workflow-implement.md` etc. are symlinks, confirmed by that packet's file listing carrying no independent content for those three names). `sk-code-obsidian/references/` carries the same three symlinks, pointing at the identical shared source:

```
sk-code-obsidian/references/workflow-implement.md -> ../../shared/references/workflow-implement.md
sk-code-obsidian/references/workflow-debug.md      -> ../../shared/references/workflow-debug.md
sk-code-obsidian/references/workflow-verify.md     -> ../../shared/references/workflow-verify.md
```

No per-surface fork. A future edit to the shared doctrine reaches every surface, including this one, without a second write.

---

## 9. BUILD-PACKET FILE LIST AND GATES

What a follow-on build packet (`roadmap.md` phases 003-011) creates or edits, and the gate each change must clear. Nothing in this row list is created by this plan-only phase.

| Path | Change | Phase | Gate |
| --- | --- | --- | --- |
| `sk-code/mode-registry.json` | Modify — §3 entry + `surfaces[]` | 003 | `ci-skill-root-metadata.cjs` exit 0 |
| `sk-code/hub-router.json` | Modify — §4 signals, vocab, tie-break | 003 | `compiled-route-manifest.cjs refresh` + `freshness` (003 found `mint` returns `already-exists` against an existing manifest and updates nothing) |
| `sk-code/shared/references/stack-detection.md` | Modify — §5 OBSIDIAN branch | 003 | `compiled-route.cjs --hub sk-code` bundles `sk-code-obsidian`, not defer |
| `sk-code/ROUTER.md` | Modify, only if leaves are exposed | 003 | root-router two-state contract validator |
| `sk-code/sk-code-obsidian/SKILL.md` | Create | 004 | `ci-skill-root-metadata.cjs` (no `NESTED_IDENTITY`) |
| `sk-code/sk-code-obsidian/README.md` | Create | 004 | Shape parity vs `sk-code-mobile-cli/README.md` |
| `sk-code/sk-code-obsidian/references/**` (§6, five subfolders) | Create | 005 | `scan-skill-references.mjs` reports `broken : 0` |
| `sk-code/sk-code-obsidian/assets/*.md` (§7's five checklists) | Create | 006 | Referenced from `SKILL.md` §2b, on demand |
| `sk-code/sk-code-obsidian/manual-testing-playbook/` | Create | 007 | Routing-recall corpus, mirroring mobile-cli's eight docs |
| `sk-code/sk-code-obsidian/changelog/v0.1.0.0.md` | Create | 007 | Real file, never a symlink (`parent-skills-nested-packets.md` §7) |
| `sk-code/sk-code-obsidian/scripts/run-source-gates.sh` | Create | 008 | Exits 0 once the wrapped plugin-repo scanners pass |
| `sk-code/sk-code-obsidian/leaf-manifest.json` | Generated | 005+ | `ci-skill-root-metadata.cjs --fix`, byte-compared |
| `tools/naming/scan-*.mjs` (plugin repo, three scanners) | Create | 008 | Non-zero findings against the unconverted tree first |
| `src/**`, `tools/**` (plugin repo) | Modify — banners, sections, folder docs | 009 | `scan-comments.mjs`, `scan-folder-docs.mjs` pass |
| `styles.css` (plugin repo) | Modify — section grammar over the preamble | 009 | `screenshots:verify` clean (no `.db-*` renamed) |
| `src/**`, `tools/**` filenames (plugin repo) | Rename — manifest-driven kebab-case | 010 | `tsc`, `build`, `vitest run`, `screenshots` all clean |

Closing gate for the whole packet, per `goal.md` §5: every leaf validates through the hub path (`.opencode/specs/obsidian-wt001/...`, never the plugin repo's own `validate.sh`, per the verification note in `spec.md` §5), `compiled-route.cjs` bundles `sk-code-obsidian` instead of deferring, and `ci-skill-root-metadata.cjs` exits 0 for the whole fleet.

---

## RELATED DOCUMENTS

- [`spec.md`](spec.md) — this phase's requirements and scope.
- [`plan.md`](plan.md) — the execution plan for producing this design.
- [`tasks.md`](tasks.md) — the task breakdown for this phase.
- `../goal.md`, `../spec.md`, `../roadmap.md` — the packet's frozen scope and phase sequencing.
- `../002-repo-convention-audit/audit.json` — the measured plugin state cited throughout.
- `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/` — the template this design mirrors.
