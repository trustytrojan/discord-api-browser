module.exports = {

  /**
   * Erases every occurrence of every string in `arr` from `str`. Returns the new string.
   * @param {string} str 
   * @param {string[]} arr 
   * @return {string}
   */
  string_erase_all(str, arr) {
    for(const s of arr) {
      str = str.replaceAll(s, '');
    }
    return str;
  }

};
