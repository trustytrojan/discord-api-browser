const base_url = 'https://cdn.discordapp.com';
const allowed_sizes = [16, 32, 64, 128, 256, 512, 1_024, 2_048, 4_096];
const allowed_extensions = ['webp', 'png', 'jpg', 'jpeg', 'gif'];

/**
 * @typedef {object} ImageURLOptions
 * @prop {number} size
 * @prop {string} extension
 */

/**
 * @typedef {object} MakeURLOptions
 * @prop {number} size
 * @prop {string} extension
 * @prop {string[]} allowedExtensions
 */

/**
 * @param {string} route 
 * @param {MakeURLOptions} 
 * @returns 
 */
function makeURL(route, { size, extension = 'gif' }) {
  if(!allowed_extensions.includes(extension)) {
    throw new RangeError(`Invalid extension provided: ${extension}\nMust be one of: ${allowed_extensions.join(', ')}`);
  }

  if(size && !allowed_sizes.includes(size)) {
    throw new RangeError(`Invalid size provided: ${size}\nMust be one of: ${allowed_sizes.join(', ')}`);
  }

  const url = new URL(`${base_url}${route}.${extension}`);

  if(size) {
    url.searchParams.set('size', String(size));
  }

  return url.toString();
}

function dynamicMakeURL(route, hash, { forceStatic = false, ...options }) {
  return this.makeURL(route, !forceStatic && hash.startsWith('a_') ? { ...options, extension: 'gif' } : options);
}

/**
 * @param {string} id 
 * @param {string} hash 
 * @param {number} size 
 * @returns {string}
 */
const avatar = (id, hash, size) => makeURL(`/avatars/${id}/${hash}`, { size });

/**
 * @param {string} id 
 * @param {string} hash 
 * @param {number} size 
 * @returns {string}
 */
const icon = (id, hash, size) => makeURL(`/icons/${id}/${hash}`, { size });

/**
 * @param {string} id 
 * @returns {string}
 */
const sticker = (id) => makeURL(`/stickers/${id}`, { extension: 'png' });

module.exports = {
  get avatar() { return avatar; },
  get sticker() { return sticker; },
  get icon() { return icon; }
};