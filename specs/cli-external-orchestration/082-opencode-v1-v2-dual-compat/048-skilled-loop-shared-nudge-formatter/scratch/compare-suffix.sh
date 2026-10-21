#!/usr/bin/env bash
# Prints the skilled-loop suffix and the core suffix for each input, one record per line.
set -u
loop="$1"; core="$2"
eval "$(sed -n '/^spec_folder_suffix() {/,/^}/p' "$loop")"
relaunch_core="$core"
inputs=('none' 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat' 'specs/a/b/048-skilled-loop' '' 'not a folder' 'specs/x/../001-a' $'specs/a/001-b\nx' 'specs/a/001-B')
for value in "${inputs[@]}"; do
  shell=$(spec_folder_suffix "$value")
  js=$(node -e 'process.stdout.write(require(process.argv[1]).specFolderSuffix(process.argv[2]))' "$core" "$value")
  printf '%q\tshell=%q\tjs=%q\t%s\n' "$value" "$shell" "$js" "$([ "$shell" = "$js" ] && echo same || echo DIFF)"
done
