'use strict';

const { calculate, summarise } = require('../lib/attendance');

describe('calculate()', () => {
  test('computes percentage correctly', () => {
    expect(calculate({ attended: 30, total: 40 }).percentage).toBe(75);
  });

  test('tells how many lectures can be bunked when above target', () => {
    // 36/40 = 90%. Max x with 36/(40+x) >= 0.75 -> x = 8
    const r = calculate({ attended: 36, total: 40 });
    expect(r.status).toBe('safe');
    expect(r.canBunk).toBe(8);
    expect(r.mustAttend).toBe(0);
  });

  test('tells how many lectures must be attended when below target', () => {
    // 20/40 = 50%. Need (20+y)/(40+y) >= 0.75 -> y = 40
    const r = calculate({ attended: 20, total: 40 });
    expect(r.status).toBe('danger');
    expect(r.mustAttend).toBe(40);
    expect(r.canBunk).toBe(0);
  });

  test('flags a warning when just above target', () => {
    expect(calculate({ attended: 31, total: 40 }).status).toBe('warning');
  });

  test('exactly at target allows zero extra bunks', () => {
    const r = calculate({ attended: 30, total: 40 });
    expect(r.canBunk).toBe(0);
  });

  test('handles a custom target', () => {
    const r = calculate({ attended: 40, total: 50, target: 80 });
    expect(r.canBunk).toBe(0);
    expect(r.status).toBe('warning');
  });

  test('handles no lectures yet', () => {
    expect(calculate({ attended: 0, total: 0 }).status).toBe('no-data');
  });

  test('target of 100 cannot be recovered after a miss', () => {
    expect(calculate({ attended: 9, total: 10, target: 100 }).mustAttend).toBeNull();
  });

  test.each([
    [{ attended: 'x', total: 10 }, 'numbers'],
    [{ attended: 11, total: 10 }, 'greater'],
    [{ attended: -1, total: 10 }, 'negative'],
    [{ attended: 1.5, total: 10 }, 'whole'],
    [{ attended: 5, total: 10, target: 0 }, 'target'],
    [{ attended: 5, total: 10, target: 150 }, 'target'],
  ])('rejects invalid input %j', (input, word) => {
    expect(calculate(input).error).toContain(word);
  });
});

describe('summarise()', () => {
  test('aggregates subjects and overall attendance', () => {
    const r = summarise([
      { name: 'Maths', attended: 30, total: 40 },
      { name: 'Physics', attended: 20, total: 40 },
    ]);
    expect(r.subjects).toHaveLength(2);
    expect(r.overall.percentage).toBe(62.5);
  });

  test('rejects empty input', () => {
    expect(summarise([]).error).toBeDefined();
  });

  test('reports which subject was invalid', () => {
    const r = summarise([{ name: 'Maths', attended: 50, total: 40 }]);
    expect(r.error).toContain('Maths');
  });
});
