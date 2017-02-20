module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default: {
				outDir: 'dist',
				src: [ "src/**/*.ts" ],
				options: {
					allowJs: true
				}
			}
        }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);
};