// self-explanatory
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

/**
 * Return a new Map with key-value pairs that satisfy `filter_func`.
 * @param {(v) => boolean} filter_func 
 */
Map.prototype.filter = function(filter_func) {
  const filtered = new Map();
  for(const [k,v] of this) {
    if(filter_func(v))
      filtered.set(k, v);
  }
  return filtered;
}
