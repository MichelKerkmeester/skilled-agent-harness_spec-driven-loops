#!/usr/bin/env bash
# Unit tests for the source-fingerprint document-set generation.
#
# Two failures this pins, one in each direction:
#
#   Too strict - comparing digests across generations. Adding or retiring a
#   canonical document changes the hashed set, so every stored digest stops
#   matching at once. Untouched packets fail everywhere and a repository-wide
#   repair becomes mandatory before anything validates again.
#
#   Too loose - skipping on any generation that is not the current one. A marker
#   nobody recognizes, forged or mistyped, then switches drift detection off for
#   that packet permanently and silently. Skipping when the marker is ABSENT is
#   the same hole reached by deleting a field rather than forging one, and it was
#   the common case: the marker was optional, so almost nothing was compared.
#
# Only an OLDER marker that is actually present may skip. Equal compares, newer
# compares, and absent is reported: reporting a mismatch is recoverable, staying
# quiet is not.

set -uo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
VALIDATE="$REPO/.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh"
PACKET="$REPO/specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement"
PASS=0; FAIL=0

if [[ ! -f "$PACKET/graph-metadata.json" ]]; then
    echo "SKIP: reference packet absent"; exit 0
fi

WORK="$(mktemp -d)"

# The cases below mutate a tracked packet, so the trap has to put it back on any
# exit - including an interrupt. Removing only the temporary directory would
# leave a forged generation marker and a probe line committed into real docs.
restore_packet() {
    # Put the reference packet back as it was, on any exit path.
    # Args:
    #   none
    # Returns:
    #   0 always

    [[ -f "$WORK/original-gm.json" ]] && cp "$WORK/original-gm.json" "$PACKET/graph-metadata.json"
    [[ -f "$WORK/spec.md" ]] && cp "$WORK/spec.md" "$PACKET/spec.md"
    rm -rf "$WORK"
}
trap restore_packet EXIT INT TERM
cp "$PACKET/graph-metadata.json" "$WORK/original-gm.json"
cp "$PACKET/spec.md" "$WORK/spec.md"

# Start from a freshly derived digest. Any edit to a hashed document since the
# last derive would otherwise read as a failure of the generation logic rather
# than as the stale digest it actually is.
node --import "$REPO/.opencode/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs" \
     "$REPO/.opencode/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts" \
     --spec-folder "$PACKET" >/dev/null 2>&1
cp "$PACKET/graph-metadata.json" "$WORK/gm.json"

restore() { cp "$WORK/gm.json" "$PACKET/graph-metadata.json"; cp "$WORK/spec.md" "$PACKET/spec.md"; }

mismatches() {
    # Count fingerprint-mismatch findings for the reference packet.
    # Args:
    #   none
    # Returns:
    #   Prints the count

    bash "$VALIDATE" "$PACKET" --strict 2>&1 | grep -c 'SOURCE_FINGERPRINT_MISMATCH'
}

missing_marker() {
    # Count missing-marker findings for the reference packet.
    # Args:
    #   none
    # Returns:
    #   Prints the count

    bash "$VALIDATE" "$PACKET" --strict 2>&1 | grep -c 'SOURCE_FINGERPRINT_DOCSET_MISSING'
}

set_generation() {
    # Force the stored generation marker to a chosen value.
    # Args:
    #   $1 - Integer to store, or the literal "none" to remove the field
    # Returns:
    #   0 on success

    python3 - "$PACKET/graph-metadata.json" "$1" <<'PY'
import json, sys
path, value = sys.argv[1], sys.argv[2]
data = json.load(open(path))
if value == 'none':
    data['derived'].pop('source_fingerprint_docset', None)
else:
    data['derived']['source_fingerprint_docset'] = int(value)
json.dump(data, open(path, 'w'), indent=2)
PY
}

expect() {
    # Compare one observed result against its expectation and tally the outcome.
    # Args:
    #   $1 - Case name
    #   $2 - Expected value
    #   $3 - Observed value
    # Returns:
    #   0 always; increments PASS or FAIL

    local name="$1" want="$2" got="$3"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-52s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-52s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

drift() { printf '\n<!-- generation probe -->\n' >> "$PACKET/spec.md"; }

echo "CASE                                                 MISMATCHES"
echo "---------------------------------------------------- ----------"

expect "current generation, no drift" "0" "$(mismatches)"

drift
expect "current generation, real drift is reported" "1" "$(mismatches)"

# The migration case the generation marker exists for.
set_generation 1
expect "older generation skips rather than failing" "0" "$(mismatches)"

# A digest with no marker beside it names no document set, so it cannot be
# compared. Skipping there was the reachable half of the suppression vector:
# deleting the field is schema-legal and reached the same silence as forging one.
set_generation none
expect "absent marker is reported, not skipped" "1" "$(missing_marker)"
expect "and drift is not silently passed" "0" "$(mismatches)"

# The suppression vector: an unrecognized marker must not silence the check.
set_generation 99
expect "future generation still reports drift" "1" "$(mismatches)"

restore
expect "restored packet is clean again" "0" "$(mismatches)"


echo
printf '  %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
