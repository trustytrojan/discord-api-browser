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

Array.prototype.remove_empty_strings = function() {
  for(let i = 0; i < this.length; ++i) {
    if(typeof this[i] !== 'string') continue;
    if(this[i].length !== 0) continue;
    this.splice(i, 1);
  }
}