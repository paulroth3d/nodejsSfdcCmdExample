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
		},
		tslint: {
			options: {
				// can be a configuration object or a filepath to tslint.json 
				configuration: "./tslint.json",
				// If set to true, tslint errors will be reported, but not fail the task 
				// If set to false, tslint errors will be reported, and the task will fail 
				force: true,
				fix: false
			},
			files: {
				src: [
					"src/**/*.ts"
				]
			}
		}
    });
    grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-tslint');
    grunt.registerTask("default", ["ts","tslint"]);
};