## Edit 1

File: `.opencode/bin/tests/relink-local-specs.test.sh`

OLD:

~~~~text
# Runs the relinker from every source-root layout a checkout can hold: a real
# .opencode tree, a real .skilled tree, and a real .skilled tree with .opencode
# linked to it. The script finds the checkout two directories above its own, so
# each pointer must land under that checkout's specs/ whichever name it ran through.

set -euo pipefail
~~~~

NEW:

~~~~text
# Runs the relinker from every source-root layout a checkout can hold: a real
# .opencode tree beside an empty .skilled placeholder, a real .skilled tree, and a
# real .skilled tree with .opencode linked to it. The script finds the checkout two
# directories above its own, so each pointer must land under that checkout's specs/
# whichever name it ran through.

set -euo pipefail
~~~~

## Edit 2

File: `.opencode/bin/tests/relink-local-specs.test.sh`

OLD:

~~~~text
    cp "$RELINKER" "$checkout/$real/bin/relink-local-specs.sh"
    [ "$layout" != "whole-link" ] || ln -s .skilled "$checkout/.opencode"
~~~~

NEW:

~~~~text
    cp "$RELINKER" "$checkout/$real/bin/relink-local-specs.sh"
    [ "$layout" != "today" ] || mkdir -p "$checkout/.skilled/future-task-placeholder"
    [ "$layout" != "whole-link" ] || ln -s .skilled "$checkout/.opencode"
~~~~

## Edit 3

File: `.opencode/bin/tests/relink-local-specs.test.sh`

OLD:

~~~~text
      test ! -e "$checkout/$real/specs"
  done
~~~~

NEW:

~~~~text
      test ! -e "$checkout/$real/specs"
    [ "$layout" != "today" ] || expect "$layout through $entry: no pointer lands inside the .skilled placeholder" \
      test ! -e "$checkout/.skilled/specs"
  done
~~~~
