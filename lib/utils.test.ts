import { expect, test } from 'vitest';
import { cn } from './utils';

test('cn utility correctly merges and handles classes', () => {
  // Handles basic strings
  expect(cn('a', 'b')).toBe('a b');

  // Handles conditional classes
  expect(cn('a', { b: true, c: false })).toBe('a b');

  // Handles conflicting classes from tailwind-merge
  expect(cn('p-4', 'p-2')).toBe('p-2');

  // Handles null and undefined values
  expect(cn('a', null, 'b', undefined)).toBe('a b');
});
