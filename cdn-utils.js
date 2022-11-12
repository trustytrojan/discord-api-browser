const base_url = Object.freeze('https://cdn.discordapp.com');
const allowed_sizes = Object.freeze([16, 32, 64, 128, 256, 512, 1_024, 2_048, 4_096]);
const allowed_extensions = Object.freeze(['webp', 'png', 'jpg', 'jpeg', 'gif']);

/**
 * @typedef {object} ImageURLOptions
 * @prop {number} size
 * @prop {string} extension
 */

/**
 * @param {string} route 
 * @param {ImageURLOptions} 
 * @returns 
 */
function makeURL(route, { size, extension = 'webp' } = {}) {
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

/**
 * @param {string} route 
 * @param {string} hash 
 * @param {ImageURLOptions} options 
 * @returns 
 */
const dynamicMakeURL = (route, hash, options) => makeURL(route, hash.startsWith('a_') ? { ...options, extension: 'gif' } : options);

/**
 * For user avatars
 * @param {string} id 
 * @param {string} hash 
 * @param {ImageURLOptions} options 
 * @returns {string}
 */
const avatar = (id, hash, options) => dynamicMakeURL(`/avatars/${id}/${hash}`, hash, options);

/**
 * For server icons
 * @param {string} id 
 * @param {string} hash 
 * @param {ImageURLOptions} options 
 * @returns {string}
 */
const icon = (id, hash, options) => dynamicMakeURL(`/icons/${id}/${hash}`, hash, options);

/**
 * For server discovery splash banners
 * @param {string} guild_id 
 * @param {string} hash 
 * @param {ImageURLOptions} options 
 * @returns {string}
 */
const splash = (guild_id, hash, options) => makeURL(`/discovery-splashes/${guild_id}/${hash}`, options);

/**
 * @param {string} id 
 * @returns {string}
 */
const sticker = (id) => makeURL(`/stickers/${id}`, { extension: 'png' });

module.exports = {
  get allowed_sizes() { return allowed_sizes; },
  get allowed_extensions() { return allowed_extensions; },
  get avatar() { return avatar; },
  get sticker() { return sticker; },
  get icon() { return icon; },
  get splash() { return splash; }
};