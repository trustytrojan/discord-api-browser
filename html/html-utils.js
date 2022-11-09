/**
 * @param {string} url 
 */
const a = (url, x) => `<a href="${url}">${x}</a>`;

const th = (x) => `<th>${x}</th>`;
const td = (x) => `<td>${x}</td>`;

/**
 * @param  {...string} cells 
 */
function tr(...cells) {
  let str = '<tr>';
  for(const cell of cells)
    str += cell;
  return str += '</tr>';
}

/**
 * @param {string} url 
 */
const img = (url, alt) => `<img src="${url}"${alt ? ` alt="${alt}"` : ''}>`;

module.exports = {
  get a() { return a; },
  get th() { return th; },
  get td() { return td; },
  get tr() { return tr; },
  get img() { return img; }
};