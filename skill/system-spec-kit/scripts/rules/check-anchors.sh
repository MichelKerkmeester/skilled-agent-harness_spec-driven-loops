#!/usr/bin/env bash
# Rule: ANCHORS_VALID
# Checks that anchor pairs in memory files are properly matched

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="ANCHORS_VALID"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local memory_dir="$folder/memory"
    
    # Early exit if no memory directory
    if [[ ! -d "$memory_dir" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No memory/ directory found (skipped)"
        return
    fi
    
    # Find all markdown files in memory/
    local -a memory_files=()
    while IFS= read -r -d '' file; do
        memory_files+=("$file")
    done < <(find "$memory_dir" -maxdepth 1 -name "*.md" -type f -print0 2>/dev/null)
    
    # No memory files found
    if [[ ${#memory_files[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No memory files found (skipped)"
        return
    fi
    
    local -a errors=()
    local file_count=0
    
    for file in "${memory_files[@]}"; do
        ((file_count++))
        local filename
        filename=$(basename "$file")
        
        # Use temp files to store anchor data (Bash 3.x compatible)
        local tmp_opens tmp_closes
        tmp_opens=$(mktemp)
        tmp_closes=$(mktemp)
        
        # Extract opening anchors: <!-- ANCHOR:id --> with line numbers
        # Format: "linenum id" per line
        # Use || true to handle grep's exit code 1 when no matches (pipefail safe)
        { grep -n '<!-- ANCHOR:[^/]' "$file" 2>/dev/null || true; } | \
            sed -n 's/^\([0-9]*\):.*ANCHOR:\([^[:space:]>]*\).*/\1 \2/p' > "$tmp_opens"
        
        # Extract closing anchors: <!-- /ANCHOR:id --> with line numbers
        { grep -n '<!-- /ANCHOR:' "$file" 2>/dev/null || true; } | \
            sed -n 's/^\([0-9]*\):.*\/ANCHOR:\([^[:space:]>]*\).*/\1 \2/p' > "$tmp_closes"
        
        # Get unique anchor IDs from both files
        local all_ids
        all_ids=$(awk '{print $2}' "$tmp_opens" "$tmp_closes" 2>/dev/null | sort -u)
        
        # Check each anchor ID for mismatches
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
    
    # Set results based on findings
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
