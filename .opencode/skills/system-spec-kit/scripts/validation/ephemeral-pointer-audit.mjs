#!/usr/bin/env node
/**
 * Ephemeral-pointer audit — enforces sk-code §4 "No Ephemeral-Artifact Pointers".
 *
 * Scans source files and flags CODE COMMENTS that embed pointers to ephemeral
 * artifacts (spec folders/numbers, task/checklist/requirement ids, review-finding
 * ids, ADR ids, ticket ids). The durable WHY of a comment is fine; only the
 * perishable traceability id is forbidden, because it rots once the spec is
 * archived or the review closes.
 *
 * What it does NOT flag (by design):
 *   - String/code content (only comment regions are inspected).
 *   - Durable/structural numbers: HTTP status codes, embedding dims, token tiers,
 *     rolling-window sizes, schema-version tags ("V16:").
 *   - JSDoc @example / parser-format illustrations that show input SHAPE
 *     (e.g. "019-system-hardening", "specs/001-demo", a quoted "NNN-name"). hygiene-ok
 *   - Runtime path constants the code actually reads (DEFAULT_ROOT-style lines).
 *
 * Standalone, dependency-free (Node ESM, stdlib only). Exit nonzero on any hit
 * so CI / pre-commit / sk-code verification can gate on it.
 *
 * Authoritative rule source:
 *   .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4
 *
 * Usage:
 *   node ephemeral-pointer-audit.mjs <path> [<path> ...] [--json]
 *   node ephemeral-pointer-audit.mjs .opencode/skills .opencode/bin
 *   node ephemeral-pointer-audit.mjs <path> --json
 *
 * Exit codes: 0 = clean, 1 = violations found, 2 = bad invocation.
 */

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// File selection
// ---------------------------------------------------------------------------

// Extensions whose comment syntax we understand.
const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py"]);

// Directories never worth scanning (vendored / build output / VCS).
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".venv",
  "__pycache__",
  ".pytest_cache",
]);

// Extensionless files (e.g. .opencode/bin/spec-kit-mcp) are scanned when their
// shebang marks them as Node or Python — those use //, /* */, or # comments.
const SHEBANG_NODE = /^#!.*\b(node|deno|bun)\b/;
const SHEBANG_PY = /^#!.*\bpython[0-9.]*\b/;

// ---------------------------------------------------------------------------
// Forbidden ephemeral-id patterns (matched ONLY inside comment text)
// ---------------------------------------------------------------------------
//
// Each entry documents WHAT it catches so the allow-list reasoning stays legible.
// `name` is reported with the finding; `re` runs against a single comment's text.
//
// PRECISION OVER RECALL: each pattern is deliberately narrowed to the SHAPE of a
// real ephemeral tracking id and explicitly avoids durable look-alikes the live
// tree is full of — HTTP-code pairs (401/403), source line ranges (280-316), hygiene-ok
// token-budget ranges (250-400), ratios (100/100), and externally-versioned hygiene-ok
// standards (SHA-256, UTF-16, CWE-502, RFC-7231). Those carve-outs live both
// here (in the regex itself) and in the ALLOW table below.
const FORBIDDEN = [
  {
    name: "spec-folder-ref",
    // "Spec 031", "Phase 005", "Packet 117", "Iteration 12" — an explicit hygiene-ok
    // tracking-artifact WORD immediately followed by a number. The leading word
    // is what makes this unambiguous (a bare number is never flagged here).
    re: /\b(?:spec|phase|packet|iteration|sprint)\s+0*\d{1,4}\b/i,
  },
  {
    name: "spec-pair-ref",
    // A spec / sub-phase pair: "031/005", "029/001", "005-001", "026/007/013". hygiene-ok
    // CRITICAL precision constraint: at least ONE side must be a 3-digit
    // ZERO-PADDED number (leading 0), which is the spec-folder numbering
    // convention. This is what separates a real "029/003" from HTTP "401/403", hygiene-ok
    // a line range "280-316", or a ratio "100/100" — none of which are hygiene-ok
    // zero-padded. Optional third segment catches "026/007/013". hygiene-ok
    re: /\b(?:0\d{2}[\/-]\d{3}|\d{3}[\/-]0\d{2})(?:[\/-]\d{3})?\b/,
  },
  {
    name: "spec-slug",
    // "031-embedding-stack-hardening" — 3-digit prefix + a kebab word slug. hygiene-ok
    // Format-illustration shapes ("019-system-hardening" in an @example, hygiene-ok
    // "specs/001-demo") are suppressed by the ALLOW table, not here. hygiene-ok
    re: /\b\d{3}-[a-z][a-z0-9]*(?:-[a-z0-9]+)+\b/,
  },
  {
    name: "task-id",
    // Task ids: "T043", "T-123", "T73". Requires the token to be a STANDALONE hygiene-ok
    // T+digits word (>=2 digits) and NOT immediately preceded by a letter, so
    // it never fires inside identifiers. Two-digit floor avoids loop vars (T1).
    re: /\bT-?\d{2,}\b/,
  },
  {
    name: "checklist-id",
    // "CHK-160", "CHK069" — checklist item ids. hygiene-ok
    re: /\bCHK-?\d{2,}\b/i,
  },
  {
    name: "requirement-id",
    // "REQ-005", "REQ007" — requirement ids. hygiene-ok
    re: /\bREQ-?\d{2,}\b/i,
  },
  {
    name: "adr-id",
    // "ADR-004", "ADR014" — architecture-decision-record ids. hygiene-ok
    re: /\bADR-?\d{1,}\b/i,
  },
  {
    name: "review-finding-id",
    // Deep-review / agent finding tags: "DR-008", "WS-1", "OR-R-01", "F-001-005", hygiene-ok
    // "P0-3", "P1-09", "P2-14", "DEC-12". Uppercase finding-prefix + dash + hygiene-ok
    // digits, with optional extra dash-segments ("F-001-005", "A6-P2-2" tail). hygiene-ok
    // The prefix set is an allow-list of KNOWN review schemes, NOT a generic
    // [A-Z]+ catch-all — that is what stops it eating SHA-256 / UTF-16 / CWE-22.
    re: /\b(?:DR|WS|OR(?:-R)?|F|P[012]|DEC|FND)-\d{1,}(?:-\d{1,})*\b/,
  },
  {
    name: "github-issue-ref",
    // "#456", "(#456)", "Fix #16", "Safeguard #10" — issue/PR references. hygiene-ok
    // Standalone #-number token only (preceded by start / whitespace / bracket).
    re: /(?:^|[\s(\[])#\d{2,}\b/,
  },
];

// NOTE intentionally NOT a forbidden rule: a generic "ticket-id" /[A-Z]{3,}-\d/
// pattern. It is irresistibly drawn to durable standards the style guide §4
// EXPLICITLY allows — SHA-256, UTF-8/16, CWE-502, RFC numbers — and to the
// project's own non-ephemeral constants. A real external tracker key (JIRA-123,
// CU-8abc) is better caught by an opt-in project-specific prefix list than by a
// broad shape that produces a flood of false positives. See notes/wiring.

// ---------------------------------------------------------------------------
// Allowed exclusions — when ANY of these matches a comment, the listed
// forbidden rule(s) are suppressed for that comment. These encode the
// "durable / structural" carve-outs from the style guide §4.
// ---------------------------------------------------------------------------
const ALLOW = {
  // Format-illustration / example / JSDoc-shape context: suppress the spec-shaped
  // rules. These show input SHAPE, not a live traceability pointer.
  //   * @example specs/001-demo/spec.md hygiene-ok
  //   format: "019-system-hardening" or "NNN-name" hygiene-ok
  //   // e.g. specs/001-demo   |   // Parses folder paths like "...140-hybrid-rag/006-sprint-5" hygiene-ok
  exampleContext:
    /@example\b|@param\b|@returns?\b|\be\.?g\.?\b|\bi\.?e\.?\b|\bformat\s*[:=]|\bNNN\b|\bpattern\s*[:=]|\bspecs?\/|\bsuch as\b|\bfolder paths? like\b|\blike\s+"|->/i,

  // Schema-version tags ("V16:", "V3:") are durable — never a spec ref.
  schemaTag: /\bV\d{1,}\s*:/,

  // Rolling-window descriptors ("200-decision window") are durable config.
  rollingWindow: /\b\d{1,4}-decision\b/i,

  // Runtime path constant lines (DEFAULT_ROOT = ".opencode/specs/..."). The path
  // is structural — the resolver reads it. Suppress spec-shaped rules on such lines.
  runtimePath: /\bDEFAULT_ROOT\b|\.opencode\/specs\b/,

  // Externally-versioned standards explicitly allowed by §4 ("a stable external
  // standard ... does not get archived with a sprint"). These collide in shape
  // with task/finding ids, so suppress those on any comment naming a standard.
  // SHA-256, UTF-8/16, CWE-79/400/502, RFC-7231, ISO-8601, base64, UTF8 BOM, etc.
  externalStandard: /\b(?:SHA|MD)-?\d{2,}\b|\bUTF-?\d{1,2}\b|\bUTF8\b|\bCWE-\d{1,}\b|\bRFC-?\d{2,}\b|\bISO-?\d{3,}\b|\bECMA-?\d{2,}\b/i,

  // Source-location references the running code does not chase as a tracking
  // artifact: "lines 280-316", "at lines 776-791", "(protocol.js:280-316)".
  // A bare numeric range next to "line(s)" or after a "file.ext:" is structural.
  // This suppresses spec-pair-ref ONLY (the rule whose shape a range can mimic).
  sourceLineRange: /\blines?\b|\.(?:ts|tsx|js|mjs|cjs|jsx|py):\d/i,

  // HTTP status pairs / token-budget ranges / score ratios. "401/403", "250-400", hygiene-ok
  // "100/100", "404, retry on 500". Numbers here are durable values, not spec ids. hygiene-ok
  // Recognized when the comment also names HTTP/status/token/budget/error context
  // OR when the pair is plainly non-zero-padded (already excluded by the rule's
  // own zero-pad constraint, but this catches narration like "map 401/403"). hygiene-ok
  numericValueContext:
    /\b(?:HTTP|status|code|token|budget|tier|ms|ratio|score|retry|error|backoff|dims?|dimensions?)\b/i,

  // Internal enumerated safeguards ("Safeguard #10") are durable design labels — hygiene-ok
  // learned-feedback.ts documents a numbered "10 Safeguards" list — not GitHub issues.
  safeguardEnum: /\bsafeguards?\s+#?\d/i,
};

// Map each allow-context to the forbidden rule names it is permitted to suppress.
// Allow-contexts are deliberately narrow so a real id elsewhere on the line still
// fires (e.g. an @example line that ALSO drops a "DR-008" still reports DR-008, hygiene-ok
// because exampleContext does not suppress review-finding-id).
const ALLOW_SUPPRESSES = {
  exampleContext: new Set(["spec-slug", "spec-pair-ref", "spec-folder-ref", "github-issue-ref"]),
  schemaTag: new Set([]), // schema tags don't look like any forbidden id; informational
  rollingWindow: new Set(["spec-pair-ref"]),
  runtimePath: new Set(["spec-slug", "spec-pair-ref", "spec-folder-ref"]),
  externalStandard: new Set(["task-id", "checklist-id", "requirement-id", "adr-id", "review-finding-id"]),
  sourceLineRange: new Set(["spec-pair-ref"]),
  numericValueContext: new Set(["spec-pair-ref"]),
  safeguardEnum: new Set(["github-issue-ref"]),
};

// ---------------------------------------------------------------------------
// Comment extraction
// ---------------------------------------------------------------------------
//
// Returns an array of { line, text } for each comment region. Line numbers are
// 1-based and point at the physical line where the comment text sits. String
// and code content is excluded so we never flag `const slug = "031-foo"`.

function extractComments(source, isPython) {
  if (isPython) return extractPyComments(source);
  return extractJsComments(source);
}

// Python: only `#` line comments. A `#` inside a string literal is ignored via a
// lightweight string-state scan (handles ' " and triple-quoted blocks).
function extractPyComments(source) {
  const out = [];
  const lines = source.split("\n");
  let inTriple = null; // null | "'''" | '"""'
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inTriple) {
      const end = line.indexOf(inTriple);
      if (end !== -1) inTriple = null;
      continue; // inside a docstring/string block — no comment scanning
    }
    const res = scanPyLineForComment(line);
    if (res.tripleOpen) inTriple = res.tripleOpen;
    if (res.commentText !== null) out.push({ line: i + 1, text: res.commentText });
  }
  return out;
}

function scanPyLineForComment(line) {
  let inStr = null; // null | "'" | '"'
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    const triple = line.slice(j, j + 3);
    if (!inStr && (triple === "'''" || triple === '"""')) {
      // A triple-quote that doesn't close on the same line opens a block.
      const rest = line.indexOf(triple, j + 3);
      if (rest === -1) return { commentText: null, tripleOpen: triple };
      j = rest + 2; // skip the closing triple
      continue;
    }
    if (inStr) {
      if (c === "\\") j++; // skip escaped char
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"') {
      inStr = c;
      continue;
    }
    if (c === "#") return { commentText: line.slice(j + 1), tripleOpen: null };
  }
  return { commentText: null, tripleOpen: null };
}

// JS/TS family: `//` line comments and `/* ... */` block comments (incl. JSDoc).
// `//` or `/*` inside a string or template literal is ignored.
function extractJsComments(source) {
  const out = [];
  let inBlock = false;
  let blockStartLine = 0;
  let blockBuf = "";
  let line = 1;
  let inStr = null; // null | '"' | "'" | "`"
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];
    if (c === "\n") {
      if (inBlock) {
        out.push({ line, text: stripBlockStar(blockBuf) });
        blockBuf = "";
        blockStartLine = line + 1;
      }
      line++;
      continue;
    }
    if (inBlock) {
      if (c === "*" && next === "/") {
        out.push({ line: blockStartLine, text: stripBlockStar(blockBuf) });
        blockBuf = "";
        inBlock = false;
        i++; // consume '/'
      } else {
        blockBuf += c;
      }
      continue;
    }
    if (inStr) {
      if (c === "\\") {
        i++; // skip escaped char
      } else if (c === inStr) {
        inStr = null;
      }
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "/" && next === "/") {
      // Rest of physical line is a comment.
      let j = i + 2;
      let buf = "";
      while (j < source.length && source[j] !== "\n") {
        buf += source[j];
        j++;
      }
      out.push({ line, text: buf });
      i = j - 1;
      continue;
    }
    if (c === "/" && next === "*") {
      inBlock = true;
      blockStartLine = line;
      blockBuf = "";
      i++; // consume '*'
      continue;
    }
  }
  if (inBlock && blockBuf.trim()) out.push({ line: blockStartLine, text: stripBlockStar(blockBuf) });
  return out;
}

// Strip a single leading " * " JSDoc gutter so the comment text reads cleanly.
function stripBlockStar(text) {
  return text.replace(/^\s*\*\s?/, "");
}

// ---------------------------------------------------------------------------
// Rule application
// ---------------------------------------------------------------------------

function activeSuppressions(commentText) {
  const suppressed = new Set();
  for (const [key, re] of Object.entries(ALLOW)) {
    if (re.test(commentText)) {
      for (const ruleName of ALLOW_SUPPRESSES[key]) suppressed.add(ruleName);
    }
  }
  return suppressed;
}

function findInComment(commentText) {
  const suppressed = activeSuppressions(commentText);
  const hits = [];
  for (const rule of FORBIDDEN) {
    if (suppressed.has(rule.name)) continue;
    const m = rule.re.exec(commentText);
    if (m) hits.push({ rule: rule.name, match: m[0].trim() });
  }
  return hits;
}

// ---------------------------------------------------------------------------
// Filesystem walk
// ---------------------------------------------------------------------------

function shouldScanFile(filePath) {
  // The guard documents the very patterns it hunts; never flag itself.
  if (path.basename(filePath) === "ephemeral-pointer-audit.mjs") return null;
  const ext = path.extname(filePath);
  if (SCANNED_EXTENSIONS.has(ext)) return ext === ".py" ? "py" : "js";
  if (ext === "") {
    // Extensionless: inspect shebang.
    let firstLine = "";
    try {
      const fd = fs.openSync(filePath, "r");
      const buf = Buffer.alloc(256);
      const n = fs.readSync(fd, buf, 0, 256, 0);
      fs.closeSync(fd);
      firstLine = buf.toString("utf8", 0, n).split("\n")[0];
    } catch {
      return null;
    }
    if (SHEBANG_NODE.test(firstLine)) return "js";
    if (SHEBANG_PY.test(firstLine)) return "py";
  }
  return null;
}

function* walk(target) {
  let stat;
  try {
    stat = fs.statSync(target);
  } catch {
    return;
  }
  if (stat.isFile()) {
    yield target;
    return;
  }
  if (!stat.isDirectory()) return;
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(path.join(target, entry.name));
    } else if (entry.isFile()) {
      yield path.join(target, entry.name);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function auditPaths(targets) {
  const findings = [];
  for (const target of targets) {
    for (const file of walk(target)) {
      const kind = shouldScanFile(file);
      if (!kind) continue;
      let source;
      try {
        source = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const comments = extractComments(source, kind === "py");
      for (const { line, text } of comments) {
        for (const hit of findInComment(text)) {
          findings.push({
            file,
            line,
            rule: hit.rule,
            match: hit.match,
            snippet: text.trim().slice(0, 120),
          });
        }
      }
    }
  }
  return findings;
}

function main(argv) {
  const args = argv.slice(2);
  const json = args.includes("--json");
  const targets = args.filter((a) => a !== "--json");
  if (targets.length === 0) {
    process.stderr.write(
      "usage: node ephemeral-pointer-audit.mjs <path> [<path> ...] [--json]\n",
    );
    return 2;
  }

  const findings = auditPaths(targets);

  if (json) {
    process.stdout.write(JSON.stringify({ findings, count: findings.length }, null, 2) + "\n");
  } else {
    for (const f of findings) {
      process.stdout.write(`${f.file}:${f.line}: [${f.rule}: ${f.match}] ${f.snippet}\n`);
    }
    process.stderr.write(`\n${findings.length} ephemeral-pointer violation(s)\n`);
  }
  return findings.length > 0 ? 1 : 0;
}

process.exit(main(process.argv));
