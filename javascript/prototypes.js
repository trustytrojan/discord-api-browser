/**
 * Ensures that the specified key exists.
 * 
 * If not, a new key-value pair will be generated with the specified key and default value.
 * 
 * The key's value will be returned.
 * @param {any} key 
 * @param {any} defaultValue 
 * @returns {any}
 */
Map.prototype.ensure = function(key, defaultValue) {
  if(!this.has(key)) {
    this.set(key, defaultValue);
  }
  return this.get(key);
}
