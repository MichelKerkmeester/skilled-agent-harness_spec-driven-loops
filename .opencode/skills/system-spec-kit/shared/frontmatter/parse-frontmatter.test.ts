// Script-style assertions for the shared frontmatter parser, mirroring the
// colocated *.test.ts convention in shared/parsing. Run directly (tsx/node
// type stripping); throws on the first failing assertion.

import { parseFrontmatter, stringifyFrontmatter } from './parse-frontmatter.js';

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`${label} failed: expected ${expectedJson}, got ${actualJson}`);
  }
  console.log(`PASS: ${label}`);
}

// 1. No fence at all -> raw null, body is the whole document.
{
  const content = '# Title\n\nplain body\n';
  const parsed = parseFrontmatter(content);
  assertEqual(parsed.raw, null, 'no fence: raw is null');
  assertEqual(parsed.body, content, 'no fence: body is the whole document');
  assertEqual(parsed.frontmatter, {}, 'no fence: frontmatter is empty');
}

// 2. CRLF line endings throughout the fence and body.
{
  const content = '---\r\ntitle: "Fixture"\r\ntags:\r\n  - a\r\n  - b\r\n---\r\nbody keeps CRLF\r\n';
  const parsed = parseFrontmatter(content);
  assertEqual(parsed.frontmatter, { title: 'Fixture', tags: ['a', 'b'] }, 'crlf: yaml parsed');
  assertEqual(parsed.body, 'body keeps CRLF\r\n', 'crlf: body keeps original endings');
  assertEqual(parsed.raw, '---\r\ntitle: "Fixture"\r\ntags:\r\n  - a\r\n  - b\r\n---', 'crlf: raw excludes trailing terminator');
}

// 3. A fence that is not on line 1 is not frontmatter.
{
  const content = 'intro text\n---\ntitle: not-frontmatter\n---\n';
  const parsed = parseFrontmatter(content);
  assertEqual(parsed.raw, null, 'fence not on line 1: raw is null');
  assertEqual(parsed.body, content, 'fence not on line 1: body is the whole document');
}

// 4. A body that itself contains --- lines stays in the body.
{
  const content = '---\ntitle: "Fixture"\n---\nfirst\n\n---\n\nstill body\n';
  const parsed = parseFrontmatter(content);
  assertEqual(parsed.frontmatter, { title: 'Fixture' }, 'body with ---: yaml parsed');
  assertEqual(parsed.body, 'first\n\n---\n\nstill body\n', 'body with ---: body keeps inner fences');
}

// 5. Unclosed fence -> no frontmatter.
{
  const content = '---\ntitle: "Fixture"\nbody never closes';
  const parsed = parseFrontmatter(content);
  assertEqual(parsed.raw, null, 'unclosed fence: raw is null');
  assertEqual(parsed.body, content, 'unclosed fence: body is the whole document');
}

// 6. Document ending exactly at the closing fence -> empty body.
{
  const parsed = parseFrontmatter('---\ntitle: "Fixture"\n---');
  assertEqual(parsed.frontmatter, { title: 'Fixture' }, 'no trailing newline: yaml parsed');
  assertEqual(parsed.body, '', 'no trailing newline: body is empty');
  assertEqual(parsed.raw, '---\ntitle: "Fixture"\n---', 'no trailing newline: raw is the full block');
}

// 7. Empty frontmatter block.
{
  const parsed = parseFrontmatter('---\n---\nbody\n');
  assertEqual(parsed.frontmatter, {}, 'empty block: frontmatter is empty');
  assertEqual(parsed.body, 'body\n', 'empty block: body follows the fence');
  assertEqual(parsed.raw, '---\n---', 'empty block: raw is both fences');
}

// 8. Malformed YAML keeps the block visible through raw.
{
  const content = '---\ntitle: [unclosed\n---\nbody\n';
  const parsed = parseFrontmatter(content);
  assertEqual(parsed.frontmatter, {}, 'malformed yaml: frontmatter falls back to empty');
  assertEqual(parsed.raw, '---\ntitle: [unclosed\n---', 'malformed yaml: raw still carries the block');
  assertEqual(parsed.body, 'body\n', 'malformed yaml: body unaffected');
}

// 9. Round-trip through stringifyFrontmatter.
{
  const markdown = stringifyFrontmatter(
    { title: 'Fixture', completion_pct: 100, tags: ['a', 'b'] },
    'body text\n',
  );
  assertEqual(
    markdown,
    '---\ntitle: Fixture\ncompletion_pct: 100\ntags:\n  - a\n  - b\n---\nbody text\n',
    'stringify: block shape with body',
  );
  const parsed = parseFrontmatter(markdown);
  assertEqual(parsed.frontmatter, { title: 'Fixture', completion_pct: 100, tags: ['a', 'b'] }, 'stringify: round-trips through parse');
  assertEqual(parsed.body, 'body text\n', 'stringify: body survives the round-trip');
}

console.log('PASS: parse-frontmatter');
