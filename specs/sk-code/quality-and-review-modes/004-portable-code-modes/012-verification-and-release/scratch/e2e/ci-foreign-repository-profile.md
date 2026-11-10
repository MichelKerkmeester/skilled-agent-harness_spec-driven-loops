# ci-foreign-repository-profile

Scenario file: `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/foreign-repository/foreign-repository-profile.md`

Only fixture deviation: `SCRATCH="$(mktemp -d)"` replaced with `SCRATCH=/Users/michelkerkmeester/worktrees/public/.scratch-dc90/fixtures/ci-foreign-repository-profile`.

## Commands run

### Step 1

```bash

CHECKOUT="$PWD"
SCRATCH="/Users/michelkerkmeester/worktrees/public/.scratch-dc90/fixtures/ci-foreign-repository-profile"
S=.skilled/commands/doctor/scripts
A=.skilled/skills/sk-code/sk-code-ci/assets
I=.skilled/skills/sk-code/shared/scripts/lib
mkdir -p "$SCRATCH/$S/lib" "$SCRATCH/$A" "$SCRATCH/$I" "$SCRATCH/.github/workflows" "$SCRATCH/bin"
for f in ci-report.cjs ci-toggle.cjs ci-scaffold.cjs lib/ci-profile.cjs; do cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"; done
for f in workflow-template.yml job-block-template.yml; do cp "$CHECKOUT/$A/$f" "$SCRATCH/$A/$f"; done
cp "$CHECKOUT/$I/repository-identity.cjs" "$SCRATCH/$I/repository-identity.cjs"
cat > "$SCRATCH/.github/workflows/tests.yml" <<'YML'
name: Tests
on: push
permissions:
  contents: read
concurrency:
  group: tests-${{ github.ref }}
jobs:
  unit:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/gate.yml" <<'YML'
name: Gate
on: pull_request
permissions:
  contents: read
concurrency:
  group: gate-${{ github.ref }}
jobs:
  gate:
    name: Required gate
    if: vars.ACME_CI != 'off' && vars.ACME_CI_GATE != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/.github/workflows/lint.yml" <<'YML'
name: Lint
on: push
permissions:
  contents: read
concurrency:
  group: lint-${{ github.ref }}
jobs:
  lint:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_LINT != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML
cat > "$SCRATCH/bin/gh" <<'SH'
#!/bin/sh
echo "$*" >> "$(dirname "$0")/calls.log"
case "$*" in
  "variable list --json name,value") echo '[{"name":"ACME_CI_LINT","value":"off"}]' ;;
  "repo view --json defaultBranchRef --jq .defaultBranchRef.name") echo main ;;
  "api repos/{owner}/{repo}/rules/branches/main") echo '[{"type":"required_status_checks","parameters":{"required_status_checks":[{"context":"Required gate","integration_id":1}]}}]' ;;
  *) echo "unexpected gh call: $*" >&2; exit 1 ;;
esac
SH
chmod +x "$SCRATCH/bin/gh"

```

### Step 2

```bash

cd "$SCRATCH" && export NODE_PATH="$CHECKOUT/.skilled/node_modules" PATH="$SCRATCH/bin:$PATH"
node $S/ci-report.cjs --json --sha=0123456789abcdef0123456789abcdef01234567 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source);console.log("errors "+j.errors.length);for(const w of j.workflows)console.log(w.file+" switch "+w.switch+" flags "+(w.flags.join(",")||"none"));console.log("variables "+JSON.stringify(j.variables))})'

```

### Step 3

```bash

node $S/ci-scaffold.cjs | grep -c -E 'SKILLED|\.skilled|\.opencode|skilled/\*\*|actions/setup|README|bun-version'
node $S/ci-scaffold.cjs --protected | wc -c | tr -d ' '

```

### Step 4

```bash

node $S/ci-toggle.cjs --variable=ACME_CI_TESTS --state=off; echo "exit $?"
node $S/ci-toggle.cjs --variable=ACME_CI_GATE --state=off; echo "exit $?"
node $S/ci-toggle.cjs --variable=ACME_CI --state=off; echo "exit $?"
node $S/ci-toggle.cjs --variable=SKILLED_CI_TESTS --state=off; echo "exit $?"
grep -c -E '^variable (set|delete)' bin/calls.log
cd - > /dev/null && rm -rf "$SCRATCH"

```

### Step 5

```bash

for p in .skilled/commands/doctor/ci.md .skilled/commands/doctor/scripts/ci-report.cjs .skilled/commands/doctor/scripts/lib/ci-profile.cjs; do test -e "$p" && echo "OK $p" || echo "MISS $p"; done

```

## Output and exit codes

```text

__STEP__ 1
__BLOCK_EXIT__ 0
__STEP__ 2
profile default
errors 0
gate.yml switch on flags none
lint.yml switch off flags none
tests.yml switch on flags none
variables {"ACME_CI":"unset","ACME_CI_GATE":"unset","ACME_CI_LINT":"off","ACME_CI_TESTS":"unset"}
__BLOCK_EXIT__ 0
__STEP__ 3
0
0
__BLOCK_EXIT__ 0
__STEP__ 4
SWITCH CHANGE PLAN
Variable: ACME_CI_TESTS
Now: on (unset)
Change: off
Covers: tests.yml
Command: gh variable set ACME_CI_TESTS --body off
Undo: gh variable delete ACME_CI_TESTS
STATUS=OK ACTION=plan
exit 0
REFUSE: ACME_CI_GATE must stay unset while the ruleset requires that context
STATUS=FAIL ERROR="refused"
exit 1
REFUSE: ACME_CI must stay unset while the ruleset requires that context
STATUS=FAIL ERROR="refused"
exit 1
REFUSE: SKILLED_CI_TESTS is not a documented switch
STATUS=FAIL ERROR="refused"
exit 1
0
__BLOCK_EXIT__ 0
__STEP__ 5
OK .skilled/commands/doctor/ci.md
OK .skilled/commands/doctor/scripts/ci-report.cjs
OK .skilled/commands/doctor/scripts/lib/ci-profile.cjs
__BLOCK_EXIT__ 0

TRACE (previous command exit before next command):
__TRACE__ exit=0 next=printf "__STEP__ 1\n"
__TRACE__ exit=0 next=CHECKOUT="$PWD"
__TRACE__ exit=0 next=SCRATCH="/Users/michelkerkmeester/worktrees/public/.scratch-dc90/fixtures/ci-foreign-repository-profile"
__TRACE__ exit=0 next=S=.skilled/commands/doctor/scripts
__TRACE__ exit=0 next=A=.skilled/skills/sk-code/sk-code-ci/assets
__TRACE__ exit=0 next=I=.skilled/skills/sk-code/shared/scripts/lib
__TRACE__ exit=0 next=mkdir -p "$SCRATCH/$S/lib" "$SCRATCH/$A" "$SCRATCH/$I" "$SCRATCH/.github/workflows" "$SCRATCH/bin"
__TRACE__ exit=0 next=for f in ci-report.cjs ci-toggle.cjs ci-scaffold.cjs lib/ci-profile.cjs
__TRACE__ exit=0 next=cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"
__TRACE__ exit=0 next=for f in ci-report.cjs ci-toggle.cjs ci-scaffold.cjs lib/ci-profile.cjs
__TRACE__ exit=0 next=cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"
__TRACE__ exit=0 next=for f in ci-report.cjs ci-toggle.cjs ci-scaffold.cjs lib/ci-profile.cjs
__TRACE__ exit=0 next=cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"
__TRACE__ exit=0 next=for f in ci-report.cjs ci-toggle.cjs ci-scaffold.cjs lib/ci-profile.cjs
__TRACE__ exit=0 next=cp "$CHECKOUT/$S/$f" "$SCRATCH/$S/$f"
__TRACE__ exit=0 next=for f in workflow-template.yml job-block-template.yml
__TRACE__ exit=0 next=cp "$CHECKOUT/$A/$f" "$SCRATCH/$A/$f"
__TRACE__ exit=0 next=for f in workflow-template.yml job-block-template.yml
__TRACE__ exit=0 next=cp "$CHECKOUT/$A/$f" "$SCRATCH/$A/$f"
__TRACE__ exit=0 next=cp "$CHECKOUT/$I/repository-identity.cjs" "$SCRATCH/$I/repository-identity.cjs"
__TRACE__ exit=0 next=cat > "$SCRATCH/.github/workflows/tests.yml"  <<'YML'
name: Tests
on: push
permissions:
  contents: read
concurrency:
  group: tests-${{ github.ref }}
jobs:
  unit:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML

__TRACE__ exit=0 next=cat > "$SCRATCH/.github/workflows/gate.yml"  <<'YML'
name: Gate
on: pull_request
permissions:
  contents: read
concurrency:
  group: gate-${{ github.ref }}
jobs:
  gate:
    name: Required gate
    if: vars.ACME_CI != 'off' && vars.ACME_CI_GATE != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML

__TRACE__ exit=0 next=cat > "$SCRATCH/.github/workflows/lint.yml"  <<'YML'
name: Lint
on: push
permissions:
  contents: read
concurrency:
  group: lint-${{ github.ref }}
jobs:
  lint:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_LINT != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
YML

__TRACE__ exit=0 next=cat > "$SCRATCH/bin/gh"  <<'SH'
#!/bin/sh
echo "$*" >> "$(dirname "$0")/calls.log"
case "$*" in
  "variable list --json name,value") echo '[{"name":"ACME_CI_LINT","value":"off"}]' ;;
  "repo view --json defaultBranchRef --jq .defaultBranchRef.name") echo main ;;
  "api repos/{owner}/{repo}/rules/branches/main") echo '[{"type":"required_status_checks","parameters":{"required_status_checks":[{"context":"Required gate","integration_id":1}]}}]' ;;
  *) echo "unexpected gh call: $*" >&2; exit 1 ;;
esac
SH

__TRACE__ exit=0 next=chmod +x "$SCRATCH/bin/gh"
__TRACE__ exit=0 next=printf "__BLOCK_EXIT__ %s\n" "$?"
__TRACE__ exit=0 next=printf "__STEP__ 2\n"
__TRACE__ exit=0 next=cd "$SCRATCH"
__TRACE__ exit=0 next=export NODE_PATH="$CHECKOUT/.skilled/node_modules" PATH="$SCRATCH/bin:$PATH"
__TRACE__ exit=0 next=node $S/ci-report.cjs --json --sha=0123456789abcdef0123456789abcdef01234567
__TRACE__ exit=0 next=node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("profile "+j.profile.source);console.log("errors "+j.errors.length);for(const w of j.workflows)console.log(w.file+" switch "+w.switch+" flags "+(w.flags.join(",")||"none"));console.log("variables "+JSON.stringify(j.variables))})'
__TRACE__ exit=0 next=printf "__BLOCK_EXIT__ %s\n" "$?"
__TRACE__ exit=0 next=printf "__STEP__ 3\n"
__TRACE__ exit=0 next=node $S/ci-scaffold.cjs
__TRACE__ exit=0 next=grep -c -E 'SKILLED|\.skilled|\.opencode|skilled/\*\*|actions/setup|README|bun-version'
__TRACE__ exit=1 next=node $S/ci-scaffold.cjs --protected
__TRACE__ exit=0 next=wc -c
__TRACE__ exit=0 next=tr -d ' '
__TRACE__ exit=0 next=printf "__BLOCK_EXIT__ %s\n" "$?"
__TRACE__ exit=0 next=printf "__STEP__ 4\n"
__TRACE__ exit=0 next=node $S/ci-toggle.cjs --variable=ACME_CI_TESTS --state=off
__TRACE__ exit=0 next=echo "exit $?"
__TRACE__ exit=0 next=node $S/ci-toggle.cjs --variable=ACME_CI_GATE --state=off
__TRACE__ exit=1 next=echo "exit $?"
__TRACE__ exit=0 next=node $S/ci-toggle.cjs --variable=ACME_CI --state=off
__TRACE__ exit=1 next=echo "exit $?"
__TRACE__ exit=0 next=node $S/ci-toggle.cjs --variable=SKILLED_CI_TESTS --state=off
__TRACE__ exit=1 next=echo "exit $?"
__TRACE__ exit=0 next=grep -c -E '^variable (set|delete)' bin/calls.log
__TRACE__ exit=1 next=cd - > /dev/null
__TRACE__ exit=0 next=rm -rf "$SCRATCH"
__TRACE__ exit=0 next=printf "__BLOCK_EXIT__ %s\n" "$?"
__TRACE__ exit=0 next=printf "__STEP__ 5\n"
__TRACE__ exit=0 next=for p in .skilled/commands/doctor/ci.md .skilled/commands/doctor/scripts/ci-report.cjs .skilled/commands/doctor/scripts/lib/ci-profile.cjs
__TRACE__ exit=0 next=test -e "$p"
__TRACE__ exit=0 next=echo "OK $p"
__TRACE__ exit=0 next=for p in .skilled/commands/doctor/ci.md .skilled/commands/doctor/scripts/ci-report.cjs .skilled/commands/doctor/scripts/lib/ci-profile.cjs
__TRACE__ exit=0 next=test -e "$p"
__TRACE__ exit=0 next=echo "OK $p"
__TRACE__ exit=0 next=for p in .skilled/commands/doctor/ci.md .skilled/commands/doctor/scripts/ci-report.cjs .skilled/commands/doctor/scripts/lib/ci-profile.cjs
__TRACE__ exit=0 next=test -e "$p"
__TRACE__ exit=0 next=echo "OK $p"
__TRACE__ exit=0 next=printf "__BLOCK_EXIT__ %s\n" "$?"

Shell exit: 0

```

## Pass criteria

Default profile, no errors or workflow flags, lint off. Scaffold has zero repository-specific lines and empty protected output. Tests switch is planned with exact command. Gate, master and unknown switches are refused. Stub logs zero writes. All three resources exist.

VERDICT: PASS

