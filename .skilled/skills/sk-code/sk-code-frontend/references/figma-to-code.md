---
title: Figma to Code Translation
description: Why Figma components carry more structure than code needs, and how each Figma construct translates into simple, semantic web or React Native code built from the tokens the app installs.
trigger_phrases:
  - "figma to code translation"
  - "figma auto layout to flexbox"
  - "implement a figma design in code"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# Figma to Code Translation

How to read a Figma design as a reference and build the simplest correct structure from it.

---

## 1. OVERVIEW AND THE RULE

Figma is a reference for code, never its markup. Never copy the layer tree, absolute coordinates, fixed frame sizes or component property sets 1:1 into code.

A Figma read, export or MCP pull tells you what the screen should look like and which states it has. It does not tell you which elements to write. That decision belongs to [`web-markup-and-css.md`](web-markup-and-css.md) or [`react-native-layout-and-a11y.md`](react-native-layout-and-a11y.md), and every value comes from the tokens the app installs.

The cross-stack principles are in [`frontend-practice.md`](frontend-practice.md). The web and native layers name the mechanics each app uses.

---

## 2. WHY FIGMA COMPONENTS LOOK THE WAY THEY DO

Design teams build one Figma component to serve many use cases without creating a new variant for each. That flexibility costs structure:

- **Boolean properties** that show or hide layers, so one button covers icon-left, icon-right and text-only.
- **Instance-swap slots** that accept any icon or nested component.
- **Nested auto-layout wrapper frames**, added to control padding, alignment or clipping on the canvas.
- **Absolutely positioned layers**, so the component stays resizable in the editor without its parts reflowing.
- **Fixed frame widths and text boxes with set sizes**, sized for one artboard, often a 375 px phone frame.
- **Variants for states** (hover, pressed, focus, disabled) and sizes, because Figma has no pseudo-classes or props.

That structure serves the canvas and the designer. Code usually needs a simpler, more effective structure: fewer elements, normal flow, states from CSS or props, and values from tokens.

---

## 3. TRANSLATION TABLE

| Figma construct | Web | React Native, where it differs |
|-----------------|-----|--------------------------------|
| Auto layout, direction | `display: flex` with `flex-direction`, or grid for two axes | `flexDirection` (column is the default) |
| Auto layout spacing between items | `gap` with a spacing token | `gap` with a spacing token |
| Auto layout padding | `padding` with spacing tokens, logical properties | `padding` with spacing tokens |
| Hug contents | Intrinsic size: no width set, or `fit-content` | No width set |
| Fill container | `flex: 1`, or stretch in the parent | `flex: 1` or `alignSelf: 'stretch'` |
| Fixed width or height | `max-width` or a size token, only when the fixed size is intended | `maxWidth` or `aspectRatio` |
| Absolutely positioned layer | Normal flow, a positioned overlay only when the design truly overlays | Flex flow, `position: 'absolute'` only for overlays |
| Hidden layer or boolean property | Conditional rendering or a prop | Conditional rendering or a prop |
| Instance swap | Children, a slot, or content projection (`ng-content`) | Children or a render prop |
| State variant: hover, pressed, focus, disabled | `:hover`, `:active`, `:focus-visible`, `:disabled`, ARIA state attributes | `Pressable` pressed state, `accessibilityState` |
| Size variant | One `size` prop mapped to tokens | One `size` prop mapped to tokens |
| Figma variable or style | The token the app's installed package exports | The token constant the app exports |
| Layer name | A hint for the element choice, never a class name | A hint for the component choice |
| Frame pixel value | A token, or `rem` for type | A token, or the app's scale helper |
| Effect: drop shadow, blur | A shadow token | The app's shadow token object |
| Icon instance | The app's icon component, or inline SVG with `currentColor` | The app's icon component |

A row with no token to map to is a finding to report, not a reason to paste the Figma value.

---

## 4. WORKFLOW

1. Read the design context with a read-only Figma transport from the Section 5 tool ladder.
2. Name the component's job, its content and every state, including empty, loading, error and disabled.
3. Look for an existing component and existing tokens in the app before writing anything new.
4. When the frame leaves a value open, or a value is off every token and scale, load [`sk-design-fundamentals`](../../../sk-design/sk-design-fundamentals/SKILL.md) and decide the value there, not here. A frame that maps cleanly to tokens needs no design step.
5. Write the simplest semantic structure that does the job, ignoring the layer tree.
6. Map every value to a token. Report any value that has no token. The value table in this step is Pass 4's variable-to-token table.
7. Check the result with the five-pass check in Section 5.

---

## 5. THE CHECK

### Read-Only Inputs

Gather these inputs before comparing the frame with the rendered build:

- The Figma file key and node id.
- The authored frame width W, read from the frame and never set. Resizing the frame changes the design and is a write.
- The variants and state nodes.
- The Figma variables and `node bindings` used by the frame.
- The installed token package and its version.
- The rendered build.

### Five Passes

| Pass | Evidence source | Pass condition | Fail condition |
|---|---|---|---|
| 1. Same-width comparison | Web: render at the frame's authored width W at device scale 1 beside the frame image. Compare presence, order, wrapping, alignment and overflow. Native: human comparison on a device or simulator at W points. | Every frame element is present in order, there is no overflow at W, and no fixed width was copied. | An element is missing or extra, wrapping differs, overflow occurs, or a mismatch changes meaning. Pixel difference alone never fails. |
| 2. State by state | Every variant plus the empty, loading, error and disabled states named at workflow step 2. Dark mode only where the mode supports it. Motion is not in design unless the frame specifies it. | Each state has a capture and a verdict, and one component with props covers them. A state absent from the design is recorded as not in design. | A state is unrendered, there is one component per variant, or a state contradicts its frame. |
| 3a. Render token check | Web: resolved styles from bdg cdp Runtime.evaluate and getComputedStyle. Native: resolved style props in component tests or the app's token constants. Use the Pass 4 table to map Figma variables to tokens. | Every resolved color, spacing, radius, depth, type and breakpoint value matches an installed token value, or a package lag is reported. | A resolved value is in no installed token. Resolved styles turn var() into their final value, so this pass cannot distinguish a token from a literal of the same value. Pass 3b checks source usage. |
| 3b. Source token check | Search changed source files for literal colors, sizes and font values where a token exists. Run the repository's own token checker if it has one. | No literal appears where a token exists, and the repository checker passes when one is available. | A literal appears where a token exists, or the repository checker fails. |
| 4. Variable to token | Read each used Figma variable and node binding, then compare with the installed token package and version. Record one row per variable: Figma variable \| Figma value \| installed token \| installed value \| verdict. | Every variable maps to an installed token, or a package lag is reported. An open value goes to sk-design-fundamentals per workflow step 4. | A Figma variable name or value appears in code, or a missing variable is treated as resolved. |
| 5. Range and access | Web: widths below and above W across phone, tablet and desktop widths, 200 percent zoom, keyboard-only use, screen reader, and contrast for text and controls against their backgrounds. Native: the mode's width checks, largest system font scale, VoiceOver or TalkBack, and contrast. | Each check has a verdict, and none fails. | An element clips or overlaps, a keyboard trap or unreachable control appears, a name, role or state is missing, or contrast is below the target set by sk-design-fundamentals. When no project target exists, use WCAG 2.2 AA: 4.5:1 for normal text and 3:1 for large text under [success criterion 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum), plus 3:1 for user-interface components and graphical objects under [success criterion 1.4.11](https://www.w3.org/TR/WCAG22/#non-text-contrast). |

### Verdict and Report

The overall result is `PASS` only when every pass passes. Record a pass that cannot run as `NOT RUN` with its reason, and the overall verdict is then `INCOMPLETE`, never `PASS`.

The report names:

- The frame, node id and W.
- The installed token package and version, and the tool used for each pass.
- Capture paths, the state matrix, the rendered value table and the variable-to-token table.
- The lag list and overall verdict.

### Figma-Side Tool Ladder

Use these read-only transports in order:

1. The official Figma MCP when it is connected natively in the runtime. This route belongs to the frontend reference. The tools exposed by this runtime are `get_design_context`, `get_screenshot`, `get_metadata` and `get_variable_defs`. Their return shapes belong to the runtime, not this reference. The connected server's own instructions require `create_session` with the file key before any file tool, including read-only tools. They also require loading its `figma-design-to-code` skill before calling `get_design_context`.
2. The Framelink figma manual through Code Mode, only after discovery confirms it is registered. It returns design data and can download referenced images. It does not return variable bindings, so Pass 4 cannot run from Framelink alone.
3. `figma-ds-cli`, which requires Figma Desktop and its daemon. For the Pass 1 frame image, the documented form is `figma-ds-cli export node <nodeId> -o ./out/frame.png -s 1`. Its read-only Pass 4 commands include `node bindings` and `var list`. Its read-only Pass 5 commands include `a11y contrast`, `a11y touch`, `a11y text`, `a11y focus` and `a11y audit`. Confirm exact group flags with the documented help before relying on them.
4. A static export already in the packet, marked as possibly stale.

The official Figma MCP is a native runtime connection. The `mcp-figma` skill documents its own CLI and the separate Framelink Code Mode manual. It does not route or wrap the official MCP.

### Passes by Figma Transport

| Transport | Pass 1 | Pass 2 | Pass 3a | Pass 3b | Pass 4 | Pass 5 |
|---|---|---|---|---|---|---|
| Official Figma MCP (runtime) | `get_screenshot` provides a frame image | `get_design_context` and `get_metadata` identify design context; state capture coverage is `UNKNOWN` | App render check | Changed source check | `get_variable_defs` | `UNKNOWN`: the named runtime tools document no Figma-side accessibility check |
| Framelink figma through Code Mode | `UNKNOWN`: referenced image downloads are documented, full-frame screenshot export is not | `UNKNOWN`: variant coverage is not specified | App render check | Changed source check | Not supported alone: Framelink returns no variable bindings | `UNKNOWN` |
| `figma-ds-cli` | export node supports a frame image | `UNKNOWN` | App render check | Changed source check | `node bindings` and `var list` | Partial: documented read-only a11y commands support contrast, touch, text, focus and audit checks |
| Static packet export | Frame image can be compared, but may be stale | `UNKNOWN` | App render check | Changed source check | `UNKNOWN` | `UNKNOWN` |

Passes 3a and 3b are checked against the rendered application and changed source, not supplied by a Figma transport. `UNKNOWN` means the referenced documentation does not establish support.

`spec --check` measures a built node inside Figma. It does not compare the application render with the frame.

Capture mechanics: see [Figma Check on the Web](web-markup-and-css.md#figma-check-on-the-web) and [Figma Check on Native](react-native-layout-and-a11y.md#figma-check-on-native).

---

## 6. RED FLAGS

Stop and restructure when the code shows any of these:

- Most children are absolutely positioned.
- A literal frame width such as `375px` or `width: 375`.
- A fixed height on a container that holds text.
- Wrapper depth that mirrors the Figma layer panel.
- Pixel or hex literals pasted from the inspect panel.
- One component per Figma variant instead of one component with props.
- Class names copied from layer names, such as `.frame-427` or `.auto-layout-wrapper`.
