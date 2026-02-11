#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Check Anchors
# ───────────────────────────────────────────────────────────────

# T504 FIX: Using 'set -eo pipefail' (not -u) for macOS bash 3.2 compatibility.
# The -u flag causes failures with empty arrays and when sourced by the orchestrator.
set -eo pipefail

# Rule: ANCHORS_VALID
# Severity: error
# Description: Checks that anchor pairs in memory files are properly matched

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
    
    local memory_dir="$folder/memory"

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    if [[ ! -d "$memory_dir" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No memory/ directory found (skipped)"
        return
    fi
    
    local -a memory_files=()
    while IFS= read -r -d '' file; do
        memory_files+=("$file")
    done < <(find "$memory_dir" -maxdepth 1 -name "*.md" -type f -print0 2>/dev/null)
    
    if [[ ${#memory_files[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No memory files found (skipped)"
        return
    fi
    
    local -a errors=()
    local file_count=0
    
    for file in "${memory_files[@]}"; do
        ((file_count++)) || true
        local filename
        filename=$(basename "$file")
        
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
                errors+=("$filename:$open_line: Unclosed anchor '$id'")
            elif [[ "$closes" -gt "$opens" ]]; then
                close_line=$(awk -v id="$id" '$2 == id {print $1; exit}' "$tmp_closes")
                errors+=("$filename:$close_line: Orphaned closing anchor '$id'")
            fi
        done
        
        rm -f "$tmp_opens" "$tmp_closes"
    done

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#errors[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All anchor pairs valid in $file_count memory file(s)"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Found ${#errors[@]} anchor mismatch(es)"
        RULE_DETAILS=("${errors[@]}")
        RULE_REMEDIATION="Ensure each <!-- ANCHOR:id --> has matching <!-- /ANCHOR:id -->"
    fi
}
