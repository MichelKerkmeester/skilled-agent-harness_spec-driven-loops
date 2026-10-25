// Canonical spec-doc placeholder markers. Mirrors check-placeholders.sh
// (YOUR_VALUE_HERE + NEEDS_CLARIFICATION underscore/space). Mustache `{{...}}`
// is intentionally NOT included: it is not the canonical spec-doc placeholder
// syntax and legit spec-doc content uses it, so flagging it false-positives.
const PLACEHOLDER_MARKER_RE = /<YOUR_VALUE_HERE:|\[YOUR_VALUE_HERE:|\[NEEDS_CLARIFICATION:|\[NEEDS CLARIFICATION:/u;
const CLARIFICATION_MARKER_RE = /\[NEEDS[_ ]CLARIFICATION:/u;

// A doc stamped with this template version or a later one ships every authoring
// hint as a value token, so a token still in it is work not yet done rather than
// a defect while the packet is a Draft. A doc with an older stamp, or none, was
// written before that contract and keeps the strict verdict it always had.
const TOKEN_GATE_MIN_MAJOR = 2;
const TOKEN_GATE_MIN_MINOR = 3;
const TEMPLATE_STAMP_RE = /^\s*<!--\s*SPECKIT_TEMPLATE_SOURCE:[^|>]*\|\s*v(\d+)\.(\d+)\s*-->/u;

function carriesTokenGateStamp(content: string): boolean {
  for (const line of content.split(/\r?\n/u).slice(0, 70)) {
    const stamp = TEMPLATE_STAMP_RE.exec(line);
    if (!stamp) continue;
    const major = Number(stamp[1]);
    const minor = Number(stamp[2]);
    return major > TOKEN_GATE_MIN_MAJOR || (major === TOKEN_GATE_MIN_MAJOR && minor >= TOKEN_GATE_MIN_MINOR);
  }
  return false;
}

function cleanStatusCell(cell: string): string {
  return cell.replace(/\*\*/gu, '').replace(/`/gu, '').trim();
}

// Reads the first Status row of spec.md's metadata table and reports whether its
// value is exactly Draft. Mirrors the shell classifier: quotes, case, trailing
// punctuation and repeated spaces do not change the answer, any other word does.
function specStatusIsDraft(folder: string): boolean {
  const spec = readIfExists(path.join(folder, 'spec.md'));
  if (!spec) return false;
  for (const line of spec.split(/\r?\n/u)) {
    if (!/^\s*\|/u.test(line)) continue;
    const cells = line.split('|');
    if (cells.length < 3) continue;
    if (cleanStatusCell(cells[1]).toLowerCase() !== 'status') continue;
    const value = cleanStatusCell(cells[2])
      .replace(/^["']/u, '')
      .replace(/["']$/u, '')
      .toLowerCase()
      .trim()
      .replace(/[\s.,;:!]+$/u, '')
      .replace(/\s+/gu, ' ');
    return value === 'draft';
  }
  return false;
}

function validatePlaceholders(folder: string, level: SpecKitLevel): ValidationEntry {
  const findings: string[] = [];
  const draftTokens: string[] = [];
  const draftPacket = specStatusIsDraft(folder);
  // A workflow loop owns the freeform docs and rewrites them whole at
  // synthesis, so a scaffolded skeleton's markers are not an author's debt.
  for (const docName of validationDocsForLevel(folder, level).filter((docName) => !FREEFORM_WORKFLOW_DOCS.has(docName))) {
    const content = readIfExists(path.join(folder, docName));
    if (!content) continue;
    const tokenGated = carriesTokenGateStamp(content);
    const lines = content.split(/\r?\n/u);
    // Track fenced code blocks: a line starting with ``` toggles in_code and is
    // itself skipped, matching check-placeholders.sh awk behavior.
    let inCode = false;
    lines.forEach((line, index) => {
      if (/^\s*```/u.test(line)) {
        inCode = !inCode;
        return;
      }
      if (inCode) return;
      const match = PLACEHOLDER_MARKER_RE.exec(line);
      if (!match) return;
      // Skip inline-backtick-wrapped markers: if the matched marker is
      // immediately preceded by a backtick on this line, it is escaped content
      // (parity with the shell rule's grep -v of backtick-wrapped cases).
      if (match.index > 0 && line.charAt(match.index - 1) === '`') return;
      const finding = `${docName}:${index + 1}: ${line.trim().slice(0, 120)}`;
      // Only a value token is deferred. An open question stays an error in
      // every packet, because it names a decision nobody has made.
      if (tokenGated && draftPacket && !CLARIFICATION_MARKER_RE.test(line)) {
        draftTokens.push(finding);
        return;
      }
      findings.push(finding);
    });
  }
  if (findings.length > 0) {
    return entry('PLACEHOLDER_FILLED', 'error', `${findings.length} placeholder(s) found`, findings);
  }
  if (draftTokens.length > 0) {
    return entry(
      'PLACEHOLDER_FILLED',
      'warn',
      `${draftTokens.length} unfilled value token(s) in a Draft packet. Fill each one before the status leaves Draft`,
      draftTokens,
    );
  }
  return entry('PLACEHOLDER_FILLED', 'pass', 'No unfilled template placeholders found');
}
