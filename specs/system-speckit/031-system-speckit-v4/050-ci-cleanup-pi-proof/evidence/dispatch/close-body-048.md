
TARGET: specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md
(This one target sits in the sibling folder 048. It is the only file you may edit.)

EDIT 1
OLD: Evidence: ../050-ci-cleanup-pi-proof/scratch/ |
NEW: Evidence: ../050-ci-cleanup-pi-proof/evidence/ |

VERIFY - run these, paste each command with its result line
  grep -c '050-ci-cleanup-pi-proof/evidence/' specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md   # expect 1
  grep -c '050-ci-cleanup-pi-proof/scratch' specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md    # expect 0
