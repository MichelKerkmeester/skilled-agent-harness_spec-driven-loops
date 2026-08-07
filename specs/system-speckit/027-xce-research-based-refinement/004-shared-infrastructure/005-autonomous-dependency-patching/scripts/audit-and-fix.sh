#!/usr/bin/env bash
set -euo pipefail

# audit-and-fix.sh - Autonomous npm security audit and remediation
# Scans skill package lockfiles, detects vulnerabilities,
# patches via overrides + lockfile regeneration, and verifies clean audits.
#
# Usage:
#   bash scripts/audit-and-fix.sh [--dry-run] [--include-fixtures]
#
# Exit codes:
#   0 = all clean (or all fixed)
#   1 = unfixable vulnerabilities remain

DRY_RUN=false
INCLUDE_FIXTURES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      ;;
    --include-fixtures)
      INCLUDE_FIXTURES=true
      ;;
    *)
      echo "ERROR: Unknown argument: $1"
      exit 2
      ;;
  esac
  shift
done

REPO_ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
SKILLS_DIR="${REPO_ROOT}/.opencode/skills"

if [[ ! -d "$SKILLS_DIR" ]]; then
  echo "ERROR: Skills directory not found: $SKILLS_DIR"
  exit 1
fi

if ! command -v npm &>/dev/null; then
  echo "ERROR: npm is not installed or not in PATH"
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "ERROR: jq is required but not installed"
  exit 1
fi

PATCHED=()
CLEAN=()
FAILED=()

patched_floor_from_range() {
  local range="$1"

  if [[ "$range" =~ ^\<([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    printf '%s.%s.%s\n' "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}"
    return 0
  fi

  if [[ "$range" =~ ^\<\=([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    local patch="${BASH_REMATCH[3]}"
    printf '%s.%s.%s\n' "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "$((patch + 1))"
    return 0
  fi

  return 1
}

echo "=== Autonomous Dependency Audit & Fix ==="
echo "Skills directory: $SKILLS_DIR"
echo "Dry run: $DRY_RUN"
echo "Include fixtures: $INCLUDE_FIXTURES"
echo ""

find_args=("$SKILLS_DIR" -name "package-lock.json" -not -path "*/node_modules/*")
if [[ "$INCLUDE_FIXTURES" != "true" ]]; then
  find_args+=(
    -not -path "*/benchmarks/*/fixtures/*"
    -not -path "*/eval-rig/fixtures/*"
  )
fi

# Find all directories containing both package.json and package-lock.json
while IFS= read -r lockfile; do
  dir="$(dirname "$lockfile")"
  pkg="${dir}/package.json"

  if [[ ! -f "$pkg" ]]; then
    continue
  fi

  # Derive a label relative to repo root
  label="${dir#${REPO_ROOT}/}"
  echo "--- Scanning: $label ---"

  # Run audit
  audit_json="$(cd "$dir" && npm audit --json 2>/dev/null || true)"
  vuln_count="$(echo "$audit_json" | jq '.metadata.vulnerabilities.total // 0')"

  if [[ "$vuln_count" == "0" ]]; then
    echo "  OK: No vulnerabilities"
    CLEAN+=("$label")
    echo ""
    continue
  fi

  echo "  Found $vuln_count vulnerabilities"

  # Extract each vulnerable package name and its fix range.
  echo "$audit_json" | jq -r '
    .vulnerabilities
    | to_entries[]
            | select(.value.fixAvailable == true or .value.fixAvailable.fixAvailable == true)
            | .key as $name
            | (.value.via[0].range // "") as $range
            | (.value.via[0].url // "") as $url
            | "\($name)\t\($range)\t\($url)"
  ' | while IFS=$'\t' read -r name range url; do
    if [[ -z "$name" || -z "$range" ]]; then
      continue
    fi

    if ! patched_version="$(patched_floor_from_range "$range")"; then
      echo "  WARN: Cannot compute patched version for $name (range: $range)"
      continue
    fi

    echo "  -> $name: patch floor ^${patched_version}"

    if [[ "$DRY_RUN" == "true" ]]; then
      continue
    fi

    # Add or update the override in package.json.
    if jq -e ".overrides.\"$name\"" "$pkg" &>/dev/null; then
      # Existing override: tighten it.
      jq --arg name "$name" --arg ver "^${patched_version}" \
        '.overrides[$name] = $ver' "$pkg" > "${pkg}.tmp" && mv "${pkg}.tmp" "$pkg"
      echo "    Updated override: $name ^${patched_version}"
    else
      # New override
      jq --arg name "$name" --arg ver "^${patched_version}" \
        '.overrides = (.overrides // {}) | .overrides[$name] = $ver' "$pkg" > "${pkg}.tmp" && mv "${pkg}.tmp" "$pkg"
      echo "    Added override: $name ^${patched_version}"
    fi
  done

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  (dry run: skipping lockfile regeneration)"
    echo ""
    continue
  fi

  # Regenerate lockfile without touching node_modules
  echo "  Regenerating lockfile..."
  (cd "$dir" && npm install --package-lock-only --ignore-scripts --no-audit 2>/dev/null) || true

  # For workspace lockfiles, also run audit fix
  if jq -e 'has("workspaces")' "$pkg" >/dev/null 2>&1; then
    echo "  Running workspace audit fix..."
    (cd "$dir" && npm audit fix --package-lock-only --ignore-scripts 2>/dev/null) || true
  fi

  # Re-audit
  re_audit="$(cd "$dir" && npm audit --json 2>/dev/null || true)"
  remaining="$(echo "$re_audit" | jq '.metadata.vulnerabilities.total // 0')"

  if [[ "$remaining" == "0" ]]; then
    echo "  OK: All vulnerabilities patched"
    PATCHED+=("$label")
  else
    echo "  ERROR: $remaining vulnerabilities remain after fix"
    FAILED+=("$label")
  fi

  echo ""

done < <(find "${find_args[@]}" | sort)

echo "==========================================="
echo "SUMMARY"
echo "==========================================="
echo "  Clean (no changes):    ${#CLEAN[@]}"
echo "  Patched:               ${#PATCHED[@]}"
echo "  Failed (unfixable):    ${#FAILED[@]}"
echo ""

if [[ ${#PATCHED[@]} -gt 0 ]]; then
  echo "  Patched packages:"
  for p in "${PATCHED[@]}"; do
    echo "    - $p"
  done
fi

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "  Failed packages:"
  for f in "${FAILED[@]}"; do
    echo "    - $f"
  done
  echo ""
  echo "Some vulnerabilities could not be auto-fixed."
  echo "Manual intervention may be required."
  exit 1
fi

echo ""
echo "All audits clean."
exit 0
