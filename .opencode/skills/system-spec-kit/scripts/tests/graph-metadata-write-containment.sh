#!/usr/bin/env bash
# Unit tests for the graph-metadata write boundary.
#
# The guard classifies a destination as spec-shaped and then writes it. That
# classification matches any path containing a specs segment, so a destination
# anywhere on the filesystem satisfied it and the guard wrote there while its
# own error text claimed it refuses exactly that.
#
# Two directions matter and they pull against each other:
#
#   Too loose - a path is accepted because it merely looks spec-shaped, so a
#   caller writes outside the workspace entirely.
#
#   Too strict - membership is measured on the canonicalized path, which places
#   every symlinked track in a sibling repository outside all roots and refuses
#   writes that were always legitimate. Or roots are discovered from the calling
#   process rather than from the destination, so any caller whose working
#   directory is not the repository is refused - a fixture workspace under a
#   temporary directory, and a hook launched from elsewhere writing into the
#   real repository alike.

set -uo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
PARSER="$REPO/.opencode/skills/system-spec-kit/mcp-server/dist/lib/graph/graph-metadata-parser.js"
PASS=0; FAIL=0

if [[ ! -f "$PARSER" ]]; then echo "SKIP: compiled parser absent"; exit 0; fi

OUTSIDE="$(mktemp -d)"; trap 'rm -rf "$OUTSIDE"' EXIT
mkdir -p "$OUTSIDE/specs/999-outside"

# Emits "wrote" or "refused" for one destination, leaving nothing behind. The
# optional second argument is the caller's working directory: the guard reads
# roots from the process as well as from the destination, and every case that
# runs from the repository conflates the two.
attempt() {
    ( cd "${2:-$REPO}" && node -e "
const { writeGraphMetadataFile } = require(process.argv[1]);
try {
  writeGraphMetadataFile(process.argv[2], { schemaVersion: '1.0.0', specFolder: 'probe', derived: {} });
  process.stdout.write('wrote');
} catch { process.stdout.write('refused'); }
" "$PARSER" "$1" 2>/dev/null )
}

expect() {
    local name="$1" want="$2" got="$3"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-52s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-52s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

echo "CASE                                                 RESULT"
echo "---------------------------------------------------- -------"

# A spec-shaped path outside every configured root.
expect "spec-shaped path outside the workspace" "refused" "$(attempt "$OUTSIDE/specs/999-outside/graph-metadata.json")"
[[ -f "$OUTSIDE/specs/999-outside/graph-metadata.json" ]] \
    && { FAIL=$((FAIL+1)); echo "  FAIL  refusal still created the file"; } \
    || { PASS=$((PASS+1)); printf '  ok    %-52s %s\n' "refusal leaves no file behind" "clean"; }

# Traversal that lands outside after resolution.
expect "traversal escaping the workspace" "refused" "$(attempt "$REPO/specs/../../escape/specs/graph-metadata.json")"

# A real in-repo destination must still be writable.
PROBE_DIR="$REPO/specs/system-speckit"
if [[ -d "$PROBE_DIR" ]]; then
    PROBE="$PROBE_DIR/.write-containment-probe.json"
    expect "in-repo specs destination" "wrote" "$(attempt "$PROBE")"
    rm -f "$PROBE"
fi

# A track symlinked into a sibling repository is a legitimate destination, and
# canonicalizing before the membership test would refuse it.
LINKED="$(find "$REPO/specs" -maxdepth 1 -type l | head -1)"
if [[ -n "$LINKED" ]]; then
    PROBE="$LINKED/.write-containment-probe.json"
    expect "symlinked sibling-repo track" "wrote" "$(attempt "$PROBE")"
    rm -f "$PROBE"
else
    printf '  skip  %-52s %s\n' "symlinked sibling-repo track" "none present"
fi

# A workspace that is not the caller's. Measuring membership against roots
# discovered from the process refuses every one of these - a fixture repository
# under a temporary directory, and equally a real write issued from a hook whose
# working directory sits outside the repository.
WS="$OUTSIDE/ws/.opencode/specs/system-spec-kit/900-probe"
mkdir -p "$WS"
expect "another workspace, anchored on .opencode" "wrote" "$(attempt "$WS/graph-metadata.json")"
rm -f "$WS/graph-metadata.json"

# The same shape with the anchor removed. This is what keeps the destination
# from authorizing itself: a path is not a workspace merely because it contains
# a specs segment.
UNANCHORED="$OUTSIDE/bare/specs/system-spec-kit/900-probe"
mkdir -p "$UNANCHORED"
expect "the same shape with no .opencode anchor" "refused" "$(attempt "$UNANCHORED/graph-metadata.json")"

# The production half of the same defect, in the other direction.
if [[ -d "$PROBE_DIR" ]]; then
    PROBE="$PROBE_DIR/.write-containment-probe.json"
    expect "in-repo destination from a foreign cwd" "wrote" "$(attempt "$PROBE" "$OUTSIDE")"
    rm -f "$PROBE"
fi

echo
printf '  %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
