'use strict';

/**
 * Validate and normalise attendance input.
 * Returns { error } on failure or { attended, total, target } on success.
 */
function validate({ attended, total, target = 75 }) {
  const a = Number(attended);
  const t = Number(total);
  const p = Number(target);

  if (![a, t, p].every(Number.isFinite)) {
    return { error: 'attended, total and target must be numbers' };
  }
  if (!Number.isInteger(a) || !Number.isInteger(t)) {
    return { error: 'attended and total must be whole numbers' };
  }
  if (a < 0 || t < 0) {
    return { error: 'attended and total cannot be negative' };
  }
  if (a > t) {
    return { error: 'attended cannot be greater than total' };
  }
  if (p <= 0 || p > 100) {
    return { error: 'target must be between 1 and 100' };
  }
  return { attended: a, total: t, target: p };
}

/**
 * Core calculation.
 *  - percentage: current attendance %
 *  - canBunk: how many more lectures can be skipped while staying >= target
 *  - mustAttend: how many consecutive lectures must be attended to reach target
 */
function calculate(input) {
  const v = validate(input);
  if (v.error) return { error: v.error };

  const { attended: a, total: t, target: p } = v;
  const percentage = t === 0 ? 0 : (a / t) * 100;

  let canBunk = 0;
  let mustAttend = 0;
  let status;

  if (t === 0) {
    status = 'no-data';
  } else if (percentage >= p) {
    status = percentage - p < 5 ? 'warning' : 'safe';
    canBunk = Math.max(0, Math.floor((a * 100) / p - t));
  } else {
    status = 'danger';
    if (p === 100) {
      mustAttend = null; // can never recover from a missed lecture
    } else {
      mustAttend = Math.ceil((p * t - 100 * a) / (100 - p));
    }
  }

  return {
    attended: a,
    total: t,
    target: p,
    percentage: Math.round(percentage * 100) / 100,
    status,
    canBunk,
    mustAttend,
  };
}

/** Summarise several subjects at once. */
function summarise(subjects, target = 75) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return { error: 'subjects must be a non-empty array' };
  }
  const results = [];
  for (const s of subjects) {
    const r = calculate({ attended: s.attended, total: s.total, target });
    if (r.error) return { error: `${s.name || 'subject'}: ${r.error}` };
    results.push({ name: s.name || 'Subject', ...r });
  }
  const attended = results.reduce((sum, r) => sum + r.attended, 0);
  const total = results.reduce((sum, r) => sum + r.total, 0);
  return { subjects: results, overall: calculate({ attended, total, target }) };
}

module.exports = { validate, calculate, summarise };
