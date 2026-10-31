#!/usr/bin/env bash
# Guard: every hand-written example keeps the anchor skeleton of the template it
# imitates and a description a reader can use. Read-only: it prints one line per
# failure and exits 1, and changes nothing.
set -uo pipefail

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/system-spec-kit"
TEMPLATES="$ROOT/templates"
RENDERER="$ROOT/runtime/cli/templates/inline-gate-renderer.sh"
status=0

fail() {
  printf 'FAIL %s: %s\n' "$1" "$2"
  status=1
}

for dir in "$TEMPLATES"/examples/level-*; do
  level="${dir##*/level-}"
  for example in "$dir"/*.md; do
    name="$(basename "$example")"
    doc="${name%.md}"
    template="$TEMPLATES/core/$name.tmpl"
    [[ -f "$template" ]] || template="$TEMPLATES/addons/$name.tmpl"
    [[ -f "$template" ]] || continue

    desc="$(awk '/^description:/{sub(/^description:[[:space:]]*/,""); print; exit}' "$example")"
    bare="${desc%\"}"
    bare="${bare#\"}"
    [[ "$bare" == *"-->"* ]] && fail "$example" "description holds an HTML comment tail"
    [[ "$bare" =~ ^[a-z] ]] && fail "$example" "description starts lowercase"
    [[ "$bare" == *. ]] || fail "$example" "description does not end with a period"

    template_anchors="$(bash "$RENDERER" --level "$level" "$template" \
      | rg -o 'ANCHOR:[a-z0-9-]+' | sed 's/ANCHOR://' | sort -u)"
    example_anchors="$(rg -o 'ANCHOR:[a-z0-9-]+' "$example" | sed 's/ANCHOR://' | sort -u)"

    if [[ "$doc" == "decision-record" ]]; then
      template_anchors="$(printf '%s\n' "$template_anchors" | rg '^adr-001' || true)"
      example_anchors="$(printf '%s\n' "$example_anchors" | rg '^adr-001' || true)"
    fi

    missing="$(comm -23 <(printf '%s\n' "$template_anchors" | sed '/^$/d') \
                         <(printf '%s\n' "$example_anchors" | sed '/^$/d') | tr '\n' ' ')"
    extra="$(comm -13 <(printf '%s\n' "$template_anchors" | sed '/^$/d') \
                       <(printf '%s\n' "$example_anchors" | sed '/^$/d') | tr '\n' ' ')"
    [[ -n "${missing// /}" ]] && fail "$example" "missing anchors: $missing"
    [[ -n "${extra// /}" ]] && fail "$example" "extra anchors: $extra"

    opens="$(rg -c '<!-- ANCHOR:' "$example" || echo 0)"
    closes="$(rg -c '<!-- /ANCHOR:' "$example" || echo 0)"
    [[ "$opens" == "$closes" ]] || fail "$example" "anchor count $opens open and $closes close"
  done
done

[[ $status -eq 0 ]] && echo "EXAMPLE_DRIFT_OK"
exit $status
