module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-compass'

  grunt.initConfig
    pkg : grunt.file.readJSON 'package.json'

    coffee :
      options :
        join : true
        bare : false
      compile :
        files :
          'jquery_conf.js' : [
            'src/scripts/app.coffee'
            'src/scripts/module.coffee'
            'src/scripts/*.coffee'
          ]

      glob_to_multiple :
        expand : true
        flatten : true
        src : ['src/**/*.coffee']
        dest : 'lib/'
        ext : '.js'

    compass :
      dist :
        options :
          sassDir : 'src/stylesheets'
          cssDir : ''
          environment : 'production'

    watch :
      scripts :
        options :
          interrupt : true
        files : ['**/*.coffee']
        tasks : ['coffee']

      stylesheets :
        options :
          interrupt : true
        files : ['src/stylesheets/*.scss']
        tasks : ['compass']

  # Tasks
  grunt.registerTask 'default', ['coffee', 'compass', 'watch']
  grunt.registerTask 'compile', ['coffee', 'compass']