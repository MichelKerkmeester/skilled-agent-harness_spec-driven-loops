#!/bin/bash
# Launches every guard case at once and waits for all of them. Each case writes its own log.
G=$(cd "$(dirname "$0")" && pwd); L="$G/logs"; R=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
lsof_case() { # name shell prefix teardown pathmode
  ( if [ "$2" = zsh ]; then /bin/zsh -f -c ". '$G/run-case.sh' '$3' '$G/$4' '$5'"
    else /bin/bash -c ". '$G/run-case.sh' '$3' '$G/$4' '$5'"; fi ) > "$L/$1.log" 2>&1 &
}
empty_case() { # name shell teardown
  ( cd "$R" && if [ "$2" = zsh ]; then env -i /bin/zsh -f "$G/$3"; else env -i /bin/bash "$G/$3"; fi
    echo "# exit=$?" ) > "$L/$1.log" 2>&1 &
}
lsof_case p12-cp003-hidden-bash bash cp003 teardown-p12-cp003.sh hidden
lsof_case p12-cp004-hidden-bash bash cp004 teardown-p12-cp004.sh hidden
for s in bash zsh; do
  lsof_case new-433-hidden-$s $s cli-playbook teardown-new-433.sh hidden
  lsof_case new-cp003-hidden-$s $s cp003 teardown-new-cp003.sh hidden
  lsof_case new-cp004-hidden-$s $s cp004 teardown-new-cp004.sh hidden
  lsof_case new-433-normal-$s $s cli-playbook teardown-new-433.sh normal
  lsof_case new-cp003-normal-$s $s cp003 teardown-new-cp003.sh normal
  lsof_case new-cp004-normal-$s $s cp004 teardown-new-cp004.sh normal
  empty_case empty-new-433-$s $s teardown-new-433.sh
  empty_case empty-new-cp003-$s $s teardown-new-cp003.sh
  empty_case empty-new-cp004-$s $s teardown-new-cp004.sh
done
empty_case empty-p12-cp004-noremove-bash bash teardown-p12-cp004-noremove.sh
wait
