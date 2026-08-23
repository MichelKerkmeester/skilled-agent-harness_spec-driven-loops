# Iteration 001: Meta Bind Expression Grammar and JS Action Signature

## Focus
Investigated the Meta Bind plugin's expression grammar for `now()`-style timestamps and the `js` inline-button action signature — the two primary VERIFY-flagged unknowns from the current reference docs. Also confirmed input-field and button-block syntax against the official plugin documentation at `moritzjung.dev/obsidian-meta-bind-plugin-docs`.

## Findings

### 1. Expression Grammar: JavaScript, not a special `=now()` syntax
The `updateMetadata` action with `evaluate: true` treats the `value` field as a **JavaScript expression**, not a Dataview-style `=` prefix expression. The official docs state:

> "If `evaluate` is set to `true`, the value is treated as a JavaScript expression and evaluated. The current value of the property is available in the expression as `x`. Other properties can be referenced using `getMetadata(bindTarget)`."

This means:
- `value: "new Date().toISOString()"` is the correct way to stamp a current timestamp
- `value: "x + 1"` increments the current value
- `value: "getMetadata('otherProp')"` reads another property
- The `=now()` and `=now().format(...)` patterns in the current reference docs are **incorrect** — they appear to be a Dataview convention mistakenly applied to Meta Bind
- There is no special `now()` function; plain JavaScript `Date` is used
- The `evaluate` option requires JavaScript to be enabled in Meta Bind settings

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/updatemetadata/]

### 2. JS Action Signature: Precise Interface Confirmed
The `js` (Run JavaScript File) action has this exact TypeScript interface:

```typescript
interface JSButtonAction {
    type: 'js';
    file: string; // path to the JavaScript file, relative to vault root
    args?: Record<string, unknown>; // optional arguments passed to the script
}
```

The script receives a `context` object with:
- `context.args` — the `args` from the button config (e.g., `context.args.greeting`)
- `context.buttonConfig` — the full button configuration (read-only)
- `context.buttonContext` — additional button information (see ButtonContext interface)

**Prerequisites:**
1. JS Engine plugin (`mProjectsCode/obsidian-js-engine-plugin`) must be installed and enabled
2. JavaScript must be enabled in Meta Bind settings

The script file is executed as-is (not a module export), with `context` available globally. The example shows `console.log('Hello ${context.args.greeting}!');` running directly.

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/runjavascript/]

### 3. InlineJS Action Signature
The `inlineJS` action runs inline JavaScript code directly:

```typescript
interface InlineJSButtonAction {
    type: 'inlineJS';
    code: string; // the code to run
}
```

Same `context` object available (`context.buttonConfig`, `context.buttonContext`). Supports YAML multiline strings for longer code. Same prerequisites (JS Engine + JavaScript enabled).

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/inlinejs/]

### 4. Input Field Syntax Confirmed
Syntax: `INPUT[type:bindTarget]` (inline) or code block ` ```meta-bind\nINPUT[inputType]\n``` `

Confirmed input types beyond the basic set in reference docs:
- `toggle`, `text`, `number`, `datePicker`, `timePicker` (in reference docs)
- Additional: `date`, `dateTime`, `editor`, `imageListSuggester`, `imageSuggester`, `inlineList`, `inlineListSuggester`, `inlineSelect`, `list`, `listSuggester`, `multiSelect`, `progressBar`, `select`, `slider`, `suggester`, `textArea`, `time`

Bind target forms confirmed:
- `propName` — this note's frontmatter
- `scope['prop name']` — property with spaces
- `file#propName` — another note's frontmatter
- `memory^propName` — in-memory only (not persisted)

Arguments syntax: `INPUT[type(arg1, arg2):bindTarget]` — e.g., `INPUT[inlineSelect(option(a), option(b)):rating]`

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/inputfields/]

### 5. Button Block Syntax Confirmed
Button block: ` ```meta-bind-button ` with YAML configuration.

Key correction: **`action` and `actions` are mutually exclusive** — only one can be used, not both.

Button properties:
| Field | Type | Required |
|-------|------|----------|
| `label` | string | yes |
| `style` | 'default' \| 'primary' \| 'destructive' \| 'plain' | yes |
| `icon` | string (lucide icon) | no |
| `class` | string (CSS classes) | no |
| `cssStyle` | string (inline styles) | no |
| `backgroundImage` | string (path) | no |
| `tooltip` | string | no |
| `id` | string | no |
| `hidden` | boolean | no |
| `action` | ButtonAction | mutually exclusive with `actions` |
| `actions` | ButtonAction[] | mutually exclusive with `action` |

Inline button: `BUTTON[buttonId]` or `BUTTON[id1, id2, id3]` for groups.

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/buttons/]

### 6. View Field Expression Grammar Uses MathJS
View fields use **mathjs** for computations, not JavaScript:

- `VIEW[bindTarget]` — plain display of bound value
- `VIEW[content][viewFieldType]` — with explicit type (default: `math`)
- `VIEW[{bindTarget} * 2]` — mathjs expression with bind targets in curly brackets
- `VIEW[{a} * {b}][math:c]` — compute and save result to bind target `c`

Bind targets in view field expressions use `{bindTarget}` syntax (curly brackets).

View field types: `math` (default), `text`, `link`, `image`

JS View Fields (code block only): ` ```meta-bind-js-view ` with bind target mappings and JavaScript code, requiring JS Engine.

[SOURCE: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/viewfields/]

## Ruled Out
- Attempted to fetch plugin docs from GitHub `docs/` folder — 404; docs are hosted externally at `moritzjung.dev/obsidian-meta-bind-plugin-docs`
- Attempted to fetch example vault `Button.md` — 404; example vault structure differs from expected path
- The `=now()` prefix pattern from the reference docs is ruled out as incorrect for Meta Bind; it's a Dataview convention

## Dead Ends
- Direct GitHub docs path (`/docs/Button Actions.md`, `/docs/Expressions.md`) — the plugin repo does not ship docs in a flat `docs/` folder; they are a separate documentation site
- Example vault direct file access — the example vault exists but file paths differ from expected

## Edge Cases
- **Contradictory evidence**: The current reference docs show `value: "=now()"` with an `=` prefix, suggesting a special expression language. The official docs show plain JavaScript expressions without any `=` prefix. The official docs are authoritative — the `=` prefix is not part of Meta Bind's syntax.
- **Missing dependency**: The installed `main.js` was not consulted directly; the official documentation site was used as the primary source. This is acceptable because the docs are maintained by the plugin author and are the canonical reference.
- **Partial success**: All 5 key questions were addressed with cited evidence from the official docs. The `now()` timestamp expression was resolved (JavaScript `Date`), but the exact formatting string for the timer use case (`YYYY-MM-DD HH:mm`) would need JavaScript `Date` methods or a library like `luxon`/`date-fns` if available in the Obsidian runtime.

## Sources Consulted
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/ — Official Meta Bind documentation site
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/updatemetadata/ — Update Metadata action reference
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/runjavascript/ — Run JavaScript File action reference
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/inlinejs/ — Run Inline JavaScript action reference
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/buttons/ — Buttons guide
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/inputfields/ — Input Fields guide
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/viewfields/ — View Fields guide
- https://github.com/mProjectsCode/obsidian-meta-bind-plugin — Plugin GitHub repository (README)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/meta-bind/data-model.md` — Current reference docs (VERIFY items)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/meta-bind/workflows.md` — Current workflow docs
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/meta-bind/meta-bind.md` — Current plugin index

## Assessment
- **New information ratio**: 0.90 (3 fully-new findings + 2 partially-new findings = 4.0/5 = 0.80, +0.10 simplicity bonus for resolving the two primary VERIFY contradictions)
- **Questions addressed**: 5/5
- **Questions answered**: 3/5 (expression grammar, js action signature, input-field/button-block syntax confirmed; workflows/gotchas and JS Engine coupling details need further investigation)

## Reflection
- **What worked and why**: Fetching the official documentation site directly was the most productive approach. The SPA site rendered full content when individual reference pages were fetched, providing authoritative TypeScript interfaces and examples. Cross-referencing against the current reference docs revealed the key contradiction about the `=now()` expression grammar.
- **What did not work and why**: Direct GitHub docs paths and example vault files returned 404s. The plugin's documentation is hosted on a separate site, not in the repo's `docs/` folder. The example vault exists but its file structure doesn't match simple paths.
- **What I would do differently**: For the next iteration, investigate the JS Engine plugin's API surface directly (the `engine` object methods, `setMetadata`, `getMetadata`), and look at the `ButtonContext` interface for the full `context` shape available to `js`/`inlineJS` actions. Also check the "Customizing MathJS" guide for date handling in view field expressions.

## Recommended Next Focus
Investigate the JS Engine plugin's API surface (`engine` object methods including `setMetadata`/`getMetadata`), the `ButtonContext` interface shape, and how MathJS handles date operations in view field expressions. Also identify missing workflows and gotchas for the task-timer recipe.