#!/usr/bin/env bash
# Scratch check: two repin scenarios against the engine.
set -u
E="$1"; base=$(mktemp -d "${TMPDIR:-/tmp}/repin-check.XXXX"); G=(git -c user.name=F -c user.email=f@x.invalid -c commit.gpgsign=false -c core.hooksPath=/dev/null -c core.excludesFile=/dev/null)
run_case() { # $1 name, $2 drop-link-from-tree(0/1), $3 link-in-old(0/1)
  W="$base/$1"; U="$W/upstream"; T="$W/tree"; mkdir -p "$U/.skilled/hooks/x/claude" "$U/.skilled/scripts" "$T/skilled-overlays"
  "${G[@]}" -C "$U" init -q
  printf 'echo hi\n' > "$U/.skilled/scripts/check.sh"; printf 'readme\n' > "$U/.skilled/hooks/x/claude/README.md"
  [ "$3" = 1 ] && ln -s ../../../scripts/check.sh "$U/.skilled/hooks/x/claude/check.sh"
  "${G[@]}" -C "$U" add -A; "${G[@]}" -C "$U" commit -qm old; OLD=$("${G[@]}" -C "$U" rev-parse HEAD)
  rm "$U/.skilled/hooks/x/claude/README.md"; [ "$3" = 0 ] && ln -s ../../../scripts/check.sh "$U/.skilled/hooks/x/claude/check.sh"
  "${G[@]}" -C "$U" add -A; "${G[@]}" -C "$U" commit -qm new; NEW=$("${G[@]}" -C "$U" rev-parse HEAD)
  "${G[@]}" -C "$U" archive --format=tar -o "$W/old.tar" "$OLD"; tar -xf "$W/old.tar" -C "$T"
  [ "$2" = 1 ] && rm -f "$T/.skilled/hooks/x/claude/check.sh"
  printf '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"%s"},"layoutLinks":[],"overlays":[],"regenerate":[],"verifyGenerated":[]}\n' "${OLD:0:10}" > "$T/skilled-overlays/overlay-manifest.json"
  node "$E" apply --root "$T" >/dev/null
  echo "== $1"; node "$E" repin --upstream "$U" --to "${NEW:0:10}" --root "$T" | grep -E '^(copy|RESULT)'
  if [ -L "$T/.skilled/hooks/x/claude/check.sh" ]; then echo "link present"; else echo "link MISSING"; fi
  [ -e "$T/.skilled/hooks/x/claude/README.md" ] && echo "README present" || echo "README gone"
}
run_case readme-to-link-in-new-commit 0 0
run_case link-unchanged-but-absent-in-tree 1 1
rm -rf "$base"
