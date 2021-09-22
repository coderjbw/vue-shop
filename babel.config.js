const prodplugins = []
if(process.env.NODE_ENV === 'production'){
  prodplugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins:[
      ...prodplugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
}
