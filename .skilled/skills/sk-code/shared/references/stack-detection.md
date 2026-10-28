---
title: Stack & Surface Detection
description: Surface detection over the declared surfaces (specific surfaces, then the SKILLED fallback, then UNKNOWN) and SKILLED language sub-detection. Primary routing key for sk-code.
trigger_phrases:
  - "sk-code surface detection"
  - "stack detection routing key"
  - "language sub detection"
  - "declare an sk-code surface"
importance_tier: important
contextType: general
version: 2.2.11.0
---

# Router Reference - Code Surface Detection

`sk-code` detects the code surface before it classifies intent. It reads the working directory and the changed or target files, because one repository can hold the hub's own code beside another stack.

---

## 1. OVERVIEW

### Core Principle

Detect **where the work is happening** before deciding which standards apply. The narrowest declared surface that matches leads, and the hub's own code comes last.

### Surfaces

| Surface | Owns | Does Not Own |
| --- | --- | --- |
| Specific surfaces | The stack each one declares, such as an operator-private `local-*` skill or a surface packet another repository adds to the hub | Work that matches none of their markers |
| SKILLED | The hub's own code under `.skilled/`: skills, agents, commands, MCP servers, plugins, scripts, tests and JSON or YAML config. It is the one fallback surface | A stack a specific surface declares |
| UNKNOWN | The result when no declared surface matches | Any standard beyond the universal floor, the quality runner's built-in checks and the checks and checklists the repository's quality config names, each with its overrides applied, until the operator names the surface and its commands. The spec-folder authoring checklist needs the SKILLED surface |

`sk-code-ci` is a surface packet with no detection block. The hub bundles it from request vocabulary alone, so detection never returns it.

---

## 2. DETECTION ORDER

### The Rule

When a specific surface and SKILLED both match, the specific surface leads and SKILLED stays as second evidence. Every reader takes the order from the declarations below, so no implementation keeps a list of its own:

```text
1. The hub's own specific surfaces, in modes[] order in mode-registry.json.
2. Specific surfaces that skills outside the hub declare, sorted by skill_id.
3. SKILLED, the fallback. It leads only when no specific surface matched.
   Otherwise it follows them as second evidence and is never dropped.
4. UNKNOWN when nothing matched. Apply the universal floor, the quality runner's built-in checks and the checks and checklists the repository's quality config names, each with its overrides applied under `universal/rule-overrides.md`. The spec-folder authoring checklist needs the SKILLED surface, no discovered command applies, and the operator is asked which surface and which commands apply.
```

### Why SKILLED Is Last

A specific surface names one stack exactly. SKILLED is the hub's own code and the broadest surface, and one task can touch hub files beside another stack. If the broad surface came first, it would hide the narrow one. Keeping SKILLED as second evidence still loads its standards for the hub files the task touches.

The registry compiler enforces the order on every compile. It fails with `SURFACE_FALLBACK_INVALID` unless the hub declares exactly one fallback and ranks it last in `routerPolicy.tieBreak` in `hub-router.json`, so a keyword tie between two surfaces also ranks SKILLED last. The compiled router ignores `--surface-hint SKILLED` for the same reason. A hinted specific surface takes the first surface slot only when the prompt matched it.

### Declaring a Hub Surface

Each surface entry in `mode-registry.json` may carry a `surfaceDetection` block. The SKILLED block reads:

```json
"surfaceDetection": {
  "label": "SKILLED",
  "role": "fallback",
  "pathMarkers": [".skilled/", ".opencode/"],
  "fileMarkers": ["SKILL.md", ".ts", ".tsx", ".cjs", ".mjs", ".py", ".sh", ".rs"],
  "contentMarkers": ["graph-metadata", "spec-folder", "argparse"]
}
```

- `label` is the surface name detection reports and the value `--surface-hint` carries. Readers compare it in upper case.
- `role` is `specific` or `fallback`.
- `pathMarkers` are path segments, such as the folder a surface lives in.
- `fileMarkers` are file names or extensions.
- `contentMarkers` are text found in a touched file or in the request.

The compiler fails with `SURFACE_DETECTION_INVALID` when a block sits on a mode that is not a surface, names another role, declares no marker or reuses another block's label. A missing or empty label, or a marker that is not a string, fails with `AUTHORED_INPUT_INVALID`.

### Declaring an External Surface

A skill outside the hub declares the same block under the top-level key `surface_detection` in its own `graph-metadata.json`. The skill sits beside the hub in `.skilled/skills/` and names `"family": "sk-code"`. A skill named `local-example`, for example, could declare:

```json
{
  "skill_id": "local-example",
  "family": "sk-code",
  "surface_detection": {
    "label": "EXAMPLE",
    "role": "specific",
    "pathMarkers": ["src/example/"],
    "contentMarkers": ["example-marker"]
  }
}
```

These rules apply to an external block:

- It must state `"role": "specific"`. Readers ignore a block that claims the fallback role or states no role, because the fallback is the hub's own code.
- It needs a label and at least one marker, or it never matches.
- The registry compiler reads only the hub's registry, so it never checks the inner fields. Pick markers that do not catch other repositories. A bare `manifest.json` file marker would.
- The skill-root metadata check, `ci-skill-root-metadata.cjs`, accepts `surface_detection` as an optional top-level key and checks its fields. It fails with `GRAPH_METADATA_INVALID_SURFACE_DETECTION`, one finding per broken rule, when the value is not a JSON object, the `label` is missing or blank, the `role` is anything but `specific`, none of `pathMarkers`, `fileMarkers` and `contentMarkers` is a non-empty array, or one of those three is present but is not an array of strings. A marker must not be blank: one made only of spaces or tabs fails, because it would match nearly every path or request.
- The check skips folders whose name starts with `local-`, so it does not validate a private skill such as `local-example`. Check that block by hand against the rules above.

### The Fallback and the Symlink Guard

SKILLED is the hub's own code. On real file paths it holds only through its path markers, and only when the resolved path lands inside the hub's own `.skilled/` folder, or inside the folder its plugins link resolves to when that folder is not an ancestor of the hub. Its file and content markers serve text-only detection, such as a router replay over request text that has no resolved paths. Without that limit, the `.ts` marker would make a TypeScript file in any repository SKILLED.

Resolve symlinks before testing. A downstream plugin repository symlinks `.opencode`, `.claude`, `.codex`, `.cursor` and `.devin` at its root back to this hub. An operator's private `local-*` skills sit in the hub's `.skilled/skills/` folder as symlinks to another repository. A literal test for a `.skilled/` or `.opencode/` segment would therefore report SKILLED for work that never touches a hub file. After the paths resolve:

- A genuine hub file reached through a symlink, such as `.opencode/agents/code.md`, is SKILLED.
- A file that belongs to the downstream repository is not SKILLED, whatever its path string says.
- A file inside a symlinked `local-*` skill is not SKILLED, because it resolves to another repository.

The guard changes how the test runs, not the order.

### Where Detection Runs

Each reader applies this contract to the input it has:

| Reader | Input | A specific surface matches on | SKILLED matches on | Returns |
| --- | --- | --- | --- | --- |
| `detectWorkspaceSurface` in `.opencode/plugins/system-skill-advisor.js` | The resolved working directory | A path marker the directory holds or sits inside, or a file marker naming a file in it. Extension and content markers are skipped | The directory lying inside the hub's own `.skilled/` | The first match as the session's `--surface-hint`, or no hint |
| `detectSurfaces` in `sk-code-skilled/assets/scripts/router-replay-lib.cjs` | The request text only | Any marker found in the text | Any of its markers found in the text | Every matching label in order, with the first as the lead |
| `fileLabels` in `sk-code-quality/scripts/quality-gate.cjs` | Each changed file's resolved real path, name and content | A path marker on a path segment, a file marker on the extension or exact name, or a content marker in the text | Its path markers, only when the real path lies inside the hub's own `.skilled/` folder, or inside the folder its plugins link resolves to when that folder is not an ancestor of the hub | Each file's labels in order, or `UNKNOWN`, and their union for the run, or `unknown` |
| The resolver step in `sk-code-review/SKILL.md` | The reviewed files | It runs no detection of its own and reads each file's `surfaces` from `quality-gate.cjs --explain`, the `fileLabels` row above | The same as `fileLabels` | Each file's labels in order, or `UNKNOWN` |

---

## 3. SKILLED LANGUAGE SUB-DETECTION

Whenever SKILLED is detected, as the leading surface or as second evidence, select language resources by extension first:

| Language | Extensions | Resource Folder |
| --- | --- | --- |
| JAVASCRIPT | `.js`, `.mjs`, `.cjs` | `sk-code-skilled/references/javascript/` |
| TYPESCRIPT | `.ts`, `.tsx`, `.mts`, `.d.ts` | `sk-code-skilled/references/typescript/` |
| PYTHON | `.py` | `sk-code-skilled/references/python/` |
| SHELL | `.sh`, `.bash` | `sk-code-skilled/references/shell/` |
| RUST | `.rs`, then the `Cargo.toml` or `Cargo.lock` markers and napi-rs or wasm-bindgen vocabulary | `sk-code-skilled/references/rust/` |
| CONFIG | `.json`, `.jsonc`, `.yaml`, `.yml` | `sk-code-skilled/references/config/` |

When a task touches more than one language, load the shared guidance in `sk-code-skilled/references/shared/` plus the quick reference and checklist of each touched language.

Rust never overrides another language. A napi-rs or WASM parity task that touches `.rs` and `.ts` loads both trios plus the shared guidance, because the Rust module must match its TypeScript oracle byte for byte. The Cargo markers count only after SKILLED is detected, never as a signal for another project's surface.

YAML is live hub config: command routers, workflow contracts and each command's auto and confirm assets.

---

## 4. TEST CASES

| Context | Expected Surface | Reason |
| --- | --- | --- |
| CWD `.skilled/skills/sk-code` | SKILLED | The directory resolves inside the hub's own `.skilled/` |
| Changed `.skilled/agents/code.md` | SKILLED | The target file is under `.skilled/` |
| Literal path string contains `.opencode/` but resolves outside the hub | Not SKILLED | The symlink guard refuses SKILLED on a string match alone |
| Changed file inside a symlinked `.skilled/skills/local-*` skill | Not SKILLED | The file resolves to another repository |
| Changed `src/2_javascript/slider.js`, with a declared specific surface naming `src/2_javascript/` | That surface | A declared specific surface outranks the fallback |
| Changed `src/2_javascript/slider.js` and `.opencode/agents/code.md`, with a declared specific surface naming `src/2_javascript/` | **That surface**, then SKILLED as second evidence | Specific surfaces lead, and the fallback still loads for the hub file |
| Changed `apps/desktop/src/styles/app.css` and `.opencode/agents/code.md`, with no specific surface declared | SKILLED | The fallback is the only declared surface that matches |
| Router replay of request text naming `.skilled/skills/x/foo.ts` | SKILLED | Text-only detection matches the fallback's markers in the request |
| A prompt that bundles SKILLED and CI, sent with `--surface-hint SKILLED` | CI first, then SKILLED | A hint that names the fallback never moves it ahead of another surface |
| Root `package.json` with no `.skilled/` target | UNKNOWN | No declared surface owns generic Node.js |
| `go.mod` or `next.config.js` only | UNKNOWN | No declared surface names Go or Next.js |

---

## 5. RELATED RESOURCES

- [`../../mode-registry.json`](../../mode-registry.json): the `surfaceDetection` blocks and the `surface-axis` contract text.
- [`../../hub-router.json`](../../hub-router.json): `routerPolicy.tieBreak`, which ranks the fallback last.
- [`../../ROUTER.md`](../../ROUTER.md): root intent classification, resource maps, declared shared controls and load tiers.
- [`./phase-detection.md`](./phase-detection.md): the Phase 1, 2 and 3 lifecycle and per-phase resource loading.
- `SKILL.md` section 2: the operator-facing summary of the routing contract, including the session surface hint.
