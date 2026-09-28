#!/usr/bin/env bash
# Checks that lsof +D finds a regular file held open inside a /tmp folder through the /tmp path the teardown uses,
# as well as through the real /private/tmp path, since /tmp is a symlink on macOS. The holder is this script's own
# sleep, ended at the end.
set -u
D=$(mktemp -d /tmp/lsofcheck.XXXXXX); mkdir -p "$D/db"; : > "$D/db/held"
sleep 30 < "$D/db/held" & H=$!
sleep 0.5
R=$(cd "$D" && pwd -P)
echo "folder $D, real path $R, holder pid $H"
echo "ls -ld /tmp: $(ls -ld /tmp | awk '{print $(NF-2), $(NF-1), $NF}')"
echo "lsof -t +D \"\$D\" (the /tmp path):  [$(lsof -t +D "$D" 2>/dev/null | tr '\n' ' ')]"
echo "lsof -t +D \"\$R\" (the real path): [$(lsof -t +D "$R" 2>/dev/null | tr '\n' ' ')]"
kill "$H"; wait "$H" 2>/dev/null
echo "after the holder exits, the real path: [$(lsof -t +D "$R" 2>/dev/null | tr '\n' ' ')]"
rm -rf "$D"
