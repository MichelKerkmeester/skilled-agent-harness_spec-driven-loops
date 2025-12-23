#!/usr/bin/env bash
#
# archive-spec.sh
# Archive completed spec folders
#
# PURPOSE:
#   Move completed spec folders to archive, keeping specs/ directory clean.
#   Provides listing and restoration capabilities for archived specs.
#
# VERSION: 1.0.0
# CREATED: 2025-12-13
#
# USAGE:
#   archive-spec.sh <spec-folder>
#   archive-spec.sh --list
#   archive-spec.sh --restore <archived-folder>
#
# EXAMPLES:
#   archive-spec.sh specs/051-feature-name/
#   archive-spec.sh --list
#   archive-spec.sh --restore specs/z_archive/051-feature-name/

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
ARCHIVE_DIR="specs/z_archive"
COMPLETENESS_SCRIPT="$SCRIPT_DIR/calculate-completeness.sh"
MIN_COMPLETENESS=90

# ============================================================================
# COLORS AND FORMATTING
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

show_help() {
    cat << 'EOF'
archive-spec.sh - Archive completed spec folders

USAGE:
    archive-spec.sh <spec-folder>
    archive-spec.sh --list
    archive-spec.sh --restore <archived-folder>

OPTIONS:
    --list, -l          List all archived specs
    --restore, -r       Restore an archived spec folder
    --force, -f         Skip completeness check (archive anyway)
    --help, -h          Show this help message

EXAMPLES:
    # Archive a completed spec
    archive-spec.sh specs/051-feature-name/

    # Force archive without completeness check
    archive-spec.sh --force specs/051-feature-name/

    # List all archived specs
    archive-spec.sh --list

    # Restore an archived spec
    archive-spec.sh --restore specs/z_archive/051-feature-name/

NOTES:
    - Specs with <90% completeness will prompt for confirmation
    - Use --force to skip the completeness check
    - Archived specs are moved to specs/z_archive/
EOF
}

log_info() {
    echo -e "${BLUE}INFO:${NC} $1"
}

log_success() {
    echo -e "${GREEN}SUCCESS:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

log_error() {
    echo -e "${RED}ERROR:${NC} $1" >&2
}

# ============================================================================
# CORE FUNCTIONS
# ============================================================================

get_completeness() {
    local spec_folder="$1"

    # Check if calculate-completeness.sh exists
    if [ ! -x "$COMPLETENESS_SCRIPT" ]; then
        log_warning "Completeness script not found: $COMPLETENESS_SCRIPT"
        echo "0"
        return
    fi

    # Run the completeness script and extract the percentage
    local json_output
    json_output=$("$COMPLETENESS_SCRIPT" --json "$spec_folder" 2>/dev/null || echo '{}')

    # Extract overall_completion value from JSON
    local completeness
    completeness=$(echo "$json_output" | grep -o '"overall_completion": [0-9]*' | grep -o '[0-9]*' || echo "0")

    # Default to 100 if we can't calculate (assume complete)
    if [ -z "$completeness" ]; then
        completeness=100
    fi

    echo "$completeness"
}

archive_spec() {
    local spec_folder="$1"
    local force="${2:-false}"

    # Normalize path (remove trailing slash)
    spec_folder="${spec_folder%/}"

    # Validate folder exists
    if [ ! -d "$spec_folder" ]; then
        log_error "Spec folder not found: $spec_folder"
        exit 1
    fi

    # Check if already in archive
    if [[ "$spec_folder" == *"$ARCHIVE_DIR"* ]]; then
        log_error "Folder is already archived: $spec_folder"
        exit 1
    fi

    # Check completeness unless forced
    if [ "$force" != "true" ]; then
        local completeness
        completeness=$(get_completeness "$spec_folder")

        if [ "$completeness" -lt "$MIN_COMPLETENESS" ]; then
            log_warning "Spec is only ${completeness}% complete (minimum: ${MIN_COMPLETENESS}%)"
            echo -n "Archive anyway? (y/n): "
            read -r response
            if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
                log_info "Archive cancelled."
                exit 0
            fi
        else
            log_info "Spec completeness: ${completeness}%"
        fi
    fi

    # Create archive directory if needed
    mkdir -p "$ARCHIVE_DIR"

    # Get basename for the move
    local basename
    basename=$(basename "$spec_folder")

    # Check if target already exists
    if [ -d "$ARCHIVE_DIR/$basename" ]; then
        log_error "Archive target already exists: $ARCHIVE_DIR/$basename"
        exit 1
    fi

    # Move to archive
    mv "$spec_folder" "$ARCHIVE_DIR/$basename"

    log_success "Archived: $spec_folder -> $ARCHIVE_DIR/$basename"
}

list_archived() {
    if [ ! -d "$ARCHIVE_DIR" ]; then
        log_info "No archived specs found."
        exit 0
    fi

    local count
    count=$(find "$ARCHIVE_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')

    if [ "$count" -eq 0 ]; then
        log_info "No archived specs found."
        exit 0
    fi

    echo -e "${BOLD}Archived Specs ($count):${NC}"
    echo "================================"

    # List directories with their archive date (modification time)
    for dir in "$ARCHIVE_DIR"/*/; do
        if [ -d "$dir" ]; then
            local name
            name=$(basename "$dir")
            local date
            date=$(stat -f "%Sm" -t "%Y-%m-%d" "$dir" 2>/dev/null || stat -c "%y" "$dir" 2>/dev/null | cut -d' ' -f1)
            printf "  %-40s %s\n" "$name" "$date"
        fi
    done

    echo ""
    echo "To restore: archive-spec.sh --restore $ARCHIVE_DIR/<folder-name>"
}

restore_spec() {
    local archived_folder="$1"

    # Normalize path (remove trailing slash)
    archived_folder="${archived_folder%/}"

    # Validate folder exists
    if [ ! -d "$archived_folder" ]; then
        log_error "Archived folder not found: $archived_folder"
        exit 1
    fi

    # Validate it's in the archive directory
    if [[ "$archived_folder" != *"$ARCHIVE_DIR"* ]]; then
        log_error "Folder is not in archive directory: $archived_folder"
        log_info "Archive directory: $ARCHIVE_DIR"
        exit 1
    fi

    # Get basename for the restore
    local basename
    basename=$(basename "$archived_folder")

    # Determine destination (try to restore to original location structure)
    local destination="specs/$basename"

    # Check if target already exists
    if [ -d "$destination" ]; then
        log_error "Restore target already exists: $destination"
        exit 1
    fi

    # Move from archive
    mv "$archived_folder" "$destination"

    log_success "Restored: $archived_folder -> $destination"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    # Change to project root for consistent paths
    cd "$PROJECT_ROOT"

    local force=false
    local action=""
    local target=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --list|-l)
                action="list"
                shift
                ;;
            --restore|-r)
                action="restore"
                shift
                target="${1:-}"
                shift || true
                ;;
            --force|-f)
                force=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                if [ -z "$action" ]; then
                    action="archive"
                    target="$1"
                fi
                shift
                ;;
        esac
    done

    # Execute action
    case "$action" in
        list)
            list_archived
            ;;
        restore)
            if [ -z "$target" ]; then
                log_error "No folder specified for restore"
                show_help
                exit 1
            fi
            restore_spec "$target"
            ;;
        archive)
            if [ -z "$target" ]; then
                log_error "No spec folder specified"
                show_help
                exit 1
            fi
            archive_spec "$target" "$force"
            ;;
        *)
            log_error "No action specified"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
