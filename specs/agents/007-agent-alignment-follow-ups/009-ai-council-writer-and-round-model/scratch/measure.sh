#!/bin/bash
# Re-runs the measured-behavior commands for the ai-council phase. Run from the worktree root.
# Em dashes in tool output are rewritten as hyphens.
exec > >(perl -CSD -pe 's/\x{2014}/-/g') 2>&1
A=.skilled/agents/ai-council.md
D=.skilled/skills/system-deep-loop/deep-ai-council
L=$D/scripts/lib/persist-artifacts.cjs
Y=.skilled/commands/deep/assets/deep-ai-council-auto.yaml
c() { cut -c1-${1}; }
echo '$ git diff --quiet 09f1d6499a HEAD -- .skilled/agents/ai-council.md .claude/agents/ai-council.md .skilled/agents/agent-registry.json; echo "exit=$?"'
git diff --quiet 09f1d6499a HEAD -- $A .claude/agents/ai-council.md .skilled/agents/agent-registry.json; echo "exit=$?"
echo '# ai-council-1'
echo '$ sed -n 405p;569,570p ai-council.md | cut -c1-170'
sed -n '405p;569,570p' $A | c 170
echo '$ rg -c refresh ai-council.md'
rg -c 'refresh' $A
echo '$ rg -c "exit 0 receipt" ai-council.md'
rg -c 'exit 0 receipt' $A
echo '$ sed -n 255,275p append-mode-event.ts | rg -n "mode ===|return null"'
sed -n 255,275p .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts | rg -n 'mode ===|return null'
echo '$ sed -n 77,78p deep-ai-council-auto.yaml'
sed -n 77,78p $Y
echo '# ai-council-2'
echo '$ sed -n 403p;739p ai-council.md | cut -c1-150'
sed -n '403p;739p' $A | c 150
echo '$ sed -n 44p agent-registry.json | cut -c1-190'
sed -n 44p .skilled/agents/agent-registry.json | c 190
echo '$ sed -n 169p deep-ai-council-auto.yaml | cut -c1-170'
sed -n 169p $Y | c 170
echo '$ rg -n "persistSeatStepwise\(packetSpecFolder|const persisted = |--agent., .plan" orchestrate-session.cjs'
rg -n "const persisted = |'--agent', 'plan'" $D/scripts/orchestrate-session.cjs | c 120
echo '$ sed -n 160p;181p deep-ai-council-auto.yaml | cut -c1-120'
sed -n '160p;181p' $Y | c 120
echo '$ rg -n "fs.writeFileSync\(targetPath|fs.appendFileSync\(statePath|writeStateJsonl\(packetRoot" persist-artifacts.cjs (lib)'
rg -n 'fs.writeFileSync\(targetPath|fs.appendFileSync\(statePath|writeStateJsonl\(packetRoot' $L | c 120
echo '# ai-council-3'
echo '$ sed -n 668p;678p;685p ai-council.md | cut -c1-150'
sed -n '668p;678p;685p' $A | c 150
echo '$ rg -n max_rounds ai-council.md | cut -c1-110'
rg -n 'max_rounds' $A | c 110
echo '$ rg -n "DEFAULT_MAX_ROUNDS = " persist-artifacts.cjs (lib); sed -n 21p deep-ai-council-auto.yaml'
rg -n 'DEFAULT_MAX_ROUNDS = ' $L; sed -n 21p $Y
echo '# ai-council-4'
echo '$ sed -n 16p;59p;63p ai-council.md'
sed -n '16p;59p;63p' $A
echo '$ for f in .skilled/agents/*.md; do rg -l "^  task: allow" $f; done'
for f in .skilled/agents/*.md; do rg -l '^  task: allow' $f; done
echo '$ rg -n "fallback when no nesting|operate as Depth 0" depth-dispatch.md'
rg -n 'fallback when no nesting|operate as Depth 0' $D/references/convergence/depth-dispatch.md
echo '# ai-council-5'
echo '$ sed -n 10p;110,111p;241p;244p;394p ai-council.md | cut -c1-120'
sed -n '10p;110,111p;241p;244p;394p' $A | c 120
echo '$ rg -n "^\| Strategy \| Temp" ai-council.md seat-diversity-patterns.md'
rg -n '^\| Strategy \| Temp' $A $D/references/patterns/seat-diversity-patterns.md
echo '# ai-council-6'
echo '$ rg -n "15 point|25\+|within 10|<10 point" ai-council.md scoring-rubric.md | cut -c1-130'
rg -n '15 point|25\+|within 10|<10 point' $A $D/references/scoring/scoring-rubric.md | c 130
echo '# ai-council-7 and across-6'
echo '$ wc -l ai-council.md; sed -n 62p agent-template.md | cut -c1-80'
wc -l $A; sed -n 62p .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md | c 80
echo '$ rg -n "^## 1[2-8]\. " ai-council.md | cut -c1-60'
rg -n '^## 1[2-8]\. ' $A | c 60
echo '$ sed -n 748p;788p ai-council.md | cut -c1-110'
sed -n '748p;788p' $A | c 110
echo '$ sed -n 631,798p ai-council.md | wc -l'
sed -n 631,798p $A | wc -l | tr -d ' '
echo '$ rg -n "§1[2-8]" deep-ai-council/ (agent-section citations, changelog excluded)'
rg -n '§1[2-8]' $D -g '!**/changelog/**' | sed "s#^$D/##" | c 110
echo '$ rg -n "§1[2-9]" .skilled .claude/agents (no node_modules, runtime/data, retrieval/fixtures, benchmark/reports) | rg -i council | cut -c1-90'
X='-g !**/node_modules/** -g !**/runtime/data/** -g !**/retrieval/fixtures/** -g !**/benchmark/reports/**'
rg -n '§1[2-9]' .skilled .claude/agents $X | rg -i 'council' | sort | c 90
echo '$ (same search) | wc -l'
rg -n '§1[2-9]' .skilled .claude/agents $X | rg -i 'council' | wc -l | tr -d ' '
echo '$ rg -l "(ai-council\.md.?|[Aa]gent body|[Aa]gent) §[0-9]+" deep-ai-council/ | wc -l'
rg -l '(ai-council\.md`?|[Aa]gent body|[Aa]gent) §[0-9]+' $D | wc -l | tr -d ' '
echo '$ sed -n 49p agent-registry.json | cut -c1-120'
sed -n 49p .skilled/agents/agent-registry.json | c 120
echo '$ rg -n "COUNCIL PERSISTENCE PROTOCOL|Single writer authority|threshold scores" multi-ai-council-runtime-parity.vitest.ts'
rg -n "COUNCIL PERSISTENCE PROTOCOL|Single writer authority|threshold scores" .skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts
echo '# baselines'
echo '$ node .skilled/bin/sync-agent-roster.cjs --check'
node .skilled/bin/sync-agent-roster.cjs --check; echo "exit=$?"
echo '$ node .skilled/bin/check-agent-mirror-sync.cjs | tail -1'
node .skilled/bin/check-agent-mirror-sync.cjs | tail -1; echo "exit=${PIPESTATUS[0]}"
echo '$ node compile-command-contracts.cjs --command deep/ai-council | diff -q - deep-ai-council.contract.markdown'
node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/ai-council | diff -q - .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown; echo "exit=$?"
echo '$ ls .skilled/skills/system-spec-kit/runtime/node_modules/.bin/vitest'
ls .skilled/skills/system-spec-kit/runtime/node_modules/.bin/vitest 2>&1 | sed 's#^.*: ##'
