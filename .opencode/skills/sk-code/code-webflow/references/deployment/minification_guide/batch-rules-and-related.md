---
title: Batch Minification, Rules & Related
description: Safe minification workflow for Webflow projects with verification to prevent breaking functionality. — Batch Minification, Rules & Related.
importance_tier: normal
contextType: implementation
version: 3.5.0.15
---

# Batch Minification, Rules & Related

## 7. BATCH MINIFICATION WORKFLOW

### For All Files

```bash
# Step 1: Minify all
node .opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs --force

# Step 2: Verify all
node .opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs

# Step 3: Test all
node .opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs

# Step 4: Browser test key pages
bdg https://your-project.webflow.io/
bdg console logs
bdg stop
```

### For Single File

```bash
# Step 1: Minify (output uses .min.js suffix)
npx terser src/javascript/hero/hero_video.js --compress --mangle \
  -o src/javascript/z_minified/hero/hero_video.min.js

# Step 2: Verify (runs on all, but check specific file in output)
node .opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs

# Step 3: Test
node .opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs

# Step 4: Browser test
bdg https://your-project.webflow.io/
bdg console logs
bdg stop
```

---

## 8. RULES

### ✅ ALWAYS

- Run AST verification after minification
- Run runtime test after minification
- Test in browser before deploying
- Keep original source files (never delete)
- Use `--compress --mangle` together (standard config)
- Check verification output for FAIL status

### ❌ NEVER

- Use `--mangle-props` (breaks object property access)
- Deploy if AST verification shows FAIL
- Deploy without browser testing
- Minify directly over source files
- Assume minification is safe without verification

### ⚠️ ESCALATE IF

- AST verification shows missing critical pattern
- Runtime test throws errors
- Browser console shows new errors after minification
- Cannot identify why minification broke functionality
- Need to use custom terser configuration

---

## 9. RELATED RESOURCES

### Reference Files

- [cdn_deployment.md](../cdn_deployment.md) - Deploying minified files to Cloudflare R2
- [implementation_workflows.md](../../implementation/implementation_workflows/condition-based-waiting.md) - General implementation patterns
- [debugging_workflows.md](../../debugging/debugging_workflows/systematic-four-phases.md) - Debugging workflows

### Scripts

- `.opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs` - Batch minification
- `.opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs` - AST verification
- `.opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs` - Runtime testing

### External

- [Terser Documentation](https://terser.org/docs/api-reference)
- [Terser CLI Options](https://terser.org/docs/cli-usage)
