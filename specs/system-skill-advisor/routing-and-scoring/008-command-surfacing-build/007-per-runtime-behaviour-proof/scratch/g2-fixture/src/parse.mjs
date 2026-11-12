/**
 * Split one comma-separated line of key=value pairs into a plain object.
 *
 * A segment without an equals sign is skipped so a malformed line yields the
 * pairs that did parse rather than throwing on the first bad segment.
 */
export function parseRecord(line) {
  const record = {};
  for (const segment of line.split(',')) {
    if (segment === '') continue;
    const at = segment.indexOf('=');
    if (at === -1) continue;
    record[segment.slice(0, at).trim()] = segment.slice(at + 1).trim();
  }
  return record;
}
