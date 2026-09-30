#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: RUNTIME ALIGNMENT LOOP DRIVER
# ───────────────────────────────────────────────────────────────
# Sends one short DeepSeek brief per file or folder through Pi, keeps an edit
# only when it is provably comment-only (or a lone new README), and reverts
# anything else. Every BATCH kept edits it runs the typecheck, and at the end the
# full test suite; it stops if either falls below the recorded baseline.
#
# Usage: align-loop.sh <skill> <header|sections|readme> [--limit N] [--dry-run]
#   skill: system-skill-advisor | system-spec-kit | system-deep-loop
# Env:   ALIGN_WORKTREE, ALIGN_MODEL, ALIGN_THINKING, ALIGN_BATCH, ALIGN_TIMEOUT
set -uo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
WT="${ALIGN_WORKTREE:-$REPO/.worktrees/070-runtime-code-alignment}"
MODEL="${ALIGN_MODEL:-opencode-go/deepseek-v4.1-flash}"
THINKING="${ALIGN_THINKING:-high}"
BATCH="${ALIGN_BATCH:-25}"
TIMEOUT="${ALIGN_TIMEOUT:-600}"
CHECKS="$HERE/align_loop_checks.py"
STATE="$HERE/loop-state"
BASELINE="$HERE/baseline"

SKILL="${1:-}"
MODE="${2:-}"
shift 2 2>/dev/null || true
LIMIT=0
DRY_RUN=0
while [ $# -gt 0 ]; do
  case "$1" in
    --limit) LIMIT="$2"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

case "$SKILL" in
  system-skill-advisor)
    PKG=".skilled/skills/system-skill-advisor/runtime"; BASE_NAME="advisor"
    PACKET="specs/system-skill-advisor/031-align-runtime-code-with-sk-code-opencode"
    # The CLI shim refuses a dist older than its sources (exit 69), so rebuild first.
    TEST_CMD="npm run build >/dev/null 2>&1 && npx vitest run" ;;
  system-deep-loop)
    PKG=".skilled/skills/system-deep-loop/runtime"; BASE_NAME="deeploop"
    PACKET="specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode"
    TEST_CMD="npx vitest run --no-coverage" ;;
  system-spec-kit)
    PKG=".skilled/skills/system-spec-kit"; BASE_NAME="speckit"
    PACKET="specs/system-speckit/046-align-runtime-code-with-sk-code-opencode"
    # test:runtime also runs deep-loop's suites and overruns its 600 s bound, so
    # the gate runs spec-kit's own two projects, after a build because several
    # suites read compiled dist output.
    TEST_CMD="(cd shared && npm run build) >/dev/null 2>&1 && (cd runtime && npm run build) >/dev/null 2>&1 && (cd runtime/cli && npm run build) >/dev/null 2>&1 && npx vitest run --config vitest.config.ts --project root --project cli" ;;
  *) echo "usage: align-loop.sh <skill> <header|sections|readme> [--limit N] [--dry-run]" >&2; exit 2 ;;
esac
case "$MODE" in header|sections|readme) ;; *) echo "mode must be header, sections or readme" >&2; exit 2 ;; esac

# ALIGN_SCAN widens the target scan, for example to a whole skill root.
RUNTIME="${ALIGN_SCAN:-.skilled/skills/$SKILL/runtime}"
DONE_FILE="$STATE/$SKILL-$MODE.done"
LOG_FILE="$STATE/$SKILL-$MODE.log"
RUNS="$STATE/runs/$SKILL-$MODE"
mkdir -p "$RUNS"
touch "$DONE_FILE" "$LOG_FILE"

# ───────────────────────────────────────────────────────────────
# 2. BRIEFS
# ───────────────────────────────────────────────────────────────

RULE_LINE='// ───────────────────────────────────────────────────────────────────'

preamble() {
  cat <<EOF
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.
You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are set.
The spec folder is: $PACKET
Proceed directly. Do not print options. Do not ask anything. Do not run commands.

ROLE: You are a careful code editor. You change comments only, exactly as told.
Working directory: $WT
EOF
}

brief_header() {
  cat <<EOF
$(preamble)

TASK: In the file $1, add this module header as the first lines of the file:

$RULE_LINE
// MODULE: [Module Name]
$RULE_LINE

Rules:
- Replace [Module Name] with a short Title Case name (2 to 5 words) for what the file does.
- If line 1 is a shebang (#!), keep it as line 1 and put the header right after it.
- If the file already opens with a different banner comment (a ╔═╗ box, a line of === or ---), replace that banner with the header and reuse its title as the module name.
- Change nothing else. Do not touch any code line, import or other comment.

Edit the file with your edit tool. Your task is done when the file starts with the header.
EOF
}

brief_sections() {
  cat <<EOF
$(preamble)

TASK: In the file $1, add numbered section dividers around the existing code.

Divider format (copy the rule lines exactly):
$RULE_LINE
// 1. IMPORTS
$RULE_LINE

Use these section names, in this order, only for sections the file actually has:
IMPORTS, TYPE DEFINITIONS, CONSTANTS, HELPERS, CORE LOGIC, EXPORTS.
A file may also use a more specific ALL-CAPS name when a block clearly is one thing, e.g. CLI ENTRY or DATABASE SCHEMA.

Rules:
- Number sections 1, 2, 3 in the order they appear. The module header at the top is not a section.
- Do not move, reorder, change or delete any code line. Only insert divider comments between existing blocks.
- Replace other divider styles (// ----, // ====, // ── Title ──, /* ─── */ blocks) with this format, keeping their titles in ALL CAPS.
- Leave every other comment as it is.

Edit the file with your edit tool. Your task is done when the file has numbered dividers.
EOF
}

brief_readme() {
  cat <<EOF
$(preamble)

TASK: Create the file $1/README.md for the code folder $1.

Steps:
1. Read .skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md, sections 4 WRITING RULES and 5 FILLABLE SCAFFOLD.
2. Read every file directly inside $1 (not subfolders).
3. Write $1/README.md from the scaffold, describing only what those files do today.

Rules:
- Keep it short. Delete scaffold sections that do not apply; leave no [brackets] or placeholders.
- Never mention spec folders, packet numbers, phases or task ids.
- Create only that one file. Do not edit any other file.

Your task is done when $1/README.md exists.
EOF
}

# ───────────────────────────────────────────────────────────────
# 3. HELPERS
# ───────────────────────────────────────────────────────────────

log() { printf '%s\t%s\t%s\t%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$2" "$3" | tee -a "$LOG_FILE"; }

# Fingerprint of every change in the worktree outside the target, so an edit
# that strays into another file is caught even when that file was already dirty.
outside_fingerprint() {
  local target="$1"
  { git -C "$WT" diff -- . ":(exclude)$target" ; git -C "$WT" ls-files -o --exclude-standard | grep -v -x -F -e "$target" -e "$target/README.md" ; } | shasum | cut -d' ' -f1
}

# Changed tracked paths plus untracked names outside the target, so a mismatch
# can be logged by name instead of only as a differing hash.
outside_paths() {
  local target="$1"
  { git -C "$WT" diff --name-only -- . ":(exclude)$target" ; git -C "$WT" ls-files -o --exclude-standard | grep -v -x -F -e "$target" -e "$target/README.md" ; } | sort
}

dispatch() {
  local brief="$1" tools="$2" out="$3"
  ( cd "$WT" && PI_BLACKHOLE_PASSIVE=true AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 \
      pi -p "$brief" --model "$MODEL" --thinking "$THINKING" --mode text --offline --tools "$tools" \
      </dev/null >"$out" 2>"$out.err" ) &
  local pid=$! waited=0
  while kill -0 "$pid" 2>/dev/null; do
    if [ "$waited" -ge "$TIMEOUT" ]; then
      kill -9 "$pid" 2>/dev/null; pkill -9 -P "$pid" 2>/dev/null
      echo "timeout after ${TIMEOUT}s" >>"$out.err"
      return 124
    fi
    sleep 5; waited=$((waited + 5))
  done
  wait "$pid"
}

provider_error() {
  # A bare status number also matches model prose ("429 lines"), so it only
  # counts next to HTTP wording.
  grep -q -i -E 'No API key|401 Unauthorized|(HTTP|status|error)[^a-z]{0,3}429|429 Too Many|rate limit|quota|monthly .* limit|request was rejected|timeout after' "$1" "$1.err" 2>/dev/null
}

baseline_counts() {
  grep -E 'Tests +[0-9]' "$BASELINE/$BASE_NAME-test.log" | tail -1
}

# Passed and failed counts from a vitest summary line.
count_of() { grep -o -E "[0-9]+ $1" <<<"$2" | head -1 | cut -d' ' -f1; }

# The per-file comment-only proof already rules out behavior change, so a batch
# runs only the typecheck; the full suite costs minutes and runs once per mode.
gate_batch() {
  local full="${1:-}" tc_log="$RUNS/gate-typecheck.log" test_log="$RUNS/gate-test.log"
  ( cd "$WT/$PKG" && npm run typecheck >"$tc_log" 2>&1 ) || { log "-" GATE-FAIL "typecheck failed, see $tc_log"; return 1; }
  if [ "$full" != "full" ]; then
    log "-" GATE-PASS "typecheck"
    return 0
  fi
  ( cd "$WT/$PKG" && eval "$TEST_CMD" >"$test_log" 2>&1 )
  local now base
  now="$(grep -E 'Tests +[0-9]' "$test_log" | tail -1)"
  base="$(baseline_counts)"
  local now_pass base_pass now_fail base_fail
  now_pass="$(count_of passed "$now")"; base_pass="$(count_of passed "$base")"
  now_fail="$(count_of failed "$now")"; base_fail="$(count_of failed "$base")"
  now_fail="${now_fail:-0}"; base_fail="${base_fail:-0}"
  if [ -z "$now_pass" ] || [ "$now_pass" -lt "$base_pass" ] || [ "$now_fail" -gt "$base_fail" ]; then
    log "-" GATE-FAIL "tests now [$now] vs baseline [$base]"
    return 1
  fi
  log "-" GATE-PASS "tests [$now]"
}

# ───────────────────────────────────────────────────────────────
# 4. CORE LOGIC
# ───────────────────────────────────────────────────────────────

command -v pi >/dev/null || { echo "pi is not on PATH" >&2; exit 1; }
[ -d "$WT" ] || { echo "worktree not found: $WT" >&2; exit 1; }
[ -f "$BASELINE/$BASE_NAME-test.log" ] || { echo "no test baseline at $BASELINE/$BASE_NAME-test.log" >&2; exit 1; }

# macOS ships bash 3.2, which has no mapfile.
TARGETS=()
while IFS= read -r line; do
  [ -n "$line" ] && TARGETS+=("$line")
done < <(python3 "$CHECKS" targets "$WT" "$RUNTIME" "$MODE")
echo "targets: ${#TARGETS[@]} ($SKILL $MODE), already done: $(wc -l <"$DONE_FILE" | tr -d ' ')"

if [ "$DRY_RUN" -eq 1 ]; then
  printf '%s\n' "${TARGETS[@]}" | head -20
  [ "${#TARGETS[@]}" -gt 0 ] && "brief_$MODE" "${TARGETS[0]}"
  exit 0
fi

# Restore from the pre-dispatch snapshot, never from HEAD: earlier modes leave
# their kept edits uncommitted, and a checkout would silently discard them.
restore_target() {
  if [ "$MODE" = "readme" ]; then rm -f "$WT/$2"; else cp "$RUNS/$3.before" "$WT/$1"; fi
}

kept=0 attempted=0 provider_strikes=0
for target in "${TARGETS[@]}"; do
  grep -q -x -F "$target" "$DONE_FILE" && continue
  [ "$LIMIT" -gt 0 ] && [ "$attempted" -ge "$LIMIT" ] && break
  attempted=$((attempted + 1))

  slug="$(tr '/' '_' <<<"$target")"
  out="$RUNS/$slug.out"
  before_fp="$(outside_fingerprint "$target")"
  outside_paths "$target" >"$RUNS/$slug.outside-before"

  if [ "$MODE" = "readme" ]; then
    tools="read,write,ls"; edited="$target/README.md"
  else
    tools="read,edit"; edited="$target"
    cp "$WT/$target" "$RUNS/$slug.before"
  fi

  dispatch "$("brief_$MODE" "$target")" "$tools" "$out"
  if provider_error "$out"; then
    provider_strikes=$((provider_strikes + 1))
    restore_target "$target" "$edited" "$slug"
    log "$target" PROVIDER "$(tail -1 "$out.err")"
    [ "$provider_strikes" -ge 3 ] && { log "-" STOP "three provider errors in a row"; exit 3; }
    continue
  fi
  provider_strikes=0

  reason=""
  if [ "$(outside_fingerprint "$target")" != "$before_fp" ]; then
    reason="edited files outside the target: $(outside_paths "$target" | comm -3 "$RUNS/$slug.outside-before" - | tr -d '\t' | head -3 | tr '\n' ' ')"
  fi
  if [ -z "$reason" ]; then
    case "$MODE" in
      header)
        reason="$(python3 "$CHECKS" comment-only "$RUNS/$slug.before" "$WT/$target")" \
          && { python3 "$CHECKS" has-header "$WT/$target" && reason="" || reason="header still missing"; } ;;
      sections)
        reason="$(python3 "$CHECKS" comment-only "$RUNS/$slug.before" "$WT/$target")" && reason=""
        if [ -z "$reason" ] && python3 "$CHECKS" targets "$WT" "$RUNTIME" sections | grep -q -x -F "$target"; then
          reason="checker still flags the file"
        fi ;;
      readme)
        [ -f "$WT/$edited" ] || reason="README not written"
        # A bracket not followed by "(" is scaffold text, not a markdown link.
        [ -z "$reason" ] && grep -q -E '\[[A-Z][^]]*\]([^(]|$)' "$WT/$edited" && reason="placeholder left in README"
        if [ -z "$reason" ] && ! python3 "$WT/.skilled/skills/sk-doc/scripts/validate_document.py" "$WT/$edited" >/dev/null 2>&1; then
          reason="README fails validate_document.py"
        fi ;;
    esac
  fi

  if [ -n "$reason" ]; then
    restore_target "$target" "$edited" "$slug"
    log "$target" REVERTED "$reason"
    continue
  fi

  echo "$target" >>"$DONE_FILE"
  kept=$((kept + 1))
  log "$target" KEPT "$MODE"
  if [ $((kept % BATCH)) -eq 0 ]; then
    gate_batch || { log "-" STOP "batch gate failed after $kept kept edits; bisect the last $BATCH"; exit 4; }
  fi
done

if [ "$kept" -gt 0 ]; then
  gate_batch full || { log "-" STOP "final gate failed"; exit 4; }
fi
log "-" DONE "attempted=$attempted kept=$kept"
