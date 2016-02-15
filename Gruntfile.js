module.exports = function(grunt){
	grunt.initConfig({
		ngtemplates: {
			'gearUi': {
				cwd: 'dev/template',
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
					url: function(url) { return url.replace('.html', ''); },
					prefix: 'gear-templates'
				},
			}
		},
		uglify: {
			gear: {
				options: {
					// beautify: true,
					mangle: true
				},
				files: {
					'dist/gear.min.js': ['dev/gear-ui.js', 'dev/gear-templates.js', 'dev/gear.js']
				}
			}
		},
		cssmin: {
			gear: {
				files: {
					'dist/gear.min.css': ['dev/gear.css']
				}
			}
		}
	})
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', ['ngtemplates', 'uglify', 'cssmin']);
}