#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK CARD SYNC
# ───────────────────────────────────────────────────────────────
# The authoring card is only useful when four surfaces agree: the card file,
# the router that loads it, the leaf inventory that lists it, and the checklist
# that sends a reader to a filled example. Each surface can be edited alone,
# and a reader then follows a path the others do not describe. This guard
# reads all four and fails on the first disagreement.
#
# Read-only. It writes no file and prints one PASS or FAIL line per check.
#
# Usage: check-card-sync.sh [--skill-root <path>]
# Exit codes: 0 every check passed, 1 one check failed, 2 bad invocation.
# ───────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --skill-root)
            [ "$#" -ge 2 ] || { echo "check-card-sync.sh: --skill-root needs a path" >&2; exit 2; }
            SKILL_ROOT="$2"
            shift 2
            ;;
        --help|-h)
            sed -n '2,14p' "${BASH_SOURCE[0]}"
            exit 0
            ;;
        *)
            echo "check-card-sync.sh: unknown option: $1" >&2
            exit 2
            ;;
    esac
done

CARD_REL="references/workflows/spec-authoring-card.md"
CARD="$SKILL_ROOT/$CARD_REL"
ROUTER="$SKILL_ROOT/SKILL.md"
LEAVES="$SKILL_ROOT/leaf-manifest.json"
ALIASES="$SKILL_ROOT/leaf-aliases.json"
CHECKLIST="$SKILL_ROOT/references/workflows/spec-folder-authoring-checklist.md"
MAX_LINES=260
STATUS=0

pass() { printf 'PASS %s\n' "$1"; }
fail_check() { printf 'FAIL %s: %s\n' "$1" "$2"; STATUS=1; }

# 1. The card exists and stays short enough to read in one pass.
if [ ! -f "$CARD" ]; then
    fail_check card-exists "missing $CARD_REL"
else
    LINES=$(wc -l < "$CARD" | tr -d ' ')
    if [ "$LINES" -le "$MAX_LINES" ]; then
        pass "card-exists ($LINES lines)"
    else
        fail_check card-length "$LINES lines, limit $MAX_LINES"
    fi
fi

# 2. Every authoring intent loads the card.
for INTENT in PLAN IMPLEMENT INTAKE TEMPLATE_AUTHORING; do
    if awk -v intent="$INTENT" '
        $0 == "    \"" intent "\": [" { inside = 1; next }
        inside && $0 == "    ]," { inside = 0 }
        inside && /spec-authoring-card\.md/ { found = 1 }
        END { exit(found ? 0 : 1) }
    ' "$ROUTER"; then
        pass "intent-$INTENT"
    else
        fail_check "intent-$INTENT" "does not load $CARD_REL"
    fi
done

# 3. The long guide is listed only in the on-demand level, not in an intent list.
GUIDE_IN_MAP=$(awk '
    /^RESOURCE_MAP = \{/ { map = 1; next }
    map && /^\}$/ { map = 0 }
    map && /"references\/templates\/template-guide\.md"/ { n++ }
    END { print n + 0 }
' "$ROUTER")
GUIDE_ON_DEMAND=$(awk '
    /"ON_DEMAND": \[/ { od = 1; next }
    od && /^    \],$/ { od = 0 }
    od && /"references\/templates\/template-guide\.md"/ { n++ }
    END { print n + 0 }
' "$ROUTER")
if [ "$GUIDE_IN_MAP" -eq 0 ] && [ "$GUIDE_ON_DEMAND" -eq 1 ]; then
    pass guide-on-demand-only
else
    fail_check guide-on-demand-only "in intent lists: $GUIDE_IN_MAP, in ON_DEMAND: $GUIDE_ON_DEMAND"
fi

# 4. The inventory lists the card and the identity projection agrees.
if jq -e --arg p "$CARD_REL" '.modes[].leaves | index($p) != null' "$LEAVES" > /dev/null; then
    pass leaf-manifest
else
    fail_check leaf-manifest "does not list $CARD_REL"
fi
if jq -e --arg p "$CARD_REL" '[.[] | select(.diskPath == $p)] | length > 0' "$ALIASES" > /dev/null; then
    pass leaf-aliases
else
    fail_check leaf-aliases "does not list $CARD_REL"
fi

# 5. The checklist sends a reader to a filled example, not the gated source root.
if rg -q 'Read templates from `\.skilled/skills/system-spec-kit/templates/`' "$CHECKLIST"; then
    fail_check checklist "still sends a reader to the templates root"
else
    pass checklist
fi

if [ "$STATUS" -ne 0 ]; then
    echo "CARD SYNC FAILED"
    exit 1
fi
echo "CARD SYNC OK"
