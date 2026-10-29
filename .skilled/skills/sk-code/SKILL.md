---
name: sk-code
description: "Implement, debug and verify code: TypeScript, Python, shell, JSON; quality and review workflow modes with stack surface packets."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 3.9.24.0
metadata:
  family: sk-code
---

<!-- Keywords: sk-code, code, surface-aware, two-axis, opencode, typescript, python, shell, json, jsonc, github-actions, ci-workflow, sk-code-quality, sk-code-review, sk-code-ci, quality, code-review, verification, debug, implement, workflow-doctrine, mode-registry, workflowmode, packetkind, backendkind, surface-router, evidence-base, surface-packet -->

# Code Family Hub (sk-code)

One skill has two axes, one shared surface-detection router and one advisor identity.
The **workflow axis** has two code modes that act: sk-code-quality and sk-code-review.
The **surface axis** has two read-only evidence packets the hub bundles alongside a workflow mode: sk-code-ci and sk-code-skilled.
Each packet carries the shared **implement → debug → verify** workflow doctrine (`shared/references/workflow-*.md`, symlinked in) plus its own domain knowledge.
This hub holds NO per-mode logic. It routes by `workflowMode` through `mode-registry.json`, and each mode or surface keeps its own contract in its packet.

**Version authority.** This file's `version` frontmatter is the hub's release version and matches the newest entry under `changelog/`.
`description.json`, `mode-registry.json` and `hub-router.json` carry the same value. Each hub-root JSON routing file therefore states the same release.
`ROUTER.md` and `README.md` keep their own document versions, as the frontmatter-versioning standard gives every doc but `SKILL.md`.
The authority stops at the hub root. Each `modes[]` packet carries its own version and release cadence.
A packet version is independent of this one by design, so a gap between them is not drift.

---

## 1. WHEN TO USE

Use this skill for code-family workflows. Invoke it as `sk-code` with an optional mode hint such as `quality: <request>`. The hub classifies the request, resolves a mode key, and loads the matching nested packet.

**Workflow axis** (modes that act, one of them chosen as primary):

| Mode | Use it for | Packet |
|------|------------|--------|
| **sk-code-quality** | Quality gate, P0/P1/P2 author checks, comment hygiene and surface checklists. | `sk-code/sk-code-quality/` |
| **sk-code-review** | Findings-first review, security and correctness baseline, checklists, output contract and PR-state gates. | `sk-code/sk-code-review/` |

**Surface axis** (read-only, advisor-invisible evidence. When a workflow mode scores, the hub bundles the surface after that primary mode. When no workflow mode scores, the hub routes the surface alone for a lookup, implement, debug or verify task, and the acting agent hands the author gates to `sk-code-quality` before it claims completion):

| Surface | Carries | Packet |
|---------|---------|--------|
| **sk-code-ci** | GitHub Actions evidence: trigger, filter, permission, timeout, concurrency and caching rules, the protected set, the intentional message-contract exception and the scaffold templates, with the repository-specific values read from a CI profile. Read-only. | `sk-code/sk-code-ci/` |
| **sk-code-skilled** | System-code evidence: TypeScript/Python/shell/config standards, hooks, alignment verification, authoring checklists. Bundles the implement → debug → verify workflow doctrine (read-only evidence) for the Skilled surface, and the acting agent applies it. | `sk-code/sk-code-skilled/` |

**Surface list.** The hub has exactly two surfaces:
- SKILLED (`sk-code-skilled`): the native surface for this framework's own code.
- CI (`sk-code-ci`): the GitHub Actions workflow standards surface.

The hub also has two workflow modes: quality (`sk-code-quality`) and review (`sk-code-review`).
Any other sk-code doc that counts surfaces points to this sentence.
After adding or removing a surface, run `/doctor:sk-code setup`. It checks the hub and names the repair for each failing check.

The **implement → debug → verify** phases are not standalone modes.
Their surface-agnostic doctrine lives once in `shared/references/workflow-implement.md`, `workflow-debug.md` and `workflow-verify.md`.
Those files are symlinked into each surface, so the active surface carries the full workflow.
A request to implement, debug or verify code causes the router to detect its surface and load that surface's bundled doctrine.
The acting agent applies that doctrine.

### When NOT to Use
- Documentation-only changes with no code-work contract - use `sk-doc`.
- Git workflow, branch, commit, PR, merge, or release work - use `sk-git`.
- Pure browser inspection or external MCP transport work - use the relevant MCP skill.
- For a measured Style Reference (design tokens extracted from a live source), use `sk-design-md-generator` first.
- Backend support primitives in `shared/` - they are consumed by the modes, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven at runtime and authored in `hub-router.json`** in two stages.
Stage 1 (hub → mode) uses `hub-router.json` as the authored mode vocabulary. `mode-registry.json` carries the packet contracts, whose aliases are checked against that vocabulary.
Stage 2 (mode → leaves) uses the root [`ROUTER.md`](./ROUTER.md) as the authored leaf-set router.
Both files point back here instead of restating the split.

The advisor routes every code query to the single identity `sk-code`. Resolve the mode with `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<task>"` and follow the decision: `route` loads its `targets`, `clarify` and `defer` ask, `reject` refuses.
Compiled routing is the default. The legacy fallback, the kill-switch and the `UNKNOWN_FALLBACK_CHECKLIST` live in the compiled-routing section of [`ROUTER.md`](./ROUTER.md).

A bare implement, debug or verify request with no workflow mode becomes a pure surface bundle, and an unclear code intent asks for disambiguation. Neither path forces a stale default.
Run the compiled-routing directive in [`ROUTER.md`](./ROUTER.md) before selecting hub resources.

---

## 3. HOW IT WORKS

### Terms

- **`workflowMode`**: the public mode or surface key a request resolves to.
- **`packetKind`**: the axis a packet sits on, `workflow` for a mode that acts and `surface` for read-only evidence bundled alongside a mode.
- **`backendKind`**: which backend runs the packet, `surface-router` or `review-cache` for a workflow mode and `evidence-base` for a surface.
- **`surfaceBundle`**: the `routerPolicy.outcomes` entry where one workflow mode leads and zero or more surfaces follow as evidence.
- **`mode-registry.json`**: the registry that owns each mode's discriminator, `surfaceDetection` markers and `advisorRouting`.
- **`hub-router.json`**: stage one's `routerSignals`, `vocabularyClasses` and the surface-bundling policy.
- **`ROUTER.md`**: stage two's `INTENT_SIGNALS` and `RESOURCE_MAP`, plus the `SHARED_CONTROL_RESOURCES` list and the always-loaded `DEFAULT_RESOURCE` preamble.
- **shared control**: a hub-level resource declared in `SHARED_CONTROL_RESOURCES`, which resolves on disk and never projects as a leaf.
- **leaf**: a typed `(workflowMode, leafResourceId)` pair from `leaf-manifest.json` that a `RESOURCE_MAP` path converts to.
- **surface detection**: the shared detection order over the declared surfaces, which tries each specific surface first, then the `SKILLED` fallback, then `UNKNOWN`.
- **`--surface-hint`**: the front-door flag that carries the detected surface into the compiled route, so a hinted surface leads a keyword tie.
- **`UNKNOWN_FALLBACK`**: the load level the router returns, with a disambiguation checklist, when no mode resolves.

### Layout
```
sk-code/
  SKILL.md               # this routing hub (no per-mode code logic)
  README.md              # human-facing front page for the hub
  ROUTER.md              # active stage-two surface router and shared-control declaration
  mode-registry.json     # the two-axis discriminator + advisorRouting contract
  hub-router.json        # lexical routing signals + surfaceBundle policy for hub-local choice
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  leaf-manifest.json     # typed (workflowMode, leaf) pairs the router guards validate
  changelog/             # hub release notes, one v<version>.md per hub release
  feature-catalog/       # current-state inventory of the hub's routing capabilities
  manual-testing-playbook/  # routing and disambiguation scenarios for the hub
  benchmark/             # historical routing benchmark inputs and reports
  sk-code-quality/       # quality mode packet     (workflow)
  sk-code-review/        # review mode packet      (workflow)
  sk-code-ci/            # GitHub Actions workflow standards packet (read-only evidence; rules, protected set and scaffold templates)
  sk-code-skilled/      # skilled surface packet (read-only evidence; carries the workflow doctrine)
  shared/                # shared surface-detection router, cross-mode helpers, and the implement/debug/verify workflow doctrine (references/workflow-*.md)
```

Each mode or surface packet is self-contained and carries no per-packet `graph-metadata.json`. Only this hub carries one, so the advisor discovers exactly one code skill identity. The implement/debug/verify workflow doctrine is a single shared source under `shared/references/`, and each surface symlinks it in rather than duplicating it.

### Backend
The `surface-router` backend is the shared surface-detection router under `shared/`.
It centralizes the detection order over the declared surfaces, the SKILLED fallback and UNKNOWN.
It carries the shared implement → debug → verify workflow doctrine consumed by each surface.
The `review-cache` backend supports the sk-code-review mode's non-mutating review output cache.
The `evidence-base` backend serves the surface packets as read-only domain evidence (`sk-code-ci/`, `sk-code-skilled/`). The hub bundles them alongside the primary mode.
The packet mutates nothing and never carries process. The acting agent applies the doctrine it bundles.
Shared backend material provides surface identity, the workflow doctrine and cross-mode helpers.
It must never gain per-mode workflow contracts.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json`, and never hardcode a router mapping in the hub.
- **ALWAYS** keep mode contracts in the mode packets, so the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity.
- **ALWAYS** give every mode an `advisorRouting` block with `routingClass: "metadata"` and the correct `packetSkillName`.
- **ALWAYS** keep the implement/debug/verify workflow doctrine as one shared source under `shared/references/`, symlinked into each surface, and never fork per-surface copies.
- **ALWAYS** keep `ROUTER.md` `RESOURCE_MAP` keys aligned with its intent keys and packet leaves aligned with `leaf-manifest.json`.
- **ALWAYS** keep hub-shared map inputs explicit in `SHARED_CONTROL_RESOURCES`, because they are control resources and never typed leaves.

### ⛔ NEVER
- **NEVER** add a `graph-metadata.json` inside a mode packet or `shared/`.
- **NEVER** put per-mode quality, review, or surface workflow logic in the hub.
- **NEVER** hardcode a router mapping outside `mode-registry.json`.
- **NEVER** reintroduce implement, debug, or verify as standalone mode packets, because they are surface-owned doctrine.

### ⚠️ ESCALATE IF
- A new code mode is needed - extend `mode-registry.json` and open a packet. Do not bolt logic onto the hub.
- Surface identity and workflow ownership conflict in a way the shared router cannot classify.

---

## 5. REFERENCES

- Workflow mode packets: `sk-code-quality/SKILL.md`, `sk-code-review/SKILL.md`.
- Surface evidence packets: `sk-code-ci/SKILL.md`, `sk-code-skilled/SKILL.md`.
- Shared workflow doctrine: `shared/references/workflow-implement.md`, `shared/references/workflow-debug.md`, `shared/references/workflow-verify.md` (symlinked into each surface).
- Registry: `mode-registry.json` (two-axis: `packetKind` discriminates workflow vs surface).
- Hub router signals + surface bundling: `hub-router.json`.
- Surface router and shared controls: `ROUTER.md`.
- Parent-skill pattern: `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`.
- Sibling example: `.skilled/skills/sk-prompt/`.
