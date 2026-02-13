/**
 * YAML Frontmatter Parser for GoopSpec
 * Parses markdown files with YAML frontmatter (--- delimited)
 * 
 * @module shared/frontmatter
 */

export interface ParsedFrontmatter<T = Record<string, unknown>> {
  data: T;
  body: string;
  content: string; // original full content
}

/**
 * Parse YAML frontmatter from markdown content
 * 
 * @param content - The full markdown content
 * @returns Parsed frontmatter data and body
 */
export function parseFrontmatter<T = Record<string, unknown>>(
  content: string
): ParsedFrontmatter<T> {
  // Match frontmatter: ---\n[content]\n---
  // The YAML content can be empty
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    // Try matching empty frontmatter: ---\n---
    const emptyFrontmatterRegex = /^---\r?\n---\r?\n?([\s\S]*)$/;
    const emptyMatch = content.match(emptyFrontmatterRegex);
    
    if (emptyMatch) {
      return {
        data: {} as T,
        body: emptyMatch[1].trim(),
        content,
      };
    }
    
    // No frontmatter found, return empty data and full content as body
    return {
      data: {} as T,
      body: content.trim(),
      content,
    };
  }

  const [, yamlContent, body] = match;
  const data = parseSimpleYaml(yamlContent) as T;

  return {
    data,
    body: body.trim(),
    content,
  };
}

/**
 * Simple YAML parser for frontmatter
 * Handles basic key-value pairs, arrays, and nested objects in arrays
 * Does not require external yaml library
 */
function parseSimpleYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split(/\r?\n/);
  
  let currentKey: string | null = null;
  let currentArray: unknown[] | null = null;
  let currentArrayObject: Record<string, unknown> | null = null;
  let arrayObjectIndent: number = 0;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    // Get indentation level
    const indent = line.search(/\S/);
    
    // Check for array item start (starts with -)
    const arrayItemMatch = line.match(/^(\s*)-\s+(.*)$/);
    if (arrayItemMatch && currentKey && currentArray) {
      // Save previous array object if exists
      if (currentArrayObject) {
        currentArray.push(currentArrayObject);
        currentArrayObject = null;
      }
      
      const [, spaces, content] = arrayItemMatch;
      arrayObjectIndent = spaces.length;
      
      // Check if this array item has a key-value pair on the same line
      const inlineKvMatch = content.match(/^([\w-]+):\s*(.*)$/);
      if (inlineKvMatch) {
        const [, itemKey, itemValue] = inlineKvMatch;
        if (itemValue === "" || itemValue.trim() === "") {
          // Start of object with nested properties
          currentArrayObject = { [itemKey]: "" };
        } else {
          // Inline object property, start new object
          currentArrayObject = { [itemKey]: parseYamlValue(itemValue) };
        }
      } else {
        // Simple array item (string)
        currentArray.push(parseYamlValue(content));
      }
      continue;
    }
    
    // Check for nested property in array object (indented key-value after array item)
    if (currentArrayObject && indent > arrayObjectIndent) {
      const nestedKvMatch = line.match(/^\s+([\w-]+):\s*(.*)$/);
      if (nestedKvMatch) {
        const [, nestedKey, nestedValue] = nestedKvMatch;
        currentArrayObject[nestedKey] = parseYamlValue(nestedValue);
        continue;
      }
    }

    // Check for top-level key-value pair
    const kvMatch = line.match(/^([\w-]+):\s*(.*)$/);
    if (kvMatch) {
      // Save previous array/object if exists
      if (currentKey && currentArray) {
        if (currentArrayObject) {
          currentArray.push(currentArrayObject);
          currentArrayObject = null;
        }
        result[currentKey] = currentArray;
        currentArray = null;
      }

      const [, key, value] = kvMatch;
      currentKey = key;

      if (value === "" || value.trim() === "") {
        // Value might be an array on following lines
        currentArray = [];
      } else {
        // Parse the value
        result[key] = parseYamlValue(value);
        currentArray = null;
      }
    }
  }

  // Save final array if exists
  if (currentKey && currentArray) {
    if (currentArrayObject) {
      currentArray.push(currentArrayObject);
    }
    result[currentKey] = currentArray;
  }

  return result;
}

/**
 * Parse a YAML value (string, number, boolean, or quoted string)
 */
function parseYamlValue(value: string): unknown {
  const trimmed = value.trim();

  // Boolean
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // Null
  if (trimmed === "null" || trimmed === "~") return null;

  // Number
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed !== "") return num;

  // Quoted string
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  // Plain string
  return trimmed;
}

/**
 * Check if content has frontmatter
 */
export function hasFrontmatter(content: string): boolean {
  return content.trimStart().startsWith("---");
}

/**
 * Extract just the frontmatter YAML as string
 */
export function extractFrontmatterYaml(content: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}
