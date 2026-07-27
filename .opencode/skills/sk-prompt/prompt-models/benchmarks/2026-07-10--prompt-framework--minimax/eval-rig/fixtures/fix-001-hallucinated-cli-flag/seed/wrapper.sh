#!/bin/bash
set -euo pipefail

accepted=()
rejected=()
devin_args=()

while [ $# -gt 0 ]; do
    arg="$1"
    case "$arg" in
        --print|-p|--continue|-c|--sandbox)
            accepted+=("$arg")
            devin_args+=("$arg")
            shift
            ;;
        --model|--permission-mode|--prompt-file|--config|--resume|--agent-config)
            accepted+=("$arg")
            devin_args+=("$arg")
            shift
            if [ $# -gt 0 ]; then
                val="$1"
                case "$val" in
                    -*) rejected+=("$arg(missing value)"); continue ;;
                esac
                devin_args+=("$val")
                shift
            fi
            ;;
        -*)
            rejected+=("$arg")
            shift
            ;;
        *)
            shift
            ;;
    esac
done

report() {
    local rf="flag-verify.json"
    {
        printf '{\n'
        printf '  "status": "%s",\n' "$([ ${#rejected[@]} -gt 0 ] && echo "REJECTED" || echo "CLEAN")"
        printf '  "rejected": ['
        local first=true
        local r
        for r in "${rejected[@]}"; do
            $first && first=false || printf ','
            printf '\n    "%s"' "$r"
        done
        [ ${#rejected[@]} -gt 0 ] && printf '\n  '
        printf '],\n'

        printf '  "accepted": ['
        first=true
        local a
        for a in "${accepted[@]}"; do
            $first && first=false || printf ','
            printf '\n    "%s"' "$a"
        done
        [ ${#accepted[@]} -gt 0 ] && printf '\n  '
        printf '],\n'

        printf '  "rejected_count": %d,\n' "${#rejected[@]}"
        printf '  "accepted_count": %d,\n' "${#accepted[@]}"
        printf '  "dispatched_command": "devin %s"\n' "${devin_args[*]}"
        printf '}\n'
    } > "$rf"
}

if [ ${#rejected[@]} -gt 0 ]; then
    report
    printf 'ERROR: Rejected %d hallucinated flag(s): %s\n' "${#rejected[@]}" "${rejected[*]}" >&2
    exit 1
fi

exec devin "${devin_args[@]}" 2>&1 </dev/null
