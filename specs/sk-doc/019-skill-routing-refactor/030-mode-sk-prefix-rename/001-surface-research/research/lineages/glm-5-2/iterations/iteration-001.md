# Iteration 001 — Consumer classes that read packet dirs / workflowMode keys

**Focus (Q1):** Enumerate the consumer classes that read a packet directory name or a `workflowMode` value for the four sk- hubs. Start with the hub-level typed manifests.

**Lineage:** glm-5-2 | **Executor:** cli-devin glm-5-2 | **Status:** complete

---

## Approach

Read the four hub directories' typed manifests (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-aliases.json`, `description.json`) and record every field that carries a `workflowMode` key or a packet directory name. Each finding below carries a file path and line range.

## Findings — consumer classes (typed manifests)

### Class A — `mode-registry.json` (one per hub; 4 files)
The authoritative mode table. Each `modes[]` entry carries the bare `workflowMode` key plus the packet directory name in multiple typed fields.

| Field | Carries | Type | Representative path:line |
|-------|---------|------|---------------------------|
| `modes[].workflowMode` | workflowMode key | typed (string) | [SOURCE: .opencode/skills/sk-code/mode-registry.json:24] (`quality`), :43 (`code-review`), :63 (`code-webflow`), :82 (`code-opencode`) |
| `modes[].packet` | packet dir name | typed (string) | [SOURCE: .opencode/skills/sk-code/mode-registry.json:33] (`code-quality`) |
| `modes[].packetSkillName` | packet dir name | typed (string) | [SOURCE: .opencode/skills/sk-code/mode-registry.json:34] |
| `modes[].command` | slash command bound to mode | typed (string) | [SOURCE: .opencode/skills/sk-design/mode-registry.json:49] (`/interface:design`), [SOURCE: .opencode/skills/sk-doc/mode-registry.json:26] (`/create:skill`) |
| `modes[].aliases[]` | bare-key prose aliases | typed array, prose content | [SOURCE: .opencode/skills/sk-code/mode-registry.json:36] |
| `modes[].proceduresPath` | packet-relative path | typed (string) | [SOURCE: .opencode/skills/sk-design/mode-registry.json:46] (`design-interface/procedures`) |
| `modes[].advisorRouting.packetSkillName` | packet dir name | typed (string) | [SOURCE: .opencode/skills/sk-code/mode-registry.json:39] |
| `extensions.surface-axis.surfaces[]` | workflowMode keys | typed array | [SOURCE: .opencode/skills/sk-code/mode-registry.json:19] (`code-webflow`, `code-opencode`) |
| `extensions.transport-axis.transports[]` | workflowMode keys | typed array | [SOURCE: .opencode/skills/sk-design/mode-registry.json:24] (`design-mcp-open-design`) |

Note: `create-skill-parent` shares packet `create-skill` — its `packet`/`packetSkillName` equal `create-skill` while `workflowMode` is `create-skill-parent` [SOURCE: .opencode/skills/sk-doc/mode-registry.json:31-40]. This is the documented key≠directory exception.

### Class B — `hub-router.json` (one per hub; 4 files)
The router vocabulary. Carries workflowMode keys as object keys and as `tieBreak[]` list entries, plus packet-dir-prefixed resource paths.

| Field | Carries | Type | Representative path:line |
|-------|---------|------|---------------------------|
| `routerPolicy.tieBreak[]` | workflowMode keys (ordered) | typed array | [SOURCE: .opencode/skills/sk-code/hub-router.json:7] (`quality`,`code-review`,`code-webflow`,`code-opencode`) |
| `routerSignals.{key}` | workflowMode key as object key | typed (object key) | [SOURCE: .opencode/skills/sk-code/hub-router.json:17] (`quality`), :22 (`code-review`), :27 (`code-webflow`), :32 (`code-opencode`) |
| `routerSignals.{key}.resources[]` | packet-dir-prefixed path | typed path | [SOURCE: .opencode/skills/sk-code/hub-router.json:20] (`code-quality/SKILL.md`) |
| `vocabularyClasses.{key}.keywords[]` | bare keys + packet names in prose | typed array, prose content | [SOURCE: .opencode/skills/sk-code/hub-router.json:43] (`code-quality` literal), :49 (`code-review`) |

### Class C — `leaf-manifest.json` (one per hub; 4 files)
Maps each mode to its leaf resource files. Carries `workflowMode` and `packet` plus packet-dir-prefixed `leaves[]` paths.

| Field | Carries | Type | Representative path:line |
|-------|---------|------|---------------------------|
| `modes[].workflowMode` | workflowMode key | typed (string) | [SOURCE: .opencode/skills/sk-code/leaf-manifest.json:72] (`code-opencode`), :88 (`code-review`), :210 (`code-webflow`), :219 (`quality`) |
| `modes[].packet` | packet dir name | typed (string) | [SOURCE: .opencode/skills/sk-code/leaf-manifest.json:71] (`code-opencode`) |
| `modes[].leaves[]` | packet-dir-prefixed resource paths | typed path array | [SOURCE: .opencode/skills/sk-code/leaf-manifest.json:5-69] (paths under `assets/`,`references/` — relative to packet dir, so the dir rename changes the resolution root, not the leaf strings themselves) |

### Class D — `leaf-aliases.json` (sk-doc only; 1 file)
Aliases shared packet leaves under `shared/` back to a `workflowMode`.

| Field | Carries | Type | Representative path:line |
|-------|---------|------|---------------------------|
| `[].workflowMode` | workflowMode key | typed (string) | [SOURCE: .opencode/skills/sk-doc/leaf-aliases.json:3] (`create-changelog`), :8 (`create-quality-control`) |
| `[].diskPath` | `shared/`-prefixed path (not packet dir) | typed path | [SOURCE: .opencode/skills/sk-doc/leaf-aliases.json:5] |

### Class E — `description.json` (one per hub; 4 files)
Advisor metadata. Carries packet dir names inside `keywords[]` (prose-ish but structured) — NOT workflowMode keys directly.

| Field | Carries | Type | Representative path:line |
|-------|---------|------|---------------------------|
| `keywords[]` | packet dir name literals | typed array, prose content | [SOURCE: .opencode/skills/sk-code/description.json:41] (`code-quality`) |

### Class F — `graph-metadata.json` (one per hub; 4 files) — IDENTIFIED, NOT YET READ
Listed in every hub dir; carries graph edges. Deferred to iteration 2/3 for field-level evidence (file present at [SOURCE: .opencode/skills/sk-code/graph-metadata.json] — 8102 bytes).

### Class G — `command-metadata.json` (sk-design only) — IDENTIFIED, NOT YET READ
sk-design carries `command-metadata.json` (20472 bytes) with `taskProjections` that the registry references via `transformVerbRouting.commandProjectionParity` [SOURCE: .opencode/skills/sk-design/mode-registry.json:32]. Deferred to iteration 2 for field-level evidence.

## What Worked
- Reading all four `mode-registry.json` files in one batch gave the full typed-field inventory across hubs.
- `hub-router.json` `tieBreak[]` is a compact ordered list of every workflowMode key per hub — a high-signal sweep target.

## What Failed / Ruled Out
- None this iteration. Deferred `graph-metadata.json` and `command-metadata.json` field-level reads to avoid exceeding the per-iteration tool budget.

## Carried-Forward Open Questions
- Field-level evidence for `graph-metadata.json` (Class F) and `command-metadata.json` (Class G).
- Advisor metadata beyond `description.json` (e.g. `graph-metadata.json` mode nodes).
- Command bindings, agent definitions, runtime mirrors (.claude/.cursor/.codex/.devin), benchmark gold — not yet inspected.
- DB/cache consumers (spec open question) — not yet inspected.

## Next Focus
Classify every occurrence found in Class A–E as typed-safe-to-sweep vs path-position vs free-prose-with-English-collision (Q2), and pull in Class F/G field evidence.

## newInfoRatio: 1.0
Novelty justification: first iteration — established the full typed-manifest consumer-class inventory (A–G) with file:line evidence where read; no prior knowledge in this lineage.
