#!/usr/bin/env node
/**
 * scripts/render-variant.cjs
 *
 * Render a variant template against a fixture's task.json, producing a
 * concrete prompt-file that cli-devin can dispatch with --prompt-file.
 *
 * Template placeholders:
 *   {{fixture.id}}, {{fixture.task_description}}, {{fixture.scope.cwd}},
 *   {{fixture.scope.allowed_writes.join("\n  - ")}},
 *   {{fixture.acceptance_summary}}, {{fixture.allowlist.cli_flags.join(", ")}},
 *   {{variant_id}}, {{variant_meta.framework}}, {{variant_meta.preplanning_density}}
 *
 * Output: writes the rendered prompt to a temp file, prints the path on stdout.
 *
 * Usage:
 *   node scripts/render-variant.cjs <variant-template-path> <fixture.json>
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PACKET_ROOT = path.resolve(__dirname, '..');

function readVariantTemplate(templatePath) {
  const raw = fs.readFileSync(templatePath, 'utf8');
  // Variants have a YAML frontmatter with metadata, then the prompt body
  const m = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  if (!m) {
    return { meta: {}, body: raw };
  }
  const fmRaw = m[1];
  const body = m[2];
  // Minimal YAML parse: line-by-line key: value (no nesting)
  const meta = {};
  for (const line of fmRaw.split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      let v = kv[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      meta[kv[1]] = v;
    }
  }
  return { meta, body };
}

function summarizeAcceptance(fixture) {
  const acc = fixture.acceptance || [];
  return acc.map((a) => `- [${a.id}] ${a.type}: ${a.rationale || (a.command || a.pattern || '')}`).join('\n');
}

function renderTemplate(body, fixture, variantId, variantMeta) {
  const cwd = (fixture.scope && fixture.scope.cwd) || '.';
  const allowed = (fixture.scope && fixture.scope.allowed_writes) || [];
  const allowedJoined = allowed.map((f) => `  - ${f}`).join('\n');
  const accSummary = summarizeAcceptance(fixture);
  const allowlistFlags = ((fixture.allowlist && fixture.allowlist.cli_flags) || []).join(', ');

  return body
    .replace(/\{\{fixture\.id\}\}/g, fixture.id)
    .replace(/\{\{fixture\.task_description\}\}/g, fixture.task_description || '')
    .replace(/\{\{fixture\.scope\.cwd\}\}/g, cwd)
    .replace(/\{\{fixture\.scope\.allowed_writes\}\}/g, allowedJoined)
    .replace(/\{\{fixture\.acceptance_summary\}\}/g, accSummary)
    .replace(/\{\{fixture\.allowlist\.cli_flags\}\}/g, allowlistFlags || '(none)')
    .replace(/\{\{fixture\.cluster\}\}/g, fixture.cluster || '')
    .replace(/\{\{fixture\.grounded_in\}\}/g, fixture.grounded_in || '')
    .replace(/\{\{variant_id\}\}/g, variantId)
    .replace(/\{\{variant_meta\.framework\}\}/g, variantMeta.framework || 'STAR')
    .replace(/\{\{variant_meta\.preplanning_density\}\}/g, variantMeta.preplanning_density || 'medium')
    .replace(/\{\{variant_meta\.thinking_threshold\}\}/g, variantMeta.thinking_threshold || '5')
    .replace(/\{\{variant_meta\.bundle_gate_strictness\}\}/g, variantMeta.bundle_gate_strictness || 'standard')
    .replace(/\{\{variant_meta\.anti_hallucination_strength\}\}/g, variantMeta.anti_hallucination_strength || 'standard');
}

function renderVariant(opts) {
  const { variant_template_path, fixture } = opts;
  const { meta, body } = readVariantTemplate(variant_template_path);
  const variantId = meta.id || path.basename(variant_template_path, '.md');
  const rendered = renderTemplate(body, fixture, variantId, meta);
  return { meta, body: rendered, variantId };
}

function variantHash(opts) {
  const { variant_template_path, fixture } = opts;
  const tplRaw = fs.readFileSync(variant_template_path, 'utf8');
  return crypto.createHash('sha256').update(tplRaw + '\x00' + fixture.id, 'utf8').digest('hex').slice(0, 16);
}

function main() {
  const [variantPath, fixturePath] = process.argv.slice(2);
  if (!variantPath || !fixturePath) {
    process.stderr.write('usage: render-variant.cjs <variant.md> <fixture.json>\n');
    process.exit(2);
  }
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const { meta, body, variantId } = renderVariant({ variant_template_path: variantPath, fixture });
  const tmpFile = path.join(os.tmpdir(), `eval-loop-prompt-${variantId}-${fixture.id}-${process.pid}-${Date.now()}.md`);
  fs.writeFileSync(tmpFile, body);
  process.stdout.write(tmpFile + '\n');
}

if (require.main === module) main();

module.exports = { renderVariant, variantHash, readVariantTemplate };
