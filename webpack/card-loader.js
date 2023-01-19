module.exports = function (source) {
  const lines = source.replace(/\r/g, '').split('\n');
  const l = Math.max(...lines.map((a) => a.length));
  const c = `+${'-'.repeat(l + 2)}+`;
  return `${c}\n${lines
    .map((line) => `| ${line.padEnd(l, ' ')} |`)
    .join('\n')}\n${c}`;
};
