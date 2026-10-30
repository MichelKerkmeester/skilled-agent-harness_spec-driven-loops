// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Skill Conversion Transforms
// ───────────────────────────────────────────────────────────────────
'use strict';

const MACHINE_ROUTER_HEADING_RE = /^##\s+(?:\d+\.\s+)?MACHINE ROUTER\s*$/;
const SMART_ROUTING_HEADING_RE = /^##\s+(?:\d+\.\s+)?SMART ROUTING\s*$/i;
// The routing canon calls a fenced or indented block a machine router when a line in it
// declares one of the router's maps or one of the two router helpers. Convert moves every
// block this names out of SKILL.md, so the list is the canon's own plus DEFAULT_RESOURCE,
// which the resolver reads as a declaration too.
const MACHINE_ASSIGNMENT_RE = /^(?:\s*(?:INTENT_SIGNALS|RESOURCE_MAP|DEFAULT_RESOURCES?|UNKNOWN_FALLBACK_CHECKLIST)\s*=|\s*def\s+(?:discover_markdown_resources|_guard_in_skill)\b)/m;
const ROUTER_LINK_RE = /\[[^\]]+\]\((?:\.\/)?ROUTER\.md(?:#[^)]*)?\)/;
const ROUTER_LINK_LINE = 'The machine router lives in [ROUTER.md](./ROUTER.md).';

function transformError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function frontmatterParts(text) {
  const match = /^---(\r?\n)([\s\S]*?)(\r?\n---)(\r?\n|$)/.exec(text);
  if (!match) throw transformError('FRONTMATTER_INVALID', 'SKILL.md needs a closed YAML frontmatter block.');
  return {
    newline: match[1],
    body: match[2],
    close: match[3],
    after: match[4],
    rest: text.slice(match[0].length),
  };
}

function splitYamlComment(value) {
  let quote = null;
  let escaped = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote === '"') {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && value[index + 1] === "'") index += 1;
      else if (char === "'") quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '#' && (index === 0 || /\s/.test(value[index - 1]))) {
      const comment = value.slice(index).trim();
      return { value: value.slice(0, index).trimEnd(), comment: comment ? ` ${comment}` : '' };
    }
  }
  return { value: value.trim(), comment: '' };
}

function parseYamlScalar(value) {
  const clean = splitYamlComment(value).value.trim();
  if (clean === '') throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools contains an empty item.');
  if (clean[0] === '"') {
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools has an invalid quoted value.');
    }
    if (typeof parsed !== 'string') throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools items must be strings.');
    return parsed;
  }
  if (clean[0] === "'") {
    if (clean.length < 2 || clean[clean.length - 1] !== "'") {
      throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools has an invalid quoted value.');
    }
    return clean.slice(1, -1).replace(/''/g, "'");
  }
  if (/^(?:null|~)$/i.test(clean)) throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools items must be strings.');
  return clean;
}

function splitInlineArray(value) {
  const items = [];
  let start = 0;
  let quote = null;
  let escaped = false;
  let parenthesisDepth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote === '"') {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quote = null;
    } else if (quote === "'") {
      if (char === "'" && value[index + 1] === "'") index += 1;
      else if (char === "'") quote = null;
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '(') parenthesisDepth += 1;
    else if (char === ')') {
      if (parenthesisDepth === 0) {
        throw transformError('ALLOWED_TOOLS_AMBIGUOUS', 'allowed-tools has an unmatched closing parenthesis.');
      }
      parenthesisDepth -= 1;
    } else if (char === ',' && parenthesisDepth === 0) {
      items.push(value.slice(start, index));
      start = index + 1;
    }
  }
  if (quote !== null) throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools has an unclosed quoted value.');
  if (parenthesisDepth !== 0) {
    throw transformError('ALLOWED_TOOLS_AMBIGUOUS', 'allowed-tools has unbalanced parentheses.');
  }
  const tail = value.slice(start);
  if (tail.trim() || items.length) items.push(tail);
  return items.filter((item) => item.trim()).map(parseYamlScalar);
}

function parseAllowedTools(lines, index) {
  const line = lines[index];
  const match = /^([ \t]*)allowed-tools\s*:(.*)$/i.exec(line);
  if (!match || match[1].length > 0) {
    throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools must be a top-level frontmatter field.');
  }
  const split = splitYamlComment(match[2]);
  const value = split.value.trim();
  if (value.startsWith('[')) {
    if (!value.endsWith(']')) throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools has an unclosed inline array.');
    return {
      items: splitInlineArray(value.slice(1, -1)),
      end: index + 1,
      comment: split.comment,
      flowSequence: true,
    };
  }
  if (value !== '') {
    if (value.startsWith('{') || value.startsWith('|') || value.startsWith('>')) {
      throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools uses an unsupported YAML value.');
    }
    const scalarItems = value.includes(',') ? splitInlineArray(value) : [parseYamlScalar(value)];
    return { items: scalarItems, end: index + 1, comment: split.comment, flowSequence: false };
  }

  const items = [];
  let end = index + 1;
  while (end < lines.length) {
    const child = lines[end];
    if (!child.trim()) {
      let next = end + 1;
      while (next < lines.length && !lines[next].trim()) next += 1;
      if (next < lines.length && /^\s+/.test(lines[next])) {
        end = next;
        continue;
      }
      break;
    }
    const indentation = /^\s*/.exec(child)[0].length;
    if (indentation === 0) break;
    if (child.trimStart().startsWith('#')) {
      end += 1;
      continue;
    }
    const item = /^\s*-\s+(.*?)\s*$/.exec(child);
    if (!item) throw transformError('ALLOWED_TOOLS_INVALID', 'allowed-tools block values must be YAML list items.');
    items.push(parseYamlScalar(item[1]));
    end += 1;
  }
  return { items, end, comment: split.comment, flowSequence: false };
}

function inspectVersion(lines) {
  const versionIndexes = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (/^version\s*:/i.test(lines[index])) versionIndexes.push(index);
  }
  if (versionIndexes.length > 1) throw transformError('VERSION_INVALID', 'SKILL.md has duplicate version fields.');
  if (versionIndexes.length === 1) {
    const split = splitYamlComment(lines[versionIndexes[0]].replace(/^version\s*:\s*/i, ''));
    // A version field with no value is a version problem, and naming it as one keeps the
    // operator on the line that is actually wrong instead of the tool list below it.
    const rawVersion = split.value.trim();
    if (rawVersion === '' || /^(?:null|~)$/i.test(rawVersion)) {
      throw transformError('VERSION_INVALID', 'version must contain one to four numeric components.');
    }
    const originalVersion = parseYamlScalar(rawVersion);
    if (!/^\d+(?:\.\d+){0,3}$/.test(originalVersion)) {
      throw transformError('VERSION_INVALID', 'version must contain one to four numeric components.');
    }
    const components = originalVersion.split('.');
    const version = components.concat(Array(4 - components.length).fill('0')).join('.');
    return {
      version,
      originalVersion,
      inserted: false,
      changed: version !== originalVersion,
      index: versionIndexes[0],
      comment: split.comment,
    };
  }
  return {
    version: '1.0.0.0',
    originalVersion: null,
    inserted: true,
    changed: true,
    index: -1,
    comment: '',
  };
}

function normalizeSkillFrontmatter(text) {
  const parts = frontmatterParts(text);
  const lines = parts.body.split(parts.newline);
  const allowedIndexes = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*allowed-tools\s*:/i.test(lines[index])) allowedIndexes.push(index);
  }
  if (allowedIndexes.length !== 1) {
    throw transformError('ALLOWED_TOOLS_MISSING', 'SKILL.md must declare allowed-tools exactly once before conversion.');
  }

  const allowedIndex = allowedIndexes[0];
  const allowed = parseAllowedTools(lines, allowedIndex);
  const version = inspectVersion(lines);
  const output = [];
  for (let index = 0; index < lines.length;) {
    if (index === allowedIndex) {
      if (version.inserted) output.push('version: ' + version.version);
      if (allowed.flowSequence) {
        output.push(...lines.slice(index, allowed.end));
      } else if (allowed.items.length === 0) output.push('allowed-tools: []' + allowed.comment);
      else {
        output.push('allowed-tools:' + allowed.comment);
        for (const item of allowed.items) output.push(`  - ${JSON.stringify(item)}`);
      }
      index = allowed.end;
      continue;
    }
    if (index === version.index && version.changed) {
      output.push('version: ' + version.version + version.comment);
      index += 1;
      continue;
    }
    output.push(lines[index]);
    index += 1;
  }

  const body = output.join(parts.newline);
  const result = `---${parts.newline}${body}${parts.close}${parts.after}${parts.rest}`;
  return {
    text: result,
    changed: result !== text,
    version: version.version,
    originalVersion: version.originalVersion,
    versionChanged: version.changed,
    versionInserted: version.inserted,
    allowedToolsChanged: !allowed.flowSequence,
  };
}

function lineRecords(text) {
  const records = [];
  let start = 0;
  while (start < text.length) {
    const newlineAt = text.indexOf('\n', start);
    const end = newlineAt === -1 ? text.length : newlineAt + 1;
    let contentEnd = newlineAt === -1 ? end : newlineAt;
    if (contentEnd > start && text[contentEnd - 1] === '\r') contentEnd -= 1;
    records.push({ start, contentEnd, end, text: text.slice(start, contentEnd) });
    start = end;
  }
  if (text.length === 0 || text.endsWith('\n')) records.push({ start: text.length, contentEnd: text.length, end: text.length, text: '' });
  return records;
}

function scanFencedBlocks(text, start = 0, end = text.length) {
  const blocks = [];
  let fence = null;
  let fenceStart = null;
  let bodyStart = null;
  for (const line of lineRecords(text)) {
    if (line.start < start || line.start >= end) continue;
    if (fence === null) {
      const opener = /^ {0,3}(`{3,}|~{3,})/.exec(line.text);
      if (!opener) continue;
      fence = opener[1];
      fenceStart = line.start;
      bodyStart = line.end;
      continue;
    }
    const closer = new RegExp('^ {0,3}' + fence[0] + '{' + fence.length + ',}[ \\t]*$').exec(line.text);
    if (!closer) continue;
    blocks.push({
      start: fenceStart,
      end: line.end,
      bodyStart,
      bodyEnd: line.start,
      text: text.slice(fenceStart, line.end),
      body: text.slice(bodyStart, line.start),
    });
    fence = null;
    fenceStart = null;
    bodyStart = null;
  }
  return {
    blocks,
    unclosed: fence === null ? null : { start: fenceStart, bodyStart, end },
  };
}

function scanHeadings(text) {
  const headings = [];
  const scanned = scanFencedBlocks(text);
  const fencedRanges = [
    ...scanned.blocks,
    ...(scanned.unclosed ? [scanned.unclosed] : []),
  ];
  for (const line of lineRecords(text)) {
    if (fencedRanges.some((range) => line.start >= range.start && line.start < range.end)) continue;
    const heading = /^##\s+(.+?)\s*$/.exec(line.text);
    if (heading) headings.push({ start: line.start, end: line.end, title: heading[1].trim() });
  }
  return headings;
}

function sectionFor(text, pattern) {
  const headings = scanHeadings(text);
  const index = headings.findIndex((heading) => pattern.test(`## ${heading.title}`));
  if (index === -1) return null;
  return { ...headings[index], sectionEnd: headings[index + 1] ? headings[index + 1].start : text.length };
}

// The body is what the canon reads: the frontmatter block is not prose and cannot hold a
// machine block, so scanning starts after it, and a document without one starts at zero.
function bodyOffset(text) {
  const match = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.exec(text);
  return match ? match[0].length : 0;
}

function fencedRanges(text, start, end) {
  const scanned = scanFencedBlocks(text, start, end);
  return {
    blocks: scanned.blocks,
    unclosed: scanned.unclosed,
    limit: scanned.unclosed ? Math.min(end, scanned.unclosed.start) : end,
  };
}

// The text a reader actually reads as prose: every fenced block is a sample of the
// grammar, so it is not the document speaking.
function unfencedText(text, start, end) {
  const scanned = fencedRanges(text, start, end);
  let out = '';
  let cursor = start;
  for (const block of scanned.blocks) {
    if (block.end <= start) continue;
    out += text.slice(cursor, Math.min(block.start, scanned.limit));
    cursor = Math.min(block.end, scanned.limit);
  }
  return out + text.slice(cursor, scanned.limit);
}

// A router pointer counts only where the skill itself makes it. A link inside a fence or
// an inline code span is text about the link, and it loads the router for nobody.
function proseText(text, start, end) {
  return unfencedText(text, start, end).replace(/`[^`\n]*`/g, '');
}

// The canon reads a machine block above the machine-router section as a second declaration,
// so convert collects them all rather than only the fenced sample SMART ROUTING happens to
// hold: every fenced block carrying a machine line, in document order, because the parser
// takes the first declaration it meets.
function machineRouterBlocks(text, limit) {
  const start = bodyOffset(text);
  const scanned = fencedRanges(text, start, limit);
  if (scanned.unclosed) {
    throw transformError('MACHINE_BLOCK_FENCE_UNCLOSED', 'A fenced block before the machine router section is not closed.');
  }
  const unfencedMachineLine = unfencedText(text, start, limit)
    .split(/\r?\n/)
    .find((line) => MACHINE_ASSIGNMENT_RE.test(line));
  if (unfencedMachineLine !== undefined) {
    throw transformError(
      'MACHINE_BLOCK_UNFENCED',
      `A machine declaration is not inside a complete fenced block: ${unfencedMachineLine.trim()}`,
    );
  }
  return scanned.blocks
    .filter((block) => block.end <= limit && MACHINE_ASSIGNMENT_RE.test(block.body))
    .map(({ start: blockStart, end: blockEnd, text: blockText }) => ({ start: blockStart, end: blockEnd, text: blockText }));
}

function addRouterLink(text) {
  const section = sectionFor(text, SMART_ROUTING_HEADING_RE);
  if (!section) throw transformError('SMART_ROUTING_MISSING', 'SKILL.md has no SMART ROUTING section to receive the router link.');
  if (scanFencedBlocks(text, section.end, section.sectionEnd).unclosed) {
    throw transformError('SMART_ROUTING_FENCE_UNCLOSED', 'SMART ROUTING has an unclosed fenced block.');
  }
  // Only a pointer in the section's prose is the pointer, so the link is added when every
  // other match sits in a sample or in inline code.
  const existingLinks = proseText(text, section.end, section.sectionEnd).match(new RegExp(ROUTER_LINK_RE.source, 'g')) || [];
  if (existingLinks.length > 1) {
    throw transformError('ROUTER_LINK_DUPLICATE', 'SMART ROUTING contains more than one ROUTER.md link.');
  }
  if (existingLinks.length === 1) return text;
  const body = text.slice(section.end, section.sectionEnd);
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  const trailingMatch = /(?:\r?\n[ \t]*)*$/.exec(body);
  const trailing = trailingMatch ? trailingMatch[0] : '';
  const content = body.slice(0, body.length - trailing.length);
  const separator = content === '' || content.endsWith(newline) ? '' : newline;
  const link = `${separator}${ROUTER_LINK_LINE}${newline}`;
  return `${text.slice(0, section.end)}${content}${link}${trailing}${text.slice(section.sectionEnd)}`;
}

function renderRouterPrefix(template, skillName, skillTitle) {
  const heading = sectionFor(template, MACHINE_ROUTER_HEADING_RE);
  if (!heading) throw transformError('ROUTER_TEMPLATE_INVALID', 'The router template has no MACHINE ROUTER heading.');
  const firstMachineFence = lineRecords(template).find((line) => (
    line.start >= heading.end && /^ {0,3}(`{3,}|~{3,})/.test(line.text)
  ));
  if (!firstMachineFence) throw transformError('ROUTER_TEMPLATE_INVALID', 'The router template has no machine-router scaffold fence.');
  const prefix = template.slice(0, heading.end);
  const prose = template.slice(heading.end, firstMachineFence.start).replace(/(?:\r?\n){2,}$/, '\n');
  const escapeQuoted = (value) => JSON.stringify(value).slice(1, -1);
  return `${prefix}${prose}`
    .replace(/\{\{SKILL_TITLE\}\}/g, escapeQuoted(skillTitle))
    .replace(/\{\{SKILL_NAME\}\}/g, escapeQuoted(skillName));
}

function skillTitle(text, skillName) {
  const body = frontmatterParts(text).rest;
  const match = /^#\s+(.+?)\s*$/m.exec(body);
  if (match) return match[1];
  return skillName.split('-').map((part) => part ? `${part[0].toUpperCase()}${part.slice(1)}` : '').join(' ');
}

function stripDanglingTrailingRule(text) {
  const lineEnding = text.includes('\r\n') ? '\r\n' : '\n';
  const match = /(?:\r?\n)[ \t]*---[ \t]*(?:(?:\r?\n)[ \t]*)*$/.exec(text);
  if (!match) return text;
  return text.slice(0, match.index) + lineEnding;
}

function moveLegacyRouter(text, template, skillName, resolvedSection = null) {
  const machineSection = sectionFor(text, MACHINE_ROUTER_HEADING_RE);
  if (!machineSection) throw transformError('MACHINE_ROUTER_MISSING', 'SKILL.md has no trailing MACHINE ROUTER section to move.');
  if (resolvedSection !== null && text.slice(machineSection.start) !== resolvedSection) {
    throw transformError('MACHINE_ROUTER_RESOLVER_MISMATCH', 'The resolver section does not match the trailing source section.');
  }
  const machineHeadings = scanHeadings(text).filter((heading) => MACHINE_ROUTER_HEADING_RE.test(`## ${heading.title}`));
  if (machineHeadings.length !== 1 || machineHeadings[0].start !== machineSection.start
      || scanHeadings(text).some((heading) => heading.start > machineSection.start)) {
    throw transformError('MACHINE_ROUTER_NOT_TRAILING', 'The MACHINE ROUTER section must be the final level-two section.');
  }
  const machineBlocks = machineRouterBlocks(text, machineSection.start);
  const movedBody = text.slice(machineSection.end);
  const parts = [...machineBlocks.map((block) => block.text), movedBody].filter((part) => part.length > 0);
  let machineBody = '';
  for (const part of parts) {
    if (machineBody && !machineBody.endsWith('\n') && !part.startsWith('\n')) machineBody += '\n';
    machineBody += part;
  }
  const ranges = [...machineBlocks.map(({ start, end }) => ({ start, end })), { start: machineSection.start, end: text.length }]
    .sort((left, right) => right.start - left.start);
  let skillMd = text;
  for (const range of ranges) skillMd = `${skillMd.slice(0, range.start)}${skillMd.slice(range.end)}`;
  skillMd = stripDanglingTrailingRule(skillMd);
  skillMd = addRouterLink(skillMd);
  const routerMd = `${renderRouterPrefix(template, skillName, skillTitle(text, skillName))}${machineBody}`;
  return { skillMd, routerMd, machineBody, movedBlocks: parts };
}

module.exports = {
  addRouterLink,
  moveLegacyRouter,
  normalizeSkillFrontmatter,
};
