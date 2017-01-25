// After installing this NPM package into a project, developers will be able
// to pass the following include path to their SASS compiler, which will allow
// them to import the stylesheet like this:
//   @import "flexboxgrid/all";
// Instead of having to include a relative path:
//   @import "../node_modules/tgam-flexboxgrid/src/patterns/flexboxgrid/all";

module.exports = {
  sassIncludePath: __dirname + "/src/patterns"
};
