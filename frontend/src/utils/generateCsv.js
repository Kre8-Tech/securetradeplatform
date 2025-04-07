const { Parser } = require('json2csv');

const generateCsv = (data) => {
  const fields = ['id', 'title', 'content', 'date'];
  const opts = { fields };
  const parser = new Parser(opts);
  return parser.parse(data);
};

module.exports = generateCsv;