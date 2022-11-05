const base_url = 'https://cdn.discordapp.com';

const allowed_sizes = [16, 32, 64, 128, 256, 512, 1_024, 2_048, 4_096];
const allowed_sticker_extensions = ['png', 'json'];
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
function makeURL(route, { size, extension = 'webp', allowedExtensions = allowed_extensions } = {}) {
  if(!allowedExtensions.includes(extension)) {
    throw new RangeError(`Invalid extension provided: ${extension}\nMust be one of: ${allowedExtensions.join(', ')}`);
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

/**
 * @param {string} id 
 * @param {string} hash 
 * @param {ImageURLOptions} options 
 * @returns {string}
 */
const avatar = (id, hash, options) => makeURL(`/avatars/${id}/${hash}`, options);

/**
 * 
 * @param {string} id 
 * @param {ImageURLOptions} 
 * @returns 
 */
const sticker = (id, { extension }) => makeURL(`/stickers/${id}`, { extension: (extension ?? 'png'), allowedExtensions: allowed_sticker_extensions });


module.exports = {
  get avatar() { return avatar; },
  get sticker() { return sticker; }  
};