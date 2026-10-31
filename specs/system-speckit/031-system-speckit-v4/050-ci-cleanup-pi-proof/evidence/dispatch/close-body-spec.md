
TARGET: P/spec.md

EDIT 1
OLD: - A live headless Pi probe and a live TUI Pi run that prove the Gate-3 contract, with their captured artifacts under scratch/.
NEW: - A live headless Pi probe and a live TUI Pi run that prove the Gate-3 contract, with their captured artifacts under evidence/.

VERIFY - run these, paste each command with its result line
  grep -c 'under evidence/' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/spec.md   # expect 1
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/spec.md  # expect 22
