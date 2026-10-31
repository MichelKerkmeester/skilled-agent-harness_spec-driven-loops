## Edit 1

File: `.skilled/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh`

OLD:

~~~~text
  done < <(
    grep -Eho "node[[:space:]]+\\.opencode/[^\"'[:space:]]+\\.cjs" "$yaml_path" \
      | sed -E 's/^node[[:space:]]+//' \
~~~~

NEW:

~~~~text
  done < <(
    grep -Eho "node[[:space:]]+\\.(skilled|opencode)/[^\"'[:space:]]+\\.cjs" "$yaml_path" \
      | sed -E 's/^node[[:space:]]+//' \
~~~~
