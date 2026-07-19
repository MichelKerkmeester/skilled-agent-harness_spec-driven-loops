#!/usr/bin/env bash
# Sweep stale MCP helper processes and temporary dispatch artifacts.
#
# Usage:
#   orphan-mcp-sweeper.sh [--dry-run] [--verbose] [--log-path PATH]
#
# Defaults:
#   ORPHAN_AGE_MIN_SEC=300
#   ORPHAN_TMP_AGE_HOURS=24
#   ORPHAN_SWEEPER_LOG_MAX_BYTES=10485760
#   ORPHAN_SWEEPER_LOG_PATH=$HOME/.local/share/orphan-sweeper.log

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. RUNTIME CONFIGURATION
# ───────────────────────────────────────────────────────────────

DRY_RUN=false
VERBOSE=false
AGE_MIN_SEC="${ORPHAN_AGE_MIN_SEC:-300}"
TMP_AGE_HOURS="${ORPHAN_TMP_AGE_HOURS:-24}"
LOG_PATH="${ORPHAN_SWEEPER_LOG_PATH:-${HOME:-/tmp}/.local/share/orphan-sweeper.log}"
LOG_EXPLICIT=false
LOG_MAX_BYTES="${ORPHAN_SWEEPER_LOG_MAX_BYTES:-10485760}"
EXIT_CODE=0

CANDIDATE_PIDS=()
CANDIDATE_PPIDS=()
CANDIDATE_CLASSES=()
CANDIDATE_AGES=()
CANDIDATE_ETIMES=()
CANDIDATE_RSSES=()
CANDIDATE_COMMANDS=()
CANDIDATE_DB_DIRS=()

KILL_PIDS=()
KILL_CLASSES=()
KILL_AGES=()
KILL_ETIMES=()
KILL_RSSES=()
KILL_COMMANDS=()

MIN_CLASSES=()
MIN_AGES=()
MIN_PIDS=()

SESSION_TREE_PIDS=()
CONTEXT_SINGLETON_PIDS=()
CONTEXT_SINGLETON_REASONS=()

# ───────────────────────────────────────────────────────────────
# 2. CLI PARSING
# ───────────────────────────────────────────────────────────────

usage() {
  cat <<'EOF'
Usage: orphan-mcp-sweeper.sh [--dry-run] [--verbose] [--log-path PATH]

Options:
  --dry-run        Log matching kill/remove actions without mutating anything.
  --verbose        Log preserve decisions as well as actions.
  --log-path PATH  Append logs to PATH. Default: ~/.local/share/orphan-sweeper.log.
  -h, --help       Show this help.
EOF
}

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      ;;
    --verbose)
      VERBOSE=true
      ;;
    --log-path)
      if [[ "$#" -lt 2 ]]; then
        echo "ERROR: --log-path requires a path" >&2
        exit 1
      fi
      LOG_PATH="$2"
      LOG_EXPLICIT=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION HELPERS
# ───────────────────────────────────────────────────────────────

is_positive_int() {
  case "$1" in
    ''|*[!0-9]*) return 1 ;;
    *) [[ "$1" -gt 0 ]] ;;
  esac
}

if ! is_positive_int "$AGE_MIN_SEC"; then
  AGE_MIN_SEC=300
fi
if ! is_positive_int "$TMP_AGE_HOURS"; then
  TMP_AGE_HOURS=24
fi
if ! is_positive_int "$LOG_MAX_BYTES"; then
  LOG_MAX_BYTES=10485760
fi

should_append_log_file() {
  [[ "$LOG_EXPLICIT" = true ]] || [[ -t 1 ]]
}

# ───────────────────────────────────────────────────────────────
# 4. LOGGING
# ───────────────────────────────────────────────────────────────

rotate_log_if_needed() {
  should_append_log_file || return 0
  [[ -n "$LOG_PATH" ]] || return 0
  [[ -f "$LOG_PATH" ]] || return 0

  local size
  size="$(wc -c < "$LOG_PATH" 2>/dev/null || echo 0)"
  is_positive_int "$size" || size=0
  [[ "$size" -le "$LOG_MAX_BYTES" ]] && return 0

  mv -f "$LOG_PATH.2" "$LOG_PATH.3" 2>/dev/null || true
  mv -f "$LOG_PATH.1" "$LOG_PATH.2" 2>/dev/null || true
  mv -f "$LOG_PATH" "$LOG_PATH.1" 2>/dev/null || true
}

emit() {
  local line
  line="$(date '+%Y-%m-%dT%H:%M:%S%z') $*"
  printf '%s\n' "$line"
  if should_append_log_file && [[ -n "$LOG_PATH" ]]; then
    mkdir -p "$(dirname "$LOG_PATH")" 2>/dev/null || true
    printf '%s\n' "$line" >> "$LOG_PATH" 2>/dev/null || true
  fi
}

log_action() {
  if [[ "$DRY_RUN" = true ]]; then
    emit "[DRY-RUN] $*"
  else
    emit "$*"
  fi
}

log_verbose() {
  [[ "$VERBOSE" = true ]] || return 0
  emit "$*"
}

# ───────────────────────────────────────────────────────────────
# 5. PROCESS CLASSIFICATION
# ───────────────────────────────────────────────────────────────

etime_to_seconds() {
  local raw="$1"
  local days=0
  local rest="$raw"
  local h=0
  local m=0
  local s=0
  local a b c

  case "$rest" in
    *-*)
      days="${rest%%-*}"
      rest="${rest#*-}"
      ;;
  esac

  IFS=: read -r a b c <<EOF
$rest
EOF
  if [[ -n "${c:-}" ]]; then
    h="$a"
    m="$b"
    s="$c"
  elif [[ -n "${b:-}" ]]; then
    m="$a"
    s="$b"
  else
    s="$a"
  fi

  days="${days#0}"; h="${h#0}"; m="${m#0}"; s="${s#0}"
  days="${days:-0}"; h="${h:-0}"; m="${m:-0}"; s="${s:-0}"
  printf '%s\n' $((days * 86400 + h * 3600 + m * 60 + s))
}

classify_command() {
  local cmd="$1"
  case "$cmd" in
    *"mk-spec-memory-launcher.cjs"*) printf '%s\n' "mk-spec-memory-launcher"; return 0 ;;
    *"mk-skill-advisor-launcher.cjs"*) printf '%s\n' "mk-skill-advisor-launcher"; return 0 ;;
    *"mk-code-index-launcher.cjs"*) printf '%s\n' "mk-code-index-launcher"; return 0 ;;
    *"system-spec-kit/mcp-server/dist/context-server.js"*) printf '%s\n' "spec-memory-context-server"; return 0 ;;
    *"hf-model-server.cjs"*) printf '%s\n' "hf-model-server"; return 0 ;;
    *"system-skill-advisor/mcp-server/dist/"*"advisor-server.js"*) printf '%s\n' "skill-advisor-server"; return 0 ;;
    *"system-code-graph/mcp-server/dist/index.js"*) printf '%s\n' "code-graph-server"; return 0 ;;
    *"mcp-code-mode/mcp-server/dist/index.js"*) printf '%s\n' "mcp-code-mode"; return 0 ;;
    *"npm exec @taazkareem/clickup-mcp-server"*) printf '%s\n' "clickup-mcp-wrapper"; return 0 ;;
    *"clickup-mcp-server"*) printf '%s\n' "clickup-mcp-server"; return 0 ;;
    *"npm exec @modelcontextprotocol/server-sequential-thinking"*)
      printf '%s\n' "sequential-thinking-wrapper"
      return 0
      ;;
    *"@modelcontextprotocol/server-sequential-thinking"*|*"server-sequential-thinking"*)
      printf '%s\n' "sequential-thinking-server"
      return 0
      ;;
  esac
  return 1
}

class_index() {
  local class="$1"
  local i
  for i in "${!MIN_CLASSES[@]}"; do
    if [[ "${MIN_CLASSES[$i]}" = "$class" ]]; then
      printf '%s\n' "$i"
      return 0
    fi
  done
  return 1
}

remember_min_for_class() {
  local class="$1"
  local age="$2"
  local pid="$3"
  local idx
  idx="$(class_index "$class" 2>/dev/null || true)"
  if [[ -z "$idx" ]]; then
    MIN_CLASSES+=("$class")
    MIN_AGES+=("$age")
    MIN_PIDS+=("$pid")
    return
  fi
  if (( age < MIN_AGES[idx] )); then
    MIN_AGES[idx]="$age"
    MIN_PIDS[idx]="$pid"
  fi
}

freshest_pid_for_class() {
  local class="$1"
  local idx
  idx="$(class_index "$class" 2>/dev/null || true)"
  [[ -n "$idx" ]] || return 1
  printf '%s\n' "${MIN_PIDS[$idx]}"
}

freshest_age_for_class() {
  local class="$1"
  local idx
  idx="$(class_index "$class" 2>/dev/null || true)"
  [[ -n "$idx" ]] || return 1
  printf '%s\n' "${MIN_AGES[$idx]}"
}

pid_in_list() {
  local needle="$1"
  shift
  local item
  for item in "$@"; do
    [[ "$item" = "$needle" ]] && return 0
  done
  return 1
}

canonical_existing_dir() {
  local dir="$1"
  [[ "$dir" = /* ]] || return 1
  (cd "$dir" 2>/dev/null && pwd -P)
}

resolve_context_server_db_dir() {
  local pid="$1"
  local cmd="$2"
  local env_line token spec_dir="" legacy_dir="" memory_path="" candidate=""

  env_line="$(ps eww -p "$pid" -o command= 2>/dev/null || true)"
  for token in $env_line; do
    case "$token" in
      SPEC_KIT_DB_DIR=*) [[ -n "$spec_dir" ]] || spec_dir="${token#SPEC_KIT_DB_DIR=}" ;;
      SPECKIT_DB_DIR=*) [[ -n "$legacy_dir" ]] || legacy_dir="${token#SPECKIT_DB_DIR=}" ;;
      MEMORY_DB_PATH=*) [[ -n "$memory_path" ]] || memory_path="${token#MEMORY_DB_PATH=}" ;;
    esac
  done

  if [[ -n "$spec_dir" ]]; then
    candidate="$spec_dir"
  elif [[ -n "$legacy_dir" ]]; then
    candidate="$legacy_dir"
  elif [[ -n "$memory_path" ]] && [[ "$memory_path" = */* ]]; then
    candidate="${memory_path%/*}"
  else
    for token in $cmd; do
      case "$token" in
        *"/system-spec-kit/mcp-server/dist/context-server.js"*)
          candidate="${token%%/mcp-server/dist/context-server.js*}/mcp-server/database"
          break
          ;;
      esac
    done
  fi

  canonical_existing_dir "$candidate" 2>/dev/null || printf '%s\n' "unknown"
}

candidate_db_dir_for_pid() {
  local pid="$1"
  local i
  for i in "${!CANDIDATE_PIDS[@]}"; do
    if [[ "${CANDIDATE_PIDS[$i]}" = "$pid" ]]; then
      printf '%s\n' "${CANDIDATE_DB_DIRS[$i]}"
      return 0
    fi
  done
  printf '%s\n' "unknown"
}

has_active_maintenance_marker() {
  local pid="$1"
  local db_dir="$2"
  local marker="$db_dir/.maintenance-active.json"
  [[ -f "$marker" ]] || return 1

  node -e '
    const fs = require("node:fs");
    try {
      const marker = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      const pid = Number(process.argv[2]);
      process.exit(
        Number.isInteger(marker.childPid) && marker.childPid > 0 &&
        marker.childPid === pid && Number.isFinite(marker.activeUntilMs) &&
        marker.activeUntilMs > Date.now() ? 0 : 1
      );
    } catch {
      process.exit(1);
    }
  ' "$marker" "$pid" 2>/dev/null
}

has_confirmed_daemon_listener() {
  local pid="$1"
  local db_dir="$2"
  local socket_path="$db_dir/daemon-ipc.sock"
  local line

  while IFS= read -r line; do
    [[ "$line" = "n$socket_path" ]] && return 0
  done <<EOF
$(lsof -nP -a -p "$pid" -U -FfnT 2>/dev/null || true)
EOF
  return 1
}

daemon_socket_fd_state() {
  local pid="$1"
  local out rc

  if out="$(lsof -nP -a -p "$pid" -U -FfnT 2>/dev/null)"; then
    rc=0
  else
    rc=$?
  fi
  if [[ "$rc" -ne 0 ]] || [[ -z "$out" ]]; then
    printf '%s\n' "unknown"
  elif [[ "$out" = *daemon-ipc.sock* ]]; then
    printf '%s\n' "held"
  else
    printf '%s\n' "none"
  fi
}

has_daemon_socket_fd() {
  [[ "$(daemon_socket_fd_state "$1")" = "held" ]]
}

context_singleton_reason_for_pid() {
  local pid="$1"
  local i
  for i in "${!CONTEXT_SINGLETON_PIDS[@]}"; do
    if [[ "${CONTEXT_SINGLETON_PIDS[$i]}" = "$pid" ]]; then
      printf '%s\n' "${CONTEXT_SINGLETON_REASONS[$i]}"
      return 0
    fi
  done
  return 1
}

build_context_singleton_decisions() {
  local i j db_dir group_count listener_count listener_pid reason
  CONTEXT_SINGLETON_PIDS=()
  CONTEXT_SINGLETON_REASONS=()

  for i in "${!CANDIDATE_PIDS[@]}"; do
    [[ "${CANDIDATE_CLASSES[$i]}" = "spec-memory-context-server" ]] || continue
    db_dir="${CANDIDATE_DB_DIRS[$i]}"
    [[ "$db_dir" != "unknown" ]] || continue
    context_singleton_reason_for_pid "${CANDIDATE_PIDS[$i]}" >/dev/null 2>&1 && continue

    group_count=0
    listener_count=0
    listener_pid=""
    for j in "${!CANDIDATE_PIDS[@]}"; do
      [[ "${CANDIDATE_CLASSES[$j]}" = "spec-memory-context-server" ]] || continue
      [[ "${CANDIDATE_DB_DIRS[$j]}" = "$db_dir" ]] || continue
      group_count=$((group_count + 1))
      if has_confirmed_daemon_listener "${CANDIDATE_PIDS[$j]}" "$db_dir"; then
        listener_count=$((listener_count + 1))
        listener_pid="${CANDIDATE_PIDS[$j]}"
      fi
    done
    [[ "$group_count" -gt 1 ]] || continue

    for j in "${!CANDIDATE_PIDS[@]}"; do
      [[ "${CANDIDATE_CLASSES[$j]}" = "spec-memory-context-server" ]] || continue
      [[ "${CANDIDATE_DB_DIRS[$j]}" = "$db_dir" ]] || continue
      if [[ "$listener_count" -eq 1 ]]; then
        if [[ "${CANDIDATE_PIDS[$j]}" = "$listener_pid" ]]; then
          reason="same-db-singleton-listener"
        else
          reason="same-db-nonlistener-duplicate"
        fi
      else
        reason="same-db-listener-ambiguous"
      fi
      CONTEXT_SINGLETON_PIDS+=("${CANDIDATE_PIDS[$j]}")
      CONTEXT_SINGLETON_REASONS+=("$reason")
    done
  done
}

# ───────────────────────────────────────────────────────────────
# 6. SESSION TREE DISCOVERY
# ───────────────────────────────────────────────────────────────

append_descendants() {
  local parent="$1"
  local child
  while read -r child; do
    [[ -n "$child" ]] || continue
    if [[ "${#SESSION_TREE_PIDS[@]}" -eq 0 ]] || ! pid_in_list "$child" "${SESSION_TREE_PIDS[@]}"; then
      SESSION_TREE_PIDS+=("$child")
      append_descendants "$child"
    fi
  done <<EOF
$(pgrep -P "$parent" 2>/dev/null || true)
EOF
}

# Build the live operator-session process tree across ALL AI CLI runtimes, not just
# Claude Code. Any MCP helper descended from a live claude / opencode / codex
# session belongs to an active operator session and must be preserved — most importantly
# an operator's `opencode run`, which previously fell outside the Claude-only tree and
# got swept after ORPHAN_AGE_MIN_SEC (a hard-rule violation).
build_session_trees() {
  local pid
  while read -r pid; do
    [[ -n "$pid" ]] || continue
    if [[ "${#SESSION_TREE_PIDS[@]}" -eq 0 ]] || ! pid_in_list "$pid" "${SESSION_TREE_PIDS[@]}"; then
      SESSION_TREE_PIDS+=("$pid")
      append_descendants "$pid"
    fi
  done <<EOF
$(pgrep -f '(^|/)(claude|opencode|codex)( |$)|Claude Code' 2>/dev/null || true)
EOF
}

has_non_mcp_listener() {
  local pid="$1"
  local line
  while read -r line; do
    case "$line" in
      *LISTEN*)
        return 0
        ;;
    esac
  done <<EOF
$(lsof -nP -a -p "$pid" -iTCP -sTCP:LISTEN 2>/dev/null || true)
EOF
  return 1
}

# The MCP daemons bridge sibling sessions over a UNIX socket (daemon-ipc.sock),
# NOT TCP, so has_non_mcp_listener never covers them. Under default-on daemon
# re-election a still-serving daemon is reparented to pid 1 and falls outside every
# live-session tree — yet killing it drops the transport for any concurrent live
# session bridged to it. A daemon actively serving connections holds MORE THAN ONE
# unix-socket FD on its daemon-ipc.sock (the listener + one per live peer); a bare
# listener with no clients holds exactly one. Treat >1 as "in use" and preserve it.
# The embedder sidecar serves feature-extraction over its own hf-embed.sock and is
# preserved by the same rule (listener + one FD per in-flight peer > 1).
has_live_ipc_socket_connection() {
  local pid="$1"
  local count
  count="$(lsof -nP -a -p "$pid" -U 2>/dev/null | grep -cE '(daemon-ipc|hf-embed)\.sock' || true)"
  [[ -n "$count" ]] || count=0
  [[ "$count" -gt 1 ]] 2>/dev/null
}

# ───────────────────────────────────────────────────────────────
# 7. PRESERVATION POLICY
# ───────────────────────────────────────────────────────────────

preserve_reason() {
  local pid="$1"
  local class="$2"
  local age="$3"
  local cmd="$4"
  local freshest_pid
  local freshest_age
  local db_dir
  local singleton_reason
  local singleton_nonlistener=false
  local daemon_socket_state

  # Operator-owned interactive/dispatch sessions across runtimes. These commands name a
  # session the operator is actively running; their MCP helpers must never be swept.
  # build_session_trees covers descendants via process ancestry; these patterns also
  # catch the session's own root process whatever its descendants look like.
  case "$cmd" in
    *"opencode run"*) printf '%s\n' "operator-opencode-preserve"; return 0 ;;
    *"codex exec"*) printf '%s\n' "operator-codex-preserve"; return 0 ;;
    *"ollama runner"*|*"ollama serve"*) printf '%s\n' "ollama-preserve"; return 0 ;;
  esac

  if [[ "${#SESSION_TREE_PIDS[@]}" -gt 0 ]] && pid_in_list "$pid" "${SESSION_TREE_PIDS[@]}"; then
    printf '%s\n' "live-session-tree"
    return 0
  fi

  if [[ "$class" = "spec-memory-context-server" ]]; then
    db_dir="$(candidate_db_dir_for_pid "$pid")"
    if [[ "$db_dir" = "unknown" ]]; then
      printf '%s\n' "db-dir-unresolved"
      return 0
    fi
    if has_active_maintenance_marker "$pid" "$db_dir"; then
      printf '%s\n' "maintenance-active"
      return 0
    fi
    singleton_reason="$(context_singleton_reason_for_pid "$pid" 2>/dev/null || true)"
    if [[ "$singleton_reason" = "same-db-singleton-listener" ]] ||
       [[ "$singleton_reason" = "same-db-listener-ambiguous" ]]; then
      printf '%s\n' "$singleton_reason"
      return 0
    fi
    if [[ "$singleton_reason" = "same-db-nonlistener-duplicate" ]]; then
      daemon_socket_state="$(daemon_socket_fd_state "$pid")"
      case "$daemon_socket_state" in
        held)
          printf '%s\n' "holds-daemon-socket-preserve"
          return 0
          ;;
        unknown)
          printf '%s\n' "daemon-socket-probe-unknown-preserve"
          return 0
          ;;
        none)
          singleton_nonlistener=true
          ;;
      esac
    fi
    if [[ -z "$singleton_reason" ]]; then
      daemon_socket_state="$(daemon_socket_fd_state "$pid")"
      if [[ "$daemon_socket_state" != "none" ]]; then
        printf '%s\n' "daemon-socket-listener-ambiguous"
        return 0
      fi
    fi
  fi

  if [[ "$singleton_nonlistener" = false ]]; then
    freshest_pid="$(freshest_pid_for_class "$class" 2>/dev/null || true)"
    freshest_age="$(freshest_age_for_class "$class" 2>/dev/null || echo 999999)"
    if [[ "$pid" = "$freshest_pid" ]] && [[ "$freshest_age" -lt "$AGE_MIN_SEC" ]]; then
      printf '%s\n' "freshest-young-instance"
      return 0
    fi
  fi

  if has_non_mcp_listener "$pid"; then
    printf '%s\n' "active-non-mcp-tcp-listener"
    return 0
  fi

  if has_live_ipc_socket_connection "$pid"; then
    printf '%s\n' "active-ipc-socket-connection"
    return 0
  fi

  return 1
}

# ───────────────────────────────────────────────────────────────
# 8. PROCESS SCANNING
# ───────────────────────────────────────────────────────────────

scan_processes() {
  local pid _ppid etime rss _stat command class age db_dir
  while read -r pid _ppid etime rss _stat command; do
    [[ -n "${pid:-}" ]] || continue
    class="$(classify_command "${command:-}" 2>/dev/null || true)"
    [[ -n "$class" ]] || continue
    age="$(etime_to_seconds "$etime")"
    CANDIDATE_PIDS+=("$pid")
    CANDIDATE_PPIDS+=("$_ppid")
    CANDIDATE_CLASSES+=("$class")
    CANDIDATE_AGES+=("$age")
    CANDIDATE_ETIMES+=("$etime")
    CANDIDATE_RSSES+=("$rss")
    CANDIDATE_COMMANDS+=("${command:-}")
    if [[ "$class" = "spec-memory-context-server" ]]; then
      db_dir="$(resolve_context_server_db_dir "$pid" "${command:-}")"
    else
      db_dir=""
    fi
    CANDIDATE_DB_DIRS+=("$db_dir")
    remember_min_for_class "$class" "$age" "$pid"
  done <<EOF
$(ps -axo pid=,ppid=,etime=,rss=,stat=,command=)
EOF
}

select_kill_candidates() {
  local i pid class age etime rss cmd reason
  build_context_singleton_decisions
  for i in "${!CANDIDATE_PIDS[@]}"; do
    pid="${CANDIDATE_PIDS[$i]}"
    : "${CANDIDATE_PPIDS[$i]}"
    class="${CANDIDATE_CLASSES[$i]}"
    age="${CANDIDATE_AGES[$i]}"
    etime="${CANDIDATE_ETIMES[$i]}"
    rss="${CANDIDATE_RSSES[$i]}"
    cmd="${CANDIDATE_COMMANDS[$i]}"

    reason="$(preserve_reason "$pid" "$class" "$age" "$cmd" 2>/dev/null || true)"
    if [[ -n "$reason" ]]; then
      log_verbose "action=preserve reason=$reason pid=$pid class=$class rss_kb=$rss age_sec=$age etime=$etime command=$cmd"
      continue
    fi

    KILL_PIDS+=("$pid")
    KILL_CLASSES+=("$class")
    KILL_AGES+=("$age")
    KILL_ETIMES+=("$etime")
    KILL_RSSES+=("$rss")
    KILL_COMMANDS+=("$cmd")
  done
}

# ───────────────────────────────────────────────────────────────
# 9. TERMINATION
# ───────────────────────────────────────────────────────────────

terminate_candidates() {
  local i pid class age etime rss cmd current_cmd current_class reason
  for i in "${!KILL_PIDS[@]}"; do
    pid="${KILL_PIDS[$i]}"
    class="${KILL_CLASSES[$i]}"
    age="${KILL_AGES[$i]}"
    etime="${KILL_ETIMES[$i]}"
    rss="${KILL_RSSES[$i]}"
    cmd="${KILL_COMMANDS[$i]}"

    current_cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
    [[ -n "$current_cmd" ]] || continue
    current_class="$(classify_command "$current_cmd" 2>/dev/null || true)"
    if [[ "$current_class" != "$class" ]] || [[ "$current_cmd" != "$cmd" ]]; then
      emit "action=preserve reason=pid-reclassified pid=$pid class=${current_class:-unknown} command=$current_cmd"
      continue
    fi

    build_context_singleton_decisions
    reason="$(preserve_reason "$pid" "$current_class" "$age" "$current_cmd" 2>/dev/null || true)"
    if [[ -n "$reason" ]]; then
      emit "action=preserve reason=$reason pid=$pid class=$current_class command=$current_cmd"
      continue
    fi

    log_action "action=kill signal=TERM pid=$pid class=$class rss_kb=$rss age_sec=$age etime=$etime command=$cmd"
    if [[ "$DRY_RUN" = false ]]; then
      if ! kill -15 "$pid" 2>/dev/null; then
        emit "action=kill-failed signal=TERM pid=$pid class=$class"
        EXIT_CODE=1
      fi
    fi
  done

  [[ "$DRY_RUN" = true ]] && return 0
  [[ "${#KILL_PIDS[@]}" -eq 0 ]] && return 0

  sleep 5
  for i in "${!KILL_PIDS[@]}"; do
    pid="${KILL_PIDS[$i]}"
    class="${KILL_CLASSES[$i]}"
    age="${KILL_AGES[$i]}"
    cmd="${KILL_COMMANDS[$i]}"
    current_cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
    [[ -n "$current_cmd" ]] || continue
    current_class="$(classify_command "$current_cmd" 2>/dev/null || true)"
    if [[ "$current_class" != "$class" ]] || [[ "$current_cmd" != "$cmd" ]]; then
      emit "action=preserve reason=pid-reclassified pid=$pid class=${current_class:-unknown} command=$current_cmd"
      continue
    fi

    build_context_singleton_decisions
    reason="$(preserve_reason "$pid" "$current_class" "$age" "$current_cmd" 2>/dev/null || true)"
    if [[ -n "$reason" ]]; then
      emit "action=preserve reason=$reason pid=$pid class=$current_class command=$current_cmd"
      continue
    fi

    emit "action=kill signal=KILL pid=$pid class=$class"
    if ! kill -9 "$pid" 2>/dev/null; then
      emit "action=kill-failed signal=KILL pid=$pid class=$class"
      EXIT_CODE=1
    fi
  done
}

# ───────────────────────────────────────────────────────────────
# 10. TEMPORARY ARTIFACT SWEEPING
# ───────────────────────────────────────────────────────────────

path_mtime_epoch() {
  local path="$1"
  stat -f %m "$path" 2>/dev/null || stat -c %Y "$path" 2>/dev/null || printf '%s\n' 0
}

path_is_old_enough() {
  local path="$1"
  local now_epoch mtime age min_age
  now_epoch="$(date +%s)"
  mtime="$(path_mtime_epoch "$path")"
  is_positive_int "$mtime" || return 1
  age=$((now_epoch - mtime))
  min_age=$((TMP_AGE_HOURS * 3600))
  [[ "$age" -ge "$min_age" ]]
}

preserve_tmp_path() {
  local path="$1"
  local base="${path##*/}"
  case "$base" in
    codex-browser-use|*cache*|*Cache*) return 0 ;;
  esac
  return 1
}

remove_tmp_path() {
  local path="$1"
  [[ -e "$path" ]] || return 0
  preserve_tmp_path "$path" && { log_verbose "action=preserve-tmp path=$path"; return 0; }
  path_is_old_enough "$path" || { log_verbose "action=preserve-tmp reason=too-new path=$path"; return 0; }

  log_action "action=remove-tmp path=$path"
  if [[ "$DRY_RUN" = false ]]; then
    if ! rm -rf "$path" 2>/dev/null; then
      emit "action=remove-tmp-failed path=$path"
      EXIT_CODE=1
    fi
  fi
}

sweep_tmp() {
  local path
  shopt -s nullglob
  for path in /tmp/codex-* /tmp/cli-* /tmp/opencode-* /tmp/deep-review-*; do
    [[ -d "$path" ]] || continue
    remove_tmp_path "$path"
  done
  for path in /tmp/save-context-data-* /tmp/*-prompt.md /tmp/*-cli-err.log /tmp/*-cli-out.log; do
    [[ -f "$path" ]] || continue
    remove_tmp_path "$path"
  done
  shopt -u nullglob
}

# Sourcing guard: when this file is sourced (not executed) the caller only wants the
# function definitions (e.g. a unit test exercising has_live_ipc_socket_connection),
# so skip the process-scanning/kill main flow.
(return 0 2>/dev/null) && return 0

# ───────────────────────────────────────────────────────────────
# 11. MAIN ENTRYPOINT
# ───────────────────────────────────────────────────────────────

rotate_log_if_needed
emit "action=start dry_run=$DRY_RUN verbose=$VERBOSE age_min_sec=$AGE_MIN_SEC tmp_age_hours=$TMP_AGE_HOURS"
build_session_trees
scan_processes
select_kill_candidates
terminate_candidates
sweep_tmp
emit "action=summary candidates=${#CANDIDATE_PIDS[@]} kills=${#KILL_PIDS[@]} exit_code=$EXIT_CODE"
exit "$EXIT_CODE"
