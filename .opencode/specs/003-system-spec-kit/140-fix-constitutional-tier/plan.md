# Implementation Plan: Fix Constitutional Tier Misclassification

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (source), JavaScript (dist) |
| **Framework** | Node.js MCP server |
| **Storage** | SQLite (`context-index.sqlite`) |
| **Testing** | Jest unit tests |

### Overview
The `extractImportanceTier()` function in `memory-parser.ts` applied a regex directly to raw file content, which caused it to match `importanceTier` values embedded in HTML comment blocks before reaching the actual YAML metadata. The fix strips all HTML comments from the content string before running the regex. A bulk SQL UPDATE then corrected the 595 already-indexed rows affected by the bug.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] 6 unit tests passing
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parser utility function — targeted single-function fix with no structural changes.

### Key Components
- **`extractImportanceTier(content)`**: The function responsible for scanning memory file content and returning the tier string. Root cause was here.
- **HTML comment stripper**: One-line regex `content.replace(/<!--[\s\S]*?-->/g, '')` applied before the existing tier regex.
- **SQLite bulk UPDATE**: Direct SQL statement to correct already-indexed tier values.

### Data Flow
Memory file content → strip HTML comments → regex scan for `importanceTier` → return tier → store in SQLite index.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose
- [x] Identify the misclassified memory count (597 constitutional vs expected ~2)
- [x] Trace root cause to `extractImportanceTier()` regex matching HTML comment on line 77 of `context_template.md`
- [x] Identify which 595 rows require re-tiering (SESSION SUMMARY entries)

### Phase 2: Fix
- [x] Add HTML comment strip in `memory-parser.ts` before tier regex (line 443-467)
- [x] Apply equivalent change to compiled `memory-parser.js` in dist
- [x] Execute SQL UPDATE on 595 SESSION SUMMARY rows: `constitutional` → `normal`

### Phase 3: Verification
- [x] Write and run 6 unit tests confirming correct behaviour
- [x] Verify tier distribution in database (constitutional: 597 → 4, normal: 1720 → 2315)
- [x] Confirm all 3071 embeddings remain in success state
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `extractImportanceTier()` — comment stripping, YAML extraction, real template pattern | Jest |
| Manual | Database tier distribution verified via SQL COUNT queries | SQLite CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context-index.sqlite` | Internal | Green | Cannot re-tier existing rows |
| `context_template.md` | Internal | Green | Template is read-only for this fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parser regression or test failures after deployment
- **Procedure**: Revert `memory-parser.ts` and `memory-parser.js` to previous version; re-run SQL UPDATE in reverse (`normal` → `constitutional`) for the 595 SESSION SUMMARY rows
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
