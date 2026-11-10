#!/usr/bin/env bash
# Planner dry run: builds scratch/mirror with copies of .skilled/bin, the sk-code hub and the
# four authored closure files this plan edits. Other skills and folders are linked read-only.
# Run from the repository root.
set -euo pipefail
R="$PWD"
S=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch
M="$S/mirror"
AU=specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program
mkdir -p "$M/.skilled/skills" "$M/.opencode"
cp -R .skilled/bin "$M/.skilled/bin"
for d in .skilled/skills/*; do
  n=$(basename "$d")
  if [ "$n" = sk-code ]; then cp -R "$d" "$M/.skilled/skills/sk-code"; else ln -s "$R/$d" "$M/.skilled/skills/$n"; fi
done
for d in commands agents hooks scripts repo-rules; do [ -e ".skilled/$d" ] && ln -s "$R/.skilled/$d" "$M/.skilled/$d"; done
ln -s ../.skilled/skills "$M/.opencode/skills"
ln -s ../.skilled/bin "$M/.opencode/bin"
for f in 009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs 009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs 009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json 014-runtime-engine/lib/compiled-route.cjs 014-runtime-engine/lib/resolve.cjs; do
  mkdir -p "$M/$AU/$(dirname "$f")"
  cp "$AU/$f" "$M/$AU/$f"
done
mkdir -p "$M/$S"
for f in units canary-assert.cjs probe-route.cjs all-canaries.cjs; do cp -R "$S/$f" "$M/$S/$f"; done
echo "mirror ready"
