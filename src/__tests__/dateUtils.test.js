import { describe, it, expect } from 'vitest';
import { formatLastModified } from '../utils/dateUtils';

describe('formatLastModified utility', () => {
  it('returns null for empty date inputs', () => {
    expect(formatLastModified(null)).toBeNull();
    expect(formatLastModified(undefined)).toBeNull();
  });

  it('formats recent modifications within a minute as "Modificato poco fa"', () => {
    const now = new Date();
    expect(formatLastModified(now)).toBe('Modificato poco fa');
  });

  it('formats invalid date input gracefully', () => {
    expect(formatLastModified('invalid-date')).toBe('invalid-date');
  });
});
