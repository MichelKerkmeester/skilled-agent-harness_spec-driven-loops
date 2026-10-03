#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK MCP MUTATION CLASS TESTS
# ───────────────────────────────────────────────────────────────
# Exercises check-mcp-mutation-class.sh against fixture trees built under a
# temporary directory, so no test reads or writes the real repository.
#
# Usage: bash .skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh
#
# Exit Codes:
#   0 - Every test passed
#   1 - At least one test failed

# Fixtures write literal shell text into doctors, so single quotes are intended.
# shellcheck disable=SC2016
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. HARNESS
# ───────────────────────────────────────────────────────────────

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GUARD="$TEST_DIR/../check-mcp-mutation-class.sh"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/mutclass-test.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

PASS=0
FAIL=0
OUT=""
RC=0

pass() { printf 'PASS: %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf 'FAIL: %s\n' "$1"; FAIL=$((FAIL + 1)); }

# Run the guard on a fixture root, capturing combined output and exit code
run_guard() {
  RC=0
  OUT="$(bash "$GUARD" "$@" 2>&1)" || RC=$?
}

expect_rc() {
  local name="$1" want="$2"
  if [[ "$RC" -eq "$want" ]]; then pass "$name"; else fail "$name (exit $RC, want $want)"; printf '%s\n' "$OUT" | sed 's/^/    | /'; fi
}

expect_out() {
  local name="$1" needle="$2"
  if printf '%s\n' "$OUT" | grep -qF -- "$needle"; then pass "$name"; else fail "$name (missing: $needle)"; printf '%s\n' "$OUT" | sed 's/^/    | /'; fi
}

expect_no_out() {
  local name="$1" needle="$2"
  if printf '%s\n' "$OUT" | grep -qF -- "$needle"; then fail "$name (unexpected: $needle)"; printf '%s\n' "$OUT" | sed 's/^/    | /'; else pass "$name"; fi
}

# ───────────────────────────────────────────────────────────────
# 2. FIXTURES
# ───────────────────────────────────────────────────────────────

# Build a fixture root holding one clean doctor, one installer and one embedded
# setup.sh, all listed in the manifest. Prints the root path.
new_root() {
  local root
  root="$(mktemp -d "$WORK/root.XXXXXX")"
  local skill="$root/.skilled/skills/mcp-tooling/mcp-demo"
  mkdir -p "$skill/scripts" "$skill/mcp-servers/demo-cli" "$root/.skilled/commands/doctor/assets"
  cat > "$skill/scripts/doctor.sh" <<'SH'
#!/usr/bin/env bash
command -v node >/dev/null 2>&1 || echo "node missing"
echo "do NOT run 'rm -rf ~/.cache' or 'npm i -g demo'"
SH
  cat > "$skill/scripts/install.sh" <<'SH'
#!/usr/bin/env bash
npm install -g demo-cli
SH
  cat > "$skill/mcp-servers/demo-cli/setup.sh" <<'SH'
#!/usr/bin/env bash
npm install
SH
  cat > "$root/.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml" <<'YAML'
cli_skill_diagnostics:
  mcp-demo:
    skill_dir: ".skilled/skills/mcp-tooling/mcp-demo"
    install_script: "scripts/install.sh"
    install_script_mutation_class: mutating
    doctor_script: "scripts/doctor.sh"
    doctor_script_mutation_class: read-only
    setup_script: "mcp-servers/demo-cli/setup.sh"
    setup_script_mutation_class: mutating
YAML
  printf '%s' "$root"
}

doctor_of() { printf '%s' "$1/.skilled/skills/mcp-tooling/mcp-demo/scripts/doctor.sh"; }
manifest_of() { printf '%s' "$1/.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml"; }

# ───────────────────────────────────────────────────────────────
# 3. HAPPY PATH AND CORE DRIFT
# ───────────────────────────────────────────────────────────────

ROOT="$(new_root)"
run_guard "$ROOT"
expect_rc "clean fixture passes" 0
expect_out "clean doctor reported read-only PASS" "PASS  .skilled/skills/mcp-tooling/mcp-demo/scripts/doctor.sh"

ROOT="$(new_root)"
printf 'curl https://example.invalid/status\n' >> "$(doctor_of "$ROOT")"
run_guard "$ROOT"
expect_rc "doctor with unbounded curl fails" 1
expect_out "curl finding names the file and line" "mcp-demo/scripts/doctor.sh:4  [read-only script: curl/wget without a timeout"

ROOT="$(new_root)"
printf 'command -v curl >/dev/null && curl https://example.invalid\n' >> "$(doctor_of "$ROOT")"
run_guard "$ROOT"
expect_rc "a probe does not excuse a real curl call on the same line" 1

ROOT="$(new_root)"
rm "$ROOT/.skilled/skills/mcp-tooling/mcp-demo/scripts/install.sh"
run_guard "$ROOT"
expect_rc "a manifest row whose file is missing fails" 1
expect_out "missing installer is named" "declared mutating but file is missing"

# ───────────────────────────────────────────────────────────────
# 4. DISCOVERY COVERAGE
# ───────────────────────────────────────────────────────────────

ROOT="$(new_root)"
mkdir -p "$ROOT/.skilled/skills/mcp-tooling/mcp-other/scripts"
printf '#!/usr/bin/env bash\necho ok\n' > "$ROOT/.skilled/skills/mcp-tooling/mcp-other/scripts/doctor.sh"
run_guard "$ROOT"
expect_rc "an unlisted mcp-tooling doctor fails" 1
expect_out "unlisted doctor is named" "FAIL  .skilled/skills/mcp-tooling/mcp-other/scripts/doctor.sh  [no manifest row"

ROOT="$(new_root)"
mkdir -p "$ROOT/.skilled/skills/mcp-tooling/mcp-other/mcp-servers/other-cli"
printf '#!/usr/bin/env bash\nnpm install\n' > "$ROOT/.skilled/skills/mcp-tooling/mcp-other/mcp-servers/other-cli/setup.sh"
run_guard "$ROOT"
expect_rc "an unlisted mcp-tooling setup.sh fails" 1
expect_out "unlisted setup.sh is named" "mcp-other/mcp-servers/other-cli/setup.sh  [no manifest row"

ROOT="$(new_root)"
mkdir -p "$ROOT/.skilled/skills/mcp-top/scripts"
printf '#!/usr/bin/env bash\necho ok\n' > "$ROOT/.skilled/skills/mcp-top/scripts/install-helper.sh"
run_guard "$ROOT"
expect_rc "an unlisted top-level mcp-* installer fails" 1
expect_out "unlisted top-level installer is named" "mcp-top/scripts/install-helper.sh  [no manifest row"

ROOT="$(new_root)"
mkdir -p "$ROOT/.skilled/skills/mcp-tooling/mcp-other/scripts"
printf '#!/usr/bin/env bash\necho ok\n' > "$ROOT/.skilled/skills/mcp-tooling/mcp-other/scripts/update.sh"
run_guard "$ROOT"
expect_rc "a script the hook never sends is not required to have a row" 0

# ───────────────────────────────────────────────────────────────
# 5. SCANNER PRECISION
# ───────────────────────────────────────────────────────────────

ROOT="$(new_root)"
printf 'if command -v curl >/dev/null 2>&1; then echo "curl found"; fi\ncommand -v wget >/dev/null || true\n' >> "$(doctor_of "$ROOT")"
run_guard "$ROOT"
expect_rc "command -v curl and wget probes pass" 0

for rm_form in 'rm -r -f "$dir"' 'rm -f -r "$dir"' 'rm -Rf "$dir"' 'rm --recursive --force "$dir"' 'rm -v -rf "$dir"'; do
  ROOT="$(new_root)"
  printf '%s\n' "$rm_form" >> "$(doctor_of "$ROOT")"
  run_guard "$ROOT"
  expect_rc "doctor with '$rm_form' fails" 1
done

ROOT="$(new_root)"
cat >> "$(doctor_of "$ROOT")" <<'SH'
cat <<'TEXT'
Run npx some-server or curl https://example.invalid by hand.
TEXT
cat <<-USAGE
	Usage: npm install -g demo
	USAGE
echo "cat <<EOF is how help text starts"
SH
run_guard "$ROOT"
expect_rc "forbidden words inside heredoc help text pass" 0

ROOT="$(new_root)"
cat >> "$(doctor_of "$ROOT")" <<'SH'
echo "a quoted <<EOF must not hide the next line"
curl https://example.invalid
SH
run_guard "$ROOT"
expect_rc "a quoted heredoc marker does not hide later code" 1

ROOT="$(new_root)"
cat >> "$(doctor_of "$ROOT")" <<'SH'
cat <<EOF
status: $(curl https://example.invalid)
EOF
SH
run_guard "$ROOT"
expect_rc "a command substitution inside an unquoted heredoc is still scanned" 1

ROOT="$(new_root)"
printf 'rm -f "$tmp"\nrm -r "$dir"\n' >> "$(doctor_of "$ROOT")"
run_guard "$ROOT"
expect_rc "rm without both recursive and force passes" 0

# ───────────────────────────────────────────────────────────────
# 6. MANIFEST CONTRACT AND HARNESS ERRORS
# ───────────────────────────────────────────────────────────────

ROOT="$(new_root)"
cat >> "$(manifest_of "$ROOT")" <<'YAML'
  mcp-doctor-only:
    skill_dir: ".skilled/skills/mcp-tooling/mcp-doctor-only"
    install_script: null
    install_script_mutation_class: none
YAML
run_guard "$ROOT"
expect_rc "install_script: null with class none passes" 0
expect_out "the none sentinel is reported" "PASS  cli_skill_diagnostics.mcp-doctor-only.install_script  [declared none"

ROOT="$(new_root)"
sed -i.bak 's/doctor_script_mutation_class: read-only/doctor_script_mutation_class: none/' "$(manifest_of "$ROOT")"
run_guard "$ROOT"
expect_rc "class none on a real script path fails" 1

ROOT="$(new_root)"
printf 'servers: [unclosed\n' > "$(manifest_of "$ROOT")"
run_guard "$ROOT"
expect_rc "a malformed manifest is a harness error" 2

ROOT="$(new_root)"
printf -- '- just\n- a list\n' > "$(manifest_of "$ROOT")"
run_guard "$ROOT"
expect_rc "a top-level list manifest is a harness error" 2

ROOT="$(new_root)"
NOYAML="$WORK/noyaml"
mkdir -p "$NOYAML/yaml"
printf 'raise ImportError("PyYAML hidden for this test")\n' > "$NOYAML/yaml/__init__.py"
RC=0
OUT="$(PYTHONPATH="$NOYAML" bash "$GUARD" "$ROOT" 2>&1)" || RC=$?
expect_rc "missing PyYAML is a harness error" 2
expect_out "missing PyYAML is named" "PyYAML"

ROOT="$(new_root)"
rm "$(manifest_of "$ROOT")"
run_guard "$ROOT"
expect_rc "a missing manifest is a harness error" 2

run_guard "$WORK/does-not-exist"
expect_rc "a missing repo root is a harness error" 2

run_guard --bogus
expect_rc "an unknown option is a harness error" 2

run_guard --help
expect_rc "--help exits 0" 0

# ───────────────────────────────────────────────────────────────
# 7. SUMMARY
# ───────────────────────────────────────────────────────────────

printf 'Results: %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
