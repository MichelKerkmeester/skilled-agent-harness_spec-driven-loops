#!/bin/bash
# Run from the repository root: bash <this file>
# Plans and applies the foreign fixture with its Cursor mirror linked to an
# in-root CI file, then prints whether the CI file changed. Removes its temp tree.
S="$PWD/.skilled/commands/doctor/scripts"
T=$(mktemp -d "${TMPDIR:-/tmp}/probe-mirror-link-XXXXXX"); D="$T/foreign"
node "$S/tests/fixtures/agents-md/compose-fixture.cjs" foreign "$D" >/dev/null
mkdir -p "$D/.github" "$D/.cursor/rules"; printf 'name: ci\non: push\n' > "$D/.github/ci.yml"
ln -s ../../.github/ci.yml "$D/.cursor/rules/repo-local.md"
sum0=$(shasum -a 256 "$D/.github/ci.yml" | cut -c1-12)
P=$(node "$S/agents-md-embed.cjs" plan --root "$D"); echo "plan exit=$?"
echo "$P" | grep '^target '
DG=$(echo "$P" | sed -n 's/^plan-digest: //p'); BK=$(echo "$P" | sed -n 's/^backup: //p')
if [ -n "$DG" ]; then
  A=$(node "$S/agents-md-embed.cjs" apply --root "$D" --plan-digest "$DG"); echo "apply exit=$?"
  echo "$A" | grep -E '^(wrote|STATUS)'
fi
echo "ci.yml sha before=$sum0 after=$(shasum -a 256 "$D/.github/ci.yml" | cut -c1-12) link still a link: $(test -L "$D/.cursor/rules/repo-local.md" && echo yes || echo no)"
rm -rf "$T"; case "$BK" in "${TMPDIR:-/tmp}"*) rm -rf "$BK";; esac
