#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOC VISUAL OUTPUT CLEANUP
# ───────────────────────────────────────────────────────────────
# Remove old sk-doc-visual HTML artifacts from the output folder.
#
# Usage: ./cleanup-output.sh [--force] [--days N] [--dir PATH]
#
# Exit Codes:
#   0 - Success
#   2 - Invalid arguments or deletion/read failures

set -euo pipefail


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_NAME
readonly DEFAULT_MAX_AGE_DAYS=30
readonly DEFAULT_OUTPUT_DIR=".opencode/output/visual"
readonly BYTES_IN_KB=1024
readonly BYTES_IN_MB=1048576
readonly SECONDS_PER_DAY=86400

FORCE=false
MAX_AGE_DAYS="${DEFAULT_MAX_AGE_DAYS}"
OUTPUT_DIR="${DEFAULT_OUTPUT_DIR}"


# ───────────────────────────────────────────────────────────────
# 2. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
  RED='' YELLOW='' GREEN='' DIM='' BOLD='' NC=''
fi


# ───────────────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

show_help() {
  cat <<EOF_HELP
${SCRIPT_NAME} - Remove old sk-doc-visual output files

Usage:
  ${SCRIPT_NAME} [options]

Options:
  --force         Actually delete files (default: dry-run)
  --days N        Retention window in days (default: ${DEFAULT_MAX_AGE_DAYS})
  --dir PATH      Output directory (default: ${DEFAULT_OUTPUT_DIR})
  -h, --help      Show this help

Examples:
  ${SCRIPT_NAME}
  ${SCRIPT_NAME} --force
  ${SCRIPT_NAME} --force --days 7
  ${SCRIPT_NAME} --dir /tmp/visual-output
EOF_HELP
}

log_info() {
  printf "%b\n" "$1"
}

log_error() {
  printf "%b\n" "$1" >&2
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --force)
        FORCE=true
        shift
        ;;
      --days)
        if [[ -z "${2:-}" ]] || ! [[ "$2" =~ ^[0-9]+$ ]] || [[ "$2" -eq 0 ]]; then
          log_error "${RED}Error:${NC} --days requires a positive integer argument"
          return 2
        fi
        MAX_AGE_DAYS="$2"
        shift 2
        ;;
      --dir)
        if [[ -z "${2:-}" ]]; then
          log_error "${RED}Error:${NC} --dir requires a path argument"
          return 2
        fi
        OUTPUT_DIR="$2"
        shift 2
        ;;
      -h|--help)
        show_help
        exit 0
        ;;
      *)
        log_error "${RED}Error:${NC} Unknown argument: $1"
        log_error "Use --help for usage information."
        return 2
        ;;
    esac
  done

  return 0
}

format_bytes() {
  local total_bytes="$1"

  if [[ "${total_bytes}" -ge "${BYTES_IN_MB}" ]]; then
    printf '%s MB' "$(( total_bytes / BYTES_IN_MB ))"
  elif [[ "${total_bytes}" -ge "${BYTES_IN_KB}" ]]; then
    printf '%s KB' "$(( total_bytes / BYTES_IN_KB ))"
  else
    printf '%s B' "${total_bytes}"
  fi
}

get_file_mtime() {
  local file="$1"

  if [[ "$(uname)" == "Darwin" ]]; then
    stat -f '%m' "${file}" 2>/dev/null || printf '0'
  else
    stat -c '%Y' "${file}" 2>/dev/null || printf '0'
  fi
}

print_header() {
  local mode_label="Dry-run (no changes)"
  if ${FORCE}; then
    mode_label="DELETE (--force)"
  fi

  log_info ""
  log_info "${BOLD}Doc Visual - Output Cleanup${NC}"
  log_info "${DIM}Directory: ${OUTPUT_DIR}${NC}"
  log_info "${DIM}Max age:   ${MAX_AGE_DAYS} days${NC}"
  log_info "${DIM}Mode:      ${mode_label}${NC}"
  log_info "${DIM}$(date '+%Y-%m-%d %H:%M:%S')${NC}"
  log_info ""
}


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

main() {
  local abs_output_dir=""
  local total_files="0"
  local total_bytes="0"
  local total_size=""
  local now_epoch=""
  local file=""
  local file_bytes="0"
  local file_size=""
  local mtime="0"
  local age_days="0"
  local delete_errors=0
  local deleted_count=0
  local -a old_files=()

  parse_args "$@"

  print_header

  if [[ ! -d "${OUTPUT_DIR}" ]]; then
    log_info "${YELLOW}Directory does not exist: ${OUTPUT_DIR}${NC}"
    log_info "${DIM}Nothing to clean up.${NC}"
    log_info ""
    return 0
  fi

  abs_output_dir="$(cd "${OUTPUT_DIR}" && pwd)"

  if [[ ! -r "${OUTPUT_DIR}" ]]; then
    log_error "${RED}Error:${NC} Directory is not readable: ${abs_output_dir}"
    return 2
  fi

  total_files="$(find "${OUTPUT_DIR}" -type f -name '*.html' 2>/dev/null | wc -l | tr -d ' ')"

  if [[ "${total_files}" -eq 0 ]]; then
    log_info "${DIM}No HTML files found in ${abs_output_dir}${NC}"
    log_info "${GREEN}Nothing to clean up.${NC}"
    log_info ""
    return 0
  fi

  log_info "Total HTML files found: ${BOLD}${total_files}${NC}"
  log_info ""
  log_info "Scanning for files older than ${BOLD}${MAX_AGE_DAYS} days${NC}..."
  log_info ""

  while IFS= read -r -d '' file; do
    old_files+=("${file}")
  done < <(find "${OUTPUT_DIR}" -type f -name '*.html' -mtime +"${MAX_AGE_DAYS}" -print0 2>/dev/null)

  if [[ ${#old_files[@]} -eq 0 ]]; then
    log_info "${GREEN}No files older than ${MAX_AGE_DAYS} days.${NC}"
    log_info "${DIM}All ${total_files} file(s) are within the retention window.${NC}"
    log_info ""
    return 0
  fi

  for file in "${old_files[@]}"; do
    if [[ -f "${file}" ]]; then
      file_bytes="$(wc -c < "${file}" 2>/dev/null | tr -d ' ' || printf '0')"
      total_bytes=$(( total_bytes + file_bytes ))
    fi
  done

  total_size="$(format_bytes "${total_bytes}")"

  log_info "Found ${BOLD}${#old_files[@]}${NC} file(s) older than ${MAX_AGE_DAYS} days (${total_size} total):"
  log_info ""

  now_epoch="$(date +%s)"

  for file in "${old_files[@]}"; do
    mtime="$(get_file_mtime "${file}")"
    age_days=$(( (now_epoch - mtime) / SECONDS_PER_DAY ))

    file_bytes="$(wc -c < "${file}" 2>/dev/null | tr -d ' ' || printf '0')"
    file_size="$(format_bytes "${file_bytes}")"

    if ${FORCE}; then
      if rm "${file}" 2>/dev/null; then
        log_info "  ${RED}deleted${NC}  ${DIM}${file}${NC}  ${DIM}(${age_days}d old, ${file_size})${NC}"
        deleted_count=$(( deleted_count + 1 ))
      else
        log_error "  ${RED}ERROR${NC}    ${file}  ${DIM}(failed to delete)${NC}"
        delete_errors=$(( delete_errors + 1 ))
      fi
    else
      log_info "  ${YELLOW}would delete${NC}  ${file}  ${DIM}(${age_days}d old, ${file_size})${NC}"
    fi
  done

  log_info ""
  log_info '----------------------------------------------'
  log_info "${BOLD}Summary${NC}"
  log_info '----------------------------------------------'
  log_info "  Candidates found: ${#old_files[@]}"
  log_info "  Total size:       ${total_size}"

  if ${FORCE}; then
    log_info "  ${GREEN}Deleted:${NC}          ${deleted_count}"
    if [[ ${delete_errors} -gt 0 ]]; then
      log_error "  ${RED}Errors:${NC}           ${delete_errors}"
    fi
    log_info ""

    if [[ ${delete_errors} -gt 0 ]]; then
      log_error "${RED}Completed with ${delete_errors} error(s).${NC}"
      return 2
    fi

    log_info "${GREEN}Done. ${deleted_count} file(s) deleted.${NC}"
    log_info ""
    return 0
  fi

  log_info ""
  log_info "${YELLOW}Dry-run mode - no files were deleted.${NC}"
  log_info "${DIM}Run with ${NC}${BOLD}--force${NC}${DIM} to delete listed files.${NC}"
  log_info "${DIM}Example: ${SCRIPT_NAME} --force${NC}"
  if [[ ${MAX_AGE_DAYS} -ne ${DEFAULT_MAX_AGE_DAYS} ]]; then
    log_info "${DIM}Example: ${SCRIPT_NAME} --force --days ${MAX_AGE_DAYS}${NC}"
  fi
  log_info ""
  return 0
}

main "$@"
