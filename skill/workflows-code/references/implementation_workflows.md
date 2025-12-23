# Implementation Workflows - Phase 1

Three specialized workflows for writing robust frontend code with proper timing, validation, and cache management.

**Prerequisites:** Follow code quality standards for all implementations:
- **Naming:** Use `snake_case` for functions/variables, semantic prefixes (`is_`, `has_`, `get_`, etc.)
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Animation:** CSS first, Motion.dev for complexity - see [animation_workflows.md](./animation_workflows.md)
- **Webflow:** Collection list patterns, async rendering - see [webflow_patterns.md](./webflow_patterns.md)
- See [code_quality_standards.md](./code_quality_standards.md) for complete standards

---

## 1. 📋 OVERVIEW

### Purpose
Specialized workflows for writing robust frontend code with proper timing, validation, and cache management.

### When to Use
- Handling async operations and race conditions
- Validating data and inputs
- Managing CDN assets and caching

---

## 2. ⏱️ CONDITION-BASED WAITING

**When to use**: DOM elements not ready, async libraries loading, race conditions, timing issues

### Core Principle

Wait for the actual condition you care about, not a guess about how long it takes.

```javascript
// ❌ BEFORE: Guessing at timing
setTimeout(() => {
  const video = document.querySelector('[video-hero]');
  initializeVideo(video); // Might be null!
}, 100); // Why 100ms? Will it be enough on slow devices?

// ✅ AFTER: Waiting for condition
wait_for_element('[video-hero]').then(video => {
  init_video(video); // Guaranteed to exist
});
```

### Common Patterns

| Scenario | Arbitrary Delay | Condition-Based | Why Better |
|----------|----------------|-----------------|------------|
| **Wait for DOM element** | `setTimeout(() => querySelector(), 50)` | `wait_for_element(selector)` | Works regardless of load speed |
| **Wait for external library** | `setTimeout(() => new Hls(), 200)` | `wait_for_library('Hls')` | CDN speed varies |
| **Wait for image load** | `setTimeout(() => useImage(), 1000)` | `img.onload` or `wait_for_image_load(img)` | Image size varies |
| **Wait for animation end** | `setTimeout(() => next(), 500)` | `element.addEventListener('transitionend')` | Animation duration might change |
| **Wait for video ready** | `setTimeout(() => video.play(), 2000)` | `video.addEventListener('canplay')` | Network speed varies |
| **Wait for font load** | `setTimeout(() => measure(), 100)` | `document.fonts.ready` | Font loading varies |

### Implementation Patterns

#### Pattern 1: Wait for DOM Element

```javascript
async function wait_for_element(selector, timeout = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;

    // Check every 50ms
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error(`Element ${selector} not found after ${timeout}ms`);
}

// Usage
wait_for_element('[page-loader]')
  .then(loader => {
    // Element guaranteed to exist
    init_page_loader(loader);
  })
  .catch(error => {
    console.error('Page loader element not found:', error);
  });
```

#### Pattern 2: Wait for External Library

```javascript
async function wait_for_library(global_name, timeout = 10000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (typeof window[global_name] !== 'undefined') {
      return window[global_name];
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error(`Library ${global_name} not loaded after ${timeout}ms`);
}

// Usage
wait_for_library('Hls')
  .then(Hls => {
    console.log('HLS.js loaded, initializing video...');
    init_video(Hls);
  })
  .catch(error => {
    console.error('HLS.js failed to load:', error);
    // Fallback to native video
    init_fallback_video();
  });
```

#### Pattern 3: Wait for Image Load

```javascript
function wait_for_image_load(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      // Image already loaded
      resolve(img);
    } else {
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', () => reject(new Error('Image failed to load')));
    }
  });
}

// Usage
const img = document.querySelector('[hero-image]');
wait_for_image_load(img)
  .then(loaded_img => {
    const width = loaded_img.offsetWidth; // Guaranteed to have dimensions
    calculate_layout(width);
  })
  .catch(error => {
    console.error('Image load failed:', error);
    use_default_layout();
  });
```

#### Pattern 4: Wait for Animation End

```javascript
function wait_for_transition_end(element, property = null) {
  return new Promise(resolve => {
    function handler(event) {
      // If property specified, only resolve for that property
      if (property && event.propertyName !== property) return;

      element.removeEventListener('transitionend', handler);
      resolve(event);
    }

    element.addEventListener('transitionend', handler);
  });
}

// Usage
element.classList.add('fade-out');
await wait_for_transition_end(element, 'opacity');
element.remove(); // Animation guaranteed complete
```

**See also:** [animation_workflows.md](./animation_workflows.md) - Complete animation implementation guide including CSS patterns, Motion.dev integration, and performance optimization.

#### Pattern 5: DOM Content Ready

```javascript
function dom_ready() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      // DOM already ready
      resolve();
    }
  });
}

// Usage
dom_ready().then(() => {
  console.log('DOM ready, initializing...');
  init_app();
});
```

### Rules

**ALWAYS:**
- Wait for actual conditions, not arbitrary timeouts
- Include timeout limits (default 5-10 seconds)
- Provide clear error messages when timeouts occur
- Use promises for async waiting
- Handle both success and error cases
- Log when waiting completes successfully
- Document WHY waiting is necessary

**NEVER:**
- Use `setTimeout` without documenting WHY
- Wait without timeout (infinite loops)
- Ignore timeout errors silently
- Poll faster than 10ms (wastes CPU)
- Assume elements exist without checking
- Chain multiple arbitrary timeouts

**See also:** [wait_patterns.js](../assets/wait_patterns.js) for production-ready code templates

---

## 3. 🛡️ DEFENSE-IN-DEPTH VALIDATION

**When to use**: Form handling, API calls, DOM manipulation, user input, third-party data integration

### Core Principle

Validate at EVERY layer data passes through. Make bugs structurally impossible.

### The Four Layers

#### Layer 1: Entry Point Validation

Reject obviously invalid input at function boundary.

```javascript
function init_video(video_element, config) {
  // Layer 1: Entry validation
  if (!video_element) {
    console.error('[Video] Element is required');
    return null;
  }

  if (!(video_element instanceof HTMLVideoElement)) {
    console.error('[Video] Must be HTMLVideoElement, got:', video_element);
    return null;
  }

  if (!config || typeof config !== 'object') {
    console.error('[Video] Config must be object, got:', config);
    return null;
  }

  // Proceed with initialization...
}
```

#### Layer 2: Processing Validation

Ensure data makes sense for this operation.

```javascript
function update_video_source(video_element, new_source) {
  // Layer 1: Entry validation
  if (!video_element || !new_source) {
    console.error('[Video] Missing required parameters');
    return false;
  }

  // Layer 2: Processing validation
  if (typeof new_source !== 'string' || new_source.trim() === '') {
    console.error('[Video] Source must be non-empty string');
    return false;
  }

  if (!new_source.match(/\.(mp4|webm|m3u8)$/i)) {
    console.error('[Video] Invalid video format:', new_source);
    return false;
  }

  // Safe to proceed
  video_element.src = new_source;
  return true;
}
```

#### Layer 3: Output Validation

Verify results before using them.

```javascript
async function fetch_user_data(user_id) {
  // Layer 1: Entry validation
  if (!user_id || typeof user_id !== 'string') {
    throw new Error('Valid user_id required');
  }

  try {
    const response = await fetch(`/api/users/${user_id}`);

    // Layer 2: Response validation
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Layer 3: Output validation
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data structure');
    }

    if (!data.name || !data.email) {
      throw new Error('Required fields missing from response');
    }

    // Sanitize output before returning
    return {
      id: String(data.id),
      name: String(data.name).trim(),
      email: String(data.email).toLowerCase().trim(),
      avatar: data.avatar || '/default-avatar.png'
    };

  } catch (error) {
    console.error('[API] User fetch failed:', error);
    // Return safe default
    return null;
  }
}
```

#### Layer 4: Safe Access Patterns

Prevent crashes when accessing nested data.

```javascript
// ❌ DANGEROUS: No validation
function display_user_avatar(user) {
  const avatar = user.profile.avatar.url; // Crashes if any property null
  document.querySelector('[avatar]').src = avatar;
}

// ✅ SAFE: Multiple layers of validation
function display_user_avatar(user) {
  // Layer 1: User object validation
  if (!user || typeof user !== 'object') {
    console.warn('[Avatar] Invalid user object');
    show_default_avatar();
    return;
  }

  // Layer 2: Profile validation
  if (!user.profile || typeof user.profile !== 'object') {
    console.warn('[Avatar] User has no profile');
    show_default_avatar();
    return;
  }

  // Layer 3: Avatar validation
  if (!user.profile.avatar || !user.profile.avatar.url) {
    console.warn('[Avatar] User has no avatar URL');
    show_default_avatar();
    return;
  }

  // Layer 4: DOM element validation
  const avatar_element = document.querySelector('[avatar]');
  if (!avatar_element) {
    console.error('[Avatar] Avatar element not found');
    return;
  }

  // Safe to proceed
  avatar_element.src = user.profile.avatar.url;
  console.log('[Avatar] Updated successfully');
}

// Modern JavaScript alternatives
const avatar_url = user?.profile?.avatar?.url || '/default-avatar.png';
const name = user.name ?? 'Anonymous';
```

### Complete Example: Contact Form with Multi-Layer Validation

See [validation_patterns.js](../assets/validation_patterns.js) for full implementation including:
- Field-level validation (email, phone, required fields)
- Real-time validation on blur
- Form submission with sanitization
- API error handling
- XSS prevention

### Rules

**ALWAYS:**
- Validate function parameters (null/undefined/type checks)
- Validate API responses before using data
- Validate DOM elements exist before manipulating
- Sanitize user input before storing or displaying
- Provide fallback values for missing data
- Use optional chaining (`?.`) for nested access
- Add `try/catch` around risky operations
- Log validation failures for debugging
- Return early when validation fails

**NEVER:**
- Assume data exists without checking
- Trust external data (APIs, user input, URL params)
- Access nested properties without validation
- Use innerHTML with unsanitized data
- Ignore validation failures silently
- Chain property access without null checks (`user.profile.avatar.url`)
- Skip type checking function parameters

**See also:** [validation_patterns.js](../assets/validation_patterns.js) for production-ready validation templates

---

## 4. 🔄 CDN VERSION MANAGEMENT

**When to use**: After JavaScript file changes, cache-busting needed, deployment workflow

### Core Principle

Update version query parameters (`?v=x.x.x`) in HTML files to force browsers to download fresh JavaScript instead of using cached versions.

### How It Works

The skill modifies HTML files to append or update version parameters to JavaScript URLs, ensuring users always receive the latest code.

**Process:**
1. Scans all HTML files in `/src/0_html/` directory
2. Finds R2 CDN script references (both `<script>` and `<link rel="preload">`)
3. Updates or adds version parameters to force cache refresh
4. Reports modified files and provides deployment instructions

### Implementation Workflow

#### Manual Version Update

**NOTE**: CDN versioning script previously existed in code-cdn-versioning skill but has been removed during restructuring. Use manual approach:

**Steps**:
1. Identify HTML files that reference modified JS files
2. Locate version parameters (e.g., `?v=1.0.1`)
3. Increment version appropriately:
   - Patch (bug fixes): 1.0.1 → 1.0.2
   - Minor (new features): 1.0.X → 1.1.0
   - Major (breaking changes): 1.X.X → 2.0.0
4. Update all references consistently

**Example**:
```html
<!-- Before -->
<script src="/path/to/file.js?v=1.0.1"></script>

<!-- After (patch increment) -->
<script src="/path/to/file.js?v=1.0.2"></script>
```

**Automation opportunity**: This version bumping process could be automated with a shell script

### Complete Deployment Workflow

1. **Make JavaScript changes**
   ```javascript
   // Example: Modified page_loader.js
   const TIMING = {
     HERO_OVERLAP_DELAY: 350,  // Changed from 400
   };
   ```

2. **Update version parameters manually**
   - Locate HTML files referencing the modified JS
   - Increment version parameter (e.g., `?v=1.0.1` → `?v=1.0.2`)
   - Update all references consistently

3. **Review changes**
   ```
   ✅ global.html
     Script: page_loader.js → page_loader.js?v=1.0.2
   ✅ home.html
     Script: hero_general.js → hero_general.js?v=1.0.2
   ```

4. **Deploy files**
   - Upload JS files to Cloudflare R2
   - Upload HTML files to Webflow
   - Clear CDN cache if needed
   - Publish Webflow site

### Rules

**ALWAYS:**
- Run after ANY JavaScript modification
- Update ALL HTML files, not just some
- Increment version number for each deployment
- Verify changes before uploading
- Clear CDN cache after deployment

**NEVER:**
- Use the same version number after making changes
- Skip HTML files (all must be updated together)
- Modify external CDN URLs (jsdelivr, unpkg)
- Edit version numbers manually in HTML files
- Deploy JS without updating HTML versions

**ESCALATE IF:**
- Script reports no HTML files found
- Current version cannot be determined
- File permissions prevent updates
- Webflow deployment fails

### Example Output

**Bug Fix in page_loader.js:**

```bash
# Manually update version parameters in HTML files
# Example: Change ?v=1.0.5 to ?v=1.0.6 for page_loader.js references
```

Output:
```
🔄 Auto-incrementing to version: v1.0.2
📁 Found 18 HTML files to process
✅ global.html
  Script: page_loader.js → page_loader.js?v=1.0.2
✅ Successfully updated to version v1.0.2!
```

---

## 5. 📋 QUICK REFERENCE

### Condition-Based Waiting Templates

```javascript
// Wait for element
await waitForElement('[selector]', 5000);

// Wait for library
await waitForLibrary('LibraryName', 10000);

// Wait for image
await waitForImageLoad(imgElement);

// Wait for transition
await waitForTransitionEnd(element, 'opacity');

// DOM ready
await domReady();
```

### Validation Patterns

```javascript
// Entry validation
if (!param || typeof param !== 'expected') {
  console.error('[Component] Invalid parameter');
  return null;
}

// Optional chaining (safe nested access)
const value = obj?.nested?.property ?? 'default';

// Sanitize text
function sanitizeText(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, maxLength);
}
```

### CDN Versioning Commands

```bash
# Manual version update required (script removed during skill consolidation)
# 1. Find HTML files referencing modified JS
# 2. Update version parameter: ?v=X.Y.Z → ?v=X.Y.(Z+1)
# 3. Use semantic versioning: patch for fixes, minor for features, major for breaking

# Example manual update:
# <script src="file.js?v=1.0.5"></script> → <script src="file.js?v=1.0.6"></script>
```

---

## 6. 🔗 RELATED RESOURCES

### Reference Files
- [debugging_workflows.md](./debugging_workflows.md) - Debug timing and validation issues with systematic approach
- [verification_workflows.md](./verification_workflows.md) - Verify implementations work correctly across browsers and viewports
- [shared_patterns.md](./shared_patterns.md) - Common DevTools and logging patterns for all workflows
- [animation_workflows.md](./animation_workflows.md) - Complete animation implementation guide including waitForTransitionEnd pattern
- [code_quality_standards.md](./code_quality_standards.md) - CDN-safe initialization pattern and naming conventions

### Templates
- [wait_patterns.js](../assets/wait_patterns.js) - Production-ready condition-based waiting templates with error handling
- [validation_patterns.js](../assets/validation_patterns.js) - Defense-in-depth validation templates for forms and APIs

### Standards
- **Browser APIs used**: `document.readyState`, `element.addEventListener('transitionend')`, `video.addEventListener('canplay')`, `document.fonts.ready`, `Promise.race()`, `Promise.all()`, optional chaining (`?.`), nullish coalescing (`??`)
- **Testing scenarios**: Network throttling (Slow 3G), CPU throttling (6x slowdown), cache disabled, different CDN speeds

---

**For complete code examples and templates:**
- [wait_patterns.js](../assets/wait_patterns.js) - Condition-based waiting examples
- [validation_patterns.js](../assets/validation_patterns.js) - Defense-in-depth templates