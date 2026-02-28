(() => {
  const DEFAULT_PATTERN = /{{\s*[\w.-]+\s*\|\s*default\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')\s*\)\s*}}/g;
  const UNRESOLVED_PATTERN = /{{[^{}]*}}/g;

  function unescapeDefaultValue(raw) {
    return raw
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, "\\");
  }

  function resolveTemplatePlaceholders(value) {
    if (!value || value.indexOf("{{") === -1) {
      return value;
    }

    const withDefaults = value.replace(DEFAULT_PATTERN, (_, doubleQuoted, singleQuoted) => {
      const defaultValue = doubleQuoted != null ? doubleQuoted : singleQuoted || "";
      return unescapeDefaultValue(defaultValue);
    });

    return withDefaults.replace(UNRESOLVED_PATTERN, "");
  }

  function processTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const parentTag = node.parentElement ? node.parentElement.tagName : "";
      if (parentTag !== "SCRIPT" && parentTag !== "STYLE") {
        const resolved = resolveTemplatePlaceholders(node.nodeValue || "");
        if (resolved !== node.nodeValue) {
          node.nodeValue = resolved;
        }
      }
      node = walker.nextNode();
    }
  }

  function processAttributes(root) {
    const elements = root.querySelectorAll("*");
    for (const element of elements) {
      for (const attr of element.attributes) {
        const resolved = resolveTemplatePlaceholders(attr.value);
        if (resolved !== attr.value) {
          element.setAttribute(attr.name, resolved);
        }
      }
    }
  }

  function runTemplateDefaults() {
    const root = document.documentElement;
    if (!root) {
      return;
    }
    processTextNodes(root);
    processAttributes(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runTemplateDefaults, { once: true });
  } else {
    runTemplateDefaults();
  }
})();
