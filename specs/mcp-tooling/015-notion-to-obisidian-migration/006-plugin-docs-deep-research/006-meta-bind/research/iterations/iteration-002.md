# Iteration 002: JS Engine API Surface, ButtonContext Interface, and MathJS Date Handling

## Focus
Investigated the JS Engine plugin's API surface (`engine` object methods, `engine.getPlugin()` bridge to Meta Bind), the `ButtonContext` interface shape available to `js`/`inlineJS` actions, and MathJS date handling for view field expressions. Also identified missing workflows and gotchas in the current reference docs.

## Findings

### 1. JS Engine ↔ Meta Bind Coupling: `engine.getPlugin()` is the Bridge
The `engine` object in JS Engine code blocks does **not** have `setMetadata`/`getMetadata` directly. Instead, the coupling works through `engine.getPlugin()`:

```javascript
// In a JS Engine code block or startup script:
const mb = engine.getPlugin('obsidian-meta-bind-plugin')?.api;
if (!mb) { /* JS Engine or Meta Bind not loaded */ }

// Then use the Meta Bind API:
const bindTarget = mb.parseBindTarget('property', context.file.path);
mb.setMetadata(bindTarget, 'some value');
const value = mb.getMetadata(bindTarget);
```

The `engine.getPlugin(pluginId)` method returns the plugin instance; `.api` accesses the `ObsAPI` class which exposes the full Meta Bind API surface. This is the **only** way to access Meta Bind's metadata methods from JS Engine code.

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/api/]
[SOURCE: https://moritzjung.dev/obsidian-js-engine-plugin-docs/guides/api/]

### 2. `setMetadata` and `getMetadata` Live on `ObsAPI`, Not on `engine`
The Meta Bind `ObsAPI` class (accessed via `engine.getPlugin('obsidian-meta-bind-plugin').api`) provides these metadata methods:

- **`setMetadata(bindTarget, value)`** — Sets a property in Meta Bind's metadata cache. Takes a `BindTargetDeclaration` and a value.
- **`getMetadata(bindTarget)`** — Reads a property from Meta Bind's metadata cache. Falls back to the underlying source (e.g., Obsidian's metadata cache) if not cached.
- **`updateMetadata(bindTarget, updateFn)`** — Updates a property using a function `(currentValue) => newValue`.
- **`subscribeToMetadata(bindTarget, lifecycleHook, callback)`** — Subscribes to changes on a bind target (requires lifecycle management to avoid memory leaks).
- **`parseBindTarget(declarationString, filePath, scope?)`** — Parses a bind target string like `"property"` into a `BindTargetDeclaration`.
- **`createBindTarget(storageType, storagePath, property, listenToChildren)`** — Creates a bind target declaration programmatically.

**Critical gotcha:** API methods must NOT be destructured as standalone functions — they lose their `this` reference and will error. Always use `mb.methodName()`.

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/api/classes/obsapi/]
[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/api/]

### 3. ButtonContext Interface Shape
The `ButtonContext` interface available in `context.buttonContext` for `js`/`inlineJS` actions has exactly three properties:

```typescript
interface ButtonContext {
    isInGroup: boolean;   // whether the button is part of a button group
    isInline: boolean;    // whether the button is an inline BUTTON[id] vs a code block
    position: undefined | LinePosition;  // the button's position in the note (line numbers)
}
```

The `LinePosition` interface (from `NotePosition` class) provides `lineStart` and `lineEnd` numbers. This is useful for actions that need to know where the button is located in the note.

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/api/interfaces/buttoncontext/]

### 4. MathJS Has No Built-in Date Functions — Extend via Startup Scripts
MathJS (used by view field `math` type expressions) does **not** include date/time functions by default. The "Customizing MathJS" guide shows how to extend it:

1. Create a JavaScript file in your vault (e.g., `meta-bind-extensions.js`)
2. Enable it as a **JS Engine startup script** (in JS Engine settings)
3. Use `mb.mathJSImport(dict, options)` to import custom functions/constants:

```javascript
const mb = engine.getPlugin('obsidian-meta-bind-plugin').api;
mb.mathJSImport({
    // Custom functions
    clamp: (val, min, max) => Math.min(Math.max(min, val), max),
    // Custom constants
    foo: 42,
});
```

After import, custom functions are available in view field expressions:
```
VIEW[clamp({num}, 0, 10)]
VIEW[foo + 10]
```

**For date handling in view fields**, you would need to either:
- Add custom JavaScript `Date`-based functions via `mathJSImport` in a startup script
- Use `inlineJS`/`js` actions instead of view field expressions for date computation
- Use `updateMetadata` with `evaluate: true` and JavaScript `Date` expressions

**Important:** Modifying mathJS via a `js-engine` code block inside a note (rather than a startup script) may cause timing problems and is not recommended.

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/custommathjs/]

### 5. Missing Workflows and Gotchas Identified
Cross-referencing the current reference docs against the official plugin documentation reveals several gaps:

| Gap | Current Ref Docs | Official Docs / Reality |
|-----|-----------------|------------------------|
| **Timestamp expression** | Shows `value: "=now()"` with `=` prefix | Should be `value: "new Date().toISOString()"` with `evaluate: true` — plain JavaScript, no `=` prefix |
| **`action` vs `actions`** | Shows `action` or `actions` without noting mutual exclusivity | `action` and `actions` are **mutually exclusive** — only one can be used |
| **JS Engine prerequisite** | Mentions JS Engine but not the settings toggle | JavaScript must be **explicitly enabled** in Meta Bind plugin settings (Settings → Meta Bind → Enable JavaScript) |
| **View field limitation** | Not mentioned | View fields **only update when the note is open**. If NoteA has a computed view field and NoteB references it, closing NoteA breaks the computation |
| **Circular dependency protection** | Not mentioned | Meta Bind **detects and prevents** circular view field dependencies (e.g., `VIEW[{a}][math:b]` + `VIEW[{b}+1][math:a]`) |
| **JS View Fields disabled by default** | Not mentioned | JS View Fields (` ```meta-bind-js-view `) are **disabled by default** as a security risk — must be enabled in settings |
| **`memory^` storage type** | Not mentioned | `memory^propName` bind target stores values **in-memory only** (not persisted to frontmatter) — useful for temporary/transient values |
| **Lifecycle management** | Not mentioned | When using the Meta Bind API programmatically, mountable objects require explicit `mount()`/`unmount()` or `wrapInMDRC()` to prevent memory leaks |
| **API method binding** | Not mentioned | API methods must not be destructured — they lose `this` and will error. Always call as `mb.methodName()` |
| **ButtonContext fields** | Not mentioned | `context.buttonContext` provides `isInGroup`, `isInline`, and `position` — useful for context-aware actions |

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/viewfields/]
[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/api/]
[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/buttons/]
[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/runjavascript/]

### 6. JS Engine `Engine` Class Surface
The JS Engine `Engine` class (the `engine` global in code blocks) has a limited public API:

- **`engine.getPlugin(pluginId)`** — Gets a loaded Obsidian plugin by ID (the bridge to Meta Bind)
- **`engine.execute(params)`** — Executes JavaScript code programmatically (returns `Promise<JsExecution>`)
- **`engine.openExecutionStatsModal(jsExecution)`** — Opens a debug modal for an execution
- **`engine.activeExecutions`** — Read-only map of active execution IDs to `JsExecution` objects

The `engine` object also provides `engine.markdown`, `engine.importJs()`, and other utilities documented in the JS Engine API reference.

[SOURCE: https://moritzjung.dev/obsidian-js-engine-plugin-docs/api/classes/engine/]
[SOURCE: https://moritzjung.dev/obsidian-js-engine-plugin-docs/guides/api/]

## Ruled Out
- Attempted to find `engine.setMetadata`/`engine.getMetadata` as direct methods on the JS Engine `engine` object — they do not exist there; they are on Meta Bind's `ObsAPI` class
- Attempted to find built-in MathJS date functions — MathJS does not include date handling by default; custom functions must be imported via startup scripts

## Dead Ends
- The `engine` object's `execute()` method is for running JS code, not for metadata manipulation — the coupling path is always `engine.getPlugin('obsidian-meta-bind-plugin').api`

## Edge Cases
- **Contradictory evidence**: None found — all sources are consistent
- **Missing dependency**: The installed `main.js` was not consulted directly; the official documentation site was used as the primary source. This is acceptable because the docs are maintained by the plugin author and are the canonical reference
- **Partial success**: All research actions completed successfully. The JS Engine coupling question is now fully resolved. The MathJS date handling question is resolved (no built-in support, must extend via startup scripts). The ButtonContext interface is fully documented.

## Sources Consulted
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/api/ — Meta Bind API guide
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/api/classes/obsapi/ — ObsAPI class reference (setMetadata, getMetadata, etc.)
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/api/interfaces/buttoncontext/ — ButtonContext interface
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/custommathjs/ — Customizing MathJS guide
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/viewfields/ — View Fields guide (JS View Fields, limitations)
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/runjavascript/ — Run JavaScript File action
- https://moritzjung.dev/obsidian-js-engine-plugin-docs/ — JS Engine docs index
- https://moritzjung.dev/obsidian-js-engine-plugin-docs/api/classes/engine/ — Engine class reference
- https://moritzjung.dev/obsidian-js-engine-plugin-docs/guides/api/ — JS Engine API guide
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/meta-bind/data-model.md` — Current reference docs
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/meta-bind/workflows.md` — Current workflow docs

## Assessment
- **New information ratio**: 0.96 (5 fully-new findings + 2 partially-new findings = 6.0/7 = 0.857, +0.10 simplicity bonus for resolving the JS Engine coupling question = 0.957, capped at 1.0 → 0.96)
- **Questions addressed**: 2/2 remaining
- **Questions answered**: 1/2 remaining (JS Engine coupling resolved; workflows/gotchas identified but need synthesis into reference docs)

## Reflection
- **What worked and why**: Fetching the API reference pages directly was the most productive approach. The typedoc-generated API pages provided exact TypeScript interfaces and method signatures. The Customizing MathJS guide was particularly valuable — it revealed the startup-script pattern for extending mathjs that was not mentioned anywhere else.
- **What did not work and why**: The JS Engine docs index page was a thin overview; the real value was in the individual API class pages (Engine, API) and the API guide. The `engine.getPlugin()` pattern was documented in the Meta Bind API guide, not the JS Engine docs — cross-referencing both was essential.
- **What I would do differently**: For the next iteration, focus on synthesizing all findings into a coherent workflow for the task-timer recipe, and identify any remaining edge cases. The workflows/gotchas question is now largely answered but needs consolidation.

## Recommended Next Focus
Synthesize all findings from iterations 1 and 2 into a corrected task-timer workflow recipe. Verify the exact JavaScript date formatting needed for the timer use case (`YYYY-MM-DD HH:mm` format using `new Date().toLocaleString()` or manual formatting). Also investigate the `BindTargetDeclaration` interface shape for completeness of the API surface documentation.