#!/usr/bin/env bash
# Verify that Node .cjs script paths referenced by deep-loop workflow YAMLs exist.

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
readonly -a YAML_FILES=(
  ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml"
  ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml"
  ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml"
  ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml"
)

missing=0
checked=0

for yaml_file in "${YAML_FILES[@]}"; do
  yaml_path="${REPO_ROOT}/${yaml_file}"
  if [[ ! -f "$yaml_path" ]]; then
    printf 'FAIL missing YAML: %s\n' "$yaml_file" >&2
    missing=$((missing + 1))
    continue
  fi

  while IFS= read -r script_path; do
    [[ -n "$script_path" ]] || continue
    checked=$((checked + 1))
    if [[ ! -f "${REPO_ROOT}/${script_path}" ]]; then
      printf 'FAIL missing script: %s referenced by %s\n' "$script_path" "$yaml_file" >&2
      missing=$((missing + 1))
    fi
  done < <(
    grep -Eho "node[[:space:]]+\\.opencode/[^\"'[:space:]]+\\.cjs" "$yaml_path" \
      | sed -E 's/^node[[:space:]]+//' \
      | sort -u
  )
done

if [[ "$missing" -gt 0 ]]; then
  printf 'FAIL checked %d script references, %d missing\n' "$checked" "$missing" >&2
  exit 1
fi

printf 'PASS checked %d script references across %d workflow YAMLs\n' "$checked" "${#YAML_FILES[@]}"
