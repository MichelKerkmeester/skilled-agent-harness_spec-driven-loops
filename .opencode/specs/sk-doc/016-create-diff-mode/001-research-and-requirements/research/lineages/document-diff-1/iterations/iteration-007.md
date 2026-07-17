# Iteration 7: Security Considerations

## Focus
Assess security risks: local file access safety, path traversal prevention, HTML output sanitization, snapshot storage security.

## Findings

### 1. Threat model for a local document diff tool
| Threat | Risk Level | Mitigation |
|--------|-----------|------------|
| **Path traversal** (reading files outside working directory) | Medium | Resolve all paths against a configurable base directory; reject paths with `..` segments after resolution; use `path.resolve()` + verify prefix matches allowed root |
| **Symlink attacks** (following symlinks to sensitive files) | Medium | Use `fs.realpath()` before access; optionally refuse to follow symlinks by default; document the risk |
| **Malicious DOCX files** (XML bombs, entity expansion) | Medium | Use mammoth's built-in safeguards; set input size limits; timeout parsing operations |
| **HTML injection in diff output** (XSS if report is viewed in browser) | High | Sanitize all user content rendered in HTML diff reports; use `hast-util-sanitize` or `DOMPurify` for HTML content; diff2html already escapes diff content |
| **Snapshot storage poisoning** (writing crafted files to snapshot dir) | Low | Snapshots are plain text copies; the tool reads them as input for diff only; no code execution path from snapshot content |
| **Denial of service** (very large files, deeply nested structures) | Low-Medium | Set `diffMaxChanges` and `diffMaxLineLength` limits (diff2html config); set `maxEditLength` on jsdiff; refuse files above configurable size limit (default 10MB) |

### 2. Path traversal prevention (concrete implementation)
```typescript
function safeResolvePath(userPath: string, baseDir: string): string {
  const resolved = path.resolve(baseDir, userPath);
  if (!resolved.startsWith(path.resolve(baseDir) + path.sep) &&
      resolved !== path.resolve(baseDir)) {
    throw new Error(`Path traversal detected: ${userPath}`);
  }
  return resolved;
}
```
This ensures any path the user provides is contained within the allowed working directory.

### 3. HTML sanitization for diff reports
- diff2html escapes diff content by default (change objects are rendered as text, not HTML)
- Custom fidelity headers and metadata must be rendered with proper escaping
- For HAST-based HTML processing, use `hast-util-sanitize` with a restrictive allowlist
- For raw HTML strings, use a library like `sanitize-html` or `DOMPurify` (Node.js version)
- The output report must be safe to open in any browser

### 4. DOCX security considerations
mammoth's own documentation warns: "Mammoth performs no sanitisation of the source document, and should therefore be used extremely carefully with untrusted user input." Specific risks:
- `javascript:` links in the source DOCX become clickable in output HTML
- External file references in DOCX can be exploited (mammoth disables these by default via `externalFileAccess: false`)
- Recommendation: Always sanitize mammoth output through a HAST pipeline before diffing or rendering

### 5. Snapshot storage permissions
- Snapshots stored under `~/.document-snapshots/` (Unix) or `%APPDATA%/document-snapshots/` (Windows)
- Directory permissions: `0700` (owner read/write/execute only)
- Each snapshot file: `0600` (owner read/write only)
- No world-readable snapshots by default
- Cleanup on uninstall: user must manually delete, or provide `document-diff cleanup --purge-all` command

## Sources Consulted
- https://www.npmjs.com/package/mammoth (security section)
- https://github.com/syntax-tree/hast-util-sanitize (HAST sanitization)
- diff2html documentation (escaping behavior)
- OWASP path traversal guidance (best practices)

## Assessment
- **newInfoRatio**: 0.55 (Security threat model and concrete mitigations are new; specific path traversal implementation is new; DOCX sanitization concerns flagged)
- **Novelty Justification**: Structured the complete threat model; provided concrete code for path traversal prevention; identified mammoth's security warnings as gating concern for DOCX pipeline.

## Reflection
- **What Worked**: Node.js ecosystem provides mature sanitization libraries for each risk category.
- **What Failed**: N/A
- **Ruled Out**: Accepting untrusted DOCX without sanitization. Full sandbox execution model (overkill for v1 local tool).

## Recommended Next Focus
OpenCode skill interface design: how the skill wraps the portable core, CLI vs programmatic API, configuration surface.
