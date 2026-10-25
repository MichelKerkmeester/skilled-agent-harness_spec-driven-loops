fail=0
for f in $(find "$1/" -name '*.md' -not -path '*/changelog/*' -not -path '*/benchmark/reports/*'); do
  d=$(dirname "$f")
  for t in $(grep -o -E '\]\([^)]+' "$f" | sed 's/^](//' | sed 's/#.*$//' | grep -v -E '^(https?:|mailto:|$)' | sort -u); do
    case "$t" in /*) continue;; esac
    n=$(python3 -c 'import os,sys;print(os.path.normpath(os.path.join(sys.argv[1],sys.argv[2])))' "$d" "$t")
    [ -e "$n" ] || { echo "BROKEN $f -> $t"; fail=1; }
  done
done
echo "AUDIT_FAIL=$fail"
