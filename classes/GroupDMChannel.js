module.exports = class GroupDMChannel extends require('./DMChannel') {
  

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
    //this.icon = 
  }
}