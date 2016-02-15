module.exports = function(grunt){
	grunt.initConfig({
		ngtemplates: {
			'gearUi': {
				cwd: 'dev/gear-template',
				src: '*.html',
				dest: 'dev/gear-templates.js',
				options: {
					htmlmin: {
						collapseBooleanAttributes:      true,
						collapseWhitespace:             true,
						removeAttributeQuotes:          true,
						removeComments:                 true,
						removeEmptyAttributes:          true,
						removeRedundantAttributes:      true,
						removeScriptTypeAttributes:     true,
						removeStyleLinkTypeAttributes:  true
					},
					prefix: 'gear-templates'
				},
			}
		},
		uglify: {
			gear: {
				options: {
					// beautify: true,
					mangle: false // Troca o nome das variáveis se for true
				},
				files: {
					'dev/gear.min.js': ['dev/gear-ui.js', 'dev/gear-templates.js', 'dev/gear.js']
				}
			}
		},
		cssmin: {
			gear: {
				files: {
					'dist/gear.min.css': ['dev/gear.css']
				}
			}
		},
		copy: {
			main: {
				files:
					[
						{
							expand: true,
							cwd: 'dev',
							src: '*.js',
							dest: 'dist/'
						},
						{
							expand: true,
							cwd: 'dev',
							src: '*.css',
							dest: 'dist/'
						}
					]
			}
		},
	})
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('default', ['ngtemplates', 'uglify', 'cssmin', 'copy']);
}