// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-post-edit-quality OpenCode Plugin (adapter)                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the runtime-neutral post-edit-  ║
// ║          router core. tool.execute.after has no file path (only a       ║
// ║          callID), so tool.execute.before stashes the edited path keyed  ║
// ║          by callID; after retrieves + evicts it once the edit has       ║
// ║          landed, runs the shared dispatch table under a self-imposed    ║
// ║          deadline (no host timeout wrapper exists for this hook), and    ║
// ║          buffers bounded findings for the next turn's                   ║
// ║          experimental.chat.system.transform. Findings are also recorded ║
// ║          to a bounded, rotated, append-only log -- NEVER to stdout/     ║
// ║          stderr, which OpenCode's TUI paints onto the prompt line.      ║
// ║          Default-export-only and fail-open on every path.               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createRequire } from 'node:module';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const router = require('../skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));
const DISABLED_ENV = 'MK_POST_EDIT_QUALITY_DISABLED';
const LOG_RELATIVE = join('.opencode', 'logs', 'post-edit-quality.log');
const MAX_LOG_BYTES = 256 * 1024;
const MAX_CALL_IDS = 1_000;
const MAX_PENDING_FINDINGS = 20;
const MAX_FINDING_LINE_CHARS = 500;
// Same mutating-tool set mk-dist-freshness-guard.js watches, reused here
// because both plugins need the identical "did this tool just write a file"
// signal from tool.execute.before's args shape.
const MUTATING_TOOLS = new Set(['write', 'edit', 'patch', 'multiedit', 'apply_patch', 'apply-patch']);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS -- pure (exposed for testing via the default export property)
// ─────────────────────────────────────────────────────────────────────────────

function filePathFromArgs(args) {
  if (!args || typeof args !== 'object') return null;
  const value = args.filePath || args.file_path || args.path;
  return typeof value === 'string' && value ? value : null;
}

/**
 * Bounded callID -> filePath correlation map. tool.execute.after only carries
 * a callID, not the file path, so tool.execute.before must stash it here and
 * after must retrieve-and-evict it. Exposed standalone (not only as a plugin
 * closure) so the stash/retrieve/evict/unmatched-no-op contract is directly
 * unit-testable without booting the full plugin.
 */
function createCorrelationMap(maxEntries = MAX_CALL_IDS) {
  const map = new Map();
  return {
    stash(callID, filePath) {
      if (!callID || !filePath) return;
      if (map.size >= maxEntries) map.delete(map.keys().next().value);
      map.set(callID, filePath);
    },
    take(callID) {
      if (!callID || !map.has(callID)) return null;
      const filePath = map.get(callID);
      map.delete(callID);
      return filePath;
    },
    size() {
      return map.size;
    },
  };
}

function formatFinding(filePath, finding) {
  const firstLine = String(finding.stdout || '').split('\n').find((line) => line.trim()) || '(no detail)';
  return `[${finding.label}] ${filePath}: ${firstLine}`.slice(0, MAX_FINDING_LINE_CHARS);
}

// Findings must never reach stdout/stderr: OpenCode's TUI paints plugin
// console output onto the prompt input line, where it sticks until a redraw
// and corrupts the interactive session. Persisting to a workspace log keeps
// the signal auditable; the chat.system.transform buffer makes it actionable.
// Fail-open -- a logging error must never affect the edit it observed.
function appendQualityLog(projectDir, line) {
  try {
    const logPath = join(projectDir, LOG_RELATIVE);
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size >= MAX_LOG_BYTES) {
        copyFileSync(logPath, `${logPath}.1`);
        truncateSync(logPath, 0);
      }
    } catch (_) {
      // A missing active log is the normal first-write case.
    }
    appendFileSync(logPath, `${new Date().toISOString()} [mk-post-edit-quality] ${line}\n`, 'utf8');
  } catch (_) {
    // Swallow: an audit-log failure must not disturb the session it observes.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-post-edit-quality OpenCode plugin hooks.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkPostEditQualityPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();
  const callPaths = createCorrelationMap();
  const pendingFindings = [];
  const dedupeTracker = router.createDedupeTracker();

  function pushFindings(filePath, findings) {
    for (const finding of findings) {
      if (pendingFindings.length >= MAX_PENDING_FINDINGS) pendingFindings.shift();
      pendingFindings.push(formatFinding(filePath, finding));
      appendQualityLog(projectDir, formatFinding(filePath, finding));
    }
  }

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (process.env[DISABLED_ENV] === '1') return;
        const tool = typeof input?.tool === 'string' ? input.tool.toLowerCase() : '';
        if (!MUTATING_TOOLS.has(tool)) return;
        const filePath = filePathFromArgs(output?.args);
        if (!filePath) return;
        callPaths.stash(input.callID, filePath);
      } catch (_) {
        // Fail open: a capture error must never block the edit.
      }
    },

    async 'tool.execute.after'(input, output) {
      try {
        if (process.env[DISABLED_ENV] === '1') return;
        const filePath = callPaths.take(input?.callID);
        if (!filePath) return; // no correlated path -- no-op
        // filePath is the raw stashed arg, which tools may hand over as a
        // path relative to the caller's cwd. Resolve it against projectDir
        // (not the plugin host's own cwd) before any filesystem check or
        // dispatch resolution -- otherwise a relative path silently checks
        // against the wrong root and existsSync/resolveDispatch both miss.
        const absFilePath = isAbsolute(filePath) ? filePath : join(projectDir, filePath);
        if (!existsSync(absFilePath)) return;

        const entries = router.resolveDispatch(absFilePath, projectDir);
        if (entries.length === 0) return;

        const findings = router.runChecks(entries, router.OPENCODE_DEADLINE_MS, {
          perChildTimeoutMs: router.OPENCODE_CHECKER_TIMEOUT_MS,
          minCheckerMs: router.OPENCODE_MIN_CHECKER_MS,
          dedupeTracker,
          cwd: projectDir,
        });
        if (findings.length === 0) return;
        pushFindings(absFilePath, findings);
      } catch (_) {
        // Fail open: never block tool completion for a checker/dispatch bug.
      }
    },

    async 'experimental.chat.system.transform'(_input, output) {
      try {
        if (process.env[DISABLED_ENV] === '1') return;
        if (pendingFindings.length === 0 || !output || typeof output !== 'object') return;
        const brief = [
          '[post-edit-quality] Advisory findings from recent edits:',
          ...pendingFindings.map((line) => `- ${line}`),
        ].join('\n');
        output.system = Array.isArray(output.system) ? output.system : [];
        output.system.push(brief);
        pendingFindings.length = 0; // drain -- surface once per finding
      } catch (_) {
        // Fail open: a transform error must never block the turn.
      }
    },
  };
}

// Test surface hung off the default export (never a separate named export --
// OpenCode loads every export as its own plugin and a stray one silently
// drops this entire file).
MkPostEditQualityPlugin.__test = {
  PLUGIN_DIR,
  MUTATING_TOOLS,
  MAX_CALL_IDS,
  MAX_PENDING_FINDINGS,
  filePathFromArgs,
  createCorrelationMap,
  formatFinding,
};
