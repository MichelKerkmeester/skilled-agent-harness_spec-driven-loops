---
title: "RD-003: Plain Frontend Requests Reach the Frontend Surface"
description: "Verify that everyday frontend requests written without a file path or specialist jargon compile to a route whose targets include the sk-code-frontend surface."
version: 1.0.0.0
---

# RD-003: Plain Frontend Requests Reach the Frontend Surface

## 1. OVERVIEW

This scenario verifies that a frontend request written in everyday words reaches the frontend surface. The prompt set carries no file path, no marker extension and no specialist phrasing. Each prompt is an ordinary piece of frontend work, and each one must compile to a route whose targets include `sk-code-frontend`.

The risk this scenario guards against: the frontend vocabulary once held only specialist phrases. An ordinary request such as a request to fix a layout returned defer instead of a route, so the frontend references never loaded and the caller saw no guidance at all. The failure is silent in a way, because the router reports a clean defer and nothing errors.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A developer asks for an ordinary frontend fix in plain words, with no file named and no framework jargon beyond the everyday term.

**Exact prompt**:
```
fix the responsive grid layout on the pricing page
```

Prompt: `fix the responsive grid layout on the pricing page`

**The prompt set**: The scenario replays thirteen prompts, one per line. Each one is a request a developer would type without thinking about routing. Together they cover layout, components, performance, theming, contrast, forms, animation, design handoff, i18n and responsive tables.

```text
fix the responsive grid layout on the pricing page
make the navbar sticky with css
build a modal with a focus trap in React
improve LCP on the landing page
add a dark mode toggle to the site
the button text has poor contrast
style the form inputs and error messages
write a css animation for the loading spinner
implement the checkout page from the figma file
center a div vertically
add i18n support with rtl languages
optimize images and lazy loading on the homepage
make the table scroll horizontally on mobile
```

**Why each prompt is a frontend request**: Every prompt names work on a rendered interface. The words `grid`, `navbar`, `modal`, `LCP`, `dark mode`, `contrast`, `form`, `animation`, `figma`, `div`, `i18n`, `lazy loading` and `table` are the vocabulary an ordinary developer uses for that work. None of them is the name of a workflow mode, and none of them is a file path.

**Expected compiled route**: Every prompt returns `action` set to `route` and a target whose `workflowMode` is `sk-code-frontend`. The route may be a surface-only result or a surface bundle, and in both cases `sk-code-frontend` is present in `targets`.

**Expected behavior on a defer**: A defer here is a full failure of the scenario, because it means the hub decided the request carried no code intent at all. The defer payload offers a disambiguation checklist and the frontend references stay unloaded.

---

## 3. TEST EXECUTION

### Preconditions

1. `node` is callable from the repository root.
2. `node .skilled/bin/compiled-route-guard.cjs --json` reports the sk-code hub as fresh, so the compiled router matches its source registries.

### Exact Command Sequence

1. **Write the prompt set**, one prompt per line:
   ```
   /tmp/skc-RD003-prompts.txt
   ```
   The file holds the thirteen prompts listed in section 2, in that order, each on its own line.
2. **Replay every prompt through the compiled router**:
   ```
   while IFS= read -r p; do node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "$p"; done < /tmp/skc-RD003-prompts.txt > /tmp/skc-RD003-routes.txt
   ```
3. **Count the routes that carry the frontend surface**:
   ```
   grep -c '"workflowMode":"sk-code-frontend"' /tmp/skc-RD003-routes.txt
   ```

### Expected Signals

Expected signals: the routes file holds thirteen lines, one JSON route per prompt, and every line carries `"action":"route"` with a target whose `workflowMode` is `sk-code-frontend`. The count command prints `13`.

### Pass/Fail Criteria

- **PASS** iff: the count of lines carrying `"workflowMode":"sk-code-frontend"` is 13.
- **FAIL** iff: any prompt returns `defer`, or returns a route without `sk-code-frontend` among its targets.

Evidence: `/tmp/skc-RD003-routes.txt` (thirteen compiled route lines, one per prompt in the set).

### Failure Triage

1. Read the routes file line by line and match the failing line back to its prompt by position in the prompt file. Name the prompt that failed before changing anything.
2. If the guard reports a stale manifest, the router is serving a stale compiled artifact rather than the current registries. Run the refresh command the guard prints, then replay the full set and recount.
3. Otherwise the vocabulary is the gap. Add a phrase of two or more words taken from the failing prompt to the matching frontend class in `hub-router.json`, choosing among `code-frontend-aliases`, `code-frontend-visual` and `code-frontend-review`. Add the same phrase to the matching row of `INTENT_SIGNALS` in both ROUTER.md files, so the compiled router and the documented router agree.
4. Never edit a prompt to make it pass, and never add a single-word keyword. A one-word trigger such as `grid` or `modal` collides with unrelated vocabulary and moves the false positive somewhere else instead of removing it.
5. Replay the whole set after any vocabulary change. A phrase added for one prompt must not pull another prompt away from its own mode.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md`: root directory page and scenario summary.
- `.skilled/skills/sk-code/hub-router.json`: the frontend vocabulary classes, `code-frontend-aliases`, `code-frontend-visual` and `code-frontend-review`, that decide whether a plain frontend prompt scores.
- `.skilled/skills/sk-code/mode-registry.json`: the `FRONTEND` detection block, whose marker lists are empty of content markers and therefore cannot carry an everyday prompt on their own.
- `.skilled/bin/compiled-route.cjs`: the compiled router entry point replayed once per prompt.

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that states how the hub bundles a surface packet beside a workflow mode.

---

## 5. SOURCE METADATA

- Group: Routing Disambiguation
- Playbook ID: RD-003
- **Created**: 2026-11-14
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
