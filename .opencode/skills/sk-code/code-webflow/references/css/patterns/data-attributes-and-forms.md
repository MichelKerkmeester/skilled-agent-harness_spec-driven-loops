---
title: Data Attribute Selectors & Form Validation State
description: Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems. — Data Attribute Selectors & Form Validation State.
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Data Attribute Selectors & Form Validation State

## 5. DATA ATTRIBUTE SELECTOR PATTERNS

### Attribute Presence Selector

```css
/* [SOURCE: hover_state_machine.css:9] */

/* Matches any element with data-state attribute */
[data-state] {
  --_state---on: 0;
  --_state---off: 1;
}
```

### Attribute Contains Word Selector (~=)

```css
/* [SOURCE: hover_state_machine.css:45] */

/* Matches when data-state contains "hover" as a word */
[data-state~="hover"]:hover { }
```

**Matches:**
- `data-state="hover"` - yes
- `data-state="hover focus"` - yes
- `data-state="hover-other"` - NO (word boundary)

### Attribute Equals Selector

```css
/* [SOURCE: input_select.css:10-11] */

/* Matches exact value */
[data-select="input"] {
  background-color: var(--_color-tokens---input-bg--enabled);
}
```

### Case-Insensitive Selector (i)

```css
/* [SOURCE: performance.css:15-18] */

/* Matches regardless of case */
[data-render-content="large" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 45rem;
}
```

**Matches:**
- `data-render-content="large"` - yes
- `data-render-content="LARGE"` - yes
- `data-render-content="Large"` - yes

### Descendant + Attribute Selector

```css
/* [SOURCE: link_card_image.css:5-6] */

/* Target descendants of state container by their role */
[data-state] [data-hover="divider"] {
  width: calc(100% * clamp(0, var(--_state---on, 0), 1));
}

[data-state] [data-hover="image"] {
  transform: scale(...);
}

[data-state] [data-hover="icon"] {
  opacity: calc(...);
}
```

**Pattern:** Container has `data-state`, children have `data-hover` to identify their animation role.

### Component State Selectors

```css
/* [SOURCE: input_upload.css:236-241] */

/* Target by component-specific state attribute */
.filepond--item[data-filepond-item-state="processing"] .filepond--item-panel {
  background-color: var(--filepond-bg-processing);
}

.filepond--item[data-filepond-item-state="processing-complete"] .filepond--item-panel {
  background-color: var(--filepond-bg-complete);
}

.filepond--item[data-filepond-item-state="processing-error"] .filepond--item-panel {
  background-color: var(--filepond-bg-error);
}
```

**Pattern:** Third-party components (FilePond) expose state via data attributes.

---

## 6. FORM VALIDATION STATE ARCHITECTURE

### Validation Class Pattern

Form validation uses CSS classes on the form field container:

| Class                 | State         | Visual Feedback                        |
| --------------------- | ------------- | -------------------------------------- |
| (none)                | Default       | Standard styling                       |
| `.validation-invalid` | Invalid/Error | Red border, red background, error text |
| `.validation-valid`   | Valid/Success | Success icon, optional green styling   |

### Container Structure

```html
<!-- Validation class goes on [data-form-field] container -->
<div data-form-field class="validation-invalid">
  <input class="input" data-form-input type="text" />
  <div id="input-success"><!-- checkmark icon --></div>
  <div data-error-container>Error message</div>
</div>
```

### Invalid State Styling

```css
/* [SOURCE: form_validation.css:55-60] */

/* Input border and background change to error colors */
[data-form-field].validation-invalid input.input[data-form-input]:not([type="checkbox"]):not([type="radio"]),
[data-form-field].validation-invalid textarea.input[data-form-input] {
  border: 1.5px solid;
  border-color: var(--_color-tokens---input-border--negative);
  background-color: var(--_color-tokens---input-bg--negative);
}
```

```css
/* [SOURCE: form_validation.css:69-80] */

/* Placeholder text changes to error color */
[data-form-field].validation-invalid input.input[data-form-input]::placeholder,
[data-form-field].validation-invalid textarea.input[data-form-input]::placeholder {
  color: var(--_color-tokens---input-content--negative) !important;
  opacity: 1 !important;
}
```

```css
/* [SOURCE: form_validation.css:190-194] */

/* Helper text shows error color */
[data-form-field].validation-invalid [data-error-container],
[data-form-field].validation-invalid .input--helper-w {
  color: var(--_color-tokens---state--warning);
}
```

### Valid State Styling

```css
/* [SOURCE: form_validation.css:85-90] */

/* Success icon becomes visible */
[data-form-field].validation-valid input.input[data-form-input]:not([type="checkbox"]):not([type="radio"])~#input-success,
[data-form-field].validation-valid textarea.input[data-form-input]~#input-success,
[data-form-field].validation-valid #input-success {
  display: flex;
  opacity: 1;
}
```

```css
/* [SOURCE: form_validation.css:198-201] */

/* Helper text shows success color */
[data-form-field].validation-valid [data-error-container],
[data-form-field].validation-valid .input--helper-w {
  color: var(--_color-tokens---state--success);
}
```

### Autofill Override Pattern

Browser autofill adds its own styling that must be overridden to show validation states:

```css
/* [SOURCE: form_validation.css:10-22] */

/* Invalid autofill - force error colors */
[data-form-field].validation-invalid input:-webkit-autofill,
[data-form-field].validation-invalid input:-webkit-autofill:hover,
[data-form-field].validation-invalid input:-webkit-autofill:focus,
[data-form-field].validation-invalid input:-webkit-autofill:active {
  /* Box-shadow trick overrides autofill background */
  -webkit-box-shadow: 0 0 0px 1000px var(--_color-tokens---input-bg--negative) inset !important;
  box-shadow: 0 0 0px 1000px var(--_color-tokens---input-bg--negative) inset !important;
  border-color: var(--_color-tokens---input-border--negative) !important;
}
```

**Why the box-shadow trick:** Browsers ignore `background-color` on autofilled inputs. The large inset box-shadow visually covers the browser's autofill background.

### Select (Custom Dropdown) Validation

```css
/* [SOURCE: form_validation.css:99-106] */

/* Custom select components use same validation pattern */
[data-form-field].validation-invalid .input[data-select="input"],
[data-form-field].validation-invalid [data-select="input"],
.input--container.validation-invalid .input[data-select="input"],
[data-select="wrapper"].validation-invalid [data-select="input"] {
  border: 1.5px solid;
  border-color: var(--_color-tokens---input-border--negative);
  background-color: var(--_color-tokens---input-bg--negative);
}
```

### File Upload (FilePond) Validation

```css
/* [SOURCE: form_validation.css:153-160] */

/* FilePond component validation */
[data-form-field].validation-invalid .input--file-upload .filepond--panel-root,
[data-form-field].validation-invalid [data-file-upload="wrapper"] .filepond--panel-root {
  border-color: var(--_color-tokens---input-border--negative);
  border-style: solid;
  background-color: var(--_color-tokens---input-bg--negative);
}
```

### Checkbox/Radio Validation

```css
/* [SOURCE: form_validation.css:176-182] */

/* Checkbox/radio show outline on error */
[data-form-field].validation-invalid .input--checkbox,
[data-form-field].validation-invalid .input--radio {
  border-color: var(--_color-tokens---input-border--negative);
  background-color: var(--_color-tokens---input-bg--negative);
  outline: 4px solid var(--_color-tokens---state--focused);
  outline-offset: 0px;
}
```

---

