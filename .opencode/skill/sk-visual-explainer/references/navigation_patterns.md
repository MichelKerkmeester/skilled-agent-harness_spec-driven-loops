---
description: "In-page navigation patterns including sticky sidebar TOC, mobile horizontal nav, and scroll-spy via IntersectionObserver"
---

# Visual Explainer — Navigation Patterns

> LOAD PRIORITY: CONDITIONAL — load when generating pages with 4 or more sections.

Patterns for in-page navigation: sticky sidebar TOC on desktop, horizontal scrolling nav bar on mobile, and scroll spy via IntersectionObserver.

---

## 1. OVERVIEW

Use these patterns when output has four or more sections and needs consistent in-page navigation across desktop and mobile.

The reference includes layout CSS, HTML structure, scroll-spy behavior, and interaction polish for section jumping.

---

## When to Use Navigation

Add navigation when a page has **4 or more named sections**. Below 4 sections, navigation adds visual noise without functional benefit.

Always pair navigation with:
- `<meta name="color-scheme" content="light dark">`
- `@media (prefers-contrast: more)` adjustments for active link clarity
- `@media (forced-colors: active)` to keep active states visible

---

## Desktop Layout — Two-Column Grid with Sticky Sidebar

The sidebar TOC is 180px wide. Content takes the remaining space. The sidebar sticks to the viewport top as the user scrolls.

```css
/* ============ PAGE LAYOUT ============ */
.page-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 32px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}

/* ============ SIDEBAR TOC ============ */
.toc {
  position: sticky;
  top: 24px;
  align-self: start;
  max-height: calc(100vh - 48px);
  overflow-y: auto;

  /* Subtle scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--ve-border) transparent;
}

.toc::-webkit-scrollbar { width: 4px; }
.toc::-webkit-scrollbar-track { background: transparent; }
.toc::-webkit-scrollbar-thumb {
  background: var(--ve-border);
  border-radius: 2px;
}

/* ============ TOC HEADER ============ */
.toc__header {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ve-text-dim);
  padding: 0 0 10px 0;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--ve-border);
}

/* ============ TOC LINKS ============ */
.toc a {
  display: block;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--ve-text-dim);
  text-decoration: none;
  border-radius: 6px;
  border-left: 2px solid transparent;
  line-height: 1.4;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.toc a:hover {
  color: var(--ve-text);
  background: var(--ve-surface2);
}

/* Active state — set by scroll spy */
.toc a.active {
  color: var(--ve-accent);
  background: var(--ve-accent-dim);
  border-left-color: var(--ve-accent);
  font-weight: 500;
}

/* Nested TOC items (sub-sections) */
.toc a.toc--sub {
  padding-left: 20px;
  font-size: 11px;
}

/* ============ MAIN CONTENT AREA ============ */
.page-content {
  min-width: 0;  /* CRITICAL: prevents flex/grid overflow */
}
```

---

## Mobile Layout — Horizontal Scrolling Nav Bar

On screens narrower than 1000px, the sidebar collapses into a fixed horizontal bar at the top of the page.

```css
@media (max-width: 1000px) {
  /* Switch to single-column layout */
  .page-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  /* TOC becomes a sticky horizontal bar */
  .toc {
    position: sticky;
    top: 0;
    z-index: 100;

    /* Horizontal scroll */
    display: flex;
    flex-direction: row;
    gap: 4px;
    overflow-x: auto;
    overflow-y: visible;
    max-height: none;

    /* Appearance */
    padding: 10px 16px;
    background: var(--ve-surface);
    border-bottom: 1px solid var(--ve-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    /* Smooth scroll on iOS */
    -webkit-overflow-scrolling: touch;

    /* Hide scrollbar on mobile */
    scrollbar-width: none;
  }

  .toc::-webkit-scrollbar { display: none; }

  /* TOC header hidden on mobile */
  .toc__header { display: none; }

  /* Links become pill-shaped buttons */
  .toc a {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    border-left: none;
    flex-shrink: 0;
  }

  .toc a.active {
    /* Remove left border style inherited from desktop */
    border-left-color: transparent;
  }

  /* Sub-items lose extra indent on mobile */
  .toc a.toc--sub {
    padding-left: 12px;
  }

  /* Add top padding to content to clear the sticky bar */
  .page-content {
    padding-top: 16px;
  }
}
```

---

## HTML Structure

The TOC must be the **first child** of `.page-layout`. Sections use sequential IDs.

```html
<!-- Page wrapper -->
<div class="page-layout">

  <!-- 1. Navigation (first child = left column on desktop) -->
  <nav class="toc" aria-label="Page navigation">
    <div class="toc__header">Contents</div>
    <a href="#overview">Overview</a>
    <a href="#architecture">Architecture</a>
    <a href="#pipeline">Pipeline</a>
    <a href="#database">Database</a>
    <a href="#outputs">Outputs</a>
  </nav>

  <!-- 2. Content (second child = right column on desktop) -->
  <main class="page-content">

    <section id="overview">
      <h2>Overview</h2>
      <!-- ... -->
    </section>

    <section id="architecture">
      <h2>Architecture</h2>
      <!-- ... -->
    </section>

    <section id="pipeline">
      <h2>Pipeline</h2>
      <!-- ... -->
    </section>

    <section id="database">
      <h2>Database</h2>
      <!-- ... -->
    </section>

    <section id="outputs">
      <h2>Outputs</h2>
      <!-- ... -->
    </section>

  </main>

</div>
```

---

## Scroll Spy — IntersectionObserver

The scroll spy activates the matching TOC link as each section enters the viewport. It also auto-centers the active link on mobile.

```javascript
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const tocLinks = document.querySelectorAll('.toc a');

  if (!sections.length || !tocLinks.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;

      // Remove active from all links
      tocLinks.forEach(function(link) {
        link.classList.remove('active');
      });

      // Activate the matching link
      var activeLink = document.querySelector(
        '.toc a[href="#' + entry.target.id + '"]'
      );

      if (activeLink) {
        activeLink.classList.add('active');

        // Auto-center active link in mobile horizontal scroll
        if (window.innerWidth <= 1000) {
          activeLink.scrollIntoView({
            inline: 'center',
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }
    });
  }, {
    // Trigger when section enters the upper third of the viewport
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0.1,
  });

  sections.forEach(function(section) {
    observer.observe(section);
  });

  // Click handler: smooth scroll + sync URL without triggering a jump
  tocLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    });
  });
})();
```

---

## Scroll Margin (Mobile TOC Offset)

Prevent section headings from being hidden behind the sticky mobile nav bar when navigating via anchor links or scroll spy.

```css
/* Offset equals the sticky bar height (~80px) on mobile */
section[id] {
  scroll-margin-top: 80px;
}

@media (min-width: 1001px) {
  /* Desktop: smaller offset — only the page top padding */
  section[id] {
    scroll-margin-top: 24px;
  }
}
```

---

## Section Heading Style

Each section should have a consistent heading style that visually anchors it to the TOC entry.

```css
.page-content section {
  padding-top: 40px;
  margin-top: -40px;  /* compensate for sticky bar height on mobile */
}

.page-content section + section {
  border-top: 1px solid var(--ve-border);
  padding-top: 40px;
}

.section-heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
}

.section-heading h2 {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.section-heading .section-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ve-accent);
  font-weight: 600;
}
```

---

## Smooth Scroll

Enable smooth scrolling for anchor links site-wide:

```css
html {
  scroll-behavior: smooth;
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

---

## Complete Example (Minimal Page)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example — Navigation Pattern</title>
  <style>
    /* Paste: Theme Setup + Navigation patterns from this file */
    html { scroll-behavior: smooth; }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  </style>
</head>
<body>

  <header style="padding: 40px 40px 0">
    <h1>Page Title</h1>
  </header>

  <div style="padding: 24px 40px 60px" class="page-layout">

    <nav class="toc" aria-label="Page navigation">
      <div class="toc__header">Contents</div>
      <a href="#section-a">Section A</a>
      <a href="#section-b">Section B</a>
      <a href="#section-c">Section C</a>
      <a href="#section-d">Section D</a>
    </nav>

    <main class="page-content">
      <section id="section-a">
        <h2>Section A</h2>
        <p>Content...</p>
      </section>
      <section id="section-b">
        <h2>Section B</h2>
        <p>Content...</p>
      </section>
      <section id="section-c">
        <h2>Section C</h2>
        <p>Content...</p>
      </section>
      <section id="section-d">
        <h2>Section D</h2>
        <p>Content...</p>
      </section>
    </main>

  </div>

  <script>
    /* Paste scroll spy function from this file */
  </script>
</body>
</html>
```
