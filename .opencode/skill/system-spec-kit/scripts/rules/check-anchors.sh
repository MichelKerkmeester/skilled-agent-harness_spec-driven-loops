#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-ANCHORS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh; keep -u disabled for shared rule-state compatibility.
set -eo pipefail

# Rule: ANCHORS_VALID
# Severity: error
# Description: Checks that anchor pairs in memory files and spec documents are properly matched

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="ANCHORS_VALID"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local -a all_files=()

# ───────────────────────────────────────────────────────────────
# 2. COLLECT FILES TO VALIDATE
# ───────────────────────────────────────────────────────────────

    # Collect memory files
    local memory_dir="$folder/memory"
    if [[ -d "$memory_dir" ]]; then
        while IFS= read -r -d '' file; do
            all_files+=("$file")
        done < <(find "$memory_dir" -maxdepth 1 -name "*.md" -type f -print0 2>/dev/null)
    fi

    # Collect spec document files (spec 129: anchor tags in spec docs)
    local -a spec_doc_names=("spec.md" "plan.md" "tasks.md" "checklist.md" "decision-record.md" "implementation-summary.md")
    for doc_name in "${spec_doc_names[@]}"; do
        local doc_path="$folder/$doc_name"
        if [[ -f "$doc_path" ]]; then
            all_files+=("$doc_path")
        fi
    done

    if [[ ${#all_files[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No memory or spec document files found (skipped)"
        return
    fi

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local -a errors=()
    local file_count=0

    for file in "${all_files[@]}"; do
        ((file_count++)) || true
        local filename
        filename=$(basename "$file")

        # Use parent dir name for disambiguation (memory/foo.md vs spec.md)
        local parent_dir
        parent_dir=$(basename "$(dirname "$file")")
        local display_name="$filename"
        if [[ "$parent_dir" == "memory" ]]; then
            display_name="memory/$filename"
        fi

        local tmp_opens tmp_closes
        tmp_opens=$(mktemp)
        tmp_closes=$(mktemp)
        trap 'rm -f "$tmp_opens" "$tmp_closes"' RETURN

        # Extract opening anchors: <!-- ANCHOR:id --> format: "linenum id"
        { grep -n '<!-- ANCHOR:[^/]' "$file" 2>/dev/null || true; } | \
            sed -n 's/^\([0-9]*\):.*ANCHOR:\([^[:space:]>]*\).*/\1 \2/p' > "$tmp_opens"

        # Extract closing anchors: <!-- /ANCHOR:id -->
        { grep -n '<!-- /ANCHOR:' "$file" 2>/dev/null || true; } | \
            sed -n 's/^\([0-9]*\):.*\/ANCHOR:\([^[:space:]>]*\).*/\1 \2/p' > "$tmp_closes"

        local all_ids
        all_ids=$(awk '{print $2}' "$tmp_opens" "$tmp_closes" 2>/dev/null | sort -u)

        local id
        for id in $all_ids; do
            [[ -z "$id" ]] && continue

            local opens closes open_line close_line
            opens=$(awk -v id="$id" '$2 == id {count++} END {print count+0}' "$tmp_opens")
            closes=$(awk -v id="$id" '$2 == id {count++} END {print count+0}' "$tmp_closes")

            if [[ "$opens" -gt "$closes" ]]; then
                open_line=$(awk -v id="$id" '$2 == id {print $1; exit}' "$tmp_opens")
                errors+=("$display_name:$open_line: Unclosed anchor '$id'")
            elif [[ "$closes" -gt "$opens" ]]; then
                close_line=$(awk -v id="$id" '$2 == id {print $1; exit}' "$tmp_closes")
                errors+=("$display_name:$close_line: Orphaned closing anchor '$id'")
            fi
        done

        rm -f "$tmp_opens" "$tmp_closes"
    done

# ───────────────────────────────────────────────────────────────
# 4. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#errors[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All anchor pairs valid in $file_count file(s)"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Found ${#errors[@]} anchor mismatch(es)"
        RULE_DETAILS=("${errors[@]}")
        RULE_REMEDIATION="Ensure each <!-- ANCHOR:id --> has matching <!-- /ANCHOR:id -->"
    fi
}
