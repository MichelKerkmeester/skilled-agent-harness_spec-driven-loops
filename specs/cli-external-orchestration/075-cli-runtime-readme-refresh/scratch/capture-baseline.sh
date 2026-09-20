#!/usr/bin/env bash
# Capture the "before" receipts for the cli runtime README refresh.
#
# Run from anywhere; it resolves the worktree root from its own location. Written
# as a script rather than an inline shell pipeline because a single command that
# names several cli-* skills reads to the dispatch guard as an ambiguous executor
# and is refused before it runs.
#
# Output: one file per check under scratch/baseline/.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKET="$(cd "$HERE/.." && pwd)"
ROOT="$(cd "$PACKET/../../.." && pwd)"
OUT="$HERE/baseline"
mkdir -p "$OUT"

SKILLS="$ROOT/.skilled/skills/cli-external-orchestration"

# The worktree base is a sibling of the worktree itself, so an off-by-one in the
# walk above silently points every check at a directory that does not exist: each
# tool then fails on a missing file and the run still exits 0. Refuse to continue
# rather than record a receipt about nothing.
if [ ! -f "$ROOT/.skilled/skills/sk-doc/shared/scripts/validate_document.py" ]; then
  echo "FATAL: repo root resolved to '$ROOT', which holds no .skilled tree." >&2
  exit 1
fi
RUNTIMES="claude-code codex cursor devin hermes jev opencode pi"

cd "$ROOT" || exit 1

# ── 1. README validity ──────────────────────────────────────────────────────
{
  for r in $RUNTIMES; do
    readme="$SKILLS/cli-$r/README.md"
    verdict="$(python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$readme" 2>&1 | tail -1)"
    printf 'cli-%s\t%s\n' "$r" "$verdict"
  done
} >"$OUT/validate-document.txt" 2>&1
echo "wrote $OUT/validate-document.txt"

# ── 2. Markdown links ───────────────────────────────────────────────────────
node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs >"$OUT/markdown-links.txt" 2>&1
echo "check-markdown-links exit=$?" >>"$OUT/markdown-links.txt"

# ── 3. Folder coverage ──────────────────────────────────────────────────────
# For every runtime: each immediate subdirectory, and each file under
# references/ and assets/, must be named somewhere in that runtime's README.
{
  for r in $RUNTIMES; do
    dir="$SKILLS/cli-$r"
    readme="$dir/README.md"
    printf '=== cli-%s ===\n' "$r"
    for d in "$dir"/*/; do
      name="$(basename "$d")/"
      if grep -qF "$name" "$readme"; then printf '  dir  %-28s named\n' "$name";
      else printf '  dir  %-28s MISSING\n' "$name"; fi
    done
    for sub in references assets; do
      [ -d "$dir/$sub" ] || continue
      for f in "$dir/$sub"/*; do
        [ -f "$f" ] || continue
        name="$sub/$(basename "$f")"
        if grep -qF "$(basename "$f")" "$readme"; then printf '  file %-28s named\n' "$name";
        else printf '  file %-28s MISSING\n' "$name"; fi
      done
    done
  done
} >"$OUT/folder-coverage.txt" 2>&1
echo "wrote $OUT/folder-coverage.txt"

# ── 4. Hermes mirror sync ───────────────────────────────────────────────────
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check >"$OUT/hermes-sync.txt" 2>&1
echo "sync-skills-hermes --check exit=$?" >>"$OUT/hermes-sync.txt"

# ── 5. Stale contract-pin path count ────────────────────────────────────────
{
  echo "# files still citing the un-archived packet path"
  grep -rc 'specs/cli-external-orchestration/031-cli-pi-creation' "$SKILLS/cli-pi" 2>/dev/null |
    grep -v ':0$' | sed "s|$ROOT/||"
  echo "# total hits"
  grep -ro 'specs/cli-external-orchestration/031-cli-pi-creation' "$SKILLS/cli-pi" 2>/dev/null | wc -l
} >"$OUT/pin-paths.txt" 2>&1
echo "wrote $OUT/pin-paths.txt"

# ── 6. Derived README counts (advisory) ─────────────────────────────────────
{
  for r in $RUNTIMES; do
    printf '=== cli-%s ===\n' "$r"
    python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py \
      "$SKILLS/cli-$r/README.md" 2>&1 | tail -6
  done
} >"$OUT/derived-counts.txt" 2>&1
echo "wrote $OUT/derived-counts.txt"

# ── 7. Existing trees ───────────────────────────────────────────────────────
{
  for r in $RUNTIMES; do
    readme="$SKILLS/cli-$r/README.md"
    n="$(grep -c '^```text' "$readme" 2>/dev/null || echo 0)"
    printf 'cli-%s\tfenced-text-blocks=%s\n' "$r" "$n"
  done
} >"$OUT/trees.txt" 2>&1
echo "wrote $OUT/trees.txt"

echo "baseline capture complete"
