import { describe, it, expect } from 'vitest';
import { safeColor, safeLength, safeLineHeight, safeFontWeight, safeFontFamily, safeShadow } from '../scripts/render-safety';

describe('safeColor', () => {
  it('accepts hex, rgb/rgba, hsl, and oklch colors', () => {
    expect(safeColor('#06458c')).toBe('#06458c');
    expect(safeColor('#fff')).toBe('#fff');
    expect(safeColor('rgba(6, 69, 140, 0.5)')).toBe('rgba(6, 69, 140, 0.5)');
    expect(safeColor('hsl(210 92% 29%)')).toBe('hsl(210 92% 29%)');
    expect(safeColor('oklch(0.4 0.1 250)')).toBe('oklch(0.4 0.1 250)');
    expect(safeColor('transparent')).toBe('transparent');
  });

  it('falls back on a same-attribute CSS-declaration injection attempt', () => {
    expect(safeColor('red; } * { display:none } /*')).toBe('transparent');
    expect(safeColor('red" onmouseover="alert(1)')).toBe('transparent');
    expect(safeColor('expression(alert(1))')).toBe('transparent');
    expect(safeColor('url(javascript:alert(1))')).toBe('transparent');
  });

  it('falls back on empty/undefined input', () => {
    expect(safeColor(undefined)).toBe('transparent');
    expect(safeColor(null)).toBe('transparent');
    expect(safeColor('')).toBe('transparent');
  });

  it('honors a custom fallback', () => {
    expect(safeColor('}{injected', '#000000')).toBe('#000000');
  });
});

describe('safeLength', () => {
  it('accepts numeric CSS lengths with common units', () => {
    expect(safeLength('16px')).toBe('16px');
    expect(safeLength('1.5rem')).toBe('1.5rem');
    expect(safeLength('100%')).toBe('100%');
    expect(safeLength('-4px')).toBe('-4px');
  });

  it('falls back on non-length injection attempts', () => {
    expect(safeLength('8px; } * { display:none } /*')).toBe('0');
    expect(safeLength('calc(1px * 2); background:url(evil)')).toBe('0');
  });
});

describe('safeLineHeight', () => {
  it('accepts unitless numbers, lengths, and "normal"', () => {
    expect(safeLineHeight('1.5')).toBe('1.5');
    expect(safeLineHeight('23.2px')).toBe('23.2px');
    expect(safeLineHeight('normal')).toBe('normal');
  });

  it('falls back on injection attempts', () => {
    expect(safeLineHeight('1.5; } body { display:none } /*')).toBe('normal');
  });
});

describe('safeFontWeight', () => {
  it('accepts named and numeric weights', () => {
    expect(safeFontWeight('400')).toBe('400');
    expect(safeFontWeight('bold')).toBe('bold');
  });

  it('falls back on injection attempts', () => {
    expect(safeFontWeight('700; } * { display:none }')).toBe('400');
  });
});

describe('safeFontFamily', () => {
  it('accepts a normal font-family list', () => {
    expect(safeFontFamily("'Silka Webfont', sans-serif")).toBe("'Silka Webfont', sans-serif");
  });

  it('falls back on values containing CSS-breaking characters', () => {
    expect(safeFontFamily('Arial; } * { display:none } /*')).toBe('system-ui');
    expect(safeFontFamily('Arial"><script>alert(1)</script>')).toBe('system-ui');
  });

  it('falls back on excessively long values', () => {
    expect(safeFontFamily('A'.repeat(300))).toBe('system-ui');
  });
});

describe('safeShadow', () => {
  it('accepts a well-formed single or multi-part box-shadow', () => {
    expect(safeShadow('0 2px 8px rgba(0,0,0,0.08)')).toBe('0 2px 8px rgba(0,0,0,0.08)');
    expect(safeShadow('inset 0 1px 2px #000, 0 4px 8px rgba(0,0,0,0.2)')).toBe('inset 0 1px 2px #000, 0 4px 8px rgba(0,0,0,0.2)');
  });

  it('falls back when any token in the value fails validation', () => {
    expect(safeShadow('0 2px 8px red; } * { display:none } /*')).toBe('none');
    expect(safeShadow('url(javascript:alert(1))')).toBe('none');
  });
});
