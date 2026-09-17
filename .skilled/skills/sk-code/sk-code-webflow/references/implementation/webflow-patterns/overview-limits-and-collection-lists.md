---
title: Webflow Platform Patterns - Development Guide
description: Complete platform constraints and collection list patterns for Webflow development.
trigger_phrases:
  - "webflow platform patterns"
  - "webflow cms limits"
  - "collection list patterns"
  - "webflow api limits"
importance_tier: normal
contextType: implementation
version: 3.5.0.14
---

# Webflow Platform Patterns - Development Guide

Complete platform constraints and collection list patterns for Webflow development.

---

## 1. OVERVIEW

### Purpose
Platform constraints and collection list patterns for Webflow development. These limits are enforced by Webflow and cannot be overridden - architecture must work within them from the start.

### Prerequisites
Follow code quality standards:
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Naming:** Use `snake_case` for functions/variables
- See [code-quality-standards.md](../../javascript/quality-standards/init-dom-error-and-async.md) for complete standards

### When to Use
- Working with Webflow CMS Collections
- Understanding platform limits (items per list, nesting)
- Configuring production settings

---

## 2. PLATFORM LIMITS QUICK REFERENCE

### CMS Limits (Next-Gen)

Webflow Next-Gen CMS dramatically increased limits, but they're still hard constraints:

| Limit Type | Value | Impact if Exceeded |
|------------|-------|-------------------|
| **Collections per site** | 40 | Designer prevents adding more |
| **Total items (all collections)** | 1,000,000 | Cannot add items, publishing fails |
| **Items per collection** | 1,000,000 | Cannot add more items to collection |
| **Collection lists per page** | 40 | Designer prevents adding more lists |
| **Items displayed per list** | 100 | **Truncates silently** - remaining items hidden |
| **Nested lists per page** | 10 | Designer prevents adding more |
| **Items in nested list** | 100 | Truncates if exceeded |
| **Nesting depth** | 3 levels | Deeper nesting not supported |

**Critical limit to note:** The 100 items per list display limit **silently truncates** - if collection has 150 items, only first 100 display. No error, no warning.

### Field Limits

| Field Type | Limit | Impact |
|------------|-------|--------|
| **Reference fields** | 10 | Cannot add more |
| **Multi-reference fields** | 10 | Cannot add more |
| **Rich text length** | 10,000 chars | Truncates if exceeded |
| **Plain text length** | 2,000 chars | Truncates if exceeded |

### API Limits

| Limit Type | Value | Error if Exceeded |
|------------|-------|------------------|
| **API calls per minute** | 60 | HTTP 429 (Rate Limited) |
| **API payload size** | 4MB | Request rejected |

### Production Configuration (Non-Negotiable)

Webflow enforces these settings in production - you cannot override them:

| Setting | Value | Development Impact |
|---------|-------|-------------------|
| **JavaScript loading** | Synchronous (`sync`) | Scripts load in order, blocking |
| **CSS scope** | Per-page (`per_page`) | No global CSS cascade between pages |
| **Minification** | Enabled (HTML/CSS/JS) | Function names mangled - never use `function.name` |
| **SSL** | Enforced | HTTPS required for all requests |

---

## 3. COLLECTION LIST PATTERNS

### Problem 1: ID Duplication

**Issue:** Webflow duplicates `id` attributes across collection items

**Example:** Collection list with 10 blog posts, each has `<button id="read-more">`. Result: 10 elements with same ID.

**Impact:** `getElementById()` returns only first match, breaking per-item logic

**Solution: Never target by ID inside collection lists**

```javascript
// ❌ WRONG: Returns only first item's button
const button = document.getElementById('read-more');
button.addEventListener('click', handleClick);

// ✅ CORRECT: Use classes with querySelectorAll
document.querySelectorAll('.read-more-button').forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// ✅ BETTER: Event delegation (recommended)
document.addEventListener('click', (e) => {
  if (e.target.matches('.read-more-button')) {
    handleClick(e);
  }
});
```

**Why event delegation is better:**
- Single event listener (less memory)
- Works for dynamically added items (pagination, filters)
- Simpler code, easier to maintain

#### Debugging ID Duplication with CLI Tools

**Use CLI tools to detect duplicate IDs before deployment:**

**Option 1: Quick ID Duplication Check**
```bash
#!/bin/bash
# Detect duplicate IDs in collection lists

URL="https://example.com"

echo "🔍 Checking for duplicate IDs..."

# Start browser session
bdg "$URL" 2>&1

# Query all elements with IDs
IDS=$(bdg js "Array.from(document.querySelectorAll('[id]')).map(el => el.id).join('\\n')" 2>&1)

# Stop session
bdg stop 2>&1

# Find duplicates
echo "$IDS" | sort | uniq -d | while read -r duplicate_id; do
  if [ -n "$duplicate_id" ]; then
    COUNT=$(echo "$IDS" | grep -c "^$duplicate_id$")
    echo "❌ DUPLICATE ID: '$duplicate_id' appears $COUNT times"
  fi
done

echo "✅ ID duplication check complete"
```

**Option 2: Collection List DOM Inspection**
```bash
#!/bin/bash
# Inspect collection list structure and IDs

URL="https://example.com"

echo "🔍 Inspecting collection list structure..."

# Start browser session
bdg "$URL" 2>&1

# Query collection items and their IDs
bdg js "
(() => {
  const items = document.querySelectorAll('.w-dyn-item');
  const results = {
    totalItems: items.length,
    duplicateIds: {},
    report: []
  };

  items.forEach((item, index) => {
    const idsInItem = Array.from(item.querySelectorAll('[id]')).map(el => el.id);

    idsInItem.forEach(id => {
      if (!results.duplicateIds[id]) {
        results.duplicateIds[id] = 0;
      }
      results.duplicateIds[id]++;
    });

    results.report.push({
      itemIndex: index,
      idsInItem: idsInItem,
      hasConflicts: idsInItem.length > 0
    });
  });

  return results;
})()
" 2>&1 | jq '.'

# Stop session
bdg stop 2>&1

echo "✅ Collection list inspection complete"
```

**Option 3: Automated Pre-Deployment Validation**
```bash
#!/bin/bash
# Pre-deployment validation: Assert no duplicate IDs

URL="https://example.com"
FAIL=0

echo "🔍 Running pre-deployment ID validation..."

# Start browser session
bdg "$URL" 2>&1

# Check for duplicate IDs
DUPLICATES=$(bdg js "
(() => {
  const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
  const counts = {};
  ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
  return Object.entries(counts).filter(([id, count]) => count > 1);
})()
" 2>&1)

# Stop session
bdg stop 2>&1

# Parse results
DUPLICATE_COUNT=$(echo "$DUPLICATES" | jq 'length')

if [ "$DUPLICATE_COUNT" -gt 0 ]; then
  echo "❌ FAIL: Found $DUPLICATE_COUNT duplicate IDs:"
  echo "$DUPLICATES" | jq -r '.[] | "  - \(.[0]): \(.[1]) occurrences"'
  FAIL=1
else
  echo "✅ PASS: No duplicate IDs found"
fi

exit $FAIL
```

**See also:** `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` for complete CLI debugging patterns

---

### Problem 2: Async Rendering Delays

**Issue:** Collection items render asynchronously after DOM ready event fires

**Example:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.w-dyn-item');
  console.log(items.length);  // Often returns 0!
});
```

**Impact:** `querySelectorAll('.w-dyn-item')` returns empty array on immediate query

**Solution: Use delay, retry, or observer pattern**

#### Option 1: Fixed Delay (Simple)

**When to use:** Simple components, fast connections, known load times

```javascript
const INIT_DELAY_MS = 500;

setTimeout(() => {
  const items = document.querySelectorAll('.w-dyn-item');
  if (items.length) {
    init_collection_items(items);
  }
}, INIT_DELAY_MS);
```

**Pros:** Simple, works most of the time
**Cons:** Breaks on slow connections, wastes time on fast connections

#### Option 2: Retry Pattern (Robust)

**When to use:** Production code, variable network speeds, critical functionality

```javascript
// WEBFLOW: Collection items render asynchronously after DOM ready
(function retry_init(attempts = 10) {
  const items = document.querySelectorAll('.w-dyn-item');

  if (items.length) {
    return init_collection_items(items);
  }

  if (attempts > 0) {
    setTimeout(() => retry_init(attempts - 1), 200);
  } else {
    console.error('Collection items failed to render after 2 seconds');
  }
})();
```

**Pros:** Works on all connection speeds, logs failure
**Cons:** Slightly more complex than fixed delay

#### Option 3: MutationObserver (Reactive)

**When to use:** Complex pages, progressive enhancement, dynamic content

```javascript
const observer = new MutationObserver(() => {
  const items = document.querySelectorAll('.w-dyn-item');

  if (items.length) {
    init_collection_items(items);
    observer.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Timeout fallback if items never render
setTimeout(() => {
  observer.disconnect();
  console.error('Collection items failed to render after 5 seconds');
}, 5000);
```

**Pros:** Reactive, no polling delays, works with progressive enhancement
**Cons:** More complex, requires cleanup

**Recommended approach:** Use retry pattern for most cases, MutationObserver for progressive enhancement.

---

### Problem 3: Event Delegation for Dynamic Items

**Issue:** Direct event binding doesn't work for dynamically added items (pagination, filters)

**Example of problem:**
```javascript
document.querySelectorAll('.w-dyn-item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// Items added later (pagination, filters) won't have listeners!
```

**Solution: Delegate events to document or parent container**

```javascript
function setup_collection_events() {
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.w-dyn-item');
    if (!item) return;
    if (e.target.matches('.expand-button')) {
      toggle_item_expansion(item);
    }

    if (e.target.matches('.delete-button')) {
      delete_collection_item(item);
    }

    if (e.target.matches('.favorite-button')) {
      toggle_favorite(item);
    }
  });
}

// Helper functions
function toggle_item_expansion(item) {
  const details = item.querySelector('.item-details');
  details.classList.toggle('is-expanded');
}

function delete_collection_item(item) {
  if (confirm('Delete this item?')) {
    item.remove();
  }
}

function toggle_favorite(item) {
  const button = item.querySelector('.favorite-button');
  button.classList.toggle('is-favorited');
}
```

**Benefits of event delegation:**
- ✅ Works for items added after page load
- ✅ Single event listener (less memory usage)
- ✅ Simpler code (no need to rebind after DOM changes)
- ✅ Better performance (1 listener vs 100 listeners)

---

### Problem 4: Progressive Enhancement

**Issue:** Items may be added after initial page load (pagination, filters, infinite scroll)

**Solution: Initialize existing items, then observe for additions**

```javascript
function progressive_init() {
  function init_existing_items() {
    const items = document.querySelectorAll('.w-dyn-item:not([data-initialized])');

    items.forEach(item => {
      item.dataset.initialized = 'true';

      item.dataset.itemIndex = item.parentNode.children.indexOf(item);

      setup_item_behavior(item);
    });

    console.log(`Initialized ${items.length} new collection items`);
  }

  init_existing_items();

  const list = document.querySelector('.w-dyn-list');
  if (list) {
    const observer = new MutationObserver(init_existing_items);
    observer.observe(list, {
      childList: true
    });
  }
}

function setup_item_behavior(item) {
  const title = item.querySelector('[data-field="title"]')?.textContent;
  const itemId = item.querySelector('[data-field="id"]')?.textContent;

  item.dataset.itemTitle = title;
  item.dataset.itemId = itemId;

  console.log(`Setup item: ${title} (ID: ${itemId})`);
}
```

**When to use this pattern:**
- Pagination (load more buttons)
- Infinite scroll
- Filter/search that adds/removes items
- Dynamic content loading

---

### Problem 5: Data Attributes as Stable Handles

**Issue:** Need stable identifiers for per-item behavior without relying on IDs

**Solution: Attach data attributes during initialization**

```javascript
function init_collection_items() {
  document.querySelectorAll('.w-dyn-item').forEach((item, index) => {
    item.dataset.itemIndex = String(index);

    const itemId = item.querySelector('[data-cms-id]')?.textContent;
    const itemSlug = item.querySelector('[data-cms-slug]')?.textContent;
    const itemCategory = item.querySelector('[data-cms-category]')?.textContent;

    item.dataset.itemId = itemId || '';
    item.dataset.itemSlug = itemSlug || '';
    item.dataset.itemCategory = itemCategory || '';

    item.addEventListener('click', (e) => {
      console.log('Clicked item:', {
        index: item.dataset.itemIndex,
        id: item.dataset.itemId,
        slug: item.dataset.itemSlug,
        category: item.dataset.itemCategory
      });
    });
  });
}
```

**Benefits:**
- ✅ Stable identifiers (not relying on duplicated IDs)
- ✅ Easy data access (`item.dataset.itemId`)
- ✅ Works with event delegation
- ✅ Survives DOM manipulations

---
