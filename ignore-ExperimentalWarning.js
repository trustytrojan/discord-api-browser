const { emitWarning } = process;
process.emitWarning = function(warning, ...args) {
  if(args[0] === 'ExperimentalWarning' || args[0]?.type === 'ExperimentalWarning')
    return;
  return emitWarning(warning, ...args);
};