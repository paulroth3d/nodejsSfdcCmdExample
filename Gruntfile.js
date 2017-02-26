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
        },
		watch: {
			default: {
				files: ['src/**/*.ts'],
				tasks: ['ts'],
				options: {
					spawn: false
				}
			}
		},
		clean: {
			default: {
				src: ['dist']
			},
			grunt: {
				src: ['Grunt.output']
			}
		}
    });
    grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask("default", ["ts"]);
};