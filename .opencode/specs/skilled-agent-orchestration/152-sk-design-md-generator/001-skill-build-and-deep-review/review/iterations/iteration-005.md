# Iteration 5: correctness — output generators

Reviewed: .opencode/skills/sk-design-md-generator/tool/scripts/report-gen.ts, .opencode/skills/sk-design-md-generator/tool/scripts/preview-gen.ts, .opencode/skills/sk-design-md-generator/tool/scripts/interaction-capture.ts

Findings: 4 (P0=0 P1=0 P2=4)


## F005-01 [P2] Component variant names not HTML-escaped
- File: .opencode/skills/sk-design-md-generator/tool/scripts/report-gen.ts:502
- Evidence: Line 502: `${cg.variants.map((v: { name: string }) => v.name).join(', ')}` — variant `name` (derived from extracted CSS class names) is injected directly into HTML `<td>` without `esc()` wrapping, unlike every other text field in the template. If a class name contains `<`, `>`, `&`, or `"`, the output HTML will be malformed.
- Fix: Wrap with `esc()`: `cg.variants.map((v) => esc(v.name)).join(', ')`.


## F005-02 [P2] withTimeout timer never cleared, produces misleading timeout warnings
- File: .opencode/skills/sk-design-md-generator/tool/scripts/interaction-capture.ts:364
- Evidence: The `withTimeout` function (line 356-370) uses `Promise.race` with a `setTimeout` but never calls `clearTimeout`. When the inner promise resolves before the timeout, the `setTimeout` callback still fires later and logs `[interaction-capture] Timeout: ...` even though the operation succeeded — polluting logs and leaking timer resources.
- Fix: Capture the timer ID (`const id = setTimeout(...)`) and call `clearTimeout(id)` in a `.then/.finally` on the inner promise.


## F005-03 [P2] Font-family names in HTML comment may break comment structure
- File: .opencode/skills/sk-design-md-generator/tool/scripts/report-gen.ts:249
- Evidence: Line 249: `<!-- Note: ${uniqueFamilies.join(', ')} may be proprietary -->`. Font-family names from `getComputedStyle` can theoretically contain `-->` (e.g. via a crafted @font-face), which would prematurely close the HTML comment and inject raw text into the page.
- Fix: Escape `-->` sequences: `uniqueFamilies.map(f => f.replace(/-->/g, '-- >')).join(', ')`, or place outside the comment.


## F005-04 [P2] Shadow value not HTML-escaped in Card section (inconsistent with Shadow section)
- File: .opencode/skills/sk-design-md-generator/tool/scripts/preview-gen.ts:233
- Evidence: Line 226 escapes shadow values: `box-shadow:${escapeHtml(s.value)}`. But line 233 injects the same `shadows[0].value` raw: `box-shadow:${shadows[0].value}`. If a shadow value contained `"` (e.g. `0 0 0 \"evil\"`), the style attribute would break.
- Fix: Apply `escapeHtml()` consistently: `box-shadow:${escapeHtml(shadows[0].value)}` at line 233.
