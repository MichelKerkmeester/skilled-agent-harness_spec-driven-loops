#!/usr/bin/env bash
# Exercises the census parser against deterministic validator JSON.

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
driver="$script_dir/census-validation-rule.sh"
fixture_root="$(mktemp -d "${TMPDIR:-/tmp}/speckit-census-fixture.XXXXXX")"
trap 'rm -rf "$fixture_root"' EXIT

mkdir -p "$fixture_root/pass" "$fixture_root/warn-a" "$fixture_root/warn-b"
touch "$fixture_root/pass/spec.md" "$fixture_root/warn-a/spec.md" "$fixture_root/warn-b/spec.md"

validator="$fixture_root/validate-fixture.sh"
cat > "$validator" <<'VALIDATOR'
#!/usr/bin/env bash
set -euo pipefail

folder="$1"
if [[ "${SPECKIT_STATUS_CROSS_DOC_ENFORCE:-}" != "true" ]]; then
    printf 'enforcement flag was not scoped to the validator call\n' >&2
    exit 3
fi

status="pass"
message="consistent"
case "$folder" in
    */warn-a|*/warn-b)
        status="warn"
        message="mismatch"
        ;;
esac
printf '{"results":[{"rule":"STATUS_CROSS_DOC_CONSISTENCY","status":"%s","message":"%s"}]}' "$status" "$message"
VALIDATOR
chmod +x "$validator"

result="$(env -u SPECKIT_STATUS_CROSS_DOC_ENFORCE bash "$driver" \
    --root "$fixture_root" \
    --rule STATUS_CROSS_DOC_CONSISTENCY \
    --flag SPECKIT_STATUS_CROSS_DOC_ENFORCE \
    --validate-script "$validator")"

printf '%s' "$result" | node -e '
const fs = require("fs");
const result = JSON.parse(fs.readFileSync(0, "utf8"));
if (result.inspected !== 3 || result.warnings !== 2 || result.passes !== 1 || result.errors !== 0) {
  throw new Error(`unexpected census result: ${JSON.stringify(result)}`);
}
'

printf 'census-validation-rule fixture: PASS\n'
