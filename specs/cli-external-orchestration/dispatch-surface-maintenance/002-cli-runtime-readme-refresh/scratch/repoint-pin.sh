#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Repoint the cli-pi contract pin at its archived location.
#
# One substring across the 9 files that carry the pin as a markdown link. The
# relative depth is unchanged because `z_archive/` sits at the same level as the
# packet it replaces, and the archived target exists. This matches the citation
# style 53 other skill docs already use for archived packets.
#
# Deliberately NOT applied to cli-pi/changelog/*.md, which hold 3 further
# occurrences. The link checker's own EXCLUDE_SEGMENTS freezes changelog history,
# and those three are additionally broken in relative depth independently of this
# repair, so the substring alone would leave them broken. Reported, not absorbed.
#
# Run only after the cli-pi README child has finished: it owns that same file.
# ───────────────────────────────────────────────────────────────
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKET="$(cd "$HERE/.." && pwd)"
ROOT="$(cd "$PACKET/../../.." && pwd)"
SKILLS="$ROOT/.skilled/skills/cli-external-orchestration"

OLD='specs/cli-external-orchestration/031-cli-pi-creation'
NEW='specs/cli-external-orchestration/z_archive/031-cli-pi-creation'

FILES=(
  "$SKILLS/cli-pi/README.md"
  "$SKILLS/cli-pi/SKILL.md"
  "$SKILLS/cli-pi/assets/prompt-templates.md"
  "$SKILLS/cli-pi/references/agent-delegation.md"
  "$SKILLS/cli-pi/references/cli-reference.md"
  "$SKILLS/cli-pi/references/integration-patterns.md"
  "$SKILLS/cli-pi/references/mcp-and-third-party-packages.md"
  "$SKILLS/cli-pi/references/native-skills-and-extensions.md"
  "$SKILLS/cli-pi/references/pi-tools.md"
)

before=0
for f in "${FILES[@]}"; do
  n="$(grep -c "$OLD" "$f" 2>/dev/null || true)"
  before=$((before + ${n:-0}))
done
echo "before: $before occurrence(s) across ${#FILES[@]} files"

after=0
for f in "${FILES[@]}"; do
  [ -f "$f" ] || { echo "MISSING: $f" >&2; continue; }
  # Literal replacement via argv, not through a shell-expanded one-liner: an
  # earlier Perl form of this step passed `\Q...\E` through shell interpolation,
  # which mangled the quoting and aborted mid-run. argv carries both strings
  # verbatim, and str.replace is literal by construction, so neither path needs
  # escaping and a path containing regex metacharacters cannot change the meaning.
  python3 - "$f" "$OLD" "$NEW" <<'PY'
import pathlib, sys
path, old, new = sys.argv[1], sys.argv[2], sys.argv[3]
p = pathlib.Path(path)
text = p.read_text(encoding='utf-8')
updated = text.replace(old, new)
if updated != text:
    p.write_text(updated, encoding='utf-8')
PY
  n="$(grep -c "$OLD" "$f" 2>/dev/null || true)"
  after=$((after + ${n:-0}))
done
echo "after:  $after occurrence(s) remaining"

# The archived target must exist, or the swap trades one broken link for another.
TARGET="$ROOT/specs/cli-external-orchestration/z_archive/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md"
if [ -f "$TARGET" ]; then
  echo "target: present"
else
  echo "target: MISSING ($TARGET)" >&2
  exit 1
fi

if [ "$after" -eq 0 ] && [ "$before" -gt 0 ]; then
  echo "RESULT: PASSED (repointed $before occurrence(s), 0 remaining)"
  exit 0
fi
echo "RESULT: FAILED (before=$before after=$after)"
exit 1
