---
description: "Common commands, CDN/version workflow, CSS/layout/animation and API/network debugging references, accessibility audit cues, and related skills"
---
# Quick Reference

Frequently used commands, external documentation, and related skills for fast lookup.

## CDN Version Update

```bash
# After JS changes, update version in HTML
# Pattern: src="https://cdn.example.com/js/file.js?v=X.Y.Z"
# Increment Z for patches, Y for features, X for breaking changes
```

## Common Commands

```bash
# Minification workflow (scripts located in .opencode/skill/sk-code--web/scripts/)
node .opencode/skill/sk-code--web/scripts/minify-webflow.mjs          # Batch minify all JS
node .opencode/skill/sk-code--web/scripts/verify-minification.mjs     # AST verification
node .opencode/skill/sk-code--web/scripts/test-minified-runtime.mjs   # Runtime testing

# Single file minification
npx terser src/javascript/[folder]/[file].js --compress --mangle \
  -o src/javascript/z_minified/[folder]/[file].js

# CDN deployment (after minification)
wrangler r2 object put project-cdn/js/[file].min.js --file src/javascript/z_minified/[file].min.js

# Version check
grep -n "v=" src/html/global.html | head -5
```

## External Resources

### Official Documentation

| Resource           | URL                         | Use For                   |
| ------------------ | --------------------------- | ------------------------- |
| MDN Web Docs       | developer.mozilla.org       | JavaScript, DOM, Web APIs |
| Webflow University | university.webflow.com      | Webflow platform patterns |
| Motion.dev         | motion.dev/docs             | Animation library         |
| HLS.js             | github.com/video-dev/hls.js | Video streaming           |
| Lenis              | lenis.darkroom.engineering  | Smooth scroll             |

### Testing and Debugging

| Resource        | URL                                | Use For               |
| --------------- | ---------------------------------- | --------------------- |
| Chrome DevTools | developer.chrome.com/docs/devtools | Browser debugging     |
| Can I Use       | caniuse.com                        | Browser compatibility |

## Related Skills

| Skill                         | Use For                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| **sk-documentation**   | Documentation quality, skill creation, markdown validation  |
| **sk-git**             | Git workflows, commit hygiene, PR creation                  |
| **system-spec-kit**           | Spec folder management, memory system, context preservation |
| **mcp-chrome-devtools** | Browser debugging, screenshots, console access              |

## Navigation Guide

**For Implementation Tasks:**
1. Start with [[when-to-use]] to confirm this skill applies
2. Follow Implementation phase from [[how-it-works]]
3. Load ALWAYS/CONDITIONAL resources from `references/implementation/`

**For Debugging Tasks:**
1. Load `assets/checklists/debugging_checklist.md`
2. Follow systematic debugging workflow in [[debugging-workflow]]
3. Use mcp-chrome-devtools skill for DevTools reference

**For Verification Tasks:**
1. Load `assets/checklists/verification_checklist.md`
2. Complete all applicable checks via [[verification-workflow]]
3. Only claim "done" when checklist passes

## Cross References
- [[when-to-use]] - When to activate this skill
- [[how-it-works]] - Full development lifecycle
- [[success-criteria]] - Performance targets and completion gates
- [Language Detection](../../sk-code--opencode/nodes/language-detection.md) - Route config and TypeScript/Python requests
- [Validation Workflow](../../system-spec-kit/nodes/validation-workflow.md) - Spec validation, quality, and completion checks
- [Document Quality Mode](../../sk-documentation/nodes/mode-document-quality.md) - DQI and markdown quality enforcement
