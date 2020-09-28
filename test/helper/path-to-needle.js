const Joi = require('joi-strict');
const { escape } = require('../../src/util/helper');
const sampleArray = require('./sample-array');

module.exports = (needle, params, rng = Math.random) => {
  Joi.assert(needle, Joi.array().items(Joi.string(), Joi.number()));
  Joi.assert(params, Joi.object().keys({
    exclude: Joi.boolean(),
    lenPercentage: Joi.number().min(0).max(1),
    questionMark: Joi.number().integer().min(0),
    partialStar: Joi.number().integer().min(0),
    singleStar: Joi.number().integer().min(0),
    doubleStar: Joi.number().integer().min(0)
  }));
  Joi.assert(rng, Joi.function());

  const result = needle.map((e) => ({
    value: String(e).split('').map((char) => escape(char)),
    string: typeof e === 'string',
    exclude: false
  }));

  // generate partial question mark
  if (params.questionMark !== 0) {
    const indices = [...Array(result.length).keys()];
    const indicesSelected = sampleArray(indices, params.questionMark, rng);
    indicesSelected.forEach((idx) => {
      const e = result[idx];
      const pos = Math.floor(rng() * e.value.length);
      e.value[pos] = '?';
    });
  }
  // generate partial star
  if (params.partialStar !== 0) {
    const indices = [...Array(result.length).keys()];
    const indicesSelected = sampleArray(indices, params.partialStar, rng);
    indicesSelected.forEach((idx) => {
      const e = result[idx];
      const len = e.value.length;
      const pos = Math.floor(rng() * len);
      const deleteCount = Math.floor((len - pos) * rng());
      e.value.splice(pos, deleteCount, '*');
    });
  }
  // generate single star
  if (params.singleStar !== 0) {
    const indices = [...Array(result.length).keys()];
    const indicesSelected = sampleArray(indices, Math.min(result.length, params.singleStar), rng);
    indicesSelected.forEach((pos) => {
      result[pos].value = ['*'];
    });
  }
  // generate double star
  if (params.doubleStar !== 0) {
    const indices = [...Array(result.length + 1).keys()];
    const indicesSelected = sampleArray(indices, Math.min(result.length + 1, params.doubleStar), rng)
      .sort().reverse();
    let posPrev = result.length;
    for (let idx = 0; idx < indicesSelected.length; idx += 1) {
      const pos = indicesSelected[idx];
      const deleteCount = Math.floor((posPrev - pos + 1) * rng());
      result.splice(pos, deleteCount, {
        value: ['**'],
        string: true,
        exclude: false
      });
      posPrev = pos;
    }
  }
  // crop the result length
  result.length = Math.round(result.length * params.lenPercentage);
  // mark single element as "exclude"
  if (params.exclude === true) {
    result[Math.floor(rng() * result.length)].exclude = true;
  }
  return result.map((e) => ({
    ...e,
    value: e.value.join('')
  }));
};
