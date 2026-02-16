# Tab Main - Webflow Implementation Guide

An attribute-based tab component for Webflow that links tab buttons to content panels using matching data attribute values.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📌 WEBFLOW SETUP (DETAILED)](#3--webflow-setup-detailed)
- [4. ⚙ ️ CONFIGURATION](#4--configuration)
- [5. 📌 STYLING](#5--styling)
- [6. 📌 KEYBOARD NAVIGATION](#6--keyboard-navigation)
- [7. 🛠 ️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📌 API REFERENCE](#8--api-reference)
- [9. 📌 SOURCE FILES](#9--source-files)
- [10. 📌 RELATED COMPONENTS](#10--related-components)
- [11. 📌 COMPLETE EXAMPLE](#11--complete-example)
- [12. 📌 VERSION HISTORY](#12--version-history)

---

<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW

### What It Does

Creates a tab interface where clicking a tab button reveals the corresponding content panel. Tab buttons and content panels are linked by matching `data-tab` values.

### Key Features

- Attribute-based linking (no ID dependencies)
- Animated state transitions with Motion.dev
- Multiple styling options (data attributes, CSS classes, ARIA)
- Keyboard navigation (Arrow keys, Home, End)
- 3 built-in style variants (underline, pill, boxed)
- WCAG 2.1 AA accessible

### How Linking Works

```
Tab Button                    Content Panel
─────────────────────────────────────────────────
data-tab="cookies"    ←→     data-tab-content="cookies"
data-tab="privacy"    ←→     data-tab-content="privacy"
data-tab="webshop"    ←→     data-tab-content="webshop"
```
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. 🚀 QUICK START

### Step 1: Create Tab Buttons

```html
<div data-tab-list>
  <button data-tab="algemeen" data-tab-default>Algemene Voorwaarden</button>
  <button data-tab="cookies">Cookies</button>
  <button data-tab="privacy">Privacy</button>
  <button data-tab="webshop">Webshop</button>
</div>
```

### Step 2: Create Content Panels

```html
<div data-tab-content="algemeen">
  Content for Algemene Voorwaarden...
</div>
<div data-tab-content="cookies">
  Content for Cookies...
</div>
<div data-tab-content="privacy">
  Content for Privacy...
</div>
<div data-tab-content="webshop">
  Content for Webshop...
</div>
```

### Step 3: Add Custom Code

Add JavaScript to **Project Settings > Custom Code > Footer Code**
Add CSS to **Project Settings > Custom Code > Head Code**
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:webflow-setup-detailed -->
## 3. 📌 WEBFLOW SETUP (DETAILED)

### 3.1 Element Structure

**Recommended Webflow Structure:**

```
Div Block (data-tab-container)
│
├── Div Block (data-tab-list)
│   ├── Link Block or Button
│   │   └── data-tab="algemeen"
│   │   └── data-tab-default
│   │   └── Text: "Algemene Voorwaarden"
│   │
│   ├── Link Block or Button
│   │   └── data-tab="cookies"
│   │   └── Text: "Cookies"
│   │
│   ├── Link Block or Button
│   │   └── data-tab="privacy"
│   │   └── Text: "Privacy"
│   │
│   └── Link Block or Button
│       └── data-tab="webshop"
│       └── Text: "Webshop"
│
├── Div Block
│   └── data-tab-content="algemeen"
│   └── Your content here...
│
├── Div Block
│   └── data-tab-content="cookies"
│   └── Your content here...
│
├── Div Block
│   └── data-tab-content="privacy"
│   └── Your content here...
│
└── Div Block
    └── data-tab-content="webshop"
    └── Your content here...
```

### 3.2 Adding Custom Attributes in Webflow

1. Select the element in Designer
2. Open **Element Settings** panel (gear icon)
3. Scroll to **Custom attributes** section
4. Click **+ Add attribute**
5. Enter name and value:

| Element | Attribute Name | Attribute Value |
|---------|---------------|-----------------|
| Wrapper | `data-tab-container` | (leave empty) |
| Tab buttons wrapper | `data-tab-list` | (leave empty) |
| Each tab button | `data-tab` | unique identifier (e.g., `cookies`) |
| Default tab button | `data-tab-default` | (leave empty) |
| Each content panel | `data-tab-content` | matching identifier |

### 3.3 Matching Values

**Critical:** The `data-tab` value on a button MUST exactly match the `data-tab-content` value on its content panel.

```
✅ Correct:
   Button: data-tab="privacy"
   Content: data-tab-content="privacy"

❌ Wrong:
   Button: data-tab="Privacy"      (capital P)
   Content: data-tab-content="privacy"
```

### 3.4 Setting the Default Tab

Add `data-tab-default` attribute (no value needed) to the tab that should be active on page load:

```
Button: data-tab="algemeen" data-tab-default
```

If no default is specified, the first tab becomes active.

### 3.5 Adding the Code

#### JavaScript (Required)

**Location:** Project Settings > Custom Code > Footer Code

```html
<script>
// Paste the entire contents of tab_main.js here
</script>
```

#### CSS (Required)

**Location:** Project Settings > Custom Code > Head Code

```html
<style>
/* Paste the entire contents of tab_main.css here */
</style>
```
<!-- /ANCHOR:webflow-setup-detailed -->

---

<!-- ANCHOR:configuration -->
## 4. ⚙ ️ CONFIGURATION

### Data Attributes Reference

| Attribute | Element | Required | Description |
|-----------|---------|----------|-------------|
| `data-tab-container` | Wrapper | No | Scopes tab system (recommended) |
| `data-tab-list` | Tab wrapper | No | Container for tab buttons |
| `data-tab="value"` | Button | Yes | Unique identifier for tab |
| `data-tab-content="value"` | Content div | Yes | Matches tab identifier |
| `data-tab-default` | Button | No | Sets default active tab |

### State Attributes (Applied Automatically)

| Attribute | Applied To | When |
|-----------|-----------|------|
| `data-tab-active="true"` | Tab button | Tab is active |
| `data-tab-visible="true"` | Content panel | Content is visible |
| `aria-selected="true"` | Tab button | Tab is active |

### CSS Classes (Applied Automatically)

| Class | Applied To | When |
|-------|-----------|------|
| `.is--set` | Tab button | Tab is active |
| `.is--active` | Content panel | Content is visible |
<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:styling -->
## 5. 📌 STYLING

### Style Variants

The CSS includes 3 built-in style variants:

#### Default (Underline)

No additional attributes needed. Tabs have bottom border indicator.

#### Pill Style

Add `data-tab-style="pill"` to the `data-tab-list` element:

```html
<div data-tab-list data-tab-style="pill">
```

#### Boxed Style

Add `data-tab-style="boxed"` to the `data-tab-list` element:

```html
<div data-tab-list data-tab-style="boxed">
```

### Custom Styling Examples

**Style active tab via data attribute:**

```css
[data-tab][data-tab-active="true"] {
  color: #0066cc;
  font-weight: 600;
  border-bottom-color: #0066cc;
}
```

**Style active tab via class:**

```css
[data-tab].is--set {
  color: #0066cc;
  font-weight: 600;
}
```

**Style visible content:**

```css
[data-tab-content][data-tab-visible="true"] {
  animation: fadeIn 0.3s ease;
}
```

### Using Project Color Variables

The default CSS uses these CSS variables:

```css
--_color-tokens---content-brand--base    /* Active text color */
--_color-tokens---border-brand--base     /* Active border color */
--_color-tokens---content-neutral--black /* Inactive text color */
--_color-tokens---border-neutral--light  /* Tab list border */
```

Replace with your Webflow variables or hard-coded colors as needed.
<!-- /ANCHOR:styling -->

---

<!-- ANCHOR:keyboard-navigation -->
## 6. 📌 KEYBOARD NAVIGATION

The component supports full keyboard navigation:

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from tab list |
| `Arrow Right` / `Arrow Down` | Activate next tab |
| `Arrow Left` / `Arrow Up` | Activate previous tab |
| `Home` | Activate first tab |
| `End` | Activate last tab |
<!-- /ANCHOR:keyboard-navigation -->

---

<!-- ANCHOR:troubleshooting -->
## 7. 🛠 ️ TROUBLESHOOTING

### Content Not Showing

**Check these common issues:**

1. **Mismatched values**
   - `data-tab` value must EXACTLY match `data-tab-content` value
   - Values are case-sensitive

2. **Missing attributes**
   - Tab button needs `data-tab="value"`
   - Content panel needs `data-tab-content="value"`

3. **Script not loaded**
   - Open browser console (F12)
   - Look for: `[Tab Main] Initialized`

### Wrong Tab Active on Load

**Check default attribute:**

```html
<!-- Only ONE tab should have data-tab-default -->
<button data-tab="algemeen" data-tab-default>...</button>
<button data-tab="cookies">...</button>  <!-- No default here -->
```

### Animations Not Working

**Check Motion.dev:**

1. Ensure Motion.dev is loaded before tab_main.js
2. Console should NOT show: `Motion.dev not ready, retrying...`

### Styling Not Applied

**Check selector specificity:**

1. Add `!important` if Webflow styles override
2. Use more specific selector:
   ```css
   [data-tab-container] [data-tab][data-tab-active="true"] {
     /* styles */
   }
   ```

### Multiple Tab Systems on Same Page

**Use separate containers:**

```html
<div data-tab-container>
  <!-- First tab system -->
</div>

<div data-tab-container>
  <!-- Second tab system (independent) -->
</div>
```
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:api-reference -->
## 8. 📌 API REFERENCE

### Console Messages

| Message | Meaning |
|---------|---------|
| `[Tab Main] Initializing...` | Script starting |
| `[Tab Main] Initialized with X tabs and Y content panels` | Success |
| `[Tab Main] No tabs found in container` | Missing data-tab attributes |
| `[Tab Main] No content panels found` | Missing data-tab-content attributes |
| `[Tab Main] No matching tab or content for value: X` | Mismatched values |

### JavaScript API (Advanced)

The tab system exposes no public API. All interaction is via data attributes and DOM events.
<!-- /ANCHOR:api-reference -->

---

<!-- ANCHOR:source-files -->
## 9. 📌 SOURCE FILES

| File | Location | Purpose |
|------|----------|---------|
| `tab_main.js` | `src/2_javascript/menu/` | Main component |
| `tab_main.css` | `src/1_css/menu/` | Styling |
<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:related-components -->
## 10. 📌 RELATED COMPONENTS

- **tab_menu.js** - Class-based tab menu (visual only, no content switching)
- **toc_scrollspy.js** - Table of contents with scroll detection
<!-- /ANCHOR:related-components -->

---

<!-- ANCHOR:complete-example -->
## 11. 📌 COMPLETE EXAMPLE

```html
<!-- Tab Container -->
<div data-tab-container>

  <!-- Tab Buttons -->
  <div data-tab-list>
    <button data-tab="algemeen" data-tab-default>Algemene Voorwaarden</button>
    <button data-tab="cookies">Cookies</button>
    <button data-tab="privacy">Privacy</button>
    <button data-tab="webshop">Webshop</button>
  </div>

  <!-- Content Panels -->
  <div data-tab-content="algemeen">
    <h2>Algemene Voorwaarden</h2>
    <p>Content for general terms and conditions...</p>
  </div>

  <div data-tab-content="cookies">
    <h2>Cookie Policy</h2>
    <p>Content for cookie policy...</p>
  </div>

  <div data-tab-content="privacy">
    <h2>Privacy Policy</h2>
    <p>Content for privacy policy...</p>
  </div>

  <div data-tab-content="webshop">
    <h2>Webshop Terms</h2>
    <p>Content for webshop terms...</p>
  </div>

</div>

<!-- Scripts (in footer) -->
<script src="path/to/tab_main.js"></script>

<!-- Styles (in head) -->
<link rel="stylesheet" href="path/to/tab_main.css">
```
<!-- /ANCHOR:complete-example -->

---

<!-- ANCHOR:version-history -->
## 12. 📌 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-13 | Initial release |
<!-- /ANCHOR:version-history -->
