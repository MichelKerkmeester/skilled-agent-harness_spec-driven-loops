# Iteration 8: Parity Verification — Acceptance Checklist Automation

## Focus
How to confirm a migrated workspace matches the source with no silent data loss — the acceptance checklist as programmatic checks.

## Findings

### F8.1 — Verification Dimensions

| Dimension | What to check | Automated? | Tool/invocation |
|---|---|---|---|
| Page existence | Every "must-preserve" page exists in vault | Yes | mcp-obsidian `notesmd-cli list` + cross-reference against mcp-notion `search` output |
| Internal links | All `[[wikilinks]]` resolve to existing notes | Yes | `notesmd-cli search-content` for broken wikilinks or manual grep |
| Attachment files | Every referenced image/file exists in vault folder | Yes | Count files in vault attachments folder; grep for `![[file]]` refs |
| Database row count | Per-database: row count matches source | Yes | mcp-obsidian `ls` row file count vs mcp-notion `query-data-source` count |
| Frontmatter completeness | Expected frontmatter keys exist on imported notes | Yes | `notesmd-cli frontmatter` per note; check key presence |
| Property type fidelity | Property types match Notion schema | Partial | Read frontmatter values; type-check (string vs date vs number) |
| Relation integrity | `[[wikilinks]]` in relation columns all resolve | Yes | grep frontmatter for `[[` patterns; cross-reference file list |
| Rollup/formula output | Sample-check a formula result vs Notion source | Manual | Pick 5-10 critical formulas; verify by hand |
| View rendering | Each required view renders in Obsidian | Manual | Open each `.base` or `_database.md`; check rendering |

[SOURCE: prior-findings.md §5 — programmatic verification approach]
[SOURCE: prior-findings.md §4 — acceptance checklist items]

### F8.2 — Automated Parity Script (Pseudocode)

The AI agent writes and runs this as a batch script post-import:

```bash
#!/bin/bash
# migration-parity-check.sh
# Run from vault root after import

MISMATCHES=0

echo "=== 1. PAGE EXISTENCE CHECK ==="
while IFS= read -r expected; do
  if ! notesmd-cli list | grep -q "$expected"; then
    echo "MISSING: $expected"
    ((MISMATCHES++))
  fi
done < must_preserve_pages.txt

echo "=== 2. BROKEN LINK CHECK ==="
while IFS= read -r note; do
  content=$(notesmd-cli print "$note")
  broken=$(echo "$content" | grep -oP '\[\[(.*?)\]\]' | sed 's/\[\[\|\]\]//g' | while read -r target; do
    if ! notesmd-cli list | grep -qi "$target"; then
      echo "  $note -> $target"
      ((MISMATCHES++))
    fi
  done)
done < <(notesmd-cli list)

echo "=== 3. ATTACHMENT INTEGRITY ==="
attachments_dir="${VAULT}/attachments/"
if [ -d "$attachments_dir" ]; then
  echo "Attachment count: $(find "$attachments_dir" -type f | wc -l)"
else
  echo "WARNING: No attachments directory found"
  ((MISMATCHES++))
fi

echo "=== 4. DATABASE ROW COUNT ==="
# For each database folder, count .md files (excluding _database.md)
for db in Vault/Databases/*/; do
  expected=$(grep "^${db%/}:" expected_counts.txt | cut -d: -f2)
  actual=$(find "$db" -maxdepth 1 -name "*.md" ! -name "_database.md" | wc -l)
  if [ "$expected" != "$actual" ]; then
    echo "ROW COUNT MISMATCH: $db (expected $expected, got $actual)"
    ((MISMATCHES++))
  fi
done

echo "=== 5. FRONTMATTER KEY CHECK ==="
# For each note type, verify expected frontmatter keys exist
# (schema-defined per database in _database.md)

echo ""
echo "MISMATCHES FOUND: $MISMATCHES"
exit $MISMATCHES
```

[SOURCE: mcp-obsidian SKILL.md §7 — notesmd-cli commands: list, print, search-content]
[SOURCE: prior-findings.md §5 — acceptance checklist: grep orphans, detect mismatches]

### F8.3 — What Automated Verification Cannot Catch

| Check | Why manual | Mitigation |
|---|---|---|
| Formula output accuracy | Notion formula engine ≠ plugin formula engine | Test top 10 critical formulas by sample; document known differences |
| Visual layout parity | Obsidian renders markdown differently than Notion | Accept that visual parity is impossible; focus on data parity |
| Rollup auto-refresh behavior | Notion recalculates live; Obsidian requires note open/refresh | Document this as a fundamental platform difference — not a bug |
| User-permission structure | Obsidian has no workspace-level permissions | Not in scope; vault security is filesystem-based |
| Nested page ordering | Notion has drag-reorder; Obsidian sorts alphabetically | Add `order::` frontmatter if ordering matters |

[SOURCE: prior-findings.md §4 — acceptance checklist: "keep Notion live until this passes"]
[SOURCE: prior-findings.md §5 — honest boundaries: "formula/rollup verification is real work"]

### F8.4 — Two-Pass Verification Strategy

**Pass 1 (AI automated, run immediately after import):**
- Count check (pages, rows, files)
- Link validation (no broken `[[wikilinks]]`)
- Frontmatter schema check
- Attachment file presence
- Batch results into a structured report

**Pass 2 (Human, after AI report):**
- Sample 5% of pages for content quality
- Verify 10 critical formulas against Notion source
- Check each required view renders correctly
- Sign off or flag issues for agent repair

This mirrors the "test vault first" approach in prior-findings: verify a sample before declaring the full migration done.

[SOURCE: prior-findings.md §4 — test vault first approach]
[SOURCE: prior-findings.md §5 — acceptance checklist pattern]

## Sources Consulted
- prior-findings.md §4, §5
- mcp-obsidian SKILL.md §7
- mcp-notion/references/mcp-tools.md §5
- https://obsidian.md/help/import/notion

## Assessment
- newInfoRatio: 0.85
- noveltyJustification: "Full automated parity script, two-pass verification strategy, and manual-gap analysis — prior-findings only named the checklist idea without implementation detail"
- Confidence: High — each check maps to a concrete mcp-obsidian CLI command

## Reflection
- What worked: The pseudocode script is directly implementable in the build phase — no tool gaps
- What failed: Cannot test the script without a real vault (phase 002+ concern)
- Ruled out: Expecting 100% automated verification — formula parity and visual layout are inherently manual

## Recommended Next Focus
KQ-9: Can the AI agent drive the migration programmatically via mcp-notion + mcp-obsidian, or is human-in-the-loop always required for the Importer step?