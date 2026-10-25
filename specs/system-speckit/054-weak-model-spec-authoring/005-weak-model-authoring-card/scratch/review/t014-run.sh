. /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/fcd93cd7-b3f2-45e6-b976-87fabe792df3/scratchpad/env005.sh
R=$PHASE_REL/scratch/review
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 devin -p --model swe-2-max --permission-mode auto -- "$(cat $R/T014-brief.txt)" </dev/null > $R/T014.raw.txt 2> $R/T014.err
echo "rc=$?" > $R/T014.rc
