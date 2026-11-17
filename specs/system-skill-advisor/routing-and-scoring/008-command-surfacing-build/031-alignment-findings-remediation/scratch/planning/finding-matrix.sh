#!/usr/bin/env zsh
# Run from the repository root: zsh <this file>
# Prints one line per alignment finding this phase builds or proves, from the
# same commands the alignment run used. It reads the checkout, runs read-only
# checks and the advisor CLI, prints no row-file prompt and writes nothing in
# the checkout. The probe prompts are the alignment run's own probe prompts.
setopt pipefail
cd "${0:A:h}/../../../../../../.." || exit 2

AQ() {
  jq -cn --arg p "$1" '{prompt:$p}' \
    | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json 2>/dev/null
}

out=$(node .skilled/commands/scripts/validate-command-references.cjs 2>&1); code=$?
print -r -- "D01 validator   exit=$code $(print -r -- "$out" | head -1)"
out=$(node .skilled/commands/scripts/validate-command-references.cjs --self-test 2>&1)
print -r -- "D01 self-test   $(print -r -- "$out" | rg -F 'real tree resolves clean' | tr -s ' ')"

W=.github/workflows
for f in command-tree-parity spec-kit-check; do
  checks=$(rg -c 'cli/vibe/sync-(skills|prompts|agents)-vibe\.cjs --check' $W/$f.yml || print 0)
  vibe=$(rg -c -F "'.vibe/**'" $W/$f.yml || print 0)
  dsh=$(rg -c -F "'.dsh/**'" $W/$f.yml || print 0)
  print -r -- "X01 $f   vibe-checks=$checks vibe-filters=$vibe dsh-filters=$dsh"
done

docs=$(cat .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md \
  .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md \
  | rg -c 'only mentions' || print 0)
print -r -- "D03 docs        only-mentions=$docs"
for p in 'the /create:sk-skill command is slow' 'what does /create:sk-skill do'; do
  print -r -- "D03 cli         $(AQ "$p" | jq -c --arg p "$p" '[$p, (.data.recommendations[0] | .skillId, .command, .policy)]')"
done

PB=.skilled/skills/system-skill-advisor/manual-testing-playbook
files=$(find $PB -mindepth 2 -name '*.md' | wc -l | tr -d ' ')
ids=$(rg -l '^id: (NC-012|CL-009|CL-010)$' $PB 2>/dev/null | wc -l | tr -d ' ')
pin=$(rg -o 'live [0-9]+-scenario' .skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts)
print -r -- "BS401 playbook  scenario-files=$files new-ids=$ids test-pin=\"$pin\""

for row in 'P01|add the prompt-time skill advisor to my Mistral Vibe runtime' \
  'P02|the Vibe hook is not offering a skill before my prompt runs' \
  'P04|show me whether the prompt hooks answered with the local fallback scorer' \
  'P07|the linter does not appear in my tool list' \
  'P11|score the command transcripts from my benchmark runs and tell me which workflow each run opened'; do
  id=${row%%|*}; p=${row#*|}
  print -r -- "PRB $id         $(AQ "$p" | jq -c '[.data.recommendations[:2][] | [.skillId, (.compiledRoute.targets[0].workflowMode // null), .confidence]]')"
done

for pkg in system-spec-kit/runtime system-spec-kit/runtime/cli; do
  st=$(node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check --package $pkg --entry default --json --no-write 2>/dev/null | jq -r '.status')
  print -r -- "BAT01 dist      $pkg=$st"
done
V=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
print -r -- "BAT02 package   $(node $V --package .skilled/skills/system-spec-kit/manual-testing-playbook 2>&1 | rg '^(PASS|FAIL) package=' | cut -d' ' -f1,2,4,8)"
print -r -- "BAT06 links     $(node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs 2>&1 | head -1)"
print -r -- "BAT07 strict    failed-packages=[$(node $V --strict 2>&1 | rg '^FAIL package=' | cut -d' ' -f2 | tr '\n' ' ' | sed 's/ $//')]"
