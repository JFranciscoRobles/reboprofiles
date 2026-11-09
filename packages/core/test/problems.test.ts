import { describe, expect, it } from 'vitest';
import { blankProfile, describeProblem, makeBlock, problemsOf, sampleProfile } from '../src';

describe('what a profile lacks', () => {
  it('says a blank one has no name and nothing in it', () => {
    expect(problemsOf(blankProfile()).map((p) => p.code)).toEqual(['no-name', 'no-blocks']);
  });

  it('finds blocks without what they need, and addresses that cannot be opened', () => {
    const link = { ...makeBlock('link'), label: 'Go', url: 'javascript:x' };
    const contact = makeBlock('contact');
    const found = problemsOf({ ...blankProfile({ name: 'A' }), blocks: [link, contact] });
    expect(found).toEqual([
      { code: 'bad-link', block: link.id, type: 'link', url: 'javascript:x' },
      { code: 'incomplete', block: contact.id, type: 'contact' },
    ]);
    expect(describeProblem(found[1], 'es')).toBe('Le falta algo al bloque «contacto».');
  });

  it('finds nothing in the sample', () => {
    expect(problemsOf(sampleProfile('es'))).toEqual([]);
  });
});
