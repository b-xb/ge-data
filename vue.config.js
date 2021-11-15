// add the following

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/ge-data/'
      : '/'
  }