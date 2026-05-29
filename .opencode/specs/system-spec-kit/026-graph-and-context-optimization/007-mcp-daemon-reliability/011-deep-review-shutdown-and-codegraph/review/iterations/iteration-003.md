# Iteration 003 — Security

**Verdict:** PASS | **Findings:** P0=0 P1=0 P2=2 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P2] SEC-01 — byte-safety / docs-vs-code  (confidence 0.9)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:138-144]** · finding_class: `docs-vs-code`
- **Evidence:**
```
// Reject paths containing NUL, C0/C1 control characters, DEL, raw newlines
// or tabs ...
const DIFF_PATH_BLOCKED_BYTES = /[\x00-\x1F\x7F]/;
```
- **Why:** The comment claims the byte-safety guard rejects 'C1 control characters' (\x80-\x9F), but the regex only covers C0 controls (\x00-\x1F) and DEL (\x7F). C1 controls (\x80-\x9F) pass through. Security impact is low because (a) such bytes cannot escape the workspace by themselves — containment handles that, and (b) JS strings are UTF-16 so a C1 codepoint is a single legal char; but the inline contract overstates actual coverage, which can mislead future maintainers into trusting a guard that does not exist. finding_class: docs-vs-code.
- **Fix:** Either extend the regex to /[\x00-\x1F\x7F-\x9F]/ to match the documented C1 coverage, or correct the comment to say 'C0 controls + DEL' only.

### [P2] SEC-02 — MCP input schema enforcement  (confidence 0.85)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:239-257]** · finding_class: `class-of-bug`
- **Evidence:**
```
// Validate each PRESENT value: enum membership and string minLength only.
for (const [key, value] of Object.entries(rawInput)) {
  const prop = properties[key];
  ...
  const enumValues = prop.enum as unknown[] | undefined;
  ...
  const minLength = prop.minLength as number | undefined;
```
- **Why:** validateToolArgs enforces only top-level enum, minLength, and additionalProperties:false. It does NOT enforce the published oneOf union or the item pattern '^sk-[a-z0-9-]+$' on code_graph_scan.includeSkills (tool-schemas.ts:23-30), nor array-item types. The numeric-range omission is explicitly documented as intentional (handler clamps), but the oneOf/pattern omission is undocumented. Real exploitability is mitigated: resolveIncludedSkillsList -> normalizeSkillList re-applies SKILL_NAME_PATTERN (index-scope-policy.ts:96-98), so a malformed skill name is filtered downstream rather than trusted. Net: incomplete schema enforcement with defense-in-depth downstream, not an active vuln. finding_class: class-of-bug.
- **Fix:** Document in the validateToolArgs JSDoc that oneOf/pattern/item-type are intentionally not enforced and rely on downstream normalizeSkillList filtering, or add nested pattern/oneOf validation for completeness.

## Coverage
Covered all four scoped files plus the two supporting libs the security claims depend on (workspace-path.ts for realpathSync/containment, diff-parser.ts for the source/shape of oldPath/newPath that the containment check consumes), and the validateToolArgs test file. VERIFIED SOUND: (1) R-007-3 dual-side containment at detect-changes.ts:196-209 validates BOTH oldPath and newPath independently against canonicalRootDir, closing the mixed-header bypass; rejects (not silently drops) escaping paths via parse_error at lines 295-307. (2) byte-safety runs BEFORE normalize() (line 171) so corrupt strings never reach path math. (3) rootDir symlink escape closed by realpathSync canonicalization (detect-changes.ts:217, workspace-path.ts:26-27) + isWithinWorkspace prefix-with-sep check. (4) The deliberate non-realpath of the candidate diff path (documented lines 126-130) is safe because the candidate feeds only read-only graph row lookups (resolveSubjectFilePath/queryOutline at lines 313-318), never a filesystem read of the candidate. (5) Scope env flags use strict 'true' equality (isEnabledEnvValue, line 78-80) and default-deny (isDefaultEndUserScope), so no accidental scope widening from arbitrary env strings. (6) handleTool runs validateToolArgs before dispatch (code-graph-tools.ts:71-86). NO P0/P1 found. COULD NOT fully verify at runtime: did not execute the vitest suites (read-only review); did not exhaustively enumerate every code-graph handler beyond the four scoped + two dependency libs, so cross-consumer reuse of validateToolArgs in non-scoped tools is out of scope this pass.

Review verdict: PASS
