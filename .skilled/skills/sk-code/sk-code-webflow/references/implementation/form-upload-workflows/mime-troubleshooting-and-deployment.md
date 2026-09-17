---
title: MIME Types, Troubleshooting, Deployment & Related
description: Complete architecture reference for the FilePond-to-R2 file upload pipeline, including Cloudflare Worker proxy, state management, and Webflow integration. — MIME Types, Troubleshooting, Deployment & Related.
trigger_phrases:
  - "mime types troubleshooting"
  - "types troubleshooting deployment"
  - "mime types patterns"
  - "webflow mime types"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# MIME Types, Troubleshooting, Deployment & Related

Complete architecture reference for the FilePond-to-R2 file upload pipeline, including Cloudflare Worker proxy, state management, and Webflow integration. — MIME Types, Troubleshooting, Deployment & Related.

---

## 1. OVERVIEW

### Purpose

A MIME-type reference for file uploads, a troubleshooting guide for upload failures, and the pages-and-deployment steps that move an upload flow into production.

### When to Use

- Setting or verifying MIME types for a file-upload flow
- An upload fails and you need the troubleshooting matrix
- Deploying an upload feature to Pages

---

## 2. MIME TYPE REFERENCE

### Accepted Types Table

Default accepted types configured in `DEFAULTS.acceptedTypes`:

| Extension | MIME Type | Browser Reports As | Notes |
|-----------|-----------|-------------------|-------|
| `.pdf` | `application/pdf` | `application/pdf` | Consistent across all browsers |
| `.doc` | `application/msword` | `application/msword` or `application/octet-stream` | Legacy Word — some browsers misreport |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Correct, `application/zip`, or `application/octet-stream` | Modern Word — browsers often misreport |
| `.txt` | `text/plain` | `text/plain` | Consistent |
| `.md` | `text/markdown` | `text/markdown` or `text/plain` | May vary by browser |
| `.odt` | `application/vnd.oasis.opendocument.text` | Correct or `application/zip` | OpenDocument Text — may misreport |
| `.rtf` | `application/rtf` or `text/rtf` | `application/rtf`, `text/rtf`, or `application/octet-stream` | Rich Text Format — dual MIME types supported |

### Extension-Based MIME Detection Fallback

Browsers inconsistently report MIME types for Office documents (e.g., `.docx` may be reported as `application/zip` or `application/octet-stream`). To handle this, the connector includes a **`fileValidateTypeDetectType` callback** that uses extension-based detection as a fallback.

**`MIME_TYPE_MAP`** — maps file extensions to correct MIME types:

```javascript
const MIME_TYPE_MAP = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.rtf': 'application/rtf',
};
```

**`detect_file_type(source, type)`** — called by FilePond before validation:

1. If the browser-reported MIME type is already a known accepted type → trust it
2. If not → extract file extension from `source.name` and look up in `MIME_TYPE_MAP`
3. If extension matches → return the correct MIME type (overriding browser's report)
4. If no match → pass through original type (FilePond's default validation handles rejection)

This is configured in the FilePond instance:

```javascript
FilePond.create(input_el, {
  acceptedFileTypes: accepted_types_array,
  fileValidateTypeDetectType: detect_file_type, // Extension-based fallback
  // ...
});
```

### Extension Aliases as Fallback

The connector intentionally appends file extension aliases to the `acceptedFileTypes` array as a fallback mechanism. While FilePond's validation primarily matches MIME types, some browsers/platforms report DOC/DOCX files as generic MIME types during file selection (e.g., `application/zip`, `application/octet-stream`). To handle this:

1. **MIME list remains primary** — Full MIME types are listed first in `acceptedFileTypes`
2. **Extension aliases appended** — Extensions like `.docx`, `.pdf`, etc. are added automatically
3. **Native input synchronized** — The native file input's `accept` attribute is kept in sync with the normalized FilePond configuration

**Implementation:**
```javascript
// Parse accepted types into array
var accepted_types_array = accepted_types.split(',').map(function (t) {
  return t.replace(/\s+/g, '');
});

// Add extension aliases as a fallback for browsers/platforms that
// report DOC/DOCX as generic zip/octet MIME types during selection.
Object.keys(MIME_TYPE_MAP).forEach(function (ext) {
  if (accepted_types_array.indexOf(ext) === -1) {
    accepted_types_array.push(ext);
  }
});

// Keep native accept in sync with normalized FilePond configuration.
// This prevents Webflow/editor stale values from drifting and ensures
// extension fallbacks (.docx, etc.) are available in all browsers.
input_el.setAttribute('accept', accepted_types_array.join(','));
```

This dual approach provides maximum compatibility across browsers while maintaining proper MIME-based validation via `fileValidateTypeDetectType`.

### Adding New File Types

To accept additional file types:

1. **Find the MIME type** — check the table below or use browser DevTools to inspect `file.type`
2. **Update `DEFAULTS.acceptedTypes`** — add MIME type to the comma-separated string in `input_upload.js`
3. **Update `MIME_TYPE_MAP`** — add extension-to-MIME mapping for extension-based fallback detection
4. **OR use data attribute** — set `data-accepted-types` on the wrapper element (MIME types only)
5. **Update description label** — change `data-label-description` to reflect new types
6. **Minify and deploy** — follow CDN deployment workflow

### Common MIME Types Reference

| Extension | MIME Type |
|-----------|-----------|
| `.pdf` | `application/pdf` |
| `.doc` | `application/msword` |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| `.xls` | `application/vnd.ms-excel` |
| `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `.ppt` | `application/vnd.ms-powerpoint` |
| `.pptx` | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.txt` | `text/plain` |
| `.csv` | `text/csv` |
| `.jpg` / `.jpeg` | `image/jpeg` |
| `.png` | `image/png` |
| `.gif` | `image/gif` |
| `.webp` | `image/webp` |
| `.svg` | `image/svg+xml` |
| `.zip` | `application/zip` |
| `.mp4` | `video/mp4` |

---

## 3. TROUBLESHOOTING

### "Invalid file type" Error

**Symptom**: User drops/selects a valid file but gets "Invalid file type" error.

**Root Causes**:
1. MIME type not in `acceptedFileTypes` — the MIME string is missing from `DEFAULTS.acceptedTypes`
2. Browser misreports MIME type — especially common with `.doc`/`.docx` files (may report as `application/zip` or `application/octet-stream`)
3. Extension not in `MIME_TYPE_MAP` — the `detect_file_type` fallback can't map the extension

**Fix**:
1. Check what MIME type the browser assigns: `console.log(file.type)` in DevTools
2. Add the exact MIME string to `DEFAULTS.acceptedTypes` or `data-accepted-types`
3. Add the extension-to-MIME mapping in `MIME_TYPE_MAP` (for browser MIME misreport fallback)
4. Extension aliases are automatically appended to `acceptedFileTypes` and the native `accept` attribute for maximum compatibility

**Validation Error Mapping**: The `resolve_validation_error_message` function handles multiple wording variants for size and type errors (e.g., "File is too large", "too big", "max file size", "size exceeded").

### FilePond Not Loading

**Symptom**: Upload component shows labels but doesn't respond to file drops/clicks. Console shows "[FilePondConnector] FilePond library not loaded after 5 retries".

**Possible Causes**:
1. **Script order wrong** — plugins loaded AFTER core (must be BEFORE)
2. **CDN unavailable** — `unpkg.com` is down or blocked
3. **Script blocked** — ad blocker or CSP blocking external scripts

**Fix**: Check Network tab for failed script loads. Verify script order in HTML.

### Upload Fails Silently

**Symptom**: File is added, progress shows, but never completes. No error displayed.

**Possible Causes**:
1. **Worker endpoint down** — the Cloudflare Worker is not responding
2. **CORS issue** — Worker not returning proper CORS headers
3. **Response format changed** — Worker not returning expected `{ url }` JSON

**Fix**: Check Network tab for the POST request. Inspect response body. Verify Worker is deployed and responding.

### File URL Missing in Submission

**Symptom**: Form submits successfully but the file URL is not in the Formspark data.

**Possible Causes**:
1. **Hidden input missing** — no `[data-file-upload="url"]` element in form
2. **Input has no `name`** — the hidden input needs a `name` attribute for form serialization
3. **Upload not complete** — form submitted before upload finished

**Fix**: Verify the hidden input exists with both `data-file-upload="url"` and a `name` attribute (e.g., `name="file_url"`).

### Progress Bar Stuck

**Symptom**: Progress bar starts but freezes at a percentage.

**Possible Causes**:
1. **XHR progress not firing** — server doesn't support chunked upload progress
2. **Large file on slow connection** — upload genuinely slow
3. **Network interruption** — connection dropped mid-upload

**Fix**: Check Network tab for the upload request status. If the request is pending, wait. If failed, check error handling.

---

## 4. PAGES AND DEPLOYMENT

### Pages Using Upload

| Page | HTML File | Upload Context |
|------|-----------|----------------|
| Werken bij (Careers) | `src/0_html/werken_bij.html` | Job application form — resume/CV upload |
| Vacature (Job posting) | `src/0_html/cms/vacature.html` | CMS template — job-specific application form |

Both pages load identical FilePond dependencies and the same version of `input_upload.min.js`.

### Version Management

Scripts use the `?v=` query parameter pattern for cache busting (semver format: `major.minor.patch`):

| Script | CDN Path |
|--------|----------|
| `input_upload.min.js` | `pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v={version}` |
| `form_validation.min.js` | `pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/form_validation.min.js?v={version}` |
| `form_submission.min.js` | `pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/form_submission.min.js?v={version}` |
| `form_persistence.min.js` | `pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/form_persistence.min.js?v={version}` |

> **Note**: Check `werken_bij.html` and `vacature.html` for current version numbers. See [cdn-deployment.md](../../deployment/cdn-deployment.md) for versioning rules.

### CDN Workflow

After modifying upload-related JavaScript:

1. **Minify**: Run minification script or `npx terser` on the source file
2. **Verify**: Run verification script to confirm minified output matches source
3. **Upload to R2**: `wrangler r2 object put project-cdn/{file}.min.js --file {minified_path}`
4. **Version bump**: Increment `?v=` parameter in both `werken_bij.html` and `vacature.html`
5. **Browser test**: Verify upload works at mobile and desktop viewports

### Public API

The connector exposes a global API for programmatic control:

```javascript
// Re-initialize (after SPA navigation)
window.InputUpload.init();

// Get FilePond instance from a wrapper element
window.InputUpload.getInstance(wrapperElement);

// Cleanup all instances (before page transitions)
window.InputUpload.cleanup();

// Also available as:
window.initFilepondConnector();
window.getFilepondInstance(wrapper);
window.cleanupFilepondInstances();
```

---

## 5. RELATED RESOURCES

### Reference Files

- [`../../css/quality-standards/patterns-and-naming-enforcement.md`](../../css/quality-standards/patterns-and-naming-enforcement.md) - CSS quality patterns relevant to form-field state styling (BEM enforcement, custom property prefixes, attribute selector i flag)

- **[implementation_workflows.md](../implementation-workflows/condition-based-waiting.md)** — Condition-based waiting, validation patterns used by the upload connector
- **[security_patterns.md](../security-patterns/overview-and-checklist.md)** — XSS prevention relevant to file upload handling
- **[code-quality-standards.md](../../javascript/quality-standards/init-dom-error-and-async.md)** — Naming conventions and initialization patterns
- **CDN Deployment**: See [cdn-deployment.md](../../deployment/cdn-deployment.md) for R2 upload workflow
- **Minification**: See [minification_guide.md](../../deployment/minification-guide/overview-terser-and-patterns.md) for terser configuration
