const expect = require('chai').expect;
const { describe } = require('node-tdd');
const PRNG = require('../helper/prng');
const generateKeys = require('../helper/generate-keys');

describe('Testing generate-keys.js', { cryptoSeed: 'c9bfe12c-329a-4d3a-afb7-71fbca2cb77b' }, () => {
  it('Testing example', () => {
    const r = generateKeys(10, PRNG('b6b13c0a-7f68-4ca9-99e8-908ab6159fb0'));
    expect(r).to.deep.equal([
      'ievM', 'within', 'spring', 'steady', 'rTk9et',
      'music', 'wood', 'population', 'eGtrn', 'develop'
    ]);
  });

  it('Testing default rng', () => {
    const r = generateKeys(1);
    expect(r).to.deep.equal(['shall']);
  });
});
