# Webflow Platform Patterns - Development Guide

Complete platform constraints and collection list patterns for Webflow development. These limits are enforced by Webflow and cannot be overridden - architecture must work within them from the start.

**Prerequisites:** Follow code quality standards:
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Naming:** Use `snake_case` for functions/variables
- See [code_quality_standards.md](./code_quality_standards.md) for complete standards

---

## 1. 📋 OVERVIEW

### Purpose
Complete platform constraints and collection list patterns for Webflow development.

### When to Use
- Working with Webflow CMS Collections
- Understanding platform limits (items per list, nesting)
- Configuring production settings

---

## 2. 🔒 PLATFORM LIMITS QUICK REFERENCE

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

## 3. 📚 COLLECTION LIST PATTERNS

### Problem 1: ID Duplication

**Issue:** Webflow duplicates `id` attributes across collection items

**Example:** Collection list with 10 blog posts, each has `<button id="read-more">`. Result: 10 elements with same ID.

**Impact:** `getElementById()` returns only first match, breaking per-item logic

**Solution: Never target by ID inside collection lists**

```javascript
// ❌ WRONG: Returns only first item's button
const button = document.getElementById('read-more');
button.addEventListener('click', handleClick);
// Only first item's button gets listener!

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

URL="https://anobel.com"

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

URL="https://anobel.com"

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

URL="https://anobel.com"
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

**See also:** `.opencode/skills/workflows-chrome-devtools/SKILL.md` for complete CLI debugging patterns

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
const INIT_DELAY_MS = 500;  // Wait 500ms for items to render

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
// Retry up to 10 times with 200ms intervals (2 second total)
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
// React to DOM changes
const observer = new MutationObserver(() => {
  const items = document.querySelectorAll('.w-dyn-item');

  if (items.length) {
    init_collection_items(items);
    observer.disconnect();  // Stop observing after initialization
  }
});

// Watch document body for child additions
observer.observe(document.body, {
  childList: true,   // Watch for added/removed nodes
  subtree: true      // Watch entire subtree
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
// This only binds to items present at time of execution
document.querySelectorAll('.w-dyn-item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// Items added later (pagination, filters) won't have listeners!
```

**Solution: Delegate events to document or parent container**

```javascript
function setup_collection_events() {
  // Delegate to document (works for all current and future items)
  document.addEventListener('click', (e) => {
    // Find closest collection item
    const item = e.target.closest('.w-dyn-item');
    if (!item) return;  // Click not in collection item

    // Handle specific button clicks
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
  // Initialize items that haven't been initialized yet
  function init_existing_items() {
    const items = document.querySelectorAll('.w-dyn-item:not([data-initialized])');

    items.forEach(item => {
      // Mark as initialized to prevent double-initialization
      item.dataset.initialized = 'true';

      // Add item index for identification
      item.dataset.itemIndex = item.parentNode.children.indexOf(item);

      // Setup item-specific behavior
      setup_item_behavior(item);
    });

    console.log(`Initialized ${items.length} new collection items`);
  }

  // Initialize items already on page
  init_existing_items();

  // Watch for new items being added
  const list = document.querySelector('.w-dyn-list');
  if (list) {
    const observer = new MutationObserver(init_existing_items);
    observer.observe(list, {
      childList: true    // Watch for added items
    });
  }
}

function setup_item_behavior(item) {
  // Extract item data from CMS fields
  const title = item.querySelector('[data-field="title"]')?.textContent;
  const itemId = item.querySelector('[data-field="id"]')?.textContent;

  // Store data for easy access
  item.dataset.itemTitle = title;
  item.dataset.itemId = itemId;

  // Item-specific logic here
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
    // Add stable index identifier
    item.dataset.itemIndex = String(index);

    // Extract CMS data into data attributes for easy access
    const itemId = item.querySelector('[data-cms-id]')?.textContent;
    const itemSlug = item.querySelector('[data-cms-slug]')?.textContent;
    const itemCategory = item.querySelector('[data-cms-category]')?.textContent;

    item.dataset.itemId = itemId || '';
    item.dataset.itemSlug = itemSlug || '';
    item.dataset.itemCategory = itemCategory || '';

    // Now can target specific items reliably
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

## 4. 🧩 DEVELOPMENT BEST PRACTICES

### Architectural Guidance

**Design around limits from the start - don't fight them later:**

1. **Collection lists** - Budget for 100 items max display per list
   - If collection has >100 items, implement pagination or filtering
   - Don't assume all items will display (Webflow truncates silently)

2. **Multiple lists** - Plan for up to 40 lists per page when composing complex layouts
   - Designer prevents adding more, so plan list usage carefully
   - Consider combining related content into single lists

3. **Event binding** - Prefer event delegation over per-item binding
   - 1 delegated listener vs 100 individual listeners
   - Works for dynamic content (pagination, filters)

4. **Nested lists** - Use conservatively (max 10 per page, 3 levels deep)
   - Performance degrades with nesting depth
   - Consider flatter data structures where possible

### Performance Considerations

**Optimize for Webflow constraints:**

| Concern | Recommendation | Rationale |
|---------|---------------|-----------|
| **Item count** | Design pagination for >100 items | Display limit is 100 per list |
| **Event listeners** | Use delegation (1 listener) | vs per-item (100 listeners) reduces memory |
| **Initialization** | Use retry pattern or observer | Items render asynchronously |
| **Nested lists** | Minimize depth and count | Performance degrades, 10 list limit |
| **CSS scope** | Inline critical styles | Per-page CSS, no global cascade |

### Quick Validation Script

**Check your page against Webflow limits:**

```javascript
(() => {
  const lists = document.querySelectorAll('.w-dyn-list');
  const nested = document.querySelectorAll('.w-dyn-list .w-dyn-list');
  const itemCounts = Array.from(lists).map(list =>
    list.querySelectorAll('.w-dyn-item').length
  );
  const maxItems = Math.max(0, ...itemCounts);
  const totalItems = itemCounts.reduce((sum, count) => sum + count, 0);

  const results = {
    'Collection Lists': `${lists.length}/40`,
    'Nested Lists': `${nested.length}/10`,
    'Max Items in a List': `${maxItems}/100`,
    'Total Items on Page': totalItems,
    'Status': maxItems <= 100 && lists.length <= 40 && nested.length <= 10
      ? '✅ Within limits'
      : '⚠️ Exceeds limits'
  };

  console.table(results);

  // Warn about lists approaching limit
  itemCounts.forEach((count, i) => {
    if (count > 80) {
      console.warn(`List ${i + 1} has ${count} items (approaching 100 limit)`);
    }
  });
})();
```

**When to run this:**
- During development (before publishing)
- After adding new collection lists
- When experiencing rendering issues
- Before launching to production

---

## 5. ⚙️ PRODUCTION CONFIGURATION CONSTRAINTS

### JavaScript Loading (Synchronous)

**Webflow enforces synchronous script loading:**

```javascript
// Scripts load in this order, blocking:
// 1. jQuery (Webflow dependency)
// 2. Webflow.js (site interactions)
// 3. Your custom code (page-specific)
```

**What this means:**
- Scripts load in order defined in Designer
- Each script blocks until previous completes
- Cannot override to async/defer
- Place heavy scripts strategically

**Optimization strategies:**
```javascript
// Move heavy initialization to after page load
window.addEventListener('load', () => {
  // Heavy operations here (after Webflow ready)
  init_heavy_features();
});

// Keep page-level code minimal
// Move shared code to global footer (loads once)
```

### CSS Scope (Per-Page)

**Webflow enforces per-page CSS scope:**

```css
/* page-1.css */
.button { color: red; }

/* page-2.css */
.button { color: blue; }
```

**What this means:**
- Each page has isolated CSS (no cascade between pages)
- Cannot rely on styles from other pages
- Shared styles must be in global CSS or duplicated

**Strategies for shared styles:**
```javascript
// Option 1: Embed shared styles in global footer
<style>
  /* Shared across all pages */
  .button-primary { ... }
  .modal-overlay { ... }
</style>

// Option 2: Use Webflow's global CSS feature (in Designer)

// Option 3: Duplicate critical styles per page (if minimal)
```

### Function Names Minified

**Webflow minifies all JavaScript in production:**

```javascript
// Your code:
function handle_form_submit() { ... }

// After minification:
function a() { ... }
```

**What this means:**
- Never use `function.name` for logic
- Function names mangled, unreliable
- Use explicit identifiers instead

**Wrong approach:**
```javascript
// ❌ Breaks in production (function.name minified)
function handle_submit() { }
const handlerName = handle_submit.name;  // "handle_submit" in dev, "a" in prod
```

**Correct approach:**
```javascript
// ✅ Use explicit identifiers
function handle_submit() { }
const handlerName = 'handle_submit';  // Reliable in all environments

// Or use object with explicit keys
const handlers = {
  submit: function() { },
  reset: function() { }
};
```

---

## 6. ✅ TESTING CHECKLIST

### Collection List Testing

Test across different item counts:

- [ ] **Empty state (0 items)** - Verify graceful degradation, empty message shows
- [ ] **Single item (1 item)** - Verify layout doesn't break, no JavaScript errors
- [ ] **Moderate count (20-50 items)** - Verify performance acceptable
- [ ] **Full list (100 items)** - Verify all items display correctly, no truncation message
- [ ] **Over limit (>100 items in CMS)** - Verify truncation behavior, first 100 show

### Multi-List Testing

Test multiple lists on a page:

- [ ] **1 list** - Baseline functionality works
- [ ] **10 lists** - Moderate complexity, check performance
- [ ] **40 lists** - At limit, verify Designer allows, check page performance
- [ ] **Nested lists** - Up to 3 levels deep with max 10 nested lists total

### Event Delegation Testing

Verify event delegation works correctly:

- [ ] **Initial items** - Events fire for items present on page load
- [ ] **Added items** - Events fire for items added dynamically (pagination, filters)
- [ ] **Multiple clicks** - Events don't double-fire (no listener duplication)
- [ ] **Removed items** - No errors when clicking removed items

### Network Conditions Testing

Test async rendering patterns:

- [ ] **Fast connection** - Items load quickly, no visible delay
- [ ] **Slow connection (throttled)** - Retry/observer patterns work, items eventually load
- [ ] **Offline → Online** - Verify recovery behavior when connection restored

### Responsive Testing

Test across all Webflow breakpoints:

- [ ] **Desktop (>992px)** - Full functionality
- [ ] **Tablet (768-991px)** - Layout adapts, features work
- [ ] **Mobile landscape (480-767px)** - Compact layout, touch-friendly
- [ ] **Mobile portrait (<480px)** - Minimal layout, core features work

---

## 7. 🔗 INTEGRATION WITH WORKFLOWS-CODE

### Phase 1: Implementation

When implementing Webflow features:
1. **Check platform limits** - Verify design fits within CMS constraints
2. **Use collection list patterns** - Event delegation, retry pattern for async rendering
3. **Plan for truncation** - 100 item display limit, implement pagination if needed
4. **Follow CDN-safe pattern** - Guard flags, delays, Webflow.push integration

### Phase 2: Debugging

When debugging Webflow-specific issues:
1. **ID duplication** - Switch to classes or data attributes
2. **Async rendering** - Add retry logic or MutationObserver
3. **Event delegation** - Verify delegation to document/parent, not per-item binding
4. **Platform limits** - Run validation script to check for exceeded limits

### Phase 3: Verification

When verifying Webflow implementations:
1. **Run validation script** - Check lists/items against limits
2. **Test item counts** - Empty, single, moderate, full (100), over-limit scenarios
3. **Network conditions** - Fast, slow, offline → online recovery
4. **Production configuration** - Verify synchronous loading, per-page CSS work as expected

---

**Core principle:** Webflow platform constraints are enforced and cannot be overridden. Design your architecture to work within them from the start. Attempting to bypass limits will result in broken functionality or failed publishes.

---

## 8. 🔗 RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](./implementation_workflows.md) - Condition-based waiting patterns complement async rendering solutions
- [code_quality_standards.md](./code_quality_standards.md) - CDN-safe initialization pattern for Webflow platform
- [performance_patterns.md](./performance_patterns.md) - Performance optimization for collection lists with many items

### Related Skills
- `workflows-chrome-devtools` - CLI debugging tools for ID duplication detection and collection list inspection
