// ───────────────────────────────────────────────────────────────
// CATEGORY: COMPONENT NAME
// ───────────────────────────────────────────────────────────────
//
// COPY-PASTE TEMPLATE for new Webflow JavaScript components.
//
// Conventions enforced (see `references/webflow/javascript/style_guide.md`):
//   - 3-line file header banner above (// ─ × 63), ALL CAPS title
//   - Section headers /* ─ × 60 / 64 ─ glued to */ */, numbered, ALL CAPS title
//   - snake_case identifiers, UPPER_SNAKE for constants, _underscore for private state
//   - 2-space indent, single quotes, semicolons, trailing commas
//   - Comments: ~1 per 5-10 lines; every function gets a 1-line WHY-comment above
//   - WEBFLOW: / MOTION: / LENIS: / HLS.JS: prefixes for platform constraints
//
// Replace ALL placeholder text marked [LIKE_THIS] before shipping.
// Delete this header-comment block once the component is named.

(() => {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION & FLAGS
  ────────────────────────────────────────────────────────────────*/

  // Central settings for selectors, timing, colors, and shared runtime state.
  const INIT_FLAG = '__[componentName]CdnInit';
  const CLEANUP_NAME = '__[componentName]Cleanup';

  // Selectors mirror Webflow data attributes so class names can change safely.
  const SELECTORS = {
    container: '[data-component="[name]"]',
    trigger: '[data-trigger]',
    target: '[data-target]',
  };

  // Safe to adjust: CSS owns layout; JS owns timing and state.
  const CONFIG = {
    init_delay_ms: 50,
    interaction_debounce_ms: 150,
  };

  // Module-level runtime state. Underscore prefix marks "owned by this component."
  var _instances = [];
  var _bound = false;
  var _interaction_timer = null;

  /* ─────────────────────────────────────────────────────────────
     2. UTILITIES
  ────────────────────────────────────────────────────────────────*/

  // Small helpers keep DOM access consistent and predictable.

  // Validate node is a DOM Element (not text/comment/document).
  function is_element(node) {
    return node && node.nodeType === 1;
  }

  // Read a data attribute with type-safe boolean coercion.
  function get_bool_attr(element, name) {
    return element && element.getAttribute(name) === 'true';
  }

  // Store listener references so cleanup can remove exactly what was added.
  function add_listener(target, type, handler, options) {
    if (!target) return null;
    target.addEventListener(type, handler, options || false);
    return { target: target, type: type, handler: handler, options: options || false };
  }

  // Ignore empty listener slots from optional elements.
  function remove_listener(listener) {
    if (!listener || !listener.target) return;
    listener.target.removeEventListener(listener.type, listener.handler, listener.options || false);
  }

  /* ─────────────────────────────────────────────────────────────
     3. CORE FUNCTIONS
  ────────────────────────────────────────────────────────────────*/

  // Component-specific behavior. Replace these with real implementations.

  // Cache element references once so interactions do not re-query the DOM.
  function scrape_elements(container) {
    return {
      container: container,
      trigger: container.querySelector(SELECTORS.trigger),
      target: container.querySelector(SELECTORS.target),
      listeners: [],
    };
  }

  // Apply the component's behavior to a single instance.
  function process_instance(instance) {
    if (!instance.container) return;

    // [REPLACE: actual behavior here]
    // Example: instance.target.classList.add('is-ready');
  }

  /* ─────────────────────────────────────────────────────────────
     4. EVENT HANDLERS
  ────────────────────────────────────────────────────────────────*/

  // Pointer and keyboard events route through the same activation path.

  // Debounce rapid-fire events so handler runs at most once per interval.
  function handle_trigger(event) {
    if (_interaction_timer) clearTimeout(_interaction_timer);
    _interaction_timer = setTimeout(() => {
      _interaction_timer = null;
      // [REPLACE: handler logic here]
    }, CONFIG.interaction_debounce_ms);
  }

  // Bind events per instance; track listeners for cleanup.
  function bind_instance_events(instance) {
    if (!instance.trigger) return;
    instance.listeners.push(add_listener(instance.trigger, 'click', handle_trigger));
  }

  /* ─────────────────────────────────────────────────────────────
     5. INITIALIZATION
  ────────────────────────────────────────────────────────────────*/

  // Initialization never blocks on libraries; missing globals fall back gracefully.
  function init_component() {
    const containers = document.querySelectorAll(SELECTORS.container);
    if (!containers.length) return;

    _instances = Array.from(containers).map((container) => {
      const instance = scrape_elements(container);
      process_instance(instance);
      bind_instance_events(instance);
      return instance;
    });

    _bound = true;
  }

  // Webflow.push keeps init timing aligned with Webflow page lifecycle.
  // The init flag prevents duplicate listeners when scripts are injected twice.
  const start = () => {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    if (document.readyState !== 'loading') {
      setTimeout(init_component, CONFIG.init_delay_ms);
      return;
    }

    document.addEventListener(
      'DOMContentLoaded',
      () => setTimeout(init_component, CONFIG.init_delay_ms),
      { once: true },
    );
  };

  // WEBFLOW: Page transitions may re-execute scripts; Webflow.push handles re-init.
  if (window.Webflow && window.Webflow.push) {
    window.Webflow.push(start);
  } else {
    start();
  }

  /* ─────────────────────────────────────────────────────────────
     6. CLEANUP / DESTROY
  ────────────────────────────────────────────────────────────────*/

  // Public cleanup hook supports local reinjection and Webflow page lifecycle reuse.
  function cleanup() {
    if (_interaction_timer) clearTimeout(_interaction_timer);
    _interaction_timer = null;

    _instances.forEach((instance) => {
      instance.listeners.forEach(remove_listener);
      instance.listeners = [];
    });
    _instances = [];

    _bound = false;
    window[INIT_FLAG] = false;
  }

  // Expose cleanup so Webflow page transitions or external code can rerun init.
  window[CLEANUP_NAME] = cleanup;

  /* ─────────────────────────────────────────────────────────────
     7. PUBLIC API (optional)
  ────────────────────────────────────────────────────────────────*/

  // Only expose what external code legitimately needs to call.
  // Delete this section if the component has no external consumers.
  window.[ComponentName] = {
    init: init_component,
    cleanup: cleanup,
    refresh: () => { cleanup(); init_component(); },
  };

})();
