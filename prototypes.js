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
  return this;
}

/**
 * Erases every occurrence of every string in `arr` from `this`. Returns the resulting string.
 * @param {string[]} arr 
 * @return {string} returns a NEW string
 */
String.prototype.eraseAll = function(arr) {
  let str = this;
  for(const s of arr) {
    str = str.replaceAll(s, '');
  }
  return str;
}
