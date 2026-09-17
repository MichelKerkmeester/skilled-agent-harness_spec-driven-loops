#!/usr/bin/env bash
# WHY: A migration is only as trustworthy as its verification. This script runs the
# 11-check parity pass against a vault so a Notion-to-Obsidian import can be proven,
# not just assumed. It never mutates the vault -- every check is read-only.
#
# Checks that compare vault content against Notion's source of truth (expected page
# list, source attachment count, Notion schema, formula values, comment counts, view
# counts, parent tree) need a migration ledger and print SKIP when none is given, so
# the script still runs standalone right after a fresh plugin install, before any
# migration has produced a ledger. Checks that only need the vault itself (link
# validation, property-type sanity, relation resolution) always run.
#
# Ledger format (optional, JSON):
#   {
#     "pages": ["Page Title A", "Page Title B"],
#     "attachments_count": 42,
#     "databases": {
#       "Projects": { "row_count": 12, "schema": ["status", "owner", "due"], "views": 3 }
#     },
#     "formulas": [
#       { "note": "Projects/Website Relaunch.md", "field": "total_hours", "expected": "42" }
#     ],
#     "comments": { "Projects/Website Relaunch.md": 3 },
#     "hierarchy": [
#       { "path": "Projects/Website Relaunch/Design homepage.md", "parent": "Website Relaunch" }
#     ]
#   }
# Every top-level key is optional; the check that needs it SKIPs when absent.

set -uo pipefail

VAULT=""
LEDGER=""
HAVE_LEDGER=0

PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

usage() {
  cat <<'EOF'
Usage: verify-notion-migration-parity.sh --vault <path> [--ledger <path>]

Runs the 11-check Notion-to-Obsidian migration parity protocol against a vault.

  --vault <path>    Required. Path to the Obsidian vault to verify.
  --ledger <path>   Optional. Path to a migration ledger JSON file (see the header
                    comment in this script for the expected shape). Checks that need
                    a Notion-source count or schema print SKIP when this is omitted.
  -h, --help        Show this help and exit.

Exit code is 0 unless at least one check reports FAIL.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --vault)
      VAULT="${2:-}"
      shift 2
      ;;
    --ledger)
      LEDGER="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

if [ -z "$VAULT" ]; then
  echo "error: --vault <path> is required" >&2
  usage
  exit 2
fi

if [ ! -d "$VAULT" ]; then
  echo "error: vault path does not exist or is not a directory: $VAULT" >&2
  exit 2
fi

if [ -n "$LEDGER" ]; then
  if [ ! -f "$LEDGER" ]; then
    echo "error: ledger path does not exist: $LEDGER" >&2
    exit 2
  fi
  if ! command -v jq >/dev/null 2>&1; then
    echo "error: jq is required to read a ledger; install jq or omit --ledger" >&2
    exit 2
  fi
  if ! jq empty "$LEDGER" >/dev/null 2>&1; then
    echo "error: ledger is not valid JSON: $LEDGER" >&2
    exit 2
  fi
  HAVE_LEDGER=1
fi

# ---------------------------------------------------------------------------
# Result reporting
# ---------------------------------------------------------------------------

result() {
  local status="$1" check="$2" reason="$3"
  case "$status" in
    PASS) PASS_COUNT=$((PASS_COUNT + 1)) ;;
    FAIL) FAIL_COUNT=$((FAIL_COUNT + 1)) ;;
    SKIP) SKIP_COUNT=$((SKIP_COUNT + 1)) ;;
  esac
  printf '%-4s [%s] %s\n' "$status" "$check" "$reason"
}

skip_no_ledger() {
  result SKIP "$1" "no ledger provided -- cannot compare against the Notion source"
}

# ---------------------------------------------------------------------------
# Frontmatter helpers (best-effort scalar YAML frontmatter reader; a note's
# frontmatter is the block between the first two lines that are exactly "---")
# ---------------------------------------------------------------------------

frontmatter_block() {
  awk '
    /^---[ \t]*$/ { n++; if (n == 1) { started = 1; next } else if (n == 2) { exit } }
    started { print }
  ' "$1" 2>/dev/null
}

frontmatter_keys() {
  # Top-level keys only: lines with no leading whitespace, ending in ":" or "key: value".
  frontmatter_block "$1" | grep -E '^[A-Za-z0-9_.-]+:' | sed -E 's/:.*$//'
}

frontmatter_value() {
  local file="$1" key="$2"
  frontmatter_block "$file" | awk -F': ' -v k="$key" '
    $0 ~ "^" k ":" {
      sub("^" k ":[ \t]*", "")
      gsub(/^"|"$/, "")
      print
      exit
    }
  '
}

all_notes() {
  find "$VAULT" -type f -name '*.md' ! -path '*/.obsidian/*' ! -path '*/.git/*' 2>/dev/null
}

# ---------------------------------------------------------------------------
# 1. Page existence -- expected pages (ledger) vs vault file list
# ---------------------------------------------------------------------------

check_page_existence() {
  local id="1/11 page-existence"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local expected_count missing=0 missing_names="" title
  expected_count="$(jq -r '(.pages // []) | length' "$LEDGER")"
  if [ "$expected_count" -eq 0 ]; then
    result PASS "$id" "ledger declares 0 expected pages, nothing to compare"
    return
  fi

  local notes_lower
  notes_lower="$(all_notes | sed -E 's|.*/||; s|\.md$||' | tr '[:upper:]' '[:lower:]' | sort -u)"

  while IFS= read -r title; do
    [ -z "$title" ] && continue
    local needle
    needle="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]')"
    if ! printf '%s\n' "$notes_lower" | grep -qxF "$needle"; then
      missing=$((missing + 1))
      missing_names="$missing_names, $title"
    fi
  done < <(jq -r '.pages[]?' "$LEDGER")

  if [ "$missing" -eq 0 ]; then
    result PASS "$id" "all $expected_count expected pages found in vault"
  else
    result FAIL "$id" "$missing/$expected_count expected pages missing:${missing_names#,}"
  fi
}

# ---------------------------------------------------------------------------
# 2. Link validation -- orphaned [[wikilinks]] anywhere in the vault
# ---------------------------------------------------------------------------

check_link_validation() {
  local id="2/11 link-validation"
  local notes note_count
  notes="$(all_notes)"
  note_count="$(printf '%s\n' "$notes" | grep -c . || true)"
  if [ "$note_count" -eq 0 ]; then
    result PASS "$id" "no notes found; nothing to check"
    return
  fi

  local names_lower
  names_lower="$(printf '%s\n' "$notes" | sed -E 's|.*/||; s|\.md$||' | tr '[:upper:]' '[:lower:]' | sort -u)"

  local orphans=0 total=0 sample=""
  while IFS= read -r note; do
    [ -z "$note" ] && continue
    while IFS= read -r target; do
      [ -z "$target" ] && continue
      target="${target%%|*}"
      target="${target%%#*}"
      total=$((total + 1))
      local needle
      needle="$(printf '%s' "$target" | tr '[:upper:]' '[:lower:]')"
      if ! printf '%s\n' "$names_lower" | grep -qxF "$needle"; then
        orphans=$((orphans + 1))
        [ "$orphans" -le 3 ] && sample="$sample, [[$target]] in ${note#"$VAULT"/}"
      fi
    done < <(grep -ohE '\[\[[^][]+\]\]' "$note" 2>/dev/null | sed -E 's/^\[\[//; s/\]\]$//')
  done <<EOF
$notes
EOF

  if [ "$orphans" -eq 0 ]; then
    result PASS "$id" "$total wikilink(s) checked across $note_count note(s), none orphaned"
  else
    result FAIL "$id" "$orphans/$total wikilink(s) orphaned:${sample#,}"
  fi
}

# ---------------------------------------------------------------------------
# 3. Attachment integrity -- non-markdown file count vs Notion source
# ---------------------------------------------------------------------------

check_attachment_integrity() {
  local id="3/11 attachment-integrity"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local expected actual
  expected="$(jq -r '.attachments_count // empty' "$LEDGER")"
  if [ -z "$expected" ]; then
    result SKIP "$id" "ledger has no attachments_count field"
    return
  fi
  actual="$(find "$VAULT" -type f ! -name '*.md' ! -path '*/.obsidian/*' ! -path '*/.git/*' 2>/dev/null | grep -c . || true)"

  if [ "$actual" -eq "$expected" ]; then
    result PASS "$id" "$actual/$expected attachment file(s) present"
  else
    result FAIL "$id" "$actual attachment file(s) present, expected $expected"
  fi
}

# ---------------------------------------------------------------------------
# 4. Database row count -- per-folder note count vs ledger row_count
# ---------------------------------------------------------------------------

check_row_count() {
  local id="4/11 database-row-count"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local db_names db_count=0 mismatches=0 detail=""
  db_names="$(jq -r '(.databases // {}) | keys[]?' "$LEDGER")"
  if [ -z "$db_names" ]; then
    result PASS "$id" "ledger declares 0 databases, nothing to compare"
    return
  fi

  local name expected actual folder
  while IFS= read -r name; do
    [ -z "$name" ] && continue
    db_count=$((db_count + 1))
    expected="$(jq -r --arg n "$name" '.databases[$n].row_count // empty' "$LEDGER")"
    [ -z "$expected" ] && continue
    folder="$VAULT/$name"
    if [ -d "$folder" ]; then
      actual="$(find "$folder" -maxdepth 1 -type f -name '*.md' ! -name '_database.md' 2>/dev/null | grep -c . || true)"
    else
      actual=0
    fi
    if [ "$actual" -ne "$expected" ]; then
      mismatches=$((mismatches + 1))
      detail="$detail, $name: $actual/$expected"
    fi
  done <<EOF
$db_names
EOF

  if [ "$mismatches" -eq 0 ]; then
    result PASS "$id" "row counts match for all $db_count database(s) in ledger"
  else
    result FAIL "$id" "$mismatches/$db_count database(s) mismatched:${detail#,}"
  fi
}

# ---------------------------------------------------------------------------
# 5. Property schema parity -- Notion schema (ledger) vs frontmatter key union
# ---------------------------------------------------------------------------

check_schema_parity() {
  local id="5/11 property-schema-parity"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local db_names db_count=0 mismatches=0 detail=""
  db_names="$(jq -r '(.databases // {}) | keys[]?' "$LEDGER")"
  if [ -z "$db_names" ]; then
    result PASS "$id" "ledger declares 0 databases, nothing to compare"
    return
  fi

  local name folder schema_keys actual_keys missing note
  while IFS= read -r name; do
    [ -z "$name" ] && continue
    schema_keys="$(jq -r --arg n "$name" '(.databases[$n].schema // [])[]?' "$LEDGER")"
    [ -z "$schema_keys" ] && continue
    db_count=$((db_count + 1))
    folder="$VAULT/$name"
    actual_keys=""
    if [ -d "$folder" ]; then
      while IFS= read -r note; do
        [ -z "$note" ] && continue
        actual_keys="$actual_keys
$(frontmatter_keys "$note")"
      done < <(find "$folder" -maxdepth 1 -type f -name '*.md' ! -name '_database.md' 2>/dev/null)
    fi
    actual_keys="$(printf '%s\n' "$actual_keys" | tr '[:upper:]' '[:lower:]' | sort -u)"

    missing=""
    while IFS= read -r key; do
      [ -z "$key" ] && continue
      local needle
      needle="$(printf '%s' "$key" | tr '[:upper:]' '[:lower:]')"
      if ! printf '%s\n' "$actual_keys" | grep -qxF "$needle"; then
        missing="$missing, $key"
      fi
    done <<EOF2
$schema_keys
EOF2

    if [ -n "$missing" ]; then
      mismatches=$((mismatches + 1))
      detail="$detail, $name missing:${missing#,}"
    fi
  done <<EOF
$db_names
EOF

  if [ "$db_count" -eq 0 ]; then
    result PASS "$id" "ledger declares no database schema to compare"
  elif [ "$mismatches" -eq 0 ]; then
    result PASS "$id" "frontmatter keys cover the declared schema for all $db_count database(s)"
  else
    result FAIL "$id" "$mismatches/$db_count database(s) missing declared schema keys:${detail#,}"
  fi
}

# ---------------------------------------------------------------------------
# 6. Formula output accuracy -- sample field values vs Notion source
# ---------------------------------------------------------------------------

check_formula_accuracy() {
  local id="6/11 formula-output-accuracy"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local total mismatches=0 detail=""
  total="$(jq -r '(.formulas // []) | length' "$LEDGER")"
  if [ "$total" -eq 0 ]; then
    result PASS "$id" "ledger declares 0 formula samples, nothing to compare"
    return
  fi

  local i note field expected actual
  i=0
  while [ "$i" -lt "$total" ]; do
    note="$(jq -r ".formulas[$i].note" "$LEDGER")"
    field="$(jq -r ".formulas[$i].field" "$LEDGER")"
    expected="$(jq -r ".formulas[$i].expected" "$LEDGER")"
    if [ -f "$VAULT/$note" ]; then
      actual="$(frontmatter_value "$VAULT/$note" "$field")"
    else
      actual=""
    fi
    if [ "$actual" != "$expected" ]; then
      mismatches=$((mismatches + 1))
      detail="$detail, $note#$field: got '${actual:-<missing>}' expected '$expected'"
    fi
    i=$((i + 1))
  done

  if [ "$mismatches" -eq 0 ]; then
    result PASS "$id" "all $total formula sample(s) matched the Notion source"
  else
    result FAIL "$id" "$mismatches/$total formula sample(s) mismatched:${detail#,}"
  fi
}

# ---------------------------------------------------------------------------
# 7. Comment count parity -- reconstructed "## Comments" section vs ledger
# ---------------------------------------------------------------------------

check_comment_parity() {
  local id="7/11 comment-count-parity"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local notes note_count=0
  notes="$(jq -r '(.comments // {}) | keys[]?' "$LEDGER")"
  if [ -z "$notes" ]; then
    result PASS "$id" "ledger declares 0 comment counts, nothing to compare"
    return
  fi

  local note expected actual mismatches=0 detail=""
  while IFS= read -r note; do
    [ -z "$note" ] && continue
    note_count=$((note_count + 1))
    expected="$(jq -r --arg n "$note" '.comments[$n]' "$LEDGER")"
    if [ -f "$VAULT/$note" ]; then
      # Count "### " sub-headings between the "## Comments" heading and the next "## " heading.
      actual="$(awk '
        /^## Comments[ \t]*$/ { inblock = 1; next }
        /^## / { inblock = 0 }
        inblock && /^### / { count++ }
        END { print count + 0 }
      ' "$VAULT/$note")"
    else
      actual=0
    fi
    if [ "$actual" -ne "$expected" ]; then
      mismatches=$((mismatches + 1))
      detail="$detail, $note: $actual/$expected"
    fi
  done <<EOF
$notes
EOF

  if [ "$mismatches" -eq 0 ]; then
    result PASS "$id" "comment counts match for all $note_count note(s) in ledger"
  else
    result FAIL "$id" "$mismatches/$note_count note(s) mismatched:${detail#,}"
  fi
}

# ---------------------------------------------------------------------------
# 8. View count parity -- "_database.md" views: list vs ledger
# ---------------------------------------------------------------------------

check_view_count() {
  local id="8/11 view-count-parity"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local db_names db_count=0 mismatches=0 detail=""
  db_names="$(jq -r '(.databases // {}) | keys[]?' "$LEDGER")"
  if [ -z "$db_names" ]; then
    result PASS "$id" "ledger declares 0 databases, nothing to compare"
    return
  fi

  local name expected actual schema_file
  while IFS= read -r name; do
    [ -z "$name" ] && continue
    expected="$(jq -r --arg n "$name" '.databases[$n].views // empty' "$LEDGER")"
    [ -z "$expected" ] && continue
    db_count=$((db_count + 1))
    schema_file="$VAULT/$name/_database.md"
    if [ -f "$schema_file" ]; then
      actual="$(grep -cE '^[ \t]*-[ \t]+name:' "$schema_file" 2>/dev/null || true)"
    else
      actual=0
    fi
    if [ "$actual" -ne "$expected" ]; then
      mismatches=$((mismatches + 1))
      detail="$detail, $name: $actual/$expected"
    fi
  done <<EOF
$db_names
EOF

  if [ "$db_count" -eq 0 ]; then
    result PASS "$id" "ledger declares no view counts to compare"
  elif [ "$mismatches" -eq 0 ]; then
    result PASS "$id" "view counts match for all $db_count database(s) in ledger"
  else
    result FAIL "$id" "$mismatches/$db_count database(s) mismatched:${detail#,}"
  fi
}

# ---------------------------------------------------------------------------
# 9. Hierarchy parity -- folder nesting vs Notion parent tree
# ---------------------------------------------------------------------------

check_hierarchy_parity() {
  local id="9/11 hierarchy-parity"
  if [ "$HAVE_LEDGER" -eq 0 ]; then skip_no_ledger "$id"; return; fi

  local total mismatches=0 detail=""
  total="$(jq -r '(.hierarchy // []) | length' "$LEDGER")"
  if [ "$total" -eq 0 ]; then
    result PASS "$id" "ledger declares 0 hierarchy entries, nothing to compare"
    return
  fi

  local i path expected_parent actual_parent
  i=0
  while [ "$i" -lt "$total" ]; do
    path="$(jq -r ".hierarchy[$i].path" "$LEDGER")"
    expected_parent="$(jq -r ".hierarchy[$i].parent" "$LEDGER")"
    if [ -f "$VAULT/$path" ]; then
      actual_parent="$(basename "$(dirname "$VAULT/$path")")"
    else
      actual_parent="<missing note>"
    fi
    if [ "$actual_parent" != "$expected_parent" ]; then
      mismatches=$((mismatches + 1))
      detail="$detail, $path: parent '$actual_parent' expected '$expected_parent'"
    fi
    i=$((i + 1))
  done

  if [ "$mismatches" -eq 0 ]; then
    result PASS "$id" "all $total hierarchy entry/entries match the Notion parent tree"
  else
    result FAIL "$id" "$mismatches/$total hierarchy entries mismatched:${detail#,}"
  fi
}

# ---------------------------------------------------------------------------
# 10. Property-type mismatch -- frontmatter values that contradict a known type
# ---------------------------------------------------------------------------

check_property_type_mismatch() {
  local id="10/11 property-type-mismatch"
  local notes note_count
  notes="$(all_notes)"
  note_count="$(printf '%s\n' "$notes" | grep -c . || true)"
  if [ "$note_count" -eq 0 ]; then
    result PASS "$id" "no notes found; nothing to check"
    return
  fi

  # Structural sanity, no Notion source needed: a broken conversion typically leaves a
  # literal token (NaN, undefined, [object Object], or an unresolved template tag)
  # in frontmatter rather than a real value.
  local hits=0 sample=""
  local note
  while IFS= read -r note; do
    [ -z "$note" ] && continue
    if frontmatter_block "$note" | grep -qE ':[[:space:]]*(NaN|undefined|\[object Object\]|<%.*%>)[[:space:]]*$'; then
      hits=$((hits + 1))
      [ "$hits" -le 3 ] && sample="$sample, ${note#"$VAULT"/}"
    fi
  done <<EOF
$notes
EOF

  if [ "$hits" -eq 0 ]; then
    result PASS "$id" "$note_count note(s) scanned, no broken-conversion tokens in frontmatter"
  else
    result FAIL "$id" "$hits note(s) with a broken-conversion token in frontmatter:${sample#,}"
  fi
}

# ---------------------------------------------------------------------------
# 11. Relation resolution -- every relation value is a resolvable [[wikilink]],
#     never a leftover raw Notion UUID
# ---------------------------------------------------------------------------

check_relation_resolution() {
  local id="11/11 relation-resolution"
  local notes note_count
  notes="$(all_notes)"
  note_count="$(printf '%s\n' "$notes" | grep -c . || true)"
  if [ "$note_count" -eq 0 ]; then
    result PASS "$id" "no notes found; nothing to check"
    return
  fi

  local uuid_re='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
  local hits=0 sample=""
  local note
  while IFS= read -r note; do
    [ -z "$note" ] && continue
    # A raw UUID inside frontmatter that is NOT wrapped in [[ ]] is an unresolved relation.
    if frontmatter_block "$note" | grep -oE "$uuid_re" 2>/dev/null | grep -q .; then
      if ! frontmatter_block "$note" | grep -qE "\[\[[^]]*${uuid_re}[^]]*\]\]"; then
        hits=$((hits + 1))
        [ "$hits" -le 3 ] && sample="$sample, ${note#"$VAULT"/}"
      fi
    fi
  done <<EOF
$notes
EOF

  if [ "$hits" -eq 0 ]; then
    result PASS "$id" "$note_count note(s) scanned, no unresolved raw Notion UUIDs in frontmatter"
  else
    result FAIL "$id" "$hits note(s) with an unresolved raw UUID in frontmatter:${sample#,}"
  fi
}

# ---------------------------------------------------------------------------
# Run all 11 checks
# ---------------------------------------------------------------------------

echo "== verify-notion-migration-parity =="
echo "Vault:  $VAULT"
if [ "$HAVE_LEDGER" -eq 1 ]; then
  echo "Ledger: $LEDGER"
else
  echo "Ledger: (none -- Notion-source-comparison checks will SKIP)"
fi
echo ""

check_page_existence
check_link_validation
check_attachment_integrity
check_row_count
check_schema_parity
check_formula_accuracy
check_comment_parity
check_view_count
check_hierarchy_parity
check_property_type_mismatch
check_relation_resolution

echo ""
echo "== Summary: $PASS_COUNT passed, $FAIL_COUNT failed, $SKIP_COUNT skipped =="

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
exit 0
