#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Template Staleness Checker
# ───────────────────────────────────────────────────────────────
# Compares SPECKIT_TEMPLATE_SOURCE version in each spec folder
# against the current template version. Reports stale folders.
# Discovery walks the spec document root only (<root>/specs) and skips
# archived, fixture, git-ignored and deep-run artifact folders, plus every
# vendored Skilled tree recognised by its `.skilled/skills/system-spec-kit`
# sentinel, so a vendored source tree, an ignored mirror or a fixture packet is
# never reported as one of the host's stale packets.
#
# Documents rendered from the utility templates carry their own version
# (v1.0 or v1.1) and stay valid; the validator checks marker presence only,
# so a legacy marker is grandfathered, never a failure.
#
# Usage:
#   check-template-staleness.sh [--json] [--root <path>]
#
# --auto-upgrade was removed; use upgrade-legacy.mjs for version-comment rewrites.
#
# Exit codes:
#   0 - all up to date
#   1 - stale folders found

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/template-utils.sh
source "$SCRIPT_DIR/../lib/template-utils.sh"

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

JSON_MODE=false
ROOT_PATH=""
TEMPLATE_DIR=""

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --json) JSON_MODE=true; shift ;;
            --auto-upgrade) echo "--auto-upgrade was removed, use upgrade-legacy" >&2; exit 2 ;;
            --root) ROOT_PATH="$2"; shift 2 ;;
            --help|-h) show_help; exit 0 ;;
            *) echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;
        esac
    done
}

show_help() {
    cat <<'EOF'
check-template-staleness.sh — Detect spec folders with outdated template versions

Usage: check-template-staleness.sh [--json] [--root <path>]

Options:
  --json           Machine-readable JSON output
  --root           Repository root (default: git root or cwd)
  --help           Show this help

Discovery walks <root>/specs only. Archived (z_archive), fixture, scratch,
memory, templates, build-output and git-ignored folders are skipped, as are the
deep-run artifact trees (lineages, containment, research_archive) and any
vendored Skilled tree, which is recognised by its
.skilled/skills/system-spec-kit sentinel.

--auto-upgrade was removed; use upgrade-legacy.mjs for version-comment rewrites.
EOF
}

# ───────────────────────────────────────────────────────────────
# 2. TEMPLATE VERSION DETECTION
# ───────────────────────────────────────────────────────────────

# The checker classifies a folder by spec.md's marker against spec.md.tmpl's
# manifest version; the other templates share that version by the parity test,
# so one comparison stands for the set.
get_current_template_version() {
    local manifest_path="$TEMPLATE_DIR/spec-kit-docs.json"
    if [[ ! -f "$manifest_path" ]]; then
        echo "unknown"
        return
    fi
    local version
    version=$(node -e '
const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
process.stdout.write(manifest.versions?.["spec.md.tmpl"] || "unknown");
' "$manifest_path" 2>/dev/null || true)
    echo "${version:-unknown}"
}

get_folder_template_version() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    [[ ! -f "$spec_file" ]] && { echo "missing"; return; }

    local version
    version=$(head -n 30 "$spec_file" | grep "SPECKIT_TEMPLATE_SOURCE" | grep -oE 'v[0-9]+\.[0-9]+' | head -1 || true)
    echo "${version:-none}"
}

# ───────────────────────────────────────────────────────────────
# 3. SPEC FOLDER DISCOVERY
# ───────────────────────────────────────────────────────────────

# Discovery is confined to the spec document root. A host repository that
# vendors this skill would otherwise have the vendored packet tree, and every
# fixture packet under it, reported as its own stale folders.
#
# The directory names below are the retrieval corpus walker's
# (runtime/cli/retrieval/lib/corpus.mjs), so a folder named "fixtures" or
# "scratch" is tooling to both readers instead of a packet to one of them. Only
# the name list is shared; the walker's path-scoped rules stay its own.
# A directory whose name ends in "-fixtures" is pruned only when it starts with
# a lowercase letter, which is what keeps numbered packet folders that merely
# end in "-fixtures" in the report.
# "lineages", "containment" and "research_archive" hold deep-run artifacts: a
# fan-out runner copies a whole framework checkout, and a host's peers, into
# each lineage, so nothing below one of them is a host packet.
PACKET_SKIP_NAMES=(
    z_archive
    node_modules
    scratch
    .git
    dist
    memory
    templates
    fixtures
    __fixtures__
    '[a-z]*-fixtures'
    lineages
    containment
    research_archive
)

# Walks the spec document root once, pruning PACKET_SKIP_NAMES.
#
# The trailing slash makes find resolve a symlinked spec root instead of leaving
# it as an unresolved link it will not descend, which is how a host shares one
# packet tree across checkouts.
#
# The "sentinel" mode prints vendored roots instead of packets. A directory is a
# vendored Skilled tree when it carries the `.skilled/skills/system-spec-kit`
# sentinel, and stripping that suffix from the match leaves the root whose
# packets belong to the copy rather than to the host. That mode has to walk into
# `.skilled`, while the "packet" mode prunes it because a vendored tree's own
# skill fixtures live there, so the one name the modes disagree on stays out of
# the shared list.
walk_spec_root() {
    local spec_root="$1"
    local mode="$2"
    local skip=()
    local name
    local first=true
    for name in "${PACKET_SKIP_NAMES[@]}"; do
        if $first; then first=false; else skip+=(-o); fi
        skip+=(-name "$name")
    done

    if [[ "$mode" == "sentinel" ]]; then
        find "$spec_root/" \( -type d \( "${skip[@]}" \) -prune \) -o \
            \( -type d -path '*/.skilled/skills/system-spec-kit' -print -prune \) 2>/dev/null
    else
        find "$spec_root/" \( -type d \( "${skip[@]}" -o -name .skilled \) -prune \) -o \
            \( -type f -name "spec.md" -print \) 2>/dev/null
    fi
}

# Git-ignored paths are skipped the way the retrieval corpus walker skips
# them (runtime/cli/retrieval/lib/corpus.mjs): a host can carry an untracked
# mirror of another checkout's packets under the spec root, and those belong to
# the copy. Only committed .gitignore files count, and a root outside a
# checkout, or one without git, ignores nothing.
git_ignored_spec_paths() {
    local root="$1"
    git -C "$root" -c core.fsmonitor=false ls-files --others --ignored \
        --exclude-per-directory=.gitignore --directory -z -- \
        specs 2>/dev/null || return 0
}

# A hit arrives as <spec-root>/<packet>, and find can leave the spec root's own
# trailing slash doubled, so a hit is compared against a git-relative path by
# its packet tail.
spec_root_tail() {
    local spec_root="$1"
    local folder="$2"
    local tail="${folder#"$spec_root"/}"
    while [[ "$tail" == /* ]]; do
        tail="${tail#/}"
    done
    printf '%s\n' "$tail"
}

discover_spec_folders() {
    local root="$1"
    local spec_root="$root/specs"
    # A missing root reports no folders rather than failing the run.
    [[ -d "$spec_root" ]] || return 0

    local vendored_roots=()
    local sentinel
    while IFS= read -r sentinel; do
        vendored_roots+=("${sentinel%/.skilled/skills/system-spec-kit}")
    done < <(walk_spec_root "$spec_root" sentinel)

    # An ignored directory ends in "/", an ignored file does not, so the two
    # are kept apart for the two comparisons below.
    local ignored_dirs=()
    local ignored_files=()
    local ignored_entry
    while IFS= read -r -d '' ignored_entry; do
        [[ -n "$ignored_entry" ]] || continue
        if [[ "$ignored_entry" == */ ]]; then
            ignored_dirs+=("${ignored_entry%/}")
        else
            ignored_files+=("$ignored_entry")
        fi
    done < <(git_ignored_spec_paths "$root")

    local spec_file
    while IFS= read -r spec_file; do
        local folder
        folder=$(dirname "$spec_file")
        local vendored_root
        local reported=true
        for vendored_root in "${vendored_roots[@]+"${vendored_roots[@]}"}"; do
            if [[ "$folder" == "$vendored_root" || "$folder" == "$vendored_root/"* ]]; then
                reported=false
                break
            fi
        done
        local relative
        local ignored=false
        local ignored_dir
        relative="specs/$(spec_root_tail "$spec_root" "$folder")"
        for ignored_dir in "${ignored_dirs[@]+"${ignored_dirs[@]}"}"; do
            if [[ "$relative" == "$ignored_dir" || "$relative" == "$ignored_dir/"* ]]; then
                ignored=true
                break
            fi
        done
        if ! $ignored; then
            local ignored_file
            for ignored_file in "${ignored_files[@]+"${ignored_files[@]}"}"; do
                if [[ "$relative/spec.md" == "$ignored_file" ]]; then
                    ignored=true
                    break
                fi
            done
        fi
        if $reported && ! $ignored; then printf '%s\n' "$folder"; fi
    done < <(walk_spec_root "$spec_root" packet) | sort -u
}

# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    parse_args "$@"

    if [[ -z "$ROOT_PATH" ]]; then
        ROOT_PATH="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
    fi

    TEMPLATE_DIR="$ROOT_PATH/.skilled/skills/system-spec-kit/templates"
    if [[ ! -d "$TEMPLATE_DIR" ]]; then
        echo "ERROR: Templates directory not found at $TEMPLATE_DIR" >&2
        exit 2
    fi

    local current_version
    current_version=$(get_current_template_version)

    # Discover and scan folders
    local folders=()
    while IFS= read -r folder; do
        [[ -n "$folder" ]] && folders+=("$folder")
    done < <(discover_spec_folders "$ROOT_PATH")

    # The length of an empty array is a clean zero under `set -u` on every Bash.
    # A `:-` default on a length expansion is a bad substitution on Bash 4 and
    # later, so the count is read bare and only the loop below guards the array.
    local total=${#folders[@]}
    local current_count=0 stale_count=0 none_count=0 missing_count=0
    local stale_folders=()
    # Bash 3.2 compatible version tracking (parallel arrays instead of associative)
    local version_keys=()
    local version_vals=()

    for folder in "${folders[@]+"${folders[@]}"}"; do
        local folder_name
        folder_name=$(echo "$folder" | sed "s|$ROOT_PATH/||")
        local version
        version=$(get_folder_template_version "$folder")

        # Track version distribution (Bash 3.2 compatible)
        local found=false
        local idx=0
        for vk in "${version_keys[@]+"${version_keys[@]}"}"; do
            if [[ "$vk" == "$version" ]]; then
                version_vals[$idx]=$(( ${version_vals[$idx]} + 1 ))
                found=true
                break
            fi
            ((idx++))
        done
        if ! $found; then
            version_keys+=("$version")
            version_vals+=(1)
        fi

        case "$version" in
            "$current_version") ((current_count++)) || true ;;
            "none") ((none_count++)) || true; stale_folders+=("$folder_name ($version)") ;;
            "missing") ((missing_count++)) || true ;;
            *) ((stale_count++)) || true; stale_folders+=("$folder_name ($version)") ;;
        esac
    done

    if $JSON_MODE; then
        local stale_json="["
        local first=true
        for s in "${stale_folders[@]+"${stale_folders[@]}"}"; do
            $first && first=false || stale_json+=","
            stale_json+="\"$s\""
        done
        stale_json+="]"

        local versions_json="{"
        local first_v=true
        local vidx=0
        for vk in "${version_keys[@]+"${version_keys[@]}"}"; do
            $first_v && first_v=false || versions_json+=","
            versions_json+="\"$vk\":${version_vals[$vidx]}"
            ((vidx++))
        done
        versions_json+="}"

        cat <<EOF
{"current_version":"$current_version","total":$total,"current":$current_count,"stale":$stale_count,"no_version":$none_count,"missing_spec":$missing_count,"versions":$versions_json,"stale_folders":$stale_json}
EOF
    else
        echo ""
        echo "═══════════════════════════════════════════════════════════════"
        echo "  Template Staleness Report"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        echo "  Current template version: $current_version"
        echo "  Total spec folders: $total"
        echo ""
        echo "  Version distribution:"
        local vidx=0
        for vk in "${version_keys[@]+"${version_keys[@]}"}"; do
            local count=${version_vals[$vidx]}
            local marker=""
            [[ "$vk" == "$current_version" ]] && marker=" (current)"
            echo "    $vk: $count folders$marker"
            ((vidx++))
        done
        echo ""

        if [[ ${#stale_folders[@]} -gt 0 ]]; then
            echo "  Stale folders:"
            for s in "${stale_folders[@]}"; do
                echo "    - $s"
            done
            echo ""
        else
            echo "  All folders are up to date."
            echo ""
        fi

        echo "═══════════════════════════════════════════════════════════════"
    fi

    [[ $stale_count -gt 0 || $none_count -gt 0 ]] && exit 1
    exit 0
}

main "$@"
