source /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/fcd93cd7-b3f2-45e6-b976-87fabe792df3/scratchpad/env009.sh
cd "$WORKTREE"
C="$SC/closeout/criteria-c2.txt"; : > "$C"
rm -rf specs/zz-bench-closeout
bash $S/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-bench-closeout --short-name gate "Gate" > "$SC/closeout/c2-create.txt" 2>&1
P=specs/zz-bench-closeout/001-gate
D=$(bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | /usr/bin/grep 'RESULT:' | tail -1)
perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' $P/spec.md
K=$(env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | /usr/bin/grep -c 'placeholder(s) found')
perl -pi -e 's/\| \*\*Status\*\* \| Complete \|/| **Status** | Draft |/' $P/spec.md
perl -pi -e 's/\| v2\.3 -->/| v2.2 -->/' $P/spec.md $P/plan.md $P/tasks.md
V=$(env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | /usr/bin/grep -c 'placeholder(s) found')
# extra case: a clean v2.2-stamped doc set with no tokens, at status Complete
perl -pi -e 's/\[YOUR_VALUE_HERE: [^\]]*\]/filled text/g' $P/spec.md $P/plan.md $P/tasks.md $P/implementation-summary.md
TOK=$(cat $P/spec.md $P/plan.md $P/tasks.md $P/implementation-summary.md | /usr/bin/grep -c 'YOUR_VALUE_HERE')
perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' $P/spec.md
W=$(env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | /usr/bin/grep -c 'placeholder(s) found')
WR=$(env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | /usr/bin/grep 'RESULT:' | tail -1)
rm -rf specs/zz-bench-closeout
test ! -e specs/zz-bench-closeout && GONE=gone
if [ "$D" = "RESULT: PASSED" ] && [ "$K" -ge 1 ] && [ "$V" -ge 1 ] && [ "$TOK" = 0 ] && [ "$W" = 0 ] && [ "$GONE" = gone ]; then echo "C2 PASS draft=$D complete_errors=$K v22_with_tokens_errors=$V clean_v22_complete_placeholder_errors=$W clean_v22_rule_result=$WR" >> "$C"; else echo "C2 FAIL draft=$D complete_errors=$K v22_with_tokens_errors=$V clean_v22_tokens=$TOK clean_v22_complete_placeholder_errors=$W $WR $GONE" >> "$C"; fi
cat "$C"
