#!/usr/bin/env bash
# cleanup-output.sh — Remove old visual-explainer output files
# Usage: ./cleanup-output.sh [--force] [--days N] [--dir PATH]
# Default: dry-run mode — shows what would be deleted without deleting anything
# --force: actually delete files
# --days N: override max age (default: 30 days)
# --dir PATH: override output directory (default: .opencode/output/visual)

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
DIM='\033[2m'
RESET='\033[0m'
BOLD='\033[1m'

# ── Defaults ──────────────────────────────────────────────────────────────────
FORCE=false
MAX_AGE_DAYS=30
OUTPUT_DIR=".opencode/output/visual"

# ── Argument parsing ──────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)
      FORCE=true
      shift
      ;;
    --days)
      if [[ -z "${2:-}" ]] || ! [[ "$2" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}Error:${RESET} --days requires a positive integer argument"
        exit 2
      fi
      MAX_AGE_DAYS="$2"
      shift 2
      ;;
    --dir)
      if [[ -z "${2:-}" ]]; then
        echo -e "${RED}Error:${RESET} --dir requires a path argument"
        exit 2
      fi
      OUTPUT_DIR="$2"
      shift 2
      ;;
    -h|--help)
      echo ""
      echo -e "${BOLD}cleanup-output.sh${RESET} — Remove old visual-explainer output files"
      echo ""
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --force         Actually delete files (default: dry-run only)"
      echo "  --days N        Max file age in days before deletion (default: ${MAX_AGE_DAYS})"
      echo "  --dir PATH      Output directory to clean (default: ${OUTPUT_DIR})"
      echo "  -h, --help      Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0                    # Dry-run: show what would be deleted"
      echo "  $0 --force            # Delete files older than 30 days"
      echo "  $0 --force --days 7   # Delete files older than 7 days"
      echo "  $0 --dir /tmp/vis     # Dry-run on a custom directory"
      echo ""
      exit 0
      ;;
    *)
      echo -e "${RED}Error:${RESET} Unknown argument: $1"
      echo "Use --help for usage information."
      exit 2
      ;;
  esac
done

# ── Header ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Visual Explainer — Output Cleanup${RESET}"
echo -e "${DIM}Directory: ${OUTPUT_DIR}${RESET}"
echo -e "${DIM}Max age:   ${MAX_AGE_DAYS} days${RESET}"
echo -e "${DIM}Mode:      $(${FORCE} && echo 'DELETE (--force)' || echo 'Dry-run (no changes)')${RESET}"
echo -e "${DIM}$(date '+%Y-%m-%d %H:%M:%S')${RESET}"
echo ""

# ── CHECK 1: Output directory exists ─────────────────────────────────────────
if [[ ! -d "$OUTPUT_DIR" ]]; then
  echo -e "${YELLOW}Directory does not exist: ${OUTPUT_DIR}${RESET}"
  echo -e "${DIM}Nothing to clean up.${RESET}"
  echo ""
  exit 0
fi

# Resolve to absolute path for display clarity
ABS_OUTPUT_DIR="$(cd "$OUTPUT_DIR" && pwd)"

# ── CHECK 2: Directory is readable and non-empty ──────────────────────────────
if [[ ! -r "$OUTPUT_DIR" ]]; then
  echo -e "${RED}Error:${RESET} Directory is not readable: ${ABS_OUTPUT_DIR}"
  exit 2
fi

# Count total HTML files in the directory (and subdirectories)
TOTAL_FILES=$(find "$OUTPUT_DIR" -type f -name "*.html" 2>/dev/null | wc -l | tr -d ' ')

if [[ "$TOTAL_FILES" -eq 0 ]]; then
  echo -e "${DIM}No HTML files found in ${ABS_OUTPUT_DIR}${RESET}"
  echo -e "${GREEN}Nothing to clean up.${RESET}"
  echo ""
  exit 0
fi

echo -e "Total HTML files found: ${BOLD}${TOTAL_FILES}${RESET}"
echo ""

# ── CHECK 3: Find files older than MAX_AGE_DAYS ───────────────────────────────
echo -e "Scanning for files older than ${BOLD}${MAX_AGE_DAYS} days${RESET}..."
echo ""

# Build the list of old files using find -mtime
# macOS and Linux both support -mtime +N (strictly older than N days)
OLD_FILES=()
while IFS= read -r -d $'\0' file; do
  OLD_FILES+=("$file")
done < <(find "$OUTPUT_DIR" -type f -name "*.html" -mtime +"$MAX_AGE_DAYS" -print0 2>/dev/null)

if [[ ${#OLD_FILES[@]} -eq 0 ]]; then
  echo -e "${GREEN}No files older than ${MAX_AGE_DAYS} days.${RESET}"
  echo -e "${DIM}All ${TOTAL_FILES} file(s) are within the retention window.${RESET}"
  echo ""
  exit 0
fi

# ── Compute total size of old files ──────────────────────────────────────────
TOTAL_BYTES=0
for file in "${OLD_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    FILE_BYTES=$(wc -c < "$file" 2>/dev/null | tr -d ' ' || echo 0)
    TOTAL_BYTES=$(( TOTAL_BYTES + FILE_BYTES ))
  fi
done

# Human-readable size
if [[ $TOTAL_BYTES -ge 1048576 ]]; then
  TOTAL_SIZE="$(( TOTAL_BYTES / 1048576 )) MB"
elif [[ $TOTAL_BYTES -ge 1024 ]]; then
  TOTAL_SIZE="$(( TOTAL_BYTES / 1024 )) KB"
else
  TOTAL_SIZE="${TOTAL_BYTES} bytes"
fi

# ── List files ────────────────────────────────────────────────────────────────
echo -e "Found ${BOLD}${#OLD_FILES[@]}${RESET} file(s) older than ${MAX_AGE_DAYS} days (${TOTAL_SIZE} total):"
echo ""

DELETE_ERRORS=0
DELETED_COUNT=0

for file in "${OLD_FILES[@]}"; do
  # Get file age in days for display
  if [[ "$(uname)" == "Darwin" ]]; then
    # macOS: use stat -f %m for modification time in epoch seconds
    MTIME=$(stat -f '%m' "$file" 2>/dev/null || echo 0)
  else
    # Linux: use stat -c %Y
    MTIME=$(stat -c '%Y' "$file" 2>/dev/null || echo 0)
  fi

  NOW=$(date +%s)
  AGE_SECONDS=$(( NOW - MTIME ))
  AGE_DAYS=$(( AGE_SECONDS / 86400 ))

  # File size
  FILE_BYTES=$(wc -c < "$file" 2>/dev/null | tr -d ' ' || echo 0)
  if [[ $FILE_BYTES -ge 1048576 ]]; then
    FILE_SIZE="$(( FILE_BYTES / 1048576 )) MB"
  elif [[ $FILE_BYTES -ge 1024 ]]; then
    FILE_SIZE="$(( FILE_BYTES / 1024 )) KB"
  else
    FILE_SIZE="${FILE_BYTES} B"
  fi

  if $FORCE; then
    # DELETE MODE
    if rm "$file" 2>/dev/null; then
      echo -e "  ${RED}deleted${RESET}  ${DIM}${file}${RESET}  ${DIM}(${AGE_DAYS}d old, ${FILE_SIZE})${RESET}"
      DELETED_COUNT=$(( DELETED_COUNT + 1 ))
    else
      echo -e "  ${RED}ERROR${RESET}    ${file}  ${DIM}(failed to delete)${RESET}"
      DELETE_ERRORS=$(( DELETE_ERRORS + 1 ))
    fi
  else
    # DRY-RUN MODE
    echo -e "  ${YELLOW}would delete${RESET}  ${file}  ${DIM}(${AGE_DAYS}d old, ${FILE_SIZE})${RESET}"
  fi
done

echo ""

# ── Summary ───────────────────────────────────────────────────────────────────
echo "──────────────────────────────────────────────────"
echo -e "${BOLD}Summary${RESET}"
echo "──────────────────────────────────────────────────"
echo -e "  Candidates found: ${#OLD_FILES[@]}"
echo -e "  Total size:       ${TOTAL_SIZE}"

if $FORCE; then
  echo -e "  ${GREEN}Deleted:${RESET}          ${DELETED_COUNT}"
  if [[ $DELETE_ERRORS -gt 0 ]]; then
    echo -e "  ${RED}Errors:${RESET}           ${DELETE_ERRORS}"
  fi
  echo ""
  if [[ $DELETE_ERRORS -gt 0 ]]; then
    echo -e "${RED}Completed with ${DELETE_ERRORS} error(s).${RESET}"
    exit 2
  else
    echo -e "${GREEN}Done. ${DELETED_COUNT} file(s) deleted.${RESET}"
  fi
else
  echo ""
  echo -e "${YELLOW}Dry-run mode — no files were deleted.${RESET}"
  echo -e "${DIM}Run with ${RESET}${BOLD}--force${RESET}${DIM} to actually delete the files listed above.${RESET}"
  echo ""
  echo -e "  ${DIM}Example: $0 --force${RESET}"
  if [[ $MAX_AGE_DAYS -ne 30 ]]; then
    echo -e "  ${DIM}Example: $0 --force --days ${MAX_AGE_DAYS}${RESET}"
  fi
fi

echo ""
exit 0
