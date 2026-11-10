OUT="$(mktemp -d)"
POINTER=specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt
mkdir -p "$(dirname "$POINTER")"
printf '%s\n' "$OUT" > "$POINTER"
echo "out=$OUT"
echo "pointer=$POINTER"
rm -rf specs/zz-pb-card
cat > "$OUT/brief.txt" <<'TXT'
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder you create and fill is:
  specs/zz-pb-card/001-card-authoring

ROLE: You are a documentation author. You read one card and write one Level 1 packet.

ALLOWED WRITE PATHS:
  specs/zz-pb-card/ and everything under it

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset, git stash, generate-context.js, /speckit:save, and any edit outside specs/zz-pb-card/. Do not edit recommend-level.sh. Do not edit anything under .skilled/.

TASK:
1. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md completely.
2. Run exactly: bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-pb-card --short-name card-authoring --number 1 "Author a Level 1 packet from the card"
3. Fill spec.md, plan.md, tasks.md and implementation-summary.md. Describe this feature in the packet and do not build it: a --quiet flag for .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh that prints only the final recommended-level line. Say in implementation-summary.md that the packet is planned and not implemented.
4. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-pb-card/001-card-authoring --strict
5. Fix what it reports and run it again, at most three times in all.

RETURN exactly one line: the last RESULT line validate.sh printed.
TXT
echo "brief=$(wc -l < "$OUT/brief.txt") lines"
OUT="$(cat specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt)"
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 devin -p --model swe-2-max --permission-mode dangerous -- "$(cat "$OUT/brief.txt")" </dev/null > "$OUT/reply.txt" 2> "$OUT/reply.err"
echo "devin_exit=$?"
tail -n 1 "$OUT/reply.txt"
OUT="$(cat specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt)"
P=specs/zz-pb-card/001-card-authoring
test -f "$P/spec.md" && echo "packet=$P"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/val.txt" 2>&1
echo "val_exit=$?"
grep 'RESULT:' "$OUT/val.txt"
rg -o --no-filename 'YOUR_VALUE_HERE:|NEEDS CLARIFICATION:' "$P/spec.md" "$P/plan.md" "$P/tasks.md" "$P/implementation-summary.md" | wc -l | tr -d ' '
rm -rf specs/zz-pb-card
test ! -d specs/zz-pb-card && echo "cleanup=ok"
