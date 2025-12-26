const fs = require('fs');

function validateMemoryFile(filePath) {
  const issues = [];
  
  if (!fs.existsSync(filePath)) {
    return { valid: false, issues: [{ severity: 'error', message: 'File not found' }] };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for YAML frontmatter
  if (!content.startsWith('---')) {
    issues.push({ severity: 'error', message: 'Missing YAML frontmatter' });
  }
  
  // Check for required frontmatter fields
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    if (!frontmatter.includes('title:')) {
      issues.push({ severity: 'warn', message: 'Missing title in frontmatter' });
    }
  }
  
  // Check for ANCHOR tags
  const anchorPattern = /<!-- ANCHOR:/g;
  const anchors = content.match(anchorPattern);
  if (!anchors || anchors.length === 0) {
    issues.push({ severity: 'warn', message: 'No ANCHOR tags found' });
  }
  
  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    issues
  };
}

module.exports = { validateMemoryFile };
